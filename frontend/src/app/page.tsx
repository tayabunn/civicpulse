'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Navbar } from '../components/landing/navbar';
import { HeroSection } from '../components/landing/hero-section';
import { AboutSection } from '../components/landing/about-section';
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
      // 1. Hero Entrance Timeline (Framer spring / soft ease-out)
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
          clearProps: 'all',
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
          clearProps: 'all',
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
        const getInitialOffset = () => {
          const firstCard = servicesTrack.querySelector('.anim-offer-card') as HTMLElement;
          const cardWidth = firstCard ? firstCard.offsetWidth : 400;
          return Math.max(0, window.innerWidth * 0.8 - cardWidth);
        };

        const getTotalScrollDistance = () => {
          const cards = servicesTrack.querySelectorAll('.anim-offer-card');
          const firstCard = cards[0] as HTMLElement;
          const cardWidth = firstCard ? firstCard.offsetWidth : 400;
          const gap = parseFloat(window.getComputedStyle(servicesTrack).gap) || 32;
          // Travel exactly enough so the last card arrives at the right boundary, then release pin
          return (cards.length - 1) * (cardWidth + gap);
        };

        gsap.fromTo(
          servicesTrack,
          {
            x: () => getInitialOffset(),
          },
          {
            x: () => getInitialOffset() - getTotalScrollDistance(),
            ease: 'none',
            scrollTrigger: {
              trigger: servicesSection,
              start: 'top top',
              end: () => `+=${getTotalScrollDistance()}`,
              pin: true,
              pinSpacing: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          }
        );
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
          },
        }
      );

      ScrollTrigger.batch('.anim-feature-card', {
        start: 'top 92%',
        once: true,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.1,
              ease: 'power3.out',
              clearProps: 'all',
            }
          );
        },
      });

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
              clearProps: 'all',
            }
          );
        },
      });

      // 6. Live Case Telemetry Spotlight & Timeline Nodes
      gsap.fromTo(
        '.anim-spotlight-header',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: '#telemetry',
            start: 'top 90%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.anim-spotlight-card',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: '#telemetry',
            start: 'top 85%',
            once: true,
          },
        }
      );

      ScrollTrigger.batch('.anim-timeline-node', {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, x: -25 },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              stagger: 0.08,
              ease: 'power2.out',
              clearProps: 'all',
            }
          );
        },
      });

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
          clearProps: 'all',
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
          clearProps: 'all',
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
          clearProps: 'all',
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
          clearProps: 'all',
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 85%',
            once: true,
          },
        }
      );

      // Refresh ScrollTrigger calculations
      ScrollTrigger.refresh();
      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 400);

      if (typeof window !== 'undefined') {
        window.addEventListener('load', () => ScrollTrigger.refresh());
      }

      // Safety safeguard: Ensure cards are never left invisible under any circumstance
      const safetyTimer = setTimeout(() => {
        gsap.to('.anim-feature-card, .anim-role-card, .anim-spotlight-card, .anim-faq-list', {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          clearProps: 'all',
        });
      }, 1000);

      return () => {
        clearTimeout(refreshTimer);
        clearTimeout(safetyTimer);
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
        <HeroSection />
        <AboutSection />
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
