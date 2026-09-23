import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "TATİL'ER · Küresel Fiyat Arbitrajı & Seyahat Portalı",
  description:
    'Yurt dışı teknoloji ve lüks alışveriş tasarrufunuzla uçak ve tatilinizi 0 ₺ bedavaya getirin. Canlı Google Flights biletleri, gümrük kuralları ve tax-free vergi iadesi.',
  keywords: [
    'tatil',
    'tatiler',
    'tatilimi bedavaya getir',
    'travel arbitrage',
    'tax free shopping',
    'turkey imei registration fee',
    'cross border shopping',
    'google flights',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Marcellus&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#03050a] text-slate-100 antialiased min-h-screen selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
