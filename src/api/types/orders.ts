export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  shipping_address: string;
  payment_method: string;
  payment_status: PaymentStatus;
  shipping_method: string;
  shipping_cost: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  customer?: Customer;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  subtotal: number;
  product_name: string;
  product_image?: string;
}

export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'canceled';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded';

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: 'Menunggu',
  processing: 'Diproses',
  shipped: 'Dikirim',
  delivered: 'Diterima',
  canceled: 'Dibatalkan'
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: 'Menunggu Pembayaran',
  paid: 'Lunas',
  failed: 'Gagal',
  refunded: 'Dikembalikan'
};

// Color variants for status badges
export const orderStatusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-500',
  processing: 'bg-blue-500',
  shipped: 'bg-indigo-500',
  delivered: 'bg-green-500',
  canceled: 'bg-red-500'
};

export const paymentStatusColors: Record<PaymentStatus, string> = {
  pending: 'bg-yellow-500',
  paid: 'bg-green-500',
  failed: 'bg-red-500',
  refunded: 'bg-purple-500'
};
