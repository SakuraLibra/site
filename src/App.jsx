import { useState, useRef, useCallback } from 'react'
import { motion } from 'motion/react'
import Marquee from './components/Marquee'
import StrandsWave from './components/StrandsWave'
import PianoBoard from './components/PianoBoard'
import { resumeAudio, connectMedia } from './lib/audio'
import About from './pages/About'
import Projects from './pages/Projects'
import Skills from './pages/Skills'
import Contact from './pages/Contact'
import Studio from './pages/Studio'
import Experience from './pages/Experience'

const META = {
  home: { eyebrow: 'Dashboard', title: 'A bird’s-eye view of the studio', Comp: null },
  about: { eyebrow: 'Profile', title: 'About me', Comp: About },
  projects: { eyebrow: 'Selected work', title: 'Featured projects', Comp: Projects },
  skills: { eyebrow: 'Capabilities', title: 'What I bring', Comp: Skills },
  experience: { eyebrow: 'Journey', title: 'Experience', Comp: Experience },
  contact: { eyebrow: 'Contact', title: 'Get in touch', Comp: Contact },
  studio: { eyebrow: 'Playground', title: 'Cartoon corner', Comp: Studio },
}

const I = {
  home: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>),
  about: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>),
  projects: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></svg>),
  skills: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l2.4 5.4L20 9.3l-4 4 1 5.7-5-2.8-5 2.8 1-5.7-4-4 5.6-.9z" /></svg>),
  contact: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M4 7l8 6 8-6" /></svg>),
  studio: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="5" /><path d="M7 12h3M8.5 10.5v3" /><circle cx="16" cy="11" r="1" /><circle cx="18.5" cy="13.5" r="1" /></svg>),
  experience: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>),
}
const SIDENAV = [
  { id: 'home', label: 'Home', icon: I.home },
  { id: 'about', label: 'About', icon: I.about },
  { id: 'projects', label: 'Work', icon: I.projects },
  { id: 'skills', label: 'Skills', icon: I.skills },
  { id: 'experience', label: 'Experience', icon: I.experience },
  { id: 'contact', label: 'Contact', icon: I.contact },
  { id: 'studio', label: 'Playground', icon: I.studio },
]

const EASE = [0.22, 1, 0.36, 1]

function Dashboard({ go, view, music, toggleMusic }) {
  return (
    <>
      <section className="piano-hero">
        {/* colorful gradient wash */}
        <span className="ph-blob ph-b1" />
        <span className="ph-blob ph-b2" />
        <span className="ph-blob ph-b3" />
        <span className="ph-blob ph-b4" />

        {/* reactive strands background on the vertical center */}
        <div className="ph-wave">
          <StrandsWave />
        </div>

        {/* hero copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="ph-copy"
        >
          <span className="ph-eyebrow">Edinburgh, UK · Sound</span>
          <h1>A studio<br />for <em>sound</em>.</h1>
          <p>A cozy little studio for making sound — from the first take to the final master.</p>
          <div className="ph-actions">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={toggleMusic}
              className="ph-btn ph-btn-dark"
            >
              {music ? 'Pause Music' : 'Play Music'}
            </motion.button>
          </div>
        </motion.div>

        {/* tilted glass piano — interactive, plays notes, drives the waveform */}
        <PianoBoard activeView={view} onSelect={go} />
      </section>

      <Marquee />
    </>
  )
}

export default function App() {
  const [view, setView] = useState('home')
  const [dark, setDark] = useState(false)
  const [music, setMusic] = useState(false)
  const bgmRef = useRef(null)

  const toggleMusic = useCallback(() => {
    const el = bgmRef.current
    if (!el) return
    resumeAudio()
    connectMedia(el) // route through the analyser so the waveform reacts to the song
    if (el.paused) {
      el.volume = 0.6
      el.play().then(() => setMusic(true)).catch(() => setMusic(false))
    } else {
      el.pause()
      setMusic(false)
    }
  }, [])

  const go = useCallback((v) => setView(v), [])
  const meta = META[view]
  const Page = meta?.Comp

  return (
    <div className={`app${dark ? ' dark' : ''}`}>
      <div className="bg-blobs" aria-hidden="true">
        <span className="blob blob-1" />
        <span className="blob blob-2" />
        <span className="blob blob-3" />
      </div>

      {view !== 'home' && (
      <header className="topnav">
        <button className="nav-brand" onClick={() => go('home')} aria-label="Home" title="Home">
          <span className="bloom">🌸</span>
        </button>

        <nav className="nav-links">
          {SIDENAV.map((n) => (
            <button
              key={n.id}
              className={`nav-link${view === n.id ? ' active' : ''}`}
              onClick={() => go(n.id)}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="nav-tools">
          <button
            className={`nav-tool music${music ? ' on' : ''}`}
            onClick={toggleMusic}
            title={music ? 'Pause music' : 'Play music'}
            aria-label={music ? 'Pause music' : 'Play music'}
          >
            {music ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
          <button className="nav-tool" onClick={() => setDark((d) => !d)} title="Toggle theme" aria-label="Toggle theme">
            {dark ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" /></svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
            )}
          </button>
        </div>
      </header>
      )}

      <main className="main">
        {view === 'home' ? (
          <div className="home-stage">
            <Dashboard go={go} view={view} music={music} toggleMusic={toggleMusic} />
          </div>
        ) : (
          <section className="panel">
            <div className="viewport">
              <div className="view" key={view}>
                <div className={`page page-${view}`}>
                  {view !== 'about' && (
                    <div className="page-head">
                      <span className="eyebrow">{meta.eyebrow}</span>
                      <h1>{meta.title}</h1>
                    </div>
                  )}
                  <Page />
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {view === 'home' && (
        <div className="home-fab">
          <button
            className={`nav-tool music${music ? ' on' : ''}`}
            onClick={toggleMusic}
            title={music ? 'Pause music' : 'Play music'}
            aria-label={music ? 'Pause music' : 'Play music'}
          >
            {music ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
          <button className="nav-tool" onClick={() => setDark((d) => !d)} title="Toggle theme" aria-label="Toggle theme">
            {dark ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" /></svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
            )}
          </button>
        </div>
      )}

      <audio ref={bgmRef} src="/bgm.mp3" loop preload="auto" />
    </div>
  )
}
