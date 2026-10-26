/**
 * Generates branded placeholder images for the sample projects.
 *
 * These are deliberately NOT stock photographs of weddings: a placeholder that
 * looks like a real photo of someone else's work is worse than an obvious one.
 * Each is a gradient in the Utsav palette with the word "Placeholder" on it, so
 * anything still unreplaced at launch is visible at a glance.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const OUT = 'public/placeholders';
const WIDTH = 1600;
const HEIGHT = 1067;

const PALETTE = [
  ['#7A1F2B', '#14100D'],
  ['#1F5F4A', '#14100D'],
  ['#9A2A38', '#2A2119'],
  ['#3A2E23', '#14100D'],
  ['#7A1F2B', '#3A2E23'],
  ['#1D1712', '#7A1F2B'],
];

function svg(index, label) {
  const [from, to] = PALETTE[index % PALETTE.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
    <pattern id="dots" width="56" height="56" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <circle cx="8" cy="8" r="2.3" fill="#C9A24E" opacity="0.22"/>
      <circle cx="36" cy="36" r="1.4" fill="#C9A24E" opacity="0.16"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#dots)"/>
  <rect x="60" y="60" width="${WIDTH - 120}" height="${HEIGHT - 120}" fill="none" stroke="#C9A24E" stroke-opacity="0.4" stroke-width="2"/>
  <text x="50%" y="47%" text-anchor="middle" font-family="Georgia, serif" font-size="64" fill="#FBF6EE" opacity="0.92">${label}</text>
  <text x="50%" y="56%" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="26" letter-spacing="6" fill="#F5B32B" opacity="0.9">PLACEHOLDER</text>
</svg>`;
}

await mkdir(OUT, { recursive: true });

const files = [];
const labels = [
  'Wedding mandap',
  'Katha pandal',
  'Garba ground',
  'Samuh lagan',
  'Sabha stage',
  'School function',
  'Before',
  'After',
];

for (const [i, label] of labels.entries()) {
  const name = `placeholder-${String(i + 1).padStart(2, '0')}.jpg`;
  const buffer = await sharp(Buffer.from(svg(i, label)))
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer();
  await writeFile(`${OUT}/${name}`, buffer);
  files.push({ name, label, width: WIDTH, height: HEIGHT, bytes: buffer.length });
}

console.log(`Wrote ${files.length} placeholders to ${OUT}/`);
for (const f of files) console.log(`  ${f.name}  ${f.label}  ${Math.round(f.bytes / 1024)} KB`);
