import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '../components/ui/brand-logo';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-warmWhite text-brand-midnight flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="flex justify-center">
          <BrandLogo size={48} className="text-[#202B45]" />
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-cobalt px-3 py-1 bg-blue-50 rounded-full border border-blue-200">
            404 Error • Page Not Found
          </span>
          <h1 className="text-3xl font-extrabold font-display text-brand-midnight mt-3">
            Lost in the City Grid?
          </h1>
          <p className="text-sm text-[#4B5568] leading-relaxed">
            The page or municipal resource you are looking for does not exist or has been relocated.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/">
            <Button className="gap-2 bg-brand-midnight text-brand-yellow hover:bg-slate-800 font-bold px-6 active:scale-[0.97] transition-all">
              <ArrowLeft size={16} />
              <span>Back to City Overview</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
