'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { applySeoColumnsMigration, addSeoColumnsDirectly, checkExecSqlAvailability } from '@/database/utils/applySeoColumns';

export default function FixDatabasePage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [sqlToCreate, setSqlToCreate] = useState<string | null>(null);

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
                    {sqlToCreate && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">SQL yang perlu dijalankan:</h4>
                        <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">{sqlToCreate}</pre>
                      </div>
                    )}
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
              <CardTitle>Informasi Perbaikan</CardTitle>
              <CardDescription>
                Penjelasan masalah dan solusi yang diterapkan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Masalah</h3>
              <p className="mb-4">
                Dashboard admin mengalami error saat mencoba mengakses atau memperbarui produk karena beberapa kolom
                yang dibutuhkan oleh kode frontend tidak ada di database, seperti yang ditunjukkan oleh error berikut:
              </p>
              <pre className="bg-gray-100 p-3 rounded text-sm mb-4 overflow-auto">
                Error: Error updating product: "Could not find the 'keywords' column of 'products' in the schema cache"
              </pre>
              
              <h3 className="text-lg font-semibold mb-2">Solusi</h3>
              <p className="mb-4">
                Alat perbaikan ini akan menambahkan kolom yang hilang ke tabel products agar sesuai dengan
                skema yang diharapkan oleh kode frontend. Setelah kolom ditambahkan, dashboard admin akan berfungsi
                dengan benar dan Anda dapat melanjutkan pengembangan.
              </p>
              
              <h3 className="text-lg font-semibold mb-2">Catatan Teknis</h3>
              <p>
                Alat ini menggunakan beberapa metode untuk menambahkan kolom yang hilang:
              </p>
              <ol className="list-decimal pl-6 mb-4 space-y-1">
                <li>Mencoba menggunakan fungsi RPC <code className="bg-gray-100 px-1 rounded">exec_sql</code> jika tersedia</li>
                <li>Sebagai fallback, mencoba menggunakan Supabase API langsung untuk menambahkan kolom</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
