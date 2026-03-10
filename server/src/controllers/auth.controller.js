import bcrypt from 'bcrypt';
import { User, AVATAR_OPTIONS } from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { Score } from '../models/Score.js';
import { computeAchievements } from '../utils/achievements.js';

// Password validation rules
function validatePassword(password) {
  const errors = [];
  if (!password || password.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter (A-Z)');
  if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter (a-z)');
  if (!/[0-9]/.test(password)) errors.push('At least one number (0-9)');
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push('At least one special character (!@#$%^&*...)');
  return errors;
}

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // Validate password strength
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ message: 'Password is too weak', passwordErrors });
    }

    // Validate username length
    if (!username || username.trim().length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters' });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      const field = existing.email === email ? 'email' : 'username';
      return res.status(400).json({ message: `An account with this ${field} already exists` });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username: username.trim(), email, password: hash });
    return res.status(201).json({ user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (e) {
    return res.status(500).json({ message: 'Registration failed' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = signToken({ id: user._id, role: user.role, username: user.username });
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: isProd ? 'none' : 'lax',
      secure: isProd,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    // VIDEO: Talk: token is set as an httpOnly cookie to protect from XSS
    user.lastLogin = new Date();
    await user.save();
    return res.json({ user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (e) {
    return res.status(500).json({ message: 'Login failed' });
  }
}

export async function logout(req, res) {
  res.clearCookie('token');
  return res.json({ message: 'Logged out' });
}

export async function me(req, res) {
  const user = await User.findById(req.user.id).select('username email role avatar bio preferredCharacter totalGames totalScore highScore createdAt');
  if (!user) return res.status(404).json({ message: 'Not found' });

  // Aggregate recent scores and totals for achievements
  const recentScores = await Score.find({ userId: req.user.id }).sort({ timestamp: -1 }).limit(5).select('score bananasCollected duration timestamp');
  const totalsAgg = await Score.aggregate([
    { $match: { userId: user._id } },
    {
      $group: {
        _id: '$userId',
        totalBananas: { $sum: '$bananasCollected' },
        totalGames: { $sum: 1 },
        fastestDuration: { $min: { $cond: [{ $gt: ['$duration', 0] }, '$duration', null] } },
        highScore: { $max: '$bananasCollected' },
      },
    },
  ]);

  const totals = totalsAgg[0] || { totalBananas: 0, totalGames: user.totalGames || 0, fastestDuration: null, highScore: user.highScore || 0 };
  const achievements = computeAchievements({
    totalGames: totals.totalGames || user.totalGames || 0,
    totalScore: user.totalScore || 0,
    highScore: totals.highScore || user.highScore || 0,
    totalBananas: totals.totalBananas || 0,
    fastestDuration: totals.fastestDuration ?? null,
  });

  return res.json({
    user: {
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar || '🐒',
      bio: user.bio || '',
      preferredCharacter: user.preferredCharacter || 'monkey',
      createdAt: user.createdAt,
      totalGames: totals.totalGames || user.totalGames,
      totalScore: user.totalScore,
      highScore: totals.highScore || user.highScore,
      totals: { totalBananas: totals.totalBananas || 0, fastestDuration: totals.fastestDuration ?? null },
      achievements,
      recentScores,
    },
  });
}

// Update profile (avatar, bio, username, preferredCharacter)
export async function updateProfile(req, res) {
  try {
    const { username, avatar, bio, preferredCharacter } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Username change
    if (username !== undefined) {
      const trimmed = username.trim();
      if (trimmed.length < 3) return res.status(400).json({ message: 'Username must be at least 3 characters' });
      if (trimmed !== user.username) {
        const taken = await User.findOne({ username: trimmed, _id: { $ne: user._id } });
        if (taken) return res.status(400).json({ message: 'Username is already taken' });
        user.username = trimmed;
      }
    }

    // Avatar change
    if (avatar !== undefined) {
      if (!AVATAR_OPTIONS.includes(avatar)) return res.status(400).json({ message: 'Invalid avatar choice' });
      user.avatar = avatar;
    }

    // Bio change
    if (bio !== undefined) {
      if (bio.length > 120) return res.status(400).json({ message: 'Bio must be 120 characters or fewer' });
      user.bio = bio;
    }

    // Preferred character
    if (preferredCharacter !== undefined) {
      if (!['monkey', 'robot'].includes(preferredCharacter)) return res.status(400).json({ message: 'Invalid character choice' });
      user.preferredCharacter = preferredCharacter;
    }

    await user.save();
    return res.json({
      user: {
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        preferredCharacter: user.preferredCharacter,
      },
    });
  } catch (e) {
    return res.status(500).json({ message: 'Profile update failed' });
  }
}

// Change password (requires current password)
export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Both current and new password are required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(400).json({ message: 'Current password is incorrect' });

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) return res.status(400).json({ message: 'New password is too weak', passwordErrors });

    if (currentPassword === newPassword) return res.status(400).json({ message: 'New password must be different from current password' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.json({ message: 'Password changed successfully' });
  } catch (e) {
    return res.status(500).json({ message: 'Password change failed' });
  }
}

// Get available avatar options
export async function getAvatarOptions(req, res) {
  return res.json({ avatars: AVATAR_OPTIONS });
}
