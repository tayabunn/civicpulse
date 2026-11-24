import React from 'react';

interface PartnerItem {
  code: string;
  name: string;
  division: string;
  icon: React.ReactNode;
}

const PARTNERS: PartnerItem[] = [
  {
    code: 'DNCC',
    name: 'DNCC',
    division: 'Dhaka North City Corp',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6 sm:w-7 sm:h-7" stroke="currentColor">
        <circle cx="14" cy="14" r="11.5" strokeWidth="1.8" />
        <path d="M5.5 17.5C8.5 14 11 12 14 12C17 12 19.5 14 22.5 17.5" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M14 6V9M9.5 7.5L11 9.5M18.5 7.5L17 9.5" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M7 21C9 20 11 20 14 20C17 20 19 20 21 21" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="15.5" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    code: 'DSCC',
    name: 'DSCC',
    division: 'Dhaka South City Corp',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6 sm:w-7 sm:h-7" stroke="currentColor">
        <circle cx="14" cy="14" r="11.5" strokeWidth="1.8" />
        <path d="M8 20V12C8 9.5 10 7.5 12.5 7.5H15.5C18 7.5 20 9.5 20 12V20" strokeWidth="1.8" />
        <path d="M11 20V14.5C11 13 12.3 11.8 14 11.8C15.7 11.8 17 13 17 14.5V20" strokeWidth="1.8" />
        <circle cx="14" cy="9.5" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    code: 'WASA',
    name: 'Dhaka WASA',
    division: 'Water & Sewerage',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6 sm:w-7 sm:h-7">
        <path d="M14 3.5C14 3.5 6.5 13.5 6.5 18C6.5 22.1 9.9 25.5 14 25.5C18.1 25.5 21.5 22.1 21.5 18C21.5 13.5 14 3.5 14 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M10 18C10 20.2 11.8 22 14 22C16.2 22 18 20.2 18 18C18 15.5 15.5 14 14 14C12.5 14 10 15.5 10 18Z" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="14" cy="18" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    code: 'BRTA',
    name: 'BRTA',
    division: 'Road Transport Auth',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6 sm:w-7 sm:h-7" stroke="currentColor">
        <circle cx="14" cy="14" r="11.5" strokeWidth="1.8" />
        <circle cx="14" cy="14" r="3.5" strokeWidth="1.8" />
        <circle cx="14" cy="14" r="1.5" fill="currentColor" />
        <path d="M14 2.5V10.5M14 17.5V25.5M2.5 14H10.5M17.5 14H25.5" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    code: 'DESCO',
    name: 'DESCO',
    division: 'Power Supply',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6 sm:w-7 sm:h-7">
        <path d="M14 2.5L24 8.2V19.8L14 25.5L4 19.8V8.2L14 2.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M15.5 6.5L9.5 14.5H15L12.5 21.5L19 13H13.5L15.5 6.5Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    code: 'RHD',
    name: 'RHD Bangladesh',
    division: 'Roads & Highways',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6 sm:w-7 sm:h-7">
        <rect x="3.5" y="4.5" width="21" height="19" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M7 23.5L11.5 11.5H16.5L21 23.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 12V23.5" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2.5 2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    code: 'FSCD',
    name: 'Fire Service',
    division: 'Civil Defence',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6 sm:w-7 sm:h-7">
        <path d="M14 2.5L23.5 6.8V13.8C23.5 19.5 19.4 24.2 14 26C8.6 24.2 4.5 19.5 4.5 13.8V6.8L14 2.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M14 9C12.2 11.8 11 13.5 11 15.8C11 17.5 12.3 19 14 19C15.7 19 17 17.5 17 15.8C17 13.5 15.8 11.8 14 9Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    code: 'RAJUK',
    name: 'RAJUK',
    division: 'Urban Development',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6 sm:w-7 sm:h-7">
        <path d="M5 23.5V14L10 9.5V23.5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M10 23.5V5L18 5V23.5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M18 23.5V12.5L23 15.5V23.5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <line x1="3" y1="23.5" x2="25" y2="23.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function PartnersTicker() {
  return (
    <div className="w-full overflow-hidden">
      {/* Verdona-style Centered Minimal Title */}
      <p className="text-center text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 font-sans mb-7 sm:mb-8 tracking-normal">
        Our Trusted Partners
      </p>

      {/* Verdona-style Marquee Ticker with Edge Fade Mask */}
      <div
        className="relative w-full overflow-hidden py-1 select-none"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <div className="flex gap-14 sm:gap-20 items-center whitespace-nowrap animate-marquee">
          {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
            <div
              key={`${partner.code}-${idx}`}
              className="group inline-flex items-center gap-3 text-slate-700 dark:text-slate-300 opacity-80 hover:opacity-100 transition-opacity duration-200 cursor-default"
            >
              <div className="shrink-0 text-slate-800 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                {partner.icon}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm sm:text-[15px] font-bold tracking-tight text-slate-800 dark:text-slate-100 leading-none group-hover:text-black dark:group-hover:text-white transition-colors">
                  {partner.name}
                </span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1 leading-none">
                  {partner.division}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
