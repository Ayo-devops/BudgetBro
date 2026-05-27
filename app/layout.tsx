import type { Metadata } from 'next'
import './globals.css'
import BottomNav from './components/BottomNav'

export const metadata: Metadata = {
  title: 'BudgetBro',
  description: 'A financial survival system for students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ paddingBottom: '5rem' }}>
        {children}
        <BottomNav />
      </body>
    </html>
  )
}