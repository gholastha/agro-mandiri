'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useCategories } from '@/api/hooks/useCategories';
import { slugify } from '@/lib/utils';
import { Category, CategoryFormValues } from '@/api/types/models';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { ArrowLeft, Loader2, Save } from 'lucide-react';

// Define the validation schema
const categorySchema = z.object({
  name: z.string().min(2, 'Nama kategori minimal 2 karakter'),
  description: z.string().nullable(),
  parent_id: z.string().nullable(),
  is_active: z.boolean().default(true),
  display_order: z.coerce.number().int().nonnegative('Urutan tidak boleh negatif'),
  meta_title: z.string().nullable(),
  meta_description: z.string().nullable(),
});

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CategoryFormValues & { slug: string }) => Promise<void>;
  isSubmitting: boolean;
}

export function CategoryForm({ category, onSubmit, isSubmitting }: CategoryFormProps) {
  const router = useRouter();
  const [autoSlug, setAutoSlug] = useState(!category?.slug);
  const { data: categories, isLoading: loadingCategories } = useCategories();

  // Initialize the form with default values or category data
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || null,
      parent_id: category?.parent_id || null,
      is_active: category?.is_active !== undefined ? category.is_active : true,
      display_order: category?.display_order || 0,
      meta_title: category?.meta_title || null,
      meta_description: category?.meta_description || null,
    }
  });

  // Watch for name changes to generate slug
  const categoryName = watch('name');
  
  // Update the slug when name changes if autoSlug is enabled
  useEffect(() => {
    if (autoSlug && categoryName) {
      // This field is not directly in the form, but will be added on submit
      setCurrentSlug(slugify(categoryName));
    }
  }, [autoSlug, categoryName]);

  // Keep track of the current slug
  const [currentSlug, setCurrentSlug] = useState(category?.slug || '');

  // Filter out the current category from parent options to prevent circular references
  const filteredCategories = categories?.filter(c => c.id !== category?.id) || [];

  // Handle form submission
  const handleFormSubmit = async (data: CategoryFormValues) => {
    try {
      // Add the slug to the data
      const categoryData = {
        ...data,
        slug: currentSlug || slugify(categoryName),
      };
      
      await onSubmit(categoryData);
    } catch (error) {
      console.error('Error submitting category form:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  // Generate slug from name
  const generateSlug = () => {
    if (categoryName) {
      setCurrentSlug(slugify(categoryName));
      setAutoSlug(true);
    }
  };

  // Handle manual slug change
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSlug(e.target.value);
    setAutoSlug(false);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan Kategori
              </>
            )}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detail Kategori</CardTitle>
            <CardDescription>
              Informasi dasar tentang kategori produk
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Kategori</Label>
              <Input
                id="name"
                placeholder="contoh: Pupuk Organik"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <div className="flex space-x-2">
                <Input
                  id="slug"
                  placeholder="contoh: pupuk-organik"
                  value={currentSlug}
                  onChange={handleSlugChange}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={generateSlug}
                >
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Slug digunakan pada URL. Contoh: agromandiri.com/category/pupuk-organik
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_id">Kategori Induk</Label>
              <Select
                value={watch('parent_id') ? watch('parent_id') : 'none'}
                onValueChange={(value) => setValue('parent_id', value === 'none' ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori induk (opsional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tidak ada</SelectItem>
                  {filteredCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Opsional. Biarkan kosong jika ini adalah kategori utama.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Deskripsi kategori (opsional)"
                rows={3}
                {...register('description')}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="display_order">Urutan Tampilan</Label>
                <Input
                  id="display_order"
                  type="number"
                  placeholder="0"
                  {...register('display_order')}
                />
                {errors.display_order && (
                  <p className="text-sm text-destructive">{errors.display_order.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Urutan menentukan posisi kategori dalam daftar (0 = pertama)
                </p>
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  id="is_active"
                  checked={watch('is_active')}
                  onCheckedChange={(checked) => setValue('is_active', checked)}
                />
                <Label htmlFor="is_active">Aktif</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO</CardTitle>
            <CardDescription>
              Pengaturan untuk optimasi mesin pencari
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta_title">Judul Meta</Label>
              <Input
                id="meta_title"
                placeholder="Judul untuk mesin pencari (opsional)"
                {...register('meta_title')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta_description">Deskripsi Meta</Label>
              <Textarea
                id="meta_description"
                placeholder="Deskripsi singkat untuk mesin pencari (opsional)"
                rows={3}
                {...register('meta_description')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
