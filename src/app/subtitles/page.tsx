'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import type { SubtitleRecord } from '@/types/types';
import SubtitleDetailModal from '@/components/SubtitleDetailModal';

export default function SubtitlesPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [subtitles, setSubtitles] = useState<SubtitleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [selectedSubtitle, setSelectedSubtitle] = useState<SubtitleRecord | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  // Get user info
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
      }
    };
    getUser();
  }, []);

  // Fetch subtitles
  useEffect(() => {
    if (userEmail) {
      fetchSubtitles();
    }
  }, [userEmail]);

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchSubtitles = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/subtitles`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch subtitles');
      }

      setSubtitles(data.subtitles || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/subtitles/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete subtitle');
      }

      // Remove from local state
      setSubtitles(subtitles.filter(s => s.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete subtitle');
    } finally {
      setDeleting(false);
    }
  };

  const getContentPreview = (content: string) => {
    if (content.length <= 20) return content;
    return content.substring(0, 20) + '...';
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
      <div className="min-h-screen p-4 md:p-8">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-8 md:mb-12">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-pink-500 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent">
                  Saved Subtitles
                </h1>
                <p className="text-secondary text-sm md:text-base">
                  Manage your saved subtitle files
                </p>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="glass-button px-6 py-3"
              >
                ← Back to Dashboard
              </button>
            </div>
          </header>

          {/* Success Message */}
          {success && (
            <div className="message-box message-success mb-6">
              <p className="font-semibold">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="message-box message-error mb-6">
              <p className="font-semibold">⚠ {error}</p>
            </div>
          )}

          {/* Subtitles Table */}
          <div className="neumorphic-card">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <span className="loading-spinner" />
                <span className="ml-3 text-secondary">Loading subtitles...</span>
              </div>
            ) : subtitles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-secondary text-lg">No saved subtitles yet</p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="glass-button-primary mt-6 px-6 py-3"
                >
                  Extract Your First Subtitle
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full subtitle-table">
                  <thead>
                    <tr>
                      <th className="text-left p-4 font-bold uppercase tracking-wide text-sm">Title</th>
                      <th className="text-left p-4 font-bold uppercase tracking-wide text-sm">Created</th>
                      <th className="text-left p-4 font-bold uppercase tracking-wide text-sm">Content</th>
                      <th className="text-right p-4 font-bold uppercase tracking-wide text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subtitles.map((subtitle) => (
                      <tr key={subtitle.id} className="subtitle-row">
                        <td className="p-4 font-semibold">{subtitle.title}</td>
                        <td className="p-4 text-secondary">{subtitle.created_at}</td>
                        <td className="p-4 text-secondary font-mono text-sm">
                          {getContentPreview(subtitle.content)}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setSelectedSubtitle(subtitle)}
                              className="glass-button text-sm px-4 py-2"
                            >
                              Detail
                            </button>
                            {deleteConfirm === subtitle.id ? (
                              <>
                                <button
                                  onClick={() => handleDelete(subtitle.id)}
                                  className="glass-button text-sm px-4 py-2 bg-red-500 bg-opacity-20 border-red-500"
                                  disabled={deleting}
                                >
                                  {deleting ? 'Deleting...' : 'Confirm'}
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="glass-button text-sm px-4 py-2"
                                  disabled={deleting}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(subtitle.id)}
                                className="glass-button text-sm px-4 py-2"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedSubtitle && (
        <SubtitleDetailModal
          isOpen={!!selectedSubtitle}
          onClose={() => setSelectedSubtitle(null)}
          title={selectedSubtitle.title}
          content={selectedSubtitle.content}
          createdAt={selectedSubtitle.created_at}
        />
      )}
    </>
  );
}
