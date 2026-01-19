import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Moon, Heart, TreePine, Users, Dumbbell, Calendar, Bell, CheckCircle, Download, Share2, AlertCircle } from "lucide-react";

const WeekendRechargePlan = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-35";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [step, setStep] = useState('select'); // 'select', 'calendar', 'complete'
  const [selectedActivities, setSelectedActivities] = useState({
    rest: null,
    joy: null,
    nature: null,
    connection: null,
    movement: null
  });
  const [reminderSet, setReminderSet] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // Activity options by category
  const activities = {
    rest: [
      { id: 1, name: 'Sleep in', icon: '😴', description: 'Allow yourself to wake naturally without an alarm' },
      { id: 2, name: 'Nap time', icon: '💤', description: 'Take a refreshing afternoon nap' },
      { id: 3, name: 'Reading in bed', icon: '📖', description: 'Cozy up with a good book' },
      { id: 4, name: 'Meditation', icon: '🧘', description: 'Practice mindfulness or guided meditation' },
      { id: 5, name: 'Warm bath', icon: '🛁', description: 'Take a relaxing, warm bath with candles' },
      { id: 6, name: 'Massage', icon: '💆', description: 'Book a massage or self-massage session' },
      { id: 7, name: 'Yoga', icon: '🧘‍♀️', description: 'Gentle stretching or restorative yoga' },
      { id: 8, name: 'Listening to music', icon: '🎵', description: 'Listen to calming or favorite music' }
    ],
    joy: [
      { id: 1, name: 'Coffee with friend', icon: '☕', description: 'Meet a friend for coffee and conversation' },
      { id: 2, name: 'Watch a movie', icon: '🎬', description: 'Enjoy a favorite film or new release' },
      { id: 3, name: 'Creative hobby', icon: '🎨', description: 'Painting, crafting, or creative expression' },
      { id: 4, name: 'Dance party', icon: '💃', description: 'Put on music and dance freely' },
      { id: 5, name: 'Cook favorite meal', icon: '🍳', description: 'Prepare and enjoy a special meal' },
      { id: 6, name: 'Play games', icon: '🎮', description: 'Board games, puzzles, or video games' },
      { id: 7, name: 'Listen to podcasts', icon: '🎧', description: 'Catch up on favorite podcasts' },
      { id: 8, name: 'Photography', icon: '📸', description: 'Take photos of things that bring joy' }
    ],
    nature: [
      { id: 1, name: 'Morning walk', icon: '🚶', description: 'Early morning walk in nature' },
      { id: 2, name: 'Park visit', icon: '🌳', description: 'Spend time in a local park' },
      { id: 3, name: 'Garden time', icon: '🌱', description: 'Tend to plants or start a garden' },
      { id: 4, name: 'Beach or lake', icon: '🌊', description: 'Visit beach, lake, or water body' },
      { id: 5, name: 'Hiking', icon: '⛰️', description: 'Go for a nature hike or trail walk' },
      { id: 6, name: 'Outdoor reading', icon: '📚', description: 'Read a book outside in nature' },
      { id: 7, name: 'Sunrise/sunset', icon: '🌅', description: 'Watch sunrise or sunset' },
      { id: 8, name: 'Bird watching', icon: '🦅', description: 'Observe birds and wildlife' }
    ],
    connection: [
      { id: 1, name: 'Family dinner', icon: '🍽️', description: 'Share a meal with family members without distractions' },
      { id: 2, name: 'Video call with friends', icon: '📱', description: 'Connect with distant friends or relatives' },
      { id: 3, name: 'Community event', icon: '👥', description: 'Attend a local community gathering or event' },
      { id: 4, name: 'Game night', icon: '🎲', description: 'Host or join a fun game night with loved ones' },
      { id: 5, name: 'Coffee date', icon: '☕', description: 'Meet someone special for quality time together' },
      { id: 6, name: 'Volunteer work', icon: '🤝', description: 'Give back to community and meet like-minded people' },
      { id: 7, name: 'Support group', icon: '🤗', description: 'Join a group focused on shared interests or challenges' },
      { id: 8, name: 'Neighborhood walk', icon: '🚶‍♂️', description: 'Take a walk and greet neighbors in your area' }
    ],
    movement: [
      { id: 1, name: 'Brisk walk', icon: '🚶‍♂️', description: 'Take a purposeful walk to get your blood flowing' },
      { id: 2, name: 'Bike ride', icon: '🚴', description: 'Enjoy the outdoors while getting exercise' },
      { id: 3, name: 'Dancing', icon: '💃', description: 'Move to music for fun and fitness' },
      { id: 4, name: 'Swimming', icon: '🏊', description: 'Enjoy a full-body workout in the water' },
      { id: 5, name: 'Sports activity', icon: '⚽', description: 'Play a sport you enjoy with friends' },
      { id: 6, name: 'Stretching routine', icon: '🤸', description: 'Improve flexibility and reduce tension' },
      { id: 7, name: 'Stairs workout', icon: '🏃', description: 'Use stairs for a quick cardio session' },
      { id: 8, name: 'Gym session', icon: '💪', description: 'Hit the gym for strength or cardio training' }
    ]
  };

  const categories = [
    { 
      id: 'rest', 
      label: 'Rest', 
      icon: Moon, 
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-300',
      description: 'Activities that restore and relax your body and mind'
    },
    { 
      id: 'joy', 
      label: 'Joy', 
      icon: Heart, 
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-300',
      description: 'Activities that bring happiness and fulfillment'
    },
    { 
      id: 'nature', 
      label: 'Nature', 
      icon: TreePine, 
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      description: 'Activities that connect you with the natural world'
    },
    { 
      id: 'connection', 
      label: 'Connection', 
      icon: Users, 
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      description: 'Activities that strengthen relationships and social bonds'
    },
    { 
      id: 'movement', 
      label: 'Movement', 
      icon: Dumbbell, 
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300',
      description: 'Activities that get your body moving and energized'
    }
  ];

  const handleActivitySelect = (categoryId, activity) => {
    setSelectedActivities(prev => ({
      ...prev,
      [categoryId]: activity
    }));
  };

  const handleContinueToCalendar = () => {
    if (!selectedActivities.rest || !selectedActivities.joy || !selectedActivities.nature || !selectedActivities.connection || !selectedActivities.movement) {
      alert('Please select one activity from each category (Rest, Joy, Nature, Connection, Movement) to continue.');
      return;
    }
    setStep('calendar');
  };

  const handleSaveToCalendar = () => {
    setShowCalendarModal(true);
    setReminderSet(true);
    
    // Calculate score based on number of categories selected (1 point per category, max 5)
    let calculatedScore = 0;
    if (selectedActivities.rest) calculatedScore++;
    if (selectedActivities.joy) calculatedScore++;
    if (selectedActivities.nature) calculatedScore++;
    if (selectedActivities.connection) calculatedScore++;
    if (selectedActivities.movement) calculatedScore++;
    setScore(calculatedScore);
    
    // Simulate calendar save and reminder set
    setTimeout(() => {
      setShowCalendarModal(false);
      setStep('complete');
    }, 2000);
  };

  const handleComplete = () => {
    setShowGameOver(true);
  };

  const handleDownloadPlan = () => {
    const planText = `Weekend Recharge Plan\n\n` +
      `REST: ${selectedActivities.rest?.name} - ${selectedActivities.rest?.description}\n` +
      `JOY: ${selectedActivities.joy?.name} - ${selectedActivities.joy?.description}\n` +
      `NATURE: ${selectedActivities.nature?.name} - ${selectedActivities.nature?.description}\n` +
      `CONNECTION: ${selectedActivities.connection?.name} - ${selectedActivities.connection?.description}\n` +
      `MOVEMENT: ${selectedActivities.movement?.name} - ${selectedActivities.movement?.description}\n\n` +
      `This plan is designed to help you recharge over the weekend. Make time for each activity!`;
    
    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'weekend-recharge-plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const allCategoriesSelected = selectedActivities.rest && selectedActivities.joy && selectedActivities.nature && selectedActivities.connection && selectedActivities.movement;

  return (
    <TeacherGameShell
      title={gameData?.title || "Weekend Recharge Plan"}
      subtitle={gameData?.description || "Design an achievable personal recharge plan for the week"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={0}
    >
      <div className="w-full max-w-6xl mx-auto px-4">
        {step === 'select' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Weekend Recharge Plan
            </h2>
            <p className="text-gray-600 mb-6 text-center text-lg">
              Choose 1 activity from each of the 5 categories to create your personal recharge plan
            </p>

            {/* Selected Activities Summary */}
            {Object.values(selectedActivities).some(activity => activity !== null) && (
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-4 mb-6 border-2 border-indigo-200">
                <p className="text-center font-semibold text-indigo-800 mb-2">
                  Your Selected Activities:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {categories.map(category => {
                    const activity = selectedActivities[category.id];
                    if (!activity) return null;
                    return (
                      <div key={category.id} className={`${category.bgColor} rounded-lg p-3 border-2 ${category.borderColor}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{activity.icon}</span>
                          <span className="font-semibold text-gray-800">{activity.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Category Selection Sections */}
            <div className="space-y-6 mb-6">
              {categories.map((category) => {
                const Icon = category.icon;
                const selectedActivity = selectedActivities[category.id];
                
                return (
                  <div key={category.id} className={`${category.bgColor} rounded-xl p-6 border-2 ${category.borderColor}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className={`w-8 h-8 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`} />
                      <div>
                        <h3 className={`text-2xl font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                          {category.label}
                        </h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                      {selectedActivity && (
                        <div className="ml-auto flex items-center gap-2 bg-white px-3 py-1 rounded-full border-2 border-green-300">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-semibold text-green-800">Selected</span>
                        </div>
                      )}
                    </div>

                    {/* Activity Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {activities[category.id].map((activity) => {
                        const isSelected = selectedActivity?.id === activity.id;
                        return (
                          <motion.button
                            key={activity.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleActivitySelect(category.id, activity)}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              isSelected
                                ? `${category.borderColor} bg-white shadow-lg border-4`
                                : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md'
                            }`}
                          >
                            <div className="text-3xl mb-2">{activity.icon}</div>
                            <h4 className={`font-semibold text-sm mb-1 ${
                              isSelected ? 'text-gray-800' : 'text-gray-700'
                            }`}>
                              {activity.name}
                            </h4>
                            <p className="text-xs text-gray-600">{activity.description}</p>
                            {isSelected && (
                              <div className="mt-2 flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs font-semibold">Selected</span>
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continue Button */}
            {allCategoriesSelected && (
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleContinueToCalendar}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Save to Calendar
                </motion.button>
              </div>
            )}
          </div>
        )}

        {step === 'calendar' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-8">
                <Calendar className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Save to Calendar
                </h2>
                <p className="text-gray-600 text-lg">
                  Your weekend recharge plan is ready. Save it to your calendar and set reminders.
                </p>
              </div>

              {/* Plan Summary */}
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Your Weekend Recharge Plan:</h3>
                <div className="space-y-4">
                  {categories.map((category) => {
                    const activity = selectedActivities[category.id];
                    const Icon = category.icon;
                    return (
                      <div key={category.id} className="bg-white rounded-lg p-4 border-2 border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className={`w-6 h-6 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`} />
                          <h4 className="font-bold text-gray-800">{category.label} Activity:</h4>
                        </div>
                        <div className="flex items-center gap-2 ml-9">
                          <span className="text-2xl">{activity.icon}</span>
                          <div>
                            <p className="font-semibold text-gray-800">{activity.name}</p>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Calendar Options */}
              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">Save to Calendar</h4>
                  </div>
                  <p className="text-sm text-blue-700">
                    Your recharge activities will be added to your calendar for this weekend.
                  </p>
                </div>

                <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Bell className="w-6 h-6 text-amber-600" />
                    <h4 className="font-semibold text-amber-800">Set Reminders</h4>
                  </div>
                  <p className="text-sm text-amber-700">
                    You'll receive gentle reminders to engage in your recharge activities.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveToCalendar}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-6 h-6" />
                  Save to Calendar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadPlan}
                  className="bg-gray-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-6 h-6" />
                  Download Plan
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Calendar Save Modal */}
        {showCalendarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-6xl mb-4"
              >
                ✅
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Plan Saved!
              </h3>
              <p className="text-gray-600 mb-6">
                Your weekend recharge plan has been saved to your calendar with reminders set.
              </p>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200 mb-6">
                <div className="flex items-center justify-center gap-2 text-green-800">
                  <Bell className="w-5 h-5" />
                  <span className="font-semibold">Reminders have been set for your activities</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {step === 'complete' && !showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-6xl mb-6"
            >
              ✨
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Plan Created!
            </h2>
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200 mb-6 max-w-2xl mx-auto">
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Your weekend recharge plan has been successfully created and saved! You've selected activities from Rest, Joy, and Nature categories to help you recharge over the weekend.
              </p>
              
              {/* Plan Summary */}
              <div className="bg-white rounded-lg p-4 border-2 border-indigo-200 text-left">
                <h3 className="font-bold text-gray-800 mb-3">Your Plan:</h3>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const activity = selectedActivities[category.id];
                    return (
                      <div key={category.id} className="flex items-center gap-2">
                        <span className="text-xl">{activity.icon}</span>
                        <span className="text-sm font-semibold text-gray-700">{category.label}:</span>
                        <span className="text-sm text-gray-600">{activity.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadPlan}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Plan
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const planText = `My Weekend Recharge Plan:\n\n` +
                    `REST: ${selectedActivities.rest?.name}\n` +
                    `JOY: ${selectedActivities.joy?.name}\n` +
                    `NATURE: ${selectedActivities.nature?.name}\n` +
                    `CONNECTION: ${selectedActivities.connection?.name}\n` +
                    `MOVEMENT: ${selectedActivities.movement?.name}\n\n` +
                    `Share your recharge plan with colleagues to inspire balance culture!`;
                  navigator.clipboard?.writeText(planText);
                  alert('Plan copied to clipboard! Share it with your colleagues.');
                }}
                className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share Plan
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleComplete}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Complete
            </motion.button>
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
              🌟
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Weekend Recharge Plan Complete!
            </h2>
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                You've successfully created your weekend recharge plan! You've selected one activity from each category (Rest, Joy, Nature, Connection, Movement) to help you recharge and restore your energy. Your plan has been saved to your calendar with reminders set. Remember to actually follow through with these activities—planning is the first step, but taking action is what creates real recharge.
              </p>
            </div>

            {/* Final Plan Display */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6 text-left max-w-2xl mx-auto">
              <h3 className="font-bold text-gray-800 mb-4 text-center">Your Weekend Recharge Plan:</h3>
              <div className="space-y-3">
                {categories.map((category) => {
                  const activity = selectedActivities[category.id];
                  const Icon = category.icon;
                  return (
                    <div key={category.id} className={`${category.bgColor} rounded-lg p-4 border-2 ${category.borderColor}`}>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-6 h-6 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`} />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{category.label}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-2xl">{activity.icon}</span>
                            <span className="text-gray-700">{activity.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <Share2 className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Encourage sharing weekend ideas to inspire balance culture. When teachers share their recharge plans and activities with each other, it creates a culture where self-care and balance are normalized and valued. Create a shared space (like a staffroom board or online forum) where teachers can post their recharge activities and ideas. This not only provides inspiration but also builds community and support. When you see colleagues prioritizing rest, joy, and nature, it gives you permission to do the same. Share your plan with a colleague this week and ask them about their recharge activities. Building a culture of balance requires collective effort and mutual support.
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

export default WeekendRechargePlan;

