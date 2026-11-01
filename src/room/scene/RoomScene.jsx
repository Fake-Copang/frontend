import { Canvas } from '@react-three/fiber'
import { useRoomStore } from '../store/useRoomStore'
import { CAMERA_POSITION } from './theme'
import Room from './Room'
import Furniture from './Furniture'
import Ghost from './Ghost'
import SelectionToolbar from './SelectionToolbar'
import DragController from './DragController'
import Controls from './Controls'

export default function RoomScene() {
  const select = useRoomStore((s) => s.select)

  return (
    <Canvas flat camera={{ position: CAMERA_POSITION, fov: 35 }} dpr={[1, 2]} onPointerMissed={() => select(null)}>
      <color attach="background" args={['#f7f6f2']} />
      <ambientLight intensity={1.6} />
      <directionalLight position={[10, 14, 8]} intensity={1.4} />
      <Room />
      <Furniture />
      <Ghost />
      <SelectionToolbar />
      <DragController />
      <Controls />
    </Canvas>
  )
}
