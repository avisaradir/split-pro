/**
 * Generates every SplitPro app icon from one vector design.
 *
 * Design (Apple HIG › App icons): a coin split into two offset halves — the app's one job —
 * drawn as simple filled shapes with varied opacity on a solid gradient. No lettering, no
 * custom shadows or glows. Platform rules:
 * - iOS / iPadOS (`icons/ios`, apple-touch-icon): full-bleed square; the system masks corners.
 * - Browser tabs, Android "any", desktop installs: rounded square with transparent margin,
 *   because these surfaces don't mask.
 * - Android maskable: full-bleed; the glyph stays inside the 80% safe zone.
 *
 * Run with `node scripts/generate-icons.mjs` after editing the shapes below.
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import sharp from 'sharp';

const PUBLIC = path.resolve(import.meta.dirname, '..', 'public');

const LIGHT = {
  from: '#3a9bff',
  to: '#0a6ef0',
  front: '#ffffff',
  back: '#ffffff',
  backOpacity: 0.7,
};
const DARK = {
  from: '#2c2c2e',
  to: '#0c0c0d',
  front: '#0a84ff',
  back: '#0a84ff',
  backOpacity: 0.6,
};

// Two halves of a 300px-radius coin on a 1024 grid, pulled apart and offset to read as "split".
const GLYPH_HALVES = [
  { d: 'M512 212 A300 300 0 0 0 512 812 Z', dx: -24, dy: -28, role: 'front' },
  { d: 'M512 212 A300 300 0 0 1 512 812 Z', dx: 24, dy: 28, role: 'back' },
];

const glyph = (palette) =>
  GLYPH_HALVES.map(
    ({ d, dx, dy, role }) =>
      `<path d="${d}" transform="translate(${dx} ${dy})" fill="${palette[role]}"${
        'back' === role ? ` fill-opacity="${palette.backOpacity}"` : ''
      }/>`,
  ).join('');

const background = (palette, id) =>
  `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${palette.from}"/><stop offset="1" stop-color="${palette.to}"/></linearGradient></defs>`;

/** Full-bleed square (iOS masks it). */
const fullBleedSvg = (palette = LIGHT) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${background(palette, 'bg')}<rect width="1024" height="1024" fill="url(#bg)"/>${glyph(palette)}</svg>`;

/** Rounded square for surfaces that don't mask. `inset` is the transparent margin on a 1024 grid. */
const roundedSvg = (inset = 100, palette = LIGHT) => {
  const size = 1024 - 2 * inset;
  const radius = size * 0.225;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${background(palette, 'bg')}<clipPath id="c"><rect x="${inset}" y="${inset}" width="${size}" height="${size}" rx="${radius}"/></clipPath><g clip-path="url(#c)"><rect width="1024" height="1024" fill="url(#bg)"/><g transform="translate(${inset} ${inset}) scale(${size / 1024})">${glyph(palette)}</g></g></svg>`;
};

/** Circular icon (watch-style). */
const circleSvg = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${background(LIGHT, 'bg')}<circle cx="512" cy="512" r="512" fill="url(#bg)"/><g transform="translate(51.2 51.2) scale(0.9)">${glyph(LIGHT)}</g></svg>`;

/** Wide canvas (Windows splash/wide tiles, social banner): gradient fill with the icon centered. */
const wideSvg = (width, height, { title } = {}) => {
  const iconSize = Math.round(height * (title ? 0.42 : 0.6));
  const iconX = title
    ? Math.round(width / 2 - iconSize * 1.55)
    : Math.round((width - iconSize) / 2);
  const iconY = Math.round((height - iconSize) / 2);
  const scale = iconSize / 1024;
  const text = title
    ? `<text x="${iconX + iconSize * 1.2}" y="${height / 2}" dominant-baseline="central" font-family="-apple-system, 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif" font-weight="700" font-size="${Math.round(iconSize * 0.62)}" letter-spacing="-2" fill="#ffffff">${title}</text>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${background(LIGHT, 'bg')}<rect width="${width}" height="${height}" fill="url(#bg)"/><g transform="translate(${iconX} ${iconY}) scale(${scale})">${title ? roundedSvgInner() : glyph(LIGHT)}</g>${text}</svg>`;
};

// White rounded tile with the light glyph colors inverted, used next to the wordmark.
const roundedSvgInner = () =>
  `<rect width="1024" height="1024" rx="230" fill="#ffffff"/>${glyph({ front: '#0a6ef0', back: '#0a6ef0', backOpacity: 0.55 })}`;

/** Single-color glyph for Safari pinned tabs. */
const monochromeSvg = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${GLYPH_HALVES.map(
    ({ d, dx, dy }) => `<path d="${d}" transform="translate(${dx} ${dy})"/>`,
  ).join('')}</svg>`;

/** Tab favicon that follows the browser's light/dark appearance. */
const adaptiveFaviconSvg = () => {
  const inset = 0;
  const radius = 1024 * 0.225;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><style>.f{fill:${LIGHT.front}}.b{fill:${LIGHT.back};fill-opacity:${LIGHT.backOpacity}}.s1{stop-color:${LIGHT.from}}.s2{stop-color:${LIGHT.to}}@media (prefers-color-scheme: dark){.f{fill:${DARK.front}}.b{fill:${DARK.back};fill-opacity:${DARK.backOpacity}}.s1{stop-color:${DARK.from}}.s2{stop-color:${DARK.to}}}</style><defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="s1"/><stop offset="1" class="s2"/></linearGradient></defs><rect x="${inset}" y="${inset}" width="1024" height="1024" rx="${radius}" fill="url(#bg)"/>${GLYPH_HALVES.map(
    ({ d, dx, dy, role }) =>
      `<path d="${d}" transform="translate(${dx} ${dy})" class="${'front' === role ? 'f' : 'b'}"/>`,
  ).join('')}</svg>`;
};

const render = async (svg, width, height, file) => {
  await sharp(Buffer.from(svg), { density: 300 })
    .resize(width, height)
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, file));
};

const sizeOf = async (file) => {
  const { width, height } = await sharp(path.join(PUBLIC, file)).metadata();
  return { width: width ?? 0, height: height ?? 0 };
};

const pngsIn = (dir) =>
  readdirSync(path.join(PUBLIC, dir))
    .filter((name) => name.endsWith('.png'))
    .map((name) => path.join(dir, name));

const main = async () => {
  // Vector sources served as-is.
  writeFileSync(path.join(PUBLIC, 'logo.svg'), fullBleedSvg());
  writeFileSync(path.join(PUBLIC, 'icons/icon.svg'), adaptiveFaviconSvg());
  writeFileSync(path.join(PUBLIC, 'icons/icon-dark.svg'), fullBleedSvg(DARK));
  writeFileSync(path.join(PUBLIC, 'icons/safari-pinned-tab.svg'), monochromeSvg());

  // Full-bleed: iOS/iPadOS and maskable icons.
  const fullBleed = [...pngsIn('icons/ios'), 'icons/apple-touch-icon.png', 'logo.png'];
  // Rounded with margin: surfaces that show the image unmasked.
  const rounded = [
    ...pngsIn('icons/android'),
    ...pngsIn('manifest'),
    'icons/android-chrome-192x192.png',
    'icons/android-chrome-512x512.png',
  ];

  await Promise.all(
    fullBleed.map(async (file) => {
      const { width } = await sizeOf(file);
      await render(fullBleedSvg(), width, width, file);
    }),
  );
  await Promise.all(
    rounded.map(async (file) => {
      const { width } = await sizeOf(file);
      await render(roundedSvg(), width, width, file);
    }),
  );

  /* Windows tiles: plated tiles are full-bleed, unplated taskbar icons are rounded on
     a transparent canvas, and wide and splash tiles get the glyph on a gradient band. */
  await Promise.all(
    pngsIn('icons/windows11').map(async (file) => {
      const { width, height } = await sizeOf(file);
      if (width !== height) {
        await render(wideSvg(width, height), width, height, file);
        return;
      }
      await render(file.includes('unplated') ? roundedSvg(40) : fullBleedSvg(), width, width, file);
    }),
  );

  // Small browser favicons: rounded, no margin, so the glyph stays legible at 16px.
  await render(roundedSvg(0), 16, 16, 'icons/favicon-16x16.png');
  await render(roundedSvg(0), 32, 32, 'icons/favicon-32x32.png');
  await render(circleSvg(), 512, 512, 'logo_circle.png');
  await render(wideSvg(1200, 630, { title: 'SplitPro' }), 1200, 630, 'og_banner.png');

  const tmp = await Promise.all(
    [16, 32, 48].map(async (size) => {
      const file = path.join(PUBLIC, `favicon-${size}.tmp.png`);
      await sharp(Buffer.from(roundedSvg(0)), { density: 300 })
        .resize(size, size)
        .png()
        .toFile(file);
      return file;
    }),
  );
  execFileSync('magick', [...tmp, path.join(PUBLIC, 'favicon.ico')]);
  execFileSync('rm', tmp);

  console.info('Icons generated.');
};

await main();
