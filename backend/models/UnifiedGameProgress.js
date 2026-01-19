import mongoose from 'mongoose';

const unifiedGameProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    gameId: {
      type: String, // Game identifier (e.g., 'spot-the-pattern', 'cat-or-dog')
      required: true
    },
    gameType: {
      type: String,
      enum: ['ai', 'brain', 'finance', 'mental', 'financial', 'educational', 'uvls', 'dcos', 'moral', 'ehe', 'crgc', 'civic-responsibility', 'health-male', 'health-female', 'sustainability', 'parent-education', 'teacher-education'],
      required: true
    },
    userRole: {
      type: String,
      enum: ['student', 'parent', 'school_teacher'],
      default: 'student' // Default to student for backward compatibility
    },
    // Progress tracking
    levelsCompleted: {
      type: Number,
      default: 0
    },
    totalLevels: {
      type: Number,
      default: 1
    },
    highestScore: {
      type: Number,
      default: 0
    },
    maxScore: {
      type: Number,
      default: 100
    },
    // Completion status
    fullyCompleted: {
      type: Boolean,
      default: false
    },
    firstCompletedAt: {
      type: Date,
      default: null
    },
    // Replay tracking
    replayUnlocked: {
      type: Boolean,
      default: false
    },
    replayUnlockedAt: {
      type: Date,
      default: null
    },
    lastPlayedAt: {
      type: Date,
      default: Date.now
    },
    // Coins tracking
    totalCoinsEarned: {
      type: Number,
      default: 0
    },
    coinsEarnedHistory: [{
      amount: Number,
      reason: String, // 'level-completion', 'full-completion', 'achievement'
      earnedAt: {
        type: Date,
        default: Date.now
      }
    }],
    // Time tracking
    totalTimePlayed: {
      type: Number,
      default: 0 // in seconds
    },
    // Achievements
    achievements: [{
      name: String,
      description: String,
      earnedAt: {
        type: Date,
        default: Date.now
      },
      badge: String
    }],
    // Badge rewards (for badge games)
    badgeAwarded: {
      type: Boolean,
      default: false
    },
    badgeName: {
      type: String,
      default: null
    },
    badgeImage: {
      type: String,
      default: null
    },
    // Streak tracking
    currentStreak: {
      type: Number,
      default: 1
    },
    lastStreakDate: {
      type: Date,
      default: Date.now
    },
    // Level-by-level completion tracking
    levelProgress: [{
      levelNumber: Number,
      completed: Boolean,
      score: Number,
      coinsEarned: Number,
      completedAt: Date
    }]
  },
  { 
    timestamps: true,
    // Ensure one progress record per user per game
    indexes: [
      { userId: 1, gameId: 1 }, // Compound index for fast lookups
      { userId: 1, gameType: 1 }
    ]
  }
);

// Compound index to prevent duplicate progress records
unifiedGameProgressSchema.index({ userId: 1, gameId: 1 }, { unique: true });

const UnifiedGameProgress = mongoose.model('UnifiedGameProgress', unifiedGameProgressSchema);
export default UnifiedGameProgress;
