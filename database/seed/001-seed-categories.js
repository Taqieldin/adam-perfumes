'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = [
      // Main Categories
      {
        id: uuidv4(),
        name: 'Men\'s Fragrances',
        name_ar: 'عطور الرجال',
        slug: 'mens-fragrances',
        description: 'Premium fragrances designed for men',
        description_ar: 'عطور فاخرة مصممة للرجال',
        parent_id: null,
        sort_order: 1,
        is_active: true,
        is_featured: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Women\'s Fragrances',
        name_ar: 'عطور النساء',
        slug: 'womens-fragrances',
        description: 'Elegant fragrances for women',
        description_ar: 'عطور أنيقة للنساء',
        parent_id: null,
        sort_order: 2,
        is_active: true,
        is_featured: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Unisex Fragrances',
        name_ar: 'العطور المشتركة',
        slug: 'unisex-fragrances',
        description: 'Versatile fragrances for everyone',
        description_ar: 'عطور متعددة الاستخدامات للجميع',
        parent_id: null,
        sort_order: 3,
        is_active: true,
        is_featured: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Oud Collection',
        name_ar: 'مجموعة العود',
        slug: 'oud-collection',
        description: 'Traditional Arabian oud fragrances',
        description_ar: 'عطور العود العربية التقليدية',
        parent_id: null,
        sort_order: 4,
        is_active: true,
        is_featured: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Gift Sets',
        name_ar: 'مجموعات الهدايا',
        slug: 'gift-sets',
        description: 'Perfect gift sets for special occasions',
        description_ar: 'مجموعات هدايا مثالية للمناسبات الخاصة',
        parent_id: null,
        sort_order: 5,
        is_active: true,
        is_featured: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Travel Size',
        name_ar: 'الحجم المحمول',
        slug: 'travel-size',
        description: 'Convenient travel-sized fragrances',
        description_ar: 'عطور بحجم مناسب للسفر',
        parent_id: null,
        sort_order: 6,
        is_active: true,
        is_featured: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('categories', categories);

    // Get the inserted categories to create subcategories
    const insertedCategories = await queryInterface.sequelize.query(
      'SELECT id, name FROM categories WHERE parent_id IS NULL',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const mensId = insertedCategories.find(c => c.name === 'Men\'s Fragrances')?.id;
    const womensId = insertedCategories.find(c => c.name === 'Women\'s Fragrances')?.id;
    const oudId = insertedCategories.find(c => c.name === 'Oud Collection')?.id;

    // Subcategories
    const subcategories = [
      // Men's subcategories
      {
        id: uuidv4(),
        name: 'Eau de Parfum',
        name_ar: 'أو دو بارفان',
        slug: 'mens-eau-de-parfum',
        description: 'Long-lasting men\'s eau de parfum',
        description_ar: 'أو دو بارفان للرجال طويل المفعول',
        parent_id: mensId,
        sort_order: 1,
        is_active: true,
        is_featured: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Eau de Toilette',
        name_ar: 'أو دو تواليت',
        slug: 'mens-eau-de-toilette',
        description: 'Fresh men\'s eau de toilette',
        description_ar: 'أو دو تواليت منعش للرجال',
        parent_id: mensId,
        sort_order: 2,
        is_active: true,
        is_featured: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Women's subcategories
      {
        id: uuidv4(),
        name: 'Eau de Parfum',
        name_ar: 'أو دو بارفان',
        slug: 'womens-eau-de-parfum',
        description: 'Elegant women\'s eau de parfum',
        description_ar: 'أو دو بارفان أنيق للنساء',
        parent_id: womensId,
        sort_order: 1,
        is_active: true,
        is_featured: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Floral',
        name_ar: 'الأزهار',
        slug: 'womens-floral',
        description: 'Beautiful floral fragrances',
        description_ar: 'عطور زهرية جميلة',
        parent_id: womensId,
        sort_order: 2,
        is_active: true,
        is_featured: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Oud subcategories
      {
        id: uuidv4(),
        name: 'Pure Oud',
        name_ar: 'العود الخالص',
        slug: 'pure-oud',
        description: 'Pure traditional oud',
        description_ar: 'العود التقليدي الخالص',
        parent_id: oudId,
        sort_order: 1,
        is_active: true,
        is_featured: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Oud Blends',
        name_ar: 'خلطات العود',
        slug: 'oud-blends',
        description: 'Modern oud blends',
        description_ar: 'خلطات العود الحديثة',
        parent_id: oudId,
        sort_order: 2,
        is_active: true,
        is_featured: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('categories', subcategories);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};