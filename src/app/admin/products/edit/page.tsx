'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProduct, useUpdateProduct } from '@/api/hooks/useProducts';
import { ProductForm } from '@/components/admin/products/product-form';
import { ProductFormValues } from '@/api/types/models';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function EditProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  
  const { data: product, isLoading: isLoadingProduct } = useProduct(productId || undefined);
  const { mutateAsync, isPending } = useUpdateProduct(productId || '');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ProductFormValues) => {
    if (!productId) {
      toast.error('ID produk tidak ditemukan');
      return;
    }

    setIsSubmitting(true);
    try {
      await mutateAsync(data);
      // Toast is already shown in the hook
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Gagal memperbarui produk. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product && !isLoadingProduct) {
    return (
      <div className="flex h-96 flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Produk tidak ditemukan</h1>
        <p className="text-muted-foreground">
          Produk yang Anda cari tidak ditemukan atau telah dihapus
        </p>
        <button 
          className="text-primary underline" 
          onClick={() => router.push('/admin/products')}
        >
          Kembali ke daftar produk
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Edit Produk</h1>
      {product && (
        <ProductForm 
          product={product} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting || isPending} 
        />
      )}
    </div>
  );
}
