#!/usr/bin/env node

const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const config = require('../config/database.js');
const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment];

console.log(`🌱 Running seeds for ${environment} environment...`);

async function runSeeds() {
  const sequelize = new Sequelize(dbConfig);

  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Create seeds tracking table if it doesn't exist
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS SequelizeSeeds (
        name VARCHAR(255) NOT NULL PRIMARY KEY,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Get list of seed files
    const seedsDir = path.join(__dirname, '../seed');
    const seedFiles = fs.readdirSync(seedsDir)
      .filter(file => file.endsWith('.js'))
      .sort();

    // Get already executed seeds
    const [executedSeeds] = await sequelize.query(
      'SELECT name FROM SequelizeSeeds ORDER BY name'
    );
    const executedNames = executedSeeds.map(s => s.name);

    console.log(`📁 Found ${seedFiles.length} seed files`);
    console.log(`✅ ${executedNames.length} seeds already executed`);

    // Check if we should force re-run seeds
    const forceRun = process.argv.includes('--force');
    if (forceRun) {
      console.log('🔄 Force mode enabled - will re-run all seeds');
    }

    // Run pending seeds
    let executedCount = 0;
    for (const file of seedFiles) {
      if (!executedNames.includes(file) || forceRun) {
        console.log(`⏳ Running seed: ${file}`);
        
        try {
          const seed = require(path.join(seedsDir, file));
          
          // If force mode, run down first to clean up
          if (forceRun && executedNames.includes(file)) {
            console.log(`🧹 Cleaning up existing seed data: ${file}`);
            if (seed.down) {
              await seed.down(sequelize.getQueryInterface(), Sequelize);
            }
          }
          
          await seed.up(sequelize.getQueryInterface(), Sequelize);
          
          // Record seed as executed
          await sequelize.query(
            'INSERT INTO SequelizeSeeds (name) VALUES (?) ON DUPLICATE KEY UPDATE executed_at = CURRENT_TIMESTAMP',
            { replacements: [file] }
          );
          
          console.log(`✅ Seed completed: ${file}`);
          executedCount++;
        } catch (error) {
          console.error(`❌ Seed failed: ${file}`);
          console.error(error.message);
          
          // Continue with other seeds unless it's a critical error
          if (error.message.includes('CRITICAL')) {
            throw error;
          }
        }
      }
    }

    if (executedCount === 0 && !forceRun) {
      console.log('✨ All seeds are up to date!');
    } else {
      console.log(`🎉 Successfully executed ${executedCount} seeds!`);
    }

    // Show summary
    console.log('\n📊 Database Summary:');
    
    // Count records in main tables
    const tables = ['users', 'categories', 'branches', 'products'];
    for (const table of tables) {
      try {
        const [result] = await sequelize.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`   ${table}: ${result[0].count} records`);
      } catch (error) {
        console.log(`   ${table}: table not found`);
      }
    }

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Adam Perfumes Database Seeding Tool

Usage: node seed.js [options]

Options:
  --help, -h     Show this help message
  --force        Force re-run all seeds (will clean existing data)
  --specific     Run specific seed file (e.g., --specific 001-seed-categories.js)

Environment Variables:
  NODE_ENV       Set environment (development, test, production)
  DB_HOST        Database host
  DB_PORT        Database port
  DB_NAME        Database name
  DB_USER        Database username
  DB_PASSWORD    Database password

Examples:
  node seed.js                           # Run pending seeds
  node seed.js --force                   # Re-run all seeds
  NODE_ENV=development node seed.js      # Run in development
  
⚠️  Warning: --force will delete existing seed data!
  `);
  process.exit(0);
}

// Handle specific seed file
const specificIndex = args.indexOf('--specific');
if (specificIndex !== -1 && args[specificIndex + 1]) {
  const specificFile = args[specificIndex + 1];
  console.log(`🎯 Running specific seed: ${specificFile}`);
  // Implement specific seed logic here
}

// Run seeds
runSeeds().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});