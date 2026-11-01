import { useEffect } from 'react'
import { useRoomStore } from './store/useRoomStore'
import useShortcuts from './useShortcuts'
import RoomScene from './scene/RoomScene'
import Sidebar from './ui/Sidebar'
import TopBar from './ui/TopBar'
import StageOverlay from './ui/StageOverlay'
import ExitDialog from './ui/ExitDialog'
import Toast from './ui/Toast'
import DragChip from './ui/DragChip'
import './room.css'

export default function RoomPage({ backHref = '/', onBack }) {
  const status = useRoomStore((s) => s.status)
  const error = useRoomStore((s) => s.error)
  const dragging = useRoomStore((s) => Boolean(s.drag))
  const load = useRoomStore((s) => s.load)

  useEffect(() => {
    load()
  }, [load])
  useShortcuts()

  if (status === 'loading') return <div className="room-page room-page--center">방을 불러오는 중…</div>
  if (status === 'error') {
    return (
      <div className="room-page room-page--center">
        <p>{error}</p>
        <button type="button" className="btn btn--outline" onClick={load}>
          다시 불러오기
        </button>
      </div>
    )
  }

  return (
    <div className={`room-page${dragging ? ' is-dragging' : ''}`}>
      <Sidebar backHref={backHref} onBack={onBack} />
      <main className="stage">
        <TopBar />
        <div className="stage__canvas">
          <RoomScene />
          <StageOverlay />
        </div>
      </main>
      <ExitDialog />
      <Toast />
      <DragChip />
    </div>
  )
}
