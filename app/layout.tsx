import type { Metadata } from 'next';
import { Bebas_Neue, Work_Sans } from 'next/font/google';
import { SITE } from '../lib/site';
import summary from '../lib/spotify-summary.json';
import './globals.css';

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas'
});

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  variable: '--font-work'
});

const description =
  `Software engineer building interfaces for dense technical data: a real-data UMAP/t-SNE map of ${summary.count.toLocaleString('en-US')} songs and an evidence-first research atlas.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.name} | Software Engineer`,
  description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: SITE.name,
    title: `${SITE.name} | Software Engineer`,
    description
  },
  twitter: { card: 'summary_large_image', title: `${SITE.name} | Software Engineer`, description }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bebas.variable} ${workSans.variable}`}>{children}</body>
    </html>
  );
}
