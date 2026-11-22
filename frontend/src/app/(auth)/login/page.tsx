'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setDemoPersona } from '../../../store/authSlice';
import { Card } from '../../../components/ui/card';
import { Input, Select } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { GoogleButton } from '../../../components/ui/google-button';
import { BrandLogo } from '../../../components/ui/brand-logo';
import {
  User,
  HardHat,
  Shield,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  LogIn,
} from 'lucide-react';
import { UserRole } from '../../../types';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [desiredRole, setDesiredRole] = useState<UserRole>('citizen');
  const [isLoading, setIsLoading] = useState(false);

  const getDashboardForRole = (role: UserRole) => {
    switch (role) {
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

  const handlePersonaSelect = (role: UserRole) => {
    dispatch(setDemoPersona(role));
    router.push(getDashboardForRole(role));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      let role: UserRole = desiredRole;
      if (email.includes('admin')) role = 'admin';
      else if (email.includes('manager')) role = 'manager';
      else if (email.includes('staff')) role = 'staff';

      dispatch(setDemoPersona(role));
      setIsLoading(false);
      router.push(getDashboardForRole(role));
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6">
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

        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <BrandLogo size={44} className="text-[#202B45]" />
          </div>
          <h1 className="text-2xl font-bold font-display text-text-primary tracking-tight">
            Log In to CivicPulse
          </h1>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            Access your civic reporting account, department dispatch hub, or executive dashboard.
          </p>
        </div>

        {/* 1-Click Fast Persona Login */}
        <Card className="p-4 sm:p-5 border-2 border-brand-yellow bg-surface">
          <p className="text-xs font-mono font-bold text-brand-cobalt uppercase tracking-wider text-center mb-3">
            Instant 1-Click Persona Access
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handlePersonaSelect('citizen')}
              className="text-xs justify-start gap-2 hover:border-emerald-500 font-semibold"
            >
              <User size={14} className="text-emerald-600 shrink-0" />
              <span className="truncate">Citizen Portal</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handlePersonaSelect('manager')}
              className="text-xs justify-start gap-2 hover:border-amber-500 font-semibold"
            >
              <HardHat size={14} className="text-amber-600 shrink-0" />
              <span className="truncate">Dept Manager</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handlePersonaSelect('staff')}
              className="text-xs justify-start gap-2 hover:border-blue-500 font-semibold"
            >
              <Shield size={14} className="text-blue-600 shrink-0" />
              <span className="truncate">Field Crew</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handlePersonaSelect('admin')}
              className="text-xs justify-start gap-2 hover:border-purple-500 font-semibold"
            >
              <Sparkles size={14} className="text-purple-600 shrink-0" />
              <span className="truncate">City Admin</span>
            </Button>
          </div>
        </Card>

        {/* Standard Credentials Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. citizen.jane@civicpulse.gov"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Target Dashboard / Role
              </label>
              <select
                value={desiredRole}
                onChange={(e) => setDesiredRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-cobalt"
              >
                <option value="citizen">Citizen Dashboard (/citizen)</option>
                <option value="manager">Department Manager Hub (/manager)</option>
                <option value="staff">Field Maintenance Board (/staff)</option>
                <option value="admin">City Administrator BI (/admin)</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full font-bold shadow-md gap-2"
            >
              <LogIn size={15} />
              Sign In to Selected Dashboard
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-2 text-text-muted font-mono">Or continue with</span>
            </div>
          </div>

          <GoogleButton label="Sign in with Google" />

          <div className="mt-4 text-center text-xs text-text-muted">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-brand-cobalt font-semibold hover:underline">
              Create an account &rarr;
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
