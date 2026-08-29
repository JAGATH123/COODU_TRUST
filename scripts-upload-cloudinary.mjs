#!/usr/bin/env node
/**
 * Upload staged images to Cloudinary, then optionally rewrite pages to use them.
 *
 *   npm i cloudinary
 *   export CLOUDINARY_CLOUD_NAME=usq2sbox
 *   export CLOUDINARY_API_KEY=...
 *   export CLOUDINARY_API_SECRET=...
 *   node scripts-upload-cloudinary.mjs --dry     # report only, touches nothing
 *   node scripts-upload-cloudinary.mjs           # upload
 *   node scripts-upload-cloudinary.mjs --swap    # upload + rewrite HTML/CSS/JS
 *
 * Notes
 *  - Uploads the q95 master; public_id comes from UPLOAD-MANIFEST.csv and is stable,
 *    so re-running overwrites in place rather than creating duplicates.
 *  - deliver_w is per image and never exceeds the master's own width, so nothing is upscaled.
 */
import fs from 'node:fs';
import path from 'node:path';

const DRY  = process.argv.includes('--dry');
const SWAP = process.argv.includes('--swap');
const MANIFEST = 'cloudinary-upload/UPLOAD-MANIFEST.csv';

// Only these directories are part of the deployed site.
const WEB_DIRS = ['.', 'programs', 'programs/projects', 'assets/css', 'assets/js'];
const REWRITE_EXT = new Set(['.html', '.css', '.js']);
const SKIP_FILES = new Set(['photo-review.html']);

const { CLOUDINARY_CLOUD_NAME: CLOUD, CLOUDINARY_API_KEY: KEY, CLOUDINARY_API_SECRET: SECRET } = process.env;
if (!DRY && !(CLOUD && KEY && SECRET)) {
  console.error('Missing CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET');
  process.exit(1);
}

const rows = fs.readFileSync(MANIFEST, 'utf8').trim().split('\n').slice(1).map(l => {
  const c = l.split(',');
  return { public_id: c[0], file: c[1], web: c[2], master_px: c[3], deliver_w: +c[4], bytes: +c[5] };
});

const missing = rows.filter(r => !fs.existsSync(r.file));
if (missing.length) { console.error('MISSING FILES:'); missing.forEach(m => console.error('  ' + m.file)); process.exit(1); }

const ids = new Set();
for (const r of rows) {
  if (ids.has(r.public_id)) { console.error('DUPLICATE public_id: ' + r.public_id); process.exit(1); }
  ids.add(r.public_id);
}
console.log(`${rows.length} files, ${(rows.reduce((n, r) => n + r.bytes, 0) / 1e6).toFixed(1)} MB, all present, ids unique`);

// Collect the files we would rewrite, and prove every local reference is covered.
const targets = [];
for (const d of WEB_DIRS) {
  if (!fs.existsSync(d)) continue;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (!e.isFile() || SKIP_FILES.has(e.name)) continue;
    if (REWRITE_EXT.has(path.extname(e.name))) targets.push(path.join(d, e.name));
  }
}
const REF = /(?:\.\.\/)*\/?assets\/images\/([^"')\s]+\.(?:jpg|jpeg|png|webp))/g;
const referenced = new Set();
for (const f of targets) for (const m of fs.readFileSync(f, 'utf8').matchAll(REF)) referenced.add(m[1]);
const covered = new Set(rows.map(r => r.web.replace(/^assets\/images\//, '')));
const uncovered = [...referenced].filter(x => !covered.has(x));
if (uncovered.length) {
  console.warn(`\n${uncovered.length} local reference(s) NOT in the manifest — these stay local after --swap:`);
  uncovered.forEach(u => console.warn('  ' + u));
}

if (DRY) {
  console.log(`\nwould rewrite ${targets.length} files across ${WEB_DIRS.length} dirs`);
  rows.slice(0, 5).forEach(r => console.log(`  ${r.public_id}  (${r.master_px}, deliver w_${r.deliver_w})`));
  console.log(`  … and ${rows.length - 5} more`);
  console.log('\nDry run only. Nothing uploaded, nothing written.');
  process.exit(0);
}

const { v2: cloudinary } = await import('cloudinary');
cloudinary.config({ cloud_name: CLOUD, api_key: KEY, api_secret: SECRET, secure: true });

const done = [], failed = [];
for (const [i, r] of rows.entries()) {
  try {
    const res = await cloudinary.uploader.upload(r.file, {
      public_id: r.public_id, overwrite: true, invalidate: true,
      resource_type: 'image', unique_filename: false, use_filename: false,
    });
    done.push({ ...r, version: res.version });
    console.log(`  [${i + 1}/${rows.length}] OK   ${r.public_id}  v${res.version}`);
  } catch (e) {
    failed.push({ ...r, error: e.message });
    console.error(`  [${i + 1}/${rows.length}] FAIL ${r.public_id}: ${e.message}`);
  }
}
fs.writeFileSync('cloudinary-upload/UPLOAD-RESULT.json', JSON.stringify({ done, failed }, null, 1));
console.log(`\nuploaded ${done.length}, failed ${failed.length} -> cloudinary-upload/UPLOAD-RESULT.json`);
if (failed.length) { console.error('Not swapping while uploads are failing.'); process.exit(1); }
if (!SWAP) { console.log('Re-run with --swap to rewrite references.'); process.exit(0); }

// --- rewrite: one anchored regex per image, so ../../ can never be half-matched ---
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let touched = 0, subs = 0;
for (const f of targets) {
  let s = fs.readFileSync(f, 'utf8'); const before = s;
  for (const d of done) {
    const rel = d.web.replace(/^assets\/images\//, '');
    const url = `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_${d.deliver_w}/v${d.version}/${d.public_id}`;
    s = s.replace(new RegExp(`(?:\\.\\./)*\\/?assets\\/images\\/${esc(rel)}`, 'g'), () => { subs++; return url; });
  }
  if (s !== before) { fs.writeFileSync(f, s); touched++; }
}
console.log(`swapped ${subs} references across ${touched} files`);
const leftover = [];
for (const f of targets) for (const m of fs.readFileSync(f, 'utf8').matchAll(REF)) leftover.push(`${f}: ${m[1]}`);
console.log(leftover.length ? `\n${leftover.length} local reference(s) remain:\n  ${leftover.join('\n  ')}` : '\nno local assets/images references remain');
