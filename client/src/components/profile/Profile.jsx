import { useEffect, useState, useRef } from 'react';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { computeLevel } from '../../utils/level.js';
import { gameEvents } from '../../utils/events.js';

function AnimatedCounter({ value, duration = 2000, formatter = (n) => n }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = count;
    const endValue = value;
    
    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(startValue + (endValue - startValue) * easeOutQuart);
      
      setCount(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };
    
    requestAnimationFrame(updateCount);
  }, [value, duration]);

  return <span className="animated-counter">{formatter(count)}</span>;
}

export default function Profile() {
  const { user, setUser } = useAuthContext();
  const [username, setUsername] = useState(user?.username || 'Player');
  const [totalGames, setTotalGames] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [totals, setTotals] = useState({ totalBananas: 0, fastestDuration: null });
  const [isEditing, setIsEditing] = useState(false);
  const [showStats, setShowStats] = useState(true);

  const fetchMe = async () => {
    try {
      const { data } = await api.get('/api/auth/me');
      if (data?.user) {
        setUsername(data.user.username);
        // Prefer aggregated games count from totals
        setTotalGames(data.user.totalGames || data.user.totals?.totalGames || 0);
        setTotalScore(undefined);
        setAchievements(data.user.achievements || []);
        setTotals(data.user.totals || { totalBananas: 0, fastestDuration: null });
        setUser({ ...(user || {}), ...data.user });
      }
    } catch (_) {}
  };

  useEffect(() => {
    fetchMe();
    const onSaved = () => fetchMe();
    gameEvents.on('score:saved', onSaved);
    return () => gameEvents.off('score:saved', onSaved);
  }, []);

  const onSave = () => {
    setUser({ ...(user || {}), username });
    try { localStorage.setItem('authUser', JSON.stringify({ ...(user || {}), username })); } catch {}
    setIsEditing(false);
  };

  // Level is based on total bananas collected overall
  const { level, nextAt } = computeLevel(totals.totalBananas || 0);
  const averageScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
  const fastestTime = totals.fastestDuration ? `${totals.fastestDuration}s` : 'N/A';

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            <div className="avatar-character">🐒</div>
          </div>
          <div className="status-indicator"></div>
        </div>
        <div className="profile-info">
          <div className="username-section">
            {isEditing ? (
              <div className="username-edit">
                <input 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="username-input"
                  autoFocus
                />
                <div className="edit-actions">
                  <button className="btn-save" onClick={onSave}>✓</button>
                  <button className="btn-cancel" onClick={() => setIsEditing(false)}>✕</button>
                </div>
              </div>
            ) : (
              <div className="username-display">
                <h1 className="username">{username}</h1>
                <button className="edit-btn" onClick={() => setIsEditing(true)}>✏️</button>
                {achievements.length > 0 && (
                  <div className="achievements-inline">
                    {achievements.slice(0, 3).map((achievement, index) => (
                      <div key={achievement} className="achievement-mini" title={achievement}>
                        {{
                          'First Game': '🎮',
                          'Score Master': '🏆',
                          'Banana Collector': '🍌',
                          'Speed Demon': '⚡',
                          'Persistent Player': '💪'
                        }[achievement] || '🏅'}
                      </div>
                    ))}
                    {achievements.length > 3 && (
                      <div className="achievement-mini more">+{achievements.length - 3}</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="level-badge">
            <span className="level-text">Level {level}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card secondary">
          <div className="stat-icon">🎮</div>
          <div className="stat-content">
            <div className="stat-value">
              <AnimatedCounter value={totalGames || 0} />
            </div>
            <div className="stat-label">Games Played</div>
          </div>
        </div>
        
        <div className="stat-card tertiary">
          <div className="stat-icon">🍌</div>
          <div className="stat-content">
            <div className="stat-value">
              <AnimatedCounter value={totals.totalBananas || 0} />
            </div>
            <div className="stat-label">Total Bananas</div>
          </div>
        </div>
        
        <div className="stat-card quaternary">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <div className="stat-value">{fastestTime}</div>
            <div className="stat-label">Best Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}
