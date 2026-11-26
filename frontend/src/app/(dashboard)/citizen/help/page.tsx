'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PhoneCall, Copy, Check, ShieldAlert, LifeBuoy, ArrowRight } from 'lucide-react';

const HOTLINES = [
  {
    name: 'National Emergency Service',
    number: '999',
    desc: 'Immediate Police, Fire Service & Ambulance dispatch across Bangladesh.',
    urgent: true,
  },
  {
    name: 'Dhaka North City Corporation (DNCC)',
    number: '16106',
    desc: 'Road damage, streetlights, waste & mosquito control (North zones).',
    urgent: false,
  },
  {
    name: 'Dhaka South City Corporation (DSCC)',
    number: '16104',
    desc: 'Municipal roads, footpaths, drainage & street hazards (South zones).',
    urgent: false,
  },
  {
    name: 'Dhaka WASA Helpline',
    number: '16162',
    desc: 'Water pipe bursts, sewage overflow & water supply disruptions.',
    urgent: false,
  },
  {
    name: 'DESCO Electricity Support',
    number: '16120',
    desc: 'Fallen power lines, transformer sparks & streetlight grid faults (North).',
    urgent: false,
  },
  {
    name: 'DPDC Electricity Support',
    number: '16116',
    desc: 'Electrical emergencies, pole hazards & power outages (South/Central).',
    urgent: false,
  },
];

export default function CitizenHelpPage() {
  const [copiedNum, setCopiedNum] = useState<string | null>(null);

  const handleCopy = (num: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(num);
      setCopiedNum(num);
      setTimeout(() => setCopiedNum(null), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-[#202B45] dark:bg-[#141B29] border border-[#34415B] dark:border-[#232F46] p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e2fa6b] text-[#202B45] text-xs font-bold">
            <LifeBuoy size={14} /> 24/7 Emergency Directory
          </span>
          <h2 className="text-3xl font-bold font-display">
            Emergency Hotlines &amp;{' '}
            <span className="font-serif italic font-normal text-[#e2fa6b]">Citizen Guide</span>
          </h2>
          <p className="text-sm text-slate-300 max-w-xl">
            For life-threatening emergencies like live electrical wires or major accidents, call 999 immediately, or submit a geo-pinned report here.
          </p>
        </div>

        <Link href="/citizen/create" className="shrink-0">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-6 h-12 rounded-full bg-[#315CFF] hover:bg-[#244BE0] text-white text-sm font-bold transition-colors"
          >
            <span>Report Issue Online</span>
            <ArrowRight size={15} />
          </button>
        </Link>
      </div>

      {/* Hotlines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {HOTLINES.map((item) => (
          <div
            key={item.number}
            className={`rounded-2xl p-5 border flex flex-col justify-between space-y-4 ${
              item.urgent
                ? 'bg-white dark:bg-[#141B29] border-[#315CFF] dark:border-[#6280FF]'
                : 'bg-white dark:bg-[#141B29] border-[#D5DAE3] dark:border-[#232F46]'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    item.urgent
                      ? 'bg-[#e2fa6b] text-[#202B45]'
                      : 'bg-[#315CFF]/10 text-[#315CFF] dark:text-[#91A5FF]'
                  }`}
                >
                  {item.urgent ? '24/7 Critical' : 'Municipal Desk'}
                </span>
                <ShieldAlert
                  size={16}
                  className={item.urgent ? 'text-[#315CFF]' : 'text-[#606B7D]'}
                />
              </div>
              <h3 className="font-bold text-base text-[#202B45] dark:text-white">{item.name}</h3>
              <p className="text-sm text-[#606B7D] dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E2E5ED] dark:border-[#232F46] flex items-center justify-between">
              <span className="text-2xl font-serif font-normal text-[#315CFF] dark:text-[#6280FF]">
                {item.number}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(item.number)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F0F1F5] dark:bg-[#1B2435] text-xs font-semibold text-[#202B45] dark:text-slate-200 hover:bg-[#E2E5ED] transition-colors"
                >
                  {copiedNum === item.number ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedNum === item.number ? 'Copied' : 'Copy'}</span>
                </button>
                <a
                  href={`tel:${item.number}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#315CFF] hover:bg-[#244BE0] text-white text-xs font-semibold transition-colors"
                >
                  <PhoneCall size={12} />
                  <span>Call</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
