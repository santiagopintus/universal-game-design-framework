import { getTranslations } from 'next-intl/server';

export default async function Footer() {
  const t = await getTranslations('footer');

  return (
    <footer className="bg-surface border-t border-accent-muted px-4 py-6 text-center text-sm text-text-muted">
      © {new Date().getFullYear()} {t('name')}. {t('rights')}
    </footer>
  );
}
