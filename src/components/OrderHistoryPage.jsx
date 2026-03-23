import { useState } from 'react';
import { downloadOrderPDF } from '../utils/pdfGenerator';

export default function OrderHistoryPage({ orders }) {
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = orders.filter(o =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.items.some(i => i.name.toLowerCase().includes(search.toLowerCase()))
  );

  const totalRevenue = orders.reduce((s, o) => s + o.subtotal, 0);

  if (orders.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, color: 'var(--muted-foreground)' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>📋</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--foreground)', marginBottom: 8 }}>No Orders Yet</div>
        <div style={{ fontSize: 14 }}>Create your first order to see history here.</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px' }}>

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--foreground)', margin: 0, marginBottom: 4 }}>Order History</h1>
        <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} · Total revenue: <strong style={{ color: '#059669' }}>₹{totalRevenue.toLocaleString('en-IN')}</strong></div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Orders', value: orders.length, icon: '🧾', color: '#7c3aed' },
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: '💰', color: '#059669' },
          { label: "Today's Orders", value: orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length, icon: '📅', color: '#2563eb' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 4 }}>{s.icon} {s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 15, pointerEvents: 'none' }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by order ID or product name…"
          style={{ width: '100%', padding: '10px 14px 10px 38px', background: 'var(--input)', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 13, color: 'var(--foreground)', outline: 'none', fontFamily: 'var(--font-sans)', boxSizing: 'border-box' }}
        />
      </div>

      {/* Orders list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted-foreground)', fontSize: 14 }}>No orders match your search.</div>
        )}
        {filtered.map(order => (
          <div key={order.id} style={{ border: '1.5px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--card)', transition: 'box-shadow 0.15s' }}>

            {/* Row */}
            <div
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.parentElement.style.boxShadow = '0 4px 16px rgba(139,92,246,0.12)'}
              onMouseLeave={e => e.currentTarget.parentElement.style.boxShadow = 'none'}
            >
              {/* Order ID */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{order.id}</div>
                <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 2 }}>{new Date(order.createdAt).toLocaleString('en-IN')}</div>
              </div>

              {/* Item count */}
              <div style={{ textAlign: 'center', minWidth: 60 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--foreground)' }}>{order.itemCount}</div>
                <div style={{ fontSize: 10, color: 'var(--muted-foreground)' }}>products</div>
              </div>

              {/* Units */}
              <div style={{ textAlign: 'center', minWidth: 50 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--foreground)' }}>{order.totalQty}</div>
                <div style={{ fontSize: 10, color: 'var(--muted-foreground)' }}>units</div>
              </div>

              {/* Value */}
              <div style={{ textAlign: 'right', minWidth: 90 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)' }}>₹{order.subtotal.toLocaleString('en-IN')}</div>
              </div>

              {/* Download */}
              <button
                onClick={e => { e.stopPropagation(); downloadOrderPDF(order); }}
                title="Download PDF"
                style={{ padding: '7px 12px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--foreground)', flexShrink: 0 }}
              >📄</button>

              {/* Expand indicator */}
              <span style={{ fontSize: 11, color: 'var(--muted-foreground)', flexShrink: 0 }}>{expanded === order.id ? '▲' : '▼'}</span>
            </div>

            {/* Expanded Detail */}
            {expanded === order.id && (
              <div style={{ borderTop: '1px solid var(--border)', background: 'var(--secondary)' }}>
                {/* Items table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 100px 100px', gap: 0, padding: '8px 18px', borderBottom: '1px solid var(--border)' }}>
                  {['Product', 'Qty', 'Unit Price', 'Total'].map(h => (
                    <div key={h} style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</div>
                  ))}
                </div>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 100px 100px', gap: 0, padding: '9px 18px', borderBottom: '1px solid var(--border)', alignItems: 'center', background: i % 2 === 0 ? 'transparent' : 'var(--card)' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{item.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{item.sku}</div>
                    </div>
                    <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{item.qty} {item.unit}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>₹{item.unitPrice.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>₹{item.total.toLocaleString('en-IN')}</div>
                  </div>
                ))}
                <div style={{ padding: '10px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{order.totalQty} total units</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)' }}>₹{order.subtotal.toLocaleString('en-IN')}</span>
                    <button
                      onClick={() => downloadOrderPDF(order)}
                      style={{ padding: '7px 14px', background: 'linear-gradient(135deg,#581c87,#6d28d9)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-sans)' }}
                    >📄 Download PDF</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
