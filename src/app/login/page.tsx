'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import Link from 'next/link';
import TypewriterText from '@/components/TypewriterText';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useSystemTheme } from '@/hooks/useSystemTheme';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { darkMode, setDarkMode } = useSystemTheme();
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check for confirmation error in URL
  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError === 'confirmation_failed') {
      setError('Email confirmation failed. Please try logging in again.');
    }
  }, [searchParams]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('=== Login attempt started ===');
    console.log('Email:', email);

    try {
      console.log('Calling supabase.auth.signInWithPassword...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data.session) {
        console.error('No session in response');
        throw new Error('Login successful but no session obtained');
      }

      console.log('Session obtained:', data.session);
      console.log('User:', data.user);

      // Refresh the router to update the session in middleware
      console.log('Refreshing router...');
      router.refresh();
      
      // Wait a short time to allow the session to sync
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigate to dashboard
      console.log('Navigating to /dashboard...');
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed, please try again');
      setLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        }
      });

      if (error) throw error;

      setOtpSent(true);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'email',
      });

      if (error) throw error;
      if (!data.session) throw new Error('Verification successful but no session obtained');

      router.refresh();
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP code');
      setLoading(false);
    }
  };

  return (
    <>
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Dark Mode Toggle */}
      <div className="theme-toggle" onClick={() => setDarkMode(!darkMode)} role="button" aria-label="Toggle dark mode">
        <div className="theme-toggle-slider" />
      </div>

      <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl">
          <header className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-pink-500 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent md:whitespace-nowrap">
              <TypewriterText text="YouTube Subtitle Extractor" speed={150} delayBeforeRestart={3000} />
            </h1>
            <p className="text-secondary text-sm md:text-base">
              Login to your account to continue
            </p>
          </header>

          <div className="neumorphic-card">
            {/* Login Method Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('password');
                  setOtpSent(false);
                  setError('');
                }}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  loginMethod === 'password'
                    ? 'glass-button-primary'
                    : 'glass-button'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('otp');
                  setError('');
                }}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  loginMethod === 'otp'
                    ? 'glass-button-primary'
                    : 'glass-button'
                }`}
              >
                OTP Code
              </button>
            </div>

            {/* Password Login Form */}
            {loginMethod === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="neumorphic-input"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="neumorphic-input"
                  disabled={loading}
                  required
                />
              </div>

              {error && (
                <div className="message-box message-error">
                  <p className="font-semibold">⚠ {error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="glass-button-primary w-full py-4 text-lg font-bold uppercase tracking-wider"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="loading-spinner" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
            )}

            {/* OTP Login Form */}
            {loginMethod === 'otp' && !otpSent && (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div>
                  <label htmlFor="otp-email" className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    id="otp-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="neumorphic-input"
                    disabled={loading}
                    required
                  />
                </div>

                {error && (
                  <div className="message-box message-error">
                    <p className="font-semibold">⚠ {error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="glass-button-primary w-full py-4 text-lg font-bold uppercase tracking-wider"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="loading-spinner" />
                      Sending...
                    </span>
                  ) : (
                    'Send OTP Code'
                  )}
                </button>
              </form>
            )}

            {/* OTP Verification Form */}
            {loginMethod === 'otp' && otpSent && (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="message-box message-success">
                  <p className="font-semibold">✓ OTP code sent to {email}</p>
                  <p className="text-sm mt-1">Please check your email and enter the code below</p>
                </div>

                <div>
                  <label htmlFor="otp-code" className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                    OTP Code
                  </label>
                  <input
                    id="otp-code"
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 8-digit code"
                    className="neumorphic-input text-center text-2xl tracking-widest"
                    maxLength={8}
                    disabled={loading}
                    required
                  />
                </div>

                {error && (
                  <div className="message-box message-error">
                    <p className="font-semibold">⚠ {error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="glass-button-primary flex-1 py-4 text-lg font-bold uppercase tracking-wider"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">
                        <span className="loading-spinner" />
                        Verifying...
                      </span>
                    ) : (
                      'Verify & Sign In'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtpCode('');
                      setError('');
                    }}
                    className="glass-button px-6"
                    disabled={loading}
                  >
                    Back
                  </button>
                </div>
              </form>
            )}

            <div className="text-center mt-6">
              <p className="text-secondary text-sm">
                Don't have an account?{' '}
                <Link 
                  href="/register" 
                  className="font-bold bg-gradient-to-r from-orange-500 to-pink-500 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}