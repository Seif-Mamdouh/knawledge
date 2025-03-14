import { getUserNotes } from '@/app/actions/getUserNotes'

interface NotesState {
  setNotes: (notes: string) => void;
}

export const fetchUserNotes = async (
  pageId: string,
  { setNotes }: NotesState
) => {
  try {
    const notesResult = await getUserNotes(pageId)
    if (notesResult.success && notesResult.content) {
      setNotes(notesResult.content)
      localStorage.setItem(`notes-${pageId}`, notesResult.content)
    }
  } catch (err) {
    console.error("Error fetching notes:", err)
  }
} 