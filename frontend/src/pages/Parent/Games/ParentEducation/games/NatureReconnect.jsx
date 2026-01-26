import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { TreePine, Cloud, Bird, Wind, CheckCircle, ArrowRight, Sparkles, Eye } from "lucide-react";

const NatureReconnect = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-95";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [step, setStep] = useState(1); // 1: Observations, 2: Reflection
  const [completedObservations, setCompletedObservations] = useState([]);
  const [reflection, setReflection] = useState("");
  const [showGameOver, setShowGameOver] = useState(false);

  // Nature observation checklist
  const natureObservations = [
    {
      id: 'tree',
      label: 'Observe a Tree',
      description: 'Find a tree and notice its leaves, branches, texture, or movement',
      emoji: '🌳',
      icon: TreePine,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      prompt: 'What do you notice about the tree? Its size, shape, colors, or movement?'
    },
    {
      id: 'sky',
      label: 'Look at the Sky',
      description: 'Observe clouds, colors, or patterns in the sky',
      emoji: '☁️',
      icon: Cloud,
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-300',
      prompt: 'What do you see in the sky? Clouds, colors, or patterns?'
    },
    {
      id: 'birds',
      label: 'Listen for Birds',
      description: 'Notice bird sounds, movement, or appearance',
      emoji: '🐦',
      icon: Bird,
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-300',
      prompt: 'What do you hear or see? Bird sounds, movement, or appearance?'
    },
    {
      id: 'breeze',
      label: 'Feel the Breeze',
      description: 'Notice the air, wind, or temperature on your skin',
      emoji: '💨',
      icon: Wind,
      color: 'from-cyan-400 to-teal-500',
      bgColor: 'from-cyan-50 to-teal-50',
      borderColor: 'border-cyan-300',
      prompt: 'What do you feel? The air, wind, or temperature?'
    },
    {
      id: 'sun',
      label: 'Feel the Sunshine',
      description: 'Notice warmth, light, or sun on your skin',
      emoji: '☀️',
      icon: Sparkles,
      color: 'from-orange-400 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-300',
      prompt: 'What do you feel? Warmth, sunlight, or brightness on your skin?'
    }
  ];

  const handleToggleObservation = (observationId) => {
    setCompletedObservations(prev => {
      if (prev.includes(observationId)) {
        return prev.filter(id => id !== observationId);
      } else {
        return [...prev, observationId];
      }
    });
  };

  const handleContinueToReflection = () => {
    if (completedObservations.length === 5) {
      setStep(2);
    }
  };

  const handleComplete = () => {
    if (reflection.trim().length >= 20) {
      setShowGameOver(true);
    }
  };

  const getSelectedObservations = () => {
    return completedObservations
      .map(id => natureObservations.find(obs => obs.id === id))
      .filter(Boolean);
  };

  if (showGameOver) {
    const selectedObs = getSelectedObservations();

    return (
      <ParentGameShell
        title={gameData?.title || "Nature Reconnect"}
        subtitle="Reconnection Complete!"
        showGameOver={true}
        score={5}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={true}
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
                🌿
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Nature Reconnection Complete!</h2>
              <p className="text-lg text-gray-600">
                You've refreshed your senses by connecting with the natural world.
              </p>
            </div>

            {/* Observations Summary */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Nature Observations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedObs.map((obs, index) => (
                  <motion.div
                    key={obs.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${obs.bgColor} rounded-xl p-5 border-2 ${obs.borderColor}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{obs.emoji}</div>
                      <div>
                        <h4 className="font-bold text-gray-800">{obs.label}</h4>
                        <p className="text-sm text-gray-600">{obs.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Reflection Display */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-green-600" />
                Your Reflection
              </h3>
              <div className="bg-white rounded-lg p-5 border border-green-200">
                <p className="text-gray-800 leading-relaxed italic text-lg">
                  "{reflection}"
                </p>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                The Healing Power of Nature
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Nature Restores:</strong> Nature restores what screens drain. Time spent observing the natural world refreshes your senses, calms your nervous system, and reduces mental fatigue from digital stimulation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Sensory Reset:</strong> Connecting with nature—seeing trees, sky, birds, feeling the breeze—engages your senses in a way that screens cannot. This sensory engagement helps reset your mental state.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Mindful Presence:</strong> Observing nature naturally brings you into the present moment. You notice details, colors, sounds, and sensations that anchor you in the here and now.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Family Connection:</strong> Share nature observations with your children. These shared moments of noticing the natural world create connection and teach them to appreciate the world around them.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Weekend Ritual:</strong> Make nature reconnection a weekend ritual. Regular time outdoors helps balance the digital stimulation of daily life and keeps your family connected to the natural world.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Nature restores what screens drain — make it a weekend ritual. When you regularly spend time observing and connecting with nature, you're doing more than just taking a break—you're actively restoring what digital life depletes. Your senses refresh, your mind calms, and your body relaxes. Make this a family weekend ritual: go outside together, notice trees and sky, listen for birds, feel the breeze. These simple observations reconnect you with the natural world and each other. Nature reminds us that there's a world beyond screens, and that world is essential for our wellbeing.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  // Step 2: Reflection
  if (step === 2) {
    return (
      <ParentGameShell
        title={gameData?.title || "Nature Reconnect"}
        subtitle="Reflect on Your Observations"
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
              <div className="text-6xl mb-4">🌿</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Reflect on Your Experience</h2>
              <p className="text-gray-600">
                Take a moment to reflect on your nature observations.
              </p>
            </div>

            {/* Completed Observations Reminder */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Observations completed:</p>
              <div className="flex flex-wrap gap-2">
                {getSelectedObservations().map((obs) => (
                  <span key={obs.id} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-green-200">
                    <span>{obs.emoji}</span>
                    <span className="text-sm text-gray-700">{obs.label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Reflection Input */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Write Your Reflection</h3>
              <p className="text-sm text-gray-600 mb-4">
                How did connecting with nature make you feel? What did you notice? What did this experience teach you?
              </p>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Write your reflection about your nature observations... How did it feel? What did you notice? What did this experience mean to you?"
                className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-gray-800 min-h-[200px] resize-none"
              />
              <div className="flex justify-between items-center mt-3">
                <p className="text-sm text-gray-600">
                  {(reflection?.length || 0)} characters (minimum 20)
                </p>
                {reflection && reflection.trim().length >= 20 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">Ready to complete</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                Back to Observations
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleComplete}
                disabled={!reflection.trim() || reflection.trim().length < 20}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Complete Reconnection
                <CheckCircle className="w-5 h-5" />
              </motion.button>
            </div>

            {(!reflection.trim() || reflection.trim().length < 20) && (
              <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
                <p className="text-yellow-800 text-sm text-center">
                  Please write at least 20 characters to complete your reflection.
                </p>
              </div>
            )}

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
              <p className="text-sm text-gray-700">
                <strong>💡 Parent Tip:</strong> Nature restores what screens drain — make it a weekend ritual.
              </p>
            </div>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  // Step 1: Observations
  return (
    <ParentGameShell
      title={gameData?.title || "Nature Reconnect"}
      subtitle="Connect with Nature"
      showGameOver={false}
      score={0}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={5}
      currentLevel={1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🌿</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Nature Reconnect</h2>
            <p className="text-gray-600 text-lg">
              Refresh your senses by connecting with the natural world.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">How to Play</h3>
            <p className="text-gray-700 mb-2">
              Go outside or find a window with a view. Complete <strong>all 5 nature observations</strong> from the list below. Notice what you see, hear, and feel in the natural world around you.
            </p>
            <p className="text-sm text-gray-600">
              After completing your observations, you'll write a reflection about your experience.
            </p>
          </div>

          {/* Nature Observations Checklist */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Nature Observations</h3>
            <div className="space-y-4">
              {natureObservations.map((observation, index) => {
                const isCompleted = completedObservations.includes(observation.id);
                return (
                  <motion.div
                    key={observation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${observation.bgColor} rounded-xl p-5 border-2 ${observation.borderColor} cursor-pointer hover:shadow-lg transition-all ${
                      isCompleted ? 'ring-2 ring-green-400' : ''
                    }`}
                    onClick={() => handleToggleObservation(observation.id)}
                  >
                    <div className="flex items-center gap-4">
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
                          <div className="w-12 h-12 rounded-full border-4 border-gray-300 flex items-center justify-center bg-white">
                            <observation.icon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{observation.emoji}</span>
                          <h4 className="text-lg font-bold text-gray-800">{observation.label}</h4>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{observation.description}</p>
                        <p className="text-xs text-gray-600 italic">{observation.prompt}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Progress */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">Observation Progress</p>
              <p className="text-sm font-bold text-gray-800">
                {completedObservations.length}/5 observations
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedObservations.length / natureObservations.length) * 100}%` }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 h-3 rounded-full"
              />
            </div>
            {completedObservations.length === 5 && (
              <div className="mt-3 bg-green-100 rounded-lg p-2 border border-green-300">
                <p className="text-green-800 text-sm text-center font-semibold">
                  ✓ You've completed all 5 observations! Ready to reflect.
                </p>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinueToReflection}
            disabled={completedObservations.length < 5}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continue to Reflection
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          {completedObservations.length < 5 && (
            <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
              <p className="text-yellow-800 text-sm text-center">
                Please complete all 5 nature observations to continue.
              </p>
            </div>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Nature restores what screens drain — make it a weekend ritual. Regular time connecting with nature helps balance digital stimulation and refresh your senses.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default NatureReconnect;

