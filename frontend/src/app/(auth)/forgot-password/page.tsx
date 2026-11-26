'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { BrandLogo } from '../../../components/ui/brand-logo';
import { LazyLoader } from '../../../components/ui/lazy-loader';
import {
  ArrowLeft,
  Mail,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
  const [email, setEmail] = useState(initialEmail);
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [resendCountdown, setResendCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'reset' && resendCountdown > 0) {
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

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data?.error || 'Could not find an account with that email address.');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setStep('reset');
      setResendCountdown(30);
      setCanResend(false);
      setCodeDigits(['', '', '', '', '', '']);
    } catch {
      setErrorMsg('Unable to reach the authorization server. Please try again.');
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    setErrorMsg('');
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
    } catch {}
    setIsLoading(false);
    setResendCountdown(30);
    setCanResend(false);
    setCodeDigits(['', '', '', '', '', '']);
  };

  const handleDigitChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const next = [...codeDigits];
    next[index] = cleanVal;
    setCodeDigits(next);
    setErrorMsg('');
    if (cleanVal && index < 5) {
      document.getElementById(`reset-digit-${index + 1}`)?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      document.getElementById(`reset-digit-${index - 1}`)?.focus();
    }
  };

  const handlePasteCode = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...codeDigits];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] || '';
    }
    setCodeDigits(next);
    setErrorMsg('');
    document.getElementById(`reset-digit-${Math.min(pasted.length, 5)}`)?.focus();
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const code = codeDigits.join('').trim();
    if (code.length < 6) {
      setErrorMsg('Please enter the 6-digit reset code sent to your email.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data?.error || 'Failed to reset password. Please check your code.');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setStep('success');
    } catch {
      setErrorMsg('Unable to reach the authorization server. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 relative">
      {isLoading && (
        <LazyLoader
          fullScreen
          message={step === 'request' ? 'Sending reset code...' : 'Updating your password...'}
          submessage="Securing your CivicPulse account..."
        />
      )}

      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-brand-cobalt transition-colors"
          >
            <ArrowLeft size={14} /> Back to Log In
          </Link>
          <span className="text-xs font-mono text-text-muted">Account Recovery</span>
        </div>

        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <BrandLogo size={44} className="text-[#202B45] dark:text-white" />
          </div>
          <h1 className="text-2xl font-bold font-display text-text-primary tracking-tight">
            {step === 'request'
              ? 'Forgot Your Password?'
              : step === 'reset'
              ? 'Reset Your Password'
              : 'Password Updated'}
          </h1>
          <p className="text-xs text-text-muted">
            {step === 'request'
              ? 'Enter your registered email address and we will send you a 6-digit recovery code.'
              : step === 'reset'
              ? `Enter the 6-digit code sent to ${email} and choose a new password.`
              : 'Your CivicPulse password has been updated successfully.'}
          </p>
        </div>

        <Card className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'request' && (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <Input
                label="Registered Email Address *"
                type="email"
                placeholder="e.g. tayabunnesa@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full font-bold bg-[#315CFF] hover:bg-[#244BE0] text-white h-11 gap-2"
              >
                <Mail size={15} />
                <span>Send 6-Digit Reset Code</span>
              </Button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-2 text-center">
                  Enter 6-Digit Recovery Code
                </label>
                <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                  {codeDigits.map((digit, index) => (
                    <input
                      key={index}
                      id={`reset-digit-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(index, e)}
                      onPaste={handlePasteCode}
                      className="w-10 h-12 sm:w-11 sm:h-13 text-center text-lg font-bold font-mono bg-surface border-2 border-border rounded-xl focus:border-[#315CFF] focus:ring-2 focus:ring-[#315CFF]/20 focus:outline-none transition-all text-text-primary"
                      required
                    />
                  ))}
                </div>
              </div>

              <Input
                label="New Password *"
                type="password"
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
              />

              <Input
                label="Confirm New Password *"
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full font-bold bg-[#315CFF] hover:bg-[#244BE0] text-white h-11 gap-2"
              >
                <KeyRound size={15} />
                <span>Reset Password</span>
              </Button>

              <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                <button
                  type="button"
                  onClick={() => setStep('request')}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  &larr; Change Email
                </button>
                <button
                  type="button"
                  disabled={!canResend}
                  onClick={handleResendCode}
                  className={`inline-flex items-center gap-1 font-semibold ${
                    canResend
                      ? 'text-[#315CFF] hover:underline'
                      : 'text-text-muted cursor-not-allowed'
                  }`}
                >
                  <RotateCcw size={12} />
                  {canResend ? 'Resend Code' : `Resend in ${resendCountdown}s`}
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 rounded-2xl bg-[#e2fa6b] text-[#202B45] flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-sm text-text-secondary">
                You can now log in using your new password.
              </p>
              <Link href="/login" className="block">
                <Button
                  type="button"
                  variant="primary"
                  className="w-full font-bold bg-[#315CFF] hover:bg-[#244BE0] text-white h-11"
                >
                  Return to Log In &rarr;
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
