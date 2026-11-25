'use client';

import React from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setDemoPersona } from '../../store/authSlice';
import { ROLE_PLANS } from './data';
import { Button } from '../ui/button';
import { Check, ArrowRight } from 'lucide-react';

const PORTAL_THEMES = [
  {
    cardClass: 'bg-[#DCECE4] text-[#142038]', // Soft Sage Mint (matching Main Features Card 01)
    muted: 'text-[#2D4039]',
    checkColor: 'text-[#DCECE4]',
  },
  {
    cardClass: 'bg-[#F2D27A] text-[#142038]', // Warm Honey Gold (matching Main Features Card 02)
    muted: 'text-[#3D3214]',
    checkColor: 'text-[#F2D27A]',
  },
  {
    cardClass: 'bg-[#DCE6FF] text-[#142038]', // Soft Periwinkle Ice (matching Main Features Card 03)
    muted: 'text-[#2B3B5E]',
    checkColor: 'text-[#DCE6FF]',
  },
  {
    cardClass: 'bg-[#E2FB6C] text-[#142038]', // Soft Lime Volt (matching Main Features Card 04)
    muted: 'text-[#2D3816]',
    checkColor: 'text-[#E2FB6C]',
  },
];

export function RolesPlansSection() {
  const dispatch = useDispatch();

  return (
    <section
      id="portals"
      className="py-20 lg:py-28 bg-brand-warmWhite dark:bg-[#0B0F17] border-b border-brand-coolGray dark:border-white/10 transition-colors duration-300 font-sans"
    >
      <div className="w-[80%] mx-auto">
        {/* Section Header matching What We Offer */}
        <div className="anim-role-header text-center max-w-3xl mx-auto space-y-2 mb-16">
          <div>
            <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-base font-sans font-medium transition-colors">
              Portals &amp; Access
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-brand-midnight dark:text-white tracking-tight transition-colors">
            Our Dedicated Portals
          </h2>
          <p className="text-base sm:text-lg text-text-secondary dark:text-slate-300 leading-relaxed font-sans font-normal transition-colors">
            One connected city. Four dedicated operational portals. Seamless role-based access for citizens,
            dispatchers, field crews, and city leadership.
          </p>
        </div>

        {/* 4 Cards Grid — Exact reference width (w-[80%]) & card dimensions with Main Features minimal style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROLE_PLANS.map((plan, index) => {
            const theme = PORTAL_THEMES[index % PORTAL_THEMES.length];
            const cardNumber = String(index + 1).padStart(2, '0');

            return (
              <div
                key={plan.role}
                className={`anim-role-card group relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_8px_28px_rgba(20,32,56,0.06)] hover:shadow-[0_18px_40px_rgba(20,32,56,0.12)] transition-all duration-300 hover:-translate-y-1 ${theme.cardClass}`}
              >
                <div>
                  {/* Minimal Eyebrow matching Main Features */}
                  <div className="flex items-center justify-between gap-2 text-xs font-sans font-medium text-[#142038]/80 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans tabular-nums font-semibold opacity-70">{cardNumber}</span>
                      <span className="opacity-40">•</span>
                      <span>{plan.popular ? `Core ${plan.badge}` : plan.badge}</span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-2xl font-semibold font-display text-[#142038] tracking-tight leading-snug mb-1">
                    {plan.title}
                  </h3>
                  <div className={`text-xs font-sans font-medium opacity-80 mb-3 ${theme.muted}`}>
                    {plan.tagline}
                  </div>
                  <p className={`text-xs font-sans leading-relaxed mb-6 ${theme.muted}`}>
                    {plan.description}
                  </p>

                  {/* Open Minimal Capabilities List (no divider line, matching Main Features) */}
                  <div className="text-sm font-medium font-display text-[#142038] tracking-tight mb-3">
                    Included capabilities
                  </div>

                  <ul className="space-y-2.5 mb-8">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs font-sans leading-snug">
                        <span className="w-4 h-4 rounded-full bg-[#142038] flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={10} strokeWidth={2.75} className={theme.checkColor} />
                        </span>
                        <span className={theme.muted}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Minimal Dark Pill CTA matching Main Features */}
                <Link
                  href={plan.href}
                  onClick={() => dispatch(setDemoPersona(plan.role))}
                  className="w-full block"
                >
                  <Button className="w-full justify-between font-sans font-medium text-xs rounded-full h-11 px-5 bg-[#142038] text-white hover:bg-[#1e2f52] active:scale-[0.97] transition-all">
                    <span>{plan.cta}</span>
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
