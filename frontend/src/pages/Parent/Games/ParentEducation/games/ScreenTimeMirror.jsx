import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Smartphone, TrendingUp, CheckCircle, Sparkles, BarChart3 } from "lucide-react";

const ScreenTimeMirror = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-91";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentDay, setCurrentDay] = useState(0);
  const [trackingEntries, setTrackingEntries] = useState({});
  const [showChart, setShowChart] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // 5 days for weekly tracking
  const weekDays = [
    { id: 0, label: "Day 1", dayName: "Monday" },
    { id: 1, label: "Day 2", dayName: "Tuesday" },
    { id: 2, label: "Day 3", dayName: "Wednesday" },
    { id: 3, label: "Day 4", dayName: "Thursday" },
    { id: 4, label: "Day 5", dayName: "Friday" }
  ];

  const moodOptions = [
    { value: 1, label: "Very Low", emoji: "😢", color: "#ef4444" },
    { value: 2, label: "Low", emoji: "😟", color: "#f97316" },
    { value: 3, label: "Somewhat Low", emoji: "😕", color: "#f59e0b" },
    { value: 4, label: "Neutral-Low", emoji: "😐", color: "#eab308" },
    { value: 5, label: "Neutral", emoji: "😑", color: "#facc15" },
    { value: 6, label: "Neutral-Good", emoji: "🙂", color: "#84cc16" },
    { value: 7, label: "Good", emoji: "😊", color: "#22c55e" },
    { value: 8, label: "Very Good", emoji: "😄", color: "#10b981" },
    { value: 9, label: "Great", emoji: "😁", color: "#3b82f6" },
    { value: 10, label: "Excellent", emoji: "🥳", color: "#6366f1" }
  ];

  const handleEntryChange = (dayId, field, value) => {
    setTrackingEntries(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        [field]: field === 'screenTime' ? parseFloat(value) || 0 : parseInt(value) || 0,
        date: new Date().toLocaleDateString()
      }
    }));
  };

  const isDayComplete = (dayId) => {
    const entry = trackingEntries[dayId];
    return entry?.screenTime > 0 && entry?.mood > 0;
  };

  const handleNext = () => {
    if (isDayComplete(currentDay)) {
      setScore(prev => prev + 1);
      
      if (currentDay < totalLevels - 1) {
        setCurrentDay(prev => prev + 1);
      } else {
        // All 7 days complete - show chart
        setShowChart(true);
      }
    }
  };

  const handleComplete = () => {
    setShowGameOver(true);
  };

  const getChartData = () => {
    return weekDays.map(day => {
      const entry = trackingEntries[day.id];
      const screenTime = entry?.screenTime || 0;
      const moodScore = entry?.mood || 0;
      const mood = moodOptions.find(m => m.value === moodScore);
      return {
        day: day.label,
        dayName: day.dayName,
        screenTime,
        moodScore,
        emoji: mood?.emoji || "",
        color: mood?.color || "#94a3b8",
        label: mood?.label || "Not Rated"
      };
    });
  };

  const getAverageScreenTime = () => {
    const chartData = getChartData();
    const times = chartData.map(d => d.screenTime).filter(t => t > 0);
    if (times.length === 0) return 0;
    return (times.reduce((sum, t) => sum + t, 0) / times.length).toFixed(1);
  };

  const getAverageMood = () => {
    const chartData = getChartData();
    const moods = chartData.map(d => d.moodScore).filter(m => m > 0);
    if (moods.length === 0) return 0;
    return (moods.reduce((sum, m) => sum + m, 0) / moods.length).toFixed(1);
  };

  const calculateCorrelation = () => {
    const chartData = getChartData().filter(d => d.screenTime > 0 && d.moodScore > 0);
    if (chartData.length < 3) return null;

    // Simple correlation calculation
    const n = chartData.length;
    const sumX = chartData.reduce((sum, d) => sum + d.screenTime, 0);
    const sumY = chartData.reduce((sum, d) => sum + d.moodScore, 0);
    const sumXY = chartData.reduce((sum, d) => sum + (d.screenTime * d.moodScore), 0);
    const sumX2 = chartData.reduce((sum, d) => sum + (d.screenTime * d.screenTime), 0);
    const sumY2 = chartData.reduce((sum, d) => sum + (d.moodScore * d.moodScore), 0);

    const numerator = (n * sumXY) - (sumX * sumY);
    const denominator = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));

    if (denominator === 0) return null;
    return numerator / denominator;
  };

  const renderCorrelationChart = () => {
    const chartData = getChartData();
    const maxScreenTime = Math.max(...chartData.map(d => d.screenTime), 12);
    const maxMood = 10;
    const chartHeight = 350;
    const chartWidth = 700;
    const padding = 40;
    const effectiveWidth = chartWidth - (padding * 2);
    const effectiveHeight = chartHeight - (padding * 2);

    return (
      <div className="bg-white rounded-xl p-6 border-2 border-blue-200 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Screen Time vs Mood Correlation
          </h3>
          <div className="text-right">
            <p className="text-xs text-gray-600">Avg Screen Time</p>
            <p className="text-lg font-bold text-blue-600">{getAverageScreenTime()} hrs</p>
          </div>
        </div>

        <div className="relative" style={{ height: `${chartHeight}px`, width: '100%', overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full min-w-[700px]">
            {/* Grid lines for mood (Y-axis) */}
            {[2, 4, 6, 8, 10].map((value) => {
              const y = padding + effectiveHeight - (value / maxMood) * effectiveHeight;
              return (
                <g key={value}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={chartWidth - padding}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="0.5"
                    strokeDasharray="2,2"
                  />
                  <text
                    x={padding - 10}
                    y={y + 4}
                    fontSize="10"
                    fill="#6b7280"
                    textAnchor="end"
                  >
                    {value}
                  </text>
                </g>
              );
            })}

            {/* Grid lines for screen time (X-axis) */}
            {[2, 4, 6, 8, 10, 12].map((value) => {
              if (value > maxScreenTime) return null;
              const x = padding + ((value / maxScreenTime) * effectiveWidth);
              return (
                <g key={value}>
                  <line
                    x1={x}
                    y1={padding}
                    x2={x}
                    y2={chartHeight - padding}
                    stroke="#e5e7eb"
                    strokeWidth="0.5"
                    strokeDasharray="2,2"
                  />
                  <text
                    x={x}
                    y={chartHeight - padding + 20}
                    fontSize="10"
                    fill="#6b7280"
                    textAnchor="middle"
                  >
                    {value}h
                  </text>
                </g>
              );
            })}

            {/* Y-axis label */}
            <text
              x={15}
              y={chartHeight / 2}
              fontSize="12"
              fill="#6b7280"
              textAnchor="middle"
              transform={`rotate(-90, 15, ${chartHeight / 2})`}
            >
              Mood (1-10)
            </text>

            {/* X-axis label */}
            <text
              x={chartWidth / 2}
              y={chartHeight - 5}
              fontSize="12"
              fill="#6b7280"
              textAnchor="middle"
            >
              Screen Time (hours)
            </text>

            {/* Data points */}
            {chartData.map((day, index) => {
              if (day.screenTime === 0 || day.moodScore === 0) return null;
              const x = padding + (day.screenTime / maxScreenTime) * effectiveWidth;
              const y = padding + effectiveHeight - (day.moodScore / maxMood) * effectiveHeight;
              
              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill={day.color}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={y - 12}
                    fontSize="10"
                    fill={day.color}
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {day.day[4]}
                  </text>
                </g>
              );
            })}

            {/* Correlation trend line (if enough data) */}
            {chartData.filter(d => d.screenTime > 0 && d.moodScore > 0).length >= 3 && (() => {
              const validData = chartData.filter(d => d.screenTime > 0 && d.moodScore > 0);
              const sorted = [...validData].sort((a, b) => a.screenTime - b.screenTime);
              
              if (sorted.length < 2) return null;
              
              const first = sorted[0];
              const last = sorted[sorted.length - 1];
              const x1 = padding + (first.screenTime / maxScreenTime) * effectiveWidth;
              const y1 = padding + effectiveHeight - (first.moodScore / maxMood) * effectiveHeight;
              const x2 = padding + (last.screenTime / maxScreenTime) * effectiveWidth;
              const y2 = padding + effectiveHeight - (last.moodScore / maxMood) * effectiveHeight;
              
              return (
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#94a3b8"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                  opacity="0.5"
                />
              );
            })()}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">Screen Time</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: moodOptions[9].color }}></div>
            <span className="text-gray-600">Mood Rating</span>
          </div>
        </div>
      </div>
    );
  };

  const correlation = calculateCorrelation();
  const completedEntries = Object.values(trackingEntries).filter(e => e?.screenTime > 0 && e?.mood > 0).length;

  if (showGameOver) {
    const chartData = getChartData();
    const avgScreenTime = parseFloat(getAverageScreenTime());
    const avgMood = parseFloat(getAverageMood());

    return (
      <ParentGameShell
        title={gameData?.title || "Screen-Time Mirror"}
        subtitle="Tracking Complete!"
        showGameOver={true}
        score={completedEntries}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={completedEntries >= 7}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-5xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-7xl mb-4"
              >
                📱
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Screen-Time Reflection Complete!</h2>
              <p className="text-lg text-gray-600">
                You've tracked your digital habits and their emotional effects.
              </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 text-center">
                <Smartphone className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Average Screen Time</p>
                <p className="text-3xl font-bold text-blue-600">{getAverageScreenTime()} hrs</p>
                <p className="text-xs text-gray-500 mt-2">per day</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Average Mood</p>
                <p className="text-3xl font-bold text-green-600">{getAverageMood()}/10</p>
                <p className="text-xs text-gray-500 mt-2">this week</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border-2 border-purple-200 text-center">
                <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Days Tracked</p>
                <p className="text-3xl font-bold text-purple-600">{completedEntries}/7</p>
                <p className="text-xs text-gray-500 mt-2">complete</p>
              </div>
            </div>

            {/* Correlation Chart */}
            {completedEntries >= 3 && (
              <div className="mb-8">
                {renderCorrelationChart()}
              </div>
            )}

            {/* Correlation Insights */}
            {correlation !== null && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                  Pattern Analysis
                </h3>
                {Math.abs(correlation) < 0.3 ? (
                  <p className="text-gray-700">
                    <strong>No Strong Correlation Found:</strong> Your screen time and mood don't show a strong direct relationship. This might mean other factors are more influential in your mood, or the relationship is more complex than a simple correlation.
                  </p>
                ) : correlation > 0 ? (
                  <p className="text-gray-700">
                    <strong>Positive Correlation:</strong> Your data suggests that higher screen time is associated with better mood. However, consider if there are other factors at play, or if this reflects using screens for positive activities (connection, learning, relaxation).
                  </p>
                ) : (
                  <p className="text-gray-700">
                    <strong>Negative Correlation:</strong> Your data suggests that higher screen time is associated with lower mood. More screen time may be impacting your emotional wellbeing. Consider setting boundaries and mindful usage to improve your mood.
                  </p>
                )}
              </div>
            )}

            {/* Weekly Entries */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Weekly Tracking</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chartData.map((day, index) => {
                  if (!trackingEntries[day.id]) return null;
                  const entry = trackingEntries[day.id];
                  return (
                    <motion.div
                      key={day.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-gray-800">{day.dayName}</h4>
                          <p className="text-xs text-gray-600">{entry.date}</p>
                        </div>
                        <span className="text-2xl">{day.emoji}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">
                          <strong>Screen Time:</strong> {entry.screenTime} hrs
                        </span>
                        <span className="text-gray-700">
                          <strong>Mood:</strong> {day.moodScore}/10
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-green-600" />
                Awareness Leads to Change
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>See the Pattern:</strong> When you track your screen time alongside your mood, patterns emerge. You might notice that more screen time correlates with lower mood, or that certain types of usage affect you differently.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Awareness is Step One:</strong> Simply noticing your digital habits and their emotional effects is powerful. Awareness is step one—reduction comes naturally once you see the pattern.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Mindful Usage:</strong> Not all screen time is equal. Notice which activities lift your mood and which drain it. This awareness helps you make intentional choices about your digital consumption.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Modeling for Children:</strong> When you become aware of your own screen habits, you model mindfulness for your children. They learn by watching how you balance technology with presence and connection.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Awareness is step one — reduction comes naturally once you see the pattern. When you track your screen time and notice how it affects your mood, energy, and presence, you gain valuable insight. This awareness isn't about judgment—it's about understanding. Once you see the pattern (perhaps more screen time leads to lower mood, less patience, or less presence with your children), change becomes easier. You naturally want to reduce what drains you and increase what energizes you. Model this awareness for your children—show them that technology is a tool, not a lifestyle.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  if (showChart) {
    return (
      <ParentGameShell
        title={gameData?.title || "Screen-Time Mirror"}
        subtitle="View Correlation Chart"
        showGameOver={false}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
      >
        <div className="w-full max-w-5xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Screen Time vs Mood Correlation</h2>
              <p className="text-gray-600">
                See how your digital habits relate to your emotional wellbeing.
              </p>
            </div>

            {renderCorrelationChart()}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleComplete}
              className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              View Complete Analysis
            </motion.button>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  const currentDayData = weekDays[currentDay];
  const currentEntry = trackingEntries[currentDay];

  return (
    <ParentGameShell
      title={gameData?.title || "Screen-Time Mirror"}
      subtitle={`${currentDayData.label} - Track Your Digital Habits`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentDay + 1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={currentDay}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{currentDayData.label} of 5 Days</span>
              <span>{Math.round(((currentDay + 1) / totalLevels) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentDay + 1) / totalLevels) * 100}%` }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📱</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{currentDayData.dayName}</h2>
            <p className="text-gray-600 text-lg">
              Track your screen time and mood to see the connection.
            </p>
          </div>

          {/* Screen Time Input */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-blue-600" />
              Daily Screen Time
            </h3>
            <div className="bg-white rounded-lg p-5 border border-blue-200 mb-4">
              <p className="text-sm text-gray-600 mb-4">
                How many hours did you spend on your phone, tablet, or computer today? Check your phone's screen time settings or estimate.
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={currentEntry?.screenTime || ''}
                  onChange={(e) => handleEntryChange(currentDay, 'screenTime', e.target.value)}
                  placeholder="0"
                  className="w-32 px-4 py-3 rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-gray-800 text-2xl font-bold text-center"
                />
                <span className="text-xl font-semibold text-gray-700">hours</span>
              </div>
            </div>
          </div>

          {/* Mood Input */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              How Was Your Mood Today?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Rate your overall mood and emotional wellbeing today (1 = very low, 10 = excellent).
            </p>
            <div className="grid grid-cols-5 gap-3">
              {moodOptions.map((mood) => {
                const isSelected = currentEntry?.mood === mood.value;
                return (
                  <motion.button
                    key={mood.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEntryChange(currentDay, 'mood', mood.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? `border-2 border-4 shadow-lg`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{
                      background: isSelected ? `linear-gradient(to bottom right, ${mood.color}, ${mood.color}dd)` : 'white',
                      borderColor: isSelected ? mood.color : undefined
                    }}
                  >
                    <div className="text-3xl mb-2">{mood.emoji}</div>
                    <div className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                      {mood.value}
                    </div>
                    <div className={`text-xs ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                      {mood.label.split(' ')[0]}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Selected Values Display */}
          {currentEntry && (currentEntry.screenTime > 0 || currentEntry.mood > 0) && (
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border-2 border-purple-200 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Today's Entry:</p>
                  <div className="flex items-center gap-4 text-sm">
                    {currentEntry.screenTime > 0 && (
                      <span className="text-gray-700">
                        📱 <strong>{currentEntry.screenTime} hrs</strong> screen time
                      </span>
                    )}
                    {currentEntry.mood > 0 && (
                      <span className="text-gray-700">
                        {moodOptions.find(m => m.value === currentEntry.mood)?.emoji} <strong>Mood: {currentEntry.mood}/10</strong>
                      </span>
                    )}
                  </div>
                </div>
                {isDayComplete(currentDay) && (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
              </div>
            </div>
          )}

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={!isDayComplete(currentDay)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {currentDay < totalLevels - 1 ? (
              <>
                Continue to {weekDays[currentDay + 1]?.dayName || 'Next Day'}
                <CheckCircle className="w-5 h-5" />
              </>
            ) : (
              <>
                View Correlation Chart
                <BarChart3 className="w-5 h-5" />
              </>
            )}
          </motion.button>

          {!isDayComplete(currentDay) && (
            <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
              <p className="text-yellow-800 text-sm text-center">
                Please enter both screen time and mood rating to continue.
              </p>
            </div>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Awareness is step one — reduction comes naturally once you see the pattern. Tracking your screen time and mood helps you recognize how digital habits affect your emotional wellbeing.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default ScreenTimeMirror;

