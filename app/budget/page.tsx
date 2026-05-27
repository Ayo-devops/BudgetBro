'use client'

import { useState } from 'react'

const categories = ['Food', 'Transport', 'Data', 'School', 'Clothing', 'Miscellaneous']

const initialBudgets = [
  { category: 'Food', limit: 15000, spent: 8500 },
  { category: 'Transport', limit: 8000, spent: 6200 },
  { category: 'Data', limit: 3000, spent: 1500 },
  { category: 'School', limit: 10000, spent: 2000 },
  { category: 'Clothing', limit: 5000, spent: 0 },
  { category: 'Miscellaneous', limit: 4000, spent: 1200 },
]

function getCategoryEmoji(category: string) {
  const map: Record<string, string> = {
    Food: '🍛', Transport: '🚌', Data: '📶',
    School: '📚', Clothing: '👕', Miscellaneous: '📦',
  }
  return map[category] || '📦'
}

function getProgressColor(percent: number) {
  if (percent >= 90) return '#e63946'
  if (percent >= 70) return '#f4a261'
  return '#007b6e'
}

export default function BudgetPage() {
  const [budgets, setBudgets] = useState(initialBudgets)
  const [showForm, setShowForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Food')
  const [limitAmount, setLimitAmount] = useState('')

  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const totalPercent = Math.round((totalSpent / totalLimit) * 100)

  function handleSave() {
    if (!limitAmount) return
    setBudgets(budgets.map((b) =>
      b.category === selectedCategory
        ? { ...b, limit: parseFloat(limitAmount) }
        : b
    ))
    setLimitAmount('')
    setShowForm(false)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#faf7f2', padding: '1.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1a1a' }}>Budget</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ backgroundColor: '#007b6e', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.5rem 1rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' }}>
          {showForm ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* Overall Budget Card */}
      <div style={{ backgroundColor: '#007b6e', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', color: 'white' }}>
        <p style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '0.3rem' }}>Monthly Budget</p>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.3rem' }}>₦{totalSpent.toLocaleString()} <span style={{ fontSize: '1rem', opacity: 0.7 }}>/ ₦{totalLimit.toLocaleString()}</span></h2>
        <p style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.75rem' }}>{totalPercent}% of budget used</p>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '999px', height: '8px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '999px', height: '8px', width: `${Math.min(totalPercent, 100)}%`, transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* Edit Budget Form */}
      {showForm && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1.2rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#1a1a1a' }}>Set Budget Limit</h3>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '999px',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? '#007b6e' : '#f0ebe1',
                  backgroundColor: selectedCategory === cat ? '#e6f4f2' : '#ffffff',
                  color: selectedCategory === cat ? '#007b6e' : '#6b7280',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}>
                {getCategoryEmoji(cat)} {cat}
              </button>
            ))}
          </div>

          <input
            type="number"
            placeholder="Budget limit (₦)"
            value={limitAmount}
            onChange={(e) => setLimitAmount(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.6rem', border: '1px solid #f0ebe1', marginBottom: '0.75rem', fontSize: '0.875rem', backgroundColor: '#faf7f2', color: '#1a1a1a', boxSizing: 'border-box' }}
          />

          <button
            onClick={handleSave}
            style={{ width: '100%', backgroundColor: '#007b6e', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' }}>
            Save Limit
          </button>
        </div>
      )}

      {/* Category Budgets */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>By Category</h3>
        {budgets.map((b, i) => {
          const percent = Math.round((b.spent / b.limit) * 100)
          const color = getProgressColor(percent)
          return (
            <div key={b.category} style={{ marginBottom: i < budgets.length - 1 ? '1.2rem' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{getCategoryEmoji(b.category)}</span>
                  <span style={{ fontWeight: '500', fontSize: '0.875rem', color: '#1a1a1a' }}>{b.category}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color }}>{percent}%</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: '0.4rem' }}>₦{b.spent.toLocaleString()} / ₦{b.limit.toLocaleString()}</span>
                </div>
              </div>
              <div style={{ backgroundColor: '#f0ebe1', borderRadius: '999px', height: '6px' }}>
                <div style={{ backgroundColor: color, borderRadius: '999px', height: '6px', width: `${Math.min(percent, 100)}%`, transition: 'width 0.3s ease' }} />
              </div>
              {percent >= 90 && (
                <p style={{ fontSize: '0.7rem', color: '#e63946', marginTop: '0.3rem' }}>⚠️ Almost at limit</p>
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}