const API_URL = import.meta.env.VITE_API_URL

const MOCK_ITEMS = [
  { id: 'bed', name: '1인용 침대', kind: 'floor', w: 2, d: 4, height: 0.55, color: '#f3efe6' },
  { id: 'desk', name: '원목 책상', kind: 'floor', w: 3, d: 1, height: 0.75, color: '#d9c4a3' },
  { id: 'frame', name: '액자', kind: 'wall', w: 2, h: 1, color: '#ffffff' },
  { id: 'chair', name: '사무용 의자', kind: 'floor', w: 1, d: 1, height: 0.9, color: '#9aa3ad' },
  { id: 'shelf', name: '3단 책장', kind: 'floor', w: 2, d: 1, height: 1.8, color: '#e8e2d6' },
  { id: 'wall-shelf', name: '벽 선반', kind: 'wall', w: 3, h: 1, color: '#d9c4a3' },
  { id: 'sofa', name: '2인용 소파', kind: 'floor', w: 3, d: 1, height: 0.8, color: '#b8c4d6' },
  { id: 'clock', name: '벽시계', kind: 'wall', w: 1, h: 1, color: '#ffffff' },
  { id: 'rug', name: '러그', kind: 'floor', w: 3, d: 2, height: 0.04, color: '#e9d8c4' },
  { id: 'lamp', name: '스탠드 조명', kind: 'floor', w: 1, d: 1, height: 1.6, color: '#f1e3b8' },
]

const MOCK_PLACEMENTS = {
  bed: { x: 0, z: 3, rot: 0 },
  desk: { x: 4, z: 0, rot: 0 },
  chair: { x: 5, z: 1, rot: 0 },
  shelf: { x: 1, z: 0, rot: 0 },
  lamp: { x: 7, z: 0, rot: 0 },
  frame: { wall: 'left', col: 4, row: 2 },
  'wall-shelf': { wall: 'back', col: 4, row: 3 },
}

let mockSaved = structuredClone(MOCK_PLACEMENTS)
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchRoom() {
  if (!API_URL) {
    await wait(300)
    return { items: MOCK_ITEMS, placements: structuredClone(mockSaved) }
  }
  const res = await fetch(`${API_URL}/room`, { credentials: 'include' })
  if (!res.ok) throw new Error('방 정보를 불러오지 못했어요.')
  return res.json()
}

export async function saveRoom(placements) {
  if (!API_URL) {
    await wait(400)
    mockSaved = structuredClone(placements)
    return
  }
  const res = await fetch(`${API_URL}/room/placements`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ placements }),
  })
  if (!res.ok) throw new Error('배치를 저장하지 못했어요.')
}
