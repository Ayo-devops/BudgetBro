'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Home', path: '/', icon: '⊞' },
  { label: 'Expenses', path: '/expenses', icon: '₦' },
  { label: 'Budget', path: '/budget', icon: '◎' },
  { label: 'Debts', path: '/debts', icon: '↔' },
  { label: 'Analytics', path: '/analytics', icon: '↑' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#ffffff',
      borderTop: '1px solid #f0ebe1',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '0.75rem 0 1rem',
      zIndex: 100,
    }}>
      {navItems.map((item) => {
        const isActive = pathname === item.path
        return (
          <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
              <div style={{
                fontSize: '1.2rem',
                color: isActive ? '#007b6e' : '#6b7280',
                fontWeight: isActive ? '700' : '400',
              }}>
                {item.icon}
              </div>
              <p style={{
                fontSize: '0.65rem',
                color: isActive ? '#007b6e' : '#6b7280',
                fontWeight: isActive ? '600' : '400',
              }}>
                {item.label}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}