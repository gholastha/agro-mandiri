'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/client';
import { Order, OrderStatus, PaymentStatus, orderStatusLabels, paymentStatusLabels } from '../types/orders';
import { toast } from 'sonner';

const ORDERS_QUERY_KEY = 'orders';

export const useOrders = (options?: { status?: OrderStatus; limit?: number; enabled?: boolean }) => {
  const enabled = options?.enabled !== undefined ? options.enabled : true;
  
  return useQuery({
    queryKey: [ORDERS_QUERY_KEY, options],
    queryFn: async () => {
      try {
        // Simple query without trying to join tables that might not exist yet
        let query = supabase
          .from('orders')
          .select('*');

        if (options?.status) {
          query = query.eq('status', options.status);
        }

        if (options?.limit) {
          query = query.limit(options.limit);
        }

        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) {
          // Check for specific error codes or messages that indicate the table doesn't exist
          if (error.code === '42P01' || error.message.includes('does not exist')) {
            console.log('Orders table does not exist yet. Returning empty array.');
            return [];
          }
          
          console.error('Error fetching orders:', error);
          throw error;
        }

        // Map the database response to our expected Order type
        // This makes the code more resilient to schema differences
        return (data || []).map(order => ({
          id: order.id,
          user_id: order.user_id,
          status: order.status as OrderStatus,
          total_amount: order.total_amount,
          shipping_address: `${order.shipping_address}, ${order.shipping_city}, ${order.shipping_province} ${order.shipping_postal_code}`,
          payment_method: order.payment_method,
          payment_status: order.payment_status as PaymentStatus,
          shipping_method: order.shipping_method,
          shipping_cost: order.shipping_fee || 0,
          notes: order.notes,
          created_at: order.created_at,
          updated_at: order.updated_at,
          items: [], // Initialize with empty items, will be fetched separately if needed
          customer: null // Will be fetched separately if needed
        })) as Order[];
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Return empty array instead of throwing to prevent app crashes
        return [];
      }
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry failed queries 
  });
};

export const useOrder = (orderId: string | undefined, options?: { enabled?: boolean }) => {
  const enabled = options?.enabled !== undefined ? options.enabled : !!orderId;
  
  return useQuery({
    queryKey: [ORDERS_QUERY_KEY, orderId],
    queryFn: async () => {
      if (!orderId) return null;

      try {
        // First, get the basic order data
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderError) {
          if (orderError.code === '42P01' || orderError.message.includes('does not exist')) {
            console.log('Orders table does not exist yet. Returning null.');
            return null;
          }
          
          console.error('Error fetching order:', orderError);
          throw orderError;
        }

        // Try to get user profile data if it exists
        let customerData = null;
        if (orderData.user_id) {
          try {
            const { data: userData, error: userError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', orderData.user_id)
              .single();
            
            if (!userError && userData) {
              customerData = {
                id: userData.id,
                email: userData.email || '',
                first_name: userData.full_name?.split(' ')[0] || '',
                last_name: userData.full_name?.split(' ').slice(1).join(' ') || '',
                phone: userData.phone_number || '',
              };
            }
          } catch (error) {
            console.log('Customer data could not be fetched:', error);
            // Continue without customer data
          }
        }

        // Try to get order items if the table exists
        let orderItems = [];
        try {
          const { data: itemsData, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderId);
          
          if (!itemsError && itemsData) {
            orderItems = itemsData.map(item => ({
              id: item.id,
              order_id: item.order_id,
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.subtotal,
              product_name: item.product_name,
              product_image: item.product_image
            }));
          }
        } catch (error) {
          console.log('Order items could not be fetched:', error);
          // Continue without order items
        }

        // Map database response to our Order type
        return {
          id: orderData.id,
          user_id: orderData.user_id,
          status: orderData.status as OrderStatus,
          total_amount: orderData.total_amount,
          shipping_address: `${orderData.shipping_address}, ${orderData.shipping_city}, ${orderData.shipping_province} ${orderData.shipping_postal_code}`,
          payment_method: orderData.payment_method,
          payment_status: orderData.payment_status as PaymentStatus,
          shipping_method: orderData.shipping_method,
          shipping_cost: orderData.shipping_fee || 0,
          notes: orderData.notes,
          created_at: orderData.created_at,
          updated_at: orderData.updated_at,
          items: orderItems,
          customer: customerData
        } as Order;
      } catch (error) {
        console.error('Error fetching order details:', error);
        return null;
      }
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      orderId, 
      status 
    }: { 
      orderId: string; 
      status: OrderStatus 
    }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Error updating order status:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY, data.id] });
      toast.success(`Status pesanan berhasil diperbarui menjadi: ${orderStatusLabels[data.status as OrderStatus]}`);
    },
    onError: (error) => {
      toast.error(`Gagal memperbarui status pesanan: ${error.message}`);
    },
  });
};

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      orderId, 
      paymentStatus 
    }: { 
      orderId: string; 
      paymentStatus: PaymentStatus 
    }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          payment_status: paymentStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Error updating payment status:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY, data.id] });
      toast.success(`Status pembayaran berhasil diperbarui menjadi: ${paymentStatusLabels[data.payment_status as PaymentStatus]}`);
    },
    onError: (error) => {
      toast.error(`Gagal memperbarui status pembayaran: ${error.message}`);
    },
  });
};
