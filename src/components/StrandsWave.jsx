import { useEffect, useRef, useState } from 'react'
import Strands from './Strands'
import { getAnalyser } from '../lib/audio'

// Wraps the React Bits <Strands> WebGL background and keeps it reactive to the
// piano: it reads the shared audio analyser and feeds the live level into the
// strands' amplitude / intensity / speed so key presses make them surge.
export default function StrandsWave(props) {
  const [level, setLevel] = useState(0)
  const levelRef = useRef(0)

  useEffect(() => {
    let raf = 0
    let data = null
    let last = 0
    const tick = (t) => {
      raf = requestAnimationFrame(tick)
      const an = getAnalyser()
      if (an) {
        if (!data || data.length !== an.fftSize) data = new Uint8Array(an.fftSize)
        an.getByteTimeDomainData(data)
        let sum = 0
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128
          sum += v * v
        }
        const rms = Math.sqrt(sum / data.length)
        // smooth toward the new level
        levelRef.current += (rms - levelRef.current) * 0.18
      } else {
        levelRef.current *= 0.95
      }
      // throttle React updates to ~25fps
      if (t - last > 40) {
        last = t
        setLevel(levelRef.current)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const l = Math.min(level * 5, 1.6)
  return (
    <Strands
      colors={['#3568e0', '#e6a52c', '#4cae8a', '#6f8ff5']}
      count={4}
      waviness={1.1}
      thickness={0.75}
      glow={2.4}
      taper={3}
      spread={1}
      saturation={1.4}
      opacity={1}
      scale={1.5}
      {...props}
      amplitude={1 + l * 1.6}
      intensity={0.5 + l * 0.9}
      speed={0.45 + l * 1.1}
    />
  )
}
