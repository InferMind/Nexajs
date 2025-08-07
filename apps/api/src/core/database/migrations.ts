import { PrismaClient } from '@prisma/client'
import { logger } from '@/utils/logger'
import { config } from '@/utils/config'

export interface Migration {
  id: string
  name: string
  description: string
  version: string
  up: (prisma: PrismaClient) => Promise<void>
  down: (prisma: PrismaClient) => Promise<void>
  dependencies?: string[]
}

export class MigrationManager {
  private static instance: MigrationManager
  private migrations: Map<string, Migration> = new Map()
  private prisma: PrismaClient

  private constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  static getInstance(prisma?: PrismaClient): MigrationManager {
    if (!MigrationManager.instance && prisma) {
      MigrationManager.instance = new MigrationManager(prisma)
    }
    return MigrationManager.instance
  }

  registerMigration(migration: Migration): void {
    this.migrations.set(migration.id, migration)
    logger.info(`Registered migration: ${migration.name} (${migration.id})`)
  }

  async getAppliedMigrations(): Promise<string[]> {
    try {
      const applied = await this.prisma.$queryRaw<{ migration_id: string }[]>`
        SELECT migration_id FROM _migrations ORDER BY applied_at
      `
      return applied.map(m => m.migration_id)
    } catch (error) {
      // Table doesn't exist yet, create it
      await this.createMigrationsTable()
      return []
    }
  }

  private async createMigrationsTable(): Promise<void> {
    await this.prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS _migrations (
        migration_id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        version VARCHAR(50) NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        execution_time_ms INTEGER
      )
    `
  }

  async getPendingMigrations(): Promise<Migration[]> {
    const applied = await this.getAppliedMigrations()
    const pending: Migration[] = []

    for (const [id, migration] of this.migrations) {
      if (!applied.includes(id)) {
        pending.push(migration)
      }
    }

    return pending.sort((a, b) => a.version.localeCompare(b.version))
  }

  async migrate(targetVersion?: string): Promise<void> {
    logger.info('Starting database migration...')

    const pending = await this.getPendingMigrations()
    if (pending.length === 0) {
      logger.info('No pending migrations')
      return
    }

    for (const migration of pending) {
      if (targetVersion && migration.version > targetVersion) {
        break
      }

      await this.runMigration(migration)
    }

    logger.info('Database migration completed')
  }

  private async runMigration(migration: Migration): Promise<void> {
    const startTime = Date.now()
    
    try {
      logger.info(`Running migration: ${migration.name} (${migration.id})`)
      
      // Check dependencies
      if (migration.dependencies) {
        const applied = await this.getAppliedMigrations()
        for (const dep of migration.dependencies) {
          if (!applied.includes(dep)) {
            throw new Error(`Migration ${migration.id} depends on ${dep} which hasn't been applied`)
          }
        }
      }

      // Run migration
      await migration.up(this.prisma)

      // Record migration
      await this.prisma.$executeRaw`
        INSERT INTO _migrations (migration_id, name, description, version, execution_time_ms)
        VALUES (${migration.id}, ${migration.name}, ${migration.description}, ${migration.version}, ${Date.now() - startTime})
      `

      logger.info(`Migration ${migration.name} completed successfully`)
    } catch (error) {
      logger.error(`Migration ${migration.name} failed:`, error)
      throw error
    }
  }

  async rollback(steps: number = 1): Promise<void> {
    logger.info(`Rolling back ${steps} migration(s)...`)

    const applied = await this.getAppliedMigrations()
    const toRollback = applied.slice(-steps).reverse()

    for (const migrationId of toRollback) {
      const migration = this.migrations.get(migrationId)
      if (!migration) {
        throw new Error(`Migration ${migrationId} not found`)
      }

      await this.rollbackMigration(migration)
    }

    logger.info('Rollback completed')
  }

  private async rollbackMigration(migration: Migration): Promise<void> {
    try {
      logger.info(`Rolling back migration: ${migration.name} (${migration.id})`)
      
      await migration.down(this.prisma)

      await this.prisma.$executeRaw`
        DELETE FROM _migrations WHERE migration_id = ${migration.id}
      `

      logger.info(`Migration ${migration.name} rolled back successfully`)
    } catch (error) {
      logger.error(`Rollback of ${migration.name} failed:`, error)
      throw error
    }
  }

  async getMigrationStatus(): Promise<any> {
    const applied = await this.getAppliedMigrations()
    const pending = await this.getPendingMigrations()

    return {
      applied: applied.length,
      pending: pending.length,
      total: this.migrations.size,
      appliedMigrations: applied,
      pendingMigrations: pending.map(m => ({
        id: m.id,
        name: m.name,
        version: m.version
      }))
    }
  }

  async reset(): Promise<void> {
    logger.info('Resetting database...')
    
    // Drop all tables
    await this.prisma.$executeRaw`DROP SCHEMA public CASCADE`
    await this.prisma.$executeRaw`CREATE SCHEMA public`
    
    // Recreate migrations table
    await this.createMigrationsTable()
    
    logger.info('Database reset completed')
  }
}

// Migration registry
export const migrations: Migration[] = [
  {
    id: '001_initial_schema',
    name: 'Initial Schema',
    description: 'Create initial database schema with users, companies, and partners',
    version: '1.0.0',
    up: async (prisma) => {
      // This will be handled by Prisma migrations
      await prisma.$executeRaw`SELECT 1`
    },
    down: async (prisma) => {
      await prisma.$executeRaw`DROP TABLE IF EXISTS users, companies, partners CASCADE`
    }
  },
  {
    id: '002_audit_logs',
    name: 'Audit Logs',
    description: 'Create audit logging system',
    version: '1.0.1',
    dependencies: ['001_initial_schema'],
    up: async (prisma) => {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id SERIAL PRIMARY KEY,
          table_name VARCHAR(255) NOT NULL,
          record_id INTEGER NOT NULL,
          action VARCHAR(50) NOT NULL,
          old_values JSONB,
          new_values JSONB,
          user_id INTEGER,
          ip_address INET,
          user_agent TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    },
    down: async (prisma) => {
      await prisma.$executeRaw`DROP TABLE IF EXISTS audit_logs`
    }
  },
  {
    id: '003_system_config',
    name: 'System Configuration',
    description: 'Create system configuration table',
    version: '1.0.2',
    dependencies: ['001_initial_schema'],
    up: async (prisma) => {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS system_configs (
          id SERIAL PRIMARY KEY,
          key VARCHAR(255) UNIQUE NOT NULL,
          value JSONB NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    },
    down: async (prisma) => {
      await prisma.$executeRaw`DROP TABLE IF EXISTS system_configs`
    }
  }
]

// Initialize migrations
export function initializeMigrations(prisma: PrismaClient): MigrationManager {
  const manager = MigrationManager.getInstance(prisma)
  
  for (const migration of migrations) {
    manager.registerMigration(migration)
  }
  
  return manager
} 