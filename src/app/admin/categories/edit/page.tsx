'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCategory, useUpdateCategory } from '@/api/hooks/useCategories';
import { CategoryForm } from '@/components/admin/categories/category-form';
import { CategoryFormValues } from '@/api/types/models';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function EditCategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('id');
  
  const { data: category, isLoading: isLoadingCategory } = useCategory(categoryId || undefined);
  const { mutateAsync, isPending } = useUpdateCategory(categoryId || '');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CategoryFormValues & { slug: string }) => {
    if (!categoryId) {
      toast.error('ID kategori tidak ditemukan');
      return;
    }

    setIsSubmitting(true);
    try {
      await mutateAsync(data);
      toast.success('Kategori berhasil diperbarui');
      router.push('/admin/categories');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Gagal memperbarui kategori. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCategory) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!category && !isLoadingCategory) {
    return (
      <div className="flex h-96 flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Kategori tidak ditemukan</h1>
        <p className="text-muted-foreground">
          Kategori yang Anda cari tidak ditemukan atau telah dihapus
        </p>
        <button 
          className="text-primary underline" 
          onClick={() => router.push('/admin/categories')}
        >
          Kembali ke daftar kategori
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Edit Kategori</h1>
      {category && (
        <CategoryForm 
          category={category} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting || isPending} 
        />
      )}
    </div>
  );
}
