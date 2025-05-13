'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/client';
import { Content, ContentFormValues, ContentType } from '../types/content';
import { toast } from 'sonner';
import { slugify } from '@/lib/utils';

const CONTENT_QUERY_KEY = 'content';

export const useContent = (options?: { 
  type?: ContentType;
  published?: boolean;
  search?: string;
  enabled?: boolean 
}) => {
  const enabled = options?.enabled !== undefined ? options.enabled : true;
  
  return useQuery({
    queryKey: [CONTENT_QUERY_KEY, options],
    queryFn: async () => {
      try {
        let query = supabase
          .from('content')
          .select('*');
        
        if (options?.type) {
          query = query.eq('type', options.type);
        }
        
        if (options?.published !== undefined) {
          query = query.eq('is_published', options.published);
        }
        
        if (options?.search) {
          query = query.or(`title.ilike.%${options.search}%,content.ilike.%${options.search}%`);
        }
        
        query = query.order('created_at', { ascending: false });
        
        const { data, error } = await query;

        if (error) {
          if (error.code === '42P01' || error.message.includes('does not exist')) {
            console.log('Content table does not exist yet. Returning empty array.');
            return [];
          }
          
          console.error('Error fetching content:', error);
          throw error;
        }

        return (data || []) as unknown as Content[];
      } catch (error) {
        console.error('Error in useContent:', error);
        return [];
      }
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false
  });
};

export const useContentItem = (contentId: string | undefined, options?: { enabled?: boolean }) => {
  const enabled = options?.enabled !== undefined ? options.enabled : !!contentId;
  
  return useQuery({
    queryKey: [CONTENT_QUERY_KEY, contentId],
    queryFn: async () => {
      if (!contentId) return null;

      try {
        const { data, error } = await supabase
          .from('content')
          .select('*')
          .eq('id', contentId)
          .single();

        if (error) {
          if (error.code === '42P01' || error.message.includes('does not exist')) {
            console.log('Content table does not exist yet. Returning null.');
            return null;
          }
          
          console.error('Error fetching content item:', error);
          throw error;
        }

        return data as unknown as Content;
      } catch (error) {
        console.error('Error fetching content details:', error);
        return null;
      }
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false
  });
};

export const useCreateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ContentFormValues) => {
      try {
        // Generate slug if not provided
        if (!values.slug) {
          values.slug = slugify(values.title);
        }

        // Set published_at date if is_published is true
        const published_at = values.is_published ? new Date().toISOString() : null;

        const { data, error } = await supabase
          .from('content')
          .insert({
            ...values,
            published_at
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating content:', error);
          throw new Error(error.message || 'Failed to create content');
        }

        return data as unknown as Content;
      } catch (error) {
        console.error('Error in useCreateContent:', error);
        if (error instanceof Error) {
          throw new Error(error.message || 'An unknown error occurred');
        } else {
          throw new Error(`Failed to create content: ${String(error)}`);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTENT_QUERY_KEY] });
      toast.success('Konten berhasil ditambahkan');
    },
    onError: (error: Error) => {
      toast.error(`Gagal menambahkan konten: ${error.message || 'Unknown error'}`);
    },
  });
};

export const useUpdateContent = (contentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Partial<ContentFormValues>) => {
      try {
        // Create update data with the values
        const updateData = { ...values };
        
        // If content is being published, set published_at date
        if (values.is_published === true) {
          // Get current content to check if publish status changed
          const { data: currentContent } = await supabase
            .from('content')
            .select('is_published')
            .eq('id', contentId)
            .single();
            
          // If published status changed from false to true, update published_at
          if (currentContent && currentContent.is_published === false) {
            // Create a properly typed object that includes published_at
            const contentWithPublishedAt = {
              ...updateData,
              published_at: new Date().toISOString()
            };
            
            // Replace updateData with the properly typed object
            Object.assign(updateData, contentWithPublishedAt);
          }
        }
        
        // Update the content
        const { data, error } = await supabase
          .from('content')
          .update(updateData)
          .eq('id', contentId)
          .select()
          .single();

        if (error) {
          console.error('Error updating content:', error);
          throw new Error(error.message || 'Failed to update content');
        }

        return data as unknown as Content;
      } catch (error) {
        console.error('Error in useUpdateContent:', error);
        if (error instanceof Error) {
          throw new Error(error.message || 'An unknown error occurred');
        } else {
          throw new Error(`Failed to update content: ${String(error)}`);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTENT_QUERY_KEY, contentId] });
      queryClient.invalidateQueries({ queryKey: [CONTENT_QUERY_KEY] });
      toast.success('Konten berhasil diperbarui');
    },
    onError: (error: Error) => {
      toast.error(`Gagal memperbarui konten: ${error.message || 'Unknown error'}`);
    },
  });
};

export const useDeleteContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contentId: string) => {
      try {
        const { error } = await supabase
          .from('content')
          .delete()
          .eq('id', contentId);

        if (error) {
          console.error('Error deleting content:', error);
          throw new Error(error.message || 'Failed to delete content');
        }

        return contentId;
      } catch (error) {
        console.error('Error in useDeleteContent:', error);
        if (error instanceof Error) {
          throw new Error(error.message || 'An unknown error occurred');
        } else {
          throw new Error(`Failed to delete content: ${String(error)}`);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTENT_QUERY_KEY] });
      toast.success('Konten berhasil dihapus');
    },
    onError: (error: Error) => {
      toast.error(`Gagal menghapus konten: ${error.message || 'Unknown error'}`);
    },
  });
};
