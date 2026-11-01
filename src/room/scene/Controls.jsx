import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRoomStore } from '../store/useRoomStore'
import { CAMERA_POSITION, CAMERA_TARGET, MAX_DISTANCE, MIN_DISTANCE, cameraApi } from './theme'

export default function Controls() {
  const ref = useRef(null)
  const camera = useThree((s) => s.camera)
  const dragging = useRoomStore((s) => Boolean(s.drag))

  useEffect(() => {
    cameraApi.zoom = (factor) => {
      const controls = ref.current
      if (!controls) return
      const offset = camera.position.clone().sub(controls.target)
      const length = Math.min(Math.max(offset.length() * factor, MIN_DISTANCE), MAX_DISTANCE)
      camera.position.copy(controls.target).add(offset.setLength(length))
      controls.update()
    }
    cameraApi.reset = () => {
      const controls = ref.current
      if (!controls) return
      camera.position.set(...CAMERA_POSITION)
      controls.target.set(...CAMERA_TARGET)
      controls.update()
    }
  }, [camera])

  return (
    <OrbitControls
      ref={ref}
      makeDefault
      enabled={!dragging}
      enablePan={false}
      target={CAMERA_TARGET}
      minDistance={MIN_DISTANCE}
      maxDistance={MAX_DISTANCE}
      minPolarAngle={0.35}
      maxPolarAngle={1.25}
      minAzimuthAngle={0.12}
      maxAzimuthAngle={Math.PI / 2 - 0.12}
    />
  )
}
