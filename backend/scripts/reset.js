const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function resetDatabase() {
  try {
    console.log('🔄 Resetting database...');
    
    // List of tables to drop in correct order (respecting foreign key constraints)
    const tables = [
      'audit_logs',
      'user_sessions',
      'api_keys',
      'credit_usage',
      'sent_emails',
      'email_templates',
      'faqs',
      'support_queries',
      'documents',
      'users'
    ];
    
    // Drop tables
    for (const table of tables) {
      try {
        const { error } = await supabase.rpc('exec_sql', { 
          sql: `DROP TABLE IF EXISTS ${table} CASCADE;` 
        });
        if (error) {
          console.warn(`⚠️  Warning dropping table ${table}: ${error.message}`);
        } else {
          console.log(`🗑️  Dropped table: ${table}`);
        }
      } catch (err) {
        console.warn(`⚠️  Warning dropping table ${table}: ${err.message}`);
      }
    }
    
    // Drop functions
    try {
      const { error } = await supabase.rpc('exec_sql', { 
        sql: `DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;` 
      });
      if (error) {
        console.warn(`⚠️  Warning dropping function: ${error.message}`);
      } else {
        console.log(`🗑️  Dropped function: update_updated_at_column`);
      }
    } catch (err) {
      console.warn(`⚠️  Warning dropping function: ${err.message}`);
    }
    
    console.log('✅ Database reset completed successfully!');
    console.log('💡 Run "npm run db:migrate" to recreate the schema');
    console.log('💡 Run "npm run db:seed" to add sample data');
  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  resetDatabase();
}

module.exports = resetDatabase;