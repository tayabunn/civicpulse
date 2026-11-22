'use client';

import React from 'react';
import { BrandLogo } from './brand-logo';

interface LazyLoaderProps {
  message?: string;
  submessage?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LazyLoader({
  message = 'Processing request...',
  submessage = 'Connecting to CivicPulse security gateway...',
  fullScreen = false,
  className = '',
}: LazyLoaderProps) {
  const content = (
    <div className={`flex flex-col items-center justify-center text-center p-6 space-y-4 ${className}`}>
      {/* Animated Dual-Ring Radar Spinner */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 rounded-full border-2 border-brand-cobalt/20 animate-ping"></div>

        {/* Middle rotating gradient ring */}
        <div className="w-14 h-14 rounded-full border-3 border-transparent border-t-brand-cobalt border-r-brand-yellow animate-spin"></div>

        {/* Center brand logo icon */}
        <div className="absolute flex items-center justify-center">
          <BrandLogo size={22} className="text-[#202B45] animate-pulse" />
        </div>
      </div>

      {/* Text status */}
      <div className="space-y-1">
        <h4 className="text-sm font-bold font-display text-brand-midnight tracking-tight">
          {message}
        </h4>
        {submessage && (
          <p className="text-xs font-mono text-text-muted flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{submessage}</span>
          </p>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-surface rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
