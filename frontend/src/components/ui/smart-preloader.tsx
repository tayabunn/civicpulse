'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BrandLogo } from './brand-logo';

/**
 * Exact Slow-Warp timeline calculation from SmartPreloader
 * Creates an organic pacing that naturally slows down around specified milestones (e.g. 27% and 82%)
 */
function createSlowWarp(slowSteps: number[]) {
  const clamp = (val: number) => Math.max(0, Math.min(1, val));
  const bell = (val: number) => {
    const abs = Math.abs(val);
    return abs >= 8 ? 0 : 0.5 * (1 + Math.cos((Math.PI * abs) / 8));
  };
  const stepDensity = (r: number) => {
    if (r >= 100 || !slowSteps.length) return 1;
    let max = 0;
    for (const step of slowSteps) {
      max = Math.max(max, bell(r - step));
    }
    return 1 - 0.88 * clamp(max);
  };

  const table = new Array(201);
  table[0] = 0;
  let accum = 0;
  for (let i = 1; i <= 200; i++) {
    const t0 = ((i - 1) / 200) * 100;
    const t1 = (i / 200) * 100;
    const mid = (t0 + t1) / 2;
    const s = Math.max(1e-4, stepDensity(mid));
    accum += (t1 - t0) / s;
    table[i] = accum;
  }
  const total = accum;

  return (progressRatio: number) => {
    const target = Math.max(0, Math.min(1, progressRatio)) * total;
    let low = 0;
    let high = 200;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (table[mid] < target) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    const idx = Math.max(1, low);
    const prev = table[idx - 1];
    const curr = table[idx];
    const frac = curr > prev ? (target - prev) / (curr - prev) : 0;
    return (idx - 1 + frac) / 200;
  };
}

export function SmartPreloader() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'revealing' | 'exiting' | 'done'>('revealing');
  const [shouldRender, setShouldRender] = useState(true);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setMounted(true);

    // 1. Smart Session Lock: Show once per session
    try {
      const hasSeen = sessionStorage.getItem('civicpulse_smart_preloader_seen');
      if (hasSeen) {
        setShouldRender(false);
        return;
      }
    } catch {
      // Ignore storage errors if private browsing restricted
    }

    // 2. Bulletproof Scroll Locking (zero layout shift)
    const originalOverflow = document.documentElement.style.overflow;
    const originalScrollbarGutter = document.documentElement.style.scrollbarGutter;

    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.scrollbarGutter = 'stable';

    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });

    // 3. Exact SmartPreloader Animation Parameters from preloader.mp4
    const totalRevealMs = 1600; // 1.6s reveal duration
    const fadeMs = 800; // 800ms exit animation
    const slowWarp = createSlowWarp([27, 82]); // Slow steps at 27% and 82%

    const startTime = performance.now();
    let animationFrameId: number;

    const animateProgress = (currentTime: number) => {
      const elapsed = Math.max(0, currentTime - startTime);
      const linearRatio = Math.min(1, elapsed / totalRevealMs);

      // Apply Slow-Warp easing
      const warpedRatio = slowWarp(linearRatio);
      const currentPercent = Math.min(100, Math.max(0, Math.round(warpedRatio * 100)));

      setProgress(currentPercent);
      if (counterRef.current) {
        counterRef.current.textContent = `${currentPercent}%`;
      }

      if (linearRatio < 1) {
        animationFrameId = requestAnimationFrame(animateProgress);
      } else {
        setProgress(100);
        if (counterRef.current) {
          counterRef.current.textContent = '100%';
        }

        // Brief optical hold before fluid exit transition
        setTimeout(() => {
          setStage('exiting');
          sessionStorage.setItem('civicpulse_smart_preloader_seen', 'true');

          // Release scroll locking and remove component when exit completes
          setTimeout(() => {
            document.documentElement.style.overflow = originalOverflow;
            document.documentElement.style.scrollbarGutter = originalScrollbarGutter;
            window.removeEventListener('wheel', preventScroll);
            window.removeEventListener('touchmove', preventScroll);
            setStage('done');
            setShouldRender(false);
          }, fadeMs + 50);
        }, 120);
      }
    };

    animationFrameId = requestAnimationFrame(animateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.documentElement.style.overflow = originalOverflow;
      document.documentElement.style.scrollbarGutter = originalScrollbarGutter;
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  if (!mounted || !shouldRender || stage === 'done') return null;

  const isExiting = stage === 'exiting';

  return (
    <div
      className="fixed inset-0 z-[999999] pointer-events-auto select-none overflow-hidden"
      style={{
        transform: isExiting ? 'translate3d(0%, -100%, 0)' : 'translate3d(0%, 0%, 0)',
        transition: isExiting ? 'transform 800ms cubic-bezier(0.83, 0, 0.17, 1)' : 'none',
        willChange: 'transform',
      }}
    >
      {/* BASE LAYER (Deep Royal Blue - #142878) */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ backgroundColor: '#142878' }}
      >
        {/* PROGRESS LAYER (Exact CivicPulse Blue - #305dff) - Scales bottom-to-top */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: '#305dff',
            transformOrigin: '50% 100%',
            transform: `scaleY(${progress / 100})`,
            transition: 'transform 60ms linear',
            willChange: 'transform',
          }}
        />
      </div>

      {/* TOP HEADER: User Brand Logo & Platform Title */}
      <header
        className="absolute top-6 left-6 sm:top-10 sm:left-12 z-[3] flex items-center gap-3 text-white"
        style={{
          opacity: isExiting ? 0 : 1,
          transition: 'opacity 400ms ease-out',
        }}
      >
        <div className="flex items-center gap-2.5">
          <BrandLogo size={32} className="text-white" />
          <span className="font-sans font-bold text-lg sm:text-xl tracking-tight text-white block">
            CivicPulse
          </span>
        </div>
      </header>

      {/* TOP RIGHT METADATA: Minimal Technical System Indicator */}
      <div
        className="hidden sm:flex absolute top-10 right-12 z-[3] items-center gap-2 text-xs font-mono tracking-widest uppercase text-white/75"
        style={{
          opacity: isExiting ? 0 : 1,
          transition: 'opacity 400ms ease-out',
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <span>Municipal Infrastructure OS</span>
      </div>

      {/* BOTTOM-RIGHT COUNTER: Signature SmartPreloader Oversized Percentage Indicator */}
      <div
        className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 z-[3] pointer-events-none flex items-baseline justify-end"
        style={{
          color: '#FFFFFF',
          lineHeight: '1em',
          letterSpacing: '-0.08em',
        }}
      >
        <span
          ref={counterRef}
          className="font-sans font-semibold tracking-[-0.08em] leading-none text-white tabular-nums text-7xl sm:text-9xl md:text-[180px] lg:text-[230px]"
        >
          {progress}%
        </span>
      </div>
    </div>
  );
}

export default SmartPreloader;
