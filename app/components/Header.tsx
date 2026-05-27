export default function Header() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
      <div>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Good morning 👋</p>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1a1a' }}>Ayo</h1>
      </div>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#007b6e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700' }}>
        A
      </div>
    </div>
  )
}