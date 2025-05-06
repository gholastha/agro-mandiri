'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCategories, useDeleteCategory } from '@/api/hooks/useCategories';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Search,
  Plus,
  Edit,
  Trash,
  Loader2,
  Check,
  X,
  ArrowUpDown,
  FolderTree,
} from 'lucide-react';

import { Category } from '@/api/types/models';

export default function CategoriesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: categories, isLoading } = useCategories();
  const { mutateAsync: deleteCategory } = useDeleteCategory();

  // Filter categories based on search query
  const filteredCategories = categories
    ? categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (category.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Handle category deletion
  const handleDelete = async (categoryId: string) => {
    if (confirm('Yakin ingin menghapus kategori ini? Semua produk dalam kategori ini akan kehilangan kategorinya.')) {
      try {
        await deleteCategory(categoryId);
        toast.success('Kategori berhasil dihapus');
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Gagal menghapus kategori. Silakan coba lagi.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Kategori</h1>
        <Button onClick={() => router.push('/admin/categories/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kategori
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kategori</CardTitle>
          <CardDescription>
            Kelola kategori produk Agro Mandiri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari kategori..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No</TableHead>
                    <TableHead>Nama Kategori</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Kategori Induk</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Urutan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Tidak ada kategori yang ditemukan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category, index) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                        <TableCell>
                          {category.parent_id ? (
                            categories?.find(c => c.id === category.parent_id)?.name || 'Kategori Induk'
                          ) : (
                            <span className="text-muted-foreground">Tidak ada</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {category.is_active ? (
                            <Badge variant="default" className="bg-green-500">
                              <Check className="mr-1 h-3 w-3" />
                              Aktif
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              <X className="mr-1 h-3 w-3" />
                              Nonaktif
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {category.display_order}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => router.push(`/admin/categories/edit?id=${category.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(category.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Menampilkan {filteredCategories.length} dari {categories?.length || 0} kategori
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
