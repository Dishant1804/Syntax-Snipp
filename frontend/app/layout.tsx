'use client'

import { Space_Mono } from "next/font/google";
import { Provider } from 'react-redux';
import { store } from '../app/store/store';
import AuthCheck from '@/helpers/AuthCheck';
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceMono.variable} antialiased`}
      >
        <Provider store={store}>
          {/* <AuthCheck> */}
            {children}
            <Toaster />
          {/* </AuthCheck> */}
        </Provider>
      </body>
    </html>
  );
}