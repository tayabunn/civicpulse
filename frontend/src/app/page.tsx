'use client';

import React from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setDemoPersona } from '../store/authSlice';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import {
  Flame,
  User,
  HardHat,
  Shield,
  Sparkles,
  ArrowRight,
  LogIn,
  UserPlus,
  LayoutDashboard,
} from 'lucide-react';

export default function LandingPage() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const dashboardPath = user?.role === 'admin'
    ? '/admin'
    : user?.role === 'manager'
    ? '/manager'
    : user?.role === 'staff'
    ? '/staff'
    : '/citizen';

  const personas = [
    {
      role: 'citizen' as const,
      title: 'Citizen Portal',
      desc: 'Report road damage, faulty streetlights, or sewage with GPS coordinates and photo evidence. Track repair status in real-time.',
      icon: User,
      href: '/citizen',
      action: 'Launch Citizen App',
      badge: 'Public Access',
      borderHover: 'hover:border-emerald-500',
    },
    {
      role: 'manager' as const,
      title: 'Department Manager',
      desc: 'Triage pending city incidents, assign field crew members based on workload, flag duplicate issues, and enforce SLA benchmarks.',
      icon: HardHat,
      href: '/manager',
      action: 'Open Triage Hub',
      badge: 'Operations',
      borderHover: 'hover:border-amber-500',
    },
    {
      role: 'staff' as const,
      title: 'Field Maintenance Crew',
      desc: 'Mobile-first work order board. Navigate to exact coordinates via Google Maps and upload photographic completion proof.',
      icon: Shield,
      href: '/staff',
      action: 'Enter Field Orders',
      badge: 'Field Ops',
      borderHover: 'hover:border-blue-500',
    },
    {
      role: 'admin' as const,
      title: 'City Administrator',
      desc: 'Executive analytics suite, citywide resolution trajectory charts, department SLA scorecards, and infrastructure resource allocation.',
      icon: Sparkles,
      href: '/admin',
      action: 'Access Executive BI',
      badge: 'GovTech Admin',
      borderHover: 'hover:border-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-brand-warmWhite text-brand-midnight">
      {/* Top Banner Navigation with Log In & Register Buttons */}
      <header className="border-b border-brand-coolGray bg-surface/90 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-midnight flex items-center justify-center text-brand-yellow font-bold shadow-md group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 fill-brand-yellow text-brand-yellow" />
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-tight text-brand-midnight">
                CIVICPULSE
              </span>
              <span className="text-[10px] font-mono text-brand-cobalt uppercase tracking-widest block font-bold">
                Smart City Platform
              </span>
            </div>
          </Link>

          {/* Quick Portal Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs lg:text-sm font-semibold text-text-secondary">
            <Link href="/citizen" className="hover:text-brand-cobalt transition-colors">Citizen</Link>
            <Link href="/manager" className="hover:text-brand-cobalt transition-colors">Department Hub</Link>
            <Link href="/staff" className="hover:text-brand-cobalt transition-colors">Field Crew</Link>
            <Link href="/admin" className="hover:text-brand-cobalt transition-colors">Admin BI</Link>
          </nav>

          {/* Right Action Controls: Log In & Register Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 font-semibold border-slate-300 text-brand-midnight hover:bg-slate-100"
              >
                <LogIn size={15} />
                <span>Log In</span>
              </Button>
            </Link>

            <Link href="/register">
              <Button
                variant="accent"
                size="sm"
                className="gap-1.5 font-bold shadow-sm bg-brand-yellow text-brand-midnight hover:bg-yellow-400"
              >
                <UserPlus size={15} />
                <span>Register</span>
              </Button>
            </Link>

            {isAuthenticated && user && (
              <Link href={dashboardPath} className="hidden sm:inline-block">
                <Button
                  size="sm"
                  className="gap-1.5 font-bold bg-brand-midnight text-white hover:bg-slate-800 shadow-sm"
                >
                  <LayoutDashboard size={14} />
                  <span>Dashboard</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 px-6 border-b border-brand-coolGray bg-gradient-to-b from-white to-brand-warmWhite">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-midnight text-brand-yellow text-xs font-mono font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Dhaka Smart City Grid • Connected to Neon Cloud PostgreSQL
          </div>

          <h1 className="text-4xl lg:text-6xl font-extrabold font-display text-brand-midnight tracking-tight leading-[1.1]">
            Urban Intelligence Meets <br />
            <span className="text-brand-cobalt underline decoration-brand-yellow decoration-4 underline-offset-8">
              Modern SaaS
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-[#4B5568] max-w-2xl mx-auto font-normal">
            A full-lifecycle municipal platform uniting citizens, department triage dispatchers, field maintenance crews, and city leadership.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/citizen">
              <Button size="lg" className="gap-2 bg-brand-cobalt text-white hover:bg-brand-cobalt-700 font-bold px-8 shadow-md">
                Enter Citizen Portal <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/citizen/create">
              <Button size="lg" variant="accent" className="gap-2 font-bold px-8 shadow-md">
                Report Issue Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Real-time KPI Stats Banner */}
      <section className="py-8 bg-brand-midnight text-brand-warmWhite border-y border-[#34415B]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl lg:text-4xl font-extrabold font-display text-brand-yellow">108+</div>
            <div className="text-xs font-mono text-slate-300 mt-1 uppercase tracking-wider">Active Municipal Incidents</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-extrabold font-display text-white">50m</div>
            <div className="text-xs font-mono text-slate-300 mt-1 uppercase tracking-wider">Duplicate Proximity Radar</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-extrabold font-display text-emerald-400">94.2%</div>
            <div className="text-xs font-mono text-slate-300 mt-1 uppercase tracking-wider">Citywide SLA Resolution</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-extrabold font-display text-brand-yellow">18.5 hrs</div>
            <div className="text-xs font-mono text-slate-300 mt-1 uppercase tracking-wider">Average Resolution Time</div>
          </div>
        </div>
      </section>

      {/* 1-Click Interactive Role Portals */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-cobalt">
            Full-Spectrum GovTech Demo
          </span>
          <h2 className="text-3xl font-extrabold font-display text-brand-midnight">
            Select a Role to Experience CivicPulse
          </h2>
          <p className="text-sm text-[#4B5568] max-w-xl mx-auto">
            Switch between personas instantly with zero friction. Each persona demonstrates dedicated real-time workflows and permissions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((p) => {
            const Icon = p.icon;
            return (
              <Card
                key={p.role}
                className={`flex flex-col justify-between p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${p.borderHover}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-surface-secondary flex items-center justify-center text-brand-cobalt border border-border">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-surface-secondary text-text-muted border border-border">
                      {p.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-display text-brand-midnight mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#4B5568] leading-relaxed mb-6">
                    {p.desc}
                  </p>
                </div>

                <Link
                  href={p.href}
                  onClick={() => dispatch(setDemoPersona(p.role))}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full justify-between font-semibold group text-xs">
                    <span>{p.action}</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-coolGray bg-surface py-8 px-6 text-center text-xs text-text-muted font-mono">
        <p>CivicPulse © 2026 • Signal City Design System v1.0 • Connected to Neon Cloud PostgreSQL</p>
      </footer>
    </div>
  );
}
