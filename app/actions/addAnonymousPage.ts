'use server'

import prisma from '@/lib/prisma'
import { createPageSnapshot } from './createPageSnapshot'
import { v4 as uuidv4 } from 'uuid' 

async function extractTitle(url: string): Promise<string> {
  console.log('ANONYMOUS PAGE: extractTitle called for URL:', url);
  try {
    const response = await fetch(url);
    console.log('ANONYMOUS PAGE: Fetch response status:', response.status);
    const html = await response.text();
    
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : url;
    console.log('ANONYMOUS PAGE: Extracted title:', title);
    
    return title;
  } catch (error) {
    console.error('ANONYMOUS PAGE: Failed to extract title:', error);
    return url;
  }
}

export async function addAnonymousPage(url: string) {
  console.log('ANONYMOUS PAGE: addAnonymousPage called with URL:', url);
  
  if (!url) {
    console.error('ANONYMOUS PAGE: No URL provided');
    throw new Error('URL is required');
  }

  try {
    const anonymousId = uuidv4();
    console.log('ANONYMOUS PAGE: Generated ID:', anonymousId);
    
    const title = await extractTitle(url);
    console.log('ANONYMOUS PAGE: Title extracted:', title);

    // Create page with minimal fields
    let page;
    try {
      // Try with minimal fields first
      page = await prisma.page.create({
        data: {
          title: title,
          url: url,
          userId: null,
        },
      });
      
      // If successful, try to update with the anonymous fields
      try {
        await prisma.page.update({
          where: { id: page.id },
          data: { 
            anonymous: true,
            anonymousId: anonymousId 
          }
        });
        console.log('ANONYMOUS PAGE: Added anonymous fields successfully');
      } catch (updateError) {
        // If this fails, we'll still have a page, just without the anonymous flags
        console.warn('ANONYMOUS PAGE: Could not update with anonymous fields:', updateError);
      }
      
      console.log('ANONYMOUS PAGE: Page created successfully with ID:', page.id);
    } catch (pageError) {
      console.error('ANONYMOUS PAGE: Failed to create page in database:', pageError);
      return { success: false, error: `Page creation failed: ${String(pageError)}` };
    }
    
    // Continue with snapshot creation as before...
    try {
      const snapshot = await createPageSnapshot(page.id);
      console.log('ANONYMOUS PAGE: Snapshot created successfully');
    } catch (snapshotError) {
      console.error('ANONYMOUS PAGE: Failed to create snapshot:', snapshotError);
      return { success: true, page, warning: `Snapshot creation failed: ${String(snapshotError)}` };
    }

    return { success: true, page };
  } catch (error) {
    console.error('ANONYMOUS PAGE: Uncaught exception in addAnonymousPage:', error);
    return { success: false, error: String(error) };
  }
} 