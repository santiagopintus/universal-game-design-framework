'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { getAllIdeas, type SavedIdea } from '@/lib/ideaStorage';

const LoadScreen = () => {
  const t = useTranslations('load');
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);

  useEffect(() => {
    setIdeas(getAllIdeas());
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-4xl font-bold text-foreground">{t('title')}</h1>
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
