import { Score } from '../models/Score.js';
import { User } from '../models/User.js';

export async function saveScore(req, res) {
  try {
    const { score, gameMode = 'solo', duration = 0, bananasCollected = 0 } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const record = await Score.create({ userId, score, gameMode, duration, bananasCollected });
    const user = await User.findById(req.user.id);
    user.totalGames += 1;
    user.totalScore += score;
    // Persist bananas-specific stats
    user.totalBananas = (user.totalBananas || 0) + bananasCollected;
    user.highScore = Math.max(user.highScore || 0, bananasCollected);
    await user.save();
    return res.status(201).json({ score: record });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to save score' });
  }
}

export async function stats(req, res) {
  const total = await Score.countDocuments();
  const top = await Score.find().sort({ score: -1 }).limit(1);
  return res.json({ totalGames: total, highScore: top[0]?.score || 0 });
}
