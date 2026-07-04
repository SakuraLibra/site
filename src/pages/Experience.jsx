import { experience } from '../data/content'

export default function Experience() {
  return (
    <div className="timeline">
      {experience.map((e, i) => (
        <article className="tl-card" key={i}>
          <span className="tl-date">{e.date}</span>
          <h3 className="tl-title">{e.title}</h3>
          {e.org && <div className="tl-org">{e.org}</div>}
          {e.body && <p className="tl-body">{e.body}</p>}
          {e.tags && (
            <div className="tl-tags">
              {e.tags.map((t) => (
                <span className="tl-tag" key={t}>#{t}</span>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  )
}
