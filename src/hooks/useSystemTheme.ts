'use client';

import { useEffect, useState } from 'react';

export function useSystemTheme() {
  const [darkMode, setDarkModeState] = useState(false);
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') return;

    // Check if user has manual preference
    const manualPreference = localStorage.getItem('theme-manual');
    const savedTheme = localStorage.getItem('theme');

    if (manualPreference === 'true' && savedTheme) {
      // User has manually set theme, use that
      setIsManual(true);
      setDarkModeState(savedTheme === 'dark');
    } else {
      // Auto-follow system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setDarkModeState(mediaQuery.matches);

      // Listen for system theme changes
      const handleChange = (e: MediaQueryListEvent) => {
        // Only auto-update if not manually set
        const isStillManual = localStorage.getItem('theme-manual') === 'true';
        if (!isStillManual) {
          setDarkModeState(e.matches);
        }
      };

      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Manual toggle function
  const setDarkMode = (value: boolean) => {
    setDarkModeState(value);
    setIsManual(true);
    // Save manual preference
    localStorage.setItem('theme-manual', 'true');
    localStorage.setItem('theme', value ? 'dark' : 'light');
  };

  // Reset to auto-follow system (called on logout)
  const resetToSystem = () => {
    setIsManual(false);
    localStorage.removeItem('theme-manual');
    localStorage.removeItem('theme');
    
    // Get current system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkModeState(mediaQuery.matches);
  };

  return { darkMode, setDarkMode, isManual, resetToSystem };
}
