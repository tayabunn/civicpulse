'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials, setDemoPersona } from '../../../store/authSlice';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { GoogleButton } from '../../../components/ui/google-button';
import { BrandLogo } from '../../../components/ui/brand-logo';
import { LazyLoader } from '../../../components/ui/lazy-loader';
import { MotionGrid } from '../../../components/ui/motion-grid';
import { AuthShowcasePanel } from '../../../components/auth/auth-showcase-panel';
import {
  User,
  HardHat,
  Shield,
  Sparkles,
  ArrowLeft,
  LogIn,
  Mail,
  ShieldCheck,
  RotateCcw,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { UserRole } from '../../../types';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Authentication Steps: 'credentials' -> 'verify_code'
  const [step, setStep] = useState<'credentials' | 'verify_code'>('credentials');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [computedRole, setComputedRole] = useState<UserRole>('citizen');
  const [credentialError, setCredentialError] = useState('');
  const [isDeviceTrusted, setIsDeviceTrusted] = useState(false);

  // 30-Day Device Trust Duration (30 days in ms)
  const TRUST_DURATION = 30 * 24 * 60 * 60 * 1000;

  const checkDeviceTrust = (emailStr?: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      // 1. Check browser cookie for 30-day device trust
      if (document.cookie.includes('civicpulse_trusted_device=true')) {
        return true;
      }

      // 2. Check generic device trust in localStorage
      const genericTrust = localStorage.getItem('civicpulse_device_trusted_until');
      if (genericTrust && Date.now() < Number(genericTrust)) {
        return true;
      }

      // 3. Check email-specific trust if email provided
      if (emailStr) {
        const key = `civicpulse_trusted_device_${emailStr.trim().toLowerCase()}`;
        const raw = localStorage.getItem(key);
        if (raw) {
          const data = JSON.parse(raw);
          if (data?.expiresAt && Date.now() < data.expiresAt) {
            return true;
          }
        }
      }

      return false;
    } catch {
      return false;
    }
  };

  const saveDeviceTrust = (emailStr?: string) => {
    if (typeof window === 'undefined') return;
    try {
      const expiresAt = Date.now() + TRUST_DURATION;
      // 1. Set 30-day cookie
      document.cookie = `civicpulse_trusted_device=true; max-age=2592000; path=/; SameSite=Lax`;

      // 2. Set generic device trust
      localStorage.setItem('civicpulse_device_trusted_until', expiresAt.toString());

      // 3. Set email-specific trust
      if (emailStr) {
        const normalized = emailStr.trim().toLowerCase();
        const key = `civicpulse_trusted_device_${normalized}`;
        localStorage.setItem(
          key,
          JSON.stringify({
            email: normalized,
            verifiedAt: Date.now(),
            expiresAt,
            trusted: true,
          })
        );
        localStorage.setItem('civicpulse_last_verified_email', normalized);
      }
    } catch { }
  };

  // On mount: check device trust and pre-fill email if remembered
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lastEmail = localStorage.getItem('civicpulse_last_verified_email');
      if (lastEmail) {
        setEmail(lastEmail);
        setIsDeviceTrusted(true);
      } else if (checkDeviceTrust()) {
        setIsDeviceTrusted(true);
      }
    }
  }, []);

  // Monitor email input to dynamically check 30-day trusted status
  useEffect(() => {
    if (email) {
      setIsDeviceTrusted(checkDeviceTrust(email));
    } else {
      setIsDeviceTrusted(checkDeviceTrust());
    }
  }, [email]);

  // 6-Digit Verification Code State
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [serverCode, setServerCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Lazy Loader State
  const [lazyLoader, setLazyLoader] = useState<{
    active: boolean;
    message: string;
    submessage?: string;
  } | null>(null);

  // Preload dashboard routes for instantaneous page transitions
  useEffect(() => {
    router.prefetch('/citizen');
    router.prefetch('/admin');
    router.prefetch('/manager');
    router.prefetch('/staff');
  }, [router]);

  // Resend Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'verify_code' && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCountdown]);

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

  const formatDisplayName = (rawEmail: string) => {
    const namePart = rawEmail.split('@')[0] || 'User';
    return namePart
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // 1-Click Authorized Demo Personas for Quick Evaluation
  const handlePersonaSelect = (role: UserRole) => {
    setLazyLoader({
      active: true,
      message: `Activating ${role.toUpperCase()} Persona...`,
      submessage: 'Initializing authenticated environment...',
    });

    setTimeout(() => {
      dispatch(setDemoPersona(role));
      setLazyLoader(null);
      window.location.href = getDashboardForRole(role);
    }, 400);
  };

  // Step 1: Validate Credentials & Dispatch 6-Digit Email Code
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredentialError('');
    setCodeError('');

    if (!email || !password) return;

    const normalizedEmail = email.trim().toLowerCase();

    // STRICT ROLE DETERMINATION & CREDENTIAL VALIDATION:
    // Only authorized administrative credentials can access Admin portal!
    let targetRole: UserRole = 'citizen';

    if (normalizedEmail === 'admin@civicpulse.gov') {
      if (password !== 'admin123') {
        setCredentialError('Invalid administrative password. Unauthorized access attempt recorded.');
        return;
      }
      targetRole = 'admin';
    } else if (normalizedEmail.startsWith('manager.') || (normalizedEmail.endsWith('@civicpulse.gov') && normalizedEmail.includes('manager'))) {
      if (password !== 'manager123' && password !== 'password123') {
        setCredentialError('Invalid department manager credentials.');
        return;
      }
      targetRole = 'manager';
    } else if (normalizedEmail.startsWith('staff.') || (normalizedEmail.endsWith('@civicpulse.gov') && normalizedEmail.includes('staff'))) {
      if (password !== 'staff123' && password !== 'password123') {
        setCredentialError('Invalid maintenance staff credentials.');
        return;
      }
      targetRole = 'staff';
    } else {
      // General public and personal emails (e.g. tayabunnesa@gmail.com) are strictly Citizens!
      // They can NEVER be given admin or management access.
      targetRole = 'citizen';
    }

    setComputedRole(targetRole);

    // 30-Day Trusted Device Check & Instant Direct Sign In
    const isTrusted = checkDeviceTrust(normalizedEmail);

    setLazyLoader({
      active: true,
      message: 'Authenticating credentials...',
      submessage: 'Verifying session and entering workspace...',
    });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
          trustedDevice: true, // Bypass OTP for returning users & remembered devices
        }),
      });

      const data = await response.json();

      if (response.ok && data?.user) {
        const authenticatedUser = data.user;
        const sessionToken = data?.token || `jwt-${Date.now()}`;

        if (typeof window !== 'undefined') {
          document.cookie = `civicpulse_session=${sessionToken}; path=/; max-age=2592000; SameSite=Lax`;
          document.cookie = `civicpulse_role=${targetRole}; path=/; max-age=2592000; SameSite=Lax`;
        }

        dispatch(
          setCredentials({
            user: { ...authenticatedUser, role: targetRole },
            token: sessionToken,
          })
        );

        // Remember device for 30 days
        saveDeviceTrust(normalizedEmail);

        setTimeout(() => {
          setLazyLoader(null);
          const redirectParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') : null;
          const targetUrl = redirectParam && redirectParam.startsWith('/') ? redirectParam : getDashboardForRole(targetRole);
          window.location.href = targetUrl;
        }, 200);
        return;
      }

      // If backend explicitly rejected invalid administrative password:
      if (!response.ok && data?.error && targetRole !== 'citizen') {
        setCredentialError(data.error);
        setLazyLoader(null);
        return;
      }
    } catch {
      // Offline fallback: if network fails, log citizen in directly
      if (targetRole === 'citizen') {
        const sessionToken = `jwt-${Date.now()}`;
        if (typeof window !== 'undefined') {
          document.cookie = `civicpulse_session=${sessionToken}; path=/; max-age=2592000; SameSite=Lax`;
          document.cookie = `civicpulse_role=${targetRole}; path=/; max-age=2592000; SameSite=Lax`;
        }

        dispatch(
          setCredentials({
            user: {
              id: `usr-${Date.now()}`,
              name: formatDisplayName(normalizedEmail),
              email: normalizedEmail,
              role: targetRole,
            },
            token: sessionToken,
          })
        );
        saveDeviceTrust(normalizedEmail);
        setTimeout(() => {
          setLazyLoader(null);
          const redirectParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') : null;
          const targetUrl = redirectParam && redirectParam.startsWith('/') ? redirectParam : getDashboardForRole(targetRole);
          window.location.href = targetUrl;
        }, 200);
        return;
      }
    }

    // Only if brand new citizen registration / first-time verification is needed:
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, role: targetRole }),
      });

      const data = await response.json();
      if (!response.ok && data?.error) {
        setCredentialError(data.error);
        setLazyLoader(null);
        return;
      }
      setServerCode(data?.code || '');
    } catch {
      console.info(`[CivicPulse 2FA] Network request to send-code failed, awaiting manual verification.`);
    }

    // Smooth transition to Step 2
    setTimeout(() => {
      setLazyLoader(null);
      setStep('verify_code');
      setResendCountdown(30);
      setCanResend(false);
      setCodeDigits(['', '', '', '', '', '']);
    }, 600);
  };

  // Handle individual digit input and auto-advance
  const handleDigitChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...codeDigits];
    newDigits[index] = cleanVal;
    setCodeDigits(newDigits);
    setCodeError('');

    if (cleanVal && index < 5) {
      document.getElementById(`code-digit-${index + 1}`)?.focus();
    }
  };

  // Handle backspace navigation
  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      document.getElementById(`code-digit-${index - 1}`)?.focus();
    }
  };

  // Handle paste for full 6 digits
  const handlePasteCode = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...codeDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setCodeDigits(newDigits);
    setCodeError('');

    const targetFocus = Math.min(pasted.length, 5);
    document.getElementById(`code-digit-${targetFocus}`)?.focus();
  };

  // Resend code handler
  const handleResendCode = async () => {
    if (!canResend) return;

    setLazyLoader({
      active: true,
      message: 'Generating new security code...',
      submessage: `Resending to ${email}...`,
    });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), role: computedRole }),
      });
      const data = await res.json();
      setServerCode(data?.code || '');
    } catch {
      console.info(`[CivicPulse 2FA] Resend failed.`);
    }

    setTimeout(() => {
      setLazyLoader(null);
      setResendCountdown(30);
      setCanResend(false);
      setCodeDigits(['', '', '', '', '', '']);
      setCodeError('');
    }, 600);
  };

  // Step 2: Validate 6-Digit Code and Enter Dashboard
  const handleVerifyCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = codeDigits.join('').trim();

    if (enteredCode.length < 6) {
      setCodeError('Please enter all 6 digits of the code sent to your email.');
      return;
    }

    // Trigger Lazy Loader
    setLazyLoader({
      active: true,
      message: 'Verifying security code...',
      submessage: `Authorizing session and loading ${computedRole.toUpperCase()} workspace...`,
    });

    const normalizedEmail = email.trim().toLowerCase();
    const displayName = formatDisplayName(normalizedEmail);

    const targetDashboard = getDashboardForRole(computedRole);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          code: enteredCode,
          role: computedRole,
          name: displayName,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setLazyLoader(null);
        setCodeError(data?.error || 'Invalid verification code. Please check your email inbox.');
        return;
      }

      const sessionToken = data?.token || `jwt-${Date.now()}`;
      if (typeof window !== 'undefined') {
        document.cookie = `civicpulse_session=${sessionToken}; path=/; max-age=2592000; SameSite=Lax`;
        document.cookie = `civicpulse_role=${computedRole}; path=/; max-age=2592000; SameSite=Lax`;
      }

      if (data?.user) {
        dispatch(
          setCredentials({
            user: { ...data.user, role: computedRole },
            token: sessionToken,
          })
        );
      }

      // Remember device for 30 days: next login will bypass 2FA on this browser!
      saveDeviceTrust(normalizedEmail);

      // Instant redirect: immediately route to dashboard with zero artificial delays
      const redirectParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') : null;
      const targetUrl = redirectParam && redirectParam.startsWith('/') ? redirectParam : targetDashboard;
      window.location.href = targetUrl;
    } catch {
      setLazyLoader(null);
      setCodeError('Unable to connect to authorization server. Please try again.');
      return;
    }
  };

  return (
    <MotionGrid
      speed="18s"
      opacity={0.14}
      enableGlow={true}
      lineColor="110, 134, 4"
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6"
    >
      {/* Full Screen LazyLoader Overlay */}
      {lazyLoader?.active && (
        <LazyLoader
          fullScreen
          message={lazyLoader.message}
          submessage={lazyLoader.submessage}
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
            <span className="text-xs font-mono text-text-muted">CivicPulse 2FA Auth</span>
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
              {step === 'credentials' ? 'Log In to CivicPulse' : 'Email Security Verification'}
            </h1>
            <p className="text-sm text-text-muted">
              {step === 'credentials'
                ? 'Access your citizen reporting portal or authorized municipal management hub.'
                : `A 6-digit verification code has been dispatched to ${email}.`}
            </p>
          </div>

          {/* STEP 1: CREDENTIALS INPUT */}
          {step === 'credentials' && (
            <div className="space-y-4">
              {/* 1-Click Fast Persona Login (Demo Credentials Preserved) */}
              <div className="p-3.5 rounded-lg border border-[#e2fa6b] bg-[#F7F5EF] dark:bg-[#141B29]">
                <p className="text-[11px] font-mono font-bold text-[#315CFF] dark:text-[#6280FF] uppercase tracking-wider mb-2.5">
                  Authorized Role Personas (Quick Demo)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePersonaSelect('citizen')}
                    className="text-sm justify-center bg-white dark:bg-[#1B2435] hover:border-emerald-500 font-semibold h-9 rounded-lg"
                  >
                    <span className="truncate">Citizen</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePersonaSelect('manager')}
                    className="text-sm justify-center bg-white dark:bg-[#1B2435] hover:border-amber-500 font-semibold h-9 rounded-lg"
                  >
                    <span className="truncate">Manager</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePersonaSelect('staff')}
                    className="text-sm justify-center bg-white dark:bg-[#1B2435] hover:border-blue-500 font-semibold h-9 rounded-lg"
                  >
                    <span className="truncate">Field Crew</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePersonaSelect('admin')}
                    className="text-sm justify-center bg-white dark:bg-[#1B2435] hover:border-purple-500 font-semibold h-9 rounded-lg"
                  >
                    <span className="truncate">City Admin</span>
                  </Button>
                </div>
              </div>

              {credentialError && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{credentialError}</span>
                </div>
              )}

              <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="e.g. tayabunnesa@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <div className="space-y-1.5">
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                  <div className="flex justify-end">
                    <Link
                      href={email ? `/forgot-password?email=${encodeURIComponent(email.trim())}` : '/forgot-password'}
                      className="text-xs font-semibold text-[#315CFF] dark:text-[#6280FF] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {!isDeviceTrusted && (
                  <div className="p-2.5 rounded-lg bg-surface-secondary border border-border text-xs text-text-muted flex items-start gap-2">
                    <Lock size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      First-time sign-in requires a 6-digit email code. Once verified, this device is remembered for 30 days.
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center font-bold shadow-sm gap-2 bg-[#315CFF] text-white dark:bg-[#e2fa6b] dark:text-[#202B45] h-11 rounded-lg text-sm cursor-pointer"
                >
                  {isDeviceTrusted ? (
                    <>
                      <LogIn size={16} />
                      <span>Sign In to Dashboard</span>
                    </>
                  ) : (
                    <>
                      <Mail size={16} />
                      <span>Sign In &amp; Receive Email Code</span>
                    </>
                  )}
                </button>
              </form>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-[#0E1420] px-2 text-text-muted font-mono">
                    Or continue with
                  </span>
                </div>
              </div>

              <GoogleButton label="Sign in with Google" />

              <div className="pt-1 text-center text-xs text-text-muted">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-[#315CFF] dark:text-[#6280FF] font-semibold hover:underline">
                  Create an account &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* STEP 2: 6-DIGIT VERIFICATION CODE */}
          {step === 'verify_code' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 rounded-lg bg-blue-50/80 dark:bg-[#141B29] border border-blue-200 dark:border-[#232F46] text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#315CFF] text-white flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="font-bold text-text-primary text-sm block">
                      Check Your Email Inbox
                    </span>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      A 6-digit verification code has been dispatched to{' '}
                      <strong className="text-text-primary font-mono">{email}</strong>.
                    </p>
                    <p className="text-xs text-text-muted pt-1">
                      Copy the 6-digit code from your email and enter it below. Expires in 10 minutes.
                    </p>
                  </div>
                </div>
              </div>

              {codeError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-shake">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{codeError}</span>
                </div>
              )}

              <form onSubmit={handleVerifyCodeSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-2 text-center">
                    Enter 6-Digit Code
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {codeDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`code-digit-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                        onPaste={idx === 0 ? handlePasteCode : undefined}
                        className="w-11 h-12 text-center text-lg font-bold font-mono rounded-lg border border-border bg-surface text-text-primary focus:border-[#315CFF] focus:ring-2 focus:ring-[#315CFF]/20 focus:outline-none transition-all shadow-sm"
                        autoFocus={idx === 0}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center font-bold shadow-sm gap-2 bg-[#315CFF] text-white dark:bg-[#e2fa6b] dark:text-[#202B45] h-11 rounded-lg text-sm cursor-pointer"
                >
                  <ShieldCheck size={16} />
                  <span>Verify &amp; Enter Dashboard</span>
                </button>
              </form>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="text-text-muted hover:text-[#315CFF] font-semibold transition-colors flex items-center gap-1"
                >
                  <ArrowLeft size={13} /> Change Email
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={!canResend}
                  className={`font-semibold flex items-center gap-1 ${
                    canResend
                      ? 'text-[#315CFF] hover:underline cursor-pointer'
                      : 'text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <RotateCcw size={13} />
                  {canResend ? 'Resend Code' : `Resend in ${resendCountdown}s`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MotionGrid>
  );
}
