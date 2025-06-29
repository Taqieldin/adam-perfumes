// Product management constants
const PRODUCT_CONSTANTS = {
  STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    OUT_OF_STOCK: 'out_of_stock',
    DISCONTINUED: 'discontinued',
    DRAFT: 'draft',
    PENDING_APPROVAL: 'pending_approval'
  },
  
  TYPES: {
    PERFUME: 'perfume',
    COLOGNE: 'cologne',
    BODY_SPRAY: 'body_spray',
    GIFT_SET: 'gift_set',
    SAMPLE: 'sample',
    ACCESSORY: 'accessory'
  },
  
  CATEGORIES: {
    MEN: 'men',
    WOMEN: 'women',
    UNISEX: 'unisex',
    KIDS: 'kids',
    LUXURY: 'luxury',
    ORIENTAL: 'oriental',
    WESTERN: 'western'
  },
  
  SIZES: {
    SAMPLE: { value: 2, unit: 'ml', label: '2ml Sample' },
    SMALL: { value: 30, unit: 'ml', label: '30ml' },
    MEDIUM: { value: 50, unit: 'ml', label: '50ml' },
    LARGE: { value: 100, unit: 'ml', label: '100ml' },
    EXTRA_LARGE: { value: 150, unit: 'ml', label: '150ml' }
  },
  
  CONCENTRATION: {
    PARFUM: { name: 'Parfum', percentage: '20-40%', longevity: '8-12 hours' },
    EAU_DE_PARFUM: { name: 'Eau de Parfum', percentage: '15-20%', longevity: '6-8 hours' },
    EAU_DE_TOILETTE: { name: 'Eau de Toilette', percentage: '5-15%', longevity: '3-5 hours' },
    EAU_DE_COLOGNE: { name: 'Eau de Cologne', percentage: '2-4%', longevity: '2-3 hours' },
    EAU_FRAICHE: { name: 'Eau Fraiche', percentage: '1-3%', longevity: '1-2 hours' }
  }
};

const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OUT_OF_STOCK: 'out_of_stock',
  DISCONTINUED: 'discontinued',
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval'
};

const PRODUCT_TYPES = {
  PERFUME: 'perfume',
  COLOGNE: 'cologne',
  BODY_SPRAY: 'body_spray',
  GIFT_SET: 'gift_set',
  SAMPLE: 'sample',
  ACCESSORY: 'accessory'
};

// Fragrance notes categories
const FRAGRANCE_NOTES = {
  TOP_NOTES: {
    CITRUS: ['Lemon', 'Orange', 'Bergamot', 'Grapefruit', 'Lime'],
    FRESH: ['Mint', 'Eucalyptus', 'Green Leaves', 'Ozone'],
    FRUITY: ['Apple', 'Pear', 'Peach', 'Berry', 'Tropical Fruits'],
    SPICY: ['Pink Pepper', 'Cardamom', 'Coriander', 'Ginger']
  },
  
  MIDDLE_NOTES: {
    FLORAL: ['Rose', 'Jasmine', 'Lily', 'Peony', 'Violet'],
    SPICY: ['Cinnamon', 'Nutmeg', 'Clove', 'Black Pepper'],
    HERBAL: ['Lavender', 'Rosemary', 'Sage', 'Thyme'],
    FRUITY: ['Plum', 'Fig', 'Coconut', 'Banana']
  },
  
  BASE_NOTES: {
    WOODY: ['Sandalwood', 'Cedar', 'Pine', 'Birch'],
    ORIENTAL: ['Amber', 'Oud', 'Frankincense', 'Myrrh'],
    MUSKY: ['White Musk', 'Ambroxan', 'Iso E Super'],
    SWEET: ['Vanilla', 'Caramel', 'Honey', 'Tonka Bean']
  }
};

// Product validation rules
const PRODUCT_VALIDATION = {
  NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
    REQUIRED: true
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 2000,
    REQUIRED: true
  },
  PRICE: {
    MIN_VALUE: 1.000, // 1 OMR
    MAX_VALUE: 500.000, // 500 OMR
    REQUIRED: true
  },
  SKU: {
    PATTERN: /^AP-[A-Z0-9]{6,12}$/,
    REQUIRED: true,
    UNIQUE: true
  },
  IMAGES: {
    MIN_COUNT: 1,
    MAX_COUNT: 10,
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_FORMATS: ['jpg', 'jpeg', 'png', 'webp']
  },
  STOCK: {
    MIN_VALUE: 0,
    MAX_VALUE: 9999,
    REQUIRED: true
  }
};

// Product search filters
const PRODUCT_FILTERS = {
  PRICE_RANGES: [
    { label: 'Under 10 OMR', min: 0, max: 10 },
    { label: '10 - 25 OMR', min: 10, max: 25 },
    { label: '25 - 50 OMR', min: 25, max: 50 },
    { label: '50 - 100 OMR', min: 50, max: 100 },
    { label: 'Over 100 OMR', min: 100, max: null }
  ],
  
  SORT_OPTIONS: [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popularity', label: 'Most Popular' }
  ],
  
  AVAILABILITY: [
    { value: 'in_stock', label: 'In Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' },
    { value: 'low_stock', label: 'Low Stock' }
  ]
};

// Product recommendations
const RECOMMENDATION_TYPES = {
  SIMILAR: 'similar',
  FREQUENTLY_BOUGHT: 'frequently_bought',
  RECENTLY_VIEWED: 'recently_viewed',
  TRENDING: 'trending',
  SEASONAL: 'seasonal',
  PERSONALIZED: 'personalized'
};

module.exports = {
  PRODUCT_CONSTANTS,
  PRODUCT_STATUS,
  PRODUCT_TYPES,
  FRAGRANCE_NOTES,
  PRODUCT_VALIDATION,
  PRODUCT_FILTERS,
  RECOMMENDATION_TYPES
};