import { CATEGORIES } from '../data/inventory';
import { useIsMobile } from '../hooks/useIsMobile';

export default function CategoryFilter({ activeCategory, onSelect, counts }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div style={{
        background: 'var(--sidebar)',
        borderBottom: '1px solid var(--sidebar-border)',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}>
        <div style={{
          display: 'flex', gap: 6,
          padding: '10px 16px',
          width: 'max-content',
        }}>
          {CATEGORIES.map(cat => {
            const count = cat.id === 'all'
              ? Object.values(counts).reduce((a, b) => a + b, 0)
              : (counts[cat.id] || 0);
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 12px', borderRadius: 20,
                  border: isActive ? 'none' : '1.5px solid var(--border)',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  background: isActive ? 'linear-gradient(135deg, var(--primary), #6d28d9)' : 'var(--muted)',
                  color: isActive ? 'white' : 'var(--sidebar-foreground)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 12, fontWeight: isActive ? 600 : 400,
                  boxShadow: isActive ? '0 2px 8px rgba(139,92,246,0.3)' : 'none',
                }}
              >
                <span style={{ fontSize: 14 }}>{cat.icon}</span>
                <span>{cat.label}</span>
                <span style={{
                  fontSize: 10, fontWeight: 600,
                  background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--border)',
                  color: isActive ? 'white' : 'var(--muted-foreground)',
                  padding: '1px 6px', borderRadius: 20,
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: 'var(--sidebar)',
      borderRight: '1px solid var(--sidebar-border)',
      minHeight: 'calc(100vh - 65px)',
      padding: '20px 12px',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
        color: 'var(--muted-foreground)', textTransform: 'uppercase',
        padding: '0 8px 12px',
      }}>
        Categories
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {CATEGORIES.map(cat => {
          const count = cat.id === 'all'
            ? Object.values(counts).reduce((a, b) => a + b, 0)
            : (counts[cat.id] || 0);
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8,
                border: 'none', cursor: 'pointer',
                background: isActive
                  ? 'linear-gradient(135deg, var(--primary), #6d28d9)'
                  : 'transparent',
                color: isActive ? 'white' : 'var(--sidebar-foreground)',
                fontFamily: 'var(--font-sans)',
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                textAlign: 'left', width: '100%',
                transition: 'all 0.15s',
                boxShadow: isActive ? '0 2px 8px rgba(139,92,246,0.3)' : 'none',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--sidebar-accent)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>{cat.icon}</span>
              <span style={{ flex: 1 }}>{cat.label}</span>
              <span style={{
                fontSize: 11, fontWeight: 600,
                background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--border)',
                color: isActive ? 'white' : 'var(--muted-foreground)',
                padding: '1px 7px', borderRadius: 20,
                minWidth: 24, textAlign: 'center',
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      <div style={{
        marginTop: 24, padding: '14px 12px',
        background: 'var(--secondary)',
        borderRadius: 10, border: '1px solid var(--border)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
          Stock Status
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { label: 'In Stock', color: '#22c55e', key: '__inStock' },
            { label: 'Low Stock', color: '#f59e0b', key: '__lowStock' },
            { label: 'Out of Stock', color: '#ef4444', key: '__outOfStock' },
          ].map(s => (
            <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--foreground)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block' }}/>
                {s.label}
              </span>
              <span style={{ fontWeight: 600 }}>{counts[s.key] || 0}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
