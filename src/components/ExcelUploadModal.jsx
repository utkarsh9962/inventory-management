import { useState, useRef, useCallback } from 'react';
import { parseExcelFile, downloadTemplate } from '../utils/excelHelper';
import { CATEGORIES } from '../data/inventory';
import { CATEGORY_STYLES } from '../utils/toolIcons';

const STEPS = ['upload', 'preview', 'done'];

function StepIndicator({ step }) {
  const steps = [
    { id: 'upload',  label: 'Upload File' },
    { id: 'preview', label: 'Preview & Validate' },
    { id: 'done',    label: 'Import Complete' },
  ];
  const current = STEPS.indexOf(step);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24 }}>
      {steps.map((s, i) => (
        <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: i < current ? '#22c55e' : i === current ? 'var(--primary)' : 'var(--border)',
              color: i <= current ? 'white' : 'var(--muted-foreground)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, transition: 'all 0.3s',
            }}>
              {i < current ? '✓' : i + 1}
            </div>
            <span style={{
              fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap',
              color: i === current ? 'var(--primary)' : 'var(--muted-foreground)',
              textTransform: 'uppercase', letterSpacing: 0.5,
            }}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              flex: 1, height: 2, margin: '0 8px', marginBottom: 18,
              background: i < current ? '#22c55e' : 'var(--border)',
              transition: 'background 0.3s',
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

function DropZone({ onFile, isDragging, setIsDragging }) {
  const inputRef = useRef();

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }, [onFile, setIsDragging]);

  return (
    <div
      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border)'}`,
        borderRadius: 12,
        padding: '40px 20px',
        textAlign: 'center',
        cursor: 'pointer',
        background: isDragging ? 'var(--muted)' : 'var(--secondary)',
        transition: 'all 0.2s',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        style={{ display: 'none' }}
        onChange={e => { if (e.target.files[0]) onFile(e.target.files[0]); }}
      />
      <div style={{ fontSize: 48, marginBottom: 12 }}>
        {isDragging ? '📂' : '📊'}
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)', marginBottom: 6 }}>
        {isDragging ? 'Drop your file here' : 'Drag & drop your Excel file'}
      </div>
      <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginBottom: 16 }}>
        Supports .xlsx, .xls, .csv files
      </div>
      <span style={{
        display: 'inline-block', padding: '8px 20px',
        background: 'var(--primary)', color: 'white',
        borderRadius: 8, fontSize: 13, fontWeight: 600,
      }}>
        Browse File
      </span>
    </div>
  );
}

function ValidationBadge({ errors }) {
  if (errors.length === 0) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 8px', borderRadius: 12,
        background: '#f0fdf4', color: '#16a34a', fontSize: 11, fontWeight: 600,
      }}>✓ Valid</span>
    );
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 12,
      background: '#fef2f2', color: '#dc2626', fontSize: 11, fontWeight: 600,
      cursor: 'help',
    }} title={errors.join('\n')}>
      ⚠ {errors.length} error{errors.length > 1 ? 's' : ''}
    </span>
  );
}

export default function ExcelUploadModal({ onClose, onImport, existingSkus }) {
  const [step, setStep]         = useState('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [parsing, setParsing]   = useState(false);
  const [parseError, setParseError] = useState('');
  const [rows, setRows]         = useState([]);      // { data, errors, rowIndex }
  const [selected, setSelected] = useState(new Set());
  const [importedCount, setImportedCount] = useState(0);
  const [duplicateMode, setDuplicateMode] = useState('skip'); // 'skip' | 'overwrite'

  const validRows   = rows.filter(r => r.errors.length === 0);
  const invalidRows = rows.filter(r => r.errors.length > 0);

  // Rows that have SKU conflicts with existing inventory
  const skuConflicts = new Set(
    validRows.filter(r => existingSkus.has(r.data.sku)).map(r => r.data.sku)
  );

  const handleFile = async (file) => {
    setFileName(file.name);
    setParseError('');
    setParsing(true);
    try {
      const result = await parseExcelFile(file);
      setRows(result);
      const validIds = new Set(result.filter(r => r.errors.length === 0).map((_, i) => i));
      setSelected(validIds);
      setStep('preview');
    } catch (err) {
      setParseError(err.message);
    } finally {
      setParsing(false);
    }
  };

  const toggleRow = (idx) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const toggleAll = () => {
    const validIdxs = validRows.map((_, i) => rows.indexOf(validRows[i]));
    const allSelected = validIdxs.every(i => selected.has(i));
    setSelected(allSelected ? new Set() : new Set(validIdxs));
  };

  const handleImport = () => {
    const toImport = rows
      .filter((_, i) => selected.has(i) && rows[i].errors.length === 0)
      .map(r => ({ ...r.data, id: Date.now() + Math.random() }));
    onImport(toImport, duplicateMode);
    setImportedCount(toImport.length);
    setStep('done');
  };

  const selectedValidCount = [...selected].filter(i => rows[i]?.errors.length === 0).length;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 400,
        background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="scale-in"
        style={{
          background: 'var(--card)', borderRadius: 16,
          width: '100%', maxWidth: step === 'preview' ? 860 : 520,
          maxHeight: '92vh', overflow: 'auto',
          boxShadow: '0 24px 64px rgba(139,92,246,0.25)',
          border: '1px solid var(--border)',
          transition: 'max-width 0.3s ease',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #6d28d9, #1e40af)',
          borderRadius: '16px 16px 0 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 2 }}>
              📊 Bulk Upload via Excel
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
              Import multiple inventory items at once from an Excel or CSV file
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
            width: 30, height: 30, cursor: 'pointer', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          }}>✕</button>
        </div>

        <div style={{ padding: 24 }}>
          <StepIndicator step={step} />

          {/* ── STEP 1: Upload ── */}
          {step === 'upload' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Template download */}
              <div style={{
                background: 'var(--accent)', borderRadius: 10, padding: '12px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                border: '1px solid var(--border)',
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>
                    Need a template?
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
                    Download the Excel template with sample data and reference sheet
                  </div>
                </div>
                <button
                  onClick={() => import('../utils/excelHelper').then(m => m.downloadTemplate())}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', borderRadius: 8, flexShrink: 0,
                    background: 'var(--primary)', color: 'white',
                    border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  ⬇ Download Template
                </button>
              </div>

              <DropZone onFile={handleFile} isDragging={isDragging} setIsDragging={setIsDragging} />

              {parsing && (
                <div style={{ textAlign: 'center', padding: 16, color: 'var(--muted-foreground)', fontSize: 14 }}>
                  Parsing file...
                </div>
              )}
              {parseError && (
                <div style={{
                  background: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: 8, padding: '10px 14px',
                  fontSize: 13, color: '#dc2626',
                }}>
                  ⚠️ {parseError}
                </div>
              )}

              {/* Format guide */}
              <div style={{
                background: 'var(--muted)', borderRadius: 10, padding: '12px 16px',
                border: '1px solid var(--border)', fontSize: 12, color: 'var(--muted-foreground)',
              }}>
                <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--foreground)' }}>Expected columns:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px' }}>
                  {['Name *', 'Category *', 'SKU *', 'Quantity *', 'Min Stock *', 'Price (INR) *', 'Unit', 'Size / Spec', 'Description'].map(col => (
                    <span key={col} style={{
                      padding: '2px 8px', borderRadius: 4,
                      background: col.includes('*') ? 'var(--primary)' : 'var(--border)',
                      color: col.includes('*') ? 'white' : 'var(--foreground)',
                      fontSize: 11, fontFamily: 'var(--font-mono)',
                    }}>{col}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Preview ── */}
          {step === 'preview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Summary bar */}
              <div style={{
                display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
                padding: '12px 14px', background: 'var(--muted)', borderRadius: 10,
                border: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
                  File: <strong style={{ color: 'var(--foreground)' }}>{fileName}</strong>
                </span>
                <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                  <span style={{ padding: '3px 10px', borderRadius: 12, background: '#f0fdf4', color: '#16a34a', fontSize: 12, fontWeight: 600 }}>
                    ✓ {validRows.length} valid
                  </span>
                  {invalidRows.length > 0 && (
                    <span style={{ padding: '3px 10px', borderRadius: 12, background: '#fef2f2', color: '#dc2626', fontSize: 12, fontWeight: 600 }}>
                      ✗ {invalidRows.length} invalid
                    </span>
                  )}
                  {skuConflicts.size > 0 && (
                    <span style={{ padding: '3px 10px', borderRadius: 12, background: '#fffbeb', color: '#d97706', fontSize: 12, fontWeight: 600 }}>
                      ⚡ {skuConflicts.size} duplicate SKU{skuConflicts.size > 1 ? 's' : ''}
                    </span>
                  )}
                </span>
              </div>

              {/* Duplicate handling */}
              {skuConflicts.size > 0 && (
                <div style={{
                  padding: '10px 14px', background: '#fffbeb',
                  border: '1px solid #fde68a', borderRadius: 8,
                  display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
                }}>
                  <span style={{ fontSize: 13, color: '#92400e', fontWeight: 500 }}>
                    Duplicate SKUs found — how to handle?
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['skip', 'overwrite'].map(mode => (
                      <button key={mode} onClick={() => setDuplicateMode(mode)} style={{
                        padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                        border: '1.5px solid var(--border)', cursor: 'pointer',
                        background: duplicateMode === mode ? '#f59e0b' : 'white',
                        color: duplicateMode === mode ? 'white' : '#92400e',
                        fontFamily: 'var(--font-sans)',
                      }}>
                        {mode === 'skip' ? 'Skip duplicates' : 'Overwrite existing'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Table */}
              <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid var(--border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: 'var(--muted)' }}>
                      <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid var(--border)', width: 36 }}>
                        <input
                          type="checkbox"
                          checked={validRows.length > 0 && validRows.every((_, i) => selected.has(rows.indexOf(validRows[i])))}
                          onChange={toggleAll}
                          style={{ cursor: 'pointer', accentColor: 'var(--primary)' }}
                        />
                      </th>
                      <th style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid var(--border)', width: 36, color: 'var(--muted-foreground)' }}>Row</th>
                      {['Name', 'Category', 'SKU', 'Qty', 'Min', '₹ Price', 'Unit', 'Size', 'Status'].map(h => (
                        <th key={h} style={{
                          padding: '10px 8px', textAlign: 'left',
                          borderBottom: '1px solid var(--border)',
                          color: 'var(--muted-foreground)', fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => {
                      const isValid    = row.errors.length === 0;
                      const isDup      = isValid && skuConflicts.has(row.data.sku);
                      const isSelected = selected.has(i);
                      const cat        = CATEGORIES.find(c => c.id === row.data.category);
                      const catStyle   = CATEGORY_STYLES[row.data.category];

                      return (
                        <tr key={i} style={{
                          background: !isValid ? '#fef2f244'
                            : isDup ? '#fffbeb44'
                            : isSelected ? 'var(--muted)'
                            : 'transparent',
                          borderBottom: '1px solid var(--border)',
                          transition: 'background 0.15s',
                        }}>
                          <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={!isValid}
                              onChange={() => toggleRow(i)}
                              style={{ cursor: isValid ? 'pointer' : 'not-allowed', accentColor: 'var(--primary)' }}
                            />
                          </td>
                          <td style={{ padding: '8px 8px', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 11 }}>
                            {row.rowIndex}
                          </td>
                          <td style={{ padding: '8px 8px', fontWeight: 600, color: 'var(--foreground)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {row.data.name || <span style={{ color: '#dc2626' }}>—</span>}
                          </td>
                          <td style={{ padding: '8px 8px' }}>
                            {cat ? (
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                padding: '2px 7px', borderRadius: 10, fontSize: 10, fontWeight: 600,
                                background: catStyle ? `${catStyle.color}22` : 'var(--muted)',
                                color: catStyle?.color || 'var(--muted-foreground)',
                              }}>
                                {cat.icon} {cat.label}
                              </span>
                            ) : (
                              <span style={{ color: '#dc2626', fontSize: 11 }}>Invalid</span>
                            )}
                          </td>
                          <td style={{ padding: '8px 8px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted-foreground)' }}>
                            {row.data.sku || '—'}
                            {isDup && <span style={{ color: '#d97706', marginLeft: 4 }}>⚡</span>}
                          </td>
                          <td style={{ padding: '8px 8px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                            {row.data.quantity ?? <span style={{ color: '#dc2626' }}>—</span>}
                          </td>
                          <td style={{ padding: '8px 8px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                            {row.data.minStock ?? <span style={{ color: '#dc2626' }}>—</span>}
                          </td>
                          <td style={{ padding: '8px 8px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 600 }}>
                            {row.data.price != null ? `₹${row.data.price.toLocaleString('en-IN')}` : <span style={{ color: '#dc2626' }}>—</span>}
                          </td>
                          <td style={{ padding: '8px 8px', color: 'var(--muted-foreground)' }}>{row.data.unit || '—'}</td>
                          <td style={{ padding: '8px 8px', color: 'var(--muted-foreground)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {row.data.size || '—'}
                          </td>
                          <td style={{ padding: '8px 8px' }}>
                            <ValidationBadge errors={row.errors} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Invalid row details */}
              {invalidRows.length > 0 && (
                <div style={{
                  background: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: 8, padding: '12px 14px',
                  fontSize: 12, color: '#dc2626',
                }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>⚠️ Rows with errors (will not be imported):</div>
                  {invalidRows.slice(0, 5).map((r, i) => (
                    <div key={i} style={{ marginBottom: 3 }}>
                      Row {r.rowIndex}: {r.errors.join(' · ')}
                    </div>
                  ))}
                  {invalidRows.length > 5 && <div style={{ opacity: 0.7 }}>…and {invalidRows.length - 5} more</div>}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
                <button onClick={() => { setStep('upload'); setRows([]); }} style={{
                  padding: '10px 18px', background: 'var(--muted)',
                  color: 'var(--foreground)', border: '1px solid var(--border)',
                  borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}>
                  ← Back
                </button>
                <button
                  onClick={handleImport}
                  disabled={selectedValidCount === 0}
                  style={{
                    padding: '10px 22px',
                    background: selectedValidCount === 0
                      ? 'var(--border)'
                      : 'linear-gradient(135deg, #6d28d9, #1e40af)',
                    color: selectedValidCount === 0 ? 'var(--muted-foreground)' : 'white',
                    border: 'none', borderRadius: 8,
                    fontSize: 13, fontWeight: 700, cursor: selectedValidCount === 0 ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-sans)',
                    transition: 'opacity 0.15s',
                  }}
                >
                  Import {selectedValidCount > 0 ? `${selectedValidCount} Item${selectedValidCount > 1 ? 's' : ''}` : 'Selected'}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Done ── */}
          {step === 'done' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--foreground)', marginBottom: 8 }}>
                Import Successful!
              </div>
              <div style={{ fontSize: 15, color: 'var(--muted-foreground)', marginBottom: 24 }}>
                <strong style={{ color: 'var(--primary)', fontSize: 28 }}>{importedCount}</strong>
                <br/>item{importedCount !== 1 ? 's were' : ' was'} added to your inventory
              </div>
              <button
                onClick={onClose}
                style={{
                  padding: '11px 32px',
                  background: 'linear-gradient(135deg, #6d28d9, #1e40af)',
                  color: 'white', border: 'none', borderRadius: 8,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                View Inventory
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
