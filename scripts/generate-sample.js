/**
 * Run with: node scripts/generate-sample.js
 * Generates public/sample-inventory.xlsx
 */
import * as XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const HEADERS = [
  'Name', 'Category', 'SKU', 'Quantity', 'Min Stock',
  'Price (INR)', 'Unit', 'Size / Spec', 'Description',
];

const VALID_CATEGORIES = [
  'fasteners', 'hand-tools', 'power-tools', 'electrical',
  'plumbing', 'lumber', 'paint', 'safety', 'adhesives', 'measuring',
];

const INSTRUCTIONS = [
  '** INSTRUCTIONS **',
  `Valid categories: ${VALID_CATEGORIES.join(' | ')}`,
  '(Auto-generated — do not edit this row)',
  'Integer ≥ 0',
  'Integer ≥ 0',
  'Decimal ≥ 0',
  'pcs / m / ft / set / pair / roll / gal / can / tube / pkg / pk / bag',
  'e.g. M8x40, 12 inch, 4 Litre',
  'Short product description',
];

const SAMPLE_ROWS = [
  ['Round Head Screw M5x30',   'fasteners',   'RHS-M5-30', 1000, 200, 1.20,    'pcs',  'M5 x 30mm',      'Zinc-plated round head machine screw'],
  ['Spring Washer M8',         'fasteners',   'SW-M8',      500, 100, 0.60,    'pcs',  'M8',             'Split spring lock washer, galvanised'],
  ['Ball-Peen Hammer 500g',    'hand-tools',  'BPH-500',     15,   5, 380.00,  'pcs',  '500 g',          'Forged steel ball-peen hammer'],
  ['Pipe Wrench 14"',          'hand-tools',  'PW-14',       10,   3, 680.00,  'pcs',  '14 inch',        'Heavy-duty cast iron pipe wrench'],
  ['Bench Grinder 6"',         'power-tools', 'BG-6',         4,   2, 5500.00, 'pcs',  '6 inch / 150W',  'Double wheel bench grinder with eye shield'],
  ['Impact Driver 18V',        'power-tools', 'ID-18V',       3,   2, 6200.00, 'pcs',  '18V Cordless',   'Brushless impact driver, 200Nm torque'],
  ['3-Pin Plug Top 6A',        'electrical',  'PT-6A',       80,  20, 45.00,   'pcs',  '6A 240V',        'ISI marked 3-pin plug top'],
  ['Conduit Pipe 20mm (per m)','electrical',  'CP-20MM',    300,  50, 28.00,   'm',    '20mm dia',       'PVC electrical conduit pipe'],
  ['Gate Valve 3/4"',          'plumbing',    'GV-34',       18,   5, 520.00,  'pcs',  '3/4 inch',       'Cast iron gate valve, water supply'],
  ['CPVC Pipe 1" (per m)',     'plumbing',    'CPVC-1',     150,  40, 75.00,   'm',    '1 inch SDR 11',  'Hot & cold water CPVC pipe'],
  ['Teak Wood Plank 1"x6"',   'lumber',      'TWP-1X6',     30,   8, 1200.00, 'pcs',  '1x6 in, 6ft',    'Seasoned teak wood plank'],
  ['GI Sheet 4x8 18 Gauge',   'lumber',      'GIS-18G',     20,   5, 2800.00, 'pcs',  '4x8 ft, 18G',    'Galvanised iron sheet'],
  ['Enamel Paint 1L',         'paint',       'ENP-1L',      40,  10, 450.00,  'can',  '1 Litre',        'Gloss enamel paint, white'],
  ['Masking Tape 24mm',       'paint',       'MT-24MM',     60,  15, 85.00,   'roll', '24mm x 20m',     'Crepe paper masking tape for painting'],
  ['Ear Muffs (Noise)',       'safety',      'EM-NRR25',    20,   5, 750.00,  'pcs',  'NRR 25dB',       'Over-ear noise reduction muffs'],
  ['Reflective Safety Belt',  'safety',      'RSB-STD',     12,   4, 320.00,  'pcs',  'Universal',      'High-visibility reflective safety belt'],
  ['Pidilite Fevicol (500g)', 'adhesives',   'FEV-500G',    45,  10, 195.00,  'pcs',  '500 g',          'SH white adhesive for wood and furniture'],
  ['Dr. Fixit Waterproof (1L)','adhesives',  'DRF-1L',      30,   8, 380.00,  'can',  '1 Litre',        'Cementitious waterproofing compound'],
  ['Vernier Caliper 150mm',   'measuring',   'VC-150',      10,   2, 1200.00, 'pcs',  '150mm / 6in',    'Stainless steel vernier caliper, 0.02mm'],
  ['Chalk Line Reel 30m',     'measuring',   'CLR-30M',     15,   3, 350.00,  'pcs',  '30 m',           'Snap chalk line with extra chalk'],
];

function generate() {
  const wb = XLSX.utils.book_new();

  /* ── Sheet 1: Inventory Data ── */
  const wsData = [HEADERS, INSTRUCTIONS, ...SAMPLE_ROWS];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Column widths
  ws['!cols'] = [
    { wch: 30 }, // Name
    { wch: 16 }, // Category
    { wch: 14 }, // SKU
    { wch: 10 }, // Quantity
    { wch: 10 }, // Min Stock
    { wch: 13 }, // Price
    { wch: 8  }, // Unit
    { wch: 18 }, // Size
    { wch: 42 }, // Description
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Inventory');

  /* ── Sheet 2: Reference ── */
  const refData = [
    ['REFERENCE — Valid Values'],
    [],
    ['Category ID', 'Category Label', 'Example Items'],
    ['fasteners',   'Fasteners',       'Bolts, Screws, Nuts, Washers, Anchors'],
    ['hand-tools',  'Hand Tools',      'Hammers, Wrenches, Pliers, Saws, Knives'],
    ['power-tools', 'Power Tools',     'Drills, Angle Grinders, Circular Saws, Sanders'],
    ['electrical',  'Electrical',      'Wires, Switches, MCBs, Outlets, Conduits'],
    ['plumbing',    'Plumbing',        'Pipes, Valves, Elbows, PTFE Tape, Traps'],
    ['lumber',      'Lumber & Materials', 'Plywood, OSB, Timber, Cement Board, GI Sheet'],
    ['paint',       'Paint & Finishes','Emulsion, Enamel, Primer, Brushes, Rollers'],
    ['safety',      'Safety Equipment','Helmets, Goggles, Gloves, Masks, Vests'],
    ['adhesives',   'Adhesives & Sealants', 'Fevicol, Araldite, Silicone, PU Foam'],
    ['measuring',   'Measuring Tools', 'Tape Measures, Levels, Laser Levels, Calipers'],
    [],
    ['Unit', 'Meaning'],
    ['pcs',  'Pieces'],
    ['m',    'Metres'],
    ['ft',   'Feet'],
    ['set',  'Set/Kit'],
    ['pair', 'Pair'],
    ['roll', 'Roll'],
    ['can',  'Can/Tin'],
    ['tube', 'Tube'],
    ['pkg',  'Package'],
    ['pk',   'Pack'],
    ['bag',  'Bag'],
  ];
  const wsRef = XLSX.utils.aoa_to_sheet(refData);
  wsRef['!cols'] = [{ wch: 16 }, { wch: 22 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(wb, wsRef, 'Reference');

  const outPath = path.join(__dirname, '..', 'public', 'sample-inventory.xlsx');
  XLSX.writeFile(wb, outPath);
  console.log(`✅  Sample Excel created: ${outPath}`);
}

generate();
