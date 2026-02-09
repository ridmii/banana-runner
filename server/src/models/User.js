import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    totalGames: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    highScore: { type: Number, default: 0 },
    totalBananas: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Ensure unique indexes for reliability
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });

export const User = mongoose.model('User', UserSchema);
