# Adam Perfumes Database Schema

This document describes the complete database schema for the Adam Perfumes e-commerce platform, designed for a perfume retailer with 21 physical branches across Oman.

## 🏗️ Database Architecture

The database is designed with the following principles:
- **Multi-language support** (Arabic & English)
- **Multi-branch inventory management**
- **Comprehensive e-commerce features**
- **Customer loyalty and wallet system**
- **Advanced support and chat system**
- **Gift card and promotion management**

## 📊 Database Schema Overview

### Core Entities

#### 👥 Users & Authentication
- **users**: Customer and admin user accounts
- **loyalty_transactions**: Points earning and redemption history
- **wallet_transactions**: In-app wallet transaction history

#### 🏪 Store Management
- **branches**: 21 physical branches across Oman
- **categories**: Product categorization (hierarchical)
- **products**: Perfume products with detailed fragrance information
- **branch_inventory**: Stock levels per branch per product

#### 🛒 E-commerce
- **orders**: Customer orders with comprehensive tracking
- **order_items**: Individual items within orders
- **coupons**: Discount coupons and promotional codes
- **coupon_usage**: Coupon usage tracking

#### 🎁 Gift & Loyalty
- **gift_cards**: Prepaid gift cards system
- **gift_card_transactions**: Gift card usage history

#### 💬 Support & Communication
- **support_tickets**: Customer support ticket system
- **chat_messages**: In-app chat messages
- **notifications**: Push notifications and alerts

## 📋 Detailed Table Descriptions

### Users Table
Stores all user information including customers and admin staff.

**Key Features:**
- Firebase UID integration
- Multi-language preferences (Arabic/English)
- Role-based access control
- Wallet balance and loyalty points
- Referral system
- FCM token for push notifications

```sql
-- Example user roles
'customer', 'admin', 'super_admin', 'store_manager'

-- Supported languages
'en', 'ar'
```

### Branches Table
Manages Adam Perfumes' 21 physical branches across Oman.

**Key Features:**
- Geographic coordinates for geolocation
- Operating hours management
- Branch-specific services and capabilities
- Manager and staff information
- Performance tracking

**Oman Governorates Supported:**
- Muscat, Dhofar, Al Batinah North, Al Batinah South, etc.

### Products Table
Comprehensive perfume product management.

**Fragrance-Specific Fields:**
- **fragrance_type**: eau_de_parfum, eau_de_toilette, parfum, etc.
- **gender**: men, women, unisex
- **fragrance_family**: Oriental, Fresh, Floral, Woody
- **notes**: top_notes, middle_notes, base_notes (JSON arrays)
- **longevity**: very_weak to eternal
- **sillage**: intimate to enormous
- **season**: suitable seasons (JSON array)
- **occasion**: daily, evening, office, special (JSON array)

### Branch Inventory Table
Tracks stock levels across all 21 branches.

**Inventory Features:**
- Real-time stock tracking
- Reserved stock for pending orders
- Reorder point management
- Physical location within branch
- Performance metrics per branch

### Orders Table
Comprehensive order management system.

**Order Statuses:**
```
pending → paid → processing → ready_for_pickup/shipped → 
out_for_delivery → delivered
```

**Fulfillment Methods:**
- **delivery**: Home delivery
- **pickup**: Branch pickup
- **branch_visit**: In-store purchase

**Payment Integration:**
- Supports Tap Payments (primary for Oman)
- Stripe integration
- Wallet payments
- Cash on delivery
- Loyalty points redemption

### Support System
Advanced customer support with AI integration.

**Support Ticket Categories:**
- order_inquiry, product_question, payment_issue
- delivery_problem, return_request, technical_support
- complaint, compliment, suggestion

**Chat Features:**
- Real-time messaging
- File attachments
- AI bot integration with confidence scoring
- Multi-language support
- Internal agent notes

### Loyalty & Wallet System
Comprehensive customer retention system.

**Loyalty Points:**
- Earned on purchases (configurable ratio)
- Redeemable for discounts
- Expiration management
- Bonus points for referrals

**Wallet System:**
- Top-up via payment gateways
- Order payments
- Refund processing
- Transfer between users
- Transaction history

### Gift Cards
Full-featured gift card system.

**Features:**
- Digital and physical gift cards
- Custom designs and messages
- Partial redemption support
- Expiration management
- Usage restrictions

## 🔧 Database Configuration

### Environment Variables
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=adam_perfumes
DB_USER=your_username
DB_PASSWORD=your_password
DB_SSL=false
```

### Timezone Configuration
All timestamps use Oman timezone (GST +04:00).

### Character Set
UTF8MB4 for full Unicode support (Arabic text, emojis).

## 🚀 Migration Commands

```bash
# Run all migrations
npm run migrate

# Rollback last migration
npm run rollback

# Reset database (caution!)
npm run reset

# Seed sample data
npm run seed
```

## 📈 Performance Considerations

### Indexes
All tables include strategic indexes for:
- Primary and foreign keys
- Frequently queried fields
- Composite indexes for complex queries
- Full-text search on product names/descriptions

### Partitioning
Consider partitioning for large tables:
- **orders**: By date (monthly partitions)
- **notifications**: By date (monthly partitions)
- **chat_messages**: By date (quarterly partitions)

### Caching Strategy
- Product catalog: Redis cache (1 hour TTL)
- User sessions: Redis cache
- Branch inventory: Real-time updates with cache invalidation

## 🔒 Security Features

### Data Protection
- Sensitive data encryption at rest
- PII data anonymization for analytics
- GDPR compliance for data retention

### Access Control
- Role-based permissions
- Branch-level access restrictions
- API rate limiting
- Audit logging for admin actions

## 📊 Analytics & Reporting

### Key Metrics Tables
The schema supports tracking:
- Sales performance by branch
- Product popularity and ratings
- Customer lifetime value
- Inventory turnover rates
- Support ticket resolution times

### Business Intelligence
- Customer segmentation data
- Seasonal sales patterns
- Geographic sales distribution
- Product recommendation accuracy

## 🔄 Data Synchronization

### Mobile App Sync
- Offline-first architecture support
- Conflict resolution strategies
- Delta sync for large datasets

### Branch Integration
- Real-time inventory updates
- POS system integration points
- Staff performance tracking

## 🛠️ Maintenance

### Regular Tasks
- Index optimization
- Statistics updates
- Backup verification
- Performance monitoring

### Monitoring
- Query performance tracking
- Connection pool monitoring
- Disk space alerts
- Replication lag monitoring

## 📝 Sample Queries

### Popular Products by Branch
```sql
SELECT 
    b.name as branch_name,
    p.name as product_name,
    SUM(oi.quantity) as total_sold
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
JOIN products p ON oi.product_id = p.id
JOIN branches b ON o.pickup_branch_id = b.id
WHERE o.status = 'delivered'
    AND o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY b.id, p.id
ORDER BY total_sold DESC;
```

### Customer Loyalty Analysis
```sql
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.loyalty_points,
    COUNT(o.id) as total_orders,
    SUM(o.total_amount) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.role = 'customer'
GROUP BY u.id
ORDER BY total_spent DESC;
```

---

*This database schema provides a solid foundation for Adam Perfumes' digital transformation, supporting all business requirements while maintaining scalability and performance.*