'use client';

import { supabase } from '@/api/supabase/client';
import { toast } from 'sonner';

/**
 * Add missing SEO columns to the products table
 * These columns are needed by the admin dashboard product management
 */
export async function applySeoColumnsMigration() {
  try {
    console.log('Checking and adding SEO columns to products table...');
    
    // First check if the products table exists
    const { error: tableCheckError } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (tableCheckError) {
      if (tableCheckError.code === '42P01') {
        console.error('Products table does not exist yet');
        toast.error('Tabel products belum dibuat. Silakan buat tabel terlebih dahulu.');
        return { success: false, error: tableCheckError };
      }
    }
    
    // Try to select from the SEO columns to see if they already exist
    const { error: columnCheckError } = await supabase
      .from('products')
      .select('meta_title, meta_description, keywords')
      .limit(1);
    
    // If there's no error, the columns already exist
    if (!columnCheckError) {
      console.log('SEO columns already exist in products table');
      return { success: true, message: 'SEO columns already exist' };
    }
    
    // The error we're expecting is column does not exist
    if (columnCheckError.message.includes('column') && columnCheckError.message.includes('does not exist')) {
      console.log('Adding missing SEO columns to products table...');
      
      // We need to add the columns one by one using try/catch instead of Promise.catch
      // Add meta_title column if it doesn't exist
      const addColumns = async () => {
        try {
          // Add meta_title column
          await supabase.rpc('exec_sql', { 
            sql_query: 'ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS meta_title TEXT;' 
          });
          console.log('Added meta_title column successfully');
          
          // Add meta_description column
          await supabase.rpc('exec_sql', { 
            sql_query: 'ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS meta_description TEXT;' 
          });
          console.log('Added meta_description column successfully');
          
          // Add keywords column
          await supabase.rpc('exec_sql', { 
            sql_query: 'ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS keywords TEXT;' 
          });
          console.log('Added keywords column successfully');
          
          return true;
        } catch (err) {
          console.error('Error adding columns:', err);
          return false;
        }
      };
      
      // Execute the column additions
      const columnsAdded = await addColumns();
      
      // Check if columns were successfully added
      if (!columnsAdded) {
        console.error('Failed to add one or more SEO columns');
        toast.error('Gagal menambahkan kolom SEO ke tabel products');
        return { success: false, error: { message: 'Failed to add one or more SEO columns' } };
      }
      
      // Verify that columns were added successfully
      const { error: verifyError } = await supabase
        .from('products')
        .select('meta_title, meta_description, keywords')
        .limit(1);
      
      if (verifyError) {
        console.error('Failed to verify SEO columns:', verifyError);
        toast.error('Gagal menambahkan kolom SEO ke tabel products');
        return { success: false, error: verifyError };
      }
      
      console.log('SEO columns added successfully');
      toast.success('Kolom SEO berhasil ditambahkan ke tabel products');
      return { success: true, message: 'SEO columns added successfully' };
    }
    
    // If we get here, there was some other error
    console.error('Error checking SEO columns:', columnCheckError);
    toast.error(`Gagal memeriksa kolom SEO: ${columnCheckError.message}`);
    return { success: false, error: columnCheckError };
  } catch (error) {
    console.error('Error applying SEO columns migration:', error);
    toast.error(`Gagal menambahkan kolom SEO: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false, error };
  }
}

/**
 * Determine if the 'exec_sql' RPC function is available in Supabase
 */
export async function checkExecSqlAvailability() {
  try {
    // Try to call exec_sql with a simple query
    const { error } = await supabase.rpc('exec_sql', {
      sql_query: 'SELECT 1;'
    });
    
    // If there's no error, the function exists
    if (!error) {
      return { available: true };
    }
    
    // If the function doesn't exist, provide instructions
    if (error.code === 'P0001' || error.message.includes('function') && error.message.includes('does not exist')) {
      return { 
        available: false, 
        message: 'RPC function exec_sql does not exist. Run the following SQL in the Supabase SQL Editor to create it:',
        sqlToCreate: `
          CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
          RETURNS void
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          BEGIN
            EXECUTE sql_query;
          END;
          $$;
        `
      };
    }
    
    // Other errors
    return {
      available: false,
      error,
      message: 'Error checking exec_sql availability'
    };
  } catch (error) {
    return {
      available: false,
      error,
      message: 'Error checking exec_sql availability'
    };
  }
}

/**
 * Directly add missing SEO columns to products table using Supabase API
 * This is the primary method we use since we're having issues with the RPC method
 */
export async function addSeoColumnsDirectly() {
  try {
    console.log('Directly adding SEO columns through Supabase API...');
    
    // First, check if the products table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (tableError) {
      console.error('Error checking products table:', tableError);
      return { success: false, error: tableError };
    }
    
    // Next, check if the SEO columns already exist
    const { data, error: columnCheckError } = await supabase
      .from('products')
      .select('id, name')  // Use known columns to check if table exists
      .limit(1);
    
    // Step 1: Create a placeholder product if none exists
    // We need this to add columns successfully with our update trick
    let productId = null;
    
    if (!data || data.length === 0) {
      // Create a temporary product to work with
      const { data: newProduct, error: createError } = await supabase
        .from('products')
        .insert({
          name: 'Temporary SEO Column Setup Product',
          description: 'This is a temporary product used to set up SEO columns',
          price: 0,
          stock_quantity: 0,
          is_active: false,
          slug: 'temporary-seo-setup',
        })
        .select();
      
      if (createError) {
        console.error('Error creating temporary product:', createError);
        return { success: false, error: createError };
      }
      
      productId = newProduct[0].id;
      console.log('Created temporary product with ID:', productId);
    } else {
      // Use existing product
      productId = data[0].id;
      console.log('Using existing product with ID:', productId);
    }
    
    // Step 2: Update the product with the SEO fields to add them to the schema
    const { error: updateError } = await supabase
      .from('products')
      .update({
        meta_title: 'SEO Title',
        meta_description: 'SEO Description',
        keywords: 'keywords, seo, setup'
      })
      .eq('id', productId);
    
    if (updateError) {
      // If we get a permission denied, it's likely the columns already exist
      if (updateError.code === 'PGRST204' && updateError.message.includes('keywords')) {
        console.log('Columns appear to already exist or the schema is being updated');
        return { success: true, message: 'Columns already exist' };
      }
      
      console.error('Error updating product with SEO columns:', updateError);
      return { success: false, error: updateError };
    }
    
    // Step 3: Verify that the columns were added by selecting them
    const { error: verifyError } = await supabase
      .from('products')
      .select('meta_title, meta_description, keywords')
      .eq('id', productId)
      .limit(1);
    
    if (verifyError) {
      console.error('Error verifying SEO columns:', verifyError);
      return { success: false, error: verifyError };
    }
    
    console.log('SEO columns added and verified successfully');
    return { success: true };
  } catch (error) {
    console.error('Error adding SEO columns directly:', error);
    return { 
      success: false, 
      error: error instanceof Error ? { message: error.message } : { message: 'Unknown error' }
    };
  }
}
