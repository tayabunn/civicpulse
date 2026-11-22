'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setDemoPersona } from '../store/authSlice';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { BrandLogo } from '../components/ui/brand-logo';
import {
  User,
  HardHat,
  Shield,
  Sparkles,
  ArrowRight,
  LogIn,
  UserPlus,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Activity,
  Filter,
  BarChart3,
  TrendingUp,
  Building2,
  Zap,
  Droplets,
  Trash2,
  Footprints,
  Construction,
  ExternalLink,
  ChevronRight,
  Compass,
  FileText,
  Menu,
  X,
} from 'lucide-react';

export default function LandingPage() {
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Section 05: Interactive Map State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMarkerId, setSelectedMarkerId] = useState<string>('CP-1024');

  // Sample real-world issues located across Dhaka's municipal grid
  const sampleMapIssues = [
    {
      id: 'CP-1024',
      title: 'Deep road cavity near road crossing',
      category: 'Road Damage',
      categoryKey: 'road',
      location: 'Central Avenue, Sector 3, Uttara',
      coordinates: '23.8759° N, 90.3795° E',
      status: 'In Progress',
      statusKey: 'in_progress',
      department: 'Roads & Highways Department',
      priority: 'High',
      time: '25m ago',
      reportedBy: 'Citizen Reporter #842',
      x: 32, // percentage on map preview
      y: 28,
    },
    {
      id: 'CP-1048',
      title: 'Flickering high-voltage street pole light',
      category: 'Streetlights',
      categoryKey: 'lighting',
      location: 'Road 11, Block D, Banani',
      coordinates: '23.7937° N, 90.4043° E',
      status: 'Under Review',
      statusKey: 'under_review',
      department: 'Electrical & Street Lighting',
      priority: 'Medium',
      time: '1h ago',
      reportedBy: 'Citizen Reporter #319',
      x: 64,
      y: 42,
    },
    {
      id: 'CP-1062',
      title: 'Monsoon waterlogging & clogged drain inlet',
      category: 'Drainage Problems',
      categoryKey: 'drainage',
      location: 'Satmasjid Road, Dhanmondi',
      coordinates: '23.7461° N, 90.3742° E',
      status: 'Assigned',
      statusKey: 'assigned',
      department: 'Water & Sewerage Authority',
      priority: 'Urgent',
      time: '2h ago',
      reportedBy: 'Citizen Reporter #156',
      x: 38,
      y: 68,
    },
    {
      id: 'CP-1077',
      title: 'Overflowing commercial waste container',
      category: 'Waste Management',
      categoryKey: 'waste',
      location: 'Gulshan Avenue Circle 2',
      coordinates: '23.7925° N, 90.4167° E',
      status: 'Resolved',
      statusKey: 'resolved',
      department: 'Waste Management Division',
      priority: 'High',
      time: '4h ago',
      reportedBy: 'Citizen Reporter #904',
      x: 76,
      y: 35,
    },
    {
      id: 'CP-1089',
      title: 'Severely cracked pedestrian tactile tiles',
      category: 'Footpath Damage',
      categoryKey: 'footpath',
      location: 'Mirpur-10 Roundabout, Section 10',
      coordinates: '23.8069° N, 90.3687° E',
      status: 'Under Review',
      statusKey: 'under_review',
      department: 'Civil Infrastructure Division',
      priority: 'Low',
      time: '5h ago',
      reportedBy: 'Citizen Reporter #411',
      x: 22,
      y: 48,
    },
    {
      id: 'CP-1095',
      title: 'Damaged community park bench & safety barrier',
      category: 'Public Infrastructure',
      categoryKey: 'infrastructure',
      location: 'Ramna Green Park, Shahbagh',
      coordinates: '23.7383° N, 90.3995° E',
      status: 'Resolved',
      statusKey: 'resolved',
      department: 'Parks & Public Amenities',
      priority: 'Medium',
      time: 'Yesterday',
      reportedBy: 'Citizen Reporter #627',
      x: 54,
      y: 78,
    },
  ];

  const filteredMapIssues = sampleMapIssues.filter((issue) => {
    const matchCategory = selectedCategory === 'all' || issue.categoryKey === selectedCategory;
    const matchStatus = selectedStatus === 'all' || issue.statusKey === selectedStatus;
    return matchCategory && matchStatus;
  });

  const activeIssue =
    sampleMapIssues.find((i) => i.id === selectedMarkerId) ||
    filteredMapIssues[0] ||
    sampleMapIssues[0];

  // 4 Roles definition
  const roles = [
    {
      role: 'citizen' as const,
      title: 'Citizens',
      desc: 'Report local problems, track submissions in real time, and share feedback on resolved civic issues.',
      icon: User,
      href: '/citizen',
      cta: 'Report & Track →',
      badge: 'Public Portal',
      accentColor: 'hover:border-emerald-500',
    },
    {
      role: 'manager' as const,
      title: 'Department Managers',
      desc: 'Verify incoming reports, prioritize issues, assign tasks to field staff, and monitor team performance.',
      icon: HardHat,
      href: '/manager',
      cta: 'Manage Departments →',
      badge: 'Dispatch Hub',
      accentColor: 'hover:border-amber-500',
    },
    {
      role: 'staff' as const,
      title: 'Maintenance Staff',
      desc: 'Access assigned tasks on mobile, navigate to coordinates, submit progress updates, and document completed work.',
      icon: Shield,
      href: '/staff',
      cta: 'Manage Tasks →',
      badge: 'Field Ops',
      accentColor: 'hover:border-blue-500',
    },
    {
      role: 'admin' as const,
      title: 'Administrators',
      desc: 'Oversee departments, manage user roles, enforce SLA benchmarks, and access system-wide intelligence.',
      icon: Sparkles,
      href: '/admin',
      cta: 'System Overview →',
      badge: 'GovTech BI',
      accentColor: 'hover:border-purple-500',
    },
  ];

  // 6 Issues Categories
  const issueCategories = [
    {
      id: 'road',
      title: 'Road Damage',
      description: 'Potholes, cracked roads, and damaged driving surfaces.',
      icon: Construction,
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'lighting',
      title: 'Streetlights',
      description: 'Broken lights, flickering poles, and poorly illuminated streets.',
      icon: Zap,
      bg: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    },
    {
      id: 'drainage',
      title: 'Drainage Problems',
      description: 'Blocked stormwater drains, waterlogging, and flooding hazards.',
      icon: Droplets,
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'footpath',
      title: 'Footpath Damage',
      description: 'Broken sidewalks, blocked walkways, and unsafe pedestrian paths.',
      icon: Footprints,
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'waste',
      title: 'Waste Management',
      description: 'Uncollected garbage, overflowing public bins, and illegal dumping.',
      icon: Trash2,
      bg: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    {
      id: 'infrastructure',
      title: 'Public Infrastructure',
      description: 'Damaged public facilities, broken benches, and community assets.',
      icon: Building2,
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  return (
    <div className="min-h-screen bg-brand-warmWhite text-brand-midnight flex flex-col font-sans selection:bg-brand-yellow selection:text-brand-midnight">
      {/* ========================================================= */}
      {/* NAVBAR: Clean, Focused, Protected, with BrandLogo in #202B45 */}
      {/* ========================================================= */}
      <header className="border-b border-brand-coolGray bg-surface/95 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo without square background container */}
          <Link href="/" className="flex items-center gap-3 group">
            <BrandLogo size={36} className="text-[#202B45] group-hover:scale-105 transition-transform" />
            <div>
              <span className="font-display font-extrabold text-xl tracking-tight text-brand-midnight">
                CIVICPULSE
              </span>
              <span className="text-[10px] font-mono text-brand-cobalt uppercase tracking-widest block font-bold">
                Smart City Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-text-secondary">
            <Link href="/" className="text-brand-midnight hover:text-brand-cobalt transition-colors">
              Home
            </Link>
            <a href="#how-it-works" className="hover:text-brand-cobalt transition-colors">
              How It Works
            </a>
            <a href="#explore-map" className="hover:text-brand-cobalt transition-colors">
              Explore Issues
            </a>
            <a href="#departments" className="hover:text-brand-cobalt transition-colors">
              Departments
            </a>
            <a href="#analytics" className="hover:text-brand-cobalt transition-colors">
              Insights
            </a>
          </nav>

          {/* Right Action Controls: Log In & Report CTA */}
          <div className="hidden sm:flex items-center gap-3">
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

            <Link href="/citizen/create">
              <Button
                size="sm"
                className="gap-1.5 font-bold shadow-sm bg-brand-yellow text-brand-midnight hover:bg-yellow-400"
              >
                <span>Report an Issue</span>
                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-brand-midnight hover:bg-slate-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-slate-200 mt-3 space-y-3">
            <div className="flex flex-col space-y-2 text-sm font-semibold text-text-secondary">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-100"
              >
                Home
              </Link>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-100"
              >
                How It Works
              </a>
              <a
                href="#explore-map"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-100"
              >
                Explore Issues
              </a>
              <a
                href="#departments"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-100"
              >
                Departments
              </a>
              <a
                href="#analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-100"
              >
                City Insights
              </a>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full gap-1.5">
                  <LogIn size={14} /> Log In
                </Button>
              </Link>
              <Link href="/citizen/create" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full bg-brand-yellow text-brand-midnight font-bold">
                  Report Issue
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* SECTION 01 — HERO SECTION (Urban Intelligence & Floating UI) */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 px-4 sm:px-6 lg:px-8 border-b border-brand-coolGray bg-gradient-to-b from-white via-brand-warmWhite to-white">
        <div className="max-w-7xl mx-auto">
          {/* Top Live Status Indicator */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-midnight text-brand-yellow text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>A smarter way to care for your city • Connected to Neon Cloud PostgreSQL</span>
            </div>
          </div>

          {/* Hero Headlines */}
          <div className="text-center max-w-4xl mx-auto space-y-5">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-brand-midnight tracking-tight leading-[1.12]">
              Your City. Your Voice. <br className="hidden sm:inline" />
              <span className="text-brand-cobalt underline decoration-brand-yellow decoration-4 underline-offset-8">
                A Better Tomorrow.
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-[#4B5568] max-w-2xl mx-auto leading-relaxed">
              Every street tells a story. Report infrastructure issues, track their progress, and help
              build a safer, cleaner, and more connected community.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link href="/citizen/create">
                <Button size="lg" className="gap-2 bg-brand-cobalt text-white hover:bg-brand-cobalt-700 font-bold px-8 shadow-md h-12 text-base">
                  <span>Report an Issue</span>
                  <ArrowRight size={18} />
                </Button>
              </Link>

              <a href="#explore-map">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 font-bold px-7 border-slate-300 text-brand-midnight hover:bg-slate-100 h-12 text-base"
                >
                  <Compass size={18} className="text-brand-cobalt" />
                  <span>Explore City Issues</span>
                </Button>
              </a>
            </div>

            <p className="text-xs font-mono text-text-muted uppercase tracking-wider pt-1">
              Report responsibly. Stay informed. Make an impact.
            </p>
          </div>

          {/* Floating UI Elements Mockup / Editorial Smart City Showcase */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            {/* Background grid texture container */}
            <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-tr from-slate-900 via-[#1E293B] to-[#0F172A] p-4 sm:p-8 shadow-2xl relative overflow-hidden">
              {/* Subtle map coordinate grid background */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(#315CFF 1px, transparent 1px), radial-gradient(#FFD447 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                  backgroundPosition: '0 0, 16px 16px',
                }}
              />

              {/* Header inside the interactive preview */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-700/60 text-slate-300 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="font-bold text-white uppercase tracking-wider">
                    Dhaka Smart Grid Telemetry • Real-Time Dispatch
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700">
                    Active Coordinates: 23.8103° N, 90.4125° E
                  </span>
                </div>
              </div>

              {/* Floating UI Cards Grid */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 pt-6">
                {/* Floating Card 1: Citizen Reported Incident */}
                <div className="bg-surface/95 backdrop-blur-md rounded-xl p-4 border border-slate-200 shadow-xl transition-transform hover:-translate-y-1">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold font-mono">
                      #CP-1024
                    </span>
                    <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                      <Clock size={12} /> 25m ago
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-brand-midnight mb-1 line-clamp-1">
                    Deep pothole near Central Avenue
                  </h4>
                  <p className="text-xs text-text-muted flex items-center gap-1 mb-3">
                    <MapPin size={12} className="text-brand-cobalt shrink-0" />
                    <span className="truncate">Sector 3, Uttara, Dhaka</span>
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="font-semibold text-slate-700">Road Damage</span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold">
                      Under Review
                    </span>
                  </div>
                </div>

                {/* Floating Card 2: Operations Dispatch / In Progress */}
                <div className="bg-surface/95 backdrop-blur-md rounded-xl p-4 border-2 border-brand-yellow shadow-xl transition-transform hover:-translate-y-1 relative">
                  <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded bg-brand-midnight text-brand-yellow text-[10px] font-mono font-bold tracking-wider uppercase">
                    Active Crew
                  </div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-brand-cobalt font-bold font-mono">
                      #CP-1048
                    </span>
                    <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                      <Clock size={12} /> 1h ago
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-brand-midnight mb-1 line-clamp-1">
                    Streetlight repair · Sector 4
                  </h4>
                  <p className="text-xs text-text-muted flex items-center gap-1 mb-3">
                    <MapPin size={12} className="text-brand-cobalt shrink-0" />
                    <span className="truncate">Road 11, Banani, Dhaka</span>
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[11px] text-slate-500 font-mono">Staff: Crew #03</span>
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-mono text-[10px] font-bold">
                      In Progress
                    </span>
                  </div>
                </div>

                {/* Floating Card 3: Real-Time Performance Widget */}
                <div className="bg-surface/95 backdrop-blur-md rounded-xl p-4 border border-slate-200 shadow-xl transition-transform hover:-translate-y-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Citywide KPI
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                        Target Met
                      </span>
                    </div>
                    <div className="text-2xl font-black font-display text-brand-midnight">
                      94.2% <span className="text-xs font-sans font-normal text-slate-500">SLA rate</span>
                    </div>
                    <p className="text-xs text-[#4B5568] mt-1">
                      108+ total verified incidents tracked with automated duplicate detection.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-600">
                    <span>Avg Resolution</span>
                    <span className="font-bold text-brand-cobalt">18.5 hrs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 02 — CIVIC IMPACT / PLATFORM OVERVIEW */}
      {/* ========================================================= */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-brand-coolGray bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-cobalt">
              Platform Overview
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-brand-midnight tracking-tight">
              One Platform. A Better-Connected City.
            </h2>
            <p className="text-base text-[#4B5568] leading-relaxed">
              CivicPulse brings citizens, government departments, and maintenance teams together to make
              infrastructure management more transparent, organized, and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Capability 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-brand-cobalt/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-cobalt flex items-center justify-center mb-5 font-bold">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-brand-midnight mb-2">
                Citizen Reporting
              </h3>
              <p className="text-xs text-[#4B5568] leading-relaxed">
                Report public infrastructure problems with photos, descriptions, and precise GPS locations
                in seconds.
              </p>
            </div>

            {/* Capability 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-amber-400/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-5 font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-brand-midnight mb-2">
                Smart Issue Management
              </h3>
              <p className="text-xs text-[#4B5568] leading-relaxed">
                Review, verify, prioritize, and assign reports to the right departments with duplicate
                detection radar.
              </p>
            </div>

            {/* Capability 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-emerald-400/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5 font-bold">
                <HardHat className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-brand-midnight mb-2">
                Team Coordination
              </h3>
              <p className="text-xs text-[#4B5568] leading-relaxed">
                Connect department managers with maintenance teams and monitor ongoing repair work in the
                field.
              </p>
            </div>

            {/* Capability 4 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-purple-400/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-5 font-bold">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-brand-midnight mb-2">
                Data-Driven Insights
              </h3>
              <p className="text-xs text-[#4B5568] leading-relaxed">
                Understand infrastructure challenges through real-time reports, heatmaps, and performance
                analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 03 — ISSUES WE HELP ADDRESS */}
      {/* ========================================================= */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-brand-coolGray bg-brand-warmWhite">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-cobalt">
              Reportable Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-brand-midnight tracking-tight">
              Every Issue Matters. Every Report Counts.
            </h2>
            <p className="text-base text-[#4B5568] leading-relaxed">
              From damaged roads to overflowing drains, help identify the problems affecting your
              neighborhood and bring them to the attention of the right teams.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {issueCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="group p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-brand-cobalt/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${cat.bg}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold font-display text-brand-midnight mb-2 group-hover:text-brand-cobalt transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-[#4B5568] leading-relaxed mb-6">
                      {cat.description}
                    </p>
                  </div>

                  <Link
                    href="/citizen/create"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-cobalt hover:text-brand-cobalt-700 transition-colors pt-3 border-t border-slate-100"
                  >
                    <span>Report a Problem</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 04 — HOW IT WORKS: THE 4-STEP RESOLUTION JOURNEY */}
      {/* ========================================================= */}
      <section id="how-it-works" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-brand-coolGray bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-cobalt">
              Core User Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-brand-midnight tracking-tight">
              From Reporting to Resolution. Every Step Matters.
            </h2>
            <p className="text-base text-[#4B5568] leading-relaxed">
              Making your neighborhood better shouldn't be complicated. CivicPulse makes it easier to report
              problems and stay informed as they move toward resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="relative flex flex-col items-start p-6 rounded-2xl bg-surface border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-brand-midnight text-brand-yellow font-display font-black flex items-center justify-center text-sm mb-4 shadow">
                01
              </div>
              <h3 className="text-lg font-bold font-display text-brand-midnight mb-2">
                Spot & Report
              </h3>
              <p className="text-xs text-[#4B5568] leading-relaxed">
                Notice a problem? Capture a photo, describe the issue, and pin its exact location on the
                interactive map.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200/80 w-full text-[11px] font-mono text-brand-cobalt font-bold">
                Citizen Portal
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-start p-6 rounded-2xl bg-surface border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-brand-cobalt text-white font-display font-black flex items-center justify-center text-sm mb-4 shadow">
                02
              </div>
              <h3 className="text-lg font-bold font-display text-brand-midnight mb-2">
                Review & Verify
              </h3>
              <p className="text-xs text-[#4B5568] leading-relaxed">
                The relevant department reviews your report, checks for nearby duplicates, and assigns its
                operational priority.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200/80 w-full text-[11px] font-mono text-brand-cobalt font-bold">
                Department Triage Hub
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-start p-6 rounded-2xl bg-surface border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-brand-midnight text-white font-display font-black flex items-center justify-center text-sm mb-4 shadow">
                03
              </div>
              <h3 className="text-lg font-bold font-display text-brand-midnight mb-2">
                Assign & Take Action
              </h3>
              <p className="text-xs text-[#4B5568] leading-relaxed">
                Dedicated maintenance teams receive assigned work orders on mobile, navigate to coordinates,
                and update live progress.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200/80 w-full text-[11px] font-mono text-brand-cobalt font-bold">
                Field Maintenance Crew
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col items-start p-6 rounded-2xl bg-surface border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-brand-yellow text-brand-midnight font-display font-black flex items-center justify-center text-sm mb-4 shadow">
                04
              </div>
              <h3 className="text-lg font-bold font-display text-brand-midnight mb-2">
                Resolve & Stay Updated
              </h3>
              <p className="text-xs text-[#4B5568] leading-relaxed">
                Follow real-time status updates, view photographic resolution evidence, and rate your
                satisfaction upon closure.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200/80 w-full text-[11px] font-mono text-brand-cobalt font-bold">
                Citizen Closure & Review
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 05 — EXPLORE ISSUES ON THE MAP (INTERACTIVE PREVIEW) */}
      {/* ========================================================= */}
      <section id="explore-map" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-brand-coolGray bg-brand-warmWhite">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-cobalt">
              Visual Transparency
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-brand-midnight tracking-tight">
              See What's Happening Across Your City.
            </h2>
            <p className="text-base text-[#4B5568] leading-relaxed">
              Explore reported infrastructure issues through an interactive city map. Discover nearby
              problems, identify recurring concerns, and understand what's happening in different
              neighborhoods.
            </p>
          </div>

          {/* Interactive Map Filter Controls */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-md mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              {/* Category Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                  Category:
                </span>
                {[
                  { key: 'all', label: 'All Issues' },
                  { key: 'road', label: 'Roads' },
                  { key: 'lighting', label: 'Lighting' },
                  { key: 'drainage', label: 'Drainage' },
                  { key: 'waste', label: 'Waste' },
                  { key: 'footpath', label: 'Footpath' },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      selectedCategory === cat.key
                        ? 'bg-brand-midnight text-brand-yellow shadow-sm font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                  Status:
                </span>
                {[
                  { key: 'all', label: 'All' },
                  { key: 'under_review', label: 'Review' },
                  { key: 'in_progress', label: 'In Progress' },
                  { key: 'resolved', label: 'Resolved' },
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setSelectedStatus(st.key)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                      selectedStatus === st.key
                        ? 'bg-brand-cobalt text-white shadow-sm font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive City Canvas Preview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
              {/* Left / Middle: Visual Map Canvas */}
              <div className="lg:col-span-2 relative h-[380px] sm:h-[440px] rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
                {/* Visual stylised street layout */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(#315CFF 1.5px, transparent 1.5px), radial-gradient(#FFD447 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                    backgroundPosition: '0 0, 12px 12px',
                  }}
                />

                {/* Major Dhaka Grid Lines */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-blue-500/20"></div>
                  <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-blue-500/20"></div>
                  <div className="absolute top-0 bottom-0 left-1/3 w-0.5 bg-blue-500/20"></div>
                  <div className="absolute top-0 bottom-0 left-2/3 w-0.5 bg-blue-500/20"></div>
                </div>

                {/* Zone Labels */}
                <div className="absolute top-4 left-6 text-[11px] font-mono font-bold text-slate-500 pointer-events-none">
                  ZONE 1 — UTTARA & MIRPUR
                </div>
                <div className="absolute top-4 right-6 text-[11px] font-mono font-bold text-slate-500 pointer-events-none">
                  ZONE 2 — GULSHAN & BANANI
                </div>
                <div className="absolute bottom-4 left-6 text-[11px] font-mono font-bold text-slate-500 pointer-events-none">
                  ZONE 3 — DHANMONDI & MOHAMMADPUR
                </div>
                <div className="absolute bottom-4 right-6 text-[11px] font-mono font-bold text-slate-500 pointer-events-none">
                  ZONE 4 — MOTIJHEEL & OLD DHAKA
                </div>

                {/* Hotspot Markers */}
                {filteredMapIssues.map((issue) => {
                  const isSelected = issue.id === activeIssue.id;
                  return (
                    <button
                      key={issue.id}
                      onClick={() => setSelectedMarkerId(issue.id)}
                      style={{ top: `${issue.y}%`, left: `${issue.x}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none transition-transform ${
                        isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                      }`}
                      title={issue.title}
                    >
                      <span className="relative flex h-8 w-8 items-center justify-center">
                        {isSelected && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-yellow opacity-75"></span>
                        )}
                        <span
                          className={`relative inline-flex rounded-full h-7 w-7 items-center justify-center text-xs font-bold shadow-lg border-2 ${
                            isSelected
                              ? 'bg-brand-yellow text-brand-midnight border-white ring-2 ring-brand-yellow'
                              : issue.statusKey === 'resolved'
                              ? 'bg-emerald-500 text-white border-white'
                              : issue.statusKey === 'in_progress'
                              ? 'bg-amber-500 text-white border-white'
                              : 'bg-brand-cobalt text-white border-white'
                          }`}
                        >
                          <MapPin size={14} />
                        </span>
                      </span>
                    </button>
                  );
                })}

                {/* Bottom Legend inside Map */}
                <div className="absolute bottom-3 inset-x-3 bg-slate-900/90 backdrop-blur-md rounded-lg p-2.5 border border-slate-700/80 flex flex-wrap items-center justify-between text-[11px] text-slate-300 font-mono">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-cobalt"></span> Under Review
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> In Progress
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Resolved
                    </span>
                  </div>
                  <span className="text-slate-400 font-bold hidden sm:inline">
                    Click pin to inspect case telemetry
                  </span>
                </div>
              </div>

              {/* Right: Selected Issue Inspector Preview */}
              <div className="flex flex-col justify-between p-5 rounded-xl border border-slate-200 bg-surface">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded bg-brand-midnight text-brand-yellow font-mono text-xs font-bold">
                      {activeIssue.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                        activeIssue.statusKey === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : activeIssue.statusKey === 'in_progress'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {activeIssue.status}
                    </span>
                  </div>

                  <h4 className="text-base font-bold font-display text-brand-midnight mb-2">
                    {activeIssue.title}
                  </h4>

                  <div className="space-y-2.5 text-xs text-text-secondary mt-4">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-brand-cobalt shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block text-brand-midnight">
                          {activeIssue.location}
                        </span>
                        <span className="font-mono text-[10px] text-text-muted">
                          {activeIssue.coordinates}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <Building2 size={14} className="text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-700">{activeIssue.department}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] font-mono">
                      <span className="text-slate-500">Priority Level:</span>
                      <span className="font-bold text-brand-midnight">{activeIssue.priority}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500">Timeline:</span>
                      <span className="text-brand-cobalt font-bold">{activeIssue.time}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 mt-4 space-y-2">
                  <Link href="/citizen/create" className="w-full block">
                    <Button size="sm" className="w-full bg-brand-cobalt text-white hover:bg-brand-cobalt-700 font-bold">
                      Report Nearby Issue
                    </Button>
                  </Link>
                  <p className="text-[10px] text-center font-mono text-text-muted">
                    Reporter identities are protected under municipal privacy protocols.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 06 — BUILT FOR EVERY ROLE */}
      {/* ========================================================= */}
      <section id="departments" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-brand-coolGray bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-cobalt">
              Multi-Role Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-brand-midnight tracking-tight">
              One City. Four Roles. One Shared Mission.
            </h2>
            <p className="text-base text-[#4B5568] leading-relaxed">
              CivicPulse connects everyone involved in building and maintaining better public infrastructure
              through dedicated tools and authenticated role-based access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((p) => {
              const Icon = p.icon;
              return (
                <Card
                  key={p.role}
                  className={`flex flex-col justify-between p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${p.accentColor}`}
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
                      <span>{p.cta}</span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 07 — TRANSPARENT ISSUE TRACKING (LIVE #CP-1024 TIMELINE) */}
      {/* ========================================================= */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-brand-coolGray bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-cobalt">
              Complete Transparency
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-brand-midnight tracking-tight">
              Know Where Every Report Stands.
            </h2>
            <p className="text-base text-[#4B5568] leading-relaxed">
              No more wondering what happened after submitting a report. Follow every stage of the process
              with clear status updates and a transparent resolution history.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-surface rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            {/* Header of the case */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-midnight text-brand-yellow">
                    CASE #CP-1024
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Road Damage · Central Avenue</span>
                </div>
                <h3 className="text-xl font-bold font-display text-brand-midnight">
                  Large pothole near Central Avenue
                </h3>
              </div>
              <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold font-mono">
                Current: In Progress
              </div>
            </div>

            {/* Step-by-Step Resolution Timeline */}
            <div className="relative pt-8 space-y-6">
              {/* Timeline Items */}
              {[
                {
                  step: '01',
                  status: 'Submitted',
                  detail: 'Report received and recorded with GPS coordinates and photographic evidence.',
                  state: 'completed',
                  time: '10:15 AM · Oct 24',
                },
                {
                  step: '02',
                  status: 'Under Review',
                  detail: 'Issue verified by Roads & Highways Department dispatcher. Priority set to High.',
                  state: 'completed',
                  time: '10:40 AM · Oct 24',
                },
                {
                  step: '03',
                  status: 'Assigned',
                  detail: 'Maintenance Crew #03 assigned to the work order with asphalt repair payload.',
                  state: 'completed',
                  time: '11:15 AM · Oct 24',
                },
                {
                  step: '04',
                  status: 'In Progress',
                  detail: 'Field crew arrived at location. Road surface milling and repair currently underway.',
                  state: 'active',
                  time: '01:30 PM · Oct 24 (Active Stage)',
                },
                {
                  step: '05',
                  status: 'Resolved',
                  detail: 'Awaiting crew completion photo upload and department resolution confirmation.',
                  state: 'upcoming',
                  time: 'Estimated in 2.5 hrs',
                },
                {
                  step: '06',
                  status: 'Closed',
                  detail: 'Citizen notification dispatched and satisfaction rating review recorded.',
                  state: 'upcoming',
                  time: 'Pending closure',
                },
              ].map((item, idx) => {
                const isCompleted = item.state === 'completed';
                const isActive = item.state === 'active';

                return (
                  <div key={item.step} className="flex items-start gap-4 sm:gap-6 relative group">
                    {/* Visual Node */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : isActive
                            ? 'bg-brand-midnight text-brand-yellow ring-4 ring-brand-yellow/50 shadow-md'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 size={16} /> : item.step}
                      </div>
                      {idx < 5 && (
                        <div
                          className={`w-0.5 h-12 my-1 ${
                            isCompleted ? 'bg-emerald-400' : 'bg-slate-200'
                          }`}
                        />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 pb-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <h4
                          className={`text-sm sm:text-base font-bold font-display ${
                            isActive
                              ? 'text-brand-midnight underline decoration-brand-yellow decoration-2'
                              : isCompleted
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
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 08 — DATA & ANALYTICS (BI PREVIEW) */}
      {/* ========================================================= */}
      <section id="analytics" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-brand-coolGray bg-brand-warmWhite">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-cobalt">
              Executive Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-brand-midnight tracking-tight">
              Better Decisions Start with Better Insights.
            </h2>
            <p className="text-base text-[#4B5568] leading-relaxed">
              Turn infrastructure reports into actionable insights. Monitor issue trends, measure department
              performance, and understand where your city needs attention most.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Highlight 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-cobalt flex items-center justify-center font-bold">
                  <TrendingUp size={20} />
                </div>
                <h3 className="font-bold font-display text-brand-midnight">Performance Monitoring</h3>
              </div>
              <p className="text-xs text-[#4B5568] leading-relaxed">
                Track department workloads, completed work orders, and pending reports with SLA scorecards.
              </p>
            </div>

            {/* Highlight 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Activity size={20} />
                </div>
                <h3 className="font-bold font-display text-brand-midnight">Issue Analytics</h3>
              </div>
              <p className="text-xs text-[#4B5568] leading-relaxed">
                Understand issue categories, recurring geographical hotspots, and monthly incident trends.
              </p>
            </div>

            {/* Highlight 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Clock size={20} />
                </div>
                <h3 className="font-bold font-display text-brand-midnight">Resolution Insights</h3>
              </div>
              <p className="text-xs text-[#4B5568] leading-relaxed">
                Monitor average resolution times, bottleneck warnings, and citizen satisfaction ratings.
              </p>
            </div>
          </div>

          {/* Visual Analytics Dashboard Preview Card */}
          <div className="bg-brand-midnight text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono text-brand-yellow font-bold uppercase tracking-wider block">
                  Connected Analytics Engine
                </span>
                <h4 className="text-xl font-bold font-display text-white">
                  Municipal Operations & Department SLA Benchmark
                </h4>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono bg-slate-800 px-3 py-1 rounded text-slate-300 border border-slate-700">
                  Live DB: 108+ Records Seeded
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs font-mono text-slate-400">Total Tracked Incidents</div>
                <div className="text-3xl font-extrabold font-display text-brand-yellow mt-1">108+</div>
                <div className="text-[11px] text-emerald-400 font-mono mt-1">Across 30 location clusters</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs font-mono text-slate-400">Citywide SLA Compliance</div>
                <div className="text-3xl font-extrabold font-display text-emerald-400 mt-1">94.2%</div>
                <div className="text-[11px] text-slate-300 font-mono mt-1">+2.4% above benchmark</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs font-mono text-slate-400">Average Resolution Time</div>
                <div className="text-3xl font-extrabold font-display text-white mt-1">18.5 hrs</div>
                <div className="text-[11px] text-brand-yellow font-mono mt-1">Target: &lt; 24 hrs</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs font-mono text-slate-400">Citizen Satisfaction Score</div>
                <div className="text-3xl font-extrabold font-display text-blue-400 mt-1">4.8 / 5.0</div>
                <div className="text-[11px] text-slate-300 font-mono mt-1">Based on closed verified cases</div>
              </div>
            </div>

            {/* Department Performance Bar */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 font-bold">
                Department Performance Ranking
              </h5>
              <div className="space-y-3">
                {[
                  { name: 'Waste Management Division', score: 96.4, color: 'bg-emerald-400' },
                  { name: 'Electrical & Street Lighting', score: 94.8, color: 'bg-brand-yellow' },
                  { name: 'Roads & Highways Department', score: 92.1, color: 'bg-blue-400' },
                  { name: 'Water & Sewerage Authority (WASA)', score: 89.5, color: 'bg-cyan-400' },
                  { name: 'Parks & Public Amenities', score: 88.0, color: 'bg-purple-400' },
                ].map((dept) => (
                  <div key={dept.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">{dept.name}</span>
                      <span className="font-bold text-white">{dept.score}% SLA</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full ${dept.color} rounded-full`}
                        style={{ width: `${dept.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 09 — WHY CIVICPULSE? (COMPARISON SECTION) */}
      {/* ========================================================= */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-brand-coolGray bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-cobalt">
              Strategic Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-brand-midnight tracking-tight">
              A More Connected Approach to City Management.
            </h2>
            <p className="text-base text-[#4B5568] leading-relaxed">
              Why modern municipalities transition from manual complaints to CivicPulse's unified
              infrastructure platform.
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-surface">
            <div className="grid grid-cols-2 text-xs sm:text-sm font-bold uppercase tracking-wider border-b border-slate-200">
              <div className="p-4 sm:p-5 bg-slate-100/80 text-slate-600 font-mono">
                Traditional Municipal Approach
              </div>
              <div className="p-4 sm:p-5 bg-brand-midnight text-brand-yellow font-mono flex items-center gap-2">
                <span>CivicPulse Platform</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 hidden sm:inline-block"></span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs sm:text-sm">
              {[
                {
                  traditional: 'Scattered complaints across hotlines, email, and paper registers.',
                  civicpulse: 'Centralized digital reporting with precise GPS pins and photo verification.',
                },
                {
                  traditional: 'Manual issue forwarding causing days of inter-departmental delay.',
                  civicpulse: 'Automated department routing and priority triage within minutes.',
                },
                {
                  traditional: 'Limited progress visibility — citizens left in the dark about fixes.',
                  civicpulse: 'Transparent, end-to-end status tracking with photographic resolution proof.',
                },
                {
                  traditional: 'Disconnected field teams relying on handwritten job sheets.',
                  civicpulse: 'Mobile-first work order dispatch with coordinates and turn-by-turn guidance.',
                },
                {
                  traditional: 'Guesswork and reactive planning without infrastructure data.',
                  civicpulse: 'Data-driven city analytics, heatmaps, and preventive maintenance alerts.',
                },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-2">
                  <div className="p-4 sm:p-5 text-slate-500 bg-white/60 flex items-start gap-2">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>{row.traditional}</span>
                  </div>
                  <div className="p-4 sm:p-5 text-brand-midnight bg-brand-warmWhite/40 font-medium flex items-start gap-2 border-l border-slate-100">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>{row.civicpulse}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 10 — FINAL CALL TO ACTION */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-midnight text-white relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-brand-cobalt/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-brand-yellow/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-brand-yellow font-mono text-xs font-bold uppercase tracking-wider border border-slate-700">
            Make your community count
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white tracking-tight leading-tight">
            A Better City Begins with a Single Report.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Every reported problem is an opportunity to make your neighborhood safer, cleaner, and better
            for everyone.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/citizen/create">
              <Button
                size="lg"
                className="gap-2 bg-brand-yellow text-brand-midnight hover:bg-yellow-400 font-bold px-8 h-12 shadow-lg text-base"
              >
                <span>Report an Issue Now</span>
                <ArrowRight size={18} />
              </Button>
            </Link>

            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 font-bold px-7 border-slate-600 text-white hover:bg-slate-800 h-12 text-base"
              >
                <LogIn size={18} />
                <span>Log In to Portals</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 11 — 4-COLUMN FOOTER */}
      {/* ========================================================= */}
      <footer className="border-t border-brand-coolGray bg-surface text-text-primary pt-14 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-200">
            {/* Col 1: Brand Info */}
            <div className="lg:col-span-2 space-y-3">
              <Link href="/" className="flex items-center gap-3">
                <BrandLogo size={32} className="text-[#202B45]" />
                <div>
                  <span className="font-display font-extrabold text-xl tracking-tight text-brand-midnight">
                    CIVICPULSE
                  </span>
                  <span className="text-[10px] font-mono text-brand-cobalt uppercase tracking-widest block font-bold">
                    Smart City Platform
                  </span>
                </div>
              </Link>
              <p className="text-xs text-[#4B5568] max-w-sm leading-relaxed">
                A full-lifecycle municipal platform uniting citizens, department dispatchers, field
                maintenance crews, and city leadership into one seamless smart city workflow.
              </p>
              <div className="pt-2 text-xs font-mono text-slate-500">
                Connected to Neon Cloud PostgreSQL • Dhaka Smart City Grid
              </div>
            </div>

            {/* Col 2: Platform */}
            <div className="space-y-3">
              <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-brand-midnight">
                Platform
              </h5>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li>
                  <a href="#how-it-works" className="hover:text-brand-cobalt transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#explore-map" className="hover:text-brand-cobalt transition-colors">
                    Explore Issues Map
                  </a>
                </li>
                <li>
                  <a href="#departments" className="hover:text-brand-cobalt transition-colors">
                    Department Hub
                  </a>
                </li>
                <li>
                  <a href="#analytics" className="hover:text-brand-cobalt transition-colors">
                    City SLA Analytics
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Community */}
            <div className="space-y-3">
              <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-brand-midnight">
                Community
              </h5>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li>
                  <Link href="/citizen/create" className="hover:text-brand-cobalt transition-colors">
                    Report an Issue
                  </Link>
                </li>
                <li>
                  <Link href="/citizen" className="hover:text-brand-cobalt transition-colors">
                    Citizen Portal
                  </Link>
                </li>
                <li>
                  <Link href="/citizen" className="hover:text-brand-cobalt transition-colors">
                    My Reports
                  </Link>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-brand-cobalt transition-colors">
                    Reporting Guidelines
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Portals & Access */}
            <div className="space-y-3">
              <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-brand-midnight">
                Portals & Access
              </h5>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li>
                  <Link href="/login" className="hover:text-brand-cobalt transition-colors">
                    Log In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-brand-cobalt transition-colors">
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link href="/manager" className="hover:text-brand-cobalt transition-colors">
                    Department Hub
                  </Link>
                </li>
                <li>
                  <Link href="/staff" className="hover:text-brand-cobalt transition-colors">
                    Field Crew Portal
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-text-muted font-mono">
            <p>© 2026 CivicPulse • Building better communities, together.</p>
            <p>Signal City Design System v1.0 • All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
