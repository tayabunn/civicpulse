'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toggleSidebar, setMobileSidebarOpen } from '../../store/uiSlice';
import {
  ArrowLeft,
  BellRing,
  FilePlus,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  MapPin,
  BarChart3,
  Building2,
  Users,
  Wrench,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Trophy,
  X,
  User,
  Wallet,
  ShieldAlert,
  Megaphone,
  ScrollText,
  HardHat,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { BrandLogo } from '../ui/brand-logo';

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { sidebarCollapsed, mobileSidebarOpen } = useSelector((state: RootState) => state.ui);

  const role = user?.role || 'citizen';

  interface NavLinkItem {
    label: string;
    href: string;
    icon: any;
    highlight?: boolean;
  }

  // Navigation items based on role — CivicPulse 4 Core Roles
  const citizenLinks: NavLinkItem[] = [
    { label: 'Overview', href: '/citizen', icon: LayoutDashboard },
    { label: 'Report Issue', href: '/citizen/create', icon: FilePlus, highlight: true },
    { label: 'My Reports', href: '/citizen/reports', icon: Inbox },
    { label: 'Live City Map', href: '/citizen/map', icon: MapPin },
    { label: 'Neighborhood Alerts', href: '/citizen/alerts', icon: BellRing },
    { label: 'Civic Impact & Rewards', href: '/citizen/impact', icon: Trophy },
    { label: 'Emergency Hotlines & Help', href: '/citizen/help', icon: LifeBuoy },
    { label: 'Profile Settings', href: '/profile', icon: User },
  ];

  const managerLinks: NavLinkItem[] = [
    { label: 'Triage Overview', href: '/manager', icon: LayoutDashboard },
    { label: 'Department Queue', href: '/manager/issues', icon: Inbox },
    { label: 'Crew & Workload', href: '/manager/team', icon: Users },
    { label: 'Profile Settings', href: '/profile', icon: User },
  ];

  const staffLinks: NavLinkItem[] = [
    { label: 'My Work Orders', href: '/staff', icon: Wrench },
    { label: 'Profile Settings', href: '/profile', icon: User },
  ];

  const adminLinks: NavLinkItem[] = [
    { label: 'City Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Executive Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Budget & Spending', href: '/admin/budget', icon: Wallet },
    { label: 'SLA Escalations', href: '/admin/sla', icon: ShieldAlert },
    { label: 'Public Advisories', href: '/admin/advisories', icon: Megaphone },
    { label: 'Contractors & Vendors', href: '/admin/contractors', icon: HardHat },
    { label: 'Audit & Compliance', href: '/admin/audit', icon: ScrollText },
    { label: 'Departments', href: '/admin/departments', icon: Building2 },
    { label: 'User Directory', href: '/admin/users', icon: Users },
    { label: 'System Settings', href: '/admin/settings', icon: Sliders },
    { label: 'Profile Settings', href: '/profile', icon: User },
  ];

  const roleLinks = {
    citizen: citizenLinks,
    manager: managerLinks,
    staff: staffLinks,
    admin: adminLinks,
  }[role];

  const handleNavClick = () => {
    if (mobileSidebarOpen) {
      dispatch(setMobileSidebarOpen(false));
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => dispatch(setMobileSidebarOpen(false))}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen transition-all duration-300 flex flex-col justify-between border-r border-[#34415B] dark:border-[#1E293B] bg-[#202B45] dark:bg-[#0E1420] text-[#F7F5EF]',
          // Desktop sizing
          sidebarCollapsed ? 'md:w-[76px]' : 'md:w-[248px]',
          // Mobile drawer slide-in / slide-out
          mobileSidebarOpen
            ? 'translate-x-0 w-[280px]'
            : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Desktop floating collapse toggle on right border (prevents overlap when collapsed) */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="hidden md:flex items-center justify-center absolute -right-3.5 top-[22px] w-7 h-7 rounded-full bg-[#202B45] dark:bg-[#141B29] border border-[#3C4962] dark:border-[#232F46] text-slate-200 hover:text-white hover:border-[#315CFF] shadow-md transition-colors z-50"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Top brand header */}
        <div>
          <div
            className={cn(
              'h-[72px] flex items-center border-b border-[#34415B] dark:border-[#1E293B]',
              sidebarCollapsed && !mobileSidebarOpen ? 'justify-center px-0' : 'justify-between px-4'
            )}
          >
            <Link href="/" onClick={handleNavClick} className="flex items-center gap-2.5 overflow-hidden">
              <BrandLogo size={28} className="text-white shrink-0" />
              {(!sidebarCollapsed || mobileSidebarOpen) && (
                <span className="font-display font-bold text-xl tracking-tight text-white block leading-tight">
                  CivicPulse
                </span>
              )}
            </Link>

            {/* Mobile close button */}
            <button
              onClick={() => dispatch(setMobileSidebarOpen(false))}
              className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Role Badge */}
          {(!sidebarCollapsed || mobileSidebarOpen) && (
            <div className="mx-4 my-3.5 px-3.5 py-2.5 rounded-lg bg-[#2B3852] dark:bg-[#141B29] border border-[#3C4962] dark:border-[#232F46] flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-[#e2fa6b] shrink-0"></div>
              <div className="truncate">
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#e2fa6b] font-semibold leading-none">
                  Role: {role}
                </p>
                <p className="text-xs text-slate-100 truncate font-semibold mt-1">{user?.name}</p>
              </div>
            </div>
          )}

          {/* Navigation list */}
          <nav className="p-3 space-y-1.5">
            {roleLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isCompact = sidebarCollapsed && !mobileSidebarOpen;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    'flex items-center rounded-lg text-sm font-medium transition-all group',
                    isCompact ? 'justify-center w-11 h-11 mx-auto px-0' : 'gap-3 px-3.5 py-2.5',
                    isActive
                      ? 'bg-[#315CFF] text-white font-semibold shadow-sm'
                      : 'text-[#D0D7E3] hover:bg-white/10 hover:text-white',
                    item.highlight && !isActive
                      ? 'border border-[#e2fa6b]/40 text-[#e2fa6b] hover:bg-[#e2fa6b]/10 hover:text-[#e2fa6b]'
                      : ''
                  )}
                  title={isCompact ? item.label : undefined}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 shrink-0 transition-transform group-hover:scale-105',
                      isActive
                        ? 'text-white'
                        : item.highlight
                        ? 'text-[#e2fa6b]'
                        : 'text-slate-300'
                    )}
                  />
                  {(!sidebarCollapsed || mobileSidebarOpen) && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#34415B] dark:border-[#1E293B]">
          <Link
            href="/"
            onClick={handleNavClick}
            className={cn(
              'flex items-center rounded-lg text-xs font-bold bg-[#e2fa6b] hover:bg-[#d5f055] text-[#202B45] shadow-sm transition-colors',
              sidebarCollapsed && !mobileSidebarOpen
                ? 'justify-center w-11 h-10 mx-auto px-0'
                : 'justify-center gap-2 px-3.5 py-2.5 w-full'
            )}
            title={sidebarCollapsed && !mobileSidebarOpen ? 'Back to Homepage' : undefined}
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {(!sidebarCollapsed || mobileSidebarOpen) && <span>Back to Homepage</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
