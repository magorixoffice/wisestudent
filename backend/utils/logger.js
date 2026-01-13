/**
 * Centralized logging utility with log levels
 * Automatically filters logs based on NODE_ENV
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const isDevelopment = process.env.NODE_ENV !== 'production';
const isProduction = process.env.NODE_ENV === 'production';

// Get log level from environment or default
const getLogLevel = () => {
  const envLevel = process.env.LOG_LEVEL?.toUpperCase();
  if (envLevel && LOG_LEVELS[envLevel] !== undefined) {
    return LOG_LEVELS[envLevel];
  }
  // Default: show all in dev, only errors/warnings in production
  return isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.WARN;
};

const currentLogLevel = getLogLevel();

/**
 * Format log message with timestamp
 */
const formatMessage = (level, message, ...args) => {
  const timestamp = new Date().toISOString();
  const levelLabel = level.padEnd(5).toUpperCase();
  return `[${timestamp}] ${levelLabel} ${message}`;
};

/**
 * Logger utility
 */
export const logger = {
  /**
   * Error logs - Always shown (critical issues)
   */
  error: (message, ...args) => {
    if (currentLogLevel >= LOG_LEVELS.ERROR) {
      console.error(formatMessage('ERROR', message, ...args), ...args);
    }
  },

  /**
   * Warning logs - Shown in production (important but not critical)
   */
  warn: (message, ...args) => {
    if (currentLogLevel >= LOG_LEVELS.WARN) {
      console.warn(formatMessage('WARN', message, ...args), ...args);
    }
  },

  /**
   * Info logs - Only in development (general information)
   */
  info: (message, ...args) => {
    if (currentLogLevel >= LOG_LEVELS.INFO) {
      console.log(formatMessage('INFO', message, ...args), ...args);
    }
  },

  /**
   * Debug logs - Only in development (detailed debugging)
   */
  debug: (message, ...args) => {
    if (currentLogLevel >= LOG_LEVELS.DEBUG) {
      console.log(formatMessage('DEBUG', message, ...args), ...args);
    }
  },

  /**
   * Game-specific debug logs (for game completion tracking)
   * Only shown in development
   */
  game: (message, ...args) => {
    if (isDevelopment) {
      console.log(`🎮 ${message}`, ...args);
    }
  },

  /**
   * Coin-specific debug logs
   * Only shown in development
   */
  coins: (message, ...args) => {
    if (isDevelopment) {
      console.log(`💰 ${message}`, ...args);
    }
  },

  /**
   * Socket-specific debug logs
   * Only shown in development
   */
  socket: (message, ...args) => {
    if (isDevelopment) {
      console.log(`🔌 ${message}`, ...args);
    }
  }
};

export default logger;

