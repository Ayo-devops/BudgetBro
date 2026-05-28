'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AuthGuard from '../components/AuthGuard'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setEmail(user.email || '')

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) {
      setFullName(data.full_name || '')
      setMonthlyIncome(data.monthly_income?.toString() || '')
    }

    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: fullName,
        monthly_income: parseFloat(monthlyIncome) || 0,
      })

    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }

    setSaving(false)
  }

  return (
    <AuthGuard>
      <div style={{ backgroundColor: '#faf7f2', padding: '1.5rem', paddingBottom: '6rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button>
          <a href="/" style={{ textDecoration: 'none', width: '36px', height: '36px', backgroundColor: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', color: '#1a1a1a', fontSize: '1rem' }}>←</a>
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1a1a' }}>Profile</h1>
        </div>

        {loading ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem', fontSize: '0.875rem' }}>Loading...</p>
        ) : (
          <>
            {/* Avatar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#007b6e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
                {fullName?.[0]?.toUpperCase() || '?'}
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{email}</p>
            </div>

            {/* Form */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>Personal Info</h3>

              <label style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500', display: 'block', marginBottom: '0.3rem' }}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.6rem', border: '1px solid #f0ebe1', marginBottom: '1rem', fontSize: '0.875rem', backgroundColor: '#faf7f2', color: '#1a1a1a', boxSizing: 'border-box' }}
              />

              <label style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500', display: 'block', marginBottom: '0.3rem' }}>Monthly Income (₦)</label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.6rem', border: '1px solid #f0ebe1', marginBottom: '1rem', fontSize: '0.875rem', backgroundColor: '#faf7f2', color: '#1a1a1a', boxSizing: 'border-box' }}
              />

              <button
                onClick={handleSave}
                disabled={saving}
                style={{ width: '100%', backgroundColor: saved ? '#4ade80' : '#007b6e', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                {saved ? '✓ Saved' : saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </>
        )}

      </div>
    </AuthGuard>
  )
}