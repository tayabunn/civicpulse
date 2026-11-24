'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '../ui/brand-logo';

export function Footer() {
  return (
    <footer className="bg-brand-midnight text-white pt-16 pb-12 border-t border-white/10">
      <div className="w-[80%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Left Column: Brand Info */}
          <div className="lg:col-span-7 space-y-4">
            <Link href="/" className="flex items-center gap-3 group inline-flex">
              <BrandLogo size={36} className="text-brand-yellow group-hover:scale-105 transition-transform" />
              <div>
                <span className="font-display font-extrabold text-xl tracking-tight text-white block leading-tight">
                  CIVICPULSE
                </span>
                <span className="text-[10px] font-sans text-brand-yellow uppercase tracking-widest block font-bold">
                  Smart City Platform
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-300 max-w-md leading-relaxed font-normal">
              A modern municipal partner built for citizens, department managers, and field technicians of
              every scale — from neighborhood communities to large-scale citywide operations.
            </p>

            <div className="text-xs font-sans text-slate-400 pt-2">
              Connected to Neon Cloud PostgreSQL • Dhaka Smart City Grid
            </div>
          </div>

          {/* Right Column: Quick Links */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row gap-10 sm:gap-16">
            <div className="space-y-3">
              <h5 className="font-sans text-xs font-bold uppercase tracking-wider text-brand-yellow">
                Quick Links
              </h5>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>
                  <a href="/" className="hover:text-brand-yellow transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-brand-yellow transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-brand-yellow transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-brand-yellow transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#portals" className="hover:text-brand-yellow transition-colors">
                    Portals
                  </a>
                </li>
                <li>
                  <a href="#faqs" className="hover:text-brand-yellow transition-colors">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-sans text-xs font-bold uppercase tracking-wider text-brand-yellow">
                Operational Portals
              </h5>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>
                  <Link href="/citizen" className="hover:text-brand-yellow transition-colors">
                    Citizen Portal
                  </Link>
                </li>
                <li>
                  <Link href="/manager" className="hover:text-brand-yellow transition-colors">
                    Dispatch Hub
                  </Link>
                </li>
                <li>
                  <Link href="/staff" className="hover:text-brand-yellow transition-colors">
                    Field Crew Orders
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-brand-yellow transition-colors">
                    Executive Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/citizen/create" className="hover:text-brand-yellow transition-colors">
                    Report an Issue
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar matching Verdona */}
        <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 font-sans">
          <p>© 2026 CivicPulse • All Rights Reserved</p>
          <p className="text-slate-400">
            Powered by <span className="text-brand-yellow font-bold">Signal City</span> Design System
          </p>
        </div>
      </div>
    </footer>
  );
}
