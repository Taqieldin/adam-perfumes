# Adam Perfumes - Web User App

A modern e-commerce web application for Adam Perfumes built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### 🏠 Homepage
- Hero section with image carousel
- Promotion banners with features
- Category showcase
- Featured products section
- Instagram feed integration
- Newsletter subscription

### 🛍️ Products
- Product listing with filters and sorting
- Product cards with wishlist and quick add to cart
- Category-based filtering
- Price range filtering
- Brand, gender, fragrance type filters
- Search functionality
- Pagination

### 🛒 Shopping Cart
- Add/remove items
- Quantity updates
- Coupon code application
- Loyalty points redemption
- Shipping calculation
- Cart persistence

### 👤 User Features
- Authentication (Firebase)
- User profile management
- Order history
- Wishlist
- Wallet & loyalty points
- Address management

### 📱 UI/UX
- Responsive design
- Dark/light theme support
- Multi-language support (EN/AR)
- Loading states
- Error handling
- Toast notifications

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Authentication**: Firebase Auth
- **Icons**: Lucide React
- **Forms**: React Hook Form + Yup
- **HTTP Client**: Axios
- **Image Optimization**: Next.js Image

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components (Header, Footer)
│   ├── Home/           # Homepage components
│   ├── Product/        # Product-related components
│   ├── layout/         # Layout components
│   └── ui/             # Generic UI components
├── layouts/            # Page layouts
├── pages/              # Next.js pages
├── services/           # API services
├── store/              # Redux store and slices
├── styles/             # Global styles
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── types/              # TypeScript type definitions
```

## Key Components

### Store Slices
- `authSlice` - User authentication state
- `cartSlice` - Shopping cart management
- `productsSlice` - Product data and filters
- `ordersSlice` - Order management
- `walletSlice` - Wallet and loyalty points
- `wishlistSlice` - User wishlist
- `uiSlice` - UI state (modals, theme, etc.)

### Services
- `apiService` - HTTP client with interceptors
- `authService` - Authentication methods
- `productService` - Product CRUD operations
- `cartService` - Cart management
- `orderService` - Order processing
- `walletService` - Wallet and loyalty operations

### Key Features Implemented
- ✅ Homepage with all sections
- ✅ Product listing and filtering
- ✅ Shopping cart functionality
- ✅ User authentication
- ✅ Responsive design
- ✅ State management
- ✅ API integration ready
- ✅ TypeScript types from shared package

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Configure Firebase and API endpoints in `.env.local`

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript check
- `pnpm test` - Run tests

## Integration Points

The app is designed to work with:
- **Backend API** (`../backend`) - REST API for data operations
- **Shared Types** (`../shared`) - Common TypeScript definitions
- **Database** (`../database`) - PostgreSQL with Prisma
- **Firebase** - Authentication and file storage

## Next Steps

1. Connect to actual backend API
2. Implement remaining pages (Profile, Orders, etc.)
3. Add payment integration
4. Implement real-time features
5. Add comprehensive testing
6. Optimize for production

## Notes

- All placeholder images are SVG-based for development
- Components use proper TypeScript typing from shared package
- Redux store is configured with persistence
- Responsive design follows mobile-first approach
- Ready for i18n implementation