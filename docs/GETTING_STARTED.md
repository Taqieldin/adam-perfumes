# Getting Started with Adam-Perfumes E-Commerce Ecosystem

Welcome to the Adam-Perfumes project! This guide will help you set up and run the complete e-commerce ecosystem locally.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)

### For Mobile Development
- **Android Studio** - [Download](https://developer.android.com/studio)
- **Xcode** (macOS only) - Available on Mac App Store
- **Expo CLI** - Will be installed via npm

### Accounts & Services
- **Firebase Account** - [Create Account](https://firebase.google.com/)
- **ChemiCloud Hosting** - [Sign Up](https://chemicloud.com/)
- **Tap Payments Account** (Oman) - [Sign Up](https://www.tap.company/)
- **OpenAI Account** (for ChatGPT) - [Sign Up](https://openai.com/)
- **WhatsApp Business API** - [Apply](https://business.whatsapp.com/)

## 🚀 Quick Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd adam-perfumes
```

### 2. Run Setup Script
```bash
node scripts/setup.js
```

This script will:
- Create necessary directories
- Copy environment file templates
- Install all dependencies
- Set up Git hooks

### 3. Configure Environment Variables

#### Root Environment (`.env`)
```bash
cp .env.example .env
```
Edit `.env` with your configuration values.

#### Backend Environment (`backend/.env`)
```bash
cp backend/.env.example backend/.env
```

#### Web Apps Environment
```bash
cp apps/web-user-app/.env.example apps/web-user-app/.env.local
cp apps/web-admin-dashboard/.env.example apps/web-admin-dashboard/.env.local
```

### 4. Set Up Firebase

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable the following services:
   - Authentication (Email/Password, Google, Facebook, Apple)
   - Firestore Database
   - Storage
   - Cloud Messaging
   - Analytics

3. Download configuration files:
   - `google-services.json` for Android
   - `GoogleService-Info.plist` for iOS
   - Web config for environment variables

4. Place the files in the appropriate directories:
   ```
   apps/mobile-user-app/google-services.json
   apps/mobile-user-app/GoogleService-Info.plist
   apps/mobile-admin-app/google-services.json
   apps/mobile-admin-app/GoogleService-Info.plist
   ```

### 5. Set Up Database

1. Create MySQL database:
```sql
CREATE DATABASE adam_perfumes;
CREATE USER 'adam_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON adam_perfumes.* TO 'adam_user'@'localhost';
FLUSH PRIVILEGES;
```

2. Run migrations:
```bash
cd database
npm run migrate
```

3. Seed initial data:
```bash
npm run seed
```

## 🏃‍♂️ Running the Applications

### Backend API Server
```bash
npm run dev:backend
```
- Runs on: http://localhost:3001
- API Documentation: http://localhost:3001/api
- Health Check: http://localhost:3001/health

### Customer Website (Next.js)
```bash
npm run dev:web-user
```
- Runs on: http://localhost:3000
- Supports Arabic/English languages
- Hot reload enabled

### Admin Dashboard (React + Vite)
```bash
npm run dev:web-admin
```
- Runs on: http://localhost:3002
- Admin interface for store management
- Real-time updates via Socket.IO

### Mobile Apps (React Native + Expo)

#### Customer Mobile App
```bash
cd apps/mobile-user-app
npx expo start
```

#### Admin Mobile App
```bash
cd apps/mobile-admin-app
npx expo start
```

Use the Expo Go app on your phone to scan the QR code and run the apps.

## 🔧 Development Workflow

### Code Structure
```
adam-perfumes/
├── apps/                    # Frontend applications
│   ├── mobile-user-app/     # Customer mobile app
│   ├── mobile-admin-app/    # Admin mobile app
│   ├── web-user-app/        # Customer website
│   └── web-admin-dashboard/ # Admin dashboard
├── backend/                 # Node.js API server
├── database/               # Database migrations & seeds
├── integrations/           # Third-party services
└── scripts/               # Utility scripts
```

### Available Scripts

#### Root Level
- `npm run install:all` - Install all dependencies
- `npm run dev:backend` - Start backend server
- `npm run dev:web-user` - Start customer website
- `npm run dev:web-admin` - Start admin dashboard
- `npm run build:all` - Build all applications
- `npm run test` - Run all tests
- `npm run lint` - Lint all code
- `npm run deploy` - Deploy to production

#### Individual Apps
Each app has its own package.json with specific scripts:
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run test` - Run tests
- `npm run lint` - Lint code

### Git Workflow
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "Add your feature"`
3. Push branch: `git push origin feature/your-feature`
4. Create pull request

Pre-commit hooks will automatically:
- Run linting
- Run tests
- Format code

## 🌐 Third-Party Integrations

### Payment Gateways

#### Tap Payments (Primary for Oman)
1. Sign up at [Tap Payments](https://www.tap.company/)
2. Get API keys from dashboard
3. Add to environment variables:
```env
TAP_SECRET_KEY=sk_test_your_key
TAP_PUBLIC_KEY=pk_test_your_key
```

#### Stripe (Backup)
1. Sign up at [Stripe](https://stripe.com/)
2. Get API keys
3. Add to environment variables

### WhatsApp Business API
1. Apply for WhatsApp Business API
2. Get access token and phone number ID
3. Configure webhook for notifications

### OpenAI ChatGPT
1. Create account at [OpenAI](https://openai.com/)
2. Generate API key
3. Add to environment variables:
```env
OPENAI_API_KEY=sk-your_key
```

## 📱 Mobile Development

### Android Setup
1. Install Android Studio
2. Set up Android SDK
3. Create virtual device or connect physical device
4. Run: `npx expo run:android`

### iOS Setup (macOS only)
1. Install Xcode
2. Install iOS Simulator
3. Run: `npx expo run:ios`

### Building for Production
```bash
# Android
npx expo build:android

# iOS
npx expo build:ios
```

## 🚀 Deployment

### Web Applications (ChemiCloud)
1. Build applications:
```bash
npm run build:web-user
npm run build:web-admin
```

2. Upload to ChemiCloud via FTP or cPanel File Manager

### Backend API
1. Upload backend files to server
2. Install dependencies: `npm install --production`
3. Set up environment variables
4. Start with PM2: `pm2 start src/server.js`

### Mobile Apps
1. Build production versions
2. Submit to app stores:
   - Google Play Store (Android)
   - Apple App Store (iOS)

## 🔍 Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## 📊 Monitoring & Analytics

### Application Monitoring
- Backend logs: `backend/logs/`
- Error tracking: Integrated with Winston logger
- Performance monitoring: Built-in metrics

### Business Analytics
- Firebase Analytics for mobile apps
- Google Analytics for web apps
- Custom analytics dashboard in admin panel

## 🆘 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3001
npx kill-port 3001
```

#### Database Connection Issues
1. Check MySQL is running
2. Verify credentials in `.env`
3. Ensure database exists

#### Firebase Configuration
1. Verify all config files are in place
2. Check Firebase project settings
3. Ensure all services are enabled

#### Mobile App Issues
1. Clear Expo cache: `npx expo start -c`
2. Reset Metro bundler: `npx expo start --reset-cache`
3. Check device/simulator connectivity

### Getting Help
- Check documentation in `docs/` folder
- Review error logs
- Contact development team
- Create GitHub issue

## 📚 Additional Resources

- [API Documentation](./api/README.md)
- [Database Schema](./database/README.md)
- [Deployment Guide](./deployment/README.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Code Style Guide](./development/STYLE_GUIDE.md)

## 🎯 Next Steps

After setup, you should:
1. ✅ Verify all services are running
2. ✅ Test API endpoints
3. ✅ Configure payment gateways
4. ✅ Set up production environment
5. ✅ Deploy to staging for testing
6. ✅ Submit mobile apps for review
7. ✅ Go live! 🚀

---

**Happy coding! 🎉**

For any questions or issues, please refer to the documentation or contact the development team.