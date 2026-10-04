export const GRID = 8
export const WALL_ROWS = 5
export const ROW_H = 0.6
export const WALL_H = WALL_ROWS * ROW_H
export const WALLS = ['back', 'left']

export const REASON = {
  outside: '방 밖으로는 놓을 수 없어요',
  overlap: '다른 물건과 겹쳐서 놓을 수 없어요',
  wallOnly: '벽 전용 상품은 벽 칸에만 놓을 수 있어요',
}

export const isWall = (item) => item.kind === 'wall'

export function footprint(item, rot = 0) {
  return rot % 2 ? { w: item.d, d: item.w } : { w: item.w, d: item.d }
}

export function sizeLabel(item) {
  return isWall(item) ? `${item.w}×${item.h}칸` : `${item.w}×${item.d}칸`
}

function cellsOf(item, p) {
  const cells = []
  if (isWall(item)) {
    for (let c = p.col; c < p.col + item.w; c++)
      for (let r = p.row; r < p.row + item.h; r++) cells.push(`${p.wall}:${c}:${r}`)
  } else {
    const { w, d } = footprint(item, p.rot)
    for (let x = p.x; x < p.x + w; x++)
      for (let z = p.z; z < p.z + d; z++) cells.push(`floor:${x}:${z}`)
  }
  return cells
}

function inBounds(item, p) {
  if (isWall(item)) {
    return WALLS.includes(p.wall) && p.col >= 0 && p.row >= 0 && p.col + item.w <= GRID && p.row + item.h <= WALL_ROWS
  }
  const { w, d } = footprint(item, p.rot)
  return p.x >= 0 && p.z >= 0 && p.x + w <= GRID && p.z + d <= GRID
}

export function checkPlacement(items, placements, itemId, target) {
  const item = items.find((i) => i.id === itemId)
  if (!item || !target) return { ok: false, reason: 'outside' }
  if (!inBounds(item, target)) return { ok: false, reason: 'outside' }
  const taken = new Set()
  for (const [id, p] of Object.entries(placements)) {
    if (id === itemId) continue
    const other = items.find((i) => i.id === id)
    if (other) cellsOf(other, p).forEach((c) => taken.add(c))
  }
  const hit = cellsOf(item, target).some((c) => taken.has(c))
  return hit ? { ok: false, reason: 'overlap' } : { ok: true, reason: null }
}

export function samePlacement(a, b) {
  if (!a || !b) return a === b
  return a.x === b.x && a.z === b.z && a.rot === b.rot && a.wall === b.wall && a.col === b.col && a.row === b.row
}

export function placementsEqual(a, b) {
  const ka = Object.keys(a)
  if (ka.length !== Object.keys(b).length) return false
  return ka.every((k) => samePlacement(a[k], b[k]))
}
