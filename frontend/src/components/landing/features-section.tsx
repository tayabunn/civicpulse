import React from 'react';
import { MAIN_FEATURES } from './data';
import { CheckCircle2 } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white border-b border-brand-coolGray">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading matching Verdona's Main Features */}
        <div className="anim-feature-header text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-cobalt">
            Intelligent Infrastructure
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-brand-midnight tracking-tight">
            Unlock the Future of City Management with Powerful Features
          </h2>
          <p className="text-base text-[#4B5568] leading-relaxed">
            CivicPulse combines modern geospatial telemetry, automated triage algorithms, and mobile work order
            routing to keep public infrastructure healthy and accountable.
          </p>
        </div>

        {/* 2x2 Feature Grid with Verdona Styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MAIN_FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="anim-feature-card p-8 sm:p-10 rounded-3xl bg-brand-warmWhite/60 border border-slate-200 hover:border-brand-cobalt/60 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Top Number + Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-black font-mono text-brand-midnight bg-brand-yellow/50 px-3 py-1 rounded-xl">
                    {feature.number}
                  </span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-cobalt bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-display text-brand-midnight mb-2 group-hover:text-brand-cobalt transition-colors">
                  {feature.title}
                </h3>
                <div className="text-xs font-mono text-brand-cobalt font-semibold mb-4">
                  {feature.subtitle}
                </div>
                <p className="text-xs sm:text-sm text-[#4B5568] leading-relaxed mb-6">
                  {feature.description}
                </p>
              </div>

              {/* Bullet Points */}
              <div className="space-y-2.5 pt-6 border-t border-slate-200/80">
                {feature.bullets.map((bullet, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
