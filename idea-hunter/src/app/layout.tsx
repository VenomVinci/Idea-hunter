import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Idea Hunter — AI-Powered Validation for Startup Ideas',
  description:
    'Idea Hunter helps founders de-risk their startup ideas with AI-powered deep market research, competitor intelligence, trend tracking, and actionable insights.',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    title: 'Idea Hunter',
    description:
      'De-risk your startup idea with AI-powered market validation. See risks, saturation, and opportunities before you build.',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Idea Hunter',
    description:
      'De-risk your startup idea with AI-powered market validation. See risks, saturation, and opportunities before you build.'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-[var(--bg)]">
      <body className={`${inter.className} antialiased`}>        
        <Navbar />
        <main className="container-app py-8 sm:py-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}