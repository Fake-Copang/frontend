import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GRID, ROW_H, WALL_H, WALL_ROWS, footprint } from '../store/grid'
import { useRoomStore } from '../store/useRoomStore'

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
const topPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
const wallPlanes = [
  { wall: 'back', plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), along: 'x' },
  { wall: 'left', plane: new THREE.Plane(new THREE.Vector3(1, 0, 0), 0), along: 'z' },
]

export default function DragController() {
  const camera = useThree((s) => s.camera)
  const gl = useThree((s) => s.gl)
  const dragId = useRoomStore((s) => s.drag?.itemId)

  useEffect(() => {
    if (!dragId) return
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    const hit = new THREE.Vector3()
    const { updateDrag, endDrag } = useRoomStore.getState()

    const toFloor = (item, current, items, placements) => {
      const rot = current?.rot ?? 0
      const { w, d } = footprint(item, rot)
      if (item.stackable) {
        let best = null
        for (const [id, bp] of Object.entries(placements)) {
          if (id === item.id) continue
          const base = items.find((i) => i.id === id)
          if (!base?.surface) continue
          const r = footprint(base, bp.rot)
          topPlane.constant = -base.height
          if (!raycaster.ray.intersectPlane(topPlane, hit)) continue
          if (hit.x < bp.x || hit.x > bp.x + r.w || hit.z < bp.z || hit.z > bp.z + r.d) continue
          const dist = raycaster.ray.origin.distanceTo(hit)
          if (best && best.dist < dist) continue
          best = {
            dist,
            target: {
              x: clamp(Math.round(hit.x - w / 2), bp.x, bp.x + r.w - w),
              z: clamp(Math.round(hit.z - d / 2), bp.z, bp.z + r.d - d),
              rot,
            },
          }
        }
        if (best) return best.target
      }
      if (!raycaster.ray.intersectPlane(floorPlane, hit)) return null
      return {
        x: clamp(Math.round(hit.x - w / 2), 0, GRID - w),
        z: clamp(Math.round(hit.z - d / 2), 0, GRID - d),
        rot,
      }
    }

    const toWall = (item) => {
      let best = null
      for (const { wall, plane, along } of wallPlanes) {
        if (!raycaster.ray.intersectPlane(plane, hit)) continue
        const u = hit[along]
        if (u < -0.3 || u > GRID + 0.3 || hit.y < -0.3 || hit.y > WALL_H + 0.3) continue
        const dist = raycaster.ray.origin.distanceTo(hit)
        if (best && best.dist < dist) continue
        best = {
          dist,
          target: {
            wall,
            col: clamp(Math.round(u - item.w / 2), 0, GRID - item.w),
            row: clamp(Math.round(hit.y / ROW_H - item.h / 2), 0, WALL_ROWS - item.h),
          },
        }
      }
      return best?.target ?? null
    }

    const onMove = (e) => {
      const rect = gl.domElement.getBoundingClientRect()
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom
      if (!inside) {
        updateDrag(null, null)
        return
      }
      ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1)
      raycaster.setFromCamera(ndc, camera)
      const { items, placements } = useRoomStore.getState()
      const item = items.find((i) => i.id === dragId)
      if (!item) return
      if (item.kind === 'wall') {
        const target = toWall(item)
        updateDrag(target, target ? null : 'wallOnly')
      } else {
        updateDrag(toFloor(item, placements[dragId], items, placements), 'outside')
      }
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
    }
  }, [dragId, camera, gl])

  return null
}