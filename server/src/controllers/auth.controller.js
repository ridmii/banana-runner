import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { Score } from '../models/Score.js';
import { computeAchievements } from '../utils/achievements.js';

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ message: 'User exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash });
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
  const user = await User.findById(req.user.id).select('username email role totalGames totalScore highScore');
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
      totalGames: totals.totalGames || user.totalGames,
      totalScore: user.totalScore,
      highScore: totals.highScore || user.highScore,
      totals: { totalBananas: totals.totalBananas || 0, fastestDuration: totals.fastestDuration ?? null },
      achievements,
      recentScores,
    },
  });
}
