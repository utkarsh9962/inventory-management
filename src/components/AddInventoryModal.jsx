import { useState, useEffect } from 'react';
import { CATEGORIES } from '../data/inventory';
import CameraScanner from './CameraScanner';

const UNITS = ['pcs', 'm', 'ft', 'set', 'pair', 'roll', 'gal', 'can', 'tube', 'pkg', 'pk', 'bag'];

const INPUT_STYLE = {
  width: '100%', padding: '9px 12px',
  background: 'var(--input)', border: '1.5px solid var(--border)',
  borderRadius: 8, fontSize: 13, color: 'var(--foreground)',
  outline: 'none', fontFamily: 'var(--font-sans)',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

function FormField({ label, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
        {label}{required && <span style={{ color: 'var(--destructive)', marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export default function AddInventoryModal({ onClose, onSave, editItem, prefillBarcode }) {
  const isEdit = !!editItem;
  const [showCamera, setShowCamera] = useState(false);

  const [form, setForm] = useState({
    name: '', category: 'fasteners', sku: '', barcode: prefillBarcode || '', quantity: '',
    minStock: '', price: '', unit: 'pcs', size: '', description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editItem) {
      setForm({
        name: editItem.name,
        category: editItem.category,
        sku: editItem.sku,
        barcode: editItem.barcode || '',
        quantity: String(editItem.quantity),
        minStock: String(editItem.minStock),
        price: String(editItem.price),
        unit: editItem.unit,
        size: editItem.size,
        description: editItem.description || '',
      });
    }
  }, [editItem]);

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.sku.trim()) e.sku = 'SKU is required';
    if (form.quantity === '' || isNaN(Number(form.quantity)) || Number(form.quantity) < 0) e.quantity = 'Valid quantity required';
    if (form.minStock === '' || isNaN(Number(form.minStock)) || Number(form.minStock) < 0) e.minStock = 'Valid min stock required';
    if (form.price === '' || isNaN(Number(form.price)) || Number(form.price) < 0) e.price = 'Valid price required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      ...(editItem || {}),
      name: form.name.trim(),
      category: form.category,
      sku: form.sku.trim().toUpperCase(),
      barcode: form.barcode.trim(),
      quantity: parseInt(form.quantity, 10),
      minStock: parseInt(form.minStock, 10),
      price: parseFloat(parseFloat(form.price).toFixed(2)),
      unit: form.unit,
      size: form.size.trim(),
      description: form.description.trim(),
    });
  };

  const focusStyle = (field) => ({
    ...INPUT_STYLE,
    borderColor: errors[field] ? 'var(--destructive)' : 'var(--border)',
  });

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="scale-in"
        style={{
          background: 'var(--card)', borderRadius: 16,
          width: '100%', maxWidth: 560,
          maxHeight: '92vh', overflow: 'auto',
          boxShadow: '0 24px 64px rgba(139,92,246,0.25)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'linear-gradient(135deg, var(--primary), #6d28d9)',
          borderRadius: '16px 16px 0 0',
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>
              {isEdit ? 'Edit Item' : 'Add New Item'}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
              {isEdit ? 'Update inventory item details' : 'Add a new item to your inventory'}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
              width: 30, height: 30, cursor: 'pointer', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
            }}
          >✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Add via Scanner button */}
          {!isEdit && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={() => setShowCamera(c => !c)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '10px 0', borderRadius: 10, cursor: 'pointer',
                  background: showCamera ? '#7c3aed' : 'var(--muted)',
                  border: `2px solid ${showCamera ? '#7c3aed' : 'var(--border)'}`,
                  color: showCamera ? 'white' : 'var(--foreground)',
                  fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-sans)',
                  transition: 'all 0.15s',
                }}
              >
                📷 {showCamera ? 'Close Camera' : 'Add via Scanner (USB / Camera)'}
              </button>
              {showCamera && (
                <CameraScanner
                  onScan={(code) => { set('barcode', code); setShowCamera(false); }}
                  onClose={() => setShowCamera(false)}
                />
              )}
              {showCamera && (
                <div style={{ fontSize: 11, color: 'var(--muted-foreground)', textAlign: 'center' }}>
                  Scan barcode to auto-fill the Barcode field — then fill in remaining details.
                </div>
              )}
              <div style={{ borderBottom: '1px solid var(--border)' }} />
            </div>
          )}

          {/* Row 1: Name */}
          <FormField label="Item Name" required>
            <input
              style={focusStyle('name')}
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Hex Bolt M8x40"
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = errors.name ? 'var(--destructive)' : 'var(--border)'}
            />
            {errors.name && <span style={{ fontSize: 11, color: 'var(--destructive)' }}>{errors.name}</span>}
          </FormField>

          {/* Row 2: SKU + Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="SKU" required>
              <input
                style={focusStyle('sku')}
                value={form.sku}
                onChange={e => set('sku', e.target.value)}
                placeholder="e.g. HB-M8-40"
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = errors.sku ? 'var(--destructive)' : 'var(--border)'}
              />
              {errors.sku && <span style={{ fontSize: 11, color: 'var(--destructive)' }}>{errors.sku}</span>}
            </FormField>

            <FormField label="Category" required>
              <select
                style={{ ...INPUT_STYLE, cursor: 'pointer' }}
                value={form.category}
                onChange={e => set('category', e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              >
                {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
            </FormField>
          </div>

          {/* Row: Barcode */}
          <FormField label="Barcode (optional)">
            <input
              style={INPUT_STYLE}
              value={form.barcode}
              onChange={e => set('barcode', e.target.value)}
              placeholder="Scan or type barcode number"
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </FormField>

          {/* Row 3: Quantity + Min Stock */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Quantity" required>
              <input
                type="number" min="0"
                style={focusStyle('quantity')}
                value={form.quantity}
                onChange={e => set('quantity', e.target.value)}
                placeholder="0"
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = errors.quantity ? 'var(--destructive)' : 'var(--border)'}
              />
              {errors.quantity && <span style={{ fontSize: 11, color: 'var(--destructive)' }}>{errors.quantity}</span>}
            </FormField>

            <FormField label="Min. Stock Level" required>
              <input
                type="number" min="0"
                style={focusStyle('minStock')}
                value={form.minStock}
                onChange={e => set('minStock', e.target.value)}
                placeholder="0"
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = errors.minStock ? 'var(--destructive)' : 'var(--border)'}
              />
              {errors.minStock && <span style={{ fontSize: 11, color: 'var(--destructive)' }}>{errors.minStock}</span>}
            </FormField>
          </div>

          {/* Row 4: Price + Unit */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Unit Price (₹)" required>
              <input
                type="number" min="0" step="0.01"
                style={focusStyle('price')}
                value={form.price}
                onChange={e => set('price', e.target.value)}
                placeholder="0.00"
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = errors.price ? 'var(--destructive)' : 'var(--border)'}
              />
              {errors.price && <span style={{ fontSize: 11, color: 'var(--destructive)' }}>{errors.price}</span>}
            </FormField>

            <FormField label="Unit">
              <select
                style={{ ...INPUT_STYLE, cursor: 'pointer' }}
                value={form.unit}
                onChange={e => set('unit', e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              >
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </FormField>
          </div>

          {/* Row 5: Size */}
          <FormField label="Size / Specification">
            <input
              style={INPUT_STYLE}
              value={form.size}
              onChange={e => set('size', e.target.value)}
              placeholder="e.g. M8 x 40mm, 3/4 inch, 25 ft"
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </FormField>

          {/* Row 6: Description */}
          <FormField label="Description">
            <textarea
              style={{ ...INPUT_STYLE, minHeight: 72, resize: 'vertical' }}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Brief product description..."
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </FormField>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button
              onClick={handleSubmit}
              style={{
                flex: 1, padding: '11px 0',
                background: 'linear-gradient(135deg, var(--primary), #6d28d9)',
                color: 'white', border: 'none', borderRadius: 8,
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {isEdit ? 'Save Changes' : 'Add to Inventory'}
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: '11px 0',
                background: 'var(--muted)', color: 'var(--foreground)',
                border: '1px solid var(--border)', borderRadius: 8,
                fontSize: 14, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--muted)'}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
