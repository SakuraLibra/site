// Playground — a reserved spot for a small embedded game.
// Mount your game inside <div className="game-mount"> below (canvas / iframe / React component).
export default function Studio() {
  return (
    <div className="studio2">
      <p className="studio-sub">A mini-game lives here — drop it into the reserved area below (keyboard rhythm game, beat matcher, whatever’s fun).</p>

      <div className="game-slot" role="group" aria-label="Mini-game area">
        {/* ↓↓↓ mount your game here (canvas, iframe, or a React component) ↓↓↓ */}
        <div className="game-mount">
          <div className="game-placeholder">
            <span className="game-ico" aria-hidden="true">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="4" />
                <path d="M7 12h3M8.5 10.5v3" /><circle cx="16" cy="11" r="1" /><circle cx="18.5" cy="13.5" r="1" />
              </svg>
            </span>
            <strong>Mini-game area — reserved</strong>
            <span className="game-hint">Coming soon · mount it in <code>game-mount</code></span>
          </div>
        </div>
        {/* ↑↑↑ mount your game here ↑↑↑ */}
      </div>
    </div>
  )
}
