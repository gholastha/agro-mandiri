// Core model types for the application

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  category_id: string | null;
  sku: string | null;
  weight: number | null;
  dimensions: string | null;
  brand: string | null;
  main_image_url: string | null;
  // These fields are in the form but not stored directly in products table
  unit_type?: string; // Used for display, might be extracted from description
  keywords: string | null;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  category?: Category;
  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  // For UI only - not stored in database
  local_only?: boolean;
  // For duplicate detection
  file_hash?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  parent?: Category;
  children?: Category[];
}

// Form interfaces for validation
// This is a form interface used for UI validation and doesn't need to exactly match the database schema
export interface ProductFormValues {
  name: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  stock_quantity: number;
  // Note: unit_type is used in the form but isn't stored in the database
  unit_type: string;
  is_featured: boolean;
  is_active: boolean;
  category_id: string | null;
  sku: string | null;
  weight: number | null;
  dimensions: string | null;
  brand: string | null;
  keywords: string | null; // For SEO purposes
  // Additional fields for form processing
  slug?: string;
  main_image_url?: string | null;
  images?: ProductImage[]; // For handling image uploads
}

export interface CategoryFormValues {
  name: string;
  description: string | null;
  parent_id: string | null;
  is_active: boolean;
  display_order: number;
  meta_title: string | null;
  meta_description: string | null;
  slug: string;
  image_url: string | null;
}

export interface ProductImageFormValues {
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
}
