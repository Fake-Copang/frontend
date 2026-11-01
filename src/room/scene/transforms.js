import { ROW_H, footprint } from '../store/grid'

export function floorTransform(item, p, elevation = 0) {
  const { w, d } = footprint(item, p.rot)
  return {
    position: [p.x + w / 2, elevation + item.height / 2, p.z + d / 2],
    rotationY: -p.rot * (Math.PI / 2),
  }
}

export function wallTransform(item, p) {
  const along = p.col + item.w / 2
  const y = (p.row + item.h / 2) * ROW_H
  return p.wall === 'back'
    ? { position: [along, y, 0.06], rotationY: 0 }
    : { position: [0.06, y, along], rotationY: Math.PI / 2 }
}

export function wallSize(item) {
  return [item.w - 0.12, item.h * ROW_H - 0.1, 0.1]
}

export function floorSize(item) {
  return [item.w - 0.08, item.height, item.d - 0.08]
}

export function toolbarPosition(item, p, elevation = 0) {
  if (item.kind === 'wall') {
    const { position } = wallTransform(item, p)
    const top = (p.row + item.h) * ROW_H + 0.35
    return p.wall === 'back' ? [position[0], top, 0.3] : [0.3, top, position[2]]
  }
  const { position } = floorTransform(item, p, elevation)
  return [position[0], elevation + item.height + 0.45, position[2]]
}