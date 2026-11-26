'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../store/authSlice';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { GoogleButton } from '../../../components/ui/google-button';
import { BrandLogo } from '../../../components/ui/brand-logo';
import { LazyLoader } from '../../../components/ui/lazy-loader';
import { MotionGrid } from '../../../components/ui/motion-grid';
import { AuthShowcasePanel } from '../../../components/auth/auth-showcase-panel';
import { ArrowLeft, UserPlus, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { UserRole } from '../../../types';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const normalizedEmail = email.trim().toLowerCase();
    const displayName = name.trim() || normalizedEmail.split('@')[0].replace(/[._-]/g, ' ');
    const cleanPhone = phone.trim() || undefined;
    const newUser = {
      id: `reg-${Date.now()}`,
      name: displayName,
      email: normalizedEmail,
      role: 'citizen' as UserRole,
      phone: cleanPhone,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: displayName,
          email: normalizedEmail,
          password,
          phone: cleanPhone,
          role: 'citizen',
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(
          typeof data?.error === 'string'
            ? data.error
            : 'Registration failed. Please check your details and try again.'
        );
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        dispatch(
          setCredentials({
            user: { ...data.user, role: 'citizen' },
            token: data.token || `jwt-${Date.now()}`,
          })
        );
      } else {
        dispatch(setCredentials({ user: newUser, token: `jwt-${Date.now()}` }));
      }
    } catch {
      dispatch(setCredentials({ user: newUser, token: `jwt-${Date.now()}` }));
    }

    // Trust this device for 30 days upon registration
    if (typeof window !== 'undefined') {
      try {
        const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
        document.cookie = `civicpulse_trusted_device=true; max-age=2592000; path=/; SameSite=Lax`;
        localStorage.setItem('civicpulse_device_trusted_until', expiresAt.toString());
        localStorage.setItem('civicpulse_last_verified_email', normalizedEmail);
        localStorage.setItem(
          `civicpulse_trusted_device_${normalizedEmail}`,
          JSON.stringify({
            email: normalizedEmail,
            verifiedAt: Date.now(),
            expiresAt,
            trusted: true,
          })
        );
      } catch {}
    }

    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/citizen';
    }, 400);
  };

  return (
    <MotionGrid
      speed="18s"
      opacity={0.14}
      enableGlow={true}
      lineColor="110, 134, 4"
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6"
    >
      {isLoading && (
        <LazyLoader
          fullScreen
          message="Creating your verified citizen account..."
          submessage="Configuring security permissions and initializing Citizen Portal..."
        />
      )}

      {/* Split-Screen Elevated Auth Card matching Reference Mockup */}
      <div className="w-full max-w-5xl rounded-lg bg-white dark:bg-[#0E1420] border border-[#D5DAE3] dark:border-[#232F46] shadow-2xl p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
        {/* Left Showcase Panel */}
        <div className="lg:col-span-5 hidden lg:block">
          <AuthShowcasePanel />
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 flex flex-col justify-center px-3 py-4 sm:px-6 sm:py-6 space-y-5">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-[#315CFF] transition-colors"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <span className="text-xs font-mono text-text-muted">CivicPulse Auth v2.0</span>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 lg:hidden mb-2">
              <BrandLogo size={28} className="text-[#315CFF] dark:text-white" />
              <span className="font-display font-bold text-lg text-[#202B45] dark:text-white">
                CivicPulse
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-text-primary tracking-tight">
              Sign Up Now
            </h1>
            <p className="text-sm text-text-muted">
              Create your Citizen Portal account to report and track municipal issues across Dhaka.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3.5">
            <Input
              label="Full Name *"
              placeholder="e.g. Jane Citizen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
              required
            />

            <Input
              label="Email Address *"
              type="email"
              placeholder="e.g. name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Phone Number"
                placeholder="+880 1700-000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="off"
              />
              <div className="relative">
                <Input
                  label="Password *"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-[34px] text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-secondary border border-border text-xs text-text-muted flex items-start gap-2">
              <Lock size={14} className="shrink-0 mt-0.5 text-slate-400" />
              <span>
                Public sign-up creates a <strong>Citizen Portal</strong> account. Municipal Staff, Managers &amp; Admins log in directly with their official credentials.
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center font-bold shadow-sm gap-2 bg-[#315CFF] text-white dark:bg-[#e2fa6b] dark:text-[#202B45] h-11 rounded-lg text-sm cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              <UserPlus size={16} />
              <span>{isLoading ? 'Creating Account...' : 'Sign Up & Enter Citizen Portal'}</span>
            </button>
          </form>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-[#0E1420] px-2 text-text-muted font-mono">
                Or register with
              </span>
            </div>
          </div>

          <GoogleButton label="Sign up with Google" />

          <div className="pt-1 text-center text-xs text-text-muted">
            Already a member?{' '}
            <Link href="/login" className="text-[#315CFF] dark:text-[#6280FF] font-semibold hover:underline">
              Log In here &rarr;
            </Link>
          </div>
        </div>
      </div>
    </MotionGrid>
  );
}
