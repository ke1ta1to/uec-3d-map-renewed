import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://uec-3d-map.vercel.app' // 実際のデプロイURLに変更

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}