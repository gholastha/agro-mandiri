'use client';

import { useRouter } from 'next/navigation';
import { Product } from '@/api/types/models';
import { formatCurrency } from '@/lib/utils';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Eye, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProductListProps {
  products: Product[];
  selectedProducts: Product[];
  onSelectProduct: (product: Product, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
}

export function ProductList({ 
  products, 
  selectedProducts, 
  onSelectProduct,
  onSelectAll
}: ProductListProps) {
  const router = useRouter();
  
  const isSelected = (productId: string) => {
    return selectedProducts.some(p => p.id === productId);
  };

  const areAllSelected = products.length > 0 && products.every(product => 
    selectedProducts.some(p => p.id === product.id)
  );

  const handleCheckboxChange = (product: Product, checked: boolean) => {
    onSelectProduct(product, checked);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox 
              checked={areAllSelected} 
              onCheckedChange={(checked: boolean) => onSelectAll(checked)}
            />
          </TableHead>
          <TableHead>Nama Produk</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead>Harga</TableHead>
          <TableHead>Stok</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <Checkbox 
                checked={isSelected(product.id)} 
                onCheckedChange={(checked: boolean) => handleCheckboxChange(product, checked)}
              />
            </TableCell>
            <TableCell>
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">SKU: {product.sku || '-'}</p>
              </div>
            </TableCell>
            <TableCell>{product.category?.name || 'Tanpa Kategori'}</TableCell>
            <TableCell>
              <div>
                <p className="font-medium">{formatCurrency(product.price)}</p>
                {product.sale_price && (
                  <p className="text-xs text-muted-foreground line-through">
                    {formatCurrency(product.sale_price)}
                  </p>
                )}
              </div>
            </TableCell>
            <TableCell>
              <span>
                {product.stock_quantity} {product.unit_type}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {!product.is_active && (
                  <Badge variant="destructive">Nonaktif</Badge>
                )}
                {product.is_active && (
                  <Badge variant="outline">Aktif</Badge>
                )}
                {product.is_featured && (
                  <Badge variant="secondary">Unggulan</Badge>
                )}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => router.push(`/admin/products/edit?id=${product.id}`)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => router.push(`/products/${product.slug}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/admin/products/edit?id=${product.id}`)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/products/${product.slug}`)}>
                      Lihat di Toko
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {products.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              Tidak ada produk yang ditemukan.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
