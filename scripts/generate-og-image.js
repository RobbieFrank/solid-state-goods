import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const W = 1200;
const H = 630;
const BG = '#E4E3E0';
const INK = '#141414';

// SVG text overlay (right half)
const textSvg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .label { font-family: 'Courier New', Courier, monospace; font-size: 18px; letter-spacing: 0.2em; fill: ${INK}; opacity: 0.5; text-transform: uppercase; }
    .headline { font-family: Georgia, 'Times New Roman', serif; font-size: 56px; font-weight: bold; fill: ${INK}; }
    .sub { font-family: 'Courier New', Courier, monospace; font-size: 16px; letter-spacing: 0.2em; fill: ${INK}; opacity: 0.4; text-transform: uppercase; }
  </style>
  <!-- Top label -->
  <text x="560" y="220" class="label">Solid State Goods</text>
  <!-- Main headline — split across two lines -->
  <text x="560" y="308" class="headline">Precision products</text>
  <text x="560" y="378" class="headline">for serious humans.</text>
  <!-- Bottom label -->
  <text x="560" y="460" class="sub">Made in the USA · MMXXVI</text>
</svg>
`.trim();

// Background canvas
const bg = await sharp({
  create: { width: W, height: H, channels: 3, background: BG },
}).png();

// Product image: resize to ~500px wide, fit within left half with padding
const productBuf = await sharp(path.join(publicDir, 'anodized_black.png'))
  .resize({ width: 480, height: 550, fit: 'contain', background: BG })
  .png()
  .toBuffer();

// Text SVG → buffer
const textBuf = Buffer.from(textSvg);

await bg
  .composite([
    // Product photo: left side, vertically centred
    { input: productBuf, left: 30, top: Math.round((H - 550) / 2) },
    // Text overlay
    { input: textBuf, left: 0, top: 0 },
  ])
  .toFile(path.join(publicDir, 'og-image.png'));

console.log('✓ og-image.png written to public/');
