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
];
