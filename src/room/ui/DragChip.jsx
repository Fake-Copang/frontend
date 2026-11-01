import { useEffect, useState } from 'react'
import { useRoomStore } from '../store/useRoomStore'

export default function DragChip() {
  const drag = useRoomStore((s) => s.drag)
  const name = useRoomStore((s) => s.items.find((i) => i.id === s.drag?.itemId)?.name)
  const [pos, setPos] = useState(null)

  useEffect(() => {
    if (!drag) {
      setPos(null)
      return
    }
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [Boolean(drag)])

  if (!drag || !pos || drag.target) return null
  return (
    <div className="drag-chip" style={{ left: pos.x + 14, top: pos.y + 14 }}>
      {name}
    </div>
  )
}
