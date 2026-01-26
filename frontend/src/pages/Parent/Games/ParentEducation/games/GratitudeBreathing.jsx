import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Play, Wind, Sparkles, Heart, CheckCircle, Sun } from "lucide-react";

const GratitudeBreathing = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-49";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentSession, setCurrentSession] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathCycle, setBreathCycle] = useState(0); // 0-4 (5 cycles total)
  const [breathPhase, setBreathPhase] = useState('idle'); // idle, inhale, exhale
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [calmRatings, setCalmRatings] = useState({});
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  const timerRef = useRef(null);

  // Breathing phases timing (inhale gratitude, exhale thanks)
  const breathingTimings = {
    inhale: 5,   // 5 seconds inhale (calm)
    exhale: 6    // 6 seconds exhale (thanks)
  };

  const totalCycleTime = breathingTimings.inhale + breathingTimings.exhale; // 11 seconds per cycle

  // Session contexts
  const sessions = [
    {
      id: 1,
      title: "Morning Gratitude",
      description: "Start your day with 5 gratitude breaths. Inhale calm, exhale thanks for the new day.",
      context: "Morning is a fresh start. Combine gratitude with breath to set a positive tone for your day.",
      gratitudePrompts: [
        "Inhale calm, exhale thanks for a new day",
        "Inhale peace, exhale gratitude for rest",
        "Inhale clarity, exhale thanks for your family",
        "Inhale strength, exhale gratitude for your health",
        "Inhale hope, exhale thanks for possibilities"
      ],
      parentTip: "Inhale gratitude before sleep—it rewires the mind for peace. When you practice gratitude breathing, you're training your brain to focus on what's good, which reduces stress and improves emotional regulation."
    },
    {
      id: 2,
      title: "Midday Gratitude Reset",
      description: "Take a gratitude breathing break in the middle of your day. Inhale calm, exhale thanks.",
      context: "Midday can feel chaotic. Five gratitude breaths help you reset and reconnect with what matters.",
      gratitudePrompts: [
        "Inhale calm, exhale thanks for this moment",
        "Inhale peace, exhale gratitude for progress made",
        "Inhale clarity, exhale thanks for your child",
        "Inhale strength, exhale gratitude for your resilience",
        "Inhale hope, exhale thanks for small victories"
      ],
      parentTip: "Gratitude breathing rewires your mind to notice the good. When practiced daily, it becomes automatic—your brain starts looking for things to be grateful for, which improves your mood and parenting patience."
    },
    {
      id: 3,
      title: "Evening Gratitude",
      description: "End your day with 5 gratitude breaths. Inhale calm, exhale thanks for the day's blessings.",
      context: "Evening is a time to reflect. Combine gratitude with breath to process the day positively.",
      gratitudePrompts: [
        "Inhale calm, exhale thanks for the day",
        "Inhale peace, exhale gratitude for lessons learned",
        "Inhale clarity, exhale thanks for moments of connection",
        "Inhale strength, exhale gratitude for your efforts",
        "Inhale hope, exhale thanks for tomorrow"
      ],
      parentTip: "Inhale gratitude before sleep—it rewires the mind for peace. When you end your day with gratitude breathing, you sleep better and wake up with more emotional resilience. Practice this and teach it to your child."
    },
    {
      id: 4,
      title: "Pre-Sleep Gratitude",
      description: "Practice 5 gratitude breaths before sleep. Inhale calm, exhale thanks to rewire your mind for peace.",
      context: "Before sleep, gratitude breathing helps you let go of the day's stress and find peace.",
      gratitudePrompts: [
        "Inhale calm, exhale thanks for this day",
        "Inhale peace, exhale gratitude for your family",
        "Inhale clarity, exhale thanks for growth",
        "Inhale strength, exhale gratitude for love",
        "Inhale hope, exhale thanks for rest"
      ],
      parentTip: "Inhale gratitude before sleep—it rewires the mind for peace. This practice transforms your bedtime routine from worry to gratitude. When you breathe gratitude before sleep, you sleep deeper and wake calmer. Teach your child this—it becomes a life skill."
    },
    {
      id: 5,
      title: "Stress-Reset Gratitude",
      description: "Use 5 gratitude breaths to reset when stressed. Inhale calm, exhale thanks for what's good.",
      context: "When stress rises, gratitude breathing helps you shift perspective and find calm.",
      gratitudePrompts: [
        "Inhale calm, exhale thanks for this breath",
        "Inhale peace, exhale gratitude for what's working",
        "Inhale clarity, exhale thanks for your child's smile",
        "Inhale strength, exhale gratitude for your capacity",
        "Inhale hope, exhale thanks for new beginnings"
      ],
      parentTip: "Gratitude breathing is a tool you can use anywhere—in stressful moments, before sleep, during transitions. Inhale gratitude before sleep rewires the mind for peace. Practice this consistently, and it becomes your automatic reset button for calm and perspective."
    }
  ];

  const currentSessionData = sessions[Math.min(currentSession, sessions.length - 1)] || {};
  const currentGratitudePrompt = currentSessionData?.gratitudePrompts?.[breathCycle] || "";

  // Start the gratitude breathing exercise
  const startBreathing = () => {
    setIsPlaying(true);
    setBreathCycle(0);
    setBreathPhase('inhale');
    setTimeRemaining(breathingTimings.inhale);
    const firstPrompt = currentSessionData?.gratitudePrompts?.[0] || "Inhale calm, exhale thanks";
    speakPrompt(`Breath ${breathCycle + 1} of 5. ${firstPrompt}.`);
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
        setBreathPhase('exhale');
        setTimeRemaining(breathingTimings.exhale);
        speakPrompt("Exhale thanks");
      } else if (breathPhase === 'exhale') {
        // Cycle complete
        if (breathCycle < 4) {
          // Start next cycle
          const nextCycle = breathCycle + 1;
          const currentPrompts = sessions[Math.min(currentSession, sessions.length - 1)]?.gratitudePrompts || [];
          setBreathCycle(nextCycle);
          setBreathPhase('inhale');
          setTimeRemaining(breathingTimings.inhale);
          if (currentPrompts[nextCycle]) {
            speakPrompt(`Breath ${nextCycle + 1} of 5. ${currentPrompts[nextCycle]}.`);
          }
        } else {
          // All 5 cycles complete
          setIsPlaying(false);
          setBreathPhase('idle');
        }
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, timeRemaining, breathPhase, breathCycle, currentSession]);

  // Text-to-speech for voice prompts
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

  // Calculate light size based on breath phase
  const getLightSize = () => {
    if (breathPhase === 'inhale') {
      const progress = 1 - (timeRemaining / breathingTimings.inhale);
      return 120 + (progress * 130); // Grows from 120px to 250px
    } else if (breathPhase === 'exhale') {
      const progress = 1 - (timeRemaining / breathingTimings.exhale);
      return 250 - (progress * 130); // Shrinks from 250px to 120px
    }
    return 150; // Default/resting size
  };

  // Get light color based on phase
  const getLightColor = () => {
    if (breathPhase === 'inhale') {
      return 'from-yellow-300 via-amber-400 to-orange-400';
    } else if (breathPhase === 'exhale') {
      return 'from-orange-400 via-rose-400 to-pink-400';
    }
    return 'from-indigo-400 via-purple-400 to-pink-400';
  };

  // Get phase instruction text
  const getPhaseText = () => {
    if (breathPhase === 'inhale') {
      return 'Inhale Calm';
    } else if (breathPhase === 'exhale') {
      return 'Exhale Thanks';
    }
    return 'Ready';
  };

  // Handle calm level rating
  const handleRateCalm = (rating) => {
    const safeCurrentSession = Math.min(currentSession, sessions.length - 1);
    const sessionKey = `session${safeCurrentSession}`;
    setCalmRatings(prev => ({
      ...prev,
      [sessionKey]: rating
    }));

    setScore(prev => prev + 1);
  };

  const progress = Math.min(((currentSession + 1) / totalLevels) * 100, 100);
  const allCyclesComplete = breathCycle === 4 && breathPhase === 'idle' && !isPlaying;
  const currentRating = calmRatings[`session${Math.min(currentSession, sessions.length - 1)}`];

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Gratitude Breathing"}
        subtitle="Practice Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={score === totalLevels}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">🙏</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Gratitude Breathing Mastered!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've learned to combine gratitude with breath for emotional reset. Remember: inhale gratitude before sleep—it rewires the mind for peace.
            </p>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> Inhale gratitude before sleep—it rewires the mind for peace. When you practice gratitude breathing consistently, you train your brain to notice the good, which reduces stress and improves emotional regulation. This practice transforms your bedtime routine and improves your sleep quality. Teach your child this—inhale calm, exhale thanks—and watch them find peace too.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Gratitude Breathing"}
      subtitle={`Session ${Math.min(currentSession + 1, totalLevels)} of ${totalLevels}: ${currentSessionData.title || 'Gratitude Breathing'}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={Math.min(currentSession + 1, totalLevels)}
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
              <span>Session {Math.min(currentSession + 1, totalLevels)} of {totalLevels}</span>
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
            <h3 className="text-xl font-bold text-gray-800 mb-2">{currentSessionData.title || 'Gratitude Breathing'}</h3>
            <p className="text-gray-700 mb-2">{currentSessionData.description || ''}</p>
            <p className="text-sm text-gray-600 italic mb-3">{currentSessionData.context || ''}</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                <strong>💡 Parent Tip:</strong> {currentSessionData.parentTip || ''}
              </p>
            </div>
          </div>

          {!isPlaying && !allCyclesComplete && !currentRating && (
            /* Start screen */
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 border-2 border-amber-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">5 Gratitude Breaths</h3>
                <p className="text-gray-700 mb-6">
                  Practice 5 gratitude breaths: <strong>Inhale calm, exhale thanks</strong>. Follow the voice prompts and light animation. Each breath includes a gratitude prompt to guide your practice.
                </p>
                <div className="flex items-center justify-center gap-6 mb-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Wind className="w-5 h-5" />
                    <span>5 breaths</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Guided prompts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="w-5 h-5" />
                    <span>Light animation</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startBreathing}
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 mx-auto"
                >
                  <Play className="w-6 h-6" />
                  Start Gratitude Breathing
                </motion.button>
              </div>
            </div>
          )}

          {isPlaying && (
            /* Breathing exercise in progress */
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-xl p-8 border-2 border-amber-300">
                {/* Cycle counter */}
                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    Breath {breathCycle + 1} of 5
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((breathCycle + 1) / 5) * 100}%` }}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                    />
                  </div>
                </div>

                {/* Gratitude prompt display */}
                <div className="bg-white rounded-lg p-4 mb-6 border-2 border-amber-200">
                  <p className="text-lg font-medium text-gray-800 italic">
                    "{currentGratitudePrompt}"
                  </p>
                </div>

                {/* Light animation */}
                <div className="flex items-center justify-center mb-6">
                  <motion.div
                    animate={{
                      width: `${getLightSize()}px`,
                      height: `${getLightSize()}px`,
                    }}
                    transition={{
                      duration: breathPhase === 'inhale' ? 5 : 6,
                      ease: "easeInOut"
                    }}
                    className={`rounded-full bg-gradient-to-br ${getLightColor()} shadow-2xl flex items-center justify-center relative`}
                    style={{
                      filter: 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.6))',
                      boxShadow: '0 0 40px rgba(251, 191, 36, 0.7), inset 0 0 40px rgba(255, 255, 255, 0.4)'
                    }}
                  >
                    <Sun className="w-16 h-16 text-white" />
                    {/* Pulsing glow effect */}
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 0.7, 0.4]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 rounded-full bg-white opacity-40"
                    />
                  </motion.div>
                </div>

                {/* Phase instruction */}
                <div className="mb-4">
                  <p className="text-3xl font-bold text-gray-800 mb-2">{getPhaseText()}</p>
                  {timeRemaining > 0 && (
                    <p className="text-lg text-gray-600">{timeRemaining} seconds</p>
                  )}
                </div>

                {/* Instructions */}
                <p className="text-sm text-gray-600 italic">
                  Follow the rhythm. Inhale calm, exhale thanks. Let gratitude flow with your breath.
                </p>
              </div>
            </div>
          )}

          {allCyclesComplete && !currentRating && (
            /* Rating screen after completing breaths */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-300">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">All 5 Gratitude Breaths Complete!</h3>
                <p className="text-gray-700 mb-6">
                  Excellent! You've completed 5 gratitude breaths. How calm do you feel now?
                </p>
                
                <div className="grid grid-cols-5 gap-3 mb-6 max-w-md mx-auto">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <motion.button
                      key={rating}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRateCalm(rating)}
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
                  <span>Not calm</span>
                  <span>Very calm</span>
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
                <h3 className="text-xl font-bold text-gray-800 mb-2">Gratitude Breathing Complete!</h3>
                <p className="text-gray-700 mb-4">
                  You rated your calm level: <strong className="text-green-700">{currentRating} out of 5</strong>
                </p>
                <p className="text-sm text-gray-600 italic mb-6">
                  Great work! You've combined gratitude with breath for emotional reset.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-amber-800">
                    <strong>💡 Parent Tip:</strong> {currentSessionData.parentTip || ''}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (currentSession < sessions.length - 1) {
                      const nextSession = currentSession + 1;
                      setCurrentSession(nextSession);
                      setBreathCycle(0);
                      setIsPlaying(false);
                      setBreathPhase('idle');
                      setTimeRemaining(0);
                      // Clear rating for the completed session
                      setCalmRatings(prev => {
                        const newRatings = { ...prev };
                        delete newRatings[`session${currentSession}`];
                        return newRatings;
                      });
                    } else {
                      setShowGameOver(true);
                    }
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {currentSession < sessions.length - 1 ? 'Next Session' : 'Complete Practice'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default GratitudeBreathing;

