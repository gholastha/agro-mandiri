'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/client';
import { Customer, CustomerFormValues } from '../types/customers';
import { toast } from 'sonner';

const CUSTOMERS_QUERY_KEY = 'customers';

export const useCustomers = (options?: { 
  status?: string;
  search?: string;
  enabled?: boolean 
}) => {
  const enabled = options?.enabled !== undefined ? options.enabled : true;
  
  return useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, options],
    queryFn: async () => {
      try {
        // Query the profiles table which contains customer information
        let query = supabase
          .from('profiles')
          .select('*');
        
        if (options?.status) {
          query = query.eq('status', options.status);
        }
        
        if (options?.search) {
          query = query.or(`first_name.ilike.%${options.search}%,last_name.ilike.%${options.search}%,email.ilike.%${options.search}%`);
        }
        
        const { data, error } = await query;

        if (error) {
          if (error.code === '42P01' || error.message.includes('does not exist')) {
            console.log('Profiles table does not exist yet. Returning empty array.');
            return [];
          }
          
          console.error('Error fetching customers:', error);
          throw error;
        }

        // Try to get order counts for each customer
        let customerOrderCounts: Record<string, number> = {};
        let customerTotalSpent: Record<string, number> = {};
        
        try {
          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('user_id, status, total_amount');
            
          if (!orderError && orderData) {
            // Count orders by user_id
            orderData.forEach(order => {
              if (order.user_id) {
                customerOrderCounts[order.user_id] = (customerOrderCounts[order.user_id] || 0) + 1;
                
                // Only count completed orders for total spent
                if (order.status === 'completed' && order.total_amount) {
                  customerTotalSpent[order.user_id] = (customerTotalSpent[order.user_id] || 0) + Number(order.total_amount);
                }
              }
            });
          }
        } catch (err) {
          console.log('Error fetching order data for customers:', err);
          // Continue without order data
        }

        // Map to expected Customer structure
        return (data || []).map(profile => ({
          id: profile.id,
          email: profile.email || '',
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          phone: profile.phone || '',
          avatar_url: profile.avatar_url || '',
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          orders_count: customerOrderCounts[profile.id] || 0,
          total_spent: customerTotalSpent[profile.id] || 0
        })) as Customer[];
      } catch (error) {
        console.error('Error in useCustomers:', error);
        return [];
      }
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false
  });
};

export const useCustomer = (customerId: string | undefined, options?: { enabled?: boolean }) => {
  const enabled = options?.enabled !== undefined ? options.enabled : !!customerId;
  
  return useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, customerId],
    queryFn: async () => {
      if (!customerId) return null;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', customerId)
          .single();

        if (error) {
          if (error.code === '42P01' || error.message.includes('does not exist')) {
            console.log('Profiles table does not exist yet. Returning null.');
            return null;
          }
          
          console.error('Error fetching customer:', error);
          throw error;
        }

        // Get order count and total spent
        let ordersCount = 0;
        let totalSpent = 0;
        
        try {
          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('status, total_amount')
            .eq('user_id', customerId);
            
          if (!orderError && orderData) {
            ordersCount = orderData.length;
            
            // Calculate total spent from completed orders
            totalSpent = orderData
              .filter(order => order.status === 'completed')
              .reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);
          }
        } catch (err) {
          console.log('Error fetching order data for customer:', err);
          // Continue without order data
        }

        return {
          id: data.id,
          email: data.email || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          avatar_url: data.avatar_url || '',
          created_at: data.created_at,
          updated_at: data.updated_at,
          orders_count: ordersCount,
          total_spent: totalSpent
        } as Customer;
      } catch (error) {
        console.error('Error fetching customer details:', error);
        return null;
      }
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false
  });
};

export const useUpdateCustomer = (customerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customerData: Partial<CustomerFormValues>) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update(customerData)
          .eq('id', customerId)
          .select()
          .single();

        if (error) {
          console.error('Error updating customer:', error);
          throw new Error(error.message || 'Failed to update customer');
        }

        return data as Customer;
      } catch (error: any) {
        console.error('Error in useUpdateCustomer:', error);
        if (typeof error === 'object' && error !== null) {
          throw new Error(error.message || 'An unknown error occurred');
        } else {
          throw new Error('Failed to update customer');
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY, customerId] });
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY] });
      toast.success('Pelanggan berhasil diperbarui');
    },
    onError: (error: any) => {
      toast.error(`Gagal memperbarui pelanggan: ${error.message || 'Unknown error'}`);
    },
  });
};
