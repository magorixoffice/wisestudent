import api from '../utils/api';
import { toast } from 'react-toastify';

/**
 * Unified Game Completion Service
 * Handles heal coins for all game types with duplicate prevention
 */

class GameCompletionService {
  constructor() {
    this.completedGames = new Map(); // Cache for completed games
  }

  /**
   * Complete a game or game level and award heal coins
   * @param {Object} gameData - Game completion data
   * @param {string} gameData.gameId - Unique game identifier (e.g., 'spot-the-pattern', 'cat-or-dog')
   * @param {string} gameData.gameType - Game category ('ai', 'brain', 'finance', 'mental', 'financial')
   * @param {number} gameData.score - Current score/points earned
   * @param {number} gameData.maxScore - Maximum possible score for the game
   * @param {number} gameData.levelsCompleted - Number of levels/questions completed
   * @param {number} gameData.totalLevels - Total levels/questions in the game
   * @param {number} gameData.timePlayed - Time played in seconds
   * @param {Array} gameData.achievements - Any achievements unlocked
   * @param {boolean} gameData.isFullCompletion - Whether user completed entire game
   * @param {number} gameData.coinsPerLevel - Heal coins per level/question (optional)
   * @returns {Promise<Object>} - Completion result with coins earned
   */
  async completeGame(gameData) {
    try {
      const {
        gameId,
        gameType = 'ai',
        score = 0,
        maxScore = 100,
        levelsCompleted = 1,
        totalLevels = 1,
        timePlayed = 0,
        achievements = [],
        isFullCompletion = true,
        coinsPerLevel = null,
        totalCoins = null, // Total coins from game card for full completion
        totalXp = null, // Total XP from game card for full completion
        badgeName = null,
        badgeImage = null,
        isBadgeGame = false
      } = gameData;

      // Validate required data
      if (!gameId) {
        throw new Error('Game ID is required');
      }

      // Get current completion status from backend
      const progressResponse = await api.get(`/api/game/progress/${gameId}`);
      const currentProgress = progressResponse.data || {
        levelsCompleted: 0,
        totalCoinsEarned: 0,
        fullyCompleted: false,
        replayUnlocked: false
      };

      // Check if this is a replay attempt
      const isReplayAttempt = gameData.isReplay === true || (currentProgress.fullyCompleted && currentProgress.replayUnlocked === true);

      // Calculate new levels completed (only count new ones)
      const newLevelsCompleted = Math.max(0, levelsCompleted - currentProgress.levelsCompleted);
      
      // Always call the backend to handle game completion logic
      // The backend will determine if coins should be awarded based on:
      // - Whether it's a first-time completion
      // - Whether it's a replay
      // - The totalCoins value provided

      // Send completion data to backend
      // IMPORTANT: For replay attempts, we MUST call the backend to lock the game again
      console.log('📤 Sending game completion to backend:', {
        gameId,
        isReplayAttempt: isReplayAttempt,
        isReplayFlag: gameData.isReplay,
        currentReplayUnlocked: currentProgress.replayUnlocked,
        fullyCompleted: currentProgress.fullyCompleted
      });
      
      // Log the values being sent to backend
      console.log(`📤 Sending game completion to backend API:`, {
        gameId,
        totalCoins,
        coinsPerLevel,
        totalLevels,
        levelsCompleted,
        totalXp,
        isFullCompletion,
        isReplay: isReplayAttempt,
        score,
        maxScore,
        currentProgress: {
          fullyCompleted: currentProgress.fullyCompleted,
          replayUnlocked: currentProgress.replayUnlocked,
          levelsCompleted: currentProgress.levelsCompleted,
          totalCoinsEarned: currentProgress.totalCoinsEarned
        }
      });
      
      const response = await api.post(`/api/game/complete-unified/${gameId}`, {
        gameType,
        score,
        maxScore,
        levelsCompleted,
        totalLevels,
        newLevelsCompleted,
        timePlayed,
        achievements,
        isFullCompletion,
        coinsPerLevel,
        totalCoins, // Total coins from game card (should be 5)
        totalXp, // Total XP from game card (should be 10)
        badgeName,
        badgeImage,
        isBadgeGame,
        previousProgress: currentProgress,
        isReplay: isReplayAttempt // Use the computed isReplayAttempt value, not gameData.isReplay
      });

      const result = response.data;
      
      // Log the result from backend
      console.log(`📥 Received game completion result from backend:`, {
        gameId,
        coinsEarned: result.coinsEarned,
        xpEarned: result.xpEarned,
        fullyCompleted: result.fullyCompleted,
        allAnswersCorrect: result.allAnswersCorrect,
        isReplay: result.isReplay,
        replayUnlocked: result.replayUnlocked
      });

      // Update local cache
      this.completedGames.set(gameId, {
        levelsCompleted: result.totalLevelsCompleted,
        fullyCompleted: result.fullyCompleted,
        totalCoinsEarned: result.totalCoinsEarned,
        lastCompletedAt: new Date(),
        replayUnlocked: result.replayUnlocked !== undefined ? result.replayUnlocked : false
      });

      // Show success notification
      if (result.coinsEarned > 0) {
        toast.success(`🎮 +${result.coinsEarned} HealCoins earned!`);
      } else if (result.isReplay) {
        // Show message for replay completion
        toast.success(result.message || 'Game replayed! Pay the replay cost to unlock replay again.', {
          duration: 4000
        });
      }

      return {
        success: true,
        coinsEarned: result.coinsEarned,
        totalCoinsEarned: result.totalCoinsEarned,
        newLevelsCompleted: result.newLevelsCompleted,
        totalLevelsCompleted: result.totalLevelsCompleted,
        newBalance: result.newBalance,
        streak: result.streak || 1,
        achievements: result.achievements || [],
        canReplay: result.replayUnlocked !== undefined ? result.replayUnlocked : false,
        isReplay: result.isReplay || false,
        replayUnlocked: result.replayUnlocked !== undefined ? result.replayUnlocked : false,
        allAnswersCorrect: result.allAnswersCorrect !== undefined ? result.allAnswersCorrect : false,
        fullyCompleted: result.fullyCompleted !== undefined ? result.fullyCompleted : false,
        badgeEarned: result.badgeEarned === true,
        badgeAlreadyEarned: result.badgeAlreadyEarned === true,
        badgeName: result.badgeName || badgeName || null,
        badgeImage: result.badgeImage || badgeImage || null,
        isBadgeGame: result.isBadgeGame === true || isBadgeGame === true,
        message: result.message || 'Game completed successfully!'
      };

    } catch (error) {
      console.error('❌ Game completion error:', error);
      toast.error(error.response?.data?.error || 'Failed to save game progress');
      
      return {
        success: false,
        error: error.message,
        coinsEarned: 0
      };
    }
  }

  /**
   * Update game progress without awarding new coins
   */
  async updateGameProgress(gameId, progressData) {
    try {
      await api.put(`/api/game/progress/${gameId}`, progressData);
    } catch (error) {
      console.error('❌ Failed to update game progress:', error);
    }
  }

  /**
   * Get current game progress
   */
  async getGameProgress(gameId) {
    try {
      const response = await api.get(`/api/game/progress/${gameId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get game progress:', error);
      return null;
    }
  }

  /**
   * Get batch game progress for a category (e.g., finance-kids)
   * Returns an object keyed by gameId with all progress data
   */
  async getBatchGameProgress(categoryPrefix) {
    try {
      const response = await api.get(`/api/game/progress/batch/${categoryPrefix}`);
      return response.data || {}; // Returns object keyed by gameId
    } catch (error) {
      console.error(`❌ Failed to get batch game progress for ${categoryPrefix}:`, error);
      return {}; // Return empty object on error
    }
  }

  /**
   * Get all completed games for current user
   */
  async getCompletedGames() {
    try {
      const response = await api.get('/api/game/completed-games');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get completed games:', error);
      return [];
    }
  }

  /**
   * Check if a specific game has been completed
   */
  async isGameCompleted(gameId) {
    try {
      const progress = await this.getGameProgress(gameId);
      return progress?.fullyCompleted || false;
    } catch {
      return false;
    }
  }

  /**
   * Complete individual level/question within a game
   * Useful for games with multiple questions
   */
  async completeLevel(gameId, levelData) {
    const {
      levelNumber,
      levelScore,
      maxLevelScore,
      coinsForLevel = 5
    } = levelData;

    return this.completeGame({
      gameId,
      score: levelScore,
      maxScore: maxLevelScore,
      levelsCompleted: levelNumber,
      totalLevels: levelNumber, // Will be updated when full game is complete
      isFullCompletion: false,
      coinsPerLevel: coinsForLevel
    });
  }

  /**
   * Mark game as fully completed
   */
  async markGameFullyCompleted(gameId, finalData = {}) {
    return this.completeGame({
      ...finalData,
      gameId,
      isFullCompletion: true
    });
  }
}

// Create singleton instance
const gameCompletionService = new GameCompletionService();

// Export both the class and instance
export { GameCompletionService };
export default gameCompletionService;
