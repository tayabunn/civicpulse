import React from 'react';
import { MAIN_FEATURES } from './data';
import { CheckCircle2 } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section id="features" className="relative -mt-8 sm:-mt-12 lg:-mt-16 pt-20 pb-24 lg:pt-28 lg:pb-32 bg-brand-midnight text-white border-b border-brand-midnight overflow-hidden">
      {/* Top Curvy Shape matching Navbar (White) */}
      <div className="absolute top-0 inset-x-0 w-full pointer-events-none overflow-hidden leading-none z-10">
        <svg
          viewBox="0 0 992 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 sm:h-16 lg:h-20 drop-shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0H992H937.518C910.429 0 884.499 10.9901 865.66 30.456L859.547 36.772C850.128 46.5049 837.163 52 823.618 52H164.801C150.309 52 136.541 45.6684 127.108 34.6667C108.244 12.6631 80.7071 0 51.7238 0H0Z"
            fill="#f7f5f0"
            className="fill-[#f7f5f0]"
          />
        </svg>
      </div>

      <div className="relative z-10 w-[80%] mx-auto">
        {/* Section Heading matching Verdona's Dark Features Header */}
        <div className="anim-feature-header text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full border border-white/20 text-white/90 text-xs font-mono font-bold uppercase tracking-wider bg-white/10">
              Main Features
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight leading-tight">
            Unlock the Future of City Management with Powerful Features
          </h2>
          <p className="text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            CivicPulse combines modern geospatial telemetry, automated triage algorithms, and mobile work order
            routing to keep public infrastructure healthy and accountable.
          </p>
        </div>

        {/* 2x2 Feature Grid with Verdona Dark Styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MAIN_FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="anim-feature-card p-8 sm:p-10 rounded-3xl bg-[#283554] border border-white/10 hover:border-brand-yellow/60 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Top Number + Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl font-bold font-mono text-brand-midnight bg-brand-yellow px-3 py-1 rounded-xl">
                    {feature.number}
                  </span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-yellow bg-white/10 px-3 py-1 rounded-full border border-white/15">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-display text-white mb-2 group-hover:text-brand-yellow transition-colors">
                  {feature.title}
                </h3>
                <div className="text-xs font-mono text-brand-yellow/90 font-bold uppercase tracking-wider mb-4">
                  {feature.subtitle}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                  {feature.description}
                </p>
              </div>

              {/* Bullet Points */}
              <div className="space-y-2.5 pt-6 border-t border-white/10">
                {feature.bullets.map((bullet, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 size={16} className="text-brand-yellow shrink-0 mt-0.5" />
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
