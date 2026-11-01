import { useRoomStore } from '../store/useRoomStore'
import { CheckIcon, PenIcon, RedoIcon, UndoIcon } from './Icons'

export default function TopBar() {
  const mode = useRoomStore((s) => s.mode)
  const canUndo = useRoomStore((s) => s.past.length > 0)
  const canRedo = useRoomStore((s) => s.future.length > 0)
  const saving = useRoomStore((s) => s.saving)
  const { enterEdit, undo, redo, requestExit, save } = useRoomStore.getState()

  if (mode === 'view') {
    return (
      <header className="topbar">
        <div className="topbar__group">
          <h1 className="topbar__title">내 방</h1>
          <span className="pill">배치 완료</span>
        </div>
        <button type="button" className="btn btn--primary" onClick={enterEdit}>
          <PenIcon />
          배치하기
        </button>
      </header>
    )
  }

  return (
    <header className="topbar">
      <div className="topbar__group">
        <button type="button" className="icon-btn" aria-label="되돌리기" disabled={!canUndo} onClick={undo}>
          <UndoIcon />
        </button>
        <button type="button" className="icon-btn" aria-label="다시하기" disabled={!canRedo} onClick={redo}>
          <RedoIcon />
        </button>
        <span className="pill pill--accent">배치 중</span>
      </div>
      <div className="topbar__group">
        <button type="button" className="btn btn--outline" onClick={requestExit}>
          나가기
        </button>
        <button type="button" className="btn btn--primary" onClick={save} disabled={saving}>
          <CheckIcon />
          {saving ? '저장 중…' : '저장'}
        </button>
      </div>
    </header>
  )
}
