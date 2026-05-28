'use client'

import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import BalanceCard from './components/BalanceCard'
import QuickActions from './components/QuickActions'
import AuthGuard from './components/AuthGuard'

type Transaction = {
  id: string
  name: string
  amount: number
  category: string
  date: string
  type: string
}

type User = {
  full_name?: string
  email?: string
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user.user_metadata)
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (!error && data) {
      setTransactions(data)
      const total = data
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      setTotalExpenses(total)
    }

    setLoading(false)
  }

  function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const firstName = user?.full_name?.split(' ')[0] || 'there'

  return (
    <AuthGuard>
      <div style={{ minHeight: '100vh', backgroundColor: '#faf7f2', padding: '1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{getGreeting()} 👋</p>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1a1a' }}>{firstName}</h1>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#007b6e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700' }}>
            {firstName[0].toUpperCase()}
          </div>
        </div>

        <BalanceCard totalExpenses={totalExpenses} />
        <QuickActions />

        {/* Recent Transactions */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: '600', color: '#1a1a1a' }}>Recent Transactions</h3>
            <a href="/expenses" style={{ fontSize: '0.8rem', color: '#007b6e', fontWeight: '500', textDecoration: 'none' }}>See all</a>
          </div>

          {loading && (
            <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>Loading...</p>
          )}

          {!loading && transactions.length === 0 && (
            <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>No transactions yet. Add your first expense!</p>
          )}

          {transactions.map((tx, i) => (
            <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.9rem', marginBottom: '0.9rem', borderBottom: i < transactions.length - 1 ? '1px solid #f0ebe1' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '0.6rem', backgroundColor: '#f0ebe1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                  {tx.category === 'Food' ? '🍛' : tx.category === 'Data' ? '📶' : tx.category === 'Income' ? '💰' : tx.category === 'School' ? '📚' : tx.category === 'Clothing' ? '👕' : '🚌'}
                </div>
                <div>
                  <p style={{ fontWeight: '500', fontSize: '0.875rem', color: '#1a1a1a' }}>{tx.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{tx.category} · {tx.date}</p>
                </div>
              </div>
              <p style={{ fontWeight: '600', color: tx.type === 'income' ? '#007b6e' : '#e63946' }}>
                {tx.type === 'income' ? '+' : '-'}₦{tx.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

      </div>
    </AuthGuard>
  )
}