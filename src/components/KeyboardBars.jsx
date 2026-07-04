import { useEffect, useRef, useState, useCallback } from 'react'
import { playNote, midiToFreq, resumeAudio } from '../lib/audio'

// Each colored bar = a section. Clicking plays a note and navigates.
const BARS = [
  { view: 'about', letter: 'A', word: 'About', note: 64, bg: 'var(--blue)', fg: '#fff' },
  { view: 'projects', letter: 'W', word: 'Work', note: 67, bg: 'var(--gold)', fg: '#15161c' },
  { view: 'skills', letter: 'S', word: 'Skills', note: 72, bg: '#ece2cb', fg: '#3a3322' },
  { view: 'contact', letter: 'C', word: 'Contact', note: 76, bg: 'var(--blue-deep)', fg: '#fff' },
  { view: 'studio', letter: '★', word: 'Playground', note: 79, bg: '#a9c7f5', fg: '#1a2438' },
]
// decorative "black keys" (play a sharp, no navigation)
// black keys: one between About/Work, two filling the Skills→Playground gap
const BLACKS = [
  { note: 66, top: '13%', label: 'Z' },
  { note: 71, top: '53%', label: 'S' },
  { note: 78, top: '73%', label: 'Q' },
]

export default function KeyboardBars({ activeView, onSelect }) {
  const [pressed, setPressed] = useState(() => new Set())
  const held = useRef(new Set())

  const flash = useCallback((id) => {
    setPressed((p) => new Set(p).add(id))
    setTimeout(() => setPressed((p) => { const n = new Set(p); n.delete(id); return n }), 170)
  }, [])

  const hitBar = useCallback((b) => {
    resumeAudio()
    playNote(midiToFreq(b.note))
    flash(b.view)
    onSelect(b.view)
  }, [flash, onSelect])

  const hitBlack = useCallback((bk) => {
    resumeAudio()
    playNote(midiToFreq(bk.note))
    flash('blk' + bk.note)
  }, [flash])

  // computer keyboard: A W S E D ... map to the section bars by first letters
  useEffect(() => {
    const map = { a: BARS[0], w: BARS[1], s: BARS[2], c: BARS[3], p: BARS[4] }
    const down = (e) => {
      const b = map[e.key.toLowerCase()]
      if (!b || held.current.has(b.view)) return
      held.current.add(b.view)
      hitBar(b)
    }
    const up = (e) => { const b = map[e.key.toLowerCase()]; if (b) held.current.delete(b.view) }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [hitBar])

  return (
    <div className="kb">
      {BARS.map((b) => (
        <button
          key={b.view}
          className={`kb-bar${activeView === b.view ? ' active' : ''}${pressed.has(b.view) ? ' pressed' : ''}`}
          style={{ background: b.bg, color: b.fg }}
          onPointerDown={(e) => { e.preventDefault(); hitBar(b) }}
        >
          <span className="kb-tile" style={{ color: b.fg }}>{b.letter}</span>
          <span className="kb-word">{b.word}</span>
          <span className="kb-note">▶</span>
        </button>
      ))}
      {BLACKS.map((bk) => (
        <button
          key={bk.note}
          className={`kb-black${pressed.has('blk' + bk.note) ? ' pressed' : ''}`}
          style={{ top: bk.top }}
          onPointerDown={(e) => { e.preventDefault(); hitBlack(bk) }}
          aria-label="play note"
        >
          {bk.label}
        </button>
      ))}
    </div>
  )
}
