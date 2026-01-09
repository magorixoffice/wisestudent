import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Play, Pause, RotateCcw, Clock, Sparkles, Brain, Volume2 } from "lucide-react";

const GuidedMeditationAudio = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-45";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [phase, setPhase] = useState('ready'); // ready, breathing, meditation, rating, complete
  const [breathPhase, setBreathPhase] = useState('idle'); // idle, inhale, hold, exhale
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathCycle, setBreathCycle] = useState(0);
  const [meditationStep, setMeditationStep] = useState(0);
  const [lightSize, setLightSize] = useState(100);
  const [mentalClarityRating, setMentalClarityRating] = useState(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);
  
  const timerRef = useRef(null);
  const totalTimerRef = useRef(null);
  const speechSynthRef = useRef(null);
  const meditationTimerRef = useRef(null);

  // Total meditation duration: 5 minutes = 300 seconds
  const TOTAL_DURATION = 300;

  // Breathing timings (4-4-4 pattern)
  const breathingTimings = {
    inhale: 4,
    hold: 4,
    exhale: 4
  };

  // Meditation phases with guided audio instructions
  const meditationPhases = [
    {
      id: 1,
      text: "Welcome to this guided meditation. Find a comfortable position. Close your eyes if you feel comfortable, or soften your gaze. This is your time to relax and restore your focus.",
      duration: 15,
      color: "from-indigo-400 via-purple-400 to-pink-400"
    },
    {
      id: 2,
      text: "Let's begin with calming breaths. Take a deep breath in through your nose. Hold it gently. Now release slowly through your mouth. Feel your body beginning to relax.",
      duration: 20,
      color: "from-blue-400 via-cyan-400 to-teal-400"
    },
    {
      id: 3,
      text: "Now, visualize a soft, calm light in the center of your chest. Notice this light. It's warm and peaceful. This light represents your inner calm and clarity.",
      duration: 25,
      color: "from-yellow-300 via-amber-300 to-orange-300"
    },
    {
      id: 4,
      text: "Watch as this calm light begins to expand. It slowly grows outward from your chest, filling your entire torso. Feel the warmth and peace spreading through your body.",
      duration: 30,
      color: "from-orange-300 via-yellow-300 to-amber-300"
    },
    {
      id: 5,
      text: "The light continues expanding. It reaches your arms and hands. Your shoulders relax. Your neck softens. The calm light flows down through your legs and feet. Your entire body is filled with this peaceful, calming energy.",
      duration: 35,
      color: "from-amber-300 via-yellow-200 to-orange-200"
    },
    {
      id: 6,
      text: "Feel this calm light expanding beyond your body. It creates a gentle, protective aura around you. You are surrounded by peace and clarity. Your mind feels clear. Your focus is sharp. You are present and grounded.",
      duration: 40,
      color: "from-orange-200 via-yellow-100 to-amber-100"
    },
    {
      id: 7,
      text: "Rest in this state of calm clarity. Notice how your nervous system feels relaxed. Notice how your mind feels focused. Breathe naturally and let this feeling deepen.",
      duration: 35,
      color: "from-amber-100 via-yellow-50 to-orange-50"
    },
    {
      id: 8,
      text: "Take a moment to appreciate this feeling of calm and mental clarity. Remember, you can return to this place of peace whenever you need it. Your mind is clear. Your body is relaxed. You are ready.",
      duration: 30,
      color: "from-indigo-300 via-purple-300 to-pink-300"
    },
    {
      id: 9,
      text: "Now, slowly begin to bring your awareness back to the present moment. Wiggle your fingers and toes. Take a deep breath. Open your eyes gently when you're ready. You've completed your meditation.",
      duration: 25,
      color: "from-purple-400 via-indigo-400 to-blue-400"
    }
  ];

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthRef.current = window.speechSynthesis;
    }
    return () => {
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
    };
  }, []);

  const speakText = (text) => {
    if (!speechSynthRef.current) return;
    
    speechSynthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.75; // Calm, slow pace
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    speechSynthRef.current.speak(utterance);
  };

  const startMeditation = () => {
    setPhase('breathing');
    setIsPlaying(true);
    setBreathPhase('inhale');
    setTimeRemaining(breathingTimings.inhale);
    setBreathCycle(0);
    setTotalTimeElapsed(0);
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
    setTotalTimeElapsed(0);
    setBreathCycle(0);
    setMeditationStep(0);
    setLightSize(100);
    setMentalClarityRating(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (totalTimerRef.current) {
      clearTimeout(totalTimerRef.current);
    }
    if (meditationTimerRef.current) {
      clearTimeout(meditationTimerRef.current);
    }
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
    }
  };

  // Total time tracker (5 minutes)
  useEffect(() => {
    if (!isPlaying || phase === 'ready' || phase === 'rating' || phase === 'complete') return;

    if (totalTimeElapsed < TOTAL_DURATION) {
      totalTimerRef.current = setTimeout(() => {
        setTotalTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      // 5 minutes complete
      setIsPlaying(false);
      if (phase === 'meditation') {
        setPhase('rating');
      }
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
    }

    return () => {
      if (totalTimerRef.current) {
        clearTimeout(totalTimerRef.current);
      }
    };
  }, [isPlaying, totalTimeElapsed, phase]);

  // Handle breathing cycle (first 3 cycles)
  useEffect(() => {
    if (!isPlaying || phase !== 'breathing') return;

    if (timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else {
      // Move to next breath phase
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
          // Completed 3 cycles, move to meditation
          setBreathPhase('idle');
          setPhase('meditation');
          setMeditationStep(0);
          setLightSize(100);
          // Start first meditation phase
          setTimeout(() => {
            if (meditationPhases[0]) {
              speakText(meditationPhases[0].text);
              meditationTimerRef.current = setTimeout(() => {
                setMeditationStep(1);
              }, meditationPhases[0].duration * 1000);
            }
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

  // Handle meditation phases
  useEffect(() => {
    if (phase !== 'meditation' || !isPlaying || meditationStep === 0) return;

    const currentPhase = meditationPhases[meditationStep];
    
    if (!currentPhase) {
      // All phases complete, but continue until 5 minutes total
      if (totalTimeElapsed >= TOTAL_DURATION - 10) {
        // Near end, prepare for rating
        setIsPlaying(false);
        setPhase('rating');
        if (speechSynthRef.current) {
          speechSynthRef.current.cancel();
        }
      }
      return;
    }

    // Speak the guided instruction
    speakText(currentPhase.text);

    // Update light size based on phase (expanding visualization)
    if (meditationStep >= 3) {
      // Light expansion phases (steps 3-6)
      const expansionPhase = meditationStep - 3;
      const maxExpansion = 400;
      const expansionSteps = 4;
      setLightSize(100 + (expansionPhase / expansionSteps) * (maxExpansion - 100));
    } else if (meditationStep === 2) {
      // Initial light visualization
      setLightSize(100);
    } else {
      setLightSize(100);
    }

    // Move to next phase after duration
    meditationTimerRef.current = setTimeout(() => {
      if (meditationStep < meditationPhases.length - 1) {
        setMeditationStep(prev => prev + 1);
      } else {
        // All guided phases complete, continue silent meditation until 5 minutes
        if (totalTimeElapsed < TOTAL_DURATION - 10) {
          // Continue in silent meditation
          setLightSize(400); // Fully expanded
        }
      }
    }, currentPhase.duration * 1000);

    return () => {
      if (meditationTimerRef.current) {
        clearTimeout(meditationTimerRef.current);
      }
    };
  }, [phase, isPlaying, meditationStep, totalTimeElapsed]);

  const handleRateClarity = (rating) => {
    setMentalClarityRating(rating);
    setScore(1);
    setTimeout(() => {
      setShowGameOver(true);
    }, 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentMeditationPhase = meditationPhases[meditationStep];
  const progressPercentage = (totalTimeElapsed / TOTAL_DURATION) * 100;
  const remainingTime = TOTAL_DURATION - totalTimeElapsed;

  return (
    <TeacherGameShell
      title={gameData?.title || "Guided Meditation Audio"}
      subtitle={gameData?.description || "Relax the nervous system and improve sustained focus"}
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
            <div className="text-6xl mb-6">🧘</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Guided Meditation Audio
            </h2>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed max-w-2xl mx-auto">
              This 5-minute guided meditation will help you relax your nervous system and improve your sustained focus. 
              We'll begin with calming breaths, then visualize a calm light expanding throughout your body and mind.
            </p>
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200 mb-6 max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-center gap-2">
                <Clock className="w-5 h-5" />
                What to expect:
              </h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li>• 3 calming breath cycles (Inhale → Hold → Exhale)</li>
                <li>• Guided audio meditation with visualization</li>
                <li>• Visualization of calm light expanding throughout your body</li>
                <li>• Silent reflection time</li>
                <li>• Self-rating of mental clarity</li>
                <li>• Total time: 5 minutes</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
              <p className="text-sm text-blue-800 flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <span><strong>Audio will play automatically.</strong> Make sure your device volume is on for the guided meditation.</span>
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startMeditation}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
            >
              <Play className="w-6 h-6" />
              Begin Meditation
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

            {/* Breathing Visual */}
            <div className="flex items-center justify-center mb-8 min-h-[400px]">
              <motion.div
                animate={{
                  width: breathPhase === 'inhale' ? '300px' : breathPhase === 'hold' ? '350px' : '250px',
                  height: breathPhase === 'inhale' ? '300px' : breathPhase === 'hold' ? '350px' : '250px',
                }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className={`rounded-full bg-gradient-to-br ${
                  breathPhase === 'inhale' ? 'from-blue-400 via-cyan-400 to-teal-400' :
                  breathPhase === 'hold' ? 'from-teal-400 via-emerald-400 to-green-400' :
                  'from-green-400 via-emerald-400 to-teal-400'
                } shadow-2xl flex items-center justify-center`}
              >
                <motion.div
                  animate={{
                    scale: breathPhase === 'hold' ? [1, 1.1, 1] : 1,
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
                {breathPhase === 'inhale' ? 'Breathe in slowly and deeply' :
                 breathPhase === 'hold' ? 'Hold your breath gently' :
                 'Release slowly and completely'}
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
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
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

        {phase === 'meditation' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Timer and Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">Time Remaining: {formatTime(remainingTime)}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {formatTime(totalTimeElapsed)} / {formatTime(TOTAL_DURATION)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-3 rounded-full"
                />
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Guided Meditation
              </h2>
              <p className="text-gray-600">
                {currentMeditationPhase ? `Step ${meditationStep + 1} of ${meditationPhases.length}` : 'Resting in calm awareness'}
              </p>
            </div>

            {/* Expanding Light Visualization */}
            <div className="flex items-center justify-center mb-8 min-h-[400px] relative">
              <motion.div
                animate={{
                  width: `${lightSize}px`,
                  height: `${lightSize}px`,
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className={`rounded-full bg-gradient-to-br ${currentMeditationPhase?.color || 'from-indigo-400 via-purple-400 to-pink-400'} shadow-2xl flex items-center justify-center relative`}
                style={{
                  filter: `drop-shadow(0 0 ${lightSize / 2}px rgba(255, 215, 0, 0.6))`,
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
                  {meditationStep >= 3 && meditationStep <= 6 ? '✨' : 
                   meditationStep === 2 ? '💡' : 
                   meditationStep >= 7 ? '🌟' : '🧘'}
                </motion.div>
              </motion.div>
              
              {/* Expanding rings effect */}
              {meditationStep >= 4 && (
                <>
                  <motion.div
                    animate={{
                      width: `${lightSize * 1.3}px`,
                      height: `${lightSize * 1.3}px`,
                      opacity: [0.3, 0.1, 0.3]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className={`absolute rounded-full border-4 border-yellow-300`}
                  />
                  <motion.div
                    animate={{
                      width: `${lightSize * 1.6}px`,
                      height: `${lightSize * 1.6}px`,
                      opacity: [0.2, 0.05, 0.2]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                    className={`absolute rounded-full border-4 border-amber-200`}
                  />
                </>
              )}
            </div>

            {/* Current Instruction */}
            {currentMeditationPhase && (
              <motion.div
                key={currentMeditationPhase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-br ${currentMeditationPhase.color} bg-opacity-20 rounded-xl p-6 border-2 border-indigo-200 mb-6 text-center`}
              >
                <p className="text-xl font-bold text-gray-800 mb-2">
                  {currentMeditationPhase.text}
                </p>
                <p className="text-gray-600 italic text-sm">
                  Listen to the guided audio and follow the visualization...
                </p>
              </motion.div>
            )}

            {!currentMeditationPhase && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6 text-center">
                <p className="text-xl font-bold text-gray-800 mb-2">
                  Rest in this state of calm clarity
                </p>
                <p className="text-gray-600 italic">
                  Continue breathing naturally. Let the calm light surround you. Your mind is clear. Your body is relaxed.
                </p>
              </div>
            )}

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
            <div className="text-6xl mb-6">🧠</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Meditation Complete
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              How would you rate your mental clarity and focus now?
            </p>

            {/* Mental Clarity Rating */}
            <div className="grid grid-cols-5 gap-4 mb-8 max-w-2xl mx-auto">
              {[1, 2, 3, 4, 5].map((rating) => (
                <motion.button
                  key={rating}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRateClarity(rating)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    mentalClarityRating === rating
                      ? 'border-indigo-500 bg-gradient-to-br from-indigo-100 to-purple-100 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-indigo-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-4xl mb-2">
                    {rating === 1 ? '😴' : rating === 2 ? '😐' : rating === 3 ? '🙂' : rating === 4 ? '😊' : '🧠'}
                  </div>
                  <div className={`font-bold text-lg ${
                    mentalClarityRating === rating ? 'text-indigo-700' : 'text-gray-700'
                  }`}>
                    {rating}
                  </div>
                  {rating === 1 && <div className="text-xs text-gray-500 mt-1">Foggy</div>}
                  {rating === 3 && <div className="text-xs text-gray-500 mt-1">Clear</div>}
                  {rating === 5 && <div className="text-xs text-gray-500 mt-1">Very Clear</div>}
                </motion.button>
              ))}
            </div>

            {mentalClarityRating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200"
              >
                <p className="text-lg text-green-800 font-semibold">
                  {mentalClarityRating >= 4
                    ? "Excellent! Your nervous system is relaxed and your focus is sharp. You've achieved mental clarity and calm."
                    : mentalClarityRating >= 3
                    ? "Good! You're feeling more clear and focused. Regular practice will deepen these benefits."
                    : "That's okay. Meditation takes practice. With regular sessions, you'll notice greater clarity and focus."}
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
              {mentalClarityRating >= 4 ? '✨' : mentalClarityRating >= 3 ? '🧘' : '🌟'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Meditation Complete!
            </h2>
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {mentalClarityRating >= 4
                  ? "Wonderful! You've completed a full 5-minute guided meditation. Your nervous system is relaxed, and your mind has achieved greater clarity and focus. The calm light has expanded throughout your body, creating a sense of peace and readiness."
                  : mentalClarityRating >= 3
                  ? "Well done! You've completed your meditation practice. Your nervous system has relaxed, and you're experiencing improved mental clarity. Regular practice will strengthen these benefits over time."
                  : "You've completed your meditation practice. Meditation is a skill that deepens with regular practice. Each session builds on the last, improving your ability to relax your nervous system and enhance your focus."}
              </p>
              <div className="bg-white/60 rounded-lg p-4 mt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Duration</p>
                    <p className="text-2xl font-bold text-indigo-600">5:00</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Mental Clarity</p>
                    <p className="text-2xl font-bold text-purple-600">{mentalClarityRating} / 5</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <Brain className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Use before major school events to reduce anxiety. This guided meditation is perfect for calming your nervous system before important moments. Use it before parent-teacher conferences, staff meetings, presentations, difficult conversations, or any situation that causes anxiety. The 5-minute practice helps reset your nervous system, reducing physical tension and mental stress. When your nervous system is relaxed, you think more clearly, communicate more effectively, and make better decisions. Practice this meditation regularly so it becomes a reliable tool you can access whenever needed. Even doing it once a week helps maintain baseline calm. For high-stress periods, use it daily. You can also recommend this to students before exams or presentations—teach them that taking 5 minutes to calm their nervous system improves their performance. Share this technique with colleagues to build a culture of proactive stress management. Remember: a calm teacher creates a calm classroom.
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

export default GuidedMeditationAudio;

