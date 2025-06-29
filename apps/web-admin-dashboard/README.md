# Adam Perfumes - Web Admin Dashboard

A modern, responsive admin dashboard for managing the Adam Perfumes e-commerce platform built with React, TypeScript, and Vite.

## Features

### 🏠 Dashboard Overview
- Real-time analytics and KPIs
- Sales charts and trends
- Recent orders and activities
- Quick action shortcuts
- Performance metrics

### 📦 Product Management
- Product catalog management
- Category organization
- Inventory tracking
- Bulk operations
- Image management
- SEO optimization

### 🛒 Order Management
- Order processing workflow
- Status tracking
- Customer communication
- Shipping management
- Returns and refunds

### 👥 Customer Management
- Customer profiles
- Order history
- Loyalty program management
- Customer segmentation
- Communication tools

### 📊 Analytics & Reports
- Sales analytics
- Customer insights
- Product performance
- Revenue tracking
- Custom reports
- Data export

### �� Multi-Branch Support
- Branch management
- Inventory distribution
- Staff assignments
- Performance comparison
- Location-based analytics

### 👨‍💼 Staff Management
- User roles and permissions
- Staff profiles
- Activity tracking
- Performance monitoring
- Access control

### 🎯 Marketing Tools
- Coupon management
- Promotional campaigns
- Email marketing
- Social media integration
- Customer reviews

### ⚙️ System Settings
- Store configuration
- Payment settings
- Shipping options
- Tax configuration
- Notification preferences

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 4
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Forms**: React Hook Form + Yup
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Authentication**: Firebase Auth
- **Testing**: Vitest + Testing Library

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Common components
│   ├── dashboard/      # Dashboard-specific components
│   ├── layout/         # Layout components
│   └── ui/             # Generic UI components
├── hooks/              # Custom React hooks
├── layouts/            # Page layouts
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   ├── products/       # Product management
│   ├── orders/         # Order management
│   ├── customers/      # Customer management
│   ├── analytics/      # Analytics dashboard
│   ├── settings/       # System settings
│   └── ...
├── services/           # API services
├── store/              # Redux store and slices
├── themes/             # Theme configuration
├── utils/              # Utility functions
└── types/              # TypeScript type definitions
```

## Key Features Implemented

### Authentication & Authorization
- ✅ Firebase Authentication integration
- ✅ Role-based access control
- ✅ Protected routes
- ✅ Permission-based UI rendering
- ✅ Session management

### Dashboard
- ✅ Real-time statistics cards
- ✅ Interactive sales charts
- ✅ Recent orders table
- ✅ Top products list
- ✅ Quick actions panel
- ✅ Activity feed

### UI/UX
- ✅ Responsive design (mobile-first)
- ✅ Dark/light theme support
- ✅ Multi-language support (EN/AR)
- ✅ Collapsible sidebar
- ✅ Loading states
- ✅ Error boundaries
- ✅ Toast notifications

### State Management
- ✅ Redux Toolkit setup
- ✅ Persistent state
- ✅ Async thunks for API calls
- ✅ Optimistic updates
- ✅ Error handling

### Development Experience
- ✅ TypeScript configuration
- ��� ESLint + Prettier
- ✅ Hot module replacement
- ✅ Development tools
- ✅ Bundle analysis

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Firebase project setup

### Installation

1. Install dependencies:
```bash
cd apps/web-admin-dashboard
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Configure environment variables in `.env.local`:
```env
VITE_API_URL=http://localhost:3001/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3002](http://localhost:3002)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript check
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run format` - Format code with Prettier
- `npm run analyze` - Analyze bundle size

## Environment Variables

### Required
- `VITE_API_URL` - Backend API URL
- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID

### Optional
- `VITE_APP_NAME` - Application name
- `VITE_APP_URL` - Application URL
- `VITE_FIREBASE_VAPID_KEY` - Firebase VAPID key for push notifications

## User Roles & Permissions

### Super Admin
- Full system access
- User management
- System configuration
- All reports and analytics

### Admin
- Product management
- Order management
- Customer management
- Branch-specific analytics

### Branch Manager
- Branch-specific operations
- Local inventory management
- Staff management
- Branch reports

### Staff
- Order processing
- Customer support
- Basic inventory updates
- Limited reports

## API Integration

The dashboard integrates with the backend API for:

- **Authentication**: Firebase Auth + custom user data
- **Products**: CRUD operations, categories, inventory
- **Orders**: Order management, status updates, tracking
- **Customers**: Customer data, profiles, history
- **Analytics**: Real-time statistics, reports
- **Settings**: System configuration, preferences

## Security Features

- 🔒 Firebase Authentication
- 🛡️ Role-based access control
- 🔐 Protected API routes
- 🚫 Input validation and sanitization
- 📝 Audit logging
- 🔄 Automatic token refresh
- 🚨 Security headers

## Performance Optimizations

- ⚡ Vite for fast builds
- 📦 Code splitting
- 🗜️ Bundle optimization
- 🖼️ Image optimization
- 💾 Efficient state management
- 🔄 Lazy loading
- 📊 Virtual scrolling for large lists

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel --prod
```

### Deploy to Netlify
```bash
netlify deploy --prod --dir=dist
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3002
CMD ["npm", "run", "preview"]
```

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation
4. Submit pull requests

## Troubleshooting

### Common Issues

1. **Build Errors**: Check Node.js version (18+)
2. **Firebase Errors**: Verify environment variables
3. **API Errors**: Check backend connection
4. **Permission Errors**: Verify user roles

### Debug Mode
```bash
VITE_DEBUG=true npm run dev
```

## Future Enhancements

- [ ] Advanced analytics dashboard
- [ ] Real-time notifications
- [ ] Bulk import/export tools
- [ ] Advanced reporting
- [ ] Mobile app integration
- [ ] AI-powered insights
- [ ] Advanced search and filtering
- [ ] Workflow automation
- [ ] Integration marketplace

## License

Private - Adam Perfumes Internal Use Only

## Support

For technical support, contact the development team or create an issue in the project repository.