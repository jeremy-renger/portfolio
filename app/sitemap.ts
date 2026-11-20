import type { MetadataRoute } from 'next';
import { SITE } from '../lib/site';

const PAGES = ['', '/projects/spotify-audio-universe', '/projects/frequency-atlas', '/writing'];
const PAPERS = ['/papers/Renger_2026_Songs_vs_Genre.pdf', '/papers/Renger_2026_Frequency_Atlas_Source_Audit.pdf'];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...PAGES, ...PAPERS].map((path) => ({
    url: `${SITE.url}${path}`,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.8
  }));
}
