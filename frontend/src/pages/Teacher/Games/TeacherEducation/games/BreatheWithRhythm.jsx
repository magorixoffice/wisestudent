import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Play, Pause, RotateCcw, Heart } from "lucide-react";

const BreatheWithRhythm = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-14";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentActivity, setCurrentActivity] = useState(0);
  const [breathPhase, setBreathPhase] = useState('idle'); // idle, inhale, hold, exhale
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [calmRating, setCalmRating] = useState(null);
  const [showRating, setShowRating] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [scores, setScores] = useState(Array(5).fill(0)); // Track scores for each activity
  const [completedActivities, setCompletedActivities] = useState(0);
  
  const timerRef = useRef(null);
  const cycleCountRef = useRef(0);

  // Different breathing patterns for each activity
  const breathingPatterns = [
    // Activity 1: Box Breathing (Equal timing)
    {
      name: "Box Breathing",
      description: "Equal timing for all phases - promotes balance and calm",
      timings: { inhale: 4, hold: 4, exhale: 4, postHold: 4 },
      benefits: ["Reduces anxiety", "Improves focus", "Balances nervous system"]
    },
    // Activity 2: 4-7-8 Breathing (Relaxation)
    {
      name: "4-7-8 Relaxation",
      description: "Extended exhale for deep relaxation and sleep preparation",
      timings: { inhale: 4, hold: 7, exhale: 8, postHold: 0 },
      benefits: ["Promotes relaxation", "Better sleep quality", "Reduces racing thoughts"]
    },
    // Activity 3: Energizing Breath (Short cycles)
    {
      name: "Energizing Breath",
      description: "Quick cycles to boost energy and alertness",
      timings: { inhale: 3, hold: 2, exhale: 3, postHold: 0 },
      benefits: ["Increases energy", "Improves alertness", "Boosts circulation"]
    },
    // Activity 4: Deep Belly Breathing
    {
      name: "Deep Belly Breathing",
      description: "Focus on diaphragmatic breathing for stress relief",
      timings: { inhale: 5, hold: 2, exhale: 6, postHold: 0 },
      benefits: ["Activates parasympathetic nervous system", "Reduces cortisol", "Improves digestion"]
    },
    // Activity 5: Alternate Nostril (Simplified)
    {
      name: "Balanced Breathing",
      description: "Equal breathing pattern for mental clarity and emotional balance",
      timings: { inhale: 4, hold: 0, exhale: 4, postHold: 0 },
      benefits: ["Enhances mental clarity", "Balances emotions", "Improves concentration"]
    }
  ];

  // Get current pattern
  const currentPattern = breathingPatterns[currentActivity] || breathingPatterns[0];

  // Start breathing exercise for current activity
  const startBreathing = () => {
    setIsPlaying(true);
    setBreathPhase('inhale');
    setTimeRemaining(currentPattern.timings.inhale);
    cycleCountRef.current = 0;
    setCycleCount(0);
    setCalmRating(null);
    setShowRating(false);
  };

  // Pause/Resume breathing
  const togglePause = () => {
    setIsPlaying(!isPlaying);
  };

  // Reset breathing
  const resetBreathing = () => {
    setIsPlaying(false);
    setBreathPhase('idle');
    setTimeRemaining(0);
    cycleCountRef.current = 0;
    setCycleCount(0);
    setCalmRating(null);
    setShowRating(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  // Reset entire game
  const resetGame = () => {
    setCurrentActivity(0);
    setScores(Array(5).fill(0));
    setCompletedActivities(0);
    resetBreathing();
    setShowGameOver(false);
  };

  // Handle breathing cycle
  useEffect(() => {
    if (!isPlaying) return;

    if (timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else {
      // Move to next phase
      if (breathPhase === 'inhale') {
        setBreathPhase('hold');
        setTimeRemaining(currentPattern.timings.hold);
      } else if (breathPhase === 'hold') {
        setBreathPhase('exhale');
        setTimeRemaining(currentPattern.timings.exhale);
      } else if (breathPhase === 'exhale') {
        cycleCountRef.current += 1;
        setCycleCount(cycleCountRef.current);
        
        // Complete 3 breath cycles
        if (cycleCountRef.current < 3) {
          setBreathPhase('inhale');
          setTimeRemaining(currentPattern.timings.inhale);
        } else {
          // Completed 3 cycles, show rating
          setIsPlaying(false);
          setBreathPhase('idle');
          setShowRating(true);
        }
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, timeRemaining, breathPhase]);

  // Handle calm level rating
  const handleRateCalm = (rating) => {
    setCalmRating(rating);
    
    // Update scores array
    const newScores = [...scores];
    newScores[currentActivity] = 1;
    setScores(newScores);
    
    // Move to next activity or finish
    setTimeout(() => {
      if (currentActivity < 4) {
        // Move to next activity
        setCurrentActivity(currentActivity + 1);
        setCompletedActivities(completedActivities + 1);
        resetBreathing();
        setShowRating(false);
      } else {
        // All activities completed
        setCompletedActivities(5);
        setShowGameOver(true);
      }
    }, 2000);
  };

  // Calculate orb size based on breath phase
  const getOrbSize = () => {
    if (breathPhase === 'inhale') {
      const progress = 1 - (timeRemaining / currentPattern.timings.inhale);
      return 120 + (progress * 180); // Grows from 120px to 300px
    } else if (breathPhase === 'hold') {
      return 300; // Maintains full size
    } else if (breathPhase === 'exhale') {
      const progress = 1 - (timeRemaining / currentPattern.timings.exhale);
      return 300 - (progress * 180); // Shrinks from 300px to 120px
    }
    return 200; // Default/resting size
  };

  // Get orb color based on phase
  const getOrbColor = () => {
    if (breathPhase === 'inhale') {
      return 'from-blue-400 via-cyan-400 to-teal-400';
    } else if (breathPhase === 'hold') {
      return 'from-teal-400 via-emerald-400 to-green-400';
    } else if (breathPhase === 'exhale') {
      return 'from-green-400 via-emerald-400 to-teal-400';
    }
    return 'from-indigo-400 via-purple-400 to-pink-400';
  };

  // Get phase emoji
  const getPhaseEmoji = () => {
    if (breathPhase === 'inhale') return '🌬️';
    if (breathPhase === 'hold') return '✨';
    if (breathPhase === 'exhale') return '💨';
    return '🧘';
  };

  // Get phase instruction
  const getPhaseInstruction = () => {
    if (breathPhase === 'inhale') return 'Breathe in slowly and deeply';
    if (breathPhase === 'hold') return 'Hold your breath gently';
    if (breathPhase === 'exhale') return 'Release slowly and completely';
    return 'Ready to begin';
  };

  return (
    <TeacherGameShell
      title={gameData?.title || "Breathe with Rhythm"}
      subtitle={gameData?.description || "Complete 5 breathing activities to master rhythmic breathing techniques"}
      showGameOver={showGameOver}
      score={scores.reduce((a, b) => a + b, 0)}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentActivity + 0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {/* Activity Progress */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Breathing Activities</h3>
              <span className="text-sm font-medium text-gray-600">
                {completedActivities} of 5 completed
              </span>
            </div>
            <div className="flex gap-2">
              {Array(5).fill(0).map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-3 rounded-full ${
                    index < completedActivities 
                      ? 'bg-green-500' 
                      : index === currentActivity 
                        ? 'bg-blue-500' 
                        : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {!showRating ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            {/* Instructions */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Activity {currentActivity + 1}: {currentPattern.name}
              </h2>
              <p className="text-gray-600 mb-4">
                {currentPattern.description}
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Benefits:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {currentPattern.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-blue-500">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-xl p-6 border-2 border-blue-200 max-w-2xl mx-auto">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-3xl mb-2">🌬️</div>
                    <div className="font-semibold text-gray-800">Inhale</div>
                    <div className="text-sm text-gray-600">{currentPattern.timings.inhale}s</div>
                  </div>
                  {currentPattern.timings.hold > 0 && (
                    <div>
                      <div className="text-3xl mb-2">✨</div>
                      <div className="font-semibold text-gray-800">Hold</div>
                      <div className="text-sm text-gray-600">{currentPattern.timings.hold}s</div>
                    </div>
                  )}
                  <div>
                    <div className="text-3xl mb-2">💨</div>
                    <div className="font-semibold text-gray-800">Exhale</div>
                    <div className="text-sm text-gray-600">{currentPattern.timings.exhale}s</div>
                  </div>
                  {currentPattern.timings.postHold > 0 && (
                    <div>
                      <div className="text-3xl mb-2">🧘</div>
                      <div className="font-semibold text-gray-800">Rest</div>
                      <div className="text-sm text-gray-600">{currentPattern.timings.postHold}s</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Breathing orb animation */}
            <div className="flex flex-col items-center justify-center mb-8 min-h-[400px]">
              {breathPhase === 'idle' ? (
                <motion.button
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startBreathing}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <Play className="w-6 h-6" />
                  Start Breathing Exercise
                </motion.button>
              ) : (
                <div className="flex flex-col items-center gap-8 w-full">
                  {/* Background soundscape visualization */}
                  <div className="relative w-full max-w-md">
                    {/* Ripple effects for ambient sound */}
                    {isPlaying && (
                      <>
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute inset-0 rounded-full border-2 border-blue-300/30 mx-auto"
                            style={{ width: '400px', height: '400px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                            animate={{
                              scale: [1, 1.5, 2],
                              opacity: [0.3, 0.1, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              delay: i * 0.5,
                              ease: "easeOut"
                            }}
                          />
                        ))}
                      </>
                    )}

                    {/* Breathing orb */}
                    <div className="relative flex items-center justify-center">
                      <motion.div
                        animate={{
                          scale: getOrbSize() / 200,
                        }}
                        transition={{
                          duration: breathPhase === 'inhale' ? currentPattern.timings.inhale : 
                                   breathPhase === 'hold' ? currentPattern.timings.hold : 
                                   currentPattern.timings.exhale,
                          ease: breathPhase === 'exhale' ? "easeIn" : "easeOut"
                        }}
                        className={`w-64 h-64 rounded-full bg-gradient-to-br ${getOrbColor()} shadow-2xl flex items-center justify-center relative`}
                      >
                        {/* Inner glow */}
                        <motion.div
                          animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [0.85, 1, 0.85]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="absolute inset-4 rounded-full bg-white/20 backdrop-blur-sm"
                        />
                        
                        {/* Center content */}
                        <div className="relative z-10 text-center">
                          <div className="text-6xl mb-2">{getPhaseEmoji()}</div>
                          <div className="text-4xl font-bold text-white mb-1">
                            {timeRemaining}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Phase instructions */}
                  <div className="text-center">
                    <motion.div
                      key={breathPhase}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <h3 className="text-3xl font-bold text-gray-900">
                        {breathPhase === 'inhale' ? 'Breathe In' :
                         breathPhase === 'hold' ? 'Hold' :
                         'Breathe Out'}
                      </h3>
                      <p className="text-lg text-gray-600">
                        {getPhaseInstruction()}
                      </p>
                    </motion.div>
                  </div>

                  {/* Cycle counter */}
                  <div className="text-center">
                    <div className="bg-blue-50 rounded-full px-6 py-2 border-2 border-blue-200">
                      <span className="text-sm font-semibold text-blue-800">
                        Cycle {cycleCount + 1} of 3 • {currentPattern.name}
                      </span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={togglePause}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
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
                      onClick={resetBreathing}
                      className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Reset
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {currentActivity < 4 
                  ? `Great Job on ${currentPattern.name}!` 
                  : 'Congratulations! All Activities Completed!'}
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                {currentActivity < 4 
                  ? `You've completed 3 cycles of ${currentPattern.name}. How do you feel now?`
                  : 'You\'ve completed all 5 diverse breathing techniques! How do you feel overall?'
                }
              </p>
              {currentActivity < 4 && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200 max-w-2xl mx-auto">
                  <h4 className="font-semibold text-green-800 mb-2">Preview: Next Activity</h4>
                  <p className="text-green-700">
                    <strong>{breathingPatterns[(currentActivity + 1) % 5].name}:</strong> {breathingPatterns[(currentActivity + 1) % 5].description}
                  </p>
                </div>
              )}
            </div>

            {/* Calm Rating */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">
                Rate Your Calm Level (1-10)
              </h3>
              <div className="flex items-center justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                  <motion.button
                    key={rating}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRateCalm(rating)}
                    className={`w-12 h-12 rounded-full font-bold text-lg transition-all ${
                      calmRating === rating
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white scale-110 shadow-lg'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {rating}
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-500 max-w-md mx-auto">
                <span>Very Stressed</span>
                <span>Very Calm</span>
              </div>
            </div>

            {calmRating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Heart className="w-6 h-6 text-green-600" />
                  <p className="text-lg font-semibold text-gray-800">
                    Your Calm Level: {calmRating}/10
                  </p>
                </div>
                {calmRating >= 7 ? (
                  <p className="text-gray-700">
                    Excellent! You're feeling very calm. Keep practicing this breathing technique regularly.
                  </p>
                ) : calmRating >= 5 ? (
                  <p className="text-gray-700">
                    Good! You're feeling more centered. Practice this exercise more often to deepen the effect.
                  </p>
                ) : (
                  <p className="text-gray-700">
                    That's okay. Breathing exercises take practice. Try doing this exercise again or extend it to 5 cycles.
                  </p>
                )}
              </motion.div>
            )}

            {/* Teacher Tip */}
            <div className="mt-8 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-900 mb-2">
                💡 Teacher Tip:
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                Encourage staff to use breathing exercises before meetings. This simple 3-step breathing pattern can help reduce tension, improve focus, and create a calmer presence. Share this technique with colleagues during staff wellness sessions.
              </p>
            </div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default BreatheWithRhythm;

