import { readFileSync, writeFileSync } from 'fs';

const file = 'dist/index.html';
let html = readFileSync(file, 'utf8');

// Remove type="module" and crossorigin from inline script tags
// Safari on file:// blocks ES module scripts
html = html.replace(/<script type="module" crossorigin>/g, '<script>');
html = html.replace(/<script type="module">/g, '<script>');

// Remove crossorigin from any remaining script/link tags
html = html.replace(/ crossorigin/g, '');

writeFileSync(file, html, 'utf8');
console.log('✓ Patched dist/index.html for Safari file:// compatibility');
