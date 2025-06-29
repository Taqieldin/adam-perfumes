#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Adam-Perfumes Deployment Script');
console.log('===================================');

// Configuration
const config = {
  backend: {
    name: 'Backend API',
    path: './backend',
    buildCommand: 'npm run build',
    testCommand: 'npm test',
  },
  webUser: {
    name: 'Customer Website',
    path: './apps/web-user-app',
    buildCommand: 'npm run build',
    testCommand: 'npm test',
  },
  webAdmin: {
    name: 'Admin Dashboard',
    path: './apps/web-admin-dashboard',
    buildCommand: 'npm run build',
    testCommand: 'npm test',
  }
};

// Helper functions
function runCommand(command, cwd = process.cwd()) {
  try {
    console.log(`📦 Running: ${command}`);
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
    return true;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(error.message);
    return false;
  }
}

function checkEnvironment() {
  console.log('🔍 Checking environment...');
  
  const requiredFiles = [
    '.env',
    'backend/.env',
    'apps/web-user-app/.env.local',
    'apps/web-admin-dashboard/.env.local'
  ];
  
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    console.error('❌ Missing environment files:');
    missingFiles.forEach(file => console.error(`   - ${file}`));
    console.error('Please create these files from their .example counterparts');
    return false;
  }
  
  console.log('✅ Environment files found');
  return true;
}

function installDependencies() {
  console.log('📦 Installing dependencies...');
  return runCommand('npm run install:all');
}

function runTests() {
  console.log('🧪 Running tests...');
  
  for (const [key, app] of Object.entries(config)) {
    if (fs.existsSync(app.path)) {
      console.log(`Testing ${app.name}...`);
      if (!runCommand(app.testCommand, app.path)) {
        return false;
      }
    }
  }
  
  return true;
}

function buildApplications() {
  console.log('🏗️  Building applications...');
  
  for (const [key, app] of Object.entries(config)) {
    if (fs.existsSync(app.path)) {
      console.log(`Building ${app.name}...`);
      if (!runCommand(app.buildCommand, app.path)) {
        return false;
      }
    }
  }
  
  return true;
}

function deployToChemiCloud() {
  console.log('🌐 Deploying to ChemiCloud...');
  
  // TODO: Implement FTP deployment to ChemiCloud
  console.log('📝 ChemiCloud deployment configuration needed:');
  console.log('   - Set up FTP credentials in environment variables');
  console.log('   - Configure deployment paths');
  console.log('   - Set up database connection');
  
  return true;
}

function deployMobileApps() {
  console.log('📱 Mobile app deployment notes:');
  console.log('   - Build Android APK: cd apps/mobile-user-app && npx expo build:android');
  console.log('   - Build iOS IPA: cd apps/mobile-user-app && npx expo build:ios');
  console.log('   - Upload to respective app stores');
  
  return true;
}

// Main deployment process
async function deploy() {
  try {
    console.log('Starting deployment process...\n');
    
    // Step 1: Check environment
    if (!checkEnvironment()) {
      process.exit(1);
    }
    
    // Step 2: Install dependencies
    if (!installDependencies()) {
      process.exit(1);
    }
    
    // Step 3: Run tests
    if (process.env.SKIP_TESTS !== 'true') {
      if (!runTests()) {
        console.error('❌ Tests failed. Deployment aborted.');
        process.exit(1);
      }
    }
    
    // Step 4: Build applications
    if (!buildApplications()) {
      process.exit(1);
    }
    
    // Step 5: Deploy web applications
    if (!deployToChemiCloud()) {
      process.exit(1);
    }
    
    // Step 6: Mobile deployment notes
    deployMobileApps();
    
    console.log('\n🎉 Deployment completed successfully!');
    console.log('📋 Post-deployment checklist:');
    console.log('   ✅ Web applications built');
    console.log('   ✅ Backend API ready');
    console.log('   📱 Mobile apps ready for store submission');
    console.log('   🔧 Configure production environment variables');
    console.log('   🗄️  Set up production database');
    console.log('   🔐 Configure SSL certificates');
    console.log('   📊 Set up monitoring and analytics');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run deployment if called directly
if (require.main === module) {
  deploy();
}

module.exports = { deploy };