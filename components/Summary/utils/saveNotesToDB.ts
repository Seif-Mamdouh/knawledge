import { saveUserNotes } from '@/app/actions/saveUserNotes'

interface SaveState {
  setIsSaving: (isSaving: boolean) => void;
  setSaveError: (error: string | null) => void;
}

export const saveNotesToDB = async (
  pageId: string,
  notes: string,
  { setIsSaving, setSaveError }: SaveState
) => {
  setIsSaving(true)
  setSaveError(null)
  
  try {
    const result = await saveUserNotes(pageId, notes)
    if (!result.success) {
      console.error("Error saving notes:", result.error);
      setSaveError(result.error || 'Failed to save notes')
    }
  } catch (err) {
    console.error("Exception saving notes:", err);
    setSaveError('Failed to save notes')
  } finally {
    setIsSaving(false)
  }
} 