import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { computeLevel } from '../../utils/level.js';

const LEVELS = [
  { name: 'Bronze Runner', threshold: 25, color: '#cd7f32', description: 'Collect 25 bananas' },
  { name: 'Silver Sprinter', threshold: 75, color: '#c0c0c0', description: 'Collect 75 bananas' },
  { name: 'Gold Champion', threshold: 125, color: '#ffd700', description: 'Collect 125 bananas' },
];

export default function MainMenu() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const bananas = user?.bananas ?? 0;
  const { level } = computeLevel(bananas);

  return (
    <div className="main-hero">
      <h1>🍌 Banana Runner</h1>
      <p className="muted">Collect bananas, unlock levels, climb the leaderboard!</p>

      <div className="level-system">
        <div className="levels-container-horizontal">
          {LEVELS.map((l, i) => {
            const unlocked = level > i;
            return (
              <div
                key={l.name}
                className={`level-card ${unlocked ? 'unlocked' : 'locked'}`}
              >
                <div
                  className="level-badge"
                  style={{ borderColor: unlocked ? l.color : '#ff6b6b' }}
                >
                  {unlocked ? (
                    <span className="level-number" style={{ color: l.color }}>{i + 1}</span>
                  ) : (
                    <span className="lock-icon">🔒</span>
                  )}
                </div>
                <div className="level-info">
                  <h3 className="level-title">{l.name}</h3>
                  <p className={`level-description ${unlocked ? '' : 'muted'}`}>{l.description}</p>
                </div>
                <div className={`level-status ${unlocked ? 'unlocked-text' : 'locked-text'}`}>
                  {unlocked ? '✅ Unlocked' : `🔒 ${l.threshold} bananas`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
        <button className="btn primary" onClick={() => navigate('/game')}>
          ▶ Play
        </button>
        <button className="btn" onClick={() => navigate('/leaderboard')}>
          🏆 Leaderboard
        </button>
      </div>

      {user && (
        <p className="muted" style={{ marginTop: '24px' }}>
          Welcome back, <strong>{user.username}</strong> — {bananas} bananas collected
        </p>
      )}
    </div>
  );
}
