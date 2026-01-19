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
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5); // 5 seconds per question
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [answers, setAnswers] = useState([]);
  const timerRef = useRef(null);

  // 5 questions with 4 options each
  const questions = [
    {
      id: 1,
      question: "A student comes to you crying about failing a test. What's the most supportive response?",
      options: [
        { id: 'a', text: "You'll get over it, it's just one test", isCorrect: false, explanation: "This minimizes their feelings and dismisses their experience. It's draining because it invalidates their emotions." },
        { id: 'b', text: "I can see this is really affecting you. Let's talk about how you're feeling", isCorrect: true, explanation: "This validates their emotions and shows willingness to listen. It's supportive because it acknowledges their struggle." },
        { id: 'c', text: "Don't be so emotional, you need to focus on studying more", isCorrect: false, explanation: "This criticizes their emotional expression. It's draining because it dismisses their feelings and puts pressure on them." },
        { id: 'd', text: "Everyone fails tests sometimes, yours isn't even that bad", isCorrect: false, explanation: "This compares their situation to others and minimizes their specific experience. It's draining because it invalidates their unique feelings." }
      ]
    },
    {
      id: 2,
      question: "A colleague vents to you about feeling overwhelmed with workload. How should you respond?",
      options: [
        { id: 'a', text: "I understand why you'd feel that way given your workload", isCorrect: true, explanation: "This shows understanding and validates their emotional response to their circumstances. It's supportive because it connects their feelings to their situation." },
        { id: 'b', text: "You must be strong and power through it like everyone else", isCorrect: false, explanation: "This dismisses their emotions and pressures them to suppress feelings. It's draining because it invalidates their struggle." },
        { id: 'c', text: "Just think positive and it won't feel so heavy", isCorrect: false, explanation: "This oversimplifies complex emotions and dismisses their genuine struggle. It's draining because it minimizes their experience." },
        { id: 'd', text: "Stop making a big deal out of it, everyone has busy periods", isCorrect: false, explanation: "This minimizes their concerns and shuts down emotional expression. It's draining because it invalidates their feelings." }
      ]
    },
    {
      id: 3,
      question: "A parent calls upset about their child's behavioral issues at school. What's your best response?",
      options: [
        
        { id: 'b', text: "You're overreacting, it's just typical kid behavior", isCorrect: false, explanation: "This invalidates their emotional response and judges their reaction. It's draining because it dismisses their genuine concern." },
        { id: 'a', text: "It's okay to feel this way, parenting can be really challenging", isCorrect: true, explanation: "This normalizes their emotions and creates a safe space for expression. It's supportive because it validates their parental struggles." },
        { id: 'c', text: "You should be stronger, kids need firm discipline", isCorrect: false, explanation: "This puts pressure on them to suppress feelings and be 'stronger'. It's draining because it dismisses their emotional needs." },
        { id: 'd', text: "It could be worse, at least your child isn't failing grades", isCorrect: false, explanation: "This invalidates feelings by comparing to worse situations. It's draining because it dismisses their specific concerns." }
      ]
    },
    {
      id: 4,
      question: "A student approaches you saying they feel isolated and alone. How do you respond?",
      options: [
        
        { id: 'b', text: "Everyone feels lonely sometimes, you'll get used to it", isCorrect: false, explanation: "While technically true, this dismisses their unique experience and current feelings. It's draining because it minimizes their specific situation." },
        { id: 'c', text: "Just be more outgoing and make more friends", isCorrect: false, explanation: "This puts the burden entirely on them and dismisses their feelings. It's draining because it invalidates their emotional experience." },
        { id: 'a', text: "You're not alone in this, I'm here to support you", isCorrect: true, explanation: "This provides connection and reduces isolation. It's supportive because it offers companionship during difficult times." },
        { id: 'd', text: "You're being too sensitive, school is supposed to be challenging", isCorrect: false, explanation: "This criticizes their emotional sensitivity and dismisses their feelings. It's draining because it invalidates their genuine experience." }
      ]
    },
    {
      id: 5,
      question: "A teacher tells you they're considering quitting due to burnout. What's the most helpful response?",
      options: [
        
        { id: 'b', text: "Just stick with it, teaching is rewarding in the long run", isCorrect: false, explanation: "This dismisses their current crisis and pressures them to endure. It's draining because it invalidates their present struggle." },
        { id: 'c', text: "You're overreacting, everyone deals with stress", isCorrect: false, explanation: "This invalidates their emotional response and judges their reaction. It's draining because it dismisses their legitimate burnout concerns." },
        { id: 'd', text: "Move on from this negative thinking and focus on solutions", isCorrect: false, explanation: "This forces emotional suppression and doesn't allow for processing. It's draining because it dismisses their need to express and process feelings." },
        { id: 'a', text: "How can I support you right now? Would talking to counseling help?", isCorrect: true, explanation: "This offers practical help and shows care for their needs. It's supportive because it provides concrete assistance options." },
      ]
    }
  ];

  // Questions are already in a fixed order for consistency
  // const shuffledQuestions = [...questions].sort(() => Math.random() - 0.9);

  // Timer effect - 5 seconds per question
  useEffect(() => {
    if (gameState !== "playing") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (currentQuestion >= questions.length) {
      setGameState("finished");
      return;
    }

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Reset timer for new question
    setTimeLeft(5);
    setSelectedOption(null);
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
  }, [gameState, currentQuestion]);

  const handleTimeUp = () => {
    // Time's up - treat as incorrect answer
    const currentQ = questions[currentQuestion];
    const correctOption = currentQ.options.find(opt => opt.isCorrect);
    
    setSelectedOption(null);
    setShowFeedback(true);
    
    setAnswers(prev => [...prev, {
      questionId: currentQ.id,
      question: currentQ.question,
      selectedOption: null,
      correct: false,
      correctOption: correctOption.id,
      explanation: correctOption.explanation,
      timeUp: true
    }]);

    // Show feedback for 4 seconds, then move to next question
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setShowFeedback(false);
      } else {
        setGameState("finished");
      }
    }, 4000);
  };

  const handleOptionSelect = (optionId) => {
    if (selectedOption !== null || gameState !== "playing") return;

    // Clear the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const currentQ = questions[currentQuestion];
    const selectedOpt = currentQ.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOpt.isCorrect;
    const timeUsed = 5 - timeLeft;

    setSelectedOption(optionId);
    setShowFeedback(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setAnswers(prev => [...prev, {
      questionId: currentQ.id,
      question: currentQ.question,
      selectedOption: optionId,
      correct: isCorrect,
      correctOption: currentQ.options.find(opt => opt.isCorrect).id,
      explanation: selectedOpt.explanation,
      timeUsed: timeUsed
    }]);

    // Show feedback for 4 seconds, then move to next question
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        setGameState("finished");
      }
    }, 4000);
  };

  const startGame = () => {
    setGameState("playing");
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(5);
    setSelectedOption(null);
    setShowFeedback(false);
    setAnswers([]);
  };

  const handleFinish = () => {
    setShowGameOver(true);
  };

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentAnswer = answers.find(a => a.questionId === currentQuestionData?.id);

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
      currentQuestion={gameState === "finished" ? totalLevels : currentQuestion + 1}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {gameState === "ready" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">💚</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Empathy Reflex
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Test your empathy skills! Choose the most supportive response to challenging situations.
              Build your emotional intelligence and communication skills!
            </p>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6 max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-800 mb-3">How to play:</h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li>• 5 realistic teaching scenarios with 4 response options each</li>
                <li>• Select the most <strong>supportive</strong> response (green checkmark)</li>
                <li>• Avoid <strong>draining</strong> responses (red X)</li>
                <li>• You have 5 seconds per question</li>
                <li>• Detailed explanations help you learn from each choice</li>
                
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

        {gameState === "playing" && currentQuestionData && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestion + 1} of 5</span>
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

            {/* Current Question */}
            {!showFeedback ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {currentQuestionData.question}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestionData.options.map((option) => (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionSelect(option.id)}
                      disabled={selectedOption !== null}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedOption === option.id
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-300 bg-white hover:border-blue-300 hover:shadow-md'
                      } ${selectedOption !== null ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          selectedOption === option.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {option.id.toUpperCase()}
                        </div>
                        <p className="text-gray-800 font-medium">
                          {option.text}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
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
                        ? "Correct! That's the most supportive response!" 
                        : "Not quite. Here's the better approach:"}
                    </h3>
                    
                    <div className="bg-white rounded-lg p-4 border-2 mb-4 text-left">
                      <p className="font-semibold text-gray-800 mb-2">Best Response:</p>
                      <p className="text-gray-700">
                        {currentQuestionData.options.find(opt => opt.id === currentAnswer?.correctOption)?.text}
                      </p>
                    </div>
                    
                    {currentAnswer?.explanation && (
                      <div className={`mt-4 p-4 rounded-lg border-2 ${
                        currentAnswer?.correct
                          ? 'bg-green-100 border-green-300'
                          : 'bg-red-100 border-red-300'
                      }`}>
                        <p className={`text-sm font-semibold mb-2 ${
                          currentAnswer?.correct ? 'text-green-900' : 'text-red-900'
                        }`}>
                          💡 Why this matters:
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
              {score >= 5 ? '🌟' : score >= 3 ? '✨' : '💪'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Game Complete!
            </h2>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6 max-w-2xl mx-auto">
              <p className="text-2xl font-bold text-green-800 mb-2">
                Final Score: {score} / 5
              </p>
              <p className="text-lg text-gray-700">
                {score >= 5
                  ? "Perfect! You have strong empathy reflexes! You quickly recognize supportive responses."
                  : score >= 3
                  ? "Good job! You're developing strong empathy reflexes. Keep practicing!"
                  : "Nice effort! Empathy reflexes improve with practice. Keep identifying supportive responses!"}
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 mb-6 text-left max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-800 mb-4">Your Answers:</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {answers.map((answer, index) => {
                  const question = questions.find(q => q.id === answer.questionId);
                  const selectedOption = question?.options.find(opt => opt.id === answer.selectedOption);
                  const correctOption = question?.options.find(opt => opt.isCorrect);
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        answer.correct
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {answer.correct ? (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800 mb-2">
                            Q{answer.questionId}: {question?.question}
                          </p>
                          <div className="mb-2">
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Your answer:</span> {selectedOption?.text || 'None (time expired)'}
                            </p>
                            {!answer.correct && (
                              <p className="text-xs text-gray-600 mt-1">
                                <span className="font-medium">Better response:</span> {correctOption?.text}
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {answer.timeUsed ? `${answer.timeUsed.toFixed(1)}s used` : 'Time expired'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
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

