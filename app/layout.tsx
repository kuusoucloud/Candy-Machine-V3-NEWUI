import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'KUUSOU Mint',
  description: 'Mint KUUSOU NFTs on Solana',
  themeColor: '#FF6FB5',
  openGraph: { title: 'KUUSOU Mint' }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
