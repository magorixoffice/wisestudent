import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { TrendingUp, Thermometer } from "lucide-react";

const StressThermometer = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-12";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = 5; // Updated to 5 questions
  
  const [currentCueIndex, setCurrentCueIndex] = useState(0);
  const [ratings, setRatings] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const stressCues = [
    {
      id: 1,
      title: "Morning Rush",
      description: "Arriving at school with barely enough time to prepare for the first class",
      icon: "🌅"
    },
    {
      id: 2,
      title: "Grading Deadline",
      description: "Facing a stack of papers that need to be graded by tomorrow",
      icon: "📚"
    },
    {
      id: 3,
      title: "Difficult Parent Meeting",
      description: "Scheduled meeting with a parent who has been critical of your teaching",
      icon: "🤝"
    },
    {
      id: 4,
      title: "Classroom Disruption",
      description: "Students are loud and off-task despite multiple reminders",
      icon: "👥"
    },
    {
      id: 5,
      title: "Last-Minute Request",
      description: "Administration asks you to prepare a report or attend a meeting with short notice",
      icon: "📞"
    }
  ];

  const currentCue = stressCues[currentCueIndex];
  const currentRating = ratings[currentCue.id] || 0;

  const handleRatingChange = (value) => {
    setRatings({
      ...ratings,
      [currentCue.id]: value
    });
  };

  const handleNext = () => {
    if (currentCueIndex < stressCues.length - 1) {
      setCurrentCueIndex(currentCueIndex + 1);
    } else {
      // All cues rated, show summary
      setShowSummary(true);
      setScore(stressCues.length); // All questions completed
    }
  };

  const handleComplete = () => {
    setShowGameOver(true);
  };

  const getThermometerColor = (value) => {
    if (value <= 3) return "from-green-400 to-emerald-500";
    if (value <= 6) return "from-yellow-400 to-orange-500";
    return "from-orange-500 to-red-600";
  };

  const getStressLevel = (value) => {
    if (value === 0) return "No Stress";
    if (value <= 3) return "Low";
    if (value <= 6) return "Moderate";
    if (value <= 8) return "High";
    return "Very High";
  };

  const getStressLevelColor = (value) => {
    if (value === 0) return "text-green-600";
    if (value <= 3) return "text-green-600";
    if (value <= 6) return "text-yellow-600";
    if (value <= 8) return "text-orange-600";
    return "text-red-600";
  };

  const renderThermometer = (value) => {
    const percentage = (value / 10) * 100;
    const colorGradient = getThermometerColor(value);
    
    return (
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="relative w-32 h-80 mb-4">
          {/* Thermometer Background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-full bg-gray-200 rounded-full border-4 border-gray-300 shadow-inner"></div>
          </div>
          
          {/* Thermometer Fill */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 bg-gradient-to-t ${colorGradient} rounded-full shadow-lg`}
            style={{ 
              bottom: '20px',
              transition: 'height 0.3s ease-out'
            }}
          />
          
          {/* Thermometer Bulb */}
          <motion.div
            animate={{ 
              scale: value > 0 ? [1, 1.1, 1] : 1,
              boxShadow: value > 0 ? `0 0 ${value * 2}px rgba(239, 68, 68, 0.5)` : 'none'
            }}
            transition={{ duration: 0.5, repeat: value > 0 ? Infinity : 0, repeatDelay: 1 }}
            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-br ${colorGradient} rounded-full border-4 border-white shadow-xl`}
          />
          
          {/* Scale Markers */}
          <div className="absolute inset-0 flex flex-col justify-between py-4">
            {[0, 2, 4, 6, 8, 10].map((mark) => (
              <div key={mark} className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full ml-2"></div>
                <span className="text-xs font-semibold text-gray-600 ml-2">{mark}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Current Value Display */}
        <div className="text-center">
          <div className={`text-5xl font-bold ${getStressLevelColor(value)} mb-2`}>
            {value}
          </div>
          <div className={`text-lg font-semibold ${getStressLevelColor(value)}`}>
            {getStressLevel(value)}
          </div>
        </div>
      </div>
    );
  };

  const calculateAverage = () => {
    const values = Object.values(ratings);
    if (values.length === 0) return 0;
    return (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(1);
  };

  const getHighestStress = () => {
    const entries = Object.entries(ratings);
    if (entries.length === 0) return null;
    const maxEntry = entries.reduce((max, [id, value]) => 
      value > max[1] ? [id, value] : max, 
      entries[0]
    );
    return stressCues.find(cue => cue.id === parseInt(maxEntry[0]));
  };

  const getLowestStress = () => {
    const entries = Object.entries(ratings);
    if (entries.length === 0) return null;
    const minEntry = entries.reduce((min, [id, value]) => 
      value < min[1] ? [id, value] : min, 
      entries[0]
    );
    return stressCues.find(cue => cue.id === parseInt(minEntry[0]));
  };

  return (
    <TeacherGameShell
      title={gameData?.title || "Stress Thermometer"}
      subtitle={gameData?.description || "Rate and visualize your stress intensity across situations"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={showSummary ? totalLevels : currentCueIndex + 0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showSummary ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-800">
                  Rate Your Stress Level
                </h2>
                <span className="text-sm text-gray-600">
                  {currentCueIndex + 1} of {stressCues.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentCueIndex + 1) / stressCues.length) * 100}%` }}
                  className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full"
                />
              </div>
            </div>

            {/* Current Stress Cue */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 mb-8 border-2 border-orange-200">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{currentCue.icon}</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {currentCue.title}
                  </h3>
                  <p className="text-gray-600">
                    {currentCue.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Thermometer Visualization */}
            {renderThermometer(currentRating)}

            {/* Slider */}
            <div className="mb-8">
              <label className="block text-center text-lg font-semibold text-gray-700 mb-4">
                Slide to rate your stress level (0-10)
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={currentRating}
                onChange={(e) => handleRatingChange(parseInt(e.target.value))}
                className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #f59e0b ${(currentRating / 10) * 50}%, #ef4444 ${(currentRating / 10) * 100}%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0 - No Stress</span>
                <span>5 - Moderate</span>
                <span>10 - Very High</span>
              </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {currentCueIndex < stressCues.length - 1 ? "Next Cue →" : "View Summary →"}
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Thermometer className="w-8 h-8 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Your Stress Summary
                </h2>
              </div>

              {/* Average Stress */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 mb-6 border-2 border-orange-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Average Stress Level</p>
                  <div className={`text-5xl font-bold ${getStressLevelColor(parseFloat(calculateAverage()))} mb-2`}>
                    {calculateAverage()}
                  </div>
                  <div className={`text-lg font-semibold ${getStressLevelColor(parseFloat(calculateAverage()))}`}>
                    {getStressLevel(parseFloat(calculateAverage()))}
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Stress Intensity Chart
                </h3>
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                  <div className="flex items-end justify-between gap-2 h-64">
                    {stressCues.map((cue, index) => {
                      const rating = ratings[cue.id] || 0;
                      const heightPercentage = (rating / 10) * 100;
                      const barHeight = (heightPercentage / 100) * 240; // Max height 240px
                      const colorGradient = getThermometerColor(rating);

                      return (
                        <div key={cue.id} className="flex-1 flex flex-col items-center group">
                          <div className="w-full flex flex-col items-end justify-end" style={{ height: '240px' }}>
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${barHeight}px` }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className={`w-full bg-gradient-to-t ${colorGradient} rounded-t-lg shadow-md transition-all hover:scale-105 cursor-pointer relative border-2 border-white`}
                              style={{ minHeight: '10px' }}
                              title={`${cue.title}: ${rating}/10`}
                            >
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                                {rating}/10
                              </div>
                            </motion.div>
                          </div>
                          <div className="mt-2 text-center w-full">
                            <p className="text-xs font-semibold text-gray-600 mb-1">{cue.title}</p>
                            <span className="text-lg">{cue.icon}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {getHighestStress() && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                    <h4 className="font-semibold text-red-800 mb-2">🔥 Highest Stress</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getHighestStress().icon}</span>
                      <div>
                        <p className="font-bold text-gray-800">{getHighestStress().title}</p>
                        <p className="text-sm text-gray-600">
                          Rating: {ratings[getHighestStress().id]}/10
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {getLowestStress() && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <h4 className="font-semibold text-green-800 mb-2">✨ Lowest Stress</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getLowestStress().icon}</span>
                      <div>
                        <p className="font-bold text-gray-800">{getLowestStress().title}</p>
                        <p className="text-sm text-gray-600">
                          Rating: {ratings[getLowestStress().id]}/10
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Complete Button */}
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleComplete}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Complete Stress Thermometer
                </motion.button>
              </div>

              {/* Teacher Tip */}
              <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-amber-900 mb-2">
                  💡 Teacher Tip:
                </p>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Compare daily thermometer readings to identify trigger patterns. Track your stress levels over time to notice which situations consistently cause higher stress. This awareness helps you prepare coping strategies in advance and recognize when you might need extra support or self-care.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default StressThermometer;

