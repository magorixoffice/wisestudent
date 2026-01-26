import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Bed, Apple, Dumbbell, Heart, TrendingUp, CheckCircle, Sparkles, Lightbulb, ArrowRight, Users } from "lucide-react";

const SelfCareInventory = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-96";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || selfCareCategories.length;
  
  const [currentCategory, setCurrentCategory] = useState(0);
  const [ratings, setRatings] = useState({
    rest: null,
    nutrition: null,
    exercise: null,
    joy: null,
    social: null
  });
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // 5-part self-care scorecard
  const selfCareCategories = [
    {
      id: 'rest',
      label: 'Rest',
      description: 'How well are you resting? Sleep quality, downtime, relaxation',
      emoji: '😴',
      icon: Bed,
      color: 'from-indigo-400 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-300',
      examples: 'Sleep quality, downtime, breaks, relaxation time'
    },
    {
      id: 'nutrition',
      label: 'Nutrition',
      description: 'How well are you nourishing your body? Eating habits, hydration',
      emoji: '🍎',
      icon: Apple,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      examples: 'Eating habits, meal regularity, hydration, balanced meals'
    },
    {
      id: 'exercise',
      label: 'Exercise',
      description: 'How much are you moving your body? Physical activity, movement',
      emoji: '💪',
      icon: Dumbbell,
      color: 'from-orange-400 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-300',
      examples: 'Physical activity, movement, walks, stretching, workouts'
    },
    {
      id: 'joy',
      label: 'Joy',
      description: 'How much joy and pleasure are you experiencing? Fun, hobbies, enjoyment',
      emoji: '😊',
      icon: Heart,
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-300',
      examples: 'Fun activities, hobbies, pleasure, enjoyment, laughter'
    },
    {
      id: 'social',
      label: 'Social Connection',
      description: 'How well are you connecting with others? Relationships, friendships, community',
      emoji: '👥',
      icon: Users,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300',
      examples: 'Relationships, friendships, community involvement, social activities'
    }
  ];

  // Ensure currentCategory stays within bounds
  useEffect(() => {
    if (currentCategory >= selfCareCategories.length && selfCareCategories.length > 0) {
      setCurrentCategory(selfCareCategories.length - 1);
    }
  }, [currentCategory, selfCareCategories]);

  const handleRatingChange = (categoryId, value) => {
    setRatings(prev => ({
      ...prev,
      [categoryId]: parseInt(value)
    }));
  };

  const handleNext = () => {
    const currentCategoryData = selfCareCategories[currentCategory];
    if (currentCategoryData && ratings[currentCategoryData.id] !== null) {
      if (currentCategory < totalLevels - 1) {
        setCurrentCategory(prev => prev + 1);
      } else {
        setShowResults(true);
      }
    }
  };

  const calculateWellbeingScore = () => {
    const values = Object.values(ratings).filter(v => v !== null);
    if (values.length === 0) return 0;
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.round(average * 10); // Convert to 0-100 scale
  };

  const getWellbeingLevel = (score) => {
    if (score >= 80) return { label: 'Excellent', emoji: '🌟', color: 'from-green-500 to-emerald-600', bgColor: 'from-green-50 to-emerald-50', borderColor: 'border-green-300' };
    if (score >= 60) return { label: 'Good', emoji: '👍', color: 'from-blue-500 to-indigo-600', bgColor: 'from-blue-50 to-indigo-50', borderColor: 'border-blue-300' };
    if (score >= 40) return { label: 'Fair', emoji: '📊', color: 'from-yellow-500 to-amber-600', bgColor: 'from-yellow-50 to-amber-50', borderColor: 'border-yellow-300' };
    return { label: 'Needs Attention', emoji: '💡', color: 'from-orange-500 to-red-600', bgColor: 'from-orange-50 to-red-50', borderColor: 'border-orange-300' };
  };

  const getSuggestions = (score) => {
    const suggestions = [];
    const values = Object.values(ratings);

    // Check each category
    selfCareCategories.forEach((category, index) => {
      const rating = ratings[category.id];
      if (rating !== null) {
        if (rating <= 4) {
          suggestions.push({
            category: category.label,
            rating,
            suggestion: `Your ${category.label.toLowerCase()} is low (${rating}/10). Focus on small, consistent improvements in this area. Even 15 minutes a day can make a difference.`,
            priority: 'high'
          });
        } else if (rating <= 6) {
          suggestions.push({
            category: category.label,
            rating,
            suggestion: `Your ${category.label.toLowerCase()} is moderate (${rating}/10). There's room to strengthen this area. Consider what small changes could boost it.`,
            priority: 'medium'
          });
        }
      }
    });

    // Overall suggestions
    if (score < 50) {
      suggestions.push({
        category: 'Overall',
        rating: null,
        suggestion: 'Your overall wellbeing needs attention. Start with the area that feels most manageable. Small steps in self-care compound over time.',
        priority: 'high'
      });
    } else if (score < 70) {
      suggestions.push({
        category: 'Overall',
        rating: null,
        suggestion: 'Your self-care is on a good foundation. Identify which area needs the most support and focus your energy there.',
        priority: 'medium'
      });
    } else {
      suggestions.push({
        category: 'Overall',
        rating: null,
        suggestion: 'Great job maintaining self-care! Continue to monitor and adjust as your needs change. Remember that self-care isn\'t selfish—it\'s essential.',
        priority: 'low'
      });
    }

    return suggestions;
  };

  const handleComplete = () => {
    // Count how many categories have been rated (not null)
    const completedCategories = Object.values(ratings).filter(rating => rating !== null).length;
    setScore(completedCategories);
    setShowGameOver(true);
  };

  const wellbeingScore = calculateWellbeingScore();
  const wellbeingLevel = getWellbeingLevel(wellbeingScore);
  const suggestions = getSuggestions(wellbeingScore);
  const currentCategoryData = selfCareCategories[currentCategory] || {};
  const currentRating = currentCategoryData.id ? ratings[currentCategoryData.id] : null;
  const progress = ((currentCategory + 1) / totalLevels) * 100;

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Self-Care Inventory"}
        subtitle="Inventory Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={Object.values(ratings).every(rating => rating !== null)}
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
                {wellbeingLevel.emoji}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Wellbeing Score</h2>
              <div className={`inline-block bg-gradient-to-br ${wellbeingLevel.bgColor} rounded-xl px-8 py-4 border-2 ${wellbeingLevel.borderColor} mb-4`}>
                <p className="text-5xl font-bold text-gray-800 mb-2">{wellbeingScore}/100</p>
                <p className="text-xl font-semibold text-gray-700">{wellbeingLevel.label}</p>
              </div>
            </div>

            {/* Scorecard Display */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Self-Care Scorecard</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selfCareCategories.map((category) => {
                  const rating = ratings[category.id];
                  const percentage = rating ? (rating / 10) * 100 : 0;
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-gradient-to-br ${category.bgColor} rounded-xl p-5 border-2 ${category.borderColor}`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{category.emoji}</span>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800">{category.label}</h4>
                          <p className="text-xs text-gray-600">{category.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-white rounded-full h-4 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            className={`bg-gradient-to-r ${category.color} h-4 rounded-full`}
                          />
                        </div>
                        <span className="text-lg font-bold text-gray-800 w-12 text-right">
                          {rating || 0}/10
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-blue-600" />
                Personalized Suggestions
              </h3>
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-lg p-4 border-l-4 ${
                      suggestion.priority === 'high'
                        ? 'border-red-400'
                        : suggestion.priority === 'medium'
                        ? 'border-yellow-400'
                        : 'border-green-400'
                    }`}
                  >
                    {suggestion.rating !== null && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-800">{suggestion.category}:</span>
                        <span className="text-sm text-gray-600">({suggestion.rating}/10)</span>
                      </div>
                    )}
                    <p className="text-gray-700">{suggestion.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-green-600" />
                Why Self-Care Matters
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Self-Care is Family Care:</strong> Your energy sets the home's tone. When you're rested, nourished, active, and experiencing joy, you have more to give to your family. Taking care of yourself isn't selfish—it's essential for being the parent you want to be.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Balance Matters:</strong> Rest, nutrition, exercise, and joy all contribute to your overall wellbeing. An imbalance in any area affects your ability to parent effectively and with presence.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Small Steps Count:</strong> Improving self-care doesn't require big changes. Small, consistent actions—like a 10-minute walk, a glass of water, 5 minutes of quiet, or doing something you enjoy—add up over time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Modeling for Children:</strong> When you prioritize self-care, you model healthy habits for your children. They learn that taking care of oneself is important and normal.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Self-care is family care — your energy sets the home's tone. When you take care of yourself—resting, eating well, moving your body, and experiencing joy—you're not being selfish. You're ensuring you have the energy, patience, and presence to be the parent your children need. Your wellbeing directly impacts your family's wellbeing. A rested, nourished, active parent who experiences joy creates a calmer, more connected home. Prioritize your self-care not in addition to parenting, but as an essential part of it.
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
        title={gameData?.title || "Self-Care Inventory"}
        subtitle="Your Wellbeing Score"
        showGameOver={false}
        score={score}
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
                {wellbeingLevel.emoji}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Overall Wellbeing Score</h2>
              <div className={`inline-block bg-gradient-to-br ${wellbeingLevel.bgColor} rounded-xl px-10 py-6 border-2 ${wellbeingLevel.borderColor} mb-4`}>
                <p className="text-6xl font-bold text-gray-800 mb-2">{wellbeingScore}/100</p>
                <p className="text-2xl font-semibold text-gray-700">{wellbeingLevel.label}</p>
              </div>
            </div>

            {/* Scorecard Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {selfCareCategories.map((category) => {
                const rating = ratings[category.id] || 0;
                return (
                  <div
                    key={category.id}
                    className={`bg-gradient-to-br ${category.bgColor} rounded-xl p-4 border-2 ${category.borderColor} text-center`}
                  >
                    <div className="text-3xl mb-2">{category.emoji}</div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1">{category.label}</h4>
                    <p className="text-2xl font-bold text-gray-800">{rating}/10</p>
                  </div>
                );
              })}
            </div>

            {/* Quick Suggestions Preview */}
            {suggestions.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-6">
                <h3 className="font-bold text-gray-800 mb-2">Key Suggestions:</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{suggestion.suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              View Complete Analysis
            </motion.button>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
              <p className="text-sm text-gray-700">
                <strong>💡 Parent Tip:</strong> Self-care is family care — your energy sets the home's tone.
              </p>
            </div>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Self-Care Inventory"}
      subtitle={`${currentCategoryData.label || 'Category'} - Rating ${currentCategory + 1} of ${totalLevels}`}
      showGameOver={false}
      score={0}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentCategory + 1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={currentCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Category {currentCategory + 1} of {totalLevels}</span>
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

          {/* Category Header */}
          {currentCategoryData && currentCategoryData.id && (
          <div className={`bg-gradient-to-br ${currentCategoryData.bgColor} rounded-xl p-6 border-2 ${currentCategoryData.borderColor} mb-6`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">{currentCategoryData.emoji}</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentCategoryData.label}</h2>
                <p className="text-gray-700">{currentCategoryData.description}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Consider:</strong> {currentCategoryData.examples}
              </p>
            </div>
          </div>
          )}

          {/* Rating Scale */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
              Rate your {(currentCategoryData.label || '').toLowerCase()} (1-10)
            </h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => {
                const isSelected = currentRating === value;
                let bgColor = 'bg-gray-100';
                if (value <= 3) bgColor = 'bg-red-100';
                else if (value <= 5) bgColor = 'bg-yellow-100';
                else if (value <= 7) bgColor = 'bg-blue-100';
                else bgColor = 'bg-green-100';

                return (
                  <motion.button
                    key={value}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => currentCategoryData.id && handleRatingChange(currentCategoryData.id, value)}
                    className={`h-12 rounded-lg border-2 font-bold transition-all ${
                      isSelected
                        ? 'border-4 border-gray-800 shadow-lg scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${bgColor}`}
                  >
                    {value}
                  </motion.button>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>Very Low</span>
              <span>Very High</span>
            </div>
          </div>

          {/* Selected Rating Display */}
          {currentRating !== null && currentCategoryData && currentCategoryData.id && (
            <div className={`bg-gradient-to-br ${currentCategoryData.bgColor} rounded-xl p-4 border-2 ${currentCategoryData.borderColor} mb-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Your Rating:</p>
                  <p className="text-3xl font-bold text-gray-800">{currentRating}/10</p>
                </div>
                <div className="text-4xl">{currentCategoryData.emoji}</div>
              </div>
            </div>
          )}

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={currentRating === null}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {currentCategory < totalLevels - 1 ? (
              <>
                Continue to {(selfCareCategories[currentCategory + 1] && selfCareCategories[currentCategory + 1].label) || 'Next'}
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                View Wellbeing Score
                <TrendingUp className="w-5 h-5" />
              </>
            )}
          </motion.button>

          {currentRating === null && (
            <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
              <p className="text-yellow-800 text-sm text-center">
                Please rate your {(currentCategoryData.label || 'category').toLowerCase()} to continue.
              </p>
            </div>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Self-care is family care — your energy sets the home's tone. Assessing your self-care helps you identify areas that need attention.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default SelfCareInventory;

