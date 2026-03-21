import mongoose from 'mongoose';

const AVATAR_OPTIONS = ['🐒', '🤖', '🦊', '🐼', '🦁', '🐸', '🐵', '🐻', '🐯', '🐨', '🐲', '🦄', '👾', '🎃', '🥷'];

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, default: null }, // null for OAuth-only users
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    // OAuth fields
    googleId: { type: String, unique: true, sparse: true },
    githubId: { type: String, unique: true, sparse: true },
    oauthProvider: { type: String, enum: ['local', 'google', 'github'], default: 'local' },
    // Virtual Identity fields
    avatar: { type: String, default: '🐒', enum: AVATAR_OPTIONS },
    bio: { type: String, default: '', maxlength: 120 },
    preferredCharacter: { type: String, enum: ['monkey', 'robot'], default: 'monkey' },
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
export { AVATAR_OPTIONS };
