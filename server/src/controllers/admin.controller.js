import { User } from '../models/User.js';
import { Score } from '../models/Score.js';

export async function listUsers(req, res) {
  const users = await User.find().select('-password');
  return res.json({ users });
}

export async function setUserRole(req, res) {
  try {
    const { userId, role } = req.body;
    if (!['player', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ message: 'Role updated', user: { id: user._id, username: user.username, role: user.role } });
  } catch (e) {
    return res.status(500).json({ message: 'Role update failed' });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  await Score.deleteMany({ userId: id });
  return res.json({ message: 'User deleted' });
}

export async function deleteScore(req, res) {
  try {
    const { scoreId } = req.params;
    const score = await Score.findByIdAndDelete(scoreId);
    if (!score) return res.status(404).json({ message: 'Score not found' });
    return res.json({ message: 'Score deleted' });
  } catch (e) {
    return res.status(500).json({ message: 'Score deletion failed' });
  }
}

export async function adminStats(req, res) {
  try {
    const totalUsers = await User.countDocuments();
    const totalScores = await Score.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const playerCount = await User.countDocuments({ role: 'player' });
    const topScores = await Score.find().sort({ bananasCollected: -1 }).limit(10).populate('userId', 'username');
    
    return res.json({ message: 'User deleted',
      stats: {
        totalUsers,
        totalScores,
        adminCount,
        playerCount,
        topScores
      }
    });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to fetch stats' });
  }
}
