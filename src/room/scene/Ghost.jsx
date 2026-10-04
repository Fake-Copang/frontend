import { Edges } from '@react-three/drei'
import { useRoomStore } from '../store/useRoomStore'
import { footprint } from '../store/grid'
import { ACCENT, WARN } from './theme'
import { floorSize, floorTransform, wallSize, wallTransform } from './transforms'

export default function Ghost() {
  const drag = useRoomStore((s) => s.drag)
  const item = useRoomStore((s) => s.items.find((i) => i.id === s.drag?.itemId))
  if (!drag?.target || !item) return null

  const color = drag.ok ? ACCENT : WARN
  const wall = item.kind === 'wall'
  const { position, rotationY } = wall ? wallTransform(item, drag.target) : floorTransform(item, drag.target)
  const size = wall ? wallSize(item) : floorSize(item)
  const fp = wall ? null : footprint(item, drag.target.rot)

  return (
    <>
      <group position={position} rotation-y={rotationY}>
        <mesh renderOrder={2}>
          <boxGeometry args={size} />
          <meshBasicMaterial color={color} transparent opacity={0.35} depthWrite={false} />
          <Edges color={color} />
        </mesh>
      </group>
      {fp && (
        <mesh rotation-x={-Math.PI / 2} position={[drag.target.x + fp.w / 2, 0.006, drag.target.z + fp.d / 2]}>
          <planeGeometry args={[fp.w, fp.d]} />
          <meshBasicMaterial color={color} transparent opacity={0.22} depthWrite={false} />
        </mesh>
      )}
    </>
  )
}
