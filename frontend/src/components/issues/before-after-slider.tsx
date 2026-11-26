'use client';

import React, { useState } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
}

export function BeforeAfterSlider({ beforeUrl, afterUrl }: BeforeAfterSliderProps) {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#202B45] text-white text-[11px]">
          Before (Reported)
        </span>
        <span className="text-[11px] font-mono text-text-muted">Drag slider to compare</span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e2fa6b] text-[#202B45] text-[11px] font-bold">
          After (Repaired)
        </span>
      </div>

      <div className="relative h-60 sm:h-72 w-full rounded-2xl overflow-hidden border border-border select-none">
        {/* After Image (Full Background) */}
        <img
          src={afterUrl}
          alt="After repair"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Before Image (Clipped to sliderPos) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img
            src={beforeUrl}
            alt="Before repair"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Vertical Divider Line + Handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#315CFF] border-2 border-white text-white flex items-center justify-center shadow-lg">
            <MoveHorizontal size={14} />
          </div>
        </div>

        {/* Invisible Range Input for Smooth Dragging & Accessibility */}
        <input
          type="range"
          min={0}
          max={100}
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          aria-label="Compare before and after repair photos"
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
        />
      </div>
    </div>
  );
}
