'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { getAllIdeas, importIdea, parseIdeaExport, type SavedIdea } from '@/lib/ideaStorage';

const LoadScreen = () => {
  const t = useTranslations('load');
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);
  const [importError, setImportError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIdeas(getAllIdeas());
  }, []);

  const handleImportClick = () => {
    setImportError(false);
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const raw = await file.text();
    const parsed = parseIdeaExport(raw);
    if (!parsed) {
      setImportError(true);
      return;
    }

    importIdea(parsed);
    setIdeas(getAllIdeas());
  };

  return (
    <main className="max-w-5xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-4xl font-bold text-foreground">{t('title')}</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleImportClick}
            className="cursor-pointer px-4 py-2 rounded-md bg-surface border border-accent-muted text-foreground font-medium hover:border-accent transition-colors"
          >
            {t('importButton')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleFileSelected}
          />
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-background font-medium hover:opacity-90 transition-opacity"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M8 2v12M2 8h12" />
            </svg>
            {t('newIdea')}
          </Link>
        </div>
      </div>

      {importError && <p className="text-sm text-red-500">{t('importError')}</p>}

      {ideas.length === 0 ? (
        <p className="text-text-muted">{t('empty')}</p>
      ) : (
        <ul className="space-y-4">
          {ideas.map((idea) => (
            <li
              key={idea.id}
              className="bg-surface border border-accent-muted rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-foreground">{idea.ideaTitle || t('untitled')}</p>
                <p className="text-sm text-text-muted">
                  {t('updatedAtLabel')} {new Date(idea.updatedAt).toLocaleString()}
                </p>
              </div>
              <Link
                href={`/?id=${idea.id}`}
                className="px-4 py-2 rounded-md bg-accent text-background font-medium hover:opacity-90 transition-opacity"
              >
                {t('loadButton')}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default LoadScreen;
