'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '../ui/brand-logo';
import { Button } from '../ui/button';
import { NAV_LINKS } from './data';
import { Menu, X, ArrowRight, LogIn } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-3.5 bg-brand-warmWhite/90 backdrop-blur-md border-b border-brand-coolGray/80 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand identity: exact CivicPulse logo in #202B45 without square box */}
        <Link href="/" className="flex items-center gap-3 group">
          <BrandLogo size={36} className="text-brand-midnight group-hover:scale-105 transition-transform" />
          <div>
            <span className="font-display font-extrabold text-xl tracking-tight text-brand-midnight block leading-tight">
              CIVICPULSE
            </span>
            <span className="text-[10px] font-mono text-brand-cobalt uppercase tracking-widest block font-bold">
              Smart City Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Verdona style) */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-text-secondary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-brand-cobalt transition-colors duration-150 py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons: Log In + Primary Pill CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 font-semibold border-slate-300 text-brand-midnight hover:bg-slate-100 active:scale-[0.97] transition-all rounded-full px-4"
            >
              <LogIn size={14} />
              <span>Log In</span>
            </Button>
          </Link>

          <Link href="/citizen/create">
            <Button
              size="sm"
              className="gap-1.5 font-bold shadow-sm bg-brand-midnight text-brand-yellow hover:bg-slate-800 active:scale-[0.97] transition-all rounded-full px-5"
            >
              <span>Report Issue</span>
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-brand-midnight hover:bg-slate-100 active:scale-95 transition-transform"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden pt-4 pb-3 border-t border-slate-200 mt-3 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-2 text-sm font-semibold text-text-secondary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-lg hover:bg-slate-100 hover:text-brand-cobalt transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
            <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full gap-1.5 rounded-full">
                <LogIn size={14} /> Log In
              </Button>
            </Link>
            <Link href="/citizen/create" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" className="w-full bg-brand-midnight text-brand-yellow font-bold rounded-full">
                Report Issue
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
