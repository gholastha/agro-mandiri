-- Add SEO-related columns to products table
ALTER TABLE IF EXISTS products 
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS keywords TEXT;

-- Update RLS policies to include new columns
-- This ensures the policies apply to the new columns
ALTER POLICY "Allow authenticated users to update products" ON products USING (true) WITH CHECK (true);
