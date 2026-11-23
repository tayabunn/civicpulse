import React from 'react';
import { PARTNER_LOGOS } from './data';
import { Building2 } from 'lucide-react';

export function PartnersTicker() {
  return (
    <section className="py-10 border-y border-brand-coolGray bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 text-center">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-text-muted">
          Our Trusted Municipal Departments & Infrastructure Authorities
        </span>
      </div>

      {/* Infinite Marquee Ticker */}
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-8 whitespace-nowrap animate-marquee">
          {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((p, idx) => (
            <div
              key={`${p.code}-${idx}`}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-brand-warmWhite border border-slate-200/90 text-brand-midnight hover:border-brand-cobalt transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-brand-midnight text-brand-yellow flex items-center justify-center font-black text-xs font-mono">
                {p.code.slice(0, 2)}
              </div>
              <div>
                <span className="text-xs font-bold block leading-none">{p.code}</span>
                <span className="text-[10px] text-text-muted font-mono">{p.division}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
