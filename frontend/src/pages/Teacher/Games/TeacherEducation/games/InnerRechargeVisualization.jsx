import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Play, Pause, RotateCcw, Heart, Sparkles, Sun, Battery } from "lucide-react";

const InnerRechargeVisualization = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-28";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [phase, setPhase] = useState('ready'); // ready, breathing, visualization, rating, complete
  const [breathPhase, setBreathPhase] = useState('idle'); // idle, inhale, hold, exhale
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathCycle, setBreathCycle] = useState(0);
  const [visualizationProgress, setVisualizationProgress] = useState(0);
  const [calmRating, setCalmRating] = useState(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);
  
  const timerRef = useRef(null);
  const speechSynthRef = useRef(null);
  const visualizationTimerRef = useRef(null);

  // Breathing timings (4-4-4 pattern)
  const breathingTimings = {
    inhale: 4,
    hold: 4,
    exhale: 4
  };

  // Visualization steps with guided instructions
  const visualizationSteps = [
    {
      id: 1,
      instruction: "Imagine a warm, golden light gathering above you",
      duration: 5,
      color: "from-yellow-400 via-amber-400 to-orange-400"
    },
    {
      id: 2,
      instruction: "Feel this warm light gently flowing down into your heart center",
      duration: 5,
      color: "from-orange-400 via-pink-400 to-rose-400"
    },
    {
      id: 3,
      instruction: "Visualize this light filling your compassion center, recharging your empathy reserves",
      duration: 6,
      color: "from-rose-400 via-purple-400 to-indigo-400"
    },
    {
      id: 4,
      instruction: "Feel the warmth spreading through your body, restoring your energy",
      duration: 4,
      color: "from-indigo-400 via-blue-400 to-cyan-400"
    }
  ];

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthRef.current = window.speechSynthesis;
    }
  }, []);

  const speakText = (text) => {
    if (!speechSynthRef.current) return;
    
    speechSynthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.75;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    speechSynthRef.current.speak(utterance);
  };

  const startBreathing = () => {
    setPhase('breathing');
    setIsPlaying(true);
    setBreathPhase('inhale');
    setTimeRemaining(breathingTimings.inhale);
    setBreathCycle(0);
  };

  const togglePause = () => {
    setIsPlaying(!isPlaying);
    if (speechSynthRef.current) {
      if (!isPlaying) {
        speechSynthRef.current.pause();
      } else {
        speechSynthRef.current.resume();
      }
    }
  };

  const resetExercise = () => {
    setIsPlaying(false);
    setPhase('ready');
    setBreathPhase('idle');
    setTimeRemaining(0);
    setBreathCycle(0);
    setVisualizationProgress(0);
    setCalmRating(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (visualizationTimerRef.current) {
      clearTimeout(visualizationTimerRef.current);
    }
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
    }
  };

  // Handle breathing cycle
  useEffect(() => {
    if (!isPlaying || phase !== 'breathing') return;

    if (timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else {
      // Move to next phase
      if (breathPhase === 'inhale') {
        setBreathPhase('hold');
        setTimeRemaining(breathingTimings.hold);
      } else if (breathPhase === 'hold') {
        setBreathPhase('exhale');
        setTimeRemaining(breathingTimings.exhale);
      } else if (breathPhase === 'exhale') {
        const newCycle = breathCycle + 1;
        setBreathCycle(newCycle);
        
        if (newCycle < 3) {
          // Continue with next breath cycle
          setBreathPhase('inhale');
          setTimeRemaining(breathingTimings.inhale);
        } else {
          // Completed 3 cycles, move to visualization
          setIsPlaying(false);
          setBreathPhase('idle');
          setPhase('visualization');
          setVisualizationProgress(0);
          // Start visualization after a brief pause
          setTimeout(() => {
            setIsPlaying(true);
          }, 500);
        }
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, phase, breathPhase, timeRemaining, breathCycle]);

  // Handle visualization phase
  useEffect(() => {
    if (phase !== 'visualization' || !isPlaying) return;

    const currentStep = visualizationSteps[visualizationProgress];
    
    if (!currentStep) {
      // All steps complete
      setIsPlaying(false);
      setPhase('rating');
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
      return;
    }

    // Speak the instruction
    speakText(currentStep.instruction);

    // Move to next step after duration
    visualizationTimerRef.current = setTimeout(() => {
      if (visualizationProgress < visualizationSteps.length - 1) {
        setVisualizationProgress(prev => prev + 1);
      } else {
        // All steps complete
        setIsPlaying(false);
        setPhase('rating');
        if (speechSynthRef.current) {
          speechSynthRef.current.cancel();
        }
      }
    }, currentStep.duration * 1000);

    return () => {
      if (visualizationTimerRef.current) {
        clearTimeout(visualizationTimerRef.current);
      }
    };
  }, [phase, isPlaying, visualizationProgress]);

  const handleRateCalm = (rating) => {
    setCalmRating(rating);
    setScore(1);
    setTimeout(() => {
      setShowGameOver(true);
    }, 2000);
  };

  // Calculate orb/light size based on phase
  const getOrbSize = () => {
    if (phase === 'breathing') {
      if (breathPhase === 'inhale') {
        const progress = 1 - (timeRemaining / breathingTimings.inhale);
        return 150 + (progress * 200); // Grows from 150px to 350px
      } else if (breathPhase === 'hold') {
        return 350; // Maintains full size
      } else if (breathPhase === 'exhale') {
        const progress = 1 - (timeRemaining / breathingTimings.exhale);
        return 350 - (progress * 200); // Shrinks from 350px to 150px
      }
      return 250;
    } else if (phase === 'visualization') {
      // Growing energy visualization
      const progress = (visualizationProgress + 1) / visualizationSteps.length;
      return 200 + (progress * 250); // Grows during visualization
    }
    return 250;
  };

  // Get orb/light color based on phase
  const getOrbColor = () => {
    if (phase === 'breathing') {
      if (breathPhase === 'inhale') {
        return 'from-blue-400 via-cyan-400 to-teal-400';
      } else if (breathPhase === 'hold') {
        return 'from-teal-400 via-emerald-400 to-green-400';
      } else if (breathPhase === 'exhale') {
        return 'from-green-400 via-emerald-400 to-teal-400';
      }
      return 'from-indigo-400 via-purple-400 to-pink-400';
    } else if (phase === 'visualization') {
      const step = visualizationSteps[visualizationProgress];
      return step ? step.color : 'from-yellow-400 via-amber-400 to-orange-400';
    }
    return 'from-indigo-400 via-purple-400 to-pink-400';
  };

  // Get phase instruction
  const getPhaseInstruction = () => {
    if (phase === 'breathing') {
      if (breathPhase === 'inhale') return 'Breathe in slowly and deeply';
      if (breathPhase === 'hold') return 'Hold your breath gently';
      if (breathPhase === 'exhale') return 'Release slowly and completely';
      return 'Ready to begin breathing';
    } else if (phase === 'visualization') {
      const step = visualizationSteps[visualizationProgress];
      return step ? step.instruction : 'Visualizing...';
    }
    return '';
  };

  const currentVisualizationStep = visualizationSteps[visualizationProgress];

  return (
    <TeacherGameShell
      title={gameData?.title || "Inner Recharge Visualization"}
      subtitle={gameData?.description || "Mentally recharge empathy reserves using guided imagery"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={1}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {phase === 'ready' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">✨</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Inner Recharge Visualization
            </h2>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed max-w-2xl mx-auto">
              This guided visualization will help you recharge your empathy reserves. 
              We'll start with calming breaths, then visualize warm light refilling your compassion center.
            </p>
            <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200 mb-6 max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-800 mb-3">What to expect:</h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li>• 3 calming breath cycles (Inhale → Hold → Exhale)</li>
                <li>• Guided visualization of warm light recharging your empathy</li>
                <li>• Self-rating of your calm level</li>
                <li>• Total time: ~2-3 minutes</li>
              </ul>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startBreathing}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
            >
              <Play className="w-6 h-6" />
              Begin Visualization
            </motion.button>
          </div>
        )}

        {phase === 'breathing' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Calming Breath Cycles
              </h2>
              <p className="text-gray-600">
                Cycle {breathCycle + 1} of 3
              </p>
            </div>

            {/* Breathing Orb */}
            <div className="flex items-center justify-center mb-8 min-h-[400px]">
              <motion.div
                animate={{
                  width: `${getOrbSize()}px`,
                  height: `${getOrbSize()}px`,
                }}
                transition={{ duration: breathPhase === 'hold' ? 0.3 : 4, ease: "easeInOut" }}
                className={`rounded-full bg-gradient-to-br ${getOrbColor()} shadow-2xl flex items-center justify-center relative`}
                style={{
                  filter: 'drop-shadow(0 0 40px rgba(255, 215, 0, 0.6))',
                }}
              >
                <motion.div
                  animate={{
                    scale: breathPhase === 'hold' ? [1, 1.1, 1] : 1,
                    opacity: breathPhase === 'hold' ? [0.8, 1, 0.8] : 1
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl"
                >
                  {breathPhase === 'inhale' ? '🌬️' : breathPhase === 'hold' ? '✨' : '💨'}
                </motion.div>
              </motion.div>
            </div>

            {/* Instruction */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200 mb-6 text-center">
              <p className="text-2xl font-bold text-blue-800 mb-2">
                {getPhaseInstruction()}
              </p>
              {timeRemaining > 0 && (
                <p className="text-4xl font-bold text-blue-600">
                  {timeRemaining}
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
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
                onClick={resetExercise}
                className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </motion.button>
            </div>
          </div>
        )}

        {phase === 'visualization' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Guided Visualization
              </h2>
              <p className="text-gray-600">
                Step {visualizationProgress + 1} of {visualizationSteps.length}
              </p>
            </div>

            {/* Glowing Energy Visual */}
            <div className="flex items-center justify-center mb-8 min-h-[400px] relative">
              <motion.div
                animate={{
                  width: `${getOrbSize()}px`,
                  height: `${getOrbSize()}px`,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={`rounded-full bg-gradient-to-br ${getOrbColor()} shadow-2xl flex items-center justify-center relative`}
                style={{
                  filter: 'drop-shadow(0 0 60px rgba(255, 215, 0, 0.8))',
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-7xl"
                >
                  {currentVisualizationStep?.id === 1 ? '☀️' : 
                   currentVisualizationStep?.id === 2 ? '💛' : 
                   currentVisualizationStep?.id === 3 ? '✨' : 
                   currentVisualizationStep?.id === 4 ? '🌟' : '💫'}
                </motion.div>
              </motion.div>
              
              {/* Heart center visualization */}
              {currentVisualizationStep && (currentVisualizationStep.id === 2 || currentVisualizationStep.id === 3) && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute"
                >
                  <Heart className="w-24 h-24 text-red-400 fill-red-400" />
                </motion.div>
              )}
            </div>

            {/* Guided Instruction */}
            {currentVisualizationStep && (
              <motion.div
                key={currentVisualizationStep.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-br ${currentVisualizationStep.color} bg-opacity-20 rounded-xl p-6 border-2 border-yellow-300 mb-6 text-center`}
              >
                <p className="text-2xl font-bold text-gray-800 mb-2">
                  {currentVisualizationStep.instruction}
                </p>
                <p className="text-gray-600 italic">
                  Close your eyes and follow the visualization...
                </p>
              </motion.div>
            )}

            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((visualizationProgress + 1) / visualizationSteps.length) * 100}%` }}
                  className={`bg-gradient-to-r ${currentVisualizationStep?.color || 'from-yellow-400 to-orange-400'} h-3 rounded-full`}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetExercise}
                className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </motion.button>
            </div>
          </div>
        )}

        {phase === 'rating' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">💫</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Visualization Complete
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              How calm and recharged do you feel now?
            </p>

            {/* Calm Rating Options */}
            <div className="grid grid-cols-5 gap-4 mb-8 max-w-2xl mx-auto">
              {[1, 2, 3, 4, 5].map((rating) => (
                <motion.button
                  key={rating}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRateCalm(rating)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    calmRating === rating
                      ? 'border-purple-500 bg-gradient-to-br from-purple-100 to-pink-100 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-4xl mb-2">
                    {rating === 1 ? '😟' : rating === 2 ? '😐' : rating === 3 ? '🙂' : rating === 4 ? '😊' : '😌'}
                  </div>
                  <div className={`font-bold text-lg ${
                    calmRating === rating ? 'text-purple-700' : 'text-gray-700'
                  }`}>
                    {rating}
                  </div>
                  {rating === 1 && <div className="text-xs text-gray-500 mt-1">Very Low</div>}
                  {rating === 3 && <div className="text-xs text-gray-500 mt-1">Moderate</div>}
                  {rating === 5 && <div className="text-xs text-gray-500 mt-1">Very Calm</div>}
                </motion.button>
              ))}
            </div>

            {calmRating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200"
              >
                <p className="text-lg text-green-800 font-semibold">
                  {calmRating >= 4
                    ? "Wonderful! You've successfully recharged your empathy reserves. You're feeling calm and restored."
                    : calmRating >= 3
                    ? "Good! You're feeling more balanced. Regular practice will help you recharge more deeply."
                    : "That's okay. Visualization takes practice. Try again when you have a quiet moment."}
                </p>
              </motion.div>
            )}
          </div>
        )}

        {showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-6xl mb-6"
            >
              {calmRating >= 4 ? '✨' : calmRating >= 3 ? '💫' : '🌟'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Recharge Complete!
            </h2>
            <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                {calmRating >= 4
                  ? "Excellent! You've successfully visualized recharging your empathy reserves. The warm light has filled your compassion center, restoring your capacity to care. You're ready to engage with compassion while maintaining your energy."
                  : calmRating >= 3
                  ? "Good work! You've practiced the visualization and started to recharge. With regular practice, this technique will become more effective at restoring your empathy reserves. Keep practicing!"
                  : "You've completed the visualization practice. Like any skill, visualization improves with regular practice. Try this exercise again when you have a quiet moment, and you'll find it becomes more effective over time."}
              </p>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Do this between classes to prevent emotional depletion. The Inner Recharge Visualization is perfect for quick energy restoration between classes, during breaks, or before challenging interactions. Even a 2-3 minute visualization can significantly restore your empathy reserves. Practice this regularly, and it becomes a powerful tool for preventing emotional depletion. Use it proactively, not just reactively—recharge before you're completely drained. Share this technique with colleagues and create a culture where taking a moment to recharge is normalized and encouraged.
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

export default InnerRechargeVisualization;

