import UserProgress from '../models/UserProgress.js';
import UnifiedGameProgress from '../models/UnifiedGameProgress.js';
import MoodLog from '../models/MoodLog.js';
import ActivityLog from '../models/ActivityLog.js';
import User from '../models/User.js';
import RecommendationInteraction from '../models/RecommendationInteraction.js';
import { getUserSubscription } from '../utils/subscriptionUtils.js';
import { getPillarGameCount } from '../utils/gameCountUtils.js';

/**
 * Professional Recommendation Service
 * Implements Phase 1: Foundation - Multi-factor personalization with weighted scoring
 */

// Pillar definitions with metadata
const PILLAR_DEFINITIONS = [
  { key: 'finance', name: 'Financial Literacy', icon: '💰', route: '/games/financial-literacy' },
  { key: 'brain', name: 'Brain Health', icon: '🎯', route: '/games/brain-health' },
  { key: 'uvls', name: 'UVLS (Life Skills & Values)', icon: '🌟', route: '/games/uvls' },
  { key: 'dcos', name: 'Digital Citizenship & Online Safety', icon: '🔒', route: '/games/digital-citizenship' },
  { key: 'moral', name: 'Moral Values', icon: '💫', route: '/games/moral-values' },
  { key: 'ai', name: 'AI for All', icon: '🤖', route: '/games/ai-for-all' },
  { key: 'health-male', name: 'Health - Male', icon: '🛡️', route: '/games/health-male' },
  { key: 'health-female', name: 'Health - Female', icon: '🌸', route: '/games/health-female' },
  { key: 'ehe', name: 'Entrepreneurship & Higher Education', icon: '🚀', route: '/games/ehe' },
  { key: 'crgc', name: 'Civic Responsibility & Global Citizenship', icon: '🌍', route: '/games/civic-responsibility' },
  { key: 'sustainability', name: 'Sustainability', icon: '🌱', route: '/games/sustainability' }
];

// Map pillar keys to gameType values (for backward compatibility)
const PILLAR_TO_GAME_TYPE_MAP = {
  'crgc': ['crgc', 'civic-responsibility'],
  'moral': ['moral', 'moral-values'],
  'ai': ['ai', 'ai-for-all'],
  'finance': ['finance', 'financial']
};

// Weight configuration for scoring (tunable)
const SCORING_WEIGHTS = {
  SKILL_GAP: 0.35,        // Highest priority - addressing weaknesses
  CONTINUATION: 0.25,     // Continuing in-progress content
  ENGAGEMENT: 0.20,       // Based on past engagement patterns
  RECENCY: 0.10,          // Time since last interaction
  CONTEXTUAL: 0.10        // Mood, time of day, streak maintenance
};

/**
 * Main function to generate personalized recommendations
 */
export const generateRecommendations = async (userId) => {
  try {
    // Gather all user data in parallel (including interaction history)
    const [userProgress, allGameProgress, recentMoodLogs, recentActivities, user, ignoredRecommendations] = await Promise.all([
      UserProgress.findOne({ userId }),
      UnifiedGameProgress.find({ userId }),
      MoodLog.find({ userId }).sort({ date: -1 }).limit(7),
      ActivityLog.find({ userId }).sort({ timestamp: -1 }).limit(50),
      User.findById(userId).select('gender dateOfBirth dob'),
      RecommendationInteraction.getIgnoredRecommendations(userId, 7) // Get dismissed recommendations from last 7 days
    ]);

    // Get subscription info
    const subscription = await getUserSubscription(userId);
    const hasFullAccess = subscription.features?.fullAccess === true;
    const gamesPerPillar = subscription.features?.gamesPerPillar || 5;

    // Filter pillars based on user gender
    const userGender = user?.gender?.toLowerCase();
    let availablePillars = PILLAR_DEFINITIONS;
    if (userGender === 'male') {
      availablePillars = PILLAR_DEFINITIONS.filter(p => p.key !== 'health-female');
    } else if (userGender === 'female') {
      availablePillars = PILLAR_DEFINITIONS.filter(p => p.key !== 'health-male');
    } else {
      availablePillars = PILLAR_DEFINITIONS.filter(p => p.key !== 'health-male' && p.key !== 'health-female');
    }

    // Calculate pillar mastery for all available pillars
    const pillarMasteryData = await Promise.all(
      availablePillars.map(async (pillar) => {
        const gameTypeValues = PILLAR_TO_GAME_TYPE_MAP[pillar.key] || [pillar.key];
        const pillarGames = allGameProgress.filter(game => gameTypeValues.includes(game.gameType));
        const totalGames = await getPillarGameCount(pillar.key, UnifiedGameProgress);
        const gamesCompleted = pillarGames.filter(g => g.fullyCompleted).length;
        const mastery = totalGames > 0 ? Math.min(100, Math.round((gamesCompleted / totalGames) * 100)) : 0;
        const gamesInProgress = pillarGames.filter(g => !g.fullyCompleted && (g.levelsCompleted > 0 || g.highestScore > 0));

        return {
          ...pillar,
          mastery,
          gamesCompleted,
          totalGames,
          gamesInProgress,
          pillarGames,
          locked: !hasFullAccess && gamesCompleted >= gamesPerPillar
        };
      })
    );

    // Calculate user age group for routing
    const userAge = calculateUserAge(user?.dateOfBirth || user?.dob);
    const ageGroup = userAge && userAge < 13 ? 'kids' : userAge && userAge < 18 ? 'teens' : 'adults';

    // Generate candidate recommendations with scores
    const candidateRecommendations = [];

    // 1. SKILL GAP RECOMMENDATIONS - Recommend weak pillars (low mastery)
    const weakPillars = [...pillarMasteryData]
      .filter(p => !p.locked && p.totalGames > 0)
      .sort((a, b) => a.mastery - b.mastery)
      .slice(0, 3); // Top 3 weakest pillars

    weakPillars.forEach((pillar, index) => {
      const skillGapScore = (100 - pillar.mastery) / 100; // Higher score for lower mastery
      candidateRecommendations.push({
        type: 'pillar',
        title: `Master ${pillar.name} Skills`,
        description: pillar.mastery === 0 
          ? 'Start your learning journey in this area' 
          : `Improve your ${pillar.mastery}% mastery - ${pillar.gamesCompleted} of ${pillar.totalGames} games completed`,
        icon: pillar.icon,
        path: `${pillar.route}/${ageGroup}`,
        reason: pillar.mastery === 0 
          ? 'New area to explore' 
          : `Strengthen weak areas (${pillar.mastery}% mastery)`,
        xpReward: 30 + (index * 5), // Variable XP based on priority
        score: skillGapScore * SCORING_WEIGHTS.SKILL_GAP,
        scoreBreakdown: {
          skillGap: skillGapScore,
          continuation: 0,
          engagement: 0,
          recency: 0,
          contextual: 0
        },
        priority: 'high'
      });
    });

    // 2. CONTINUATION RECOMMENDATIONS - Games in progress
    const inProgressGames = allGameProgress
      .filter(g => !g.fullyCompleted && (g.levelsCompleted > 0 || g.highestScore > 0))
      .sort((a, b) => new Date(b.lastPlayedAt) - new Date(a.lastPlayedAt))
      .slice(0, 5);

    inProgressGames.forEach((gameProgress) => {
      const pillar = pillarMasteryData.find(p => {
        const gameTypeValues = PILLAR_TO_GAME_TYPE_MAP[p.key] || [p.key];
        return gameTypeValues.includes(gameProgress.gameType);
      });

      if (pillar && !pillar.locked) {
        const completionRatio = gameProgress.totalLevels > 0 
          ? gameProgress.levelsCompleted / gameProgress.totalLevels 
          : 0;
        const continuationScore = (1 - completionRatio) * 0.5 + 0.5; // Higher for less complete
        const daysSinceLastPlay = Math.floor((Date.now() - new Date(gameProgress.lastPlayedAt)) / (1000 * 60 * 60 * 24));
        const recencyBonus = daysSinceLastPlay > 7 ? 0.3 : daysSinceLastPlay > 3 ? 0.2 : 0.1;

        candidateRecommendations.push({
          type: 'continue',
          title: `Continue ${gameProgress.gameId}`,
          description: `You've completed ${gameProgress.levelsCompleted} of ${gameProgress.totalLevels} levels`,
          icon: pillar.icon,
          path: `${pillar.route}/${ageGroup}`,
          reason: 'Continue where you left off',
          xpReward: 25,
          score: continuationScore * SCORING_WEIGHTS.CONTINUATION + recencyBonus * SCORING_WEIGHTS.RECENCY,
          scoreBreakdown: {
            skillGap: 0,
            continuation: continuationScore,
            engagement: 0,
            recency: recencyBonus,
            contextual: 0
          },
          priority: 'medium',
          gameId: gameProgress.gameId
        });
      }
    });

    // 3. ENGAGEMENT-BASED RECOMMENDATIONS - Based on recent activity patterns
    const recentGameTypes = allGameProgress
      .filter(g => {
        const daysSince = Math.floor((Date.now() - new Date(g.lastPlayedAt)) / (1000 * 60 * 60 * 24));
        return daysSince <= 7; // Within last week
      })
      .map(g => g.gameType);

    // Find most engaged pillar
    const gameTypeCounts = {};
    recentGameTypes.forEach(type => {
      gameTypeCounts[type] = (gameTypeCounts[type] || 0) + 1;
    });

    const mostEngagedType = Object.keys(gameTypeCounts).reduce((a, b) => 
      gameTypeCounts[a] > gameTypeCounts[b] ? a : b, Object.keys(gameTypeCounts)[0]
    );

    if (mostEngagedType) {
      const engagedPillar = pillarMasteryData.find(p => {
        const gameTypeValues = PILLAR_TO_GAME_TYPE_MAP[p.key] || [p.key];
        return gameTypeValues.includes(mostEngagedType);
      });

      if (engagedPillar && !engagedPillar.locked && engagedPillar.mastery < 80) {
        const engagementScore = Math.min(1, gameTypeCounts[mostEngagedType] / 3); // Normalize
        candidateRecommendations.push({
          type: 'engagement',
          title: `Explore More ${engagedPillar.name}`,
          description: 'Continue your learning journey in this area',
          icon: engagedPillar.icon,
          path: `${engagedPillar.route}/${ageGroup}`,
          reason: 'Based on your recent activity',
          xpReward: 30,
          score: engagementScore * SCORING_WEIGHTS.ENGAGEMENT,
          scoreBreakdown: {
            skillGap: 0,
            continuation: 0,
            engagement: engagementScore,
            recency: 0,
            contextual: 0
          },
          priority: 'medium'
        });
      }
    }

    // 4. CONTEXTUAL RECOMMENDATIONS - Based on mood, streak, time of day
    const todayMood = recentMoodLogs.find(log => {
      const logDate = new Date(log.date).toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      return logDate === today;
    });

    const currentHour = new Date().getHours();
    const streak = userProgress?.streak || 0;

    // Wellness recommendation if mood not logged today
    if (!todayMood) {
      candidateRecommendations.push({
        type: 'wellness',
        title: 'Mood Tracker',
        description: 'Log your daily mood and feelings',
        icon: '😊',
        path: '/student/mood-tracker',
        reason: 'Daily check-in',
        xpReward: 20,
        score: SCORING_WEIGHTS.CONTEXTUAL * 0.8,
        scoreBreakdown: {
          skillGap: 0,
          continuation: 0,
          engagement: 0,
          recency: 0,
          contextual: 0.8
        },
        priority: 'medium'
      });
    }

    // Mindfulness recommendation during stressful hours (late afternoon/evening)
    if (currentHour >= 15 && currentHour <= 20) {
      candidateRecommendations.push({
        type: 'wellness',
        title: 'Mindfulness Break',
        description: 'Take a moment for yourself and recharge',
        icon: '🧘',
        path: '/student/mindfull-break',
        reason: 'Perfect time for a break',
        xpReward: 20,
        score: SCORING_WEIGHTS.CONTEXTUAL * 0.6,
        scoreBreakdown: {
          skillGap: 0,
          continuation: 0,
          engagement: 0,
          recency: 0,
          contextual: 0.6
        },
        priority: 'low'
      });
    }

    // Streak maintenance - recommend quick activity if streak is at risk
    if (streak > 0 && userProgress?.lastCheckIn) {
      const daysSinceCheckIn = Math.floor((Date.now() - new Date(userProgress.lastCheckIn)) / (1000 * 60 * 60 * 24));
      if (daysSinceCheckIn >= 1) {
        // Find quick activity pillar
        const quickPillar = pillarMasteryData
          .filter(p => !p.locked && p.mastery > 0 && p.mastery < 50)
          .sort((a, b) => a.mastery - b.mastery)[0];

        if (quickPillar) {
          candidateRecommendations.push({
            type: 'streak',
            title: `Quick ${quickPillar.name} Activity`,
            description: `Maintain your ${streak}-day streak`,
            icon: quickPillar.icon,
            path: `${quickPillar.route}/${ageGroup}`,
            reason: 'Keep your streak going',
            xpReward: 25,
            score: SCORING_WEIGHTS.CONTEXTUAL * 0.9,
            scoreBreakdown: {
              skillGap: 0,
              continuation: 0,
              engagement: 0,
              recency: 0,
              contextual: 0.9
            },
            priority: 'high'
          });
        }
      }
    }

    // 5. EXPLORATION RECOMMENDATIONS - New pillars or less explored areas
    const unexploredPillars = pillarMasteryData
      .filter(p => !p.locked && p.mastery === 0)
      .slice(0, 2);

    unexploredPillars.forEach((pillar, index) => {
      // Only add if not already in skill gap recommendations
      const alreadyRecommended = candidateRecommendations.some(r => r.path === `${pillar.route}/${ageGroup}`);
      if (!alreadyRecommended) {
        candidateRecommendations.push({
          type: 'explore',
          title: `Explore ${pillar.name}`,
          description: 'Discover new learning opportunities',
          icon: pillar.icon,
          path: `${pillar.route}/${ageGroup}`,
          reason: 'Try something new',
          xpReward: 35,
          score: 0.5 * SCORING_WEIGHTS.ENGAGEMENT,
          scoreBreakdown: {
            skillGap: 0,
            continuation: 0,
            engagement: 0.5,
            recency: 0,
            contextual: 0
          },
          priority: 'low'
        });
      }
    });

    // Sort by score (highest first)
    candidateRecommendations.sort((a, b) => b.score - a.score);

    // Apply diversity filters - ensure mix of types and pillars
    const finalRecommendations = [];
    const usedTypes = new Map(); // Count occurrences of each type
    const usedPillars = new Set();
    const maxRecommendations = 5;

    for (const rec of candidateRecommendations) {
      if (finalRecommendations.length >= maxRecommendations) break;

      // Always allow wellness and streak recommendations (they're contextual and limited)
      if (rec.type === 'wellness' || rec.type === 'streak') {
        finalRecommendations.push(rec);
        continue;
      }

      // For pillar-based recommendations, ensure diversity
      const pillarKey = availablePillars.find(p => rec.path.includes(p.route))?.key;
      
      // Count how many times this type has been used
      const typeCount = usedTypes.get(rec.type) || 0;
      
      // Allow recommendation if:
      // 1. This pillar hasn't been used yet, OR
      // 2. This type has been used less than 2 times (allows some repetition for high-scoring items)
      if (!pillarKey || !usedPillars.has(pillarKey) || typeCount < 2) {
        finalRecommendations.push(rec);
        usedTypes.set(rec.type, typeCount + 1);
        if (pillarKey) usedPillars.add(pillarKey);
      }
    }

    // Fill to at least 3 recommendations if we have less
    if (finalRecommendations.length < 3) {
      // Add default fallbacks from unexplored pillars
      const fallbackPillars = pillarMasteryData
        .filter(p => !p.locked && !usedPillars.has(p.key))
        .slice(0, 3 - finalRecommendations.length);

      fallbackPillars.forEach((pillar) => {
        finalRecommendations.push({
          type: 'default',
          title: `Start ${pillar.name}`,
          description: 'Begin your learning journey',
          icon: pillar.icon,
          path: `${pillar.route}/${ageGroup}`,
          reason: 'Recommended for you',
          xpReward: 30,
          score: 0.3,
          scoreBreakdown: {
            skillGap: 0.3,
            continuation: 0,
            engagement: 0,
            recency: 0,
            contextual: 0
          },
          priority: 'medium'
        });
      });
    }

    // Generate recommendation IDs and filter out recently dismissed ones
    const generateRecommendationId = (title, path) => 
      Buffer.from(`${title}-${path}`).toString('base64').substring(0, 32);

    // Filter out dismissed recommendations
    const filteredRecommendations = finalRecommendations.filter(rec => {
      const recId = generateRecommendationId(rec.title, rec.path);
      return !ignoredRecommendations.has(recId);
    });

    // If we filtered out too many, add back some high-scoring ones
    const recommendationsToReturn = filteredRecommendations.length >= 3 
      ? filteredRecommendations 
      : [...filteredRecommendations, ...finalRecommendations.filter(rec => {
          const recId = generateRecommendationId(rec.title, rec.path);
          return !filteredRecommendations.some(f => f.title === rec.title && f.path === rec.path) 
            && !ignoredRecommendations.has(recId);
        })].slice(0, 5);

    // Clean up recommendations for response (add recommendationId for tracking)
    const cleanedRecommendations = recommendationsToReturn.slice(0, 5).map(rec => ({
      recommendationId: generateRecommendationId(rec.title, rec.path),
      type: rec.type,
      title: rec.title,
      description: rec.description,
      icon: rec.icon,
      path: rec.path,
      reason: rec.reason,
      xpReward: rec.xpReward,
      priority: rec.priority,
      score: rec.score // Include score for analytics (optional)
    }));

    return {
      recommendations: cleanedRecommendations,
      generatedAt: new Date().toISOString(),
      totalCandidates: candidateRecommendations.length,
      filteredCount: filteredRecommendations.length
    };
  } catch (error) {
    console.error('Error generating recommendations:', error);
    // Return safe fallback recommendations
    return {
      recommendations: getFallbackRecommendations(),
      generatedAt: new Date().toISOString(),
      totalCandidates: 0,
      error: 'Failed to generate personalized recommendations'
    };
  }
};

/**
 * Calculate user age from date of birth
 */
function calculateUserAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

/**
 * Fallback recommendations when personalization fails
 */
function getFallbackRecommendations() {
  return [
    {
      type: 'default',
      title: 'Financial Literacy',
      description: 'Start your learning journey',
      icon: '💰',
      path: '/games/financial-literacy/kids',
      reason: 'Popular choice',
      xpReward: 30,
      priority: 'medium'
    },
    {
      type: 'default',
      title: 'Brain Teaser',
      description: 'Sharpen your cognitive skills',
      icon: '🧠',
      path: '/games/brain-health/kids',
      reason: 'Recommended for you',
      xpReward: 35,
      priority: 'medium'
    },
    {
      type: 'wellness',
      title: 'Mood Tracker',
      description: 'Log your daily mood and feelings',
      icon: '😊',
      path: '/student/mood-tracker',
      reason: 'Daily check-in',
      xpReward: 20,
      priority: 'medium'
    }
  ];
}

export default {
  generateRecommendations
};
