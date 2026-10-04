import RoomPage from './room/RoomPage'
import { useRoomStore } from './room/store/useRoomStore'

const PREVIEW = !import.meta.env.VITE_API_URL

export default function App() {
  const notify = useRoomStore((s) => s.notify)
  return <RoomPage backHref="/" onBack={PREVIEW ? () => notify('미리보기에서는 상품 주문 화면으로 이동하지 않아요') : undefined} />
}
