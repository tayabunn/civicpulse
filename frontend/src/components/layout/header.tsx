'use client';

import React from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setDemoPersona } from '../../store/authSlice';
import { toggleTheme } from '../../store/uiSlice';
import { UserRole } from '../../types';
import { Sun, Moon, Sparkles, UserCheck, Shield, HardHat, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Header({ title }: { title?: string }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme, sidebarCollapsed } = useSelector((state: RootState) => state.ui);

  const personas: { role: UserRole; label: string; icon: any; color: string }[] = [
    { role: 'citizen', label: 'Citizen', icon: User, color: 'hover:border-emerald-500' },
    { role: 'manager', label: 'Roads Manager', icon: HardHat, color: 'hover:border-amber-500' },
    { role: 'staff', label: 'Electrician Staff', icon: Shield, color: 'hover:border-blue-500' },
    { role: 'admin', label: 'City Admin', icon: Sparkles, color: 'hover:border-purple-500' },
  ];

  return (
    <header
      className={cn(
        'h-[72px] bg-surface border-b border-border px-6 flex items-center justify-between sticky top-0 z-30 transition-all duration-300',
        sidebarCollapsed ? 'ml-[76px]' : 'ml-[248px]'
      )}
    >
      {/* Title / Breadcrumb */}
      <div>
        <h1 className="text-xl font-bold font-display text-text-primary tracking-tight">
          {title || 'Infrastructure Operations'}
        </h1>
        <p className="text-xs text-text-muted font-mono">
          Dhaka Smart Grid • Real-time Triage
        </p>
      </div>

      {/* Right controls: Demo Persona Switcher & Theme Toggle */}
      <div className="flex items-center gap-4">
        {/* Quick Demo Switcher Pill */}
        <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-lg bg-surface-secondary border border-border">
          <span className="text-[11px] font-mono text-text-muted px-2 font-semibold">
            Demo Persona:
          </span>
          {personas.map((p) => {
            const isCurrent = user?.role === p.role;
            const Icon = p.icon;
            return (
              <button
                key={p.role}
                onClick={() => dispatch(setDemoPersona(p.role))}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition-all font-medium',
                  isCurrent
                    ? 'bg-brand-midnight text-white shadow-sm font-semibold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                )}
                title={`Switch persona to ${p.label}`}
              >
                <Icon size={12} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-primary transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} className="text-brand-yellow" />}
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-border">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-brand-cobalt text-white flex items-center justify-center font-bold text-xs">
              {user?.name?.slice(0, 2).toUpperCase() || 'CP'}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
