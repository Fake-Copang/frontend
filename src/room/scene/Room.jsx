import { useMemo } from 'react'
import * as THREE from 'three'
import { GRID, ROW_H, WALL_H, WALL_ROWS } from '../store/grid'
import { useRoomStore } from '../store/useRoomStore'

function buildFloorGrid() {
  const p = []
  for (let k = 0; k <= GRID; k++) {
    p.push(k, 0.003, 0, k, 0.003, GRID)
    p.push(0, 0.003, k, GRID, 0.003, k)
  }
  return p
}

function buildWallGrid() {
  const p = []
  for (let k = 0; k <= GRID; k++) {
    p.push(k, 0, 0.004, k, WALL_H, 0.004)
    p.push(0.004, 0, k, 0.004, WALL_H, k)
  }
  for (let r = 0; r <= WALL_ROWS; r++) {
    const y = r * ROW_H
    p.push(0, y, 0.004, GRID, y, 0.004)
    p.push(0.004, y, 0, 0.004, y, GRID)
  }
  return p
}

function GridLines({ points, color }) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    return g
  }, [points])
  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={color} />
    </lineSegments>
  )
}

export default function Room() {
  const mode = useRoomStore((s) => s.mode)
  const draggingWall = useRoomStore((s) => {
    if (!s.drag) return false
    return s.items.find((i) => i.id === s.drag.itemId)?.kind === 'wall'
  })
  const floorGrid = useMemo(buildFloorGrid, [])
  const wallGrid = useMemo(buildWallGrid, [])
  const floorColor = mode === 'edit' && !draggingWall ? '#a9b8e6' : '#d6d3ca'
  const wallColor = draggingWall ? '#7f97dc' : '#d6d3ca'

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[GRID / 2, 0, GRID / 2]}>
        <planeGeometry args={[GRID, GRID]} />
        <meshStandardMaterial color="#efece4" />
      </mesh>
      <mesh position={[GRID / 2 - 0.05, WALL_H / 2, -0.05]}>
        <boxGeometry args={[GRID + 0.1, WALL_H, 0.1]} />
        <meshStandardMaterial color="#e2dfd6" />
      </mesh>
      <mesh position={[-0.05, WALL_H / 2, GRID / 2]}>
        <boxGeometry args={[0.1, WALL_H, GRID]} />
        <meshStandardMaterial color="#ebe8e0" />
      </mesh>
      <GridLines points={floorGrid} color={floorColor} />
      <GridLines points={wallGrid} color={wallColor} />
    </group>
  )
}
