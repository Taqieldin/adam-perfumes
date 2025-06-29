# Adam-Perfumes E-Commerce Ecosystem

A complete, scalable, and multilingual digital ecosystem for Adam-Perfumes, a leading perfume brand with 21 physical branches across the Sultanate of Oman.

## 🌟 Project Overview

This ecosystem includes:
- **Customer Mobile Apps** (iOS & Android) - React Native
- **Admin Mobile Apps** (iOS & Android) - React Native  
- **Customer Web Platform** - Next.js/React
- **Admin Web Dashboard** - React + Tailwind CSS
- **Backend API** - Node.js + Express + Firebase
- **Database** - MySQL (ChemiCloud) + Firebase Firestore
- **Integrations** - Payment gateways, WhatsApp, AI chat, Push notifications

## 🏗️ Architecture

```
adam-perfumes/
├── apps/                          # Frontend applications
│   ├── mobile-user-app/           # Customer mobile app (React Native)
│   ├── mobile-admin-app/          # Admin mobile app (React Native)
│   ├── web-user-app/              # Customer website (Next.js)
│   └── web-admin-dashboard/       # Admin dashboard (React)
├── backend/                       # Node.js API server
├── database/                      # Database configs & migrations
├── integrations/                  # Third-party services
└── scripts/                       # Deployment & utility scripts
```

## 🚀 Key Features

### Customer Features
- ✅ Bilingual support (Arabic & English)
- ✅ Multiple login options (Social, SMS, Biometric)
- ✅ Online payments (Cards, Wallet, COD)
- ✅ Personal account with purchase history
- ✅ In-app wallet system
- ✅ Loyalty points & rewards
- ✅ Discount coupons & flash sales
- ✅ Real-time order tracking
- ✅ In-app chat support
- ✅ AI-powered chatbot (ChatGPT)
- ✅ Video shopping
- ✅ Instagram integration
- ✅ Gift cards
- ✅ Dark mode support
- ✅ Push notifications & WhatsApp promotions

### Admin Features
- ✅ Product & inventory management
- ✅ Real-time order processing
- ✅ Sales analytics & reports
- ✅ Promotion & coupon management
- ✅ Customer communication tools
- ✅ Multi-branch inventory control
- ✅ Role-based access control
- ✅ Real-time notifications
- ✅ Dark mode support

## 🛠️ Technology Stack

### Frontend
- **Mobile Apps**: React Native, Expo
- **Web Apps**: Next.js, React, Tailwind CSS
- **State Management**: Redux Toolkit / Zustand
- **UI Components**: React Native Elements, Ant Design

### Backend
- **API Server**: Node.js, Express.js
- **Database**: MySQL (ChemiCloud), Firebase Firestore
- **Authentication**: Firebase Auth
- **File Storage**: Firebase Storage
- **Push Notifications**: Firebase Cloud Messaging

### Integrations
- **Payments**: Tap Payments, Stripe
- **Communication**: WhatsApp Business API
- **AI**: OpenAI ChatGPT
- **Analytics**: Firebase Analytics

## 📱 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)
- Firebase account
- ChemiCloud hosting account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd adam-perfumes
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment templates
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp apps/web-user-app/.env.example apps/web-user-app/.env.local
   cp apps/web-admin-dashboard/.env.example apps/web-admin-dashboard/.env.local
   ```

4. **Configure Firebase**
   - Create a Firebase project
   - Add your Firebase config files
   - Enable Authentication, Firestore, Storage, and FCM

5. **Set up database**
   ```bash
   cd database
   npm run migrate
   npm run seed
   ```

### Development

**Start the backend server:**
```bash
npm run dev:backend
```

**Start the web applications:**
```bash
# Customer website
npm run dev:web-user

# Admin dashboard
npm run dev:web-admin
```

**Start mobile development:**
```bash
# Customer app
cd apps/mobile-user-app
npx expo start

# Admin app
cd apps/mobile-admin-app
npx expo start
```

## 🌐 Deployment

### Web Applications (ChemiCloud)
```bash
npm run deploy:web
```

### Mobile Applications
- **Android**: Build APK/AAB and deploy to Google Play Store
- **iOS**: Build IPA and deploy to Apple App Store

### Backend API
Deploy to ChemiCloud shared hosting or VPS

## 📚 Documentation

- [API Documentation](./backend/README.md)
- [Mobile App Development](./apps/mobile-user-app/README.md)
- [Web Development](./apps/web-user-app/README.md)
- [Admin Dashboard](./apps/web-admin-dashboard/README.md)
- [Database Schema](./database/README.md)
- [Deployment Guide](./docs/deployment.md)

## 🔧 Configuration

### Environment Variables
- `FIREBASE_CONFIG` - Firebase configuration
- `DATABASE_URL` - MySQL connection string
- `PAYMENT_GATEWAY_KEYS` - Payment provider keys
- `WHATSAPP_API_KEY` - WhatsApp Business API
- `OPENAI_API_KEY` - ChatGPT integration
- `JWT_SECRET` - Authentication secret

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests
npm run test:backend

# Run web tests
npm run test:web
```

## 📈 Performance & Scalability

- **CDN**: Static assets served via CDN
- **Caching**: Redis for API caching
- **Database**: Optimized queries and indexing
- **Mobile**: Code splitting and lazy loading
- **Web**: SSR/SSG with Next.js

## 🔒 Security

- JWT-based authentication
- API rate limiting
- Input validation and sanitization
- HTTPS enforcement
- Firebase security rules
- Role-based access control

## 🌍 Internationalization

- Arabic (RTL) and English (LTR) support
- Dynamic language switching
- Localized content and formatting
- Currency and date formatting

## 📞 Support

For technical support or questions:
- Email: tech@adam-perfumes.com
- Documentation: [Wiki](./docs/)
- Issues: [GitHub Issues](./issues)

## 📄 License

This project is proprietary software owned by Adam-Perfumes. All rights reserved.

---

**Adam-Perfumes** - Elevating fragrance retail through technology 🌹