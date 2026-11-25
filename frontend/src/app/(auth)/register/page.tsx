'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../store/authSlice';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { GoogleButton } from '../../../components/ui/google-button';
import { BrandLogo } from '../../../components/ui/brand-logo';
import { LazyLoader } from '../../../components/ui/lazy-loader';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { UserRole } from '../../../types';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('citizen');
  const [isLoading, setIsLoading] = useState(false);

  const getDashboardForRole = (userRole: UserRole) => {
    switch (userRole) {
      case 'admin':
        return '/admin';
      case 'manager':
        return '/manager';
      case 'staff':
        return '/staff';
      case 'citizen':
      default:
        return '/citizen';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const displayName = name.trim() || email.split('@')[0].replace(/[._-]/g, ' ');
    const newUser = {
      id: `reg-${Date.now()}`,
      name: displayName,
      email: email.trim(),
      role,
      phone: phone.trim() || '+8801700000000',
      avatarUrl: `https://images.unsplash.com/photo-${
        role === 'admin'
          ? '1494790108377-be9c29b29330'
          : role === 'manager'
          ? '1507003211169-0a1dd7228f2d'
          : role === 'staff'
          ? '1500648767791-00dcc994a43e'
          : '1438761681033-6461ffad8d80'
      }?w=150`,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: displayName,
          email: email.trim(),
          password,
          phone: phone.trim() || '+8801700000000',
          role,
        }),
      });
      const data = await response.json();
      if (data?.user) {
        dispatch(
          setCredentials({
            user: { ...data.user, role },
            token: data.token || `token-${Date.now()}`,
          })
        );
      } else {
        dispatch(setCredentials({ user: newUser, token: `token-${Date.now()}` }));
      }
    } catch {
      dispatch(setCredentials({ user: newUser, token: `token-${Date.now()}` }));
    }

    // Trust this device for 30 days upon registration
    if (typeof window !== 'undefined') {
      try {
        const key = `civicpulse_trusted_device_${email.trim().toLowerCase()}`;
        localStorage.setItem(
          key,
          JSON.stringify({
            email: email.trim().toLowerCase(),
            verifiedAt: Date.now(),
            expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
            trusted: true,
          })
        );
      } catch {}
    }

    setTimeout(() => {
      setIsLoading(false);
      router.push(getDashboardForRole(role));
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 relative">
      {isLoading && (
        <LazyLoader
          fullScreen
          message="Creating your verified account..."
          submessage="Configuring municipal permissions and initializing dashboard..."
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
            Join the smart city municipal platform and access your desired role dashboard.
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name *"
              placeholder="e.g. Jane Citizen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address *"
              type="email"
              placeholder="e.g. citizen.jane@civicpulse.gov"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              placeholder="+880 1700-000000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              label="Password *"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Account Role & Desired Dashboard *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-cobalt"
              >
                <option value="citizen">Citizen — Citizen Portal (/citizen)</option>
                <option value="manager">Department Manager — Triage Hub (/manager)</option>
                <option value="staff">Maintenance Staff — Field Orders (/staff)</option>
                <option value="admin">Administrator — Executive BI (/admin)</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="accent"
              isLoading={isLoading}
              className="w-full font-bold shadow-md gap-2"
            >
              <UserPlus size={15} />
              Register & Enter Selected Dashboard
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
