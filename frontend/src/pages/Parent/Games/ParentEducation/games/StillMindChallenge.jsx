import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Timer, AlertCircle, CheckCircle, Sparkles, Heart, Lock } from "lucide-react";

const StillMindChallenge = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-47";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentSession, setCurrentSession] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [movementDetected, setMovementDetected] = useState(false);
  const [movementType, setMovementType] = useState(null); // 'tap' or 'tilt'
  const [initialOrientation, setInitialOrientation] = useState(null);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [detectionReady, setDetectionReady] = useState(false);


  const timerRef = useRef(null);
  const orientationRef = useRef(null);
  const startButtonClickedRef = useRef(false);

  // Session scenarios with different durations
  const sessions = [
    {
      id: 1,
      title: "Thirty-Second Stillness",
      description: "Practice sitting still for 30 seconds without touching the phone or fidgeting.",
      duration: 30, // 30 seconds
      context: "Sit comfortably. Place your device down and remain still. Let your mind settle into stillness for 30 seconds.",
      parentTip: "Even 30 seconds of stillness can clear your mind and reduce stress. When you practice sitting still, you're giving your mind a break from constant input and stimulation. This restores your capacity to make clear decisions."
    },
    {
      id: 2,
      title: "Forty-Second Stillness",
      description: "Challenge yourself to remain perfectly still for 40 seconds.",
      duration: 40, // 40 seconds
      context: "Find a comfortable seated position. Place your device on a flat surface and remain still. Notice any urges to move—observe them, but stay still for 40 seconds.",
      parentTip: "Stillness practice reduces decision fatigue because it gives your prefrontal cortex—the decision-making part of your brain—a break. Even 30-40 seconds of stillness can reset your mental clarity."
    },
    {
      id: 3,
      title: "Fifty-Second Stillness",
      description: "Extend your stillness practice to 50 seconds. Notice the urge to move and choose stillness.",
      duration: 50, // 50 seconds
      context: "Settle into stillness. Your device will detect any movement—touching the screen or tilting the device. The challenge is to remain completely still for 50 seconds until the timer ends.",
      parentTip: "When you practice stillness, you're not just resting—you're training your mind to resist the constant urge to check, scroll, or fidget. This mental discipline transfers to better focus with your child."
    },
    {
      id: 4,
      title: "Sixty-Second Stillness",
      description: "Master the art of stillness for 60 seconds. Let your mind settle deeply.",
      duration: 60, // 60 seconds
      context: "This is an extended practice in stillness. Sit comfortably, place your device down, and remain perfectly still for 60 seconds. Notice thoughts, urges, sensations—but stay still.",
      parentTip: "Stillness practice teaches you to sit with discomfort, with boredom, with restlessness. When you can sit still with your own mind, you can sit still with your child's big feelings. Stillness becomes a superpower."
    },
    {
      id: 5,
      title: "Seventy-Second Stillness Challenge",
      description: "Complete stillness for 70 seconds. Master your ability to remain present without movement.",
      duration: 70, // 70 seconds
      context: "The ultimate challenge in stillness. Sit comfortably, place your device down, and remain perfectly still for 70 seconds. This extended practice deepens your capacity for presence and calm.",
      parentTip: "Daily stillness of even 30 seconds clears decision fatigue. When practiced regularly, stillness becomes your anchor. You arrive at decisions from clarity, not exhaustion. Your child benefits from your clear, rested mind."
    }
  ];

  const currentSessionData = sessions[currentSession];

  // Start the stillness challenge
  const startChallenge = () => {
    startButtonClickedRef.current = true;
    setIsPlaying(true);
    setTimeRemaining(currentSessionData.duration);
    setMovementDetected(false);
    setMovementType(null);
    setInitialOrientation(null);
    setDetectionReady(false);
    
    // Allow a brief delay before starting detection to prevent false positives
    setTimeout(() => {
      setDetectionReady(true);
    }, 800);
  };

  // Handle movement detection
  const handleMovementDetected = (type) => {
    if (movementDetected || !isPlaying) return;
    
    setMovementDetected(true);
    setMovementType(type);
    setIsPlaying(false);
    
    // Stop timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  // Capture initial device orientation when challenge starts
  useEffect(() => {
    if (!isPlaying) return;

    let handler;
    const captureInitialOrientation = () => {
      if (window.DeviceOrientationEvent && initialOrientation === null) {
        handler = (e) => {
          setInitialOrientation({
            beta: e.beta || 0,
            gamma: e.gamma || 0
          });
          if (handler) {
            window.removeEventListener('deviceorientation', handler);
          }
        };

        // Request permission for iOS 13+
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
          DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
              if (permissionState === 'granted') {
                window.addEventListener('deviceorientation', handler);
              }
            })
            .catch(() => {});
        } else {
          window.addEventListener('deviceorientation', handler);
        }
      }
    };

    // Small delay before capturing orientation
    const timeoutId = setTimeout(captureInitialOrientation, 500);
    
    return () => {
      clearTimeout(timeoutId);
      if (handler) {
        window.removeEventListener('deviceorientation', handler);
      }
    };
  }, [isPlaying]);

  // Detect screen taps/clicks (only after detection is ready)
  useEffect(() => {
    if (!isPlaying || movementDetected || !detectionReady) return;

    const handleInteraction = (e) => {
      if (!isPlaying || movementDetected || !detectionReady) return;
      
      // Ignore clicks on buttons or result screens
      const target = e.target;
      const isButton = target.tagName === 'BUTTON' || target.closest('button');
      
      if (!isButton && !movementDetected) {
        handleMovementDetected('tap');
      }
    };

    // Listen for various interaction events
    document.addEventListener('click', handleInteraction, true);
    document.addEventListener('touchstart', handleInteraction, true);
    document.addEventListener('touchmove', handleInteraction, true);

    return () => {
      document.removeEventListener('click', handleInteraction, true);
      document.removeEventListener('touchstart', handleInteraction, true);
      document.removeEventListener('touchmove', handleInteraction, true);
    };
  }, [isPlaying, movementDetected, detectionReady]);

  // Timer countdown
  useEffect(() => {
    if (!isPlaying || movementDetected) return;

    if (timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      // Challenge completed successfully
      setIsPlaying(false);
      setCompletedSessions(prev => [...prev, currentSession]);
      setScore(prev => prev + 1);

      setInitialOrientation(null);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, timeRemaining, movementDetected, currentSession]);

  // Device orientation detection (after initial orientation is captured and detection is ready)
  useEffect(() => {
    if (!isPlaying || !initialOrientation || movementDetected || !detectionReady) return;

    const handleOrientation = (e) => {
      if (!isPlaying || movementDetected || !initialOrientation || !detectionReady) return;

      const beta = e.beta || 0;
      const gamma = e.gamma || 0;
      
      // Check for significant tilt (more than 8 degrees change from initial)
      const betaDiff = Math.abs(beta - initialOrientation.beta);
      const gammaDiff = Math.abs(gamma - initialOrientation.gamma);
      
      if (betaDiff > 8 || gammaDiff > 8) {
        handleMovementDetected('tilt');
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    }
  }, [isPlaying, initialOrientation, movementDetected, detectionReady]);

  // Handle next session
  const handleNext = () => {
    setMovementDetected(false);
    setMovementType(null);
    setInitialOrientation(null);
    setDetectionReady(false);
    startButtonClickedRef.current = false;
    
    if (currentSession < sessions.length - 1) {
      setCurrentSession(prev => prev + 1);
      setIsPlaying(false);
      setTimeRemaining(0);
    } else {
      setShowGameOver(true);
    }
  };

  // Handle restart current session
  const handleRestart = () => {
    setMovementDetected(false);
    setMovementType(null);
    setInitialOrientation(null);
    setIsPlaying(false);
    setTimeRemaining(0);
    setDetectionReady(false);
    // Remove this session from completed sessions if it was completed
    setCompletedSessions(prev => prev.filter(session => session !== currentSession));
    startButtonClickedRef.current = false;
  };

  // Format time display
  const formatTime = (seconds) => {
    return `${seconds}s`;
  };

  const progress = ((currentSession + 1) / totalLevels) * 100;
  const challengeComplete = timeRemaining === 0 && !movementDetected && completedSessions.includes(currentSession);


  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Still Mind Challenge"}
        subtitle="Practice Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={score >= totalLevels * 0.8}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">🧘</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Still Mind Mastered!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've practiced sitting still and maintaining presence. Remember: daily stillness of even 30 seconds clears decision fatigue.
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> Daily stillness of even 30 seconds clears decision fatigue. When you practice sitting still, you're giving your mind a break from constant input and stimulation. This restores your capacity to make clear decisions. Your child benefits from your clear, rested mind. Stillness becomes your anchor in the chaos of parenting.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Still Mind Challenge"}
      subtitle={`Session ${currentSession + 1} of ${totalLevels}: ${currentSessionData.title}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentSession + 1}
    >
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <motion.div
          key={currentSession}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Session {currentSession + 1} of {totalLevels}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Session context */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-indigo-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{currentSessionData.title}</h3>
            <p className="text-gray-700 mb-2">{currentSessionData.description}</p>
            <p className="text-sm text-gray-600 italic mb-3">{currentSessionData.context}</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                <strong>💡 Parent Tip:</strong> {currentSessionData.parentTip}
              </p>
            </div>
          </div>

          {!isPlaying && !challengeComplete && !movementDetected && (
            /* Start screen */
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Still Mind Challenge</h3>
                <p className="text-gray-700 mb-6">
                  Sit comfortably and place your device on a flat surface. Remain perfectly still for <strong>{currentSessionData.duration} seconds</strong> without touching the screen or moving the device.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-800 flex items-center gap-2 justify-center">
                    <AlertCircle className="w-5 h-5" />
                    <span><strong>Important:</strong> Any tap on the screen or device movement will end the challenge.</span>
                  </p>
                </div>
                <div className="flex items-center justify-center gap-6 mb-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Timer className="w-5 h-5" />
                    <span>{currentSessionData.duration} sec timer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    <span>No movement</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startChallenge}
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 mx-auto"
                >
                  Start Stillness Challenge
                </motion.button>
              </div>
            </div>
          )}

          {isPlaying && !movementDetected && (
            /* Challenge in progress */
            <div 
              className="relative bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 rounded-xl h-[500px] border-2 border-indigo-500 overflow-hidden"
              style={{ touchAction: 'none' }} // Prevent touch gestures
            >
              {/* Calm background with subtle animation */}
              <div className="absolute inset-0">
                <motion.div
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20"
                />
                {/* Stars/particles effect */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>

              {/* Circular progress bar */}
              <div className="absolute inset-0 flex items-center justify-center z-5">
                <svg width="300" height="300" viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 1 }}
                    animate={{ pathLength: timeRemaining / currentSessionData.duration }}
                    transition={{ duration: 0.5 }}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>

              {/* Timer display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <motion.div 
                  className="text-8xl font-bold text-white mb-2 drop-shadow-2xl"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.9, 1, 0.9]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  {formatTime(timeRemaining)}
                </motion.div>
                <p className="text-3xl text-white/90 mb-1 font-semibold">Time Remaining</p>
                <p className="text-lg text-white/80 mb-4">{Math.round((timeRemaining / currentSessionData.duration) * 100)}% Complete</p>
                <p className="text-xl text-white/80 mb-4">Remain Still</p>
                <div className="flex items-center gap-2 text-white/60">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">Sit quietly, breathe naturally</span>
                </div>
              </div>

              {/* Instructions overlay (fades after a few seconds) */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 5, duration: 2 }}
                className="absolute bottom-8 left-0 right-0 text-center z-10"
              >
                <p className="text-white/60 text-sm">
                  Do not touch the screen or move the device
                </p>
              </motion.div>
            </div>
          )}

          {movementDetected && (
            /* Movement detected screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-8 border-2 border-red-300 text-center"
            >
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Movement Detected</h3>
              <p className="text-gray-700 mb-2">
                {movementType === 'tap' 
                  ? 'You touched the screen or interacted with the device.'
                  : movementType === 'tilt'
                  ? 'Device movement was detected. The device may have been tilted or moved.'
                  : 'Movement was detected during the challenge.'}
              </p>
              <p className="text-sm text-gray-600 mb-6">
                The challenge requires complete stillness. Try again to practice maintaining stillness.
              </p>
              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRestart}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Try Again
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Skip Session
                </motion.button>
              </div>
            </motion.div>
          )}

          {challengeComplete && (
            /* Challenge completed successfully */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-300 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-6xl mb-4"
              >
                ✨
              </motion.div>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Stillness Achieved!</h3>
              <p className="text-gray-700 mb-6">
                Congratulations! You maintained complete stillness for {currentSessionData.duration} seconds. You've successfully cleared decision fatigue and restored mental clarity.
              </p>
              <div className="bg-white rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>💡 What You Practiced:</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Sitting still with your thoughts, resisting the urge to fidget or check your phone, and finding calm in stillness. This practice clears decision fatigue and restores your capacity for clear thinking.
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-amber-800">
                  <strong>💡 Parent Tip:</strong> {currentSessionData.parentTip}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                {currentSession < sessions.length - 1 ? 'Next Session' : 'Complete Practice'}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default StillMindChallenge;

