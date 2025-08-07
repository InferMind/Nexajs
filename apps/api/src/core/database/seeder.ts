import { PrismaClient } from '@prisma/client'
import { logger } from '@/utils/logger'
import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'

export interface SeedData {
  id: string
  name: string
  description: string
  data: any
  dependencies?: string[]
}

export interface SeederOptions {
  environment?: 'development' | 'test' | 'production'
  clearExisting?: boolean
  seedTestData?: boolean
}

export class DataSeeder {
  private static instance: DataSeeder
  private seeds: Map<string, SeedData> = new Map()
  private prisma: PrismaClient

  private constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  static getInstance(prisma?: PrismaClient): DataSeeder {
    if (!DataSeeder.instance && prisma) {
      DataSeeder.instance = new DataSeeder(prisma)
    }
    return DataSeeder.instance
  }

  registerSeed(seed: SeedData): void {
    this.seeds.set(seed.id, seed)
    logger.info(`Registered seed: ${seed.name} (${seed.id})`)
  }

  async seed(options: SeederOptions = {}): Promise<void> {
    const { environment = 'development', clearExisting = false, seedTestData = false } = options

    logger.info(`Starting data seeding for environment: ${environment}`)

    if (clearExisting) {
      await this.clearAllData()
    }

    const seedsToRun = Array.from(this.seeds.values())
      .filter(seed => {
        if (environment === 'production' && seed.id.includes('test')) {
          return false
        }
        if (!seedTestData && seed.id.includes('test')) {
          return false
        }
        return true
      })
      .sort((a, b) => {
        // Sort by dependencies
        if (a.dependencies?.includes(b.id)) return 1
        if (b.dependencies?.includes(a.id)) return -1
        return a.id.localeCompare(b.id)
      })

    for (const seed of seedsToRun) {
      await this.runSeed(seed)
    }

    logger.info('Data seeding completed')
  }

  private async runSeed(seed: SeedData): Promise<void> {
    try {
      logger.info(`Running seed: ${seed.name} (${seed.id})`)

      // Check dependencies
      if (seed.dependencies) {
        for (const dep of seed.dependencies) {
          const depSeed = this.seeds.get(dep)
          if (!depSeed) {
            throw new Error(`Seed ${seed.id} depends on ${dep} which doesn't exist`)
          }
        }
      }

      // Run seed data
      await this.insertSeedData(seed)

      logger.info(`Seed ${seed.name} completed successfully`)
    } catch (error) {
      logger.error(`Seed ${seed.name} failed:`, error)
      throw error
    }
  }

  private async insertSeedData(seed: SeedData): Promise<void> {
    const { data } = seed

    if (data.users) {
      await this.seedUsers(data.users)
    }

    if (data.companies) {
      await this.seedCompanies(data.companies)
    }

    if (data.partners) {
      await this.seedPartners(data.partners)
    }

    if (data.systemConfigs) {
      await this.seedSystemConfigs(data.systemConfigs)
    }
  }

  private async seedUsers(users: any[]): Promise<void> {
    for (const userData of users) {
      const existing = await this.prisma.user.findUnique({
        where: { email: userData.email }
      })

      if (!existing) {
        const hashedPassword = await bcrypt.hash(userData.password, 10)
        await this.prisma.user.create({
          data: {
            ...userData,
            password: hashedPassword
          }
        })
      }
    }
  }

  private async seedCompanies(companies: any[]): Promise<void> {
    for (const companyData of companies) {
      const existing = await this.prisma.company.findUnique({
        where: { code: companyData.code }
      })

      if (!existing) {
        await this.prisma.company.create({
          data: companyData
        })
      }
    }
  }

  private async seedPartners(partners: any[]): Promise<void> {
    for (const partnerData of partners) {
      const existing = await this.prisma.partner.findUnique({
        where: { code: partnerData.code }
      })

      if (!existing) {
        await this.prisma.partner.create({
          data: partnerData
        })
      }
    }
  }

  private async seedSystemConfigs(configs: any[]): Promise<void> {
    for (const configData of configs) {
      const existing = await this.prisma.systemConfig.findUnique({
        where: { key: configData.key }
      })

      if (!existing) {
        await this.prisma.systemConfig.create({
          data: configData
        })
      }
    }
  }

  private async clearAllData(): Promise<void> {
    logger.info('Clearing all data...')

    // Clear in reverse dependency order
    await this.prisma.auditLog.deleteMany()
    await this.prisma.systemConfig.deleteMany()
    await this.prisma.partner.deleteMany()
    await this.prisma.user.deleteMany()
    await this.prisma.company.deleteMany()

    logger.info('All data cleared')
  }

  async getSeedStatus(): Promise<any> {
    const userCount = await this.prisma.user.count()
    const companyCount = await this.prisma.company.count()
    const partnerCount = await this.prisma.partner.count()
    const configCount = await this.prisma.systemConfig.count()

    return {
      users: userCount,
      companies: companyCount,
      partners: partnerCount,
      systemConfigs: configCount,
      totalSeeds: this.seeds.size
    }
  }
}

// Seed data definitions
export const seedData: SeedData[] = [
  {
    id: '001_system_configs',
    name: 'System Configurations',
    description: 'Initialize system configuration settings',
    data: {
      systemConfigs: [
        {
          key: 'app.name',
          value: 'NexaJS ERP',
          description: 'Application name'
        },
        {
          key: 'app.version',
          value: '1.0.0',
          description: 'Application version'
        },
        {
          key: 'security.password.min_length',
          value: 8,
          description: 'Minimum password length'
        },
        {
          key: 'security.session.timeout',
          value: 3600,
          description: 'Session timeout in seconds'
        },
        {
          key: 'email.smtp.host',
          value: 'localhost',
          description: 'SMTP host for email notifications'
        },
        {
          key: 'email.smtp.port',
          value: 587,
          description: 'SMTP port'
        },
        {
          key: 'file.upload.max_size',
          value: 10485760,
          description: 'Maximum file upload size in bytes'
        },
        {
          key: 'file.upload.allowed_types',
          value: ['image/*', 'application/pdf', 'text/*'],
          description: 'Allowed file types for upload'
        }
      ]
    }
  },
  {
    id: '002_default_company',
    name: 'Default Company',
    description: 'Create default company for the system',
    dependencies: ['001_system_configs'],
    data: {
      companies: [
        {
          name: 'NexaJS Corporation',
          code: 'NEXAJS',
          description: 'Default system company',
          website: 'https://nexajs.com',
          active: true
        }
      ]
    }
  },
  {
    id: '003_admin_user',
    name: 'Admin User',
    description: 'Create default admin user',
    dependencies: ['002_default_company'],
    data: {
      users: [
        {
          email: 'admin@nexajs.com',
          name: 'System Administrator',
          password: 'admin123',
          role: Role.SUPER_ADMIN,
          active: true,
          timezone: 'UTC',
          locale: 'en'
        }
      ]
    }
  },
  {
    id: '004_test_data',
    name: 'Test Data',
    description: 'Create test data for development',
    dependencies: ['003_admin_user'],
    data: {
      users: [
        {
          email: 'manager@nexajs.com',
          name: 'John Manager',
          password: 'manager123',
          role: Role.MANAGER,
          active: true,
          timezone: 'UTC',
          locale: 'en'
        },
        {
          email: 'user@nexajs.com',
          name: 'Jane User',
          password: 'user123',
          role: Role.USER,
          active: true,
          timezone: 'UTC',
          locale: 'en'
        }
      ],
      partners: [
        {
          name: 'Acme Corporation',
          code: 'ACME',
          email: 'contact@acme.com',
          phone: '+1-555-0123',
          address: '123 Business St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          postalCode: '10001',
          website: 'https://acme.com',
          isCustomer: true,
          isSupplier: false,
          active: true
        },
        {
          name: 'Tech Supplies Inc',
          code: 'TECHSUP',
          email: 'sales@techsupplies.com',
          phone: '+1-555-0456',
          address: '456 Tech Ave',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          postalCode: '94102',
          website: 'https://techsupplies.com',
          isCustomer: false,
          isSupplier: true,
          active: true
        },
        {
          name: 'Global Solutions Ltd',
          code: 'GLOBALSOL',
          email: 'info@globalsolutions.com',
          phone: '+44-20-1234-5678',
          address: '789 Innovation Rd',
          city: 'London',
          state: '',
          country: 'UK',
          postalCode: 'SW1A 1AA',
          website: 'https://globalsolutions.com',
          isCustomer: true,
          isSupplier: true,
          active: true
        }
      ]
    }
  }
]

// Initialize seeder
export function initializeSeeder(prisma: PrismaClient): DataSeeder {
  const seeder = DataSeeder.getInstance(prisma)
  
  for (const seed of seedData) {
    seeder.registerSeed(seed)
  }
  
  return seeder
} 