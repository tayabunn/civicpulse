'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { CheckCircle2 } from 'lucide-react';

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 lg:py-32 bg-brand-warmWhite dark:bg-[#0B0F17] border-b border-brand-coolGray dark:border-white/10 transition-colors duration-300">
      <div className="w-[80%] mx-auto">
        {/* Section Heading matching Real-Time Resolution Flow & What We Offer */}
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-14 lg:mb-16">
          <div>
            <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-base font-sans font-medium transition-colors">
              Contact Us
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-brand-midnight dark:text-white tracking-tight transition-colors">
            Send Us A Message
          </h2>
          <p className="text-base sm:text-lg text-text-secondary dark:text-slate-300 leading-relaxed font-sans font-normal transition-colors">
            Have questions about civic reporting, department integration, or municipal dispatch?{' '}
            <br className="hidden sm:inline" />
            We are here to help.
          </p>
        </div>

        {/* 2-Column Equal-Size Layout matching Reference: Same Width (50/50) & Same Height (items-stretch) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Clean Rounded Photo Card */}
          <div className="anim-contact-img h-full flex">
            <div className="relative w-full h-full min-h-[420px] lg:min-h-[520px] rounded-3xl overflow-hidden bg-slate-900 group shadow-[0_8px_28px_rgba(20,32,56,0.06)]">
              <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80"
                alt="CivicPulse Operations Center"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] font-sans uppercase tracking-widest text-brand-yellow font-semibold block mb-1">
                  Dhaka Municipal Headquarters
                </span>
                <p className="text-sm font-semibold font-sans leading-snug text-white/95">
                  Central Operations &amp; Rapid Infrastructure Response Unit
                </p>
                <div className="mt-2.5 flex items-center gap-2 text-xs font-sans text-slate-300">
                  <span>Hotline: +880 (02) 988-1024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Minimal Underline Form Card matching Reference */}
          <div className="anim-contact-form h-full flex">
            <div className="w-full h-full rounded-3xl bg-white/65 dark:bg-[#1B2435] border border-slate-200/80 dark:border-slate-700/80 p-7 sm:p-9 lg:p-10 shadow-[0_8px_28px_rgba(20,32,56,0.04)] flex flex-col justify-between transition-colors">
              {submitted ? (
                <div className="my-auto py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-brand-midnight dark:text-white">
                    Message Dispatched Successfully
                  </h3>
                  <p className="text-sm text-text-secondary dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. A CivicPulse municipal operations officer will review your inquiry
                    and respond within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                    className="rounded-full mt-4 px-6 border-slate-300 dark:border-slate-700 text-brand-midnight dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="h-full flex flex-col justify-between gap-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-brand-midnight dark:text-slate-200 mb-1 block font-sans">
                          First Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Jane"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full bg-transparent border-0 border-b border-slate-300 dark:border-slate-700 rounded-none px-0 py-2.5 text-sm font-sans text-brand-midnight dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#315CFF] dark:focus:border-[#7D96FF] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-brand-midnight dark:text-slate-200 mb-1 block font-sans">
                          Last Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Smith"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full bg-transparent border-0 border-b border-slate-300 dark:border-slate-700 rounded-none px-0 py-2.5 text-sm font-sans text-brand-midnight dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#315CFF] dark:focus:border-[#7D96FF] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-brand-midnight dark:text-slate-200 mb-1 block font-sans">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="testing@gmail.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-transparent border-0 border-b border-slate-300 dark:border-slate-700 rounded-none px-0 py-2.5 text-sm font-sans text-brand-midnight dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#315CFF] dark:focus:border-[#7D96FF] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-brand-midnight dark:text-slate-200 mb-1 block font-sans">
                          Phone No:
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+880 1700-000000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-transparent border-0 border-b border-slate-300 dark:border-slate-700 rounded-none px-0 py-2.5 text-sm font-sans text-brand-midnight dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#315CFF] dark:focus:border-[#7D96FF] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-brand-midnight dark:text-slate-200 mb-1 block font-sans">
                        Project Details
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Enter inquiry or municipal project details..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-transparent border-0 border-b border-slate-300 dark:border-slate-700 rounded-none px-0 py-2.5 text-sm font-sans text-brand-midnight dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#315CFF] dark:focus:border-[#7D96FF] transition-colors resize-y"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-full bg-brand-midnight dark:bg-[#315CFF] text-white hover:bg-[#315CFF] dark:hover:bg-[#244BE0] font-sans font-semibold text-sm active:scale-[0.98] transition-all flex items-center justify-center"
                  >
                    <span>Submit</span>
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
