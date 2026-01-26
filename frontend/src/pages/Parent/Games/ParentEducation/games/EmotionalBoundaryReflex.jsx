import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { CheckCircle, XCircle, Shield, Heart, Sparkles, GripVertical } from "lucide-react";

const EmotionalBoundaryReflex = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-69";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
   const totalLevels = gameData?.totalQuestions || 5;
  
  const [draggedItem, setDraggedItem] = useState(null);
  const [droppedItems, setDroppedItems] = useState({ healthy: [], unhealthy: [] });
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // All boundary statements for single round classification
  const boundaryItems = [
    // Healthy boundaries (5 statements)
    {
      id: 1,
      statement: "Setting limits helps me stay emotionally available for my child",
      isHealthy: true,
      explanation: "Healthy boundaries preserve your emotional energy so you can be consistently present and supportive."
    },
    {
      id: 2,
      statement: "I can listen to my teenager's struggles without fixing everything",
      isHealthy: true,
      explanation: "Being a sounding board rather than a fixer teaches teens to process emotions and find their own solutions."
    },
    {
      id: 6,
      statement: "I need to solve all my child's friendship problems",
      isHealthy: false,
      explanation: "Taking responsibility for your child's social challenges prevents them from developing problem-solving skills."
    },
    {
      id: 3,
      statement: "I can say no to extra commitments to prioritize family time",
      isHealthy: true,
      explanation: "Protecting family time strengthens relationships and models healthy priority-setting for children."
    },
     {
      id: 7,
      statement: "My child's bad grade means I'm a failure as a parent",
      isHealthy: false,
      explanation: "Academic performance reflects the child's effort and learning process, not parental worth or success."
    },
    {
      id: 4,
      statement: "I can validate my child's feelings while maintaining household rules",
      isHealthy: true,
      explanation: "Acknowledging emotions and enforcing boundaries teaches children that feelings and structure can coexist."
    },
       {
      id: 9,
      statement: "I must rescue my child from every uncomfortable situation",
      isHealthy: false,
      explanation: "Shielding children from all discomfort prevents resilience development and problem-solving skill building."
    },
      {
      id: 8,
      statement: "I should feel guilty when my child is sad",
      isHealthy: false,
      explanation: "Children's emotions are natural parts of growth. Guilt prevents you from offering calm, supportive guidance."
    },
    {
      id: 5,
      statement: "I can take care of myself so I have more to give my family",
      isHealthy: true,
      explanation: "Self-care isn't selfish—it's essential for maintaining the emotional availability children need."
    },
    {
      id: 10,
      statement: "My child's anger is a personal attack on me",
      isHealthy: false,
      explanation: "Children's anger often expresses frustration, developmental needs, or communication struggles—not rejection of you."
    }
  ];

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDrop = (category) => {
    if (!draggedItem) return;
    
    // Prevent duplicate drops
    if (droppedItems.healthy.some(item => item.id === draggedItem.id) || 
        droppedItems.unhealthy.some(item => item.id === draggedItem.id)) {
      setDraggedItem(null);
      return;
    }
    
    const newDroppedItems = {
      ...droppedItems,
      [category]: [...droppedItems[category], draggedItem]
    };
    
    setDroppedItems(newDroppedItems);
    setDraggedItem(null);
    
    // Check if game is complete (all 10 items sorted)
    const totalDropped = newDroppedItems.healthy.length + newDroppedItems.unhealthy.length;
    if (totalDropped === boundaryItems.length) {
      setGameCompleted(true);
      setShowFeedback(true);
      
      // Calculate correctness - if all 10 are sorted correctly, award 5 points
      let correctHealthy = newDroppedItems.healthy.filter(item => item.isHealthy).length;
      let correctUnhealthy = newDroppedItems.unhealthy.filter(item => !item.isHealthy).length;
      let totalCorrect = correctHealthy + correctUnhealthy;
      
      // Award 5 points if all 10 statements are correctly classified
      let taskScore = (totalCorrect === 10) ? 5 : Math.floor(totalCorrect / 2);
      
      setScore(taskScore);
      setCompletedTasks(1); // Mark 1 task as completed
      
      // Show game over after delay
      setTimeout(() => {
        setShowGameOver(true);
      }, 3000);
    }
  };

  const getDraggableItems = () => {
    return boundaryItems.filter(item => 
      !droppedItems.healthy.some(dropped => dropped.id === item.id) &&
      !droppedItems.unhealthy.some(dropped => dropped.id === item.id)
    );
  };



  if (showGameOver) {
    const percentage = Math.round((score / 10) * 100); // 10 statements total
    let performanceLevel = "";
    let performanceColor = "";
    let performanceEmoji = "";

    if (percentage >= 90) {
      performanceLevel = "Excellent";
      performanceColor = "from-green-500 to-emerald-600";
      performanceEmoji = "🌟";
    } else if (percentage >= 70) {
      performanceLevel = "Great";
      performanceColor = "from-blue-500 to-indigo-600";
      performanceEmoji = "👍";
    } else if (percentage >= 50) {
      performanceLevel = "Good";
      performanceColor = "from-yellow-500 to-amber-600";
      performanceEmoji = "📊";
    } else {
      performanceLevel = "Keep Practicing";
      performanceColor = "from-orange-500 to-red-600";
      performanceEmoji = "💪";
    }

    return (
      <ParentGameShell
        title={gameData?.title || "Emotional Boundary Reflex"}
        subtitle="Game Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={score === 5}
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
                {performanceEmoji}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Boundary Reflex Results</h2>
              <div className={`inline-block bg-gradient-to-br ${performanceColor} rounded-xl px-8 py-4 text-white mb-4`}>
                <p className="text-4xl font-bold mb-2">{percentage}%</p>
                <p className="text-xl font-semibold">{performanceLevel}</p>
                <p className="text-lg mt-2">{score}/5 Tasks Completed</p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                Your Boundary Recognition
              </h3>
              <p className="text-gray-700 mb-4">
                You completed <strong>{completedTasks} sorting task{completedTasks !== 1 ? 's' : ''}</strong> with {score}/5 points. Perfect score requires correctly sorting all 10 statements (5 healthy and 5 unhealthy).
              </p>
              <p className="text-gray-700">
                {percentage >= 90 
                  ? "Excellent work! You have a strong understanding of healthy emotional boundaries."
                  : percentage >= 70
                  ? "Great job! You're developing a good sense of healthy boundaries. Keep practicing!"
                  : percentage >= 50
                  ? "Good start! Recognizing healthy boundaries takes practice. Review the feedback and try again."
                  : "Keep practicing! Understanding healthy boundaries is a skill that improves with awareness. Review the feedback and try again."}
              </p>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-green-600" />
                Key Insights About Healthy Boundaries
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Validation + Boundaries:</strong> You can acknowledge your child's feelings while maintaining necessary rules and expectations. This teaches emotional intelligence.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Support Without Rescuing:</strong> Being present for your child's struggles without solving every problem helps them develop resilience and coping skills.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Self-Care as Parenting:</strong> Taking care of your own emotional needs isn't selfish—it's essential for being the calm, consistent parent your child needs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Separate Feelings from Behavior:</strong> Your child's difficult emotions don't reflect your parenting failure. Stay connected while guiding appropriate behavior.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Prioritized Presence:</strong> Setting boundaries with external commitments allows you to be fully present for family moments that matter most.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Recognizing healthy boundaries helps you respond to your child's emotional needs without losing yourself. When you can distinguish between supporting and rescuing, validating feelings while maintaining rules, and caring for yourself while caring for others, you become a more stable and effective parent. These skills help your child develop emotional intelligence, resilience, and healthy relationship patterns that will serve them throughout life.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Emotional Boundary Reflex"}
      subtitle="Single Round - Sort All Statements"
      showGameOver={false}
      score={score}
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
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Sorting Statements</span>
              <span>Score: {score}/5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(score / 5) * 100}%` }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full"
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-200 mb-6">
            <p className="text-center text-gray-700 font-semibold">
              Complete the sorting task: Arrange all 10 statements correctly to earn 5 points
            </p>
          </div>

          {/* Drop Zones - Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Healthy Boundaries Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop('healthy')}
              className="border-3 rounded-xl p-6 transition-all bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 hover:border-green-500 hover:shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-green-600" />
                <h3 className="text-xl font-bold text-green-800">Healthy Boundaries</h3>
              </div>
              <p className="text-green-700 mb-4 text-sm">Balanced, sustainable parenting approaches</p>
              <div className="space-y-2 min-h-[120px]">
                {droppedItems.healthy.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-lg p-3 border-2 border-green-300 flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-green-800 font-medium text-sm">"{item.statement}"</span>
                  </motion.div>
                ))}
                {droppedItems.healthy.length === 0 && (
                  <div className="text-green-600 italic text-sm">Drop healthy statements here</div>
                )}
              </div>
            </div>

            {/* Unhealthy Boundaries Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop('unhealthy')}
              className="border-3 rounded-xl p-6 transition-all bg-gradient-to-br from-red-50 to-orange-50 border-red-300 hover:border-red-500 hover:shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-red-600" />
                <h3 className="text-xl font-bold text-red-800">Unhealthy Boundaries</h3>
              </div>
              <p className="text-red-700 mb-4 text-sm">Over-involved or neglectful approaches</p>
              <div className="space-y-2 min-h-[120px]">
                {droppedItems.unhealthy.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-lg p-3 border-2 border-red-300 flex items-center gap-2"
                  >
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="text-red-800 font-medium text-sm">"{item.statement}"</span>
                  </motion.div>
                ))}
                {droppedItems.unhealthy.length === 0 && (
                  <div className="text-red-600 italic text-sm">Drop unhealthy statements here</div>
                )}
              </div>
            </div>
          </div>

          {/* Draggable Items - Bottom Section */}
          <div className="mb-8">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Statements to Sort</h3>
              <p className="text-sm text-gray-600">{getDraggableItems().length} remaining • Drag to correct column above</p>
            </div>
            
            {/* Horizontal Draggable Items */}
            <div className="flex flex-wrap gap-3 justify-center min-h-[150px] p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              {getDraggableItems().map((item) => (
                <motion.div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white border-2 border-gray-300 rounded-lg p-3 shadow-md cursor-grab active:cursor-grabbing flex items-center gap-2 min-w-[280px] max-w-xs"
                >
                  <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-800 font-medium text-sm">"{item.statement}"</span>
                </motion.div>
              ))}
              {getDraggableItems().length === 0 && (
                <div className="bg-green-100 border-2 border-green-300 rounded-lg p-6 text-center w-full">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <p className="font-bold text-lg text-green-800">All Statements Sorted!</p>
                  <p className="text-green-700">Calculating your score...</p>
                </div>
              )}
            </div>
          </div>

          {/* Game Completion Feedback */}
          <AnimatePresence>
            {showFeedback && gameCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
              >
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl"
                >
                  <div className="text-6xl mb-4">
                    {score === 10 ? '🏆' : score >= 8 ? '🎉' : score >= 6 ? '👍' : '💪'}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Game Complete!</h3>
                  <p className="text-lg text-gray-700 mb-4">
                    Task completed with <span className="font-bold text-blue-600">{score}/5</span> points
                  </p>
                  <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Correctly sorted:</span>
                      <span>{droppedItems.healthy.filter(item => item.isHealthy).length + droppedItems.unhealthy.filter(item => !item.isHealthy).length}/10</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Points earned:</span>
                      <span>{score}/5</span>
                    </div>
                  </div>
                  <p className="text-gray-600">Final score calculation...</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> This sorting exercise helps develop intuitive boundary recognition skills. Complete the task perfectly to earn maximum points and build your ability to quickly assess boundary quality in real parenting situations.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default EmotionalBoundaryReflex;

