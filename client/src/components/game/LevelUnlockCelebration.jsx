import { useEffect, useState } from 'react';

export default function LevelUnlockCelebration({ level, onComplete }) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (level) {
      setVisible(true);
      setAnimating(true);
      
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setAnimating(false);
        setTimeout(() => {
          setVisible(false);
          if (onComplete) onComplete();
        }, 500);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [level, onComplete]);

  if (!visible || !level) return null;

  const getLevelInfo = (levelNum) => {
    const levels = {
      1: { title: "Bronze Runner", color: "#cd7f32", icon: "🥉" },
      2: { title: "Silver Sprinter", color: "#c0c0c0", icon: "🥈" },
      3: { title: "Gold Champion", color: "#ffd700", icon: "🥇" }
    };
    return levels[levelNum] || levels[1];
  };

  const levelInfo = getLevelInfo(level);

  return (
    <div className={`level-unlock-overlay ${animating ? 'animate' : 'fade-out'}`}>
      <div className="celebration-container">
        <div className="celebration-fireworks">
          <div className="firework"></div>
          <div className="firework"></div>
          <div className="firework"></div>
          <div className="firework"></div>
        </div>
        
        <div className="celebration-content">
          <div className="celebration-icon">{levelInfo.icon}</div>
          <h1 className="celebration-title">LEVEL UP!</h1>
          <h2 className="celebration-level" style={{ color: levelInfo.color }}>
            {levelInfo.title}
          </h2>
          <p className="celebration-message">
            🎉 Congratulations! You've unlocked Level {level}! 🎉
          </p>
          <div className="celebration-badge">
            <div 
              className="badge-glow" 
              style={{ 
                background: `radial-gradient(circle, ${levelInfo.color}44, transparent)` 
              }}
            ></div>
            <div className="badge-number" style={{ borderColor: levelInfo.color, color: levelInfo.color }}>
              {level}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}