export function SkeletonLine({ width = '100%', height = '1rem' }: { width?: string, height?: string }) {
  return (
    <div style={{
      width,
      height,
      backgroundColor: '#e8e2d9',
      borderRadius: '0.4rem',
      animation: 'pulse 1.5s ease-in-out infinite',
    }} />
  )
}

export function SkeletonCard() {
  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '1rem' }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
      <SkeletonLine width="40%" height="0.875rem" />
      <div style={{ marginTop: '0.75rem' }}>
        <SkeletonLine width="100%" height="0.75rem" />
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <SkeletonLine width="70%" height="0.75rem" />
      </div>
    </div>
  )
}

export function SkeletonTransaction() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.9rem', marginBottom: '0.9rem', borderBottom: '1px solid #f0ebe1' }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '0.6rem', backgroundColor: '#e8e2d9', animation: 'pulse 1.5s ease-in-out infinite', flexShrink: 0 }} />
        <div>
          <SkeletonLine width="120px" height="0.875rem" />
          <div style={{ marginTop: '0.4rem' }}>
            <SkeletonLine width="80px" height="0.75rem" />
          </div>
        </div>
      </div>
      <SkeletonLine width="60px" height="0.875rem" />
    </div>
  )
}

export function SkeletonBalanceCard() {
  return (
    <div style={{ backgroundColor: '#007b6e', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
      <div style={{ backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '0.4rem', height: '0.875rem', width: '30%', animation: 'pulse 1.5s ease-in-out infinite', marginBottom: '0.75rem' }} />
      <div style={{ backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '0.4rem', height: '2rem', width: '50%', animation: 'pulse 1.5s ease-in-out infinite', marginBottom: '1rem' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {[1,2,3].map((i) => (
          <div key={i}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '0.4rem', height: '0.75rem', width: '60px', animation: 'pulse 1.5s ease-in-out infinite', marginBottom: '0.3rem' }} />
            <div style={{ backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '0.4rem', height: '0.875rem', width: '80px', animation: 'pulse 1.5s ease-in-out infinite' }} />
          </div>
        ))}
      </div>
    </div>
  )
}