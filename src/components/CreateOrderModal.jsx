import { useState, useRef, useEffect } from 'react';
import CameraScanner from './CameraScanner';
import { downloadOrderPDF } from '../utils/pdfGenerator';

const INPUT = {
  padding: '9px 12px', background: 'var(--input)',
  border: '1.5px solid var(--border)', borderRadius: 8,
  fontSize: 13, color: 'var(--foreground)', outline: 'none',
  fontFamily: 'var(--font-sans)', width: '100%', boxSizing: 'border-box',
};

// ─── Bill View ────────────────────────────────────────────────────────────────
function BillView({ order, onClose, onNewOrder }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'var(--card)', borderRadius: 18, width: '100%', maxWidth: 540, maxHeight: '95vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', border: '1px solid var(--border)' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg,#059669,#047857)', borderRadius: '18px 18px 0 0', textAlign: 'center' }}>
          <div style={{ fontSize: 32 }}>✅</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'white', marginTop: 6 }}>Order Complete!</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{order.id}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{new Date(order.createdAt).toLocaleString('en-IN')}</div>
        </div>

        <div style={{ padding: 24 }}>
          {/* Bill table */}
          <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 48px 90px 90px', gap: 0, background: 'linear-gradient(135deg,#581c87,#6d28d9)', padding: '8px 14px' }}>
              {['Item', 'Qty', 'Rate', 'Total'].map(h => (
                <div key={h} style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</div>
              ))}
            </div>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 48px 90px 90px', gap: 0, padding: '9px 14px', borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--card)' : 'var(--secondary)', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{item.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{item.sku}</div>
                </div>
                <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{item.qty}</div>
                <div style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>₹{item.unitPrice.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed', fontFamily: 'var(--font-mono)' }}>₹{item.total.toLocaleString('en-IN')}</div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--secondary)', borderTop: '2px solid var(--border)' }}>
              <span style={{ fontWeight: 800, fontSize: 15 }}>GRAND TOTAL</span>
              <span style={{ fontWeight: 800, fontSize: 18, color: '#059669', fontFamily: 'var(--font-mono)' }}>₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
            <button
              onClick={() => downloadOrderPDF(order)}
              style={{ flex: 1, padding: '11px 0', background: 'var(--muted)', border: '1.5px solid var(--border)', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14, color: 'var(--foreground)', fontFamily: 'var(--font-sans)' }}
            >
              📄 Download PDF
            </button>
            <button
              onClick={onNewOrder}
              style={{ flex: 1, padding: '11px 0', background: 'linear-gradient(135deg,#059669,#047857)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14, fontFamily: 'var(--font-sans)' }}
            >
              🛒 New Order
            </button>
          </div>
          <button onClick={onClose} style={{ width: '100%', padding: '9px 0', background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer', fontSize: 13 }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Modal ────────────────────────────────────────────────────────────────
export default function CreateOrderModal({ inventory, onClose, onCompleteOrder }) {
  const [orderItems, setOrderItems] = useState([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [notFoundBarcode, setNotFoundBarcode] = useState(null);
  const [manualForm, setManualForm] = useState({ name: '', price: '', qty: '1' });
  const [completedOrder, setCompletedOrder] = useState(null);
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (!completedOrder && !showCamera) barcodeRef.current?.focus();
  }, [orderItems, completedOrder, showCamera, notFoundBarcode]);

  const processBarcode = (code) => {
    const trimmed = code.trim();
    if (!trimmed) return;
    const item = inventory.find(i => i.barcode && i.barcode.trim() === trimmed);
    if (item) {
      addInventoryItem(item);
      setNotFoundBarcode(null);
    } else {
      setNotFoundBarcode(trimmed);
      setManualForm({ name: '', price: '', qty: '1' });
    }
    setBarcodeInput('');
    setShowCamera(false);
  };

  const addInventoryItem = (item, qty = 1) => {
    setOrderItems(prev => {
      const existing = prev.find(o => o.inventoryId === item.id);
      if (existing) {
        return prev.map(o => o.inventoryId === item.id
          ? { ...o, qty: o.qty + qty, total: (o.qty + qty) * o.unitPrice }
          : o
        );
      }
      return [...prev, {
        inventoryId: item.id,
        name: item.name,
        sku: item.sku,
        barcode: item.barcode || '',
        qty,
        unitPrice: item.price,
        unit: item.unit,
        total: qty * item.price,
      }];
    });
  };

  const addManualItem = () => {
    if (!manualForm.name.trim() || !manualForm.price) return;
    const qty = Math.max(1, parseInt(manualForm.qty) || 1);
    const price = parseFloat(manualForm.price) || 0;
    setOrderItems(prev => [...prev, {
      inventoryId: null,
      name: manualForm.name.trim(),
      sku: 'MANUAL',
      barcode: notFoundBarcode || '',
      qty, unitPrice: price, unit: 'pcs',
      total: qty * price,
    }]);
    setNotFoundBarcode(null);
    setManualForm({ name: '', price: '', qty: '1' });
  };

  const updateQty = (idx, delta) => {
    setOrderItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      const newQty = Math.max(1, item.qty + delta);
      return { ...item, qty: newQty, total: newQty * item.unitPrice };
    }));
  };

  const removeItem = (idx) => setOrderItems(prev => prev.filter((_, i) => i !== idx));

  const subtotal = orderItems.reduce((s, i) => s + i.total, 0);
  const totalQty = orderItems.reduce((s, i) => s + i.qty, 0);

  const completeOrder = () => {
    if (!orderItems.length) return;
    const order = onCompleteOrder(orderItems, subtotal);
    setCompletedOrder(order);
  };

  if (completedOrder) {
    return (
      <BillView
        order={completedOrder}
        onClose={onClose}
        onNewOrder={() => { setOrderItems([]); setCompletedOrder(null); }}
      />
    );
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: 'var(--card)', borderRadius: 18, width: '100%', maxWidth: 640, maxHeight: '95vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', border: '1px solid var(--border)' }}>

        {/* Header */}
        <div style={{ padding: '16px 22px', background: 'linear-gradient(135deg,#059669,#047857)', borderRadius: '18px 18px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'white' }}>🛒 Create New Order</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
              {orderItems.length} item{orderItems.length !== 1 ? 's' : ''} · ₹{subtotal.toLocaleString('en-IN')}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: 'white', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ── Scan Section ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: 1 }}>Scan Product</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 15, pointerEvents: 'none' }}>🔍</span>
                <input
                  ref={barcodeRef}
                  value={barcodeInput}
                  onChange={e => setBarcodeInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && processBarcode(barcodeInput)}
                  placeholder="Scan barcode (USB/Bluetooth) or press Enter…"
                  style={{ ...INPUT, paddingLeft: 38, border: '2px solid var(--primary)', borderRadius: 10, fontSize: 14, fontFamily: 'var(--font-mono)', boxShadow: '0 0 0 3px rgba(139,92,246,0.12)' }}
                />
              </div>
              <button
                onClick={() => setShowCamera(c => !c)}
                title="Use phone camera to scan"
                style={{ padding: '0 14px', background: showCamera ? '#7c3aed' : 'var(--muted)', border: `2px solid ${showCamera ? '#7c3aed' : 'var(--border)'}`, borderRadius: 10, cursor: 'pointer', fontSize: 18, color: showCamera ? 'white' : 'var(--foreground)', flexShrink: 0 }}
              >📷</button>
            </div>
            {showCamera && (
              <CameraScanner onScan={processBarcode} onClose={() => setShowCamera(false)} />
            )}
            <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>
              USB/Bluetooth scanner → just scan. Phone camera → tap 📷
            </div>
          </div>

          {/* ── Not Found: Manual Entry ── */}
          {notFoundBarcode && (
            <div style={{ background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#c2410c', marginBottom: 12 }}>
                ⚠️ Barcode <code style={{ background: '#fee2e2', padding: '1px 6px', borderRadius: 4 }}>{notFoundBarcode}</code> not found — enter details manually:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input
                  placeholder="Product Name *"
                  value={manualForm.name}
                  onChange={e => setManualForm(f => ({ ...f, name: e.target.value }))}
                  style={{ ...INPUT, border: '1.5px solid #fed7aa', background: 'white' }}
                  autoFocus
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 8 }}>
                  <input
                    type="number" placeholder="Unit Price (₹) *" min="0"
                    value={manualForm.price}
                    onChange={e => setManualForm(f => ({ ...f, price: e.target.value }))}
                    style={{ ...INPUT, border: '1.5px solid #fed7aa', background: 'white' }}
                  />
                  <input
                    type="number" placeholder="Qty" min="1"
                    value={manualForm.qty}
                    onChange={e => setManualForm(f => ({ ...f, qty: e.target.value }))}
                    style={{ ...INPUT, border: '1.5px solid #fed7aa', background: 'white', textAlign: 'center' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={addManualItem}
                    style={{ flex: 1, padding: '9px 0', background: '#059669', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-sans)' }}
                  >✅ Add to Order</button>
                  <button
                    onClick={() => setNotFoundBarcode(null)}
                    style={{ padding: '9px 16px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-sans)', color: 'var(--foreground)' }}
                  >Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* ── Empty State ── */}
          {orderItems.length === 0 && !notFoundBarcode && (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--muted-foreground)' }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>🛒</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>Order is empty</div>
              <div style={{ fontSize: 13 }}>Scan a product barcode to add items</div>
            </div>
          )}

          {/* ── Order Items ── */}
          {orderItems.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                Order Items ({orderItems.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {orderItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--secondary)', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>₹{item.unitPrice.toLocaleString('en-IN')} / {item.unit}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <button onClick={() => updateQty(idx, -1)} style={{ width: 26, height: 26, border: '1px solid var(--border)', borderRadius: 6, background: 'var(--muted)', cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground)' }}>−</button>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, minWidth: 28, textAlign: 'center', fontSize: 14 }}>{item.qty}</span>
                      <button onClick={() => updateQty(idx, 1)} style={{ width: 26, height: 26, border: '1px solid var(--border)', borderRadius: 6, background: 'var(--muted)', cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground)' }}>+</button>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', minWidth: 80, textAlign: 'right', fontSize: 13 }}>₹{item.total.toLocaleString('en-IN')}</div>
                    <button onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 16, padding: '0 2px', lineHeight: 1 }}>🗑</button>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ marginTop: 10, padding: '12px 16px', background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 6 }}>
                  <span>{orderItems.length} product type{orderItems.length !== 1 ? 's' : ''}</span>
                  <span>{totalQty} total units</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 800 }}>
                  <span>Total</span>
                  <span style={{ color: '#059669', fontFamily: 'var(--font-mono)' }}>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {orderItems.length > 0 && (
          <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
            <button
              onClick={completeOrder}
              style={{ width: '100%', padding: '14px 0', background: 'linear-gradient(135deg,#059669,#047857)', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
            >
              ✅ Complete Order & Generate Bill
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
