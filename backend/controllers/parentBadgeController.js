import UnifiedGameProgress from '../models/UnifiedGameProgress.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

/**
 * Check if all required games (1-9) are completed
 */
export const checkRequiredGamesCompleted = async (userId) => {
  try {
    const requiredGameIds = [
      'parent-education-1',
      'parent-education-2',
      'parent-education-3',
      'parent-education-4',
      'parent-education-5',
      'parent-education-6',
      'parent-education-7',
      'parent-education-8',
      'parent-education-9'
    ];

    const completedGames = await UnifiedGameProgress.find({
      userId,
      gameId: { $in: requiredGameIds },
      gameType: 'parent-education',
      fullyCompleted: true,
      userRole: 'parent'
    });

    const completedGameIds = new Set(completedGames.map(g => g.gameId));
    const allCompleted = requiredGameIds.every(id => completedGameIds.has(id));

    return {
      allCompleted,
      completedCount: completedGameIds.size,
      totalRequired: requiredGameIds.length,
      completedGameIds: Array.from(completedGameIds),
      missingGameIds: requiredGameIds.filter(id => !completedGameIds.has(id))
    };
  } catch (error) {
    console.error('Error checking required games:', error);
    return {
      allCompleted: false,
      completedCount: 0,
      totalRequired: 9,
      completedGameIds: [],
      missingGameIds: []
    };
  }
};

/**
 * Check Self-Aware Parent Badge status
 */
export const checkSelfAwareBadgeStatus = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { hasBadge: false, newlyEarned: false };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Self-Aware Parent' || badge.badgeId === 'self-aware-parent'
    );

    if (existingBadge) {
      const gamesStatus = await checkRequiredGamesCompleted(userId);
      return {
        hasBadge: true,
        newlyEarned: false,
        earnedAt: existingBadge.earnedAt,
        badge: existingBadge,
        ...gamesStatus
      };
    }

    // Check if all required games are completed
    const gamesStatus = await checkRequiredGamesCompleted(userId);

    return {
      hasBadge: false,
      newlyEarned: false,
      ...gamesStatus
    };
  } catch (error) {
    console.error('Error checking Self-Aware Parent Badge status:', error);
    return { hasBadge: false, newlyEarned: false, error: error.message };
  }
};

/**
 * Collect/Award Self-Aware Parent Badge
 * Only awards if all required games (1-9) are completed
 */
export const collectSelfAwareBadge = async (userId) => {
  try {
    // Check if user already has the badge
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Self-Aware Parent' || badge.badgeId === 'self-aware-parent'
    );

    if (existingBadge) {
      return {
        success: true,
        badgeEarned: false,
        alreadyEarned: true,
        badge: existingBadge,
        message: 'Badge already collected'
      };
    }

    // Verify all required games are completed
    const gamesStatus = await checkRequiredGamesCompleted(userId);

    if (!gamesStatus.allCompleted) {
      return {
        success: false,
        badgeEarned: false,
        error: 'All 9 awareness games must be completed before collecting the badge',
        gamesStatus
      };
    }

    // Award the badge
    if (!user.badges) {
      user.badges = [];
    }

    const badgeData = {
      badgeId: 'self-aware-parent',
      name: 'Self-Aware Parent',
      description: 'Understanding yourself brings peace.',
      earnedAt: new Date(),
      category: 'parent-education',
      icon: '🧘',
      message: 'Understanding yourself brings peace.'
    };

    user.badges.push(badgeData);
    await user.save();

    // Create notification
    await Notification.create({
      userId,
      type: 'achievement',
      title: '🏆 Self-Aware Parent Badge Collected!',
      message: 'Congratulations! You\'ve successfully completed all awareness games and collected your badge. Understanding yourself brings peace.',
      metadata: {
        badgeId: 'self-aware-parent',
        badgeName: 'Self-Aware Parent',
        gamesCompleted: gamesStatus.completedCount
      }
    });

    return {
      success: true,
      badgeEarned: true,
      alreadyEarned: false,
      badge: badgeData,
      gamesStatus,
      message: 'Badge collected successfully!'
    };
  } catch (error) {
    console.error('Error collecting Self-Aware Parent Badge:', error);
    return {
      success: false,
      badgeEarned: false,
      error: error.message
    };
  }
};

/**
 * GET /api/parent/badge/self-aware-parent
 * Get Self-Aware Parent Badge status
 */
export const getSelfAwareBadgeStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate parent role
    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        error: 'Only parents can access parent badges'
      });
    }

    const result = await checkSelfAwareBadgeStatus(userId);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting Self-Aware Parent Badge status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badge status',
      message: error.message
    });
  }
};

/**
 * POST /api/parent/badge/self-aware-parent/collect
 * Collect Self-Aware Parent Badge (requires all games 1-9 completed)
 */
export const collectSelfAwareBadgeEndpoint = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate parent role
    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        error: 'Only parents can collect parent badges'
      });
    }

    const result = await collectSelfAwareBadge(userId);

    if (result.success) {
      res.json({
        success: true,
        ...result
      });
    } else {
      res.status(400).json({
        success: false,
        ...result
      });
    }
  } catch (error) {
    console.error('Error collecting Self-Aware Parent Badge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    });
  }
};

/**
 * Check if all required stress regulation games (11-19) are completed
 */
export const checkCalmParentGamesCompleted = async (userId) => {
  try {
    const requiredGameIds = [
      'parent-education-11',
      'parent-education-12',
      'parent-education-13',
      'parent-education-14',
      'parent-education-15',
      'parent-education-16',
      'parent-education-17',
      'parent-education-18',
      'parent-education-19'
    ];

    const completedGames = await UnifiedGameProgress.find({
      userId,
      gameId: { $in: requiredGameIds },
      gameType: 'parent-education',
      fullyCompleted: true,
      userRole: 'parent'
    });

    const completedGameIds = new Set(completedGames.map(g => g.gameId));
    const allCompleted = requiredGameIds.every(id => completedGameIds.has(id));

    return {
      allCompleted,
      completedCount: completedGameIds.size,
      totalRequired: requiredGameIds.length,
      completedGameIds: Array.from(completedGameIds),
      missingGameIds: requiredGameIds.filter(id => !completedGameIds.has(id))
    };
  } catch (error) {
    console.error('Error checking calm parent games:', error);
    return {
      allCompleted: false,
      completedCount: 0,
      totalRequired: 9,
      completedGameIds: [],
      missingGameIds: []
    };
  }
};

/**
 * Check Calm Parent Badge status
 */
export const checkCalmParentBadgeStatus = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { hasBadge: false, newlyEarned: false };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Calm Parent' || badge.badgeId === 'calm-parent'
    );

    if (existingBadge) {
      const gamesStatus = await checkCalmParentGamesCompleted(userId);
      return {
        hasBadge: true,
        newlyEarned: false,
        earnedAt: existingBadge.earnedAt,
        badge: existingBadge,
        ...gamesStatus
      };
    }

    // Check if all required games are completed
    const gamesStatus = await checkCalmParentGamesCompleted(userId);

    return {
      hasBadge: false,
      newlyEarned: false,
      ...gamesStatus
    };
  } catch (error) {
    console.error('Error checking Calm Parent Badge status:', error);
    return { hasBadge: false, newlyEarned: false, error: error.message };
  }
};

/**
 * Collect/Award Calm Parent Badge
 * Only awards if all required games (11-19) are completed
 */
export const collectCalmParentBadge = async (userId) => {
  try {
    // Check if user already has the badge
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Calm Parent' || badge.badgeId === 'calm-parent'
    );

    if (existingBadge) {
      return {
        success: true,
        badgeEarned: false,
        alreadyEarned: true,
        badge: existingBadge,
        message: 'Badge already collected'
      };
    }

    // Verify all required games are completed
    const gamesStatus = await checkCalmParentGamesCompleted(userId);

    if (!gamesStatus.allCompleted) {
      return {
        success: false,
        badgeEarned: false,
        error: 'All 9 stress regulation games must be completed before collecting the badge',
        gamesStatus
      };
    }

    // Award the badge
    if (!user.badges) {
      user.badges = [];
    }

    const badgeData = {
      badgeId: 'calm-parent',
      name: 'Calm Parent',
      description: 'Calm is your family\'s anchor.',
      earnedAt: new Date(),
      category: 'parent-education',
      icon: '🧘',
      message: 'Calm is your family\'s anchor.'
    };

    user.badges.push(badgeData);
    await user.save();

    // Create notification
    await Notification.create({
      userId,
      type: 'achievement',
      title: '🏆 Calm Parent Badge Collected!',
      message: 'Congratulations! You\'ve successfully completed all stress regulation games and collected your badge. Calm is your family\'s anchor.',
      metadata: {
        badgeId: 'calm-parent',
        badgeName: 'Calm Parent',
        gamesCompleted: gamesStatus.completedCount
      }
    });

    return {
      success: true,
      badgeEarned: true,
      alreadyEarned: false,
      badge: badgeData,
      gamesStatus,
      message: 'Badge collected successfully!'
    };
  } catch (error) {
    console.error('Error collecting Calm Parent Badge:', error);
    return {
      success: false,
      badgeEarned: false,
      error: error.message
    };
  }
};

/**
 * GET /api/parent/badge/calm-parent
 * Get Calm Parent Badge status
 */
export const getCalmParentBadgeStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate parent role
    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        error: 'Only parents can access parent badges'
      });
    }

    const result = await checkCalmParentBadgeStatus(userId);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting Calm Parent Badge status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badge status',
      message: error.message
    });
  }
};

/**
 * POST /api/parent/badge/calm-parent/collect
 * Collect Calm Parent Badge (requires all games 11-19 completed)
 */
export const collectCalmParentBadgeEndpoint = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate parent role
    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        error: 'Only parents can collect parent badges'
      });
    }

    const result = await collectCalmParentBadge(userId);

    if (result.success) {
      res.json({
        success: true,
        ...result
      });
    } else {
      res.status(400).json({
        success: false,
        ...result
      });
    }
  } catch (error) {
    console.error('Error collecting Calm Parent Badge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    });
  }
};

/**
 * Check if all required empathy games (21, 22, 27, 28, 29) are completed
 */
export const checkCompassionateParentGamesCompleted = async (userId) => {
  try {
    const requiredGameIds = [
      'parent-education-21',
      'parent-education-22',
      'parent-education-27',
      'parent-education-28',
      'parent-education-29'
    ];

    const completedGames = await UnifiedGameProgress.find({
      userId,
      gameId: { $in: requiredGameIds },
      gameType: 'parent-education',
      fullyCompleted: true,
      userRole: 'parent'
    });

    const completedGameIds = new Set(completedGames.map(g => g.gameId));
    const allCompleted = requiredGameIds.every(id => completedGameIds.has(id));

    return {
      allCompleted,
      completedCount: completedGameIds.size,
      totalRequired: requiredGameIds.length,
      completedGameIds: Array.from(completedGameIds),
      missingGameIds: requiredGameIds.filter(id => !completedGameIds.has(id))
    };
  } catch (error) {
    console.error('Error checking compassionate parent games:', error);
    return {
      allCompleted: false,
      completedCount: 0,
      totalRequired: 5,
      completedGameIds: [],
      missingGameIds: []
    };
  }
};

/**
 * Check Compassionate Parent Badge status
 */
export const checkCompassionateParentBadgeStatus = async (userId) => {
  try {
    const user = await User.findById(userId).select('badges');
    if (!user) {
      return { hasBadge: false, newlyEarned: false, error: 'User not found' };
    }

    const existingBadge = user.badges?.find(
      badge => badge.name === 'Compassionate Parent' || badge.badgeId === 'compassionate-parent'
    );

    const hasBadge = !!existingBadge;
    
    // Check if games are completed
    const gamesStatus = await checkCompassionateParentGamesCompleted(userId);
    
    const gamesStatusList = await Promise.all(
      ['parent-education-21', 'parent-education-22', 'parent-education-27', 'parent-education-28', 'parent-education-29'].map(async (gameId) => {
        const progress = await UnifiedGameProgress.findOne({
          userId,
          gameId,
          gameType: 'parent-education',
          userRole: 'parent'
        });
        return {
          gameId,
          completed: progress?.fullyCompleted === true
        };
      })
    );

    return {
      hasBadge,
      newlyEarned: hasBadge && existingBadge?.earnedAt && 
        (Date.now() - new Date(existingBadge.earnedAt).getTime()) < 24 * 60 * 60 * 1000,
      allGamesCompleted: gamesStatus.allCompleted,
      gamesStatus: gamesStatusList
    };
  } catch (error) {
    console.error('Error checking Compassionate Parent Badge status:', error);
    return { hasBadge: false, newlyEarned: false, error: error.message };
  }
};

/**
 * Collect/Award Compassionate Parent Badge
 * Only awards if all required games (21, 22, 27, 28, 29) are completed
 */
export const collectCompassionateParentBadge = async (userId) => {
  try {
    // Check if user already has the badge
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Compassionate Parent' || badge.badgeId === 'compassionate-parent'
    );

    if (existingBadge) {
      return {
        success: true,
        badgeEarned: false,
        alreadyEarned: true,
        badge: existingBadge,
        message: 'Badge already collected'
      };
    }

    // Verify all required games are completed
    const gamesStatus = await checkCompassionateParentGamesCompleted(userId);

    if (!gamesStatus.allCompleted) {
      return {
        success: false,
        badgeEarned: false,
        error: 'All 5 empathy tasks must be completed before collecting the badge',
        gamesStatus
      };
    }

    // Award the badge
    if (!user.badges) {
      user.badges = [];
    }

    const badgeData = {
      badgeId: 'compassionate-parent',
      name: 'Compassionate Parent',
      description: 'Your kindness shapes your child\'s heart.',
      earnedAt: new Date(),
      category: 'parent-education',
      icon: '💚',
      message: 'Your kindness shapes your child\'s heart.'
    };

    user.badges.push(badgeData);
    await user.save();

    // Create notification
    await Notification.create({
      userId,
      type: 'achievement',
      title: '🏆 Compassionate Parent Badge Collected!',
      message: 'Congratulations! You\'ve successfully completed all empathy tasks and collected your badge. Your kindness shapes your child\'s heart.',
      metadata: {
        badgeId: 'compassionate-parent',
        badgeName: 'Compassionate Parent',
        gamesCompleted: gamesStatus.completedCount
      }
    });

    return {
      success: true,
      badgeEarned: true,
      alreadyEarned: false,
      badge: badgeData,
      gamesStatus,
      message: 'Badge collected successfully!'
    };
  } catch (error) {
    console.error('Error collecting Compassionate Parent Badge:', error);
    return {
      success: false,
      badgeEarned: false,
      error: error.message
    };
  }
};

/**
 * GET /api/parent/badge/compassionate-parent
 * Get Compassionate Parent Badge status
 */
export const getCompassionateParentBadgeStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate parent role
    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        error: 'Only parents can access parent badges'
      });
    }

    const result = await checkCompassionateParentBadgeStatus(userId);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting Compassionate Parent Badge status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badge status',
      message: error.message
    });
  }
};

/**
 * POST /api/parent/badge/compassionate-parent/collect
 * Collect Compassionate Parent Badge (requires all games 21, 22, 27, 28, 29 completed)
 */
export const collectCompassionateParentBadgeEndpoint = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate parent role
    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        error: 'Only parents can collect parent badges'
      });
    }

    const result = await collectCompassionateParentBadge(userId);

    if (result.success) {
      res.json({
        success: true,
        ...result
      });
    } else {
      res.status(400).json({
        success: false,
        ...result
      });
    }
  } catch (error) {
    console.error('Error collecting Compassionate Parent Badge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    });
  }
};

/**
 * GET /api/parent/badges
 * Get all parent badges
 */
/**
 * Check if all required presence/balance games (34, 35, 36, 38, 39) are completed
 */
export const checkPresentParentGamesCompleted = async (userId) => {
  try {
    const requiredGameIds = [
      'parent-education-34', // Work Worry Box
      'parent-education-35', // Presence Practice
      'parent-education-36', // Shared Meal Challenge
      'parent-education-38', // Quality Over Quantity
      'parent-education-39'  // Work–Family Boundary Planner
    ];

    const completedGames = await UnifiedGameProgress.find({
      userId,
      gameId: { $in: requiredGameIds },
      gameType: 'parent-education',
      fullyCompleted: true,
      userRole: 'parent'
    });

    const completedGameIds = new Set(completedGames.map(g => g.gameId));
    const allCompleted = requiredGameIds.every(id => completedGameIds.has(id));

    return {
      allCompleted,
      completedCount: completedGameIds.size,
      totalRequired: requiredGameIds.length,
      completedGameIds: Array.from(completedGameIds),
      missingGameIds: requiredGameIds.filter(id => !completedGameIds.has(id))
    };
  } catch (error) {
    console.error('Error checking present parent games:', error);
    return {
      allCompleted: false,
      completedCount: 0,
      totalRequired: 5,
      completedGameIds: [],
      missingGameIds: []
    };
  }
};

/**
 * Check Present Parent Badge status
 */
export const checkPresentParentBadgeStatus = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { hasBadge: false, newlyEarned: false };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Present Parent' || badge.badgeId === 'present-parent'
    );

    if (existingBadge) {
      const gamesStatus = await checkPresentParentGamesCompleted(userId);
      return {
        hasBadge: true,
        newlyEarned: false,
        earnedAt: existingBadge.earnedAt,
        badge: existingBadge,
        ...gamesStatus
      };
    }

    // Check if all required games are completed
    const gamesStatus = await checkPresentParentGamesCompleted(userId);

    return {
      hasBadge: false,
      newlyEarned: false,
      ...gamesStatus
    };
  } catch (error) {
    console.error('Error checking Present Parent Badge status:', error);
    return { hasBadge: false, newlyEarned: false, error: error.message };
  }
};

/**
 * Collect/Award Present Parent Badge
 * Only awards if all required games (34, 35, 36, 38, 39) are completed
 */
export const collectPresentParentBadge = async (userId) => {
  try {
    // Check if user already has the badge
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Present Parent' || badge.badgeId === 'present-parent'
    );

    if (existingBadge) {
      const gamesStatus = await checkPresentParentGamesCompleted(userId);
      return {
        success: true,
        badgeEarned: false,
        alreadyEarned: true,
        badge: existingBadge,
        gamesStatus,
        message: 'Badge already collected'
      };
    }

    // Verify all required games are completed
    const gamesStatus = await checkPresentParentGamesCompleted(userId);

    if (!gamesStatus.allCompleted) {
      return {
        success: false,
        badgeEarned: false,
        error: 'All 5 presence and balance activities must be completed before collecting the badge',
        gamesStatus
      };
    }

    // Award the badge
    if (!user.badges) {
      user.badges = [];
    }

    const badgeData = {
      badgeId: 'present-parent',
      name: 'Present Parent',
      description: 'Your time is love made visible.',
      earnedAt: new Date(),
      category: 'parent-education',
      icon: '👁️',
      message: 'Your time is love made visible.'
    };

    user.badges.push(badgeData);
    await user.save();

    // Create notification
    await Notification.create({
      userId,
      type: 'achievement',
      title: '🏆 Present Parent Badge Collected!',
      message: 'Your time is love made visible.',
      data: {
        badgeId: 'present-parent',
        badgeName: 'Present Parent',
        message: 'Your time is love made visible.'
      },
      read: false
    });

    return {
      success: true,
      badgeEarned: true,
      alreadyEarned: false,
      badge: badgeData,
      gamesStatus,
      message: 'Badge collected successfully!'
    };
  } catch (error) {
    console.error('Error collecting Present Parent Badge:', error);
    return {
      success: false,
      badgeEarned: false,
      error: error.message || 'Failed to collect badge'
    };
  }
};

/**
 * API Endpoint: Get Present Parent Badge Status
 */
export const getPresentParentBadgeStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        error: 'Only parents can access parent badges'
      });
    }

    const status = await checkPresentParentBadgeStatus(userId);
    res.json({
      success: true,
      ...status
    });
  } catch (error) {
    console.error('Error getting Present Parent Badge status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badge status',
      message: error.message
    });
  }
};

/**
 * API Endpoint: Collect Present Parent Badge
 */
export const collectPresentParentBadgeEndpoint = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        error: 'Only parents can access parent badges'
      });
    }

    const result = await collectPresentParentBadge(userId);
    
    if (result.success) {
      res.json({
        success: true,
        ...result
      });
    } else {
      res.status(400).json({
        success: false,
        ...result
      });
    }
  } catch (error) {
    console.error('Error collecting Present Parent Badge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    });
  }
};

/**
 * Check if all required mindfulness games (41, 42, 46, 48, 49) are completed
 */
export const checkMindfulParentGamesCompleted = async (userId) => {
  try {
    const requiredGameIds = [
      'parent-education-41',
      'parent-education-42',
      'parent-education-46',
      'parent-education-48',
      'parent-education-49'
    ];

    const completedGames = await UnifiedGameProgress.find({
      userId,
      gameId: { $in: requiredGameIds },
      gameType: 'parent-education',
      fullyCompleted: true,
      userRole: 'parent'
    });

    const completedGameIds = new Set(completedGames.map(g => g.gameId));
    const allCompleted = requiredGameIds.every(id => completedGameIds.has(id));

    return {
      allCompleted,
      completedCount: completedGameIds.size,
      totalRequired: requiredGameIds.length,
      completedGameIds: Array.from(completedGameIds),
      missingGameIds: requiredGameIds.filter(id => !completedGameIds.has(id))
    };
  } catch (error) {
    console.error('Error checking mindful parent games:', error);
    return {
      allCompleted: false,
      completedCount: 0,
      totalRequired: 5,
      completedGameIds: [],
      missingGameIds: []
    };
  }
};

/**
 * Check Mindful Parent Badge status
 */
export const checkMindfulParentBadgeStatus = async (userId) => {
  try {
    const user = await User.findById(userId).select('badges');
    if (!user) {
      return { hasBadge: false, newlyEarned: false, error: 'User not found' };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Mindful Parent' || badge.badgeId === 'mindful-parent'
    );

    if (existingBadge) {
      const gamesStatus = await checkMindfulParentGamesCompleted(userId);
      return {
        hasBadge: true,
        newlyEarned: false,
        earnedAt: existingBadge.earnedAt,
        badge: existingBadge,
        ...gamesStatus
      };
    }

    // Check if all required games are completed
    const gamesStatus = await checkMindfulParentGamesCompleted(userId);

    return {
      hasBadge: false,
      newlyEarned: false,
      ...gamesStatus
    };
  } catch (error) {
    console.error('Error checking Mindful Parent Badge status:', error);
    return { hasBadge: false, newlyEarned: false, error: error.message };
  }
};

/**
 * Collect/Award Mindful Parent Badge
 * Only awards if all required games (41, 42, 46, 48, 49) are completed
 */
export const collectMindfulParentBadge = async (userId) => {
  try {
    // Check if user already has the badge
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Mindful Parent' || badge.badgeId === 'mindful-parent'
    );

    if (existingBadge) {
      const gamesStatus = await checkMindfulParentGamesCompleted(userId);
      return {
        success: true,
        badgeEarned: false,
        alreadyEarned: true,
        badge: existingBadge,
        gamesStatus,
        message: 'Badge already collected'
      };
    }

    // Verify all required games are completed
    const gamesStatus = await checkMindfulParentGamesCompleted(userId);

    if (!gamesStatus.allCompleted) {
      return {
        success: false,
        badgeEarned: false,
        error: 'All 5 mindfulness activities must be completed before collecting the badge',
        gamesStatus
      };
    }

    // Award the badge
    if (!user.badges) {
      user.badges = [];
    }

    const badgeData = {
      badgeId: 'mindful-parent',
      name: 'Mindful Parent',
      description: 'Your calm presence is your child\'s safe space.',
      earnedAt: new Date(),
      category: 'parent-education',
      icon: '🧘',
      message: 'Your calm presence is your child\'s safe space.'
    };

    user.badges.push(badgeData);
    await user.save();

    // Create notification
    await Notification.create({
      userId,
      type: 'achievement',
      title: '🏆 Mindful Parent Badge Collected!',
      message: 'Your calm presence is your child\'s safe space.',
      data: {
        badgeId: 'mindful-parent',
        badgeName: 'Mindful Parent',
        message: 'Your calm presence is your child\'s safe space.'
      },
      read: false
    });

    return {
      success: true,
      badgeEarned: true,
      alreadyEarned: false,
      badge: badgeData,
      gamesStatus,
      message: 'Badge collected successfully!'
    };
  } catch (error) {
    console.error('Error collecting Mindful Parent Badge:', error);
    return {
      success: false,
      badgeEarned: false,
      error: error.message || 'Failed to collect badge'
    };
  }
};

/**
 * API Endpoint: Get Mindful Parent Badge Status
 */
export const getMindfulParentBadgeStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        error: 'Only parents can access parent badges'
      });
    }

    const status = await checkMindfulParentBadgeStatus(userId);
    res.json({
      success: true,
      ...status
    });
  } catch (error) {
    console.error('Error getting Mindful Parent Badge status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badge status',
      message: error.message
    });
  }
};

/**
 * API Endpoint: Collect Mindful Parent Badge
 */
export const collectMindfulParentBadgeEndpoint = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        error: 'Only parents can access parent badges'
      });
    }

    const result = await collectMindfulParentBadge(userId);
    
    if (result.success) {
      res.json({
        success: true,
        ...result
      });
    } else {
      res.status(400).json({
        success: false,
        ...result
      });
    }
  } catch (error) {
    console.error('Error collecting Mindful Parent Badge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    });
  }
};

/**
 * Check if all required resilience games (54, 55, 57, 58, 59) are completed
 */
export const checkResilientParentGamesCompleted = async (userId) => {
  try {
    const requiredGameIds = [
      'parent-education-54', // Forgive Yourself Journal
      'parent-education-55', // Challenge–Choice Simulation
      'parent-education-57', // Resilience Ladder
      'parent-education-58', // Support Network Builder
      'parent-education-59'  // Gratitude for Growth
    ];

    const completedGames = await UnifiedGameProgress.find({
      userId,
      gameId: { $in: requiredGameIds },
      gameType: 'parent-education',
      fullyCompleted: true,
      userRole: 'parent'
    });

    const completedGameIds = new Set(completedGames.map(g => g.gameId));
    const allCompleted = requiredGameIds.every(id => completedGameIds.has(id));

    return {
      allCompleted,
      completedCount: completedGameIds.size,
      totalRequired: requiredGameIds.length,
      completedGameIds: Array.from(completedGameIds),
      missingGameIds: requiredGameIds.filter(id => !completedGameIds.has(id))
    };
  } catch (error) {
    console.error('Error checking resilient parent games:', error);
    return {
      allCompleted: false,
      completedCount: 0,
      totalRequired: 5,
      completedGameIds: [],
      missingGameIds: []
    };
  }
};

/**
 * Check Resilient Parent Badge status
 */
export const checkResilientParentBadgeStatus = async (userId) => {
  try {
    const user = await User.findById(userId).select('badges');
    if (!user) {
      return { hasBadge: false, newlyEarned: false, error: 'User not found' };
    }

    const existingBadge = user.badges?.find(
      badge => badge.name === 'Resilient Parent' || badge.badgeId === 'resilient-parent'
    );

    const hasBadge = !!existingBadge;
    
    // Check if games are completed
    const gamesStatus = await checkResilientParentGamesCompleted(userId);
    
    const gamesStatusList = await Promise.all(
      ['parent-education-54', 'parent-education-55', 'parent-education-57', 'parent-education-58', 'parent-education-59'].map(async (gameId) => {
        const progress = await UnifiedGameProgress.findOne({
          userId,
          gameId,
          gameType: 'parent-education',
          userRole: 'parent'
        });
        return {
          gameId,
          completed: progress?.fullyCompleted === true
        };
      })
    );

    return {
      hasBadge,
      newlyEarned: hasBadge && existingBadge?.earnedAt && 
        (Date.now() - new Date(existingBadge.earnedAt).getTime()) < 24 * 60 * 60 * 1000,
      allGamesCompleted: gamesStatus.allCompleted,
      gamesStatus: gamesStatusList,
      ...gamesStatus
    };
  } catch (error) {
    console.error('Error checking Resilient Parent Badge status:', error);
    return { hasBadge: false, newlyEarned: false, error: error.message };
  }
};

/**
 * Collect/Award Resilient Parent Badge
 * Only awards if all required games (54, 55, 57, 58, 59) are completed
 */
export const collectResilientParentBadge = async (userId) => {
  try {
    // Check if user already has the badge
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Resilient Parent' || badge.badgeId === 'resilient-parent'
    );

    if (existingBadge) {
      const gamesStatus = await checkResilientParentGamesCompleted(userId);
      return {
        success: true,
        badgeEarned: false,
        alreadyEarned: true,
        badge: existingBadge,
        gamesStatus,
        message: 'Badge already collected'
      };
    }

    // Check if all required games are completed
    const gamesStatus = await checkResilientParentGamesCompleted(userId);

    if (!gamesStatus.allCompleted) {
      return {
        success: false,
        badgeEarned: false,
        error: 'Complete all 5 resilience activities first',
        gamesStatus
      };
    }

    // Award the badge
    const badgeData = {
      name: 'Resilient Parent',
      badgeId: 'resilient-parent',
      description: 'Recognize parents who recover and grow through challenges',
      earnedAt: new Date(),
      category: 'resilience',
      icon: '💪',
      message: 'You rise, your family rises.'
    };

    if (!user.badges) {
      user.badges = [];
    }
    user.badges.push(badgeData);
    await user.save();

    // Create notification
    await Notification.create({
      userId,
      type: 'badge_earned',
      title: '🎉 Resilient Parent Badge Earned!',
      message: 'Congratulations! You\'ve successfully completed all resilience activities and collected your badge. You rise, your family rises.',
      metadata: {
        badgeId: 'resilient-parent',
        badgeName: 'Resilient Parent',
        gamesCompleted: gamesStatus.completedCount
      }
    });

    return {
      success: true,
      badgeEarned: true,
      alreadyEarned: false,
      badge: badgeData,
      gamesStatus,
      message: 'Badge collected successfully!'
    };
  } catch (error) {
    console.error('Error collecting Resilient Parent Badge:', error);
    return {
      success: false,
      badgeEarned: false,
      error: error.message || 'Failed to collect badge'
    };
  }
};

/**
 * API Endpoint: Get Resilient Parent Badge Status
 */
export const getResilientParentBadgeStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        error: 'Only parents can access parent badges'
      });
    }

    const status = await checkResilientParentBadgeStatus(userId);
    res.json({
      success: true,
      ...status
    });
  } catch (error) {
    console.error('Error getting Resilient Parent Badge status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badge status',
      message: error.message
    });
  }
};

/**
 * API Endpoint: Collect Resilient Parent Badge
 */
export const collectResilientParentBadgeEndpoint = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        error: 'Only parents can access parent badges'
      });
    }

    const result = await collectResilientParentBadge(userId);
    
    if (result.success) {
      res.json({
        success: true,
        ...result
      });
    } else {
      res.status(400).json({
        success: false,
        ...result
      });
    }
  } catch (error) {
    console.error('Error collecting Resilient Parent Badge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    });
  }
};

/**
 * Check if all required communication games (61, 62, 63, 64, 65) are completed
 */
export const checkPeacefulCommunicatorGamesCompleted = async (userId) => {
  try {
    const requiredGameIds = [
      'parent-education-61', // The Art of Listening
      'parent-education-62', // The Respectful "No"
      'parent-education-63', // Family Tone Mirror
      'parent-education-64', // Conflict Response Simulation
      'parent-education-65'  // Personal Boundary Builder
    ];

    const completedGames = await UnifiedGameProgress.find({
      userId,
      gameId: { $in: requiredGameIds },
      gameType: 'parent-education',
      fullyCompleted: true,
      userRole: 'parent'
    });

    const completedGameIds = new Set(completedGames.map(g => g.gameId));
    const allCompleted = requiredGameIds.every(id => completedGameIds.has(id));

    return {
      allCompleted,
      completedCount: completedGameIds.size,
      totalRequired: requiredGameIds.length,
      completedGameIds: Array.from(completedGameIds),
      missingGameIds: requiredGameIds.filter(id => !completedGameIds.has(id))
    };
  } catch (error) {
    console.error('Error checking peaceful communicator games:', error);
    return {
      allCompleted: false,
      completedCount: 0,
      totalRequired: 5,
      completedGameIds: [],
      missingGameIds: []
    };
  }
};

/**
 * Check Peaceful Communicator Badge status
 */
export const checkPeacefulCommunicatorBadgeStatus = async (userId) => {
  try {
    const user = await User.findById(userId).select('badges');
    if (!user) {
      return { hasBadge: false, newlyEarned: false, error: 'User not found' };
    }

    const existingBadge = user.badges?.find(
      badge => badge.name === 'Peaceful Communicator' || badge.badgeId === 'peaceful-communicator'
    );

    const hasBadge = !!existingBadge;
    
    // Check if games are completed
    const gamesStatus = await checkPeacefulCommunicatorGamesCompleted(userId);
    
    const gamesStatusList = await Promise.all(
      ['parent-education-61', 'parent-education-62', 'parent-education-63', 'parent-education-64', 'parent-education-65'].map(async (gameId) => {
        const progress = await UnifiedGameProgress.findOne({
          userId,
          gameId,
          gameType: 'parent-education',
          userRole: 'parent'
        });
        return {
          gameId,
          completed: progress?.fullyCompleted === true
        };
      })
    );

    return {
      hasBadge,
      newlyEarned: hasBadge && existingBadge?.earnedAt && 
        (Date.now() - new Date(existingBadge.earnedAt).getTime()) < 24 * 60 * 60 * 1000,
      allGamesCompleted: gamesStatus.allCompleted,
      gamesStatus: gamesStatusList,
      ...gamesStatus
    };
  } catch (error) {
    console.error('Error checking Peaceful Communicator Badge status:', error);
    return { hasBadge: false, newlyEarned: false, error: error.message };
  }
};

/**
 * Collect/Award Peaceful Communicator Badge
 * Only awards if all required games (61, 62, 63, 64, 65) are completed
 */
export const collectPeacefulCommunicatorBadge = async (userId) => {
  try {
    // Check if user already has the badge
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Peaceful Communicator' || badge.badgeId === 'peaceful-communicator'
    );

    if (existingBadge) {
      const gamesStatus = await checkPeacefulCommunicatorGamesCompleted(userId);
      return {
        success: true,
        badgeEarned: false,
        alreadyEarned: true,
        badge: existingBadge,
        gamesStatus,
        message: 'Badge already collected'
      };
    }

    // Check if all required games are completed
    const gamesStatus = await checkPeacefulCommunicatorGamesCompleted(userId);

    if (!gamesStatus.allCompleted) {
      return {
        success: false,
        badgeEarned: false,
        error: 'Complete all 5 communication activities first',
        gamesStatus
      };
    }

    // Award the badge
    const badgeData = {
      name: 'Peaceful Communicator',
      badgeId: 'peaceful-communicator',
      description: 'Reward parents who maintain emotional clarity and respect in dialogue',
      earnedAt: new Date(),
      category: 'communication',
      icon: '🗣️',
      message: 'Your calm words heal hearts.'
    };

    if (!user.badges) {
      user.badges = [];
    }
    user.badges.push(badgeData);
    await user.save();

    // Create notification
    await Notification.create({
      userId,
      type: 'badge_earned',
      title: '🎉 Peaceful Communicator Badge Earned!',
      message: 'Congratulations! You\'ve successfully completed all communication activities and collected your badge. Your calm words heal hearts.',
      metadata: {
        badgeId: 'peaceful-communicator',
        badgeName: 'Peaceful Communicator',
        gamesCompleted: gamesStatus.completedCount
      }
    });

    return {
      success: true,
      badgeEarned: true,
      alreadyEarned: false,
      badge: badgeData,
      gamesStatus,
      message: 'Badge collected successfully!'
    };
  } catch (error) {
    console.error('Error collecting Peaceful Communicator Badge:', error);
    return {
      success: false,
      badgeEarned: false,
      error: error.message || 'Failed to collect badge'
    };
  }
};

/**
 * API Endpoint: Get Peaceful Communicator Badge Status
 */
export const getPeacefulCommunicatorBadgeStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        error: 'Only parents can access parent badges'
      });
    }

    const status = await checkPeacefulCommunicatorBadgeStatus(userId);
    res.json({
      success: true,
      ...status
    });
  } catch (error) {
    console.error('Error getting Peaceful Communicator Badge status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badge status',
      message: error.message
    });
  }
};

/**
 * API Endpoint: Collect Peaceful Communicator Badge
 */
export const collectPeacefulCommunicatorBadgeEndpoint = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        error: 'Only parents can access parent badges'
      });
    }

    const result = await collectPeacefulCommunicatorBadge(userId);
    
    if (result.success) {
      res.json({
        success: true,
        ...result
      });
    } else {
      res.status(400).json({
        success: false,
        ...result
      });
    }
  } catch (error) {
    console.error('Error collecting Peaceful Communicator Badge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    });
  }
};

/**
 * Check if all required connection games (71, 73, 74, 75, 78) are completed
 */
export const checkConnectedParentGamesCompleted = async (userId) => {
  try {
    const requiredGameIds = [
      'parent-education-71', // The Support Circle
      'parent-education-73', // Connection Challenge
      'parent-education-74', // Gratitude to Others
      'parent-education-75', // Listening Partner Game
      'parent-education-78'  // Positive Parenting Circle
    ];

    const completedGames = await UnifiedGameProgress.find({
      userId,
      gameId: { $in: requiredGameIds },
      gameType: 'parent-education',
      fullyCompleted: true,
      userRole: 'parent'
    });

    const completedGameIds = new Set(completedGames.map(g => g.gameId));
    const allCompleted = requiredGameIds.every(id => completedGameIds.has(id));

    return {
      allCompleted,
      completedCount: completedGameIds.size,
      totalRequired: requiredGameIds.length,
      completedGameIds: Array.from(completedGameIds),
      missingGameIds: requiredGameIds.filter(id => !completedGameIds.has(id))
    };
  } catch (error) {
    console.error('Error checking connected parent games:', error);
    return {
      allCompleted: false,
      completedCount: 0,
      totalRequired: 5,
      completedGameIds: [],
      missingGameIds: []
    };
  }
};

/**
 * Check Connected Parent Badge status
 */
export const checkConnectedParentBadgeStatus = async (userId) => {
  try {
    const user = await User.findById(userId).select('badges');
    if (!user) {
      return { hasBadge: false, newlyEarned: false, error: 'User not found' };
    }

    const existingBadge = user.badges?.find(
      badge => badge.name === 'Connected Parent' || badge.badgeId === 'connected-parent'
    );

    const hasBadge = !!existingBadge;
    
    // Check if games are completed
    const gamesStatus = await checkConnectedParentGamesCompleted(userId);
    
    const gamesStatusList = await Promise.all(
      ['parent-education-71', 'parent-education-73', 'parent-education-74', 'parent-education-75', 'parent-education-78'].map(async (gameId) => {
        const progress = await UnifiedGameProgress.findOne({
          userId,
          gameId,
          gameType: 'parent-education',
          userRole: 'parent'
        });
        return {
          gameId,
          completed: progress?.fullyCompleted === true
        };
      })
    );

    return {
      hasBadge,
      newlyEarned: hasBadge && existingBadge?.earnedAt && 
        (Date.now() - new Date(existingBadge.earnedAt).getTime()) < 24 * 60 * 60 * 1000,
      allGamesCompleted: gamesStatus.allCompleted,
      gamesStatus: gamesStatusList,
      ...gamesStatus
    };
  } catch (error) {
    console.error('Error checking Connected Parent Badge status:', error);
    return { hasBadge: false, newlyEarned: false, error: error.message };
  }
};

/**
 * Collect/Award Connected Parent Badge
 * Only awards if all required games (71, 73, 74, 75, 78) are completed
 */
export const collectConnectedParentBadge = async (userId) => {
  try {
    // Check if user already has the badge
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Connected Parent' || badge.badgeId === 'connected-parent'
    );

    if (existingBadge) {
      const gamesStatus = await checkConnectedParentGamesCompleted(userId);
      return {
        success: true,
        badgeEarned: false,
        alreadyEarned: true,
        badge: existingBadge,
        gamesStatus,
        message: 'Badge already collected'
      };
    }

    // Check if all required games are completed
    const gamesStatus = await checkConnectedParentGamesCompleted(userId);

    if (!gamesStatus.allCompleted) {
      return {
        success: false,
        badgeEarned: false,
        error: 'Complete all 5 connection activities first',
        gamesStatus
      };
    }

    // Award the badge
    const badgeData = {
      name: 'Connected Parent',
      badgeId: 'connected-parent',
      description: 'Celebrate consistent efforts to nurture supportive relationships',
      earnedAt: new Date(),
      category: 'connection',
      icon: '👥',
      message: 'Connection is your family\'s invisible strength.'
    };

    if (!user.badges) {
      user.badges = [];
    }
    user.badges.push(badgeData);
    await user.save();

    // Create notification
    await Notification.create({
      userId,
      type: 'badge_earned',
      title: '🎉 Connected Parent Badge Earned!',
      message: 'Congratulations! You\'ve successfully completed all connection activities and collected your badge. Connection is your family\'s invisible strength.',
      metadata: {
        badgeId: 'connected-parent',
        badgeName: 'Connected Parent',
        gamesCompleted: gamesStatus.completedCount
      }
    });

    return {
      success: true,
      badgeEarned: true,
      alreadyEarned: false,
      badge: badgeData,
      gamesStatus,
      message: 'Badge collected successfully!'
    };
  } catch (error) {
    console.error('Error collecting Connected Parent Badge:', error);
    return {
      success: false,
      badgeEarned: false,
      error: error.message || 'Failed to collect badge'
    };
  }
};

/**
 * API Endpoint: Get Connected Parent Badge Status
 */
export const getConnectedParentBadgeStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        error: 'Only parents can access parent badges'
      });
    }

    const status = await checkConnectedParentBadgeStatus(userId);
    res.json({
      success: true,
      ...status
    });
  } catch (error) {
    console.error('Error getting Connected Parent Badge status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badge status',
      message: error.message
    });
  }
};

/**
 * API Endpoint: Collect Connected Parent Badge
 */
export const collectConnectedParentBadgeEndpoint = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        error: 'Only parents can access parent badges'
      });
    }

    const result = await collectConnectedParentBadge(userId);
    
    if (result.success) {
      res.json({
        success: true,
        ...result
      });
    } else {
      res.status(400).json({
        success: false,
        ...result
      });
    }
  } catch (error) {
    console.error('Error collecting Connected Parent Badge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    });
  }
};

/**
 * Check if all required purpose games (80, 81, 83, 84, 86) are completed
 */
export const checkPurposefulParentGamesCompleted = async (userId) => {
  try {
    const requiredGameIds = [
      'parent-education-81', // Why I Parent
      'parent-education-82', // Legacy Reflection
      'parent-education-84', // Family Values Map
      'parent-education-85', // My Parenting Mantra
      'parent-education-87'  // Family Vision Board
    ];

    const completedGames = await UnifiedGameProgress.find({
      userId,
      gameId: { $in: requiredGameIds },
      gameType: 'parent-education',
      fullyCompleted: true,
      userRole: 'parent'
    });

    const completedGameIds = new Set(completedGames.map(g => g.gameId));
    const allCompleted = requiredGameIds.every(id => completedGameIds.has(id));

    return {
      allCompleted,
      completedCount: completedGameIds.size,
      totalRequired: requiredGameIds.length,
      completedGameIds: Array.from(completedGameIds),
      missingGameIds: requiredGameIds.filter(id => !completedGameIds.has(id))
    };
  } catch (error) {
    console.error('Error checking purposeful parent games:', error);
    return {
      allCompleted: false,
      completedCount: 0,
      totalRequired: 5,
      completedGameIds: [],
      missingGameIds: []
    };
  }
};

/**
 * Check Purposeful Parent Badge status
 */
export const checkPurposefulParentBadgeStatus = async (userId) => {
  try {
    const user = await User.findById(userId).select('badges');
    if (!user) {
      return { hasBadge: false, newlyEarned: false, error: 'User not found' };
    }

    const existingBadge = user.badges?.find(
      badge => badge.name === 'Purposeful Parent' || badge.badgeId === 'purposeful-parent'
    );

    const hasBadge = !!existingBadge;
    
    // Check if games are completed
    const gamesStatus = await checkPurposefulParentGamesCompleted(userId);
    
    const gamesStatusList = await Promise.all(
      ['parent-education-81', 'parent-education-82', 'parent-education-84', 'parent-education-85', 'parent-education-87'].map(async (gameId) => {
        const progress = await UnifiedGameProgress.findOne({
          userId,
          gameId,
          gameType: 'parent-education',
          userRole: 'parent'
        });
        return {
          gameId,
          completed: progress?.fullyCompleted === true
        };
      })
    );

    return {
      hasBadge,
      newlyEarned: hasBadge && existingBadge?.earnedAt && 
        (Date.now() - new Date(existingBadge.earnedAt).getTime()) < 24 * 60 * 60 * 1000,
      allGamesCompleted: gamesStatus.allCompleted,
      gamesStatus: gamesStatusList,
      ...gamesStatus
    };
  } catch (error) {
    console.error('Error checking Purposeful Parent Badge status:', error);
    return { hasBadge: false, newlyEarned: false, error: error.message };
  }
};

/**
 * Collect/Award Purposeful Parent Badge
 * Only awards if all required games (81, 82, 84, 85, 87) are completed
 */
export const collectPurposefulParentBadge = async (userId) => {
  try {
    // Check if user already has the badge
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Purposeful Parent' || badge.badgeId === 'purposeful-parent'
    );

    if (existingBadge) {
      const gamesStatus = await checkPurposefulParentGamesCompleted(userId);
      return {
        success: true,
        badgeEarned: false,
        alreadyEarned: true,
        badge: existingBadge,
        gamesStatus,
        message: 'Badge already collected'
      };
    }

    // Check if all required games are completed
    const gamesStatus = await checkPurposefulParentGamesCompleted(userId);

    if (!gamesStatus.allCompleted) {
      return {
        success: false,
        badgeEarned: false,
        error: 'Complete all 5 purpose activities first',
        gamesStatus
      };
    }

    // Award the badge
    const badgeData = {
      name: 'Purposeful Parent',
      badgeId: 'purposeful-parent',
      description: 'Celebrate parents who raise families guided by love and intention',
      earnedAt: new Date(),
      category: 'purpose',
      icon: '🎯',
      message: 'Your purpose becomes your child\'s compass.'
    };

    if (!user.badges) {
      user.badges = [];
    }
    user.badges.push(badgeData);
    await user.save();

    // Create notification
    await Notification.create({
      userId,
      type: 'badge_earned',
      title: '🎉 Purposeful Parent Badge Earned!',
      message: 'Congratulations! You\'ve successfully completed all purpose activities and collected your badge. Your purpose becomes your child\'s compass.',
      metadata: {
        badgeId: 'purposeful-parent',
        badgeName: 'Purposeful Parent',
        gamesCompleted: gamesStatus.completedCount
      }
    });

    return {
      success: true,
      badgeEarned: true,
      alreadyEarned: false,
      badge: badgeData,
      gamesStatus,
      message: 'Badge collected successfully!'
    };
  } catch (error) {
    console.error('Error collecting Purposeful Parent Badge:', error);
    return {
      success: false,
      badgeEarned: false,
      error: error.message || 'Failed to collect badge'
    };
  }
};

/**
 * API Endpoint: Get Purposeful Parent Badge Status
 */
export const getPurposefulParentBadgeStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        error: 'Only parents can access parent badges'
      });
    }

    const status = await checkPurposefulParentBadgeStatus(userId);
    res.json({
      success: true,
      ...status
    });
  } catch (error) {
    console.error('Error getting Purposeful Parent Badge status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badge status',
      message: error.message
    });
  }
};

/**
 * API Endpoint: Collect Purposeful Parent Badge
 */
export const collectPurposefulParentBadgeEndpoint = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        error: 'Only parents can access parent badges'
      });
    }

    const result = await collectPurposefulParentBadge(userId);
    
    if (result.success) {
      res.json({
        success: true,
        ...result
      });
    } else {
      res.status(400).json({
        success: false,
        ...result
      });
    }
  } catch (error) {
    console.error('Error collecting Purposeful Parent Badge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    });
  }
};

/**
 * Check if all required self-care champion games are completed
 */
export const checkSelfCareChampionGamesCompleted = async (userId) => {
  try {
    const requiredGameIds = [
      'parent-education-94', // Evening Log-Off Ritual
      'parent-education-95', // Nature Reconnect
      'parent-education-96', // Self-Care Inventory
      'parent-education-97', // Morning Nourish Routine
      'parent-education-98'  // Silence Challenge
    ];

    const completedGames = await UnifiedGameProgress.find({
      userId,
      gameId: { $in: requiredGameIds },
      gameType: 'parent-education',
      fullyCompleted: true,
      userRole: 'parent'
    });

    const completedGameIds = new Set(completedGames.map(g => g.gameId));
    const allCompleted = requiredGameIds.every(id => completedGameIds.has(id));

    return {
      allCompleted,
      completedCount: completedGameIds.size,
      totalRequired: requiredGameIds.length,
      completedGameIds: Array.from(completedGameIds),
      missingGameIds: requiredGameIds.filter(id => !completedGameIds.has(id))
    };
  } catch (error) {
    console.error('Error checking self-care champion games:', error);
    return {
      allCompleted: false,
      completedCount: 0,
      totalRequired: 5,
      completedGameIds: [],
      missingGameIds: []
    };
  }
};

/**
 * Check Self-Care Champion Badge status
 */
export const checkSelfCareChampionBadgeStatus = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { hasBadge: false, newlyEarned: false };
    }

    // Check if badge already exists
    const existingBadge = user.badges?.find(
      badge => badge.name === 'Self-Care Champion' || badge.badgeId === 'self-care-champion'
    );

    const hasBadge = !!existingBadge;

    const gamesStatus = await checkSelfCareChampionGamesCompleted(userId);
    
    const gamesStatusList = await Promise.all(
      ['parent-education-94', 'parent-education-95', 'parent-education-96', 'parent-education-97', 'parent-education-98'].map(async (gameId) => {
        const progress = await UnifiedGameProgress.findOne({
          userId,
          gameId,
          gameType: 'parent-education',
          userRole: 'parent'
        });
        return {
          gameId,
          completed: progress?.fullyCompleted === true
        };
      })
    );

    return {
      hasBadge,
      newlyEarned: hasBadge && existingBadge?.earnedAt && 
        (Date.now() - new Date(existingBadge.earnedAt).getTime()) < 24 * 60 * 60 * 1000,
      allGamesCompleted: gamesStatus.allCompleted,
      gamesStatus: gamesStatusList,
      ...gamesStatus
    };
  } catch (error) {
    console.error('Error checking Self-Care Champion Badge status:', error);
    return { hasBadge: false, newlyEarned: false, error: error.message };
  }
};

/**
 * Collect/Award Self-Care Champion Badge
 * Only awards if all required self-care games are completed
 */
export const collectSelfCareChampionBadge = async (userId) => {
  try {
    // Check if user already has the badge
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        badgeEarned: false,
        error: 'User not found'
      };
    }

    const existingBadge = user.badges?.find(
      badge => badge.name === 'Self-Care Champion' || badge.badgeId === 'self-care-champion'
    );

    if (existingBadge) {
      const gamesStatus = await checkSelfCareChampionGamesCompleted(userId);
      return {
        success: true,
        badgeEarned: false,
        alreadyEarned: true,
        badge: existingBadge,
        gamesStatus,
        message: 'Badge already collected'
      };
    }

    // Check if all required games are completed
    const gamesStatus = await checkSelfCareChampionGamesCompleted(userId);

    if (!gamesStatus.allCompleted) {
      return {
        success: false,
        badgeEarned: false,
        error: 'Complete all 5 self-care activities first',
        gamesStatus
      };
    }

    // Award the badge
    const badgeData = {
      name: 'Self-Care Champion',
      badgeId: 'self-care-champion',
      description: 'Reward parents who consistently model self-care and digital discipline',
      earnedAt: new Date(),
      category: 'self-care',
      icon: '🛀',
      message: 'When you care for yourself, you teach your child how to live with peace.'
    };

    if (!user.badges) {
      user.badges = [];
    }
    user.badges.push(badgeData);
    await user.save();

    // Create notification
    await Notification.create({
      userId,
      type: 'badge_earned',
      title: '🎉 Self-Care Champion Badge Earned!',
      message: 'When you care for yourself, you teach your child how to live with peace.',
      metadata: {
        badgeId: 'self-care-champion',
        badgeName: 'Self-Care Champion'
      }
    });

    return {
      success: true,
      badgeEarned: true,
      alreadyEarned: false,
      badge: badgeData,
      gamesStatus,
      message: 'Badge collected successfully!'
    };
  } catch (error) {
    console.error('Error collecting Self-Care Champion Badge:', error);
    return {
      success: false,
      badgeEarned: false,
      error: error.message || 'Failed to collect badge'
    };
  }
};

/**
 * Get Self-Care Champion Badge status (endpoint)
 */
export const getSelfCareChampionBadgeStatusEndpoint = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Validate parent role
    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        error: 'Only parents can access parent badges'
      });
    }
    
    const status = await checkSelfCareChampionBadgeStatus(userId);
    res.json({
      success: true,
      ...status
    });
  } catch (error) {
    console.error('Error getting Self-Care Champion Badge status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badge status',
      message: error.message
    });
  }
};

/**
 * Collect Self-Care Champion Badge (endpoint)
 */
export const collectSelfCareChampionBadgeEndpoint = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Validate parent role
    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        error: 'Only parents can collect parent badges'
      });
    }
    
    const result = await collectSelfCareChampionBadge(userId);
    
    if (result.success) {
      res.json({
        success: true,
        ...result
      });
    } else {
      res.status(400).json({
        success: false,
        ...result
      });
    }
  } catch (error) {
    console.error('Error collecting Self-Care Champion Badge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect badge',
      message: error.message
    });
  }
};

export const getParentBadges = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate parent role
    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        error: 'Only parents can access parent badges'
      });
    }

    const user = await User.findById(userId).select('badges');
    const badges = user?.badges || [];

    // Also check all badge statuses
    const selfAwareBadgeStatus = await checkSelfAwareBadgeStatus(userId);
    const calmParentBadgeStatus = await checkCalmParentBadgeStatus(userId);
    const compassionateParentBadgeStatus = await checkCompassionateParentBadgeStatus(userId);
    const presentParentBadgeStatus = await checkPresentParentBadgeStatus(userId);
    const mindfulParentBadgeStatus = await checkMindfulParentBadgeStatus(userId);
    const resilientParentBadgeStatus = await checkResilientParentBadgeStatus(userId);
    const peacefulCommunicatorBadgeStatus = await checkPeacefulCommunicatorBadgeStatus(userId);
    const connectedParentBadgeStatus = await checkConnectedParentBadgeStatus(userId);
    const purposefulParentBadgeStatus = await checkPurposefulParentBadgeStatus(userId);
    const selfCareChampionBadgeStatus = await checkSelfCareChampionBadgeStatus(userId);

    res.json({
      success: true,
      badges,
      selfAwareBadge: selfAwareBadgeStatus,
      calmParentBadge: calmParentBadgeStatus,
      compassionateParentBadge: compassionateParentBadgeStatus,
      presentParentBadge: presentParentBadgeStatus,
      mindfulParentBadge: mindfulParentBadgeStatus,
      resilientParentBadge: resilientParentBadgeStatus,
      peacefulCommunicatorBadge: peacefulCommunicatorBadgeStatus,
      connectedParentBadge: connectedParentBadgeStatus,
      purposefulParentBadge: purposefulParentBadgeStatus,
      selfCareChampionBadge: selfCareChampionBadgeStatus
    });
  } catch (error) {
    console.error('Error getting parent badges:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badges',
      message: error.message
    });
  }
};

