'use client';

import React, { useRef } from 'react';
import { MAIN_FEATURES } from './data';
import { Check } from 'lucide-react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

const CARD_THEMES = [
  {
    bg: '#DCECE4', // Soft Sage Mint (Reference 1)
    muted: 'text-[#2D4039]',
    checkColor: 'text-[#DCECE4]',
  },
  {
    bg: '#F2D27A', // Warm Honey Gold (Reference 2 & complementary to #305dff)
    muted: 'text-[#3D3214]',
    checkColor: 'text-[#F2D27A]',
  },
  {
    bg: '#DCE6FF', // Soft Periwinkle Ice (Harmonious tint of #305dff)
    muted: 'text-[#2B3B5E]',
    checkColor: 'text-[#DCE6FF]',
  },
  {
    bg: '#E2FB6C', // Soft Lime Volt (Balanced tint of #ccff00 on #305dff)
    muted: 'text-[#2D3816]',
    checkColor: 'text-[#E2FB6C]',
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative -mt-20 sm:-mt-28 lg:-mt-40 pt-24 pb-4 lg:pt-32 lg:pb-6 bg-[#305dff] text-white border-b border-[#305dff] overflow-hidden z-20"
    >
      {/* Top Curvy Shape matching Navbar (White) - Adjusted width and sleek height */}
      <div className="absolute top-0 inset-x-0 w-full pointer-events-none overflow-hidden leading-none z-10 flex justify-center">
        <svg
          viewBox="0 0 992 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[94%] sm:w-[88%] lg:w-[78%] sm:max-w-2xl lg:max-w-4xl h-8 sm:h-10 lg:h-12 drop-shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0H992H937.518C910.429 0 884.499 10.9901 865.66 30.456L859.547 36.772C850.128 46.5049 837.163 52 823.618 52H164.801C150.309 52 136.541 45.6684 127.108 34.6667C108.244 12.6631 80.7071 0 51.7238 0H0Z"
            fill="#f7f5f0"
            className="fill-[#f7f5f0]"
          />
        </svg>
      </div>

      <div className="relative z-10 w-[92%] sm:w-[88%] max-w-7xl mx-auto">
        {/* Section Heading matching What We Offer */}
        <div className="anim-feature-header text-center max-w-3xl mx-auto space-y-2.5 mb-6 sm:mb-8">
          <div>
            <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-white/35 bg-white/10 text-white text-[16px] font-sans font-medium transition-colors">
              Main Features
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight transition-colors">
            Powering the Future of City Management
          </h2>
          <p className="text-base sm:text-lg text-blue-50 leading-relaxed font-sans font-normal transition-colors">
            CivicPulse combines modern geospatial telemetry, automated triage algorithms, and mobile work order
            routing to keep public infrastructure healthy and accountable.
          </p>
        </div>

        {/* ScrollStack Component */}
        <div
          style={{ height: 580 }}
          className="w-full max-w-6xl mx-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [&_*::-webkit-scrollbar]:hidden"
        >
          <ScrollStack
            itemDistance={150}
            itemStackDistance={24}
            stackPosition="48px"
            itemScale={0.04}
            baseScale={0.88}
            dimAmount={0.12}
            holdDistance={180}
            smoothScroll={true}
            wheelContainerRef={sectionRef}
            className="[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {MAIN_FEATURES.map((feature, index) => {
              const theme = CARD_THEMES[index % CARD_THEMES.length];

              return (
                <ScrollStackItem
                  key={feature.id}
                  style={{ backgroundColor: theme.bg, color: '#142038' }}
                  itemClassName="transition-shadow duration-300"
                >
                  <div className="w-full h-full flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-12 select-none">
                    {/* Left Column: Minimal Eyebrow, Focal Title, Clean Description, Dark Pill */}
                    <div className="flex-1 flex flex-col justify-between h-full min-w-0 py-0.5">
                      <div>
                        <div className="flex items-center gap-2 text-sm sm:text-[15px] font-sans font-medium text-[#142038]/80">
                          <span className="font-sans tabular-nums text-xs font-semibold opacity-70">{feature.number}</span>
                          <span className="opacity-40">•</span>
                          <span>{feature.badge}</span>
                        </div>

                        <h3 className="text-xl sm:text-3xl lg:text-[32px] font-semibold font-display text-[#142038] tracking-tight leading-[1.15] mt-2 sm:mt-3">
                          {feature.title}
                        </h3>

                        <p className={`text-xs sm:text-[14px] font-sans font-normal leading-relaxed mt-2.5 sm:mt-3 line-clamp-2 sm:line-clamp-3 max-w-md ${theme.muted}`}>
                          {feature.description}
                        </p>
                      </div>

                      <div className="pt-2">
                        <span className="inline-flex items-center px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#142038] text-white text-xs sm:text-[13px] font-sans font-medium tracking-tight">
                          {feature.subtitle}
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Open Minimal List Matching Reference */}
                    <div className="w-full md:w-[46%] shrink-0 flex flex-col justify-center h-full">
                      <h4 className="text-lg sm:text-2xl font-medium font-display text-[#142038] tracking-tight mb-3 sm:mb-5">
                        Core capabilities
                      </h4>
                      <div className="space-y-2.5 sm:space-y-3.5">
                        {feature.bullets.map((bullet, i) => (
                          <div key={i} className="flex items-start gap-3 text-xs sm:text-[14px] font-sans leading-snug">
                            <span className="w-5 h-5 rounded-full bg-[#142038] flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={12} strokeWidth={2.75} className={theme.checkColor} />
                            </span>
                            <span className={theme.muted}>{bullet}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollStackItem>
              );
            })}
          </ScrollStack>
        </div>
      </div>
    </section>
  );
}
