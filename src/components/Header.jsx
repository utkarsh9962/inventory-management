import { useState } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

export default function Header({ searchQuery, onSearch, onAddInventory, onBulkUpload, onScannerOpen, onCreateOrder, page, onNavigate, darkMode, onToggleDark }) {
  const [focused, setFocused] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: darkMode ? 'rgba(15,23,42,0.96)' : 'rgba(255,255,255,0.96)',
      backdropFilter: 'blur(12px)',
      borderBottom: `1px solid var(--border)`,
      boxShadow: '0 2px 16px rgba(139,92,246,0.08)',
      transition: 'background 0.3s',
    }}>
      {/* Main bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: isMobile ? '10px 14px' : '10px 24px',
        maxWidth: 1400, margin: '0 auto',
        flexWrap: isMobile ? 'wrap' : 'nowrap',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, var(--primary), #6d28d9)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17, boxShadow: '0 2px 8px rgba(139,92,246,0.35)',
          }}>🔧</div>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? 15 : 18, fontWeight: 700, color: 'var(--primary)', lineHeight: 1.1 }}>HardwareHub</div>
            {!isMobile && <div style={{ fontSize: 9, color: 'var(--muted-foreground)', letterSpacing: 1, textTransform: 'uppercase' }}>Inventory Manager</div>}
          </div>
        </div>

        {/* Search — centre */}
        <div style={{
          flex: isMobile ? '0 0 100%' : 1,
          order: isMobile ? 3 : 0,
          maxWidth: isMobile ? '100%' : 480,
          position: 'relative',
          margin: isMobile ? 0 : '0 auto',
        }}>
          <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: focused ? 'var(--primary)' : 'var(--muted-foreground)', pointerEvents: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder={isMobile ? 'Search inventory...' : 'Search tools, components, sizes, SKUs...'}
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '8px 34px 8px 38px',
              background: 'var(--input)',
              border: `2px solid ${focused ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 50, fontSize: 13,
              color: 'var(--foreground)', outline: 'none',
              boxShadow: focused ? '0 0 0 3px rgba(139,92,246,0.15)' : 'none',
              fontFamily: 'var(--font-sans)',
            }}
          />
          {searchQuery && (
            <button onClick={() => onSearch('')} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'var(--muted-foreground)', border: 'none', borderRadius: '50%', width: 17, height: 17, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✕</button>
          )}
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0, marginLeft: 'auto' }}>
          {/* Dark toggle */}
          <button onClick={onToggleDark} style={{ background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 7, padding: '6px 8px', cursor: 'pointer', fontSize: 14, lineHeight: 1 }} title={darkMode ? 'Light mode' : 'Dark mode'}>
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Stock Scanner */}
          <button onClick={onScannerOpen} title="Stock Scanner" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: isMobile ? '6px 8px' : '7px 12px', background: 'linear-gradient(135deg,#0f172a,#1e1b4b)', color: 'white', border: '1.5px solid #334155', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            <span style={{ fontSize: 14 }}>📡</span>
            {!isMobile && <span>Scanner</span>}
          </button>

          {/* Bulk Upload */}
          <button onClick={onBulkUpload} title="Bulk Upload" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: isMobile ? '6px 8px' : '7px 12px', background: 'var(--muted)', color: 'var(--foreground)', border: '1.5px solid var(--border)', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            {!isMobile && <span>Bulk Upload</span>}
          </button>

          {/* Add Inventory */}
          <button onClick={onAddInventory} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: isMobile ? '6px 10px' : '7px 14px', background: 'linear-gradient(135deg, var(--primary), #6d28d9)', color: 'white', border: 'none', borderRadius: 7, fontSize: isMobile ? 12 : 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(139,92,246,0.3)', fontFamily: 'var(--font-sans)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {isMobile ? 'Add' : 'Add Inventory'}
          </button>

          {/* Create New Order — prominent */}
          <button
            onClick={onCreateOrder}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: isMobile ? '6px 10px' : '7px 16px',
              background: 'linear-gradient(135deg,#059669,#047857)',
              color: 'white', border: 'none', borderRadius: 7,
              fontSize: isMobile ? 12 : 13, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(5,150,105,0.35)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <span style={{ fontSize: 14 }}>🛒</span>
            {isMobile ? 'Order' : 'Create New Order'}
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div style={{
        display: 'flex', gap: 0,
        borderTop: '1px solid var(--border)',
        padding: '0 24px',
        maxWidth: 1400, margin: '0 auto',
      }}>
        {[
          { key: 'inventory', label: '📦 Inventory' },
          { key: 'orders', label: '🧾 Order History' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => onNavigate(tab.key)}
            style={{
              padding: '8px 16px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: page === tab.key ? 700 : 500,
              color: page === tab.key ? 'var(--primary)' : 'var(--muted-foreground)',
              borderBottom: page === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
              fontFamily: 'var(--font-sans)',
              transition: 'all 0.15s',
              marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
}
