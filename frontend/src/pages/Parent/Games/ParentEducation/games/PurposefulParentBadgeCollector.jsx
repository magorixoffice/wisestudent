import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import parentGameCompletionService from "../../../../../services/parentGameCompletionService";
import parentBadgeService from "../../../../../services/parentBadgeService";
import api from "../../../../../utils/api";
import { Award, CheckCircle, Lock, Sparkles, Target } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const PurposefulParentBadgeCollector = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data
  const gameId = "parent-education-90"; // This is the badge collector game ID
  const gameData = getParentEducationGameById(gameId);
  
  const [loading, setLoading] = useState(true);
  const [gamesStatus, setGamesStatus] = useState([]);
  const [allCompleted, setAllCompleted] = useState(false);
  const [badgeCollected, setBadgeCollected] = useState(false);

  const [isCollecting, setIsCollecting] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);

  // Required game IDs (81, 82, 84, 85, 87) - Purpose games
  const requiredGameIds = [
    'parent-education-81', // Why I Parent
    'parent-education-82', // Legacy Reflection
    'parent-education-84', // Family Values Map
    'parent-education-85', // My Parenting Mantra
    'parent-education-87'  // Family Vision Board
  ];

  const gameNames = {
    'parent-education-81': 'Why I Parent',
    'parent-education-82': 'Legacy Reflection',
    'parent-education-84': 'Family Values Map',
    'parent-education-85': 'My Parenting Mantra',
    'parent-education-87': 'Family Vision Board'
  };

  const gameIcons = {
    'parent-education-81': '💫',
    'parent-education-82': '🌳',
    'parent-education-84': '🗺️',
    'parent-education-85': '💭',
    'parent-education-87': '🎯'
  };

  useEffect(() => {
    checkGamesCompletion();
    checkBadgeStatus();
  }, []);

  const checkGamesCompletion = async () => {
    try {
      setLoading(true);
      const statusPromises = requiredGameIds.map(async (id) => {
        try {
          const progress = await parentGameCompletionService.getGameProgress(id);
          return {
            gameId: id,
            name: gameNames[id] || id,
            completed: progress?.fullyCompleted === true
          };
        } catch (error) {
          console.error(`Error checking game ${id}:`, error);
          return {
            gameId: id,
            name: gameNames[id] || id,
            completed: false
          };
        }
      });

      const statuses = await Promise.all(statusPromises);
      setGamesStatus(statuses);

      const allCompletedCheck = statuses.every(status => status.completed);
      setAllCompleted(allCompletedCheck);

      // If not all completed, redirect after showing message
      if (!allCompletedCheck) {
        setTimeout(() => {
          toast.error('Complete all 5 purpose activities first to unlock this badge!');
          navigate('/parent/games/parent-education');
        }, 3000);
      }
    } catch (error) {
      console.error('Error checking games completion:', error);
      toast.error('Failed to check game completion status');
    } finally {
      setLoading(false);
    }
  };

  const checkBadgeStatus = async () => {
    try {
      const result = await parentBadgeService.getPurposefulParentBadgeStatus();
      if (result.hasBadge) {
        setBadgeCollected(true);
      }
    } catch (error) {
      console.error('Error checking badge status:', error);
    }
  };

  const handleCollectBadge = async () => {
    try {
      setIsCollecting(true);
      const response = await api.post('/api/parent/badge/purposeful-parent/collect');

      const result = response.data;

      if (result.success) {
        // Check if badge was earned, already collected, or newly earned
        const badgeWasProcessed = result.badgeEarned === true || 
                                  result.alreadyEarned === true || 
                                  result.newlyEarned === true;
        
        if (badgeWasProcessed) {
          setBadgeCollected(true);
          setShowCollectionModal(false);
          
          if (result.badgeEarned || result.newlyEarned) {
            toast.success('🎉 Badge collected successfully!');
            
            // Dispatch badge earned event
            window.dispatchEvent(new CustomEvent('parentBadgeEarned', {
              detail: {
                badgeId: 'purposeful-parent',
                badgeName: 'Purposeful Parent',
                message: 'Your purpose becomes your child\'s compass.',
                badge: result.badge
              }
            }));
          } else {
            toast.info('Badge already collected!');
          }

          // Register the badge game as completed in the game progress system
          // This is crucial for sequential unlocking of the next game
          try {
            await parentGameCompletionService.completeGame({
              gameId,
              gameType: 'parent-education',
              gameIndex: gameData?.gameIndex || null,
              score: 5,
              totalLevels: 5,
              totalCoins: 0,
              isReplay: false
            });
          } catch (error) {
            console.error('Failed to mark badge game completed:', error);
          }
        } else {
          // Badge was not processed, show error from backend
          toast.error(result.error || 'Failed to collect badge');
          setShowCollectionModal(false);
        }
      } else {
        toast.error(result.error || 'Failed to collect badge');
        setShowCollectionModal(false);
      }
    } catch (error) {
      console.error('Error collecting badge:', error);
      const errorMessage = error.response?.data?.error || 'Failed to collect badge. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsCollecting(false);
    }
  };

  if (loading) {
    return (
      <ParentGameShell
        title={gameData?.title || "Purposeful Parent Badge"}
        subtitle="Checking your progress..."
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={0}
        totalCoins={0}
        currentQuestion={0}
      >
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading badge information...</p>
          </div>
        </div>
      </ParentGameShell>
    );
  }

  if (!allCompleted) {
    return (
      <ParentGameShell
        title={gameData?.title || "Purposeful Parent Badge"}
        subtitle="Locked - Complete all purpose activities to unlock"
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={0}
        totalCoins={0}
        currentQuestion={0}
      >
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-200 mb-4">
                <Lock className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Badge Locked
              </h2>
              <p className="text-lg text-gray-600">
                Complete all 5 purpose activities to unlock this badge
              </p>
            </div>

            {/* Games Status List */}
            <div className="space-y-3 mb-6">
              {gamesStatus.map((game, index) => (
                <motion.div
                  key={game.gameId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                    game.completed
                      ? 'bg-purple-50 border-purple-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{gameIcons[game.gameId] || '📋'}</span>
                    {game.completed ? (
                      <CheckCircle className="w-6 h-6 text-purple-600" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
                    )}
                    <span className={`font-medium ${
                      game.completed ? 'text-purple-800' : 'text-gray-600'
                    }`}>
                      {index + 1}. {game.name}
                    </span>
                  </div>
                  <span className={`text-sm font-semibold ${
                    game.completed ? 'text-purple-600' : 'text-gray-400'
                  }`}>
                    {game.completed ? 'Completed' : 'Not Completed'}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{gamesStatus.filter(g => g.completed).length} / 5 purpose activities completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(gamesStatus.filter(g => g.completed).length / 5) * 100}%`
                  }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-4 rounded-full"
                ></motion.div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 text-center">
              <p className="text-sm text-purple-700">
                Complete all 5 purpose activities to earn the Purposeful Parent Badge!
              </p>
            </div>
          </div>
        </div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Purposeful Parent Badge"}
      subtitle="Celebrate parents who raise families guided by love and intention"
      showGameOver={false}
      score={0}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={0}
      totalCoins={0}
      currentQuestion={0}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {badgeCollected ? (
          // Badge Already Collected
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 via-indigo-400 to-pink-400 mb-6"
            >
              <Target className="w-16 h-16 text-white" />
            </motion.div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Purposeful Parent Badge
            </h2>
            <p className="text-2xl text-purple-600 font-medium italic mb-6">
              "Your purpose becomes your child's compass."
            </p>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
              <p className="text-gray-700 text-lg">
                Congratulations! You have successfully completed all purpose activities and earned the Purposeful Parent Badge.
              </p>
            </div>

            {/* Completed Games List */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Completed Purpose Activities:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gamesStatus.map((game) => (
                  <div
                    key={game.gameId}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200"
                  >
                    <span className="text-xl">{gameIcons[game.gameId] || '✅'}</span>
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">{game.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800">
                <strong>💡 Parent Tip:</strong> Talk about your family's purpose aloud—it becomes their story of strength. 
                When you share your family's values, vision, and purpose with your children, you're giving them more than guidance—you're giving them a compass. 
                Your purposeful parenting becomes their story of strength, their foundation for making choices, and their understanding of what truly matters. 
                Keep your purpose visible and spoken—let it guide every decision and conversation.
              </p>
            </div>
          </div>
        ) : (
          // Badge Ready to Collect
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 via-indigo-400 to-pink-400 mb-6"
              >
                <Sparkles className="w-16 h-16 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                All Purpose Activities Completed!
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                You've successfully completed all 5 purpose activities
              </p>
            </div>

            {/* Completed Games List */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Completed Purpose Activities:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gamesStatus.map((game) => (
                  <motion.div
                    key={game.gameId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: gamesStatus.indexOf(game) * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-purple-200"
                  >
                    <span className="text-xl">{gameIcons[game.gameId] || '✅'}</span>
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">{game.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Badge Preview */}
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-8 border-2 border-purple-300 mb-6 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 via-indigo-400 to-pink-400 mb-4">
                <Target className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Purposeful Parent Badge
              </h3>
              <p className="text-xl text-purple-700 font-medium italic mb-4">
                "Your purpose becomes your child's compass."
              </p>
              <p className="text-gray-600">
                This badge recognizes your commitment to raising your family with love and intention.
              </p>
            </div>

            {/* Collect Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCollectionModal(true)}
              className="w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Award className="w-5 h-5" />
              <span>Collect Badge</span>
            </motion.button>

            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <p className="text-sm text-amber-800">
                <strong>💡 Parent Tip:</strong> Talk about your family's purpose aloud—it becomes their story of strength. 
                When you share your family's values, vision, and purpose with your children, you're giving them more than guidance—you're giving them a compass.
              </p>
            </div>
          </div>
        )}

        {/* Collection Confirmation Modal */}
        {showCollectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 via-indigo-400 to-pink-400 mb-4">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Collect Your Badge
              </h3>
              <p className="text-gray-600 mb-6">
                Are you ready to collect your Purposeful Parent Badge?
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowCollectionModal(false)}
                  disabled={isCollecting}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-full font-semibold transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCollectBadge}
                  disabled={isCollecting}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                >
                  {isCollecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Collecting...
                    </>
                  ) : (
                    'Yes, Collect Badge!'
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </ParentGameShell>
  );
};

export default PurposefulParentBadgeCollector;