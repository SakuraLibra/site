> **现状说明（2026-07 更新）**
>
> 首页已不再使用 Mac 显示器组件（`Mac Player.dc.html`），改为一张可交互的像素画：
> 画中的**电脑 / 钢琴 / 日历 / 人物**分别是通往 Work / Skills / Experience / About 的热区，
> 通过站点原生的 `data-go` 属性驱动 `showPage()`，叠加了樱花花瓣、浮尘、光斑与光柱的 canvas 动画。
> 下文中关于 Home 页 `MacMonitor` 的部分已作废，其余页面（About / Work / Skills / Experience / Contact）的规格仍然有效。

---

# Handoff: Songqi Portfolio (React + Vite + TypeScript)

## Overview
A single-page portfolio site for **Songqi (Sakura)** — music producer / audio engineer, BMus at the University of Edinburgh. Six "pages" (Home, About, Work, Skills, Experience, Contact) are shown one at a time inside a fixed viewport, switched by a floating right-side dock. The centerpiece is a Mac-style monitor on the Home page whose *screen content* swaps between a desktop intro card, a Logic-Pro-style tracks view, and a Musical Typing piano.

**Goal for the implementer:** recreate this design 1:1 as a **React 18 + Vite + TypeScript** app using **Tailwind CSS** for styling and **Framer Motion** (or GSAP) for animations, deployable to Vercel.

## About the Design Files
The files in this bundle are **design references created in HTML** (`Sound Studio.dc.html` is the whole site, `Mac Player.dc.html` is the Home-page monitor component; `support.js` is the runtime that renders them — open `index.html` in a browser to see the live reference). They are prototypes showing the intended look and behavior, **not production code to copy directly**. Recreate them in React with the component structure below.

## Fidelity
**High-fidelity.** All colors, spacing, copy, and interactions are final. Recreate pixel-perfectly. All styles in the reference are inline `style="…"` attributes — every hex value, shadow, and radius can be read directly from the HTML.

## Suggested Component Structure
```
src/
  App.tsx                 // page state (usePage), dock, page transitions
  components/
    Dock.tsx              // fixed right nav, glassmorphism, hover-scale 1.35
    MacMonitor.tsx        // silver-edge monitor + stand (Home)
    ScreenIntro.tsx       // desktop intro card (name, socials, buttons)
    ScreenLogic.tsx       // Logic-Pro tracks view (in-screen)
    MusicalTyping.tsx     // ⌘/Ctrl+K piano overlay + WebAudio synth
    AboutBook.tsx         // two-sheet notebook with fold + hand-drawn marks
    WorkShelf.tsx         // cassette rail + detail panel + audio player
    SkillsBoard.tsx       // dark pinboard + draggable polaroid
    ExperienceLine.tsx    // timeline + draggable duck
    ContactLetter.tsx     // letter form → mailto
  data/
    tracks.ts             // the 5 songs (title/audio/mood/colors)
  assets → public/assets  // copy as-is
```

## Screens

### 1. Home (Dashboard)
- Background: sunset gradient `linear-gradient(180deg,#8f7ed6 0%,#b98ad8 20%,#ea8fc0 42%,#ff9aa8 62%,#ffb488 82%,#ffd9a4 100%)`, scrollable, content centered.
- **Monitor** (`Mac Player.dc.html`): width `min(1120px,100%)`; silver frame (`linear-gradient(180deg,#e3e5ea,#b9bcc4)`, radius 18px, 4px padding), black bezel `#0d0e12` radius 14px padding 14px with camera dot, screen `aspect-ratio:16/10` radius 6px, trapezoid stand + base.
- **Screen — intro card**: frosted white card (`rgba(255,255,255,0.78)`, blur 14px) on pastel wallpaper gradient `linear-gradient(135deg,#c7d4ff,#e3d4f7 52%,#cfe0fe)`. Copy: "Hi, I'm **Songqi Jones**, Working as **Music Producer** and **Audio Engineer**". 4 social icon buttons (NetEase Cloud Music, QQ Music, Rednote "RED", Bilibili) — outline circles, hover fill `#c39ad4`-family. Buttons: "Get Started" (dark pill `#1c2138` + white arrow circle) opens the Logic screen; "View My Work" (outline pill) goes to Work page. Hint line: "⌘ / CTRL + K — MUSICAL TYPING".
- **Screen — Logic view** (in the same screen, fade/slide in ~0.3s): 1:1 Logic Pro dark UI. Toolbar `linear-gradient(180deg,#39393d,#2c2c2f)` with traffic lights (red closes back to intro), transport icons, black LCD (`#101113`) showing `01:03:47:12 TIME / 114 3 1 37 BEAT / 120.000 TEMPO / C maj · 4/4 KEY` in `#8fd4ff` mono; filename "Nice to meet u.track". Ruler row with yellow cycle bar. 5 track rows (`#232325`, hover `#2b2b2e`): header (26% width) = color strip + gradient instrument icon chip + name + "→ PAGE" in `#86a6ff` + M/S buttons + green level meter; lane = bar grid + regions with name tag headers and SVG waveform (audio) / note-dash (MIDI) textures. Rows: 28 Vocal 🎤 orange `#f0964e`→About; 53 Harmony 🎶 yellow `#d9c92e`→Work; 59 Piano 🎹 brown `#9a7a5e`→Skills; 62 Drum 🥁 magenta `#c95ad6`→Experience; 100 E Guitar 🎸 blue `#4a80dd`→Contact. White playhead line. Esc also closes.
- **Musical Typing** (⌘/Ctrl+K toggle, Esc closes): dark window `#2f2f33`, title "Musical Typing — Deluxe Classic", mini keyboard strip with blue octave window, pitch-bend row (2 blue + 6 purple numbered keys), green sustain (tab), 11 white keys labeled A S D F G H J K L ; ' and 7 black keys W E T Y U O P, yellow Z/X octave, orange C/V velocity. Keyboard events + click trigger a WebAudio triangle-harmonic synth (freq = 261.63 · 2^(oct + semitone/12), 3 partials at 1/0.42/0.2 amp, ~1.7s exp decay).

### 2. About — notebook
- Two paper sheets (grid-paper bg `#eef1fb` + 34px grid lines) inside purple covers `linear-gradient(150deg,#d9b8e8,#ab7cbe)`; sheet 1 radius 34px top, sheet 2 radius 34px bottom; between them a **6px solid pink seam `#f4c8d6`** with shadows cast on the pages above/below (`0 ±5px 8px -4px rgba(120,60,90,0.4)`) and pink ribbon bookmarks poking out both sides.
- Sheet 1: "Songqi 🌸" (Caveat cursive), "Music Producer", headline "Sound should *feel alive.*" (`#ab7cbe` italic), 3 bio paragraphs (see reference for exact copy) with **hand-drawn animated marks**: blue `#3d78e0` squiggly underlines under both universities, orange `#f06a2c` box around "Music Technology", green highlighter sweep on "HOYO-MiX", orange circle around "Chinese folk dance for 14 years". Marks are SVG paths with `pathLength=1`, animated stroke-dashoffset 1→0 staggered ~0.45s after text entrance; highlight animates background-size 0→100%.
- Right: white polaroid (rotate 2.5deg) with `letter-girl.png`, caption "that's me 🌸".
- Sheet 2 "The Specs": grid of Location / Education / Languages; pill-outline chips (`1.5px solid #ab7cbe`, radius 999px) for Music Stack (Audio Crafting & Sound Design / **Goal** Game & Film Scoring · HOYO-MiX / Music Theory) and Arts & Interests (**14 yrs** Chinese Folk Dance / Stage Performance / C-pop · J-pop · K-pop).
- Scroll drives a page-fold: sheet1 rotateX + fade, sheet2 unfolds (see `initAboutFold`).

### 3. Work — cassette shelf
- Full-viewport page, canvas waveform background (55% opacity), left cassette arc rail (clickable cassettes, hover slows reel), right detail panel.
- Data (`tracks.ts`): Spring / Crash / Dream / Sky / Golden Sunset — all `Composer · Producer`, year 2025, `meta: 'Original Track'`, audio files in `public/assets/`. Colors per cassette in ALBUMS array in the reference.
- Detail: "Now playing" label `#e2a6c4`, big serif title, role, mood copy, animated bar-wave, **Play preview** pill button `#c39ad4` (toggles to Pause, icon swaps), and a **seek bar** (5px track `rgba(195,154,212,0.18)`, fill+knob `#c39ad4`, pointer drag to scrub, tabular-nums time labels). Switching cassettes pauses & resets audio; leaving the page pauses.

### 4. Skills — pinboard
- White page, hand-drawn doodle header, purple mat (`linear-gradient(135deg,#d9b8e8,#ab7cbe)`) behind a dark board `#14151f` with ruler numbers + faint grid; pinned cards (production/mixing pack, code card, etc.) entrance-stagger.
- **Polaroid** (`id-photo.png`, dashed outline `2px dashed #c39ad4`, offset 7px, caption "Songqi 🌸") starts tucked *behind* the board bottom (only caption visible); pointer-drag pulls it down (1.8× amplified), snaps open/closed at 30% threshold; click toggles.

### 5. Experience — duck timeline
- Pastel wash bg `linear-gradient(125deg,#e9edfd,#f1ecfb 34%,#e6effd 62%,#e2ebfb)` + radial pastel glows. "Journey / Experience" heading, hint "Drag the little duck onto a node to unfold that chapter 🐣".
- Full-width 2px gradient line `#c8b4e8→#a8c4f0` (scaleX entrance). 5 equal cards (min-height 150px, white `#f6f7fc`, radius 14px) with dot nodes on the line. **Duck** (`duck.png`, 64px) is pointer-draggable along the line; it can only rest ON a node (nearest within 48px, else springs back, `cubic-bezier(.3,1.4,.4,1)`); only the card under the duck expands (max-height 0→260px + dot glow), others collapse.
- Cards: 2025 Reid Concert Hall recording / 2024 Content creator 230K+ / 2023 One World Shop / 2022–23 EUCSA publicity / 2010 14 Years on Stage.

### 6. Contact — letter
- Holographic pastel bg `linear-gradient(170deg,#f6dcc9,#f7f0cd 22%,#d9f0dd 44%,#cfe4f9 66%,#c9d4f6 84%,#dfe7fb)` + white light bands.
- Single centered card `#eef1fb` radius 30px, `min(720px,100%)`. Title **"Send letter to me!"** `#c39ad4` between rules. Three fields with Caveat labels (name / your email / content) — underline inputs, dashed dividers, textarea resizable. **"let's chat!"** hand-drawn-border button aligned right; on click builds `mailto:hello@songqi.studio?subject=Letter from {name}&body={content}\n\nFrom: {name} <{email}>`.

## Dock (all pages)
Fixed right-center pill: `rgba(255,255,255,0.62)` + `backdrop-blur(20px) saturate(1.4)`, border `rgba(255,255,255,0.85)`. Six 36px circular icon buttons (Home/About/Work/Skills/Experience/Contact, 16px stroke icons); active state color `#ab7cbe` bg `rgba(195,154,212,0.14)`; white tooltip on the left of each. **Whole dock scales 1.35 on hover** (origin right-center, `transform .32s cubic-bezier(.3,1.2,.4,1)`).

## Page transitions
Pages crossfade/slide via GSAP in the reference (`showPage`/`animatePage`). Per-page entrances: home fade-up stagger; experience line scaleX + card stagger; skills pin stagger; about text stagger then marks draw. Use Framer Motion `AnimatePresence` + variants for equivalents.

## Design Tokens
- Theme (frosted sunset): primary `#c39ad4`, deep `#ab7cbe`, pinks `#e2a6c4 #eebbd2 #f4cede`, ink `#1c2138`, body text `#3f4560 / #535a72 / #5d6377`, muted `#8b90a8`, paper `#eef1fb`.
- Sunset bg stops: `#8f7ed6 #b98ad8 #ea8fc0 #ff9aa8 #ffb488 #ffd9a4`.
- Logic UI: bg `#1c1c1e/#232325`, toolbar `#39393d→#2c2c2f`, LCD `#101113` text `#8fd4ff`, meter green `#35d05a`.
- Fonts: PT Serif (display serif), Caveat (handwritten), Helvetica Neue (body), ui-monospace (LCD). Google Fonts: PT Serif, Caveat, Source Serif 4.
- Radii: cards 14–30px, monitor 18/14/6px, pills 999px. Slide/hover easings: `cubic-bezier(.3,1.2,.4,1)` (bouncy), `power3.out` equivalents.

## Assets (`assets/` → copy to `public/assets/`)
- `spring.mp3, campus-song.mp3 (Crash), dream.wav, sky.mp3, shaonian-de-meng.mp3 (Golden Sunset)` — the 5 tracks
- `duck.png` (Experience duck), `id-photo.png` (Skills polaroid), `letter-girl.png` (About photo)

## Files in this bundle
- `index.html` + `support.js` — open in a browser for the **live reference**
- `Sound Studio.dc.html` — full site design source (same file as index.html)
- `Mac Player.dc.html` — Home monitor component (intro / Logic / Musical Typing)
- `assets/` — all images + audio
