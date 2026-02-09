import { User } from '../models/User.js';
import { Score } from '../models/Score.js';

export async function listUsers(req, res) {
  const users = await User.find().select('username email role');
  return res.json({ users });
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  await Score.deleteMany({ userId: id });
  return res.json({ message: 'User deleted' });
}

export async function adminStats(req, res) {
  const totalUsers = await User.countDocuments();
  const totalScores = await Score.countDocuments();
  return res.json({ totalUsers, totalScores });
}
