'use client';

import React, { useRef } from 'react';
import { useScroll, useReducedMotion } from 'motion/react';
import { HeroSection } from './hero-section';
import { AboutSection } from './about-section';

export function HeroAboutTransition() {
  const aboutBoundaryRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: aboutBoundaryRef,
    offset: ['start end', 'start start'],
  });

  const activeProgress = prefersReducedMotion ? undefined : scrollYProgress;

  return (
    <div className="relative bg-brand-midnight dark:bg-[#0B0F17] overflow-x-clip">
      <HeroSection scrollYProgress={activeProgress} />
      <div ref={aboutBoundaryRef} className="relative z-10">
        <AboutSection scrollYProgress={activeProgress} />
      </div>
    </div>
  );
}
