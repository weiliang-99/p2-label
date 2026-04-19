import type { Metadata } from 'next'
import { Bebas_Neue, Space_Mono, Syne } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/sidebar'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})
const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
})
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'P2 Label — Business Hub',
  description: 'All-in-one marketing, sales & customer service platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${spaceMono.variable} ${syne.variable}`}>
      <body className="h-screen flex overflow-hidden" style={{ background: '#0a0a0a' }}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto scrollbar-thin" style={{ marginLeft: '56px' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
