export default function LandingHero({ totalItems, outOfStock, lowStock, totalValue }) {
  const fmt = (n) => n.toLocaleString('en-IN');
  const isMobile = window.innerWidth < 768;

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--primary) 0%, #4c1d95 50%, #1e40af 100%)',
      padding: isMobile ? '24px 16px' : '40px 32px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
      <div style={{ position: 'absolute', bottom: -60, left: '30%', width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

      <div style={{ position: 'relative', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 8 }}>
          Hardware Store — India
        </div>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700,
          color: 'white', marginBottom: 6, lineHeight: 1.2,
        }}>
          Inventory Management
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 28, maxWidth: 500 }}>
          Track stock levels, manage tools &amp; components, and get instant low-stock alerts.
        </p>

        {/* Stats */}
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, auto)' }}>
          {[
            { label: 'Total Items',   value: fmt(totalItems),              icon: '📦', color: '#a78bfa', alert: false },
            { label: 'Out of Stock',  value: fmt(outOfStock),              icon: '⚠️', color: '#f87171', alert: outOfStock > 0 },
            { label: 'Low Stock',     value: fmt(lowStock),                icon: '⚡', color: '#fbbf24', alert: lowStock > 0 },
            { label: 'Total Value',   value: `₹${fmt(totalValue)}`,        icon: '💰', color: '#34d399', alert: false },
          ].map(stat => (
            <div key={stat.label} style={{
              background: stat.alert ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              borderRadius: 12, padding: isMobile ? '10px 14px' : '14px 20px',
              border: `1px solid ${stat.alert ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.15)'}`,
            }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span>{stat.icon}</span>{stat.label}
              </div>
              <div style={{
                fontSize: 26, fontWeight: 800,
                fontFamily: stat.label === 'Total Value' ? 'var(--font-mono)' : 'var(--font-sans)',
                color: stat.color,
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {outOfStock > 0 && (
          <div style={{
            marginTop: 16, padding: '10px 16px',
            background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 8,
            color: '#fca5a5', fontSize: 13, fontWeight: 500,
          }}>
            🚨 {outOfStock} item{outOfStock !== 1 ? 's are' : ' is'} out of stock — immediate reorder required!
          </div>
        )}
      </div>
    </div>
  );
}
