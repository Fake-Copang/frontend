import { useEffect, useRef } from 'react'
import { useRoomStore } from '../store/useRoomStore'

export default function ExitDialog() {
  const open = useRoomStore((s) => s.exitOpen)
  const { closeExit, exitEdit } = useRoomStore.getState()
  const stayRef = useRef(null)

  useEffect(() => {
    if (!open) return
    stayRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && closeExit()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closeExit])

  if (!open) return null

  return (
    <div className="dialog-backdrop" onPointerDown={closeExit}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="exit-title" onPointerDown={(e) => e.stopPropagation()}>
        <h2 id="exit-title">저장하지 않고 나갈까요?</h2>
        <p>배치 중에 바꾼 내용이 모두 사라지고, 마지막으로 저장한 배치로 돌아가요.</p>
        <div className="dialog__actions">
          <button ref={stayRef} type="button" className="btn btn--outline" onClick={closeExit}>
            계속 배치하기
          </button>
          <button type="button" className="btn btn--danger" onClick={exitEdit}>
            저장 안 하고 나가기
          </button>
        </div>
      </div>
    </div>
  )
}
