import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Clock, Moon, Heart, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Calendar } from "lucide-react";

const WorkLifeTrackerJournal = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-37";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 3;
  
  const [currentDay, setCurrentDay] = useState(0);
  const [dailyData, setDailyData] = useState([
    { day: 1, hoursWorked: '', timeRested: '', joyRating: null },
    { day: 2, hoursWorked: '', timeRested: '', joyRating: null },
    { day: 3, hoursWorked: '', timeRested: '', joyRating: null }
  ]);
  const [showChart, setShowChart] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const dayLabels = ['Day 1', 'Day 2', 'Day 3'];
  const currentDayData = dailyData[currentDay];

  const handleInputChange = (field, value) => {
    const updatedData = [...dailyData];
    if (field === 'joyRating') {
      updatedData[currentDay][field] = parseInt(value) || null;
    } else {
      updatedData[currentDay][field] = value;
    }
    setDailyData(updatedData);
  };

  const handleSaveDay = () => {
    const day = dailyData[currentDay];
    if (!day.hoursWorked || !day.timeRested || day.joyRating === null) {
      alert('Please fill in all fields (hours worked, time rested, and joy rating) before continuing.');
      return;
    }

    const hoursWorked = parseFloat(day.hoursWorked);
    const timeRested = parseFloat(day.timeRested);

    if (isNaN(hoursWorked) || hoursWorked < 0 || hoursWorked > 24) {
      alert('Hours worked must be between 0 and 24.');
      return;
    }

    if (isNaN(timeRested) || timeRested < 0 || timeRested > 24) {
      alert('Time rested must be between 0 and 24 hours.');
      return;
    }

    if (day.joyRating < 1 || day.joyRating > 10) {
      alert('Joy rating must be between 1 and 10.');
      return;
    }

    // Move to next day or show chart
    if (currentDay < 2) {
      setCurrentDay(prev => prev + 1);
    } else {
      setShowChart(true);
      setScore(1);
    }
  };

  const handleComplete = () => {
    setShowGameOver(true);
  };

  const renderBalanceLineChart = () => {
    const chartHeight = 300;
    const chartWidth = 600;
    const padding = 60;
    const effectiveWidth = chartWidth - (padding * 2);
    const effectiveHeight = chartHeight - (padding * 2);

    // Calculate balance score for each day (normalized 0-10)
    // Balance = combination of reasonable work hours, adequate rest, and joy
    const chartData = dailyData.map((day, index) => {
      const hoursWorked = parseFloat(day.hoursWorked) || 0;
      const timeRested = parseFloat(day.timeRested) || 0;
      const joyRating = day.joyRating || 0;

      // Balance calculation:
      // - Work: Ideal is 7-10 hours (score decreases outside this range)
      // - Rest: Ideal is 7-9 hours (score decreases outside this range)
      // - Joy: Direct 1-10 scale
      // Combined balance score (0-10)
      let workScore = 0;
      if (hoursWorked >= 7 && hoursWorked <= 10) {
        workScore = 10;
      } else if (hoursWorked >= 6 && hoursWorked <= 11) {
        workScore = 7;
      } else if (hoursWorked >= 5 && hoursWorked <= 12) {
        workScore = 4;
      } else {
        workScore = Math.max(0, 10 - Math.abs(hoursWorked - 8.5));
      }

      let restScore = 0;
      if (timeRested >= 7 && timeRested <= 9) {
        restScore = 10;
      } else if (timeRested >= 6 && timeRested <= 10) {
        restScore = 7;
      } else if (timeRested >= 5 && timeRested <= 11) {
        restScore = 4;
      } else {
        restScore = Math.max(0, 10 - Math.abs(timeRested - 8));
      }

      const balanceScore = ((workScore * 0.3) + (restScore * 0.3) + (joyRating * 0.4)).toFixed(1);

      return {
        day: dayLabels[index],
        dayNum: day.day,
        hoursWorked,
        timeRested,
        joyRating,
        balanceScore: parseFloat(balanceScore),
        workScore,
        restScore
      };
    });

    const maxBalance = 10;
    const xStep = effectiveWidth / (chartData.length - 1 || 1);

    // Calculate points for balance line
    const points = chartData.map((data, index) => {
      const x = padding + (index * xStep);
      const y = padding + effectiveHeight - (data.balanceScore / maxBalance) * effectiveHeight;
      return { x, y, ...data };
    });

    // Calculate average balance
    const avgBalance = chartData.reduce((sum, d) => sum + d.balanceScore, 0) / chartData.length;

    return (
      <div className="bg-white rounded-xl p-6 border-2 border-indigo-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          Balance Line Chart
        </h3>

        <div className="relative mb-6" style={{ height: `${chartHeight + 40}px` }}>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`} className="w-full h-full">
            {/* Grid lines */}
            {[2, 4, 6, 8, 10].map((value) => {
              const y = padding + effectiveHeight - (value / maxBalance) * effectiveHeight;
              return (
                <g key={value}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={chartWidth - padding}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                  <text
                    x={padding - 10}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="12"
                    fill="#6b7280"
                    fontWeight="500"
                  >
                    {value}
                  </text>
                </g>
              );
            })}

            {/* Balance line */}
            {points.length > 1 && (
              <polyline
                points={points.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data points */}
            {points.map((point, index) => {
              const balanceLevel = point.balanceScore >= 7 ? 'good' : point.balanceScore >= 5 ? 'moderate' : 'low';
              const color = balanceLevel === 'good' ? '#10b981' : balanceLevel === 'moderate' ? '#f59e0b' : '#ef4444';
              
              return (
                <g key={index}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="8"
                    fill={color}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={point.x}
                    y={point.y - 15}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="bold"
                    fill={color}
                  >
                    {point.balanceScore.toFixed(1)}
                  </text>
                  <text
                    x={point.x}
                    y={chartHeight + 25}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6b7280"
                    fontWeight="500"
                  >
                    {point.day}
                  </text>
                </g>
              );
            })}

            {/* Average balance line */}
            {points.length > 0 && (
              <>
                <line
                  x1={padding}
                  y1={padding + effectiveHeight - (avgBalance / maxBalance) * effectiveHeight}
                  x2={chartWidth - padding}
                  y2={padding + effectiveHeight - (avgBalance / maxBalance) * effectiveHeight}
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="5,5"
                  opacity="0.7"
                />
                <text
                  x={chartWidth - padding + 10}
                  y={padding + effectiveHeight - (avgBalance / maxBalance) * effectiveHeight - 5}
                  fontSize="11"
                  fill="#64748b"
                  fontWeight="600"
                >
                  Avg: {avgBalance.toFixed(1)}
                </text>
              </>
            )}
          </svg>
        </div>

        {/* Chart Legend and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {chartData.map((data, index) => (
            <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border-2 border-indigo-200">
              <h4 className="font-bold text-gray-800 mb-2">{data.day}</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Work:</span>
                  <span className="font-semibold text-gray-800">{data.hoursWorked}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rest:</span>
                  <span className="font-semibold text-gray-800">{data.timeRested}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Joy:</span>
                  <span className="font-semibold text-gray-800">{data.joyRating}/10</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-indigo-200">
                  <span className="text-gray-700 font-semibold">Balance:</span>
                  <span className={`font-bold ${
                    data.balanceScore >= 7 ? 'text-green-600' :
                    data.balanceScore >= 5 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {data.balanceScore.toFixed(1)}/10
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Balance Insights */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Balance Insights:</h4>
          <div className="space-y-3">
            {(() => {
              const insights = [];
              
              // Check for trends
              if (chartData.length >= 2) {
                const trend = chartData[chartData.length - 1].balanceScore - chartData[0].balanceScore;
                if (trend < -1) {
                  insights.push({
                    type: 'warning',
                    icon: '⚠️',
                    message: `Your balance decreased by ${Math.abs(trend).toFixed(1)} points across these days. This may indicate increasing imbalance.`
                  });
                } else if (trend > 1) {
                  insights.push({
                    type: 'success',
                    icon: '✅',
                    message: `Your balance improved by ${trend.toFixed(1)} points! You're moving toward better work-life balance.`
                  });
                }
              }

              // Check average balance
              if (avgBalance < 5) {
                insights.push({
                  type: 'warning',
                  icon: '🚨',
                  message: `Average balance score is ${avgBalance.toFixed(1)}/10, indicating significant imbalance. Consider ways to reduce work hours and increase rest/joy.`
                });
              } else if (avgBalance >= 7) {
                insights.push({
                  type: 'success',
                  icon: '✨',
                  message: `Average balance score is ${avgBalance.toFixed(1)}/10, showing good work-life balance! Keep maintaining these healthy patterns.`
                });
              } else {
                insights.push({
                  type: 'info',
                  icon: '💡',
                  message: `Average balance score is ${avgBalance.toFixed(1)}/10. There's room for improvement. Focus on balancing work hours with adequate rest and joy.`
                });
              }

              // Check for extreme work hours
              const highWorkDays = chartData.filter(d => d.hoursWorked > 10).length;
              if (highWorkDays > 0) {
                insights.push({
                  type: 'warning',
                  icon: '⏰',
                  message: `${highWorkDays} day(s) had work hours exceeding 10 hours. Consistently long work hours can lead to burnout.`
                });
              }

              // Check for low rest
              const lowRestDays = chartData.filter(d => d.timeRested < 6).length;
              if (lowRestDays > 0) {
                insights.push({
                  type: 'warning',
                  icon: '😴',
                  message: `${lowRestDays} day(s) had less than 6 hours of rest. Adequate rest (7-9 hours) is essential for sustainable teaching.`
                });
              }

              // Check for low joy
              const lowJoyDays = chartData.filter(d => d.joyRating < 5).length;
              if (lowJoyDays > 0) {
                insights.push({
                  type: 'info',
                  icon: '💔',
                  message: `${lowJoyDays} day(s) had joy ratings below 5/10. Consider incorporating activities that bring joy and fulfillment.`
                });
              }

              return insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    insight.type === 'success' ? 'bg-green-50 border-green-400' :
                    insight.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                    'bg-blue-50 border-blue-400'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xl">{insight.icon}</span>
                    <p className={`text-sm ${
                      insight.type === 'success' ? 'text-green-800' :
                      insight.type === 'warning' ? 'text-yellow-800' :
                      'text-blue-800'
                    }`}>
                      {insight.message}
                    </p>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
    );
  };

  const allDaysCompleted = dailyData.every(day => day.hoursWorked && day.timeRested && day.joyRating !== null);

  return (
    <TeacherGameShell
      title={gameData?.title || "Work–Life Tracker Journal"}
      subtitle={gameData?.description || "Track how personal time fluctuates across 3 days"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentDay + 1}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showChart && !showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Work–Life Tracker Journal
              </h2>
              <p className="text-gray-600 text-lg mb-2">
                Track your work-life balance across 3 days
              </p>
              <p className="text-sm text-gray-500">
                Enter data for {dayLabels[currentDay]} ({currentDay + 1} of 3)
              </p>
            </div>

            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{dayLabels[currentDay]}</span>
                <span>{currentDay + 1} / 3 days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentDay + 1) / 3) * 100}%` }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                />
              </div>
            </div>

            {/* Input Form */}
            <div className="space-y-6">
              {/* Hours Worked */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-red-600" />
                  <div>
                    <h3 className="text-xl font-bold text-red-800">Hours Worked</h3>
                    <p className="text-sm text-red-600">How many hours did you work today (including school + home)?</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-red-300">
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={currentDayData.hoursWorked}
                    onChange={(e) => handleInputChange('hoursWorked', e.target.value)}
                    placeholder="e.g., 9.5"
                    className="w-full text-2xl font-bold text-gray-800 text-center border-none outline-none focus:ring-0"
                  />
                  <p className="text-xs text-gray-500 text-center mt-2">Enter hours (0-24)</p>
                </div>
              </div>

              {/* Time Rested */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                <div className="flex items-center gap-3 mb-4">
                  <Moon className="w-6 h-6 text-indigo-600" />
                  <div>
                    <h3 className="text-xl font-bold text-indigo-800">Time Rested</h3>
                    <p className="text-sm text-indigo-600">How many hours did you rest today (sleep + downtime)?</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-indigo-300">
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={currentDayData.timeRested}
                    onChange={(e) => handleInputChange('timeRested', e.target.value)}
                    placeholder="e.g., 7.5"
                    className="w-full text-2xl font-bold text-gray-800 text-center border-none outline-none focus:ring-0"
                  />
                  <p className="text-xs text-gray-500 text-center mt-2">Enter hours (0-24)</p>
                </div>
              </div>

              {/* Joy Rating */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-200">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-pink-600" />
                  <div>
                    <h3 className="text-xl font-bold text-pink-800">Joy Rating</h3>
                    <p className="text-sm text-pink-600">Rate your level of joy/fulfillment today (1-10)</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-pink-300">
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                      <motion.button
                        key={rating}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleInputChange('joyRating', rating)}
                        className={`w-10 h-10 rounded-full border-2 transition-all font-bold ${
                          currentDayData.joyRating === rating
                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-600 scale-110'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-pink-400'
                        }`}
                      >
                        {rating}
                      </motion.button>
                    ))}
                  </div>
                  {currentDayData.joyRating && (
                    <p className="text-center text-sm text-gray-600">
                      Selected: <span className="font-bold text-pink-600">{currentDayData.joyRating}/10</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentDay(prev => Math.max(0, prev - 1))}
                disabled={currentDay === 0}
                className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous Day
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveDay}
                disabled={!currentDayData.hoursWorked || !currentDayData.timeRested || currentDayData.joyRating === null}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentDay < 2 ? 'Save & Continue →' : 'Save & View Balance Line'}
              </motion.button>
            </div>
          </div>
        )}

        {showChart && !showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Your Balance Line
                </h2>
                <p className="text-gray-600 text-lg">
                  Visualize how your work-life balance fluctuates across 3 days
                </p>
              </div>

              {/* Balance Line Chart */}
              {renderBalanceLineChart()}

              {/* Action Button */}
              <div className="text-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleComplete}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
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
              📊
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Journal Complete!
            </h2>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                You've successfully tracked your work-life balance across 3 days. The Balance Line chart shows how your personal time fluctuates, helping you identify patterns and potential imbalances before they lead to burnout.
              </p>
            </div>

            {/* Final Chart Display */}
            <div className="mb-6">
              {renderBalanceLineChart()}
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Use visual graph to spot imbalance before burnout. The Balance Line chart is a powerful tool for early detection of work-life imbalance. When you see the line trending downward, work hours increasing, or joy ratings consistently low, these are warning signs of potential burnout. Track your balance regularly—weekly or monthly—to catch patterns early. If you notice 2+ days in a row with balance scores below 5, it's time to take action: reduce work hours, prioritize rest, and intentionally add joy activities. Share your balance charts with trusted colleagues or mentors to discuss strategies for improvement. The visual representation makes imbalances clear in ways that just thinking about your schedule doesn't. Prevention is easier than recovery from burnout.
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

export default WorkLifeTrackerJournal;

