import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Target, CheckCircle, ArrowRight, Sparkles, TrendingUp } from "lucide-react";

const PurposeAlignmentQuiz = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-89";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentStatement, setCurrentStatement] = useState(0);
  const [ratings, setRatings] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // 5 reflection statements about daily actions matching parenting goals
  const reflectionStatements = [
    {
      id: 1,
      statement: "I teach what I practice",
      description: "My actions demonstrate the values I want my children to learn",
      emoji: '👨‍👩‍👧‍👦',
      category: 'Modeling'
    },
    {
      id: 2,
      statement: "I spend time meaningfully",
      description: "The time I invest in my children aligns with my parenting goals",
      emoji: '⏰',
      category: 'Time'
    },
    {
      id: 3,
      statement: "My daily priorities reflect my values",
      description: "What I prioritize each day matches what I say matters most",
      emoji: '⭐',
      category: 'Priorities'
    },
    {
      id: 4,
      statement: "I respond consistently with my goals",
      description: "My reactions and responses align with the parent I want to be",
      emoji: '🎯',
      category: 'Consistency'
    },
    {
      id: 5,
      statement: "My words match my actions",
      description: "What I tell my children is reflected in what I do",
      emoji: '💬',
      category: 'Integrity'
    }
  ];

  const handleRatingChange = (statementId, value) => {
    setRatings(prev => ({
      ...prev,
      [statementId]: parseInt(value)
    }));
  };

  const handleNext = () => {
    const currentStatementData = reflectionStatements[currentStatement];
    if (ratings[currentStatementData.id] !== null) {
      if (currentStatement < totalLevels - 1) {
        setCurrentStatement(prev => prev + 1);
      } else {
        // Check if all questions are answered before showing results
        if (Object.keys(ratings).length === totalLevels) {
          setShowResults(true);
        }
      }
    }
  };

  const calculateAlignmentScore = () => {
    const values = Object.values(ratings).filter(v => v !== null);
    if (values.length === 0) return 0;
    // Sum all ratings (each 1-5) for total score out of 25
    const total = values.reduce((sum, val) => sum + val, 0);
    // Convert to 0-100 scale: (total / 25) * 100
    return Math.round((total / 25) * 100);
  };

  const getAlignmentLevel = (score) => {
    if (score >= 80) return { label: 'Highly Aligned', emoji: '🌟', color: 'from-green-500 to-emerald-600', bgColor: 'from-green-50 to-emerald-50', borderColor: 'border-green-300', message: 'Your daily actions strongly align with your parenting goals!' };
    if (score >= 60) return { label: 'Well Aligned', emoji: '👍', color: 'from-blue-500 to-indigo-600', bgColor: 'from-blue-50 to-indigo-50', borderColor: 'border-blue-300', message: 'Your actions mostly align with your parenting goals.' };
    if (score >= 40) return { label: 'Moderately Aligned', emoji: '📊', color: 'from-yellow-500 to-amber-600', bgColor: 'from-yellow-50 to-amber-50', borderColor: 'border-yellow-300', message: 'There\'s some alignment, but room for improvement.' };
    return { label: 'Needs Realignment', emoji: '💡', color: 'from-orange-500 to-red-600', bgColor: 'from-orange-50 to-red-50', borderColor: 'border-orange-300', message: 'Consider realigning your actions with your parenting goals.' };
  };

  const getAlignmentInsights = (score) => {
    const insights = [];
    const values = Object.values(ratings).filter(v => v !== null);
    if (values.length === 0) return ['Please complete all questions to see your insights.'];
    
    const totalScore = values.reduce((sum, val) => sum + val, 0);
    
    // Category analysis
    const categoryRatings = {};
    reflectionStatements.forEach(stmt => {
      if (!categoryRatings[stmt.category]) {
        categoryRatings[stmt.category] = [];
      }
      if (ratings[stmt.id]) {
        categoryRatings[stmt.category].push(ratings[stmt.id]);
      }
    });

    // Find lowest category
    let lowestCategory = null;
    let lowestAvg = 5;
    Object.keys(categoryRatings).forEach(category => {
      const avg = categoryRatings[category].reduce((sum, val) => sum + val, 0) / categoryRatings[category].length;
      if (avg < lowestAvg && categoryRatings[category].length > 0) {
        lowestAvg = avg;
        lowestCategory = category;
      }
    });

    if (lowestCategory && lowestAvg < 3) {
      insights.push(`Consider focusing on ${lowestCategory.toLowerCase()}. This area shows the most opportunity for alignment.`);
    }

    if (totalScore >= 20) {
      insights.push('You\'re doing an excellent job aligning your actions with your parenting goals. Keep up the intentional practice!');
    } else if (totalScore >= 15) {
      insights.push('You\'re mostly aligned! Identify one area where a small shift could create even more harmony.');
    } else if (totalScore >= 10) {
      insights.push('Awareness is the first step. Choose one area to focus on this week—small shifts create big harmony.');
    } else {
      insights.push('Realignment is possible. Start with one statement where you can make a small change this week.');
    }

    return insights;
  };

  const handleComplete = () => {
    // Ensure all questions are answered
    if (Object.keys(ratings).length !== totalLevels) {
      alert('Please answer all questions before completing the quiz.');
      return;
    }
    
    const values = Object.values(ratings).filter(v => v !== null);
    const totalScore = values.reduce((sum, val) => sum + val, 0);
    // Pass the number of questions answered (5) instead of total points for correct display
    setScore(totalLevels); // 5 questions answered correctly
    setShowGameOver(true);
  };

  const alignmentScore = calculateAlignmentScore();
  const alignmentLevel = getAlignmentLevel(alignmentScore);
  const insights = getAlignmentInsights(alignmentScore);
  const currentStatementData = reflectionStatements[currentStatement];
  const currentRating = ratings[currentStatementData?.id];
  const progress = ((currentStatement + 1) / totalLevels) * 100;

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Purpose Alignment Quiz"}
        subtitle="Quiz Complete!"
        showGameOver={true}
        score={totalLevels} // Show 5/5 questions completed
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={Object.keys(ratings).length === totalLevels}
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
                {alignmentLevel.emoji}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Purpose Alignment Score</h2>
              <div className={`inline-block bg-gradient-to-br ${alignmentLevel.bgColor} rounded-xl px-8 py-4 border-2 ${alignmentLevel.borderColor} mb-4`}>
                <p className="text-5xl font-bold text-gray-800 mb-2">{alignmentScore}/100</p>
                <p className="text-xl font-semibold text-gray-700">{alignmentLevel.label}</p>
                <p className="text-sm text-gray-600 mt-2">{alignmentLevel.message}</p>
              </div>
            </div>

            {/* Statement Ratings Summary */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Responses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reflectionStatements.map((stmt) => {
                  const rating = ratings[stmt.id] || 0;
                  const percentage = (rating / 5) * 100;
                  return (
                    <motion.div
                      key={stmt.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{stmt.emoji}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm">{stmt.statement}</p>
                          <p className="text-xs text-gray-600">{stmt.category}</p>
                        </div>
                        <span className="text-lg font-bold text-gray-800">{rating}/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          className={`bg-gradient-to-r ${alignmentLevel.color} h-2 rounded-full`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                Alignment Insights
              </h3>
              <ul className="space-y-2 text-gray-700">
                {insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Principles */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-green-600" />
                About Purpose Alignment
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Actions Speak Louder:</strong> Your daily actions teach your children more than your words. When your actions align with your values, your children learn through observation and experience.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Small Shifts Matter:</strong> Realignment doesn't require major overhauls. Small, consistent shifts in how you spend time, respond to situations, and model behaviors create significant harmony.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Weekly Realignment:</strong> Checking in weekly helps you stay aware of alignment. Regular reflection lets you catch misalignments early and make adjustments.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Modeling Values:</strong> When you teach what you practice, spend time meaningfully, and live your values daily, you create a powerful example for your children.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Harmony Through Alignment:</strong> When your actions match your parenting goals, you experience less internal conflict and more harmony in your family.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Realign your actions weekly—small shifts create big harmony. Take a few minutes each week to reflect on whether your daily actions match your parenting goals and values. Notice where there's misalignment—perhaps you're spending too much time on screens when you value presence, or you're reacting harshly when you want to model patience. Make one small shift this week. Small, consistent adjustments compound over time, creating greater harmony between who you want to be and how you actually parent. Your children learn more from what you do than what you say—alignment matters.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  if (showResults) {
    return (
      <ParentGameShell
        title={gameData?.title || "Purpose Alignment Quiz"}
        subtitle="Your Alignment Score"
        showGameOver={false}
        score={totalLevels} // Show 5/5 questions completed
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
      >
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-7xl mb-4"
              >
                {alignmentLevel.emoji}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Purpose Alignment Score</h2>
              <div className={`inline-block bg-gradient-to-br ${alignmentLevel.bgColor} rounded-xl px-10 py-6 border-2 ${alignmentLevel.borderColor} mb-4`}>
                <p className="text-6xl font-bold text-gray-800 mb-2">{alignmentScore}/100</p>
                <p className="text-2xl font-semibold text-gray-700">{alignmentLevel.label}</p>
              </div>
              <p className="text-gray-600">{alignmentLevel.message}</p>
            </div>

            {/* Quick Summary */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-6">
              <h3 className="font-bold text-gray-800 mb-2">Key Insights:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {insights.slice(0, 2).map((insight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleComplete}
              disabled={Object.keys(ratings).length !== totalLevels}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              View Complete Analysis
            </motion.button>

            {Object.keys(ratings).length < totalLevels && (
              <div className="mt-4 bg-blue-100 rounded-lg p-3 border border-blue-300">
                <p className="text-blue-800 text-sm text-center">
                  Please answer all {totalLevels} questions to view your results.
                </p>
              </div>
            )}

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
              <p className="text-sm text-gray-700">
                <strong>💡 Parent Tip:</strong> Realign your actions weekly—small shifts create big harmony.
              </p>
            </div>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Purpose Alignment Quiz"}
      subtitle={`Statement ${currentStatement + 1} of ${totalLevels}`}
      showGameOver={false}
      score={0}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentStatement + 1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={currentStatement}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Statement {currentStatement + 1} of {totalLevels}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full"
              />
            </div>
          </div>

          {/* Statement Display */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{currentStatementData.emoji}</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                "{currentStatementData.statement}"
              </h2>
              <p className="text-gray-600 text-lg">{currentStatementData.description}</p>
              <div className="inline-block bg-white rounded-lg px-4 py-2 mt-4 border border-purple-200">
                <p className="text-sm font-semibold text-purple-700">{currentStatementData.category}</p>
              </div>
            </div>
          </div>

          {/* Rating Scale */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
              How well does this describe your daily actions? (Rate 1-5)
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((value) => {
                const isSelected = currentRating === value;
                let bgColor = 'bg-gray-100';
                let label = '';
                if (value === 1) { bgColor = 'bg-red-100'; label = 'Rarely'; }
                else if (value === 2) { bgColor = 'bg-orange-100'; label = 'Sometimes'; }
                else if (value === 3) { bgColor = 'bg-yellow-100'; label = 'Often'; }
                else if (value === 4) { bgColor = 'bg-blue-100'; label = 'Usually'; }
                else if (value === 5) { bgColor = 'bg-green-100'; label = 'Always'; }

                return (
                  <motion.button
                    key={value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRatingChange(currentStatementData.id, value)}
                    className={`rounded-xl p-4 border-2 font-bold transition-all ${
                      isSelected
                        ? 'border-4 border-gray-800 shadow-lg scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${bgColor}`}
                  >
                    <div className="text-2xl mb-1">{value}</div>
                    <div className="text-xs">{label}</div>
                  </motion.button>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>Not at all aligned</span>
              <span>Fully aligned</span>
            </div>
          </div>

          {/* Selected Rating Display */}
          {currentRating !== null && (
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border-2 border-purple-200 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Your Rating:</p>
                  <p className="text-3xl font-bold text-gray-800">{currentRating}/5</p>
                </div>
                <div className="text-4xl">{currentStatementData.emoji}</div>
              </div>
            </div>
          )}

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={currentRating === null}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {currentStatement < totalLevels - 1 ? (
              <>
                Continue
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                View Alignment Score
                <TrendingUp className="w-5 h-5" />
              </>
            )}
          </motion.button>

          {currentRating === null && (
            <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
              <p className="text-yellow-800 text-sm text-center">
                Please rate this statement to continue.
              </p>
            </div>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Realign your actions weekly—small shifts create big harmony. This quiz helps you see if your daily actions match your parenting goals and values.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default PurposeAlignmentQuiz;

