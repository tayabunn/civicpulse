'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setDemoPersona } from '../../store/authSlice';
import { toggleTheme, toggleMobileSidebar } from '../../store/uiSlice';
import { useNotification } from '@/context/notification-context';
import { UserRole } from '../../types';
import {
  Sun,
  Moon,
  Sparkles,
  Shield,
  HardHat,
  User,
  Bell,
  Menu,
  CheckCheck,
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  Zap,
  ExternalLink,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function Header({ title }: { title?: string }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.ui);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    simulateLiveEvent,
  } = useNotification();

  const [showNotifications, setShowNotifications] = useState(false);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const personas: { role: UserRole; label: string; icon: any }[] = [
    { role: 'citizen', label: 'Citizen', icon: User },
    { role: 'manager', label: 'Manager', icon: HardHat },
    { role: 'staff', label: 'Staff', icon: Shield },
    { role: 'admin', label: 'Admin', icon: Sparkles },
  ];

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />;
      default:
        return <Info className="w-4 h-4 text-brand-cobalt shrink-0 mt-0.5" />;
    }
  };

  return (
    <header className="h-[72px] bg-surface border-b border-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-all duration-300">
      {/* Left: Mobile Hamburger & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleMobileSidebar())}
          className="md:hidden p-2 rounded-lg text-text-primary hover:bg-surface-secondary border border-border"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold font-display text-text-primary tracking-tight leading-tight">
            {title || 'Infrastructure Operations'}
          </h1>
          <p className="text-[11px] text-text-muted font-mono hidden sm:block">
            Dhaka Smart Grid • Real-time Triage
          </p>
        </div>
      </div>

      {/* Right controls: Demo Switcher + Notification Bell + Theme + User */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Quick Demo Persona Switcher */}
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-lg bg-surface-secondary border border-border">
          <span className="text-[11px] font-mono text-text-muted px-2 font-semibold">
            Role:
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

        {/* Notifications Center Dropdown */}
        <div className="relative" ref={notifDropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-primary transition-colors"
            title="System notifications"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-cobalt text-[10px] font-bold text-white shadow-sm animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-surface border border-border shadow-2xl z-50 overflow-hidden animate-fadeIn">
              <div className="p-3.5 border-b border-border flex items-center justify-between bg-surface-secondary/50">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold font-display text-text-primary">
                    Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-cobalt/10 text-brand-cobalt border border-brand-cobalt/20">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-brand-cobalt hover:underline flex items-center gap-1"
                  >
                    <CheckCheck size={13} /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-border">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-text-muted">
                    No recent notifications.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={cn(
                        'p-3.5 flex items-start gap-3 transition-colors hover:bg-surface-secondary cursor-pointer',
                        !n.read ? 'bg-brand-cobalt/5' : ''
                      )}
                    >
                      {getNotifIcon(n.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-text-primary truncate">
                            {n.title}
                          </p>
                          <span className="text-[10px] font-mono text-text-muted shrink-0">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">
                          {n.description}
                        </p>
                        {n.link && (
                          <Link
                            href={n.link}
                            onClick={() => setShowNotifications(false)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-cobalt mt-1 hover:underline"
                          >
                            View details <ExternalLink size={10} />
                          </Link>
                        )}
                      </div>
                      {!n.read && (
                        <div className="w-2 h-2 rounded-full bg-brand-cobalt shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 bg-surface-secondary/70 border-t border-border flex justify-between items-center text-xs text-text-muted">
                <button
                  type="button"
                  onClick={() => simulateLiveEvent()}
                  className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-brand-cobalt hover:underline"
                  title="Simulate incoming real-time smart city work order"
                >
                  <Zap size={11} className="text-amber-500 fill-amber-500" />
                  Simulate Live Event
                </button>
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-text-muted hover:text-rose-500 text-[11px]"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-primary transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? (
            <Moon size={18} />
          ) : (
            <Sun size={18} className="text-brand-yellow" />
          )}
        </button>

        {/* User Profile Avatar */}
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
