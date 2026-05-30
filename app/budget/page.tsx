'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AuthGuard from '../components/AuthGuard'
import { SkeletonCard } from '../components/Skeleton'

const categories = ['Food', 'Transport', 'Data', 'School', 'Clothing', 'Miscellaneous']

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

type Budget = {
  id: string
  category: string
  monthly_limit: number
  spent: number
}

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Food')
  const [limitAmount, setLimitAmount] = useState('')
  const [loading, setLoading] = useState(true)

  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    fetchBudgets()
  }, [])

  async function fetchBudgets() {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('month', currentMonth)
      .eq('year', currentYear)

    if (!error && data) setBudgets(data)
    setLoading(false)
  }

  async function handleSave() {
    if (!limitAmount) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const existing = budgets.find((b) => b.category === selectedCategory)

    if (existing) {
      const { data, error } = await supabase
        .from('budgets')
        .update({ monthly_limit: parseFloat(limitAmount) })
        .eq('id', existing.id)
        .select()
        .single()

      if (!error && data) {
        setBudgets(budgets.map((b) => b.id === existing.id ? data : b))
      }
    } else {
      const { data, error } = await supabase
        .from('budgets')
        .insert({
          user_id: user.id,
          category: selectedCategory,
          monthly_limit: parseFloat(limitAmount),
          spent: 0,
          month: currentMonth,
          year: currentYear,
        })
        .select()
        .single()

      if (!error && data) {
        setBudgets([...budgets, data])
      }
    }

    setLimitAmount('')
    setShowForm(false)
  }

  const totalLimit = budgets.reduce((sum, b) => sum + b.monthly_limit, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const totalPercent = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0

  return (
    <AuthGuard>
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
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.3rem' }}>
          ₦{totalSpent.toLocaleString()} <span style={{ fontSize: '1rem', opacity: 0.7 }}>/ ₦{totalLimit.toLocaleString()}</span>
        </h2>
        <p style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.75rem' }}>{totalPercent}% of budget used</p>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '999px', height: '8px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '999px', height: '8px', width: `${Math.min(totalPercent, 100)}%`, transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* Edit Form */}
      {showForm && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1.2rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#1a1a1a' }}>Set Budget Limit</h3>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.4rem 0.8rem', borderRadius: '999px', border: '1px solid',
                  borderColor: selectedCategory === cat ? '#007b6e' : '#f0ebe1',
                  backgroundColor: selectedCategory === cat ? '#e6f4f2' : '#ffffff',
                  color: selectedCategory === cat ? '#007b6e' : '#6b7280',
                  fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer',
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

       {loading && (
  <>
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </>
)}

        {!loading && budgets.length === 0 && (
          <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>No budgets set yet. Hit Edit to add one!</p>
        )}

        {budgets.map((b, i) => {
          const percent = b.monthly_limit > 0 ? Math.round((b.spent / b.monthly_limit) * 100) : 0
          const color = getProgressColor(percent)
          return (
            <div key={b.id} style={{ marginBottom: i < budgets.length - 1 ? '1.2rem' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{getCategoryEmoji(b.category)}</span>
                  <span style={{ fontWeight: '500', fontSize: '0.875rem', color: '#1a1a1a' }}>{b.category}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color }}>{percent}%</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: '0.4rem' }}>₦{b.spent.toLocaleString()} / ₦{b.monthly_limit.toLocaleString()}</span>
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

    </div></AuthGuard>
  )
}