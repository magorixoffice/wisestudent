import cron from 'node-cron';
import { syncExpiredSchoolSubscriptions } from '../services/schoolStudentSubscriptionSync.js';

/**
 * Schedule periodic checks for expired school subscriptions
 * Runs every hour to check for expired subscriptions and sync student/teacher access
 */
export const scheduleExpiredSubscriptionSync = (io = null) => {
  // Run every hour at minute 0 (e.g., 1:00, 2:00, 3:00, etc.)
  cron.schedule('0 * * * *', async () => {
    try {
      await syncExpiredSchoolSubscriptions(io);
    } catch (error) {
      console.error('❌ Expired subscription sync scheduler failed:', error);
    }
  });

  // Also run immediately on startup to catch any subscriptions that expired while server was down
  setTimeout(async () => {
    try {
      await syncExpiredSchoolSubscriptions(io);
    } catch (error) {
      console.error('❌ Initial expired subscription sync failed:', error);
    }
  }, 5000); // Wait 5 seconds after server starts
};

export default scheduleExpiredSubscriptionSync;

