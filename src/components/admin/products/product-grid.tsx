'use client';

// No useState needed
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/api/types/models';
import { formatCurrency } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Package, Tag } from 'lucide-react';

// Import the product card styles
import './image-uploader/product-card.css';

interface ProductGridProps {
  products: Product[];
  selectedProducts: Product[];
  onSelectProduct: (product: Product, isSelected: boolean) => void;
  selectionMode?: boolean;
}

export function ProductGrid({ products, selectedProducts, onSelectProduct, selectionMode = false }: ProductGridProps) {
  const router = useRouter();
  
  const isSelected = (productId: string) => {
    return selectedProducts.some(p => p.id === productId);
  };

  const handleCheckboxChange = (product: Product, checked: boolean) => {
    onSelectProduct(product, checked);
  };
  
  // Helper function to get the correct image URL with fallbacks
  const getProductImageUrl = (product: Product): string => {
    // First check for main_image_url
    if (product.main_image_url) {
      return product.main_image_url;
    }
    
    // Then look for a primary image in the images array
    if (product.images && product.images.length > 0) {
      // Try to find primary image first
      const primaryImage = product.images.find(img => img.is_primary);
      if (primaryImage && primaryImage.image_url) {
        return primaryImage.image_url;
      }
      
      // Otherwise use first image
      if (product.images[0].image_url) {
        return product.images[0].image_url;
      }
    }
    
    // Fallback to placeholder
    return '/product-placeholder.png';
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="product-image-container">
            {selectionMode && (
              <div className="product-badge-container top-left">
                <Checkbox 
                  checked={isSelected(product.id)} 
                  onCheckedChange={(checked: boolean) => handleCheckboxChange(product, checked)}
                  className="h-5 w-5 bg-white"
                />
              </div>
            )}
            {!product.is_active && (
              <div className="product-badge-container top-right">
                <Badge variant="destructive">Nonaktif</Badge>
              </div>
            )}
            {product.is_featured && (
              <div className="product-badge-container bottom-left">
                <Badge variant="secondary">Unggulan</Badge>
              </div>
            )}
            
            {/* Use a div with CSS classes for the background image */}
            <div 
              className="product-image-background"
              data-image-url={getProductImageUrl(product)}
              ref={(el) => {
                if (el) {
                  el.style.backgroundImage = `url(${getProductImageUrl(product)})`;
                }
              }}
            />
            
            {/* Hidden image component loaded for SEO and accessibility */}
            <Image
              src={getProductImageUrl(product)}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="opacity-0" 
              loading="eager" 
              priority={true}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/product-placeholder.png';
                
                // Update the background div on error
                const parent = target.parentNode as HTMLElement;
                const bgDiv = parent.querySelector('.product-image-background') as HTMLElement;
                if (bgDiv) {
                  bgDiv.style.backgroundImage = `url('/product-placeholder.png')`;
                }
              }}
            />
          </div>
          <CardContent className="p-4">
            <h3 className="line-clamp-2 font-semibold">{product.name}</h3>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium text-primary">
                  {formatCurrency(product.price)}
                </span>
                {product.sale_price && (
                  <span className="ml-2 text-xs text-muted-foreground line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Package className="h-3 w-3" />
                <span>
                  {product.stock_quantity} {product.unit_type || 'unit'}
                </span>
              </div>
            </div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <Tag className="mr-1 h-3 w-3" />
              <span>{product.category?.name || 'Tanpa Kategori'}</span>
            </div>
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-2 p-4 pt-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push(`/admin/products/edit?id=${product.id}`)}
            >
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => router.push(`/products/${product.slug}`)}
            >
              <Eye className="mr-1 h-3 w-3" />
              Lihat
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
