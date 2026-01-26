import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Heart, CheckCircle, Users, Sparkles, TrendingUp, MessageCircle } from "lucide-react";

const ConnectionChallenge = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-73";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [selectedChallenges, setSelectedChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [showGameOver, setShowGameOver] = useState(false);

  // Available challenge cards
  const allChallenges = [
    {
      id: 1,
      title: "Thinking of You Text",
      action: "Text a friend 'Thinking of you'",
      description: "Send a simple, genuine message to someone you care about",
      points: 10,
      emoji: "💬",
      color: "from-blue-400 to-indigo-500",
      bgColor: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-300",
      category: "Friends"
    },
    {
      id: 2,
      title: "Family Tea Time",
      action: "Plan family tea or coffee",
      description: "Set aside time to sit and talk with family members",
      points: 15,
      emoji: "☕",
      color: "from-amber-400 to-orange-500",
      bgColor: "from-amber-50 to-orange-50",
      borderColor: "border-amber-300",
      category: "Family"
    },
    {
      id: 3,
      title: "Check In Call",
      action: "Call someone you haven't talked to in a while",
      description: "Reach out and catch up with an old friend or family member",
      points: 12,
      emoji: "📞",
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      borderColor: "border-green-300",
      category: "Friends & Family"
    },
    {
      id: 4,
      title: "Write a Note",
      action: "Write a handwritten note to someone",
      description: "Express appreciation or care through a physical note",
      points: 15,
      emoji: "✍️",
      color: "from-pink-400 to-rose-500",
      bgColor: "from-pink-50 to-rose-50",
      borderColor: "border-pink-300",
      category: "Any"
    },
    {
      id: 5,
      title: "Neighbor Kindness",
      action: "Do a small kindness for a neighbor",
      description: "Offer help, share something, or just have a friendly conversation",
      points: 12,
      emoji: "🏘️",
      color: "from-purple-400 to-violet-500",
      bgColor: "from-purple-50 to-violet-50",
      borderColor: "border-purple-300",
      category: "Community"
    },
    {
      id: 6,
      title: "Share Appreciation",
      action: "Tell someone why you appreciate them",
      description: "Be specific about what you value in them",
      points: 15,
      emoji: "🙏",
      color: "from-yellow-400 to-amber-500",
      bgColor: "from-yellow-50 to-amber-50",
      borderColor: "border-yellow-300",
      category: "Any"
    },
    {
      id: 7,
      title: "Help a Friend",
      action: "Offer practical help to a friend",
      description: "Ask what they need or offer something specific you can do",
      points: 15,
      emoji: "🤝",
      color: "from-cyan-400 to-teal-500",
      bgColor: "from-cyan-50 to-teal-50",
      borderColor: "border-cyan-300",
      category: "Friends"
    },
    {
      id: 8,
      title: "Quality Time",
      action: "Spend 30 minutes of focused time with a loved one",
      description: "Put away distractions and be fully present",
      points: 18,
      emoji: "⏰",
      color: "from-indigo-400 to-blue-500",
      bgColor: "from-indigo-50 to-blue-50",
      borderColor: "border-indigo-300",
      category: "Family"
    },
    {
      id: 9,
      title: "Send Encouragement",
      action: "Send an encouraging message to someone going through a hard time",
      description: "Let them know they're not alone and you care",
      points: 15,
      emoji: "💝",
      color: "from-red-400 to-pink-500",
      bgColor: "from-red-50 to-pink-50",
      borderColor: "border-red-300",
      category: "Any"
    },
    {
      id: 10,
      title: "Plan a Gathering",
      action: "Plan a small gathering or get-together",
      description: "Bring people together for connection and joy",
      points: 20,
      emoji: "🎉",
      color: "from-orange-400 to-red-500",
      bgColor: "from-orange-50 to-red-50",
      borderColor: "border-orange-300",
      category: "Community"
    }
  ];

  const handleSelectChallenge = (challengeId) => {
    if (selectedChallenges.length >= 5 && !selectedChallenges.includes(challengeId)) {
      return; // Can only select 5
    }
    
    setSelectedChallenges(prev => {
      if (prev.includes(challengeId)) {
        // Deselect
        return prev.filter(id => id !== challengeId);
      } else {
        // Select (max 5)
        if (prev.length < 5) {
          return [...prev, challengeId];
        }
        return prev;
      }
    });
  };

  const handleCompleteChallenge = (challengeId) => {
    if (!selectedChallenges.includes(challengeId)) return;
    
    setCompletedChallenges(prev => {
      if (prev.includes(challengeId)) {
        return prev.filter(id => id !== challengeId);
      } else {
        return [...prev, challengeId];
      }
    });
  };

  const calculateConnectionPoints = () => {
    return completedChallenges.reduce((total, challengeId) => {
      const challenge = allChallenges.find(c => c.id === challengeId);
      return total + (challenge?.points || 0);
    }, 0);
  };

  const getSelectedChallengesData = () => {
    return selectedChallenges
      .map(id => allChallenges.find(c => c.id === id))
      .filter(Boolean);
  };

  const handleFinish = () => {
    if (completedChallenges.length > 0) {
      setShowGameOver(true);
    }
  };

  const connectionPoints = calculateConnectionPoints();
  const selectedChallengesData = getSelectedChallengesData();
  const completionRate = selectedChallenges.length > 0 
    ? (completedChallenges.length / selectedChallenges.length) * 100 
    : 0;

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Connection Challenge"}
        subtitle="Challenge Complete!"
        showGameOver={true}
        score={completedChallenges.length}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={selectedChallenges.length}
        totalCoins={totalCoins}
        currentLevel={selectedChallenges.length}
        allAnswersCorrect={completedChallenges.length >= selectedChallenges.length}
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
                🌟
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Connection Challenge Complete!</h2>
              <p className="text-lg text-gray-600 mb-6">
                You completed {completedChallenges.length} out of {selectedChallenges.length} challenges.
              </p>
            </div>

            {/* Connection Points */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-8 mb-8 text-center text-white shadow-lg">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Sparkles className="w-10 h-10 opacity-90" />
                <div>
                  <p className="text-4xl font-bold mb-2">{connectionPoints}</p>
                  <p className="text-lg font-semibold opacity-90">Connection Points Earned</p>
                </div>
              </div>
              <p className="text-sm opacity-90">
                {connectionPoints >= 60 
                  ? "Amazing! You've created powerful connections and strengthened your relationships."
                  : connectionPoints >= 40
                  ? "Great work! Your supportive gestures are making a real difference."
                  : "Every gesture counts! You're building meaningful connections."}
              </p>
            </div>

            {/* Completed Challenges */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Completed Challenges
              </h3>
              <div className="space-y-4">
                {selectedChallengesData.map((challenge) => {
                  const isCompleted = completedChallenges.includes(challenge.id);
                  if (!isCompleted) return null;
                  
                  return (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`bg-gradient-to-br ${challenge.bgColor} rounded-xl p-5 border-2 ${challenge.borderColor} flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{challenge.emoji}</span>
                        <div>
                          <h4 className="text-lg font-bold text-gray-800">{challenge.title}</h4>
                          <p className="text-sm text-gray-600">{challenge.action}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <CheckCircle className="w-8 h-8 text-green-600 mb-1" />
                        <p className="text-sm font-semibold text-gray-700">+{challenge.points} pts</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-blue-600" />
                Connection Insights
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Small Gestures Matter:</strong> Every supportive action you take creates a ripple effect, strengthening relationships and reducing loneliness.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Connection Builds Resilience:</strong> Strong relationships are one of the most important factors in emotional wellbeing and resilience.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>You've Made a Difference:</strong> Your gestures, no matter how small, have likely brightened someone's day and strengthened your bonds.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Keep It Going:</strong> Consider making connection challenges a regular practice to maintain strong relationships.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Small gestures ripple out to heal invisible loneliness. When you reach out to others, you're not just strengthening your relationships—you're creating a network of support that benefits everyone, including your family. Your children learn from watching you connect with others, and they see that relationships require effort and care. These small gestures create big impacts over time.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Connection Challenge"}
      subtitle="Strengthen Your Relationships"
      showGameOver={false}
      score={connectionPoints}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={1}
    >
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🌟</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Connection Challenge</h2>
            <p className="text-gray-600 text-lg mb-2">
              Pick 5 supportive gestures to complete and strengthen your relationships.
            </p>
            <p className="text-sm text-gray-500">
              Select {selectedChallenges.length}/5 challenges
            </p>
          </div>

          {/* Selection Phase */}
          {selectedChallenges.length < 5 ? (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Choose Your 5 Challenges</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select 5 supportive gestures you'd like to complete. Each gesture earns connection points and strengthens your relationships.
                </p>
              </div>

              {/* Challenge Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {allChallenges.map((challenge) => {
                  const isSelected = selectedChallenges.includes(challenge.id);
                  return (
                    <motion.button
                      key={challenge.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectChallenge(challenge.id)}
                      disabled={selectedChallenges.length >= 5 && !isSelected}
                      className={`text-left p-5 rounded-xl border-2 transition-all ${
                        isSelected
                          ? `${challenge.bgColor} ${challenge.borderColor} border-4 shadow-lg`
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      } ${selectedChallenges.length >= 5 && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{challenge.emoji}</span>
                          <div>
                            <h4 className="text-lg font-bold text-gray-800">{challenge.title}</h4>
                            <p className="text-xs text-gray-500">{challenge.category}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-gray-700 font-medium mb-2">{challenge.action}</p>
                      <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500">+{challenge.points} connection points</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* Completion Phase */}
              <div className="mb-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Your Selected Challenges</h3>
                      <p className="text-sm text-gray-600">
                        Mark challenges as complete when you finish them
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{completedChallenges.length}/5</p>
                      <p className="text-xs text-gray-600">Completed</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionRate}%` }}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full"
                    />
                  </div>

                  {/* Connection Points Preview */}
                  {connectionPoints > 0 && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Current Points</p>
                      <p className="text-3xl font-bold text-green-600">{connectionPoints}</p>
                    </div>
                  )}
                </div>

                {/* Selected Challenges to Complete */}
                <div className="space-y-4 mb-6">
                  {selectedChallengesData.map((challenge) => {
                    const isCompleted = completedChallenges.includes(challenge.id);
                    return (
                      <motion.div
                        key={challenge.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-gradient-to-br ${challenge.bgColor} rounded-xl p-6 border-2 ${challenge.borderColor} ${isCompleted ? 'opacity-75' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <span className="text-4xl">{challenge.emoji}</span>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-gray-800 mb-1">{challenge.title}</h4>
                              <p className="text-gray-700 font-medium mb-2">{challenge.action}</p>
                              <p className="text-sm text-gray-600">{challenge.description}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleCompleteChallenge(challenge.id)}
                              className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all ${
                                isCompleted
                                  ? 'bg-green-500 border-green-600 text-white'
                                  : 'bg-white border-gray-300 text-gray-400 hover:border-green-400'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle className="w-6 h-6" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-current" />
                              )}
                            </motion.button>
                            <span className="text-xs font-semibold text-gray-600">
                              {isCompleted ? 'Completed' : 'Mark Complete'}
                            </span>
                          </div>
                        </div>
                        {isCompleted && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 pt-4 border-t border-gray-200"
                          >
                            <div className="flex items-center gap-2 text-green-600">
                              <Sparkles className="w-5 h-5" />
                              <span className="font-semibold">+{challenge.points} connection points earned!</span>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Finish Button */}
              {completedChallenges.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFinish}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Finish Challenge
                </motion.button>
              )}
            </>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Small gestures ripple out to heal invisible loneliness. Every supportive action you take strengthens your relationships and creates a network of care that benefits everyone. These small gestures teach your children the importance of connection and showing up for others.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default ConnectionChallenge;

