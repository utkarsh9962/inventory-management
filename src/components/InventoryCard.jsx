import { CATEGORIES } from '../data/inventory';
import { CATEGORY_STYLES, getItemIcon } from '../utils/toolIcons';

function StockBadge({ quantity, minStock }) {
  if (quantity === 0) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 9px', borderRadius: 20,
        background: '#fef2f2', color: '#dc2626',
        fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626', display: 'inline-block' }}/>
        Out of Stock
      </span>
    );
  }
  if (quantity <= minStock) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 9px', borderRadius: 20,
        background: '#fffbeb', color: '#d97706',
        fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}/>
        Low Stock
      </span>
    );
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 9px', borderRadius: 20,
      background: '#f0fdf4', color: '#16a34a',
      fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}/>
      In Stock
    </span>
  );
}

function QuantityBar({ quantity, minStock }) {
  const max = Math.max(quantity, minStock * 3, 1);
  const pct = Math.min((quantity / max) * 100, 100);
  const color = quantity === 0 ? '#ef4444' : quantity <= minStock ? '#f59e0b' : '#8b5cf6';

  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 4 }}>
        <span>Quantity</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--foreground)' }}>
          {quantity.toLocaleString('en-IN')} pcs
        </span>
      </div>
      <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          borderRadius: 3, transition: 'width 0.5s ease',
        }} />
      </div>
      <div style={{ fontSize: 10, color: 'var(--muted-foreground)', marginTop: 3 }}>
        Min. stock: {minStock.toLocaleString('en-IN')}
      </div>
    </div>
  );
}

export function ToolImage({ item, size = 64 }) {
  const catStyle = CATEGORY_STYLES[item.category] || CATEGORY_STYLES['fasteners'];
  const { Icon } = getItemIcon(item);
  const isOutOfStock = item.quantity === 0;

  return (
    <div style={{
      width: size, height: size,
      borderRadius: size * 0.18,
      background: isOutOfStock ? '#f3f4f6' : catStyle.gradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      boxShadow: isOutOfStock
        ? '0 2px 8px rgba(0,0,0,0.08)'
        : `0 4px 14px ${catStyle.color}44`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* subtle shine overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '45%',
        background: 'rgba(255,255,255,0.15)',
        borderRadius: `${size * 0.18}px ${size * 0.18}px 50% 50%`,
      }} />
      <Icon
        size={size * 0.44}
        color={isOutOfStock ? '#9ca3af' : 'rgba(255,255,255,0.95)'}
        strokeWidth={1.8}
        style={{ position: 'relative', zIndex: 1 }}
      />
    </div>
  );
}

export default function InventoryCard({ item, onClick }) {
  const isOutOfStock = item.quantity === 0;
  const isLowStock = item.quantity > 0 && item.quantity <= item.minStock;
  const catStyle = CATEGORY_STYLES[item.category];

  return (
    <div
      onClick={() => onClick(item)}
      className="fade-in"
      style={{
        background: 'var(--card)',
        border: `1.5px solid ${isOutOfStock ? '#fecaca' : isLowStock ? '#fde68a' : 'var(--border)'}`,
        borderRadius: 14,
        padding: 18,
        cursor: 'pointer',
        transition: 'transform 0.18s, box-shadow 0.18s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 12px 28px ${catStyle?.color || '#8b5cf6'}22`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top accent strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: isOutOfStock
          ? 'linear-gradient(90deg,#ef4444,#f87171)'
          : isLowStock
          ? 'linear-gradient(90deg,#f59e0b,#fbbf24)'
          : catStyle?.gradient || 'var(--primary)',
      }} />

      {/* Out of stock alert */}
      {isOutOfStock && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: '#fef2f2', borderRadius: '50%',
          width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13,
        }}>⚠️</div>
      )}

      {/* Tool image + name row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13, marginBottom: 12 }}>
        <ToolImage item={item} size={58} />

        <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
          <h3 style={{
            fontSize: 13.5, fontWeight: 700, color: 'var(--card-foreground)',
            marginBottom: 3, lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {item.name}
          </h3>
          <div style={{
            fontSize: 10.5, color: 'var(--muted-foreground)',
            fontFamily: 'var(--font-mono)', letterSpacing: 0.3,
          }}>
            {item.sku}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
        <StockBadge quantity={item.quantity} minStock={item.minStock} />
        <span style={{
          padding: '3px 8px', borderRadius: 20,
          background: 'var(--accent)', color: 'var(--accent-foreground)',
          fontSize: 11, fontWeight: 500,
        }}>
          {item.size}
        </span>
      </div>

      <QuantityBar quantity={item.quantity} minStock={item.minStock} />

      {/* Price row — INR */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)',
      }}>
        <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>Unit price</span>
        <span style={{
          fontSize: 15, fontWeight: 700, color: catStyle?.color || 'var(--primary)',
          fontFamily: 'var(--font-mono)',
        }}>
          ₹{item.price.toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  );
}
