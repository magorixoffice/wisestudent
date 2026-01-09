import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Music, BookOpen, Trees, Moon, Coffee, Sparkles, Heart, Sun, Waves, Feather, CheckCircle, Calendar, Save, Download, AlertCircle } from "lucide-react";

const RefillRituals = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-25";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [step, setStep] = useState('select'); // 'select', 'schedule', 'card'
  const [selectedRituals, setSelectedRituals] = useState([]);
  const [weeklySchedule, setWeeklySchedule] = useState({});
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedRitual, setSelectedRitual] = useState(null);
  const routineCardRef = useRef(null);

  // 15 ritual icons
  const rituals = [
    { id: 'music', name: 'Music', icon: Music, emoji: '🎵', color: 'from-purple-500 to-pink-500', description: 'Listen to calming or energizing music' },
    { id: 'journaling', name: 'Journaling', icon: BookOpen, emoji: '📝', color: 'from-blue-500 to-cyan-500', description: 'Write down thoughts and feelings' },
    { id: 'nature', name: 'Nature Walk', icon: Trees, emoji: '🌳', color: 'from-green-500 to-emerald-500', description: 'Spend time in nature or outdoors' },
    { id: 'silence', name: 'Silence', icon: Moon, emoji: '🔇', color: 'from-indigo-500 to-purple-500', description: 'Enjoy quiet, peaceful moments' },
    { id: 'coffee', name: 'Mindful Coffee', icon: Coffee, emoji: '☕', color: 'from-amber-500 to-orange-500', description: 'Savor a cup mindfully' },
    { id: 'meditation', name: 'Meditation', icon: Sparkles, emoji: '🧘', color: 'from-pink-500 to-rose-500', description: 'Practice mindfulness or meditation' },
    { id: 'gratitude', name: 'Gratitude Practice', icon: Heart, emoji: '💚', color: 'from-red-500 to-pink-500', description: 'Reflect on things you\'re grateful for' },
    { id: 'sunlight', name: 'Sunlight', icon: Sun, emoji: '☀️', color: 'from-yellow-500 to-amber-500', description: 'Get natural light and fresh air' },
    { id: 'breathing', name: 'Breathing Exercise', icon: Waves, emoji: '🌊', color: 'from-cyan-500 to-blue-500', description: 'Practice deep breathing techniques' },
    { id: 'reading', name: 'Reading', icon: BookOpen, emoji: '📖', color: 'from-violet-500 to-purple-500', description: 'Read something inspiring or relaxing' },
    { id: 'stretching', name: 'Stretching', icon: Feather, emoji: '🧘‍♀️', color: 'from-teal-500 to-green-500', description: 'Gentle stretching or yoga' },
    { id: 'tea', name: 'Herbal Tea', icon: Coffee, emoji: '🍵', color: 'from-green-500 to-emerald-500', description: 'Enjoy a warm, calming tea' },
    { id: 'art', name: 'Creative Expression', icon: Sparkles, emoji: '🎨', color: 'from-pink-500 to-purple-500', description: 'Draw, paint, or create something' },
    { id: 'bath', name: 'Relaxing Bath', icon: Waves, emoji: '🛁', color: 'from-blue-500 to-indigo-500', description: 'Take a warm, relaxing bath' },
    { id: 'connection', name: 'Social Connection', icon: Heart, emoji: '🤝', color: 'from-rose-500 to-red-500', description: 'Connect with loved ones or friends' }
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '6:00 AM', '7:00 AM', '8:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'
  ];

  const handleRitualSelect = (ritual) => {
    if (selectedRituals.length >= 3 && !selectedRituals.find(r => r.id === ritual.id)) {
      alert("You can select up to 3 rituals. Remove one to select another.");
      return;
    }

    if (selectedRituals.find(r => r.id === ritual.id)) {
      // Deselect
      setSelectedRituals(selectedRituals.filter(r => r.id !== ritual.id));
    } else {
      // Select
      setSelectedRituals([...selectedRituals, ritual]);
    }
  };

  const handleContinueToSchedule = () => {
    if (selectedRituals.length !== 3) {
      alert("Please select exactly 3 rituals to continue.");
      return;
    }
    setStep('schedule');
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setShowAddModal(true);
    setSelectedTime('');
    setSelectedRitual(null);
  };

  const handleAddRitualToSchedule = () => {
    if (!selectedDay || !selectedTime || !selectedRitual) {
      return;
    }

    const scheduleItem = {
      id: Date.now(),
      day: selectedDay,
      time: selectedTime,
      ritual: selectedRitual
    };

    setWeeklySchedule(prev => ({
      ...prev,
      [selectedDay]: [
        ...(prev[selectedDay] || []),
        scheduleItem
      ]
    }));

    setShowAddModal(false);
    setSelectedDay(null);
    setSelectedTime('');
    setSelectedRitual(null);
  };

  const handleRemoveFromSchedule = (day, itemId) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: (prev[day] || []).filter(item => item.id !== itemId)
    }));
  };

  const handleContinueToCard = () => {
    const totalScheduled = Object.values(weeklySchedule).reduce((sum, daySchedule) => sum + (daySchedule || []).length, 0);
    if (totalScheduled === 0) {
      alert("Please schedule at least one ritual to continue.");
      return;
    }
    setStep('card');
    setScore(1);
  };

  const handleSaveRoutine = () => {
    setShowGameOver(true);
  };

  const handleDownloadCard = () => {
    if (!routineCardRef.current) return;

    const instructions = `To save your Refill Rituals Routine Card:\n\n` +
      `1. Take a screenshot:\n` +
      `   • Windows: Press Win + Shift + S, then select the card area\n` +
      `   • Mac: Press Cmd + Shift + 4, then select the card area\n` +
      `   • Or use your device's screenshot tool\n\n` +
      `2. Save the screenshot to your device\n\n` +
      `3. Use it as:\n` +
      `   • Phone wallpaper\n` +
      `   • Desktop background\n` +
      `   • Print it and keep it on your desk\n` +
      `   • Share with colleagues during well-being sessions\n\n` +
      `Your routine card is ready to use!`;
    
    alert(instructions);
  };

  const getTotalScheduled = () => {
    return Object.values(weeklySchedule).reduce((sum, daySchedule) => sum + (daySchedule || []).length, 0);
  };

  return (
    <TeacherGameShell
      title={gameData?.title || "Refill Rituals"}
      subtitle={gameData?.description || "Build small self-care rituals that restore empathy reserves"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={1}
    >
      <div className="w-full max-w-6xl mx-auto px-4">
        {step === 'select' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Select Your Refill Rituals
            </h2>
            <p className="text-gray-600 mb-6 text-center text-lg">
              Choose 3 self-care rituals that restore your empathy reserves
            </p>

            {/* Selected Rituals Counter */}
            {selectedRituals.length > 0 && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6 border-2 border-purple-200">
                <p className="text-center font-semibold text-purple-800">
                  Selected: {selectedRituals.length} / 3 rituals
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {selectedRituals.map(ritual => (
                    <span key={ritual.id} className="bg-white px-3 py-1 rounded-full text-sm font-medium text-purple-700 border border-purple-300">
                      {ritual.emoji} {ritual.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ritual Selection Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              {rituals.map((ritual) => {
                const isSelected = selectedRituals.find(r => r.id === ritual.id);
                const Icon = ritual.icon;
                return (
                  <motion.button
                    key={ritual.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRitualSelect(ritual)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      isSelected
                        ? `bg-gradient-to-br ${ritual.color} border-transparent text-white shadow-lg`
                        : 'bg-white border-gray-300 text-gray-700 hover:border-purple-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-5xl mb-3 ${isSelected ? '' : 'opacity-80'}`}>
                        {ritual.emoji}
                      </div>
                      <h3 className={`font-bold text-lg mb-2 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                        {ritual.name}
                      </h3>
                      <p className={`text-xs ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                        {ritual.description}
                      </p>
                      {isSelected && (
                        <div className="mt-3">
                          <CheckCircle className="w-6 h-6 text-white mx-auto" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Continue Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContinueToSchedule}
                disabled={selectedRituals.length !== 3}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Schedule
              </motion.button>
            </div>
          </div>
        )}

        {step === 'schedule' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Plan Your Weekly Schedule
            </h2>
            <p className="text-gray-600 mb-6 text-center text-lg">
              Schedule your 3 selected rituals throughout the week
            </p>

            {/* Selected Rituals Reminder */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6 border-2 border-purple-200">
              <p className="font-semibold text-purple-800 mb-2">Your Selected Rituals:</p>
              <div className="flex flex-wrap gap-2">
                {selectedRituals.map(ritual => (
                  <span key={ritual.id} className="bg-white px-3 py-1 rounded-full text-sm font-medium text-purple-700 border border-purple-300">
                    {ritual.emoji} {ritual.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Weekly Schedule Grid */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
              {daysOfWeek.map((day) => {
                const daySchedule = weeklySchedule[day] || [];
                return (
                  <div key={day} className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50 min-h-[300px]">
                    <h3 className="font-bold text-gray-800 mb-3 text-center">{day}</h3>
                    <button
                      onClick={() => handleDayClick(day)}
                      className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-md transition-all mb-3 text-sm"
                    >
                      + Add Ritual
                    </button>
                    <div className="space-y-2">
                      {daySchedule.map((item) => {
                        const ritual = selectedRituals.find(r => r.id === item.ritual.id);
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg p-2 border border-gray-200 text-xs"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-gray-800">{item.time}</span>
                              <button
                                onClick={() => handleRemoveFromSchedule(day, item.id)}
                                className="text-red-500 hover:text-red-700 font-bold"
                              >
                                ×
                              </button>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{ritual?.emoji}</span>
                              <span className="text-gray-700 truncate">{ritual?.name}</span>
                            </div>
                          </motion.div>
                        );
                      })}
                      {daySchedule.length === 0 && (
                        <p className="text-gray-400 text-center text-xs italic py-4">
                          No rituals scheduled
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Scheduled Counter */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6 border-2 border-blue-200">
              <p className="text-center font-semibold text-blue-800">
                Total Rituals Scheduled: {getTotalScheduled()} this week
              </p>
            </div>

            {/* Continue Button */}
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep('select')}
                className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContinueToCard}
                disabled={getTotalScheduled() === 0}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Routine Card
              </motion.button>
            </div>
          </div>
        )}

        {step === 'card' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Your Refill Rituals Routine Card
            </h2>

            {/* Routine Card */}
            <div
              ref={routineCardRef}
              className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 rounded-2xl p-8 border-4 border-purple-300 shadow-2xl mb-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-4xl font-bold text-purple-800 mb-2">
                  My Refill Rituals
                </h3>
                <p className="text-xl text-purple-600 italic">
                  Self-Care Routines to Restore Empathy Reserves
                </p>
              </div>

              {/* Selected Rituals */}
              <div className="mb-8">
                <h4 className="text-2xl font-bold text-gray-800 mb-4">My 3 Rituals:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedRituals.map((ritual) => {
                    const Icon = ritual.icon;
                    return (
                      <div key={ritual.id} className={`bg-white rounded-xl p-6 border-2 border-purple-200 text-center`}>
                        <div className="text-6xl mb-3">{ritual.emoji}</div>
                        <h5 className="font-bold text-lg text-gray-800 mb-2">{ritual.name}</h5>
                        <p className="text-sm text-gray-600">{ritual.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weekly Schedule */}
              <div className="mb-8">
                <h4 className="text-2xl font-bold text-gray-800 mb-4">Weekly Schedule:</h4>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                  {daysOfWeek.map((day) => {
                    const daySchedule = weeklySchedule[day] || [];
                    return (
                      <div key={day} className="bg-white rounded-lg p-3 border border-purple-200">
                        <h5 className="font-bold text-gray-800 mb-2 text-center text-sm">{day}</h5>
                        <div className="space-y-2">
                          {daySchedule.map((item) => {
                            const ritual = selectedRituals.find(r => r.id === item.ritual.id);
                            return (
                              <div key={item.id} className="text-xs bg-purple-50 rounded p-2">
                                <div className="font-semibold text-purple-800">{item.time}</div>
                                <div className="text-gray-700">{ritual?.emoji} {ritual?.name}</div>
                              </div>
                            );
                          })}
                          {daySchedule.length === 0 && (
                            <p className="text-gray-400 text-center text-xs italic">-</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Inspiration Quote */}
              <div className="text-center bg-white rounded-xl p-6 border-2 border-purple-200">
                <p className="text-lg font-medium text-purple-800 italic">
                  "Taking care of yourself is not selfish—it's essential for caring for others."
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadCard}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Save Routine Card
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveRoutine}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Complete
              </motion.button>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Encourage ritual sharing during staff well-being sessions. Share your refill rituals with colleagues during staff meetings or well-being sessions. This creates a culture of self-care and allows teachers to learn from each other. You might discover new rituals that work for you, and others might benefit from your routines. Creating a space for ritual sharing normalizes self-care as an essential part of teaching and builds a supportive community around wellbeing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Ritual Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Schedule Ritual for {selectedDay}
              </h3>

              {/* Time Selection */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Time:</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Choose a time...</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              {/* Ritual Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Ritual:</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedRituals.map((ritual) => {
                    const Icon = ritual.icon;
                    return (
                      <button
                        key={ritual.id}
                        onClick={() => setSelectedRitual(ritual)}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                          selectedRitual?.id === ritual.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-300 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{ritual.emoji}</span>
                          <span className="font-medium text-gray-800">{ritual.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedDay(null);
                    setSelectedTime('');
                    setSelectedRitual(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRitualToSchedule}
                  disabled={!selectedTime || !selectedRitual}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Schedule
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default RefillRituals;

