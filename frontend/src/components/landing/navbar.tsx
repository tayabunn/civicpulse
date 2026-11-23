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
    <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-3.5 bg-brand-midnight/90 backdrop-blur-md border-b border-white/10 transition-all text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand identity: exact CivicPulse logo with Manrope text */}
        <Link href="/" className="flex items-center gap-3 group">
          <BrandLogo size={36} className="text-brand-yellow group-hover:scale-105 transition-transform" />
          <div>
            <span className="font-display font-extrabold text-xl tracking-tight text-white block leading-tight">
              CIVICPULSE
            </span>
            <span className="text-[10px] font-mono text-brand-yellow uppercase tracking-widest block font-bold">
              Smart City Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Verdona style) */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-white/80">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-brand-yellow transition-colors duration-150 py-1"
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
              className="gap-1.5 font-semibold border-white/20 text-white hover:bg-white/10 active:scale-[0.97] transition-all rounded-full px-4 bg-transparent"
            >
              <LogIn size={14} />
              <span>Log In</span>
            </Button>
          </Link>

          <Link href="/citizen/create">
            <Button
              size="sm"
              className="gap-1.5 font-bold shadow-md bg-brand-yellow text-brand-midnight hover:bg-yellow-400 active:scale-[0.97] transition-all rounded-full px-5"
            >
              <span>Report Issue</span>
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 active:scale-95 transition-transform"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden pt-4 pb-3 border-t border-white/10 mt-3 space-y-3 animate-fadeIn bg-brand-midnight/95 backdrop-blur-lg px-2 rounded-2xl">
          <div className="flex flex-col space-y-2 text-sm font-medium text-white/80">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-lg hover:bg-white/10 hover:text-brand-yellow transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full gap-1.5 rounded-full border-white/20 text-white bg-transparent">
                <LogIn size={14} /> Log In
              </Button>
            </Link>
            <Link href="/citizen/create" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" className="w-full bg-brand-yellow text-brand-midnight font-bold rounded-full hover:bg-yellow-400">
                Report Issue
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
