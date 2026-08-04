import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UniversalGameDesignFramework from '@/components/Form';
import { Locales } from '@/i18n/request';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locales);

  return (
    <div>
      <Header />
      <UniversalGameDesignFramework />
      <Footer />
    </div>
  );
}
