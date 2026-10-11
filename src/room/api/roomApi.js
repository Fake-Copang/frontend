const API_URL = import.meta.env.VITE_API_URL
const model = (file) => `${import.meta.env.BASE_URL}models/${file}.glb`

const MOCK_ITEMS = [
  { id: 'bed', name: '1인용 침대', kind: 'floor', surface: true, w: 2, d: 4, height: 0.55, color: '#f3efe6' },
  { id: 'desk', name: '원목 책상', kind: 'floor', surface: true, w: 3, d: 1, height: 0.75, color: '#d9c4a3' },
  { id: 'frame', name: '액자', kind: 'wall', w: 2, h: 1, color: '#ffffff' },
  { id: 'chair', name: '사무용 의자', kind: 'floor', w: 1, d: 1, height: 0.9, color: '#9aa3ad' },
  { id: 'shelf', name: '3단 책장', kind: 'floor', w: 2, d: 1, height: 1.8, color: '#e8e2d6' },
  { id: 'wall-shelf', name: '벽 선반', kind: 'wall', w: 3, h: 1, color: '#d9c4a3' },
  { id: 'sofa', name: '2인용 소파', kind: 'floor', w: 3, d: 1, height: 0.8, color: '#b8c4d6' },
  { id: 'clock', name: '벽시계', kind: 'wall', w: 1, h: 1, color: '#ffffff' },
  { id: 'rug', name: '러그', kind: 'floor', w: 3, d: 2, height: 0.04, color: '#e9d8c4' },
  { id: 'lamp', name: '스탠드 조명', kind: 'floor', w: 1, d: 1, height: 1.6, color: '#f1e3b8' },
  { id: 'switch2', name: '닌텐도 스위치 2', kind: 'floor', stackable: true, w: 1, d: 1, height: 1, color: '#e60012', model: model('switch2-box') },
  { id: 'gucci-shoes', name: '구찌 신발', kind: 'floor', stackable: true, w: 1, d: 1, height: 1, color: '#f2efe8', model: model('gucci-shoes') },
  { id: 'jordan1-dior', name: '에어 조던 1 로우 디올', kind: 'floor', stackable: true, w: 1, d: 1, height: 1, color: '#d9dde3', model: model('jordan1-dior') },
  { id: 'ipad-pro', name: '아이패드 프로', kind: 'floor', stackable: true, w: 1, d: 1, height: 1, color: '#3a3a3c', model: model('ipad-pro') },
  { id: 'macbook-pro-16', name: '맥북 프로 16', kind: 'floor', stackable: true, w: 1, d: 1, height: 1, color: '#7d7e80', model: model('macbook-pro-16') },
  { id: 'chanel-bag', name: '샤넬 가방', kind: 'floor', stackable: true, w: 1, d: 1, height: 1, color: '#1f1f1f', model: model('chanel-bag') },
  { id: 'gucci-bag', name: '구찌 가방', kind: 'floor', stackable: true, w: 1, d: 1, height: 1, color: '#8a6a4a', model: model('gucci-bag') },
  { id: 'tforce-ram', name: 'T-FORCE DELTA 램', kind: 'floor', stackable: true, w: 1, d: 1, height: 1, color: '#2b2b2b', model: model('tforce-ram') },
  { id: 'rtx5070', name: 'RTX 5070 그래픽카드', kind: 'floor', stackable: true, w: 1, d: 1, height: 1, color: '#3d3d3d', model: model('rtx5070') },
]

const MOCK_PLACEMENTS = {
  bed: { x: 0, z: 3, rot: 0 },
  desk: { x: 4, z: 0, rot: 0 },
  chair: { x: 5, z: 1, rot: 0 },
  shelf: { x: 1, z: 0, rot: 0 },
  lamp: { x: 7, z: 0, rot: 0 },
  frame: { wall: 'left', col: 4, row: 2 },
  'wall-shelf': { wall: 'back', col: 4, row: 3 }
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
