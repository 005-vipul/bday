/**
 * convert-to-webp.mjs
 * Converts all images in public/gallery to WebP at max 1600px wide, quality 82.
 * Handles JPG, JPEG, PNG, GIF, and HEIC/HEIF.
 * Skips videos and already-converted files.
 * Updates public/manifest.json to point at .webp URLs.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GALLERY_DIR = path.join(__dirname, '../public/gallery');
const MANIFEST_PATH = path.join(__dirname, '../public/manifest.json');

const QUALITY = 82;
const MAX_WIDTH = 1600; // px — good for lightbox full-view; grid will display much smaller

const VIDEO_EXTS = new Set(['.mp4', '.webm', '.mov', '.avi', '.mkv']);

async function main() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (e) {
    console.error('❌ sharp not installed. Run: npm install sharp --save-dev');
    process.exit(1);
  }

  let heicDecode;
  try {
    heicDecode = (await import('heic-decode')).default;
  } catch (e) {
    console.warn('⚠️ heic-decode not found, HEIC files will fail');
  }

  const files = fs.readdirSync(GALLERY_DIR).filter(f => !fs.statSync(path.join(GALLERY_DIR, f)).isDirectory());
  const images = files.filter(f => {
    const ext = path.extname(f).toLowerCase();
    return !VIDEO_EXTS.has(ext) && ext !== '.webp'; // skip videos + already-converted
  });

  console.log(`\n🖼️  Found ${images.length} images to convert (${files.length - images.length} skipped — videos/webp)\n`);

  let converted = 0, skipped = 0, failed = 0;
  const failedFiles = [];

  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    const ext = path.extname(file).toLowerCase();
    const inputPath = path.join(GALLERY_DIR, file);
    const outputName = path.basename(file, ext) + '.webp';
    const outputPath = path.join(GALLERY_DIR, outputName);

    // Already done
    if (fs.existsSync(outputPath)) {
      skipped++;
      process.stdout.write(`\r  [${i + 1}/${images.length}] ⏭  Already done: ${outputName}            `);
      continue;
    }

    try {
      if (ext === '.heic' || ext === '.heif') {
         if(!heicDecode) throw new Error("heicDecode missing");
         const buffer = fs.readFileSync(inputPath);
         const { width, height, data } = await heicDecode({ buffer });
         // Create a new sharp instance from raw pixel data
         await sharp(data, { raw: { width, height, channels: 4 } })
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            .webp({ quality: QUALITY, effort: 4 })
            .toFile(outputPath);
      } else {
        await sharp(inputPath)
          .resize({ width: MAX_WIDTH, withoutEnlargement: true })
          .webp({ quality: QUALITY, effort: 4 }) // effort 4 = good speed/compression balance
          .toFile(outputPath);
      }

      converted++;
      const origSize = (fs.statSync(inputPath).size / 1024).toFixed(0);
      const newSize  = (fs.statSync(outputPath).size / 1024).toFixed(0);
      process.stdout.write(`\r  [${i + 1}/${images.length}] ✅ ${file.padEnd(50)} ${origSize}KB → ${newSize}KB`);
    } catch (err) {
      failed++;
      failedFiles.push(file);
      process.stdout.write(`\r  [${i + 1}/${images.length}] ❌ FAILED: ${file} — ${err.message.slice(0, 60)}`);
    }
  }

  console.log(`\n\n📊 Result: ${converted} converted, ${skipped} skipped, ${failed} failed`);
  if (failedFiles.length) {
    console.log('   Failed files:', failedFiles.join(', '));
  }

  // ── Update manifest.json ─────────────────────────────────────────────────────
  console.log('\n📝 Updating manifest.json...');
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

  let updatedCount = 0;
  manifest.gallery = manifest.gallery.map(item => {
    const updateUrl = (url) => {
      if (!url) return url;
      const basename = path.basename(url);
      const ext = path.extname(basename).toLowerCase();
      if (VIDEO_EXTS.has(ext) || ext === '.webp') return url; // keep videos/already-webp

      const webpName = path.basename(basename, ext) + '.webp';
      const webpPath = path.join(GALLERY_DIR, webpName);
      if (fs.existsSync(webpPath)) {
        return url.replace(basename, webpName);
      }
      return url; // fallback to original if conversion failed
    };

    const newUrl   = updateUrl(item.url);
    const newThumb = updateUrl(item.thumb);
    if (newUrl !== item.url || newThumb !== item.thumb) updatedCount++;
    return { ...item, url: newUrl, thumb: newThumb };
  });

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`✅ Manifest updated — ${updatedCount} items now pointing to .webp\n`);
}

main().catch(console.error);
