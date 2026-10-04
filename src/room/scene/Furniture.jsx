import { useState } from 'react'
import { Edges, Html, useCursor } from '@react-three/drei'
import { useRoomStore } from '../store/useRoomStore'
import { ACCENT, EDGE } from './theme'
import { floorSize, floorTransform, wallSize, wallTransform } from './transforms'

function Label({ y, text, active }) {
  return (
    <Html position={[0, y, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
      <span className={`scene-label${active ? ' scene-label--active' : ''}`}>{text}</span>
    </Html>
  )
}

function Piece({ item, placement }) {
  const mode = useRoomStore((s) => s.mode)
  const selected = useRoomStore((s) => s.selectedId === item.id)
  const startDrag = useRoomStore((s) => s.startDrag)
  const select = useRoomStore((s) => s.select)
  const [hover, setHover] = useState(false)
  useCursor(hover && mode === 'edit', 'grab', 'auto')

  const wall = item.kind === 'wall'
  const { position, rotationY } = wall ? wallTransform(item, placement) : floorTransform(item, placement)
  const size = wall ? wallSize(item) : floorSize(item)

  const onPointerDown = (e) => {
    if (e.button !== 0) return
    e.stopPropagation()
    if (mode === 'edit') startDrag(item.id)
    else select(item.id)
  }

  return (
    <group position={position} rotation-y={rotationY}>
      <mesh
        onPointerDown={onPointerDown}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHover(true)
        }}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial color={item.color} emissive={selected ? ACCENT : '#000000'} emissiveIntensity={selected ? 0.18 : 0} />
        <Edges color={selected ? ACCENT : EDGE} />
      </mesh>
      {!wall && item.height > 0.2 && (
        <mesh position={[0, item.height * 0.1, size[2] / 2 + 0.004]}>
          <planeGeometry args={[Math.max(size[0] - 0.3, 0.3), Math.min(0.08, item.height * 0.3)]} />
          <meshBasicMaterial color={EDGE} />
        </mesh>
      )}
      <Label y={wall ? 0 : item.height / 2 + 0.2} text={item.name} active={selected} />
    </group>
  )
}

export default function Furniture() {
  const items = useRoomStore((s) => s.items)
  const placements = useRoomStore((s) => s.placements)
  const drag = useRoomStore((s) => s.drag)

  return items.map((item) => {
    const placement = placements[item.id]
    if (!placement) return null
    if (drag?.itemId === item.id && drag.target) return null
    return <Piece key={item.id} item={item} placement={placement} />
  })
}
