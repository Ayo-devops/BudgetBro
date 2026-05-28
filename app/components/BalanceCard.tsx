type Props = {
  totalExpenses: number
}

export default function BalanceCard({ totalExpenses }: Props) {
  const income = 60000
  const balance = income - totalExpenses

  return (
    <div style={{ backgroundColor: '#007b6e', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', color: 'white' }}>
      <p style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '0.5rem' }}>Total Balance</p>
      <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>₦{balance.toLocaleString()}</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>Income</p>
          <p style={{ fontWeight: '600' }}>₦{income.toLocaleString()}</p>
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>Expenses</p>
          <p style={{ fontWeight: '600' }}>₦{totalExpenses.toLocaleString()}</p>
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>Budget left</p>
          <p style={{ fontWeight: '600' }}>₦{Math.max(0, balance).toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}