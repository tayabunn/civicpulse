'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    category: 'Road Damage',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-brand-warmWhite border-b border-brand-coolGray">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column: Verdona Style Info & Context */}
          <div className="anim-contact-info space-y-6">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-brand-cobalt text-xs font-mono font-bold uppercase tracking-wider border border-blue-200">
              Get In Touch
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-brand-midnight tracking-tight">
              Still Have Questions?
            </h2>

            <p className="text-base text-[#4B5568] leading-relaxed max-w-lg">
              Whether you represent a municipal authority looking to integrate department dispatch, or a citizen
              with community improvement proposals, our team is here to support you.
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-brand-cobalt flex items-center justify-center font-bold shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-xs font-mono text-text-muted block">Direct Municipal Desk</span>
                  <span className="font-semibold text-brand-midnight">contact@civicpulse.gov</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="text-xs font-mono text-text-muted block">Emergency Operations Hotline</span>
                  <span className="font-semibold text-brand-midnight">+880 (02) 988-1024 (24/7)</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-xs font-mono text-text-muted block">Central Operations Office</span>
                  <span className="font-semibold text-brand-midnight">Nagar Bhaban, Fulbaria, Dhaka-1000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Verdona "Send Us a Message" Form Card */}
          <div className="anim-contact-card rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-sm">
            <h3 className="text-2xl font-bold font-display text-brand-midnight mb-2">
              Send Us a Message
            </h3>
            <p className="text-xs text-[#4B5568] mb-6">
              Fill in your inquiry details below. Our municipal coordinators respond within 24 hours.
            </p>

            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="text-lg font-bold font-display text-brand-midnight">
                  Message Dispatched Successfully
                </h4>
                <p className="text-xs text-[#4B5568] max-w-xs mx-auto">
                  Thank you for reaching out. A CivicPulse operations officer has received your inquiry.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubmitted(false)}
                  className="rounded-full mt-2"
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cobalt"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Citizen"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cobalt"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="citizen@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cobalt"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">
                      Phone No:
                    </label>
                    <input
                      type="tel"
                      placeholder="+880 1712-345678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cobalt"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    Concern Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cobalt bg-white"
                  >
                    <option value="Road Damage">Road Damage & Asphalt</option>
                    <option value="Streetlights">Streetlights & Electrical</option>
                    <option value="Drainage Problems">Drainage & Waterlogging</option>
                    <option value="Footpath Damage">Footpaths & Sidewalks</option>
                    <option value="Waste Management">Waste Management</option>
                    <option value="Public Infrastructure">Public Parks & Infrastructure</option>
                    <option value="Municipal Partnership">Municipal Department Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    Inquiry Details
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your inquiry or community project proposal..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cobalt resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-brand-midnight text-brand-yellow font-bold text-sm rounded-full gap-2 hover:bg-slate-800 active:scale-[0.97] transition-all shadow"
                >
                  <Send size={16} />
                  <span>Send Message</span>
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
