import type { MetadataRoute } from 'next'

/**
 * The authenticity verification pages are unlisted: they are only meant to be
 * reached by scanning the QR code on a physical product card, so they are kept
 * out of search results along with the protected lab-document route.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/verify', '/verify/', '/api/'],
    },
  }
}
