import { useEffect } from 'react'
import { useRoomStore } from '../store/useRoomStore'

export default function Toast() {
  const notice = useRoomStore((s) => s.notice)
  const clearNotice = useRoomStore((s) => s.clearNotice)

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(clearNotice, 2400)
    return () => clearTimeout(t)
  }, [notice, clearNotice])

  if (!notice) return null
  return (
    <div className="toast" role="status" key={notice.at}>
      {notice.text}
    </div>
  )
}
