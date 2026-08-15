import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from './LanguageSwitcher';

const TITLE_WORDS = ['Universal', 'Game', 'Design', 'Framework'];
const INITIAL_COLORS = ['#A4B885', '#D46D25', '#FDC086', '#FFF6A1'];

export default async function Header() {
  const t = await getTranslations('header');

  return (
    <header className="bg-surface border-b border-accent-muted p-6 flex items-center justify-between">
      <Link href="/">
        <h1 className="text-2xl font-bold text-foreground">
          {TITLE_WORDS.map((word, i) => (
            <span key={word}>
              <span style={{ color: INITIAL_COLORS[i] }}>{word[0]}</span>
              <span className="hidden sm:inline">
                {word.slice(1)}
                {i < TITLE_WORDS.length - 1 ? ' ' : ''}
              </span>
            </span>
          ))}
        </h1>
      </Link>
      <div className="flex items-center gap-4">
        <Link
          href="/load"
          className="text-sm text-text-muted hover:text-foreground transition-colors"
        >
          {t('loadLink')}
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
