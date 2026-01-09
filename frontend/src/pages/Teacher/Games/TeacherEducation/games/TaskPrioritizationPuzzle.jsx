import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Clock, Star, Pause, AlertCircle, CheckCircle, GripVertical, TrendingUp } from "lucide-react";

const TaskPrioritizationPuzzle = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-34";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [tasks, setTasks] = useState([
    { id: 1, text: "Marking student assignments due tomorrow", correctCategory: 'urgent', icon: '📝', explanation: "Urgent - Has a deadline and needs immediate attention." },
    { id: 2, text: "Getting 8 hours of sleep tonight", correctCategory: 'important', icon: '😴', explanation: "Important - Essential for health and wellbeing, but sleep can't be 'done' immediately. This is about prioritizing sleep time, which is always important." },
    { id: 3, text: "Lesson plan for next week's classes", correctCategory: 'important', icon: '📚', explanation: "Important - Critical for effective teaching, but not urgent if it's for next week. Planning ahead is important but doesn't need immediate action." },
    { id: 4, text: "Return parent phone call from this morning", correctCategory: 'urgent', icon: '📞', explanation: "Urgent - Parent communication typically needs timely response, especially when they called this morning. Should be addressed soon." },
    { id: 5, text: "Organize filing cabinet", correctCategory: 'can-wait', icon: '📁', explanation: "Can Wait - Organizational tasks can be postponed without immediate consequences. Important for efficiency but not urgent." },
    { id: 6, text: "Student having behavioral crisis right now", correctCategory: 'urgent', icon: '🚨', explanation: "Urgent - A current crisis needs immediate attention. This is both urgent and important, but categorized as urgent because it requires immediate action." },
    { id: 7, text: "Professional development workshop next month", correctCategory: 'can-wait', icon: '🎓', explanation: "Can Wait - Future professional development can be planned for later. Not urgent if it's next month." },
    { id: 8, text: "Grading papers from last week", correctCategory: 'important', icon: '✏️', explanation: "Important - Grading is important for student feedback, but if it's from last week, it's no longer urgent. Still important to complete but can be scheduled." },
    { id: 9, text: "Email from administrator requiring immediate response", correctCategory: 'urgent', icon: '📧', explanation: "Urgent - Administrative requests requiring immediate response need urgent attention, especially from leadership." },
    { id: 10, text: "Update classroom bulletin board", correctCategory: 'can-wait', icon: '📌', explanation: "Can Wait - Decor and display updates enhance the environment but aren't urgent. Can be done when there's available time." },
    { id: 11, text: "Student evaluation and progress tracking", correctCategory: 'important', icon: '📊', explanation: "Important - Tracking student progress is essential for teaching effectiveness, but doesn't need immediate action. Can be scheduled during planning time." },
    { id: 12, text: "Prepare materials for tomorrow's science experiment", correctCategory: 'urgent', icon: '🧪', explanation: "Urgent - Materials needed for tomorrow's lesson require immediate preparation. This directly impacts tomorrow's teaching." }
  ]);
  
  const [draggedItem, setDraggedItem] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [feedbackTasks, setFeedbackTasks] = useState([]);

  const categories = [
    { 
      id: 'urgent', 
      label: 'Urgent', 
      icon: Clock, 
      color: 'from-red-500 to-rose-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      description: 'Needs immediate attention - Do First'
    },
    { 
      id: 'important', 
      label: 'Important', 
      icon: Star, 
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      description: 'Matters significantly - Schedule'
    },
    { 
      id: 'can-wait', 
      label: 'Can Wait', 
      icon: Pause, 
      color: 'from-gray-500 to-slate-500',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-300',
      description: 'Can be postponed - Eliminate or Delegate'
    }
  ];

  const handleDragStart = (e, taskId) => {
    setDraggedItem(taskId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, category) => {
    e.preventDefault();
    if (!draggedItem) return;

    setTasks(prev => prev.map(task => 
      task.id === draggedItem 
        ? { ...task, category }
        : task
    ));
    setDraggedItem(null);
  };

  const handleRemoveFromCategory = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, category: null }
        : task
    ));
  };

  const handleShowFeedback = () => {
    const allSorted = tasks.every(t => t.category !== null);
    if (allSorted) {
      // Calculate feedback for each task
      const feedback = tasks.map(task => ({
        ...task,
        isCorrect: task.category === task.correctCategory,
        userCategory: task.category
      }));
      
      // Calculate score
      const correctCount = feedback.filter(f => f.isCorrect).length;
      setScore(correctCount);
      setFeedbackTasks(feedback);
      setShowFeedback(true);
    }
  };

  const handleComplete = () => {
    setShowGameOver(true);
  };

  const urgentTasks = tasks.filter(t => t.category === 'urgent');
  const importantTasks = tasks.filter(t => t.category === 'important');
  const canWaitTasks = tasks.filter(t => t.category === 'can-wait');
  const unsortedTasks = tasks.filter(t => t.category === null);
  const allSorted = tasks.every(t => t.category !== null);

  return (
    <TeacherGameShell
      title={gameData?.title || "Task Prioritization Puzzle"}
      subtitle={gameData?.description || "Learn to separate urgent vs important tasks"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={1}
    >
      <div className="w-full max-w-6xl mx-auto px-4">
        {!showFeedback ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Task Prioritization Puzzle
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Drag and drop each task into the category that best describes its priority
            </p>

            {/* Category Headers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {categories.map((category) => {
                const Icon = category.icon;
                const taskCount = tasks.filter(t => t.category === category.id).length;
                return (
                  <div
                    key={category.id}
                    className={`${category.bgColor} border-2 ${category.borderColor} rounded-xl p-4`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`w-6 h-6 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`} />
                      <h3 className={`text-lg font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                        {category.label}
                      </h3>
                      <span className={`ml-auto bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-semibold border-2 ${category.borderColor}`}>
                        {taskCount}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{category.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Three Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Urgent Column */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'urgent')}
                className={`min-h-[400px] rounded-xl border-2 border-dashed p-4 transition-all ${
                  draggedItem ? 'border-red-400 bg-red-50' : 'border-red-300 bg-red-50/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-bold text-red-800">Urgent</h3>
                </div>
                <div className="space-y-2">
                  {urgentTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 bg-white rounded-lg p-3 border-2 border-red-200 shadow-sm"
                    >
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span className="text-2xl">{task.icon}</span>
                      <span className="flex-1 text-sm text-gray-800 font-medium">{task.text}</span>
                      <button
                        onClick={() => handleRemoveFromCategory(task.id)}
                        className="text-red-500 hover:text-red-700 text-lg font-bold"
                      >
                        ×
                      </button>
                    </motion.div>
                  ))}
                  {urgentTasks.length === 0 && (
                    <p className="text-gray-500 text-center py-8 text-sm italic">
                      Drop urgent tasks here
                    </p>
                  )}
                </div>
              </div>

              {/* Important Column */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'important')}
                className={`min-h-[400px] rounded-xl border-2 border-dashed p-4 transition-all ${
                  draggedItem ? 'border-blue-400 bg-blue-50' : 'border-blue-300 bg-blue-50/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-blue-800">Important</h3>
                </div>
                <div className="space-y-2">
                  {importantTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 bg-white rounded-lg p-3 border-2 border-blue-200 shadow-sm"
                    >
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span className="text-2xl">{task.icon}</span>
                      <span className="flex-1 text-sm text-gray-800 font-medium">{task.text}</span>
                      <button
                        onClick={() => handleRemoveFromCategory(task.id)}
                        className="text-blue-500 hover:text-blue-700 text-lg font-bold"
                      >
                        ×
                      </button>
                    </motion.div>
                  ))}
                  {importantTasks.length === 0 && (
                    <p className="text-gray-500 text-center py-8 text-sm italic">
                      Drop important tasks here
                    </p>
                  )}
                </div>
              </div>

              {/* Can Wait Column */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'can-wait')}
                className={`min-h-[400px] rounded-xl border-2 border-dashed p-4 transition-all ${
                  draggedItem ? 'border-gray-400 bg-gray-50' : 'border-gray-300 bg-gray-50/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Pause className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-bold text-gray-800">Can Wait</h3>
                </div>
                <div className="space-y-2">
                  {canWaitTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 bg-white rounded-lg p-3 border-2 border-gray-200 shadow-sm"
                    >
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span className="text-2xl">{task.icon}</span>
                      <span className="flex-1 text-sm text-gray-800 font-medium">{task.text}</span>
                      <button
                        onClick={() => handleRemoveFromCategory(task.id)}
                        className="text-gray-500 hover:text-gray-700 text-lg font-bold"
                      >
                        ×
                      </button>
                    </motion.div>
                  ))}
                  {canWaitTasks.length === 0 && (
                    <p className="text-gray-500 text-center py-8 text-sm italic">
                      Drop tasks that can wait here
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Unsorted Tasks */}
            {unsortedTasks.length > 0 && (
              <div className="bg-gray-100 rounded-xl p-6 border-2 border-gray-300 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Tasks to Sort:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {unsortedTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      whileHover={{ scale: 1.02 }}
                      whileDrag={{ scale: 1.1, rotate: 5 }}
                      className="flex items-center gap-2 bg-white rounded-lg p-3 border-2 border-gray-300 shadow-sm cursor-move hover:shadow-md transition-all"
                    >
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span className="text-xl">{task.icon}</span>
                      <span className="flex-1 text-sm text-gray-800 font-medium">{task.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            {allSorted && (
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShowFeedback}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  View Feedback
                </motion.button>
              </div>
            )}
          </div>
        ) : (
          /* Feedback Screen */
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Prioritization Feedback
                </h2>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 max-w-md mx-auto">
                  <p className="text-2xl font-bold text-purple-800 mb-2">
                    Score: {score} / {tasks.length}
                  </p>
                  <p className="text-lg text-gray-700">
                    {score >= 10
                      ? "Excellent! You have a strong understanding of task prioritization."
                      : score >= 7
                      ? "Good job! You're developing strong prioritization skills."
                      : "Nice effort! Keep practicing to improve your prioritization skills."}
                  </p>
                </div>
              </div>

              {/* Task Feedback */}
              <div className="space-y-4 mb-6">
                {feedbackTasks.map((task, index) => {
                  const category = categories.find(c => c.id === task.userCategory);
                  const correctCategory = categories.find(c => c.id === task.correctCategory);
                  const Icon = category.icon;
                  
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border-2 ${
                        task.isCorrect
                          ? 'bg-green-50 border-green-300'
                          : 'bg-yellow-50 border-yellow-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {task.isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{task.icon}</span>
                            <p className="font-semibold text-gray-800">{task.text}</p>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-sm px-2 py-1 rounded ${
                              task.isCorrect
                                ? 'bg-green-200 text-green-800'
                                : 'bg-yellow-200 text-yellow-800'
                            }`}>
                              Your choice: {category.label}
                            </span>
                            {!task.isCorrect && (
                              <span className="text-sm px-2 py-1 rounded bg-blue-200 text-blue-800">
                                Suggested: {correctCategory.label}
                              </span>
                            )}
                          </div>
                          <div className={`bg-white rounded-lg p-3 border-l-4 ${
                            task.isCorrect ? 'border-green-500' : 'border-yellow-500'
                          }`}>
                            <p className="text-sm text-gray-700">
                              {task.isCorrect ? (
                                <span className="text-green-800 font-semibold">✓ Correct! </span>
                              ) : (
                                <span className="text-yellow-800 font-semibold">💡 Consider: </span>
                              )}
                              {task.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Summary Insights */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Prioritization Insights:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-gray-800">Urgent Tasks</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{urgentTasks.length}</p>
                    <p className="text-xs text-gray-600 mt-1">Do First</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-800">Important Tasks</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{importantTasks.length}</p>
                    <p className="text-xs text-gray-600 mt-1">Schedule</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Pause className="w-5 h-5 text-gray-600" />
                      <span className="font-semibold text-gray-800">Can Wait</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-600">{canWaitTasks.length}</p>
                    <p className="text-xs text-gray-600 mt-1">Eliminate or Delegate</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleComplete}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Complete
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

        {showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-6xl mb-6"
            >
              {score >= 10 ? '🎯' : score >= 7 ? '✨' : '💪'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Puzzle Complete!
            </h2>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
              <p className="text-xl text-gray-700 leading-relaxed">
                {score >= 10
                  ? "Excellent! You have a strong understanding of task prioritization. You can effectively distinguish between urgent, important, and tasks that can wait."
                  : score >= 7
                  ? "Good job! You're developing strong prioritization skills. Continue practicing to refine your ability to separate urgent from important tasks."
                  : "Nice effort! Task prioritization is a skill that improves with practice. Review the feedback to better understand the difference between urgent and important tasks."}
              </p>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Use Eisenhower Matrix poster in staff rooms. The Eisenhower Matrix is a powerful tool for task prioritization that helps separate urgent tasks from important ones. Display a visual poster in staff rooms with four quadrants: "Urgent & Important (Do First)", "Important but Not Urgent (Schedule)", "Urgent but Not Important (Delegate)", and "Neither Urgent nor Important (Eliminate)". This creates a shared language for prioritization and helps teachers make better decisions about where to focus their energy. Use this framework regularly to evaluate your tasks. Many teachers struggle because they treat everything as urgent. The matrix helps you realize that many 'important' tasks don't need immediate action and can be scheduled, preventing the constant feeling of urgency that leads to burnout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default TaskPrioritizationPuzzle;

