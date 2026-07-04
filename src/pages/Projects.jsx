import { useEffect, useMemo, useRef, useState } from 'react'
import { projects } from '../data/content'

const SLOT = 188
const CARD = 156
const TOP_SPEED = 20
const BOTTOM_SPEED = -16

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function useElementWidth(ref) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!ref.current) return

    const node = ref.current
    const update = () => setWidth(node.clientWidth)
    update()

    const observer = new ResizeObserver(update)
    observer.observe(node)

    return () => observer.disconnect()
  }, [ref])

  return width
}

function useRailOffset(count, baseSpeed, speedFactor) {
  const cycle = count * SLOT
  const [offset, setOffset] = useState(baseSpeed > 0 ? -cycle * 0.55 : -cycle * 0.15)
  const offsetRef = useRef(offset)
  const currentSpeed = useRef(baseSpeed * speedFactor)

  useEffect(() => {
    offsetRef.current = offset
  }, [offset])

  useEffect(() => {
    let frame = 0
    let last = 0

    const loop = (time) => {
      if (!last) last = time
      const dt = Math.min((time - last) / 1000, 0.05)
      last = time

      const target = baseSpeed * speedFactor
      currentSpeed.current += (target - currentSpeed.current) * Math.min(1, dt * 3.4)

      let next = offsetRef.current + currentSpeed.current * dt
      if (next > 0) next -= cycle
      if (next < -cycle) next += cycle

      offsetRef.current = next
      setOffset(next)
      frame = requestAnimationFrame(loop)
    }

    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [baseSpeed, cycle, speedFactor])

  return offset
}

function AlbumCover({ album, large = false, tilt = { x: 0, y: 0 }, active = false }) {
  const [base, glow, paper, accent] = album.accent
  const transform = large
    ? `perspective(1400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${active ? 1.02 : 1})`
    : undefined

  return (
    <div
      className={`album-cover${large ? ' large' : ''}${active ? ' active' : ''}`}
      style={{
        '--album-base': base,
        '--album-glow': glow,
        '--album-paper': paper,
        '--album-accent': accent,
        transform,
      }}
    >
      <span className="album-cover-noise" aria-hidden="true" />
      <span className="album-disc" aria-hidden="true" />
      <div className="album-cover-top">
        <span>{album.tag}</span>
        <span>{album.year}</span>
      </div>
      <div className="album-cover-title">
        <strong>{album.title}</strong>
        <small>{album.meta}</small>
      </div>
      <div className="album-cover-bars" aria-hidden="true">
        {[24, 44, 78, 52, 96, 64, 38].map((height, index) => (
          <i key={index} style={{ height }} />
        ))}
      </div>
    </div>
  )
}

function ArcRail({ albums, baseSpeed, direction, hoveredId, selectedId, onHover, onSelect }) {
  const railRef = useRef(null)
  const width = useElementWidth(railRef)
  const slowFactor = hoveredId ? 0.08 : 1
  const offset = useRailOffset(albums.length, baseSpeed, slowFactor)

  const items = useMemo(() => {
    if (!width) return []

    const cycle = albums.length * SLOT
    const visible = []

    for (let copy = -1; copy <= 1; copy += 1) {
      for (let index = 0; index < albums.length; index += 1) {
        const x = index * SLOT + copy * cycle + offset
        if (x < -CARD - 16 || x > width + CARD + 16) continue

        const progress = clamp((x + CARD * 0.5) / Math.max(width, 1), 0, 1)
        const curve = 1 - (progress * 2 - 1) ** 2
        const y = direction === 'top' ? -34 + curve * 110 : 256 - curve * 110
        const angle = (progress - 0.5) * (direction === 'top' ? 22 : -22)

        visible.push({
          key: `${copy}-${albums[index].id}`,
          album: albums[index],
          x,
          y,
          angle,
        })
      }
    }

    return visible
  }, [albums, direction, offset, width])

  return (
    <div className={`arc-rail ${direction}`} ref={railRef}>
      {items.map(({ key, album, x, y, angle }) => (
        <button
          key={key}
          type="button"
          className={`arc-card${hoveredId === album.id ? ' hovered' : ''}${selectedId === album.id ? ' selected' : ''}`}
          style={{ transform: `translate3d(${x}px, ${y}px, 0) rotate(${angle}deg)` }}
          onMouseEnter={() => onHover(album.id)}
          onMouseLeave={() => onHover(null)}
          onFocus={() => onHover(album.id)}
          onBlur={() => onHover(null)}
          onClick={() => onSelect(album)}
          aria-label={`Open ${album.title}`}
        >
          <AlbumCover album={album} />
        </button>
      ))}
    </div>
  )
}

export default function Projects() {
  const [selectedId, setSelectedId] = useState(projects[0]?.id ?? null)
  const [hoveredId, setHoveredId] = useState(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [pulseKey, setPulseKey] = useState(0)

  const selected = projects.find((project) => project.id === selectedId) ?? projects[0]
  const upperAlbums = projects
  const lowerAlbums = [...projects].reverse()

  const handleSelect = (album) => {
    setSelectedId(album.id)
    setPulseKey((value) => value + 1)
  }

  const handleTilt = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height

    setTilt({
      x: (0.5 - py) * 12,
      y: (px - 0.5) * 14,
    })
  }

  return (
    <section className="album-browser">
      <div className="album-browser-intro">
        <p>
          Hover over a record to slow the shelves almost to a stop, then click to bring it into focus.
        </p>
      </div>

      <div className="album-browser-shell">
        <ArcRail
          albums={upperAlbums}
          baseSpeed={TOP_SPEED}
          direction="top"
          hoveredId={hoveredId}
          selectedId={selectedId}
          onHover={setHoveredId}
          onSelect={handleSelect}
        />

        <div className="album-stage">
          <div className="album-stage-glow" aria-hidden="true" />

          <div className="album-stage-cover">
            <div
              className="album-stage-cover-wrap"
              onMouseMove={handleTilt}
              onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            >
              <div className="album-stage-pop" key={`${selected.id}-${pulseKey}`}>
                <AlbumCover album={selected} large tilt={tilt} active />
              </div>
            </div>
          </div>

          <article className="album-stage-info">
            <span className="album-stage-kicker">Now selected</span>
            <h2>{selected.title}</h2>
            <div className="album-stage-artist">{selected.role}</div>
            <p>Preview: {selected.mood}</p>

            <button type="button" className="album-stage-player" aria-label={`Play preview of ${selected.title}`}>
              <span className="album-stage-player-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 6.5v11l9-5.5z" />
                </svg>
              </span>
              <span className="album-stage-player-text">Play preview</span>
              <span className="album-stage-player-wave" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </button>

            <div className="album-stage-mini">
              <span>{selected.year}</span>
              <span>{selected.meta}</span>
            </div>
          </article>
        </div>

        <ArcRail
          albums={lowerAlbums}
          baseSpeed={BOTTOM_SPEED}
          direction="bottom"
          hoveredId={hoveredId}
          selectedId={selectedId}
          onHover={setHoveredId}
          onSelect={handleSelect}
        />
      </div>
    </section>
  )
}
