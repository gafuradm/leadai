// app/layout.tsx
"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Используем usePathname из next/navigation
import { initGA, logPageView } from '@/lib/analytics';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './provider';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();

  useEffect(() => {
    initGA(); // Инициализация Google Analytics
    logPageView(); // Логирование просмотра страницы при первой загрузке
  }, []);

  useEffect(() => {
    logPageView(); // Логирование просмотра страницы при изменении маршрута
  }, [pathname]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.png" sizes="any" />
        <title>LeadAI - Your AI assistant for IELTS preparation</title>
        <meta name="keywords" content="ielts, prep, preparation, hack, pass, exam, test, ai, hsk, smart, immigration, usa, china, eu, gre, sat, toefl, programming, code, migration, ент, егэ 高考，gaokao, bachelor, undergraduate, university, college"></meta>
        <meta name="description" content="Unleash the potential of AI in IELTS, learn to correctly pass the listening, reading, writing and speaking sections, receive accurate assessments and recommendations from our AI" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
