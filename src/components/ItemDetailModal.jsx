import { CATEGORIES } from '../data/inventory';
import { CATEGORY_STYLES, getItemIcon } from '../utils/toolIcons';
import { ToolImage } from './InventoryCard';

function StockGauge({ quantity, minStock }) {
  const max = Math.max(quantity, minStock * 4, 1);
  const pct = Math.min((quantity / max) * 100, 100);
  const color  = quantity === 0 ? '#ef4444' : quantity <= minStock ? '#f59e0b' : '#8b5cf6';
  const label  = quantity === 0 ? 'Out of Stock' : quantity <= minStock ? 'Low Stock' : 'In Stock';
  const bg     = quantity === 0 ? '#fef2f2' : quantity <= minStock ? '#fffbeb' : '#f5f3ff';

  return (
    <div style={{ background: bg, borderRadius: 12, padding: 16, border: `1px solid ${color}44` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: 'var(--foreground)', fontWeight: 500 }}>Quantity Available</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{label}</span>
      </div>
      <div style={{ fontSize: 36, fontWeight: 800, color, fontFamily: 'var(--font-mono)', marginBottom: 10 }}>
        {quantity.toLocaleString('en-IN')}
        <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--muted-foreground)', marginLeft: 6 }}>pieces</span>
      </div>
      <div style={{ height: 10, background: 'var(--border)', borderRadius: 5, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}, ${color}bb)`,
          borderRadius: 5, transition: 'width 0.6s ease',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--muted-foreground)' }}>
        <span>0</span>
        <span>Min. required: {minStock.toLocaleString('en-IN')}</span>
        <span>{max.toLocaleString('en-IN')}</span>
      </div>

      {quantity === 0 && (
        <div style={{
          marginTop: 10, padding: '8px 12px',
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: 8, fontSize: 12, color: '#dc2626',
          display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500,
        }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          This item is out of stock. Please reorder immediately.
        </div>
      )}
      {quantity > 0 && quantity <= minStock && (
        <div style={{
          marginTop: 10, padding: '8px 12px',
          background: '#fffbeb', border: '1px solid #fde68a',
          borderRadius: 8, fontSize: 12, color: '#d97706',
          display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500,
        }}>
          <span style={{ fontSize: 16 }}>⚡</span>
          Stock is below minimum threshold. Consider reordering soon.
        </div>
      )}
    </div>
  );
}

export default function ItemDetailModal({ item, onClose, onEdit }) {
  if (!item) return null;
  const cat      = CATEGORIES.find(c => c.id === item.category);
  const catStyle = CATEGORY_STYLES[item.category] || {};
  const { label: iconLabel } = getItemIcon(item);
  const totalValue = (item.quantity * item.price);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="scale-in"
        style={{
          background: 'var(--card)', borderRadius: 16,
          width: '100%', maxWidth: 520,
          maxHeight: '90vh', overflow: 'auto',
          boxShadow: '0 24px 64px rgba(139,92,246,0.25)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Modal header with tool image */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          background: catStyle.gradient || 'linear-gradient(135deg,var(--primary),#6d28d9)',
          borderRadius: '16px 16px 0 0', position: 'relative',
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 14, right: 14,
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
            width: 30, height: 30, cursor: 'pointer', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          }}>✕</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Large tool image */}
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 14, padding: 8,
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.25)',
            }}>
              <ToolImage item={item} size={72} />
            </div>

            <div>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
                color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 4,
              }}>
                {iconLabel} · {cat?.label}
              </div>
              <div style={{ fontSize: 19, fontWeight: 700, color: 'white', marginBottom: 2, lineHeight: 1.25 }}>
                {item.name}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono)' }}>
                {item.sku}
              </div>
            </div>
          </div>
        </div>

        {/* Modal body */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <StockGauge quantity={item.quantity} minStock={item.minStock} />

          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Unit Price',   value: `₹${item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '💰', mono: true },
              { label: 'Total Value',  value: `₹${totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '📊', mono: true },
              { label: 'Size / Spec', value: item.size,          icon: '📐' },
              { label: 'Unit',        value: item.unit,          icon: '📦' },
              { label: 'Min. Stock',  value: item.minStock.toLocaleString('en-IN'), icon: '📉' },
              { label: 'Category',    value: cat?.label,         icon: cat?.icon },
            ].map(({ label, value, icon, mono }) => (
              <div key={label} style={{
                background: 'var(--muted)', borderRadius: 10, padding: '12px 14px',
                border: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span>{icon}</span> {label}
                </div>
                <div style={{
                  fontSize: 15, fontWeight: 600, color: 'var(--card-foreground)',
                  fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
                }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          {item.description && (
            <div style={{
              background: 'var(--accent)', borderRadius: 10, padding: '12px 14px',
              border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: 11, color: 'var(--accent-foreground)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                Description
              </div>
              <div style={{ fontSize: 13, color: 'var(--foreground)', lineHeight: 1.5 }}>
                {item.description}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button onClick={() => onEdit(item)} style={{
              flex: 1, padding: '10px 0',
              background: catStyle.gradient || 'linear-gradient(135deg,var(--primary),#6d28d9)',
              color: 'white', border: 'none', borderRadius: 8,
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'var(--font-sans)', transition: 'opacity 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Edit Item
            </button>
            <button onClick={onClose} style={{
              flex: 1, padding: '10px 0',
              background: 'var(--muted)', color: 'var(--foreground)',
              border: '1px solid var(--border)', borderRadius: 8,
              fontSize: 14, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'var(--font-sans)', transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--muted)'}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
