import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DÉCLIC - Trouve ta vraie voie',
  description: '4 tests scientifiques + 500 métiers + KLIC ton coach IA perso',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
