import mongoose from 'mongoose';

const ScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: { type: Number, required: true },
  gameMode: { type: String, enum: ['solo', 'multiplayer'], default: 'solo' },
  duration: { type: Number, default: 0 },
  bananasCollected: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});

// Helpful indexes for queries and aggregates
ScoreSchema.index({ userId: 1, timestamp: -1 });
ScoreSchema.index({ bananasCollected: -1 });

export const Score = mongoose.model('Score', ScoreSchema);
