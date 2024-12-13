export interface ImageVariation {
  name: string;
  width: number;
  height: number;
  slug: string;
  format: string;
  method: string;
}

export const variations: ImageVariation[] = [
  {
    name: 'webp',
    width: null,
    height: null,
    slug: '',
    format: 'webp',
    method: 'transform',
  },
  {
    name: 'large',
    width: 1400,
    height: null,
    slug: '_large',
    format: 'webp',
    method: 'resize',
  },
  {
    name: 'thumbnail',
    width: 650,
    height: null,
    slug: '_thn',
    format: 'webp',
    method: 'resize',
  },
  {
    name: 'og_image',
    width: 1200,
    height: 630,
    slug: '_og',
    format: 'webp',
    method: 'resize',
  },
  {
    name: 'album_cover',
    width: null,
    height: 300,
    slug: '_acover',
    format: 'webp',
    method: 'resize',
  },
  {
    name: 'story_cover',
    width: null,
    height: 300,
    slug: '_scover',
    format: 'webp',
    method: 'resize',
  },
];
