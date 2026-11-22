'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Sparkles, AlertCircle, ZoomIn } from 'lucide-react';
import { Button } from './button';

interface ImageUploaderProps {
  value?: string;
  onChange: (dataUrl: string) => void;
  maxSizeMB?: number;
  className?: string;
}

export function ImageUploader({
  value,
  onChange,
  maxSizeMB = 5,
  className = '',
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, PNG, WebP, or GIF).');
      return;
    }

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image size exceeds the ${maxSizeMB}MB limit.`);
      return;
    }

    // Read as Base64 Data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        onChange(e.target.result);
      }
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleSample = () => {
    setError(null);
    onChange('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800');
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        // Preview State
        <div className="relative group rounded-xl overflow-hidden border border-border bg-surface-secondary">
          <div className="relative h-48 sm:h-56 w-full">
            <img
              src={value}
              alt="Incident evidence preview"
              className="w-full h-full object-cover transition-transform group-hover:scale-[1.01]"
            />
          </div>

          {/* Action Overlay */}
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm p-1 rounded-lg">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPreviewModal(true)}
              className="h-7 w-7 p-0 text-white hover:bg-white/20"
              title="Expand image"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="h-7 w-7 p-0 text-rose-300 hover:text-rose-100 hover:bg-rose-500/30"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-2.5 bg-surface border-t border-border flex items-center justify-between text-xs text-text-muted">
            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
              ✓ Photo attached
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-brand-cobalt hover:underline font-medium text-xs"
            >
              Change Photo
            </button>
          </div>
        </div>
      ) : (
        // Dropzone State
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-brand-cobalt bg-brand-cobalt/5 scale-[0.99]'
              : 'border-border hover:border-brand-cobalt/60 hover:bg-surface-secondary/50 bg-surface'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-surface-secondary border border-border flex items-center justify-center text-brand-cobalt">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">
                Drag and drop evidence photograph here
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                PNG, JPG, WebP up to {maxSizeMB}MB
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs h-8"
              >
                Browse Files
              </Button>
              <span className="text-xs text-text-muted">or</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSample}
                className="text-xs h-8 gap-1 text-brand-cobalt"
              >
                <Sparkles size={13} />
                Use Sample Photo
              </Button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Enlarged Preview Modal */}
      {showPreviewModal && value && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-surface rounded-xl overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={value} alt="Expanded evidence" className="max-h-[85vh] w-auto object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
