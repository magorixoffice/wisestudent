import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const FlowStateSimulation = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-48";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Questions about flow state and focused engagement
  const questions = [
    {
      id: 1,
      question: "What is the primary characteristic of a 'flow state' in work or learning?",
      options: [
        "Complete distraction and wandering thoughts",
        "Multitasking between several different tasks",
        "Constant monitoring of external rewards",
        "Deep focus and complete immersion in the activity",
      ],
      correctAnswer: 3, // Index of correct option
      explanation: "Flow state is characterized by deep focus and complete immersion in an activity. During flow, you lose awareness of time, feel fully engaged, and your actions become effortless and intuitive. This state is highly productive and satisfying.",
      teacherTip: "Try to identify when you naturally enter flow state during teaching. It often happens when you're fully engaged with students, delivering content you're passionate about, or solving classroom challenges creatively. Recognize these moments and try to recreate conditions that facilitate flow regularly."
    },
    {
      id: 2,
      question: "Which of the following best describes how time feels during flow state?",
      options: [
        "Time moves very slowly and drags on",
        "You lose track of time - it seems to fly by",
        "You constantly check the clock",
        "Time stops completely"
      ],
      correctAnswer: 1,
      explanation: "During flow state, people typically lose track of time and feel like it passes much faster than usual. This occurs because attention is fully absorbed in the activity, leaving little cognitive capacity to monitor time passing.",
      teacherTip: "Notice when you lose track of time during teaching - it often indicates you're in a flow state. These are your peak engagement moments. Plan your schedule to maximize these periods by batching similar tasks and eliminating interruptions."
    },
    {
      id: 3,
      question: "What happens to self-consciousness during flow state?",
      options: [
        "It increases dramatically",
        "It remains the same",
        "It decreases significantly",
        "It becomes more critical"
      ],
      correctAnswer: 2,
      explanation: "During flow state, self-consciousness decreases significantly. People become less aware of themselves as separate entities and merge with the activity. This reduces anxiety and allows for more natural, fluid performance.",
      teacherTip: "When you're in flow during teaching, you're not worried about how you appear to others. You're focused on the task at hand. Create classroom environments that reduce self-consciousness for both you and your students to facilitate flow states."
    },
    {
      id: 4,
      question: "Which condition is most likely to promote flow state?",
      options: [
        "Tasks that match your skill level with appropriate challenge",
        "Tasks that are much easier than your skill level",
        "Tasks that are much harder than your skill level",
        "Tasks that involve constant interruptions"
      ],
      correctAnswer: 0,
      explanation: "Flow state occurs when there's a balance between challenge and skill level. The task should be challenging enough to engage your attention but not so difficult that it causes anxiety, nor so easy that it leads to boredom.",
      teacherTip: "Match lesson difficulty to student abilities to promote flow. When students are in flow, learning accelerates. Similarly, challenge yourself with professional tasks that stretch your abilities just enough to maintain engagement without causing stress."
    },
    {
      id: 5,
      question: "What is a key benefit of experiencing flow state regularly?",
      options: [
        "Increased stress and anxiety",
        "Decreased performance quality",
        "Enhanced creativity and productivity",
        "Reduced engagement with tasks"
      ],
      correctAnswer: 2,
      explanation: "Regular flow state experiences enhance creativity and productivity. When in flow, people often discover innovative solutions, produce higher-quality work, and feel more satisfied with their accomplishments. It's a highly beneficial mental state.",
      teacherTip: "Make flow state a regular goal in your teaching practice. When you're in flow, you're more creative, energized, and effective. This positively impacts your students and reduces burnout. Schedule your most important teaching tasks during your peak energy times to increase chances of flow."
    }
  ];

  const currentQuestionData = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestionData.id];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

    const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== undefined) return; // Already answered

    const isCorrect = answerIndex === currentQuestionData.correctAnswer;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionData.id]: answerIndex
    }));

    setShowFeedback(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

    return (
    <TeacherGameShell
      title={gameData?.title || "Flow State Simulation"}
      subtitle={gameData?.description || "Learn how focused engagement feels mentally and physically"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentQuestion + 1}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span className="font-semibold">Score: {score} / {currentQuestion + 1}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                />
              </div>
            </div>

                    {/* Question */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Flow State Knowledge Check
                </h2>
                <div className="bg-white rounded-lg p-6 border-2 border-indigo-300">
                  <p className="text-xl text-gray-700 font-semibold">
                    {currentQuestionData.question}
                  </p>
                </div>
              </div>
            </div>

            {/* Answer Options */}
            {!showFeedback ? (
              <div className="space-y-4 mb-6">
                {currentQuestionData.options.map((option, index) => {
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-5 rounded-xl border-2 border-gray-300 bg-white hover:shadow-lg transition-all text-left`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
                          <span className="text-white font-bold">{String.fromCharCode(65 + index)}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {option}
                          </h3>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              /* Feedback */
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 rounded-xl p-6 border-2 ${
                    selectedAnswer === currentQuestionData.correctAnswer
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                      : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {selectedAnswer === currentQuestionData.correctAnswer ? (
                      <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3 className={`text-2xl font-bold mb-3 ${
                        selectedAnswer === currentQuestionData.correctAnswer
                          ? 'text-green-800'
                          : 'text-red-800'
                      }`}>
                        {selectedAnswer === currentQuestionData.correctAnswer
                          ? "Correct!"
                          : "Not quite"}
                      </h3>
                      <div className={`bg-white rounded-lg p-4 border-l-4 ${
                        selectedAnswer === currentQuestionData.correctAnswer
                          ? 'border-green-500'
                          : 'border-red-500'
                      }`}>
                        <p className={`${
                          selectedAnswer === currentQuestionData.correctAnswer
                            ? 'text-green-800'
                            : 'text-red-800'
                        }`}>
                          {currentQuestionData.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Next Button */}
            {showFeedback && (
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'}
                </motion.button>
              </div>
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
              {score >= 5 ? '🎯' : score >= 3 ? '✨' : '💪'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Flow State Quiz Complete!
            </h2>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6 max-w-2xl mx-auto">
              <p className="text-2xl font-bold text-purple-800 mb-2">
                Final Score: {score} / {questions.length}
              </p>
              <p className="text-lg text-gray-700">
                {score >= 5
                  ? "Excellent! You have a strong understanding of flow state concepts. You're well-equipped to recognize and cultivate flow state in your teaching practice."
                  : score >= 3
                  ? "Good job! You're developing a solid understanding of flow state. Continue learning about focused engagement to enhance your teaching practice."
                  : "Nice effort! Learning about flow state takes practice. Review the concepts and continue exploring focused engagement techniques."}
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 mb-6 text-left max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-800 mb-4">Your Responses:</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {questions.map((question, index) => {
                  const answer = selectedAnswers[question.id];
                  const isCorrect = answer === question.correctAnswer;
                  return (
                    <div
                      key={question.id}
                      className={`p-3 rounded-lg border ${
                        isCorrect
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">
                            Q{index + 1}: {question.question}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Your answer: {question.options[answer] || 'Not answered'} • 
                            Correct: {question.options[question.correctAnswer]}
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
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Apply flow state principles in your classroom by matching lesson difficulty to student abilities, eliminating distractions during focused activities, and creating clear goals for learning tasks. When students experience flow, they learn more effectively and enjoy the process. Plan lessons that provide clear challenges while building on existing skills. Minimize interruptions during focused work time, and help students recognize their own flow state experiences to encourage intrinsic motivation.
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

