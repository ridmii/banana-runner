export default function UIOverlay({ score = 0, time = 0, lives = 3, started = true, onStart, character, onSelectCharacter, onMoveLeft, onMoveRight, onJump, onSlide }) {
  return (
    <div style={{ position: 'fixed', top: 52, left: 0, right: 0, bottom: 0, zIndex: 1000, pointerEvents: 'none' }}>
      {!started && (
        <div style={{ display: 'grid', placeItems: 'center', height: 'calc(100% - 0px)', pointerEvents: 'auto' }}>
          <div className="modal" style={{ textAlign:'center' }}>
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
          <div className="controls" style={{ pointerEvents: 'auto' }}>
            <button className="control-btn" aria-label="Move Left" onClick={onMoveLeft}>←</button>
            <div className="vertical">
              <button className="control-btn" aria-label="Jump" onClick={onJump}>↑</button>
              <button className="control-btn" aria-label="Slide" onClick={onSlide}>↓</button>
            </div>
            <button className="control-btn" aria-label="Move Right" onClick={onMoveRight}>→</button>
          </div>
        </>
      )}
    </div>
  );
}
