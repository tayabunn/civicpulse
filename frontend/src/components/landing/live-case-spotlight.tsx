'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { MapPin, Clock, Building2, CheckCircle2, Radio } from 'lucide-react';

export function LiveCaseSpotlight() {
  const [activeStep, setActiveStep] = useState(3);

  const timelineSteps = [
    {
      step: '01',
      status: 'Submitted',
      detail: 'Citizen reported pothole via smartphone with photo and sub-meter GPS pin.',
      time: '10:15 AM',
      completed: true,
    },
    {
      step: '02',
      status: 'Under Review',
      detail: 'Roads & Highways Department verified report, confirmed no duplicates in 50m radius.',
      time: '10:40 AM',
      completed: true,
    },
    {
      step: '03',
      status: 'Assigned',
      detail: 'Work order dispatched to Mobile Maintenance Crew #03 with asphalt equipment.',
      time: '11:15 AM',
      completed: true,
    },
    {
      step: '04',
      status: 'In Progress',
      detail: 'Field crew arrived at Central Avenue coordinates. Surface milling underway.',
      time: '01:30 PM (Active)',
      active: true,
    },
    {
      step: '05',
      status: 'Resolved',
      detail: 'Post-repair photo evidence uploaded and verified by department manager.',
      time: 'Est. in 2h',
    },
    {
      step: '06',
      status: 'Closed',
      detail: 'Citizen notified on mobile and 5-star resolution feedback recorded.',
      time: 'Pending',
    },
  ];

  return (
    <section id="telemetry" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white border-b border-brand-coolGray">
      <div className="max-w-7xl mx-auto">
        <div className="anim-spotlight-header text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-cobalt">
            Real-Time Resolution Flow
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-brand-midnight tracking-tight">
            Know Where Every Report Stands
          </h2>
          <p className="text-base text-[#4B5568] leading-relaxed">
            Complete transparency from initial report submission to asphalt compaction. No hidden paperwork,
            no lost reports.
          </p>
        </div>

        {/* Verdona-Framed Spotlight Container */}
        <div className="anim-spotlight-card max-w-4xl mx-auto rounded-3xl bg-brand-warmWhite border border-slate-200 p-6 sm:p-10 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-brand-midnight text-brand-yellow">
                  CASE #CP-1024
                </span>
                <span className="text-xs font-semibold text-slate-500">Sector 3, Uttara, Dhaka</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-brand-midnight">
                Deep road cavity near road crossing
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>Status: In Progress</span>
            </div>
          </div>

          {/* Timeline Nodes */}
          <div className="pt-8 space-y-6">
            {timelineSteps.map((item, idx) => (
              <div key={item.step} className="flex items-start gap-4 sm:gap-6 relative group">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                      item.completed
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : item.active
                        ? 'bg-brand-midnight text-brand-yellow ring-4 ring-brand-yellow/50 scale-110'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {item.completed ? <CheckCircle2 size={16} /> : item.step}
                  </div>
                  {idx < timelineSteps.length - 1 && (
                    <div
                      className={`w-0.5 h-12 my-1 ${
                        item.completed ? 'bg-emerald-400' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1 pb-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h4
                      className={`text-sm sm:text-base font-bold font-display ${
                        item.active
                          ? 'text-brand-midnight underline decoration-brand-yellow decoration-2'
                          : item.completed
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {item.status}
                    </h4>
                    <span className="font-mono text-[11px] text-text-muted">{item.time}</span>
                  </div>
                  <p className="text-xs text-[#4B5568] leading-relaxed max-w-xl">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-[#4B5568] flex items-center gap-2">
              <Radio size={14} className="text-emerald-500 animate-pulse" />
              <span>Real-time GPS synchronization connected</span>
            </div>
            <Link href="/citizen/create">
              <Button size="sm" className="bg-brand-midnight text-brand-yellow font-bold rounded-full px-5 hover:bg-slate-800">
                Report Incident Nearby
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
