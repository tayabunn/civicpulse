'use client';

import React from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setDemoPersona } from '../../store/authSlice';
import { ROLE_PLANS } from './data';
import { Button } from '../ui/button';
import { Check, ArrowRight } from 'lucide-react';

export function RolesPlansSection() {
  const dispatch = useDispatch();

  return (
    <section id="portals" className="py-20 lg:py-28 bg-brand-warmWhite dark:bg-[#0B0F17] border-b border-brand-coolGray dark:border-white/10 transition-colors duration-300">
      <div className="w-[80%] mx-auto">
        {/* Section Heading matching Verdona's 'Our Plans' */}
        <div className="anim-role-header text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full border border-slate-300 dark:border-slate-700 text-brand-midnight dark:text-slate-200 text-xs font-mono font-bold uppercase tracking-wider bg-white/70 dark:bg-slate-800/80 transition-colors">
              Portals & Access
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-brand-midnight dark:text-white tracking-tight transition-colors">
            Our Dedicated Portals
          </h2>
          <p className="text-base text-text-secondary dark:text-slate-300 leading-relaxed max-w-2xl mx-auto transition-colors">
            One connected city. Four dedicated operational portals. Seamless role-based access for citizens,
            dispatchers, field crews, and city leadership.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROLE_PLANS.map((plan) => {
            const isPopular = plan.popular;

            return (
              <div
                key={plan.role}
                className={`anim-role-card relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                  isPopular
                    ? 'bg-brand-midnight text-white shadow-xl ring-2 ring-brand-yellow hover:shadow-[0_0_30px_rgba(255,212,71,0.3)]'
                    : 'bg-white dark:bg-[#1B2435] text-brand-midnight dark:text-white border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Popular / Core Dispatch Hub Badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-yellow text-brand-midnight text-[10px] font-mono font-bold uppercase tracking-wider">
                    Core Dispatch Hub
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full ${
                        isPopular
                          ? 'bg-white/15 text-brand-yellow'
                          : 'bg-slate-100 text-brand-cobalt'
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>

                  <h3
                    className={`text-2xl font-black font-display mb-1 ${
                      isPopular ? 'text-white' : 'text-brand-midnight'
                    }`}
                  >
                    {plan.title}
                  </h3>
                  <div className="text-xs font-mono font-bold text-brand-yellow mb-3">
                    {plan.tagline}
                  </div>
                  <p
                    className={`text-xs leading-relaxed mb-6 ${
                      isPopular ? 'text-slate-300' : 'text-[#4B5568]'
                    }`}
                  >
                    {plan.description}
                  </p>

                  <div
                    className={`pt-4 border-t text-xs font-mono font-bold uppercase tracking-wider mb-4 ${
                      isPopular ? 'border-slate-700 text-slate-300' : 'border-slate-100 text-slate-400'
                    }`}
                  >
                    What's included:
                  </div>

                  <ul className="space-y-2.5 mb-8">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <Check
                          size={15}
                          className={`shrink-0 mt-0.5 ${
                            isPopular ? 'text-brand-yellow' : 'text-brand-cobalt'
                          }`}
                        />
                        <span className={isPopular ? 'text-slate-200' : 'text-slate-700'}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={plan.href}
                  onClick={() => dispatch(setDemoPersona(plan.role))}
                  className="w-full block"
                >
                  <Button
                    className={`w-full justify-between font-bold text-xs rounded-full h-11 active:scale-[0.97] transition-all ${
                      isPopular
                        ? 'bg-brand-yellow text-brand-midnight hover:bg-yellow-400'
                        : 'bg-brand-midnight text-brand-yellow hover:bg-slate-800'
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight size={14} />
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
