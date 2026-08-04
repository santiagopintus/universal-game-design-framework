import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from './LanguageSwitcher';

export default async function Header() {
  const t = await getTranslations('header');

  return (
    <header className="bg-surface border-b border-accent-muted p-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-foreground">Universal Game Design Framework</h1>
      <div className="flex items-center gap-4">
        <Link href="/load" className="text-sm text-text-muted hover:text-foreground transition-colors">
          {t('loadLink')}
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
