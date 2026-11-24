import React from 'react';
import { PARTNER_LOGOS } from './data';
import { Building2 } from 'lucide-react';

export function PartnersTicker() {
  return (
    <div className="w-full overflow-hidden">
      <div className="mb-6 text-center">
        <span className="text-xs font-sans font-semibold uppercase tracking-widest text-text-muted">
          Our Trusted Municipal Departments & Infrastructure Authorities
        </span>
      </div>

      {/* Infinite Marquee Ticker */}
      <div className="relative w-full overflow-hidden py-1 font-sans">
        <div className="flex gap-8 whitespace-nowrap animate-marquee">
          {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((p, idx) => (
            <div
              key={`${p.code}-${idx}`}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white dark:bg-[#1B2435] border border-slate-200/90 dark:border-slate-700/80 text-brand-midnight dark:text-white hover:border-brand-cobalt transition-colors shadow-sm font-sans"
            >
              <div className="w-7 h-7 rounded-full bg-brand-midnight text-brand-yellow flex items-center justify-center font-bold text-xs font-sans">
                {p.code.slice(0, 2)}
              </div>
              <div>
                <span className="text-xs font-bold font-sans block leading-none">{p.code}</span>
                <span className="text-[10px] text-text-muted font-sans font-medium">{p.division}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
