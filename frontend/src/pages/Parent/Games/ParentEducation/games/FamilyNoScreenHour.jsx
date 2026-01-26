import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Smartphone, Clock, Heart, CheckCircle, Play, Pause, TrendingUp, Sparkles } from "lucide-react";

const FamilyNoScreenHour = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-92";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [step, setStep] = useState(1); // 1: Setup, 2: Timer, 3: After, 4: Complete
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [customActivity, setCustomActivity] = useState("");
  const [moodBefore, setMoodBefore] = useState(null);
  const [moodAfter, setMoodAfter] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes = 300 seconds
  const [showGameOver, setShowGameOver] = useState(false);
  
  const timerRef = useRef(null);

  // Activity Ideas
  const activityIdeas = [
    {
      id: 'cook',
      label: 'Cook Together',
      emoji: '👨‍🍳',
      color: 'from-orange-400 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-300',
      description: 'Prepare a meal or snack together'
    },
    {
      id: 'talk',
      label: 'Talk & Share',
      emoji: '💬',
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-300',
      description: 'Have a conversation about your day'
    },
    {
      id: 'draw',
      label: 'Draw & Create',
      emoji: '🎨',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-300',
      description: 'Draw, color, or create art together'
    },
    {
      id: 'play',
      label: 'Play Games',
      emoji: '🎲',
      color: 'from-purple-400 to-violet-500',
      bgColor: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-300',
      description: 'Play board games or outdoor games'
    },
    {
      id: 'read',
      label: 'Read Together',
      emoji: '📚',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      description: 'Read books or stories together'
    },
    {
      id: 'walk',
      label: 'Take a Walk',
      emoji: '🚶',
      color: 'from-cyan-400 to-teal-500',
      bgColor: 'from-cyan-50 to-teal-50',
      borderColor: 'border-cyan-300',
      description: 'Go for a walk or explore outside'
    },
    {
      id: 'music',
      label: 'Make Music',
      emoji: '🎵',
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-300',
      description: 'Sing, dance, or play instruments'
    },
    {
      id: 'build',
      label: 'Build Something',
      emoji: '🧱',
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-300',
      description: 'Build with blocks, LEGO, or craft materials'
    }
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

  // Timer countdown
  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeRemaining]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    if (moodBefore) {
      setIsRunning(true);
      setStep(2);
    }
  };

  const handlePauseTimer = () => {
    setIsRunning(false);
  };

  const handleResumeTimer = () => {
    setIsRunning(true);
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setStep(3);
  };

  const handleComplete = () => {
    if (moodAfter) {
      setShowGameOver(true);
    }
  };

  const moodBeforeData = moodOptions.find(m => m.value === moodBefore);
  const moodAfterData = moodOptions.find(m => m.value === moodAfter);
  const moodChange = moodAfter && moodBefore ? moodAfter - moodBefore : 0;
  const activityLabel = selectedActivity 
    ? activityIdeas.find(a => a.id === selectedActivity)?.label || customActivity
    : customActivity || 'No activity selected';

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Family No-Screen Time"}
        subtitle="Time Complete!"
        showGameOver={true}
        score={5}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={true}
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
                🎉
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">5-Minute No-Screen Time Complete!</h2>
              <p className="text-lg text-gray-600">
                Great job completing your 5-minute no-screen time!
              </p>
            </div>

            {/* Activity Display */}
            {activityLabel && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 mb-6 text-center">
                <p className="text-3xl mb-2">
                  {selectedActivity ? activityIdeas.find(a => a.id === selectedActivity)?.emoji : '✨'}
                </p>
                <p className="text-xl font-bold text-gray-800">Activity: {activityLabel}</p>
              </div>
            )}

            {/* Mood Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Mood Before</h3>
                {moodBeforeData && (
                  <div className="text-center">
                    <div className="text-5xl mb-3">{moodBeforeData.emoji}</div>
                    <p className="text-2xl font-bold text-gray-800">{moodBeforeData.label}</p>
                    <p className="text-lg text-gray-600 mt-2">{moodBefore}/10</p>
                  </div>
                )}
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Mood After</h3>
                {moodAfterData && (
                  <div className="text-center">
                    <div className="text-5xl mb-3">{moodAfterData.emoji}</div>
                    <p className="text-2xl font-bold text-gray-800">{moodAfterData.label}</p>
                    <p className="text-lg text-gray-600 mt-2">{moodAfter}/10</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mood Change */}
            {moodChange !== 0 && (
              <div className={`bg-gradient-to-br ${moodChange > 0 ? 'from-green-50 to-emerald-50 border-green-200' : 'from-blue-50 to-indigo-50 border-blue-200'} rounded-xl p-6 border-2 mb-6 text-center`}>
                <p className="text-lg font-semibold text-gray-700 mb-2">Mood Change</p>
                <p className={`text-4xl font-bold ${moodChange > 0 ? 'text-green-600' : moodChange < 0 ? 'text-blue-600' : 'text-gray-600'}`}>
                  {moodChange > 0 ? '+' : ''}{moodChange} points
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {moodChange > 0 
                    ? 'Your mood improved during the no-screen time!' 
                    : moodChange < 0
                    ? 'Your mood changed during the time.'
                    : 'Your mood stayed the same.'}
                </p>
              </div>
            )}

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-green-600" />
                Benefits of No-Screen Time
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Deep Connection:</strong> Without screens, families engage in deeper, more meaningful conversations and activities that build lasting bonds.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Present Moment:</strong> No-screen time helps everyone be fully present with each other, noticing and appreciating the moment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Creativity & Play:</strong> Without digital distractions, families rediscover creativity, imagination, and the joy of simple play.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Rest for Eyes & Mind:</strong> Regular no-screen time gives your eyes and mind a break, reducing digital fatigue and improving wellbeing.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Let your child choose the no-screen activity — ownership makes joy grow. When children have a say in what the family does during no-screen time, they feel ownership and excitement. This choice empowers them and makes the time something they look forward to, not something they're forced into. Regular no-screen time creates space for connection, creativity, and presence that screens can't replace.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  // Step 3: After Timer - Rate Mood
  if (step === 3) {
    return (
      <ParentGameShell
        title={gameData?.title || "Family No-Screen Time"}
        subtitle="How Do You Feel Now?"
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={1}
      >
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Time Complete!</h2>
              <p className="text-gray-600 text-lg">
                How is your mood now after spending time without screens?
              </p>
            </div>

            {/* Activity Reminder */}
            {activityLabel && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border-2 border-purple-200 mb-6 text-center">
                <p className="text-sm text-gray-600 mb-1">You spent the time:</p>
                <p className="text-lg font-bold text-gray-800">
                  {selectedActivity ? activityIdeas.find(a => a.id === selectedActivity)?.emoji + ' ' : ''}
                  {activityLabel}
                </p>
              </div>
            )}

            {/* Mood Before Reminder */}
            {moodBeforeData && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-6">
                <p className="text-sm text-gray-600 mb-1">Your mood before:</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{moodBeforeData.emoji}</span>
                  <span className="font-semibold text-gray-800">{moodBeforeData.label} ({moodBefore}/10)</span>
                </div>
              </div>
            )}

            {/* Mood After Rating */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">How is your mood now?</h3>
              <div className="grid grid-cols-5 gap-3">
                {moodOptions.map((mood) => {
                  const isSelected = moodAfter === mood.value;
                  return (
                    <motion.button
                      key={mood.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMoodAfter(mood.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'shadow-lg'
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

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleComplete}
              disabled={!moodAfter}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              View Results
            </motion.button>

            {!moodAfter && (
              <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
                <p className="text-yellow-800 text-sm text-center">
                  Please rate your mood after the no-screen time.
                </p>
              </div>
            )}

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
              <p className="text-sm text-gray-700">
                <strong>💡 Parent Tip:</strong> Let your child choose the no-screen activity — ownership makes joy grow.
              </p>
            </div>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  // Step 2: Timer Running
  if (step === 2) {
    const progress = ((300 - timeRemaining) / 300) * 100;
    
    return (
      <ParentGameShell
        title={gameData?.title || "Family No-Screen Time"}
        subtitle="No-Screen Time in Progress"
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={1}
      >
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="text-6xl mb-4"
              >
                ⏰
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">No-Screen Time Active</h2>
              <p className="text-gray-600">
                Enjoy your 5 minutes without screens! {activityLabel && `You're doing: ${activityLabel}`}
              </p>
            </div>

            {/* Timer Display */}
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-xl p-12 border-4 border-purple-300 mb-6">
              <div className="text-center">
                <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <motion.div
                  key={timeRemaining}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="text-6xl font-bold text-purple-700 mb-4 font-mono"
                >
                  {formatTime(timeRemaining)}
                </motion.div>
                <p className="text-lg text-gray-600 mb-6">remaining of 5 minutes</p>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-4 rounded-full"
                  />
                </div>
                <p className="text-sm text-gray-600">{Math.round(progress)}% complete</p>
              </div>
            </div>

            {/* Activity Display */}
            {activityLabel && (
              <div className="bg-white rounded-xl p-6 border-2 border-purple-200 mb-6 text-center">
                <p className="text-4xl mb-2">
                  {selectedActivity ? activityIdeas.find(a => a.id === selectedActivity)?.emoji : '✨'}
                </p>
                <p className="text-xl font-bold text-gray-800">{activityLabel}</p>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex gap-4">
              {isRunning ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePauseTimer}
                  className="flex-1 bg-yellow-500 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Pause className="w-5 h-5" />
                  Pause Timer
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleResumeTimer}
                  className="flex-1 bg-green-500 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Resume Timer
                </motion.button>
              )}
            </div>

            {/* Encouragement */}
            <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 text-center">
              <p className="text-gray-700 font-medium">
                💚 Keep going! You're building connection and presence without screens for 5 minutes.
              </p>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
              <p className="text-sm text-gray-700">
                <strong>💡 Parent Tip:</strong> Let your child choose the no-screen activity — ownership makes joy grow.
              </p>
            </div>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  // Step 1: Setup
  return (
    <ParentGameShell
      title={gameData?.title || "Family No-Screen Time"}
      subtitle="Set Up Your 5-Min No-Screen Time"
      showGameOver={false}
      score={0}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📱</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Family No-Screen Time</h2>
            <p className="text-gray-600 text-lg">
              Spend 5 minutes of device-free family time together.
            </p>
          </div>

          {/* Activity Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Choose an Activity (Optional - Let your child choose!)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {activityIdeas.map((activity) => {
                const isSelected = selectedActivity === activity.id;
                return (
                  <motion.button
                    key={activity.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedActivity(activity.id);
                      setCustomActivity("");
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      isSelected
                        ? `${activity.bgColor} ${activity.borderColor} border-4 shadow-lg`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{activity.emoji}</div>
                    <p className="text-sm font-bold text-gray-800">{activity.label}</p>
                    <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                  </motion.button>
                );
              })}
            </div>
            
            {/* Custom Activity */}
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">Or enter a custom activity:</p>
              <input
                type="text"
                value={customActivity}
                onChange={(e) => {
                  setCustomActivity(e.target.value);
                  setSelectedActivity(null);
                }}
                placeholder="Let your child suggest an activity for 5 minutes..."
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:outline-none text-gray-800"
              />
            </div>
          </div>

          {/* Mood Before */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Rate Your Mood Before</h3>
            <p className="text-sm text-gray-600 mb-4">
              How are you feeling right now, before starting the no-screen time? (1 = very low, 10 = excellent)
            </p>
            <div className="grid grid-cols-5 gap-3">
              {moodOptions.map((mood) => {
                const isSelected = moodBefore === mood.value;
                return (
                  <motion.button
                    key={mood.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMoodBefore(mood.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'shadow-lg'
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

          {/* Start Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartTimer}
            disabled={!moodBefore}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            Start 5-Min No-Screen Time
          </motion.button>

          {!moodBefore && (
            <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
              <p className="text-yellow-800 text-sm text-center">
                Please rate your mood before starting the no-screen time.
              </p>
            </div>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Let your child choose the no-screen activity — ownership makes joy grow. When children help decide what to do during no-screen time, they feel excited and engaged, making the time more meaningful for everyone.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default FamilyNoScreenHour;

