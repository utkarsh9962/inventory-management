import { useState, useEffect, useRef } from 'react';
import CameraScanner from './CameraScanner';

export default function ScannerModal({ inventory, onClose, onUpdateQuantity }) {
  const [mode, setMode] = useState('out'); // 'in' = receive stock, 'out' = sell/issue
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [matchedItem, setMatchedItem] = useState(null);
  const [qty, setQty] = useState(1);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', msg }
  const inputRef = useRef(null);

  // Auto-focus the barcode input whenever modal opens or after a scan
  useEffect(() => {
    inputRef.current?.focus();
  }, [matchedItem]);

  const processCode = (code) => {
    const trimmed = code.trim();
    if (!trimmed) return;
    const found = inventory.find(i => i.barcode && i.barcode.trim() === trimmed);
    if (found) {
      setMatchedItem(found); setQty(1); setStatus(null);
    } else {
      setMatchedItem(null);
      setStatus({ type: 'error', msg: `No item found for barcode: ${trimmed}` });
    }
    setBarcodeInput(''); setShowCamera(false);
  };

  const handleBarcodeScan = (e) => {
    if (e.key !== 'Enter') return;
    const code = barcodeInput.trim();
    if (!code) return;

    const found = inventory.find(
      i => i.barcode && i.barcode.trim() === code
    );

    if (found) {
      setMatchedItem(found);
      setQty(1);
      setStatus(null);
    } else {
      setMatchedItem(null);
      setStatus({ type: 'error', msg: `No item found for barcode: ${code}` });
    }
    setBarcodeInput('');
  };

  const handleConfirm = () => {
    if (!matchedItem || qty < 1) return;
    const delta = mode === 'in' ? qty : -qty;
    const newQty = Math.max(0, matchedItem.quantity + delta);
    onUpdateQuantity(matchedItem.id, newQty);

    const entry = {
      id: Date.now(),
      name: matchedItem.name,
      sku: matchedItem.sku,
      mode,
      qty,
      newQty,
      time: new Date().toLocaleTimeString(),
    };
    setHistory(h => [entry, ...h].slice(0, 10));
    setStatus({
      type: 'success',
      msg: mode === 'in'
        ? `+${qty} added to ${matchedItem.name} → now ${newQty}`
        : `-${qty} deducted from ${matchedItem.name} → now ${newQty}`,
    });
    setMatchedItem(null);
    setBarcodeInput('');
    inputRef.current?.focus();
  };

  const handleCancel = () => {
    setMatchedItem(null);
    setBarcodeInput('');
    inputRef.current?.focus();
  };

  const isOutOfStock = matchedItem && matchedItem.quantity === 0;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 400,
        background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'var(--card)', borderRadius: 18,
        width: '100%', maxWidth: 520,
        maxHeight: '92vh', overflow: 'auto',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        border: '1px solid var(--border)',
      }}>

        {/* Header */}
        <div style={{
          padding: '18px 24px',
          background: 'linear-gradient(135deg, #0f172a, #1e1b4b)',
          borderRadius: '18px 18px 0 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>📡</span>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'white' }}>Barcode Scanner</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>USB / Bluetooth scanner ready</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
              width: 32, height: 32, cursor: 'pointer', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
            }}
          >✕</button>
        </div>

        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Mode toggle */}
          <div style={{
            display: 'flex', borderRadius: 10,
            border: '2px solid var(--border)', overflow: 'hidden',
          }}>
            {[
              { value: 'out', label: '🛒 Sell / Issue', color: '#ef4444' },
              { value: 'in',  label: '📦 Receive Stock', color: '#22c55e' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => { setMode(opt.value); setMatchedItem(null); setStatus(null); }}
                style={{
                  flex: 1, padding: '11px 0',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
                  background: mode === opt.value ? opt.color : 'var(--muted)',
                  color: mode === opt.value ? 'white' : 'var(--muted-foreground)',
                  transition: 'all 0.15s',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Scan input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: 1 }}>
              Scan Barcode
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <span style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 18, pointerEvents: 'none',
                }}>🔍</span>
                <input
                  ref={inputRef}
                  value={barcodeInput}
                  onChange={e => setBarcodeInput(e.target.value)}
                  onKeyDown={handleBarcodeScan}
                  placeholder="USB/Bluetooth scanner — just scan…"
                  style={{
                    width: '100%', padding: '13px 14px 13px 44px',
                    background: 'var(--input)', border: '2px solid var(--primary)',
                    borderRadius: 10, fontSize: 15, color: 'var(--foreground)',
                    outline: 'none', fontFamily: 'var(--font-mono)',
                    boxShadow: '0 0 0 3px rgba(139,92,246,0.15)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <button
                onClick={() => setShowCamera(c => !c)}
                title="Use phone camera"
                style={{ padding: '0 14px', background: showCamera ? '#7c3aed' : 'var(--muted)', border: `2px solid ${showCamera ? '#7c3aed' : 'var(--border)'}`, borderRadius: 10, cursor: 'pointer', fontSize: 20, color: showCamera ? 'white' : 'var(--foreground)', flexShrink: 0 }}
              >📷</button>
            </div>
            {showCamera && (
              <CameraScanner onScan={processCode} onClose={() => setShowCamera(false)} />
            )}
            <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>
              The input above is always active — just scan and it auto-detects.
            </div>
          </div>

          {/* Status message */}
          {status && (
            <div style={{
              padding: '12px 16px', borderRadius: 10,
              background: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${status.type === 'success' ? '#86efac' : '#fca5a5'}`,
              color: status.type === 'success' ? '#16a34a' : '#dc2626',
              fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {status.type === 'success' ? '✅' : '❌'} {status.msg}
            </div>
          )}

          {/* Matched item card */}
          {matchedItem && (
            <div style={{
              border: `2px solid ${mode === 'in' ? '#22c55e' : '#ef4444'}`,
              borderRadius: 12, overflow: 'hidden',
            }}>
              {/* Item info */}
              <div style={{ padding: '14px 16px', background: 'var(--secondary)' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)', marginBottom: 4 }}>
                  {matchedItem.name}
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--muted-foreground)' }}>
                  <span>SKU: <strong>{matchedItem.sku}</strong></span>
                  <span>Current stock: <strong style={{ color: isOutOfStock ? '#ef4444' : 'var(--foreground)' }}>{matchedItem.quantity} {matchedItem.unit}</strong></span>
                </div>
              </div>

              {/* Quantity selector */}
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted-foreground)' }}>
                  {mode === 'in' ? 'Quantity to add:' : 'Quantity to deduct:'}
                </div>

                {/* Quick qty buttons */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[1, 2, 5, 10, 25, 50].map(n => (
                    <button
                      key={n}
                      onClick={() => setQty(n)}
                      style={{
                        padding: '7px 16px', borderRadius: 8,
                        border: `2px solid ${qty === n ? (mode === 'in' ? '#22c55e' : '#ef4444') : 'var(--border)'}`,
                        background: qty === n ? (mode === 'in' ? '#f0fdf4' : '#fef2f2') : 'var(--muted)',
                        color: qty === n ? (mode === 'in' ? '#16a34a' : '#dc2626') : 'var(--foreground)',
                        fontWeight: 700, fontSize: 14, cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {n}
                    </button>
                  ))}
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{
                      width: 70, padding: '7px 10px', borderRadius: 8,
                      border: '2px solid var(--border)', background: 'var(--input)',
                      color: 'var(--foreground)', fontSize: 14, fontWeight: 700,
                      outline: 'none', textAlign: 'center',
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                </div>

                {/* Warning if deducting more than available */}
                {mode === 'out' && qty > matchedItem.quantity && (
                  <div style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600 }}>
                    ⚠️ Only {matchedItem.quantity} in stock — quantity will be set to 0
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={handleConfirm}
                    style={{
                      flex: 1, padding: '12px 0',
                      background: mode === 'in'
                        ? 'linear-gradient(135deg,#16a34a,#15803d)'
                        : 'linear-gradient(135deg,#dc2626,#b91c1c)',
                      color: 'white', border: 'none', borderRadius: 8,
                      fontSize: 15, fontWeight: 700, cursor: 'pointer',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    {mode === 'in' ? `✅ Add ${qty} to stock` : `🛒 Deduct ${qty} from stock`}
                  </button>
                  <button
                    onClick={handleCancel}
                    style={{
                      padding: '12px 18px', border: '1px solid var(--border)',
                      background: 'var(--muted)', borderRadius: 8,
                      color: 'var(--foreground)', cursor: 'pointer',
                      fontSize: 14, fontFamily: 'var(--font-sans)',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Scan history */}
          {history.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                Recent Scans
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {history.map(h => (
                  <div key={h.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 12px', borderRadius: 8,
                    background: 'var(--secondary)', border: '1px solid var(--border)',
                    fontSize: 12,
                  }}>
                    <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>{h.name}</span>
                    <span style={{ color: h.mode === 'in' ? '#16a34a' : '#dc2626', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {h.mode === 'in' ? `+${h.qty}` : `-${h.qty}`} → {h.newQty}
                    </span>
                    <span style={{ color: 'var(--muted-foreground)' }}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
