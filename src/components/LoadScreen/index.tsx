'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  deleteIdeaForever,
  getAllIdeas,
  importIdea,
  parseIdeaExport,
  restoreIdea,
  softDeleteIdea,
  type SavedIdea,
} from '@/lib/ideaStorage';

const LoadScreen = () => {
  const t = useTranslations('load');
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);
  const [view, setView] = useState<'active' | 'deleted'>('active');
  const [importError, setImportError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIdeas(getAllIdeas());
  }, []);

  const activeIdeas = ideas.filter((idea) => idea.deletedAt === null);
  const deletedIdeas = ideas.filter((idea) => idea.deletedAt !== null);

  const handleDelete = (id: string) => {
    softDeleteIdea(id);
    setIdeas(getAllIdeas());
  };

  const handleRestore = (id: string) => {
    restoreIdea(id);
    setIdeas(getAllIdeas());
  };

  const handleDeleteForever = (id: string) => {
    if (!window.confirm(t('deleteForeverConfirm'))) return;
    deleteIdeaForever(id);
    setIdeas(getAllIdeas());
  };

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

      {view === 'active' ? (
        <>
          {activeIdeas.length === 0 ? (
            <p className="text-text-muted">{t('empty')}</p>
          ) : (
            <ul className="space-y-4">
              {activeIdeas.map((idea) => (
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
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/?id=${idea.id}`}
                      className="px-4 py-2 rounded-md bg-accent text-background font-medium hover:opacity-90 transition-opacity"
                    >
                      {t('loadButton')}
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(idea.id)}
                      className="cursor-pointer px-4 py-2 rounded-md bg-surface border border-danger-muted text-danger-muted font-medium hover:border-danger hover:text-danger transition-colors"
                    >
                      {t('deleteButton')}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {deletedIdeas.length > 0 && (
            <button
              type="button"
              onClick={() => setView('deleted')}
              className="cursor-pointer text-sm text-danger-muted hover:text-danger transition-colors underline underline-offset-2"
            >
              {t('viewDeletedLink', { count: deletedIdeas.length })}
            </button>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-foreground">{t('deletedTitle')}</h2>
            <button
              type="button"
              onClick={() => setView('active')}
              className="cursor-pointer text-sm text-text-muted hover:text-foreground transition-colors underline underline-offset-2"
            >
              {t('backToActiveLink')}
            </button>
          </div>

          {deletedIdeas.length === 0 ? (
            <p className="text-text-muted">{t('emptyDeleted')}</p>
          ) : (
            <ul className="space-y-4">
              {deletedIdeas.map((idea) => (
                <li
                  key={idea.id}
                  className="bg-surface border border-danger-muted rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-foreground">{idea.ideaTitle || t('untitled')}</p>
                    <p className="text-sm text-text-muted">
                      {t('updatedAtLabel')} {new Date(idea.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRestore(idea.id)}
                      className="cursor-pointer px-4 py-2 rounded-md bg-accent text-background font-medium hover:opacity-90 transition-opacity"
                    >
                      {t('restoreButton')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteForever(idea.id)}
                      className="cursor-pointer px-4 py-2 rounded-md bg-danger-muted border border-danger-muted text-background font-medium hover:bg-danger hover:border-danger transition-colors"
                    >
                      {t('deleteForeverButton')}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
};

export default LoadScreen;
