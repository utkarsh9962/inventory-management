import {
  Wrench, Hammer, Ruler, Paintbrush, Zap, Droplets, Layers,
  Shield, FlaskConical, Settings2, Package, Power, Scissors,
  Target, ScanLine, ToggleLeft, Cpu, Gauge, Flame,
  HardHat, Eye, Hand, Wind, Drill, CircuitBoard,
} from 'lucide-react';

// Category → { Icon, gradient, bg }
export const CATEGORY_STYLES = {
  'fasteners':   { Icon: Settings2,    gradient: 'linear-gradient(135deg,#6d28d9,#4c1d95)', bg: '#f5f3ff', color: '#7c3aed' },
  'hand-tools':  { Icon: Hammer,       gradient: 'linear-gradient(135deg,#92400e,#78350f)', bg: '#fffbeb', color: '#b45309' },
  'power-tools': { Icon: Zap,          gradient: 'linear-gradient(135deg,#b45309,#92400e)', bg: '#fff7ed', color: '#c2410c' },
  'electrical':  { Icon: Zap,          gradient: 'linear-gradient(135deg,#1d4ed8,#1e40af)', bg: '#eff6ff', color: '#2563eb' },
  'plumbing':    { Icon: Droplets,     gradient: 'linear-gradient(135deg,#0e7490,#0369a1)', bg: '#ecfeff', color: '#0891b2' },
  'lumber':      { Icon: Layers,       gradient: 'linear-gradient(135deg,#15803d,#166534)', bg: '#f0fdf4', color: '#16a34a' },
  'paint':       { Icon: Paintbrush,   gradient: 'linear-gradient(135deg,#be185d,#9d174d)', bg: '#fdf2f8', color: '#db2777' },
  'safety':      { Icon: Shield,       gradient: 'linear-gradient(135deg,#dc2626,#b91c1c)', bg: '#fff1f2', color: '#ef4444' },
  'adhesives':   { Icon: FlaskConical, gradient: 'linear-gradient(135deg,#0f766e,#0d9488)', bg: '#f0fdfa', color: '#14b8a6' },
  'measuring':   { Icon: Ruler,        gradient: 'linear-gradient(135deg,#4338ca,#3730a3)', bg: '#eef2ff', color: '#6366f1' },
};

// Per-item icon override by SKU keyword or name keyword
export function getItemIcon(item) {
  const name = item.name.toLowerCase();
  const cat = item.category;

  // Power tools specifics
  if (cat === 'power-tools') {
    if (name.includes('drill'))   return { Icon: Settings2,    label: 'Drill' };
    if (name.includes('saw'))     return { Icon: Scissors,     label: 'Saw' };
    if (name.includes('sander'))  return { Icon: Cpu,          label: 'Sander' };
    if (name.includes('grinder')) return { Icon: Settings2,    label: 'Grinder' };
    if (name.includes('jigsaw'))  return { Icon: Scissors,     label: 'Jigsaw' };
    return { Icon: Power, label: 'Power Tool' };
  }

  // Hand tools specifics
  if (cat === 'hand-tools') {
    if (name.includes('hammer'))     return { Icon: Hammer,    label: 'Hammer' };
    if (name.includes('screwdriver'))return { Icon: Settings2, label: 'Screwdriver' };
    if (name.includes('wrench'))     return { Icon: Wrench,    label: 'Wrench' };
    if (name.includes('plier'))      return { Icon: Wrench,    label: 'Pliers' };
    if (name.includes('saw'))        return { Icon: Scissors,  label: 'Saw' };
    if (name.includes('knife'))      return { Icon: Scissors,  label: 'Knife' };
    return { Icon: Wrench, label: 'Tool' };
  }

  // Fasteners
  if (cat === 'fasteners') {
    if (name.includes('bolt'))   return { Icon: Settings2, label: 'Bolt' };
    if (name.includes('screw'))  return { Icon: Settings2, label: 'Screw' };
    if (name.includes('nut'))    return { Icon: Settings2, label: 'Nut' };
    if (name.includes('washer')) return { Icon: Settings2, label: 'Washer' };
    if (name.includes('anchor')) return { Icon: Settings2, label: 'Anchor' };
    return { Icon: Settings2, label: 'Fastener' };
  }

  // Electrical
  if (cat === 'electrical') {
    if (name.includes('wire'))    return { Icon: Zap,          label: 'Wire' };
    if (name.includes('switch'))  return { Icon: ToggleLeft,   label: 'Switch' };
    if (name.includes('elcb') || name.includes('gfci')) return { Icon: CircuitBoard, label: 'ELCB' };
    if (name.includes('mcb') || name.includes('breaker')) return { Icon: CircuitBoard, label: 'MCB' };
    if (name.includes('connector')) return { Icon: Zap,        label: 'Connector' };
    return { Icon: Zap, label: 'Electrical' };
  }

  // Plumbing
  if (cat === 'plumbing') {
    if (name.includes('pipe'))   return { Icon: Droplets,  label: 'Pipe' };
    if (name.includes('elbow'))  return { Icon: Droplets,  label: 'Elbow' };
    if (name.includes('valve'))  return { Icon: Gauge,     label: 'Valve' };
    if (name.includes('tape'))   return { Icon: Layers,    label: 'Tape' };
    if (name.includes('trap'))   return { Icon: Droplets,  label: 'Trap' };
    return { Icon: Droplets, label: 'Plumbing' };
  }

  // Lumber
  if (cat === 'lumber') {
    if (name.includes('plywood') || name.includes('osb') || name.includes('board'))
      return { Icon: Layers, label: 'Board' };
    return { Icon: Layers, label: 'Lumber' };
  }

  // Paint
  if (cat === 'paint') {
    if (name.includes('brush'))  return { Icon: Paintbrush, label: 'Brush' };
    if (name.includes('roller')) return { Icon: Paintbrush, label: 'Roller' };
    if (name.includes('spray') || name.includes('primer')) return { Icon: Wind, label: 'Spray' };
    return { Icon: Paintbrush, label: 'Paint' };
  }

  // Safety
  if (cat === 'safety') {
    if (name.includes('goggle') || name.includes('eye')) return { Icon: Eye,    label: 'Goggles' };
    if (name.includes('glove'))  return { Icon: Hand,     label: 'Gloves' };
    if (name.includes('helmet') || name.includes('hard hat')) return { Icon: HardHat, label: 'Helmet' };
    if (name.includes('mask'))   return { Icon: Wind,     label: 'Mask' };
    if (name.includes('vest'))   return { Icon: Shield,   label: 'Vest' };
    return { Icon: Shield, label: 'Safety' };
  }

  // Adhesives
  if (cat === 'adhesives') {
    if (name.includes('foam'))   return { Icon: Flame,       label: 'Foam' };
    if (name.includes('epoxy'))  return { Icon: FlaskConical,label: 'Epoxy' };
    return { Icon: FlaskConical, label: 'Adhesive' };
  }

  // Measuring
  if (cat === 'measuring') {
    if (name.includes('tape'))   return { Icon: Ruler,    label: 'Tape' };
    if (name.includes('level'))  return { Icon: Gauge,    label: 'Level' };
    if (name.includes('laser'))  return { Icon: Target,   label: 'Laser' };
    if (name.includes('stud'))   return { Icon: ScanLine, label: 'Stud Finder' };
    if (name.includes('square')) return { Icon: Ruler,    label: 'Square' };
    return { Icon: Ruler, label: 'Measuring' };
  }

  return { Icon: Package, label: 'Item' };
}
