import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import CosmicBadge from '@/components/CosmicBadge';

export const metadata: Metadata = {
  title: 'Shared Thoughts — 10,000 Pixel Collaborative Billboard',
  description:
    'A collaborative art experience where 10,000 people each design one pixel to create a shared masterpiece.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string;

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎨</text></svg>"
        />
        <script src="/dashboard-console-capture.js" />
      </head>
      <body className="min-h-screen bg-canvas-950 text-gray-100 font-sans antialiased">
        <Header />
        <main>{children}</main>
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  );
}