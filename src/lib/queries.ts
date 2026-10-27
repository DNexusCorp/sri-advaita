import { client } from './sanity';

/* ─── Types ─────────────────────────────────────────────── */

export interface Course {
  _id: string;
  title: string;
  slug: { current: string };
  description: any[];           // Portable Text blocks
  featureImage?: {
    asset: { _ref: string };
    alt?: string;
  };
  duration: string;
  fees: string;
  order: number;
}

export interface Notice {
  _id: string;
  alertTitle: string;
  content: string;
  publishDate: string;
  isActive: boolean;
  priority: 'normal' | 'important' | 'urgent';
}

export interface GalleryImage {
  _key: string;
  asset: { _ref: string };
  alt?: string;
  caption?: string;
}

export interface Gallery {
  _id: string;
  eventName: string;
  slug?: { current: string };
  eventDate?: string;
  images: GalleryImage[];
  videoUrl?: string;
}

/* ─── Queries ───────────────────────────────────────────── */

export async function getCourses(): Promise<Course[]> {
  if (!client) return [];
  return client.fetch<Course[]>(
    `*[_type == "course"] | order(order asc) {
      _id, title, slug, description, featureImage, duration, fees, order
    }`
  );
}

export async function getNotices(): Promise<Notice[]> {
  if (!client) return [];
  return client.fetch<Notice[]>(
    `*[_type == "notice" && isActive == true] | order(publishDate desc) [0...10] {
      _id, alertTitle, content, publishDate, isActive, priority
    }`
  );
}

export async function getGalleries(): Promise<Gallery[]> {
  if (!client) return [];
  return client.fetch<Gallery[]>(
    `*[_type == "gallery"] | order(eventDate desc) {
      _id, eventName, slug, eventDate, images, videoUrl
    }`
  );
}
