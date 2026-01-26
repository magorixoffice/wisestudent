import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Smartphone, Shield, CheckCircle, ArrowRight, Sparkles, Bell } from "lucide-react";

const DigitalBoundariesQuiz = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-93";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showGameOver, setShowGameOver] = useState(false);

  // 5 questions about digital boundaries
  const questions = [
    {
      id: 1,
      question: "How many hours per day do your children typically spend on screens (phones, tablets, computers, TV)?",
      options: [
        { id: 'b', text: '1-2 hours', score: 4 },
        { id: 'c', text: '2-4 hours', score: 3 },
        { id: 'd', text: '4-6 hours', score: 2 },
        { id: 'a', text: 'Less than 1 hour', score: 5 },
        { id: 'e', text: 'More than 6 hours', score: 1 }
      ],
      category: 'screen-time'
    },
    {
      id: 2,
      question: "Do you have specific screen-free times or zones in your home?",
      options: [
        { id: 'b', text: 'Yes, some times/zones (meals or bedrooms)', score: 4 },
        { id: 'c', text: 'Sometimes, but not consistently', score: 3 },
        { id: 'd', text: 'No, but we\'re thinking about it', score: 2 },
        { id: 'e', text: 'No, we don\'t have any', score: 1 },
        { id: 'a', text: 'Yes, multiple times/zones (meals, bedrooms, before bed)', score: 5 },
      ],
      category: 'boundaries'
    },
    {
      id: 3,
      question: "How do you handle screen time limits with your children?",
      options: [
        { id: 'b', text: 'We have set rules that we enforce consistently', score: 4 },
        { id: 'c', text: 'We have rules but they\'re flexible depending on the day', score: 3 },
        { id: 'a', text: 'We plan screen times together and discuss them openly', score: 5 },
        { id: 'd', text: 'We set limits but struggle to enforce them', score: 2 },
        { id: 'e', text: 'We don\'t really have limits', score: 1 }
      ],
      category: 'enforcement'
    },
    {
      id: 4,
      question: "What happens when screen time limits are exceeded?",
      options: [
        { id: 'b', text: 'We remind them of the rules and enforce consequences', score: 4 },
        { id: 'a', text: 'We discuss it calmly and adjust together', score: 5 },
        { id: 'c', text: 'We sometimes enforce, sometimes let it slide', score: 3 },
        { id: 'd', text: 'We get frustrated but don\'t always follow through', score: 2 },
        { id: 'e', text: 'We don\'t really address it', score: 1 }
      ],
      category: 'consequences'
    },
    {
      id: 5,
      question: "How do you model healthy screen use for your children?",
      options: [
        { id: 'a', text: 'I follow the same boundaries I set for them', score: 5 },
        { id: 'b', text: 'I try to be mindful but sometimes use screens during family time', score: 4 },
        { id: 'c', text: 'I use screens when needed but try to be present', score: 3 },
        { id: 'd', text: 'I use screens frequently, but I\'m an adult so it\'s different', score: 2 },
        { id: 'e', text: 'I don\'t really think about modeling', score: 1 }
      ],
      category: 'modeling'
    }
  ];

  const handleAnswerSelect = (questionId, optionId) => {
    if (selectedAnswers[questionId]) return; // Already answered

    const question = questions.find(q => q.id === questionId);
    const option = question.options.find(o => o.id === optionId);

    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: {
        optionId,
        score: option.score
      }
    }));
  };

  const handleNext = () => {
    if (currentQuestion < totalLevels - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const calculateHealthyTechScore = () => {
    const totalScore = Object.values(selectedAnswers).reduce((sum, answer) => sum + answer.score, 0);
    const maxScore = questions.length * 5;
    const percentage = (totalScore / maxScore) * 100;
    return Math.round(percentage);
  };

  const getScoreCategory = (score) => {
    if (score >= 80) return { label: 'Excellent', emoji: '🌟', color: 'from-green-500 to-emerald-600', bgColor: 'from-green-50 to-emerald-50', borderColor: 'border-green-300' };
    if (score >= 60) return { label: 'Good', emoji: '👍', color: 'from-blue-500 to-indigo-600', bgColor: 'from-blue-50 to-indigo-50', borderColor: 'border-blue-300' };
    if (score >= 40) return { label: 'Fair', emoji: '📊', color: 'from-yellow-500 to-amber-600', bgColor: 'from-yellow-50 to-amber-50', borderColor: 'border-yellow-300' };
    return { label: 'Needs Improvement', emoji: '💡', color: 'from-orange-500 to-red-600', bgColor: 'from-orange-50 to-red-50', borderColor: 'border-orange-300' };
  };

  const getDailyReminders = (score) => {
    const reminders = [];
    
    if (score < 80) {
      reminders.push("Set specific screen-free times (meals, before bed)");
      reminders.push("Plan screen times together with your children");
      reminders.push("Model healthy screen use yourself");
    }
    
    if (score < 60) {
      reminders.push("Create screen-free zones in your home");
      reminders.push("Balance screen time with outdoor play and reading");
      reminders.push("Have open conversations about online safety");
    }
    
    reminders.push("Review and adjust boundaries regularly as your family grows");
    reminders.push("Replace judgment with structure — plan screen times together");
    
    return reminders;
  };

  const getCategoryInsights = () => {
    const categoryScores = {};
    
    questions.forEach(q => {
      const answer = selectedAnswers[q.id];
      if (answer) {
        if (!categoryScores[q.category]) {
          categoryScores[q.category] = { total: 0, count: 0 };
        }
        categoryScores[q.category].total += answer.score;
        categoryScores[q.category].count += 1;
      }
    });

    const insights = [];
    Object.entries(categoryScores).forEach(([category, data]) => {
      const avgScore = data.total / data.count;
      if (avgScore < 3) {
        insights.push({
          category,
          message: `Consider strengthening boundaries around ${category.replace('-', ' ')}`
        });
      }
    });

    return insights;
  };

  const healthyTechScore = calculateHealthyTechScore();
  const scoreCategory = getScoreCategory(healthyTechScore);
  const dailyReminders = getDailyReminders(healthyTechScore);
  const categoryInsights = getCategoryInsights();
  const currentQ = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQ.id];
  const progress = ((currentQuestion + 1) / totalLevels) * 100;

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Digital Boundaries Quiz"}
        subtitle="Quiz Complete!"
        showGameOver={true}
        score={healthyTechScore}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={healthyTechScore >= 80}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-7xl mb-4"
              >
                {scoreCategory.emoji}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Healthy Tech Score</h2>
              <div className={`inline-block bg-gradient-to-br ${scoreCategory.bgColor} rounded-xl px-8 py-4 border-2 ${scoreCategory.borderColor} mb-4`}>
                <p className="text-5xl font-bold text-gray-800 mb-2">{healthyTechScore}/100</p>
                <p className="text-xl font-semibold text-gray-700">{scoreCategory.label}</p>
              </div>
            </div>

            {/* Score Interpretation */}
            <div className={`bg-gradient-to-br ${scoreCategory.bgColor} rounded-xl p-6 border-2 ${scoreCategory.borderColor} mb-6`}>
              <h3 className="text-xl font-bold text-gray-800 mb-3">What This Score Means</h3>
              {healthyTechScore >= 80 && (
                <p className="text-gray-700">
                  Excellent! You have strong digital boundaries in place. You're setting clear limits, involving your children in planning, and modeling healthy screen use. Keep up the great work and continue to adjust as your family grows.
                </p>
              )}
              {healthyTechScore >= 60 && healthyTechScore < 80 && (
                <p className="text-gray-700">
                  Good! You have some digital boundaries in place, but there's room for improvement. Consider strengthening specific areas like screen-free times, consistent enforcement, or involving children more in boundary planning.
                </p>
              )}
              {healthyTechScore >= 40 && healthyTechScore < 60 && (
                <p className="text-gray-700">
                  Fair. You're aware of the need for digital boundaries, but implementation could be more consistent. Focus on setting clear rules, creating screen-free zones, and planning screen times together as a family.
                </p>
              )}
              {healthyTechScore < 40 && (
                <p className="text-gray-700">
                  There's significant opportunity to improve your digital boundaries. Start by setting basic screen-free times (meals, before bed), creating clear rules, and involving your children in planning. Small steps lead to big changes.
                </p>
              )}
            </div>

            {/* Daily Reminders */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Bell className="w-6 h-6 text-blue-600" />
                Daily Reminders
              </h3>
              <ul className="space-y-2">
                {dailyReminders.map((reminder, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{reminder}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Category Insights */}
            {categoryInsights.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                  Areas to Strengthen
                </h3>
                <ul className="space-y-2">
                  {categoryInsights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>{insight.message}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-600" />
                Building Healthy Digital Boundaries
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Plan Together:</strong> Replace judgment with structure — plan screen times together. When children are involved in creating boundaries, they're more likely to follow them and understand why they exist.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Be Consistent:</strong> Clear, consistent boundaries are easier to follow than flexible rules that change daily. Consistency reduces arguments and confusion.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Model What You Teach:</strong> Children learn more from what you do than what you say. If you want them to have healthy screen habits, model them yourself.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Screen-Free Zones:</strong> Create specific times and places where screens are not allowed—meals, bedrooms, before bed. These boundaries protect connection and rest.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Regular Reviews:</strong> Digital boundaries should evolve as your children grow. Review and adjust them together regularly.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Replace judgment with structure — plan screen times together. When you involve your children in setting digital boundaries, you're not just creating rules—you're teaching them to think critically about technology, to understand balance, and to make healthy choices. Structure (clear boundaries, consistent enforcement, family planning) is more effective than judgment (shaming, sudden restrictions, power struggles). Plan screen times together, discuss why boundaries matter, and adjust as needed. This collaborative approach builds respect, understanding, and healthy habits that last.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Digital Boundaries Quiz"}
      subtitle={`Question ${currentQuestion + 1} of ${totalLevels}`}
      showGameOver={false}
      score={Object.keys(selectedAnswers).length}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentQuestion + 1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {totalLevels}</span>
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

          {/* Question */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <Smartphone className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-xl font-bold text-gray-800 leading-relaxed">
                {currentQ.question}
              </h2>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswer?.optionId === option.id;
              return (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: selectedAnswer ? 1 : 1.02 }}
                  whileTap={{ scale: selectedAnswer ? 1 : 0.98 }}
                  onClick={() => handleAnswerSelect(currentQ.id, option.id)}
                  disabled={!!selectedAnswer}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-400 border-4 shadow-lg'
                      : selectedAnswer
                      ? 'bg-gray-50 border-gray-200 opacity-60'
                      : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                  } ${selectedAnswer ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <p className="text-gray-800 font-medium flex-1">{option.text}</p>
                    {isSelected && (
                      <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {currentQuestion < totalLevels - 1 ? (
              <>
                Next Question
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                View Results
                <CheckCircle className="w-5 h-5" />
              </>
            )}
          </motion.button>

          {!selectedAnswer && (
            <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
              <p className="text-yellow-800 text-sm text-center">
                Please select an answer to continue.
              </p>
            </div>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Replace judgment with structure — plan screen times together. This quiz helps you assess your current digital boundaries and identify areas for improvement.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default DigitalBoundariesQuiz;

