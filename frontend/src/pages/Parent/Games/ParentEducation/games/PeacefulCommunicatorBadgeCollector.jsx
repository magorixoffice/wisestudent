import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import parentGameCompletionService from "../../../../../services/parentGameCompletionService";
import parentBadgeService from "../../../../../services/parentBadgeService";
import api from "../../../../../utils/api";
import { Award, CheckCircle, Lock, Sparkles, MessageCircle } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const PeacefulCommunicatorBadgeCollector = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data
  const gameId = "parent-education-70"; // This is the badge collector game ID
  const gameData = getParentEducationGameById(gameId);
  
  const [loading, setLoading] = useState(true);
  const [gamesStatus, setGamesStatus] = useState([]);
  const [allCompleted, setAllCompleted] = useState(false);
  const [badgeCollected, setBadgeCollected] = useState(false);

  const [isCollecting, setIsCollecting] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);

  // Required game IDs (61, 62, 63, 64, 65) - Communication games
  const requiredGameIds = [
    'parent-education-61', // The Art of Listening
    'parent-education-62', // The Respectful "No"
    'parent-education-63', // Family Tone Mirror
    'parent-education-64', // Conflict Response Simulation
    'parent-education-65'  // Personal Boundary Builder
  ];

  const gameNames = {
    'parent-education-61': 'The Art of Listening',
    'parent-education-62': 'The Respectful "No"',
    'parent-education-63': 'Family Tone Mirror',
    'parent-education-64': 'Conflict Response Simulation',
    'parent-education-65': 'Personal Boundary Builder'
  };

  const gameIcons = {
    'parent-education-61': '👂',
    'parent-education-62': '🤝',
    'parent-education-63': '🎭',
    'parent-education-64': '⚖️',
    'parent-education-65': '🛡️'
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
          toast.error('Complete all 5 communication activities first to unlock this badge!');
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
      const result = await parentBadgeService.getPeacefulCommunicatorBadgeStatus();
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
      const response = await api.post('/api/parent/badge/peaceful-communicator/collect');

      const result = response.data;

      if (result.success && (result.badgeEarned || result.newlyEarned || result.alreadyEarned)) {
        setBadgeCollected(true);
        setShowCollectionModal(false);
        
        if (result.badgeEarned || result.newlyEarned) {
          toast.success('🎉 Badge collected successfully!');
          
          // Dispatch badge earned event
          window.dispatchEvent(new CustomEvent('parentBadgeEarned', {
            detail: {
              badgeId: 'peaceful-communicator',
              badgeName: 'Peaceful Communicator',
              message: 'Your calm words heal hearts.',
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
        toast.error(result.error || 'Failed to collect badge');
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
        title={gameData?.title || "Peaceful Communicator Badge"}
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
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading badge information...</p>
          </div>
        </div>
      </ParentGameShell>
    );
  }

  if (!allCompleted) {
    return (
      <ParentGameShell
        title={gameData?.title || "Peaceful Communicator Badge"}
        subtitle="Locked - Complete all communication activities to unlock"
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
                Complete all 5 communication activities to unlock this badge
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
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{gameIcons[game.gameId] || '📋'}</span>
                    {game.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
                    )}
                    <span className={`font-medium ${
                      game.completed ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      {index + 1}. {game.name}
                    </span>
                  </div>
                  <span className={`text-sm font-semibold ${
                    game.completed ? 'text-green-600' : 'text-gray-400'
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
                <span>{gamesStatus.filter(g => g.completed).length} / 5 communication activities completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(gamesStatus.filter(g => g.completed).length / 5) * 100}%`
                  }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-4 rounded-full"
                ></motion.div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 text-center">
              <p className="text-sm text-blue-700">
                Complete all 5 communication activities to earn the Peaceful Communicator Badge!
              </p>
            </div>
          </div>
        </div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Peaceful Communicator Badge"}
      subtitle="Celebrate consistent peaceful communication and emotional clarity"
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
              className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 mb-6"
            >
              <MessageCircle className="w-16 h-16 text-white" />
            </motion.div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Peaceful Communicator Badge
            </h2>
            <p className="text-2xl text-blue-600 font-medium italic mb-6">
              "Your calm words heal hearts."
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <p className="text-gray-700 text-lg">
                Congratulations! You have successfully completed all communication activities and earned the Peaceful Communicator Badge.
              </p>
            </div>

            {/* Completed Games List */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Completed Communication Activities:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gamesStatus.map((game) => (
                  <div
                    key={game.gameId}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200"
                  >
                    <span className="text-xl">{gameIcons[game.gameId] || '✅'}</span>
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">{game.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800">
                <strong>💡 Parent Tip:</strong> Wear your badge of calm proudly—communication builds culture. 
                Your commitment to maintaining emotional clarity and respect in dialogue creates a foundation of peace that transforms how your family communicates and connects.
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
                className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 mb-6"
              >
                <Sparkles className="w-16 h-16 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                All Communication Activities Completed!
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                You've successfully completed all 5 communication activities
              </p>
            </div>

            {/* Completed Games List */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Completed Communication Activities:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gamesStatus.map((game) => (
                  <motion.div
                    key={game.gameId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: gamesStatus.indexOf(game) * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-blue-200"
                  >
                    <span className="text-xl">{gameIcons[game.gameId] || '✅'}</span>
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">{game.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Badge Preview */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-8 border-2 border-blue-300 mb-6 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 mb-4">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Peaceful Communicator Badge
              </h3>
              <p className="text-xl text-blue-700 font-medium italic mb-4">
                "Your calm words heal hearts."
              </p>
              <p className="text-gray-600">
                This badge recognizes your consistent practice of peaceful communication, emotional clarity, and respectful dialogue.
              </p>
            </div>

            {/* Collect Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCollectionModal(true)}
              className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-5 h-5" />
              <span>Collect Badge</span>
            </motion.button>

            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <p className="text-sm text-amber-800">
                <strong>💡 Parent Tip:</strong> Wear your badge of calm proudly—communication builds culture. 
                Your commitment to maintaining emotional clarity and respect in dialogue creates a foundation of peace that transforms how your family communicates and connects.
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
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 mb-4">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Collect Your Badge
              </h3>
              <p className="text-gray-600 mb-6">
                Are you ready to collect your Peaceful Communicator Badge?
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowCollectionModal(false)}
                  disabled={isCollecting}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-full font-semibold transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCollectBadge}
                  disabled={isCollecting}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                >
                  {isCollecting ? 'Collecting...' : 'Yes, Collect Badge!'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </ParentGameShell>
  );
};

export default PeacefulCommunicatorBadgeCollector;