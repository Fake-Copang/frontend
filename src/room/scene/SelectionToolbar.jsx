import { Html } from '@react-three/drei'
import { useRoomStore } from '../store/useRoomStore'
import { toolbarPosition } from './transforms'
import { BoxOutIcon, RotateLeftIcon, RotateRightIcon } from '../ui/Icons'

export default function SelectionToolbar() {
  const mode = useRoomStore((s) => s.mode)
  const drag = useRoomStore((s) => s.drag)
  const selectedId = useRoomStore((s) => s.selectedId)
  const placement = useRoomStore((s) => s.placements[s.selectedId])
  const item = useRoomStore((s) => s.items.find((i) => i.id === s.selectedId))
  const rotate = useRoomStore((s) => s.rotate)
  const removeSelected = useRoomStore((s) => s.removeSelected)

  if (mode !== 'edit' || drag || !selectedId || !placement || !item) return null

  return (
    <Html position={toolbarPosition(item, placement)} center zIndexRange={[100, 50]}>
      <div className="item-toolbar" onPointerDown={(e) => e.stopPropagation()}>
        {item.kind === 'floor' && (
          <>
            <button type="button" aria-label="왼쪽으로 90도 회전" onClick={() => rotate(-1)}>
              <RotateLeftIcon />
            </button>
            <button type="button" aria-label="오른쪽으로 90도 회전" onClick={() => rotate(1)}>
              <RotateRightIcon />
            </button>
            <span className="item-toolbar__divider" />
          </>
        )}
        <button type="button" className="item-toolbar__text" onClick={removeSelected}>
          <BoxOutIcon />
          목록으로 빼기
        </button>
      </div>
    </Html>
  )
}
