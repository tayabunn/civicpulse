'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toggleTheme } from '../../store/uiSlice';
import { logout } from '../../store/authSlice';
import { BrandLogo } from '../ui/brand-logo';
import { Button } from '../ui/button';
import { NAV_LINKS } from './data';
import { Menu, X, Sun, Moon, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';

export function Navbar() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.ui.theme);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/citizen';
    const r = user.role as string;
    if (r === 'admin') return '/admin';
    if (r === 'manager' || r === 'department_manager') return '/manager';
    if (r === 'staff' || r === 'maintenance_staff') return '/staff';
    return '/citizen';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase() || '')
      .join('');
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none transition-all duration-300 font-sans">
      {/* Desktop Yachtium Curvy Navbar (Visible on lg and above) */}
      <div
        className={`hidden lg:block relative w-[94%] max-w-[1400px] 2xl:max-w-[1600px] mx-auto h-[76px] pointer-events-auto transition-transform duration-300 ${isScrolled ? 'translate-y-0.0' : ''
          }`}
      >
        {/* Yachtium Exact S-Curve Background SVG */}
        <svg
          viewBox="0 0 992 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0H992H937.518C910.429 0 884.499 10.9901 865.66 30.456L859.547 36.772C850.128 46.5049 837.163 52 823.618 52H164.801C150.309 52 136.541 45.6684 127.108 34.6667C108.244 12.6631 80.7071 0 51.7238 0H0Z"
            className="fill-white dark:fill-[#1B2435] transition-colors duration-300"
          />
        </svg>

        {/* Content Container */}
        <div className="relative z-10 h-full max-w-[1100px] xl:max-w-[1180px] mx-auto flex items-center justify-between px-8">
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <BrandLogo size={30} className="text-[#305dff]" />
            <span className="font-sans font-bold text-xl sm:text-2xl tracking-tight text-brand-midnight dark:text-white block transition-colors">
              CivicPulse
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center gap-6 xl:gap-8 text-base font-medium font-sans text-slate-700 dark:text-slate-200">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-brand-cobalt dark:hover:text-brand-yellow transition-colors duration-150 py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-3.5 font-sans shrink-0">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              className="w-11 h-11 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle theme mode"
            >
              {theme === 'light' ? (
                <Moon size={18} className="text-slate-700 hover:text-brand-cobalt transition-colors" />
              ) : (
                <Sun size={18} className="text-brand-yellow hover:rotate-45 transition-transform" />
              )}
            </button>

            {isAuthenticated && user ? (
              /* ---- LOGGED IN: User Avatar + Dropdown ---- */
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 h-11 px-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95 transition-all"
                  aria-label="User menu"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-[#305dff]/30"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#305dff] text-white flex items-center justify-center text-xs font-bold">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-slate-800 dark:text-white max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className={`text-slate-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white dark:bg-[#1B2435] rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10">
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[#305dff]/10 text-[#305dff]">
                        {user.role}
                      </span>
                    </div>
                    <div className="py-1">
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard size={15} className="text-[#305dff]" />
                        Go to Dashboard
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ---- NOT LOGGED IN: Log In button ---- */
              <Link href="/login">
                <Button
                  size="sm"
                  className="font-medium font-sans bg-[#315CFF] text-white hover:bg-[#244BE0] active:scale-[0.98] transition-all rounded-full px-6 h-11 text-base shadow-md"
                >
                  Log In
                </Button>
              </Link>
            )}

            {/* Report Issue Button */}
            <Link href="/citizen/create">
              <Button
                size="sm"
                className="font-medium font-sans shadow-md bg-brand-midnight dark:bg-white text-white dark:text-brand-midnight hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-[0.98] transition-all rounded-full px-7 h-11 text-base"
              >
                Report Issue
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Pill Navbar (<1024px) */}
      <div className="lg:hidden mx-auto w-[90%] max-w-md pt-3 pointer-events-auto">
        <div className="px-4 py-2.5 rounded-full bg-white/95 dark:bg-[#1B2435]/95 backdrop-blur-md shadow-xl border border-slate-200/80 dark:border-white/10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <BrandLogo size={24} className="text-[#305dff]" />
            <span className="font-sans font-bold text-base tracking-tight text-brand-midnight dark:text-white block">
              CivicPulse
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              title="Toggle theme"
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} className="text-brand-yellow" />}
            </button>

            {isAuthenticated && user && (
              /* Mobile user avatar */
              <div
                className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center cursor-pointer"
                onClick={() => setMobileMenuOpen(true)}
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#305dff] text-white flex items-center justify-center text-xs font-bold">
                    {getInitials(user.name)}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="pt-3 pb-4 border border-slate-200 dark:border-white/10 mt-2 space-y-3 animate-fadeIn bg-white/98 dark:bg-brand-midnight/98 backdrop-blur-xl px-5 rounded-3xl shadow-2xl font-sans">
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-white/10">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#305dff] text-white flex items-center justify-center font-bold text-sm">
                    {getInitials(user.name)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-800 dark:text-white/90">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors font-medium font-sans"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
              {isAuthenticated && user ? (
                <>
                  <Link href={getDashboardLink()} className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      size="sm"
                      className="w-full rounded-full bg-[#315CFF] text-white hover:bg-[#244BE0] font-semibold font-sans h-10 text-xs shadow-md gap-1.5"
                    >
                      <LayoutDashboard size={13} /> Dashboard
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    onClick={handleLogout}
                    className="flex-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 font-semibold font-sans h-10 text-xs gap-1.5"
                  >
                    <LogOut size={13} /> Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      size="sm"
                      className="w-full rounded-full bg-[#315CFF] text-white hover:bg-[#244BE0] font-semibold font-sans h-10 text-xs shadow-md"
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link href="/citizen/create" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      size="sm"
                      className="w-full bg-brand-midnight dark:bg-white text-white dark:text-brand-midnight hover:bg-slate-800 font-semibold font-sans rounded-full h-10 text-xs shadow-md"
                    >
                      Report Issue
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
