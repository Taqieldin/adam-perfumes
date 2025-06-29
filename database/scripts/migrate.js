#!/usr/bin/env node

const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const config = require('../config/database.js');
const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment];

console.log(`🚀 Running migrations for ${environment} environment...`);

async function runMigrations() {
  const sequelize = new Sequelize(dbConfig);

  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Create migrations table if it doesn't exist
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS SequelizeMeta (
        name VARCHAR(255) NOT NULL PRIMARY KEY
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Get list of migration files
    const migrationsDir = path.join(__dirname, '../migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js'))
      .sort();

    // Get already executed migrations
    const [executedMigrations] = await sequelize.query(
      'SELECT name FROM SequelizeMeta ORDER BY name'
    );
    const executedNames = executedMigrations.map(m => m.name);

    console.log(`📁 Found ${migrationFiles.length} migration files`);
    console.log(`✅ ${executedNames.length} migrations already executed`);

    // Run pending migrations
    let executedCount = 0;
    for (const file of migrationFiles) {
      if (!executedNames.includes(file)) {
        console.log(`⏳ Running migration: ${file}`);
        
        try {
          const migration = require(path.join(migrationsDir, file));
          await migration.up(sequelize.getQueryInterface(), Sequelize);
          
          // Record migration as executed
          await sequelize.query(
            'INSERT INTO SequelizeMeta (name) VALUES (?)',
            { replacements: [file] }
          );
          
          console.log(`✅ Migration completed: ${file}`);
          executedCount++;
        } catch (error) {
          console.error(`❌ Migration failed: ${file}`);
          console.error(error.message);
          throw error;
        }
      }
    }

    if (executedCount === 0) {
      console.log('✨ All migrations are up to date!');
    } else {
      console.log(`🎉 Successfully executed ${executedCount} migrations!`);
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Adam Perfumes Database Migration Tool

Usage: node migrate.js [options]

Options:
  --help, -h     Show this help message
  --dry-run      Show what migrations would be executed without running them
  --force        Force run all migrations (use with caution)

Environment Variables:
  NODE_ENV       Set environment (development, test, production)
  DB_HOST        Database host
  DB_PORT        Database port
  DB_NAME        Database name
  DB_USER        Database username
  DB_PASSWORD    Database password

Examples:
  node migrate.js                    # Run pending migrations
  NODE_ENV=production node migrate.js  # Run in production
  `);
  process.exit(0);
}

if (args.includes('--dry-run')) {
  console.log('🔍 Dry run mode - showing pending migrations...');
  // Implement dry run logic here
  process.exit(0);
}

// Run migrations
runMigrations().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});