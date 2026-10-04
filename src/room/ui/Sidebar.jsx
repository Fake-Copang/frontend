import { useRoomStore } from '../store/useRoomStore'
import { isWall, sizeLabel } from '../store/grid'
import logo from '../assets/coupang-logo.png'
import { BackIcon, GripIcon, ImageIcon, PlacedIcon, UnplacedIcon } from './Icons'

const FILTERS = [
  { id: 'all', label: '전체' },
  { id: 'unplaced', label: '미배치' },
  { id: 'placed', label: '배치됨' },
]

function ItemRow({ item, placed, selected, dragging, editable, onPointerDown }) {
  const className = ['item-row', selected && 'item-row--selected', dragging && 'item-row--dragging', editable && 'item-row--editable']
    .filter(Boolean)
    .join(' ')

  return (
    <li className={className} onPointerDown={onPointerDown}>
      {editable && (
        <span className="item-row__grip">
          <GripIcon />
        </span>
      )}
      <div className="item-row__thumb">{item.image ? <img src={item.image} alt="" /> : <ImageIcon />}</div>
      <div className="item-row__info">
        <strong>{item.name}</strong>
        <div className="item-row__meta">
          <span className={`tag${isWall(item) ? ' tag--wall' : ''}`}>{isWall(item) ? '벽 전용' : '바닥'}</span>
          <span>{sizeLabel(item)}</span>
        </div>
      </div>
      {dragging ? (
        <span className="status status--drag">드래그 중</span>
      ) : placed ? (
        <span className="status status--placed">
          <PlacedIcon />
          배치됨
        </span>
      ) : (
        <span className="status">
          <UnplacedIcon />
          미배치
        </span>
      )}
    </li>
  )
}

export default function Sidebar({ backHref, onBack }) {
  const items = useRoomStore((s) => s.items)
  const placements = useRoomStore((s) => s.placements)
  const mode = useRoomStore((s) => s.mode)
  const filter = useRoomStore((s) => s.filter)
  const selectedId = useRoomStore((s) => s.selectedId)
  const dragId = useRoomStore((s) => s.drag?.itemId)
  const setFilter = useRoomStore((s) => s.setFilter)
  const startDrag = useRoomStore((s) => s.startDrag)
  const select = useRoomStore((s) => s.select)

  const editable = mode === 'edit'
  const placedCount = items.filter((i) => placements[i.id]).length
  const visible = items.filter((i) => filter === 'all' || (filter === 'placed') === Boolean(placements[i.id]))

  const handlePointerDown = (item) => (e) => {
    if (e.button !== 0) return
    if (editable) {
      e.preventDefault()
      startDrag(item.id)
    } else if (placements[item.id]) {
      select(item.id)
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <img src={logo} alt="쿠팡" />
      </div>
      <div className="sidebar__head">
        <div className="sidebar__title">
          <h2>배송 완료된 상품</h2>
          <span>
            {placedCount} / {items.length} 배치됨
          </span>
        </div>
        <div className="chips" role="group" aria-label="상품 필터">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" className={`chip${filter === f.id ? ' chip--on' : ''}`} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <ul className="item-list">
        {visible.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            placed={Boolean(placements[item.id])}
            selected={selectedId === item.id}
            dragging={dragId === item.id}
            editable={editable}
            onPointerDown={handlePointerDown(item)}
          />
        ))}
        {visible.length === 0 && <li className="item-list__empty">{filter === 'placed' ? '아직 배치한 상품이 없어요.' : '모든 상품을 배치했어요.'}</li>}
      </ul>
      {editable ? (
        <p className="sidebar__hint">미배치 상품을 오른쪽 방으로 드래그해서 놓으세요. 목록은 마우스 휠로 스크롤돼요.</p>
      ) : (
        <div className="sidebar__foot">
          <a className="btn btn--outline btn--block" href={backHref} onClick={(e) => { if (onBack) { e.preventDefault(); onBack() } }}>
            <BackIcon />
            상품 주문 화면으로 돌아가기
          </a>
        </div>
      )}
    </aside>
  )
}
