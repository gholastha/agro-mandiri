'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/client';
import { 
  StoreSetting, 
  PaymentSetting, 
  ShippingSetting, 
  NotificationSetting,
  SettingCategory,
  StoreSettingFormValues
} from '../types/settings';
import { toast } from 'sonner';

const SETTINGS_QUERY_KEY = 'settings';

// Store Settings
export const useStoreSettings = (options?: { enabled?: boolean }) => {
  const enabled = options?.enabled !== undefined ? options.enabled : true;
  
  return useQuery({
    queryKey: [SETTINGS_QUERY_KEY, 'store'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('*')
          .single();

        if (error) {
          if (error.code === '42P01' || error.message.includes('does not exist')) {
            console.log('Store settings table does not exist yet. Returning null.');
            return null;
          }
          
          console.error('Error fetching store settings:', error);
          throw error;
        }

        return data as StoreSetting;
      } catch (error) {
        console.error('Error in useStoreSettings:', error);
        return null;
      }
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: false
  });
};

export const useUpdateStoreSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: StoreSettingFormValues) => {
      try {
        // Check if store settings exists
        const { data: existingSettings, error: checkError } = await supabase
          .from('store_settings')
          .select('id')
          .single();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = No rows returned
          console.error('Error checking store settings:', checkError);
          throw new Error(checkError.message || 'Failed to check store settings');
        }

        let result;
        
        if (existingSettings?.id) {
          // Update existing settings
          const { data, error } = await supabase
            .from('store_settings')
            .update(values)
            .eq('id', existingSettings.id)
            .select()
            .single();

          if (error) {
            console.error('Error updating store settings:', error);
            throw new Error(error.message || 'Failed to update store settings');
          }
          
          result = data;
        } else {
          // Create new settings
          const { data, error } = await supabase
            .from('store_settings')
            .insert(values)
            .select()
            .single();

          if (error) {
            console.error('Error creating store settings:', error);
            throw new Error(error.message || 'Failed to create store settings');
          }
          
          result = data;
        }

        return result as StoreSetting;
      } catch (error: any) {
        console.error('Error in useUpdateStoreSettings:', error);
        if (typeof error === 'object' && error !== null) {
          throw new Error(error.message || 'An unknown error occurred');
        } else {
          throw new Error('Failed to update store settings');
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SETTINGS_QUERY_KEY, 'store'] });
      toast.success('Pengaturan toko berhasil disimpan');
    },
    onError: (error: any) => {
      toast.error(`Gagal menyimpan pengaturan toko: ${error.message || 'Unknown error'}`);
    },
  });
};

// Payment Settings
export const usePaymentSettings = (options?: { enabled?: boolean }) => {
  const enabled = options?.enabled !== undefined ? options.enabled : true;
  
  return useQuery({
    queryKey: [SETTINGS_QUERY_KEY, 'payment'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('payment_settings')
          .select('*')
          .order('display_name', { ascending: true });

        if (error) {
          if (error.code === '42P01' || error.message.includes('does not exist')) {
            console.log('Payment settings table does not exist yet. Returning empty array.');
            return [];
          }
          
          console.error('Error fetching payment settings:', error);
          throw error;
        }

        return (data || []) as PaymentSetting[];
      } catch (error) {
        console.error('Error in usePaymentSettings:', error);
        return [];
      }
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: false
  });
};

// Shipping Settings
export const useShippingSettings = (options?: { enabled?: boolean }) => {
  const enabled = options?.enabled !== undefined ? options.enabled : true;
  
  return useQuery({
    queryKey: [SETTINGS_QUERY_KEY, 'shipping'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('shipping_settings')
          .select('*')
          .order('display_name', { ascending: true });

        if (error) {
          if (error.code === '42P01' || error.message.includes('does not exist')) {
            console.log('Shipping settings table does not exist yet. Returning empty array.');
            return [];
          }
          
          console.error('Error fetching shipping settings:', error);
          throw error;
        }

        return (data || []) as ShippingSetting[];
      } catch (error) {
        console.error('Error in useShippingSettings:', error);
        return [];
      }
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: false
  });
};

// Notification Settings
export const useNotificationSettings = (options?: { enabled?: boolean }) => {
  const enabled = options?.enabled !== undefined ? options.enabled : true;
  
  return useQuery({
    queryKey: [SETTINGS_QUERY_KEY, 'notification'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('notification_settings')
          .select('*')
          .order('type', { ascending: true });

        if (error) {
          if (error.code === '42P01' || error.message.includes('does not exist')) {
            console.log('Notification settings table does not exist yet. Returning empty array.');
            return [];
          }
          
          console.error('Error fetching notification settings:', error);
          throw error;
        }

        return (data || []) as NotificationSetting[];
      } catch (error) {
        console.error('Error in useNotificationSettings:', error);
        return [];
      }
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: false
  });
};
