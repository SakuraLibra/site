import { strengths } from '../data/content'

function Icon({ name }) {
  const common = { width: 30, height: 30, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (name) {
    case 'sliders':
      return (
        <svg {...common}><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>
      )
    case 'mic':
      return (
        <svg {...common}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
      )
    case 'speaker':
      return (
        <svg {...common}><rect x="4" y="2" width="16" height="20" rx="2" /><circle cx="12" cy="14" r="4" /><line x1="12" y1="6" x2="12.01" y2="6" /></svg>
      )
    case 'code':
      return (
        <svg {...common}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
      )
    case 'stage':
      return (
        <svg {...common}><circle cx="12" cy="9" r="6" /><path d="M9 14.4L7.4 22l4.6-2.7L16.6 22 15 14.4" /></svg>
      )
    default:
      return null
  }
}

export default function Skills() {
  return (
    <div className="skill-grid">
      {strengths.map((s) => (
        <div className="skill" key={s.id}>
          <span className="ico"><Icon name={s.icon} /></span>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </div>
      ))}
    </div>
  )
}
