'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = async (e: React.FormEvent) => {
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
        throw new Error('登录成功但未获取到会话信息');
      }

      console.log('Session obtained:', data.session);
      console.log('User:', data.user);

      // Navigate to dashboard using replace to prevent back navigation to login
      console.log('Navigating to /dashboard...');
      router.replace('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : '登录失败，请重试');
      setLoading(false);
    }
  };

  return (
    <>
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
        <div className="w-full max-w-md">
          {/* Header */}
          <header className="text-center mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-pink-500 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent">
              欢迎回来
            </h1>
            <p className="text-secondary text-sm md:text-base">
              登录您的账户以继续
            </p>
          </header>

          {/* Login Card */}
          <div className="neumorphic-card">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-semibold mb-2 uppercase tracking-wide"
                >
                  电子邮箱
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

              {/* Password Input */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-semibold mb-2 uppercase tracking-wide"
                >
                  密码
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

              {/* Error Message */}
              {error && (
                <div className="message-box message-error">
                  <p className="font-semibold">⚠ {error}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="glass-button-primary w-full py-4 text-lg font-bold uppercase tracking-wider"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="loading-spinner" />
                    登录中...
                  </span>
                ) : (
                  '登录'
                )}
              </button>

              {/* Register Link */}
              <div className="text-center mt-6">
                <p className="text-secondary text-sm">
                  还没有账户？{' '}
                  <Link 
                    href="/register" 
                    className="font-bold bg-gradient-to-r from-orange-500 to-pink-500 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                  >
                    注册新用户
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
