'use client1';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { TranscriptSegment, Language } from '@/types/types';

interface FormData {
  url: string;
  language: Language;
  plainText: boolean;
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [transcriptText, setTranscriptText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      url: '',
      language: 'en',
      plainText: false,
    }
  });

  const plainText = watch('plainText');

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    setTranscript([]);
    setTranscriptText('');
    setCopySuccess(false);

    try {
      const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: data.url, 
          lang: data.language, 
          text: data.plainText 
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to fetch transcript');
      }

      if (data.plainText) {
        if (responseData.content && typeof responseData.content === 'string') {
          setTranscriptText(responseData.content);
        } else {
          setError('No transcript available for this video');
        }
      } else {
        if (responseData.content && Array.isArray(responseData.content) && responseData.content.length > 0) {
          setTranscript(responseData.content);
        } else {
          setError('No transcript available for this video');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTranscript = () => {
    const text = plainText 
      ? transcriptText
      : transcript.map(segment => 
          `[${formatTime(segment.offset)}] ${segment.text}`
        ).join('\n');
    
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }).catch(err => {
      console.error('Failed to copy:', err);
      setError('Failed to copy to clipboard');
    });
  };

  const handleDownloadTranscript = () => {
    const text = plainText
      ? transcriptText
      : transcript.map(segment => 
          `[${formatTime(segment.offset)}] ${segment.text}`
        ).join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        <div className="w-full max-w-4xl">
          {/* Header */}
          <header className="text-center mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-pink-500 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent">
              YouTube Subtitle Extractor
            </h1>
            <p className="text-secondary text-sm md:text-base">
              Extract and download video transcripts in multiple languages
            </p>
          </header>

          {/* Main Card */}
          <div className="neumorphic-card">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* URL Input */}
              <div>
                <label 
                  htmlFor="url" 
                  className="block text-sm font-semibold mb-2 uppercase tracking-wide"
                >
                  YouTube URL
                </label>
                <input
                  id="url"
                  type="url"
                  {...register('url', { 
                    required: 'YouTube URL is required',
                    pattern: {
                      value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
                      message: 'Please enter a valid YouTube URL'
                    }
                  })}
                  placeholder="https://youtu.be/dQw4w9WgXcQ"
                  className="neumorphic-input"
                  disabled={loading}
                />
                {errors.url && (
                  <p className="text-red-500 text-sm mt-2">{errors.url.message}</p>
                )}
              </div>

              {/* Language Selector */}
              <div>
                <label 
                  htmlFor="language" 
                  className="block text-sm font-semibold mb-2 uppercase tracking-wide"
                >
                  Language
                </label>
                <select
                  id="language"
                  {...register('language')}
                  className="neumorphic-input"
                  disabled={loading}
                >
                  <option value="en">English</option>
                  <option value="zh-CN">中文 (简体)</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                  <option value="ja">日本語</option>
                  <option value="de">Deutsch</option>
                  <option value="ko">한국어</option>
                  <option value="pt">Português</option>
                  <option value="it">Italiano</option>
                  <option value="ru">Русский</option>
                  <option value="ar">العربية</option>
                </select>
              </div>

              {/* Plain Text Checkbox */}
              <div className="flex items-center gap-3">
                <input
                  id="plainText"
                  type="checkbox"
                  {...register('plainText')}
                  className="modern-checkbox"
                  disabled={loading}
                />
                <label 
                  htmlFor="plainText" 
                  className="text-sm font-semibold uppercase tracking-wide cursor-pointer select-none"
                >
                  Plain Text (No Timestamps)
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="glass-button-primary w-full py-4 text-lg font-bold uppercase tracking-wider"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="loading-spinner" />
                    Extracting...
                  </span>
                ) : (
                  'Extract Transcript'
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="message-box message-error mt-6">
                <p className="font-semibold">⚠ {error}</p>
              </div>
            )}

            {/* Success Message */}
            {copySuccess && (
              <div className="message-box message-success mt-6">
                <p className="font-semibold">✓ Copied to clipboard!</p>
              </div>
            )}
          </div>

          {/* Transcript Display - Plain Text Mode */}
          {plainText && transcriptText && (
            <div className="transcript-container">
              <div className="neumorphic-card">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <h2 className="text-2xl font-bold uppercase tracking-wide">
                    Transcript (Plain Text)
                  </h2>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCopyTranscript}
                      className="glass-button hover-lift"
                      type="button"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={handleDownloadTranscript}
                      className="glass-button hover-lift"
                      type="button"
                    >
                      💾 Download
                    </button>
                  </div>
                </div>
                <div className="transcript-plain">
                  {transcriptText}
                </div>
              </div>
            </div>
          )}

          {/* Transcript Display - Segmented Mode */}
          {!plainText && transcript.length > 0 && (
            <div className="transcript-container">
              <div className="neumorphic-card">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <h2 className="text-2xl font-bold uppercase tracking-wide">
                    Transcript ({transcript.length} segments)
                  </h2>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCopyTranscript}
                      className="glass-button hover-lift"
                      type="button"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={handleDownloadTranscript}
                      className="glass-button hover-lift"
                      type="button"
                    >
                      💾 Download
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {transcript.map((segment, index) => (
                    <div
                      key={index}
                      className="transcript-segment"
                    >
                      <div className="transcript-timestamp">
                        {formatTime(segment.offset)}
                      </div>
                      <div className="transcript-text">
                        {segment.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="text-center mt-12 text-secondary text-sm">
            <p>Powered by Supadata YouTube Transcript API</p>
          </footer>
        </div>
      </div>
    </>
  );
}
