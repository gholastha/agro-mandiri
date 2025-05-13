# Agro Mandiri Database Schema Documentation

This document provides a comprehensive overview of the database structure for the Agro Mandiri E-Commerce application. The schema is designed to support agricultural product e-commerce with specialized features for fertilizers, pesticides, seeds, and agricultural equipment.

## Overview

The database schema is organized into several logical sections:

1. **User & Authentication** - User profiles and addresses
2. **Products & Categories** - Product information, categories, and attributes specific to agricultural products
3. **Orders & Transactions** - Order processing and history
4. **Shopping Cart & Wishlist** - User shopping experience
5. **Reviews & Ratings** - Product reviews and feedback
6. **Settings & Configuration** - Store, payment, shipping, and notification settings
7. **Content Management** - Blog posts and static pages
8. **Marketing & Promotions** - Coupons and discounts

## Schema Details

### User & Authentication

#### User Profiles

Extends Supabase auth.users with additional user information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, references auth.users |
| full_name | TEXT | User's full name |
| profile_image_url | TEXT | URL to profile image |
| phone_number | TEXT | User's contact number |
| is_admin | BOOLEAN | Admin privilege flag |
| is_seller | BOOLEAN | Seller privilege flag |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### User Addresses

Stores multiple shipping addresses for users.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users |
| address_line | TEXT | Street address |
| city | TEXT | City name |
| province | TEXT | Province/state |
| postal_code | TEXT | Postal/ZIP code |
| country | TEXT | Country name (defaults to Indonesia) |
| is_default | BOOLEAN | Whether this is the default address |
| recipient_name | TEXT | Name of recipient |
| recipient_phone | TEXT | Contact number for delivery |
| label | TEXT | Optional address label (e.g., "Home", "Office") |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### Products & Categories

#### Categories

Hierarchical product categories.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Category name |
| slug | TEXT | URL-friendly name |
| description | TEXT | Category description |
| parent_id | UUID | References parent category (if any) |
| image_url | TEXT | Category image URL |
| is_active | BOOLEAN | Whether category is active |
| sort_order | INTEGER | Display order |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### Manufacturers

Brands and manufacturers of products.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Manufacturer name |
| slug | TEXT | URL-friendly name |
| description | TEXT | Manufacturer description |
| logo_url | TEXT | Logo image URL |
| website_url | TEXT | Manufacturer website |
| is_featured | BOOLEAN | Whether to feature prominently |
| is_active | BOOLEAN | Whether manufacturer is active |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### Products

Core product information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Product name |
| slug | TEXT | URL-friendly name |
| description | TEXT | Full product description |
| short_description | TEXT | Brief product summary |
| category_id | UUID | References categories |
| manufacturer_id | UUID | References manufacturers |
| sku | TEXT | Stock keeping unit |
| price | DECIMAL | Regular price |
| sale_price | DECIMAL | Discounted price (if any) |
| cost_price | DECIMAL | Product cost for inventory valuation |
| stock_quantity | INTEGER | Available stock |
| weight | DECIMAL | Product weight |
| dimensions | JSONB | Product dimensions (L×W×H) |
| is_featured | BOOLEAN | Whether to feature prominently |
| is_active | BOOLEAN | Whether product is active |
| is_digital | BOOLEAN | Whether product is digital |
| rating_average | DECIMAL | Average review rating |
| rating_count | INTEGER | Number of reviews |
| view_count | INTEGER | Number of product views |
| sold_count | INTEGER | Number of units sold |
| meta_title | TEXT | SEO title |
| meta_description | TEXT | SEO description |
| keywords | TEXT[] | SEO keywords |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### Product Images

Multiple images per product.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| product_id | UUID | References products |
| image_url | TEXT | Image URL |
| alt_text | TEXT | Accessibility text |
| is_primary | BOOLEAN | Whether this is the main product image |
| sort_order | INTEGER | Display order |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### Product Attributes

Agricultural product-specific attributes like fertilizer type, seed variety, etc.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Attribute name |
| display_name | TEXT | User-friendly attribute name |
| attribute_group | TEXT | Group ('fertilizer', 'pesticide', 'seed', 'equipment') |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### Product Attribute Values

Values of attributes for specific products.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| product_id | UUID | References products |
| attribute_id | UUID | References product_attributes |
| value | TEXT | Attribute value |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### Product Variants

Products with options (e.g., different sizes, packaging).

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| product_id | UUID | References products |
| name | TEXT | Variant name |
| sku | TEXT | Variant-specific SKU |
| price_adjustment | DECIMAL | Adjustment to base price |
| stock_quantity | INTEGER | Variant-specific stock |
| is_active | BOOLEAN | Whether variant is active |
| options | JSONB | Variant options ({size: 'large', etc.}) |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### Orders & Transactions

#### Orders

Customer order information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users |
| order_number | TEXT | Human-readable order ID |
| status | order_status | Order status enum |
| payment_status | payment_status | Payment status enum |
| payment_method | TEXT | Payment method used |
| payment_details | JSONB | Payment transaction details |
| shipping_method | TEXT | Shipping method used |
| shipping_cost | DECIMAL | Shipping cost |
| subtotal | DECIMAL | Order subtotal (before shipping, tax) |
| discount | DECIMAL | Applied discount amount |
| tax | DECIMAL | Tax amount |
| total | DECIMAL | Order total |
| notes | TEXT | Order notes |
| shipping_address | JSONB | Delivery address |
| billing_address | JSONB | Billing address (if different) |
| tracking_number | TEXT | Shipping tracking number |
| shipped_at | TIMESTAMP | Ship date |
| delivered_at | TIMESTAMP | Delivery date |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### Order Items

Individual items within an order.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| order_id | UUID | References orders |
| product_id | UUID | References products |
| variant_id | UUID | References product_variants (if applicable) |
| quantity | INTEGER | Quantity ordered |
| unit_price | DECIMAL | Price per unit |
| subtotal | DECIMAL | Item subtotal (price × quantity) |
| product_data | JSONB | Snapshot of product at time of purchase |
| created_at | TIMESTAMP | Creation timestamp |

### Shopping Cart & Wishlist

#### Carts

Shopping carts for both logged-in and guest users.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users (for logged-in users) |
| session_id | TEXT | Session identifier (for guest users) |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### Cart Items

Items in shopping carts.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| cart_id | UUID | References carts |
| product_id | UUID | References products |
| variant_id | UUID | References product_variants (if applicable) |
| quantity | INTEGER | Quantity in cart |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### Wishlists

User wish lists for saving products of interest.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users |
| name | TEXT | Wishlist name |
| is_public | BOOLEAN | Whether list is publicly viewable |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### Wishlist Items

Products saved to wishlists.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| wishlist_id | UUID | References wishlists |
| product_id | UUID | References products |
| created_at | TIMESTAMP | Creation timestamp |

### Reviews & Ratings

#### Reviews

Product reviews by customers.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| product_id | UUID | References products |
| user_id | UUID | References auth.users |
| order_item_id | UUID | References order_items (optional verification) |
| rating | INTEGER | Rating score (1-5) |
| title | TEXT | Review title |
| content | TEXT | Review content |
| is_verified | BOOLEAN | Whether reviewer purchased product |
| is_approved | BOOLEAN | Whether review is approved for display |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### Review Images

Images attached to reviews.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| review_id | UUID | References reviews |
| image_url | TEXT | Image URL |
| created_at | TIMESTAMP | Creation timestamp |

### Settings & Configuration

#### Store Settings

General store configuration.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| store_name | TEXT | Store name |
| store_description | TEXT | Store description |
| contact_email | TEXT | Store contact email |
| contact_phone | TEXT | Store contact phone |
| address | TEXT | Store address |
| city | TEXT | Store city |
| province | TEXT | Store province/state |
| postal_code | TEXT | Store postal code |
| country | TEXT | Store country |
| currency | TEXT | Store currency (default: IDR) |
| logo_url | TEXT | Store logo URL |
| favicon_url | TEXT | Store favicon URL |
| social_media | JSONB | Social media links |
| meta_title | TEXT | SEO title |
| meta_description | TEXT | SEO description |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### Payment Settings

Available payment methods.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| provider | TEXT | Payment provider identifier |
| is_enabled | BOOLEAN | Whether method is enabled |
| config | JSONB | Provider-specific configuration |
| display_name | TEXT | User-friendly name |
| description | TEXT | Method description |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### Shipping Settings

Available shipping methods.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| provider | TEXT | Shipping provider identifier |
| is_enabled | BOOLEAN | Whether method is enabled |
| config | JSONB | Provider-specific configuration |
| display_name | TEXT | User-friendly name |
| description | TEXT | Method description |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### Notification Settings

Email and SMS notification templates.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| type | TEXT | Notification type identifier |
| is_enabled | BOOLEAN | Whether notification is enabled |
| email_template | TEXT | Email template content |
| sms_template | TEXT | SMS template content |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### Content Management

#### Blog Posts

Blog content for agricultural tips, product usage, etc.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Post title |
| slug | TEXT | URL-friendly name |
| content | TEXT | Post content |
| excerpt | TEXT | Short post summary |
| featured_image_url | TEXT | Featured image URL |
| author_id | UUID | References auth.users |
| is_published | BOOLEAN | Whether post is published |
| published_at | TIMESTAMP | Publication timestamp |
| meta_title | TEXT | SEO title |
| meta_description | TEXT | SEO description |
| tags | TEXT[] | Post tags |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### Pages

Static content pages (About, Contact, etc.).

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Page title |
| slug | TEXT | URL-friendly name |
| content | TEXT | Page content |
| is_published | BOOLEAN | Whether page is published |
| meta_title | TEXT | SEO title |
| meta_description | TEXT | SEO description |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### Marketing & Promotions

#### Coupons

Discount coupons and promotional codes.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| code | TEXT | Coupon code |
| description | TEXT | Coupon description |
| discount_type | TEXT | 'percentage' or 'fixed' |
| discount_value | DECIMAL | Discount amount |
| minimum_order_value | DECIMAL | Minimum qualifying order total |
| maximum_discount | DECIMAL | Maximum discount amount |
| starts_at | TIMESTAMP | Start date/time |
| expires_at | TIMESTAMP | Expiration date/time |
| usage_limit | INTEGER | Maximum number of uses |
| usage_count | INTEGER | Current use count |
| is_active | BOOLEAN | Whether coupon is active |
| applies_to_products | TEXT[] | Applicable product IDs |
| applies_to_categories | TEXT[] | Applicable category IDs |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## Schema Relationships

![Database Schema Relationships](https://mermaid.ink/img/pako:eNqVVMtu2zAQ_BWCp7hwkjaJc8ohjQs0KFAgRl8HXbgWtSK1EimSJSk3MPLvXVJ-SCkMowcBu8PZ2dkZcs8EVdhw9sriTBJjpTYMZ3BrkhVxzGvr7o8QplVRJHm1c-t36wotQtpZhWiyeO83lSt0_Z7xrIwANkV5gJyQWHJTww4PtaihVA10h5JQPRBsUFWo3DKqtECwWp_GsEGTsUVZwytvBzLLLJK4sOQg7Z1TpLCMRmtlwbkO5-t5pD5EDWVS4rLRJxWDrqxUGqVAsSPZYJWzXnlw0aouiKJjGPG-eKj6_jgLlkVpBDi3oy5Pv6-z9t3TbNVXRtE3HvO_hLTWRoRHdJHEQv_WL9gCRBIGOWOmGMeJg4LoCqnJfLfCxlqD34hOwMEXwA3WiV_Ql_Dx79QJhzQX-ztBRUmkS5ZowXY-dH_HiJJEg60E1HN_27XtdHRfqxSrP7EF6S1L-5YmWFFlBZI_rQu9ZnkCxDmrQiQlFXKk1p8-4Y2AvkAXZ-Mm-hQH4dRHTCdSJ_L3c5bL2pfxRmmWUlndE_ndv2Rf2Ks_9PxlUe4qdNQdiqRtaZqT9nT46ViEwRCQiI-jzODdaSxLjLiDYwYzf9HrvZZnlZHGwULBXXfz9-0frXFejVvNkr-kP-0FdPrYg91L_gPpOMt4)

## Implementation Notes

1. **Indexing Strategy**: Indexes have been created on frequently queried columns and those used in JOIN operations to optimize query performance.

2. **Data Types**:
   - UUIDs are used as primary keys for better security and distribution
   - JSONB for flexible schema elements (e.g., product options, shipping configs)
   - ENUM types for status fields with a fixed set of values

3. **Triggers**:
   - Automatic `updated_at` timestamp management for all tables

4. **Default Data**:
   - Basic configuration for store settings, payment methods, shipping options
   - Initial product categories aligned with the agricultural focus
   - Default notification templates

## Using This Schema

### In Supabase

1. Navigate to the SQL Editor in your Supabase dashboard
2. Open the `001_initial_schema.sql` file
3. Execute the SQL to create the complete database structure

### Maintaining Schema Documentation

When making changes to the database schema:

1. Update both the SQL file and this documentation
2. Document the purpose of any new tables or columns
3. Update relationship diagrams if necessary
4. Note any migration steps for existing data

## Agricultural Product Type Details

### Fertilizer Attributes
- **Type**: Organic, Chemical, Compound, etc.
- **Benefits**: Plant growth, soil fertility, etc.
- **Application**: Foliar spray, soil application, etc.
- **Composition**: NPK ratio, micronutrients, etc.

### Pesticide Attributes
- **Type**: Insecticide, Fungicide, Herbicide, etc.
- **Target Pests**: Specific insects, fungi, weeds, etc.
- **Active Ingredient**: Chemical compounds
- **Application Method**: Spray, granules, etc.

### Seed Attributes
- **Variety**: Specific plant variety
- **Growing Period**: Days to harvest
- **Yield Potential**: Expected production per area
- **Resistance**: Pest/disease resistance features

### Equipment Attributes
- **Type**: Sprayer, Tractor, Hand Tool, etc.
- **Material**: Steel, Plastic, etc.
- **Power Source**: Manual, Electric, Gasoline, etc.
- **Dimensions**: Size specifications
