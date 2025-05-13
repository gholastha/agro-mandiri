'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useCategories } from '@/api/hooks/useCategories';
import { formatCurrency, slugify } from '@/lib/utils';
import { Product, ProductFormValues, ProductImage } from '@/api/types/models';
import { ImageUploader } from './image-uploader/image-uploader';

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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { ArrowLeft, Loader2, Save, Upload } from 'lucide-react';

// Define the validation schema
const productSchema = z.object({
  name: z.string().min(3, 'Nama produk minimal 3 karakter'),
  description: z.string().nullable(),
  price: z.coerce.number().positive('Harga harus lebih dari 0'),
  sale_price: z.coerce.number().nullable(),
  stock_quantity: z.coerce.number().int().nonnegative('Stok tidak boleh negatif'),
  unit_type: z.string().min(1, 'Unit produk harus dipilih'),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  category_id: z.string().nullable(),
  sku: z.string().nullable(),
  weight: z.coerce.number().nullable(),
  dimensions: z.string().nullable(),
  brand: z.string().nullable(),
  meta_title: z.string().nullable(),
  meta_description: z.string().nullable(),
  keywords: z.string().nullable(),
});

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function ProductForm({ product, onSubmit, isSubmitting }: ProductFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basic');
  const [autoSlug, setAutoSlug] = useState(!product?.slug);
  const { data: categories } = useCategories();
  const [productImages, setProductImages] = useState<ProductImage[]>(product?.images || []);

  // Initialize the form with default values or product data
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      sale_price: product?.sale_price || null,
      stock_quantity: product?.stock_quantity || 0,
      unit_type: product?.unit_type || 'unit',
      is_featured: product?.is_featured || false,
      is_active: product?.is_active !== undefined ? product.is_active : true,
      category_id: product?.category_id || null,
      sku: product?.sku || '',
      weight: product?.weight || null,
      dimensions: product?.dimensions || null,
      brand: product?.brand || null,
      meta_title: product?.meta_title || null,
      meta_description: product?.meta_description || null,
      keywords: product?.keywords || null,
    }
  });

  // Watch for name changes to generate slug
  const productName = watch('name');
  
  // Update the slug when name changes if autoSlug is enabled
  useEffect(() => {
    if (autoSlug && productName) {
      // This field is not directly in the form, but will be added on submit
      setValue('slug', slugify(productName));
    }
  }, [autoSlug, productName, setValue]);

  // Format the price for display
  const price = watch('price');
  const formattedPrice = price ? formatCurrency(price) : formatCurrency(0);

  // Auto-generate slug from product name (used in the useEffect hook)
  useEffect(() => {
    if (autoSlug && productName) {
      setValue('slug', slugify(productName));
    }
  }, [autoSlug, productName, setValue]);

  // Handle form submission
  const handleFormSubmit = async (data: ProductFormValues) => {
    try {
      // Get the unit type display value for the selected unit
      const getUnitTypeDisplay = () => {
        const unitValue = data.unit_type;
        switch(unitValue) {
          case 'kg': return 'Kilogram';
          case 'gram': return 'Gram';
          case 'mg': return 'Miligram';
          case 'liter': return 'Liter';
          case 'ml': return 'Mililiter';
          case 'sak': return 'Sak';
          case 'pak': return 'Pak';
          case 'box': return 'Box';
          case 'botol': return 'Botol';
          case 'pcs': return 'Pieces';
          case 'karung': return 'Karung';
          default: return 'Unit';
        }
      };
      
      // Since unit_type isn't in the database, include it in the product description
      let enhancedDescription = data.description || '';
      if (data.unit_type && data.unit_type !== 'unit') {
        // Only add unit information if it's not the default 'unit'
        const unitInfo = `Satuan produk: ${getUnitTypeDisplay()} (${data.unit_type})`;
        enhancedDescription = enhancedDescription 
          ? `${enhancedDescription}\n\n${unitInfo}` 
          : unitInfo;
      }

      // Add the slug to the data
      const productData = {
        ...data,
        description: enhancedDescription,
        slug: autoSlug ? slugify(productName) : product?.slug || slugify(productName),
        images: productImages,
      };
      
      await onSubmit(productData);
    } catch (error) {
      console.error('Error submitting product form:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    }
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
                Simpan Produk
              </>
            )}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Informasi Dasar</TabsTrigger>
            <TabsTrigger value="inventory">Inventaris</TabsTrigger>
            <TabsTrigger value="images">Gambar Produk</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Dasar</CardTitle>
                <CardDescription>
                  Informasi umum tentang produk yang dijual
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Produk</Label>
                    <Input
                      id="name"
                      placeholder="contoh: Pupuk NPK Phonska Plus"
                      {...register('name')}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category_id">Kategori</Label>
                    <Select
                      value={watch('category_id') ? watch('category_id') : 'none'}
                      onValueChange={(value) => setValue('category_id', value === 'none' ? null : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Tanpa Kategori</SelectItem>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category_id && (
                      <p className="text-sm text-destructive">{errors.category_id.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi Produk</Label>
                  <Textarea
                    id="description"
                    placeholder="Deskripsi detail tentang produk"
                    rows={5}
                    {...register('description')}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Harga</Label>
                    <div className="relative">
                      <Input
                        id="price"
                        type="number"
                        placeholder="0"
                        {...register('price')}
                      />
                      <div className="absolute right-4 top-2 text-sm text-muted-foreground">
                        {formattedPrice}
                      </div>
                    </div>
                    {errors.price && (
                      <p className="text-sm text-destructive">{errors.price.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sale_price">Harga Diskon (opsional)</Label>
                    <Input
                      id="sale_price"
                      type="number"
                      placeholder="0"
                      {...register('sale_price')}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={watch('is_featured')}
                      onCheckedChange={(checked) => setValue('is_featured', checked)}
                    />
                    <Label htmlFor="is_featured">Produk Unggulan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
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
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Inventaris</CardTitle>
                <CardDescription>
                  Detail tentang stok dan informasi pengiriman
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                    <Input
                      id="sku"
                      placeholder="contoh: AM-FERT-001"
                      {...register('sku')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock_quantity">Jumlah Stok</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      placeholder="0"
                      {...register('stock_quantity')}
                    />
                    {errors.stock_quantity && (
                      <p className="text-sm text-destructive">{errors.stock_quantity.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Berat (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register('weight')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensi (P x L x T cm)</Label>
                    <Input
                      id="dimensions"
                      placeholder="contoh: 20 x 10 x 5"
                      {...register('dimensions')}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Merek</Label>
                  <Input
                    id="brand"
                    placeholder="contoh: Phonska"
                    {...register('brand')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit_type">Satuan Produk</Label>
                  <Select
                    value={watch('unit_type')}
                    onValueChange={(value) => setValue('unit_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih satuan produk" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unit">Unit</SelectItem>
                      <SelectItem value="kg">Kilogram (kg)</SelectItem>
                      <SelectItem value="gram">Gram (g)</SelectItem>
                      <SelectItem value="mg">Miligram (mg)</SelectItem>
                      <SelectItem value="liter">Liter (L)</SelectItem>
                      <SelectItem value="ml">Mililiter (mL)</SelectItem>
                      <SelectItem value="sak">Sak</SelectItem>
                      <SelectItem value="pak">Pak</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="botol">Botol</SelectItem>
                      <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                      <SelectItem value="karung">Karung</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.unit_type && (
                    <p className="text-sm text-destructive">{errors.unit_type.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gambar Produk</CardTitle>
                <CardDescription>
                  Unggah gambar untuk produk ini
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {product?.id ? (
                  <ImageUploader
                    productId={product.id}
                    images={productImages}
                    onImagesChange={setProductImages}
                  />
                ) : (
                  <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-4">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Simpan produk terlebih dahulu untuk dapat mengunggah gambar
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan SEO</CardTitle>
                <CardDescription>
                  Optimalisasi untuk mesin pencari
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Judul Meta (SEO Title)</Label>
                  <Input
                    id="meta_title"
                    placeholder="Judul untuk mesin pencari"
                    {...register('meta_title')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta_description">Deskripsi Meta</Label>
                  <Textarea
                    id="meta_description"
                    placeholder="Deskripsi singkat untuk mesin pencari"
                    rows={3}
                    {...register('meta_description')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keywords">Kata Kunci (dipisahkan dengan koma)</Label>
                  <Input
                    id="keywords"
                    placeholder="contoh: pupuk, pertanian, organik"
                    {...register('keywords')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </form>
  );
}
