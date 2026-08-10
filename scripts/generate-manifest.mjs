import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const GALLERY_DIR = path.join(PUBLIC_DIR, 'gallery');
const MANIFEST_PATH = path.join(PUBLIC_DIR, 'manifest.json');

// Read existing manifest to preserve chapters
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

// Read all files in the gallery folder
const files = fs.readdirSync(GALLERY_DIR);

const gallery = files.map((file, index) => {
  const ext = path.extname(file).toLowerCase();
  const isVideo = ['.mp4', '.webm', '.mov'].includes(ext);
  
  return {
    id: `g${index.toString().padStart(3, '0')}`,
    url: `/gallery/${file}`,
    // Using the original url for thumb to keep it simple, since we don't have real thumbnails generated
    thumb: `/gallery/${file}`, 
    type: isVideo ? 'video' : 'image',
    // Distribute among the 12 chapters roughly equally
    chapter: (index % 12) + 1,
    caption: `Memory ${index + 1}`
  };
});

manifest.gallery = gallery;

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
console.log(`Generated manifest with ${gallery.length} gallery items.`);
