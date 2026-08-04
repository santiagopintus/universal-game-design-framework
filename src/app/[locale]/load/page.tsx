import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadScreen from '@/components/LoadScreen';
import { Locales } from '@/i18n/request';

export default async function LoadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locales);

  return (
    <div>
      <Header />
      <LoadScreen />
      <Footer />
    </div>
  );
}
