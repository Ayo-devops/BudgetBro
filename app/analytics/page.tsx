'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import AuthGuard from '../components/AuthGuard'

const weeklyData = [
  { day: 'Mon', amount: 3200 },
  { day: 'Tue', amount: 1500 },
  { day: 'Wed', amount: 4800 },
  { day: 'Thu', amount: 2100 },
  { day: 'Fri', amount: 5600 },
  { day: 'Sat', amount: 3900 },
  { day: 'Sun', amount: 1200 },
]

const categoryData = [
  { name: 'Food', value: 8500, color: '#007b6e' },
  { name: 'Transport', value: 6200, color: '#f4a261' },
  { name: 'Data', value: 1500, color: '#4361ee' },
  { name: 'School', value: 2000, color: '#7209b7' },
  { name: 'Clothing', value: 0, color: '#e63946' },
  { name: 'Misc', value: 1200, color: '#6b7280' },
]

const totalSpent = categoryData.reduce((sum, c) => sum + c.value, 0)
const topCategory = [...categoryData].sort((a, b) => b.value - a.value)[0]
const dailyAverage = Math.round(weeklyData.reduce((sum, d) => sum + d.amount, 0) / 7)

export default function AnalyticsPage() {
  return (
    <AuthGuard>
    <div style={{ minHeight: '100vh', backgroundColor: '#faf7f2', padding: '1.5rem' }}>

      {/* Header */}
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '1.5rem' }}>Analytics</h1>

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
          <p style={{ fontSize: '1rem', fontWeight: '700', color: '#007b6e' }}>{topCategory.name}</p>
        </div>
      </div>

      {/* Weekly Spending Chart */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1.2rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>This Week</h3>
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
      </div>

      {/* Category Breakdown */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>By Category</h3>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <PieChart width={200} height={200}>
            <Pie data={categoryData.filter(c => c.value > 0)} cx={100} cy={100} innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3}>
              {categoryData.filter(c => c.value > 0).map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip  formatter={(value: unknown) => [`₦${Number(value).toLocaleString()}`, '']} contentStyle={{ borderRadius: '8px', border: '1px solid #f0ebe1', fontSize: '0.8rem' }} />
          </PieChart>
        </div>

        {categoryData.filter(c => c.value > 0).map((cat) => (
          <div key={cat.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: cat.color }} />
              <span style={{ fontSize: '0.875rem', color: '#1a1a1a' }}>{cat.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '80px', backgroundColor: '#f0ebe1', borderRadius: '999px', height: '5px' }}>
                <div style={{ width: `${Math.round((cat.value / totalSpent) * 100)}%`, backgroundColor: cat.color, borderRadius: '999px', height: '5px' }} />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#1a1a1a', minWidth: '60px', textAlign: 'right' }}>₦{cat.value.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

    </div></AuthGuard>
  )
}