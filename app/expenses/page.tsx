'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AuthGuard from '../components/AuthGuard'

const categories = ['Food', 'Transport', 'Data', 'School', 'Clothing', 'Miscellaneous']

function getCategoryEmoji(category: string) {
  const map: Record<string, string> = {
    Food: '🍛', Transport: '🚌', Data: '📶',
    School: '📚', Clothing: '👕', Miscellaneous: '📦',
  }
  return map[category] || '📦'
}

type Transaction = {
  id: string
  name: string
  amount: number
  category: string
  date: string
}

export default function ExpensesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, amount: number, category: string } | null>(null)

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setTransactions(data)
    setLoading(false)
  }

  async function handleAdd() {
    if (!name || !amount) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()
    const expenseAmount = parseFloat(amount)

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        name,
        amount: expenseAmount,
        category,
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single()

    if (!error && data) {
      setTransactions([data, ...transactions])

      const { data: budgetData } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .eq('category', category)
        .eq('month', currentMonth)
        .eq('year', currentYear)
        .single()

      if (budgetData) {
        await supabase
          .from('budgets')
          .update({ spent: budgetData.spent + expenseAmount })
          .eq('id', budgetData.id)
      }

      setName('')
      setAmount('')
      setCategory('Food')
      setShowForm(false)
    }
  }

  function confirmDelete(id: string, amount: number, category: string) {
    setDeleteTarget({ id, amount, category })
  }

  async function handleDelete() {
    if (!deleteTarget) return
   

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', deleteTarget.id)

    if (!error) {
  setDeleteTarget(null)
  setTransactions(transactions.filter((t) => t.id !== deleteTarget.id))
  // ... rest of budget update code

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const currentMonth = new Date().getMonth() + 1
      const currentYear = new Date().getFullYear()

      const { data: budgetData } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .eq('category', deleteTarget.category)
        .eq('month', currentMonth)
        .eq('year', currentYear)
        .single()

      if (budgetData) {
        await supabase
          .from('budgets')
          .update({ spent: Math.max(0, budgetData.spent - deleteTarget.amount) })
          .eq('id', budgetData.id)
      }

      setDeleteTarget(null)
    }
  }

  return (
    <AuthGuard>
      <div style={{ backgroundColor: '#faf7f2', padding: '1.5rem', paddingBottom: '6rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1a1a' }}>Expenses</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ backgroundColor: '#007b6e', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.5rem 1rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' }}>
            {showForm ? 'Cancel' : '+ Add'}
          </button>
        </div>

        {/* Add Expense Form */}
        {showForm && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1.2rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#1a1a1a' }}>New Expense</h3>

            <input
              type="text"
              placeholder="What did you spend on?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.6rem', border: '1px solid #f0ebe1', marginBottom: '0.75rem', fontSize: '0.875rem', backgroundColor: '#faf7f2', color: '#1a1a1a', boxSizing: 'border-box' }}
            />

            <input
              type="number"
              placeholder="Amount (₦)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.6rem', border: '1px solid #f0ebe1', marginBottom: '0.75rem', fontSize: '0.875rem', backgroundColor: '#faf7f2', color: '#1a1a1a', boxSizing: 'border-box' }}
            />

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: '0.4rem 0.8rem', borderRadius: '999px', border: '1px solid',
                    borderColor: category === cat ? '#007b6e' : '#f0ebe1',
                    backgroundColor: category === cat ? '#e6f4f2' : '#ffffff',
                    color: category === cat ? '#007b6e' : '#6b7280',
                    fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer',
                  }}>
                  {getCategoryEmoji(cat)} {cat}
                </button>
              ))}
            </div>

            <button
              onClick={handleAdd}
              style={{ width: '100%', backgroundColor: '#007b6e', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' }}>
              Save Expense
            </button>
          </div>
        )}

        {/* Transactions List */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>All Transactions</h3>

          {loading && (
            <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>Loading...</p>
          )}

          {!loading && transactions.length === 0 && (
            <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>No expenses yet. Add your first one!</p>
          )}

          {transactions.map((tx, i) => (
            <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.9rem', marginBottom: '0.9rem', borderBottom: i < transactions.length - 1 ? '1px solid #f0ebe1' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '0.6rem', backgroundColor: '#f0ebe1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                  {getCategoryEmoji(tx.category)}
                </div>
                <div>
                  <p style={{ fontWeight: '500', fontSize: '0.875rem', color: '#1a1a1a' }}>{tx.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{tx.category} · {tx.date}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <p style={{ fontWeight: '600', color: '#e63946' }}>-₦{tx.amount.toLocaleString()}</p>
                <button
                  onClick={() => confirmDelete(tx.id, tx.amount, tx.category)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '1rem', padding: '0.2rem', lineHeight: 1 }}>
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '1.5rem', padding: '1.5rem', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ fontWeight: '700', color: '#1a1a1a', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Delete expense?</h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>This will permanently remove this transaction and update your budget.</p>
            <button
              onClick={handleDelete}
              style={{ width: '100%', backgroundColor: '#e63946', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.85rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', marginBottom: '0.75rem' }}>
              Yes, delete
            </button>
            <button
              onClick={() => setDeleteTarget(null)}
              style={{ width: '100%', backgroundColor: '#f0ebe1', color: '#1a1a1a', border: 'none', borderRadius: '0.75rem', padding: '0.85rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </AuthGuard>
  )
}