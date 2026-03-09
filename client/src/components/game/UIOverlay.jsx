import { useRef, useCallback } from 'react';

export default function UIOverlay({ score = 0, time = 0, lives = 3, started = true, onStart, character, onSelectCharacter, onMoveLeft, onMoveRight, onJump, onSlide }) {
  // swipe detection for mobile controls
  const touchStart = useRef(null);

  const onTouchStart = useCallback((e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, time: Date.now() };
  }, []);

  const onTouchEnd = useCallback((e) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    const dt = Date.now() - touchStart.current.time;
    touchStart.current = null;
    if (dt > 500) return; // ignore slow gestures
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const minSwipe = 30;
    if (absDx > absDy && absDx > minSwipe) {
      dx > 0 ? onMoveRight() : onMoveLeft();
    } else if (absDy > absDx && absDy > minSwipe) {
      dy < 0 ? onJump() : onSlide();
    }
  }, [onMoveLeft, onMoveRight, onJump, onSlide]);

  return (
    <div style={{ position: 'fixed', top: 52, left: 0, right: 0, bottom: 0, zIndex: 1000, pointerEvents: 'none' }}>
      {!started && (
        <div style={{ display: 'grid', placeItems: 'center', height: 'calc(100% - 0px)', pointerEvents: 'auto' }}>
          <div className="modal start-modal" style={{ textAlign:'center' }}>
            <h2 style={{ margin: 0, marginBottom: 12 }}>🍌 Banana Runner</h2>
            <p style={{ marginTop: 0, marginBottom: 16 }}>Run through the jungle, collect bananas, answer puzzles to survive!</p>
            <div className="char-select">
              {['monkey', 'robot'].map((c) => (
                <button key={c} className="btn" style={{ opacity: character === c ? 1 : 0.7 }} onClick={() => onSelectCharacter(c)}>
                  {c === 'monkey' ? '🐒 Monkey' : '🤖 Robot'}
                </button>
              ))}
            </div>
            <button className="btn primary" onClick={onStart} disabled={!character}>Start Run</button>
          </div>
        </div>
      )}
      {started && (
        <>
          <div className="hud" style={{ pointerEvents: 'none' }}>
            <div className="group">
              <div className="pill"><span className="emoji">⏱️</span> {Math.floor(time)}s</div>
              <div className="pill"><span className="emoji">❤️</span> {lives}</div>
            </div>
            <div className="pill"><span className="emoji">🍌</span> {score}</div>
          </div>
          {/* swipe zone for mobile */}
          <div
            className="swipe-zone"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{ position: 'absolute', top: 60, left: 0, right: 0, bottom: 120, pointerEvents: 'auto', zIndex: 1 }}
          />
          <div className="controls" style={{ pointerEvents: 'auto' }}>
            <button className="control-btn" aria-label="Move Left" onPointerDown={onMoveLeft}>←</button>
            <div className="vertical">
              <button className="control-btn" aria-label="Jump" onPointerDown={onJump}>↑</button>
              <button className="control-btn" aria-label="Slide" onPointerDown={onSlide}>↓</button>
            </div>
            <button className="control-btn" aria-label="Move Right" onPointerDown={onMoveRight}>→</button>
          </div>
        </>
      )}
    </div>
  );
}
