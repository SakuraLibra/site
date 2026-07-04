import { useState } from 'react'
import { profile, social } from '../data/content'

// Set this to receive messages with no backend (e.g. a free https://formspree.io form URL).
const FORM_ENDPOINT = ''

const CHANNELS = [
  {
    label: 'GitHub', cls: 'c-gh', href: social.github,
    node: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" /></svg>
    ),
  },
  { label: 'LinkedIn', badge: 'in', cls: 'c-link', href: profile.linkedinUrl },
  { label: '小红书', badge: '书', cls: 'c-red', href: social.rednote },
  { label: 'B 站', badge: 'B', cls: 'c-bili', href: social.bilibili },
  { label: 'QQ 音乐', badge: '♪', cls: 'c-qq', href: social.qqMusic },
  { label: '网易云', badge: '云', cls: 'c-netease', href: social.netease },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!FORM_ENDPOINT) { setStatus('config'); return }
    setStatus('sending')
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) { setStatus('sent'); setForm({ name: '', email: '', message: '' }) }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  return (
    <div className="contact2">
      <div className="channels">
        {CHANNELS.map((c) => {
          const isMail = (c.href || '').startsWith('mailto:')
          return (
            <a
              key={c.label}
              className={`channel ${c.cls}`}
              href={c.href || '#'}
              aria-label={c.label}
              title={c.label}
              {...(!isMail && c.href ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              <span className="cbadge" aria-hidden="true">{c.node || c.badge}</span>
              <span className="clabel">{c.label}</span>
            </a>
          )
        })}
      </div>

      <form className="send-card" onSubmit={submit}>
        <h3>Send a message</h3>
        <div className="cf-row">
          <label className="cf-field">
            <span>Name</span>
            <input type="text" value={form.name} onChange={set('name')} placeholder="Your name" required />
          </label>
          <label className="cf-field">
            <span>Email</span>
            <input type="email" value={form.email} onChange={set('email')} placeholder="Your email" required />
          </label>
        </div>
        <label className="cf-field">
          <span>Message</span>
          <textarea value={form.message} onChange={set('message')} rows={3} placeholder="What would you like to say?" required />
        </label>
        <div className="cf-actions">
          <button type="submit" className="cf-submit" disabled={status === 'sending'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
            {status === 'sending' ? 'Sending…' : 'Send'}
          </button>
          {status === 'sent' && <span className="cf-msg ok">Thanks — your message was sent! ✓</span>}
          {status === 'error' && <span className="cf-msg err">Something went wrong. Try again, or email me directly.</span>}
          {status === 'config' && <span className="cf-msg err">Form endpoint not set — add one in <code>Contact.jsx</code> (FORM_ENDPOINT).</span>}
        </div>
      </form>
    </div>
  )
}
