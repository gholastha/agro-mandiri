-- Agro Mandiri E-Commerce Database Schema
-- Initial Migration: Core Tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===============================
-- AUTH & USER RELATED TABLES
-- ===============================

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  profile_image_url TEXT,
  phone_number TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  is_seller BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- User addresses
CREATE TABLE IF NOT EXISTS public.user_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  address_line TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Indonesia',
  is_default BOOLEAN DEFAULT FALSE,
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  label TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ===============================
-- PRODUCT RELATED TABLES
-- ===============================

-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id),
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create index for faster category lookups
CREATE INDEX IF NOT EXISTS categories_parent_id_idx ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS categories_slug_idx ON public.categories(slug);

-- Manufacturers/Brands
CREATE TABLE IF NOT EXISTS public.manufacturers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  category_id UUID NOT NULL REFERENCES public.categories(id),
  manufacturer_id UUID REFERENCES public.manufacturers(id),
  sku TEXT,
  price DECIMAL(12, 2) NOT NULL,
  sale_price DECIMAL(12, 2),
  cost_price DECIMAL(12, 2),
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  weight DECIMAL(10, 2),
  dimensions JSONB,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_digital BOOLEAN DEFAULT FALSE,
  rating_average DECIMAL(3, 2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  sold_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Indices for faster product lookups
CREATE INDEX IF NOT EXISTS products_category_id_idx ON public.products(category_id);
CREATE INDEX IF NOT EXISTS products_manufacturer_id_idx ON public.products(manufacturer_id);
CREATE INDEX IF NOT EXISTS products_slug_idx ON public.products(slug);
CREATE INDEX IF NOT EXISTS products_price_idx ON public.products(price);
CREATE INDEX IF NOT EXISTS products_is_featured_idx ON public.products(is_featured) WHERE is_featured = TRUE;

-- Product Images
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS product_images_product_id_idx ON public.product_images(product_id);

-- Product Attributes (for fertilizer, pesticide, seed, equipment specs)
CREATE TABLE IF NOT EXISTS public.product_attributes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  attribute_group TEXT NOT NULL, -- 'fertilizer', 'pesticide', 'seed', 'equipment'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(name, attribute_group)
);

-- Product Attribute Values
CREATE TABLE IF NOT EXISTS public.product_attribute_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  attribute_id UUID NOT NULL REFERENCES public.product_attributes(id),
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(product_id, attribute_id)
);

CREATE INDEX IF NOT EXISTS product_attribute_values_product_id_idx ON public.product_attribute_values(product_id);
CREATE INDEX IF NOT EXISTS product_attribute_values_attribute_id_idx ON public.product_attribute_values(attribute_id);

-- Product Variants (for products with options)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  price_adjustment DECIMAL(12, 2) DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  options JSONB NOT NULL, -- {size: 'large', color: 'red'}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS product_variants_product_id_idx ON public.product_variants(product_id);

-- ===============================
-- ORDER RELATED TABLES
-- ===============================

-- Order status enum
CREATE TYPE order_status AS ENUM (
  'pending', 
  'processing', 
  'shipped', 
  'delivered', 
  'cancelled', 
  'refunded'
);

-- Payment status enum
CREATE TYPE payment_status AS ENUM (
  'pending', 
  'paid', 
  'failed', 
  'refunded'
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  order_number TEXT NOT NULL UNIQUE,
  status order_status NOT NULL DEFAULT 'pending',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_details JSONB,
  shipping_method TEXT,
  shipping_cost DECIMAL(12, 2) NOT NULL DEFAULT 0,
  subtotal DECIMAL(12, 2) NOT NULL,
  discount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  tax DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL,
  notes TEXT,
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  tracking_number TEXT,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS orders_order_number_idx ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders(status);
CREATE INDEX IF NOT EXISTS orders_payment_status_idx ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders(created_at);

-- Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  variant_id UUID REFERENCES public.product_variants(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  product_data JSONB NOT NULL, -- Snapshot of product at time of purchase
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS order_items_product_id_idx ON public.order_items(product_id);

-- ===============================
-- CART RELATED TABLES
-- ===============================

-- Carts
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT, -- For guest carts
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT user_or_session CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS carts_user_id_idx ON public.carts(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS carts_session_id_idx ON public.carts(session_id) WHERE session_id IS NOT NULL;

-- Cart Items
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  variant_id UUID REFERENCES public.product_variants(id),
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(cart_id, product_id, variant_id)
);

CREATE INDEX IF NOT EXISTS cart_items_cart_id_idx ON public.cart_items(cart_id);

-- ===============================
-- WISHLIST RELATED TABLES
-- ===============================

-- Wishlists
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Default',
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, name)
);

CREATE INDEX IF NOT EXISTS wishlists_user_id_idx ON public.wishlists(user_id);

-- Wishlist Items
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id UUID NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(wishlist_id, product_id)
);

CREATE INDEX IF NOT EXISTS wishlist_items_wishlist_id_idx ON public.wishlist_items(wishlist_id);

-- ===============================
-- REVIEW RELATED TABLES
-- ===============================

-- Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  order_item_id UUID REFERENCES public.order_items(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  content TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS reviews_product_id_idx ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS reviews_rating_idx ON public.reviews(rating);

-- Review Images
CREATE TABLE IF NOT EXISTS public.review_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS review_images_review_id_idx ON public.review_images(review_id);

-- ===============================
-- SETTINGS TABLES
-- ===============================

-- Store Settings
CREATE TABLE IF NOT EXISTS public.store_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_name TEXT NOT NULL,
  store_description TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  address TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  country TEXT,
  currency TEXT NOT NULL DEFAULT 'IDR',
  logo_url TEXT,
  favicon_url TEXT,
  social_media JSONB DEFAULT '{}'::jsonb,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Payment Settings
CREATE TABLE IF NOT EXISTS public.payment_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true NOT NULL,
  config JSONB DEFAULT '{}'::jsonb,
  display_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Shipping Settings
CREATE TABLE IF NOT EXISTS public.shipping_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true NOT NULL,
  config JSONB DEFAULT '{}'::jsonb,
  display_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Notification Settings
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true NOT NULL,
  email_template TEXT,
  sms_template TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ===============================
-- CONTENT RELATED TABLES
-- ===============================

-- Blog Posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_author_id_idx ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS blog_posts_is_published_idx ON public.blog_posts(is_published) WHERE is_published = TRUE;

-- Pages
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS pages_slug_idx ON public.pages(slug);

-- ===============================
-- PROMO & MARKETING TABLES
-- ===============================

-- Coupons
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(12, 2) NOT NULL,
  minimum_order_value DECIMAL(12, 2) DEFAULT 0,
  maximum_discount DECIMAL(12, 2),
  starts_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  applies_to_products TEXT[] DEFAULT '{}'::text[],
  applies_to_categories TEXT[] DEFAULT '{}'::text[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS coupons_code_idx ON public.coupons(code);
CREATE INDEX IF NOT EXISTS coupons_is_active_idx ON public.coupons(is_active) WHERE is_active = TRUE;

-- ===============================
-- TRIGGERS FOR UPDATED_AT
-- ===============================

-- Function to set updated_at to current timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables with updated_at column
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I;', t);
        EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION set_updated_at();', t);
    END LOOP;
END;
$$;

-- ===============================
-- DEFAULT DATA INSERTS
-- ===============================

-- Default Store Settings
INSERT INTO public.store_settings (
  store_name, 
  store_description, 
  contact_email, 
  currency, 
  meta_title, 
  meta_description
)
VALUES (
  'Agro Mandiri', 
  'Toko pertanian terlengkap dengan berbagai produk berkualitas',
  'info@agromandiri.com',
  'IDR',
  'Agro Mandiri - Toko Pertanian Terlengkap',
  'Jual berbagai produk pertanian berkualitas seperti pupuk, pestisida, benih, dan peralatan pertanian.'
)
ON CONFLICT DO NOTHING;

-- Default Main Categories
INSERT INTO public.categories (name, slug, description, is_active)
VALUES 
  ('Pupuk', 'pupuk', 'Berbagai jenis pupuk pertanian berkualitas', true),
  ('Pestisida', 'pestisida', 'Perlindungan tanaman dari hama dan penyakit', true),
  ('Benih', 'benih', 'Beragam benih unggul untuk hasil panen maksimal', true),
  ('Peralatan', 'peralatan', 'Peralatan dan perlengkapan pertanian modern', true)
ON CONFLICT DO NOTHING;

-- Default Payment Methods
INSERT INTO public.payment_settings (provider, display_name, description, is_enabled, config)
VALUES
  ('bank_transfer', 'Transfer Bank', 'Pembayaran menggunakan transfer bank manual', true, 
   '{"accounts": [
      {"bank_name": "Bank BCA", "account_number": "1234567890", "account_name": "PT Agro Mandiri"},
      {"bank_name": "Bank Mandiri", "account_number": "0987654321", "account_name": "PT Agro Mandiri"}
    ],
    "confirmation_required": true}'::jsonb),
  ('cash_on_delivery', 'Bayar di Tempat (COD)', 'Pembayaran dilakukan saat barang diterima', true, 
   '{"max_order_value": 2000000}'::jsonb)
ON CONFLICT DO NOTHING;

-- Default Shipping Methods
INSERT INTO public.shipping_settings (provider, display_name, description, is_enabled, config)
VALUES
  ('jne', 'JNE', 'Pengiriman menggunakan JNE Regular', true, 
   '{"service_types": ["REG", "YES", "OKE"]}'::jsonb),
  ('tiki', 'TIKI', 'Pengiriman menggunakan TIKI', true, 
   '{"service_types": ["REG", "ONS", "ECO"]}'::jsonb)
ON CONFLICT DO NOTHING;

-- Default Notification Types
INSERT INTO public.notification_settings (type, is_enabled, email_template, sms_template)
VALUES
  ('order_confirmation', true, 
   'Terima kasih telah berbelanja di Agro Mandiri. Pesanan Anda dengan nomor {{order_id}} telah kami terima dan sedang diproses.',
   'Pesanan #{{order_id}} di Agro Mandiri telah diterima. Terima kasih.'),
  ('shipping_notification', true, 
   'Pesanan Anda dengan nomor {{order_id}} telah dikirim melalui {{shipping_provider}} dengan nomor resi {{tracking_number}}.',
   'Pesanan #{{order_id}} telah dikirim via {{shipping_provider}}. No. resi: {{tracking_number}}')
ON CONFLICT DO NOTHING;

-- Default Product Attributes
INSERT INTO public.product_attributes (name, display_name, attribute_group)
VALUES
  -- Fertilizer attributes
  ('type', 'Jenis Pupuk', 'fertilizer'),
  ('benefits', 'Manfaat', 'fertilizer'),
  ('application', 'Cara Aplikasi', 'fertilizer'),
  ('composition', 'Komposisi', 'fertilizer'),
  
  -- Pesticide attributes
  ('pesticide_type', 'Jenis Pestisida', 'pesticide'),
  ('target_pests', 'Sasaran Hama', 'pesticide'),
  ('active_ingredient', 'Bahan Aktif', 'pesticide'),
  ('application_method', 'Metode Aplikasi', 'pesticide'),
  
  -- Seed attributes
  ('variety', 'Varietas', 'seed'),
  ('growing_period', 'Masa Tanam', 'seed'),
  ('yield_potential', 'Potensi Hasil', 'seed'),
  ('resistance', 'Ketahanan', 'seed'),
  
  -- Equipment attributes
  ('equipment_type', 'Jenis Alat', 'equipment'),
  ('material', 'Bahan', 'equipment'),
  ('power_source', 'Sumber Daya', 'equipment'),
  ('dimensions', 'Dimensi', 'equipment')
ON CONFLICT DO NOTHING;
