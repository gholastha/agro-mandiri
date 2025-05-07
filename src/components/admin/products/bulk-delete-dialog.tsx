'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useDeleteProduct } from '@/api/hooks/useProducts';
import { Product } from '@/api/types/models';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface BulkDeleteDialogProps {
  selectedProducts: Product[];
  onSuccess: () => void;
}

export function BulkDeleteDialog({ selectedProducts, onSuccess }: BulkDeleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteResults, setDeleteResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  
  const { mutateAsync: deleteProduct } = useDeleteProduct();

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Pilih produk yang akan dihapus terlebih dahulu');
      return;
    }

    setIsDeleting(true);
    setDeleteResults(null);
    
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };
    
    // Delete products sequentially
    for (const product of selectedProducts) {
      try {
        await deleteProduct(product.id);
        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`${product.name}: ${error.message || 'Unknown error'}`);
      }
    }
    
    setDeleteResults(results);
    
    if (results.success > 0) {
      toast.success(`${results.success} produk berhasil dihapus`);
    }
    
    if (results.failed === 0 && results.success > 0) {
      setTimeout(() => {
        setIsOpen(false);
        onSuccess();
      }, 2000);
    }
    
    setIsDeleting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" disabled={selectedProducts.length === 0}>
          <Trash2 className="mr-2 h-4 w-4" />
          Hapus ({selectedProducts.length})
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus {selectedProducts.length} Produk</DialogTitle>
          <DialogDescription>
            Anda akan menghapus {selectedProducts.length} produk. Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        
        {selectedProducts.length > 0 && (
          <div className="my-4 max-h-60 overflow-auto">
            <h3 className="mb-2 font-medium">Produk yang akan dihapus:</h3>
            <ul className="space-y-1 text-sm">
              {selectedProducts.map((product) => (
                <li key={product.id}>{product.name}</li>
              ))}
            </ul>
          </div>
        )}
        
        {deleteResults && (
          <div className="mt-4">
            {deleteResults.failed > 0 && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error saat menghapus</AlertTitle>
                <AlertDescription>
                  <p>{deleteResults.failed} produk gagal dihapus.</p>
                  {deleteResults.errors.length > 0 && (
                    <ul className="mt-2 list-disc pl-4 text-sm">
                      {deleteResults.errors.slice(0, 3).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                      {deleteResults.errors.length > 3 && (
                        <li>...dan {deleteResults.errors.length - 3} error lainnya</li>
                      )}
                    </ul>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            {deleteResults.success > 0 && (
              <Alert className="mb-4">
                <AlertTitle>Penghapusan berhasil</AlertTitle>
                <AlertDescription>
                  {deleteResults.success} produk berhasil dihapus.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Batal
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleBulkDelete} 
            disabled={isDeleting || selectedProducts.length === 0}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              'Hapus Produk'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
