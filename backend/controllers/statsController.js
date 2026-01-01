import MoodLog from "../models/MoodLog.js";
import XPLog from "../models/XPLog.js";
import UserProgress from "../models/UserProgress.js";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import UnifiedGameProgress from "../models/UnifiedGameProgress.js";
import ActivityLog from "../models/ActivityLog.js";
import Transaction from "../models/Transaction.js";
import RecommendationInteraction from "../models/RecommendationInteraction.js";
import { getPillarGameCount } from "../utils/gameCountUtils.js";


// Student Stats Overview

export const getStudentStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user progress (primary source of XP and level)
    let userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
      userProgress = await UserProgress.create({
        userId,
        xp: 0,
        level: 1,
        healCoins: 0,
        streak: 0
      });
    }

    // Get wallet information
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({
        userId,
        balance: 0,
        totalEarned: 0
      });
    }

    // Calculate next level XP (100 XP per level)
    const nextLevelXp = userProgress.level * 100;

    // Mood logs for check-ins and today's mood
    const moodLogs = await MoodLog.find({ userId }).sort({ date: -1 });
    const moodCheckins = moodLogs.length;

    const today = new Date().toISOString().split("T")[0];
    const todayMood =
      moodLogs.find(
        (log) => new Date(log.date).toISOString().split("T")[0] === today
      )?.emoji || "🙂";

    // Calculate weekly XP from recent XP logs (if available)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyXpLogs = await XPLog.find({
      userId,
      date: { $gte: oneWeekAgo }
    });
    const weeklyXP = weeklyXpLogs.reduce((sum, log) => sum + log.amount, 0);

    res.status(200).json({
      xp: userProgress.xp,
      level: userProgress.level,
      nextLevelXp,
      moodCheckins,
      todayMood,
      streak: userProgress.streak,
      weeklyXP,
      healCoins: wallet.balance,
      totalEarned: wallet.totalEarned || 0
    });
  } catch (err) {
    console.error("❌ Failed to get student stats:", err);
    res.status(500).json({ error: "Failed to fetch student stats" });
  }
};


// XP Log Data for XP Graph

export const getXPLogs = async (req, res) => {
  try {
    const userId = req.user._id;

    const logs = await XPLog.find({ userId }).sort({ date: 1 });

    const formatted = logs.map((log) => ({
      date: log.date.toISOString().split("T")[0],
      amount: log.amount,
      source: log.source,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Failed to fetch XP logs:", err);
    res.status(500).json({ error: "Failed to fetch XP logs" });
  }
};

// Pillar Mastery - Overall and Weak Pillars with Week-on-Week Delta
export const getPillarMastery = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user to check gender
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(userId).select('gender');
    const userGender = user?.gender?.toLowerCase();
    
    // Debug logging
    console.log(`🔍 Pillar filtering - User ID: ${userId}, Gender: ${userGender || 'not set'}`);

    // Get user subscription to determine access level
    const { getUserSubscription } = await import('../utils/subscriptionUtils.js');
    const subscription = await getUserSubscription(userId);
    const features = subscription.features || {};
    const hasFullAccess = features.fullAccess === true;
    const gamesPerPillar = features.gamesPerPillar || 5;

    // Define all pillars - total game counts will be fetched dynamically
    // First 5 pillars are accessible to freemium users
    const pillarDefinitions = [
      { key: 'finance', name: 'Financial Literacy', icon: '💰', order: 1 },
      { key: 'brain', name: 'Brain Health', icon: '🎯', order: 2 },
      { key: 'uvls', name: 'UVLS (Life Skills & Values)', icon: '🌟', order: 3 },
      { key: 'dcos', name: 'Digital Citizenship & Online Safety', icon: '🔒', order: 4 },
      { key: 'moral', name: 'Moral Values', icon: '💫', order: 5 },
      { key: 'ai', name: 'AI for All', icon: '🤖', order: 6 },
      { key: 'health-male', name: 'Health - Male', icon: '🛡️', order: 7 },
      { key: 'health-female', name: 'Health - Female', icon: '🌸', order: 8 },
      { key: 'ehe', name: 'Entrepreneurship & Higher Education', icon: '🚀', order: 9 },
      { key: 'crgc', name: 'Civic Responsibility & Global Citizenship', icon: '🌍', order: 10 },
      { key: 'sustainability', name: 'Sustainability', icon: '🌱', order: 11 }
    ];

    // Filter pillars based on user gender
    // If user is male, hide health-female; if female, hide health-male
    // If gender is not set, hide both health pillars (for existing users without gender)
    let filteredPillarDefinitions = pillarDefinitions;
    if (userGender === 'male') {
      filteredPillarDefinitions = pillarDefinitions.filter(p => p.key !== 'health-female');
    } else if (userGender === 'female') {
      filteredPillarDefinitions = pillarDefinitions.filter(p => p.key !== 'health-male');
    } else {
      // If gender is not set, hide both health pillars for existing users
      filteredPillarDefinitions = pillarDefinitions.filter(p => p.key !== 'health-male' && p.key !== 'health-female');
    }

    // Fetch total game counts dynamically for each pillar (using filtered definitions)
    const allPillars = await Promise.all(
      filteredPillarDefinitions.map(async (pillar) => {
        const totalGames = await getPillarGameCount(pillar.key, UnifiedGameProgress);
        return {
          ...pillar,
          totalGames: totalGames || 0 // Default to 0 if no games found
        };
      })
    );

    // Freemium users can see all pillars, but only first 5 games per pillar are playable
    const pillars = allPillars;

    // Get all game progress for user
    const gameProgress = await UnifiedGameProgress.find({ userId });

    // Map pillar keys to possible gameType values (for backward compatibility)
    const pillarToGameTypeMap = {
      'crgc': ['crgc', 'civic-responsibility'],
      'moral': ['moral', 'moral-values'],
      'ai': ['ai', 'ai-for-all'],
      'finance': ['finance', 'financial']
    };

    // Calculate mastery for each pillar
    const pillarMastery = pillars.map(pillar => {
      // Get possible gameType values for this pillar
      const gameTypeValues = pillarToGameTypeMap[pillar.key] || [pillar.key];
      const pillarGames = gameProgress.filter(game => gameTypeValues.includes(game.gameType));

      // Calculate mastery based on games completed vs total games
      // Mastery should always be calculated based on actual total games (e.g., 200)
      // This represents real progress towards completing all available games
      const gamesCompleted = pillarGames.filter(g => g.fullyCompleted).length;
      
      // Always calculate mastery based on actual total games, not allowed games
      // This ensures mastery stays between 0-100% and shows real progress
      const mastery = Math.min(100, Math.round((gamesCompleted / pillar.totalGames) * 100));

      if (pillarGames.length === 0) {
        return {
          pillar: pillar.name,
          icon: pillar.icon,
          pillarKey: pillar.key,
          mastery: 0,
          gamesCompleted: 0,
          totalGames: pillar.totalGames, // Always show actual total games
          accessMode: hasFullAccess ? 'full' : 'preview',
          gamesAllowed: hasFullAccess ? -1 : gamesPerPillar, // -1 means unlimited
          locked: false // Pillars shown are accessible
        };
      }

      return {
        pillar: pillar.name,
        icon: pillar.icon,
        pillarKey: pillar.key,
        mastery: mastery,
        gamesCompleted, // Actual completed games count
        totalGames: pillar.totalGames, // Always show actual total games (e.g., 200)
        accessMode: hasFullAccess ? 'full' : (gamesCompleted >= gamesPerPillar ? 'locked' : 'preview'),
        gamesAllowed: hasFullAccess ? -1 : gamesPerPillar, // -1 means unlimited
        locked: !hasFullAccess && gamesCompleted >= gamesPerPillar
      };
    }).filter(p => p.totalGames > 0); // Only include pillars with games

    // Note: All pillars are now accessible to freemium users
    // Games are limited to first 5 per pillar for freemium users

    // Calculate overall mastery - use ALL pillars with games, not just accessible ones
    // This gives a true representation of overall progress across all pillars
    const pillarsWithGames = pillarMastery.filter(p => p.totalGames > 0);
    const overallMastery = pillarsWithGames.length > 0
      ? Math.round(pillarsWithGames.reduce((sum, p) => sum + p.mastery, 0) / pillarsWithGames.length)
      : 0;

    // Get week-on-week delta
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Calculate previous week mastery
    const lastWeekProgress = await UnifiedGameProgress.find({
      userId,
      lastPlayedAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo }
    });

    const lastWeekPillarMastery = pillars.map(pillar => {
      // Get possible gameType values for this pillar
      const gameTypeValues = pillarToGameTypeMap[pillar.key] || [pillar.key];
      const pillarGames = lastWeekProgress.filter(game => gameTypeValues.includes(game.gameType));
      const gamesCompleted = pillarGames.filter(g => g.fullyCompleted).length;
      // Always calculate mastery based on actual total games, capped at 100%
      const mastery = Math.min(100, Math.round((gamesCompleted / pillar.totalGames) * 100));

      return {
        pillar: pillar.name,
        mastery: mastery
      };
    });

    // Add week-on-week delta
    const pillarMasteryWithDelta = pillarMastery.map(current => {
      const previous = lastWeekPillarMastery.find(p => p.pillar === current.pillar);
      const delta = previous ? current.mastery - previous.mastery : 0;

      return {
        ...current,
        deltaWoW: delta
      };
    });

    // Filter pillars based on gender before selecting weak pillars
    let filteredPillarMastery = pillarMasteryWithDelta;
    if (userGender === 'male') {
      filteredPillarMastery = pillarMasteryWithDelta.filter(p => p.pillarKey !== 'health-female');
    } else if (userGender === 'female') {
      filteredPillarMastery = pillarMasteryWithDelta.filter(p => p.pillarKey !== 'health-male');
    } else {
      // If gender is not set, hide both health pillars for existing users
      filteredPillarMastery = pillarMasteryWithDelta.filter(p => p.pillarKey !== 'health-male' && p.pillarKey !== 'health-female');
    }

    // Get top 3 weak pillars (lowest mastery) - show all pillars regardless of locked status
    // This helps users see which areas need the most improvement
    const weakPillars = [...filteredPillarMastery]
      .filter(p => p.totalGames > 0) // Only include pillars with games
      .sort((a, b) => a.mastery - b.mastery) // Sort by mastery (lowest first)
      .slice(0, 3); // Get top 3 weakest

    // Count accessible pillars for subscription info (use filtered pillars)
    const accessiblePillars = filteredPillarMastery.filter(p => !p.locked && !p.upgradeRequired && p.totalGames > 0);
    
    // Calculate overall mastery using filtered pillars
    const filteredPillarsWithGames = filteredPillarMastery.filter(p => p.totalGames > 0);
    const filteredOverallMastery = filteredPillarsWithGames.length > 0
      ? Math.round(filteredPillarsWithGames.reduce((sum, p) => sum + p.mastery, 0) / filteredPillarsWithGames.length)
      : 0;

    res.status(200).json({
      overallMastery: filteredOverallMastery,
      totalPillars: filteredPillarsWithGames.length, // Total pillars with games (filtered by gender)
      totalPillarsAvailable: allPillars.length, // Total pillars in system (11)
      pillars: filteredPillarMastery, // Return filtered pillars
      weakPillars: weakPillars, // Show actual weakest pillars (filtered by gender)
      subscription: {
        planType: subscription.planType,
        hasFullAccess: hasFullAccess,
        gamesPerPillar: gamesPerPillar,
        accessMode: hasFullAccess ? 'full' : 'preview',
        accessiblePillarsCount: accessiblePillars.length,
        lockedPillarsCount: pillarMastery.filter(p => p.locked || p.upgradeRequired).length
      }
    });
  } catch (err) {
    console.error("❌ Failed to get pillar mastery:", err);
    res.status(500).json({ error: "Failed to fetch pillar mastery" });
  }
};

// Get missing/incomplete games for a specific pillar
export const getMissingGames = async (req, res) => {
  try {
    const userId = req.user._id;
    const { pillarKey } = req.params; // e.g., 'dcos', 'brain'

    if (!pillarKey) {
      return res.status(400).json({ error: "Pillar key is required" });
    }

    // Generate expected game IDs for this pillar
    // Note: Brain Health uses "teens" (plural) instead of "teen" (singular)
    const generateExpectedGameIds = (key) => {
      const allGames = [];
      for (let i = 1; i <= 100; i++) {
        allGames.push(`${key}-kids-${i}`);
        // Brain Health uses "teens" (plural), others use "teen" (singular)
        if (key === 'brain') {
          allGames.push(`${key}-teens-${i}`);
        } else {
          allGames.push(`${key}-teen-${i}`);
        }
      }
      return allGames;
    };

    const expectedGames = generateExpectedGameIds(pillarKey);

    // Get all games from database for this user and pillar
    const dbGames = await UnifiedGameProgress.find({
      userId,
      gameType: pillarKey
    }).select('gameId fullyCompleted lastPlayedAt levelsCompleted totalLevels');

    const completedGames = dbGames.filter(g => g.fullyCompleted).map(g => g.gameId);
    const allDbGameIds = dbGames.map(g => g.gameId);

    // Find missing games (expected but not in database)
    const missingGames = expectedGames.filter(id => !allDbGameIds.includes(id));

    // Find incomplete games (in database but not fully completed)
    const incompleteGames = expectedGames.filter(id => 
      allDbGameIds.includes(id) && !completedGames.includes(id)
    ).map(id => {
      const gameData = dbGames.find(g => g.gameId === id);
      return {
        gameId: id,
        lastPlayedAt: gameData?.lastPlayedAt || null,
        levelsCompleted: gameData?.levelsCompleted || 0,
        totalLevels: gameData?.totalLevels || 1
      };
    });

    res.status(200).json({
      pillarKey,
      expected: expectedGames.length,
      completed: completedGames.length,
      missing: missingGames,
      incomplete: incompleteGames,
      totalMissingOrIncomplete: missingGames.length + incompleteGames.length,
      summary: {
        completed: completedGames.length,
        missing: missingGames.length,
        incomplete: incompleteGames.length,
        total: expectedGames.length
      }
    });
  } catch (error) {
    console.error("❌ Failed to get missing games:", error);
    res.status(500).json({ error: "Failed to fetch missing games" });
  }
};

// Get pillar mastery for a specific student (for chat sidebar)
export const getStudentPillarMastery = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    if (!studentId) {
      return res.status(400).json({ error: "Student ID is required" });
    }

    // Define all pillars with their total game counts
    const pillars = [
      { key: 'finance', name: 'Financial Literacy', icon: '💰', totalGames: 42 },
      { key: 'mental', name: 'Mental Health', icon: '🧠', totalGames: 42 },
      { key: 'ai', name: 'AI for All', icon: '🤖', totalGames: 42 },
      { key: 'brain', name: 'Brain Health', icon: '🎯', totalGames: 42 },
      { key: 'uvls', name: 'Life Skills & Values', icon: '🌟', totalGames: 42 },
      { key: 'dcos', name: 'Digital Citizenship', icon: '🔒', totalGames: 42 },
      { key: 'moral', name: 'Moral Values', icon: '💫', totalGames: 42 },
      { key: 'ehe', name: 'Entrepreneurship', icon: '🚀', totalGames: 42 },
      { key: 'crgc', name: 'Global Citizenship', icon: '🌍', totalGames: 42 },
      { key: 'educational', name: 'Education', icon: '📚', totalGames: 42 }
    ];

    // Get all game progress for the student
    const gameProgress = await UnifiedGameProgress.find({ userId: studentId });

    // Calculate mastery for each pillar
    const pillarMastery = pillars.map(pillar => {
      const pillarGames = gameProgress.filter(game => game.gameType === pillar.key);

      if (pillarGames.length === 0) {
        return {
          pillar: pillar.name,
          icon: pillar.icon,
          mastery: 0,
          gamesCompleted: 0,
          totalGames: pillar.totalGames
        };
      }

      // Calculate mastery based on games completed vs total games
      const gamesCompleted = pillarGames.filter(g => g.fullyCompleted).length;
      const mastery = Math.round((gamesCompleted / pillar.totalGames) * 100);

      return {
        pillar: pillar.name,
        icon: pillar.icon,
        mastery: mastery,
        gamesCompleted,
        totalGames: pillar.totalGames
      };
    }).filter(p => p.totalGames > 0); // Only include pillars with games

    // Calculate overall mastery
    const overallMastery = pillarMastery.length > 0
      ? Math.round(pillarMastery.reduce((sum, p) => sum + p.mastery, 0) / pillarMastery.length)
      : 0;

    res.status(200).json({
      overallMastery,
      totalPillars: pillarMastery.length,
      pillars: pillarMastery
    });
  } catch (err) {
    console.error("❌ Failed to get student pillar mastery:", err);
    res.status(500).json({ error: "Failed to fetch student pillar mastery" });
  }
};

// Emotional Score - 7 Day Trend
export const getEmotionalScore = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get mood logs for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const moodLogs = await MoodLog.find({
      userId,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    // Map emojis to scores (1-5 scale)
    const emojiToScore = {
      '😢': 1, '😔': 1, '😞': 1, '😰': 1, '😨': 1,
      '😕': 2, '😟': 2, '🙁': 2,
      '😐': 3, '😑': 3, '🙂': 3,
      '😊': 4, '😌': 4, '🙃': 4,
      '😄': 5, '😁': 5, '😃': 5, '😍': 5, '🤩': 5, '🥳': 5, '😎': 5
    };

    // Create 7-day trend data
    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayMoods = moodLogs.filter(log => {
        const logDate = new Date(log.date).toISOString().split('T')[0];
        return logDate === dateStr;
      });

      if (dayMoods.length > 0) {
        const avgScore = dayMoods.reduce((sum, log) => {
          return sum + (emojiToScore[log.emoji] || 3);
        }, 0) / dayMoods.length;

        trendData.push({
          date: dateStr,
          score: Math.round(avgScore * 10) / 10, // Round to 1 decimal
          emoji: dayMoods[dayMoods.length - 1].emoji,
          entries: dayMoods.length
        });
      } else {
        trendData.push({
          date: dateStr,
          score: null,
          emoji: null,
          entries: 0
        });
      }
    }

    // Calculate average emotional score
    const validScores = trendData.filter(d => d.score !== null);
    const avgScore = validScores.length > 0
      ? validScores.reduce((sum, d) => sum + d.score, 0) / validScores.length
      : 3;

    // Calculate trend direction
    const recentScores = validScores.slice(-3).map(d => d.score);
    const olderScores = validScores.slice(0, -3).map(d => d.score);
    const recentAvg = recentScores.length > 0
      ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length
      : avgScore;
    const olderAvg = olderScores.length > 0
      ? olderScores.reduce((a, b) => a + b, 0) / olderScores.length
      : avgScore;

    const trend = recentAvg > olderAvg ? 'up' : recentAvg < olderAvg ? 'down' : 'stable';

    res.status(200).json({
      averageScore: Math.round(avgScore * 10) / 10,
      trend,
      trendData,
      totalEntries: moodLogs.length,
      entriesThisWeek: validScores.length
    });
  } catch (err) {
    console.error("❌ Failed to get emotional score:", err);
    res.status(500).json({ error: "Failed to fetch emotional score" });
  }
};

// Engagement Minutes - Last 7 Days
export const getEngagementMinutes = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get activity logs for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activityLogs = await ActivityLog.find({
      userId,
      timestamp: { $gte: sevenDaysAgo }
    }).sort({ timestamp: 1 });

    // Get game time from UnifiedGameProgress
    const gameProgress = await UnifiedGameProgress.find({ userId });
    const recentGameTime = gameProgress.reduce((sum, game) => {
      if (game.lastPlayedAt >= sevenDaysAgo) {
        return sum + (game.totalTimePlayed || 0);
      }
      return sum;
    }, 0);

    // Calculate engagement by day
    const dailyEngagement = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayActivities = activityLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= date && logDate < nextDate;
      });

      const dayGames = gameProgress.filter(game => {
        const playDate = new Date(game.lastPlayedAt);
        return playDate >= date && playDate < nextDate;
      });

      // Estimate: Each activity = ~2 minutes, game time is in seconds
      const activityMinutes = dayActivities.length * 2;
      const gameMinutes = Math.round(dayGames.reduce((sum, g) => sum + (g.totalTimePlayed || 0), 0) / 60);
      const totalMinutes = activityMinutes + gameMinutes;

      dailyEngagement.push({
        date: date.toISOString().split('T')[0],
        minutes: totalMinutes,
        activities: dayActivities.length,
        gamesPlayed: dayGames.length
      });
    }

    // Calculate totals
    const totalMinutes = dailyEngagement.reduce((sum, day) => sum + day.minutes, 0);
    const avgMinutesPerDay = Math.round(totalMinutes / 7);
    const daysActive = dailyEngagement.filter(day => day.minutes > 0).length;

    // Calculate streak
    let currentStreak = 0;
    for (let i = dailyEngagement.length - 1; i >= 0; i--) {
      if (dailyEngagement[i].minutes > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    res.status(200).json({
      totalMinutes,
      avgMinutesPerDay,
      daysActive,
      streak: currentStreak,
      dailyEngagement,
      goalMinutes: 30, // Daily goal
      goalProgress: Math.min(100, Math.round((avgMinutesPerDay / 30) * 100))
    });
  } catch (err) {
    console.error("❌ Failed to get engagement minutes:", err);
    res.status(500).json({ error: "Failed to fetch engagement minutes" });
  }
};

// Activity Heatmap - Week × Hours
export const getActivityHeatmap = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get activity logs for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activityLogs = await ActivityLog.find({
      userId,
      timestamp: { $gte: sevenDaysAgo }
    }).sort({ timestamp: 1 });

    // Create heatmap data: days × hours
    const heatmapData = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      const date = new Date();
      date.setDate(date.getDate() - dayOffset);
      date.setHours(0, 0, 0, 0);

      const dayName = daysOfWeek[date.getDay()];
      const hourlyData = Array(24).fill(0);

      // Count activities per hour
      activityLogs.forEach(log => {
        const logDate = new Date(log.timestamp);
        const logDay = new Date(logDate);
        logDay.setHours(0, 0, 0, 0);

        if (logDay.getTime() === date.getTime()) {
          const hour = logDate.getHours();
          hourlyData[hour]++;
        }
      });

      heatmapData.push({
        day: dayName,
        date: date.toISOString().split('T')[0],
        hours: hourlyData
      });
    }

    res.status(200).json({
      heatmapData,
      totalActivities: activityLogs.length
    });
  } catch (err) {
    console.error("❌ Failed to get activity heatmap:", err);
    res.status(500).json({ error: "Failed to fetch activity heatmap" });
  }
};

// Mood Timeline - Last 7 check-ins with notes
export const getMoodTimeline = async (req, res) => {
  try {
    const userId = req.user._id;

    const moodLogs = await MoodLog.find({ userId })
      .sort({ date: -1 })
      .limit(7);

    const timeline = moodLogs.reverse().map(log => ({
      id: log._id,
      emoji: log.emoji,
      note: log.journal || "",
      date: log.date,
      timestamp: log.createdAt
    }));

    res.status(200).json({
      timeline,
      totalEntries: await MoodLog.countDocuments({ userId })
    });
  } catch (err) {
    console.error("❌ Failed to get mood timeline:", err);
    res.status(500).json({ error: "Failed to fetch mood timeline" });
  }
};

// AI Recommendations - Personalized suggestions using professional recommendation service
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Use the new professional recommendation service
    const { generateRecommendations } = await import('../services/recommendationService.js');
    const result = await generateRecommendations(userId);

    res.status(200).json({
      recommendations: result.recommendations.slice(0, 5), // Return up to 5 recommendations
      generatedAt: result.generatedAt,
      totalCandidates: result.totalCandidates
    });
  } catch (err) {
    console.error("❌ Failed to get recommendations:", err);
    // Return fallback recommendations on error
    const { generateRecommendations } = await import('../services/recommendationService.js');
    try {
      const fallback = await generateRecommendations(req.user._id);
      res.status(200).json({
        recommendations: fallback.recommendations.slice(0, 3),
        generatedAt: fallback.generatedAt,
        error: "Using fallback recommendations"
      });
    } catch (fallbackErr) {
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  }
};

// Leaderboard Snippet - Top users (supports period filtering)
export const getLeaderboardSnippet = async (req, res) => {
  try {
    const userId = req.user._id;
    const period = req.query.period || 'allTime';

    // Validate period
    if (!['daily', 'weekly', 'monthly', 'allTime'].includes(period)) {
      return res.status(400).json({ error: 'Invalid period' });
    }

    // Import leaderboard cache for position change tracking
    const leaderboardCache = (await import('../utils/leaderboardCache.js')).default;

    let leaderboard = [];

    if (period === 'allTime') {
      // Get top users by XP with populated user data - optimized with .lean()
      const topUsers = await UserProgress.find()
        .sort({ xp: -1 })
        .limit(50)
        .populate('userId', 'name username email fullName avatar')
        .lean();

      // Filter out entries with null/invalid userId
      const validTopUsers = topUsers.filter(progress => progress.userId && progress.userId._id);

      leaderboard = validTopUsers.map((progress, index) => {
        const user = progress.userId;
        
        let displayName = user.name || user.fullName || user.username || (user.email ? user.email.split('@')[0] : 'User');
        let displayUsername = user.username || (user.email ? user.email.split('@')[0] : 'user');

          return {
            rank: index + 1,
            _id: user._id,
            name: displayName,
            username: displayUsername,
            avatar: user.avatar,
            xp: progress.xp || 0,
            level: progress.level || Math.floor((progress.xp || 0) / 100) + 1,
            isCurrentUser: user._id && userId && user._id.toString() === userId.toString()
          };
      });
    } else {
      // For daily, weekly, monthly - aggregate XP from XPLog
      const now = new Date();
      let startDate;

      switch(period) {
        case 'daily':
          startDate = new Date(now);
          startDate.setHours(0, 0, 0, 0);
          startDate.setMinutes(0, 0, 0);
          break;
        case 'weekly':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - now.getDay());
          startDate.setHours(0, 0, 0, 0);
          startDate.setMinutes(0, 0, 0);
          break;
        case 'monthly':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          startDate.setHours(0, 0, 0, 0);
          startDate.setMinutes(0, 0, 0);
          break;
      }

      // Aggregate XP from XPLog for the period
      const xpAggregation = await XPLog.aggregate([
        {
          $match: {
            date: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$userId',
            totalXP: { $sum: '$xp' }
          }
        },
        {
          $sort: { totalXP: -1 }
        },
        {
          $limit: 50
        }
      ]);

      // Get user details for top XP earners - optimized with .lean()
      const userIds = xpAggregation.map(item => item._id);
      const users = await User.find({ _id: { $in: userIds } })
        .select('name username email fullName avatar')
        .lean();

      const userMap = new Map(users.map(u => [u._id.toString(), u]));

      leaderboard = xpAggregation.map((item, index) => {
        const userData = userMap.get(item._id.toString());
        if (!userData) return null;

        let displayName = userData.name || userData.fullName || userData.username || (userData.email ? userData.email.split('@')[0] : 'User');
        let displayUsername = userData.username || (userData.email ? userData.email.split('@')[0] : 'user');

        return {
          rank: index + 1,
          _id: userData._id,
          name: displayName,
          username: displayUsername,
          avatar: userData.avatar,
          xp: item.totalXP || 0,
          level: Math.floor((item.totalXP || 0) / 100) + 1,
          isCurrentUser: userData._id && userId && userData._id.toString() === userId.toString()
        };
      }).filter(Boolean);
    }

    // Calculate position changes using cache
    const leaderboardWithChanges = leaderboardCache.calculatePositionChanges(period, leaderboard);
    
    // Update cache with current positions for next comparison
    leaderboardCache.updatePositions(period, leaderboard);

    // Get current user's XP and calculate actual rank
    const userProgress = await UserProgress.findOne({ userId });
    let currentUserXP;
    let currentUserRank;
    let currentUserInfo = null;

    if (period === 'allTime') {
      currentUserXP = userProgress?.xp || 0;
      
      // Calculate actual rank: count how many users have more XP
      const usersAbove = await UserProgress.countDocuments({ 
        xp: { $gt: currentUserXP },
        userId: { $exists: true, $ne: null }
      });
      currentUserRank = usersAbove + 1;

      // Get user info if not in top 50
      if (!leaderboardWithChanges.find(u => u.isCurrentUser)) {
        const user = await User.findById(userId).select('name username email fullName avatar').lean();
        if (user) {
          let displayName = user.name || user.fullName || user.username || (user.email ? user.email.split('@')[0] : 'User');
          let displayUsername = user.username || (user.email ? user.email.split('@')[0] : 'user');
          
          currentUserInfo = {
            rank: currentUserRank,
            _id: user._id,
            name: displayName,
            username: displayUsername,
            avatar: user.avatar,
            xp: currentUserXP,
            level: userProgress?.level || Math.floor(currentUserXP / 100) + 1,
            isCurrentUser: true
          };
        }
      }
    } else {
      // For time-based periods, calculate XP from XPLog
      const now = new Date();
      let startDate;

      switch(period) {
        case 'daily':
          startDate = new Date(now);
          startDate.setHours(0, 0, 0, 0);
          startDate.setMinutes(0, 0, 0);
          break;
        case 'weekly':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - now.getDay());
          startDate.setHours(0, 0, 0, 0);
          startDate.setMinutes(0, 0, 0);
          break;
        case 'monthly':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          startDate.setHours(0, 0, 0, 0);
          startDate.setMinutes(0, 0, 0);
          break;
      }

      const userXPResult = await XPLog.aggregate([
        {
          $match: {
            userId: userId,
            date: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: null,
            totalXP: { $sum: '$xp' }
          }
        }
      ]);

      currentUserXP = userXPResult[0]?.totalXP || 0;

      // Calculate actual rank for time-based periods
      const usersAbove = await XPLog.aggregate([
        {
          $match: {
            date: { $gte: startDate },
            userId: { $ne: userId }
          }
        },
        {
          $group: {
            _id: '$userId',
            totalXP: { $sum: '$xp' }
          }
        },
        {
          $match: {
            totalXP: { $gt: currentUserXP }
          }
        },
        {
          $count: 'count'
        }
      ]);

      currentUserRank = (usersAbove[0]?.count || 0) + 1;

      // Get user info if not in top 50
      if (!leaderboardWithChanges.find(u => u.isCurrentUser) && currentUserXP > 0) {
        const user = await User.findById(userId).select('name username email fullName avatar').lean();
        if (user) {
          let displayName = user.name || user.fullName || user.username || (user.email ? user.email.split('@')[0] : 'User');
          let displayUsername = user.username || (user.email ? user.email.split('@')[0] : 'user');
          
          currentUserInfo = {
            rank: currentUserRank,
            _id: user._id,
            name: displayName,
            username: displayUsername,
            avatar: user.avatar,
            xp: currentUserXP,
            level: Math.floor(currentUserXP / 100) + 1,
            isCurrentUser: true
          };
        }
      }
    }

    // If user is in top 50, use their position from leaderboard
    const userInLeaderboard = leaderboardWithChanges.find(u => u.isCurrentUser);
    if (userInLeaderboard) {
      currentUserRank = userInLeaderboard.rank;
    }

    res.status(200).json({
      period,
      leaderboard: leaderboardWithChanges,
      currentUserRank: currentUserRank || null,
      currentUserXP: currentUserXP || 0,
      currentUserInfo: currentUserInfo, // User info if not in top 50
      totalUsers: await UserProgress.countDocuments()
    });
  } catch (err) {
    console.error("❌ Failed to get leaderboard:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};

// Achievement Timeline - Chronological achievements
export const getAchievementTimeline = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get achievements from game progress
    const gameProgress = await UnifiedGameProgress.find({ userId });

    const achievements = [];
    gameProgress.forEach(game => {
      if (game.achievements && game.achievements.length > 0) {
        game.achievements.forEach(achievement => {
          achievements.push({
            id: achievement._id,
            name: achievement.name,
            description: achievement.description,
            badge: achievement.badge,
            earnedAt: achievement.earnedAt,
            gameId: game.gameId,
            gameType: game.gameType
          });
        });
      }
    });

    // Sort by date (most recent first)
    achievements.sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt));

    res.status(200).json({
      achievements: achievements.slice(0, 10), // Return last 10 achievements
      totalAchievements: achievements.length
    });
  } catch (err) {
    console.error("❌ Failed to get achievement timeline:", err);
    res.status(500).json({ error: "Failed to fetch achievement timeline" });
  }
};

// Daily Actions Status
export const getDailyActionsStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check daily check-in (from UserProgress)
    const userProgress = await UserProgress.findOne({ userId });
    const lastCheckIn = userProgress?.lastCheckIn ? new Date(userProgress.lastCheckIn) : null;
    const hasCheckedInToday = lastCheckIn && lastCheckIn >= today;

    // Check if mission completed today (from activity logs)
    const missionToday = await ActivityLog.findOne({
      userId,
      activityType: { $in: ['challenge_completed', 'quiz_completed'] },
      timestamp: { $gte: today }
    });

    // Check quiz completion today
    const quizToday = await ActivityLog.findOne({
      userId,
      activityType: 'quiz_completed',
      timestamp: { $gte: today }
    });

    // Check unread notifications (inbox)
    const Notification = (await import('../models/Notification.js')).default;
    const unreadCount = await Notification.countDocuments({
      userId,
      read: false
    });

    res.status(200).json({
      dailyCheckIn: hasCheckedInToday,
      missionStarted: !!missionToday,
      quizCompleted: !!quizToday,
      inboxCount: unreadCount
    });
  } catch (err) {
    console.error("❌ Failed to get daily actions status:", err);
    res.status(500).json({ error: "Failed to fetch daily actions status" });
  }
};

// Track Recommendation Interaction
export const trackRecommendationInteraction = async (req, res) => {
  try {
    const userId = req.user._id;
    const { 
      recommendationId, 
      recommendationType, 
      recommendationTitle, 
      recommendationPath,
      recommendationReason,
      recommendationPriority,
      recommendationScore,
      action = 'clicked',
      position,
      outcome,
      engagementDuration,
      metadata = {}
    } = req.body;

    if (!recommendationId || !recommendationTitle || !recommendationPath) {
      return res.status(400).json({ error: "Missing required recommendation fields" });
    }

    // Generate a unique recommendation ID if not provided (hash of title + path)
    const finalRecommendationId = recommendationId || 
      Buffer.from(`${recommendationTitle}-${recommendationPath}`).toString('base64').substring(0, 32);

    const interaction = await RecommendationInteraction.logInteraction({
      userId,
      recommendationId: finalRecommendationId,
      recommendationType: recommendationType || 'default',
      recommendationTitle,
      recommendationPath,
      recommendationReason,
      recommendationPriority,
      recommendationScore,
      action,
      position,
      outcome,
      engagementDuration,
      metadata: {
        ...metadata,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip
      },
      recommendationGeneratedAt: metadata.recommendationGeneratedAt ? new Date(metadata.recommendationGeneratedAt) : new Date(),
      interactedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: "Recommendation interaction tracked",
      interactionId: interaction?._id
    });
  } catch (err) {
    console.error("❌ Failed to track recommendation interaction:", err);
    res.status(500).json({ error: "Failed to track recommendation interaction" });
  }
};

// Get Recommendation Performance Analytics
export const getRecommendationAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;

    // Get user's interaction stats
    const userStats = await RecommendationInteraction.getUserStats(userId, parseInt(days));

    // Get most clicked recommendations
    const mostClicked = await RecommendationInteraction.aggregate([
      {
        $match: {
          userId: userId,
          action: 'clicked',
          interactedAt: { $gte: new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: '$recommendationId',
          title: { $first: '$recommendationTitle' },
          path: { $first: '$recommendationPath' },
          type: { $first: '$recommendationType' },
          clickCount: { $sum: 1 },
          avgPosition: { $avg: '$position' },
          avgScore: { $avg: '$recommendationScore' }
        }
      },
      { $sort: { clickCount: -1 } },
      { $limit: 10 }
    ]);

    // Get interaction breakdown by type
    const typeBreakdown = await RecommendationInteraction.aggregate([
      {
        $match: {
          userId: userId,
          interactedAt: { $gte: new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { type: '$recommendationType', action: '$action' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      userStats: userStats.map(stat => ({
        action: stat._id,
        count: stat.count,
        avgPosition: stat.avgPosition
      })),
      mostClicked,
      typeBreakdown: typeBreakdown.map(item => ({
        type: item._id.type,
        action: item._id.action,
        count: item.count
      })),
      period: `${days} days`
    });
  } catch (err) {
    console.error("❌ Failed to get recommendation analytics:", err);
    res.status(500).json({ error: "Failed to fetch recommendation analytics" });
  }
};
