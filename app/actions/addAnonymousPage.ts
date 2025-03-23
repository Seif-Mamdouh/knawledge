'use server'

import prisma from '@/lib/prisma'
import { createPageSnapshot } from './createPageSnapshot'
import { v4 as uuidv4 } from 'uuid' 
import { extractTitle } from './addPage'

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

    let page;
    try {
      page = await prisma.page.create({
        data: {
          title: title,
          url: url,
          userId: null,
        },
      });
      
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
        console.warn('ANONYMOUS PAGE: Could not update with anonymous fields:', updateError);
      }
      
      console.log('ANONYMOUS PAGE: Page created successfully with ID:', page.id);
    } catch (pageError) {
      console.error('ANONYMOUS PAGE: Failed to create page in database:', pageError);
      return { success: false, error: `Page creation failed: ${String(pageError)}` };
    }
    
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