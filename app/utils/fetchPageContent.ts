export async function fetchPageContent(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    const html = await response.text()
    return html
  } catch (error) {
    console.error('Failed to fetch page content:', error)
    throw new Error('Failed to fetch page content')
  }
} 