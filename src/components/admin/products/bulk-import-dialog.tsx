'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateProduct } from '@/api/hooks/useProducts';
import { ProductFormValues } from '@/api/types/models';
import { slugify } from '@/lib/utils';

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
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { FileUploader } from './file-uploader';
import { Loader2, Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function BulkImportDialog() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('json');
  const [jsonData, setJsonData] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  
  const { mutateAsync: createProduct } = useCreateProduct();

  const handleFileChange = (file: File | null) => {
    setFile(file);
    setImportResults(null);
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonData(e.target.value);
    setImportResults(null);
  };

  const processJsonData = async () => {
    try {
      const products = JSON.parse(jsonData);
      if (!Array.isArray(products)) {
        throw new Error('Data harus berupa array produk');
      }
      return products;
    } catch (error) {
      toast.error('Format JSON tidak valid');
      throw error;
    }
  };

  const processExcelFile = async () => {
    if (!file) {
      toast.error('Pilih file Excel terlebih dahulu');
      throw new Error('No file selected');
    }

    // In a real implementation, you would use a library like xlsx
    // Here we'll simulate it by assuming CSV format for simplicity
    return new Promise<any[]>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string;
          const lines = csv.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          
          const products = [];
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(',').map(v => v.trim());
            const product: any = {};
            
            headers.forEach((header, index) => {
              product[header] = values[index] || '';
            });
            
            products.push(product);
          }
          
          resolve(products);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const mapToProductFormValues = (product: any): ProductFormValues => {
    return {
      name: product.name || '',
      description: product.description || null,
      slug: product.slug || slugify(product.name || ''),
      price: parseFloat(product.price) || 0,
      sale_price: product.sale_price ? parseFloat(product.sale_price) : null,
      stock_quantity: parseInt(product.stock_quantity) || 0,
      unit_type: product.unit_type || 'unit',
      is_featured: product.is_featured === 'true' || false,
      is_active: product.is_active !== 'false', // Default to true unless explicitly false
      category_id: product.category_id || null,
      sku: product.sku || null,
      weight: product.weight ? parseFloat(product.weight) : null,
      dimensions: product.dimensions || null,
      brand: product.brand || null,
    };
  };

  const handleImport = async () => {
    setIsImporting(true);
    setImportResults(null);
    
    try {
      let products: any[] = [];
      
      if (activeTab === 'json') {
        products = await processJsonData();
      } else {
        products = await processExcelFile();
      }
      
      const results = {
        success: 0,
        failed: 0,
        errors: [] as string[],
      };
      
      // Process products sequentially to avoid rate limits
      for (const product of products) {
        try {
          const productData = mapToProductFormValues(product);
          await createProduct(productData);
          results.success++;
        } catch (error: any) {
          results.failed++;
          results.errors.push(`${product.name || 'Produk'}: ${error.message || 'Unknown error'}`);
        }
      }
      
      setImportResults(results);
      
      if (results.success > 0) {
        toast.success(`${results.success} produk berhasil diimpor`);
      }
      
      if (results.failed === 0 && results.success > 0) {
        setTimeout(() => {
          setIsOpen(false);
          router.refresh();
        }, 2000);
      }
    } catch (error: any) {
      toast.error(`Gagal mengimpor produk: ${error.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Import Produk
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Import Produk Massal</DialogTitle>
          <DialogDescription>
            Upload data produk dalam format JSON atau Excel untuk menambahkan produk secara massal
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="json">JSON</TabsTrigger>
            <TabsTrigger value="excel">Excel/CSV</TabsTrigger>
          </TabsList>
          
          <TabsContent value="json" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="json-data">Data JSON</Label>
              <Textarea
                id="json-data"
                placeholder='[{"name": "Pupuk NPK", "price": 50000, "stock_quantity": 10, "unit_type": "kg"}]'
                value={jsonData}
                onChange={handleJsonChange}
                rows={10}
              />
              <p className="text-xs text-muted-foreground">
                Format: Array objek dengan properti name, price, stock_quantity, dll.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="excel" className="space-y-4 py-4">
            <FileUploader
              onFileChange={handleFileChange}
              accept=".xlsx,.xls,.csv"
              label="Upload file Excel atau CSV"
              helpText="Pastikan file Excel memiliki header yang sesuai (name, price, stock_quantity, dll.)"
            />
          </TabsContent>
        </Tabs>
        
        {importResults && (
          <div className="mt-4">
            {importResults.failed > 0 && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error saat import</AlertTitle>
                <AlertDescription>
                  <p>{importResults.failed} produk gagal diimpor.</p>
                  {importResults.errors.length > 0 && (
                    <ul className="mt-2 list-disc pl-4 text-sm">
                      {importResults.errors.slice(0, 3).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                      {importResults.errors.length > 3 && (
                        <li>...dan {importResults.errors.length - 3} error lainnya</li>
                      )}
                    </ul>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            {importResults.success > 0 && (
              <Alert className="mb-4">
                <AlertTitle>Import berhasil</AlertTitle>
                <AlertDescription>
                  {importResults.success} produk berhasil diimpor.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleImport} disabled={isImporting}>
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengimpor...
              </>
            ) : (
              'Impor Produk'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
