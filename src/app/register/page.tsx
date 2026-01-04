'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import TypewriterText from '@/components/TypewriterText';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useSystemTheme } from '@/hooks/useSystemTheme';

export default function RegisterPage() {
  const { darkMode, setDarkMode } = useSystemTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Auto redirect to login after successful registration
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/confirm`,
        },
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Dark Mode Toggle */}
      <div 
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
        role="button"
        aria-label="Toggle dark mode"
      >
        <div className="theme-toggle-slider" />
      </div>

      {/* Main Container */}
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <header className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-pink-500 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent md:whitespace-nowrap">
              <TypewriterText text="Create Account" speed={150} delayBeforeRestart={3000} />
            </h1>
            <p className="text-secondary text-sm md:text-base">
              Sign up to get started
            </p>
          </header>

          {/* Register Card */}
          <div className="neumorphic-card">
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Email Input */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-semibold mb-2 uppercase tracking-wide"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="neumorphic-input"
                  disabled={loading || success}
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-semibold mb-2 uppercase tracking-wide"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="neumorphic-input"
                  disabled={loading || success}
                  required
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-sm font-semibold mb-2 uppercase tracking-wide"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="neumorphic-input"
                  disabled={loading || success}
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="message-box message-error">
                  <p className="font-semibold">⚠ {error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="message-box message-success">
                  <p className="font-semibold">✓ Registration successful! Redirecting to login...</p>
                </div>
              )}

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading || success}
                className="glass-button-primary w-full py-4 text-lg font-bold uppercase tracking-wider"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="loading-spinner" />
                    Signing up...
                  </span>
                ) : success ? (
                  'Success'
                ) : (
                  'Sign Up'
                )}
              </button>

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-secondary text-sm">
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="font-bold bg-gradient-to-r from-orange-500 to-pink-500 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
