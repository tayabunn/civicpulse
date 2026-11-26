'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Navbar } from '../components/landing/navbar';
import { HeroAboutTransition } from '../components/landing/hero-about-transition';
import { WhatWeOffer } from '../components/landing/what-we-offer';
import { FeaturesSection } from '../components/landing/features-section';
import { RolesPlansSection } from '../components/landing/roles-plans-section';
import { LiveCaseSpotlight } from '../components/landing/live-case-spotlight';
import { TestimonialSection } from '../components/landing/testimonial-section';
import { FAQSection } from '../components/landing/faq-section';
import { ContactSection } from '../components/landing/contact-section';
import { Footer } from '../components/landing/footer';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export default function LandingPage() {
  const pageContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      if (!isMobile) {
        // 1. Hero Entrance Timeline (Desktop only so mobile LCP paints immediately)
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        heroTl
          .from('.anim-hero-badge', {
            y: -22,
            opacity: 0,
            duration: 0.7,
            ease: 'back.out(1.5)',
          })
          .from(
            '.anim-hero-title',
            {
              y: 40,
              opacity: 0,
              duration: 0.85,
              ease: 'power3.out',
            },
            '-=0.35'
          )
          .from(
            '.anim-hero-desc',
            {
              y: 22,
              opacity: 0,
              duration: 0.7,
            },
            '-=0.45'
          )
          .from(
            '.anim-hero-cta',
            {
              y: 18,
              scale: 0.95,
              opacity: 0,
              duration: 0.6,
              ease: 'back.out(1.2)',
            },
            '-=0.3'
          );
      }

      // 2.5. About Us Section Stagger Reveal on Scroll
      gsap.fromTo(
        '.anim-about-img',
        { opacity: 0, scale: 0.95, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 85%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.anim-about-content',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 85%',
            once: true,
          },
        }
      );

      // 3. What We Offer (Verdona 1-Line Photo Cards) Stagger Reveal & Pinned Horizontal Scroll
      gsap.fromTo(
        '.anim-offer-header',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: '#services',
            start: 'top 85%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.anim-offer-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#services',
            start: 'top 85%',
            once: true,
          },
        }
      );

      const servicesSection = document.querySelector('#services') as HTMLElement;
      const servicesTrack = document.querySelector('#services-track') as HTMLElement;

      if (servicesSection && servicesTrack) {
        const getInitialX = () => {
          const firstCard = servicesTrack.querySelector('.anim-offer-card') as HTMLElement;
          const cardWidth = firstCard ? firstCard.offsetWidth : 400;
          return Math.max(0, window.innerWidth * 0.8 - cardWidth);
        };

        const getFinalX = () => {
          const cards = servicesTrack.querySelectorAll('.anim-offer-card');
          const lastCard = cards[cards.length - 1] as HTMLElement;
          if (!lastCard) return 0;
          // Offset of last card right edge from track start:
          const lastCardRightRel = lastCard.offsetLeft + lastCard.offsetWidth;
          // When x = window.innerWidth - lastCardRightRel, last card right edge aligns with right screen edge (0 right space)
          return window.innerWidth - lastCardRightRel;
        };

        const getTotalScrollDistance = () => {
          return Math.max(100, getInitialX() - getFinalX());
        };

        const holdBuffer = 700; // Generous scroll pause so Main Features does not immediately rise up

        const servicesTl = gsap.timeline({
          scrollTrigger: {
            trigger: servicesSection,
            start: 'top top',
            end: () => `+=${getTotalScrollDistance() + holdBuffer}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 10,
          },
        });

        // 1. Smooth horizontal glide of cards from right to left until last card is flush on the right edge
        servicesTl.fromTo(
          servicesTrack,
          {
            x: () => getInitialX(),
          },
          {
            x: () => getFinalX(),
            ease: 'none',
            duration: 1,
          }
        );

        // 2. Hold state: keeps section pinned and cards in place so Main Features does NOT rise up
        servicesTl.to({}, { duration: 0.4 });
      }

      // 4. Main Features Stagger Reveal on Scroll
      gsap.fromTo(
        '.anim-feature-header',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: '#features',
            start: 'top 90%',
            once: true,
            refreshPriority: 8,
          },
        }
      );

      // 5. Dedicated Portals Stagger Reveal on Scroll
      gsap.fromTo(
        '.anim-role-header',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: '#portals',
            start: 'top 90%',
            once: true,
            refreshPriority: 7,
          },
        }
      );

      ScrollTrigger.batch('.anim-role-card', {
        start: 'top 92%',
        once: true,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 45 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.1,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
            }
          );
        },
      });

      // 6. Live Case Telemetry Spotlight handles its own scoped useGSAP choreography inside LiveCaseSpotlight

      // 7. Testimonial Quote Scale & Fade
      gsap.fromTo(
        '.anim-testimonial-card',
        { opacity: 0, scale: 0.96, y: 25 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.anim-testimonial-card',
            start: 'top 85%',
            once: true,
          },
        }
      );

      // 7.5. FAQ Section Stagger Reveal on Scroll
      gsap.fromTo(
        '.anim-faq-header',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: '#faqs',
            start: 'top 85%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.anim-faq-list',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '#faqs',
            start: 'top 80%',
            once: true,
          },
        }
      );

      // 8. Contact Section Left & Right Slide-In
      gsap.fromTo(
        '.anim-contact-img',
        { opacity: 0, scale: 0.96, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 85%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.anim-contact-form',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 85%',
            once: true,
          },
        }
      );

      // Sort and refresh ScrollTrigger calculations strictly in top-to-bottom DOM/priority order
      const syncScrollTriggers = () => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      };

      syncScrollTriggers();
      const refreshTimer = setTimeout(syncScrollTriggers, 400);

      if (typeof window !== 'undefined') {
        window.addEventListener('load', syncScrollTriggers);
      }

      if (typeof document !== 'undefined' && document.fonts?.ready) {
        document.fonts.ready.then(syncScrollTriggers);
      }

      // Safety safeguard: Ensure cards are never left invisible under any circumstance
      const safetyTimer = setTimeout(() => {
        gsap.to('.anim-role-card, .anim-faq-list', {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          clearProps: 'transform,opacity',
        });
      }, 1000);

      return () => {
        clearTimeout(refreshTimer);
        clearTimeout(safetyTimer);
        if (typeof window !== 'undefined') {
          window.removeEventListener('load', syncScrollTriggers);
        }
      };
    },
    { scope: pageContainerRef }
  );

  return (
    <div
      ref={pageContainerRef}
      className="min-h-screen bg-brand-warmWhite dark:bg-[#0B0F17] text-brand-midnight dark:text-slate-100 flex flex-col font-sans selection:bg-brand-yellow selection:text-brand-midnight antialiased transition-colors duration-300"
    >
      <Navbar />
      <main className="flex-1">
        <HeroAboutTransition />
        <WhatWeOffer />
        <FeaturesSection />
        <RolesPlansSection />
        <LiveCaseSpotlight />
        <TestimonialSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
