'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';

export default function RegisterPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

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
      setError('密码不匹配，请重新输入');
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('密码长度至少为 6 个字符');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败，请重试');
    } finally {
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
              创建账户
            </h1>
            <p className="text-secondary text-sm md:text-base">
              注册新用户以开始使用
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
                  电子邮箱
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
                  密码
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少 6 个字符"
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
                  确认密码
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入密码"
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
                  <p className="font-semibold">✓ 注册成功！正在跳转到登录页面...</p>
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
                    注册中...
                  </span>
                ) : success ? (
                  '注册成功'
                ) : (
                  '注册'
                )}
              </button>

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-secondary text-sm">
                  已有账户？{' '}
                  <Link 
                    href="/login" 
                    className="font-bold bg-gradient-to-r from-orange-500 to-pink-500 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                  >
                    返回登录
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
