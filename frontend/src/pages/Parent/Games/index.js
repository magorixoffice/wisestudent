// Parent Games Registry
import parentEducationGames, { getParentEducationGame } from './ParentEducation';

/**
 * Parent Game Categories Registry
 * Maps category keys to their game registries and getter functions
 */
const parentGameCategories = {
  'parent-education': {
    games: parentEducationGames,
    getGame: getParentEducationGame,
    title: 'Mental Health & Emotional Regulation',
    icon: '📚',
    color: 'from-blue-600 to-indigo-700'
  },
  'mental-health-emotional-regulation': {
    games: parentEducationGames,
    getGame: getParentEducationGame,
    title: 'Mental Health & Emotional Regulation',
    icon: '📚',
    color: 'from-blue-600 to-indigo-700'
  },
  // Future pillars can be added here:
  // 'child-development': { ... },
  // 'digital-safety': { ... },
};

/**
 * Get a parent game component by category and game ID
 * @param {string} category - Game category (e.g., 'parent-education')
 * @param {string} gameId - Game identifier
 * @returns {React.Component|null} - Game component or null if not found
 */
export const getParentGame = (category, gameId) => {
  const cat = parentGameCategories[category];
  if (!cat) {
    console.warn(`Unknown parent game category: ${category}`);
    return null;
  }
  return cat.getGame(gameId);
};

export default parentGameCategories;

