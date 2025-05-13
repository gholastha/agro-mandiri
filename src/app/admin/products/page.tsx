'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/api/hooks/useProducts';
import { useCategories } from '@/api/hooks/useCategories';
import { toast } from 'sonner';
import { Product } from '@/api/types/models';
import { useProductPreferences, ViewMode } from '@/store/product-preferences';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Search,
  Plus,
  Loader2,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Import components
import { BulkImportDialog } from '@/components/admin/products/bulk-import-dialog';
import { BulkDeleteDialog } from '@/components/admin/products/bulk-delete-dialog';
import { ProductViewSwitch } from '@/components/admin/products/product-view-switch';
import { ProductGrid } from '@/components/admin/products/product-grid';
import { ProductList } from '@/components/admin/products/product-list';
import { PageBreadcrumbs } from '@/components/admin/layout/breadcrumbs';
import { PaginationSummary } from '@/components/ui/pagination';

export default function ProductsPage() {
  const router = useRouter();
  
  // Use Zustand store for persistent user preferences
  const { 
    viewMode,
    sortField, 
    sortDirection, 
    searchQuery,
    categoryFilter,
    setViewMode,
    setSorting,
    setFilter,
    resetFilters
  } = useProductPreferences();
  
  // Product data hooks
  const { data: products = [], isLoading, error, refetch } = useProducts();
  const { data: categories = [] } = useCategories();
  
  // Local UI state
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInputValue, setSearchInputValue] = useState(searchQuery || '');
  const itemsPerPage = 12;
  
  // Update search input value when store changes
  useEffect(() => {
    setSearchInputValue(searchQuery || '');
  }, [searchQuery]);
  
  // Handle search submission
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setFilter({ query: searchInputValue });
  }, [setFilter, searchInputValue]);
  
  // Handle search input change
  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e.target.value);
  }, []);
  
  // Filter products based on search query and category filter
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Match category filter if specified
      const categoryMatch = 
        !categoryFilter || 
        categoryFilter === 'all' || 
        product.category_id === categoryFilter;
      
      // Match search query if present
      const searchMatch = 
        !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return categoryMatch && searchMatch;
    });
  }, [products, searchQuery, categoryFilter]);
  
  // Apply sorting to filtered products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'price') {
        comparison = (a.price || 0) - (b.price || 0);
      } else if (sortField === 'stock') {
        comparison = (a.stock_quantity || 0) - (b.stock_quantity || 0);
      }
      
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [filteredProducts, sortField, sortDirection]);
  
  // Get current page products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedProducts.slice(startIndex, endIndex);
  }, [sortedProducts, currentPage, itemsPerPage]);
  
  // Calculate pagination info
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  
  // Reset to first page when filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, sortField, sortDirection]);
  
  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  
  // Toggle selection mode
  const toggleSelectionMode = useCallback(() => {
    setIsSelectionMode(prev => !prev);
    // Clear selections when exiting selection mode
    if (isSelectionMode) {
      setSelectedProducts([]);
    }
  }, [isSelectionMode]);
  
  // Handle product selection
  const handleSelectProduct = useCallback((product: Product, isSelected: boolean) => {
    setSelectedProducts(prev => {
      if (isSelected) {
        return [...prev, product];
      } else {
        return prev.filter(p => p.id !== product.id);
      }
    });
  }, []);
  
  // Handle select all products
  const handleSelectAll = useCallback((isSelected: boolean) => {
    if (isSelected) {
      setSelectedProducts(filteredProducts);
    } else {
      setSelectedProducts([]);
    }
  }, [filteredProducts]);
  
  // After bulk operations success
  const handleBulkOperationSuccess = useCallback(() => {
    setSelectedProducts([]);
    setIsSelectionMode(false);
    refetch();
  }, [refetch]);
  
  // Handle sort change
  const handleSortChange = useCallback((field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSorting({ 
        field, 
        direction: sortDirection === 'asc' ? 'desc' : 'asc' 
      });
    } else {
      // New field, default to ascending
      setSorting({ field, direction: 'asc' });
    }
  }, [sortField, sortDirection, setSorting]);
  
  // Handle category filter change
  const handleCategoryChange = useCallback((value: string) => {
    setFilter({ category: value === 'all' ? null : value });
  }, [setFilter]);
  
  // UI elements
  if (error) {
    toast.error('Gagal memuat produk. Silakan coba lagi.');
  }

  return (
    <div className="space-y-6">
      <PageBreadcrumbs />
      
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
            <form 
              className="relative w-full max-w-sm"
              onSubmit={handleSearchSubmit}
            >
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                name="search"
                placeholder="Cari produk..."
                className="pl-8"
                value={searchInputValue}
                onChange={handleSearchInputChange}
              />
            </form>
            <div className="flex items-center gap-3">
              <Select
                value={categoryFilter || 'all'}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ProductViewSwitch 
                value={viewMode} 
                onChange={setViewMode} 
              />
            </div>
          </div>

          <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {isSelectionMode ? (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    {selectedProducts.length} dari {filteredProducts.length} produk dipilih
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectAll(true)}
                  >
                    Pilih Semua
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSelectionMode}
                  >
                    Batal
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={toggleSelectionMode}
                  >
                    Pilih
                  </Button>
                  
                  <PaginationSummary
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredProducts.length}
                  />
                </div>
              )}
            </div>
            <div>
              {isSelectionMode && (
                <BulkDeleteDialog 
                  selectedProducts={selectedProducts} 
                  onSuccess={handleBulkOperationSuccess} 
                />
              )}
            </div>
          </div>

          {isLoading ? (
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
              products={paginatedProducts}
              selectedProducts={selectedProducts}
              onSelectProduct={handleSelectProduct}
              selectionMode={isSelectionMode}
            />
          ) : (
            <ProductList
              products={paginatedProducts}
              selectedProducts={selectedProducts}
              onSelectProduct={handleSelectProduct}
              onSelectAll={handleSelectAll}
              sortField={sortField}
              sortDirection={sortDirection}
              selectionMode={isSelectionMode}
              onSortChange={handleSortChange}
            />
          )}
          
          {filteredProducts.length > 0 && (
            <div className="mt-4 flex justify-center">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
