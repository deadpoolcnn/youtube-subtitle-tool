'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { useSystemTheme } from '@/hooks/useSystemTheme';

export default function SettingsPage() {
  const { darkMode, setDarkMode } = useSystemTheme();
  const [apiKey, setApiKey] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchApiKey();
  }, []);
  const fetchApiKey = async () => {
    try {
      const response = await fetch('/api/user/api-key');
      if (response.ok) {
        const data = await response.json();
        setHasApiKey(data.hasApiKey);
      }
    } catch (err) {
      console.error('Failed to fetch API key:', err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/user/api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save API key');
      }

      setSuccess('API Key saved successfully!');
      setHasApiKey(true);
      setApiKey('');
      setShowApiKey(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save API key');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove your API Key? You will go back to using the free tier (5 requests/month).')) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/user/api-key', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete API key');
      }

      setSuccess('API Key removed successfully!');
      setHasApiKey(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete API key');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <>
      <div className="theme-toggle" onClick={() => setDarkMode(!darkMode)} role="button" aria-label="Toggle dark mode">
        <div className="theme-toggle-slider" />
      </div>

      <div className="min-h-screen p-4 md:p-8">
        <div className="w-full max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent">
                Settings
              </h1>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="glass-button px-6 py-3"
                >
                  ← Back
                </button>
                <button
                  onClick={handleLogout}
                  className="glass-button px-6 py-3"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          {/* API Key Section */}
          <div className="neumorphic-card mb-6">
            <h2 className="text-2xl font-bold mb-4">YouTube API Key</h2>
            
            {hasApiKey ? (
              <div className="space-y-4">
                <div className="message-box message-success">
                  <p className="font-semibold">✓ You are using your own API Key</p>
                  <p className="text-sm mt-1">Unlimited requests available</p>
                </div>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="glass-button px-6 py-3 border-red-500 border-opacity-50"
                >
                  {loading ? 'Removing...' : 'Remove API Key'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="message-box message-error">
                  <p className="font-semibold">⚠ Using free tier (5 requests/month)</p>
                  <p className="text-sm mt-1">Add your own API Key for unlimited requests</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">How to get YouTube API Key?</h3>
                  <ol className="text-sm text-secondary space-y-2 list-decimal list-inside mb-4">
                    <li>Visit <a href="http://supadata.ai/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Supadata AI</a></li>
                    <li>Click get 100 free requests</li>
                    <li>Enable YouTube Data API v3</li>
                    <li>Create credentials → API Key</li>
                    <li>Copy the generated API Key and paste below</li>
                  </ol>
                </div>

                <div>
                  <label htmlFor="apiKey" className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                    API Key
                  </label>
                  <div className="relative">
                    <input
                      id="apiKey"
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="AIza..."
                      className="neumorphic-input pr-20"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-secondary hover:text-primary"
                    >
                      {showApiKey ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <p className="text-xs text-secondary mt-2">
                    Your API Key will be encrypted and stored securely
                  </p>
                </div>

                <button
                  onClick={handleSave}
                  disabled={loading || !apiKey}
                  className="glass-button-primary px-6 py-3"
                >
                  {loading ? 'Saving...' : 'Save API Key'}
                </button>
              </div>
            )}

            {success && (
              <div className="message-box message-success mt-4">
                <p className="font-semibold">{success}</p>
              </div>
            )}

            {error && (
              <div className="message-box message-error mt-4">
                <p className="font-semibold">⚠ {error}</p>
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="neumorphic-card">
            <h2 className="text-2xl font-bold mb-4">Account</h2>
            <div className="text-secondary">
              <p>Manage your account settings and preferences</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
