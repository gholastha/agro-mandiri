'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/api/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProductImage } from '@/api/types/models';

interface ImageUploaderProps {
  productId?: string;
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
}

interface FileUploadStatus {
  id: string;
  name: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export function ImageUploader({ productId, images, onImagesChange }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileStatuses, setFileStatuses] = useState<FileUploadStatus[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Constants for image validation
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  
  // Validate image before upload
  const validateImage = (file: File): { valid: boolean; message?: string } => {
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        valid: false,
        message: `Jenis file tidak didukung. Harap unggah file JPG, PNG, atau WebP.`
      };
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        message: `Ukuran file terlalu besar. Maksimal 2MB.`
      };
    }
    
    return { valid: true };
  };

  // Generate a file hash to prevent duplicate uploads
  const generateFileHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Check if an image with the same hash already exists
  const isDuplicateImage = (fileHash: string): boolean => {
    return images.some(img => img.file_hash === fileHash);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const newImages: ProductImage[] = [];
      const duplicatesFound: string[] = [];
      const invalidFiles: {name: string, message: string}[] = [];
      
      // Initialize file status tracking
      const uploadStatuses: FileUploadStatus[] = Array.from(files).map(file => ({
        id: uuidv4(),
        name: file.name,
        progress: 0,
        status: 'pending'
      }));
      setFileStatuses(uploadStatuses);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const currentFileStatus = uploadStatuses[i];
        
        // Update file status to uploading
        currentFileStatus.status = 'uploading';
        setFileStatuses([...uploadStatuses]);
        
        // Validate the file before processing
        const validation = validateImage(file);
        if (!validation.valid) {
          invalidFiles.push({ name: file.name, message: validation.message || 'File tidak valid' });
          currentFileStatus.status = 'error';
          currentFileStatus.error = validation.message;
          setFileStatuses([...uploadStatuses]);
          continue;
        }
        
        // Generate a hash of the file content to identify duplicate uploads
        const fileHash = await generateFileHash(file);
        
        // Check if this image is a duplicate
        if (isDuplicateImage(fileHash)) {
          duplicatesFound.push(file.name);
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        
        // For new products, store in a temporary folder
        // For existing products, store in their specific folder
        const filePath = productId
          ? `product-images/${productId}/${fileName}`
          : `product-images/temp/${fileName}`;

        try {
          const { error } = await supabase.storage
            .from('products')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false,
            });
  
          if (error) {
            toast.error(`Error uploading ${file.name}: ${error.message}`);
            currentFileStatus.status = 'error';
            currentFileStatus.error = error.message;
            setFileStatuses([...uploadStatuses]);
            continue;
          }
          
          // Update progress
          currentFileStatus.progress = 100;
          setFileStatuses([...uploadStatuses]);
        } catch (uploadError) {
          console.error(`Error uploading ${file.name}:`, uploadError);
          currentFileStatus.status = 'error';
          currentFileStatus.error = 'Upload failed';
          setFileStatuses([...uploadStatuses]);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        const newImage: ProductImage = {
          id: uuidv4(),
          product_id: productId || 'temp',
          image_url: urlData.publicUrl,
          alt_text: file.name.split('.')[0] || 'Product image',
          display_order: images.length + i,
          is_primary: images.length === 0 && i === 0,
          local_only: true,
          file_hash: fileHash,  // Store the file hash for duplicate detection
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        newImages.push(newImage);
        
        // Update file status to success
        currentFileStatus.status = 'success';
        setFileStatuses([...uploadStatuses]);
        
        // Update overall progress
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }
      
      // Show message if duplicates were found
      if (duplicatesFound.length > 0) {
        toast.warning(
          `${duplicatesFound.length} gambar duplikat ditemukan dan dilewati: ${duplicatesFound.slice(0, 2).join(', ')}${duplicatesFound.length > 2 ? '...' : ''}`
        );
      }
      
      // Show message for invalid files
      if (invalidFiles.length > 0) {
        invalidFiles.forEach(file => {
          toast.error(`${file.name}: ${file.message}`);
        });
      }

      const updatedImages = [...images, ...newImages];
      onImagesChange(updatedImages);
      toast.success(`${newImages.length} gambar berhasil diunggah`);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Terjadi kesalahan saat mengunggah gambar');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Clear file statuses after a delay to allow users to see the final state
      setTimeout(() => {
        setFileStatuses([]);
      }, 3000);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageToRemove = images[index];
    
    const updatedImages = images.filter((_, i) => i !== index);
    
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      display_order: i,
      is_primary: i === 0 ? true : img.is_primary,
    }));
    
    onImagesChange(reorderedImages);

    if (imageToRemove.id && !imageToRemove.local_only) {
      try {
        const urlParts = imageToRemove.image_url.split('/');
        const filePath = `product-images/${productId}/${urlParts[urlParts.length - 1]}`;
        
        const { error } = await supabase.storage
          .from('products')
          .remove([filePath]);
          
        if (error) {
          console.error('Error deleting image from storage:', error);
        }
        
        const { error: dbError } = await supabase
          .from('product_images')
          .delete()
          .eq('id', imageToRemove.id);
          
        if (dbError) {
          console.error('Error deleting image record:', dbError);
          toast.error('Terjadi kesalahan saat menghapus gambar dari database');
        } else {
          toast.success('Gambar berhasil dihapus');
        }
      } catch (error) {
        console.error('Error removing image:', error);
        toast.error('Terjadi kesalahan saat menghapus gambar');
      }
    } else {
      toast.success('Gambar berhasil dihapus');
    }
  };

  const handleSetPrimary = (index: number) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        multiple
      />
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Gambar Produk</h3>
          <Button 
            type="button" 
            onClick={triggerFileInput} 
            disabled={isUploading}
            variant="outline"
            size="sm"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengunggah ({uploadProgress}%)
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Unggah Gambar
              </>
            )}
          </Button>
        </div>
        
        {/* File Upload Status Indicators */}
        {fileStatuses.length > 0 && (
          <div className="space-y-2 border rounded-md p-3 bg-muted/20">
            <h4 className="text-sm font-medium mb-2">Upload Status</h4>
            {fileStatuses.map(file => (
              <div key={file.id} className="flex items-center space-x-2">
                <div className="w-6 h-6 flex-shrink-0">
                  {file.status === 'uploading' && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  {file.status === 'success' && (
                    <svg 
                      className="h-4 w-4 text-green-500" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {file.status === 'error' && (
                    <svg 
                      className="h-4 w-4 text-red-500" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm truncate max-w-[180px]" title={file.name}>{file.name}</span>
                    <span className="text-xs text-muted-foreground">{file.progress}%</span>
                  </div>
                  <div className="w-full bg-muted h-1 rounded-full mt-1">
                    <div 
                      className={`h-full rounded-full ${file.status === 'error' ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{width: `${file.progress}%`}} /* This dynamic width needs to be inline as it changes per file */
                    />
                  </div>
                  {file.error && <p className="text-xs text-red-500 mt-1">{file.error}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {images.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-4">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Belum ada gambar produk
          </p>
          <Button
            variant="link"
            size="sm"
            className="mt-4"
            type="button"
            onClick={triggerFileInput}
            disabled={isUploading}
          >
            Unggah Gambar
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square overflow-hidden rounded-md border">
                <Image
                  src={image.image_url}
                  alt={image.alt_text || 'Product image'}
                  fill
                  className="object-cover"
                />
                {image.is_primary && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    Utama
                  </div>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                <div className="flex space-x-2">
                  {!image.is_primary && (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleSetPrimary(index)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span className="sr-only">Set as primary</span>
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
