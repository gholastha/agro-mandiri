'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { applySeoColumnsMigration, addSeoColumnsDirectly } from '@/database/utils/applySeoColumns';
import InsightContent from './insight';

export default function FixDatabasePage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('')

  const handleFixDatabase = async () => {
    try {
      setStatus('loading');
      setMessage('Memeriksa dan memperbaiki struktur database...');

      // Skip RPC check and go directly to the method that adds columns directly
      console.log('Attempting to add SEO columns directly...');
      const directResult = await addSeoColumnsDirectly();
      
      if (directResult.success) {
        setMessage('Database berhasil diperbaiki! Kolom SEO telah ditambahkan ke tabel products.');
        setStatus('success');
      } else {
        // Fallback to migration method if direct method fails
        try {
          const result = await applySeoColumnsMigration();
          
          if (result.success) {
            setMessage('Database berhasil diperbaiki menggunakan metode migrasi! Kolom SEO telah ditambahkan ke tabel products.');
            setStatus('success');
          } else {
            setMessage(`Gagal memperbaiki database: ${directResult.error?.message || 'Unknown error'}`);
            setStatus('error');
          }
        } catch (migrationError) {
          console.error('Migration method failed:', migrationError);
          setMessage(`Gagal memperbaiki database: ${directResult.error?.message || 'Unknown error'}\n\nDetail: ${migrationError instanceof Error ? migrationError.message : String(migrationError)}`);
          setStatus('error');
        }
      }
    } catch (error) {
      console.error('Top level error:', error);
      setMessage(`Terjadi kesalahan: ${error instanceof Error ? error.message : String(error)}`);
      setStatus('error');
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Perbaikan Database Agro Mandiri</h1>
      
      <Tabs defaultValue="fix">
        <TabsList className="mb-4">
          <TabsTrigger value="fix">Perbaiki Database</TabsTrigger>
          <TabsTrigger value="info">Informasi</TabsTrigger>
          <TabsTrigger value="insight">Insight Agro Mandiri</TabsTrigger>
        </TabsList>
        
        <TabsContent value="fix">
          <Card>
            <CardHeader>
              <CardTitle>Perbaiki Struktur Database</CardTitle>
              <CardDescription>
                Alat ini akan menambahkan kolom SEO yang hilang ke tabel products agar dashboard admin dapat berfungsi dengan baik.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {status === 'success' && (
                <Alert className="mb-4 bg-green-50 border-green-300">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Berhasil!</AlertTitle>
                  <AlertDescription className="text-green-700">
                    {message}
                  </AlertDescription>
                </Alert>
              )}
              
              {status === 'error' && (
                <Alert className="mb-4 bg-red-50 border-red-300">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800">Error</AlertTitle>
                  <AlertDescription className="text-red-700">
                    {message}
                  </AlertDescription>
                </Alert>
              )}
              
              <p className="mb-4">
                Halaman ini akan menjalankan migrasi untuk menambahkan kolom yang diperlukan ke tabel products:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li><code className="bg-gray-100 px-1 rounded">meta_title</code> - untuk SEO metadata</li>
                <li><code className="bg-gray-100 px-1 rounded">meta_description</code> - untuk SEO metadata</li>
                <li><code className="bg-gray-100 px-1 rounded">keywords</code> - untuk SEO metadata</li>
              </ul>
              <p className="mb-4">
                Kolom-kolom ini diperlukan oleh modul manajemen produk di dashboard admin.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleFixDatabase} 
                disabled={status === 'loading'}
                className="mr-2"
              >
                {status === 'loading' ? 'Sedang Memperbaiki...' : 'Perbaiki Database'}
              </Button>
              
              {status === 'success' && (
                <Button variant="outline" onClick={() => window.location.href = '/admin/products'}>
                  Kembali ke Products
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Database Agro Mandiri</CardTitle>
              <CardDescription>
                Penjelasan mengenai struktur database dan perbaikan yang dilakukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Struktur Database</h3>
                <p>Database Agro Mandiri menggunakan Supabase sebagai backend dengan skema berikut:</p>
                
                <h4 className="font-semibold mt-4">Tabel Products</h4>
                <p>Tabel ini berisi data produk dengan kolom-kolom berikut:</p>
                <ul className="list-disc pl-5">
                  <li>id (primary key)</li>
                  <li>name (nama produk)</li>
                  <li>description (deskripsi produk)</li>
                  <li>price (harga)</li>
                  <li>category_id (foreign key ke tabel categories)</li>
                  <li>created_at (timestamp)</li>
                  <li>updated_at (timestamp)</li>
                </ul>
                
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Masalah Database</h4>
                  <p>Tabel products tidak memiliki kolom untuk data SEO yang dibutuhkan untuk fungsi admin panel:</p>
                  <ul className="list-disc pl-5">
                    <li>meta_title</li>
                    <li>meta_description</li>
                    <li>keywords</li>
                  </ul>
                  
                  <h4 className="font-semibold mt-4 mb-2">Solusi</h4>
                  <p>Fitur "Perbaiki Database" akan menambahkan kolom-kolom ini ke tabel products sehingga aplikasi dapat berfungsi dengan normal. Proses ini menggunakan dua metode:</p>
                  <ol className="list-decimal pl-5">
                    <li>Mencoba menambahkan kolom langsung ke database</li>
                    <li>Jika metode pertama gagal, migrasi database akan dijalankan</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insight">
          <InsightContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
