import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Droplet, Heart, Footprints, Sparkles, Wind, CheckCircle, ArrowRight, Sun, Sparkle } from "lucide-react";

const MorningNourishRoutine = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-97";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [step, setStep] = useState(1); // 1: Choose rituals, 2: Follow rituals, 3: Complete
  const [selectedRituals, setSelectedRituals] = useState([]);
  const [completedRituals, setCompletedRituals] = useState([]);
  const [showGameOver, setShowGameOver] = useState(false);

  // Morning routine ritual options
  const allRituals = [
    {
      id: 'water',
      label: 'Drink Water',
      description: 'Start your day with hydration. Drink a full glass of water to awaken your body',
      emoji: '💧',
      icon: Droplet,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300',
      guidance: 'Take a moment to drink a full glass of water slowly. Feel it hydrating your body and mind.',
      points: 20
    },
    {
      id: 'gratitude',
      label: 'Gratitude Practice',
      description: 'Acknowledge three things you\'re grateful for this morning',
      emoji: '🙏',
      icon: Heart,
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-300',
      guidance: 'Think of three specific things you\'re grateful for today. They can be big or small—a warm bed, your family, the sunrise, a good night\'s sleep.',
      points: 25
    },
    {
      id: 'walk',
      label: 'Morning Walk',
      description: 'Take a brief walk outside or around your home to wake your body',
      emoji: '🚶',
      icon: Footprints,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      guidance: 'Take 5-10 minutes to walk around your home, yard, or neighborhood. Notice the morning light, fresh air, and how movement feels in your body.',
      points: 30
    },
    {
      id: 'affirmations',
      label: 'Morning Affirmations',
      description: 'Speak or think positive affirmations to set your day\'s intention',
      emoji: '✨',
      icon: Sparkles,
      color: 'from-purple-400 to-violet-500',
      bgColor: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-300',
      guidance: 'Repeat affirmations like "I am calm and present," "I choose patience today," or "I have everything I need." Speak them out loud or in your mind with intention.',
      points: 25
    },
    {
      id: 'deep-breath',
      label: 'Deep Breath',
      description: 'Take 5 deep, intentional breaths to center yourself',
      emoji: '🌬️',
      icon: Wind,
      color: 'from-indigo-400 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-300',
      guidance: 'Take 5 deep breaths: inhale slowly for 4 counts, hold for 4, exhale slowly for 4. Feel your body relax and your mind settle.',
      points: 20
    },
    {
      id: 'stretch',
      label: 'Gentle Stretching',
      description: 'Do 5 minutes of gentle stretching to wake up your muscles',
      emoji: '🧘',
      icon: Wind,
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-300',
      guidance: 'Spend 5 minutes doing gentle stretches - reach for the sky, touch your toes, roll your shoulders. Move slowly and mindfully.',
      points: 25
    },
    {
      id: 'journal',
      label: 'Morning Journal',
      description: 'Write down your thoughts, intentions, or plans for the day',
      emoji: '📝',
      icon: Sun,
      color: 'from-teal-400 to-cyan-500',
      bgColor: 'from-teal-50 to-cyan-50',
      borderColor: 'border-teal-300',
      guidance: 'Spend 3-5 minutes writing in a journal. You can write your intentions for the day, things you\'re grateful for, or just stream-of-consciousness thoughts.',
      points: 30
    },
    {
      id: 'music',
      label: 'Listen to Calming Music',
      description: 'Play 5 minutes of calming music or nature sounds to set your mood',
      emoji: '🎵',
      icon: Sparkles,
      color: 'from-violet-400 to-purple-500',
      bgColor: 'from-violet-50 to-purple-50',
      borderColor: 'border-violet-300',
      guidance: 'Play your favorite calming playlist, classical music, or nature sounds for 5 minutes. Close your eyes and let the music wash over you.',
      points: 20
    }
  ];

  const handleSelectRitual = (ritualId) => {
    setSelectedRituals(prev => {
      if (prev.includes(ritualId)) {
        return prev.filter(id => id !== ritualId);
      } else if (prev.length < 5) {
        return [...prev, ritualId];
      }
      return prev;
    });
  };

  const handleToggleCompletion = (ritualId) => {
    setCompletedRituals(prev => {
      if (prev.includes(ritualId)) {
        return prev.filter(id => id !== ritualId);
      } else {
        return [...prev, ritualId];
      }
    });
  };

  const handleContinueToFollow = () => {
    if (selectedRituals.length === 5) {
      setStep(2);
    }
  };

  const handleComplete = () => {
    if (completedRituals.length === selectedRituals.length) {
      setShowGameOver(true);
    }
  };

  const getSelectedRitualData = () => {
    return selectedRituals
      .map(id => allRituals.find(r => r.id === id))
      .filter(Boolean);
  };

  const calculateNourishmentScore = () => {
    const selectedData = getSelectedRitualData();
    const totalPoints = completedRituals.reduce((sum, ritualId) => {
      const ritual = selectedData.find(r => r.id === ritualId);
      return sum + (ritual?.points || 0);
    }, 0);
    
    const maxPoints = selectedData.reduce((sum, ritual) => sum + ritual.points, 0);
    return maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
  };

  if (showGameOver) {
    const selectedData = getSelectedRitualData();
    const nourishmentScore = calculateNourishmentScore();

    return (
      <ParentGameShell
        title={gameData?.title || "Morning Nourish Routine"}
        subtitle="Routine Complete!"
        showGameOver={true}
        score={5}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={completedRituals.length === selectedRituals.length}
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
                ☀️
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Morning Nourishment Complete!</h2>
              <p className="text-lg text-gray-600">
                You've started your day with grounded, mindful self-nourishment.
              </p>
              <div className="inline-block bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl px-8 py-4 border-2 border-amber-300 mt-4">
                <p className="text-4xl font-bold text-gray-800 mb-2">{nourishmentScore}%</p>
                <p className="text-lg font-semibold text-gray-700">Nourishment Score</p>
              </div>
            </div>

            {/* Completed Rituals Summary */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Morning Rituals</h3>
              <div className="grid grid-cols-1 gap-4">
                {selectedData.map((ritual) => {
                  const isCompleted = completedRituals.includes(ritual.id);
                  return (
                    <motion.div
                      key={ritual.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-gradient-to-br ${ritual.bgColor} rounded-xl p-5 border-2 ${ritual.borderColor}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{ritual.emoji}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-gray-800 text-lg">{ritual.label}</h4>
                            {isCompleted && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-700">{ritual.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkle className="w-6 h-6 text-blue-600" />
                The Power of Morning Rituals
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Morning Momentum:</strong> Mornings create momentum. How you start your day sets the tone for everything that follows. Beginning with calm, intentional rituals helps you maintain that calm throughout the day.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Grounded Start:</strong> Morning nourish routines ground you before the day's demands arrive. Taking time for yourself first ensures you have more to give to your family later.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Home Reflection:</strong> Your morning energy sets your home's tone. When you begin calm and centered, your home mirrors that energy. Children sense and respond to your state of being.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Self-Nourishment:</strong> These rituals aren't luxury—they're essential self-nourishment. Hydrating, moving, breathing, expressing gratitude, and setting intentions are foundational to your wellbeing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Consistency Over Perfection:</strong> It's better to do 3 simple rituals consistently than to try for perfection and skip them. Even 5-10 minutes of morning nourishment makes a difference.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Mornings create momentum — begin calm, and your home will mirror it. When you start your day with intentional self-nourishment—whether it's water, gratitude, a walk, affirmations, or deep breathing—you're not just taking care of yourself. You're setting a foundation of calm that ripples through your entire day and family. Your children feel and respond to your energy. A parent who begins the day grounded and present creates a home that reflects that same grounded presence. Make morning nourishment non-negotiable, even if it's just 5 minutes. Those few minutes of intentional self-care transform the entire day.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  // Step 2: Follow rituals
  if (step === 2) {
    const selectedData = getSelectedRitualData();

    return (
      <ParentGameShell
        title={gameData?.title || "Morning Nourish Routine"}
        subtitle="Follow Your Rituals"
        showGameOver={false}
        score={0}
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
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">☀️</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Morning Rituals</h2>
              <p className="text-gray-600">
                Follow each ritual and mark it complete when you're done.
              </p>
            </div>

            {/* Progress */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200 mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-700">Progress</p>
                <p className="text-sm font-bold text-gray-800">
                  {completedRituals.length}/{selectedRituals.length} rituals completed
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedRituals.length / selectedRituals.length) * 100}%` }}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 h-3 rounded-full"
                />
              </div>
            </div>

            {/* Rituals List */}
            <div className="space-y-4 mb-6">
              {selectedData.map((ritual, index) => {
                const isCompleted = completedRituals.includes(ritual.id);
                return (
                  <motion.div
                    key={ritual.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${ritual.bgColor} rounded-xl p-6 border-2 ${ritual.borderColor} ${
                      isCompleted ? 'ring-2 ring-green-400' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center"
                          >
                            <CheckCircle className="w-8 h-8 text-white" />
                          </motion.div>
                        ) : (
                          <div className="w-12 h-12 rounded-full border-4 border-gray-300 flex items-center justify-center bg-white cursor-pointer hover:border-gray-400"
                               onClick={() => handleToggleCompletion(ritual.id)}>
                            <span className="text-2xl">{ritual.emoji}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{ritual.label}</h3>
                          <span className="text-2xl">{ritual.emoji}</span>
                        </div>
                        <p className="text-gray-700 mb-3">{ritual.description}</p>
                        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                          <p className="text-sm font-semibold text-gray-800 mb-2">Guidance:</p>
                          <p className="text-sm text-gray-700 italic">{ritual.guidance}</p>
                        </div>
                        {!isCompleted && (
                          <button
                            onClick={() => handleToggleCompletion(ritual.id)}
                            className="bg-white text-gray-800 px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-green-400 hover:bg-green-50 font-semibold transition-all"
                          >
                            Mark as Complete
                          </button>
                        )}
                        {isCompleted && (
                          <div className="bg-green-100 rounded-lg p-3 border border-green-300">
                            <p className="text-green-800 text-sm font-semibold flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Completed! Great job.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Complete Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleComplete}
              disabled={completedRituals.length !== selectedRituals.length}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Complete Morning Routine
            </motion.button>

            {completedRituals.length !== selectedRituals.length && (
              <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
                <p className="text-yellow-800 text-sm text-center">
                  Please complete all {selectedRituals.length} rituals before finishing.
                </p>
              </div>
            )}

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
              <p className="text-sm text-gray-700">
                <strong>💡 Parent Tip:</strong> Mornings create momentum — begin calm, and your home will mirror it.
              </p>
            </div>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  // Step 1: Choose rituals
  return (
    <ParentGameShell
      title={gameData?.title || "Morning Nourish Routine"}
      subtitle="Choose Your Rituals"
      showGameOver={false}
      score={0}
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
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">☀️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Morning Nourish Routine</h2>
            <p className="text-gray-600 text-lg">
              Start your day with grounded, mindful self-nourishment.
            </p>
            <div className="mt-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-3 inline-block">
              <p className="text-amber-800 font-semibold">Select 5 rituals from 8 options</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border-2 border-amber-200 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">How to Play</h3>
            <p className="text-gray-700 mb-2">
              Choose <strong>5 rituals</strong> from the options below to create your morning nourish routine. After selecting, you'll follow each ritual and mark them complete.
            </p>
            <p className="text-sm text-gray-600">
              Each ritual is designed to help you start the day grounded and present.
            </p>
          </div>

          {/* Selection Info */}
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-3 mb-6 text-center">
            <p className="text-amber-800 font-semibold">Select 5 rituals from 8 options</p>
          </div>

          {/* Ritual Options */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Select 5 Rituals</h3>
            <div className="space-y-4">
              {allRituals.map((ritual, index) => {
                const isSelected = selectedRituals.includes(ritual.id);
                const canSelect = selectedRituals.length < 5 || isSelected;
                return (
                  <motion.div
                    key={ritual.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${ritual.bgColor} rounded-xl p-5 border-2 ${ritual.borderColor} cursor-pointer hover:shadow-lg transition-all ${
                      isSelected ? 'ring-2 ring-green-400' : ''
                    } ${!canSelect ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => canSelect && handleSelectRitual(ritual.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {isSelected ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center"
                          >
                            <CheckCircle className="w-8 h-8 text-white" />
                          </motion.div>
                        ) : (
                          <div className="w-12 h-12 rounded-full border-4 border-gray-300 flex items-center justify-center bg-white">
                            <ritual.icon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{ritual.emoji}</span>
                          <h4 className="text-lg font-bold text-gray-800">{ritual.label}</h4>
                        </div>
                        <p className="text-sm text-gray-700">{ritual.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Selection Progress */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">Selection Progress</p>
              <p className="text-sm font-bold text-gray-800">
                {selectedRituals.length}/5 rituals selected
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(selectedRituals.length / 5) * 100}%` }}
                className="bg-gradient-to-r from-amber-600 to-orange-600 h-3 rounded-full"
              />
            </div>
            {selectedRituals.length === 5 && (
              <div className="mt-3 bg-green-100 rounded-lg p-2 border border-green-300">
                <p className="text-green-800 text-sm text-center font-semibold">
                  ✓ Perfect! You've selected 5 rituals. Ready to continue.
                </p>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinueToFollow}
            disabled={selectedRituals.length !== 5}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continue to Follow Rituals
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          {selectedRituals.length !== 3 && (
            <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
              <p className="text-yellow-800 text-sm text-center">
                Please select exactly 5 rituals to create your morning routine.
              </p>
            </div>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Mornings create momentum — begin calm, and your home will mirror it. Choose rituals that feel manageable and meaningful to you.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default MorningNourishRoutine;

