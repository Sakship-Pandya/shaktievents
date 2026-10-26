/**
 * Imports the client's own event photographs into public/work.
 *
 *   node scripts/import-work-photos.mjs ["path/to/source folder"]
 *
 * WhatsApp exports arrive as 58 files named by timestamp, up to 4000px and
 * 1.4 MB each. This resizes them to a 2400px long edge (the widest a hero is
 * ever drawn), strips metadata, gives each a descriptive file name, and writes
 * lib/work-photos-data.ts with the real dimensions and a tiny blur preview so
 * next/image can reserve space and paint something before the photo lands.
 *
 * Alt text and tags live by hand in lib/work-photos.ts — this script only owns
 * the pixels and the measurements. Re-running it is safe.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const sourceDir = path.resolve(root, process.argv[2] ?? 'Shiv Shakti events');
const outDir = path.join(root, 'public', 'work');
const dataFile = path.join(root, 'lib', 'work-photos-data.ts');

const LONG_EDGE = 2400;

/** Source file (sorted order in the export) → slug. `null` skips the file. */
const manifest = [
  ['WhatsApp Image 2026-09-15 at 12.19.19.jpeg', 'teal-frame-canopy-dining'],
  ['WhatsApp Image 2026-09-15 at 12.19.20 (1).jpeg', 'floral-arch-stage-pink'],
  ['WhatsApp Image 2026-09-15 at 12.19.20 (2).jpeg', 'banquet-aisle-floral-stage'],
  ['WhatsApp Image 2026-09-15 at 12.19.20 (3).jpeg', 'banquet-aisle-guests'],
  ['WhatsApp Image 2026-09-15 at 12.19.20.jpeg', 'draped-pandal-string-lights'],
  ['WhatsApp Image 2026-09-15 at 12.19.21 (1).jpeg', 'colour-drape-lounge'],
  ['WhatsApp Image 2026-09-15 at 12.19.21 (2).jpeg', 'draped-pandal-hall'],
  ['WhatsApp Image 2026-09-15 at 12.19.21 (3).jpeg', 'hanger-sofa-lounge'],
  ['WhatsApp Image 2026-09-15 at 12.19.21.jpeg', 'floor-seating-bolsters'],
  ['WhatsApp Image 2026-09-15 at 12.19.22.jpeg', 'venue-walkway-flowers'],
  ['WhatsApp Image 2026-09-15 at 12.19.24.jpeg', 'lawn-seating-carpet-aisle'],
  ['WhatsApp Image 2026-09-15 at 12.19.25 (1).jpeg', 'peacock-theme-stage'],
  ['WhatsApp Image 2026-09-15 at 12.19.25.jpeg', 'poolside-floral-walkway'],
  ['WhatsApp Image 2026-09-15 at 12.19.26 (1).jpeg', 'poolside-walkway-yellow'],
  // A couple's names on a sign — left out until the client confirms consent.
  ['WhatsApp Image 2026-09-15 at 12.19.26 (2).jpeg', null],
  ['WhatsApp Image 2026-09-15 at 12.19.26.jpeg', 'red-white-entry-stairs'],
  ['WhatsApp Image 2026-09-15 at 12.19.27.jpeg', 'floral-ring-stage-dusk'],
  ['WhatsApp Image 2026-09-15 at 12.19.28 (1).jpeg', 'lawn-stage-evening'],
  ['WhatsApp Image 2026-09-15 at 12.19.28 (2).jpeg', 'floral-wall-stage-lawn'],
  ['WhatsApp Image 2026-09-15 at 12.19.28 (3).jpeg', 'gold-dining-table'],
  ['WhatsApp Image 2026-09-15 at 12.19.28.jpeg', 'floral-stage-sunset'],
  ['WhatsApp Image 2026-09-15 at 12.19.29 (1).jpeg', 'lawn-dining-teal'],
  ['WhatsApp Image 2026-09-15 at 12.19.29.jpeg', 'lawn-round-tables-dusk'],
  ['WhatsApp Image 2026-09-15 at 12.19.30.jpeg', 'banquet-stage-pampas'],
  ['WhatsApp Image 2026-09-15 at 12.19.34 (1).jpeg', 'night-entrance-gate'],
  ['WhatsApp Image 2026-09-15 at 12.19.34.jpeg', 'fairy-light-tunnel'],
  ['WhatsApp Image 2026-09-15 at 12.19.35 (1).jpeg', 'purple-lit-entrance'],
  ['WhatsApp Image 2026-09-15 at 12.19.35 (2).jpeg', 'ivory-drape-gate-night'],
  ['WhatsApp Image 2026-09-15 at 12.19.35 (3).jpeg', 'drape-tunnel-chandeliers'],
  ['WhatsApp Image 2026-09-15 at 12.19.35.jpeg', 'lit-garden-entrance'],
  ['WhatsApp Image 2026-09-15 at 12.19.36 (1).jpeg', 'night-lawn-dining'],
  ['WhatsApp Image 2026-09-15 at 12.19.36 (2).jpeg', 'night-lawn-lounge'],
  ['WhatsApp Image 2026-09-15 at 12.19.36 (3).jpeg', 'venue-lawn-sofa-rows'],
  ['WhatsApp Image 2026-09-15 at 12.19.36.jpeg', 'floral-hanging-corridor'],
  ['WhatsApp Image 2026-09-15 at 12.19.37 (1).jpeg', 'poolside-lounge-day'],
  ['WhatsApp Image 2026-09-15 at 12.19.37 (2).jpeg', 'lotus-seat-floral-ring'],
  ['WhatsApp Image 2026-09-15 at 12.19.37 (3).jpeg', 'haldi-stage-yellow'],
  ['WhatsApp Image 2026-09-15 at 12.19.37.jpeg', 'poolside-vidhi-seating'],
  ['WhatsApp Image 2026-09-15 at 12.19.38 (1).jpeg', 'ceremony-chair-rows'],
  ['WhatsApp Image 2026-09-15 at 12.19.38 (2).jpeg', 'haldi-stage-lights'],
  ['WhatsApp Image 2026-09-15 at 12.19.38 (3).jpeg', 'night-catering-counters'],
  ['WhatsApp Image 2026-09-15 at 12.19.38.jpeg', 'haldi-floral-arch'],
  ['WhatsApp Image 2026-09-15 at 12.19.39 (1).jpeg', 'truss-canopy-dusk'],
  ['WhatsApp Image 2026-09-15 at 12.19.39 (2).jpeg', 'banquet-gold-table'],
  ['WhatsApp Image 2026-09-15 at 12.19.39 (3).jpeg', 'banquet-stage-globes'],
  ['WhatsApp Image 2026-09-15 at 12.19.39.jpeg', 'hanger-dining-hall'],
  ['WhatsApp Image 2026-09-15 at 12.19.40 (1).jpeg', 'banquet-aisle-sofas'],
  ['WhatsApp Image 2026-09-15 at 12.19.40 (2).jpeg', 'banquet-stage-gold'],
  ['WhatsApp Image 2026-09-15 at 12.19.40 (3).jpeg', 'tent-lounge-chandelier'],
  ['WhatsApp Image 2026-09-15 at 12.19.40.jpeg', 'banquet-aisle-lamps'],
  ['WhatsApp Image 2026-09-15 at 12.19.41 (1).jpeg', 'pink-pandal-ceremony'],
  ['WhatsApp Image 2026-09-15 at 12.19.41 (2).jpeg', 'pink-drape-entrance'],
  ['WhatsApp Image 2026-09-15 at 12.19.41.jpeg', 'grand-ground-dusk'],
  ['WhatsApp Image 2026-09-15 at 12.19.42 (1).jpeg', 'tent-lounge-portrait'],
  ['WhatsApp Image 2026-09-15 at 12.19.42 (2).jpeg', 'pink-pandal-aisle'],
  ['WhatsApp Image 2026-09-15 at 12.19.42 (3).jpeg', 'mandap-venue-wide'],
  ['WhatsApp Image 2026-09-15 at 12.19.42.jpeg', 'mandap-aisle-dusk'],
  ['WhatsApp Image 2026-09-15 at 12.19.43.jpeg', 'white-mandap-dusk'],
];

fs.mkdirSync(outDir, { recursive: true });

const entries = [];
let bytesIn = 0;
let bytesOut = 0;

for (const [file, slug] of manifest) {
  if (!slug) continue;
  const src = path.join(sourceDir, file);
  if (!fs.existsSync(src)) {
    console.warn(`  missing  ${file}`);
    continue;
  }

  const dest = path.join(outDir, `${slug}.jpg`);
  const info = await sharp(src)
    .rotate()
    .resize({ width: LONG_EDGE, height: LONG_EDGE, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(dest);

  const blur = await sharp(src)
    .rotate()
    .resize({ width: 16, height: 16, fit: 'inside' })
    .webp({ quality: 40 })
    .toBuffer();

  bytesIn += fs.statSync(src).size;
  bytesOut += info.size;
  entries.push({
    slug,
    width: info.width,
    height: info.height,
    blur: `data:image/webp;base64,${blur.toString('base64')}`,
  });
}

const body = entries
  .map((e) => `  '${e.slug}': { width: ${e.width}, height: ${e.height}, blur: '${e.blur}' },`)
  .join('\n');

fs.writeFileSync(
  dataFile,
  `// Generated by scripts/import-work-photos.mjs — do not edit by hand.\n` +
    `export const workPhotoData = {\n${body}\n} as const satisfies Record<string, { width: number; height: number; blur: string }>;\n\n` +
    `export type WorkPhotoSlug = keyof typeof workPhotoData;\n`,
);

const mb = (n) => (n / 1024 / 1024).toFixed(1);
console.log(
  `  photos   ${entries.length} written to public/work (${mb(bytesIn)} MB → ${mb(bytesOut)} MB)`,
);
