import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  return (
    <header className="bg-surface border-b border-accent-muted p-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-foreground">Universal Game Design Framework</h1>
      <LanguageSwitcher />
    </header>
  );
}
