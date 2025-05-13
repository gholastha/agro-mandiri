/**
 * Dashboard Settings Test Utilities
 * 
 * This module provides testing utilities for validating database interactions
 * with the Agro Mandiri settings components. It helps verify that settings are
 * properly saved, retrieved, and updated in the Supabase database.
 */

import { supabase } from '@/api/supabase/client';
import {
  StoreSetting,
  PaymentSetting,
  ShippingSetting,
  NotificationSetting,
  StoreSettingFormValues
} from '@/api/types/settings';

export type TestResult = {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
};

export type SettingsTestReport = {
  timestamp: string;
  results: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
  }
};

/**
 * Tests the Store Settings table structure in the database
 */
export const testStoreSettingsTable = async (): Promise<TestResult> => {
  try {
    // Try to query the table structure
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return {
          success: false,
          message: 'Store settings table does not exist',
          error
        };
      }
      
      return {
        success: false,
        message: `Error querying store settings table: ${error.message}`,
        error
      };
    }
    
    return {
      success: true,
      message: 'Store settings table exists and is accessible',
      data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Exception occurred while testing store settings table',
      error
    };
  }
};

/**
 * Tests creating a store settings record
 */
export const testCreateStoreSettings = async (testData: Partial<StoreSettingFormValues>): Promise<TestResult> => {
  try {
    // First clean up any existing test data
    await cleanupStoreSettings(testData);
    
    // Create test data with required fields
    const settingsData: StoreSettingFormValues = {
      store_name: testData.store_name || 'Test Store',
      store_description: testData.store_description || 'Test Description',
      contact_email: testData.contact_email || 'test@example.com',
      contact_phone: testData.contact_phone || '+6281234567890',
      address: testData.address || 'Test Address',
      city: testData.city || 'Test City',
      province: testData.province || 'Test Province',
      postal_code: testData.postal_code || '12345',
      country: testData.country || 'Indonesia',
      currency: testData.currency || 'IDR',
      logo_url: testData.logo_url || 'https://example.com/logo.png',
      favicon_url: testData.favicon_url || 'https://example.com/favicon.ico',
      social_media: testData.social_media || {
        facebook: 'https://facebook.com/test',
        instagram: 'https://instagram.com/test',
        twitter: 'https://twitter.com/test',
        youtube: 'https://youtube.com/test',
        whatsapp: '+6281234567890'
      },
      meta_title: testData.meta_title || 'Test Meta Title',
      meta_description: testData.meta_description || 'Test Meta Description'
    };
    
    // Insert test data
    const { data, error } = await supabase
      .from('store_settings')
      .insert(settingsData)
      .select()
      .single();
    
    if (error) {
      return {
        success: false,
        message: `Failed to create store settings: ${error.message}`,
        error
      };
    }
    
    return {
      success: true,
      message: 'Successfully created store settings',
      data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Exception occurred while testing store settings creation',
      error
    };
  }
};

/**
 * Tests updating an existing store settings record
 */
export const testUpdateStoreSettings = async (
  id: string, 
  updates: Partial<StoreSettingFormValues>
): Promise<TestResult> => {
  try {
    // Update the settings
    const { data, error } = await supabase
      .from('store_settings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return {
        success: false,
        message: `Failed to update store settings: ${error.message}`,
        error
      };
    }
    
    // Verify updates were applied
    const updatedFields = Object.keys(updates).filter(key => 
      JSON.stringify(data[key]) === JSON.stringify(updates[key])
    );
    
    if (updatedFields.length !== Object.keys(updates).length) {
      return {
        success: false,
        message: 'Not all fields were properly updated',
        data: {
          updated: updatedFields,
          expected: Object.keys(updates)
        }
      };
    }
    
    return {
      success: true,
      message: 'Successfully updated store settings',
      data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Exception occurred while testing store settings update',
      error
    };
  }
};

/**
 * Tests reading store settings
 */
export const testReadStoreSettings = async (): Promise<TestResult> => {
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .single();
    
    if (error) {
      return {
        success: false,
        message: `Failed to read store settings: ${error.message}`,
        error
      };
    }
    
    if (!data) {
      return {
        success: false,
        message: 'No store settings found'
      };
    }
    
    return {
      success: true,
      message: 'Successfully read store settings',
      data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Exception occurred while testing store settings read',
      error
    };
  }
};

/**
 * Cleans up test store settings
 */
export const cleanupStoreSettings = async (identifiers: Partial<StoreSettingFormValues>): Promise<void> => {
  try {
    // First try to clean up by email if provided
    if (identifiers.contact_email) {
      await supabase
        .from('store_settings')
        .delete()
        .eq('contact_email', identifiers.contact_email);
    }
    
    // Then by store name if provided
    if (identifiers.store_name) {
      await supabase
        .from('store_settings')
        .delete()
        .eq('store_name', identifiers.store_name);
    }
  } catch (error) {
    console.error('Failed to clean up test store settings:', error);
  }
};

/**
 * Tests the Payment Settings table structure
 */
export const testPaymentSettingsTable = async (): Promise<TestResult> => {
  try {
    const { data, error } = await supabase
      .from('payment_settings')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return {
          success: false,
          message: 'Payment settings table does not exist',
          error
        };
      }
      
      return {
        success: false,
        message: `Error querying payment settings table: ${error.message}`,
        error
      };
    }
    
    return {
      success: true,
      message: 'Payment settings table exists and is accessible',
      data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Exception occurred while testing payment settings table',
      error
    };
  }
};

/**
 * Tests creating a payment setting
 */
export const testCreatePaymentSetting = async (paymentData: Partial<PaymentSetting>): Promise<TestResult> => {
  try {
    const setting = {
      display_name: paymentData.display_name || 'Test Payment Method',
      description: paymentData.description || 'Test Payment Description', 
      is_enabled: paymentData.is_enabled !== undefined ? paymentData.is_enabled : true,
      config: paymentData.config || {}
    };
    
    const { data, error } = await supabase
      .from('payment_settings')
      .insert(setting)
      .select()
      .single();
    
    if (error) {
      return {
        success: false,
        message: `Failed to create payment setting: ${error.message}`,
        error
      };
    }
    
    return {
      success: true,
      message: 'Successfully created payment setting',
      data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Exception occurred while testing payment setting creation',
      error
    };
  }
};

/**
 * Tests toggling a payment setting's enabled status
 */
export const testTogglePaymentSetting = async (id: string): Promise<TestResult> => {
  try {
    // First get current status
    const { data: current, error: readError } = await supabase
      .from('payment_settings')
      .select('is_enabled')
      .eq('id', id)
      .single();
    
    if (readError) {
      return {
        success: false,
        message: `Failed to read payment setting: ${readError.message}`,
        error: readError
      };
    }
    
    const newStatus = !current.is_enabled;
    
    // Update the status
    const { data, error } = await supabase
      .from('payment_settings')
      .update({ is_enabled: newStatus })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return {
        success: false,
        message: `Failed to toggle payment setting: ${error.message}`,
        error
      };
    }
    
    if (data.is_enabled !== newStatus) {
      return {
        success: false,
        message: 'Payment setting status was not correctly toggled',
        data
      };
    }
    
    return {
      success: true,
      message: `Successfully ${newStatus ? 'enabled' : 'disabled'} payment setting`,
      data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Exception occurred while testing payment setting toggle',
      error
    };
  }
};

/**
 * Tests the Shipping Settings table structure
 */
export const testShippingSettingsTable = async (): Promise<TestResult> => {
  try {
    const { data, error } = await supabase
      .from('shipping_settings')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return {
          success: false,
          message: 'Shipping settings table does not exist',
          error
        };
      }
      
      return {
        success: false,
        message: `Error querying shipping settings table: ${error.message}`,
        error
      };
    }
    
    return {
      success: true,
      message: 'Shipping settings table exists and is accessible',
      data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Exception occurred while testing shipping settings table',
      error
    };
  }
};

/**
 * Tests the Notification Settings table structure
 */
export const testNotificationSettingsTable = async (): Promise<TestResult> => {
  try {
    const { data, error } = await supabase
      .from('notification_settings')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return {
          success: false,
          message: 'Notification settings table does not exist',
          error
        };
      }
      
      return {
        success: false,
        message: `Error querying notification settings table: ${error.message}`,
        error
      };
    }
    
    return {
      success: true,
      message: 'Notification settings table exists and is accessible',
      data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Exception occurred while testing notification settings table',
      error
    };
  }
};

/**
 * Runs all settings table tests
 */
export const testAllSettingsTables = async (): Promise<TestResult[]> => {
  const results = await Promise.all([
    testStoreSettingsTable(),
    testPaymentSettingsTable(),
    testShippingSettingsTable(),
    testNotificationSettingsTable()
  ]);
  
  return results;
};

/**
 * Runs a full CRUD test on store settings
 */
export const testStoreSettingsCRUD = async (): Promise<TestResult[]> => {
  const results: TestResult[] = [];
  
  // Test table structure
  const tableTest = await testStoreSettingsTable();
  results.push(tableTest);
  
  if (!tableTest.success) {
    return results;
  }
  
  // Create test data
  const testData = {
    store_name: `Test Store ${Date.now()}`,
    contact_email: `test-${Date.now()}@example.com`,
  };
  
  const createTest = await testCreateStoreSettings(testData);
  results.push(createTest);
  
  if (!createTest.success || !createTest.data?.id) {
    return results;
  }
  
  // Test reading
  const readTest = await testReadStoreSettings();
  results.push(readTest);
  
  // Test updating
  const updates = {
    store_description: `Updated description ${Date.now()}`,
    meta_title: `Updated title ${Date.now()}`
  };
  
  const updateTest = await testUpdateStoreSettings(createTest.data.id, updates);
  results.push(updateTest);
  
  // Clean up
  await cleanupStoreSettings(testData);
  
  return results;
};

/**
 * Generate a test report from test results
 */
export const generateTestReport = (results: TestResult[]): SettingsTestReport => {
  const passed = results.filter(r => r.success).length;
  const failed = results.length - passed;
  
  return {
    timestamp: new Date().toISOString(),
    results,
    summary: {
      total: results.length,
      passed,
      failed
    }
  };
};
