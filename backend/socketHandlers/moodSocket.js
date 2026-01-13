import MoodLog from '../models/MoodLog.js';
import UserProgress from '../models/UserProgress.js';
import XPLog from '../models/XPLog.js';

/**
 * Socket handler for mood tracking real-time interactions
 * Enables students to receive real-time mood updates and analytics
 */
export const setupMoodSocket = (io, socket, user) => {
  // Student subscribe to mood updates
  socket.on('student:mood:subscribe', async ({ studentId }) => {
    try {
      // Verify student permissions
      if (user._id.toString() !== studentId) {
        socket.emit('student:mood:error', { message: 'Unauthorized access' });
        return;
      }

      
      // Join student-specific room for mood updates
      socket.join(`student-mood-${studentId}`);
      
      // Send initial mood data
      const recentMoods = await MoodLog.find({ userId: studentId })
        .sort({ date: -1 })
        .limit(10);
      
      // Calculate streak
      const streak = await calculateMoodStreak(studentId);
      
      // Get today's mood
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayMood = await MoodLog.findOne({
        userId: studentId,
        date: { $gte: today, $lt: tomorrow }
      }).sort({ date: -1 });
      
      const totalLogs = await MoodLog.countDocuments({ userId: studentId });
      
      socket.emit('student:mood:data', {
        recentMoods,
        streak,
        todayMood: todayMood || null,
        totalLogs
      });
      
    } catch (err) {
      console.error('❌ Error in student:mood:subscribe:', err);
      socket.emit('student:mood:error', { message: err.message });
    }
  });

  // Cleanup when socket disconnects
  socket.on('disconnect', () => {
    if (user.role === 'student') {
      socket.leave(`student-mood-${user._id}`);
    }
  });
};

/**
 * Helper function to calculate mood streak
 * Exported for use in controllers
 */
export const calculateMoodStreak = async (userId) => {
  try {
    // Get all mood logs (we need to check all to find unique days)
    const moods = await MoodLog.find({ userId })
      .sort({ date: -1 });
    
    if (!moods.length) return 0;
    
    // Get unique dates (one mood per day counts for streak)
    const dateSet = new Set();
    moods.forEach(m => {
      const moodDate = new Date(m.date);
      moodDate.setHours(0, 0, 0, 0);
      dateSet.add(moodDate.getTime());
    });
    
    // Convert to sorted array (most recent first)
    const sortedDates = Array.from(dateSet).sort((a, b) => b - a);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    
    // Check if we have a log for today or yesterday
    const hasToday = sortedDates[0] === todayTime;
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayTime = yesterday.getTime();
    const hasYesterday = sortedDates[0] === yesterdayTime || sortedDates.includes(yesterdayTime);
    
    // If no log for today or yesterday, streak is 0
    if (!hasToday && !hasYesterday) return 0;
    
    // Start counting from today or yesterday
    let streak = 0;
    let checkDate = hasToday ? new Date(today) : new Date(yesterday);
    
    // Count consecutive days going backwards
    // Use the existing dateSet for O(1) lookup (already created above)
    
    // Check consecutive days starting from checkDate
    while (true) {
      const checkTime = checkDate.getTime();
      
      if (dateSet.has(checkTime)) {
        streak++;
        // Move to previous day
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // Streak broken - missing day found
        break;
      }
      
      // Safety check to prevent infinite loop
      if (streak > 365) break;
    }
    
    return streak;
  } catch (err) {
    console.error('Error calculating mood streak:', err);
    return 0;
  }
};

/**
 * Helper function to emit mood logged event
 * Called from mood controller when a mood is logged
 */
export const emitMoodLogged = async (io, userId, moodData) => {
  try {
    // Calculate updated streak
    const streak = await calculateMoodStreak(userId);
    
    // Get total logs count
    const totalLogs = await MoodLog.countDocuments({ userId });
    
    // Get today's mood
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayMood = await MoodLog.findOne({
      userId,
      date: { $gte: today, $lt: tomorrow }
    }).sort({ date: -1 });
    
    const moodEventData = {
      userId: userId.toString(),
      mood: moodData,
      streak,
      totalLogs,
      todayMood: todayMood || null,
      timestamp: new Date()
    };

    // Emit to the specific user's room
    io.to(`student-mood-${userId}`).emit('mood:logged', moodEventData);
    
    // Also emit to the user's general room for dashboard updates
    io.to(userId.toString()).emit('mood:logged', moodEventData);
    
  } catch (err) {
    console.error('Error emitting mood logged event:', err);
  }
};

