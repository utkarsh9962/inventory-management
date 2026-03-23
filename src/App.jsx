import { useState, useEffect, useMemo } from 'react';
import { INITIAL_INVENTORY } from './data/inventory';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import InventoryCard, { ToolImage } from './components/InventoryCard';
import ItemDetailModal from './components/ItemDetailModal';
import AddInventoryModal from './components/AddInventoryModal';
import ExcelUploadModal from './components/ExcelUploadModal';
import ScannerModal from './components/ScannerModal';
import CreateOrderModal from './components/CreateOrderModal';
import OrderHistoryPage from './components/OrderHistoryPage';
import LandingHero from './components/LandingHero';
import { CATEGORY_STYLES } from './utils/toolIcons';
import { useIsMobile } from './hooks/useIsMobile';

const SORT_OPTIONS = [
  { value: 'name', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'qty-asc', label: 'Quantity: Low to High' },
  { value: 'qty-desc', label: 'Quantity: High to Low' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const DATA_VERSION = 'v2-inr';

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      // Reset if data version changed (e.g. currency migration)
      const ver = localStorage.getItem('hw_version');
      if (ver !== DATA_VERSION) {
        localStorage.setItem('hw_version', DATA_VERSION);
        localStorage.removeItem('hw_inventory');
        return initial;
      }
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default function App() {
  const [inventory, setInventory] = useLocalStorage('hw_inventory', INITIAL_INVENTORY);
  const [darkMode, setDarkMode] = useLocalStorage('hw_dark', false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [page, setPage] = useState('inventory'); // 'inventory' | 'orders'
  const [orders, setOrders] = useLocalStorage('hw_orders', []);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'out' | 'low' | 'in'

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Counts for sidebar
  const counts = useMemo(() => {
    const result = {};
    inventory.forEach(item => {
      result[item.category] = (result[item.category] || 0) + 1;
    });
    result.__outOfStock = inventory.filter(i => i.quantity === 0).length;
    result.__lowStock = inventory.filter(i => i.quantity > 0 && i.quantity <= i.minStock).length;
    result.__inStock = inventory.filter(i => i.quantity > i.minStock).length;
    return result;
  }, [inventory]);

  // Filtered & sorted items
  const filteredItems = useMemo(() => {
    let items = [...inventory];

    if (activeCategory !== 'all') {
      items = items.filter(i => i.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.sku.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.size.toLowerCase().includes(q) ||
        (i.description && i.description.toLowerCase().includes(q))
      );
    }

    if (stockFilter === 'out') items = items.filter(i => i.quantity === 0);
    if (stockFilter === 'low') items = items.filter(i => i.quantity > 0 && i.quantity <= i.minStock);
    if (stockFilter === 'in') items = items.filter(i => i.quantity > i.minStock);

    items.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'qty-asc': return a.quantity - b.quantity;
        case 'qty-desc': return b.quantity - a.quantity;
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        default: return 0;
      }
    });

    return items;
  }, [inventory, activeCategory, searchQuery, sortBy, stockFilter]);

  const totalValue = useMemo(() =>
    inventory.reduce((sum, i) => sum + i.quantity * i.price, 0), [inventory]);

  const STALE_DAYS = 7;
  const staleThreshold = Date.now() - STALE_DAYS * 24 * 60 * 60 * 1000;

  const outOfStock = inventory.filter(i => i.quantity === 0).length;
  const lowStock = inventory.filter(i => i.quantity > 0 && i.quantity <= i.minStock).length;
  const staleStock = inventory.filter(i => !i.lastUpdated || i.lastUpdated < staleThreshold).length;

  const handleBulkImport = (items, duplicateMode) => {
    const now = Date.now();
    setInventory(inv => {
      const existingSkus = new Map(inv.map(i => [i.sku, i]));
      let updated = [...inv];
      items.forEach(item => {
        if (existingSkus.has(item.sku)) {
          if (duplicateMode === 'overwrite') {
            updated = updated.map(i => i.sku === item.sku ? { ...i, ...item, id: i.id, lastUpdated: now } : i);
          }
          // skip mode: do nothing
        } else {
          updated.push({ ...item, id: now + Math.random(), lastUpdated: now });
        }
      });
      return updated;
    });
  };

  const handleSave = (item) => {
    const now = Date.now();
    if (item.id) {
      setInventory(inv => inv.map(i => i.id === item.id ? { ...item, lastUpdated: now } : i));
    } else {
      const newItem = { ...item, id: now, lastUpdated: now };
      setInventory(inv => [...inv, newItem]);
    }
    setShowAddModal(false);
    setEditItem(null);
  };

  const handleDelete = (id) => {
    setInventory(inv => inv.filter(i => i.id !== id));
    setSelectedItem(null);
  };

  const handleEdit = (item) => {
    setSelectedItem(null);
    setEditItem(item);
    setShowAddModal(true);
  };

  const isMobile = useIsMobile();

  const handleCompleteOrder = (orderItems, subtotal) => {
    const now = Date.now();
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const todayCount = orders.filter(o => o.id.includes(todayStr)).length;
    const orderId = `ORD-${todayStr}-${String(todayCount + 1).padStart(3, '0')}`;
    const order = {
      id: orderId,
      createdAt: now,
      items: orderItems,
      subtotal,
      itemCount: orderItems.length,
      totalQty: orderItems.reduce((s, i) => s + i.qty, 0),
    };
    setOrders(prev => [order, ...prev]);
    // Deduct stock for inventory items
    setInventory(inv => inv.map(item => {
      const ordered = orderItems.find(o => o.inventoryId === item.id);
      if (!ordered) return item;
      return { ...item, quantity: Math.max(0, item.quantity - ordered.qty), lastUpdated: now };
    }));
    return order;
  };

  const SELECT_STYLE = {
    padding: '7px 12px',
    background: 'var(--input)', border: '1.5px solid var(--border)',
    borderRadius: 8, fontSize: 13, color: 'var(--foreground)',
    cursor: 'pointer', outline: 'none', fontFamily: 'var(--font-sans)',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)', transition: 'background 0.3s, color 0.3s' }}>
      <Header
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onAddInventory={() => { setEditItem(null); setShowAddModal(true); }}
        onBulkUpload={() => setShowBulkModal(true)}
        onScannerOpen={() => setShowScanner(true)}
        onCreateOrder={() => setShowCreateOrder(true)}
        page={page}
        onNavigate={setPage}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
      />

      {/* Orders page */}
      {page === 'orders' && (
        <OrderHistoryPage orders={orders} />
      )}

      {page === 'inventory' && <>
      <LandingHero
        totalItems={inventory.length}
        outOfStock={outOfStock}
        lowStock={lowStock}
        totalValue={Math.round(totalValue)}
      />

      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', maxWidth: '100%' }}>
        {/* Sidebar / Category Filter */}
        <CategoryFilter
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
          counts={counts}
        />

        {/* Main content */}
        <main style={{ flex: 1, padding: isMobile ? '14px 12px' : '20px 24px', minWidth: 0 }}>
          {/* Toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 16, flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, fontSize: 13, color: 'var(--muted-foreground)', minWidth: 80 }}>
              <span style={{ fontWeight: 700, color: 'var(--foreground)' }}>{filteredItems.length}</span> items
            </div>

            {/* Stock filter chips */}
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {[
                { value: 'all', label: 'All' },
                { value: 'out', label: isMobile ? '⚠️' : '⚠️ Out' },
                { value: 'low', label: isMobile ? '⚡' : '⚡ Low' },
                { value: 'in', label: isMobile ? '✅' : 'In Stock' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setStockFilter(opt.value)}
                  style={{
                    padding: '5px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                    border: '1.5px solid var(--border)',
                    background: stockFilter === opt.value ? 'var(--primary)' : 'var(--muted)',
                    color: stockFilter === opt.value ? 'white' : 'var(--foreground)',
                    cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{ ...SELECT_STYLE, fontSize: 12, padding: '6px 10px' }}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* View toggle */}
            <div style={{ display: 'flex', border: '1.5px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
              {['grid', 'list'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    padding: '6px 11px', border: 'none', cursor: 'pointer',
                    background: viewMode === mode ? 'var(--primary)' : 'var(--muted)',
                    color: viewMode === mode ? 'white' : 'var(--foreground)',
                    fontSize: 14,
                  }}
                  title={mode === 'grid' ? 'Grid view' : 'List view'}
                >
                  {mode === 'grid' ? '⊞' : '☰'}
                </button>
              ))}
            </div>
          </div>

          {/* No results */}
          {filteredItems.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 20px',
              color: 'var(--muted-foreground)',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'var(--foreground)' }}>
                No items found
              </div>
              <div style={{ fontSize: 14 }}>
                Try adjusting your search or filters
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? 'repeat(2, 1fr)'
                : 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: isMobile ? 10 : 16,
            }}>
              {filteredItems.map(item => (
                <InventoryCard key={item.id} item={item} onClick={setSelectedItem} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredItems.map((item, idx) => (
                <ListRow key={item.id} item={item} idx={idx} onClick={setSelectedItem} />
              ))}
            </div>
          )}
        </main>
      </div>
      </>}

      {/* Modals */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showAddModal && (
        <AddInventoryModal
          onClose={() => { setShowAddModal(false); setEditItem(null); }}
          onSave={handleSave}
          editItem={editItem}
        />
      )}

      {showBulkModal && (
        <ExcelUploadModal
          onClose={() => setShowBulkModal(false)}
          onImport={handleBulkImport}
          existingSkus={new Set(inventory.map(i => i.sku))}
        />
      )}

      {showScanner && (
        <ScannerModal
          inventory={inventory}
          onClose={() => setShowScanner(false)}
          onUpdateQuantity={(id, newQty) => {
            setInventory(inv => inv.map(i =>
              i.id === id ? { ...i, quantity: newQty, lastUpdated: Date.now() } : i
            ));
          }}
        />
      )}

      {showCreateOrder && (
        <CreateOrderModal
          inventory={inventory}
          onClose={() => setShowCreateOrder(false)}
          onCompleteOrder={handleCompleteOrder}
        />
      )}
    </div>
  );
}

function ListRow({ item, onClick }) {
  const isOutOfStock = item.quantity === 0;
  const isLowStock = item.quantity > 0 && item.quantity <= item.minStock;
  const statusColor = isOutOfStock ? '#ef4444' : isLowStock ? '#f59e0b' : '#22c55e';
  const isMobile = window.innerWidth < 768;

  return (
    <div
      onClick={() => onClick(item)}
      className="fade-in"
      style={{
        display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 16,
        background: 'var(--card)', borderRadius: 10, padding: isMobile ? '10px 12px' : '12px 16px',
        border: `1.5px solid ${isOutOfStock ? '#fecaca' : isLowStock ? '#fde68a' : 'var(--border)'}`,
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      <ToolImage item={item} size={isMobile ? 30 : 36} />
      <div style={{ flex: 1, fontWeight: 600, fontSize: 13, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {item.name}
        {isMobile && (
          <div style={{ fontSize: 10, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', fontWeight: 400 }}>{item.sku}</div>
        )}
      </div>
      {!isMobile && (
        <>
          <div style={{ flex: '0 0 100px', fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{item.sku}</div>
          <div style={{ flex: '0 0 120px', fontSize: 12, color: 'var(--muted-foreground)' }}>{item.size}</div>
        </>
      )}
      <div style={{ flex: isMobile ? 'none' : 1, display: 'flex', alignItems: 'center', gap: 6 }}>
        {!isMobile && (
          <div style={{ flex: 1, height: 5, background: 'var(--border)', borderRadius: 3 }}>
            <div style={{
              height: '100%',
              width: `${Math.min((item.quantity / Math.max(item.quantity, item.minStock * 3, 1)) * 100, 100)}%`,
              background: statusColor, borderRadius: 3,
            }} />
          </div>
        )}
        <span style={{ fontSize: 12, fontWeight: 700, color: statusColor, fontFamily: 'var(--font-mono)', textAlign: 'right', whiteSpace: 'nowrap' }}>
          {item.quantity.toLocaleString('en-IN')} {item.unit}
        </span>
      </div>
      <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-mono)', textAlign: 'right', whiteSpace: 'nowrap' }}>
        ₹{item.price.toLocaleString('en-IN')}
      </div>
    </div>
  );
}
