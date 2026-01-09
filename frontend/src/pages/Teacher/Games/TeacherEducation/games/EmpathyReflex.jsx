import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Clock, Zap, Heart, AlertCircle } from "lucide-react";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";

const EmpathyReflex = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-29";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 20;
  
  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3); // 3 seconds per phrase
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [answeredPhrases, setAnsweredPhrases] = useState([]);
  const timerRef = useRef(null);

  // 20 flash phrases - supportive vs draining
  const phrases = [
    { id: 1, text: "I'm here to listen", isSupportive: true, explanation: "Supportive - Shows presence and willingness to hear the person out." },
    { id: 2, text: "You must be strong", isSupportive: false, explanation: "Draining - Dismisses emotions and puts pressure on the person to suppress feelings." },
    { id: 3, text: "That sounds really hard", isSupportive: true, explanation: "Supportive - Validates the person's experience and acknowledges their difficulty." },
    { id: 4, text: "You'll get over it", isSupportive: false, explanation: "Draining - Minimizes the person's feelings and dismisses their experience." },
    { id: 5, text: "I can see this is affecting you", isSupportive: true, explanation: "Supportive - Acknowledges the person's emotional state with empathy." },
    { id: 6, text: "It could be worse", isSupportive: false, explanation: "Draining - Invalidates feelings by comparing to others' situations." },
    { id: 7, text: "Your feelings are valid", isSupportive: true, explanation: "Supportive - Affirms the person's right to feel their emotions." },
    { id: 8, text: "Don't be so emotional", isSupportive: false, explanation: "Draining - Criticizes emotional expression and dismisses feelings." },
    { id: 9, text: "I understand why you'd feel that way", isSupportive: true, explanation: "Supportive - Shows understanding and validates the emotional response." },
    { id: 10, text: "Just think positive", isSupportive: false, explanation: "Draining - Oversimplifies complex emotions and dismisses genuine struggles." },
    { id: 11, text: "You're not alone in this", isSupportive: true, explanation: "Supportive - Provides connection and reduces isolation." },
    { id: 12, text: "Stop making a big deal out of it", isSupportive: false, explanation: "Draining - Minimizes the person's concerns and shuts down expression." },
    { id: 13, text: "It's okay to feel this way", isSupportive: true, explanation: "Supportive - Normalizes emotions and creates a safe space for expression." },
    { id: 14, text: "You're overreacting", isSupportive: false, explanation: "Draining - Invalidates the person's emotional response and judges their reaction." },
    { id: 15, text: "How can I support you right now?", isSupportive: true, explanation: "Supportive - Offers practical help and shows care for the person's needs." },
    { id: 16, text: "Everyone goes through this", isSupportive: false, explanation: "Draining - While true, it dismisses the person's unique experience and feelings." },
    { id: 17, text: "Your emotions make sense given what you're going through", isSupportive: true, explanation: "Supportive - Connects emotions to circumstances, showing understanding." },
    { id: 18, text: "Just move on", isSupportive: false, explanation: "Draining - Forces emotional suppression and doesn't allow for processing." },
    { id: 19, text: "I'm with you in this", isSupportive: true, explanation: "Supportive - Provides companionship and solidarity during difficult times." },
    { id: 20, text: "You're being too sensitive", isSupportive: false, explanation: "Draining - Criticizes the person's emotional sensitivity and dismisses their feelings." }
  ];

  // Shuffle phrases for variety
  const shuffledPhrases = [...phrases].sort(() => Math.random() - 0.5);

  // Timer effect - 3 seconds per phrase
  useEffect(() => {
    if (gameState !== "playing") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (currentPhrase >= shuffledPhrases.length) {
      setGameState("finished");
      return;
    }

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Reset timer for new phrase
    setTimeLeft(3);
    setSelectedAnswer(null);
    setShowFeedback(false);

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 0.1;
        if (newTime <= 0) {
          // Time's up
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          handleTimeUp();
          return 0;
        }
        return Math.max(0, newTime);
      });
    }, 100); // Update every 100ms for smoother countdown

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState, currentPhrase]);

  const handleTimeUp = () => {
    // Time's up - check if they correctly didn't tap a draining phrase
    const phrase = shuffledPhrases[currentPhrase];
    // Correct if phrase is draining (they correctly didn't tap)
    // Incorrect if phrase is supportive (they missed tapping it)
    const isCorrect = !phrase.isSupportive;
    setSelectedAnswer('timeUp');
    setShowFeedback(true);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setAnsweredPhrases(prev => [...prev, {
      phraseId: phrase.id,
      phrase: phrase.text,
      correct: isCorrect,
      timeUp: true,
      isSupportive: phrase.isSupportive,
      explanation: phrase.explanation,
      action: 'timeUp'
    }]);

    // Move to next phrase after showing feedback
    setTimeout(() => {
      if (currentPhrase < shuffledPhrases.length - 1) {
        setCurrentPhrase(prev => prev + 1);
      } else {
        setGameState("finished");
      }
    }, 2000);
  };

  const handleTap = () => {
    if (selectedAnswer !== null || gameState !== "playing") return;

    // Clear the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const phrase = shuffledPhrases[currentPhrase];
    // Correct if they tapped a supportive phrase OR didn't tap a draining phrase
    // Since they tapped, it's only correct if the phrase is supportive
    const isCorrect = phrase.isSupportive;
    const timeUsed = 3 - timeLeft;

    setSelectedAnswer('tap');
    setShowFeedback(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setAnsweredPhrases(prev => [...prev, {
      phraseId: phrase.id,
      phrase: phrase.text,
      correct: isCorrect,
      timeUsed: timeUsed,
      isSupportive: phrase.isSupportive,
      explanation: phrase.explanation,
      action: 'tap'
    }]);

    // Move to next phrase after showing feedback
    setTimeout(() => {
      if (currentPhrase < shuffledPhrases.length - 1) {
        setCurrentPhrase(prev => prev + 1);
      } else {
        setGameState("finished");
      }
    }, 2000);
  };

  const startGame = () => {
    setGameState("playing");
    setCurrentPhrase(0);
    setScore(0);
    setTimeLeft(3);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAnsweredPhrases([]);
  };

  const handleFinish = () => {
    setShowGameOver(true);
  };

  const currentPhraseData = shuffledPhrases[currentPhrase];
  const progress = ((currentPhrase + 1) / shuffledPhrases.length) * 100;
  const currentAnswer = answeredPhrases.find(a => a.phraseId === currentPhraseData?.id);

  return (
    <TeacherGameShell
      title={gameData?.title || "Empathy Reflex"}
      subtitle={gameData?.description || "Rapidly identify emotionally supportive vs draining responses"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentPhrase}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {gameState === "ready" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">💚</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Empathy Reflex
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Quick reaction game! Tap supportive phrases within 3 seconds. 
              Don't tap draining phrases. Build your empathy reflexes!
            </p>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6 max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-800 mb-3">How to play:</h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li>• {shuffledPhrases.length} phrases will flash on screen</li>
                <li>• Tap <strong>supportive</strong> phrases (green) quickly</li>
                <li>• Don't tap <strong>draining</strong> phrases (red)</li>
                <li>• You have 3 seconds per phrase</li>
                <li>• Get instant feedback on each response</li>
              </ul>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
            >
              <Zap className="w-6 h-6" />
              Start Game
            </motion.button>
          </div>
        )}

        {gameState === "playing" && currentPhraseData && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Phrase {currentPhrase + 1} of {shuffledPhrases.length}</span>
                <span className="font-semibold">Score: {score}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                />
              </div>
            </div>

            {/* Timer */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="text-xl font-bold text-gray-800">
                  {timeLeft > 0 ? timeLeft.toFixed(1) : '0.0'}s
                </span>
              </div>
            </div>

            {/* Current Phrase */}
            {!showFeedback ? (
              <motion.div
                key={currentPhraseData.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`rounded-2xl p-8 border-4 cursor-pointer transition-all ${
                  currentPhraseData.isSupportive
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 hover:border-green-400 hover:shadow-lg'
                    : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300 hover:border-red-400 hover:shadow-lg'
                }`}
                onClick={handleTap}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <div className={`text-4xl mb-4 ${
                    currentPhraseData.isSupportive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {currentPhraseData.isSupportive ? <Heart className="w-12 h-12 mx-auto" /> : <AlertCircle className="w-12 h-12 mx-auto" />}
                  </div>
                  <p className={`text-3xl font-bold mb-4 ${
                    currentPhraseData.isSupportive ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {currentPhraseData.text}
                  </p>
                  <p className="text-gray-600 text-lg">
                    {currentPhraseData.isSupportive 
                      ? "Tap if this is SUPPORTIVE" 
                      : "Don't tap - this is DRAINING"}
                  </p>
                </div>
              </motion.div>
            ) : (
              /* Feedback */
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`rounded-2xl p-8 border-4 ${
                    currentAnswer?.correct
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400'
                      : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-400'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">
                      {currentAnswer?.correct ? '✓' : '✗'}
                    </div>
                    <div className={`text-4xl mb-4 ${
                      currentAnswer?.correct ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {currentAnswer?.correct ? (
                        <CheckCircle className="w-16 h-16 mx-auto" />
                      ) : (
                        <XCircle className="w-16 h-16 mx-auto" />
                      )}
                    </div>
                    <h3 className={`text-2xl font-bold mb-4 ${
                      currentAnswer?.correct ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {currentAnswer?.correct 
                        ? (currentAnswer?.isSupportive 
                          ? "Correct! You tapped a supportive phrase!" 
                          : "Correct! You correctly didn't tap a draining phrase!")
                        : (currentAnswer?.isSupportive && currentAnswer?.action === 'timeUp'
                          ? "Missed it! That was supportive - you should have tapped"
                          : currentAnswer?.isSupportive && currentAnswer?.action === 'tap'
                          ? "Wait, that's correct!" // This shouldn't happen, but handle it
                          : "Oops! You tapped a draining phrase - you shouldn't have tapped")
                      }
                    </h3>
                    {currentAnswer?.explanation && (
                      <div className={`mt-4 p-4 rounded-lg border-2 ${
                        currentAnswer?.correct
                          ? 'bg-green-100 border-green-300'
                          : 'bg-red-100 border-red-300'
                      }`}>
                        <p className={`text-sm font-semibold mb-2 ${
                          currentAnswer?.correct ? 'text-green-900' : 'text-red-900'
                        }`}>
                          💡 Explanation:
                        </p>
                        <p className={`text-sm ${
                          currentAnswer?.correct ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {currentAnswer.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        )}

        {gameState === "finished" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-6xl mb-6"
            >
              {score >= 15 ? '🌟' : score >= 10 ? '✨' : '💪'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Game Complete!
            </h2>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6 max-w-2xl mx-auto">
              <p className="text-2xl font-bold text-green-800 mb-2">
                Final Score: {score} / {shuffledPhrases.length}
              </p>
              <p className="text-lg text-gray-700">
                {score >= 15
                  ? "Excellent! You have strong empathy reflexes! You quickly recognize supportive responses."
                  : score >= 10
                  ? "Good job! You're developing strong empathy reflexes. Keep practicing!"
                  : "Nice effort! Empathy reflexes improve with practice. Keep identifying supportive responses!"}
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 mb-6 text-left max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-800 mb-4">Your Responses:</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {answeredPhrases.map((answer, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      answer.correct
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {answer.correct ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">
                          "{answer.phrase}"
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {answer.isSupportive ? 'Supportive' : 'Draining'} • {answer.timeUsed ? `${answer.timeUsed.toFixed(1)}s` : 'Time\'s up'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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
                    Play in pairs during teacher breaks as a quick empathy check. This game helps you quickly identify whether your responses are supportive or draining. Practice recognizing phrases that validate emotions ("I understand", "That sounds hard") versus those that dismiss them ("You'll get over it", "Don't be so sensitive"). Use this with colleagues to build a shared language of supportive communication. The faster you recognize supportive vs draining responses, the more effectively you can communicate with students, parents, and colleagues. This reflex becomes especially valuable in high-stress moments when you need to respond quickly with empathy.
                  </p>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFinish}
              className="mt-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Complete Game
            </motion.button>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default EmpathyReflex;

