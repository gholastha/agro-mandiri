export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  orders_count?: number;
  total_spent?: number;
}

export enum CustomerStatus {
  Active = 'active',
  Inactive = 'inactive',
  Blocked = 'blocked'
}

export interface CustomerFormValues {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  status?: CustomerStatus;
}
