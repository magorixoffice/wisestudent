import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Play, Pause, RotateCcw, Moon, Sun, Heart, CheckCircle, Lightbulb } from "lucide-react";

const AfterSchoolReset = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-33";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [phase, setPhase] = useState('ready'); // ready, close, breathe, thank, reflect, complete
  const [breathPhase, setBreathPhase] = useState('idle'); // idle, inhale, hold, exhale
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathCycle, setBreathCycle] = useState(0);
  const [lightBrightness, setLightBrightness] = useState(100); // 100% = bright, 0% = dark
  const [reflection, setReflection] = useState('');
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);
  
  const timerRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const speechSynthRef = useRef(null);

  // Breathing timings (4-4-4 pattern)
  const breathingTimings = {
    inhale: 4,
    hold: 4,
    exhale: 4
  };

  // Reset steps configuration
  const resetSteps = [
    {
      id: 'close',
      title: 'Close',
      instruction: 'Visualize closing your classroom. See the lights gradually fading as you mentally transition from work to rest.',
      duration: 10, // 10 seconds for closing/fading
      color: 'from-indigo-500 via-purple-500 to-pink-500',
      icon: '🌆',
      emoji: '🌙'
    },
    {
      id: 'breathe',
      title: 'Breathe',
      instruction: 'Take 3 calming breaths to release the day. Inhale peace, exhale the day\'s tensions.',
      duration: 36, // 3 cycles × 12 seconds each
      color: 'from-blue-500 via-cyan-500 to-teal-500',
      icon: '🌬️',
      emoji: '💨'
    },
    {
      id: 'thank',
      title: 'Thank the Day',
      instruction: 'Take a moment to acknowledge one thing from today that you\'re grateful for. This gratitude helps create closure.',
      duration: 15, // 15 seconds for gratitude
      color: 'from-amber-500 via-yellow-500 to-orange-500',
      icon: '🙏',
      emoji: '✨'
    }
  ];

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

  const startReset = () => {
    setPhase('close');
    setIsPlaying(true);
    startClosePhase();
  };

  const startClosePhase = () => {
    // Gradually fade lights from 100% to 30%
    setLightBrightness(100);
    let currentBrightness = 100;
    
    // Clear any existing interval
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }
    
    fadeIntervalRef.current = setInterval(() => {
      currentBrightness -= 7; // Fade over ~10 seconds
      if (currentBrightness <= 30) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
        setLightBrightness(30);
        speakText('You have closed your classroom. The day\'s work is behind you.');
        setTimeout(() => {
          setPhase('breathe');
          startBreathingPhase();
        }, 2000);
      } else {
        setLightBrightness(currentBrightness);
      }
    }, 700);
  };

  const startBreathingPhase = () => {
    setIsPlaying(true);
    setBreathPhase('inhale');
    setTimeRemaining(breathingTimings.inhale);
    setBreathCycle(0);
  };

  const startThankPhase = () => {
    setPhase('thank');
    setIsPlaying(true);
    setTimeRemaining(15);
    speakText('Take a moment to acknowledge one thing from today that you are grateful for. This gratitude helps create closure.');
    
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsPlaying(false);
          setPhase('reflect');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle breathing cycle
  useEffect(() => {
    if (!isPlaying || phase !== 'breathe') return;

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
          // Completed 3 cycles, move to thank phase
          setIsPlaying(false);
          setBreathPhase('idle');
          setTimeout(() => {
            startThankPhase();
          }, 1000);
        }
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, phase, breathPhase, timeRemaining, breathCycle]);

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
    setLightBrightness(100);
    setReflection('');
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
    }
  };

  const handleReflectionSubmit = () => {
    if (reflection.trim()) {
      setScore(1);
      setTimeout(() => {
        setShowGameOver(true);
      }, 1000);
    }
  };

  // Calculate orb size based on breath phase
  const getOrbSize = () => {
    if (phase === 'breathe') {
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
    }
    return 250;
  };

  // Get phase instruction
  const getPhaseInstruction = () => {
    if (phase === 'close') {
      return 'Visualize the classroom lights gradually fading...';
    } else if (phase === 'breathe') {
      if (breathPhase === 'inhale') return 'Breathe in peace and calm';
      if (breathPhase === 'hold') return 'Hold gently';
      if (breathPhase === 'exhale') return 'Release the day\'s tensions';
      return 'Ready to breathe';
    } else if (phase === 'thank') {
      return 'Take a moment to acknowledge something you\'re grateful for from today...';
    }
    return '';
  };

  const currentStep = resetSteps.find(s => s.id === phase);
  const progressPercentage = phase === 'ready' ? 0 : phase === 'close' ? 33 : phase === 'breathe' ? 66 : phase === 'thank' ? 90 : 100;

  return (
    <TeacherGameShell
      title={gameData?.title || "After-School Reset"}
      subtitle={gameData?.description || "Practice end-of-day mental separation techniques"}
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
            <div className="text-6xl mb-6">🌆</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              After-School Reset
            </h2>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed max-w-2xl mx-auto">
              Practice end-of-day mental separation techniques with this 3-step reset ritual. 
              Close your classroom mentally, breathe away the day's tensions, and thank the day before transitioning home.
            </p>
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200 mb-6 max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-800 mb-3">The 3 Steps:</h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li>• <strong>Close:</strong> Visualize classroom lights fading as you transition from work</li>
                <li>• <strong>Breathe:</strong> Take 3 calming breaths to release the day's tensions</li>
                <li>• <strong>Thank the Day:</strong> Acknowledge one thing you're grateful for from today</li>
              </ul>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startReset}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
            >
              <Play className="w-6 h-6" />
              Begin Reset
            </motion.button>
          </div>
        )}

        {(phase === 'close' || phase === 'breathe' || phase === 'thank') && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>
                  {phase === 'close' && 'Step 1: Close'}
                  {phase === 'breathe' && 'Step 2: Breathe'}
                  {phase === 'thank' && 'Step 3: Thank the Day'}
                </span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2 rounded-full"
                />
              </div>
            </div>

            {/* Classroom Visualization with Fading Lights */}
            <div className="relative mb-8 min-h-[400px] flex items-center justify-center">
              {/* Classroom background with adjustable brightness */}
              <motion.div
                animate={{ 
                  opacity: lightBrightness / 100,
                  filter: `brightness(${lightBrightness / 100})`
                }}
                className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-50 rounded-xl border-2 border-amber-200"
              >
                {/* Classroom elements */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {/* Lights */}
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute top-8"
                      style={{ left: `${20 + i * 25}%` }}
                      animate={{
                        opacity: lightBrightness / 100,
                        scale: lightBrightness / 100
                      }}
                    >
                      <Lightbulb className={`w-8 h-8 ${lightBrightness > 50 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
                    </motion.div>
                  ))}
                  
                  {/* Classroom desk/board */}
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-b from-gray-300 to-gray-400 rounded-lg p-6 w-64 h-32 flex items-center justify-center">
                      <span className="text-4xl">📚</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Overlay for breathe phase - breathing orb */}
              {phase === 'breathe' && (
                <motion.div
                  className="absolute rounded-full bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 shadow-2xl flex items-center justify-center"
                  animate={{
                    width: getOrbSize(),
                    height: getOrbSize(),
                  }}
                  transition={{
                    duration: breathPhase === 'hold' ? 0.3 : 4,
                    ease: breathPhase === 'exhale' ? "easeIn" : "easeOut"
                  }}
                  style={{
                    width: getOrbSize(),
                    height: getOrbSize(),
                  }}
                >
                  <div className="text-6xl">
                    {breathPhase === 'inhale' ? '🌬️' : breathPhase === 'hold' ? '✨' : '💨'}
                  </div>
                </motion.div>
              )}

              {/* Overlay for thank phase - gratitude visualization */}
              {phase === 'thank' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute"
                >
                  <div className="w-64 h-64 rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 shadow-2xl flex items-center justify-center">
                    <div className="text-8xl">✨</div>
                  </div>
                </motion.div>
              )}

              {/* Calm soundscape visualization - ripple effects */}
              {isPlaying && (phase === 'breathe' || phase === 'thank') && (
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
            </div>

            {/* Instruction */}
            {currentStep && (
              <div className={`bg-gradient-to-br ${currentStep.color} bg-opacity-20 rounded-xl p-6 border-2 border-indigo-300 mb-6 text-center`}>
                <div className="text-4xl mb-3">{currentStep.emoji}</div>
                <p className="text-xl font-bold text-gray-800 mb-2">
                  {currentStep.instruction}
                </p>
                {phase === 'breathe' && timeRemaining > 0 && (
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {timeRemaining}
                  </p>
                )}
                {phase === 'breathe' && (
                  <p className="text-gray-600 mt-2">
                    Cycle {breathCycle + 1} of 3
                  </p>
                )}
                {phase === 'thank' && timeRemaining > 0 && (
                  <p className="text-2xl font-bold text-amber-600 mt-2">
                    {timeRemaining} seconds
                  </p>
                )}
              </div>
            )}

            {/* Controls */}
            {(phase === 'breathe' || phase === 'thank') && (
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
            )}
          </div>
        )}

        {phase === 'reflect' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">✨</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Brief Reflection
                </h2>
                <p className="text-gray-600 text-lg">
                  Take a moment to reflect on how you feel after this reset. What did you notice?
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reflection (optional):
                </label>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="How do you feel after the reset? What did you notice? What are you grateful for from today?"
                  className="w-full h-32 p-4 rounded-lg border-2 border-indigo-300 focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReflectionSubmit}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Complete Reset
                </motion.button>
              </div>
            </motion.div>
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
              🌙
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Reset Complete
            </h2>
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                You've successfully completed the After-School Reset ritual. The classroom is closed, 
                tensions are released, and gratitude has been acknowledged. You're ready to transition 
                from work to rest, bringing clarity and calm to your personal time.
              </p>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <Moon className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Make this the official closure ritual before leaving school. The After-School Reset is most effective when it becomes a consistent ritual. Practice this reset at the end of every school day, right before you leave. Make it a non-negotiable part of your routine—just like locking the classroom door. This creates a clear mental separation between work and personal time, preventing work thoughts from following you home. Share this ritual with colleagues and encourage each other to practice it. When multiple teachers adopt this ritual, it helps shift the school culture toward healthier work-life boundaries. The reset takes only 2-3 minutes but significantly impacts your ability to truly rest and recharge.
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

export default AfterSchoolReset;

