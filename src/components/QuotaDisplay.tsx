"use client";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { QuotaInfo } from "@/types/types";

export interface QuotaDisplayRef {
  refresh: () => void;
}

const QuotaDisplay = forwardRef<QuotaDisplayRef>((props, ref) => {
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuota = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/quota");
      if (response.ok) {
        const data = await response.json();
        setQuota(data);
      }
    } catch (error) {
      console.error("Failed to fetch quota:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuota();
  }, []);

  useImperativeHandle(ref, () => ({
    refresh: fetchQuota
  }));

  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface">
        <span className="loading-spinner w-4 h-4" />
        <span className="text-sm text-secondary">Loading...</span>
      </div>
    );
  }

  if (!quota) return null;

  if (quota.hasApiKey) {
    return (
      <div className="neumorphic-card p-4 flex items-center gap-3">
        <svg
          className="w-5 h-5 text-green-600 dark:text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
          Own API Key
        </span>
      </div>
    );
  }

  const percentage = (quota.used / quota.limit) * 100;
  const isLow = quota.remaining <= 1;
  const isCritical = quota.remaining === 0;

  return (
    <div className="neumorphic-card p-4 flex items-center gap-4">
      <div className="flex flex-col">
        <span className="text-xs text-secondary uppercase tracking-wide font-semibold">
          Monthly Quota
        </span>
        <span
          className={`text-xl font-bold ${
            isCritical
              ? "text-red-600 dark:text-red-400"
              : isLow
              ? "text-orange-600 dark:text-orange-400"
              : "text-blue-600 dark:text-blue-400"
          }`}
        >
          {quota.remaining} / {quota.limit}
        </span>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="w-24 h-2 bg-surface rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isCritical
                ? "bg-red-500"
                : isLow
                ? "bg-orange-500"
                : "bg-blue-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs text-secondary font-semibold">
          {quota.used} used
        </span>
      </div>

      {isCritical && (
        <svg
          className="w-5 h-5 text-red-600 dark:text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      )}
    </div>
  );
});

QuotaDisplay.displayName = 'QuotaDisplay';

export default QuotaDisplay;
