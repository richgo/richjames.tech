import type { Metadata, Viewport } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import MotionProvider from "@/components/MotionProvider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://richjames.tech'),
  title: "Rich James | Tech",
  description: "AI, architecture and engineering in practice. Field notes, experiments and occasional opinions from Rich James, Chief Engineer.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/img/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/img/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/img/favicon.png',
  },
  openGraph: {
    type: 'website',
    title: 'Rich James | Tech',
    url: 'https://richjames.tech',
    images: ['/img/og-image.jpeg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#10151c',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body>
        <MotionProvider>
          <a className="skip-link" href="#main-content">Skip to content</a>
          <Navbar />
          <PageTransition>{children}</PageTransition>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
