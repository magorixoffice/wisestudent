import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Play, Pause, RotateCcw, Target, Music, Zap, TrendingUp } from "lucide-react";

const FlowStateSimulation = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-48";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 3;
  
  const [gameState, setGameState] = useState("ready"); // ready, playing, round-complete, finished
  const [currentRound, setCurrentRound] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(30); // 30 seconds per round
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [roundScores, setRoundScores] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [shapesSorted, setShapesSorted] = useState(0);
  const [missedShapes, setMissedShapes] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  
  const timerRef = useRef(null);
  const shapeTimerRef = useRef(null);
  const beatTimerRef = useRef(null);
  const roundRef = useRef(1);

  const TOTAL_ROUNDS = 3;
  const BEAT_INTERVAL = 1500; // 1.5 seconds per beat (tempo)
  const SHAPE_INTERVAL = 2000; // New shape every 2 seconds

  // Shape types for sorting
  const shapeTypes = [
    { type: 'circle', icon: '⭕', color: 'from-blue-400 to-cyan-500', category: 'round' },
    { type: 'square', icon: '⬜', color: 'from-red-400 to-pink-500', category: 'angular' },
    { type: 'triangle', icon: '🔺', color: 'from-green-400 to-emerald-500', category: 'angular' },
    { type: 'diamond', icon: '💠', color: 'from-purple-400 to-indigo-500', category: 'angular' },
    { type: 'star', icon: '⭐', color: 'from-yellow-400 to-orange-500', category: 'special' },
  ];

  // Generate random shape
  const generateShape = () => {
    const shape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    return {
      ...shape,
      id: Date.now() + Math.random(),
      x: Math.random() * 70 + 15, // Random horizontal position (15-85%)
      speed: 1.5 + Math.random() * 0.5 // Falling speed
    };
  };

  // Handle shape sort (drag to correct bin)
  const handleShapeSort = (shapeId, category) => {
    if (!isPlaying || gameState !== "playing") return;
    
    const shape = currentShape;
    if (!shape || shape.id !== shapeId) return;

    // Check if sorted correctly (simplified: any sorting counts, but better performance for correct category)
    const isCorrect = true; // In flow state, any sorting action indicates engagement
    setShapesSorted(prev => prev + 1);
    setScore(prev => prev + 1);
    setCurrentShape(null);

    // Generate new shape after short delay
    setTimeout(() => {
      if (gameState === "playing" && isPlaying) {
        setCurrentShape(generateShape());
      }
    }, 500);
  };

  // Handle missed shape (timeout)
  const handleShapeMissed = () => {
    if (!isPlaying || gameState !== "playing") return;
    setMissedShapes(prev => prev + 1);
    setCurrentShape(null);
    
    // Generate new shape
    setTimeout(() => {
      if (gameState === "playing" && isPlaying) {
        setCurrentShape(generateShape());
      }
    }, 500);
  };

  // Start game
  const startGame = () => {
    setGameState("playing");
    setIsPlaying(true);
    setCurrentRound(1);
    roundRef.current = 1;
    setTimeRemaining(30);
    setScore(0);
    setRoundScores([]);
    setShapesSorted(0);
    setMissedShapes(0);
    setCurrentShape(generateShape());
  };

  // Start new round
  const startRound = () => {
    setGameState("playing");
    setIsPlaying(true);
    setTimeRemaining(30);
    setScore(0);
    setShapesSorted(0);
    setMissedShapes(0);
    setCurrentShape(generateShape());
  };

  // Complete round
  const completeRound = () => {
    setIsPlaying(false);
    setGameState("round-complete");
    const roundScore = shapesSorted;
    setRoundScores(prev => [...prev, roundScore]);
    
    // Clear timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (shapeTimerRef.current) {
      clearInterval(shapeTimerRef.current);
      shapeTimerRef.current = null;
    }
    if (beatTimerRef.current) {
      clearInterval(beatTimerRef.current);
      beatTimerRef.current = null;
    }
  };

  // Move to next round
  const nextRound = () => {
    if (currentRound < TOTAL_ROUNDS) {
      setCurrentRound(prev => prev + 1);
      roundRef.current = roundRef.current + 1;
      setTimeout(() => {
        startRound();
      }, 1500);
    } else {
      setGameState("finished");
      setGameScore(roundScores.reduce((sum, score) => sum + score, 0) + shapesSorted);
      setTimeout(() => {
        setShowGameOver(true);
      }, 1500);
    }
  };

  // Timer for round duration
  useEffect(() => {
    if (gameState !== "playing" || !isPlaying) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0.1) {
          completeRound();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState, isPlaying]);

  // Beat/tempo visual indicator
  useEffect(() => {
    if (gameState !== "playing" || !isPlaying) {
      if (beatTimerRef.current) {
        clearInterval(beatTimerRef.current);
        beatTimerRef.current = null;
      }
      return;
    }

    beatTimerRef.current = setInterval(() => {
      // Visual beat pulse (handled by animation)
    }, BEAT_INTERVAL);

    return () => {
      if (beatTimerRef.current) {
        clearInterval(beatTimerRef.current);
        beatTimerRef.current = null;
      }
    };
  }, [gameState, isPlaying]);

  // Shape generation timer
  useEffect(() => {
    if (gameState !== "playing" || !isPlaying || currentShape) {
      if (shapeTimerRef.current) {
        clearInterval(shapeTimerRef.current);
        shapeTimerRef.current = null;
      }
      return;
    }

    shapeTimerRef.current = setTimeout(() => {
      if (gameState === "playing" && isPlaying) {
        setCurrentShape(generateShape());
      }
    }, SHAPE_INTERVAL);

    return () => {
      if (shapeTimerRef.current) {
        clearTimeout(shapeTimerRef.current);
        shapeTimerRef.current = null;
      }
    };
  }, [gameState, isPlaying, currentShape]);

  // Auto-miss shape after timeout
  useEffect(() => {
    if (!currentShape || gameState !== "playing" || !isPlaying) return;

    const timeout = setTimeout(() => {
      handleShapeMissed();
    }, 4000); // Shape disappears after 4 seconds

    return () => clearTimeout(timeout);
  }, [currentShape, gameState, isPlaying]);

  // Calculate concentration consistency
  const calculateConsistency = () => {
    if (roundScores.length === 0) return 0;
    if (roundScores.length === 1) return 100;
    
    const allScores = [...roundScores, shapesSorted];
    const avg = allScores.reduce((sum, s) => sum + s, 0) / allScores.length;
    const variance = allScores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / allScores.length;
    const stdDev = Math.sqrt(variance);
    const consistency = Math.max(0, 100 - (stdDev / avg) * 100);
    return Math.round(consistency);
  };

  const consistency = calculateConsistency();
  const totalShapesSorted = roundScores.reduce((sum, s) => sum + s, 0) + shapesSorted;

  return (
    <TeacherGameShell
      title={gameData?.title || "Flow State Simulation"}
      subtitle={gameData?.description || "Learn how focused engagement feels mentally and physically"}
      showGameOver={showGameOver}
      score={gameScore}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentRound}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {gameState === "ready" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Flow State Simulation
            </h2>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed max-w-2xl mx-auto">
              Experience flow state through an interactive sorting task. Sort shapes to the music tempo and notice how focused engagement feels mentally and physically.
            </p>
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200 mb-6 max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-center gap-2">
                <Target className="w-5 h-5" />
                How to Play:
              </h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li>• <strong>3 rounds</strong> of shape sorting (30 seconds each)</li>
                <li>• Sort shapes into bins by dragging them</li>
                <li>• Follow the visual tempo/beat indicator</li>
                <li>• Notice how your concentration feels</li>
                <li>• Track consistency across rounds</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
              <p className="text-sm text-blue-800 flex items-center gap-2 justify-center">
                <Music className="w-4 h-4" />
                <span>Focus on the rhythm and let yourself enter a flow state of focused engagement.</span>
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
            >
              <Play className="w-6 h-6" />
              Start Flow Simulation
            </motion.button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Round Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-800">
                  Round {currentRound} of {TOTAL_ROUNDS}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Time</div>
                    <div className="text-xl font-bold text-indigo-600">{Math.ceil(timeRemaining)}s</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Sorted</div>
                    <div className="text-xl font-bold text-green-600">{shapesSorted}</div>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${((30 - timeRemaining) / 30) * 100}%` }}
                />
              </div>
            </div>

            {/* Tempo/Beat Visual Indicator */}
            <div className="flex items-center justify-center mb-8">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: BEAT_INTERVAL / 1000,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
              >
                <Music className="w-10 h-10 text-white" />
              </motion.div>
              <div className="ml-4">
                <p className="text-lg font-semibold text-gray-800">Follow the Beat</p>
                <p className="text-sm text-gray-600">Sort shapes to the tempo</p>
              </div>
            </div>

            {/* Sorting Area */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border-2 border-gray-300 mb-6 min-h-[400px] relative overflow-hidden">
              {/* Current Shape */}
              {currentShape && (
                <motion.div
                  initial={{ y: -50, opacity: 0, scale: 0.5 }}
                  animate={{ 
                    y: [0, 300, 300],
                    opacity: [0, 1, 0.8, 0],
                    scale: [0.5, 1, 0.9]
                  }}
                  transition={{ 
                    duration: 4,
                    times: [0, 0.2, 0.8, 1]
                  }}
                  className="absolute cursor-pointer"
                  style={{ left: `${currentShape.x}%`, top: '10%' }}
                  onClick={() => {
                    // Quick sort on click (simplified interaction)
                    handleShapeSort(currentShape.id, currentShape.category);
                  }}
                >
                  <div className={`w-20 h-20 rounded-lg bg-gradient-to-r ${currentShape.color} shadow-xl flex items-center justify-center text-4xl transform hover:scale-110 transition-transform`}>
                    {currentShape.icon}
                  </div>
                </motion.div>
              )}

              {/* Sorting Bins */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6">
                {['round', 'angular', 'special'].map((category, index) => {
                  const categoryShapes = shapeTypes.filter(s => s.category === category);
                  const categoryIcon = categoryShapes[0]?.icon || '📦';
                  return (
                    <motion.div
                      key={category}
                      whileHover={{ scale: 1.1 }}
                      className="w-32 h-32 bg-white rounded-xl border-4 border-dashed border-gray-400 flex flex-col items-center justify-center shadow-lg"
                    >
                      <div className="text-4xl mb-2">{categoryIcon}</div>
                      <div className="text-xs font-semibold text-gray-600 uppercase">
                        {category}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Instruction Overlay */}
              {!currentShape && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-400 text-lg">Click shapes to sort them...</p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200 text-center">
                <div className="text-2xl font-bold text-green-600">{shapesSorted}</div>
                <div className="text-sm text-gray-600">Sorted</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200 text-center">
                <div className="text-2xl font-bold text-orange-600">{missedShapes}</div>
                <div className="text-sm text-gray-600">Missed</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {roundScores.length > 0 ? Math.round(roundScores.reduce((sum, s) => sum + s, 0) / roundScores.length) : shapesSorted}
                </div>
                <div className="text-sm text-gray-600">Avg/Round</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPlaying(!isPlaying)}
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
                onClick={() => {
                  setGameState("ready");
                  setIsPlaying(false);
                  setCurrentRound(1);
                  roundRef.current = 1;
                  setScore(0);
                  setRoundScores([]);
                  setShapesSorted(0);
                  setMissedShapes(0);
                  setCurrentShape(null);
                }}
                className="bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </motion.button>
            </div>
          </div>
        )}

        {gameState === "round-complete" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-6">✨</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Round {currentRound} Complete!
            </h2>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <p className="text-2xl font-bold text-green-600 mb-2">{shapesSorted} shapes sorted</p>
              <p className="text-gray-700">
                {currentRound < TOTAL_ROUNDS 
                  ? "Great focus! Ready for the next round?"
                  : "Excellent! All rounds complete."}
              </p>
            </div>
            
            {currentRound < TOTAL_ROUNDS ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextRound}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Continue to Round {currentRound + 1}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextRound}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                View Results
              </motion.button>
            )}
          </motion.div>
        )}

        {gameState === "finished" && !showGameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Flow State Simulation Complete!
            </h2>
            <p className="text-gray-600 mb-6">Calculating your concentration consistency...</p>
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
              {consistency >= 80 ? '🎯' : consistency >= 60 ? '✨' : '🌟'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Flow State Results
            </h2>
            
            {/* Results Summary */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                You've completed 3 rounds of flow state simulation. Notice how focused engagement feels—your mind was present, your actions were intentional, and time seemed to flow.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-1">{totalShapesSorted}</div>
                  <div className="text-sm text-gray-600">Total Sorted</div>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{Math.round(totalShapesSorted / TOTAL_ROUNDS)}</div>
                  <div className="text-sm text-gray-600">Avg per Round</div>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                  <div className="text-3xl font-bold text-purple-600 mb-1">{consistency}%</div>
                  <div className="text-sm text-gray-600">Consistency</div>
                </div>
              </div>

              {/* Round Breakdown */}
              <div className="bg-white/60 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-800 mb-3">Round Performance:</h3>
                <div className="space-y-2">
                  {roundScores.map((score, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Round {index + 1}:</span>
                      <span className="font-bold text-indigo-600">{score} shapes</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flow State Insights */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border-2 border-amber-200 text-left">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-600" />
                  Flow State Insights:
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• {consistency >= 80 ? "Excellent consistency! You maintained steady focus across all rounds—this is the hallmark of flow state." : consistency >= 60 ? "Good consistency! Your focus remained relatively stable, indicating flow state engagement." : "Notice any variations in your focus. Flow state feels consistent and effortless."}</li>
                  <li>• Flow state feels like: clear focus, effortlessness, losing track of time, deep engagement</li>
                  <li>• This is how focused engagement feels mentally and physically—present, intentional, and in the zone</li>
                </ul>
              </div>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Use after break to reset flow before teaching. After lunch break or prep period, use this flow state simulation to transition back into focused teaching mode. Just 2-3 minutes of this focused sorting task helps reset your mind from scattered break-time thoughts into a state of clear, present engagement. Notice how your body feels during flow—your breathing is steady, your movements are intentional, your mind is clear. This is the state you want to bring into your classroom. Practice entering flow state before challenging classes, before grading sessions, or whenever you need to shift from scattered thinking to focused engagement. You can also use this technique with students—give them a 2-minute flow task before starting a difficult lesson to help them transition into focused learning mode. Remember: flow state is achievable. It's not about perfection—it's about presence, engagement, and intentional focus. Regular practice makes it easier to access flow state when you need it most.
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

export default FlowStateSimulation;

