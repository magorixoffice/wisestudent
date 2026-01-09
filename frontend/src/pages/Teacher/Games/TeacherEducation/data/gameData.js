import { getCalmCoinsForGame, getReplayCostForGame } from '../../../../../utils/teacherGameUtils';

/**
 * Teacher Education Game Data
 * Each game has exactly 5 questions
 * CalmCoins are awarded per game (not per question)
 */
export const teacherEducationGameData = [
  {
    id: 'teacher-education-1',
    slug: 'name-your-feeling',
    title: 'Name Your Feeling',
    description: 'Identify personal emotions in typical classroom or staffroom situations',
    gameIndex: 1,
    calmCoins: getCalmCoinsForGame(1),  // 5 CalmCoins
    replayCost: getReplayCostForGame(1), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/name-your-feeling'
  },
  {
    id: 'teacher-education-2',
    slug: 'emotion-wheel-quiz',
    title: 'Emotion Wheel Quiz',
    description: 'Learn to differentiate between primary and secondary emotions',
    gameIndex: 2,
    calmCoins: getCalmCoinsForGame(2),  // 5 CalmCoins
    replayCost: getReplayCostForGame(2), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/emotion-wheel-quiz'
  },
  {
    id: 'teacher-education-3',
    slug: 'trigger-finder',
    title: 'Trigger Finder',
    description: 'Identify personal emotional triggers and common stress cues',
    gameIndex: 3,
    calmCoins: getCalmCoinsForGame(3),  // 5 CalmCoins
    replayCost: getReplayCostForGame(3), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/trigger-finder'
  },
  {
    id: 'teacher-education-4',
    slug: 'thought-tracker',
    title: 'Thought Tracker',
    description: 'Notice automatic thought patterns and how they affect mood',
    gameIndex: 4,
    calmCoins: getCalmCoinsForGame(4),  // 5 CalmCoins
    replayCost: getReplayCostForGame(4), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 3,
    totalLevels: 3,
    path: '/school-teacher/games/mental-health-emotional-regulation/thought-tracker'
  },
  {
    id: 'teacher-education-5',
    slug: 'mood-map',
    title: 'Mood Map',
    description: 'Connect body sensations to emotions',
    gameIndex: 5,
    calmCoins: getCalmCoinsForGame(5),  // 5 CalmCoins
    replayCost: getReplayCostForGame(5), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/mood-map'
  },
  {
    id: 'teacher-education-6',
    slug: 'inner-voice-check',
    title: 'Inner Voice Check',
    description: 'Recognize negative self-talk and replace it with constructive phrasing',
    gameIndex: 6,
    calmCoins: getCalmCoinsForGame(6),  // 5 CalmCoins
    replayCost: getReplayCostForGame(6), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/inner-voice-check'
  },
  {
    id: 'teacher-education-7',
    slug: 'emotion-journal',
    title: 'Emotion Journal',
    description: 'Reflect on daily emotion patterns to build self-awareness',
    gameIndex: 7,
    calmCoins: getCalmCoinsForGame(7),  // 5 CalmCoins
    replayCost: getReplayCostForGame(7), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/emotion-journal'
  },
  {
    id: 'teacher-education-8',
    slug: 'mirror-moment-simulation',
    title: 'Mirror Moment Simulation',
    description: 'Experience self-dialogue to reduce guilt or shame after a tough day',
    gameIndex: 8,
    calmCoins: getCalmCoinsForGame(8),  // 5 CalmCoins
    replayCost: getReplayCostForGame(8), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/mirror-moment-simulation'
  },
  {
    id: 'teacher-education-9',
    slug: 'emotion-reflex',
    title: 'Emotion Reflex',
    description: 'React to quick emotion cues in images or phrases',
    gameIndex: 9,
    calmCoins: getCalmCoinsForGame(9),  // 5 CalmCoins
    replayCost: getReplayCostForGame(9), // 2 CalmCoins
    estimatedTime: '5 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 20,
    totalLevels: 20,
    path: '/school-teacher/games/mental-health-emotional-regulation/emotion-reflex'
  },
  {
    id: 'teacher-education-10',
    slug: 'self-aware-teacher-badge',
    title: 'Self-Aware Teacher Badge',
    description: 'Reward teachers who complete daily emotional awareness tasks',
    gameIndex: 10,
    calmCoins: getCalmCoinsForGame(10),  // 5 CalmCoins
    replayCost: getReplayCostForGame(10), // 2 CalmCoins
    estimatedTime: '1 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/self-aware-teacher-badge'
  },
  {
    id: 'teacher-education-11',
    slug: 'identify-your-stressors',
    title: 'Identify Your Stressors',
    description: 'Recognize the top three sources of stress in a school week',
    gameIndex: 11,
    calmCoins: getCalmCoinsForGame(11),  // 5 CalmCoins
    replayCost: getReplayCostForGame(11), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/identify-your-stressors'
  },
  {
    id: 'teacher-education-12',
    slug: 'stress-thermometer',
    title: 'Stress Thermometer',
    description: 'Rate and visualize your stress intensity across situations',
    gameIndex: 12,
    calmCoins: getCalmCoinsForGame(12),  // 5 CalmCoins
    replayCost: getReplayCostForGame(12), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 8,
    totalLevels: 8,
    path: '/school-teacher/games/mental-health-emotional-regulation/stress-thermometer'
  },
  {
    id: 'teacher-education-13',
    slug: 'quick-calm-reflex',
    title: 'Quick Calm Reflex',
    description: 'Practice instant de-stressing actions during busy class hours',
    gameIndex: 13,
    calmCoins: getCalmCoinsForGame(13),  // 5 CalmCoins
    replayCost: getReplayCostForGame(13), // 2 CalmCoins
    estimatedTime: '5 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 20,
    totalLevels: 20,
    path: '/school-teacher/games/mental-health-emotional-regulation/quick-calm-reflex'
  },
  {
    id: 'teacher-education-14',
    slug: 'breathe-with-rhythm',
    title: 'Breathe with Rhythm',
    description: 'Master a 3-step breathing cycle to reduce physical tension',
    gameIndex: 14,
    calmCoins: getCalmCoinsForGame(14),  // 5 CalmCoins
    replayCost: getReplayCostForGame(14), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/breathe-with-rhythm'
  },
  {
    id: 'teacher-education-15',
    slug: 'time-pressure-simulation',
    title: 'Time Pressure Simulation',
    description: 'Learn balanced decision-making under time stress',
    gameIndex: 15,
    calmCoins: getCalmCoinsForGame(15),  // 5 CalmCoins
    replayCost: getReplayCostForGame(15), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/time-pressure-simulation'
  },
  {
    id: 'teacher-education-16',
    slug: 'calm-corner-poster',
    title: 'Calm Corner Poster',
    description: 'Create a personal Calm Corner visual for desk or phone wallpaper',
    gameIndex: 16,
    calmCoins: getCalmCoinsForGame(16),  // 5 CalmCoins
    replayCost: getReplayCostForGame(16), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/calm-corner-poster'
  },
  {
    id: 'teacher-education-17',
    slug: 'workload-journal',
    title: 'Workload Journal',
    description: 'Reflect on tasks that cause strain and identify tasks to delegate or simplify',
    gameIndex: 17,
    calmCoins: getCalmCoinsForGame(17),  // 5 CalmCoins
    replayCost: getReplayCostForGame(17), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/workload-journal'
  },
  {
    id: 'teacher-education-18',
    slug: 'pause-practice-simulation',
    title: 'Pause Practice Simulation',
    description: 'Train the habit of pausing before reacting to stress triggers',
    gameIndex: 18,
    calmCoins: getCalmCoinsForGame(18),  // 5 CalmCoins
    replayCost: getReplayCostForGame(18), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 3,
    totalLevels: 3,
    path: '/school-teacher/games/mental-health-emotional-regulation/pause-practice-simulation'
  },
  {
    id: 'teacher-education-19',
    slug: 'stress-release-body-scan',
    title: 'Stress Release Body Scan',
    description: 'Relax through guided visualization and muscle awareness',
    gameIndex: 19,
    calmCoins: getCalmCoinsForGame(19),  // 5 CalmCoins
    replayCost: getReplayCostForGame(19), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/stress-release-body-scan'
  },
  {
    id: 'teacher-education-20',
    slug: 'calm-teacher-badge',
    title: 'Calm Teacher Badge',
    description: 'Reward teachers for consistent daily stress management practice',
    gameIndex: 20,
    calmCoins: getCalmCoinsForGame(20),  // 5 CalmCoins
    replayCost: getReplayCostForGame(20), // 2 CalmCoins
    estimatedTime: '1 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    isBadgeGame: true,
    path: '/school-teacher/games/mental-health-emotional-regulation/calm-teacher-badge'
  },
  {
    id: 'teacher-education-21',
    slug: 'understanding-compassion-fatigue',
    title: 'Understanding Compassion Fatigue',
    description: 'Recognize the signs of emotional exhaustion from over-caring',
    gameIndex: 21,
    calmCoins: getCalmCoinsForGame(21),  // 5 CalmCoins
    replayCost: getReplayCostForGame(21), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/understanding-compassion-fatigue'
  },
  {
    id: 'teacher-education-22',
    slug: 'empathy-vs-overload-quiz',
    title: 'Empathy vs Overload Quiz',
    description: 'Distinguish between helpful empathy and unhealthy emotional absorption',
    gameIndex: 22,
    calmCoins: getCalmCoinsForGame(22),  // 5 CalmCoins
    replayCost: getReplayCostForGame(22), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 8,
    totalLevels: 8,
    path: '/school-teacher/games/mental-health-emotional-regulation/empathy-vs-overload-quiz'
  },
  {
    id: 'teacher-education-23',
    slug: 'emotional-boundary-builder',
    title: 'Emotional Boundary Builder',
    description: 'Learn to maintain emotional balance while helping others',
    gameIndex: 23,
    calmCoins: getCalmCoinsForGame(23),  // 5 CalmCoins
    replayCost: getReplayCostForGame(23), // 2 CalmCoins
    estimatedTime: '18 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 6,
    totalLevels: 6,
    path: '/school-teacher/games/mental-health-emotional-regulation/emotional-boundary-builder'
  },
  {
    id: 'teacher-education-24',
    slug: 'energy-drain-tracker',
    title: 'Energy Drain Tracker',
    description: 'Identify people and tasks that emotionally drain or uplift',
    gameIndex: 24,
    calmCoins: getCalmCoinsForGame(24),  // 5 CalmCoins
    replayCost: getReplayCostForGame(24), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/energy-drain-tracker'
  },
  {
    id: 'teacher-education-25',
    slug: 'refill-rituals',
    title: 'Refill Rituals',
    description: 'Build small self-care rituals that restore empathy reserves',
    gameIndex: 25,
    calmCoins: getCalmCoinsForGame(25),  // 5 CalmCoins
    replayCost: getReplayCostForGame(25), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/refill-rituals'
  },
  {
    id: 'teacher-education-26',
    slug: 'compassion-reflection-journal',
    title: 'Compassion Reflection Journal',
    description: 'Reflect on a recent moment of deep empathy and its impact',
    gameIndex: 26,
    calmCoins: getCalmCoinsForGame(26),  // 5 CalmCoins
    replayCost: getReplayCostForGame(26), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/compassion-reflection-journal'
  },
  {
    id: 'teacher-education-27',
    slug: 'empathy-rebalance-simulation',
    title: 'Empathy Rebalance Simulation',
    description: 'Manage compassion in real-time classroom stress situations',
    gameIndex: 27,
    calmCoins: getCalmCoinsForGame(27),  // 5 CalmCoins
    replayCost: getReplayCostForGame(27), // 2 CalmCoins
    estimatedTime: '25 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 3,
    totalLevels: 3,
    path: '/school-teacher/games/mental-health-emotional-regulation/empathy-rebalance-simulation'
  },
  {
    id: 'teacher-education-28',
    slug: 'inner-recharge-visualization',
    title: 'Inner Recharge Visualization',
    description: 'Mentally recharge empathy reserves using guided imagery',
    gameIndex: 28,
    calmCoins: getCalmCoinsForGame(28),  // 5 CalmCoins
    replayCost: getReplayCostForGame(28), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/inner-recharge-visualization'
  },
  {
    id: 'teacher-education-29',
    slug: 'empathy-reflex',
    title: 'Empathy Reflex',
    description: 'Rapidly identify emotionally supportive vs draining responses',
    gameIndex: 29,
    calmCoins: getCalmCoinsForGame(29),  // 5 CalmCoins
    replayCost: getReplayCostForGame(29), // 2 CalmCoins
    estimatedTime: '5 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 20,
    totalLevels: 20,
    path: '/school-teacher/games/mental-health-emotional-regulation/empathy-reflex'
  },
  {
    id: 'teacher-education-30',
    slug: 'compassion-balance-badge',
    title: 'Compassion Balance Badge',
    description: 'Recognize teachers who model healthy empathy in school culture',
    gameIndex: 30,
    calmCoins: getCalmCoinsForGame(30),  // 5 CalmCoins
    replayCost: getReplayCostForGame(30), // 2 CalmCoins
    estimatedTime: '1 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    isBadgeGame: true,
    path: '/school-teacher/games/mental-health-emotional-regulation/compassion-balance-badge'
  },
  {
    id: 'teacher-education-31',
    slug: 'the-balance-scale',
    title: 'The Balance Scale',
    description: 'Understand the current ratio between personal time and school time',
    gameIndex: 31,
    calmCoins: getCalmCoinsForGame(31),  // 5 CalmCoins
    replayCost: getReplayCostForGame(31), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/the-balance-scale'
  },
  {
    id: 'teacher-education-32',
    slug: 'boundaries-quiz',
    title: 'Boundaries Quiz',
    description: 'Learn to identify healthy and unhealthy work boundaries',
    gameIndex: 32,
    calmCoins: getCalmCoinsForGame(32),  // 5 CalmCoins
    replayCost: getReplayCostForGame(32), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 8,
    totalLevels: 8,
    path: '/school-teacher/games/mental-health-emotional-regulation/boundaries-quiz'
  },
  {
    id: 'teacher-education-33',
    slug: 'after-school-reset',
    title: 'After-School Reset',
    description: 'Practice end-of-day mental separation techniques',
    gameIndex: 33,
    calmCoins: getCalmCoinsForGame(33),  // 5 CalmCoins
    replayCost: getReplayCostForGame(33), // 2 CalmCoins
    estimatedTime: '5 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/after-school-reset'
  },
  {
    id: 'teacher-education-34',
    slug: 'task-prioritization-puzzle',
    title: 'Task Prioritization Puzzle',
    description: 'Learn to separate urgent vs important tasks',
    gameIndex: 34,
    calmCoins: getCalmCoinsForGame(34),  // 5 CalmCoins
    replayCost: getReplayCostForGame(34), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/task-prioritization-puzzle'
  },
  {
    id: 'teacher-education-35',
    slug: 'weekend-recharge-plan',
    title: 'Weekend Recharge Plan',
    description: 'Design an achievable personal recharge plan for the week',
    gameIndex: 35,
    calmCoins: getCalmCoinsForGame(35),  // 5 CalmCoins
    replayCost: getReplayCostForGame(35), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/weekend-recharge-plan'
  },
  {
    id: 'teacher-education-36',
    slug: 'the-no-practice',
    title: 'The "No" Practice',
    description: 'Learn polite, assertive refusal to avoid overload',
    gameIndex: 36,
    calmCoins: getCalmCoinsForGame(36),  // 5 CalmCoins
    replayCost: getReplayCostForGame(36), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 8,
    totalLevels: 8,
    path: '/school-teacher/games/mental-health-emotional-regulation/the-no-practice'
  },
  {
    id: 'teacher-education-37',
    slug: 'work-life-tracker-journal',
    title: 'Work–Life Tracker Journal',
    description: 'Track how personal time fluctuates across 3 days',
    gameIndex: 37,
    calmCoins: getCalmCoinsForGame(37),  // 5 CalmCoins
    replayCost: getReplayCostForGame(37), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 3,
    totalLevels: 3,
    path: '/school-teacher/games/mental-health-emotional-regulation/work-life-tracker-journal'
  },
  {
    id: 'teacher-education-38',
    slug: 'family-connection-challenge',
    title: 'Family Connection Challenge',
    description: 'Reinforce personal bonds to counter isolation from overwork',
    gameIndex: 38,
    calmCoins: getCalmCoinsForGame(38),  // 5 CalmCoins
    replayCost: getReplayCostForGame(38), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/mental-health-emotional-regulation/family-connection-challenge'
  },
  {
    id: 'teacher-education-39',
    slug: 'digital-shutdown-simulation',
    title: 'Digital Shutdown Simulation',
    description: 'Practice structured disconnection from work devices',
    gameIndex: 39,
    calmCoins: getCalmCoinsForGame(39),  // 5 CalmCoins
    replayCost: getReplayCostForGame(39), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 8,
    totalLevels: 8,
    path: '/school-teacher/games/mental-health-emotional-regulation/digital-shutdown-simulation'
  },
  {
    id: 'teacher-education-40',
    slug: 'balanced-life-badge',
    title: 'Balanced Life Badge',
    description: 'Reward teachers who maintain consistent rest and self-care routines',
    gameIndex: 40,
    calmCoins: getCalmCoinsForGame(40),  // 5 CalmCoins
    replayCost: getReplayCostForGame(40), // 2 CalmCoins
    estimatedTime: '1 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    isBadgeGame: true,
    path: '/school-teacher/games/mental-health-emotional-regulation/balanced-life-badge'
  },
  {
    id: 'teacher-education-41',
    slug: 'present-moment-awareness',
    title: 'Present Moment Awareness',
    description: 'Train attention to stay in the present during class or meetings',
    gameIndex: 41,
    calmCoins: getCalmCoinsForGame(41),  // 5 CalmCoins
    replayCost: getReplayCostForGame(41), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 6,
    totalLevels: 6,
    path: '/school-teacher/games/mental-health-emotional-regulation/present-moment-awareness'
  },
  {
    id: 'teacher-education-42',
    slug: 'one-minute-pause',
    title: 'One-Minute Pause',
    description: 'Learn micro-meditation for immediate mental reset',
    gameIndex: 42,
    calmCoins: getCalmCoinsForGame(42),  // 5 CalmCoins
    replayCost: getReplayCostForGame(42), // 2 CalmCoins
    estimatedTime: '2 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/one-minute-pause'
  },
  {
    id: 'teacher-education-43',
    slug: 'focus-anchor-exercise',
    title: 'Focus Anchor Exercise',
    description: 'Practice grounding the mind using a sensory focus point',
    gameIndex: 43,
    calmCoins: getCalmCoinsForGame(43),  // 5 CalmCoins
    replayCost: getReplayCostForGame(43), // 2 CalmCoins
    estimatedTime: '3 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/focus-anchor-exercise'
  },
  {
    id: 'teacher-education-44',
    slug: 'mindful-observation-game',
    title: 'Mindful Observation Game',
    description: 'Strengthen awareness by noticing small details in environment',
    gameIndex: 44,
    calmCoins: getCalmCoinsForGame(44),  // 5 CalmCoins
    replayCost: getReplayCostForGame(44), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/mindful-observation-game'
  },
  {
    id: 'teacher-education-45',
    slug: 'guided-meditation-audio',
    title: 'Guided Meditation Audio',
    description: 'Relax the nervous system and improve sustained focus',
    gameIndex: 45,
    calmCoins: getCalmCoinsForGame(45),  // 5 CalmCoins
    replayCost: getReplayCostForGame(45), // 2 CalmCoins
    estimatedTime: '6 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/guided-meditation-audio'
  },
  {
    id: 'teacher-education-46',
    slug: 'distraction-detox',
    title: 'Distraction Detox',
    description: 'Identify and limit daily distractions that reduce focus quality',
    gameIndex: 46,
    calmCoins: getCalmCoinsForGame(46),  // 5 CalmCoins
    replayCost: getReplayCostForGame(46), // 2 CalmCoins
    estimatedTime: '8 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/distraction-detox'
  },
  {
    id: 'teacher-education-47',
    slug: 'mindful-eating-break',
    title: 'Mindful Eating Break',
    description: 'Cultivate awareness during short meal or snack breaks',
    gameIndex: 47,
    calmCoins: getCalmCoinsForGame(47),  // 5 CalmCoins
    replayCost: getReplayCostForGame(47), // 2 CalmCoins
    estimatedTime: '3 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/mindful-eating-break'
  },
  {
    id: 'teacher-education-48',
    slug: 'flow-state-simulation',
    title: 'Flow State Simulation',
    description: 'Learn how focused engagement feels mentally and physically',
    gameIndex: 48,
    calmCoins: getCalmCoinsForGame(48),  // 5 CalmCoins
    replayCost: getReplayCostForGame(48), // 2 CalmCoins
    estimatedTime: '5 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 3,
    totalLevels: 3,
    path: '/school-teacher/games/mental-health-emotional-regulation/flow-state-simulation'
  },
  {
    id: 'teacher-education-49',
    slug: 'gratitude-in-the-moment',
    title: 'Gratitude in the Moment',
    description: 'Shift attention from pressure to appreciation to restore focus',
    gameIndex: 49,
    calmCoins: getCalmCoinsForGame(49),  // 5 CalmCoins
    replayCost: getReplayCostForGame(49), // 2 CalmCoins
    estimatedTime: '3 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/gratitude-in-the-moment'
  },
  {
    id: 'teacher-education-50',
    slug: 'mindful-mastery-badge',
    title: 'Mindful Mastery Badge',
    description: 'Celebrate teachers who sustain mindful habits daily',
    gameIndex: 50,
    calmCoins: getCalmCoinsForGame(50),  // 5 CalmCoins
    replayCost: getReplayCostForGame(50), // 2 CalmCoins
    estimatedTime: '1 min',
    difficulty: 'expert',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    isBadgeGame: true,
    path: '/school-teacher/games/mental-health-emotional-regulation/mindful-mastery-badge'
  },
  {
    id: 'teacher-education-51',
    slug: 'the-bounce-back-quiz',
    title: 'The Bounce-Back Quiz',
    description: 'Understand how resiliently you respond to common school setbacks',
    gameIndex: 51,
    calmCoins: getCalmCoinsForGame(51),  // 5 CalmCoins
    replayCost: getReplayCostForGame(51), // 2 CalmCoins
    estimatedTime: '8 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 8,
    totalLevels: 8,
    path: '/school-teacher/games/mental-health-emotional-regulation/the-bounce-back-quiz'
  },
  {
    id: 'teacher-education-52',
    slug: 'growth-mindset-puzzle',
    title: 'Growth Mindset Puzzle',
    description: 'Learn to reframe "failure" as feedback for improvement',
    gameIndex: 52,
    calmCoins: getCalmCoinsForGame(52),  // 5 CalmCoins
    replayCost: getReplayCostForGame(52), // 2 CalmCoins
    estimatedTime: '6 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 10,
    totalLevels: 10,
    path: '/school-teacher/games/mental-health-emotional-regulation/growth-mindset-puzzle'
  },
  {
    id: 'teacher-education-53',
    slug: 'tough-day-simulation',
    title: 'Tough Day Simulation',
    description: 'Practice recovering mentally after a challenging classroom day',
    gameIndex: 53,
    calmCoins: getCalmCoinsForGame(53),  // 5 CalmCoins
    replayCost: getReplayCostForGame(53), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'intermediate',
    category: 'teacher-education',
    totalQuestions: 1,
    totalLevels: 1,
    path: '/school-teacher/games/mental-health-emotional-regulation/tough-day-simulation'
  },
  // More games will be added here later
];

/**
 * Get game data by ID
 */
export const getTeacherEducationGameById = (gameId) => {
  return teacherEducationGameData.find(game => game.id === gameId) || null;
};

/**
 * Get all teacher education games
 */
export const getAllTeacherEducationGames = () => {
  return teacherEducationGameData;
};

