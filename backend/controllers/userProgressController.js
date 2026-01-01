import UserProgress from '../models/UserProgress.js';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import { ErrorResponse } from '../utils/ErrorResponse.js';

// 📊 GET /api/progress - Get user progress
export const getUserProgress = async (req, res, next) => {
  try {
    let progress = await UserProgress.findOne({ userId: req.user._id });

    if (!progress) {
      progress = await UserProgress.create({
        userId: req.user._id,
        xp: 0,
        level: 1,
        healCoins: 0,
        streak: 0
      });
    }

    res.status(200).json(progress);
  } catch (err) {
    next(err);
  }
};

// ⬆️ Function to add XP programmatically (used by other controllers)
export const addXP = async (userId, amount, source = 'System') => {
  try {
    let progress = await UserProgress.findOne({ userId });

    if (!progress) {
      progress = await UserProgress.create({
        userId,
        xp: amount,
        level: calculateLevel(amount),
        healCoins: 0,
        streak: 0
      });
    } else {
      const oldLevel = progress.level;
      progress.xp += amount;
      progress.level = calculateLevel(progress.xp);
      
      // Check if user leveled up
      if (progress.level > oldLevel) {
        // Award coins for leveling up
        const levelUpCoins = (progress.level - oldLevel) * 50; // 50 coins per level
        
        // Update wallet
        let wallet = await Wallet.findOne({ userId });
        
        if (!wallet) {
          wallet = await Wallet.create({
            userId,
            balance: levelUpCoins
          });
        } else {
          wallet.balance += levelUpCoins;
          wallet.lastUpdated = Date.now();
          await wallet.save();
        }
        
        // Create transaction record
        await Transaction.create({
          userId,
          type: 'credit',
          amount: levelUpCoins,
          description: `Level up reward (Level ${progress.level})`
        });
        
        // Emit real-time level up event
        const io = global.io || require('../server.js').io;
        if (io) {
          io.to(userId.toString()).emit('level-up', {
            userId: userId.toString(),
            oldLevel,
            newLevel: progress.level,
            coinsEarned: levelUpCoins,
            totalXP: progress.xp,
            weeklyXP: progress.weeklyXP || 0,
            rank: progress.rank || 0
          });

          // Broadcast leaderboard update for all periods
          const { broadcastLeaderboardUpdate } = await import('../utils/leaderboardBroadcast.js');
          broadcastLeaderboardUpdate(io).catch(err => {
            console.error('Error broadcasting leaderboard update:', err);
          });
        }
      }
      
      await progress.save();
    }

    return {
      progress,
      levelUp: progress.level > calculateLevel(progress.xp - amount)
    };
  } catch (err) {
    console.error('Error adding XP:', err);
    throw err;
  }
};

// 📅 POST /api/progress/update-streak - Update user streak
export const updateStreak = async (req, res, next) => {
  try {
    let progress = await UserProgress.findOne({ userId: req.user._id });

    if (!progress) {
      progress = await UserProgress.create({
        userId: req.user._id,
        xp: 0,
        level: 1,
        healCoins: 0,
        streak: 1,
        lastCheckIn: new Date()
      });
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastCheckIn = progress.lastCheckIn ? new Date(progress.lastCheckIn) : null;
      let lastCheckInDay = null;
      
      if (lastCheckIn) {
        lastCheckInDay = new Date(lastCheckIn);
        lastCheckInDay.setHours(0, 0, 0, 0);
      }
      
      // Check if this is a new day check-in
      if (!lastCheckInDay || today.getTime() > lastCheckInDay.getTime()) {
        // Check if this is consecutive day
        if (lastCheckInDay) {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastCheckInDay.getTime() === yesterday.getTime()) {
            // Consecutive day, increase streak
            progress.streak += 1;
          } else {
            // Not consecutive, reset streak
            progress.streak = 1;
          }
        } else {
          // First check-in
          progress.streak = 1;
        }
        
        progress.lastCheckIn = today;
        await progress.save();
      }
    }

    res.status(200).json({
      message: 'Streak updated successfully',
      streak: progress.streak
    });
  } catch (err) {
    next(err);
  }
};

// Helper function to calculate level based on XP
const calculateLevel = (xp) => {
  // Simple level calculation: level = 1 + floor(xp / 100)
  // This means 100 XP per level
  return Math.floor(xp / 100) + 1;
};

// ⬆️ POST /api/progress/add-xp - Add XP to user (HTTP endpoint)
export const addXPEndpoint = async (req, res, next) => {
  const { amount, source } = req.body;

  if (!amount || amount <= 0) {
    return next(new ErrorResponse('Invalid XP amount', 400));
  }

  try {
    const result = await addXP(req.user._id, amount, source);
    
    res.status(200).json({
      message: 'XP added successfully',
      progress: result.progress,
      levelUp: result.levelUp
    });
  } catch (err) {
    next(err);
  }
};