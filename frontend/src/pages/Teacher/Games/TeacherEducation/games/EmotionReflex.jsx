import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Clock, Zap } from "lucide-react";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";

const EmotionReflex = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-9";
  const gameData = getTeacherEducationGameById(gameId);
  
  // 5 flash cards with emotions
  const flashCards = [
    { id: 1, type: 'phrase', content: "My shoulders are so tight", emotion: 'Tense', options: [ 'Relaxed', 'Comfortable', 'Loose','Tense',], correct: 3 },
   
    { id: 2, type: 'phrase', content: "What if I mess this up?", emotion: 'Anxious', options: ['Anxious', 'Calm', 'Excited', 'Bored'], correct: 0 },
    { id: 3, type: 'phrase', content: "I'm so grateful right now", emotion: 'Grateful', options: [ 'Resentful', 'Neutral', 'Grateful','Frustrated'], correct: 2 },
    { id: 4, type: 'phrase', content: "This is too much pressure", emotion: 'Stressed', options: [ 'Relaxed','Stressed', 'Motivated', 'Content'], correct: 1 },
    { id: 5, type: 'phrase', content: "I feel completely drained", emotion: 'Exhausted', options: ['Exhausted', 'Energetic', 'Focused', 'Alert'], correct: 0 },
    
  ];

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalLevels || flashCards.length; // Use gameData totalLevels or fallback to flashCards.length
  
  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [currentCard, setCurrentCard] = useState(0);
  const [timeLeft, setTimeLeft] = useState(2);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [answeredCards, setAnsweredCards] = useState([]);
  const timerRef = useRef(null);

  // Timer effect - 2 seconds per card
  useEffect(() => {
    if (gameState !== "playing") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (currentCard >= flashCards.length) {
      setGameState("finished");
      return;
    }

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Reset timer for new card
    setTimeLeft(5);
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
  }, [gameState, currentCard]);

  const handleTimeUp = () => {
    // Time's up - mark as incorrect
    const card = flashCards[currentCard];
    setSelectedAnswer(null);
    setShowFeedback(true);
    
    setAnsweredCards(prev => [...prev, {
      cardId: card.id,
      correct: false,
      timeUp: true
    }]);

    // Move to next card after showing feedback
    setTimeout(() => {
      if (currentCard < flashCards.length - 1) {
        setCurrentCard(prev => prev + 1);
      } else {
        setGameState("finished");
      }
    }, 1500);
  };

  const handleAnswer = (optionIndex) => {
    if (selectedAnswer !== null || gameState !== "playing") return;

    // Clear the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const card = flashCards[currentCard];
    const isCorrect = optionIndex === card.correct;
    const timeUsed = 2 - timeLeft;

    setSelectedAnswer(optionIndex);
    setShowFeedback(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setAnsweredCards(prev => [...prev, {
      cardId: card.id,
      correct: isCorrect,
      timeUsed: timeUsed,
      selectedOption: card.options[optionIndex]
    }]);

    // Move to next card after showing feedback
    setTimeout(() => {
      if (currentCard < flashCards.length - 1) {
        setCurrentCard(prev => prev + 1);
      } else {
        setGameState("finished");
      }
    }, 1500);
  };

  const startGame = () => {
    setGameState("playing");
    setCurrentCard(0);
    setScore(0);
    setTimeLeft(2);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAnsweredCards([]);
  };

  const handleFinish = () => {
    setShowGameOver(true);
  };

  const currentCardData = flashCards[currentCard];
  const progress = ((currentCard + 1) / flashCards.length) * 100;

  return (
    <TeacherGameShell
      title={gameData?.title || "Emotion Reflex"}
      subtitle={gameData?.description || "React to quick emotion cues in images or phrases"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentCard}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {gameState === "ready" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">⚡</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Emotion Reflex
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Quick reaction game! Identify the emotion in each flash card within 2 seconds.
            </p>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-gray-700 mb-2"><strong>How to play:</strong></p>
              <ul className="text-left text-gray-600 space-y-1 max-w-md mx-auto">
                <li>• You'll see {flashCards.length} flash cards with emotions</li>
                <li>• Each card shows for 5 seconds</li>
                <li>• Tap the correct emotion quickly!</li>
                <li>• Get instant feedback on your answer</li>
              </ul>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Start Game ⚡
            </motion.button>
          </div>
        )}

        {gameState === "playing" && currentCardData && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Card {currentCard + 1} of {flashCards.length}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  Score: {score}/{currentCard + 1}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Timer */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-full px-6 py-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-2xl font-bold text-orange-600">
                  {timeLeft.toFixed(1)}s
                </span>
              </div>
            </div>

            {/* Flash Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard}
                initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-12 border-4 border-purple-300 shadow-xl min-h-[300px] flex items-center justify-center">
                  {currentCardData.type === 'emoji' ? (
                    <div className="text-center">
                      <div className="text-9xl mb-4">{currentCardData.content}</div>
                      <p className="text-xl text-gray-600">What emotion is this?</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-800 mb-4 leading-relaxed max-w-2xl">
                        "{currentCardData.content}"
                      </div>
                      <p className="text-xl text-gray-600">What emotion does this express?</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Answer Options */}
            {!showFeedback && (
              <div className="grid grid-cols-2 gap-4">
                {currentCardData.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(index)}
                    className="bg-white border-2 border-gray-300 rounded-xl p-6 text-lg font-semibold text-gray-800 hover:border-purple-500 hover:bg-purple-50 transition-all shadow-md hover:shadow-lg"
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Feedback */}
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                {selectedAnswer !== null ? (
                  selectedAnswer === currentCardData.correct ? (
                    <div className="bg-green-50 border-2 border-green-400 rounded-xl p-6 text-center">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <span className="text-2xl font-bold text-green-700">Correct! 🎉</span>
                      </div>
                      <p className="text-gray-700">
                        The emotion is <strong>{currentCardData.emotion}</strong>
                      </p>
                    </div>
                  ) : (
                    <div className="bg-red-50 border-2 border-red-400 rounded-xl p-6 text-center">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <XCircle className="w-8 h-8 text-red-600" />
                        <span className="text-2xl font-bold text-red-700">Incorrect</span>
                      </div>
                      <p className="text-gray-700">
                        The correct emotion is <strong>{currentCardData.emotion}</strong>
                      </p>
                    </div>
                  )
                ) : (
                  <div className="bg-orange-50 border-2 border-orange-400 rounded-xl p-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Clock className="w-8 h-8 text-orange-600" />
                      <span className="text-2xl font-bold text-orange-700">Time's Up!</span>
                    </div>
                    <p className="text-gray-700">
                      The correct emotion is <strong>{currentCardData.emotion}</strong>
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}

        {gameState === "finished" && !showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">🏆</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Game Complete!
            </h2>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
              <p className="text-4xl font-bold text-purple-600 mb-2">
                {score} / {flashCards.length}
              </p>
              <p className="text-gray-600">
                {score === flashCards.length 
                  ? "Perfect score! Amazing reflexes! 🎉"
                  : score >= flashCards.length * 0.8
                  ? "Great job! You're quick at recognizing emotions!"
                  : score >= flashCards.length * 0.6
                  ? "Good work! Keep practicing to improve your speed!"
                  : "Nice try! Practice makes perfect!"}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFinish}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              View Results
            </motion.button>
          </div>
        )}

        {/* Teacher Tip */}
        <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-amber-900 mb-2">
            💡 Teacher Tip:
          </p>
          <p className="text-sm text-amber-800 leading-relaxed">
            Use this as a "reset mini-game" between classes. When you have a few minutes between periods, play a quick round of Emotion Reflex. This helps you:
            <br />• Reset your emotional state
            <br />• Practice quick emotional recognition
            <br />• Take a mental break from teaching
            <br />• Prepare for the next class with a clear mind
            <br />
            Just 2-3 minutes can help you transition smoothly between classes and maintain emotional awareness throughout your day.
          </p>
        </div>
      </div>
    </TeacherGameShell>
  );
};

export default EmotionReflex;

