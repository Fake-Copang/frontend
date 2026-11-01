const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const Svg = ({ size = 20, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    {children}
  </svg>
)

export const UndoIcon = () => (
  <Svg>
    <path d="M9 14L4 9l5-5" />
    <path d="M4 9h10.5a5.5 5.5 0 010 11H11" />
  </Svg>
)
export const RedoIcon = () => (
  <Svg>
    <path d="M15 14l5-5-5-5" />
    <path d="M20 9H9.5a5.5 5.5 0 000 11H13" />
  </Svg>
)
export const RotateLeftIcon = () => (
  <Svg>
    <path d="M3 12a9 9 0 109-9" />
    <path d="M3 4v5h5" />
  </Svg>
)
export const RotateRightIcon = () => (
  <Svg>
    <path d="M21 12a9 9 0 11-9-9" />
    <path d="M21 4v5h-5" />
  </Svg>
)
export const BoxOutIcon = () => (
  <Svg size={18}>
    <path d="M4 8l8-4 8 4v8l-8 4-8-4z" />
    <path d="M4 8l8 4 8-4M12 12v8" />
  </Svg>
)
export const PenIcon = () => (
  <Svg size={18}>
    <path d="M4 20h4L19 9l-4-4L4 16z" />
    <path d="M13.5 6.5l4 4" />
  </Svg>
)
export const CheckIcon = () => (
  <Svg size={18}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
)
export const BackIcon = () => (
  <Svg size={18}>
    <path d="M15 18l-6-6 6-6" />
  </Svg>
)
export const PlusIcon = () => (
  <Svg>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)
export const MinusIcon = () => (
  <Svg>
    <path d="M5 12h14" />
  </Svg>
)
export const ResetIcon = () => (
  <Svg>
    <path d="M4 12a8 8 0 102.3-5.7" />
    <path d="M4 4v4h4" />
  </Svg>
)
export const ImageIcon = () => (
  <Svg size={22}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="10" r="2" />
    <path d="M21 17l-5-5-9 8" />
  </Svg>
)
export const GripIcon = () => (
  <svg width="14" height="20" viewBox="0 0 14 20" fill="currentColor" aria-hidden="true">
    {[4, 10, 16].flatMap((y) => [4, 10].map((x) => <circle key={`${x}${y}`} cx={x} cy={y} r="1.6" />))}
  </svg>
)
export const PlacedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <path d="M7.5 12.5l3 3 6-6.5" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
export const UnplacedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 2.5" />
  </svg>
)
