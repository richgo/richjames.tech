import type { Metadata, Viewport } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://richjames.tech'),
  title: "Rich James | Tech",
  description: "Rich James - Technology Blog and Portfolio",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/img/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/img/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/img/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    title: 'Rich James | Tech',
    url: 'https://richjames.tech',
    images: ['/img/og-image.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  );
}
