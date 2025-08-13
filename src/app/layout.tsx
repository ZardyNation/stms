import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Sparkles from '@/components/Sparkles';

export const metadata: Metadata = {
  title: 'Impact Awards 2025 | Honor, Inspire, Celebrate',
  description: 'Join us for The Impact Awards 2025, a night to honor, inspire, and celebrate the change-makers in our community. Nominate, vote, and get tickets now!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <Sparkles />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
