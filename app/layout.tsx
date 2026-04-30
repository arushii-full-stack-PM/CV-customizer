import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from "@/components/providers"
import Navbar from "@/components/navbar"
import { SiteFooter } from "@/components/site-footer"
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}>
        <Providers>
          <Navbar />
          {/* REMOVED: min-h-screen and flex-grow wrapper */}
          <main>
            {children}
          </main>
          <SiteFooter />
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
