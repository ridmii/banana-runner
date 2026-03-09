export default function QuestionOverlay({ image, onSubmit, onCancel, feedback }) {
  return (
    <div style={{ position: 'fixed', top: 52, left: 0, right: 0, bottom: 0, display: 'grid', placeItems: 'center', zIndex: 2000, pointerEvents: 'none' }}>
      <div className="modal question-modal" style={{ pointerEvents: 'auto' }}>
        <h3 style={{ marginTop: 0 }}>🧠 Solve to Continue</h3>
        {image && (
          <img src={image} alt="banana puzzle" style={{ width: '100%', borderRadius: 8, marginBottom: 12 }} />
        )}
        <form onSubmit={(e) => { e.preventDefault(); const v = e.target.elements.answer.value.trim(); onSubmit(v); }}>
          <input name="answer" type="number" placeholder="Enter answer" />
          <div className="actions" style={{ marginTop: 12 }}>
            <button type="submit" className="btn primary" style={{ flex: 1 }}>Submit</button>
            <button type="button" className="btn" style={{ flex: 1 }} onClick={onCancel}>Give Up</button>
          </div>
        </form>
        {feedback && (
          <div style={{ marginTop: 10, fontWeight: 'bold', color: feedback === 'Correct!' ? '#32CD32' : '#FFD700' }}>
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
}
