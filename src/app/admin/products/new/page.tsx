'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateProduct } from '@/api/hooks/useProducts';
import { ProductForm } from '@/components/admin/products/product-form';
import { ProductFormValues } from '@/api/types/models';
import { toast } from 'sonner';
import { slugify } from '@/lib/utils';

export default function NewProductPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateProduct();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      // Ensure that we have a slug
      if (!data.slug) {
        data.slug = slugify(data.name);
      }

      await mutateAsync(data);
      toast.success('Produk berhasil ditambahkan');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Gagal menambahkan produk. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Tambah Produk Baru</h1>
      <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting || isPending} />
    </div>
  );
}
