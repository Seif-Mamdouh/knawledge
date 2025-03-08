import prisma from '@/lib/prisma'
import TurndownService from 'turndown'


export async function convertToMarkdown(pageSnapshotId: string) {
  try {
    const snapshot = await prisma.pageSnapShots.findUnique({
      where: { page_snapshot_id: pageSnapshotId }
    })

    if (!snapshot?.cleaned_html) {
      throw new Error('No cleaned HTML found')
    }

    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    })
    
    const markdown = turndownService.turndown(snapshot.cleaned_html)

    await prisma.markdown.update({
      where: { markdown_id: snapshot.markdown_id },
      data: {
        title: snapshot.title,
        content_md: markdown,
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to convert to markdown:', error)
    return { success: false, error: 'Failed to convert to markdown' }
  }
}