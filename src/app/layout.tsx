import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import BottomNavBar from '@/components/layout/BottomNavBar'; // Import the new component

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Box Cricket Booker',
  description: 'Book your next box cricket game easily.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased pb-16`}> {/* Add padding-bottom */}
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>
          <BottomNavBar /> {/* Add the bottom navigation bar */}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
