/**
 * QR Code Generator — La Penzana del Merel
 * Generates SVG QR codes for tables 01–20
 * Output: public/qr/table-01.svg … table-20.svg
 *
 * Run: node scripts/generate-qr.mjs
 * Auto-runs before build (prebuild hook in package.json)
 */

import QRCode from 'qrcode';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'public', 'qr');
const BASE_URL = 'https://micmer-git.github.io/penzana-del-merel';
const MENU_PATH = '/menu/';
const TABLE_COUNT = 20;

// Ensure output directory exists
mkdirSync(OUTPUT_DIR, { recursive: true });

async function generateAll() {
  const results = [];

  for (let i = 1; i <= TABLE_COUNT; i++) {
    const tableId = `table-${String(i).padStart(2, '0')}`;
    const url = `${BASE_URL}${MENU_PATH}?table=${tableId}`;

    try {
      // Generate SVG QR code
      const svgString = await QRCode.toString(url, {
        type: 'svg',
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 300,
        color: {
          dark: '#1a3c28',  // deep alpine green
          light: '#f7f3ee', // warm background
        },
      });

      const svgPath = join(OUTPUT_DIR, `${tableId}.svg`);
      writeFileSync(svgPath, svgString, 'utf8');
      results.push({ tableId, url, status: 'ok' });
      process.stdout.write('.');
    } catch (err) {
      console.error(`\nError generating QR for ${tableId}:`, err.message);
      results.push({ tableId, url, status: 'error', error: err.message });
    }
  }

  console.log(`\n\nQR generation complete: ${results.filter(r => r.status === 'ok').length}/${TABLE_COUNT} files written to public/qr/`);

  // Write a manifest for reference
  const manifest = results.map(r => ({
    table: r.tableId,
    url: r.url,
    file: `public/qr/${r.tableId}.svg`,
    status: r.status,
  }));
  writeFileSync(join(OUTPUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  console.log('Manifest written to public/qr/manifest.json');
}

generateAll().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
