import { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

export default function Model({ url, size }) {
  const { scene } = useGLTF(url)
  const [w, h, d] = size

  const { object, scale, offset } = useMemo(() => {
    const object = scene.clone(true)
    object.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(object)
    const dim = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const scale = Math.min(w / dim.x, h / dim.y, d / dim.z)
    const offset = [-center.x * scale, -box.min.y * scale, -center.z * scale]
    return { object, scale, offset }
  }, [scene, w, h, d])

  return (
    <group position={[0, -h / 2, 0]}>
      <group position={offset} scale={scale}>
        <primitive object={object} />
      </group>
    </group>
  )
}