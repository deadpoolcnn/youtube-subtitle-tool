'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserDropdownProps {
  userEmail: string;
  onLogout: () => void;
}

export default function UserDropdown({ userEmail, onLogout }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleFileListClick = () => {
    setIsOpen(false);
    router.push('/subtitles');
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="neumorphic-card p-4 flex items-center gap-3 hover:transform hover:translateY(-1px) transition-all"
      >
        <span className="text-sm font-semibold text-secondary">
          {userEmail}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 neumorphic-card p-2 dropdown-menu">
          <button
            onClick={handleFileListClick}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all font-semibold text-sm"
          >
            📁 File List
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              router.push('/settings')
            }}
             className="w-full text-left px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all font-semibold text-sm"
          >
            ⚙️ Settings
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all font-semibold text-sm"
          >
            🚪 Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
