'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/client';
import { Category, CategoryFormValues } from '../types/models';
import { toast } from 'sonner';

const CATEGORIES_QUERY_KEY = 'categories';

export const useCategories = (options?: { active?: boolean; parentId?: string | null; enabled?: boolean }) => {
  const enabled = options?.enabled !== undefined ? options.enabled : true;
  
  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY, options],
    queryFn: async () => {
      try {
        let query = supabase
          .from('categories')
          .select('*');

        if (options?.active !== undefined) {
          query = query.eq('is_active', options.active);
        }

        if (options?.parentId !== undefined) {
          if (options.parentId === null) {
            query = query.is('parent_id', null);
          } else {
            query = query.eq('parent_id', options.parentId);
          }
        }

        // Check if display_order exists in your schema, if not use name for sorting
        const sortField = 'name'; // Safest option based on your schema
        const { data, error } = await query.order(sortField, { ascending: true });

        if (error) {
          // Handle specific error codes
          if (error.code === '42P01' || error.message.includes('does not exist')) {
            console.log('Categories table does not exist yet. Returning empty array.');
            return [];
          }
          
          console.error('Error fetching categories:', error);
          throw error;
        }

        // Map to ensure compatibility with the expected Category type
        return (data || []).map(category => ({
          id: category.id,
          name: category.name,
          description: category.description || null,
          slug: category.slug,
          image_url: category.image_url || null,
          parent_id: category.parent_id,
          is_active: category.is_active !== undefined ? category.is_active : true,
          display_order: category.display_order || 0,
          meta_title: category.meta_title || null,
          meta_description: category.meta_description || null,
          created_at: category.created_at,
          updated_at: category.updated_at,
          children: [] // Initialize with empty children array
        })) as unknown as Category[];
      } catch (error) {
        console.error('Error fetching categories:', error);
        return []; // Return empty array instead of throwing
      }
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false // Don't retry failed queries
  });
};

export const useCategory = (categoryId: string | undefined, options?: { enabled?: boolean }) => {
  const enabled = options?.enabled !== undefined ? options.enabled : !!categoryId;
  
  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY, categoryId],
    queryFn: async () => {
      if (!categoryId) return null;

      try {
        // Simple query without joins first
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('id', categoryId)
          .single();

        if (error) {
          if (error.code === '42P01' || error.message.includes('does not exist')) {
            console.log('Categories table does not exist yet. Returning null.');
            return null;
          }
          
          console.error('Error fetching category:', error);
          throw error;
        }

        // Get parent category if needed
        let parentCategory: Category | null = null;
        if (data.parent_id) {
          try {
            const { data: parentData, error: parentError } = await supabase
              .from('categories')
              .select('*') // Get all fields
              .eq('id', data.parent_id)
              .single();
            
            if (!parentError && parentData) {
              // Map to full Category interface
              parentCategory = {
                id: parentData.id,
                name: parentData.name,
                description: parentData.description || null,
                slug: parentData.slug,
                image_url: parentData.image_url || null,
                parent_id: parentData.parent_id,
                is_active: parentData.is_active !== undefined ? parentData.is_active : true,
                display_order: parentData.display_order || 0,
                meta_title: parentData.meta_title || null,
                meta_description: parentData.meta_description || null,
                created_at: parentData.created_at,
                updated_at: parentData.updated_at
                // No need to include children or parent here
              };
            }
          } catch (err) {
            console.log('Parent category could not be fetched:', err);
            // Continue without parent data
          }
        }

        // Return properly mapped category
        return {
          id: data.id,
          name: data.name,
          description: data.description || null,
          slug: data.slug,
          image_url: data.image_url || null,
          parent_id: data.parent_id,
          is_active: data.is_active !== undefined ? data.is_active : true,
          display_order: data.display_order || 0,
          meta_title: data.meta_title || null,
          meta_description: data.meta_description || null,
          created_at: data.created_at,
          updated_at: data.updated_at,
          parent: parentCategory,
          children: []
        } as Category;
      } catch (error) {
        console.error('Error fetching category details:', error);
        return null;
      }
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 5,
    retry: false
  });
};

export const useCategoryTree = (options?: { enabled?: boolean }) => {
  const enabled = options?.enabled !== undefined ? options.enabled : true;
  
  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY, 'tree'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          if (error.code === '42P01' || error.message.includes('does not exist')) {
            console.log('Categories table does not exist yet. Returning empty array.');
            return [];
          }
          
          console.error('Error fetching category tree:', error);
          throw error;
        }

        // Build the category tree with proper error handling
        const categories = (data || []).map(category => ({
          id: category.id,
          name: category.name,
          description: category.description || null,
          slug: category.slug,
          image_url: category.image_url || null,
          parent_id: category.parent_id,
          is_active: category.is_active !== undefined ? category.is_active : true,
          display_order: category.display_order || 0,
          meta_title: category.meta_title || null,
          meta_description: category.meta_description || null,
          created_at: category.created_at,
          updated_at: category.updated_at,
          children: []
        })) as unknown as Category[];
        
        const categoryMap = new Map<string, Category>();
        const rootCategories: Category[] = [];

        // Create a map for quick lookup
        categories.forEach(category => {
          categoryMap.set(category.id, {
            ...category,
            children: [],
          });
        });

        // Build the tree structure
        categories.forEach(category => {
          const categoryWithChildren = categoryMap.get(category.id)!;
          
          if (category.parent_id) {
            const parent = categoryMap.get(category.parent_id);
            if (parent) {
              parent.children = parent.children || [];
              parent.children.push(categoryWithChildren);
            } else {
              // If parent doesn't exist, treat as root
              rootCategories.push(categoryWithChildren);
            }
          } else {
            rootCategories.push(categoryWithChildren);
          }
        });

        return rootCategories;
      } catch (error) {
        console.error('Error building category tree:', error);
        return []; // Return empty array instead of throwing
      }
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 5,
    retry: false
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .insert({
            name: values.name,
            description: values.description,
            slug: values.slug,
            image_url: values.image_url,
            parent_id: values.parent_id || null
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating category:', error);
          throw error;
        }

        return data as Category;
      } catch (error) {
        console.error('Error in createCategory mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      toast.success('Kategori berhasil dibuat');
    },
    onError: (error: Error) => {
      toast.error(`Gagal membuat kategori: ${error.message}`);
    },
  });
};

export const useUpdateCategory = (categoryId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .update({
            name: values.name,
            description: values.description,
            slug: values.slug,
            image_url: values.image_url,
            parent_id: values.parent_id || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', categoryId)
          .select()
          .single();

        if (error) {
          console.error('Error updating category:', error);
          throw error;
        }

        return data as Category;
      } catch (error) {
        console.error('Error in updateCategory mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      toast.success('Kategori berhasil diperbarui');
    },
    onError: (error: Error) => {
      toast.error(`Gagal memperbarui kategori: ${error.message}`);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', categoryId);

        if (error) {
          console.error('Error deleting category:', error);
          throw error;
        }

        return { success: true };
      } catch (error) {
        console.error('Error in deleteCategory mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      toast.success('Kategori berhasil dihapus');
    },
    onError: (error: Error) => {
      toast.error(`Gagal menghapus kategori: ${error.message}`);
    },
  });
};
