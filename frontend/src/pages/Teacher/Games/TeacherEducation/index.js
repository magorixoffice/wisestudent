// Import all teacher education game components
import NameYourFeeling from './games/NameYourFeeling';
import EmotionWheelQuiz from './games/EmotionWheelQuiz';
import TriggerFinder from './games/TriggerFinder';
import ThoughtTracker from './games/ThoughtTracker';
import MoodMap from './games/MoodMap';
import InnerVoiceCheck from './games/InnerVoiceCheck';
import EmotionJournal from './games/EmotionJournal';
import MirrorMomentSimulation from './games/MirrorMomentSimulation';
import EmotionReflex from './games/EmotionReflex';
import SelfAwareTeacherBadge from './games/SelfAwareTeacherBadge';
import IdentifyYourStressors from './games/IdentifyYourStressors';
import StressThermometer from './games/StressThermometer';
import QuickCalmReflex from './games/QuickCalmReflex';
import BreatheWithRhythm from './games/BreatheWithRhythm';
import TimePressureSimulation from './games/TimePressureSimulation';
import CalmCornerPoster from './games/CalmCornerPoster';
import WorkloadJournal from './games/WorkloadJournal';
import PausePracticeSimulation from './games/PausePracticeSimulation';
import StressReleaseBodyScan from './games/StressReleaseBodyScan';
import CalmTeacherBadge from './games/CalmTeacherBadge';
import UnderstandingCompassionFatigue from './games/UnderstandingCompassionFatigue';
import EmpathyVsOverloadQuiz from './games/EmpathyVsOverloadQuiz';
import EmotionalBoundaryBuilder from './games/EmotionalBoundaryBuilder';
import EnergyDrainTracker from './games/EnergyDrainTracker';
import RefillRituals from './games/RefillRituals';
import CompassionReflectionJournal from './games/CompassionReflectionJournal';
import EmpathyRebalanceSimulation from './games/EmpathyRebalanceSimulation';
import InnerRechargeVisualization from './games/InnerRechargeVisualization';
import EmpathyReflex from './games/EmpathyReflex';
import CompassionBalanceBadge from './games/CompassionBalanceBadge';
import TheBalanceScale from './games/TheBalanceScale';
import BoundariesQuiz from './games/BoundariesQuiz';
import AfterSchoolReset from './games/AfterSchoolReset';
import TaskPrioritizationPuzzle from './games/TaskPrioritizationPuzzle';
import WeekendRechargePlan from './games/WeekendRechargePlan';
import TheNoPractice from './games/TheNoPractice';
import WorkLifeTrackerJournal from './games/WorkLifeTrackerJournal';
import FamilyConnectionChallenge from './games/FamilyConnectionChallenge';
import DigitalShutdownSimulation from './games/DigitalShutdownSimulation';
import BalancedLifeBadge from './games/BalancedLifeBadge';
import PresentMomentAwareness from './games/PresentMomentAwareness';
import OneMinutePause from './games/OneMinutePause';
import FocusAnchorExercise from './games/FocusAnchorExercise';
import MindfulObservationGame from './games/MindfulObservationGame';
import GuidedMeditationAudio from './games/GuidedMeditationAudio';
import DistractionDetox from './games/DistractionDetox';
import MindfulEatingBreak from './games/MindfulEatingBreak';
import FlowStateSimulation from './games/FlowStateSimulation';
import GratitudeInTheMoment from './games/GratitudeInTheMoment';
import MindfulMasteryBadge from './games/MindfulMasteryBadge';
import TheBounceBackQuiz from './games/TheBounceBackQuiz';
import GrowthMindsetPuzzle from './games/GrowthMindsetPuzzle';
import ToughDaySimulation from './games/ToughDaySimulation';

/**
 * Teacher Education Games Registry
 * Maps game IDs to their React components
 */
const teacherEducationGames = {
  'name-your-feeling': NameYourFeeling,
  'teacher-education-1': NameYourFeeling, // Alias for game ID
  'emotion-wheel-quiz': EmotionWheelQuiz,
  'teacher-education-2': EmotionWheelQuiz, // Alias for game ID
  'trigger-finder': TriggerFinder,
  'teacher-education-3': TriggerFinder, // Alias for game ID
  'thought-tracker': ThoughtTracker,
  'teacher-education-4': ThoughtTracker, // Alias for game ID
  'mood-map': MoodMap,
  'teacher-education-5': MoodMap, // Alias for game ID
  'inner-voice-check': InnerVoiceCheck,
  'teacher-education-6': InnerVoiceCheck, // Alias for game ID
  'emotion-journal': EmotionJournal,
  'teacher-education-7': EmotionJournal, // Alias for game ID
  'mirror-moment-simulation': MirrorMomentSimulation,
  'teacher-education-8': MirrorMomentSimulation, // Alias for game ID
  'emotion-reflex': EmotionReflex,
  'teacher-education-9': EmotionReflex, // Alias for game ID
  'self-aware-teacher-badge': SelfAwareTeacherBadge,
  'teacher-education-10': SelfAwareTeacherBadge, // Alias for game ID
  'identify-your-stressors': IdentifyYourStressors,
  'teacher-education-11': IdentifyYourStressors, // Alias for game ID
  'stress-thermometer': StressThermometer,
  'teacher-education-12': StressThermometer, // Alias for game ID
  'quick-calm-reflex': QuickCalmReflex,
  'teacher-education-13': QuickCalmReflex, // Alias for game ID
  'breathe-with-rhythm': BreatheWithRhythm,
  'teacher-education-14': BreatheWithRhythm, // Alias for game ID
  'time-pressure-simulation': TimePressureSimulation,
  'teacher-education-15': TimePressureSimulation, // Alias for game ID
  'calm-corner-poster': CalmCornerPoster,
  'teacher-education-16': CalmCornerPoster, // Alias for game ID
  'workload-journal': WorkloadJournal,
  'teacher-education-17': WorkloadJournal, // Alias for game ID
  'pause-practice-simulation': PausePracticeSimulation,
  'teacher-education-18': PausePracticeSimulation, // Alias for game ID
  'stress-release-body-scan': StressReleaseBodyScan,
  'teacher-education-19': StressReleaseBodyScan, // Alias for game ID
  'calm-teacher-badge': CalmTeacherBadge,
  'teacher-education-20': CalmTeacherBadge, // Alias for game ID
  'understanding-compassion-fatigue': UnderstandingCompassionFatigue,
  'teacher-education-21': UnderstandingCompassionFatigue, // Alias for game ID
  'empathy-vs-overload-quiz': EmpathyVsOverloadQuiz,
  'teacher-education-22': EmpathyVsOverloadQuiz, // Alias for game ID
  'emotional-boundary-builder': EmotionalBoundaryBuilder,
  'teacher-education-23': EmotionalBoundaryBuilder, // Alias for game ID
  'energy-drain-tracker': EnergyDrainTracker,
  'teacher-education-24': EnergyDrainTracker, // Alias for game ID
  'refill-rituals': RefillRituals,
  'teacher-education-25': RefillRituals, // Alias for game ID
  'compassion-reflection-journal': CompassionReflectionJournal,
  'teacher-education-26': CompassionReflectionJournal, // Alias for game ID
  'empathy-rebalance-simulation': EmpathyRebalanceSimulation,
  'teacher-education-27': EmpathyRebalanceSimulation, // Alias for game ID
  'inner-recharge-visualization': InnerRechargeVisualization,
  'teacher-education-28': InnerRechargeVisualization, // Alias for game ID
  'empathy-reflex': EmpathyReflex,
  'teacher-education-29': EmpathyReflex, // Alias for game ID
  'compassion-balance-badge': CompassionBalanceBadge,
  'teacher-education-30': CompassionBalanceBadge, // Alias for game ID
  'the-balance-scale': TheBalanceScale,
  'teacher-education-31': TheBalanceScale, // Alias for game ID
  'boundaries-quiz': BoundariesQuiz,
  'teacher-education-32': BoundariesQuiz, // Alias for game ID
  'after-school-reset': AfterSchoolReset,
  'teacher-education-33': AfterSchoolReset, // Alias for game ID
  'task-prioritization-puzzle': TaskPrioritizationPuzzle,
  'teacher-education-34': TaskPrioritizationPuzzle, // Alias for game ID
  'weekend-recharge-plan': WeekendRechargePlan,
  'teacher-education-35': WeekendRechargePlan, // Alias for game ID
  'the-no-practice': TheNoPractice,
  'teacher-education-36': TheNoPractice, // Alias for game ID
  'work-life-tracker-journal': WorkLifeTrackerJournal,
  'teacher-education-37': WorkLifeTrackerJournal, // Alias for game ID
  'family-connection-challenge': FamilyConnectionChallenge,
  'teacher-education-38': FamilyConnectionChallenge, // Alias for game ID
  'digital-shutdown-simulation': DigitalShutdownSimulation,
  'teacher-education-39': DigitalShutdownSimulation, // Alias for game ID
  'balanced-life-badge': BalancedLifeBadge,
  'teacher-education-40': BalancedLifeBadge, // Alias for game ID
  'present-moment-awareness': PresentMomentAwareness,
  'teacher-education-41': PresentMomentAwareness, // Alias for game ID
  'one-minute-pause': OneMinutePause,
  'teacher-education-42': OneMinutePause, // Alias for game ID
  'focus-anchor-exercise': FocusAnchorExercise,
  'teacher-education-43': FocusAnchorExercise, // Alias for game ID
  'mindful-observation-game': MindfulObservationGame,
  'teacher-education-44': MindfulObservationGame, // Alias for game ID
  'guided-meditation-audio': GuidedMeditationAudio,
  'teacher-education-45': GuidedMeditationAudio, // Alias for game ID
  'distraction-detox': DistractionDetox,
  'teacher-education-46': DistractionDetox, // Alias for game ID
  'mindful-eating-break': MindfulEatingBreak,
  'teacher-education-47': MindfulEatingBreak, // Alias for game ID
  'flow-state-simulation': FlowStateSimulation,
  'teacher-education-48': FlowStateSimulation, // Alias for game ID
  'gratitude-in-the-moment': GratitudeInTheMoment,
  'teacher-education-49': GratitudeInTheMoment, // Alias for game ID
  'mindful-mastery-badge': MindfulMasteryBadge,
  'teacher-education-50': MindfulMasteryBadge, // Alias for game ID
  'the-bounce-back-quiz': TheBounceBackQuiz,
  'teacher-education-51': TheBounceBackQuiz, // Alias for game ID
  'growth-mindset-puzzle': GrowthMindsetPuzzle,
  'teacher-education-52': GrowthMindsetPuzzle, // Alias for game ID
  'tough-day-simulation': ToughDaySimulation,
  'teacher-education-53': ToughDaySimulation, // Alias for game ID
  // More games will be added here later
};

/**
 * Get a teacher education game component by game ID
 * @param {string} gameId - Game identifier (e.g., 'name-your-feeling' or 'teacher-education-1')
 * @returns {React.Component|null} - Game component or null if not found
 */
export const getTeacherEducationGame = (gameId) => {
  // Try direct match first
  if (teacherEducationGames[gameId]) {
    return teacherEducationGames[gameId];
  }
  
  // Try to extract game slug from gameId (e.g., 'teacher-education-1' -> 'name-your-feeling')
  // Map game IDs to their component slugs
  const gameIdToSlug = {
    'teacher-education-1': 'name-your-feeling',
    'teacher-education-2': 'emotion-wheel-quiz',
    'teacher-education-3': 'trigger-finder',
    'teacher-education-4': 'thought-tracker',
    'teacher-education-5': 'mood-map',
    'teacher-education-6': 'inner-voice-check',
    'teacher-education-7': 'emotion-journal',
    'teacher-education-8': 'mirror-moment-simulation',
    'teacher-education-9': 'emotion-reflex',
    'teacher-education-10': 'self-aware-teacher-badge',
    'teacher-education-11': 'identify-your-stressors',
    'teacher-education-12': 'stress-thermometer',
    'teacher-education-13': 'quick-calm-reflex',
    'teacher-education-14': 'breathe-with-rhythm',
    'teacher-education-15': 'time-pressure-simulation',
    'teacher-education-16': 'calm-corner-poster',
    'teacher-education-17': 'workload-journal',
    'teacher-education-18': 'pause-practice-simulation',
    'teacher-education-19': 'stress-release-body-scan',
    'teacher-education-20': 'calm-teacher-badge',
    'teacher-education-21': 'understanding-compassion-fatigue',
    'teacher-education-22': 'empathy-vs-overload-quiz',
    'teacher-education-23': 'emotional-boundary-builder',
    'teacher-education-24': 'energy-drain-tracker',
    'teacher-education-25': 'refill-rituals',
    'teacher-education-26': 'compassion-reflection-journal',
    'teacher-education-27': 'empathy-rebalance-simulation',
    'teacher-education-28': 'inner-recharge-visualization',
    'teacher-education-29': 'empathy-reflex',
    'teacher-education-30': 'compassion-balance-badge',
    'teacher-education-31': 'the-balance-scale',
    'teacher-education-32': 'boundaries-quiz',
    'teacher-education-33': 'after-school-reset',
    'teacher-education-34': 'task-prioritization-puzzle',
    'teacher-education-35': 'weekend-recharge-plan',
    'teacher-education-36': 'the-no-practice',
    'teacher-education-37': 'work-life-tracker-journal',
    'teacher-education-38': 'family-connection-challenge',
    'teacher-education-39': 'digital-shutdown-simulation',
    'teacher-education-40': 'balanced-life-badge',
    'teacher-education-41': 'present-moment-awareness',
    'teacher-education-42': 'one-minute-pause',
    'teacher-education-43': 'focus-anchor-exercise',
    'teacher-education-44': 'mindful-observation-game',
    'teacher-education-45': 'guided-meditation-audio',
    'teacher-education-46': 'distraction-detox',
    'teacher-education-47': 'mindful-eating-break',
    'teacher-education-48': 'flow-state-simulation',
    'teacher-education-49': 'gratitude-in-the-moment',
    'teacher-education-50': 'mindful-mastery-badge',
    'teacher-education-51': 'the-bounce-back-quiz',
    'teacher-education-52': 'growth-mindset-puzzle',
    'teacher-education-53': 'tough-day-simulation',
  };
  
  // If gameId matches a mapped ID, use the slug
  if (gameIdToSlug[gameId]) {
    return teacherEducationGames[gameIdToSlug[gameId]] || null;
  }
  
  // Try to extract slug from gameId if it contains hyphens
  // For format like 'teacher-education-name-your-feeling'
  const parts = gameId.split('-');
  if (parts.length > 2) {
    // Extract the slug part (everything after 'teacher-education-')
    const slug = parts.slice(2).join('-');
    if (teacherEducationGames[slug]) {
      return teacherEducationGames[slug];
    }
  }
  
  return null;
};

export default teacherEducationGames;

