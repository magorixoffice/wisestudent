import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Heart, CheckCircle, HandHeart, Sparkles, TrendingUp, BookOpen } from "lucide-react";

const HelpingHandChallenge = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-77";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [taskReflections, setTaskReflections] = useState({});
  const [showGameOver, setShowGameOver] = useState(false);

  // Available kindness tasks
  const allTasks = [
    {
      id: 1,
      title: "Help a Neighbor",
      action: "Offer help to a neighbor (yard work, groceries, errands)",
      description: "Small acts of neighborly kindness build community connection",
      emoji: "🏘️",
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      borderColor: "border-green-300",
      category: "Community"
    },
    {
      id: 2,
      title: "Donate to Those in Need",
      action: "Donate clothes, food, or time to a local organization",
      description: "Support community members who need assistance",
      emoji: "📦",
      color: "from-blue-400 to-indigo-500",
      bgColor: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-300",
      category: "Community"
    },
    {
      id: 3,
      title: "Call a Lonely Elder",
      action: "Call or visit an elderly person who might be lonely",
      description: "Companionship and connection make a real difference",
      emoji: "👴👵",
      color: "from-purple-400 to-violet-500",
      bgColor: "from-purple-50 to-violet-50",
      borderColor: "border-purple-300",
      category: "Community"
    },
    {
      id: 4,
      title: "Volunteer Your Time",
      action: "Volunteer at a community center, school, or local charity",
      description: "Give your time and skills to support others",
      emoji: "🤝",
      color: "from-pink-400 to-rose-500",
      bgColor: "from-pink-50 to-rose-50",
      borderColor: "border-pink-300",
      category: "Volunteering"
    },
    {
      id: 5,
      title: "Share a Meal",
      action: "Prepare or share a meal with someone in need",
      description: "Food brings people together and shows care",
      emoji: "🍽️",
      color: "from-amber-400 to-orange-500",
      bgColor: "from-amber-50 to-orange-50",
      borderColor: "border-amber-300",
      category: "Community"
    },
    {
      id: 6,
      title: "Support a Local Business",
      action: "Shop locally and support small business owners",
      description: "Your support helps neighbors and strengthens the community",
      emoji: "🏪",
      color: "from-cyan-400 to-teal-500",
      bgColor: "from-cyan-50 to-teal-50",
      borderColor: "border-cyan-300",
      category: "Community"
    },
    {
      id: 7,
      title: "Organize a Community Event",
      action: "Help organize or participate in a neighborhood gathering",
      description: "Bring people together for connection and fun",
      emoji: "🎉",
      color: "from-yellow-400 to-amber-500",
      bgColor: "from-yellow-50 to-amber-50",
      borderColor: "border-yellow-300",
      category: "Community"
    },
    {
      id: 8,
      title: "Offer a Ride",
      action: "Give someone a ride who needs transportation",
      description: "Help someone get where they need to go",
      emoji: "🚗",
      color: "from-red-400 to-pink-500",
      bgColor: "from-red-50 to-pink-50",
      borderColor: "border-red-300",
      category: "Community"
    },
    {
      id: 9,
      title: "Tutor or Mentor",
      action: "Offer tutoring or mentorship to someone",
      description: "Share knowledge and support someone's growth",
      emoji: "📚",
      color: "from-indigo-400 to-blue-500",
      bgColor: "from-indigo-50 to-blue-50",
      borderColor: "border-indigo-300",
      category: "Education"
    },
    {
      id: 10,
      title: "Clean Up Community Space",
      action: "Help clean up a park, beach, or neighborhood area",
      description: "Take care of shared spaces for everyone's benefit",
      emoji: "🌳",
      color: "from-emerald-400 to-green-500",
      bgColor: "from-emerald-50 to-green-50",
      borderColor: "border-emerald-300",
      category: "Environment"
    }
  ];

  const handleSelectTask = (taskId) => {
    if (selectedTasks.length >= 5 && !selectedTasks.includes(taskId)) {
      return; // Can only select 5
    }
    
    setSelectedTasks(prev => {
      if (prev.includes(taskId)) {
        // Deselect
        const newTasks = prev.filter(id => id !== taskId);
        // Remove reflection if it exists
        const newReflections = { ...taskReflections };
        delete newReflections[taskId];
        setTaskReflections(newReflections);
        return newTasks;
      } else {
        // Select (max 5)
        if (prev.length < 5) {
          return [...prev, taskId];
        }
        return prev;
      }
    });
  };

  const handleCompleteTask = (taskId) => {
    if (!selectedTasks.includes(taskId)) return;
    
    setCompletedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };

  const handleReflectionChange = (taskId, reflection) => {
    setTaskReflections(prev => ({
      ...prev,
      [taskId]: reflection
    }));
  };

  const handleFinish = () => {
    if (completedTasks.length > 0 && completedTasks.every(id => taskReflections[id]?.trim())) {
      setShowGameOver(true);
    }
  };

  const getSelectedTasksData = () => {
    return selectedTasks
      .map(id => allTasks.find(t => t.id === id))
      .filter(Boolean);
  };

  const completionRate = selectedTasks.length > 0 
    ? (completedTasks.length / selectedTasks.length) * 100 
    : 0;

  if (showGameOver) {
    const completedTasksData = completedTasks
      .map(id => allTasks.find(t => t.id === id))
      .filter(Boolean);

    return (
      <ParentGameShell
        title={gameData?.title || "Helping Hand Challenge"}
        subtitle="Challenge Complete!"
        showGameOver={true}
        score={completedTasks.length}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={completedTasks.length >= 1}
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
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Helping Hand Challenge Complete!</h2>
              <p className="text-lg text-gray-600 mb-6">
                You completed {completedTasks.length} act{completedTasks.length === 1 ? '' : 's'} of kindness!
              </p>
            </div>

            {/* Completed Tasks with Reflections */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Your Acts of Kindness
              </h3>
              <div className="space-y-6">
                {completedTasksData.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-gradient-to-br ${task.bgColor} rounded-xl p-6 border-2 ${task.borderColor}`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl">{task.emoji}</span>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-800">{task.title}</h4>
                        <p className="text-sm text-gray-700">{task.action}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    
                    {taskReflections[task.id] && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200 mt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Your Reflection:</p>
                        <p className="text-gray-800 italic leading-relaxed">"{taskReflections[task.id]}"</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-green-600" />
                Impact of Kindness
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Building Empathy:</strong> Acts of kindness build empathy by connecting you to others' experiences and needs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Modeling for Children:</strong> When children see you helping others, they learn empathy through observation, not just instruction.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Community Connection:</strong> Your acts of kindness strengthen community bonds and create a culture of care.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Shared Responsibility:</strong> When everyone contributes to community wellbeing, everyone benefits.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Children learn empathy best by seeing it, not hearing about it. When you actively help others in your community, your children witness empathy in action. They see you caring for neighbors, supporting those in need, and showing kindness to strangers. These experiences teach them more about empathy than any lecture ever could. Your actions become their blueprint for how to care for others and contribute to community wellbeing.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Helping Hand Challenge"}
      subtitle="Build Empathy Through Kindness"
      showGameOver={false}
      score={completedTasks.length}
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
            <div className="text-6xl mb-4">🤝</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Helping Hand Challenge</h2>
            <p className="text-gray-600 text-lg mb-2">
              Select and complete 1-5 acts of kindness in your community.
            </p>
            <p className="text-sm text-gray-500">
              Select {selectedTasks.length}/5 tasks
            </p>
          </div>

          {/* Selection Phase */}
          {selectedTasks.length < 5 ? (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Choose Your Acts of Kindness</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select 1-5 community kindness tasks you'd like to complete. After completing each task, you'll record a short reflection.
                </p>
              </div>

              {/* Task Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {allTasks.map((task) => {
                  const isSelected = selectedTasks.includes(task.id);
                  return (
                    <motion.button
                      key={task.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectTask(task.id)}
                      disabled={selectedTasks.length >= 5 && !isSelected}
                      className={`text-left p-5 rounded-xl border-2 transition-all ${
                        isSelected
                          ? `${task.bgColor} ${task.borderColor} border-4 shadow-lg`
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      } ${selectedTasks.length >= 5 && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{task.emoji}</span>
                          <div>
                            <h4 className="text-lg font-bold text-gray-800">{task.title}</h4>
                            <p className="text-xs text-gray-500">{task.category}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-gray-700 font-medium mb-2">{task.action}</p>
                      <p className="text-sm text-gray-600">{task.description}</p>
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
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Your Selected Tasks</h3>
                      <p className="text-sm text-gray-600">
                        Mark tasks as complete and write a short reflection
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{completedTasks.length}/{selectedTasks.length}</p>
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
                </div>

                {/* Selected Tasks to Complete */}
                <div className="space-y-6 mb-6">
                  {getSelectedTasksData().map((task) => {
                    const isCompleted = completedTasks.includes(task.id);
                    const reflection = taskReflections[task.id] || "";
                    
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-gradient-to-br ${task.bgColor} rounded-xl p-6 border-2 ${task.borderColor} ${isCompleted ? 'opacity-90' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4 flex-1">
                            <span className="text-4xl">{task.emoji}</span>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-gray-800 mb-1">{task.title}</h4>
                              <p className="text-gray-700 font-medium mb-1">{task.action}</p>
                              <p className="text-sm text-gray-600">{task.description}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleCompleteTask(task.id)}
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
                              {isCompleted ? 'Complete' : 'Mark Done'}
                            </span>
                          </div>
                        </div>

                        {/* Reflection */}
                        {isCompleted && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 pt-4 border-t border-gray-200"
                          >
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                              Short Reflection:
                            </label>
                            <textarea
                              value={reflection}
                              onChange={(e) => handleReflectionChange(task.id, e.target.value)}
                              placeholder="How did this act of kindness feel? What did you notice? How did it impact you or others?"
                              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:outline-none text-gray-800 min-h-[100px] resize-none"
                            />
                            <p className="text-xs text-gray-600 mt-2">
                              Reflect on your experience completing this act of kindness
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Finish Button */}
              {completedTasks.length > 0 && completedTasks.every(id => taskReflections[id]?.trim()) && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFinish}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Complete Challenge
                </motion.button>
              )}

              {completedTasks.length > 0 && !completedTasks.every(id => taskReflections[id]?.trim()) && (
                <div className="bg-yellow-100 rounded-lg p-4 border border-yellow-300 mb-4">
                  <p className="text-yellow-800 text-sm text-center">
                    Please complete reflections for all finished tasks to complete the challenge.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Children learn empathy best by seeing it, not hearing about it. When you actively help others in your community, your children witness empathy in action.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default HelpingHandChallenge;

