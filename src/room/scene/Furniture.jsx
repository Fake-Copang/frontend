import { Suspense, useState } from 'react'
import { Edges, Html, useCursor } from '@react-three/drei'
import { useRoomStore } from '../store/useRoomStore'
import { childrenOf, elevationOf } from '../store/grid'
import { ACCENT, EDGE } from './theme'
import { floorSize, floorTransform, wallSize, wallTransform } from './transforms'
import Model from './Model'

function Label({ y, text, active }) {
  return (
    <Html position={[0, y, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
      <span className={`scene-label${active ? ' scene-label--active' : ''}`}>{text}</span>
    </Html>
  )
}

function Piece({ item, placement, elevation }) {
  const mode = useRoomStore((s) => s.mode)
  const selected = useRoomStore((s) => s.selectedId === item.id)
  const startDrag = useRoomStore((s) => s.startDrag)
  const select = useRoomStore((s) => s.select)
  const [hover, setHover] = useState(false)
  useCursor(hover && mode === 'edit', 'grab', 'auto')

  const wall = item.kind === 'wall'
    const { position, rotationY } = wall ? wallTransform(item, placement) : floorTransform(item, placement, elevation)
  const size = wall ? wallSize(item) : floorSize(item)

  const onPointerDown = (e) => {
    if (e.button !== 0) return
    e.stopPropagation()
    if (mode === 'edit') startDrag(item.id)
    else select(item.id)
  }

  const handlers = {
    onPointerDown,
    onPointerOver: (e) => {
      e.stopPropagation()
      setHover(true)
    },
    onPointerOut: () => setHover(false),
  }

  const box = (
    <mesh>
      <boxGeometry args={size} />
      <meshStandardMaterial color={item.color} emissive={selected ? ACCENT : '#000000'} emissiveIntensity={selected ? 0.18 : 0} />
      <Edges color={selected ? ACCENT : EDGE} />
    </mesh>
  )

  return (
    <group position={position} rotation-y={rotationY}>
      {item.model ? (
        <group {...handlers}>
          <Suspense fallback={box}>
            <Model url={item.model} size={size} />
          </Suspense>
          {(selected || (hover && mode === 'edit')) && (
            <mesh>
              <boxGeometry args={size} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
              <Edges color={selected ? ACCENT : EDGE} />
            </mesh>
          )}
        </group>
      ) : (
        <>
          <group {...handlers}>{box}</group>
          {!wall && item.height > 0.2 && (
            <mesh position={[0, item.height * 0.1, size[2] / 2 + 0.004]}>
              <planeGeometry args={[Math.max(size[0] - 0.3, 0.3), Math.min(0.08, item.height * 0.3)]} />
              <meshBasicMaterial color={EDGE} />
            </mesh>
          )}
        </>
      )}
      <Label y={wall ? 0 : item.height / 2 + 0.2} text={item.name} active={selected} />
    </group>
  )
}

export default function Furniture() {
  const items = useRoomStore((s) => s.items)
  const placements = useRoomStore((s) => s.placements)
  const drag = useRoomStore((s) => s.drag)

  const hidden = new Set()
  if (drag?.target) {
    hidden.add(drag.itemId)
    childrenOf(items, placements, drag.itemId).forEach((id) => hidden.add(id))
  }

  return items.map((item) => {
    const placement = placements[item.id]
    if (!placement || hidden.has(item.id)) return null
    const elevation = elevationOf(items, placements, item.id, placement)
    return <Piece key={item.id} item={item} placement={placement} elevation={elevation} />
  })
}