import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SAYO Beauty — Professional Beauty Services',
  description: 'Providing expert skin care advice & beauty services using natural products to cater for any skin.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}