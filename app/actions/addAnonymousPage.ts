'use server'

import prisma from '@/lib/prisma'
import { createPageSnapshot } from './createPageSnapshot'
import { v4 as uuidv4 } from 'uuid' 
import { extractTitle } from './addPage'

export async function addAnonymousPage(url: string) {
  console.log('ANONYMOUS PAGE: addAnonymousPage called with URL:', url);
  
  if (!url) {
    console.error('ANONYMOUS PAGE: No URL provided');
    return { success: false, error: 'URL is required' };
  }

  try {
    const anonymousId = uuidv4();
    console.log('ANONYMOUS PAGE: Generated ID:', anonymousId);
    
    const title = await extractTitle(url);
    console.log('ANONYMOUS PAGE: Title extracted:', title);

    const page = await prisma.page.create({
      data: {
        title: title,
        url: url,
        userId: null,
        anonymous: true,
        anonymousId: anonymousId
      },
    });
    
    console.log('ANONYMOUS PAGE: Page created successfully');
    
    try {
      await createPageSnapshot(page.id);
      console.log('ANONYMOUS PAGE: Snapshot created successfully');
    } catch (snapshotError) {
      console.error('ANONYMOUS PAGE: Failed to create snapshot:', snapshotError);
      return { 
        success: false, 
        page, 
        warning: `Snapshot creation failed: ${String(snapshotError)}` 
      };
    }

    return { success: true, page };
  } catch (error) {
    console.error('ANONYMOUS PAGE: Error in addAnonymousPage:', error);
    return { success: false, error: String(error) };
  }
} 