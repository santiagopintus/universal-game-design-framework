import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UniversalGameDesignFramework from '@/components/Form';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  await params;

  return (
    <div>
      <Header />
      <UniversalGameDesignFramework />
      <Footer />
    </div>
  );
}
