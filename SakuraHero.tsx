import { useEffect, useRef, useState } from 'react';

/**
 * SakuraHero — animated + interactive pixel-art hero.
 *
 * Layers, bottom to top:
 *   image → sun shafts → dappled light → petal canvas → grade → hotspots
 *
 * The petal canvas renders at low resolution and is scaled up with
 * `image-rendering: pixelated`, so petals share the artwork's pixel grid.
 *
 * Usage:
 *   <SakuraHero src="/hero.webp" onSelect={(id) => navigate(`/${id}`)} />
 */

/* ---------- hotspots: all values are % of the frame ---------- */
export type SpotId = 'work' | 'skills' | 'experience' | 'about';

type Spot = {
  id: SpotId;
  cn: string;
  en: string;
  box: { left: number; top: number; width: number; height: number };
  note: { left: number; top: number; rot: number };
};

export const SPOTS: Spot[] = [
  { id: 'work', cn: '作品', en: 'Work',
    box: { left: 36.1, top: 22.5, width: 35.2, height: 42.3 },
    note: { left: 38, top: 12.5, rot: -2 } },
  { id: 'skills', cn: '技能', en: 'Skills',
    box: { left: 0, top: 53.5, width: 27, height: 15.5 },
    note: { left: 20, top: 44, rot: 2 } },
  { id: 'experience', cn: '经历', en: 'Experience',
    box: { left: 65.5, top: 2, width: 15.6, height: 21.7 },
    note: { left: 48, top: 5, rot: -3 } },
  { id: 'about', cn: '关于', en: 'About',
    box: { left: 71.8, top: 30, width: 25.7, height: 70 },
    note: { left: 58, top: 76, rot: 2 } },
];

/* ---------- particle config ---------- */
const CFG = {
  petalCount: 46, fallSpeed: 0.16, swayAmount: 0.55, windBase: 0.1,
  gustStrength: 0.3, gustEvery: 9, moteCount: 26, artWidth: 420,
};
const PETAL_COLORS = ['#f6bcd0', '#efa5be', '#fad7e3', '#e991b0', '#fdeaf1'];

type Petal = { x: number; y: number; z: number; phase: number; spin: number; swayFreq: number; c: string; drop: number };
type Mote = { x: number; y: number; z: number; ph: number; sp: number };
const rand = (a: number, b: number) => a + Math.random() * (b - a);

interface Props {
  src: string;
  alt?: string;
  className?: string;
  onSelect?: (id: SpotId) => void;
  children?: React.ReactNode;
}

export default function SakuraHero({
  src, alt = '像素风工作室场景', className = '', onSelect, children,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const [engaged, setEngaged] = useState(false);

  useEffect(() => {
    const cv = cvRef.current, wrap = wrapRef.current;
    if (!cv || !wrap) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let AW = CFG.artWidth, AH = 0, raf = 0, running = true, t0: number | null = null;

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      if (!r.width) return;
      AH = Math.round(AW * (r.height / r.width));
      cv.width = AW; cv.height = AH;
      ctx.imageSmoothingEnabled = false;
    };

    const makePetal = (seeded: boolean): Petal => ({
      x: rand(-20, AW + 20), y: seeded ? rand(-AH, AH) : rand(-30, -4),
      z: rand(0.45, 1), phase: rand(0, Math.PI * 2), spin: rand(0.018, 0.045),
      swayFreq: rand(0.01, 0.024),
      c: PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0], drop: rand(0.8, 1.3),
    });
    const makeMote = (): Mote => ({
      x: rand(0, AW), y: rand(0, AH), z: rand(0.3, 1), ph: rand(0, 6.28), sp: rand(0.004, 0.012),
    });

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const petals = Array.from({ length: CFG.petalCount }, () => makePetal(true));
    const motes = Array.from({ length: CFG.moteCount }, makeMote);

    const drawPetal = (p: Petal) => {
      const flip = Math.abs(Math.cos(p.phase));
      const w = Math.max(1, Math.round((1 + flip * 2.2) * p.z));
      const h = Math.max(1, Math.round(2 * p.z));
      const x = Math.round(p.x), y = Math.round(p.y);
      ctx.globalAlpha = 0.55 + p.z * 0.45;
      ctx.fillStyle = p.c;
      ctx.fillRect(x, y, w, h);
      if (w > 1) {
        ctx.globalAlpha *= 0.55;
        ctx.fillRect(x + (Math.cos(p.phase) > 0 ? w : -1), y, 1, Math.max(1, h - 1));
      }
      ctx.globalAlpha = 1;
    };

    const frame = (ts: number) => {
      if (!running) return;
      if (t0 === null) t0 = ts;
      const t = (ts - t0) / 1000;
      ctx.clearRect(0, 0, AW, AH);

      const gp = (t % CFG.gustEvery) / CFG.gustEvery;
      const gust = Math.max(0, Math.sin(gp * Math.PI * 2)) ** 2 * CFG.gustStrength;

      ctx.fillStyle = '#fff3d6';
      for (const m of motes) {
        m.ph += m.sp; m.x += 0.05 + gust * 0.3; m.y += Math.sin(m.ph) * 0.05 - 0.012;
        if (m.x > AW) m.x = 0;
        if (m.y < -2) m.y = AH * 0.75;
        if (m.x > AW * 0.62 || m.y > AH * 0.82) continue;
        ctx.globalAlpha = (0.1 + 0.28 * Math.abs(Math.sin(m.ph))) * m.z;
        ctx.fillRect(Math.round(m.x), Math.round(m.y), 1, 1);
      }
      ctx.globalAlpha = 1;

      for (const p of petals) {
        p.phase += p.spin;
        p.y += CFG.fallSpeed * p.drop * (0.5 + p.z);
        p.x += (CFG.windBase + gust) * (0.4 + p.z)
             + Math.sin(p.y * p.swayFreq + p.phase) * CFG.swayAmount * p.z;
        if (p.y > AH + 6 || p.x > AW + 24 || p.x < -24) {
          Object.assign(p, makePetal(false));
          if (Math.random() < 0.35) p.x = rand(-24, AW * 0.4);
        }
        drawPetal(p);
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => { if (!running) { running = true; t0 = null; raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const onVis = () => (document.hidden ? stop() : start());

    document.addEventListener('visibilitychange', onVis);
    const io = new IntersectionObserver((e) => (e[0].isIntersecting ? start() : stop()), { threshold: 0 });
    io.observe(wrap);

    if (reduce) raf = requestAnimationFrame((ts) => { frame(ts); stop(); });
    else raf = requestAnimationFrame(frame);

    return () => {
      stop(); ro.disconnect(); io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`relative isolate overflow-hidden ${className}`}
      style={{ aspectRatio: '1477 / 1065' }}
    >
      <img src={src} alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ imageRendering: 'pixelated' }} />

      <div className="sh-shafts pointer-events-none absolute -inset-[25%] mix-blend-screen" />

      <div className="pointer-events-none absolute inset-0 mix-blend-soft-light">
        <i className="sh-dapple sh-d1" /><i className="sh-dapple sh-d2" />
        <i className="sh-dapple sh-d3" /><i className="sh-dapple sh-d4" />
      </div>

      <canvas ref={cvRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ imageRendering: 'pixelated' }} />

      <div className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(120% 100% at 30% 30%, rgba(255,228,170,.10), rgba(20,14,30,.28) 100%)' }} />

      {/* hotspots */}
      <div
        className={`absolute inset-0 z-[5] ${engaged ? 'sh-engaged' : ''}`}
        onPointerEnter={() => setEngaged(true)}
      >
        {SPOTS.map((s) => (
          <div key={s.id} className="contents">
            <button
              type="button"
              className="sh-spot"
              aria-label={`${s.cn} ${s.en}`}
              style={{
                left: `${s.box.left}%`, top: `${s.box.top}%`,
                width: `${s.box.width}%`, height: `${s.box.height}%`,
              }}
              onClick={() => onSelect?.(s.id)}
            >
              <span className="sh-pin" />
            </button>
            <div
              className="sh-note"
              style={{
                left: `${s.note.left}%`,
                top: `${s.note.top}%`,
                ['--rot' as never]: `${s.note.rot}deg`,
              }}
            >
              <b>{s.cn}</b>
              <span>{s.en}</span>
            </div>
          </div>
        ))}
      </div>

      {children}

      <style>{`
        .sh-shafts{
          opacity:.5;transform:rotate(22deg);
          background:
            linear-gradient(90deg,transparent 12%,rgba(255,232,180,.16) 15%,transparent 19%),
            linear-gradient(90deg,transparent 26%,rgba(255,240,200,.11) 30%,transparent 35%),
            linear-gradient(90deg,transparent 41%,rgba(255,228,175,.13) 44%,transparent 50%),
            linear-gradient(90deg,transparent 57%,rgba(255,238,195,.08) 60%,transparent 65%);
          animation:sh-breathe 11s ease-in-out infinite;
        }
        @keyframes sh-breathe{
          0%,100%{opacity:.38;transform:rotate(22deg) translateX(0)}
          50%{opacity:.60;transform:rotate(22deg) translateX(1.2%)}
        }
        .sh-dapple{position:absolute;display:block;border-radius:50%;filter:blur(14px);
          background:radial-gradient(circle,rgba(255,240,205,.85),rgba(255,240,205,0) 70%)}
        .sh-d1{left:26%;top:56%;width:16%;height:11%;animation:sh-drift1 17s ease-in-out infinite}
        .sh-d2{left:44%;top:70%;width:12%;height:8%;animation:sh-drift2 23s ease-in-out infinite}
        .sh-d3{left:8%;top:74%;width:19%;height:12%;animation:sh-drift1 29s ease-in-out infinite reverse}
        .sh-d4{left:62%;top:18%;width:14%;height:10%;animation:sh-drift2 19s ease-in-out infinite}
        @keyframes sh-drift1{0%,100%{transform:translate(0,0) scale(1);opacity:.45}50%{transform:translate(4%,-2%) scale(1.15);opacity:.8}}
        @keyframes sh-drift2{0%,100%{transform:translate(0,0) scale(1.1);opacity:.7}50%{transform:translate(-3%,2%) scale(.9);opacity:.4}}

        .sh-spot{
          position:absolute;appearance:none;background:none;border:0;padding:0;margin:0;
          cursor:pointer;outline:none;
          transition:backdrop-filter .18s ease,transform .18s ease;
        }
        .sh-spot:hover,.sh-spot:focus-visible{
          backdrop-filter:brightness(1.18) saturate(1.12) contrast(1.03);
          -webkit-backdrop-filter:brightness(1.18) saturate(1.12) contrast(1.03);
        }
        .sh-spot:active{transform:translateY(2px)}
        .sh-spot::before{
          content:'';position:absolute;inset:0;opacity:0;transition:opacity .18s ease;
          background:
            repeating-linear-gradient(90deg,#fff6e2 0 7px,transparent 7px 14px) left top/100% 3px no-repeat,
            repeating-linear-gradient(90deg,#fff6e2 0 7px,transparent 7px 14px) left bottom/100% 3px no-repeat,
            repeating-linear-gradient(180deg,#fff6e2 0 7px,transparent 7px 14px) left top/3px 100% no-repeat,
            repeating-linear-gradient(180deg,#fff6e2 0 7px,transparent 7px 14px) right top/3px 100% no-repeat;
          filter:drop-shadow(0 0 3px rgba(255,220,150,.9));
        }
        .sh-spot:hover::before,.sh-spot:focus-visible::before{opacity:1;animation:sh-ants 1.4s linear infinite}
        @keyframes sh-ants{to{background-position:14px top,14px bottom,left 14px,right 14px}}

        .sh-pin{
          position:absolute;left:50%;top:50%;width:14px;height:14px;margin:-7px 0 0 -7px;
          transform:rotate(45deg);background:#fff2d4;
          box-shadow:0 0 0 3px rgba(96,60,40,.55),0 0 12px rgba(255,215,140,.8);
          transition:opacity .35s ease;animation:sh-pin 2.4s ease-in-out infinite;
        }
        @keyframes sh-pin{0%,100%{opacity:.55;scale:1}50%{opacity:1;scale:1.25}}
        .sh-engaged .sh-pin{opacity:0}
        .sh-spot:hover .sh-pin,.sh-spot:focus-visible .sh-pin{opacity:0}

        .sh-note{
          position:absolute;z-index:6;pointer-events:none;
          background:#f2d162;color:#41341a;padding:8px 11px 9px;line-height:1.15;white-space:nowrap;
          box-shadow:2px 3px 0 rgba(90,66,20,.45),0 8px 20px -6px rgba(0,0,0,.5);
          opacity:0;transform:translateY(7px) rotate(var(--rot,-2deg)) scale(.94);
          transition:opacity .16s ease,transform .16s cubic-bezier(.2,1.5,.4,1);
        }
        .sh-note::after{
          content:'';position:absolute;left:0;right:0;top:0;height:3px;
          background:repeating-linear-gradient(90deg,#e5bf4c 0 4px,#f2d162 4px 8px);
        }
        .sh-note b{display:block;font-size:clamp(12px,1.35vw,17px);font-weight:700;letter-spacing:.5px}
        .sh-note span{display:block;font-size:clamp(8px,.85vw,10px);letter-spacing:.22em;opacity:.62;margin-top:3px;text-transform:uppercase}
        .sh-spot:hover + .sh-note,.sh-spot:focus-visible + .sh-note{
          opacity:1;transform:translateY(0) rotate(var(--rot,-2deg)) scale(1);
        }

        @media (hover:none){
          .sh-note{opacity:.94;transform:translateY(0) rotate(var(--rot,-2deg)) scale(.88)}
          .sh-pin{opacity:.7}
        }
        @media (prefers-reduced-motion:reduce){
          .sh-shafts,.sh-dapple,.sh-pin{animation:none!important}
          .sh-spot:hover::before{animation:none}
        }
      `}</style>
    </div>
  );
}
