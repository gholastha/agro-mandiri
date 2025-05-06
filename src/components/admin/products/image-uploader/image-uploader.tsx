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
  productId: string;
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
}

export function ImageUploader({ productId, images, onImagesChange }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const newImages: ProductImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `products/${productId}/${fileName}`;

        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          toast.error(`Error uploading ${file.name}: ${error.message}`);
          continue;
        }

        // Get public URL for the uploaded file
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        // Create new image record
        const newImage: ProductImage = {
          id: uuidv4(),
          product_id: productId,
          image_url: urlData.publicUrl,
          alt_text: file.name.split('.')[0] || 'Product image',
          display_order: images.length + i,
          is_primary: images.length === 0 && i === 0, // First image is primary
          local_only: true, // Mark as local only until saved
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        newImages.push(newImage);
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      // Append new images to existing images
      const updatedImages = [...images, ...newImages];
      onImagesChange(updatedImages);
      toast.success(`${newImages.length} gambar berhasil diunggah`);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Terjadi kesalahan saat mengunggah gambar');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageToRemove = images[index];
    
    // Create a copy of the images array without the removed image
    const updatedImages = images.filter((_, i) => i !== index);
    
    // Update the display order of remaining images
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      display_order: i,
      is_primary: i === 0 ? true : img.is_primary, // Make the first image primary if we removed the primary
    }));
    
    onImagesChange(reorderedImages);

    // If the image was already saved to the database (not local only)
    if (imageToRemove.id && !imageToRemove.local_only) {
      try {
        // Delete the image from Supabase Storage if it's not local only
        const filePath = imageToRemove.image_url.split('/').pop();
        if (filePath) {
          const { error } = await supabase.storage
            .from('product-images')
            .remove([`products/${productId}/${filePath}`]);
            
          if (error) {
            console.error('Error deleting image from storage:', error);
          }
        }
        
        // Delete the image record from the database
        const { error } = await supabase
          .from('product_images')
          .delete()
          .eq('id', imageToRemove.id);
          
        if (error) {
          console.error('Error deleting image record:', error);
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
