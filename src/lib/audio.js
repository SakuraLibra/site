// Tiny Web Audio synth + shared analyser (for the background waveform).
// Signal: each note -> master gain -> analyser -> speakers.
// Swap this for a sample player (or Tone.js) later if you want a realer piano.

let ctx = null
let master = null
let analyser = null

export function resumeAudio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 1
    analyser = ctx.createAnalyser()
    analyser.fftSize = 2048
    analyser.smoothingTimeConstant = 0.8
    master.connect(analyser)
    analyser.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// The background waveform reads from this. Null until the first interaction.
export function getAnalyser() {
  return analyser
}

// Route an <audio> element through the same graph so the waveform reacts to it.
let mediaConnected = false
export function connectMedia(el) {
  const ac = resumeAudio()
  if (mediaConnected) return
  try {
    const src = ac.createMediaElementSource(el)
    src.connect(master) // -> analyser -> destination
    mediaConnected = true
  } catch (e) {
    /* already connected or unsupported — ignore */
  }
}

// midi note number -> frequency (A4 = 440Hz = midi 69)
export const midiToFreq = (midi) => 440 * Math.pow(2, (midi - 69) / 12)

export function playNote(freq, { duration = 1.7, gain = 0.3 } = {}) {
  const ac = resumeAudio()
  const t = ac.currentTime

  const out = ac.createGain()
  out.connect(master) // -> analyser -> destination
  // ADSR-ish envelope: quick attack, gentle exponential release
  out.gain.setValueAtTime(0.0001, t)
  out.gain.exponentialRampToValueAtTime(gain, t + 0.012)
  out.gain.exponentialRampToValueAtTime(0.0008, t + duration)

  // warm it up
  const lp = ac.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.setValueAtTime(3000, t)
  lp.frequency.exponentialRampToValueAtTime(900, t + duration)
  lp.connect(out)

  // body (triangle) + soft octave (sine) + tiny detuned partial
  const o1 = ac.createOscillator()
  o1.type = 'triangle'
  o1.frequency.value = freq
  o1.connect(lp)

  const o2 = ac.createOscillator()
  o2.type = 'sine'
  o2.frequency.value = freq * 2
  const g2 = ac.createGain()
  g2.gain.value = 0.18
  o2.connect(g2)
  g2.connect(lp)

  const o3 = ac.createOscillator()
  o3.type = 'sine'
  o3.frequency.value = freq
  o3.detune.value = 6
  const g3 = ac.createGain()
  g3.gain.value = 0.5
  o3.connect(g3)
  g3.connect(lp)

  ;[o1, o2, o3].forEach((o) => {
    o.start(t)
    o.stop(t + duration)
  })
}
