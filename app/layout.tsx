import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'ConstellationBar — A native Mac workspace & status bar', description: 'A native Mac bar for workspaces, music, calendar and system widgets. Explore Native and Typeset themes, three layouts and settings for each display. Download the signed public alpha.' };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {return <html lang="en"><body>{children}</body></html>;}
