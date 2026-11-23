import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '../ui/brand-logo';

export function Footer() {
  return (
    <footer className="border-t border-brand-coolGray bg-white text-text-primary pt-16 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
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
            <p className="text-xs text-[#4B5568] max-w-sm leading-relaxed">
              A modern municipal partner built for citizens, department managers, and field technicians of
              every scale — from neighborhood communities to citywide operations.
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-1">
              Connected to Neon Cloud PostgreSQL • Dhaka Smart City Grid
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-brand-midnight">
              Platform
            </h5>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li>
                <a href="#services" className="hover:text-brand-cobalt transition-colors">
                  What We Offer
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-brand-cobalt transition-colors">
                  Platform Features
                </a>
              </li>
              <li>
                <a href="#telemetry" className="hover:text-brand-cobalt transition-colors">
                  City Telemetry
                </a>
              </li>
              <li>
                <a href="#portals" className="hover:text-brand-cobalt transition-colors">
                  Role Portals
                </a>
              </li>
            </ul>
          </div>

          {/* Citizen Services */}
          <div className="space-y-3">
            <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-brand-midnight">
              Citizen Desk
            </h5>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li>
                <Link href="/citizen/create" className="hover:text-brand-cobalt transition-colors">
                  Report a Problem
                </Link>
              </li>
              <li>
                <Link href="/citizen" className="hover:text-brand-cobalt transition-colors">
                  Track Submissions
                </Link>
              </li>
              <li>
                <a href="#contact" className="hover:text-brand-cobalt transition-colors">
                  Emergency Desk
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-brand-cobalt transition-colors">
                  Sign In to Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Portals */}
          <div className="space-y-3">
            <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-brand-midnight">
              Operational Portals
            </h5>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li>
                <Link href="/manager" className="hover:text-brand-cobalt transition-colors">
                  Department Triage Hub
                </Link>
              </li>
              <li>
                <Link href="/staff" className="hover:text-brand-cobalt transition-colors">
                  Field Maintenance Ops
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-brand-cobalt transition-colors">
                  Executive BI Analytics
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-brand-cobalt transition-colors">
                  Create Citizen Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-text-muted font-mono">
          <p>© 2026 CivicPulse • Building better communities, together.</p>
          <p>Verdona Architecture • Signal City Design System v1.0</p>
        </div>
      </div>
    </footer>
  );
}
