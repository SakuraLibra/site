import { useEffect, useRef, useState, useCallback } from 'react'
import { playNote, midiToFreq, resumeAudio } from '../lib/audio'

// Tilted glass piano. Each colored key = a section (plays a note + navigates);
// black keys play a sharp only. Translucent glass lets the gradient wash and the
// reactive waveform show through. Mirrors the labels/colors from the bar concept.
const KEYS = [
  { view: 'about', letter: 'A', word: 'About', note: 64, rgb: '52,104,224', fg: '#fff' },
  { view: 'projects', letter: 'W', word: 'Work', note: 67, rgb: '230,165,44', fg: '#3a2c08' },
  { view: 'skills', letter: 'S', word: 'Skills', note: 72, rgb: '236,226,203', fg: '#3a3322' },
  { view: 'contact', letter: 'C', word: 'Contact', note: 76, rgb: '28,63,150', fg: '#fff' },
  { view: 'studio', letter: '★', word: 'Playground', note: 79, rgb: '169,199,245', fg: '#1a2438' },
]
// black keys sit in the gaps after key index `after`
const BLACKS = [
  { after: 0, note: 66, label: 'Z', key: 'z' },
  { after: 2, note: 71, label: 'X', key: 'x' },
  { after: 3, note: 78, label: 'Q', key: 'q' },
]

const KEY_H = 68
const GAP = 18
const BLACK_H = 48

export default function PianoBoard({ activeView, onSelect }) {
  const [pressed, setPressed] = useState(() => new Set())
  const held = useRef(new Set())

  const flash = useCallback((id) => {
    setPressed((p) => new Set(p).add(id))
    setTimeout(() => setPressed((p) => { const n = new Set(p); n.delete(id); return n }), 160)
  }, [])

  const hitKey = useCallback((k) => {
    resumeAudio()
    playNote(midiToFreq(k.note))
    flash(k.view)
    onSelect(k.view)
  }, [flash, onSelect])

  const hitBlack = useCallback((bk) => {
    resumeAudio()
    playNote(midiToFreq(bk.note))
    flash('blk' + bk.note)
  }, [flash])

  // computer keyboard: A W S C P -> white keys; Z X Q -> black keys
  useEffect(() => {
    const whiteMap = { a: KEYS[0], w: KEYS[1], s: KEYS[2], c: KEYS[3], p: KEYS[4] }
    const blackMap = {}
    BLACKS.forEach((b) => { blackMap[b.key] = b })
    const down = (e) => {
      const key = e.key.toLowerCase()
      const w = whiteMap[key]
      if (w) {
        if (held.current.has(w.view)) return
        held.current.add(w.view)
        hitKey(w)
        return
      }
      const b = blackMap[key]
      if (b) {
        if (held.current.has('blk' + b.note)) return
        held.current.add('blk' + b.note)
        hitBlack(b)
      }
    }
    const up = (e) => {
      const key = e.key.toLowerCase()
      if (whiteMap[key]) held.current.delete(whiteMap[key].view)
      if (blackMap[key]) held.current.delete('blk' + blackMap[key].note)
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [hitKey, hitBlack])

  return (
    <div className="piano-clip" aria-hidden={false}>
      <div className="piano-board">
        {KEYS.map((k, i) => {
          const isPressed = pressed.has(k.view)
          const isActive = activeView === k.view
          return (
            <button
              key={k.view}
              className="piano-key"
              onPointerDown={(e) => { e.preventDefault(); hitKey(k) }}
              style={{
                color: k.fg,
                background: `linear-gradient(180deg, rgba(${k.rgb},0.96), rgba(${k.rgb},0.86))`,
                boxShadow: isActive
                  ? `inset 0 0 0 3px rgba(255,255,255,0.85), inset 0 -2px 0 rgba(255,255,255,0.85), 0 44px 80px -30px rgba(20,30,60,0.45)`
                  : 'inset 0 -2px 0 rgba(255,255,255,0.42), inset 0 -6px 7px -3px rgba(255,255,255,0.2), 7px 12px 24px -8px rgba(120,150,210,0.45), 0 30px 60px -30px rgba(20,30,60,0.4)',
                transform: isPressed ? 'translateY(6px) scale(0.99)' : 'none',
                filter: isPressed ? 'brightness(1.1)' : 'none',
              }}
            >
              <span className="pk-tile" style={{ color: k.fg }}>{k.letter}</span>
              <span className="pk-word" style={{ color: k.fg }}>{k.word}</span>
              <span className="pk-play">▶</span>
            </button>
          )
        })}
        {BLACKS.map((bk) => (
          <button
            key={bk.note}
            className="piano-black"
            aria-label="play note"
            onPointerDown={(e) => { e.preventDefault(); hitBlack(bk) }}
            style={{
              top: bk.after * (KEY_H + GAP) + KEY_H + GAP / 2 - BLACK_H / 2,
              filter: pressed.has('blk' + bk.note) ? 'brightness(1.5)' : 'none',
            }}
          >
            {bk.label}
          </button>
        ))}
      </div>
    </div>
  )
}
