'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface DebouncedSearchInputProps {
  value: string;
  onChange: (val: string) => void;
  delay?: number;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
}

export function DebouncedSearchInput({
  value: initialValue,
  onChange,
  delay = 300,
  placeholder = 'Search records by keyword, code, or address...',
  className = '',
  isLoading = false,
}: DebouncedSearchInputProps) {
  const [value, setValue] = useState(initialValue);

  // Sync internal state if initialValue changes externally (e.g. on Reset)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Debounce emission of value
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value !== initialValue) {
        onChange(value);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay, onChange, initialValue]);

  const handleClear = () => {
    setValue('');
    onChange('');
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <div className="absolute left-3 pointer-events-none text-text-muted flex items-center justify-center">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-brand-cobalt" />
        ) : (
          <Search className="w-4 h-4" />
        )}
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-9 text-xs sm:text-sm bg-surface rounded-lg border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-cobalt focus:border-transparent transition-all shadow-sm"
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2.5 p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
