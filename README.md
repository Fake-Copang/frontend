# 내 방 배치 (가짜 쿠팡)

```bash
npm install
npm run dev
```

`.env`에 `VITE_API_URL`이 없으면 목업 데이터로 동작하고, 넣으면 아래 API를 호출합니다.

- `GET  {VITE_API_URL}/room` → `{ items, placements }`
- `PUT  {VITE_API_URL}/room/placements` ← `{ placements }`

```js
items: [
  { id: 'bed', name: '1인용 침대', kind: 'floor', w: 2, d: 4, height: 0.55, color: '#f3efe6', image?: 'url' },
  { id: 'clock', name: '벽시계', kind: 'wall', w: 1, h: 1, color: '#ffffff' },
]
placements: {
  bed: { x: 0, z: 3, rot: 0 },
  clock: { wall: 'back', col: 1, row: 3 },
}
```

단축키(배치 중): Ctrl+Z 되돌리기, Ctrl+Shift+Z / Ctrl+Y 다시하기, R / Shift+R 회전, Delete 목록으로 빼기, Esc 선택 해제
