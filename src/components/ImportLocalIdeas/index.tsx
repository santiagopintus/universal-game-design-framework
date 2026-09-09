'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@clerk/nextjs';
import { bulkImportLocalIdeas, getLocalIdeaCount } from '@/lib/ideaStorage';

const importedFlagKey = (userId: string) => `ugdf.imported.${userId}`;

function hasAlreadyBeenHandled(userId: string): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return localStorage.getItem(importedFlagKey(userId)) !== null;
  } catch {
    return true;
  }
}

interface Props {
  onImported?: () => void;
}

const ImportLocalIdeas = ({ onImported }: Props) => {
  const t = useTranslations('importLocalIdeas');
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [importing, setImporting] = useState(false);

  const shouldShow =
    isLoaded && isSignedIn && !!userId && !dismissed && !hasAlreadyBeenHandled(userId);
  const localCount = shouldShow ? getLocalIdeaCount() : 0;

  if (!shouldShow || localCount === 0 || !userId) return null;

  const markHandled = () => {
    try {
      localStorage.setItem(importedFlagKey(userId), '1');
    } catch {
      // ignore storage errors — prompt may reappear next session, which is safe
    }
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      await bulkImportLocalIdeas();
      markHandled();
      setDismissed(true);
      onImported?.();
    } catch {
      setImporting(false);
    }
  };

  const handleDismiss = () => {
    markHandled();
    setDismissed(true);
  };

  return (
    <div className="bg-surface border border-accent-muted rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
      <p className="text-foreground">{t('message', { count: localCount })}</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDismiss}
          disabled={importing}
          className="cursor-pointer px-4 py-2 rounded-md bg-surface border border-accent-muted text-foreground font-medium hover:border-accent transition-colors disabled:opacity-50"
        >
          {t('dismiss')}
        </button>
        <button
          type="button"
          onClick={handleImport}
          disabled={importing}
          className="cursor-pointer px-4 py-2 rounded-md bg-accent text-background font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {importing ? t('importing') : t('import')}
        </button>
      </div>
    </div>
  );
};

export default ImportLocalIdeas;
