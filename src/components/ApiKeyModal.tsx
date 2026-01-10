'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ApiKeyModalProps } from '@/types/types';


export default function ApiKeyModal({ isOpen, onClose, onSuccess, quotaInfo }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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

      onSuccess();
      setApiKey('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save API key');
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent">
            Add YouTube API Key
          </h2>
          <button
            onClick={onClose}
            className="text-3xl hover:opacity-70 transition-opacity leading-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {quotaInfo && (
          <div className="message-box message-error mb-6">
            <p className="font-semibold">⚠ Free quota exhausted</p>
            <p className="text-sm mt-1">
              You have used {quotaInfo.used}/{quotaInfo.limit} free requests this month.
              Add your own YouTube API Key to continue using the service.
            </p>
          </div>
        )}

        <div className="mb-6 p-4 bg-surface rounded-xl">
          <h3 className="font-semibold mb-3 text-lg">How to get YouTube API Key?</h3>
          <ol className="text-sm text-secondary space-y-2 list-decimal list-inside">
            <li>
              Visit{' '}
              <a
                href="https://supadata.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline font-semibold"
              >
                Supadata AI
              </a>
            </li>
            <li>Click Get 100 free requests</li>
            <li>Enable <strong>YouTube Data API v3</strong></li>
            <li>Go to <strong>Credentials</strong> → <strong>Create Credentials</strong> → <strong>API Key</strong></li>
            <li>Copy the generated API Key and paste it below</li>
          </ol>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="apiKey" className="block text-sm font-semibold mb-2 uppercase tracking-wide">
              YouTube API Key
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sd_xxx_your_api_key_here_xxx"
                className="neumorphic-input pr-20"
                disabled={loading}
                required
                minLength={30}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-secondary hover:text-primary transition-colors font-semibold"
              >
                {showApiKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-xs text-secondary mt-2">
              🔒 Your API Key will be encrypted and stored securely. It will only be used for your own requests.
            </p>
          </div>

          {error && (
            <div className="message-box message-error mb-4">
              <p className="font-semibold">⚠ {error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !apiKey}
              className="glass-button-primary flex-1 py-3 text-lg font-bold uppercase tracking-wider"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading-spinner" />
                  Saving...
                </span>
              ) : (
                'Save API Key'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="glass-button px-8 py-3 font-bold"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}