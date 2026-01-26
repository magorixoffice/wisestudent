import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Sparkles, Sun, Heart, CheckCircle, Play, Pause } from "lucide-react";

const InnerStrengthVisualization = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-56";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentSession, setCurrentSession] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [strengthRatings, setStrengthRatings] = useState({});
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Guided visualization sessions focused on inner strength
  const visualizationSessions = [
    {
      id: 1,
      title: "Golden Light in Your Chest",
      description: "Visualize calm strength returning as a golden light expanding in your chest",
      context: "After an emotional storm, imagine your inner strength returning. Picture a warm, golden light expanding in your chest, filling you with calm and resilience.",
      steps: [
        {
          text: "Close your eyes or soften your gaze. Take a deep breath in, and as you exhale, let go of any tension...",
          duration: 8,
          visual: "🌬️",
          color: "from-blue-400 to-cyan-400"
        },
        {
          text: "Imagine an emotional storm has passed. You feel the aftermath—tension, exhaustion, perhaps some sadness...",
          duration: 12,
          visual: "⛈️",
          color: "from-gray-500 to-slate-600"
        },
        {
          text: "Now, picture a small, warm, golden light beginning to form deep in the center of your chest, right where your heart is...",
          duration: 15,
          visual: "💛",
          color: "from-yellow-300 to-amber-300"
        },
        {
          text: "Feel this golden light starting to expand, slowly, gently. It's warm and comforting, like the sun's rays on your skin...",
          duration: 20,
          visual: "☀️",
          color: "from-yellow-400 to-orange-400"
        },
        {
          text: "Watch as this golden light grows larger, filling your entire chest with warmth and calm strength...",
          duration: 20,
          visual: "✨",
          color: "from-amber-400 to-yellow-400"
        },
        {
          text: "Feel the golden light expanding beyond your chest, flowing through your shoulders, down your arms, bringing calm and strength...",
          duration: 18,
          visual: "🌟",
          color: "from-yellow-300 to-amber-300"
        },
        {
          text: "The golden light fills your entire body now, from head to toe. You feel calm, strong, and centered. Your inner strength has returned...",
          duration: 15,
          visual: "💪",
          color: "from-amber-200 to-yellow-200"
        },
        {
          text: "Take a deep breath and feel this golden light radiating from within you. You are calm, you are strong, you are resilient...",
          duration: 12,
          visual: "🕯️",
          color: "from-yellow-100 to-amber-100"
        }
      ],
      tip: "This visualization helps you reconnect with your inner strength after emotional challenges. The golden light represents your innate calm and resilience."
    },
    {
      id: 2,
      title: "Roots of Strength",
      description: "Visualize yourself as a strong tree, grounded and resilient",
      context: "Imagine yourself as a strong, ancient tree. Even after a storm, your roots run deep, and you stand tall. Your inner strength is always there, even when you feel shaken.",
      steps: [
        {
          text: "Settle into a comfortable position. Take three deep, grounding breaths...",
          duration: 10,
          visual: "🌱",
          color: "from-green-400 to-emerald-400"
        },
        {
          text: "Picture yourself standing as a strong, ancient tree. You've weathered many storms, but you're still standing...",
          duration: 15,
          visual: "🌳",
          color: "from-green-500 to-teal-500"
        },
        {
          text: "Feel your roots extending deep into the earth, anchoring you, giving you stability and strength...",
          duration: 18,
          visual: "🌲",
          color: "from-emerald-600 to-green-600"
        },
        {
          text: "Imagine a recent emotional storm—wind, rain, branches swaying. But your roots hold you steady...",
          duration: 15,
          visual: "🌪️",
          color: "from-gray-500 to-blue-500"
        },
        {
          text: "Feel the storm passing. The wind calms. Your branches settle. You're still standing, still strong...",
          duration: 18,
          visual: "🍃",
          color: "from-green-400 to-emerald-400"
        },
        {
          text: "Sunlight returns, warming your leaves. Feel strength flowing from your deep roots up through your trunk, into every branch...",
          duration: 20,
          visual: "☀️",
          color: "from-yellow-300 to-amber-300"
        },
        {
          text: "You are grounded, resilient, and strong. Your inner strength is like these deep roots—always there, always supporting you...",
          duration: 15,
          visual: "💪",
          color: "from-emerald-200 to-green-200"
        }
      ],
      tip: "Your inner strength is like deep roots—always there, even when you feel shaken on the surface. This visualization helps you reconnect with that stability."
    },
    {
      id: 3,
      title: "Mountain of Calm",
      description: "Visualize yourself as a peaceful, unshakeable mountain",
      context: "After emotional turbulence, imagine yourself as a mountain—massive, stable, peaceful. Storms may rage around you, but your core remains calm and strong.",
      steps: [
        {
          text: "Find your center. Take a moment to breathe deeply and settle into your body...",
          duration: 8,
          visual: "⛰️",
          color: "from-gray-400 to-slate-500"
        },
        {
          text: "Imagine yourself as a great mountain—massive, ancient, unshakeable. You've stood for thousands of years...",
          duration: 15,
          visual: "🏔️",
          color: "from-slate-500 to-gray-600"
        },
        {
          text: "Picture clouds swirling around your peak, winds howling. An emotional storm is happening around you...",
          duration: 18,
          visual: "🌫️",
          color: "from-gray-400 to-blue-400"
        },
        {
          text: "But deep within you, in the solid core of the mountain, there is perfect stillness and calm...",
          duration: 20,
          visual: "💎",
          color: "from-blue-300 to-indigo-300"
        },
        {
          text: "Feel this calm, solid center. No matter what happens on the surface, this core remains peaceful and strong...",
          duration: 20,
          visual: "🧘",
          color: "from-indigo-200 to-purple-200"
        },
        {
          text: "The storm passes. Clouds clear. Sunlight touches your peak. You remain—calm, strong, unshakeable...",
          duration: 18,
          visual: "☀️",
          color: "from-yellow-300 to-amber-300"
        },
        {
          text: "Feel this inner stillness, this unshakeable strength. It's always there, at your core, waiting for you to return to it...",
          duration: 15,
          visual: "🕯️",
          color: "from-amber-100 to-yellow-100"
        }
      ],
      tip: "Your inner calm is like a mountain's core—unshakeable, even when storms rage around you. This visualization helps you access that deep peace."
    },
    {
      id: 4,
      title: "Warmth Returning",
      description: "Visualize warmth and strength returning to your body after feeling cold and empty",
      context: "After an emotional storm, you might feel cold, empty, or numb. Imagine warmth and strength slowly returning, filling you with life and resilience.",
      steps: [
        {
          text: "Take a moment to notice how your body feels right now. Notice any areas that feel cold, empty, or tense...",
          duration: 10,
          visual: "❄️",
          color: "from-blue-300 to-cyan-300"
        },
        {
          text: "Imagine a small spark of warmth beginning in the center of your chest. Like a tiny ember glowing softly...",
          duration: 15,
          visual: "🔥",
          color: "from-red-400 to-orange-400"
        },
        {
          text: "This warmth begins to grow, spreading slowly, gently, through your chest, warming you from the inside out...",
          duration: 20,
          visual: "☀️",
          color: "from-orange-400 to-amber-400"
        },
        {
          text: "Feel this warmth flowing down through your stomach, your hips, warming your core and bringing life back into your body...",
          duration: 18,
          visual: "💛",
          color: "from-amber-300 to-yellow-300"
        },
        {
          text: "The warmth spreads through your legs, down to your toes. Your entire body is now warm and alive again...",
          duration: 18,
          visual: "✨",
          color: "from-yellow-300 to-amber-300"
        },
        {
          text: "Feel strength returning with this warmth. Your body is alive, warm, and strong. You are returning to yourself...",
          duration: 15,
          visual: "💪",
          color: "from-amber-200 to-orange-200"
        },
        {
          text: "Take a deep breath and feel this warmth throughout your entire body. You are warm, you are strong, you are whole...",
          duration: 12,
          visual: "🕯️",
          color: "from-orange-100 to-amber-100"
        }
      ],
      tip: "After emotional storms, we can feel empty or cold. This visualization helps warmth and life return, bringing you back to your full strength."
    },
    {
      id: 5,
      title: "Light After Darkness",
      description: "Visualize light breaking through after darkness, bringing clarity and strength",
      context: "After an emotional storm, it can feel dark and heavy. Imagine light breaking through the darkness, bringing clarity, calm, and renewed strength.",
      steps: [
        {
          text: "Settle in. Take a deep breath and let your body relax completely...",
          duration: 8,
          visual: "🌑",
          color: "from-gray-700 to-slate-800"
        },
        {
          text: "Picture yourself in a dark space, perhaps after an emotional storm. It's quiet, heavy, perhaps a bit overwhelming...",
          duration: 15,
          visual: "🌌",
          color: "from-indigo-800 to-purple-900"
        },
        {
          text: "Now, imagine a small ray of light beginning to appear in the darkness—gentle, warm, golden...",
          duration: 18,
          visual: "💫",
          color: "from-yellow-400 to-amber-400"
        },
        {
          text: "This ray of light grows brighter, wider, breaking through the darkness like sunrise after a long night...",
          duration: 20,
          visual: "🌅",
          color: "from-orange-400 to-yellow-400"
        },
        {
          text: "Feel the light touching you, warming your face, your body. It brings clarity and calm...",
          duration: 18,
          visual: "☀️",
          color: "from-yellow-300 to-amber-300"
        },
        {
          text: "The light fills the space around you, dispelling the darkness. You can see clearly now. You feel strong and renewed...",
          duration: 20,
          visual: "✨",
          color: "from-amber-200 to-yellow-200"
        },
        {
          text: "Stand in this light. Feel it filling you with clarity, calm, and strength. The darkness has passed. You are strong, you are clear, you are renewed...",
          duration: 15,
          visual: "🌟",
          color: "from-yellow-100 to-amber-100"
        }
      ],
      tip: "After emotional darkness, light always returns. This visualization helps you see and feel that light, bringing clarity and strength back to you."
    }
  ];

  const currentSessionData = visualizationSessions[Math.min(currentSession, visualizationSessions.length - 1)];
  const currentStepData = currentSessionData?.steps[currentStep];
  const progress = ((currentSession + 1) / totalLevels) * 100;

  // Text-to-speech for guided audio
  const speakPrompt = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startVisualization = () => {
    if (!currentSessionData || !currentSessionData.steps || currentSessionData.steps.length === 0) return;
    
    setIsPlaying(true);
    setIsPaused(false);
    setCurrentStep(0);
    const firstStep = currentSessionData.steps[0];
    setTimeRemaining(firstStep.duration);
    speakPrompt(firstStep.text);
  };

  const pauseVisualization = () => {
    setIsPaused(true);
    window.speechSynthesis.pause();
  };

  const resumeVisualization = () => {
    setIsPaused(false);
    window.speechSynthesis.resume();
  };

  // Timer for visualization steps
  useEffect(() => {
    if (!isPlaying || isPaused || timeRemaining <= 0) return;

    const timer = setTimeout(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isPlaying, isPaused, timeRemaining]);

  // Move to next step when timer reaches 0
  useEffect(() => {
    if (isPlaying && !isPaused && timeRemaining === 0 && currentSessionData && currentSessionData.steps) {
      if (currentStep < currentSessionData.steps.length - 1) {
        setTimeout(() => {
          setCurrentStep(prev => {
            const nextStep = prev + 1;
            const nextStepData = currentSessionData.steps[nextStep];
            if (nextStepData) {
              setTimeRemaining(nextStepData.duration);
              speakPrompt(nextStepData.text);
            }
            return nextStep;
          });
        }, 500);
      } else {
        // Finished all steps
        setTimeout(() => {
          setIsPlaying(false);
          setTimeRemaining(0);
          window.speechSynthesis.cancel();
        }, 500);
      }
    }
  }, [timeRemaining, isPlaying, isPaused, currentStep, currentSessionData]);

  const handleRateStrength = (rating) => {
    const sessionIndex = Math.min(currentSession, visualizationSessions.length - 1);
    const sessionKey = `session${sessionIndex}`;
    setStrengthRatings(prev => ({
      ...prev,
      [sessionKey]: rating
    }));

    setScore(prev => prev + 1);

    setTimeout(() => {
      if (sessionIndex < totalLevels - 1) {
        setCurrentSession(prev => Math.min(prev + 1, totalLevels - 1));
        setCurrentStep(0);
        setIsPlaying(false);
        setIsPaused(false);
        setTimeRemaining(0);
      } else {
        setShowGameOver(true);
      }
    }, 1500);
  };

  const allStepsComplete = !isPlaying && currentStep === (currentSessionData?.steps?.length - 1 || 0) && timeRemaining === 0;
  const currentRating = strengthRatings[`session${currentSession}`];

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Inner Strength Visualization"}
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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-6xl mb-4"
            >
              💪
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Inner Strength Visualization Complete!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've learned to visualize calm strength returning after emotional storms. Remember: visualization strengthens your nervous system as powerfully as rest.
            </p>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> Visualization strengthens your nervous system as powerfully as rest. When you practice these inner strength visualizations, you're not just imagining—you're actually rewiring your nervous system to access calm and resilience. This practice helps you recover faster from emotional storms and builds your capacity to handle stress. Share these visualizations with your children too—they're powerful tools for emotional regulation.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Inner Strength Visualization"}
      subtitle={`Session ${currentSession + 1} of ${totalLevels}: ${currentSessionData?.title || "Loading..."}`}
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
                className="bg-gradient-to-r from-amber-600 to-orange-600 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Session context */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 mb-6 border-2 border-amber-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{currentSessionData?.title || "Loading..."}</h3>
            <p className="text-gray-700 mb-2">{currentSessionData?.description || ""}</p>
            <p className="text-sm text-gray-600 italic">{currentSessionData?.context || ""}</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-amber-800">
                <strong>💡 Parent Tip:</strong> Visualization strengthens your nervous system as powerfully as rest. Practice these visualizations regularly to build your resilience.
              </p>
            </div>
          </div>

          {!isPlaying && !allStepsComplete && !currentRating && (
            /* Start screen */
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 border-2 border-amber-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Guided Inner Strength Visualization</h3>
                <p className="text-gray-700 mb-6">
                  Follow the audio guide to visualize calm strength returning after an emotional storm. Close your eyes or soften your gaze, and let the imagery guide you.
                </p>
                <div className="flex items-center justify-center gap-6 mb-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Audio guide</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="w-5 h-5" />
                    <span>Visual imagery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    <span>Strength rating</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startVisualization}
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 mx-auto"
                >
                  <Play className="w-6 h-6" />
                  Start Visualization
                </motion.button>
              </div>
            </div>
          )}

          {isPlaying && (
            /* Visualization in progress */
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-xl p-8 border-2 border-amber-300">
                {/* Step counter */}
                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    Step {currentStep + 1} of {currentSessionData?.steps?.length || 0}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / (currentSessionData?.steps?.length || 1)) * 100}%` }}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                    />
                  </div>
                </div>

                {/* Visual representation */}
                <div className="flex items-center justify-center mb-6">
                  <motion.div
                    key={currentStep}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className={`w-48 h-48 rounded-full bg-gradient-to-br ${currentStepData?.color || 'from-gray-400 to-gray-500'} shadow-2xl flex items-center justify-center relative`}
                    style={{
                      filter: 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.6))',
                    }}
                  >
                    <span className="text-7xl">{currentStepData?.visual || '💭'}</span>
                    {/* Pulsing glow effect */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 rounded-full bg-white opacity-30"
                    />
                  </motion.div>
                </div>

                {/* Current prompt text */}
                <div className="bg-white rounded-lg p-4 mb-6 border-2 border-amber-200">
                  <p className="text-lg font-medium text-gray-800 italic leading-relaxed">
                    "{currentStepData?.text || 'Loading...'}"
                  </p>
                </div>

                {/* Timer */}
                <div className="mb-4">
                  {timeRemaining > 0 && (
                    <p className="text-2xl font-bold text-gray-700">{timeRemaining} seconds</p>
                  )}
                </div>

                {/* Pause/Resume button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isPaused ? resumeVisualization : pauseVisualization}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  {isPaused ? (
                    <>
                      <Play className="w-4 h-4" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  )}
                </motion.button>

                {/* Instructions */}
                <p className="text-sm text-gray-600 italic mt-4">
                  Follow along with the audio guide. Close your eyes or soften your gaze, and let the imagery guide you.
                </p>
              </div>
            </div>
          )}

          {allStepsComplete && !currentRating && (
            /* Rating screen after completing visualization */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-300">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Visualization Complete!</h3>
                <p className="text-gray-700 mb-6">
                  How strong do you feel emotionally right now? Rate your emotional strength after this visualization.
                </p>
                
                <div className="grid grid-cols-5 gap-3 mb-6 max-w-md mx-auto">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <motion.button
                      key={rating}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRateStrength(rating)}
                      disabled={!!currentRating}
                      className={`
                        aspect-square rounded-lg border-2 font-bold text-lg transition-all
                        ${currentRating === rating
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-500 text-white shadow-lg scale-110'
                          : currentRating
                          ? 'bg-gray-100 border-gray-300 text-gray-400 opacity-50'
                          : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 text-amber-700 hover:shadow-md cursor-pointer'
                        }
                      `}
                    >
                      {rating}
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-between text-sm text-gray-600 max-w-md mx-auto">
                  <span>Very weak</span>
                  <span>Very strong</span>
                </div>
              </div>
            </motion.div>
          )}

          {currentRating && (
            /* Rating submitted */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-300">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Thank you for your rating!</h3>
                <p className="text-gray-700 mb-4">
                  You rated your emotional strength: <strong className="text-green-700">{currentRating} out of 5</strong>
                </p>
                <p className="text-sm text-gray-600 italic mb-6">
                  Great work! You've practiced visualizing calm strength returning after an emotional storm.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-amber-800">
                    <strong>💡 Parent Tip:</strong> {currentSessionData?.tip || ""}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const sessionIndex = Math.min(currentSession, totalLevels - 1);
                    if (sessionIndex < totalLevels - 1) {
                      setCurrentSession(prev => Math.min(prev + 1, totalLevels - 1));
                      setCurrentStep(0);
                      setIsPlaying(false);
                      setIsPaused(false);
                      setTimeRemaining(0);
                      setStrengthRatings(prev => {
                        const newRatings = { ...prev };
                        delete newRatings[`session${sessionIndex}`];
                        return newRatings;
                      });
                    } else {
                      setShowGameOver(true);
                    }
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {currentSession < totalLevels - 1 ? 'Next Session' : 'Complete Practice'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default InnerStrengthVisualization;

