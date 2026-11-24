'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

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
        {/* Section Heading matching Verdona's Contact Us Header */}
        <div className="text-center space-y-4 mb-16">
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full border border-slate-300 dark:border-slate-700 text-brand-midnight dark:text-slate-200 text-xs font-sans font-bold uppercase tracking-wider bg-white/70 dark:bg-slate-800/80 transition-colors">
              Contact Us
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-brand-midnight dark:text-white tracking-tight transition-colors">
            Send Us A Message
          </h2>
          <p className="text-base text-text-secondary dark:text-slate-300 max-w-xl mx-auto leading-relaxed transition-colors">
            Have questions about civic reporting, department integration, or municipal dispatch? We are here to help.
          </p>
        </div>

        {/* 2-Column Layout matching Verdona: Photo on Left, Form Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Rounded Photo */}
          <div className="lg:col-span-5 anim-contact-img">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl border-4 border-white dark:border-slate-800 bg-slate-900 group">
              <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80"
                alt="CivicPulse Operations Center"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] font-sans uppercase tracking-widest text-brand-yellow font-bold block mb-1">
                  Dhaka Municipal Headquarters
                </span>
                <p className="text-sm font-semibold leading-snug text-white/95">
                  Central Operations & Rapid Infrastructure Response Unit
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs font-sans text-slate-300">
                  <span>Hotline: +880 (02) 988-1024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean White Form Card matching Verdona */}
          <div className="lg:col-span-7 anim-contact-form">
            <div className="rounded-3xl bg-white dark:bg-[#1B2435] border border-slate-200/90 dark:border-slate-700/80 p-8 sm:p-12 shadow-xl transition-colors">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
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
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block font-sans">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Jane"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block font-sans">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Smith"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block font-sans">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="testing@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block font-sans">
                        Phone No
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+880 1700-000000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block font-sans">
                      Project Details / Inquiry
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Enter inquiry or municipal project details..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-all resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-full bg-brand-midnight text-brand-yellow hover:bg-slate-800 font-bold text-sm shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <span>Submit</span>
                    <ArrowRight size={16} />
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
