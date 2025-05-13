'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/client';
import { Product, ProductFormValues, ProductImage } from '../types/models';
import { toast } from 'sonner';

const PRODUCTS_QUERY_KEY = 'products';

export const useProducts = (options?: { 
  categoryId?: string; 
  featured?: boolean; 
  active?: boolean;
  enabled?: boolean 
}) => {
  const enabled = options?.enabled !== undefined ? options.enabled : true;
  
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, options],
    queryFn: async () => {
      try {
        // Simple query without joins to avoid potential errors
        let query = supabase
          .from('products')
          .select('*');

        if (options?.categoryId) {
          query = query.eq('category_id', options.categoryId);
        }

        if (options?.featured !== undefined) {
          query = query.eq('is_featured', options.featured);
        }

        if (options?.active !== undefined) {
          query = query.eq('is_active', options.active);
        }

        const { data, error } = await query;

        if (error) {
          if (error.code === '42P01' || error.message.includes('does not exist')) {
            console.log('Products table does not exist yet. Returning empty array.');
            return [];
          }
          
          console.error('Error fetching products:', error);
          throw error;
        }

        // Get categories for products if needed (in a separate query)
        const productIds = data.map(product => product.id);
        let categoryMap: Record<string, { id: string; name: string; slug: string }> = {};
        
        if (productIds.length > 0) {
          try {
            // Only fetch categories if we have products
            const categoriesQuery = await supabase
              .from('categories')
              .select('id, name, slug');
            
            if (!categoriesQuery.error && categoriesQuery.data) {
              categoryMap = categoriesQuery.data.reduce((acc, cat) => {
                acc[cat.id] = cat;
                return acc;
              }, {});
            }
          } catch (err) {
            console.log('Error fetching categories for products:', err);
            // Continue without categories
          }
        }

        // Map to expected Product structure
        return (data || []).map(product => ({
          // Explicitly type each field according to the Product interface
          id: product.id,
          name: product.name,
          description: product.description || '',
          slug: product.slug,
          price: product.price,
          sale_price: product.sale_price,
          stock_quantity: product.stock_quantity,
          category_id: product.category_id,
          sku: product.sku || '',
          is_active: product.is_active !== undefined ? product.is_active : true,
          is_featured: product.is_featured !== undefined ? product.is_featured : false,
          weight: product.weight || null,
          dimensions: product.dimensions || '',
          brand: product.brand || '',
          created_at: product.created_at,
          updated_at: product.updated_at,
          main_image_url: product.main_image_url || '',
          // Safely lookup category from the properly typed map
          category: product.category_id ? categoryMap[product.category_id] || null : null,
          images: [],
          // Add these fields to match the Product interface
          meta_title: product.meta_title || null,
          meta_description: product.meta_description || null,
          keywords: product.keywords || null
        })) as unknown as Product[];
      } catch (error) {
        console.error('Error in useProducts:', error);
        return [];
      }
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false
  });
};

export const useProduct = (productId: string | undefined, options?: { enabled?: boolean }) => {
  const enabled = options?.enabled !== undefined ? options.enabled : !!productId;
  
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, productId],
    queryFn: async () => {
      if (!productId) return null;

      try {
        // Get base product data
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (productError) {
          if (productError.code === '42P01' || productError.message.includes('does not exist')) {
            console.log('Products table does not exist yet. Returning null.');
            return null;
          }
          
          console.error('Error fetching product:', productError);
          throw productError;
        }

        // Get category data separately
        let categoryData = null;
        if (productData.category_id) {
          try {
            const { data: category, error: categoryError } = await supabase
              .from('categories')
              .select('id, name, slug')
              .eq('id', productData.category_id)
              .single();
            
            if (!categoryError && category) {
              categoryData = category;
            }
          } catch (err) {
            console.log('Category data could not be fetched:', err);
            // Continue without category data
          }
        }

        // Get product images separately
        let productImages: ProductImage[] = [];
        try {
          const { data: images, error: imagesError } = await supabase
            .from('product_images')
            .select('*')
            .eq('product_id', productId);
          
          if (!imagesError && images) {
            productImages = images.map(img => ({
              id: img.id,
              product_id: img.product_id,
              image_url: img.image_url,
              alt_text: img.alt_text || '',
              display_order: img.display_order || 0,
              is_primary: img.is_primary || false,
              // Add missing fields required by ProductImage interface
              created_at: img.created_at || new Date().toISOString(),
              updated_at: img.updated_at || new Date().toISOString() 
            }));
          }
        } catch (err) {
          console.log('Product images could not be fetched:', err);
          // Continue without images
        }

        // Return mapped product with related data
        return {
          ...productData,
          description: productData.description || '',
          stock_quantity: productData.stock_quantity || 0,
          is_active: productData.is_active !== undefined ? productData.is_active : true,
          is_featured: productData.is_featured !== undefined ? productData.is_featured : false,
          sku: productData.sku || '',
          weight: productData.weight || null,
          dimensions: productData.dimensions || '',
          brand: productData.brand || '',
          main_image_url: productData.main_image_url || '',
          category: categoryData,
          images: productImages
        } as Product;
      } catch (error) {
        console.error('Error fetching product details:', error);
        return null;
      }
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 5,
    retry: false
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ProductFormValues) => {
      try {
        // Clean the data before sending to Supabase
        // Convert "none" category_id to null
        if (values.category_id === "none") {
          values.category_id = null;
        }

        // Create the product record
        const { data, error } = await supabase
          .from('products')
          .insert({
            name: values.name,
            description: values.description,
            slug: values.slug,
            price: values.price,
            sale_price: values.sale_price || null,
            stock_quantity: values.stock_quantity,
            category_id: values.category_id || null,
            sku: values.sku || null,
            is_active: values.is_active,
            is_featured: values.is_featured,
            weight: values.weight || null,
            dimensions: values.dimensions || null,
            brand: values.brand || null,
            main_image_url: values.main_image_url || null
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating product:', error);
          throw new Error(error.message || 'Failed to create product');
        }

        return data as Product;
      } catch (error) {
        console.error('Error in useCreateProduct:', error);
        // Ensure we always have a meaningful error message
        if (error instanceof Error) {
          throw new Error(error.message || 'An unknown error occurred');
        } else {
          throw new Error('Failed to create product');
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      toast.success('Produk berhasil ditambahkan');
    },
    onError: (error: Error) => {
      toast.error(`Gagal menambahkan produk: ${error.message || 'Unknown error'}`);
    },
  });
};

export const useUpdateProduct = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: Partial<ProductFormValues>) => {
      try {
        console.log('Original product data received:', JSON.stringify(productData));
        
        // Create a clean object with only the fields that exist in the database table
        const cleanedData: Record<string, unknown> = {};
        
        // Define fields that exist in the database (must match exactly with DB column names)
        // This list should be kept in sync with the actual database schema from database.types.ts
        const allowedFields = [
          'name', 'description', 'price', 'sale_price', 'stock_quantity',
          'is_featured', 'is_active', 'category_id', 'sku', 'weight',
          'dimensions', 'brand', 'main_image_url', 'slug',
          'meta_title', 'meta_description', 'keywords'
        ];
        
        // Explicitly remove unit_type since it exists in the form but not in the database
        // Explicitly remove unit_type since it exists in the form but not in the database
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { unit_type, ...dataWithoutUnitType } = productData;
        
        // Copy only the allowed fields, checking for undefined
        for (const field of allowedFields) {
          // Only add fields that exist in the input data and are not undefined
          if (field in dataWithoutUnitType && dataWithoutUnitType[field as keyof typeof dataWithoutUnitType] !== undefined) {
            cleanedData[field] = dataWithoutUnitType[field as keyof typeof dataWithoutUnitType];
          }
        }
        
        // Special case handling for certain fields
        if (cleanedData.category_id === "none") {
          cleanedData.category_id = null;
        }
        
        // Add slug if it was in the form data but not copied (might be dynamically generated)
        if (productData.slug && !cleanedData.slug) {
          cleanedData.slug = productData.slug;
        }
        
        console.log('Updating product:', productId, 'with data:', cleanedData);
        
        // First verify the product exists
        const { data: existingProduct, error: checkError } = await supabase
          .from('products')
          .select('id')
          .eq('id', productId)
          .maybeSingle();
        
        if (checkError) {
          console.error('Error checking if product exists:', JSON.stringify(checkError));
          throw new Error(`Failed to verify product exists: ${checkError.message}`);
        }
        
        if (!existingProduct) {
          console.error('Product not found with ID:', productId);
          throw new Error(`Product with ID ${productId} not found`);
        }
        
        // Log the final data being sent to the database
        console.log('FINAL data being sent to database:', JSON.stringify(cleanedData));
        
        // Update the product details
        const { data, error } = await supabase
          .from('products')
          .update(cleanedData)
          .eq('id', productId)
          .select('*');

        // Log the response to verify what's being returned
        console.log('Update response from database:', JSON.stringify(data));

        if (error) {
          console.error('Error updating product:', JSON.stringify(error));
          throw new Error(`Failed to update product: ${error.message || JSON.stringify(error)}`);
        }

        return data as Product;
      } catch (error) {
        console.error('Error in useUpdateProduct:', error instanceof Error ? error.message : String(error));
        // Ensure we always have a meaningful error message
        if (error instanceof Error) {
          throw new Error(`Error updating product: ${error.message}`);
        } else {
          throw new Error(`Error updating product: ${String(error) || 'Unknown error'}`);
        }
      }
    },
    onSuccess: (updatedProduct) => {
      console.log('Update succeeded, updating cache with:', updatedProduct);
      
      // Force refetch data by invalidating both the specific product and the products list
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY, productId] });
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      
      // Also directly update the cache for immediate UI update
      queryClient.setQueryData([PRODUCTS_QUERY_KEY, productId], updatedProduct);
      
      // Update the product in the list cache if it exists
      const productsCache = queryClient.getQueryData([PRODUCTS_QUERY_KEY]);
      if (productsCache && Array.isArray(productsCache)) {
        const updatedProducts = productsCache.map(product => 
          product.id === productId ? updatedProduct : product
        );
        queryClient.setQueryData([PRODUCTS_QUERY_KEY], updatedProducts);
      }
      
      toast.success('Produk berhasil diperbarui');
    },
    onError: (error: Error) => {
      const errorMessage = error?.message || 'Unknown error';
      console.error('Product update error:', errorMessage);
      toast.error(`Gagal memperbarui produk: ${errorMessage}`);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      try {
        // First delete associated images from storage
        const { data: images, error: imagesError } = await supabase
          .from('product_images')
          .select('image_url')
          .eq('product_id', productId);
        
        if (imagesError) {
          // Log but continue - the table might not exist yet
          console.log('Could not fetch product images, continuing with deletion:', imagesError);
        }
        
        if (images && images.length > 0) {
          // Try to delete images from storage
          for (const image of images) {
            try {
              const imagePath = image.image_url.split('/').pop();
              if (imagePath) {
                await supabase.storage
                  .from('product-images')
                  .remove([`products/${productId}/${imagePath}`]);
              }
            } catch (err) {
              // Log but continue with product deletion
              console.log('Error deleting image, continuing with product deletion:', err);
            }
          }
        }
        
        // Delete the product (cascade will handle deleting product_images in the database)
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);

        if (error) {
          console.error('Error deleting product:', error);
          throw new Error(error.message || 'Failed to delete product');
        }

        return productId;
      } catch (error) {
        console.error('Error in useDeleteProduct:', error);
        // Ensure we always have a meaningful error message
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error(`Failed to delete product: ${String(error)}`);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      toast.success('Produk berhasil dihapus');
    },
    onError: (error: Error) => {
      toast.error(`Gagal menghapus produk: ${error.message || 'Unknown error'}`);
    },
  });
};
