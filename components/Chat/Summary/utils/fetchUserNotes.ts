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
    if (notesResult.success && notesResult.notes) {
      setNotes(notesResult.notes)
      localStorage.setItem(`notes-${pageId}`, notesResult.notes)
    }
  } catch (err) {
    console.error("Error fetching notes:", err)
  }
} 