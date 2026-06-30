import type { ElementType } from '../types'
import { ELEMENT_COLORS } from '../types'

interface MonsterSpriteProps {
  speciesId: string
  element: ElementType
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  facing?: 'left' | 'right'
  shaking?: boolean
  attacking?: boolean
}

const SIZES = { sm: 48, md: 72, lg: 96, xl: 128 }

export function MonsterSprite({
  speciesId,
  element,
  size = 'md',
  className = '',
  facing = 'right',
  shaking = false,
  attacking = false,
}: MonsterSpriteProps) {
  const px = SIZES[size]
  const color = ELEMENT_COLORS[element]
  const flip = facing === 'left' ? 'scaleX(-1)' : undefined

  return (
    <div
      className={`inline-flex items-center justify-center ${shaking ? 'animate-shake' : ''} ${attacking ? 'animate-lunge' : 'animate-float'} ${className}`}
      style={{
        width: px,
        height: px,
        filter: `drop-shadow(0 0 10px ${color}55)`,
        transform: flip,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={px}
        height={px}
        aria-label={speciesId}
        role="img"
      >
        {renderSprite(speciesId, color, element)}
      </svg>
    </div>
  )
}

function renderSprite(speciesId: string, color: string, element: ElementType) {
  const renderer = SPRITE_RENDERERS[speciesId]
  if (renderer) return renderer(color, element)
  return <GenericSprite color={color} element={element} />
}

function GenericSprite({ color, element }: { color: string; element: ElementType }) {
  return (
    <g>
      <ellipse cx="50" cy="70" rx="28" ry="10" fill="#00000033" />
      <circle cx="50" cy="48" r="28" fill={color} />
      <circle cx="40" cy="42" r="5" fill="#fff" />
      <circle cx="60" cy="42" r="5" fill="#fff" />
      <circle cx="41" cy="43" r="2.5" fill="#1a1a2e" />
      <circle cx="61" cy="43" r="2.5" fill="#1a1a2e" />
      <ElementAccent element={element} cx={50} cy={48} />
    </g>
  )
}

function ElementAccent({ element, cx, cy }: { element: ElementType; cx: number; cy: number }) {
  switch (element) {
    case 'fire':
      return <path d={`M${cx - 8} ${cy - 30} Q${cx} ${cy - 42} ${cx + 8} ${cy - 30} Q${cx} ${cy - 22} ${cx - 8} ${cy - 30}`} fill="#fbbf24" opacity="0.9" />
    case 'water':
      return <ellipse cx={cx} cy={cy + 22} rx="18" ry="6" fill="#60a5fa" opacity="0.5" />
    case 'grass':
      return <path d={`M${cx - 12} ${cy - 28} L${cx - 8} ${cy - 18} L${cx - 16} ${cy - 16} Z M${cx} ${cy - 32} L${cx + 4} ${cy - 20} L${cx - 4} ${cy - 20} Z`} fill="#4ade80" />
    case 'electric':
      return <path d={`M${cx + 14} ${cy - 20} L${cx + 8} ${cy - 8} L${cx + 16} ${cy - 8} L${cx + 10} ${cy + 2}`} fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
    case 'earth':
      return <rect x={cx - 14} y={cy + 18} width="28" height="6" rx="2" fill="#92400e" opacity="0.6" />
    case 'shadow':
      return <ellipse cx={cx} cy={cy + 20} rx="22" ry="8" fill="#4c1d95" opacity="0.4" />
    case 'light':
      return (
        <>
          <circle cx={cx} cy={cy - 28} r="10" fill="#fde68a" opacity="0.5" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1={cx}
              y1={cy - 28}
              x2={cx + Math.cos((deg * Math.PI) / 180) * 16}
              y2={cy - 28 + Math.sin((deg * Math.PI) / 180) * 16}
              stroke="#fde68a"
              strokeWidth="1.5"
              opacity="0.6"
            />
          ))}
        </>
      )
    default:
      return null
  }
}

type SpriteFn = (color: string, element: ElementType) => React.ReactNode

const SPRITE_RENDERERS: Record<string, SpriteFn> = {
  emberpup: (c) => (
    <g>
      <ellipse cx="50" cy="78" rx="24" ry="7" fill="#00000033" />
      <ellipse cx="50" cy="58" rx="22" ry="18" fill={c} />
      <ellipse cx="50" cy="42" rx="16" ry="14" fill={c} filter="brightness(1.1)" />
      <circle cx="43" cy="40" r="4" fill="#fff" /><circle cx="57" cy="40" r="4" fill="#fff" />
      <circle cx="44" cy="41" r="2" fill="#1a1a2e" /><circle cx="58" cy="41" r="2" fill="#1a1a2e" />
      <ellipse cx="50" cy="48" rx="4" ry="3" fill="#7c2d12" />
      <path d="M30 52 L22 44 M70 52 L78 44" stroke={c} strokeWidth="4" strokeLinecap="round" />
      <path d="M38 30 Q50 18 62 30" fill="#fbbf24" opacity="0.8" />
      <rect x="38" y="68" width="8" height="12" rx="3" fill={c} /><rect x="54" y="68" width="8" height="12" rx="3" fill={c} />
    </g>
  ),
  droplet: (c) => (
    <g>
      <ellipse cx="50" cy="80" rx="20" ry="6" fill="#00000033" />
      <path d="M50 18 C35 40 28 55 28 65 C28 78 38 85 50 85 C62 85 72 78 72 65 C72 55 65 40 50 18Z" fill={c} />
      <ellipse cx="42" cy="58" rx="6" ry="8" fill="#ffffff44" />
      <circle cx="43" cy="55" r="3" fill="#fff" /><circle cx="57" cy="55" r="3" fill="#fff" />
      <circle cx="44" cy="56" r="1.5" fill="#1a1a2e" /><circle cx="58" cy="56" r="1.5" fill="#1a1a2e" />
      <path d="M46 64 Q50 68 54 64" stroke="#1e3a5f" strokeWidth="1.5" fill="none" />
    </g>
  ),
  leaflet: (c) => (
    <g>
      <ellipse cx="50" cy="80" rx="18" ry="6" fill="#00000033" />
      <ellipse cx="50" cy="62" rx="16" ry="20" fill={c} />
      <path d="M50 28 C42 35 38 45 40 55 C42 48 46 42 50 38 C54 42 58 48 60 55 C62 45 58 35 50 28Z" fill="#4ade80" />
      <circle cx="44" cy="58" r="3" fill="#fff" /><circle cx="56" cy="58" r="3" fill="#fff" />
      <circle cx="45" cy="59" r="1.5" fill="#1a1a2e" /><circle cx="57" cy="59" r="1.5" fill="#1a1a2e" />
      <path d="M50 38 L50 55" stroke="#166534" strokeWidth="2" />
    </g>
  ),
  sparkbit: (c) => (
    <g>
      <ellipse cx="50" cy="78" rx="20" ry="6" fill="#00000033" />
      <circle cx="50" cy="52" r="22" fill={c} />
      <path d="M62 30 L68 20 L64 34 L74 28 L66 38" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
      <circle cx="42" cy="48" r="5" fill="#fff" /><circle cx="58" cy="48" r="5" fill="#fff" />
      <circle cx="43" cy="49" r="2.5" fill="#1a1a2e" /><circle cx="59" cy="49" r="2.5" fill="#1a1a2e" />
      <path d="M44 60 Q50 65 56 60" stroke="#1a1a2e" strokeWidth="2" fill="none" />
    </g>
  ),
  pebble: (c) => (
    <g>
      <ellipse cx="50" cy="82" rx="26" ry="7" fill="#00000033" />
      <path d="M28 58 C28 42 38 32 50 32 C62 32 72 42 72 58 C72 72 62 80 50 80 C38 80 28 72 28 58Z" fill={c} />
      <path d="M35 48 C40 40 48 38 50 38 C52 38 60 40 65 48" stroke="#ffffff33" strokeWidth="3" fill="none" />
      <circle cx="42" cy="54" r="4" fill="#fff" /><circle cx="58" cy="54" r="4" fill="#fff" />
      <circle cx="43" cy="55" r="2" fill="#1a1a2e" /><circle cx="59" cy="55" r="2" fill="#1a1a2e" />
    </g>
  ),
  gloomlet: (c) => (
    <g>
      <ellipse cx="50" cy="80" rx="22" ry="7" fill="#4c1d9544" />
      <path d="M50 20 C30 30 25 50 30 65 C35 78 42 82 50 82 C58 82 65 78 70 65 C75 50 70 30 50 20Z" fill={c} opacity="0.85" />
      <ellipse cx="50" cy="55" rx="18" ry="20" fill={c} />
      <circle cx="42" cy="52" r="5" fill="#c4b5fd" /><circle cx="58" cy="52" r="5" fill="#c4b5fd" />
      <circle cx="43" cy="53" r="2.5" fill="#1a1a2e" /><circle cx="59" cy="53" r="2.5" fill="#1a1a2e" />
      <path d="M44 64 Q50 60 56 64" stroke="#1a1a2e" strokeWidth="2" fill="none" />
      <path d="M35 35 Q30 25 38 28 M65 35 Q70 25 62 28" stroke={c} strokeWidth="3" fill="none" />
    </g>
  ),
  gleam: (c) => (
    <g>
      <ellipse cx="50" cy="80" rx="20" ry="6" fill="#00000022" />
      <circle cx="50" cy="50" r="24" fill={c} />
      <circle cx="50" cy="50" r="18" fill="#ffffff22" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <line key={deg} x1="50" y1="26" x2={50 + Math.cos((deg * Math.PI) / 180) * 14} y2={26 + Math.sin((deg * Math.PI) / 180) * 14} stroke="#fde68a" strokeWidth="2" opacity="0.7" />
      ))}
      <circle cx="42" cy="48" r="4" fill="#fff" /><circle cx="58" cy="48" r="4" fill="#fff" />
      <circle cx="43" cy="49" r="2" fill="#1a1a2e" /><circle cx="59" cy="49" r="2" fill="#1a1a2e" />
    </g>
  ),
  flamewolf: (c) => (
    <g>
      <ellipse cx="50" cy="82" rx="28" ry="7" fill="#00000033" />
      <ellipse cx="50" cy="58" rx="26" ry="20" fill={c} />
      <ellipse cx="68" cy="52" rx="12" ry="10" fill={c} filter="brightness(0.9)" />
      <ellipse cx="50" cy="38" rx="18" ry="16" fill={c} />
      <path d="M35 28 Q50 12 65 28 L60 35 Q50 25 40 35Z" fill="#fbbf24" />
      <circle cx="42" cy="36" r="4" fill="#ff6b6b" /><circle cx="58" cy="36" r="4" fill="#ff6b6b" />
      <circle cx="43" cy="37" r="2" fill="#1a1a2e" /><circle cx="59" cy="37" r="2" fill="#1a1a2e" />
      <path d="M30 58 L18 50 M72 58 L82 48" stroke={c} strokeWidth="5" strokeLinecap="round" />
      <rect x="36" y="70" width="10" height="14" rx="3" fill={c} /><rect x="54" y="70" width="10" height="14" rx="3" fill={c} />
    </g>
  ),
  tidalynx: (c) => (
    <g>
      <ellipse cx="50" cy="82" rx="24" ry="7" fill="#00000033" />
      <ellipse cx="50" cy="58" rx="24" ry="18" fill={c} />
      <ellipse cx="50" cy="38" rx="16" ry="14" fill={c} filter="brightness(1.05)" />
      <path d="M30 32 L22 24 M34 28 L28 18 M70 32 L78 24 M66 28 L72 18" stroke={c} strokeWidth="3" strokeLinecap="round" />
      <circle cx="43" cy="36" r="4" fill="#a5f3fc" /><circle cx="57" cy="36" r="4" fill="#a5f3fc" />
      <ellipse cx="44" cy="37" rx="2" ry="3" fill="#1a1a2e" /><ellipse cx="58" cy="37" rx="2" ry="3" fill="#1a1a2e" />
      <path d="M72 55 Q82 50 88 58" stroke={c} strokeWidth="6" fill="none" strokeLinecap="round" />
      <rect x="38" y="70" width="8" height="14" rx="3" fill={c} /><rect x="54" y="70" width="8" height="14" rx="3" fill={c} />
    </g>
  ),
  thornback: (c) => (
    <g>
      <ellipse cx="50" cy="82" rx="26" ry="7" fill="#00000033" />
      <ellipse cx="50" cy="60" rx="26" ry="18" fill={c} />
      <ellipse cx="50" cy="42" rx="18" ry="14" fill={c} />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <line key={deg} x1={50 + Math.cos((deg * Math.PI) / 180) * 20} y1={42 + Math.sin((deg * Math.PI) / 180) * 14} x2={50 + Math.cos((deg * Math.PI) / 180) * 28} y2={42 + Math.sin((deg * Math.PI) / 180) * 20} stroke="#166534" strokeWidth="2" />
      ))}
      <circle cx="43" cy="40" r="3" fill="#fff" /><circle cx="57" cy="40" r="3" fill="#fff" />
      <circle cx="44" cy="41" r="1.5" fill="#1a1a2e" /><circle cx="58" cy="41" r="1.5" fill="#1a1a2e" />
      <rect x="36" y="72" width="10" height="12" rx="3" fill={c} /><rect x="54" y="72" width="10" height="12" rx="3" fill={c} />
    </g>
  ),
  voltfox: (c) => (
    <g>
      <ellipse cx="50" cy="82" rx="24" ry="7" fill="#00000033" />
      <ellipse cx="50" cy="58" rx="22" ry="16" fill={c} />
      <ellipse cx="50" cy="38" rx="15" ry="13" fill={c} filter="brightness(1.1)" />
      <path d="M28 30 L18 18 M32 26 L24 12 M72 30 L82 18 M68 26 L76 12" stroke="#fde047" strokeWidth="2.5" />
      <circle cx="43" cy="36" r="4" fill="#fff" /><circle cx="57" cy="36" r="4" fill="#fff" />
      <circle cx="44" cy="37" r="2" fill="#1a1a2e" /><circle cx="58" cy="37" r="2" fill="#1a1a2e" />
      <path d="M68 55 L88 48 L82 62" fill={c} />
      <rect x="38" y="70" width="8" height="14" rx="3" fill={c} /><rect x="54" y="70" width="8" height="14" rx="3" fill={c} />
    </g>
  ),
  boulder: (c) => (
    <g>
      <ellipse cx="50" cy="84" rx="30" ry="8" fill="#00000033" />
      <path d="M22 55 C22 38 35 25 50 25 C65 25 78 38 78 55 C78 72 65 82 50 82 C35 82 22 72 22 55Z" fill={c} />
      <path d="M30 45 L45 38 L55 42 L65 35" stroke="#ffffff22" strokeWidth="3" fill="none" />
      <path d="M35 55 L50 50 L62 55" stroke="#ffffff22" strokeWidth="2" fill="none" />
      <circle cx="40" cy="52" r="4" fill="#d6d3d1" /><circle cx="60" cy="52" r="4" fill="#d6d3d1" />
      <circle cx="41" cy="53" r="2" fill="#1a1a2e" /><circle cx="61" cy="53" r="2" fill="#1a1a2e" />
    </g>
  ),
  shadebat: (c) => (
    <g>
      <ellipse cx="50" cy="82" rx="28" ry="7" fill="#4c1d9544" />
      <path d="M10 45 Q30 30 50 38 Q70 30 90 45 L80 55 Q50 42 20 55Z" fill={c} opacity="0.7" />
      <ellipse cx="50" cy="48" rx="14" ry="16" fill={c} />
      <circle cx="44" cy="46" r="4" fill="#c4b5fd" /><circle cx="56" cy="46" r="4" fill="#c4b5fd" />
      <circle cx="45" cy="47" r="2" fill="#1a1a2e" /><circle cx="57" cy="47" r="2" fill="#1a1a2e" />
      <path d="M46 54 L50 58 L54 54" fill="#7c3aed" />
    </g>
  ),
  infernox: (c) => (
    <g>
      <ellipse cx="50" cy="84" rx="30" ry="8" fill="#00000033" />
      <ellipse cx="50" cy="58" rx="28" ry="22" fill={c} />
      <ellipse cx="50" cy="35" rx="20" ry="18" fill={c} filter="brightness(1.1)" />
      <path d="M30 25 Q50 5 70 25 Q65 15 50 20 Q35 15 30 25" fill="#fbbf24" />
      <path d="M25 35 Q20 20 30 28 M75 35 Q80 20 70 28" fill="#f97316" opacity="0.8" />
      <circle cx="42" cy="34" r="5" fill="#ff4444" /><circle cx="58" cy="34" r="5" fill="#ff4444" />
      <circle cx="43" cy="35" r="2.5" fill="#1a1a2e" /><circle cx="59" cy="35" r="2.5" fill="#1a1a2e" />
      <path d="M22 55 L10 42 M78 55 L90 42" stroke={c} strokeWidth="6" strokeLinecap="round" />
      <rect x="34" y="72" width="12" height="14" rx="4" fill={c} /><rect x="54" y="72" width="12" height="14" rx="4" fill={c} />
    </g>
  ),
  aquadrake: (c) => (
    <g>
      <ellipse cx="50" cy="84" rx="32" ry="8" fill="#00000033" />
      <ellipse cx="50" cy="58" rx="30" ry="22" fill={c} />
      <ellipse cx="72" cy="48" rx="16" ry="12" fill={c} filter="brightness(0.95)" />
      <path d="M50 22 C40 30 35 42 38 52 L50 45 L62 52 C65 42 60 30 50 22Z" fill={c} filter="brightness(1.1)" />
      <circle cx="68" cy="44" r="4" fill="#a5f3fc" /><circle cx="76" cy="46" r="3" fill="#a5f3fc" />
      <path d="M20 55 Q10 48 15 62 Q25 58 20 55" fill={c} opacity="0.8" />
      <path d="M30 72 L25 88 M50 76 L50 90 M70 72 L75 88" stroke={c} strokeWidth="5" strokeLinecap="round" />
    </g>
  ),
  verdantaur: (c) => (
    <g>
      <ellipse cx="50" cy="84" rx="32" ry="8" fill="#00000033" />
      <ellipse cx="50" cy="60" rx="30" ry="20" fill={c} />
      <path d="M30 35 L25 15 L40 30 M50 28 L50 10 M70 35 L75 15 L60 30" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="50" cy="40" rx="16" ry="14" fill={c} filter="brightness(1.05)" />
      <circle cx="42" cy="38" r="4" fill="#fff" /><circle cx="58" cy="38" r="4" fill="#fff" />
      <circle cx="43" cy="39" r="2" fill="#1a1a2e" /><circle cx="59" cy="39" r="2" fill="#1a1a2e" />
      <rect x="34" y="74" width="12" height="12" rx="4" fill={c} /><rect x="54" y="74" width="12" height="12" rx="4" fill={c} />
    </g>
  ),
  thunderhorn: (c) => (
    <g>
      <ellipse cx="50" cy="84" rx="28" ry="8" fill="#00000033" />
      <ellipse cx="50" cy="58" rx="26" ry="20" fill={c} />
      <ellipse cx="50" cy="36" rx="16" ry="14" fill={c} />
      <path d="M38 22 L42 8 L46 22 M54 22 L58 8 L62 22" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
      <circle cx="43" cy="34" r="4" fill="#fff" /><circle cx="57" cy="34" r="4" fill="#fff" />
      <circle cx="44" cy="35" r="2" fill="#1a1a2e" /><circle cx="58" cy="35" r="2" fill="#1a1a2e" />
      <path d="M70 40 L88 30 L82 50" fill="#fde047" opacity="0.8" />
      <rect x="36" y="72" width="10" height="14" rx="3" fill={c} /><rect x="54" y="72" width="10" height="14" rx="3" fill={c} />
    </g>
  ),
  terraforge: (c) => (
    <g>
      <ellipse cx="50" cy="86" rx="34" ry="8" fill="#00000033" />
      <path d="M18 55 C18 35 32 20 50 20 C68 20 82 35 82 55 C82 75 68 85 50 85 C32 85 18 75 18 55Z" fill={c} />
      <path d="M28 42 L42 35 L58 38 L72 30" stroke="#ffffff22" strokeWidth="4" fill="none" />
      <rect x="38" y="48" width="24" height="8" rx="2" fill="#ffffff11" />
      <circle cx="40" cy="50" r="4" fill="#fbbf24" /><circle cx="60" cy="50" r="4" fill="#fbbf24" />
      <circle cx="41" cy="51" r="2" fill="#1a1a2e" /><circle cx="61" cy="51" r="2" fill="#1a1a2e" />
      <rect x="32" y="76" width="14" height="12" rx="3" fill={c} /><rect x="54" y="76" width="14" height="12" rx="3" fill={c} />
    </g>
  ),
  phoenixion: (c) => (
    <g>
      <ellipse cx="50" cy="84" rx="30" ry="8" fill="#00000033" />
      <path d="M50 15 C35 25 25 45 30 60 L50 50 L70 60 C75 45 65 25 50 15Z" fill="#fbbf24" />
      <ellipse cx="50" cy="55" rx="22" ry="18" fill={c} />
      <path d="M15 50 Q25 35 35 45 M85 50 Q75 35 65 45" fill="#f97316" opacity="0.7" />
      <circle cx="43" cy="52" r="4" fill="#ff6b6b" /><circle cx="57" cy="52" r="4" fill="#ff6b6b" />
      <circle cx="44" cy="53" r="2" fill="#1a1a2e" /><circle cx="58" cy="53" r="2" fill="#1a1a2e" />
      <path d="M40 72 L30 88 M60 72 L70 88" stroke={c} strokeWidth="4" strokeLinecap="round" />
    </g>
  ),
  leviathane: (c) => (
    <g>
      <ellipse cx="50" cy="86" rx="36" ry="8" fill="#00000033" />
      <ellipse cx="50" cy="55" rx="34" ry="24" fill={c} />
      <ellipse cx="78" cy="48" rx="18" ry="14" fill={c} filter="brightness(0.95)" />
      <path d="M50 20 C42 28 38 38 40 48 L50 42 L60 48 C62 38 58 28 50 20Z" fill={c} filter="brightness(1.1)" />
      <circle cx="72" cy="44" r="5" fill="#a5f3fc" />
      <path d="M12 52 Q5 45 8 58 Q18 55 12 52" fill={c} opacity="0.7" />
      <path d="M8 60 Q2 70 10 75" stroke={c} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M25 78 L20 92 M45 80 L45 94 M65 78 L70 92" stroke={c} strokeWidth="5" strokeLinecap="round" />
    </g>
  ),
  stormreaver: (c) => (
    <g>
      <ellipse cx="50" cy="84" rx="30" ry="8" fill="#00000033" />
      <ellipse cx="50" cy="55" rx="28" ry="22" fill={c} />
      <path d="M50 18 C38 28 32 40 35 50 L50 42 L65 50 C68 40 62 28 50 18Z" fill="#fde047" opacity="0.6" />
      <circle cx="42" cy="50" r="5" fill="#fff" /><circle cx="58" cy="50" r="5" fill="#fff" />
      <circle cx="43" cy="51" r="2.5" fill="#1a1a2e" /><circle cx="59" cy="51" r="2.5" fill="#1a1a2e" />
      <path d="M72 38 L90 25 L85 45 L95 40" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
      <path d="M20 42 L5 30 L12 48" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
      <rect x="34" y="72" width="12" height="14" rx="4" fill={c} /><rect x="54" y="72" width="12" height="14" rx="4" fill={c} />
    </g>
  ),
  eclipsion: (c) => (
    <g>
      <ellipse cx="50" cy="84" rx="32" ry="8" fill="#4c1d9544" />
      <circle cx="50" cy="50" r="30" fill={c} opacity="0.3" />
      <circle cx="50" cy="50" r="22" fill={c} />
      <circle cx="50" cy="50" r="14" fill="#1a1a2e" />
      <circle cx="46" cy="48" r="3" fill="#c4b5fd" />
      <path d="M15 50 Q30 30 50 35 Q70 30 85 50" stroke={c} strokeWidth="4" fill="none" opacity="0.6" />
      <path d="M30 65 Q50 55 70 65" stroke="#7c3aed" strokeWidth="3" fill="none" />
    </g>
  ),
  solarius: (c) => (
    <g>
      <ellipse cx="50" cy="86" rx="34" ry="8" fill="#00000022" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line key={deg} x1="50" y1="50" x2={50 + Math.cos((deg * Math.PI) / 180) * 38} y2={50 + Math.sin((deg * Math.PI) / 180) * 38} stroke="#fde68a" strokeWidth="3" opacity="0.5" />
      ))}
      <circle cx="50" cy="50" r="26" fill={c} />
      <circle cx="50" cy="50" r="20" fill="#ffffff33" />
      <circle cx="42" cy="48" r="5" fill="#fff" /><circle cx="58" cy="48" r="5" fill="#fff" />
      <circle cx="43" cy="49" r="2.5" fill="#1a1a2e" /><circle cx="59" cy="49" r="2.5" fill="#1a1a2e" />
      <path d="M44 58 Q50 64 56 58" stroke="#b45309" strokeWidth="2" fill="none" />
    </g>
  ),
  voidreign: (c) => (
    <g>
      <ellipse cx="50" cy="86" rx="36" ry="8" fill="#4c1d9566" />
      <circle cx="50" cy="48" r="32" fill={c} opacity="0.4" />
      <circle cx="50" cy="48" r="24" fill={c} />
      <circle cx="50" cy="48" r="16" fill="#0f0a1a" />
      <circle cx="50" cy="48" r="8" fill="#7c3aed" opacity="0.8" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <circle key={deg} cx={50 + Math.cos((deg * Math.PI) / 180) * 28} cy={48 + Math.sin((deg * Math.PI) / 180) * 28} r="3" fill="#a78bfa" opacity="0.6" />
      ))}
      <circle cx="44" cy="44" r="3" fill="#c4b5fd" />
    </g>
  ),
  primordial: (c) => (
    <g>
      <ellipse cx="50" cy="88" rx="38" ry="8" fill="#00000033" />
      <path d="M15 55 C15 30 30 12 50 12 C70 12 85 30 85 55 C85 78 70 88 50 88 C30 88 15 78 15 55Z" fill={c} />
      <path d="M25 40 L40 32 L55 36 L70 28" stroke="#4ade80" strokeWidth="3" fill="none" />
      <path d="M22 55 L38 48 L55 52 L72 44" stroke="#ffffff22" strokeWidth="3" fill="none" />
      <circle cx="38" cy="50" r="5" fill="#fbbf24" /><circle cx="62" cy="50" r="5" fill="#fbbf24" />
      <circle cx="39" cy="51" r="2.5" fill="#1a1a2e" /><circle cx="63" cy="51" r="2.5" fill="#1a1a2e" />
      <rect x="30" y="78" width="16" height="12" rx="4" fill={c} /><rect x="54" y="78" width="16" height="12" rx="4" fill={c} />
    </g>
  ),
}
