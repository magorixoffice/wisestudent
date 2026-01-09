// Teacher Games Registry
import teacherEducationGames, { getTeacherEducationGame } from './TeacherEducation';

/**
 * Teacher Game Categories Registry
 * Maps category keys to their game registries and getter functions
 */
const teacherGameCategories = {
  'teacher-education': {
    games: teacherEducationGames,
    getGame: getTeacherEducationGame,
    title: 'Mental Health & Emotional Regulation',
    icon: '📚',
    color: 'from-purple-600 to-indigo-700'
  },
  'mental-health-emotional-regulation': {
    games: teacherEducationGames,
    getGame: getTeacherEducationGame,
    title: 'Mental Health & Emotional Regulation',
    icon: '📚',
    color: 'from-purple-600 to-indigo-700'
  },
  // Future categories can be added here
};

/**
 * Get a teacher game component by category and game ID
 * @param {string} category - Game category (e.g., 'teacher-education')
 * @param {string} gameId - Game identifier
 * @returns {React.Component|null} - Game component or null if not found
 */
export const getTeacherGame = (category, gameId) => {
  const cat = teacherGameCategories[category];
  if (!cat) {
    console.warn(`Unknown teacher game category: ${category}`);
    return null;
  }
  return cat.getGame(gameId);
};

export default teacherGameCategories;

