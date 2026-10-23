import type { Metadata } from 'next';
import './globals.css';
import ScrollToTop from '@/components/ScrollToTop';

export const metadata: Metadata = {
  title: 'Lascigal Convention Centre | Kalampoor, Muvattupuzha',
  description:
    'Lascigal Convention Centre offers spacious air-conditioned halls, modern audio-visual amenities, dedicated dining, and ample car parking for weddings, corporate summits, and celebrations.',
  icons: {
    icon: '/images/favicons.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-US" className="scheme_original">
      <head>
        <link
          rel="preconnect"
          href={process.env.NEXT_PUBLIC_MEDIA_BASE || 'https://pub-fc1ea4fa629e4540a5972566a72a858c.r2.dev'}
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body className="home page body_filled scheme_original">
        <div className="body_wrap">
          <div className="page_wrap">
            {children}
            <ScrollToTop />
          </div>
        </div>
      </body>
    </html>
  );
}
