import UnifiedGameProgress from '../models/UnifiedGameProgress.js';

const pillarNameMap = {
  ai: "AI for All",
  brain: "Brain Teasers",
  finance: "Finance Literacy",
  financial: "Finance Literacy",
  mental: "Mental Health",
  educational: "Educational",
  uvls: "UVLS",
  dcos: "Digital Citizenship & Online Safety",
  moral: "Moral Values",
  ehe: "Entrepreneurship & Higher Education",
  crgc: "Civic Responsibility & Global Citizenship",
  "civic-responsibility": "Civic Responsibility & Global Citizenship",
  "health-male": "Health - Male",
  "health-female": "Health - Female",
  sustainability: "Sustainability"
};

const buildBadgeAchievement = (game) => {
  const earnedAt = game.firstCompletedAt || game.updatedAt || new Date();
  const gameId = game.gameId || "";
  const ageGroup = gameId.includes("kids")
    ? "Kids"
    : gameId.includes("teen")
      ? "Teen"
      : "Unknown";

  return {
    id: game._id,
    badgeName: game.badgeName || "Badge Earned",
    badgeImage: game.badgeImage || null,
    earnedAt,
    gameId: game.gameId,
    gameType: game.gameType,
    ageGroup,
    pillarName: pillarNameMap[game.gameType] || "Unknown"
  };
};

/**
 * Socket handler for achievement real-time interactions
 * Enables students to receive real-time achievement updates
 */
export const setupAchievementSocket = (io, socket, user) => {
  // Student subscribe to achievements
  socket.on('student:achievements:subscribe', async ({ studentId }) => {
    try {
      // Verify student permissions
      if (user._id.toString() !== studentId) {
        socket.emit('student:achievements:error', { message: 'Unauthorized access' });
        return;
      }

      console.log(`🏆 Student ${studentId} subscribed to achievement updates`);
      
      // Join student-specific room for achievement updates
      socket.join(`student-achievements-${studentId}`);
      
      // Send initial achievement timeline (badge awards)
      const badgeProgress = await UnifiedGameProgress.find({
        userId: studentId,
        badgeAwarded: true
      }).select("gameId gameType badgeName badgeImage updatedAt firstCompletedAt");

      const achievements = badgeProgress.map(buildBadgeAchievement);

      // Sort by date (most recent first)
      achievements.sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt));

      socket.emit('student:achievements:timeline', {
        achievements: achievements.slice(0, 10), // Return last 10 achievements
        totalAchievements: achievements.length
      });
      
    } catch (err) {
      console.error('❌ Error in student:achievements:subscribe:', err);
      socket.emit('student:achievements:error', { message: err.message });
    }
  });

  // Cleanup when socket disconnects
  socket.on('disconnect', () => {
    if (user.role === 'student') {
      socket.leave(`student-achievements-${user._id}`);
    }
  });
};

/**
 * Helper function to emit achievement earned event
 * Called from game controllers when achievements are earned
 */
export const emitAchievementEarned = (io, userId, achievement, gameInfo = {}) => {
  const achievementData = {
    userId: userId.toString(),
    achievement: {
      id: achievement._id || achievement.id,
      badgeName: achievement.badgeName || achievement.name || "Badge Earned",
      badgeImage: achievement.badgeImage || achievement.icon || null,
      earnedAt: achievement.earnedAt || new Date(),
      gameId: gameInfo.gameId || achievement.gameId || null,
      gameType: gameInfo.gameType || achievement.gameType || null
    },
    timestamp: new Date()
  };

  // Emit to the specific user's room
  io.to(`student-achievements-${userId}`).emit('achievement:earned', achievementData);
  
  // Also emit to the user's general room for dashboard updates
  io.to(userId.toString()).emit('achievement:earned', achievementData);
  
  console.log(`dYZ% Achievement earned event emitted for user ${userId}`);
};

export const emitBadgeEarned = (io, userId, gameProgress) => {
  const achievement = buildBadgeAchievement(gameProgress);
  const payload = {
    userId: userId.toString(),
    achievement,
    timestamp: new Date()
  };

  io.to(`student-achievements-${userId}`).emit('achievement:earned', payload);
  io.to(userId.toString()).emit('achievement:earned', payload);
};
