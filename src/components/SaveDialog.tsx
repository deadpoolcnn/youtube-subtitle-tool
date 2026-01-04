'use client';

import { useState } from 'react';

interface SaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  loading?: boolean;
}

export default function SaveDialog({ isOpen, onClose, onSave, loading = false }: SaveDialogProps) {
  const [title, setTitle] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim());
    }
  };

  const handleCancel = () => {
    setTitle(''); // Clear form
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && title.trim()) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="neumorphic-card w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 uppercase tracking-wide">
          Save Subtitle
        </h2>
        
        <div className="mb-6">
          <label 
            htmlFor="subtitle-title" 
            className="block text-sm font-semibold mb-2 uppercase tracking-wide"
          >
            Title
          </label>
          <input
            id="subtitle-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter subtitle title..."
            className="neumorphic-input"
            disabled={loading}
            autoFocus
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="glass-button px-6 py-3"
            disabled={loading}
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="glass-button-primary px-6 py-3"
            disabled={loading || !title.trim()}
            type="button"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="loading-spinner" />
                Saving...
              </span>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
