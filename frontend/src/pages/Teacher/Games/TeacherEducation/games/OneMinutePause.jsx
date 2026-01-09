import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Play, Pause, RotateCcw, Clock, Target, Sparkles } from "lucide-react";

const OneMinutePause = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-42";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [breathPhase, setBreathPhase] = useState('idle'); // idle, inhale, pause, exhale
  const [breathCycleTime, setBreathCycleTime] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [focusRating, setFocusRating] = useState(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);
  
  const timerRef = useRef(null);
  const breathTimerRef = useRef(null);

  // Breathing rhythm: Inhale (4s) - Pause (2s) - Exhale (4s) = 10 seconds per cycle
  const breathingTimings = {
    inhale: 4,
    pause: 2,
    exhale: 4
  };

  const cycleDuration = breathingTimings.inhale + breathingTimings.pause + breathingTimings.exhale; // 10 seconds

  // Start the 60-second exercise
  const startExercise = () => {
    setIsPlaying(true);
    setTimeRemaining(60);
    setBreathPhase('inhale');
    setBreathCycleTime(breathingTimings.inhale);
    setShowRating(false);
    setFocusRating(null);
  };

  // Toggle pause/resume
  const togglePause = () => {
    setIsPlaying(!isPlaying);
  };

  // Reset exercise
  const resetExercise = () => {
    setIsPlaying(false);
    setTimeRemaining(60);
    setBreathPhase('idle');
    setBreathCycleTime(0);
    setShowRating(false);
    setFocusRating(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (breathTimerRef.current) {
      clearTimeout(breathTimerRef.current);
    }
  };

  // Main 60-second timer
  useEffect(() => {
    if (!isPlaying) return;

    if (timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else {
      // 60 seconds complete
      setIsPlaying(false);
      setBreathPhase('idle');
      setBreathCycleTime(0);
      setShowRating(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (breathTimerRef.current) {
        clearTimeout(breathTimerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, timeRemaining]);

  // Breathing cycle (repeats every 10 seconds during the 60-second period)
  useEffect(() => {
    if (!isPlaying || timeRemaining <= 0) return;

    if (breathCycleTime > 0) {
      breathTimerRef.current = setTimeout(() => {
        setBreathCycleTime(breathCycleTime - 1);
      }, 1000);
    } else {
      // Move to next breath phase
      if (breathPhase === 'inhale') {
        setBreathPhase('pause');
        setBreathCycleTime(breathingTimings.pause);
      } else if (breathPhase === 'pause') {
        setBreathPhase('exhale');
        setBreathCycleTime(breathingTimings.exhale);
      } else if (breathPhase === 'exhale') {
        // Start new cycle (inhale)
        setBreathPhase('inhale');
        setBreathCycleTime(breathingTimings.inhale);
      }
    }

    return () => {
      if (breathTimerRef.current) {
        clearTimeout(breathTimerRef.current);
      }
    };
  }, [isPlaying, breathPhase, breathCycleTime, timeRemaining]);

  // Calculate orb size based on breath phase
  const getOrbSize = () => {
    if (breathPhase === 'inhale') {
      const progress = 1 - (breathCycleTime / breathingTimings.inhale);
      return 150 + (progress * 150); // Grows from 150px to 300px
    } else if (breathPhase === 'pause') {
      return 300; // Maintains full size
    } else if (breathPhase === 'exhale') {
      const progress = 1 - (breathCycleTime / breathingTimings.exhale);
      return 300 - (progress * 150); // Shrinks from 300px to 150px
    }
    return 200; // Default/resting size
  };

  // Get orb color based on phase
  const getOrbColor = () => {
    if (breathPhase === 'inhale') {
      return 'from-blue-400 via-cyan-400 to-teal-400';
    } else if (breathPhase === 'pause') {
      return 'from-teal-400 via-emerald-400 to-green-400';
    } else if (breathPhase === 'exhale') {
      return 'from-green-400 via-emerald-400 to-teal-400';
    }
    return 'from-indigo-400 via-purple-400 to-pink-400';
  };

  // Get phase instruction
  const getPhaseInstruction = () => {
    if (breathPhase === 'inhale') return 'Breathe in slowly';
    if (breathPhase === 'pause') return 'Pause gently';
    if (breathPhase === 'exhale') return 'Release slowly';
    return 'Ready to begin';
  };

  // Get phase emoji
  const getPhaseEmoji = () => {
    if (breathPhase === 'inhale') return '🌬️';
    if (breathPhase === 'pause') return '✨';
    if (breathPhase === 'exhale') return '💨';
    return '🧘';
  };

  // Handle focus rating
  const handleRateFocus = (rating) => {
    setFocusRating(rating);
    setScore(1); // Mark as completed
    
    setTimeout(() => {
      setShowGameOver(true);
    }, 2000);
  };

  // Calculate progress percentage for timer ring
  const progressPercentage = ((60 - timeRemaining) / 60) * 100;
  const circumference = 2 * Math.PI * 120; // radius = 120
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <TeacherGameShell
      title={gameData?.title || "One-Minute Pause"}
      subtitle={gameData?.description || "Learn micro-meditation for immediate mental reset"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={1}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showRating && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Instructions */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                One-Minute Pause
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                Follow the breathing rhythm for 60 seconds: Inhale (4s) → Pause (2s) → Exhale (4s)
              </p>
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200 max-w-2xl mx-auto">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl mb-2">🌬️</div>
                    <div className="font-semibold text-gray-800">Inhale</div>
                    <div className="text-sm text-gray-600">4 seconds</div>
                  </div>
                  <div>
                    <div className="text-3xl mb-2">✨</div>
                    <div className="font-semibold text-gray-800">Pause</div>
                    <div className="text-sm text-gray-600">2 seconds</div>
                  </div>
                  <div>
                    <div className="text-3xl mb-2">💨</div>
                    <div className="font-semibold text-gray-800">Exhale</div>
                    <div className="text-sm text-gray-600">4 seconds</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timer and Breathing Animation */}
            <div className="flex flex-col items-center justify-center min-h-[400px] mb-8">
              {/* Circular Timer */}
              <div className="relative mb-8">
                <svg className="transform -rotate-90" width="280" height="280">
                  {/* Background circle */}
                  <circle
                    cx="140"
                    cy="140"
                    r="120"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="140"
                    cy="140"
                    r="120"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                    <div className="text-4xl font-bold text-gray-800">
                      {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">remaining</div>
                  </div>
                </div>
              </div>

              {/* Breathing Orb */}
              <motion.div
                className="mb-6"
              >
                <motion.div
                  animate={{
                    scale: breathPhase === 'inhale' ? [1, 1.2, 1.2] : breathPhase === 'exhale' ? [1.2, 1, 1] : [1.2, 1.2, 1.2],
                    width: `${getOrbSize()}px`,
                    height: `${getOrbSize()}px`
                  }}
                  transition={{
                    duration: breathCycleTime || 4,
                    repeat: isPlaying ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                  className={`rounded-full bg-gradient-to-br ${getOrbColor()} shadow-2xl flex items-center justify-center transition-all duration-1000`}
                  style={{
                    width: `${getOrbSize()}px`,
                    height: `${getOrbSize()}px`
                  }}
                >
                  <div className="text-6xl">{getPhaseEmoji()}</div>
                </motion.div>
              </motion.div>

              {/* Phase Instruction */}
              <div className="text-center mb-8">
                <motion.div
                  key={breathPhase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-lg"
                >
                  {getPhaseInstruction()}
                </motion.div>
                {isPlaying && (
                  <p className="text-gray-500 mt-3">
                    {breathCycleTime} seconds
                  </p>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                {!isPlaying && timeRemaining === 60 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startExercise}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Start One-Minute Pause
                  </motion.button>
                )}
                
                {isPlaying && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={togglePause}
                      className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-5 h-5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Resume
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetExercise}
                      className="bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Reset
                    </motion.button>
                  </>
                )}
              </div>

              {/* Gentle Background Visualization */}
              {isPlaying && (
                <div className="mt-8 w-full max-w-md">
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: `${progressPercentage}%` }}
                      className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>0s</span>
                    <span>30s</span>
                    <span>60s</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {showRating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                One-Minute Pause Complete!
              </h2>
              <p className="text-gray-600 text-lg">
                Rate your focus level after this micro-meditation
              </p>
            </div>

            {/* Focus Rating */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-8 border-2 border-indigo-200 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                How focused do you feel now? (1 = scattered, 10 = very focused)
              </h3>
              <div className="flex justify-center gap-3 flex-wrap mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                  <motion.button
                    key={rating}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRateFocus(rating)}
                    className={`w-14 h-14 rounded-full border-2 transition-all font-bold text-lg ${
                      focusRating === rating
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-indigo-600 scale-110 shadow-lg'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                    }`}
                  >
                    {rating}
                  </motion.button>
                ))}
              </div>
              {focusRating && (
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    Focus Level: {focusRating}/10
                  </p>
                  <p className="text-sm text-gray-600">
                    {focusRating >= 7
                      ? "Excellent! You're very focused and present."
                      : focusRating >= 5
                      ? "Good! You're more focused than before."
                      : "Keep practicing! Each pause helps build your focus."}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-6xl mb-6"
            >
              {focusRating >= 7 ? '🌟' : focusRating >= 5 ? '✨' : '🧘'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Micro-Meditation Complete!
            </h2>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                You completed a one-minute pause and rated your focus as {focusRating}/10.
              </p>
              <p className="text-gray-600">
                Micro-meditation is a powerful tool for immediate mental reset. Even one minute of focused breathing can help you feel more present and ready for your next task.
              </p>
            </div>

            {/* Focus Rating Summary */}
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Target className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Your Focus Level: {focusRating}/10
                </h3>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 max-w-md mx-auto">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(focusRating / 10) * 100}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className={`h-4 rounded-full ${
                    focusRating >= 7
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : focusRating >= 5
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                  }`}
                />
              </div>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Encourage one-minute pause between class transitions. Use this micro-meditation during the brief moments between classes—after students leave, before the next class arrives, or during your planning period. Simply start the timer, follow the breathing rhythm (inhale-pause-exhale), and let the 60 seconds reset your mental state. This practice helps you transition from one class to the next with clarity and presence. You can also use it before important meetings, after difficult conversations, or anytime you need a quick mental reset. The one-minute pause is small enough to fit into a busy teaching day but powerful enough to make a real difference in your focus and wellbeing. Share this practice with colleagues and consider starting staff meetings with a one-minute pause to help everyone arrive present and focused.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default OneMinutePause;

