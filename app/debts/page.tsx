'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AuthGuard from '../components/AuthGuard'
type Debt = {
  id: string
  contact_name: string
  amount: number
  direction: 'owed_to_me' | 'i_owe'
  due_date: string
  status: string
}

export default function DebtsPage() {
  const [debts, setDebts] = useState<Debt[]>([])
  const [showForm, setShowForm] = useState(false)
  const [direction, setDirection] = useState<'owed_to_me' | 'i_owe'>('owed_to_me')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [due, setDue] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDebts()
  }, [])

  async function fetchDebts() {
    const { data, error } = await supabase
      .from('debts')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setDebts(data)
    setLoading(false)
  }

  async function handleAdd() {
    if (!name || !amount) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('debts')
      .insert({
        user_id: user.id,
        contact_name: name,
        amount: parseFloat(amount),
        direction,
        due_date: due || null,
        status: 'pending',
      })
      .select()
      .single()

    if (!error && data) {
      setDebts([data, ...debts])
      setName('')
      setAmount('')
      setDue('')
      setShowForm(false)
    }
  }

  async function handleSettle(id: string) {
    const { error } = await supabase
      .from('debts')
      .update({ status: 'settled' })
      .eq('id', id)

    if (!error) {
      setDebts(debts.map((d) => d.id === id ? { ...d, status: 'settled' } : d))
    }
  }

  const owedToMe = debts.filter((d) => d.direction === 'owed_to_me' && d.status === 'pending')
  const iOwe = debts.filter((d) => d.direction === 'i_owe' && d.status === 'pending')
  const totalOwedToMe = owedToMe.reduce((sum, d) => sum + d.amount, 0)
  const totalIOwe = iOwe.reduce((sum, d) => sum + d.amount, 0)

  return (
    <AuthGuard>
    <div style={{ minHeight: '100vh', backgroundColor: '#faf7f2', padding: '1.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1a1a' }}>Debts</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ backgroundColor: '#007b6e', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.5rem 1rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' }}>
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: '#e6f4f2', borderRadius: '1rem', padding: '1rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#007b6e', fontWeight: '500', marginBottom: '0.3rem' }}>They owe me</p>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#007b6e' }}>₦{totalOwedToMe.toLocaleString()}</h3>
          <p style={{ fontSize: '0.7rem', color: '#007b6e', opacity: 0.7 }}>{owedToMe.length} pending</p>
        </div>
        <div style={{ backgroundColor: '#fdecea', borderRadius: '1rem', padding: '1rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#e63946', fontWeight: '500', marginBottom: '0.3rem' }}>I owe</p>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#e63946' }}>₦{totalIOwe.toLocaleString()}</h3>
          <p style={{ fontSize: '0.7rem', color: '#e63946', opacity: 0.7 }}>{iOwe.length} pending</p>
        </div>
      </div>

      {/* Add Debt Form */}
      {showForm && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1.2rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#1a1a1a' }}>New Debt</h3>

          <div style={{ display: 'flex', backgroundColor: '#f0ebe1', borderRadius: '0.75rem', padding: '0.25rem', marginBottom: '0.75rem' }}>
            {(['owed_to_me', 'i_owe'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDirection(d)}
                style={{
                  flex: 1, padding: '0.5rem', border: 'none', borderRadius: '0.6rem', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem',
                  backgroundColor: direction === d ? '#ffffff' : 'transparent',
                  color: direction === d ? '#1a1a1a' : '#6b7280',
                  boxShadow: direction === d ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}>
                {d === 'owed_to_me' ? '💰 They owe me' : '😬 I owe'}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Person's name"
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

          <input
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.6rem', border: '1px solid #f0ebe1', marginBottom: '0.75rem', fontSize: '0.875rem', backgroundColor: '#faf7f2', color: '#1a1a1a', boxSizing: 'border-box' }}
          />

          <button
            onClick={handleAdd}
            style={{ width: '100%', backgroundColor: '#007b6e', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' }}>
            Save Debt
          </button>
        </div>
      )}

      {/* They Owe Me */}
      {loading && (
        <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>Loading...</p>
      )}

      {!loading && owedToMe.length > 0 && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1.2rem', marginBottom: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>💰 They owe me</h3>
          {owedToMe.map((d, i) => (
            <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.9rem', marginBottom: '0.9rem', borderBottom: i < owedToMe.length - 1 ? '1px solid #f0ebe1' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#e6f4f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#007b6e', fontSize: '0.875rem' }}>
                  {d.contact_name[0].toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: '500', fontSize: '0.875rem', color: '#1a1a1a' }}>{d.contact_name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Due {d.due_date || 'no date'}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: '600', color: '#007b6e', marginBottom: '0.3rem' }}>₦{d.amount.toLocaleString()}</p>
                <button
                  onClick={() => handleSettle(d.id)}
                  style={{ fontSize: '0.7rem', color: '#007b6e', background: '#e6f4f2', border: 'none', borderRadius: '999px', padding: '0.2rem 0.6rem', cursor: 'pointer', fontWeight: '600' }}>
                  Settle ✓
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* I Owe */}
      {!loading && iOwe.length > 0 && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>😬 I owe</h3>
          {iOwe.map((d, i) => (
            <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.9rem', marginBottom: '0.9rem', borderBottom: i < iOwe.length - 1 ? '1px solid #f0ebe1' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#fdecea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#e63946', fontSize: '0.875rem' }}>
                  {d.contact_name[0].toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: '500', fontSize: '0.875rem', color: '#1a1a1a' }}>{d.contact_name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Due {d.due_date || 'no date'}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: '600', color: '#e63946', marginBottom: '0.3rem' }}>₦{d.amount.toLocaleString()}</p>
                <button
                  onClick={() => handleSettle(d.id)}
                  style={{ fontSize: '0.7rem', color: '#e63946', background: '#fdecea', border: 'none', borderRadius: '999px', padding: '0.2rem 0.6rem', cursor: 'pointer', fontWeight: '600' }}>
                  Settle ✓
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && debts.filter(d => d.status === 'pending').length === 0 && (
        <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>No pending debts. You're all clear! 🎉</p>
      )}

    </div> </AuthGuard>
  )
}