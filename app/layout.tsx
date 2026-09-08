import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'ConstellationBar — Your desktop, connected.', description: 'A native macOS workspace and status bar. Explore three layouts, five appearances, and interactive widgets. Download the signed and notarized public alpha.' };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {return <html lang="en"><body>{children}</body></html>;}
