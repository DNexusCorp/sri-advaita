import { createClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || '';
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

/**
 * Create the Sanity client only if a projectId is configured.
 * When missing (e.g. first-time dev build), queries will return empty arrays
 * and components will fall back to hardcoded content.
 */
let client: SanityClient | null = null;

if (projectId) {
  client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: true,
  });
}

export { client };

/**
 * Generate an optimised WebP image URL from a Sanity image reference.
 * Returns an empty string if the client is not configured.
 */
export function urlForImage(source: SanityImageSource, width = 800): string {
  if (!client) return '';
  const builder = createImageUrlBuilder(client);
  return builder.image(source).width(width).format('webp').auto('format').url();
}
