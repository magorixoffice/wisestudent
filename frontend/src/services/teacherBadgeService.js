import api from '../utils/api';

/**
 * Teacher Badge Service
 * Handles badge checking and retrieval for teachers
 */
class TeacherBadgeService {
  /**
   * Get Self-Aware Teacher Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getSelfAwareBadgeStatus() {
    try {
      const response = await api.get('/api/school/teacher/badge/self-aware-teacher');
      return response.data;
    } catch (error) {
      console.error('Failed to get Self-Aware Teacher Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Get Calm Teacher Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getCalmBadgeStatus() {
    try {
      const response = await api.get('/api/school/teacher/badge/calm-teacher');
      return response.data;
    } catch (error) {
      console.error('Failed to get Calm Teacher Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Get Compassion Balance Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getCompassionBalanceBadgeStatus() {
    try {
      const response = await api.get('/api/school/teacher/badge/compassion-balance');
      return response.data;
    } catch (error) {
      console.error('Failed to get Compassion Balance Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Get Balanced Life Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getBalancedLifeBadgeStatus() {
    try {
      const response = await api.get('/api/school/teacher/badge/balanced-life');
      return response.data;
    } catch (error) {
      console.error('Failed to get Balanced Life Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Get Mindful Mastery Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getMindfulMasteryBadgeStatus() {
    try {
      const response = await api.get('/api/school/teacher/badge/mindful-mastery');
      return response.data;
    } catch (error) {
      console.error('Failed to get Mindful Mastery Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Get all teacher badges
   * @returns {Promise<Object>} All badges
   */
  async getAllBadges() {
    try {
      const response = await api.get('/api/school/teacher/badges');
      return response.data;
    } catch (error) {
      console.error('Failed to get teacher badges:', error);
      return {
        success: false,
        badges: [],
        selfAwareBadge: {
          hasBadge: false,
          newlyEarned: false
        },
        calmBadge: {
          hasBadge: false,
          newlyEarned: false
        },
        compassionBalanceBadge: {
          hasBadge: false,
          newlyEarned: false
        }
      };
    }
  }
}

export default new TeacherBadgeService();

