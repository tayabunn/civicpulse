'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toggleSidebar } from '../../store/uiSlice';
import {
  Compass,
  FilePlus,
  Inbox,
  LayoutDashboard,
  BarChart3,
  Building2,
  Users,
  Wrench,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Flame,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui);

  const role = user?.role || 'citizen';

  interface NavLinkItem {
    label: string;
    href: string;
    icon: any;
    highlight?: boolean;
  }

  // Navigation items based on role
  const citizenLinks: NavLinkItem[] = [
    { label: 'Overview', href: '/citizen', icon: LayoutDashboard },
    { label: 'Report Issue', href: '/citizen/create', icon: FilePlus, highlight: true },
    { label: 'My Reports', href: '/citizen/reports', icon: Inbox },
    { label: 'DataScope Explorer', href: '/explorer', icon: Compass },
  ];

  const managerLinks: NavLinkItem[] = [
    { label: 'Triage Overview', href: '/manager', icon: LayoutDashboard },
    { label: 'Department Queue', href: '/manager/issues', icon: Inbox },
    { label: 'Crew & Workload', href: '/manager/team', icon: Users },
    { label: 'DataScope Explorer', href: '/explorer', icon: Compass },
  ];

  const staffLinks: NavLinkItem[] = [
    { label: 'My Work Orders', href: '/staff', icon: Wrench },
    { label: 'DataScope Explorer', href: '/explorer', icon: Compass },
  ];

  const adminLinks: NavLinkItem[] = [
    { label: 'City Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Executive Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Departments', href: '/admin/departments', icon: Building2 },
    { label: 'DataScope Explorer', href: '/explorer', icon: Compass },
  ];

  const roleLinks = {
    citizen: citizenLinks,
    manager: managerLinks,
    staff: staffLinks,
    admin: adminLinks,
  }[role];

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-40 h-screen transition-all duration-300 flex flex-col justify-between border-r border-[#34415B]',
        sidebarCollapsed ? 'w-[76px]' : 'w-[248px]'
      )}
      style={{ backgroundColor: '#202B45', color: '#F7F5EF' }}
    >
      {/* Top brand header */}
      <div>
        <div className="h-[72px] flex items-center justify-between px-4 border-b border-[#34415B]">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-brand-yellow flex items-center justify-center text-brand-midnight font-bold shadow-md shrink-0">
              <Flame className="w-5 h-5 fill-brand-midnight text-brand-midnight" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <span className="font-display font-bold text-lg tracking-tight text-white block leading-tight">
                  CIVICPULSE
                </span>
                <span className="text-[10px] text-brand-yellow font-mono font-medium uppercase tracking-wider block">
                  Signal City v1.0
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-[#34415B]/50 transition-colors"
            title="Toggle sidebar"
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* User Role Badge */}
        {!sidebarCollapsed && (
          <div className="mx-4 my-3 px-3 py-2 rounded-lg bg-[#2B3852] border border-[#3C4962] flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <div className="truncate">
              <p className="text-[11px] font-mono uppercase text-brand-yellow leading-none">
                Role: {role}
              </p>
              <p className="text-xs text-slate-200 truncate font-medium mt-0.5">{user?.name}</p>
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav className="p-3 space-y-1.5">
          {roleLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-brand-yellow text-brand-midnight font-bold shadow-md'
                    : 'text-[#D0D7E3] hover:bg-[#2B3852] hover:text-white',
                  item.highlight && !isActive ? 'border border-brand-yellow/40 text-brand-yellow' : ''
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 shrink-0 transition-transform group-hover:scale-105',
                    isActive ? 'text-brand-midnight' : 'text-slate-300'
                  )}
                />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / System Status */}
      <div className="p-4 border-t border-[#34415B]">
        {!sidebarCollapsed ? (
          <div className="text-[11px] text-slate-400 font-mono space-y-1">
            <div className="flex items-center justify-between text-slate-300">
              <span>Status</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
              </span>
            </div>
            <div>PostgreSQL • Neon Live</div>
          </div>
        ) : (
          <div className="w-2.5 h-2.5 mx-auto rounded-full bg-emerald-400" title="Online" />
        )}
      </div>
    </aside>
  );
}
