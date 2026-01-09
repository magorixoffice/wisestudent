import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Battery, BatteryLow, Zap, CheckCircle, AlertCircle, GripVertical } from "lucide-react";

const EnergyDrainTracker = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-24";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [activities, setActivities] = useState([
    { id: 1, text: "Grading papers", category: null, isDrain: true },
    { id: 2, text: "Parent-teacher conferences", category: null, isDrain: true },
    { id: 3, text: "Dealing with disruptive students", category: null, isDrain: true },
    { id: 4, text: "Administrative paperwork", category: null, isDrain: true },
    { id: 5, text: "Staff meetings", category: null, isDrain: true },
    { id: 6, text: "Lesson planning", category: null, isDrain: false },
    { id: 7, text: "Teaching engaging lessons", category: null, isDrain: false },
    { id: 8, text: "Student success moments", category: null, isDrain: false },
    { id: 9, text: "Collaborative planning with colleagues", category: null, isDrain: false },
    { id: 10, text: "Creative teaching activities", category: null, isDrain: false },
    { id: 11, text: "Supporting struggling students", category: null, isDrain: true },
    { id: 12, text: "Professional development workshops", category: null, isDrain: false }
  ]);
  
  const [draggedItem, setDraggedItem] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const handleDragStart = (e, activityId) => {
    setDraggedItem(activityId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", activityId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, category) => {
    e.preventDefault();
    if (!draggedItem) return;

    setActivities(prev => prev.map(activity => 
      activity.id === draggedItem 
        ? { ...activity, category }
        : activity
    ));
    setDraggedItem(null);
  };

  const handleRemoveFromCategory = (activityId) => {
    setActivities(prev => prev.map(activity => 
      activity.id === activityId 
        ? { ...activity, category: null }
        : activity
    ));
  };

  const handleShowSummary = () => {
    const allSorted = activities.every(a => a.category !== null);
    if (allSorted) {
      // Calculate score based on correct categorization
      let correctCount = 0;
      activities.forEach(activity => {
        const isCorrect = (activity.category === 'drain' && activity.isDrain) || 
                         (activity.category === 'fuel' && !activity.isDrain);
        if (isCorrect) correctCount++;
      });
      setScore(correctCount);
      setShowSummary(true);
    }
  };

  const handleComplete = () => {
    setShowGameOver(true);
  };

  const drainActivities = activities.filter(a => a.category === 'drain');
  const fuelActivities = activities.filter(a => a.category === 'fuel');
  const unsortedActivities = activities.filter(a => a.category === null);
  const allSorted = activities.every(a => a.category !== null);

  // Calculate energy balance
  const drainCount = drainActivities.length;
  const fuelCount = fuelActivities.length;
  const balance = fuelCount - drainCount;
  const balancePercentage = activities.length > 0 
    ? Math.round((fuelCount / activities.length) * 100) 
    : 0;

  return (
    <TeacherGameShell
      title={gameData?.title || "Energy Drain Tracker"}
      subtitle={gameData?.description || "Identify people and tasks that emotionally drain or uplift"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={1}
    >
      <div className="w-full max-w-6xl mx-auto px-4">
        {!showSummary ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Sort Activities: Drains Me vs Fuels Me
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Drag and drop each activity into the category that best describes how it affects your energy
            </p>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Drains Me Column */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'drain')}
                className={`min-h-[400px] rounded-xl border-2 border-dashed p-6 transition-all ${
                  draggedItem ? 'border-red-400 bg-red-50' : 'border-red-300 bg-red-50/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <BatteryLow className="w-8 h-8 text-red-600" />
                  <h3 className="text-xl font-bold text-red-800">
                    Drains Me
                  </h3>
                  <span className="ml-auto bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {drainActivities.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {drainActivities.map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 bg-white rounded-lg p-3 border-2 border-red-200 shadow-sm"
                    >
                      <GripVertical className="w-5 h-5 text-gray-400" />
                      <span className="flex-1 text-gray-800 font-medium">{activity.text}</span>
                      <button
                        onClick={() => handleRemoveFromCategory(activity.id)}
                        className="text-red-500 hover:text-red-700 text-xl font-bold"
                      >
                        ×
                      </button>
                    </motion.div>
                  ))}
                  {drainActivities.length === 0 && (
                    <p className="text-gray-500 text-center py-8 italic">
                      Drop draining activities here
                    </p>
                  )}
                </div>
              </div>

              {/* Fuels Me Column */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'fuel')}
                className={`min-h-[400px] rounded-xl border-2 border-dashed p-6 transition-all ${
                  draggedItem ? 'border-green-400 bg-green-50' : 'border-green-300 bg-green-50/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                  <h3 className="text-xl font-bold text-green-800">
                    Fuels Me
                  </h3>
                  <span className="ml-auto bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {fuelActivities.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {fuelActivities.map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 bg-white rounded-lg p-3 border-2 border-green-200 shadow-sm"
                    >
                      <GripVertical className="w-5 h-5 text-gray-400" />
                      <span className="flex-1 text-gray-800 font-medium">{activity.text}</span>
                      <button
                        onClick={() => handleRemoveFromCategory(activity.id)}
                        className="text-green-500 hover:text-green-700 text-xl font-bold"
                      >
                        ×
                      </button>
                    </motion.div>
                  ))}
                  {fuelActivities.length === 0 && (
                    <p className="text-gray-500 text-center py-8 italic">
                      Drop fueling activities here
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Unsorted Activities */}
            {unsortedActivities.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Activities to Sort ({unsortedActivities.length} remaining)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {unsortedActivities.map((activity) => (
                    <motion.div
                      key={activity.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, activity.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-4 cursor-move hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-800">{activity.text}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Show Summary Button */}
            {allSorted && (
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShowSummary}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  View Energy Balance Summary
                </motion.button>
              </div>
            )}
          </div>
        ) : (
          /* Energy Balance Summary */
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Your Energy Balance Summary
            </h2>

            {/* Balance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200">
                <div className="flex items-center gap-4 mb-4">
                  <BatteryLow className="w-12 h-12 text-red-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-red-800">Drains Me</h3>
                    <p className="text-3xl font-bold text-red-600">{drainCount} activities</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {drainActivities.map((activity) => (
                    <div key={activity.id} className="bg-white rounded-lg p-2 text-sm text-gray-700">
                      • {activity.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <div className="flex items-center gap-4 mb-4">
                  <Zap className="w-12 h-12 text-green-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-green-800">Fuels Me</h3>
                    <p className="text-3xl font-bold text-green-600">{fuelCount} activities</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {fuelActivities.map((activity) => (
                    <div key={activity.id} className="bg-white rounded-lg p-2 text-sm text-gray-700">
                      • {activity.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Balance Analysis */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Energy Balance Analysis</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700">Fueling Activities</span>
                    <span className="font-bold text-blue-600">{balancePercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${balancePercentage}%` }}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700">Draining Activities</span>
                    <span className="font-bold text-red-600">{100 - balancePercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - balancePercentage}%` }}
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-4 rounded-full"
                    />
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-700">
                    <strong>Balance Score:</strong> {balance > 0 ? `+${balance}` : balance} activities
                    {balance > 0 
                      ? " - You have more fueling than draining activities! This is a positive energy balance."
                      : balance < 0
                      ? " - You have more draining than fueling activities. Consider ways to increase fueling activities or reduce draining ones."
                      : " - Your energy balance is even. Consider adding more fueling activities to boost your energy."}
                  </p>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200 mb-6">
              <h3 className="text-lg font-bold text-amber-900 mb-3">💡 Key Insights</h3>
              <ul className="space-y-2 text-amber-800">
                <li>• You identified {drainCount} activities that drain your energy</li>
                <li>• You identified {fuelCount} activities that fuel your energy</li>
                <li>• Awareness of your energy patterns helps you plan your day more effectively</li>
                <li>• Consider scheduling fueling activities after draining ones to restore your energy</li>
              </ul>
            </div>

            {/* Teacher Tip */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Schedule "fuel" tasks after emotional ones. After completing draining activities (like parent conferences or dealing with difficult situations), intentionally schedule a fueling activity (like teaching an engaging lesson or collaborating with colleagues). This helps restore your energy and prevents burnout. For example, if you have a challenging parent meeting in the morning, schedule a creative teaching activity or student success moment in the afternoon. This pattern of "drain then fuel" helps maintain your energy balance throughout the day.
                  </p>
                </div>
              </div>
            </div>

            {/* Complete Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Complete Activity
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default EnergyDrainTracker;

