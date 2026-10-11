import { create } from 'zustand'
import { fetchRoom, saveRoom } from '../api/roomApi'
import { GRID, REASON, checkPlacement, childrenOf, footprint, placementsEqual, samePlacement } from './grid'

export const useRoomStore = create((set, get) => ({
  items: [],
  placements: {},
  saved: {},
  status: 'loading',
  error: null,
  mode: 'view',
  selectedId: null,
  drag: null,
  past: [],
  future: [],
  filter: 'all',
  exitOpen: false,
  saving: false,
  notice: null,

  load: async () => {
    set({ status: 'loading', error: null })
    try {
      const { items, placements } = await fetchRoom()
      set({ items, placements, saved: placements, status: 'ready' })
    } catch (e) {
      set({ status: 'error', error: e.message })
    }
  },

  setFilter: (filter) => set({ filter }),
  select: (selectedId) => set({ selectedId }),
  notify: (text) => set({ notice: { text, at: Date.now() } }),
  clearNotice: () => set({ notice: null }),

  enterEdit: () => set({ mode: 'edit', past: [], future: [], selectedId: null }),

  commit: (next) => {
    const { placements, past } = get()
    set({ placements: next, past: [...past, placements].slice(-50), future: [] })
  },

  undo: () => {
    const { past, future, placements } = get()
    if (!past.length) return
    set({ placements: past[past.length - 1], past: past.slice(0, -1), future: [placements, ...future] })
  },

  redo: () => {
    const { past, future, placements } = get()
    if (!future.length) return
    set({ placements: future[0], future: future.slice(1), past: [...past, placements] })
  },

  startDrag: (itemId) =>
    set({ drag: { itemId, target: null, ok: false, reason: null, moved: false }, selectedId: itemId }),

  updateDrag: (target, reason = null) => {
    const { drag, items, placements } = get()
    if (!drag) return
    if (!target) {
      if (drag.moved && !drag.target && drag.reason === reason) return
      set({ drag: { ...drag, target: null, ok: false, reason, moved: true } })
      return
    }
    if (drag.moved && samePlacement(drag.target, target)) return
    const res = checkPlacement(items, placements, drag.itemId, target)
    set({ drag: { ...drag, target, ok: res.ok, reason: res.reason, moved: true } })
  },

    endDrag: () => {
    const { drag, placements, items } = get()
    if (!drag) return
    set({ drag: null })
    if (!drag.moved) return
    const from = placements[drag.itemId]
    if (drag.ok && !samePlacement(from, drag.target)) {
      const next = { ...placements, [drag.itemId]: drag.target }
      if (from && 'x' in from) {
        const dx = drag.target.x - from.x
        const dz = drag.target.z - from.z
        for (const id of childrenOf(items, placements, drag.itemId)) {
          next[id] = { ...placements[id], x: placements[id].x + dx, z: placements[id].z + dz }
        }
      }
      get().commit(next)
    } else if (!drag.ok && drag.reason) {
      get().notify(REASON[drag.reason])
    }
  },

  rotate: (dir) => {
    const { selectedId, items, placements } = get()
    const item = items.find((i) => i.id === selectedId)
    const p = placements[selectedId]
    if (!item || !p || item.kind !== 'floor') return
    if (childrenOf(items, placements, selectedId).length) {
      get().notify('위에 놓인 물건이 있어서 회전할 수 없어요')
      return
    }
    const rot = (p.rot + dir + 4) % 4
    const { w, d } = footprint(item, rot)
    const target = { x: Math.min(p.x, GRID - w), z: Math.min(p.z, GRID - d), rot }
    const res = checkPlacement(items, placements, selectedId, target)
    if (res.ok) get().commit({ ...placements, [selectedId]: target })
    else get().notify('주변에 공간이 없어서 회전할 수 없어요')
  },

  removeSelected: () => {
    const { selectedId, placements, items } = get()
    if (!placements[selectedId]) return
    const children = childrenOf(items, placements, selectedId)
    const next = { ...placements }
    delete next[selectedId]
    children.forEach((id) => delete next[id])
    get().commit(next)
    set({ selectedId: null })
    if (children.length) get().notify('위에 있던 물건도 함께 목록으로 옮겼어요')
  },

  save: async () => {
    const { placements } = get()
    set({ saving: true })
    try {
      await saveRoom(placements)
      set({ saved: placements, mode: 'view', saving: false, selectedId: null, past: [], future: [] })
      get().notify('배치를 저장했어요')
    } catch (e) {
      set({ saving: false })
      get().notify(e.message || '배치를 저장하지 못했어요')
    }
  },

  requestExit: () => {
    if (placementsEqual(get().placements, get().saved)) get().exitEdit()
    else set({ exitOpen: true })
  },

  closeExit: () => set({ exitOpen: false }),

  exitEdit: () =>
    set((s) => ({ mode: 'view', exitOpen: false, selectedId: null, placements: s.saved, past: [], future: [], drag: null })),
}))
