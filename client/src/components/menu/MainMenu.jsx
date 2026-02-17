import { Link } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext.jsx';

// Animated Level Badge Component
function AnimatedLevelBadge({ level, isUnlocked, color }) {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className={`level-badge ${animate ? 'animate' : ''}`} style={{
      background: isUnlocked 
        ? `linear-gradient(135deg, ${color}, ${color}55)` 
        : 'linear-gradient(135deg, #666, #999)',
      borderColor: isUnlocked ? color : '#666'
    }}>
      {isUnlocked ? (
        <div className="level-number" style={{ color: color }}>
          {level}
        </div>
      ) : (
        <div className="lock-icon">
          🔒
        </div>
      )}
    </div>
  );
}

export default function MainMenu() {
  const { user } = useAuthContext();
  
  // Get user progress from authenticated user data
  const userBananas = user?.totals?.totalBananas || user?.totalBananas || 0;
  
  const levels = [
    {
      level: 1,
      title: "Bronze Runner",
      description: "Collect 25 bananas",
      bananas: 25,
      color: "#cd7f32"
    },
    {
      level: 2,
      title: "Silver Sprinter", 
      description: "Collect 75 bananas",
      bananas: 75,
      color: "#c0c0c0"
    },
    {
      level: 3,
      title: "Gold Champion",
      description: "Collect 150 bananas",
      bananas: 150,
      color: "#ffd700"
    }
  ];

  const isLevelUnlocked = (requiredBananas) => userBananas >= requiredBananas;

  return (
    <div className="main-hero">
      <div>
        <h1 style={{ marginBottom: 8 }}>🍌 Banana Runner</h1>
        <p className="muted" style={{ marginBottom: 30 }}>Endless 3D Banana Runner</p>
        
        {/* Level System Display */}
        <div className="level-system">
          <h2 style={{ marginBottom: 20, color: 'var(--text)' }}>Achievement Levels</h2>
          <div className="levels-container-horizontal">
            {levels.map((levelInfo) => {
              const unlocked = isLevelUnlocked(levelInfo.bananas);
              return (
                <div key={levelInfo.level} className={`level-card ${unlocked ? 'unlocked' : 'locked'}`}>
                  <AnimatedLevelBadge 
                    level={levelInfo.level} 
                    isUnlocked={unlocked}
                    color={levelInfo.color}
                  />
                  <div className="level-info">
                    <h3 className="level-title" style={{ 
                      background: unlocked 
                        ? `linear-gradient(135deg, ${levelInfo.color}, var(--primary))` 
                        : 'linear-gradient(135deg, #666, #999)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {levelInfo.title}
                    </h3>
                    <p className={`level-description ${unlocked ? '' : 'muted'}`}>
                      {levelInfo.description}
                    </p>
                    <div className="level-status">
                      {unlocked ? (
                        <span className="unlocked-text">✅ Unlocked!</span>
                      ) : (
                        <span className="locked-text">🔒 Locked</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 30 }}>
          <Link className="btn primary" to="/game">Play</Link>
          <Link className="btn" to="/leaderboard">Leaderboard</Link>
        </div>
        
        {/* Player progress display */}
        <div style={{ marginTop: 20, textAlign: 'center', fontSize: '0.9em', color: 'var(--muted)' }}>
          Welcome back, {user?.username}! You've collected {userBananas} bananas
        </div>
      </div>
    </div>
  );
}
