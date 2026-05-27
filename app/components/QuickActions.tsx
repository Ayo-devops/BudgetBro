'use client'

import { useRouter } from 'next/navigation'

const actions = [
  { label: 'Add', icon: '+', path: '/expenses' },
  { label: 'Budget', icon: '₦', path: '/budget' },
  { label: 'Debts', icon: '↔', path: '/debts' },
  { label: 'Stats', icon: '↑', path: '/analytics' },
]

export default function QuickActions() {
  const router = useRouter()

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
      {actions.map((action) => (
        <div
          key={action.label}
          onClick={() => router.push(action.path)}
          style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1rem 0.5rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: 'pointer' }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>{action.icon}</div>
          <p style={{ fontSize: '0.75rem', color: '#1a1a1a', fontWeight: '500' }}>{action.label}</p>
        </div>
      ))}
    </div>
  )
}