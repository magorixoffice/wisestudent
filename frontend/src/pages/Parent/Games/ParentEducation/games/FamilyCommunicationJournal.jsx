import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { MessageSquare, Heart, CheckCircle, Download, Sparkles, TrendingUp } from "lucide-react";

const FamilyCommunicationJournal = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-67";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentDay, setCurrentDay] = useState(0);
  const [journalEntries, setJournalEntries] = useState({});
  const [showMoodChart, setShowMoodChart] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // 5 days of journaling
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
    setJournalEntries(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        [field]: value
      }
    }));
  };

  const isDayComplete = (dayId) => {
    const entry = journalEntries[dayId];
    return entry?.reflection && entry?.reflection.trim().length >= 10 && entry?.mood;
  };

  const handleNext = () => {
    if (isDayComplete(currentDay)) {
      setScore(prev => prev + 1);
      
      if (currentDay < totalLevels - 1) {
        setCurrentDay(prev => prev + 1);
      } else {
        // All 7 days complete - show mood chart
        setShowMoodChart(true);
      }
    }
  };

  const handleComplete = () => {
    setShowGameOver(true);
  };

  const getMoodChartData = () => {
    return weekDays.map(day => {
      const entry = journalEntries[day.id];
      const moodScore = entry?.mood || 0;
      const mood = moodOptions.find(m => m.value === moodScore);
      return {
        day: day.label,
        dayName: day.dayName,
        moodScore,
        emoji: mood?.emoji || "",
        color: mood?.color || "#94a3b8",
        label: mood?.label || "Not Rated"
      };
    });
  };

  const getAverageMood = () => {
    const chartData = getMoodChartData();
    const scores = chartData.map(d => d.moodScore).filter(s => s > 0);
    if (scores.length === 0) return 0;
    return (scores.reduce((sum, s) => sum + s, 0) / scores.length).toFixed(1);
  };

  const renderMoodChart = () => {
    const chartData = getMoodChartData();
    const maxMood = 10;
    const chartHeight = 300;
    const chartWidth = 100;
    const padding = 20;
    const effectiveWidth = chartWidth - (padding * 2);
    const effectiveHeight = chartHeight - (padding * 2);

    const points = chartData.map((day, index) => {
      const x = padding + (index / (chartData.length - 1 || 1)) * effectiveWidth;
      const y = padding + effectiveHeight - (day.moodScore / maxMood) * effectiveHeight;
      return { x, y, ...day };
    });

    return (
      <div className="bg-white rounded-xl p-6 border-2 border-blue-200 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Weekly Mood Chart
          </h3>
          <div className="text-right">
            <p className="text-sm text-gray-600">Average Mood</p>
            <p className="text-2xl font-bold text-blue-600">{getAverageMood()}/10</p>
          </div>
        </div>

        <div className="relative" style={{ height: `${chartHeight}px`, width: '100%' }}>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
            {/* Grid lines */}
            {[2, 4, 6, 8, 10].map((value) => {
              const y = padding + effectiveHeight - (value / maxMood) * effectiveHeight;
              return (
                <line
                  key={value}
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
              );
            })}

            {/* Mood line */}
            {points.length > 1 && (
              <polyline
                points={points.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data points */}
            {points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill={point.color}
                  stroke="white"
                  strokeWidth="1.5"
                />
                <text
                  x={point.x}
                  y={point.y - 8}
                  textAnchor="middle"
                  fontSize="12"
                  fill={point.color}
                  fontWeight="bold"
                >
                  {point.emoji}
                </text>
              </g>
            ))}

            {/* Y-axis labels */}
            {[2, 4, 6, 8, 10].map((value) => {
              const y = padding + effectiveHeight - (value / maxMood) * effectiveHeight;
              return (
                <text
                  key={value}
                  x={padding - 5}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="8"
                  fill="#6b7280"
                >
                  {value}
                </text>
              );
            })}
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between mt-2 px-1">
            {chartData.map((day, index) => (
              <div key={index} className="flex flex-col items-center" style={{ width: `${100 / chartData.length}%` }}>
                <span className="text-xs font-medium text-gray-700">{day.day}</span>
                <span className="text-xs text-gray-500">{day.dayName.substring(0, 3)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (showGameOver && showMoodChart) {
    return (
      <ParentGameShell
        title={gameData?.title || "Family Communication Journal"}
        subtitle="Week Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={score >= 6}
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
                💬
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Weekly Communication Journal is Complete!</h2>
              <p className="text-lg text-gray-600 mb-6">
                You've reflected on how family conversations affect your emotions over 5 days. Awareness of tone and timing turns talk into bonding.
              </p>
            </div>

            {/* Mood Chart */}
            {renderMoodChart()}

            {/* All Reflections Summary */}
            <div className="mt-8 space-y-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                Your Weekly Reflections
              </h3>
              {weekDays.map((day, index) => {
                const entry = journalEntries[day.id];
                if (!entry || !entry.reflection) return null;
                
                const mood = moodOptions.find(m => m.value === entry.mood);
                
                return (
                  <motion.div
                    key={day.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {day.id + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-gray-800">{day.dayName}</h4>
                          {mood && (
                            <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1">
                              <span className="text-lg">{mood.emoji}</span>
                              <span className="text-sm text-gray-600">{mood.label}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700 leading-relaxed italic">
                          "Today's talk that made me feel heard was: {entry.reflection}"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mt-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-800">Weekly Insights</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>You've tracked how family conversations affect your emotions over 5 days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Your average mood was {getAverageMood()}/10—notice patterns in what conversations made you feel heard.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Continue practicing awareness of tone and timing to turn everyday talk into meaningful bonding moments.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200 mt-6">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Awareness of tone and timing turns talk into bonding. When you notice which conversations make you feel heard, you can create more of those moments. Pay attention to when your family is most receptive, when your tone is gentle, and when timing allows for true connection. Children learn emotional communication by watching how you interact—your awareness of tone and timing teaches them that conversations can be healing, connecting, and nurturing.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  if (showMoodChart) {
    return (
      <ParentGameShell
        title={gameData?.title || "Family Communication Journal"}
        subtitle="Your Weekly Mood Chart"
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
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Weekly Reflection Summary</h2>
              <p className="text-gray-600">
                Review your mood chart and reflections from the past 5 days.
              </p>
            </div>

            {/* Mood Chart */}
            {renderMoodChart()}

            {/* Download Button */}
            <div className="flex gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const chartData = getMoodChartData();
                  const reflectionsText = `FAMILY COMMUNICATION JOURNAL\nWeekly Summary\n\n${chartData.map((day, index) => {
                    const entry = journalEntries[index];
                    return `${day.day} (${day.dayName}):\nMood: ${day.moodScore}/10 ${day.emoji} (${day.label})\nReflection: ${entry?.reflection || 'Not recorded'}\n`;
                  }).join('\n')}\nAverage Mood: ${getAverageMood()}/10\n\nCreated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
                  const blob = new Blob([reflectionsText], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'family-communication-journal.txt';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Journal
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleComplete}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Complete Journal
              </motion.button>
            </div>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  const progress = ((currentDay + 1) / totalLevels) * 100;
  const currentDayData = weekDays[currentDay];
  const currentEntry = journalEntries[currentDay] || {};
  const canProceed = isDayComplete(currentDay);

  return (
    <ParentGameShell
      title={gameData?.title || "Family Communication Journal"}
      subtitle={`${currentDayData.label}: ${currentDayData.dayName}`}
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
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{currentDayData.label} of 5</span>
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

          {/* Day Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{currentDayData.label}: {currentDayData.dayName}</h2>
            <p className="text-gray-600 text-lg">
              Reflect on a conversation that made you feel heard today.
            </p>
          </div>

          {/* Reflection Prompt */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
            <label className="block text-lg font-bold text-gray-800 mb-4">
              Today's talk that made me feel heard was...
            </label>
            <textarea
              value={currentEntry.reflection || ""}
              onChange={(e) => handleEntryChange(currentDay, 'reflection', e.target.value)}
              placeholder="Describe a conversation or moment when you felt heard, understood, or connected with your family. What was said? How did it make you feel? (e.g., 'When my partner asked about my day and really listened without interrupting, it made me feel valued and understood.')"
              className="w-full h-40 p-4 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none text-gray-700 text-base leading-relaxed"
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-sm text-gray-600">
                {(currentEntry.reflection || "").length} characters
                {currentEntry.reflection && currentEntry.reflection.trim().length >= 10 && (
                  <span className="text-green-600 font-semibold ml-2">✓</span>
                )}
              </p>
              {currentEntry.reflection && currentEntry.reflection.trim().length < 10 && (
                <p className="text-xs text-red-600">Please write at least 10 characters</p>
              )}
            </div>
          </div>

          {/* Mood Rating */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
            <label className="block text-lg font-bold text-gray-800 mb-4">
              How did this conversation make you feel overall? (Rate your mood 1-10)
            </label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => handleEntryChange(currentDay, 'mood', mood.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    currentEntry.mood === mood.value
                      ? 'bg-white shadow-lg scale-110'
                      : 'border-gray-300 bg-white hover:border-gray-400 hover:scale-105'
                  }`}
                  style={currentEntry.mood === mood.value ? { borderColor: mood.color } : {}}
                >
                  <div className="text-3xl mb-1">{mood.emoji}</div>
                  <div className="text-xs font-semibold text-gray-700">{mood.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{mood.label.split(' ')[0]}</div>
                </button>
              ))}
            </div>
            {currentEntry.mood && (
              <div className="mt-4 bg-white rounded-lg p-3 border border-purple-200">
                <p className="text-sm text-gray-700">
                  Selected: <span className="font-semibold">{moodOptions.find(m => m.value === currentEntry.mood)?.label}</span>{" "}
                  {moodOptions.find(m => m.value === currentEntry.mood)?.emoji}
                </p>
              </div>
            )}
          </div>

          {/* Guidance */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 mb-6">
            <p className="text-sm text-gray-700">
              <strong>💭 Guidance:</strong> Think about conversations with your partner, children, or family members. What made you feel heard? Was it the tone, the timing, the attention? Reflect on how family conversations affect your emotions—this awareness helps you create more bonding moments.
            </p>
          </div>

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mb-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Awareness of tone and timing turns talk into bonding. When you notice which conversations make you feel heard, you can create more of those moments for yourself and your family.
            </p>
          </div>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={!canProceed}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            {currentDay < totalLevels - 1 ? `Continue to ${weekDays[currentDay + 1].label}` : "View Weekly Chart"}
            <CheckCircle className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default FamilyCommunicationJournal;

