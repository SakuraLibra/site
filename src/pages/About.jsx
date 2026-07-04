import { profile, stats } from '../data/content'

export default function About() {
  return (
    <div className="about-note">
      <div className="note-paper">
        <span className="note-name">Songqi <span className="bloom">🌸</span></span>
        <span className="note-role">Music Producer</span>
        <h2 className="note-statement">Sound should <em>feel alive.</em></h2>
        <span className="note-meta">Edinburgh, UK · GMT +1:00</span>

        <div className="note-body">
          {profile.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="note-tags">
          {stats.map((s, i) => (
            <span className="note-tag" key={i}>
              <b>{s.value}</b> {s.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
