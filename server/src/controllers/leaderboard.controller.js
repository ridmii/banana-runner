import { Score } from '../models/Score.js';
import { User } from '../models/User.js';
import { computeAchievements } from '../utils/achievements.js';

export async function topLeaderboard(req, res) {
  try {
    const scores = await Score.find().sort({ score: -1 }).limit(50).populate('userId', 'username');
    const formatted = scores.map((s) => ({
      _id: s._id,
      score: s.bananasCollected ?? s.score,
      bananas: s.bananasCollected ?? s.score,
      user: { username: s.userId?.username || 'anon' },
    }));
    return res.json({ scores: formatted });
  } catch (e) {
    return res.status(503).json({ scores: [], message: 'Leaderboard unavailable' });
  }
}

export async function userRank(req, res) {
  try {
    const scores = await Score.find().sort({ score: -1 });
    const idx = scores.findIndex((s) => String(s.userId) === String(req.user.id));
    return res.json({ rank: idx >= 0 ? idx + 1 : null });
  } catch (e) {
    return res.status(503).json({ rank: null, message: 'Rank unavailable' });
  }
}

// Rich leaderboard: per-user aggregates with achievements
export async function richLeaderboard(req, res) {
  try {
    const agg = await Score.aggregate([
      {
        $group: {
          _id: '$userId',
          highScore: { $max: '$score' },
          totalBananas: { $sum: '$bananasCollected' },
          totalGames: { $sum: 1 },
          fastestDuration: { $min: { $cond: [{ $gt: ['$duration', 0] }, '$duration', null] } },
        },
      },
      { $sort: { totalBananas: -1, highScore: -1 } },
      { $limit: 50 },
    ]);

    const userIds = agg.map((a) => a._id).filter(Boolean);
    const users = await User.find({ _id: { $in: userIds } }).select('username totalScore');
    const userMap = new Map(users.map((u) => [String(u._id), u]));

    const enriched = agg.map((a) => {
      const u = userMap.get(String(a._id));
      const totalScore = u?.totalScore || 0;
      const achievements = computeAchievements({
        totalGames: a.totalGames || 0,
        totalScore,
        highScore: a.highScore || 0,
        totalBananas: a.totalBananas || 0,
        fastestDuration: a.fastestDuration ?? null,
      });
      return {
        user: { id: String(a._id), username: u?.username || 'anon' },
        score: a.totalBananas || 0,
        totals: {
          totalBananas: a.totalBananas || 0,
          totalGames: a.totalGames || 0,
          fastestDuration: a.fastestDuration ?? null,
          totalScore,
        },
        highScore: a.highScore || 0,
        achievements,
      };
    });

    return res.json({ scores: enriched });
  } catch (e) {
    return res.status(503).json({ scores: [], message: 'Leaderboard unavailable' });
  }
}
