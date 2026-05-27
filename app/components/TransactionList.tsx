const transactions = [
  { name: 'Jollof & chicken', category: 'Food', amount: '-₦1,500', color: '#e63946' },
  { name: 'Airtime recharge', category: 'Data', amount: '-₦500', color: '#e63946' },
  { name: 'Allowance', category: 'Income', amount: '+₦20,000', color: '#007b6e' },
  { name: 'Transport', category: 'Transport', amount: '-₦300', color: '#e63946' },
]

function getEmoji(category: string) {
  if (category === 'Food') return '🍛'
  if (category === 'Data') return '📶'
  if (category === 'Income') return '💰'
  return '🚌'
}

export default function TransactionList() {
  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontWeight: '600', color: '#1a1a1a' }}>Recent Transactions</h3>
        <p style={{ fontSize: '0.8rem', color: '#007b6e', fontWeight: '500' }}>See all</p>
      </div>
      {transactions.map((tx, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.9rem', marginBottom: '0.9rem', borderBottom: i < transactions.length - 1 ? '1px solid #f0ebe1' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '0.6rem', backgroundColor: '#f0ebe1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
              {getEmoji(tx.category)}
            </div>
            <div>
              <p style={{ fontWeight: '500', fontSize: '0.875rem', color: '#1a1a1a' }}>{tx.name}</p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{tx.category}</p>
            </div>
          </div>
          <p style={{ fontWeight: '600', color: tx.color }}>{tx.amount}</p>
        </div>
      ))}
    </div>
  )
}