import { useEffect } from 'react'
import { useRoomStore } from './store/useRoomStore'

export default function useShortcuts() {
  useEffect(() => {
    const onKey = (e) => {
      const s = useRoomStore.getState()
      if (s.mode !== 'edit' || s.exitOpen || s.drag) return
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea')) return
      const mod = e.ctrlKey || e.metaKey
      const key = e.key.toLowerCase()
      if (mod && key === 'z') {
        e.preventDefault()
        e.shiftKey ? s.redo() : s.undo()
      } else if (mod && key === 'y') {
        e.preventDefault()
        s.redo()
      } else if (!mod && key === 'r' && s.selectedId) {
        s.rotate(e.shiftKey ? -1 : 1)
      } else if ((key === 'delete' || key === 'backspace') && s.selectedId) {
        s.removeSelected()
      } else if (key === 'escape') {
        s.select(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
