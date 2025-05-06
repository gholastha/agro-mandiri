'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateCategory } from '@/api/hooks/useCategories';
import { CategoryForm } from '@/components/admin/categories/category-form';
import { CategoryFormValues } from '@/api/types/models';
import { toast } from 'sonner';

export default function NewCategoryPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateCategory();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CategoryFormValues & { slug: string }) => {
    setIsSubmitting(true);
    try {
      await mutateAsync(data);
      toast.success('Kategori berhasil ditambahkan');
      router.push('/admin/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Gagal menambahkan kategori. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Tambah Kategori Baru</h1>
      <CategoryForm onSubmit={handleSubmit} isSubmitting={isSubmitting || isPending} />
    </div>
  );
}
