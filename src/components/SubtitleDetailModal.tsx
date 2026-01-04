'use client';

import { useState } from 'react';

interface SubtitleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  createdAt: string;
}

export default function SubtitleDetailModal({ 
  isOpen, 
  onClose, 
  title, 
  content, 
  createdAt 
}: SubtitleDetailModalProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onKeyDown={handleKeyPress}
    >
      <div className="neumorphic-card w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-wide">
              {title}
            </h2>
            <p className="text-sm text-secondary mt-1">
              Created: {createdAt}
            </p>
          </div>
          <button
            onClick={onClose}
            className="glass-button w-10 h-10 flex items-center justify-center text-xl"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mb-6">
          <div className="transcript-plain">
            {content}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCopy}
            className="glass-button px-6 py-3"
            type="button"
          >
            {copySuccess ? '✓ Copied!' : '📋 Copy'}
          </button>
          <button
            onClick={onClose}
            className="glass-button-primary px-6 py-3"
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
