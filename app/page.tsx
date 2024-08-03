import Image from 'next/image';
import ToothFairyRatesForm from './components/ToothFairyRatesForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <section className="w-full max-w-4xl px-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Tooth Fairy Rates</h1>
        <ToothFairyRatesForm />
      </section>
    </main>
  );
}
