import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Moon, CheckCircle, Sparkles, Droplet, Lightbulb, Heart, Wind } from "lucide-react";

const EveningLogOffRitual = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-94";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [completedItems, setCompletedItems] = useState([]);
  const [showCalmScore, setShowCalmScore] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);

  // Night routine checklist items
  const ritualItems = [
    {
      id: 'stretch',
      label: 'Stretch',
      description: 'Take a few minutes to stretch your body gently',
      emoji: '🧘',
      icon: Wind,
      color: 'from-purple-400 to-violet-500',
      bgColor: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-300',
      points: 20
    },
    {
      id: 'gratitude',
      label: 'Gratitude',
      description: 'Think of 3 things you\'re grateful for today',
      emoji: '🙏',
      icon: Heart,
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-300',
      points: 20
    },
    {
      id: 'water',
      label: 'Drink Water',
      description: 'Hydrate your body with a glass of water',
      emoji: '💧',
      icon: Droplet,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300',
      points: 15
    },
    {
      id: 'lights-off',
      label: 'Dim the Lights',
      description: 'Turn off bright lights, use soft lighting or darkness',
      emoji: '💡',
      icon: Lightbulb,
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-300',
      points: 15
    },
    {
      id: 'silence',
      label: 'Create Silence',
      description: 'Turn off devices, notifications, and create quiet space',
      emoji: '🤫',
      icon: Moon,
      color: 'from-indigo-400 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-300',
      points: 30
    },
    {
      id: 'journal',
      label: 'Write in Journal',
      description: 'Spend a few minutes writing thoughts or reflections',
      emoji: '📝',
      icon: Lightbulb,
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-300',
      points: 25
    },
    {
      id: 'breathing',
      label: 'Deep Breathing',
      description: 'Practice 5-10 deep breaths to center yourself',
      emoji: '😮‍💨',
      icon: Wind,
      color: 'from-teal-400 to-cyan-500',
      bgColor: 'from-teal-50 to-cyan-50',
      borderColor: 'border-teal-300',
      points: 20
    },
    {
      id: 'affirmation',
      label: 'Positive Affirmation',
      description: 'Say one positive thing about yourself or your day',
      emoji: '✨',
      icon: Sparkles,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      points: 15
    }
  ];

  // State to track which 5 rituals the user has selected to complete
  const [selectedToComplete, setSelectedToComplete] = useState([]);

  const handleToggleSelection = (itemId) => {
    // Toggle ritual selection
    setSelectedToComplete(prev => {
      if (prev.includes(itemId)) {
        // If unselecting, also remove from completed items
        setCompletedItems(current => current.filter(id => id !== itemId));
        return prev.filter(id => id !== itemId);
      } else {
        // Only allow up to 5 selections
        if (prev.length < 5) {
          return [...prev, itemId];
        }
        return prev;
      }
    });
  };

  const handleToggleCompletion = (itemId) => {
    // Only allow toggling if the item is selected to be completed
    if (selectedToComplete.includes(itemId)) {
      setCompletedItems(prev => {
        if (prev.includes(itemId)) {
          return prev.filter(id => id !== itemId);
        } else {
          return [...prev, itemId];
        }
      });
    }
  };

  const calculateCalmScore = () => {
    const totalPoints = completedItems.reduce((sum, itemId) => {
      const item = ritualItems.find(i => i.id === itemId);
      return sum + (item?.points || 0);
    }, 0);
    
    const maxPoints = selectedToComplete.reduce((sum, itemId) => {
      const item = ritualItems.find(i => i.id === itemId);
      return sum + (item?.points || 0);
    }, 0);
    return Math.round((totalPoints / maxPoints) * 100);
  };

  const handleViewScore = () => {
    if (completedItems.length > 0) {
      setShowCalmScore(true);
      setTimeout(() => {
        setShowGameOver(true);
      }, 3000);
    }
  };

  const calmScore = calculateCalmScore();
  const allCompleted = completedItems.length === selectedToComplete.length && selectedToComplete.length === 5;

  const getCalmLevel = (score) => {
    if (score >= 90) return { label: 'Deeply Calm', emoji: '😌', color: 'from-green-500 to-emerald-600', bgColor: 'from-green-50 to-emerald-50', borderColor: 'border-green-300' };
    if (score >= 70) return { label: 'Very Calm', emoji: '😊', color: 'from-blue-500 to-indigo-600', bgColor: 'from-blue-50 to-indigo-50', borderColor: 'border-blue-300' };
    if (score >= 50) return { label: 'Somewhat Calm', emoji: '🙂', color: 'from-yellow-500 to-amber-600', bgColor: 'from-yellow-50 to-amber-50', borderColor: 'border-yellow-300' };
    if (score >= 30) return { label: 'Getting Calm', emoji: '😐', color: 'from-orange-500 to-red-600', bgColor: 'from-orange-50 to-red-50', borderColor: 'border-orange-300' };
    return { label: 'Just Starting', emoji: '💭', color: 'from-gray-500 to-slate-600', bgColor: 'from-gray-50 to-slate-50', borderColor: 'border-gray-300' };
  };

  if (showGameOver) {
    const calmLevel = getCalmLevel(calmScore);
    
    return (
      <ParentGameShell
        title={gameData?.title || "Evening Log-Off Ritual"}
        subtitle="Ritual Complete!"
        showGameOver={true}
        score={5}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={allCompleted}
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
                {calmLevel.emoji}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Evening Ritual Complete!</h2>
              <p className="text-lg text-gray-600">
                You've ended your day with calm instead of scrolling.
              </p>
            </div>

            {/* Calm Score Display */}
            <div className={`bg-gradient-to-br ${calmLevel.bgColor} rounded-xl p-8 border-2 ${calmLevel.borderColor} mb-6 text-center`}>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Calm Score</h3>
              <div className="text-6xl font-bold text-gray-800 mb-2">{calmScore}/100</div>
              <p className="text-xl font-semibold text-gray-700">{calmLevel.label}</p>
            </div>

            {/* Completed Items Summary */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Evening Ritual</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ritualItems.map((item) => {
                  const isSelected = selectedToComplete.includes(item.id);
                  const isCompleted = completedItems.includes(item.id);
                  
                  // Only show the selected rituals
                  if (!isSelected) return null;
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`bg-gradient-to-br ${item.bgColor} rounded-xl p-4 border-2 ${item.borderColor} flex items-center gap-3`}
                    >
                      <div className="text-3xl">{item.emoji}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{item.label}</h4>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </div>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-green-600" />
                Benefits of Evening Log-Off
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Better Sleep:</strong> Ending your day with calm activities instead of scrolling helps your mind and body prepare for restful sleep.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Reduced Digital Fatigue:</strong> A log-off ritual gives your eyes and mind a break from screens, reducing digital overload.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Mindful Transition:</strong> Rituals help transition from the busyness of the day to the rest of the night, creating a clear boundary.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Modeling for Children:</strong> When you practice an evening log-off ritual, you model healthy boundaries with technology for your children.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Improved Presence:</strong> Ending the day without screens creates space for reflection, gratitude, and connection with yourself and loved ones.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Keep your phone charging outside the bedroom. When your phone is in another room at night, you're not tempted to check it, scroll, or respond to notifications. This simple boundary protects your sleep and models healthy technology habits for your children. Create a designated charging spot outside the bedroom and make it part of your evening ritual. Your future self will thank you for the restful sleep and the break from digital stimulation.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  if (showCalmScore) {
    const calmLevel = getCalmLevel(calmScore);
    
    return (
      <ParentGameShell
        title={gameData?.title || "Evening Log-Off Ritual"}
        subtitle="Your Calm Score"
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={1}
      >
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-8xl mb-6"
            >
              {calmLevel.emoji}
            </motion.div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Your Calm Score</h2>
            <div className={`inline-block bg-gradient-to-br ${calmLevel.bgColor} rounded-xl px-12 py-8 border-4 ${calmLevel.borderColor} mb-6`}>
              <p className="text-7xl font-bold text-gray-800 mb-2">{calmScore}/100</p>
              <p className="text-2xl font-semibold text-gray-700">{calmLevel.label}</p>
            </div>
            <p className="text-lg text-gray-600">
              {calmScore >= 70 
                ? "Excellent! You've created a calming evening ritual that helps you end the day peacefully."
                : calmScore >= 50
                ? "Good start! Complete more items in your ritual to increase your calm score."
                : "Keep going! Add more items to your evening ritual for a calmer night."}
            </p>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Evening Log-Off Ritual"}
      subtitle="End Your Day with Calm"
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
            <div className="text-6xl mb-4">🌙</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Evening Log-Off Ritual</h2>
            <p className="text-gray-600 text-lg">
              End your day with calm instead of scrolling.
            </p>
          </div>

          {/* Ritual Checklist */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Select 5 Rituals to Complete</h3>
            <div className="space-y-4">
              {ritualItems.map((item, index) => {
                const isSelected = selectedToComplete.includes(item.id);
                const isCompleted = completedItems.includes(item.id);
                const isDisabled = !isSelected && selectedToComplete.length >= 5;
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${item.bgColor} rounded-xl p-5 border-2 ${item.borderColor} cursor-pointer hover:shadow-lg transition-all ${
                      isSelected ? 'ring-2 ring-blue-400' : isDisabled ? 'opacity-50' : ''
                    }`}
                    onClick={() => handleToggleSelection(item.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {isSelected ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center"
                          >
                            <CheckCircle className="w-8 h-8 text-white" />
                          </motion.div>
                        ) : (
                          <div className="w-12 h-12 rounded-full border-4 border-gray-300 flex items-center justify-center bg-white">
                            <item.icon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{item.emoji}</span>
                          <h4 className="text-lg font-bold text-gray-800">{item.label}</h4>
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <div className="text-right">
                        {isSelected && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleCompletion(item.id);
                            }}
                            className="mt-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                          >
                            {isCompleted ? 'Completed' : 'Mark Done'}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Progress */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">Ritual Selection</p>
              <p className="text-sm font-bold text-gray-800">
                {selectedToComplete.length}/5 selected
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(selectedToComplete.length / 5) * 100}%` }}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full"
              />
            </div>
            {selectedToComplete.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">Progress</p>
                <p className="text-sm font-bold text-gray-800">
                  {completedItems.length}/{selectedToComplete.length} completed
                </p>
              </div>
            )}
            {completedItems.length > 0 && (
              <p className="text-sm text-gray-600 mt-2 text-center">
                Current Calm Score: <strong>{calmScore}/100</strong>
              </p>
            )}
          </div>

          {/* View Score Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleViewScore}
            disabled={completedItems.length === 0 || selectedToComplete.length !== 5}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Moon className="w-5 h-5" />
            View Calm Score
          </motion.button>

          {selectedToComplete.length < 5 && (
            <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
              <p className="text-yellow-800 text-sm text-center">
                Select 5 rituals to complete.
              </p>
            </div>
          )}
          
          {selectedToComplete.length === 5 && completedItems.length === 0 && (
            <div className="mt-4 bg-blue-100 rounded-lg p-3 border border-blue-300">
              <p className="text-blue-800 text-sm text-center">
                Mark at least one of your selected rituals as completed to view your calm score.
              </p>
            </div>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Keep your phone charging outside the bedroom. This simple boundary protects your sleep and models healthy technology habits for your children.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default EveningLogOffRitual;

