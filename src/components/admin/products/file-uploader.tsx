'use client';

import { useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, File, X } from 'lucide-react';

interface FileUploaderProps {
  onFileChange: (file: File | null) => void;
  accept?: string;
  label?: string;
  helpText?: string;
}

export function FileUploader({
  onFileChange,
  accept = '',
  label = 'Upload File',
  helpText = '',
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    onFileChange(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      onFileChange(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    setFile(null);
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div
        className={`border-2 border-dashed rounded-md p-6 ${
          file ? 'border-primary bg-primary/10' : 'border-muted-foreground/30'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />

        {file ? (
          <div className="flex flex-col items-center space-y-2">
            <File className="h-10 w-10 text-primary" />
            <div className="text-center">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFile}
              className="mt-2"
            >
              <X className="mr-2 h-4 w-4" />
              Hapus File
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">
                Drag & drop file, atau{' '}
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="text-primary underline"
                >
                  browse
                </button>
              </p>
              {helpText && (
                <p className="text-xs text-muted-foreground mt-1">{helpText}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
