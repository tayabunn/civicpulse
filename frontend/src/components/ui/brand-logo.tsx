'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface BrandLogoProps {
  className?: string;
  size?: number;
}

/**
 * CivicPulse Official Geometric "C" Brand Logo
 * Extracted and cleaned directly from the official municipal geometric brand assets.
 */
export function BrandLogo({ className, size = 24 }: BrandLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 304 304"
      width={size}
      height={size}
      className={cn('inline-block shrink-0 transition-transform text-[#202B45]', className)}
      fill="currentColor"
      aria-label="CivicPulse Logo"
      role="img"
    >
      <path d="M 0,0 L 213,0 L 304,91 L 304,155 L 241,155 L 171,85 L 85,85 L 85,213 L 0,213 Z" />
      <path d="M 86,214 L 304,214 L 304,304 L 86,304 Z" />
    </svg>
  );
}
