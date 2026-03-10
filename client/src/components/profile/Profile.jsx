import { useEffect, useState, useRef } from 'react';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { updateProfile, changePassword } from '../../services/authService.js';
import { computeLevel } from '../../utils/level.js';
import { gameEvents } from '../../utils/events.js';

const AVATAR_OPTIONS = ['🐒', '🤖', '🦊', '🐼', '🦁', '🐸', '🐵', '🐻', '🐯', '🐨', '🐲', '🦄', '👾', '🎃', '🥷'];

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter (a-z)', test: (p) => /[a-z]/.test(p) },
  { label: 'One number (0-9)', test: (p) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

function AnimatedCounter({ value, duration = 2000, formatter = (n) => n }) {
  const [count, setCount] = useState(0);

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
  const [avatar, setAvatar] = useState(user?.avatar || '🐒');
  const [bio, setBio] = useState(user?.bio || '');
  const [preferredCharacter, setPreferredCharacter] = useState(user?.preferredCharacter || 'monkey');
  const [totalGames, setTotalGames] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [totals, setTotals] = useState({ totalBananas: 0, fastestDuration: null });
  const [memberSince, setMemberSince] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // avatar picker state
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // bio editing state
  const [editingBio, setEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState('');

  // password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMsg, setPwMsg] = useState({ text: '', type: '' });

  // profile save feedback
  const [saveMsg, setSaveMsg] = useState('');

  const fetchMe = async () => {
    try {
      const { data } = await api.get('/api/auth/me');
      if (data?.user) {
        setUsername(data.user.username);
        setAvatar(data.user.avatar || '🐒');
        setBio(data.user.bio || '');
        setPreferredCharacter(data.user.preferredCharacter || 'monkey');
        setTotalGames(data.user.totalGames || data.user.totals?.totalGames || 0);
        setTotalScore(undefined);
        setAchievements(data.user.achievements || []);
        setTotals(data.user.totals || { totalBananas: 0, fastestDuration: null });
        setMemberSince(data.user.createdAt || null);
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

  // Ridmi: save username
  const onSaveUsername = async () => {
    try {
      const res = await updateProfile({ username: username.trim() });
      setUser({ ...(user || {}), username: res.user.username });
      try { localStorage.setItem('authUser', JSON.stringify({ ...(user || {}), username: res.user.username })); } catch {}
      setIsEditing(false);
      flashSave('Username updated!');
    } catch (err) {
      flashSave(err?.response?.data?.message || 'Failed to update username');
    }
  };

  // Ridmi: save avatar
  const onPickAvatar = async (emoji) => {
    setAvatar(emoji);
    setShowAvatarPicker(false);
    try {
      await updateProfile({ avatar: emoji });
      setUser({ ...(user || {}), avatar: emoji });
      flashSave('Avatar updated!');
    } catch (_) {
      flashSave('Failed to update avatar');
    }
  };

  // Ridmi: save bio
  const onSaveBio = async () => {
    try {
      await updateProfile({ bio: bioInput });
      setBio(bioInput);
      setEditingBio(false);
      flashSave('Bio updated!');
    } catch (err) {
      flashSave(err?.response?.data?.message || 'Failed to update bio');
    }
  };

  // Ridmi: switch preferred character
  const onSwitchCharacter = async (char) => {
    setPreferredCharacter(char);
    try {
      await updateProfile({ preferredCharacter: char });
      setUser({ ...(user || {}), preferredCharacter: char });
      flashSave(`Character set to ${char}!`);
    } catch (_) {
      flashSave('Failed to update character');
    }
  };

  // Ridmi: change password flow
  const onChangePassword = async () => {
    setPwMsg({ text: '', type: '' });
    if (!currentPw || !newPw) { setPwMsg({ text: 'Fill in all fields', type: 'error' }); return; }
    if (newPw !== confirmPw) { setPwMsg({ text: 'New passwords do not match', type: 'error' }); return; }
    const allPassed = PASSWORD_RULES.every((r) => r.test(newPw));
    if (!allPassed) { setPwMsg({ text: 'New password does not meet requirements', type: 'error' }); return; }
    try {
      const res = await changePassword({ currentPassword: currentPw, newPassword: newPw });
      setPwMsg({ text: res.message || 'Password changed!', type: 'success' });
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setTimeout(() => setShowPasswordModal(false), 1200);
    } catch (err) {
      setPwMsg({ text: err?.response?.data?.message || 'Failed to change password', type: 'error' });
    }
  };

  const flashSave = (msg) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(''), 2500);
  };

  const { level, nextAt } = computeLevel(totals.totalBananas || 0);
  const fastestTime = totals.fastestDuration ? `${totals.fastestDuration}s` : 'N/A';
  const pwStrength = PASSWORD_RULES.filter(r => r.test(newPw));

  return (
    <div className="profile-container">
      {/* Save feedback toast */}
      {saveMsg && <div className="profile-toast">{saveMsg}</div>}

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle clickable" onClick={() => setShowAvatarPicker(!showAvatarPicker)} title="Change avatar">
            <div className="avatar-character">{avatar}</div>
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
                  <button className="btn-save" onClick={onSaveUsername}>✓</button>
                  <button className="btn-cancel" onClick={() => setIsEditing(false)}>✕</button>
                </div>
              </div>
            ) : (
              <div className="username-display">
                <h1 className="username">{username}</h1>
                <button className="edit-btn" onClick={() => setIsEditing(true)}>✏️</button>
                {achievements.length > 0 && (
                  <div className="achievements-inline">
                    {achievements.slice(0, 3).map((achievement) => (
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

          {/* Bio */}
          <div className="bio-section">
            {editingBio ? (
              <div className="bio-edit">
                <input
                  className="bio-input"
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value.slice(0, 120))}
                  placeholder="Write a short bio..."
                  maxLength={120}
                  autoFocus
                />
                <span className="bio-char-count">{bioInput.length}/120</span>
                <div className="edit-actions">
                  <button className="btn-save" onClick={onSaveBio}>✓</button>
                  <button className="btn-cancel" onClick={() => setEditingBio(false)}>✕</button>
                </div>
              </div>
            ) : (
              <div className="bio-display" onClick={() => { setBioInput(bio); setEditingBio(true); }}>
                <span className="bio-text">{bio || 'Click to add a bio...'}</span>
                <span className="bio-edit-icon">✏️</span>
              </div>
            )}
          </div>

          <div className="profile-meta-row">
            <div className="level-badge">
              <span className="level-text">Level {level}</span>
            </div>
            {memberSince && (
              <span className="member-since">
                🗓️ Joined {new Date(memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Character Selection */}
      <div className="identity-section">
        <h3 className="section-title">Your Character</h3>
        <div className="character-select-row">
          <button
            className={`character-option ${preferredCharacter === 'monkey' ? 'active' : ''}`}
            onClick={() => onSwitchCharacter('monkey')}
          >
            <span className="char-icon">🐒</span>
            <span className="char-name">Monkey</span>
            {preferredCharacter === 'monkey' && <span className="char-active-badge">Active</span>}
          </button>
          <button
            className={`character-option ${preferredCharacter === 'robot' ? 'active' : ''}`}
            onClick={() => onSwitchCharacter('robot')}
          >
            <span className="char-icon">🤖</span>
            <span className="char-name">Robot</span>
            {preferredCharacter === 'robot' && <span className="char-active-badge">Active</span>}
          </button>
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

      {/* Account Security */}
      <div className="identity-section">
        <h3 className="section-title">Account Security</h3>
        <div className="security-row">
          <div className="security-item">
            <span className="security-icon">🔒</span>
            <div className="security-info">
              <span className="security-label">Password</span>
              <span className="security-detail">••••••••</span>
            </div>
            <button className="btn change-pw-btn" onClick={() => { setShowPasswordModal(true); setPwMsg({ text: '', type: '' }); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }}>
              Change
            </button>
          </div>
          <div className="security-item">
            <span className="security-icon">📧</span>
            <div className="security-info">
              <span className="security-label">Email</span>
              <span className="security-detail">{user?.email || '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Picker Overlay */}
      {showAvatarPicker && (
        <>
          <div className="avatar-picker-backdrop" onClick={() => setShowAvatarPicker(false)} />
          <div className="avatar-picker">
            <div className="avatar-picker-title">Pick Your Avatar</div>
            <div className="avatar-picker-grid">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  className={`avatar-picker-item ${emoji === avatar ? 'selected' : ''}`}
                  onClick={() => onPickAvatar(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="pw-modal-backdrop" onClick={() => setShowPasswordModal(false)}>
          <div className="pw-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Change Password</h3>
            <div className="form">
              <input type="password" placeholder="Current password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
              <input type="password" placeholder="New password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
              {newPw && (
                <div className="pw-strength-mini">
                  <div className="strength-bar-track">
                    <div className="strength-bar-fill" style={{ width: `${(pwStrength.length / PASSWORD_RULES.length) * 100}%`, background: pwStrength.length <= 2 ? '#ff4444' : pwStrength.length <= 3 ? '#ffaa00' : '#00dd66' }} />
                  </div>
                  <ul className="strength-rules">
                    {PASSWORD_RULES.map((r, i) => (
                      <li key={i} className={r.test(newPw) ? 'rule-pass' : 'rule-fail'}>
                        <span className="rule-icon">{r.test(newPw) ? '✓' : '✗'}</span> {r.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <input type="password" placeholder="Confirm new password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
            </div>
            {pwMsg.text && <p className={pwMsg.type === 'error' ? 'error' : 'success-msg'} style={{ textAlign: 'center', marginTop: 8 }}>{pwMsg.text}</p>}
            <div className="pw-modal-actions">
              <button className="btn primary" onClick={onChangePassword} disabled={!currentPw || !newPw || newPw !== confirmPw || !PASSWORD_RULES.every(r => r.test(newPw))}>Update Password</button>
              <button className="btn" onClick={() => setShowPasswordModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
