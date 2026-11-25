'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from './brand-logo';

interface SmartPreloaderProps {
  exitDirection?: 'top' | 'bottom' | 'left' | 'right';
  duration?: number;
}

export function SmartPreloader({
  exitDirection = 'top',
  duration = 1350,
}: SmartPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 1. Smart Session Lock: Show once per session to maintain high retention
    const hasSeen = sessionStorage.getItem('civicpulse_smart_preloader_seen');
    if (hasSeen) {
      setIsVisible(false);
      return;
    }

    // 2. Bulletproof Scroll Locking (zero layout shift using scrollbar-gutter: stable)
    const originalOverflow = document.documentElement.style.overflow;
    const originalScrollbarGutter = document.documentElement.style.scrollbarGutter;

    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.scrollbarGutter = 'stable';

    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });

    // 3. Dynamic Counter synced with a Slow-Warp timeline
    // Fast start (0-38%), smooth steady pacing (38-84%), decisive snap (84-100%)
    let startTime: number | null = null;
    let animationFrameId: number;

    const updateProgress = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = Math.max(0, currentTime - startTime);
      const t = Math.max(0, Math.min(1, elapsed / duration));

      // Custom Slow-Warp timeline curve: guaranteed strictly non-negative base
      let easedT = 0;
      if (t <= 0) {
        easedT = 0;
      } else if (t < 0.4) {
        // Fast opening burst
        easedT = 0.5 * Math.pow(Math.max(0, t / 0.4), 1.6) * 0.48;
      } else if (t < 0.82) {
        // Deliberate linear steady phase
        const midProgress = Math.max(0, (t - 0.4) / 0.42);
        easedT = 0.24 + midProgress * 0.62;
      } else {
        // Decisive terminal snap
        const endProgress = Math.max(0, (t - 0.82) / 0.18);
        easedT = 0.86 + Math.pow(Math.max(0, endProgress), 1.8) * 0.14;
      }

      const rawPercent = Math.round(easedT * 100);
      const safePercent = Number.isFinite(rawPercent) ? Math.min(100, Math.max(0, rawPercent)) : 0;
      setProgress(safePercent);

      if (t < 1) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        // Short reveal hold for optical polish before fluid exit
        setTimeout(() => {
          setIsDone(true);
          sessionStorage.setItem('civicpulse_smart_preloader_seen', 'true');

          // Release interaction locks smoothly
          setTimeout(() => {
            document.documentElement.style.overflow = originalOverflow;
            document.documentElement.style.scrollbarGutter = originalScrollbarGutter;
            window.removeEventListener('wheel', preventScroll);
            window.removeEventListener('touchmove', preventScroll);
            setIsVisible(false);
          }, 850);
        }, 180);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.documentElement.style.overflow = originalOverflow;
      document.documentElement.style.scrollbarGutter = originalScrollbarGutter;
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, [duration]);

  if (!isVisible) return null;

  // 4-Way Directional Motion Configurations
  const cubicEase = [0.76, 0, 0.24, 1] as const;

  const exitVariants = {
    top: { y: '-100%', transition: { duration: 0.82, ease: cubicEase } },
    bottom: { y: '100%', transition: { duration: 0.82, ease: cubicEase } },
    left: { x: '-100%', transition: { duration: 0.82, ease: cubicEase } },
    right: { x: '100%', transition: { duration: 0.82, ease: cubicEase } },
  };

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="civicpulse-smart-preloader"
          initial={{ y: 0, x: 0 }}
          exit={exitVariants[exitDirection]}
          className="fixed inset-0 z-[999999] flex flex-col justify-between bg-[#305dff] text-white p-7 sm:p-12 select-none overflow-hidden"
          style={{ willChange: 'transform' }}
        >
          {/* Subtle Ambient Radial Lighting in pure brand blue */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#1b44de]/60 blur-3xl pointer-events-none" />
          </div>

          {/* Top Bar: Minimal Brand Identity & Status */}
          <header className="relative z-10 flex items-center justify-between text-xs tracking-wider uppercase font-mono text-white/80">
            <div className="flex items-center gap-2.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>CivicPulse Platform</span>
            </div>
            <div className="hidden sm:block text-white/60">
              Municipal OS &bull; 2026
            </div>
          </header>

          {/* Center Stage: Minimal Logo & Dynamic Counter */}
          <main className="relative z-10 flex flex-col items-center justify-center text-center my-auto">
            {/* Minimal Brand Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="mb-8"
            >
              <BrandLogo size={56} className="text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.15)]" />
            </motion.div>

            {/* Dynamic Percentage Counter */}
            <div className="flex items-baseline justify-center mb-6">
              <span className="text-7xl sm:text-8xl md:text-9xl font-bold font-sans tracking-tight text-white tabular-nums">
                {Number.isFinite(progress) ? progress : 0}
              </span>
              <span className="text-2xl sm:text-3xl font-light text-white/70 ml-1 font-mono">
                %
              </span>
            </div>

            {/* Hairline Progress Rule */}
            <div className="w-48 sm:w-64 h-[2px] bg-white/25 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-white rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
          </main>

          {/* Bottom Bar: Operational Metadata */}
          <footer className="relative z-10 flex items-center justify-between text-[11px] font-mono text-white/75 pt-4 border-t border-white/15">
            <span className="truncate max-w-[200px] sm:max-w-none">
              Dhaka Smart Infrastructure
            </span>
            <span>
              {progress < 100 ? 'Synchronizing...' : 'Ready'}
            </span>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
