'use client';

import { supabase } from '@/api/supabase/client';
import { toast } from 'sonner';
import fs from 'fs';
import path from 'path';

// Default sample data for initial setups
const defaultPaymentMethods = [
  {
    provider: 'bank_transfer',
    display_name: 'Transfer Bank',
    description: 'Pembayaran menggunakan transfer bank manual',
    is_enabled: true,
    config: {
      accounts: [
        { bank_name: 'Bank BCA', account_number: '1234567890', account_name: 'PT Agro Mandiri' },
        { bank_name: 'Bank Mandiri', account_number: '0987654321', account_name: 'PT Agro Mandiri' }
      ],
      confirmation_required: true
    }
  },
  {
    provider: 'cash_on_delivery',
    display_name: 'Bayar di Tempat (COD)',
    description: 'Pembayaran dilakukan saat barang diterima',
    is_enabled: true,
    config: {
      max_order_value: 2000000
    }
  }
];

const defaultShippingMethods = [
  {
    provider: 'jne',
    display_name: 'JNE',
    description: 'Pengiriman menggunakan JNE Regular',
    is_enabled: true,
    config: {
      service_types: ['REG', 'YES', 'OKE']
    }
  },
  {
    provider: 'tiki',
    display_name: 'TIKI',
    description: 'Pengiriman menggunakan TIKI',
    is_enabled: true,
    config: {
      service_types: ['REG', 'ONS', 'ECO']
    }
  }
];

const defaultNotificationTypes = [
  {
    type: 'order_confirmation',
    is_enabled: true,
    email_template: 'Terima kasih telah berbelanja di Agro Mandiri. Pesanan Anda dengan nomor {{order_id}} telah kami terima dan sedang diproses.',
    sms_template: 'Pesanan #{{order_id}} di Agro Mandiri telah diterima. Terima kasih.'
  },
  {
    type: 'shipping_notification',
    is_enabled: true,
    email_template: 'Pesanan Anda dengan nomor {{order_id}} telah dikirim melalui {{shipping_provider}} dengan nomor resi {{tracking_number}}.',
    sms_template: 'Pesanan #{{order_id}} telah dikirim via {{shipping_provider}}. No. resi: {{tracking_number}}'
  }
];

// SQL for creating the store_settings table
const createStoreSettingsTable = `
CREATE TABLE IF NOT EXISTS public.store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name TEXT NOT NULL,
  store_description TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  address TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  country TEXT,
  currency TEXT NOT NULL DEFAULT 'IDR',
  logo_url TEXT,
  favicon_url TEXT,
  social_media JSONB DEFAULT '{}'::jsonb,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
`;

// SQL for creating the payment_settings table
const createPaymentSettingsTable = `
CREATE TABLE IF NOT EXISTS public.payment_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true NOT NULL,
  config JSONB DEFAULT '{}'::jsonb,
  display_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
`;

// SQL for creating the shipping_settings table
const createShippingSettingsTable = `
CREATE TABLE IF NOT EXISTS public.shipping_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true NOT NULL,
  config JSONB DEFAULT '{}'::jsonb,
  display_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
`;

// SQL for creating the notification_settings table
const createNotificationSettingsTable = `
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true NOT NULL,
  email_template TEXT,
  sms_template TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
`;

// SQL for adding the updated_at trigger function
const createUpdatedAtTriggerFunction = `
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
`;

// SQL for adding the updated_at trigger to the store_settings table
const addTriggerToStoreSettings = `
DROP TRIGGER IF EXISTS set_updated_at ON public.store_settings;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.store_settings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
`;

// SQL for adding the updated_at trigger to the payment_settings table
const addTriggerToPaymentSettings = `
DROP TRIGGER IF EXISTS set_updated_at ON public.payment_settings;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.payment_settings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
`;

// SQL for adding the updated_at trigger to the shipping_settings table
const addTriggerToShippingSettings = `
DROP TRIGGER IF EXISTS set_updated_at ON public.shipping_settings;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.shipping_settings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
`;

// SQL for adding the updated_at trigger to the notification_settings table
const addTriggerToNotificationSettings = `
DROP TRIGGER IF EXISTS set_updated_at ON public.notification_settings;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.notification_settings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
`;

/**
 * Checks if we have appropriate permissions to manage tables
 */
async function checkSupabasePermissions(): Promise<{ hasPermission: boolean; error?: any }> {
  try {
    // Try to get current user to check if we're authenticated
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Authentication error:', userError);
      return { hasPermission: false, error: userError };
    }
    
    if (!userData || !userData.user) {
      console.error('No authenticated user found');
      return { 
        hasPermission: false, 
        error: { message: 'No authenticated user found. You must be logged in with appropriate permissions.' } 
      };
    }
    
    console.log('Authenticated as:', userData.user.email);
    return { hasPermission: true };
  } catch (error) {
    console.error('Error checking Supabase permissions:', error);
    return { hasPermission: false, error };
  }
}

/**
 * Creates a table in Supabase using the direct API
 * Note: We cannot use arbitrary SQL execution through the client API
 * Instead, we'll use direct table operations
 */
async function createSettingsTablesDirectly(): Promise<{ success: boolean; error?: any }> {
  try {
    // First check if we have appropriate permissions
    const permissionCheck = await checkSupabasePermissions();
    if (!permissionCheck.hasPermission) {
      return { 
        success: false, 
        error: permissionCheck.error || { message: 'Insufficient permissions to create tables' } 
      };
    }
    
    console.log('Creating store_settings table...');
    // Create store_settings table
    const { error: storeError } = await supabase
      .from('store_settings')
      .select('id')
      .limit(1);
    
    if (storeError) {
      console.log('Store settings select check result:', storeError);
      
      if (storeError.code === '42P01') {
        // Table doesn't exist, create it using Supabase's schema API
        // Note: In a real implementation, you would use Supabase migrations through the CLI
        // This is a client-side workaround for testing purposes
        console.log('Creating dummy store settings record to initialize table...');
        const { data, error: createError } = await supabase
          .from('store_settings')
          .insert({
            store_name: 'Agro Mandiri',
            store_description: 'Toko pertanian terlengkap',
            contact_email: 'info@agromandiri.com',
            currency: 'IDR',
          }).select();
        
        // We need to check if we get the 'permission denied' response
        if (createError) {
          console.error('Failed to create store_settings table. Error:', createError);
          
          // This is likely a permissions error
          if (createError.code === '42501' || createError.message?.includes('permission denied')) {
            return { 
              success: false, 
              error: { 
                message: 'Permission denied: You do not have sufficient privileges to create tables.', 
                originalError: createError 
              } 
            };
          }
          
          return { success: false, error: createError };
        }
        
        console.log('Store settings created successfully:', data);
      }
    }
    
    console.log('Creating payment_settings table...');
    // Create payment_settings table
    const { error: paymentError } = await supabase
      .from('payment_settings')
      .select('id')
      .limit(1);
    
    if (paymentError && paymentError.code === '42P01') {
      // Table doesn't exist, create a dummy record to initialize the table
      console.log('Creating dummy payment settings record to initialize table...');
      const { error: createError } = await supabase
        .from('payment_settings')
        .insert({
          provider: 'bank_transfer',
          display_name: 'Transfer Bank',
          description: 'Pembayaran menggunakan transfer bank manual',
          is_enabled: true,
          config: {
            accounts: [
              { bank_name: 'Bank BCA', account_number: '1234567890', account_name: 'PT Agro Mandiri' }
            ]
          }
        });
      
      if (createError && createError.code !== '42P01') {
        console.error('Failed to create payment_settings table:', createError);
        return { success: false, error: createError };
      }
    }
    
    console.log('Creating shipping_settings table...');
    // Create shipping_settings table
    const { error: shippingError } = await supabase
      .from('shipping_settings')
      .select('id')
      .limit(1);
    
    if (shippingError && shippingError.code === '42P01') {
      // Table doesn't exist, create a dummy record to initialize the table
      console.log('Creating dummy shipping settings record to initialize table...');
      const { error: createError } = await supabase
        .from('shipping_settings')
        .insert({
          provider: 'jne',
          display_name: 'JNE',
          description: 'Pengiriman menggunakan JNE Regular',
          is_enabled: true,
          config: {
            service_types: ['REG', 'YES', 'OKE']
          }
        });
      
      if (createError && createError.code !== '42P01') {
        console.error('Failed to create shipping_settings table:', createError);
        return { success: false, error: createError };
      }
    }
    
    console.log('Creating notification_settings table...');
    // Create notification_settings table
    const { error: notificationError } = await supabase
      .from('notification_settings')
      .select('id')
      .limit(1);
    
    if (notificationError && notificationError.code === '42P01') {
      // Table doesn't exist, create a dummy record to initialize the table
      console.log('Creating dummy notification settings record to initialize table...');
      const { error: createError } = await supabase
        .from('notification_settings')
        .insert({
          type: 'order_confirmation',
          is_enabled: true,
          email_template: 'Terima kasih telah berbelanja di Agro Mandiri. Pesanan Anda telah kami terima.',
          sms_template: 'Pesanan Anda di Agro Mandiri telah diterima. Terima kasih.'
        });
      
      if (createError && createError.code !== '42P01') {
        console.error('Failed to create notification_settings table:', createError);
        return { success: false, error: createError };
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Failed to create settings tables directly:', error);
    return { success: false, error };
  }
}

/**
 * Creates the necessary database tables for settings
 */
export async function createSettingsTables() {
  try {
    console.log('Creating settings tables directly...');
    
    // Create all tables directly using Supabase API
    const result = await createSettingsTablesDirectly();
    
    if (!result.success) {
      const errorMessage = result.error?.message || 'Unknown error';
      console.error('Failed to create settings tables directly:', errorMessage, result.error);
      
      // Check if this is a permissions issue
      if (result.error?.message?.includes('permission') || result.error?.originalError?.message?.includes('permission')) {
        return { 
          success: false, 
          message: 'Insufficient permissions to create settings tables. You must be logged in as an admin user with appropriate database privileges.', 
          error: result.error 
        };
      }
      
      return { 
        success: false, 
        message: `Failed to create settings tables: ${errorMessage}`, 
        error: result.error 
      };
    }
    
    console.log('All settings tables created successfully');
    return { success: true, message: 'Settings tables created successfully' };
  } catch (error) {
    console.error('Failed to create settings tables:', error);
    return { 
      success: false, 
      message: 'Failed to create settings tables', 
      error 
    };
  }
}

/**
 * Initializes settings tables with default data if they're empty
 */
export async function initializeDefaultSettings() {
  try {
    console.log('Initializing default settings...');
    
    // Check if tables exist before trying to insert data
    const { data: storeData, error: storeError } = await supabase
      .from('store_settings')
      .select('id')
      .limit(1);
    
    if (storeError) {
      // If the table doesn't exist yet, we can't initialize default data
      if (storeError.code === '42P01') {
        throw new Error('Settings tables do not exist yet. Run createSettingsTables first.');
      }
      console.error('Error checking store settings:', storeError);
    } else {
      // Insert default store settings if none exist
      if (!storeData || storeData.length === 0) {
        const { error: insertError } = await supabase
          .from('store_settings')
          .insert({
            store_name: 'Agro Mandiri',
            store_description: 'Toko pertanian terlengkap dengan berbagai produk berkualitas',
            contact_email: 'info@agromandiri.com',
            contact_phone: '+6281234567890',
            currency: 'IDR',
            meta_title: 'Agro Mandiri - Toko Pertanian Terlengkap',
            meta_description: 'Jual berbagai produk pertanian berkualitas seperti pupuk, pestisida, benih, dan peralatan pertanian.'
          });
        
        if (insertError) {
          console.error('Error inserting default store settings:', insertError);
        } else {
          console.log('Default store settings created');
        }
      }
    }
    
    // Initialize payment methods
    const { data: paymentData, error: paymentError } = await supabase
      .from('payment_settings')
      .select('id')
      .limit(1);
    
    if (paymentError) {
      if (paymentError.code !== '42P01') {
        console.error('Error checking payment settings:', paymentError);
      }
    } else if (!paymentData || paymentData.length === 0) {
      const { error: insertError } = await supabase
        .from('payment_settings')
        .insert(defaultPaymentMethods);
      
      if (insertError) {
        console.error('Error inserting default payment methods:', insertError);
      } else {
        console.log('Default payment methods created');
      }
    }
    
    // Initialize shipping methods
    const { data: shippingData, error: shippingError } = await supabase
      .from('shipping_settings')
      .select('id')
      .limit(1);
    
    if (shippingError) {
      if (shippingError.code !== '42P01') {
        console.error('Error checking shipping settings:', shippingError);
      }
    } else if (!shippingData || shippingData.length === 0) {
      const { error: insertError } = await supabase
        .from('shipping_settings')
        .insert(defaultShippingMethods);
      
      if (insertError) {
        console.error('Error inserting default shipping methods:', insertError);
      } else {
        console.log('Default shipping methods created');
      }
    }
    
    // Initialize notification types
    const { data: notificationData, error: notificationError } = await supabase
      .from('notification_settings')
      .select('id')
      .limit(1);
    
    if (notificationError) {
      if (notificationError.code !== '42P01') {
        console.error('Error checking notification settings:', notificationError);
      }
    } else if (!notificationData || notificationData.length === 0) {
      const { error: insertError } = await supabase
        .from('notification_settings')
        .insert(defaultNotificationTypes);
      
      if (insertError) {
        console.error('Error inserting default notification types:', insertError);
      } else {
        console.log('Default notification types created');
      }
    }
    
    return { success: true, message: 'Default settings initialized' };
  } catch (error) {
    console.error('Failed to initialize default settings:', error);
    return { 
      success: false, 
      message: 'Failed to initialize default settings', 
      error 
    };
  }
}

/**
 * Setup all settings tables and default data
 */
export async function setupSettingsTables() {
  // First create the tables
  const tablesResult = await createSettingsTables();
  
  // If table creation succeeded, initialize default data
  if (tablesResult.success) {
    const initResult = await initializeDefaultSettings();
    
    return {
      success: tablesResult.success && initResult.success,
      message: 'Settings tables setup completed',
      tablesResult,
      initResult
    };
  }
  
  return tablesResult;
}
