// Core model types for the application

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  stock_quantity: number;
  unit_type: string;
  is_featured: boolean;
  is_active: boolean;
  category_id: string | null;
  sku: string | null;
  weight: number | null;
  dimensions: string | null;
  brand: string | null;
  meta_title: string | null;
  meta_description: string | null;
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
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
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
export interface ProductFormValues {
  name: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  stock_quantity: number;
  unit_type: string;
  is_featured: boolean;
  is_active: boolean;
  category_id: string | null;
  sku: string | null;
  weight: number | null;
  dimensions: string | null;
  brand: string | null;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string | null;
}

export interface CategoryFormValues {
  name: string;
  description: string | null;
  parent_id: string | null;
  is_active: boolean;
  display_order: number;
  meta_title: string | null;
  meta_description: string | null;
}

export interface ProductImageFormValues {
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
}
