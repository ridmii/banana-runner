import { useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';
import { computeLevel } from '../../utils/level.js';
import { gameEvents } from '../../utils/events.js';
import { useAuthContext } from '../../context/AuthContext.jsx';

// use emoji avatars/icons to avoid extra dependencies
const getRankIcon = (position) => {
  switch (position) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return '🏃';
  }
};

const getLevelIcon = (level) => {
  if (level >= 3) return '👑';
  if (level >= 2) return '⭐';
  return '🔰';
};

const getUserAvatar = (username, isCurrent) => {
  if (isCurrent) return '👤';
  // generate a simple avatar from username initial
  const firstChar = username.charAt(0).toLowerCase();
  const avatars = {
    'a': '🐵', 'b': '🐱', 'c': '🐶', 'd': '🐺', 'e': '🦊', 'f': '🐯', 
    'g': '🦁', 'h': '🐸', 'i': '🐼', 'j': '🐨', 'k': '🐰', 'l': '🐭',
    'm': '🐹', 'n': '🦄', 'o': '🐷', 'p': '🐧', 'q': '🐔', 'r': '🐦',
    's': '🦅', 't': '🐢', 'u': '🦋', 'v': '🐝', 'w': '🐛', 'x': '🦗',
    'y': '🐙', 'z': '🦀'
  };
  return avatars[firstChar] || '👾';
};

function LeaderboardRow({ player, position }) {
  const isCurrent = player.username.includes('(You)');
  const username = player.username.replace(' (You)', '');
  
  return (
    <div className={`leaderboard-row-compact ${isCurrent ? 'current-user' : ''} ${position <= 3 ? 'top-three' : ''}`}>
      <div className="rank-section-compact">
        <span className="rank-number">{position}</span>
        <span className="rank-icon">{getRankIcon(position)}</span>
      </div>
      
      <div className="player-compact">
        <span className="avatar">{getUserAvatar(username, isCurrent)}</span>
        <div className="player-name-compact">
          {username}
          {isCurrent && <span className="you-badge">You</span>}
        </div>
      </div>
      
      <div className="score-compact">
        <span className="score-icon">🍌</span>
        <span className="score-value">{player.totals?.totalBananas || player.score || 0}</span>
      </div>
      
      <div className="level-compact">
        <span className="level-icon">{getLevelIcon(player.level)}</span>
        <span className="level-text">{player.level}</span>
      </div>
      
      {player.achievements && player.achievements.length > 0 && (
        <div className="achievements-compact">
          <span className="achievement-count">{player.achievements.length}</span>
          <span className="achievements-icon">🏅</span>
        </div>
      )}
    </div>
  );
}

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const { user } = useAuthContext();

  const fetchLeaderboard = async () => {
    try {
      const { data } = await api.get('/api/leaderboard/rich');
      setScores(data.scores || []);
    } catch (_) {
      try {
        const { data } = await api.get('/api/leaderboard');
        setScores(data.scores || []);
      } catch {
        const stored = JSON.parse(localStorage.getItem('leaderboard') || '[]');
        setScores(stored);
      }
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const onSaved = () => fetchLeaderboard();
    gameEvents.on('score:saved', onSaved);
    return () => gameEvents.off('score:saved', onSaved);
  }, []);

  const enriched = useMemo(() => {
    const list = scores.map((s) => {
      const username = s.user?.username || s.username || 'anon';
      const score = s.totals?.totalBananas || s.score || s.bananas || 0;
      const { level } = computeLevel(score);
      const achievements = s.achievements || [];
      const totals = s.totals || {};
      const isCurrent =
        (user?.username && username === user.username) ||
        (user?.id && s.user?.id && String(s.user.id) === String(user.id));
      const displayName = isCurrent ? `${username} (You)` : username;
      return { id: s._id || s.user?.id || username + score, username: displayName, score, level, achievements, totals };
    });
    return list.sort((a, b) => b.score - a.score);
  }, [scores]);

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>🏆 Leaderboard</h1>
        <p className="leaderboard-subtitle">
          Top Banana Runners • {enriched.length} Players
        </p>
      </div>
      
      {enriched.length === 0 ? (
        <div className="empty-leaderboard">
          <span className="empty-icon">📋</span>
          <h3>No scores yet!</h3>
          <p>Be the first to set a high score!</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {enriched.length >= 3 && (
            <div className="podium-section">
              <h2>🏆 Top Runners</h2>
              <div className="podium">
                {/* Second place */}
                <div className="podium-place second">
                  <div className="podium-player">
                    <span className="podium-avatar">{getUserAvatar(enriched[1].username.replace(' (You)', ''), enriched[1].username.includes('(You)'))}</span>
                    <span className="podium-name">{enriched[1].username.replace(' (You)', '')}</span>
                    <span className="podium-score">🍌 {enriched[1].totals?.totalBananas || enriched[1].score}</span>
                  </div>
                  <div className="podium-base silver">2</div>
                </div>
                
                {/* First place */}
                <div className="podium-place first">
                  <div className="podium-player">
                    <span className="podium-avatar">{getUserAvatar(enriched[0].username.replace(' (You)', ''), enriched[0].username.includes('(You)'))}</span>
                    <span className="podium-name">{enriched[0].username.replace(' (You)', '')}</span>
                    <span className="podium-score">🍌 {enriched[0].totals?.totalBananas || enriched[0].score}</span>
                  </div>
                  <div className="podium-base gold">1</div>
                </div>
                
                {/* Third place */}
                <div className="podium-place third">
                  <div className="podium-player">
                    <span className="podium-avatar">{getUserAvatar(enriched[2].username.replace(' (You)', ''), enriched[2].username.includes('(You)'))}</span>
                    <span className="podium-name">{enriched[2].username.replace(' (You)', '')}</span>
                    <span className="podium-score">🍌 {enriched[2].totals?.totalBananas || enriched[2].score}</span>
                  </div>
                  <div className="podium-base bronze">3</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Full Leaderboard */}
          <div className="leaderboard-list">
            <h2>📊 Complete Rankings</h2>
            <div className="leaderboard-rows">
              {enriched.map((player, index) => (
                <LeaderboardRow
                  key={player.id}
                  player={player}
                  position={index + 1}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
