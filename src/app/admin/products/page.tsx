'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProducts, useDeleteProduct } from '@/api/hooks/useProducts';
import { useCategories } from '@/api/hooks/useCategories';
import { formatCurrency } from '@/lib/utils';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash,
  Loader2,
  Check,
  X,
  ArrowUpDown,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import type { Product } from '@/api/types/models';

export default function ProductsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const { data: products, isLoading: productsLoading, error: productsError } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { mutateAsync: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort products
  const filteredProducts = products
    ? products
        .filter((product) => {
          const matchesSearch = searchQuery
            ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (product.description || '').toLowerCase().includes(searchQuery.toLowerCase())
            : true;

          const matchesCategory =
            categoryFilter === 'all' || product.category_id === categoryFilter;

          return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
          let comparison = 0;

          if (sortField === 'name') {
            comparison = a.name.localeCompare(b.name);
          } else if (sortField === 'price') {
            comparison = a.price - b.price;
          } else if (sortField === 'stock') {
            comparison = a.stock_quantity - b.stock_quantity;
          }

          return sortDirection === 'desc' ? comparison * -1 : comparison;
        })
    : [];

  // Handle errors
  if (productsError) {
    toast.error('Gagal memuat produk. Silakan coba lagi.');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Produk</h1>
        <Button onClick={() => router.push('/admin/products/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Produk
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
          <CardDescription>
            Kelola semua produk Agro Mandiri di sini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari produk..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {productsLoading ? (
            <div className="flex h-60 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Nama Produk
                        {sortField === 'name' && (
                          <ArrowUpDown 
                            className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180 transform' : ''}`} 
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead 
                      className="cursor-pointer text-right"
                      onClick={() => handleSort('price')}
                    >
                      <div className="flex items-center justify-end">
                        Harga
                        {sortField === 'price' && (
                          <ArrowUpDown 
                            className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180 transform' : ''}`} 
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer text-center"
                      onClick={() => handleSort('stock')}
                    >
                      <div className="flex items-center justify-center">
                        Stok
                        {sortField === 'stock' && (
                          <ArrowUpDown 
                            className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180 transform' : ''}`} 
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Tidak ada produk yang ditemukan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product, index) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          {product.category?.name || 'Tanpa Kategori'}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(product.price)}
                        </TableCell>
                        <TableCell className="text-center">
                          {product.stock_quantity}
                        </TableCell>
                        <TableCell className="text-center">
                          {product.is_active ? (
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
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => router.push(`/admin/products/edit?id=${product.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                if (confirm('Yakin ingin menghapus produk ini?')) {
                                  deleteProduct(product.id).then(() => {
                                    toast.success('Produk berhasil dihapus');
                                  });
                                }
                              }}
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
            Menampilkan {filteredProducts.length} dari {products?.length || 0} produk
          </div>
          <div className="space-x-2">
            {/* Pagination will be implemented here */}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
