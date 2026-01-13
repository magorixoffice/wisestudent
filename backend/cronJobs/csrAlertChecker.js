import cron from 'node-cron';
import { checkAndTriggerAlerts } from '../services/csrAlertService.js';

let ioInstance = null;
let isRunning = false;

/**
 * Schedule CSR alert checking
 * Runs every 15 minutes to check for alert conditions
 */
export const scheduleCSRAlertChecker = (io) => {
  ioInstance = io;
  
  // Run every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    if (isRunning) {
      return;
    }
    
    try {
      isRunning = true;
      await checkAndTriggerAlerts(ioInstance);
    } catch (error) {
      console.error('❌ Error in CSR alert checker:', error);
    } finally {
      isRunning = false;
    }
  });
  
  // Run immediately on startup (after a short delay to let server initialize)
  setTimeout(async () => {
    try {
      await checkAndTriggerAlerts(ioInstance);
    } catch (error) {
      console.error('❌ Error in initial CSR alert check:', error);
    }
  }, 30000); // Wait 30 seconds after server starts
};

export default scheduleCSRAlertChecker;

