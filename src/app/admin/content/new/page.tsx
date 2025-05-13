'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateContent } from '@/api/hooks/useContent';
import { ContentType } from '@/api/types/content';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ArrowLeft } from 'lucide-react';

import dynamic from 'next/dynamic';
// Import Editor without SSR to avoid hydration issues
const Editor = dynamic(() => import('@/components/shared/editor'), { ssr: false });

export default function NewContentPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<ContentType>(ContentType.Blog);
  const [isPublished, setIsPublished] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [isAgricultureInsight, setIsAgricultureInsight] = useState(true);
  const [productCategory, setProductCategory] = useState('');

  const { mutateAsync: createContent, isPending } = useCreateContent();

  // Generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Add product category as a tag in the content if it's an agriculture insight
      let contentWithMeta = content;
      if (isAgricultureInsight && productCategory) {
        contentWithMeta = `<!-- category: ${productCategory} -->\n${content}`;
      }

      await createContent({
        title,
        slug,
        content: contentWithMeta,
        type: contentType,
        is_published: isPublished,
        featured_image: featuredImage,
        meta_title: metaTitle || title,
        meta_description: metaDescription,
      });

      toast.success('Konten berhasil dibuat');
      router.push('/admin/content');
    } catch (error) {
      console.error('Error creating content:', error);
      toast.error('Gagal membuat konten: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/admin/content')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Buat Konten Baru</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Informasi Dasar</TabsTrigger>
              <TabsTrigger value="content">Konten</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="py-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Dasar</CardTitle>
                  <CardDescription>
                    Masukkan informasi dasar tentang konten Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Judul Konten</Label>
                      <Input
                        id="title"
                        placeholder="Masukkan judul konten"
                        value={title}
                        onChange={handleTitleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="slug"
                          placeholder="url-konten"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          required
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setSlug(generateSlug(title))}
                        >
                          Generate
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Tipe Konten</Label>
                      <Select
                        value={contentType}
                        onValueChange={(value) => setContentType(value as ContentType)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe konten" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ContentType.Blog}>Blog / Artikel</SelectItem>
                          <SelectItem value={ContentType.Page}>Halaman</SelectItem>
                          <SelectItem value={ContentType.Banner}>Banner</SelectItem>
                          <SelectItem value={ContentType.Promotion}>Promosi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="featuredImage">URL Gambar Utama</Label>
                      <Input
                        id="featuredImage"
                        placeholder="https://example.com/image.jpg"
                        value={featuredImage}
                        onChange={(e) => setFeaturedImage(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="block mb-1">Status Publikasi</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isPublished"
                          checked={isPublished}
                          onCheckedChange={(checked) => setIsPublished(checked === true)}
                        />
                        <label
                          htmlFor="isPublished"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Publikasikan Sekarang
                        </label>
                      </div>
                    </div>

                    {/* Agro Mandiri Insight specific fields */}
                    <div className="space-y-2 pt-4 border-t">
                      <Label className="block mb-1">Insight Pertanian Agro Mandiri</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isAgricultureInsight"
                          checked={isAgricultureInsight}
                          onCheckedChange={(checked) => setIsAgricultureInsight(checked === true)}
                        />
                        <label
                          htmlFor="isAgricultureInsight"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Artikel ini berkaitan dengan wawasan pertanian
                        </label>
                      </div>
                    </div>

                    {isAgricultureInsight && (
                      <div className="space-y-2">
                        <Label htmlFor="productCategory">Kategori Produk Terkait</Label>
                        <Select
                          value={productCategory}
                          onValueChange={setProductCategory}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori produk" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pupuk">Pupuk</SelectItem>
                            <SelectItem value="pestisida">Pestisida</SelectItem>
                            <SelectItem value="benih">Benih</SelectItem>
                            <SelectItem value="peralatan">Peralatan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="py-4">
              <Card>
                <CardHeader>
                  <CardTitle>Konten</CardTitle>
                  <CardDescription>
                    Tuliskan konten artikel Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[500px]">
                    <Editor
                      value={content}
                      onChange={setContent}
                      placeholder="Tulis konten artikel disini..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="py-4">
              <Card>
                <CardHeader>
                  <CardTitle>SEO</CardTitle>
                  <CardDescription>
                    Optimasi konten untuk mesin pencari
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="metaTitle">Meta Title</Label>
                      <Input
                        id="metaTitle"
                        placeholder="SEO Title"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        {metaTitle.length} / 60 karakter
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea
                        id="metaDescription"
                        placeholder="SEO Description"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        {metaDescription.length} / 160 karakter
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/content')}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              'Simpan Konten'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
