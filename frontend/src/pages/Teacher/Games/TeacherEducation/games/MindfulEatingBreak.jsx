import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Play, Pause, RotateCcw, Clock, Utensils, Heart, Volume2 } from "lucide-react";

const MindfulEatingBreak = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-47";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [phase, setPhase] = useState('ready'); // ready, eating, reflection, complete
  const [eatingPhase, setEatingPhase] = useState('idle'); // idle, bite, pause, breathe
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [calmRating, setCalmRating] = useState(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);
  
  const timerRef = useRef(null);
  const speechSynthRef = useRef(null);

  // Mindful eating rhythm: Bite (3s) - Pause (4s) - Breathe (3s) = 10 seconds per cycle
  const eatingTimings = {
    bite: 3,    // Take a bite
    pause: 4,   // Pause and chew mindfully
    breathe: 3  // Breathe and notice
  };

  const TOTAL_CYCLES = 7; // 7 cycles for a mindful eating break

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

  const startEating = () => {
    setPhase('eating');
    setIsPlaying(true);
    setEatingPhase('bite');
    setTimeRemaining(eatingTimings.bite);
    setCycleCount(0);
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
    setEatingPhase('idle');
    setTimeRemaining(0);
    setCycleCount(0);
    setCalmRating(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
    }
  };

  // Handle mindful eating cycle
  useEffect(() => {
    if (!isPlaying || phase !== 'eating') return;

    if (timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else {
      // Move to next phase
      if (eatingPhase === 'bite') {
        // Speak instruction for pause
        speakText("Now pause. Chew slowly and mindfully. Notice the texture, the taste, the sensations.");
        setEatingPhase('pause');
        setTimeRemaining(eatingTimings.pause);
      } else if (eatingPhase === 'pause') {
        // Speak instruction for breathe
        speakText("Take a gentle breath. Notice how you feel. Return your attention to this moment.");
        setEatingPhase('breathe');
        setTimeRemaining(eatingTimings.breathe);
      } else if (eatingPhase === 'breathe') {
        // Complete one cycle
        const newCycle = cycleCount + 1;
        setCycleCount(newCycle);
        
        if (newCycle < TOTAL_CYCLES) {
          // Continue with next bite
          speakText(`Take another mindful bite. Cycle ${newCycle + 1} of ${TOTAL_CYCLES}.`);
          setEatingPhase('bite');
          setTimeRemaining(eatingTimings.bite);
        } else {
          // All cycles complete
          setIsPlaying(false);
          setEatingPhase('idle');
          speakText("You've completed your mindful eating break. Notice how calm and present you feel. Take a moment to reflect on this experience.");
          setTimeout(() => {
            setPhase('reflection');
            if (speechSynthRef.current) {
              speechSynthRef.current.cancel();
            }
          }, 3000);
        }
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, phase, eatingPhase, timeRemaining, cycleCount]);

  // Initial instruction when starting
  useEffect(() => {
    if (phase === 'eating' && eatingPhase === 'bite' && cycleCount === 0 && isPlaying) {
      // First bite instruction
      setTimeout(() => {
        speakText("Welcome to your mindful eating break. Take your first bite. Notice the food, its appearance, its aroma.");
      }, 500);
    }
  }, [phase, eatingPhase, cycleCount, isPlaying]);

  const handleRateCalm = (rating) => {
    setCalmRating(rating);
    setScore(1);
    setTimeout(() => {
      setShowGameOver(true);
    }, 2000);
  };

  // Calculate visual size based on phase
  const getVisualSize = () => {
    if (eatingPhase === 'bite') {
      const progress = 1 - (timeRemaining / eatingTimings.bite);
      return 150 + (progress * 100); // Grows from 150px to 250px
    } else if (eatingPhase === 'pause') {
      return 250; // Maintains size (chewing)
    } else if (eatingPhase === 'breathe') {
      const progress = 1 - (timeRemaining / eatingTimings.breathe);
      return 250 - (progress * 50); // Slightly shrinks then grows
    }
    return 200;
  };

  // Get visual color based on phase
  const getVisualColor = () => {
    if (eatingPhase === 'bite') {
      return 'from-orange-400 via-amber-400 to-yellow-400';
    } else if (eatingPhase === 'pause') {
      return 'from-green-400 via-emerald-400 to-teal-400';
    } else if (eatingPhase === 'breathe') {
      return 'from-blue-400 via-cyan-400 to-indigo-400';
    }
    return 'from-indigo-400 via-purple-400 to-pink-400';
  };

  // Get phase instruction text
  const getPhaseInstruction = () => {
    if (eatingPhase === 'bite') {
      return 'Take a mindful bite. Notice the food.';
    } else if (eatingPhase === 'pause') {
      return 'Pause and chew slowly. Savor each moment.';
    } else if (eatingPhase === 'breathe') {
      return 'Breathe gently. Notice how you feel.';
    }
    return 'Ready to begin';
  };

  // Get phase emoji
  const getPhaseEmoji = () => {
    if (eatingPhase === 'bite') return '🍎';
    else if (eatingPhase === 'pause') return '🫐';
    else if (eatingPhase === 'breathe') return '🌬️';
    return '🍽️';
  };

  return (
    <TeacherGameShell
      title={gameData?.title || "Mindful Eating Break"}
      subtitle={gameData?.description || "Cultivate awareness during short meal or snack breaks"}
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
            <div className="text-6xl mb-6">🍽️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Mindful Eating Break
            </h2>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed max-w-2xl mx-auto">
              This guided exercise will help you cultivate awareness during your meal or snack break. 
              Follow the bite–pause–breathe rhythm to practice mindful eating.
            </p>
            <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-xl p-6 border-2 border-orange-200 mb-6 max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-center gap-2">
                <Utensils className="w-5 h-5" />
                What to expect:
              </h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li>• 7 mindful eating cycles (Bite → Pause → Breathe)</li>
                <li>• Guided audio cues to follow the rhythm</li>
                <li>• Focus on present-moment awareness while eating</li>
                <li>• Reflection on calmness after completion</li>
                <li>• Total time: ~2-3 minutes</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
              <p className="text-sm text-blue-800 flex items-center gap-2 justify-center">
                <Volume2 className="w-4 h-4" />
                <span><strong>Prepare your food or snack</strong> before starting. Audio will guide you through each step.</span>
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startEating}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
            >
              <Play className="w-6 h-6" />
              Begin Mindful Eating
            </motion.button>
          </div>
        )}

        {phase === 'eating' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Mindful Eating in Progress
              </h2>
              <p className="text-gray-600">
                Cycle {cycleCount + 1} of {TOTAL_CYCLES}
              </p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-3 max-w-md mx-auto">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((cycleCount + 1) / TOTAL_CYCLES) * 100}%` }}
                />
              </div>
            </div>

            {/* Visual indicator */}
            <div className="flex items-center justify-center mb-8 min-h-[400px]">
              <motion.div
                animate={{
                  width: `${getVisualSize()}px`,
                  height: `${getVisualSize()}px`,
                }}
                transition={{ duration: eatingPhase === 'pause' ? 0.5 : 3, ease: "easeInOut" }}
                className={`rounded-full bg-gradient-to-br ${getVisualColor()} shadow-2xl flex items-center justify-center relative`}
                style={{
                  filter: `drop-shadow(0 0 ${getVisualSize() / 2}px rgba(255, 165, 0, 0.4))`,
                }}
              >
                <motion.div
                  animate={{
                    scale: eatingPhase === 'pause' ? [1, 1.1, 1] : 1,
                    rotate: eatingPhase === 'pause' ? [0, 5, -5, 0] : 0
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-7xl"
                >
                  {getPhaseEmoji()}
                </motion.div>
              </motion.div>
            </div>

            {/* Instruction */}
            <div className={`bg-gradient-to-br ${
              eatingPhase === 'bite' ? 'from-orange-50 to-amber-50 border-orange-200' :
              eatingPhase === 'pause' ? 'from-green-50 to-emerald-50 border-green-200' :
              'from-blue-50 to-cyan-50 border-blue-200'
            } rounded-xl p-6 border-2 mb-6 text-center`}>
              <p className={`text-2xl font-bold mb-2 ${
                eatingPhase === 'bite' ? 'text-orange-800' :
                eatingPhase === 'pause' ? 'text-green-800' :
                'text-blue-800'
              }`}>
                {getPhaseInstruction()}
              </p>
              {timeRemaining > 0 && (
                <p className={`text-4xl font-bold ${
                  eatingPhase === 'bite' ? 'text-orange-600' :
                  eatingPhase === 'pause' ? 'text-green-600' :
                  'text-blue-600'
                }`}>
                  {timeRemaining}
                </p>
              )}
            </div>

            {/* Cycle breakdown */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className={`p-3 rounded-lg ${
                  eatingPhase === 'bite' ? 'bg-orange-100 border-2 border-orange-300' : 'bg-white border border-gray-200'
                }`}>
                  <div className="text-2xl mb-1">🍎</div>
                  <div className="text-sm font-semibold text-gray-700">Bite</div>
                  <div className="text-xs text-gray-500">3s</div>
                </div>
                <div className={`p-3 rounded-lg ${
                  eatingPhase === 'pause' ? 'bg-green-100 border-2 border-green-300' : 'bg-white border border-gray-200'
                }`}>
                  <div className="text-2xl mb-1">🫐</div>
                  <div className="text-sm font-semibold text-gray-700">Pause & Chew</div>
                  <div className="text-xs text-gray-500">4s</div>
                </div>
                <div className={`p-3 rounded-lg ${
                  eatingPhase === 'breathe' ? 'bg-blue-100 border-2 border-blue-300' : 'bg-white border border-gray-200'
                }`}>
                  <div className="text-2xl mb-1">🌬️</div>
                  <div className="text-sm font-semibold text-gray-700">Breathe</div>
                  <div className="text-xs text-gray-500">3s</div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePause}
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
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

        {phase === 'reflection' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">💚</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Mindful Eating Complete
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              How calm and present do you feel after your mindful eating break?
            </p>

            {/* Calmness Rating */}
            <div className="grid grid-cols-5 gap-4 mb-8 max-w-2xl mx-auto">
              {[1, 2, 3, 4, 5].map((rating) => (
                <motion.button
                  key={rating}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRateCalm(rating)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    calmRating === rating
                      ? 'border-orange-500 bg-gradient-to-br from-orange-100 to-amber-100 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-orange-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-4xl mb-2">
                    {rating === 1 ? '😟' : rating === 2 ? '😐' : rating === 3 ? '🙂' : rating === 4 ? '😊' : '😌'}
                  </div>
                  <div className={`font-bold text-lg ${
                    calmRating === rating ? 'text-orange-700' : 'text-gray-700'
                  }`}>
                    {rating}
                  </div>
                  {rating === 1 && <div className="text-xs text-gray-500 mt-1">Agitated</div>}
                  {rating === 3 && <div className="text-xs text-gray-500 mt-1">Calm</div>}
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
                    ? "Wonderful! You've successfully practiced mindful eating. You're feeling calm, present, and more aware. This practice helps you appreciate your food and reduces stress during breaks."
                    : calmRating >= 3
                    ? "Good! You're feeling more calm and present. Mindful eating takes practice. The more you do it, the more natural it becomes, and the calmer you'll feel during meal breaks."
                    : "You've completed your mindful eating practice. Like any mindfulness skill, it becomes more effective with regular practice. Try it again tomorrow and notice the difference."}
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
              {calmRating >= 4 ? '✨' : calmRating >= 3 ? '🍽️' : '🌟'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Mindful Eating Break Complete!
            </h2>
            <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-xl p-6 border-2 border-orange-200 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {calmRating >= 4
                  ? "Excellent! You've completed a mindful eating break and achieved greater calmness and presence. By practicing awareness during your meal, you've given your nervous system a chance to rest and reset. Mindful eating helps you appreciate your food, improves digestion, and reduces stress during breaks."
                  : calmRating >= 3
                  ? "Well done! You've completed your mindful eating practice and are feeling more calm and present. This practice helps you reconnect with the present moment during meal breaks, reducing stress and improving your relationship with food. Regular practice will deepen these benefits."
                  : "You've completed your mindful eating practice. This is a skill that improves with regular practice. Each time you practice, you're training your mind to be more present and aware, which helps reduce stress and increase calmness during meal breaks."}
              </p>
              <div className="bg-white/60 rounded-lg p-4 mt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Cycles Completed</p>
                    <p className="text-2xl font-bold text-orange-600">{TOTAL_CYCLES} / {TOTAL_CYCLES}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Calmness Level</p>
                    <p className="text-2xl font-bold text-amber-600">{calmRating} / 5</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Encourage group mindful lunch once a week in staffroom. Organize a weekly 'Mindful Lunch Wednesday' (or any day that works) in your staffroom. Invite colleagues to join you for a 10-15 minute mindful eating practice. Start by agreeing to put away phones and devices. Take turns guiding the group through the bite-pause-breathe rhythm, or use this app to guide everyone together. This creates a culture of presence and calm during meal breaks, which reduces stress and builds community. Teachers often eat quickly at their desks or skip meals entirely due to time pressure. A weekly mindful lunch reminds everyone that taking a proper break is important, not optional. It also creates a space for non-work-related connection, which strengthens team bonds. Students benefit when teachers model self-care—when you take a proper, mindful break, you show that rest and presence matter. You can even introduce mindful eating to students during classroom snack time, teaching them to be present with their food. Remember: a calm, present teacher is a more effective teacher. Protecting your meal breaks with mindfulness is an act of professional self-care that improves your teaching quality.
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

export default MindfulEatingBreak;

