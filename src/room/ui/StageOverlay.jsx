import { useRoomStore } from '../store/useRoomStore'
import { REASON } from '../store/grid'
import { cameraApi } from '../scene/theme'
import { MinusIcon, PlusIcon, ResetIcon } from './Icons'

export default function StageOverlay() {
  const mode = useRoomStore((s) => s.mode)
  const drag = useRoomStore((s) => s.drag)

  let hint = '드래그: 시점 회전 · 휠: 확대/축소'
  let tone = ''
  if (mode === 'edit') hint = '물건 드래그: 칸 단위 이동 · 빈 곳 드래그: 시점 회전'
  if (drag?.moved && drag.target) {
    hint = drag.ok ? '여기에 놓을 수 있어요' : REASON[drag.reason]
    tone = drag.ok ? ' stage-hint--ok' : ' stage-hint--warn'
  } else if (drag?.moved && drag.reason === 'wallOnly') {
    hint = REASON.wallOnly
    tone = ' stage-hint--warn'
  }

  return (
    <>
      <div className={`stage-hint${tone}`} role="status">
        {hint}
      </div>
      <div className="zoom-controls">
        <button type="button" className="icon-btn" aria-label="확대" onClick={() => cameraApi.zoom(0.85)}>
          <PlusIcon />
        </button>
        <button type="button" className="icon-btn" aria-label="축소" onClick={() => cameraApi.zoom(1.18)}>
          <MinusIcon />
        </button>
        <button type="button" className="icon-btn" aria-label="시점 초기화" onClick={() => cameraApi.reset()}>
          <ResetIcon />
        </button>
      </div>
    </>
  )
}
