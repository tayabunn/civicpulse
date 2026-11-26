'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../store/authSlice';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { GoogleButton } from '../../../components/ui/google-button';
import { BrandLogo } from '../../../components/ui/brand-logo';
import { LazyLoader } from '../../../components/ui/lazy-loader';
import { ArrowLeft, UserPlus, Lock, AlertCircle } from 'lucide-react';
import { UserRole } from '../../../types';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 relative">
      {isLoading && (
        <LazyLoader
          fullScreen
          message="Creating your verified citizen account..."
          submessage="Configuring security permissions and initializing Citizen Portal..."
        />
      )}
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-brand-cobalt transition-colors"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <span className="text-xs font-mono text-text-muted">CivicPulse Auth v2.0</span>
        </div>

        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <BrandLogo size={44} className="text-[#202B45]" />
          </div>
          <h1 className="text-2xl font-bold font-display text-text-primary tracking-tight">
            Register New Account
          </h1>
          <p className="text-xs text-text-muted">
            Create your Citizen Portal account to report and track municipal issues.
          </p>
        </div>

        <Card className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
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
            <Input
              label="Phone Number"
              placeholder="+880 1700-000000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="off"
            />
            <Input
              label="Password *"
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />

            <div className="p-2.5 rounded-lg bg-surface-secondary border border-border text-[11px] text-text-muted flex items-start gap-2">
              <Lock size={13} className="shrink-0 mt-0.5 text-slate-400" />
              <span>
                Public sign-up creates a <strong>Citizen Portal</strong> account. Municipal Staff, Managers &amp; Admins log in directly with their official credentials.
              </span>
            </div>

            <Button
              type="submit"
              variant="accent"
              isLoading={isLoading}
              className="w-full font-bold shadow-md gap-2"
            >
              <UserPlus size={15} />
              Register & Enter Citizen Portal
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-2 text-text-muted font-mono">Or register with</span>
            </div>
          </div>

          <GoogleButton label="Sign up with Google" />

          <div className="mt-4 text-center text-xs text-text-muted">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-cobalt font-semibold hover:underline">
              Log In here &rarr;
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
