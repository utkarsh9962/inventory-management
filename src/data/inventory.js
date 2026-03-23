export const CATEGORIES = [
  { id: 'all', label: 'All Items', icon: '🔧' },
  { id: 'fasteners', label: 'Fasteners', icon: '🔩' },
  { id: 'hand-tools', label: 'Hand Tools', icon: '🔨' },
  { id: 'power-tools', label: 'Power Tools', icon: '⚡' },
  { id: 'electrical', label: 'Electrical', icon: '💡' },
  { id: 'plumbing', label: 'Plumbing', icon: '🚿' },
  { id: 'lumber', label: 'Lumber & Materials', icon: '🪵' },
  { id: 'paint', label: 'Paint & Finishes', icon: '🎨' },
  { id: 'safety', label: 'Safety Equipment', icon: '🦺' },
  { id: 'adhesives', label: 'Adhesives & Sealants', icon: '🧴' },
  { id: 'measuring', label: 'Measuring Tools', icon: '📏' },
];

export const INITIAL_INVENTORY = [
  // Fasteners
  { id: 1,  name: 'Hex Bolt M8x40',          category: 'fasteners',   sku: 'HB-M8-40',    quantity: 500, minStock: 100, price: 2.00,    unit: 'pcs',  size: 'M8 x 40mm',      description: 'Stainless steel hex bolt, grade 8.8' },
  { id: 2,  name: 'Wood Screw 3x20',          category: 'fasteners',   sku: 'WS-3-20',     quantity: 0,   minStock: 200, price: 0.80,    unit: 'pcs',  size: '3 x 20mm',       description: 'Coarse thread zinc-plated wood screw' },
  { id: 3,  name: 'Hex Nut M8',               category: 'fasteners',   sku: 'HN-M8',       quantity: 12,  minStock: 100, price: 0.60,    unit: 'pcs',  size: 'M8',             description: 'Standard hex nut, zinc plated' },
  { id: 4,  name: 'Flat Washer M6',           category: 'fasteners',   sku: 'FW-M6',       quantity: 340, minStock: 150, price: 0.40,    unit: 'pcs',  size: 'M6',             description: 'DIN 125 flat washer' },
  { id: 5,  name: 'Drywall Screw 4x25',       category: 'fasteners',   sku: 'DS-4-25',     quantity: 8,   minStock: 300, price: 0.50,    unit: 'pcs',  size: '4 x 25mm',       description: 'Black phosphate drywall screw' },
  { id: 6,  name: 'Anchor Bolt M10',          category: 'fasteners',   sku: 'AB-M10',      quantity: 150, minStock: 50,  price: 18.00,   unit: 'pcs',  size: 'M10',            description: 'Concrete expansion anchor bolt' },

  // Hand Tools
  { id: 7,  name: 'Claw Hammer 16oz',         category: 'hand-tools',  sku: 'CH-16',       quantity: 24,  minStock: 5,   price: 450.00,  unit: 'pcs',  size: '16 oz',          description: 'Fiberglass handle claw hammer' },
  { id: 8,  name: 'Flathead Screwdriver Set', category: 'hand-tools',  sku: 'FSD-SET',     quantity: 0,   minStock: 5,   price: 320.00,  unit: 'set',  size: 'Assorted',       description: '6-piece flathead screwdriver set' },
  { id: 9,  name: 'Adjustable Wrench 12"',    category: 'hand-tools',  sku: 'AW-12',       quantity: 3,   minStock: 5,   price: 580.00,  unit: 'pcs',  size: '12 inch',        description: 'Chrome-plated adjustable wrench' },
  { id: 10, name: 'Needle Nose Pliers 7"',    category: 'hand-tools',  sku: 'NNP-7',       quantity: 18,  minStock: 5,   price: 380.00,  unit: 'pcs',  size: '7 inch',         description: 'Long-nose pliers with wire cutter' },
  { id: 11, name: 'Utility Knife',            category: 'hand-tools',  sku: 'UK-STD',      quantity: 35,  minStock: 10,  price: 180.00,  unit: 'pcs',  size: 'Standard',       description: 'Retractable utility knife with extra blades' },
  { id: 12, name: 'Hand Saw 20"',             category: 'hand-tools',  sku: 'HS-20',       quantity: 9,   minStock: 4,   price: 750.00,  unit: 'pcs',  size: '20 inch',        description: 'High-carbon steel hand saw, 8 TPI' },

  // Power Tools
  { id: 13, name: 'Cordless Drill 18V',       category: 'power-tools', sku: 'CD-18V',      quantity: 7,   minStock: 3,   price: 4500.00, unit: 'pcs',  size: '18V',            description: 'Brushless motor cordless drill with 2 batteries' },
  { id: 14, name: 'Circular Saw 7-1/4"',      category: 'power-tools', sku: 'CS-714',      quantity: 0,   minStock: 2,   price: 7800.00, unit: 'pcs',  size: '7-1/4 inch',     description: 'Corded circular saw, 15A motor' },
  { id: 15, name: 'Random Orbital Sander',    category: 'power-tools', sku: 'ROS-5',       quantity: 5,   minStock: 2,   price: 3200.00, unit: 'pcs',  size: '5 inch',         description: '5-inch random orbital sander with dust bag' },
  { id: 16, name: 'Angle Grinder 4.5"',       category: 'power-tools', sku: 'AG-45',       quantity: 4,   minStock: 2,   price: 2800.00, unit: 'pcs',  size: '4.5 inch',       description: '7.5A angle grinder with grinding disc' },
  { id: 17, name: 'Jigsaw Variable Speed',    category: 'power-tools', sku: 'JS-VS',       quantity: 2,   minStock: 2,   price: 4200.00, unit: 'pcs',  size: 'Standard',       description: 'Variable speed jigsaw with orbital action' },

  // Electrical
  { id: 18, name: 'Electrical Wire 12AWG',    category: 'electrical',  sku: 'EW-12AWG',    quantity: 500, minStock: 100, price: 42.00,   unit: 'm',    size: '12 AWG',         description: 'THHN copper wire, 12 AWG black' },
  { id: 19, name: 'Single Pole Switch',       category: 'electrical',  sku: 'SPS-15A',     quantity: 45,  minStock: 20,  price: 85.00,   unit: 'pcs',  size: '15A 240V',       description: 'Standard single-pole light switch, ISI marked' },
  { id: 20, name: 'ELCB/GFCI Outlet',        category: 'electrical',  sku: 'GFCI-20A',    quantity: 0,   minStock: 10,  price: 620.00,  unit: 'pcs',  size: '20A 240V',       description: 'Earth leakage circuit breaker outlet' },
  { id: 21, name: 'MCB 20A Single Pole',      category: 'electrical',  sku: 'CB-20A',      quantity: 30,  minStock: 10,  price: 450.00,  unit: 'pcs',  size: '20A',            description: 'Miniature circuit breaker, ISI marked' },
  { id: 22, name: 'Wire Connector Caps (pkg)',category: 'electrical',  sku: 'WCC-PKG',     quantity: 60,  minStock: 20,  price: 95.00,   unit: 'pkg',  size: 'Assorted',       description: 'Package of 100 assorted wire nuts' },

  // Plumbing
  { id: 23, name: 'UPVC Pipe 1/2" (per m)',   category: 'plumbing',    sku: 'PVC-12',      quantity: 200, minStock: 50,  price: 48.00,   unit: 'm',    size: '1/2 inch',       description: 'Class 4 UPVC pipe, ISI marked' },
  { id: 24, name: 'Copper Elbow 90° 3/4"',    category: 'plumbing',    sku: 'CE-90-34',    quantity: 5,   minStock: 20,  price: 145.00,  unit: 'pcs',  size: '3/4 inch',       description: '90-degree copper sweat elbow' },
  { id: 25, name: 'Ball Valve 1/2"',          category: 'plumbing',    sku: 'BV-12',       quantity: 22,  minStock: 8,   price: 420.00,  unit: 'pcs',  size: '1/2 inch',       description: 'Full port brass ball valve' },
  { id: 26, name: 'PTFE Tape (Teflon)',        category: 'plumbing',    sku: 'TT-STD',      quantity: 0,   minStock: 30,  price: 35.00,   unit: 'roll', size: '19mm x 10m',     description: 'Thread seal tape for plumbing joints' },
  { id: 27, name: 'P-Trap 1-1/2"',            category: 'plumbing',    sku: 'PT-112',      quantity: 14,  minStock: 5,   price: 195.00,  unit: 'pcs',  size: '1-1/2 inch',     description: 'PVC P-trap for sink drain' },

  // Lumber
  { id: 28, name: 'Pine Stud 2x4 (8ft)',      category: 'lumber',      sku: 'LBR-2X4-8',   quantity: 120, minStock: 30,  price: 380.00,  unit: 'pcs',  size: '2x4 x 8ft',      description: 'Kiln-dried pine lumber' },
  { id: 29, name: 'Plywood Sheet 4x8 3/4"',   category: 'lumber',      sku: 'PLY-48-34',   quantity: 3,   minStock: 10,  price: 3800.00, unit: 'pcs',  size: '4x8 ft, 19mm',   description: 'Sanded hardwood plywood sheet' },
  { id: 30, name: 'OSB Sheet 4x8 12mm',       category: 'lumber',      sku: 'OSB-48-12',   quantity: 40,  minStock: 10,  price: 2200.00, unit: 'pcs',  size: '4x8 ft, 12mm',   description: 'Oriented strand board' },
  { id: 31, name: 'Cement Board 3x5"',        category: 'lumber',      sku: 'CB-35',       quantity: 25,  minStock: 10,  price: 720.00,  unit: 'pcs',  size: '3x5 ft, 12mm',   description: 'Backer board for tile applications' },

  // Paint
  { id: 32, name: 'Interior Emulsion (4L)',   category: 'paint',       sku: 'ILP-4L',      quantity: 48,  minStock: 10,  price: 1400.00, unit: 'can',  size: '4 Litre',        description: 'Premium interior emulsion, white base' },
  { id: 33, name: 'Exterior Paint (4L)',       category: 'paint',       sku: 'EXP-4L',      quantity: 0,   minStock: 8,   price: 1800.00, unit: 'can',  size: '4 Litre',        description: 'Weather-shield exterior wall paint' },
  { id: 34, name: 'Paint Roller Kit',         category: 'paint',       sku: 'PRK-STD',     quantity: 20,  minStock: 5,   price: 350.00,  unit: 'set',  size: '9 inch',         description: '9-inch roller frame with 2 covers and tray' },
  { id: 35, name: 'Paint Brush 2.5"',         category: 'paint',       sku: 'PB-25',       quantity: 35,  minStock: 10,  price: 180.00,  unit: 'pcs',  size: '2.5 inch',       description: 'Angled sash brush, synthetic bristles' },
  { id: 36, name: 'Primer Spray (400ml)',      category: 'paint',       sku: 'PS-400ML',    quantity: 7,   minStock: 20,  price: 280.00,  unit: 'can',  size: '400 ml',         description: 'All-surface primer spray can' },

  // Safety
  { id: 37, name: 'Safety Goggles',           category: 'safety',      sku: 'SG-STD',      quantity: 30,  minStock: 10,  price: 250.00,  unit: 'pcs',  size: 'Universal',      description: 'IS 5983 impact-resistant safety goggles' },
  { id: 38, name: 'Work Gloves (pair)',        category: 'safety',      sku: 'WG-LG',       quantity: 0,   minStock: 15,  price: 220.00,  unit: 'pair', size: 'Large',          description: 'Leather palm work gloves' },
  { id: 39, name: 'Safety Helmet',            category: 'safety',      sku: 'HH-STD',      quantity: 12,  minStock: 5,   price: 680.00,  unit: 'pcs',  size: 'Adjustable',     description: 'IS 2925 safety helmet, vented' },
  { id: 40, name: 'N95 Dust Mask (5pk)',       category: 'safety',      sku: 'DM-N95-5',    quantity: 45,  minStock: 20,  price: 450.00,  unit: 'pk',   size: 'N95',            description: 'BIS-approved N95 respirators, 5-pack' },
  { id: 41, name: 'Safety Vest Hi-Vis',       category: 'safety',      sku: 'SV-HIV',      quantity: 3,   minStock: 5,   price: 380.00,  unit: 'pcs',  size: 'XL',             description: 'High-visibility safety vest, IS 15809' },

  // Adhesives
  { id: 42, name: 'Construction Adhesive',    category: 'adhesives',   sku: 'CA-TUBE',     quantity: 60,  minStock: 15,  price: 185.00,  unit: 'tube', size: '300 ml',         description: 'Heavy-duty construction adhesive (Fevibond/Araldite)' },
  { id: 43, name: 'Silicone Sealant (Clear)', category: 'adhesives',   sku: 'SC-CLR',      quantity: 0,   minStock: 10,  price: 160.00,  unit: 'tube', size: '300 ml',         description: 'Clear 100% silicone waterproof sealant' },
  { id: 44, name: 'Araldite 2-Part Epoxy',    category: 'adhesives',   sku: 'EP-5MIN',     quantity: 25,  minStock: 8,   price: 280.00,  unit: 'pcs',  size: '24 ml',          description: '5-minute 2-part epoxy adhesive syringe' },
  { id: 45, name: 'Expanding PU Foam (400ml)',category: 'adhesives',   sku: 'SFI-400ML',   quantity: 18,  minStock: 10,  price: 420.00,  unit: 'can',  size: '400 ml',         description: 'Expanding polyurethane foam sealant' },

  // Measuring
  { id: 46, name: 'Steel Tape Measure 7.5m',  category: 'measuring',   sku: 'TM-75',       quantity: 22,  minStock: 5,   price: 580.00,  unit: 'pcs',  size: '7.5 m',          description: 'Self-locking tape measure, magnetic hook' },
  { id: 47, name: 'Spirit Level 1200mm',      category: 'measuring',   sku: 'SL-1200',     quantity: 0,   minStock: 3,   price: 1400.00, unit: 'pcs',  size: '1200 mm',        description: 'Aluminum box level, 3 vials' },
  { id: 48, name: 'Combination Square 300mm', category: 'measuring',   sku: 'CS-300',      quantity: 10,  minStock: 4,   price: 950.00,  unit: 'pcs',  size: '300 mm',         description: 'Stainless steel combination square' },
  { id: 49, name: 'Laser Level (Self-Level)', category: 'measuring',   sku: 'LL-STD',      quantity: 4,   minStock: 2,   price: 3200.00, unit: 'pcs',  size: 'Standard',       description: 'Self-leveling cross-line laser level' },
  { id: 50, name: 'Electronic Stud Finder',   category: 'measuring',   sku: 'SF-DLX',      quantity: 6,   minStock: 3,   price: 1400.00, unit: 'pcs',  size: 'Standard',       description: 'Electronic stud finder with AC wire detection' },
];
