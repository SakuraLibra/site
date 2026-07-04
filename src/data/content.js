// All site copy lives here — edit text/data without touching components.

export const profile = {
  name: 'Songqi Zhao',
  role: 'Music Producer',
  greeting: 'Hi, my name is Songqi!',
  tagline: 'A cozy little studio for making sound — from the first take to the final master.',
  location: 'Edinburgh, UK',
  email: 'S.Zhao-53@sms.ed.ac.uk',
  phone: '+44 7344 108055',
  linkedin: 'Songqi Zhao',
  linkedinUrl: 'https://www.linkedin.com/in/Songqi-Zhao-7ba46a33a',
  // Drop a square portrait into /public and set the filename here (e.g. '/portrait.jpg').
  portrait: null,
  intro: [
    'I am a second-year BMus student at the University of Edinburgh, working across production, studio recording, live sound, and audio technology.',
    'My work runs the full chain — capturing a performance, sculpting the mix, delivering the master — and I write a little Python for audio analysis along the way. I care about sound that is clean and emotionally specific.',
  ],
}

// Big numbers shown on the About page.
export const stats = [
  { value: '230K+', label: 'Views · Bilibili + Rednote' },
  { value: '10+', label: 'Tracks produced' },
  { value: '20+', label: 'Live events mixed' },
  { value: '14 yrs', label: 'On stage' },
]

// Featured project cards / album browser entries.
export const projects = [
  {
    id: '01',
    tag: 'Scoring',
    title: 'Northern Echoes',
    blurb: 'A cinematic original soundtrack shaped from piano, strings, and textured ambience for a slow-burning narrative.',
    meta: 'Logic Pro · Mix · Master',
    year: '2025',
    role: 'Composer · Producer',
    mood: 'Warm piano, drifting strings, and a quiet sense of distance.',
    accent: ['#244fae', '#6c92f2', '#d9e4ff', '#e6a52c'],
    stats: ['6 cues', '48kHz session', 'Hybrid scoring'],
    credits: ['Composition', 'Arrangement', 'Mix', 'Master'],
  },
  {
    id: '02',
    tag: 'Studio',
    title: 'Blue Room Sessions',
    blurb: 'Live-room tracking experiments focused on ensemble balance, microphone spacing, and intimate room tone.',
    meta: 'ORTF · XY · Room Capture',
    year: '2024',
    role: 'Recording Engineer',
    mood: 'Natural transients, airy imaging, and close player communication.',
    accent: ['#2d3764', '#7195e5', '#d7e0f8', '#8ec7ff'],
    stats: ['12 takes', 'Stereo arrays', 'Room-first capture'],
    credits: ['Mic Plan', 'Tracking', 'Editing', 'Session Prep'],
  },
  {
    id: '03',
    tag: 'Content',
    title: 'Signal Stories',
    blurb: 'Short-form audio and video pieces built for social platforms with music-led storytelling and tight pacing.',
    meta: '230,000+ Views',
    year: '2024',
    role: 'Producer · Editor',
    mood: 'Punchy edits, bright hooks, and visual rhythm that lands fast.',
    accent: ['#513ca8', '#9d8cff', '#ebe5ff', '#f0b743'],
    stats: ['Bilibili', 'Rednote', 'Promo cuts'],
    credits: ['Creative Direction', 'Edit', 'Sound Design', 'Delivery'],
  },
  {
    id: '04',
    tag: 'Audio ML',
    title: 'Spectral Atlas',
    blurb: 'Python-driven analysis tools for timbre mapping, feature extraction, and production workflow automation.',
    meta: 'Python · ML · DSP',
    year: '2025',
    role: 'Researcher · Builder',
    mood: 'Precise, analytical, and still grounded in musicality.',
    accent: ['#103844', '#2d98b3', '#dcf4fa', '#ffd978'],
    stats: ['Feature plots', 'Batch tools', 'Model tests'],
    credits: ['Python', 'Data Prep', 'Feature Design', 'Automation'],
  },
  {
    id: '05',
    tag: 'Live',
    title: 'Midnight Console',
    blurb: 'Front-of-house mixes for medium-sized venues with calm troubleshooting and clean vocal translation.',
    meta: 'FOH · Monitors · PA',
    year: '2023',
    role: 'Live Sound Engineer',
    mood: 'Confident low-end, clear vocals, and pressure handled quietly.',
    accent: ['#16222f', '#4a7dc9', '#dae5ff', '#f6c15d'],
    stats: ['20+ events', '50–500 cap', 'Fast line check'],
    credits: ['Console Op', 'System Check', 'Mix Notes', 'Show Flow'],
  },
  {
    id: '06',
    tag: 'Arrangement',
    title: 'Paper Sky EP',
    blurb: 'A softer indie-pop EP developed from sketch demos into full arrangements with layered vocal detail.',
    meta: 'Vocal Prod · Arrangement',
    year: '2025',
    role: 'Arranger · Vocal Producer',
    mood: 'Soft synths, lifted choruses, and clean emotional focus.',
    accent: ['#8c5a36', '#f0a164', '#fff0dc', '#3568e0'],
    stats: ['4 tracks', 'Vocal stacks', 'Hybrid pop'],
    credits: ['Arrangement', 'Vocal Editing', 'Comping', 'Mix Prep'],
  },
  {
    id: '07',
    tag: 'Post',
    title: 'Quiet Cut',
    blurb: 'Dialogue cleanup, ambience shaping, and restrained mix decisions for short-form visual work.',
    meta: 'Edit · Restoration · Post',
    year: '2024',
    role: 'Post Producer',
    mood: 'Clean detail, subtle space, and patient editing choices.',
    accent: ['#2e3a2a', '#6ea375', '#e4f0df', '#e6a52c'],
    stats: ['Dialogue pass', 'Noise control', 'Atmos beds'],
    credits: ['Cleanup', 'Ambience', 'Balance', 'Final Print'],
  },
  {
    id: '08',
    tag: 'Performance',
    title: 'Stage Memory',
    blurb: 'Performance-led work shaped by fourteen years on stage, translated into arrangement and production instincts.',
    meta: 'Piano · Voice · Stagecraft',
    year: 'Ongoing',
    role: 'Performer · Musical Director',
    mood: 'Expressive phrasing, timing awareness, and live energy.',
    accent: ['#40263c', '#b56ea8', '#f8e0f4', '#8ebcff'],
    stats: ['14 years', 'Stage-driven', 'Performance intuition'],
    credits: ['Performance', 'Direction', 'Arrangement', 'Interpretation'],
  },
]

// Strength / capability cards.
export const strengths = [
  { id: '01', icon: 'sliders', title: 'Production & Mixing', body: 'DAW editing, mixing, and mastering — from raw stems to a finished master.' },
  { id: '02', icon: 'mic', title: 'Studio Recording', body: 'Mic selection and placement, gain staging, and signal flow tuned to the room.' },
  { id: '03', icon: 'speaker', title: 'Live Sound', body: 'Console operation and PA setup for venues of 50–500, with calm troubleshooting.' },
  { id: '04', icon: 'code', title: 'Audio + Code', body: 'Python for audio analysis and automation, and applied audio machine learning.' },
]

// ── Experience timeline ──
export const experience = [
  {
    date: '2025 — Present',
    title: 'Sound Recording — Reid Concert Hall',
    org: 'University of Edinburgh',
    body: 'Stereo recording with ORTF and XY techniques (Røde TF-5 pair, Zoom H6), then editing and mixing to a clean, faithful master.',
    tags: ['recording', 'mixing', 'classical'],
  },
  {
    date: '2024 — Present',
    title: 'Music Content Creator',
    org: 'Bilibili · Rednote',
    body: 'Producing music-tech and arrangement content for Chinese-speaking audiences — 230K+ cumulative views.',
    tags: ['content', 'arrangement', 'education'],
  },
  {
    date: '2023 — Present',
    title: 'Volunteer',
    org: 'One World Shop, Edinburgh',
    body: 'Fair-trade retail — front of house, merchandising, and community events.',
    tags: ['community', 'volunteer'],
  },
  {
    date: '2022 — 2023',
    title: 'Publicity & Social Media',
    org: 'EUCSA',
    body: 'Ran publicity and social channels for the Edinburgh University Chinese Students’ Association.',
    tags: ['publicity', 'social'],
  },
  {
    date: '2010 — Present',
    title: '14 Years on Stage',
    org: 'Vocal & stage performance',
    body: 'Long-running vocal and stage experience, plus secondary-school studio crew and radio announcing.',
    tags: ['performance', 'vocal', 'live'],
  },
]

// ── About page (intro + specs + tech stack) ──
export const aboutIntro = [
  "I'm from Nanjing, China, and I'm reading for my undergraduate degree in Artificial Intelligence at the University of Edinburgh. In my third year I'll spend a whole year on exchange at the University of Southern California.",
  "I first heard about AI when AlphaGo was released, and ever since I've felt an almost instinctive curiosity about it. Since I started teaching myself AI in high school, every new algorithm has pulled me easily into a state of flow — that's why I chose it as my major. Right now, I'm focused on LLM engineering. I'd love to connect with anyone who shares these interests.",
  "Off the keyboard, I'm a hiker who carries a camera around to look at the world, and I am a 7-year Golden State Warriors fan.",
]
export const specs = [
  { k: 'Location', v: 'Edinburgh, UK' },
  { k: 'Languages', v: 'Chinese (native), English (fluent)' },
  { k: 'Education', v: 'BSc Artificial Intelligence, University of Edinburgh (2024–2028)' },
  { k: 'Exchange', v: 'Computer Science, University of Southern California (academic year 2027)' },
]
export const techStack = ['Python', 'PyTorch', 'HuggingFace', 'ONNX', 'TensorRT']

// ── Social / channel links for the Contact page (fill these in) ──
export const social = {
  github: '',    // GitHub 主页链接
  rednote: '',   // 小红书 主页链接
  bilibili: '',  // B 站 主页链接
  qqMusic: '',   // QQ 音乐 主页链接
  netease: '',   // 网易云音乐 主页链接
}
