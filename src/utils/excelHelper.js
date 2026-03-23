import * as XLSX from 'xlsx';
import { CATEGORIES } from '../data/inventory';

export const EXCEL_COLUMNS = [
  { key: 'name',        header: 'Name',          required: true,  type: 'string'  },
  { key: 'category',   header: 'Category',       required: true,  type: 'category'},
  { key: 'sku',         header: 'SKU',            required: true,  type: 'string'  },
  { key: 'quantity',   header: 'Quantity',        required: true,  type: 'int'     },
  { key: 'minStock',   header: 'Min Stock',       required: true,  type: 'int'     },
  { key: 'price',      header: 'Price (INR)',     required: true,  type: 'float'   },
  { key: 'unit',        header: 'Unit',           required: false, type: 'string'  },
  { key: 'size',        header: 'Size / Spec',    required: false, type: 'string'  },
  { key: 'description', header: 'Description',   required: false, type: 'string'  },
];

const VALID_CATEGORIES = CATEGORIES.filter(c => c.id !== 'all').map(c => c.id);
const VALID_UNITS = ['pcs', 'm', 'ft', 'set', 'pair', 'roll', 'gal', 'can', 'tube', 'pkg', 'pk', 'bag'];

/** Parse an uploaded Excel/CSV file → array of { data, errors, rowIndex } */
export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

        if (rows.length < 2) {
          reject(new Error('File appears empty or has no data rows.'));
          return;
        }

        // Find header row (first row containing 'Name')
        let headerRowIdx = 0;
        for (let i = 0; i < Math.min(rows.length, 5); i++) {
          if (rows[i].some(cell => String(cell).trim().toLowerCase() === 'name')) {
            headerRowIdx = i;
            break;
          }
        }

        const headers = rows[headerRowIdx].map(h => String(h).trim().toLowerCase());

        // Map column positions
        const colMap = {};
        EXCEL_COLUMNS.forEach(col => {
          const idx = headers.findIndex(h =>
            h === col.header.toLowerCase() ||
            h === col.key.toLowerCase() ||
            h.includes(col.key.toLowerCase())
          );
          colMap[col.key] = idx;
        });

        const results = [];

        for (let r = headerRowIdx + 1; r < rows.length; r++) {
          const row = rows[r];

          // Skip blank rows and instruction rows
          const hasContent = row.some(cell => String(cell).trim() !== '');
          if (!hasContent) continue;
          const firstCell = String(row[0] || '').trim();
          if (firstCell.startsWith('**') || firstCell.startsWith('//') || firstCell.startsWith('#')) continue;

          const item = {};
          const errors = [];

          EXCEL_COLUMNS.forEach(col => {
            const idx = colMap[col.key];
            const raw = idx >= 0 ? String(row[idx] ?? '').trim() : '';

            if (col.required && !raw) {
              errors.push(`"${col.header}" is required`);
              return;
            }

            switch (col.type) {
              case 'int': {
                const v = parseInt(raw, 10);
                if (isNaN(v) || v < 0) errors.push(`"${col.header}" must be a non-negative integer (got "${raw}")`);
                else item[col.key] = v;
                break;
              }
              case 'float': {
                const v = parseFloat(raw);
                if (isNaN(v) || v < 0) errors.push(`"${col.header}" must be a non-negative number (got "${raw}")`);
                else item[col.key] = Math.round(v * 100) / 100;
                break;
              }
              case 'category': {
                const v = raw.toLowerCase().replace(/\s+/g, '-');
                if (!VALID_CATEGORIES.includes(v)) {
                  errors.push(`"${col.header}" must be one of: ${VALID_CATEGORIES.join(', ')} (got "${raw}")`);
                } else {
                  item[col.key] = v;
                }
                break;
              }
              default: {
                if (col.key === 'unit' && raw && !VALID_UNITS.includes(raw.toLowerCase())) {
                  item[col.key] = 'pcs'; // fallback
                } else {
                  item[col.key] = raw || (col.key === 'unit' ? 'pcs' : '');
                }
              }
            }
          });

          results.push({ data: item, errors, rowIndex: r + 1 });
        }

        resolve(results);
      } catch (err) {
        reject(new Error(`Failed to parse file: ${err.message}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/** Generate and download the Excel template */
export function downloadTemplate() {
  const HEADERS = EXCEL_COLUMNS.map(c => c.header);
  const INSTRUCTIONS = [
    '** INSTRUCTIONS — delete this row before uploading **',
    `Valid: ${VALID_CATEGORIES.join(' | ')}`,
    'Unique SKU code',
    'Integer ≥ 0',
    'Integer ≥ 0',
    'Decimal ≥ 0 (in ₹)',
    `Valid: ${VALID_UNITS.join(' | ')}`,
    'e.g. M8x40, 12 inch, 4 Litre',
    'Short product description',
  ];
  const SAMPLE = [
    ['Hex Bolt M10x50',    'fasteners',   'HB-M10-50', 300, 100, 2.50,   'pcs',  'M10 x 50mm',    'SS hex bolt grade 8.8'],
    ['Claw Hammer 500g',   'hand-tools',  'CH-500G',    20,   5, 420.00, 'pcs',  '500 g',         'Fibreglass handle claw hammer'],
    ['Angle Grinder 5"',   'power-tools', 'AG-5',        4,   2, 3200.00,'pcs',  '5 inch / 850W', 'Heavy duty angle grinder'],
    ['MCB 32A DP',         'electrical',  'MCB-32A-DP', 15,   5, 850.00, 'pcs',  '32A DP',        'Double pole miniature circuit breaker'],
    ['UPVC Elbow 90° 1"', 'plumbing',    'UE-90-1',    40,  10, 55.00,  'pcs',  '1 inch',        '90° UPVC pressure pipe elbow'],
    ['Pine Plank 1x4 6ft', 'lumber',     'PP-1X4-6',   50,  10, 380.00, 'pcs',  '1x4 in, 6ft',  'Kiln-dried pine plank'],
    ['Exterior Primer 4L', 'paint',      'EP-4L',       10,   4, 950.00, 'can',  '4 Litre',      'Alkyd exterior primer'],
    ['Safety Goggles IS',  'safety',     'SG-IS',       25,   8, 280.00, 'pcs',  'Universal',    'IS 5983 rated safety goggles'],
    ['Silicone White 300ml','adhesives', 'SW-300ML',    20,   6, 175.00, 'tube', '300 ml',       'White silicone sealant, kitchen & bath'],
    ['Digital Vernier 150mm','measuring','DV-150MM',     6,   2,1800.00, 'pcs',  '150mm / 0.01mm','Digital vernier caliper, stainless'],
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([HEADERS, INSTRUCTIONS, ...SAMPLE]);
  ws['!cols'] = [
    { wch: 28 }, { wch: 14 }, { wch: 14 }, { wch: 10 },
    { wch: 10 }, { wch: 13 }, { wch: 8  }, { wch: 18 }, { wch: 40 },
  ];
  XLSX.utils.book_append_sheet(wb, ws, 'Inventory');

  // Reference sheet
  const refData = [
    ['REFERENCE'],
    [],
    ['Category ID', 'Label', 'Examples'],
    ...VALID_CATEGORIES.map(id => {
      const cat = CATEGORIES.find(c => c.id === id);
      return [id, cat?.label || id, ''];
    }),
    [],
    ['Unit', 'Meaning'],
    ...VALID_UNITS.map(u => [u, '']),
  ];
  const wsRef = XLSX.utils.aoa_to_sheet(refData);
  wsRef['!cols'] = [{ wch: 14 }, { wch: 22 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, wsRef, 'Reference');

  XLSX.writeFile(wb, 'hardware-inventory-template.xlsx');
}
