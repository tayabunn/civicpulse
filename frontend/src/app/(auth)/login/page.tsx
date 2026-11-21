'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setDemoPersona } from '../../../store/authSlice';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { GoogleButton } from '../../../components/ui/google-button';
import { Flame, User, HardHat, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { UserRole } from '../../../types';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePersonaSelect = (role: UserRole) => {
    dispatch(setDemoPersona(role));
    if (role === 'admin') router.push('/admin');
    else if (role === 'manager') router.push('/manager');
    else if (role === 'staff') router.push('/staff');
    else router.push('/citizen');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      // Default to citizen or admin based on email
      if (email.includes('admin')) dispatch(setDemoPersona('admin'));
      else if (email.includes('manager')) dispatch(setDemoPersona('manager'));
      else if (email.includes('staff')) dispatch(setDemoPersona('staff'));
      else dispatch(setDemoPersona('citizen'));

      setIsLoading(false);
      router.push('/citizen');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-midnight text-brand-yellow flex items-center justify-center mx-auto shadow-lg">
            <Flame className="w-7 h-7 fill-brand-yellow text-brand-yellow" />
          </div>
          <h1 className="text-2xl font-bold font-display text-text-primary tracking-tight">
            CIVICPULSE
          </h1>
          <p className="text-xs text-text-muted">
            Smart City Infrastructure Operations Platform
          </p>
        </div>

        {/* 1-Click Fast Demo Login */}
        <Card className="p-5 border-2 border-brand-yellow bg-surface">
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
              <User size={14} className="text-emerald-600" />
              <span>Jane Citizen</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handlePersonaSelect('manager')}
              className="text-xs justify-start gap-2 hover:border-amber-500 font-semibold"
            >
              <HardHat size={14} className="text-amber-600" />
              <span>Roads Manager</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handlePersonaSelect('staff')}
              className="text-xs justify-start gap-2 hover:border-blue-500 font-semibold"
            >
              <Shield size={14} className="text-blue-600" />
              <span>Electrician Staff</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handlePersonaSelect('admin')}
              className="text-xs justify-start gap-2 hover:border-purple-500 font-semibold"
            >
              <Sparkles size={14} className="text-purple-600" />
              <span>City Admin</span>
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
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full font-bold shadow-md"
            >
              Sign In to CivicPulse
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
            Need an account?{' '}
            <Link href="/register" className="text-brand-cobalt font-semibold hover:underline">
              Create citizen account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
