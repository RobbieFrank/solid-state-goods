import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const W = 1200;
const H = 630;
const BG = '#E4E3E0';
const INK = '#141414';
const MUTED = '#5C6068';

// Right-half text left edge
const TX = 624;

// Vertical positions (SVG y = baseline)
const Y_BRAND    = 158;   // brand label baseline — visual top ~130px from canvas top
const Y_HEAD1    = 252;   // headline line 1 baseline
const Y_HEAD2    = 318;   // headline line 2 baseline (58px * 1.1 leading)
const BTN_TOP    = 382;   // CTA button top edge
const BTN_H      = 64;
const BTN_W      = 332;   // wide enough for "Explore products →" at 22px + 56px h-padding
const Y_BTN_TEXT = BTN_TOP + Math.round(BTN_H / 2) + 9; // vertically centred baseline
const Y_FOOTER   = H - 48; // footer baseline, ~48px from bottom

// Monospace and sans-serif font stacks — these are reliably present on macOS
const MONO = "'Menlo', 'Monaco', 'Courier New', monospace";
const SANS = "'Helvetica Neue', 'Arial', sans-serif";

const svgText = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">

  <!-- Brand label -->
  <text
    x="${TX}" y="${Y_BRAND}"
    font-family="${MONO}"
    font-size="22"
    font-weight="normal"
    fill="${MUTED}"
    letter-spacing="4.4"
  >SOLID STATE GOODS</text>

  <!-- Headline line 1 -->
  <text
    x="${TX}" y="${Y_HEAD1}"
    font-family="${SANS}"
    font-size="58"
    font-weight="700"
    fill="${INK}"
    letter-spacing="-1.16"
  >Precision products</text>

  <!-- Headline line 2 -->
  <text
    x="${TX}" y="${Y_HEAD2}"
    font-family="${SANS}"
    font-size="58"
    font-weight="700"
    fill="${INK}"
    letter-spacing="-1.16"
  >for serious humans.</text>

  <!-- CTA button background -->
  <rect
    x="${TX}" y="${BTN_TOP}"
    width="${BTN_W}" height="${BTN_H}"
    rx="8"
    fill="${INK}"
  />

  <!-- CTA button text — centred vertically in the rect, 28px left padding -->
  <text
    x="${TX + 28}" y="${Y_BTN_TEXT}"
    font-family="${SANS}"
    font-size="22"
    font-weight="600"
    fill="${BG}"
  >Explore products &#x2192;</text>

  <!-- Footer line -->
  <text
    x="${TX}" y="${Y_FOOTER}"
    font-family="${MONO}"
    font-size="16"
    font-weight="normal"
    fill="${MUTED}"
    letter-spacing="3.2"
  >MADE IN THE USA</text>

</svg>
`.trim();

// ── Product image ──────────────────────────────────────────────────────────────
// Resize to fit inside 480×480, preserving the original wood-grain background.
const productBuf = await sharp(path.join(publicDir, 'anodized_black.png'))
  .resize({ width: 480, height: 480, fit: 'inside' })
  .png()
  .toBuffer();

const { height: prodH } = await sharp(productBuf).metadata();
const prodLeft = 75;
const prodTop  = Math.round((H - prodH) / 2);

// ── Composite ─────────────────────────────────────────────────────────────────
// Start with a pure flat-fill background — no gradient, no tint, no alpha.
await sharp({
  create: { width: W, height: H, channels: 3, background: BG },
})
  .png()
  .composite([
    { input: productBuf, left: prodLeft, top: prodTop },
    { input: Buffer.from(svgText), left: 0, top: 0 },
  ])
  .toFile(path.join(publicDir, 'og-image.png'));

// Verify dimensions
const { width, height } = await sharp(path.join(publicDir, 'og-image.png')).metadata();
console.log(`✓ og-image.png written — ${width}×${height}`);
