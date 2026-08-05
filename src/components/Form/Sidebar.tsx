'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { NAV_SECTIONS } from './navConfig';

type SidebarProps = {
  values: Record<string, string>;
};

const isFieldComplete = (values: Record<string, string>, key: string) =>
  (values[key] ?? '').trim() !== '';

const countProgress = (values: Record<string, string>, fields: string[]) => ({
  completed: fields.filter((key) => isFieldComplete(values, key)).length,
  total: fields.length,
});

const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const Sidebar = ({ values }: SidebarProps) => {
  const t = useTranslations('form');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const allIds = useMemo(
    () =>
      NAV_SECTIONS.flatMap((section) => [
        section.id,
        ...(section.subsections?.map((sub) => sub.id) ?? []),
      ]),
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 },
    );

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [allIds]);

  const handleSelect = (id: string) => {
    scrollToId(id);
    setMobileOpen(false);
  };

  const navList = (
    <nav aria-label={t('sidebar.heading')}>
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">
        {t('sidebar.heading')}
      </p>
      <ul className="space-y-1">
        {NAV_SECTIONS.map((section) => {
          const progress = countProgress(values, [
            ...section.fields,
            ...(section.subsections?.flatMap((sub) => sub.fields) ?? []),
          ]);
          const isComplete = progress.total > 0 && progress.completed === progress.total;

          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => handleSelect(section.id)}
                className={`w-full flex items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors border-l-2 ${
                  activeId === section.id
                    ? 'border-accent text-accent bg-accent-muted/10'
                    : 'border-transparent text-text-muted hover:text-foreground'
                }`}
              >
                <span>{t(section.titleKey)}</span>
                <span className={`text-xs shrink-0 ${isComplete ? 'text-accent' : 'text-text-muted'}`}>
                  {isComplete ? '✓' : `${progress.completed}/${progress.total}`}
                </span>
              </button>

              {section.subsections && (
                <ul className="mt-1 space-y-1">
                  {section.subsections.map((sub) => {
                    const subProgress = countProgress(values, sub.fields);
                    const subComplete = subProgress.completed === subProgress.total;

                    return (
                      <li key={sub.id}>
                        <button
                          type="button"
                          onClick={() => handleSelect(sub.id)}
                          className={`w-full flex items-center justify-between gap-2 rounded-md pl-10 pr-3 py-1.5 text-left text-sm transition-colors border-l-2 ${
                            activeId === sub.id
                              ? 'border-accent text-accent bg-accent-muted/10'
                              : 'border-transparent text-text-muted hover:text-foreground'
                          }`}
                        >
                          <span>{t(sub.headingKey)}</span>
                          <span
                            className={`text-xs shrink-0 ${subComplete ? 'text-accent' : 'text-text-muted'}`}
                          >
                            {subComplete ? '✓' : `${subProgress.completed}/${subProgress.total}`}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      <aside className="hidden md:block md:w-64 md:shrink-0 md:sticky md:top-8 md:max-h-[calc(100vh-4rem)] md:overflow-y-auto">
        {navList}
      </aside>

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label={t('sidebar.toggleLabel')}
        className="md:hidden cursor-pointer fixed bottom-6 left-6 z-50 rounded-full bg-surface border border-accent-muted p-3 shadow-lg text-foreground"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <button
            type="button"
            aria-label={t('sidebar.closeLabel')}
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/60 cursor-pointer"
          />
          <div className="relative w-72 max-w-[80vw] h-full bg-surface border-r border-accent-muted p-6 overflow-y-auto">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label={t('sidebar.closeLabel')}
              className="cursor-pointer mb-4 text-text-muted hover:text-foreground"
            >
              ✕
            </button>
            {navList}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
