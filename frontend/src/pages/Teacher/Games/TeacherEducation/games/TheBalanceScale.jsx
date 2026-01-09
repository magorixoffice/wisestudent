import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Sliders, Scale, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";

const TheBalanceScale = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-31";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [allocations, setAllocations] = useState({
    work: 10,    // hours per day
    family: 3,   // hours per day
    self: 1,     // hours per day
    sleep: 7     // hours per day
  });
  
  const [showInsight, setShowInsight] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const categories = [
    { 
      id: 'work', 
      label: 'Work', 
      icon: '💼', 
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      hexFrom: '#3b82f6',
      hexTo: '#06b6d4',
      recommended: { min: 7, max: 10 }
    },
    { 
      id: 'family', 
      label: 'Family', 
      icon: '👨‍👩‍👧‍👦', 
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-300',
      hexFrom: '#ec4899',
      hexTo: '#f43f5e',
      recommended: { min: 2, max: 4 }
    },
    { 
      id: 'self', 
      label: 'Self', 
      icon: '🧘', 
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      hexFrom: '#22c55e',
      hexTo: '#10b981',
      recommended: { min: 1, max: 3 }
    },
    { 
      id: 'sleep', 
      label: 'Sleep', 
      icon: '😴', 
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      hexFrom: '#a855f7',
      hexTo: '#6366f1',
      recommended: { min: 7, max: 9 }
    }
  ];

  const totalHours = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  const maxHours = 24;
  const remainingHours = maxHours - totalHours;

  const handleSliderChange = (categoryId, value) => {
    const newValue = parseInt(value);
    const currentTotal = Object.values(allocations).reduce((sum, val) => sum + val, 0) - allocations[categoryId];
    const maxAllowed = maxHours - currentTotal;
    const adjustedValue = Math.min(newValue, maxAllowed);
    
    setAllocations(prev => ({
      ...prev,
      [categoryId]: adjustedValue
    }));
    setShowInsight(false);
  };

  // Calculate balance index (0-100)
  const calculateBalanceIndex = () => {
    let score = 0;
    let maxScore = 0;

    categories.forEach(category => {
      const hours = allocations[category.id];
      const { min, max } = category.recommended;
      maxScore += 10;
      
      if (hours >= min && hours <= max) {
        // Perfect range
        score += 10;
      } else if (hours < min) {
        // Below recommended
        const deficit = min - hours;
        score += Math.max(0, 10 - (deficit * 2));
      } else {
        // Above recommended
        const excess = hours - max;
        score += Math.max(0, 10 - (excess * 2));
      }
    });

    // Bonus for total hours being close to 24
    if (totalHours >= 22 && totalHours <= 24) {
      score += 10;
      maxScore += 10;
    }

    return Math.round((score / maxScore) * 100);
  };

  const balanceIndex = calculateBalanceIndex();
  const balanceLevel = balanceIndex >= 80 ? 'excellent' : balanceIndex >= 60 ? 'good' : balanceIndex >= 40 ? 'moderate' : 'needs-improvement';

  const getBalanceInsight = () => {
    const insights = [];
    
    // Check each category
    categories.forEach(category => {
      const hours = allocations[category.id];
      const { min, max } = category.recommended;
      
      if (hours < min) {
        insights.push({
          type: 'warning',
          message: `${category.label} time (${hours}h) is below recommended range (${min}-${max}h). This can lead to imbalance.`
        });
      } else if (hours > max) {
        insights.push({
          type: 'warning',
          message: `${category.label} time (${hours}h) exceeds recommended range (${min}-${max}h). This may impact other areas.`
        });
      } else {
        insights.push({
          type: 'success',
          message: `${category.label} time (${hours}h) is within a healthy range.`
        });
      }
    });

    // Overall balance insight
    if (totalHours < 22) {
      insights.push({
        type: 'info',
        message: `You have ${remainingHours} hours unallocated. Consider where this time goes or if you're underestimating your commitments.`
      });
    } else if (totalHours > 24) {
      insights.push({
        type: 'warning',
        message: `Your total (${totalHours}h) exceeds 24 hours. Be realistic about what's actually possible in a day.`
      });
    }

    return insights;
  };

  const insights = getBalanceInsight();

  const handleShowInsight = () => {
    setShowInsight(true);
    setScore(1); // Mark as completed
  };

  const handleComplete = () => {
    setShowGameOver(true);
  };

  const getBalanceColor = () => {
    switch (balanceLevel) {
      case 'excellent':
        return 'from-green-500 to-emerald-500';
      case 'good':
        return 'from-blue-500 to-cyan-500';
      case 'moderate':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-red-500 to-rose-500';
    }
  };

  const getBalanceLabel = () => {
    switch (balanceLevel) {
      case 'excellent':
        return 'Excellent Balance';
      case 'good':
        return 'Good Balance';
      case 'moderate':
        return 'Moderate Balance';
      default:
        return 'Needs Improvement';
    }
  };

  return (
    <TeacherGameShell
      title={gameData?.title || "The Balance Scale"}
      subtitle={gameData?.description || "Understand the current ratio between personal time and school time"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={1}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showInsight ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                The Balance Scale
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                Adjust the sliders to reflect how you <strong>actually</strong> spend your time in a typical day
              </p>
              <p className="text-sm text-gray-500 italic">
                Be honest and realistic—not ideal. This helps create honest awareness.
              </p>
            </div>

            {/* Balance Index Display */}
            <div className="mb-8">
              <div className={`bg-gradient-to-br ${getBalanceColor()} rounded-xl p-6 border-2 border-white/50 shadow-lg`}>
                <div className="text-center text-white">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <Scale className="w-8 h-8" />
                    <h3 className="text-2xl font-bold">Balance Index</h3>
                  </div>
                  <div className="text-6xl font-bold mb-2">{balanceIndex}</div>
                  <div className="text-xl font-semibold">{getBalanceLabel()}</div>
                </div>
              </div>
            </div>

            {/* Visual Balance Scale */}
            <div className="mb-8">
              <div className="bg-gray-100 rounded-xl p-6 border-2 border-gray-200">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Daily Time Allocation</h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className={`text-2xl font-bold ${totalHours > 24 ? 'text-red-600' : totalHours < 22 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {totalHours}h
                    </span>
                    <span className="text-gray-600">/ 24h</span>
                    {totalHours > 24 && (
                      <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Over 24h</span>
                    )}
                    {totalHours < 22 && remainingHours > 0 && (
                      <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                        {remainingHours}h unallocated
                      </span>
                    )}
                  </div>
                </div>

                {/* Visual Bar Representation */}
                <div className="space-y-2">
                  {categories.map((category) => {
                    const hours = allocations[category.id];
                    const percentage = (hours / 24) * 100;
                    const isInRange = hours >= category.recommended.min && hours <= category.recommended.max;
                    
                    return (
                      <div key={category.id} className="relative">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-2xl">{category.icon}</span>
                          <span className="text-sm font-semibold text-gray-700 w-20">{category.label}</span>
                          <div className="flex-1 relative h-6 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5 }}
                              className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold w-12 text-right ${isInRange ? 'text-green-600' : 'text-gray-700'}`}>
                              {hours}h
                            </span>
                            {isInRange ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : hours < category.recommended.min ? (
                              <TrendingDown className="w-4 h-4 text-yellow-600" />
                            ) : (
                              <TrendingUp className="w-4 h-4 text-orange-600" />
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 ml-10 mb-2">
                          Recommended: {category.recommended.min}-{category.recommended.max}h
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-6 mb-6">
              {categories.map((category, index) => {
                const value = allocations[category.id];
                const maxAllowed = maxHours - (Object.values(allocations).reduce((sum, val) => sum + val, 0) - value);
                
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${category.bgColor} border-2 ${category.borderColor} rounded-xl p-6`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{category.icon}</span>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{category.label}</h3>
                          <p className="text-sm text-gray-600">
                            Recommended: {category.recommended.min}-{category.recommended.max} hours
                          </p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-800">{value}</div>
                        <div className="text-sm text-gray-600">hours</div>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={maxAllowed}
                      value={value}
                      onChange={(e) => handleSliderChange(category.id, e.target.value)}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, ${category.hexFrom} 0%, ${category.hexFrom} ${(value / maxAllowed) * 100}%, #e5e7eb ${(value / maxAllowed) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>0h</span>
                      <span>{maxAllowed}h max</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Action Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShowInsight}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                View Balance Insight
              </motion.button>
            </div>
          </div>
        ) : (
          /* Insight Screen */
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Your Balance Insights
                </h2>
                <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${getBalanceColor()} text-white px-6 py-3 rounded-xl mb-4`}>
                  <Scale className="w-6 h-6" />
                  <span className="text-2xl font-bold">Balance Index: {balanceIndex}</span>
                </div>
                <p className="text-lg text-gray-600">
                  {getBalanceLabel()}
                </p>
              </div>

              {/* Insights List */}
              <div className="space-y-4 mb-8">
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border-2 ${
                      insight.type === 'success'
                        ? 'bg-green-50 border-green-300'
                        : insight.type === 'warning'
                        ? 'bg-yellow-50 border-yellow-300'
                        : 'bg-blue-50 border-blue-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {insight.type === 'success' ? (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      ) : insight.type === 'warning' ? (
                        <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      )}
                      <p className={`text-sm ${
                        insight.type === 'success'
                          ? 'text-green-800'
                          : insight.type === 'warning'
                          ? 'text-yellow-800'
                          : 'text-blue-800'
                      }`}>
                        {insight.message}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Your Current Balance:</h3>
                <div className="grid grid-cols-2 gap-4">
                  {categories.map(category => (
                    <div key={category.id} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{category.icon}</span>
                        <span className="font-semibold text-gray-700">{category.label}</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-800">{allocations[category.id]}h</div>
                      <div className="text-xs text-gray-500">
                        {allocations[category.id] >= category.recommended.min && allocations[category.id] <= category.recommended.max
                          ? '✓ In range'
                          : allocations[category.id] < category.recommended.min
                          ? '⚠ Below recommended'
                          : '⚠ Above recommended'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleComplete}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Complete
                </motion.button>
              </div>
            </motion.div>
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
              {balanceLevel === 'excellent' ? '🎯' : balanceLevel === 'good' ? '✨' : balanceLevel === 'moderate' ? '💪' : '🔍'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Balance Assessment Complete
            </h2>
            <div className={`bg-gradient-to-br ${getBalanceColor()} rounded-xl p-6 border-2 border-white/50 shadow-lg mb-6 max-w-md mx-auto`}>
              <p className="text-xl font-bold text-white mb-2">
                Balance Index: {balanceIndex}
              </p>
              <p className="text-lg text-white/90">
                {getBalanceLabel()}
              </p>
            </div>
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200 max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Encourage realistic—not ideal—answers to start honest awareness. The Balance Scale works best when you're honest about how you actually spend your time, not how you wish you spent it. If your balance index is lower than you'd like, that's okay—awareness is the first step toward change. Use this assessment regularly (monthly or quarterly) to track whether your balance is improving. Remember, perfect balance is rare and unrealistic. The goal is awareness and gradual improvement, not perfection. Share your insights with a trusted colleague or mentor to discuss strategies for better balance.
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

export default TheBalanceScale;

