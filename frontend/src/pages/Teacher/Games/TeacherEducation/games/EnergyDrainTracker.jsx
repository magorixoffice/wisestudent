import React, { useState, useEffect } from "react";
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
  const totalLevels = gameData?.totalQuestions || 5; // Updated to 5 questions
  const activitiesPerQuestion = 12; // Number of activities per question
  
  // Define 5 different sets of activities for different learning themes
  const activitySets = [
    // Question 1: Work-related energy drains/fuels
    {
      title: "Work Energy Tracker",
      description: "Identify work-related tasks that emotionally drain or uplift you",
      activities: [
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
      ]
    },
    // Question 2: Personal life energy drains/fuels
    {
      title: "Personal Life Energy Tracker",
      description: "Identify personal activities that emotionally drain or uplift you",
      activities: [
        { id: 13, text: "House cleaning", category: null, isDrain: true },
        { id: 14, text: "Spending time with family", category: null, isDrain: false },
        { id: 15, text: "Running errands", category: null, isDrain: true },
        { id: 16, text: "Cooking favorite meals", category: null, isDrain: false },
        { id: 17, text: "Managing finances", category: null, isDrain: true },
        { id: 18, text: "Reading books", category: null, isDrain: false },
        { id: 19, text: "Doing laundry", category: null, isDrain: true },
        { id: 20, text: "Taking relaxing baths", category: null, isDrain: false },
        { id: 21, text: "Shopping", category: null, isDrain: true },
        { id: 22, text: "Watching favorite movies", category: null, isDrain: false },
        { id: 23, text: "Dealing with car maintenance", category: null, isDrain: true },
        { id: 24, text: "Practicing meditation", category: null, isDrain: false }
      ]
    },
    // Question 3: Social interactions energy tracker
    {
      title: "Social Energy Tracker",
      description: "Identify social interactions that emotionally drain or uplift you",
      activities: [
        { id: 25, text: "Attending parties", category: null, isDrain: true },
        { id: 26, text: "One-on-one coffee chats", category: null, isDrain: false },
        { id: 27, text: "Large group gatherings", category: null, isDrain: true },
        { id: 28, text: "Deep conversations with close friends", category: null, isDrain: false },
        { id: 29, text: "Networking events", category: null, isDrain: true },
        { id: 30, text: "Family dinners", category: null, isDrain: false },
        { id: 31, text: "Dealing with toxic people", category: null, isDrain: true },
        { id: 32, text: "Supportive friendships", category: null, isDrain: false },
        { id: 33, text: "Attending lectures", category: null, isDrain: true },
        { id: 34, text: "Volunteering for causes", category: null, isDrain: false },
        { id: 35, text: "Conflict resolution", category: null, isDrain: true },
        { id: 36, text: "Team collaboration", category: null, isDrain: false }
      ]
    },
    // Question 4: Health and wellness energy tracker
    {
      title: "Health & Wellness Energy Tracker",
      description: "Identify health habits that emotionally drain or uplift you",
      activities: [
        { id: 37, text: "Skipping workouts", category: null, isDrain: true },
        { id: 38, text: "Regular exercise", category: null, isDrain: false },
        { id: 39, text: "Poor sleep schedule", category: null, isDrain: true },
        { id: 40, text: "Consistent sleep routine", category: null, isDrain: false },
        { id: 41, text: "Eating processed foods", category: null, isDrain: true },
        { id: 42, text: "Preparing healthy meals", category: null, isDrain: false },
        { id: 43, text: "Neglecting self-care", category: null, isDrain: true },
        { id: 44, text: "Self-care rituals", category: null, isDrain: false },
        { id: 45, text: "Staying up late", category: null, isDrain: true },
        { id: 46, text: "Morning meditation", category: null, isDrain: false },
        { id: 47, text: "Avoiding medical appointments", category: null, isDrain: true },
        { id: 48, text: "Regular health checkups", category: null, isDrain: false }
      ]
    },
    // Question 5: Professional growth energy tracker
    {
      title: "Professional Growth Energy Tracker",
      description: "Identify professional activities that emotionally drain or uplift you",
      activities: [
        { id: 49, text: "Job hunting stress", category: null, isDrain: true },
        { id: 50, text: "Learning new skills", category: null, isDrain: false },
        { id: 51, text: "Office politics", category: null, isDrain: true },
        { id: 52, text: "Achieving goals", category: null, isDrain: false },
        { id: 53, text: "Unfair treatment at work", category: null, isDrain: true },
        { id: 54, text: "Receiving recognition", category: null, isDrain: false },
        { id: 55, text: "Unclear expectations", category: null, isDrain: true },
        { id: 56, text: "Career advancement", category: null, isDrain: false },
        { id: 57, text: "Micromanagement", category: null, isDrain: true },
        { id: 58, text: "Mentoring others", category: null, isDrain: false },
        { id: 59, text: "Workplace conflicts", category: null, isDrain: true },
        { id: 60, text: "Professional achievements", category: null, isDrain: false }
      ]
    }
  ];
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [activities, setActivities] = useState(activitySets[0].activities);
  const [scores, setScores] = useState(Array(totalLevels).fill(0));
  const [draggedItem, setDraggedItem] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Update activities when question changes
  useEffect(() => {
    setActivities(activitySets[currentQuestion].activities);
    setShowSummary(false);
  }, [currentQuestion]);

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
      // Calculate score for current question: 1 point if all activities are correctly categorized
      let allCorrect = true;
      activities.forEach(activity => {
        const isCorrect = (activity.category === 'drain' && activity.isDrain) || 
                         (activity.category === 'fuel' && !activity.isDrain);
        if (!isCorrect) {
          allCorrect = false;
        }
      });
      
      // Update scores array for current question - 1 point if all correct, 0 otherwise
      const newScores = [...scores];
      newScores[currentQuestion] = allCorrect ? 1 : 0;
      setScores(newScores);
      
      const totalScore = newScores.reduce((sum, questionScore) => sum + questionScore, 0);
      setScore(totalScore);
      setShowSummary(true);
    }
  };

  const handleNextQuestion = () => {
    // Calculate score for current question if not already calculated
    if (!showSummary) {
      const allSorted = activities.every(a => a.category !== null);
      if (allSorted) {
        // Calculate score for current question: 1 point if all activities are correctly categorized
        let allCorrect = true;
        activities.forEach(activity => {
          const isCorrect = (activity.category === 'drain' && activity.isDrain) || 
                           (activity.category === 'fuel' && !activity.isDrain);
          if (!isCorrect) {
            allCorrect = false;
          }
        });
        
        // Update scores array for current question - 1 point if all correct, 0 otherwise
        const newScores = [...scores];
        newScores[currentQuestion] = allCorrect ? 1 : 0;
        setScores(newScores);
        
        const totalScore = newScores.reduce((sum, questionScore) => sum + questionScore, 0);
        setScore(totalScore);
      }
    }
    
    if (currentQuestion < totalLevels - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowSummary(false);
    } else {
      // All questions completed
      const totalScore = scores.reduce((sum, questionScore) => sum + questionScore, 0);
      setScore(totalScore);
      setShowGameOver(true);
    }
  };

  const handleComplete = () => {
    // Calculate total score from all questions
    const totalScore = scores.reduce((sum, questionScore) => sum + questionScore, 0);
    setScore(totalScore);
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
      title={activitySets[currentQuestion]?.title || gameData?.title || "Energy Drain Tracker"}
      subtitle={activitySets[currentQuestion]?.description || gameData?.description || "Identify people and tasks that emotionally drain or uplift"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentQuestion + 0}
    >
      <div className="w-full max-w-6xl mx-auto px-4">
        {!showSummary ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Question {currentQuestion + 1}: Sort Activities: Drains Me vs Fuels Me
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
              Question {currentQuestion + 1} Energy Balance Summary
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
                <li>• Awareness of your energy patterns helps you plan your {currentQuestion === 0 ? 'workday' : currentQuestion === 1 ? 'personal time' : currentQuestion === 2 ? 'social interactions' : currentQuestion === 3 ? 'health habits' : 'professional activities'} more effectively</li>
                <li>• Consider scheduling fueling activities after draining ones to restore your energy</li>
              </ul>
            </div>

            {/* Custom Tip based on question theme */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-2">
                    💡 {activitySets[currentQuestion]?.title} Tip:
                  </p>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {currentQuestion === 0 && "Schedule \"fuel\" tasks after emotional ones. After completing draining activities (like parent conferences or dealing with difficult situations), intentionally schedule a fueling activity (like teaching an engaging lesson or collaborating with colleagues). This helps restore your energy and prevents burnout. For example, if you have a challenging parent meeting in the morning, schedule a creative teaching activity or student success moment in the afternoon. This pattern of \"drain then fuel\" helps maintain your energy balance throughout the day."}
                    {currentQuestion === 1 && "Balance your personal activities to maintain energy. After completing draining tasks like house cleaning or running errands, schedule uplifting activities like spending time with family or enjoying your favorite hobbies. This creates a sustainable rhythm in your personal life."}
                    {currentQuestion === 2 && "Manage your social energy by balancing draining interactions with energizing ones. If you have to attend a large gathering or networking event (draining), plan a recharging activity afterward like a one-on-one conversation with a close friend or some quiet time alone."}
                    {currentQuestion === 3 && "Prioritize health habits that fuel rather than drain you. Consistent sleep routines, regular exercise, and healthy eating habits will sustain your energy levels better than neglecting self-care. Make time for self-care rituals that recharge you mentally and physically."}
                    {currentQuestion === 4 && "In your professional life, seek opportunities that energize you while minimizing exposure to energy drains. Pursue learning new skills, achieving goals, and mentoring others, while setting boundaries with office politics and micromanagement to preserve your professional energy."}
                  </p>
                </div>
              </div>
            </div>

            {/* Next Question or Complete Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {currentQuestion < totalLevels - 1 ? 'Next Question' : 'Complete Activity'}
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default EnergyDrainTracker;

