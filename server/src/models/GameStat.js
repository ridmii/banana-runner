import mongoose from 'mongoose';

const GameStatSchema = new mongoose.Schema({
  totalGamesPlayed: { type: Number, default: 0 },
  totalBananasCollected: { type: Number, default: 0 },
  totalObstaclesDodged: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

export const GameStat = mongoose.model('GameStat', GameStatSchema);
