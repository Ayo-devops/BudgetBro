'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import AuthGuard from '../components/AuthGuard'

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#007b6e',
  Transport: '#f4a261',
  Data: '#4361ee',
  School: '#7209b7',
  Clothing: '#e63946',
  Miscellaneous: '#6b7280',
}

type Transaction = {
  amount: number
  category: string
  date: string
  type: string
}

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('type', 'expense')
      .order('date', { ascending: true })

    if (!error && data) setTransactions(data)
    setLoading(false)
  }

  // Weekly data — last 7 days
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toISOString().split('T')[0]
    const day = date.toLocaleDateString('en', { weekday: 'short' })
    const amount = transactions
      .filter((t) => t.date === dateStr)
      .reduce((sum, t) => sum + t.amount, 0)
    return { day, amount }
  })

  // Category breakdown
  const categoryMap: Record<string, number> = {}
  transactions.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount
  })
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] || '#6b7280',
  }))

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0)
  const topCategory = categoryData.sort((a, b) => b.value - a.value)[0]
  const dailyAverage = weeklyData.length > 0
    ? Math.round(weeklyData.reduce((sum, d) => sum + d.amount, 0) / 7)
    : 0

  return (
    <AuthGuard>
      <div style={{ minHeight: '100vh', backgroundColor: '#faf7f2', padding: '1.5rem' }}>

        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '1.5rem' }}>Analytics</h1>

        {loading && (
          <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>Loading...</p>
        )}

        {!loading && (
          <>
            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '0.3rem' }}>Total Spent</p>
                <p style={{ fontSize: '1rem', fontWeight: '700', color: '#1a1a1a' }}>₦{totalSpent.toLocaleString()}</p>
              </div>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '0.3rem' }}>Daily Avg</p>
                <p style={{ fontSize: '1rem', fontWeight: '700', color: '#1a1a1a' }}>₦{dailyAverage.toLocaleString()}</p>
              </div>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '0.3rem' }}>Top Category</p>
                <p style={{ fontSize: '1rem', fontWeight: '700', color: '#007b6e' }}>{topCategory?.name || '—'}</p>
              </div>
            </div>

            {/* Weekly Chart */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1.2rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>Last 7 Days</h3>
              {weeklyData.every(d => d.amount === 0) ? (
                <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>No expenses in the last 7 days.</p>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={weeklyData} barSize={28}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis hide />
                    <Tooltip
                      formatter={(value: unknown) => [`₦${Number(value).toLocaleString()}`, 'Spent']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #f0ebe1', fontSize: '0.8rem' }}
                    />
                    <Bar dataKey="amount" fill="#007b6e" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Category Breakdown */}
            {categoryData.length > 0 && (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>By Category</h3>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <PieChart width={200} height={200}>
                    <Pie data={categoryData} cx={100} cy={100} innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3}>
                      {categoryData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: unknown) => [`₦${Number(value).toLocaleString()}`, '']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #f0ebe1', fontSize: '0.8rem' }}
                    />
                  </PieChart>
                </div>
                {categoryData.map((cat) => (
                  <div key={cat.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: cat.color }} />
                      <span style={{ fontSize: '0.875rem', color: '#1a1a1a' }}>{cat.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '80px', backgroundColor: '#f0ebe1', borderRadius: '999px', height: '5px' }}>
                        <div style={{ width: `${totalSpent > 0 ? Math.round((cat.value / totalSpent) * 100) : 0}%`, backgroundColor: cat.color, borderRadius: '999px', height: '5px' }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#1a1a1a', minWidth: '70px', textAlign: 'right' }}>₦{cat.value.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {categoryData.length === 0 && (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '2rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No expense data yet. Start adding expenses to see your analytics.</p>
              </div>
            )}
          </>
        )}

      </div>
    </AuthGuard>
  )
}