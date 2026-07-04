import { cn } from '../lib/cn'

// 8 brand logos served from svgl.app, each with a hex gradient revealed on hover.
const LOGOS = [
  { src: 'https://svgl.app/library/procure.svg', alt: 'Procure', from: '#1e3a8a', to: '#3b82f6' },
  { src: 'https://svgl.app/library/shopify.svg', alt: 'Shopify', from: '#ca8a04', to: '#facc15' },
  { src: 'https://svgl.app/library/blender.svg', alt: 'Blender', from: '#1d4ed8', to: '#38bdf8' },
  { src: 'https://svgl.app/library/figma.svg', alt: 'Figma', from: '#6d28d9', to: '#a855f7' },
  { src: 'https://svgl.app/library/spotify.svg', alt: 'Spotify', from: '#db2777', to: '#ef4444' },
  { src: 'https://svgl.app/library/lottielab.svg', alt: 'Lottielab', from: '#ca8a04', to: '#22c55e' },
  { src: 'https://svgl.app/library/google-cloud.svg', alt: 'Google Cloud', from: '#38bdf8', to: '#93c5fd' },
  { src: 'https://svgl.app/library/bing.svg', alt: 'Bing', from: '#06b6d4', to: '#14b8a6' },
]

// Seamless, GPU-friendly marquee: pure CSS keyframe (translateX 0 → -50%),
// the list rendered twice, edge-fade mask, paused on hover (see index.css).
export default function Marquee() {
  const items = [...LOGOS, ...LOGOS]
  return (
    <div
      className="marquee-root relative mt-10 w-full max-w-[1400px] mx-auto overflow-hidden font-sans"
      style={{
        maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
      }}
    >
      <div className="marquee-track flex w-max">
        {items.map((logo, i) => (
          <div
            key={i}
            className={cn(
              'group relative h-24 w-40 mr-5 shrink-0 flex items-center justify-center',
              'rounded-full bg-white border border-slate-200/60 shadow-sm',
              'hover:border-slate-300 transition-all overflow-hidden',
            )}
          >
            <div
              className="absolute inset-0 scale-150 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100"
              style={{ background: `linear-gradient(135deg, ${logo.from}, ${logo.to})` }}
            />
            <img
              src={logo.src}
              alt={logo.alt}
              loading="lazy"
              className="relative z-10 h-7 w-auto max-w-[96px] object-contain transition-all duration-500 group-hover:brightness-0 group-hover:invert"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
