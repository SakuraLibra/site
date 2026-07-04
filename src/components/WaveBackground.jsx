import { useEffect, useRef } from 'react'
import { getAnalyser } from '../lib/audio'

/**
 * Oscilloscope that fills its parent (the dark keyboard panel).
 * Reads live time-domain data from the shared analyser, so the line reacts to
 * whatever note is sounding. White / off-white on the dark panel.
 */
export default function WaveBackground({ variant = 'dark' }) {
  const ref = useRef(null)
  const light = variant === 'light'

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let raf
    let buf = null
    let cw = 0
    let ch = 0
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const smoothstep = (t) => t * t * (3 - 2 * t)
    const hash1 = (n) => {
      const x = Math.sin(n * 127.1) * 43758.5453123
      return x - Math.floor(x)
    }
    const noise1 = (x) => {
      const i = Math.floor(x)
      const f = x - i
      const a = hash1(i)
      const b = hash1(i + 1)
      return a + (b - a) * smoothstep(f)
    }
    const fbm1 = (x) => {
      let v = 0
      let amp = 0.52
      let f = 1
      for (let o = 0; o < 4; o += 1) {
        v += (noise1(x * f) * 2 - 1) * amp
        f *= 2.03
        amp *= 0.5
      }
      return v
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      cw = canvas.clientWidth
      ch = canvas.clientHeight
      canvas.width = cw * dpr
      canvas.height = ch * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = (t) => {
      const midY = ch / 2
      ctx.clearRect(0, 0, cw, ch)
      const an = getAnalyser()
      const time = (t || 0) / 1000

      if (an) {
        if (!buf || buf.length !== an.fftSize) buf = new Uint8Array(an.fftSize)
        an.getByteTimeDomainData(buf)
        let sum = 0
        for (let i = 0; i < buf.length; i++) {
          const x = (buf[i] - 128) / 128
          sum += x * x
        }
        const intensity = Math.min(1, Math.sqrt(sum / buf.length) * 6)
        const N = buf.length
        const maxAmp = ch * (0.26 + intensity * 0.14)
        const lineCount = 3

        // pre-sample & smooth (avoid the too-perfect sine look)
        const step = Math.max(2, Math.floor(N / 240))
        const samples = []
        for (let i = 0; i < N; i += step) samples.push((buf[i] - 128) / 128)
        for (let pass = 0; pass < 2; pass += 1) {
          for (let i = 1; i < samples.length - 1; i += 1) {
            samples[i] = samples[i] * 0.6 + (samples[i - 1] + samples[i + 1]) * 0.2
          }
        }
        // Remove DC offset so the oscilloscope stays visually centered.
        // (Some audio chains produce a slight bias that makes the line drift down/up.)
        let dc = 0
        for (let i = 0; i < samples.length; i += 1) dc += samples[i]
        dc /= Math.max(1, samples.length)

        // subtle background haze (dark panel only)
        if (!light) {
          ctx.fillStyle = `rgba(10, 12, 18, ${0.1 + intensity * 0.16})`
          ctx.fillRect(0, 0, cw, ch)
        }

        for (let layer = 0; layer < lineCount; layer += 1) {
          const layerPhase = layer * 12.7
          const jitter = (layer - 1) * (0.8 + intensity * 2.2)
          const alpha = 0.11 + intensity * (layer === 1 ? 0.5 : 0.24)
          const width = (layer === 1 ? 1.8 : 1.05) + intensity * (layer === 1 ? 4.2 : 2)

          // pass 1: build the smoothed curve
          const ys = []
          let prev = 0
          for (let x = 0; x <= cw; x += 2) {
            const idx = Math.floor((x / cw) * (samples.length - 1))
            const v0 = (samples[idx] ?? 0) - dc
            // add low-frequency "air" + noisy micro-variation
            const air = Math.sin(time * 1.8 + x * 0.006 + layerPhase) * 0.06
            const grit = fbm1(time * 0.9 + x * 0.012 + layerPhase) * (0.07 + intensity * 0.09)
            const v = v0 + air + grit
            const sm = prev * 0.72 + v * 0.28
            prev = sm
            ys.push(sm)
          }
          // remove this frame's mean so the line stays vertically centered on midY
          let mean = 0
          for (let i = 0; i < ys.length; i += 1) mean += ys[i]
          mean /= Math.max(1, ys.length)
          ctx.beginPath()
          for (let i = 0; i < ys.length; i += 1) {
            const x = i * 2
            const y = midY + (ys[i] - mean) * maxAmp + jitter
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
          }

          const isBlue = layer !== 1 // bright centre = white, side layers = light blue
          if (light) {
            // colored strokes that read on the light gradient wash
            ctx.strokeStyle = isBlue
              ? `rgba(53, 104, 224, ${0.28 + intensity * 0.45})`
              : `rgba(230, 165, 44, ${0.3 + intensity * 0.5})`
          } else {
            ctx.strokeStyle = isBlue
              ? `rgba(150, 200, 245, ${alpha})`
              : `rgba(255, 253, 248, ${alpha})`
          }
          ctx.lineWidth = width
          ctx.lineJoin = 'round'
          ctx.lineCap = 'round'
          ctx.shadowColor = light
            ? (isBlue ? 'rgba(53,104,224,0.45)' : 'rgba(230,165,44,0.45)')
            : (isBlue ? 'rgba(120, 178, 240, 0.6)' : 'rgba(255, 255, 255, 0.5)')
          ctx.shadowBlur = intensity * (layer === 1 ? 22 : 10)
          ctx.stroke()
          ctx.shadowBlur = 0
        }
      } else {
        ctx.beginPath()
        ctx.moveTo(0, midY)
        ctx.lineTo(cw, midY)
        ctx.strokeStyle = light ? 'rgba(53, 104, 224, 0.28)' : 'rgba(190, 215, 245, 0.2)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
      if (!reduce) raf = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [light])

  return <canvas ref={ref} className="wave-bg" aria-hidden="true" />
}
