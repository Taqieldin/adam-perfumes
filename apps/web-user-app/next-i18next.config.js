module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    localeDetection: true,
  },
  fallbackLng: {
    default: ['en'],
    ar: ['ar', 'en'],
  },
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  
  // Namespace configuration
  ns: [
    'common',
    'auth',
    'products',
    'cart',
    'checkout',
    'profile',
    'orders',
    'support',
    'footer',
    'navigation'
  ],
  defaultNS: 'common',
  
  // Interpolation configuration
  interpolation: {
    escapeValue: false, // React already does escaping
  },
  
  // React configuration
  react: {
    useSuspense: false,
  },
  
  // Server-side configuration
  serverLanguageDetection: true,
  
  // Custom detection order
  detection: {
    order: ['cookie', 'header', 'querystring', 'path', 'subdomain'],
    caches: ['cookie'],
    cookieMinutes: 60 * 24 * 30, // 30 days
    cookieDomain: process.env.NODE_ENV === 'production' ? '.adam-perfumes.com' : 'localhost',
  },
};