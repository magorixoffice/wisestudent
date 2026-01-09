import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { CheckCircle, XCircle, Minus, AlertCircle } from "lucide-react";

const BoundariesQuiz = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-32";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 8;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Boundary assessment options
  const boundaryOptions = [
    { 
      id: 'healthy', 
      label: 'Healthy', 
      icon: CheckCircle, 
      color: 'from-green-500 to-emerald-500', 
      bgColor: 'from-green-50 to-emerald-50', 
      borderColor: 'border-green-300', 
      textColor: 'text-green-800' 
    },
    { 
      id: 'unhealthy', 
      label: 'Unhealthy', 
      icon: XCircle, 
      color: 'from-red-500 to-rose-500', 
      bgColor: 'from-red-50 to-rose-50', 
      borderColor: 'border-red-300', 
      textColor: 'text-red-800' 
    },
    { 
      id: 'neutral', 
      label: 'Neutral', 
      icon: Minus, 
      color: 'from-gray-500 to-slate-500', 
      bgColor: 'from-gray-50 to-slate-50', 
      borderColor: 'border-gray-300', 
      textColor: 'text-gray-800' 
    }
  ];

  // Work boundary scenarios
  const scenarios = [
    {
      id: 1,
      scenario: "Answering student texts at 10 PM",
      correctAnswer: 'unhealthy',
      rationale: {
        healthy: "While being responsive can feel helpful, answering work messages at 10 PM blurs the boundary between work and personal time. This can lead to burnout and prevents you from fully disconnecting and resting.",
        unhealthy: "Correct! Answering student texts at 10 PM is an unhealthy boundary. Work communication should happen during work hours. Setting clear communication hours protects your personal time and prevents burnout. It's okay to wait until the next school day to respond.",
        neutral: "This is actually an unhealthy boundary, not neutral. Answering work messages late at night disrupts rest and blurs work-life boundaries. Setting clear communication hours is important for sustainable teaching."
      }
    },
    {
      id: 2,
      scenario: "Bringing grading home every night",
      correctAnswer: 'unhealthy',
      rationale: {
        healthy: "While occasional work at home might be necessary, bringing grading home every night is an unhealthy pattern. This prevents you from fully disconnecting and can lead to chronic stress and burnout.",
        unhealthy: "Correct! Bringing grading home every night is an unhealthy boundary. While occasional work at home happens, making it a nightly habit prevents rest and recovery. Consider setting specific days for grading or using planning periods more effectively.",
        neutral: "This is actually an unhealthy boundary, not neutral. Consistently bringing work home every night prevents rest and recovery, leading to burnout. Healthy boundaries include designated work-free time."
      }
    },
    {
      id: 3,
      scenario: "Setting 'no email after 6 PM' rule and sticking to it",
      correctAnswer: 'healthy',
      rationale: {
        healthy: "Correct! Setting and maintaining a 'no email after 6 PM' rule is a healthy boundary. It protects your personal time, allows for rest and recovery, and models self-care. Clear boundaries help prevent burnout and maintain sustainable teaching.",
        unhealthy: "Actually, this is a healthy boundary. Setting clear communication hours protects your personal time and prevents work from spilling into rest time. Healthy boundaries are essential for sustainable teaching.",
        neutral: "This is actually a healthy boundary, not neutral. Setting clear communication hours is an important self-care practice that protects your rest time and prevents burnout."
      }
    },
    {
      id: 4,
      scenario: "Working through lunch break to catch up",
      correctAnswer: 'unhealthy',
      rationale: {
        healthy: "While it might feel productive, working through lunch breaks is an unhealthy boundary. Breaks are essential for rest, recovery, and maintaining energy. Skipping breaks leads to exhaustion and decreased effectiveness.",
        unhealthy: "Correct! Working through lunch breaks is an unhealthy boundary. Breaks are essential for rest, recovery, and maintaining energy throughout the day. Taking breaks actually improves productivity and prevents burnout.",
        neutral: "This is actually an unhealthy boundary, not neutral. Working through breaks prevents rest and recovery, leading to exhaustion. Healthy boundaries include taking designated break times."
      }
    },
    {
      id: 5,
      scenario: "Saying 'no' to extra responsibilities when already overwhelmed",
      correctAnswer: 'healthy',
      rationale: {
        healthy: "Correct! Saying 'no' to extra responsibilities when overwhelmed is a healthy boundary. It protects your capacity, prevents burnout, and allows you to maintain quality in your existing responsibilities. Setting limits is essential for sustainable teaching.",
        unhealthy: "Actually, this is a healthy boundary. Saying 'no' when overwhelmed protects your capacity and prevents burnout. Healthy boundaries include recognizing your limits and prioritizing your wellbeing.",
        neutral: "This is actually a healthy boundary, not neutral. Saying 'no' when overwhelmed is an important self-care practice that protects your capacity and prevents burnout."
      }
    },
    {
      id: 6,
      scenario: "Checking work email during family dinner",
      correctAnswer: 'unhealthy',
      rationale: {
        healthy: "While staying connected might feel necessary, checking work email during family dinner is an unhealthy boundary. It disrupts personal time, sends a message that work is more important than family, and prevents full presence in personal relationships.",
        unhealthy: "Correct! Checking work email during family dinner is an unhealthy boundary. It disrupts personal time, sends a message that work takes priority over family, and prevents you from being fully present. Healthy boundaries include designated work-free times.",
        neutral: "This is actually an unhealthy boundary, not neutral. Checking work email during personal time disrupts relationships and prevents rest. Healthy boundaries include being fully present during personal time."
      }
    },
    {
      id: 7,
      scenario: "Taking a mental health day when feeling burned out",
      correctAnswer: 'healthy',
      rationale: {
        healthy: "Correct! Taking a mental health day when feeling burned out is a healthy boundary. It recognizes your needs, allows for rest and recovery, and prevents more serious health issues. Self-care is essential for sustainable teaching.",
        unhealthy: "Actually, this is a healthy boundary. Taking mental health days when needed is an important self-care practice. Recognizing when you need rest and taking it prevents more serious burnout and health issues.",
        neutral: "This is actually a healthy boundary, not neutral. Taking mental health days when needed is an important self-care practice that prevents burnout and supports sustainable teaching."
      }
    },
    {
      id: 8,
      scenario: "Staying at school until 8 PM every day to finish work",
      correctAnswer: 'unhealthy',
      rationale: {
        healthy: "While dedication is admirable, staying at school until 8 PM every day is an unhealthy boundary. It prevents rest, recovery, and personal time. Sustainable teaching requires balance and designated work hours.",
        unhealthy: "Correct! Staying at school until 8 PM every day is an unhealthy boundary. While occasional late nights happen, making it a daily habit prevents rest, recovery, and personal time. Healthy boundaries include designated work hours and leaving work at work.",
        neutral: "This is actually an unhealthy boundary, not neutral. Consistently working until 8 PM prevents rest and personal time, leading to burnout. Healthy boundaries include designated work hours."
      }
    }
  ];

  const currentScenario = scenarios[currentQuestion];
  const selectedAnswer = selectedAnswers[currentScenario.id];
  const progress = ((currentQuestion + 1) / scenarios.length) * 100;

  const handleAnswerSelect = (answerId) => {
    if (selectedAnswer) return; // Already answered

    const isCorrect = answerId === currentScenario.correctAnswer;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [currentScenario.id]: answerId
    }));

    setShowFeedback(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentQuestion < scenarios.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  return (
    <TeacherGameShell
      title={gameData?.title || "Boundaries Quiz"}
      subtitle={gameData?.description || "Learn to identify healthy and unhealthy work boundaries"}
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
                <span>Question {currentQuestion + 1} of {scenarios.length}</span>
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

            {/* Scenario */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Is this a healthy or unhealthy work boundary?
                </h2>
                <div className="bg-white rounded-lg p-6 border-2 border-indigo-300">
                  <p className="text-xl text-gray-700 font-semibold">
                    "{currentScenario.scenario}"
                  </p>
                </div>
              </div>
            </div>

            {/* Answer Options */}
            {!showFeedback ? (
              <div className="space-y-4 mb-6">
                {boundaryOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(option.id)}
                      className={`w-full p-5 rounded-xl border-2 ${option.borderColor} bg-gradient-to-r ${option.bgColor} hover:shadow-lg transition-all text-left`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r ${option.color}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-xl font-bold ${option.textColor}`}>
                            {option.label}
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
                    selectedAnswer === currentScenario.correctAnswer
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                      : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {selectedAnswer === currentScenario.correctAnswer ? (
                      <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3 className={`text-2xl font-bold mb-3 ${
                        selectedAnswer === currentScenario.correctAnswer
                          ? 'text-green-800'
                          : 'text-red-800'
                      }`}>
                        {selectedAnswer === currentScenario.correctAnswer
                          ? "Correct!"
                          : "Not quite"}
                      </h3>
                      <div className={`bg-white rounded-lg p-4 border-l-4 ${
                        selectedAnswer === currentScenario.correctAnswer
                          ? 'border-green-500'
                          : 'border-red-500'
                      }`}>
                        <p className={`${
                          selectedAnswer === currentScenario.correctAnswer
                            ? 'text-green-800'
                            : 'text-red-800'
                        }`}>
                          {currentScenario.rationale[selectedAnswer]}
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
                  {currentQuestion < scenarios.length - 1 ? 'Next Question' : 'View Results'}
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
              {score >= 6 ? '🎯' : score >= 4 ? '✨' : '💪'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Quiz Complete!
            </h2>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6 max-w-2xl mx-auto">
              <p className="text-2xl font-bold text-purple-800 mb-2">
                Final Score: {score} / {scenarios.length}
              </p>
              <p className="text-lg text-gray-700">
                {score >= 6
                  ? "Excellent! You have a strong understanding of healthy work boundaries. Keep maintaining these boundaries to prevent burnout."
                  : score >= 4
                  ? "Good job! You're developing awareness of work boundaries. Continue learning and practicing healthy boundary-setting."
                  : "Nice effort! Boundary awareness takes practice. Review the feedback and continue learning about healthy work boundaries."}
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 mb-6 text-left max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-800 mb-4">Your Responses:</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {scenarios.map((scenario) => {
                  const answer = selectedAnswers[scenario.id];
                  const isCorrect = answer === scenario.correctAnswer;
                  return (
                    <div
                      key={scenario.id}
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
                            "{scenario.scenario}"
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Your answer: {boundaryOptions.find(o => o.id === answer)?.label || 'Not answered'} • 
                            Correct: {boundaryOptions.find(o => o.id === scenario.correctAnswer)?.label}
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
                    Discuss results with peers to spot cultural norms that harm rest. Many unhealthy boundaries are normalized in teaching culture (like answering emails late at night or working through breaks). When you discuss boundary scenarios with colleagues, you can identify which practices are actually harmful versus which are necessary. This collective awareness helps shift school culture toward healthier boundaries. Share your quiz results and insights with trusted colleagues to start conversations about boundary-setting. Together, you can support each other in maintaining healthy work boundaries and challenge cultural norms that lead to burnout.
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

export default BoundariesQuiz;

