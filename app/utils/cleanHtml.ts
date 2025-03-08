export function cleanHtml(rawHtml: string): string {
    try {
      let cleanedHtml = rawHtml
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<img[^>]*(?:width|height)="?[0-2][^"]*"?[^>]*>/gi, '')
        .replace(/<div[^>]*(?:ad-|ads-|advertisement)[^>]*>[\s\S]*?<\/div>/gi, '')
        .replace(/<p>\s*<\/p>/gi, '')
        .replace(/(\r\n|\n|\r){2,}/gm, '\n')
        .trim()
  
      return cleanedHtml
    } catch (error) {
      console.error('Failed to clean HTML:', error)
      throw new Error('Failed to clean HTML')
    }
  }
