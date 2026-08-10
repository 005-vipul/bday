// ─── Shared types for the story manifest ─────────────────────────────────────

export interface Chapter {
  id: number;
  title: string;
  text: string;
  /** Array of image/video URLs. Empty = show placeholder. */
  media: string[];
}

export interface GalleryItem {
  id: string;
  url: string;
  thumb: string;
  type: 'image' | 'video';
  chapter: number;
  caption: string;
}

export interface Manifest {
  chapters: Chapter[];
  gallery: GalleryItem[];
}
