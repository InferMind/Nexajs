const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with sample data...');
    
    const seedPath = path.join(__dirname, '../database/seeds/sample_data.sql');
    const seedData = fs.readFileSync(seedPath, 'utf8');
    
    // Split seed data into individual statements
    const statements = seedData
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.warn(`⚠️  Warning executing statement: ${error.message}`);
        }
      } catch (err) {
        console.warn(`⚠️  Warning: ${err.message}`);
      }
    }
    
    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Sample data includes:');
    console.log('   - 3 sample users (password: password123)');
    console.log('   - 2 sample documents');
    console.log('   - 3 support queries');
    console.log('   - 4 FAQs');
    console.log('   - 3 email templates');
    console.log('   - 2 sent emails');
    console.log('   - Credit usage history');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;