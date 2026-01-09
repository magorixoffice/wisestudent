import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Calendar, Lightbulb } from "lucide-react";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";

const EmotionJournal = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-7";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentEntry, setCurrentEntry] = useState(0);
  const [journalEntries, setJournalEntries] = useState([]);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [reflection, setReflection] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Available emotion emojis with values for charting
  const emotionEmojis = [
    { emoji: '😊', label: 'Happy', value: 5, color: 'from-yellow-400 to-orange-400', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-400' },
    { emoji: '😌', label: 'Calm', value: 4, color: 'from-blue-400 to-cyan-400', bgColor: 'bg-blue-50', borderColor: 'border-blue-400' },
    { emoji: '😐', label: 'Neutral', value: 3, color: 'from-gray-400 to-gray-500', bgColor: 'bg-gray-50', borderColor: 'border-gray-400' },
    { emoji: '😟', label: 'Worried', value: 2, color: 'from-orange-400 to-red-400', bgColor: 'bg-orange-50', borderColor: 'border-orange-400' },
    { emoji: '😢', label: 'Sad', value: 1, color: 'from-blue-500 to-indigo-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-500' },
    { emoji: '😡', label: 'Frustrated', value: 1, color: 'from-red-500 to-rose-600', bgColor: 'bg-red-50', borderColor: 'border-red-500' },
    { emoji: '😴', label: 'Tired', value: 2, color: 'from-purple-400 to-indigo-400', bgColor: 'bg-purple-50', borderColor: 'border-purple-400' },
    { emoji: '🤗', label: 'Grateful', value: 5, color: 'from-green-400 to-emerald-400', bgColor: 'bg-green-50', borderColor: 'border-green-400' },
    { emoji: '😰', label: 'Anxious', value: 1, color: 'from-amber-400 to-orange-500', bgColor: 'bg-amber-50', borderColor: 'border-amber-400' },
    { emoji: '😎', label: 'Confident', value: 4, color: 'from-cyan-400 to-blue-400', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-400' },
    { emoji: '🙂', label: 'Content', value: 4, color: 'from-green-300 to-teal-400', bgColor: 'bg-green-50', borderColor: 'border-green-300' },
    { emoji: '😔', label: 'Disappointed', value: 2, color: 'from-blue-400 to-indigo-400', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-400' }
  ];

  // Daily reflection prompts for teachers
  const dailyPrompts = [
    {
      id: 1,
      day: "Day 1",
      prompt: "Today I felt ___ because…",
      context: "Reflect on your overall emotional state today. What happened that influenced how you felt?",
      teacherTip: "Start by noticing the dominant emotion. Was it related to your students, workload, or personal life?"
    },
    {
      id: 2,
      day: "Day 2",
      prompt: "Today I felt ___ because…",
      context: "Think about a specific moment that stood out—positive or challenging. How did it make you feel?",
      teacherTip: "Specific moments often reveal deeper patterns. Notice what triggers different emotions."
    },
    {
      id: 3,
      day: "Day 3",
      prompt: "Today I felt ___ because…",
      context: "Consider your interactions with students, colleagues, or administrators. What emotions did these interactions bring up?",
      teacherTip: "Relationships at work significantly impact our emotional state. Which interactions energize you, and which drain you?"
    },
    {
      id: 4,
      day: "Day 4",
      prompt: "Today I felt ___ because…",
      context: "Reflect on your workload and responsibilities. How did the demands of the day affect your emotions?",
      teacherTip: "Workload stress is common. Notice if certain tasks consistently trigger specific emotions."
    },
    {
      id: 5,
      day: "Day 5",
      prompt: "Today I felt ___ because…",
      context: "Look back at the week. What patterns do you notice? How did your emotions change throughout the week?",
      teacherTip: "Weekly patterns help you understand your emotional rhythms. Use this awareness to plan self-care."
    }
  ];

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
  };

  const handleReflectionChange = (e) => {
    setReflection(e.target.value);
  };

  const handleSaveEntry = () => {
    if (!selectedEmoji || !reflection.trim()) {
      alert("Please select an emotion emoji and write a reflection before continuing.");
      return;
    }

    if (reflection.trim().length < 10) {
      alert("Please write at least 10 characters for your reflection.");
      return;
    }

    const newEntry = {
      id: currentEntry + 1,
      day: dailyPrompts[currentEntry].day,
      emoji: selectedEmoji,
      reflection: reflection.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };

    setJournalEntries([...journalEntries, newEntry]);
    setScore(prev => prev + 1);
    
    // Reset for next entry
    setSelectedEmoji(null);
    setReflection("");

    // Move to next entry or show chart
    if (currentEntry < dailyPrompts.length - 1) {
      setCurrentEntry(prev => prev + 1);
    } else {
      setShowChart(true);
    }
  };

  const handleViewChart = () => {
    setShowChart(true);
  };

  const handleComplete = () => {
    setShowGameOver(true);
  };

  const renderMoodChart = () => {
    if (journalEntries.length === 0) return null;

    const maxValue = 5;
    const chartHeight = 200;

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            Your Emotion Trend
          </h3>
          <div className="text-right">
            <p className="text-sm text-gray-600">Average Emotion</p>
            <p className="text-2xl font-bold text-purple-600">
              {(journalEntries.reduce((sum, entry) => sum + entry.emoji.value, 0) / journalEntries.length).toFixed(1)}/5
            </p>
          </div>
        </div>

        <div className="relative" style={{ height: `${chartHeight + 60}px` }}>
          {/* Chart bars */}
          <div className="flex items-end justify-between h-full gap-2">
            {journalEntries.map((entry, index) => {
              const heightPercentage = (entry.emoji.value / maxValue) * 100;
              const barHeight = (heightPercentage / 100) * chartHeight;

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center justify-end" style={{ height: `${chartHeight}px` }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${barHeight}px` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`w-full bg-gradient-to-t ${entry.emoji.color} rounded-t-lg shadow-md transition-all hover:scale-105 cursor-pointer relative group border-2 ${entry.emoji.borderColor}`}
                      style={{ minHeight: '20px' }}
                      title={`${entry.day}: ${entry.emoji.label}`}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-2xl">{entry.emoji.emoji}</span>
                      </div>
                    </motion.div>
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-xs font-semibold text-gray-600">{entry.day}</p>
                    <p className="text-lg">{entry.emoji.emoji}</p>
                    <p className="text-xs text-gray-500">{entry.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights */}
        <div className="mt-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Emotion Insights</h4>
          <div className="space-y-2 text-gray-700">
            {(() => {
              const avgValue = journalEntries.reduce((sum, entry) => sum + entry.emoji.value, 0) / journalEntries.length;
              const trend = journalEntries.length >= 2 
                ? journalEntries[journalEntries.length - 1].emoji.value - journalEntries[0].emoji.value
                : 0;
              
              let insight = "";
              if (avgValue >= 4) {
                insight = "Your overall emotional state has been positive this week. You're experiencing more positive emotions, which is great for your wellbeing and teaching effectiveness.";
              } else if (avgValue >= 3) {
                insight = "Your emotional state has been relatively balanced. You're managing the ups and downs of teaching with resilience.";
              } else {
                insight = "You've been experiencing more challenging emotions this week. Consider what support or self-care practices might help you feel more balanced.";
              }

              let trendInsight = "";
              if (trend > 0.5) {
                trendInsight = "Your emotions have improved over the week—you're ending on a more positive note!";
              } else if (trend < -0.5) {
                trendInsight = "Your emotions have been more challenging as the week progressed. This is normal—teaching can be demanding. Consider what might help you maintain balance.";
              } else {
                trendInsight = "Your emotional state has remained relatively stable throughout the week.";
              }

              return (
                <>
                  <p><strong>Overall Pattern:</strong> {insight}</p>
                  <p><strong>Weekly Trend:</strong> {trendInsight}</p>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    );
  };

  const currentPrompt = dailyPrompts[currentEntry];

  return (
    <TeacherGameShell
      title={gameData?.title || "Emotion Journal"}
      subtitle={gameData?.description || "Reflect on daily emotion patterns to build self-awareness"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={showChart ? totalLevels : currentEntry}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {!showChart ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Entry {currentEntry + 1} of {dailyPrompts.length}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  Progress: {score}/{dailyPrompts.length}
                </span>
              </div>
            </div>

            {/* Prompt */}
            <div className="mb-6">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {currentPrompt.prompt}
                </h3>
                <p className="text-gray-700 mb-2">
                  {currentPrompt.context}
                </p>
                <div className="bg-white rounded-lg p-3 border-l-4 border-purple-500 mt-3">
                  <p className="text-sm text-gray-600 italic">
                    💡 {currentPrompt.teacherTip}
                  </p>
                </div>
              </div>
            </div>

            {/* Emoji Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Select your emotion:
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {emotionEmojis.map((emoji, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEmojiSelect(emoji)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedEmoji?.emoji === emoji.emoji
                        ? `${emoji.bgColor} ${emoji.borderColor} shadow-lg scale-105`
                        : 'bg-white border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-3xl mb-1">{emoji.emoji}</div>
                    <div className="text-xs font-medium text-gray-700">{emoji.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Reflection Input */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Write your reflection:
              </h3>
              <textarea
                value={reflection}
                onChange={handleReflectionChange}
                placeholder="Today I felt [emotion] because..."
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:outline-none text-gray-800 min-h-[120px] resize-none"
              />
              <div className="mt-2 flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {reflection.length} characters (minimum 10)
                </p>
                {reflection.trim().length < 10 && (
                  <p className="text-xs text-orange-600">
                    Please write at least 10 characters
                  </p>
                )}
              </div>
            </div>

            {/* Save Entry Button */}
            {selectedEmoji && reflection.trim().length >= 10 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveEntry}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {currentEntry < dailyPrompts.length - 1 ? 'Save Entry & Continue →' : 'Save Entry & View Chart'}
                </motion.button>
              </motion.div>
            )}

            {/* Teacher Tip */}
            <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-900 mb-2">
                💡 Teacher Tip:
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                Set weekly staff "emotion share circle". Create a safe space during staff meetings where teachers can briefly share one emotion from their week. This builds connection, normalizes emotional experiences, and helps staff support each other. Keep it brief (30 seconds per person) and optional—some may prefer to listen rather than share, and that's okay.
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Chart View */}
            {renderMoodChart()}

            {/* Journal Entries Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-600" />
                Your Journal Entries
              </h3>
              <div className="space-y-4">
                {journalEntries.map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${entry.emoji.bgColor} rounded-xl p-4 border-2 ${entry.emoji.borderColor}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{entry.emoji.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-800">{entry.day}</span>
                          <span className="text-sm text-gray-600">{entry.date}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{entry.reflection}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Complete Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Complete Emotion Journal
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default EmotionJournal;

