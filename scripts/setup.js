#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Adam-Perfumes Project Setup');
console.log('===============================');

// Helper functions
function runCommand(command, cwd = process.cwd()) {
  try {
    console.log(`📦 Running: ${command}`);
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      env: process.env
    });
    return true;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(error.message);
    return false;
  }
}

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

function copyEnvFile(source, destination) {
  if (fs.existsSync(source) && !fs.existsSync(destination)) {
    fs.copyFileSync(source, destination);
    console.log(`📄 Created: ${destination}`);
  }
}

function setupEnvironmentFiles() {
  console.log('🔧 Setting up environment files...');
  
  const envFiles = [
    { source: '.env.example', dest: '.env' },
    { source: 'backend/.env.example', dest: 'backend/.env' },
    { source: 'apps/web-user-app/.env.example', dest: 'apps/web-user-app/.env.local' },
    { source: 'apps/web-admin-dashboard/.env.example', dest: 'apps/web-admin-dashboard/.env.local' }
  ];
  
  envFiles.forEach(({ source, dest }) => {
    copyEnvFile(source, dest);
  });
}

function setupDirectories() {
  console.log('📁 Creating project directories...');
  
  const directories = [
    // Backend directories
    'backend/logs',
    'backend/uploads',
    'backend/temp',
    
    // Web user app directories
    'apps/web-user-app/public/images',
    'apps/web-user-app/public/icons',
    'apps/web-user-app/src/components',
    'apps/web-user-app/src/pages',
    'apps/web-user-app/src/styles',
    'apps/web-user-app/src/utils',
    'apps/web-user-app/src/hooks',
    'apps/web-user-app/src/store',
    'apps/web-user-app/src/services',
    'apps/web-user-app/src/i18n/locales/en',
    'apps/web-user-app/src/i18n/locales/ar',
    
    // Web admin dashboard directories
    'apps/web-admin-dashboard/public/images',
    'apps/web-admin-dashboard/src/components',
    'apps/web-admin-dashboard/src/pages',
    'apps/web-admin-dashboard/src/styles',
    'apps/web-admin-dashboard/src/utils',
    'apps/web-admin-dashboard/src/hooks',
    'apps/web-admin-dashboard/src/store',
    'apps/web-admin-dashboard/src/services',
    
    // Mobile app directories
    'apps/mobile-user-app/src/components',
    'apps/mobile-user-app/src/screens',
    'apps/mobile-user-app/src/navigation',
    'apps/mobile-user-app/src/services',
    'apps/mobile-user-app/src/store',
    'apps/mobile-user-app/src/utils',
    'apps/mobile-user-app/src/hooks',
    'apps/mobile-user-app/src/localization/en',
    'apps/mobile-user-app/src/localization/ar',
    'apps/mobile-user-app/assets/images',
    'apps/mobile-user-app/assets/fonts',
    
    'apps/mobile-admin-app/src/components',
    'apps/mobile-admin-app/src/screens',
    'apps/mobile-admin-app/src/navigation',
    'apps/mobile-admin-app/src/services',
    'apps/mobile-admin-app/src/store',
    'apps/mobile-admin-app/src/utils',
    'apps/mobile-admin-app/src/hooks',
    'apps/mobile-admin-app/assets/images',
    'apps/mobile-admin-app/assets/fonts',
    
    // Database directories
    'database/migrations',
    'database/seeders',
    'database/backups',
    
    // Documentation
    'docs/api',
    'docs/deployment',
    'docs/development',
    'docs/user-guides'
  ];
  
  directories.forEach(createDirectory);
}

function installDependencies() {
  console.log('📦 Installing dependencies...');
  
  // Install root dependencies
  if (!runCommand('npm install')) {
    return false;
  }
  
  // Install backend dependencies
  if (fs.existsSync('backend/package.json')) {
    if (!runCommand('npm install', 'backend')) {
      return false;
    }
  }
  
  // Install web user app dependencies
  if (fs.existsSync('apps/web-user-app/package.json')) {
    if (!runCommand('npm install', 'apps/web-user-app')) {
      return false;
    }
  }
  
  // Install web admin dashboard dependencies
  if (fs.existsSync('apps/web-admin-dashboard/package.json')) {
    if (!runCommand('npm install', 'apps/web-admin-dashboard')) {
      return false;
    }
  }
  
  return true;
}

function setupGitHooks() {
  console.log('🔗 Setting up Git hooks...');
  
  const preCommitHook = `#!/bin/sh
# Pre-commit hook for Adam-Perfumes project

echo "🔍 Running pre-commit checks..."

# Run linting
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed. Please fix the issues before committing."
  exit 1
fi

# Run tests
npm run test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Please fix the issues before committing."
  exit 1
fi

echo "✅ Pre-commit checks passed!"
`;

  const hooksDir = '.git/hooks';
  if (fs.existsSync('.git')) {
    createDirectory(hooksDir);
    fs.writeFileSync(path.join(hooksDir, 'pre-commit'), preCommitHook);
    
    // Make hook executable (Unix systems)
    try {
      execSync('chmod +x .git/hooks/pre-commit');
    } catch (error) {
      // Ignore on Windows
    }
  }
}

function createInitialFiles() {
  console.log('📄 Creating initial project files...');
  
  // Create .gitignore if it doesn't exist
  if (!fs.existsSync('.gitignore')) {
    const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
.next/
out/

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Mobile
*.apk
*.ipa
*.app

# Firebase
.firebase/
firebase-debug.log

# Temporary files
temp/
tmp/
uploads/

# Database
*.sqlite
*.db

# Backup files
*.backup
*.bak
`;
    
    fs.writeFileSync('.gitignore', gitignoreContent);
    console.log('📄 Created .gitignore');
  }
}

function displaySetupInstructions() {
  console.log('\n🎉 Project setup completed successfully!');
  console.log('\n📋 Next Steps:');
  console.log('==============');
  console.log('1. 🔧 Configure environment variables:');
  console.log('   - Edit .env files with your actual values');
  console.log('   - Set up Firebase project and add credentials');
  console.log('   - Configure payment gateway keys');
  console.log('   - Set up database connection');
  console.log('');
  console.log('2. 🗄️  Set up database:');
  console.log('   - Create MySQL database on ChemiCloud');
  console.log('   - Run migrations: cd backend && npm run migrate');
  console.log('   - Seed initial data: cd backend && npm run seed');
  console.log('');
  console.log('3. 🚀 Start development servers:');
  console.log('   - Backend API: npm run dev:backend');
  console.log('   - Customer website: npm run dev:web-user');
  console.log('   - Admin dashboard: npm run dev:web-admin');
  console.log('');
  console.log('4. 📱 Mobile development:');
  console.log('   - Install Expo CLI: npm install -g @expo/cli');
  console.log('   - Start customer app: cd apps/mobile-user-app && npx expo start');
  console.log('   - Start admin app: cd apps/mobile-admin-app && npx expo start');
  console.log('');
  console.log('5. 🔗 Third-party integrations:');
  console.log('   - Set up WhatsApp Business API');
  console.log('   - Configure OpenAI ChatGPT');
  console.log('   - Set up payment gateways (Tap Payments, Stripe)');
  console.log('   - Configure email and SMS services');
  console.log('');
  console.log('📚 Documentation:');
  console.log('   - API docs: http://localhost:3001/api');
  console.log('   - Project README: ./README.md');
  console.log('   - Deployment guide: ./docs/deployment.md');
  console.log('');
  console.log('🆘 Need help? Check the documentation or contact the development team.');
}

// Main setup process
async function setup() {
  try {
    console.log('Starting project setup...\n');
    
    // Step 1: Create directories
    setupDirectories();
    
    // Step 2: Create initial files
    createInitialFiles();
    
    // Step 3: Setup environment files
    setupEnvironmentFiles();
    
    // Step 4: Install dependencies
    if (!installDependencies()) {
      console.error('❌ Failed to install dependencies');
      process.exit(1);
    }
    
    // Step 5: Setup Git hooks
    setupGitHooks();
    
    // Step 6: Display instructions
    displaySetupInstructions();
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setup();
}

module.exports = { setup };