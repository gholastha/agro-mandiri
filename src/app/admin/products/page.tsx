'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/api/hooks/useProducts';
import { useCategories } from '@/api/hooks/useCategories';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Product } from '@/api/types/models';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Loader2,
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

// Import new components
import { BulkImportDialog } from '@/components/admin/products/bulk-import-dialog';
import { BulkDeleteDialog } from '@/components/admin/products/bulk-delete-dialog';
import { ProductViewSwitch, ViewMode } from '@/components/admin/products/product-view-switch';
import { ProductGrid } from '@/components/admin/products/product-grid';
import { ProductList } from '@/components/admin/products/product-list';

export default function ProductsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const { data: products, isLoading: productsLoading, error: productsError, refetch } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

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

  // Handle product selection for bulk operations
  const handleSelectProduct = (product: Product, isSelected: boolean) => {
    if (isSelected) {
      setSelectedProducts([...selectedProducts, product]);
    } else {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    }
  };

  // Handle select all products
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedProducts(filteredProducts);
    } else {
      setSelectedProducts([]);
    }
  };

  // Refresh products after bulk operations
  const handleBulkOperationSuccess = () => {
    setSelectedProducts([]);
    refetch();
  };

  // Handle errors
  if (productsError) {
    toast.error('Gagal memuat produk. Silakan coba lagi.');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Produk</h1>
        <div className="flex items-center space-x-2">
          <BulkImportDialog />
          <Button onClick={() => router.push('/admin/products/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Produk
          </Button>
        </div>
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
            <div className="flex items-center gap-3">
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
              <ProductViewSwitch viewMode={viewMode} onChange={setViewMode} />
            </div>
          </div>

          <div className="mb-4 flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {selectedProducts.length} dari {filteredProducts.length} produk dipilih
              </p>
            </div>
            <div>
              <BulkDeleteDialog 
                selectedProducts={selectedProducts} 
                onSuccess={handleBulkOperationSuccess} 
              />
            </div>
          </div>

          {productsLoading ? (
            <div className="flex h-60 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex h-60 flex-col items-center justify-center space-y-3">
              <p className="text-lg font-medium">Tidak ada produk yang ditemukan</p>
              <p className="text-sm text-muted-foreground">
                Coba ubah filter atau tambahkan produk baru
              </p>
              <Button onClick={() => router.push('/admin/products/new')}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Produk
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <ProductGrid 
              products={filteredProducts} 
              selectedProducts={selectedProducts}
              onSelectProduct={handleSelectProduct} 
            />
          ) : (
            <div className="rounded-md border">
              <ProductList 
                products={filteredProducts}
                selectedProducts={selectedProducts}
                onSelectProduct={handleSelectProduct}
                onSelectAll={handleSelectAll}
              />
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
