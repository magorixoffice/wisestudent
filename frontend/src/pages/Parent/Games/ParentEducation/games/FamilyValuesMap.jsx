import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Map, Download, Share2, CheckCircle, Sparkles, Heart } from "lucide-react";

const FamilyValuesMap = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-84";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [selectedValues, setSelectedValues] = useState([]);
  const [draggedValue, setDraggedValue] = useState(null);
  const [showGameOver, setShowGameOver] = useState(false);

  // All 12 value cards
  const allValues = [
    {
      id: 'respect',
      label: 'Respect',
      emoji: '🙏',
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-300',
      description: 'Treating others with dignity and consideration'
    },
    {
      id: 'honesty',
      label: 'Honesty',
      emoji: '💎',
      color: 'from-cyan-400 to-blue-500',
      bgColor: 'from-cyan-50 to-blue-50',
      borderColor: 'border-cyan-300',
      description: 'Truthfulness and integrity in all interactions'
    },
    {
      id: 'gratitude',
      label: 'Gratitude',
      emoji: '🙏',
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-300',
      description: 'Appreciating what we have and expressing thanks'
    },
    {
      id: 'creativity',
      label: 'Creativity',
      emoji: '🎨',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-300',
      description: 'Encouraging innovation and self-expression'
    },
    {
      id: 'faith',
      label: 'Faith',
      emoji: '✨',
      color: 'from-purple-400 to-violet-500',
      bgColor: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-300',
      description: 'Belief in something greater and maintaining hope'
    },
    {
      id: 'compassion',
      label: 'Compassion',
      emoji: '💙',
      color: 'from-teal-400 to-cyan-500',
      bgColor: 'from-teal-50 to-cyan-50',
      borderColor: 'border-teal-300',
      description: 'Showing kindness and empathy toward others'
    },
    {
      id: 'responsibility',
      label: 'Responsibility',
      emoji: '🛡️',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      description: 'Being accountable for actions and choices'
    },
    {
      id: 'curiosity',
      label: 'Curiosity',
      emoji: '🔍',
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-300',
      description: 'Embracing learning and asking questions'
    },
    {
      id: 'kindness',
      label: 'Kindness',
      emoji: '🤗',
      color: 'from-rose-400 to-pink-500',
      bgColor: 'from-rose-50 to-pink-50',
      borderColor: 'border-rose-300',
      description: 'Gentle, caring treatment of others'
    },
    {
      id: 'perseverance',
      label: 'Perseverance',
      emoji: '💪',
      color: 'from-red-400 to-orange-500',
      bgColor: 'from-red-50 to-orange-50',
      borderColor: 'border-red-300',
      description: 'Persistence and determination through challenges'
    },
    {
      id: 'generosity',
      label: 'Generosity',
      emoji: '💝',
      color: 'from-indigo-400 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-300',
      description: 'Giving freely of time, resources, and self'
    },
    {
      id: 'courage',
      label: 'Courage',
      emoji: '🦁',
      color: 'from-orange-400 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-300',
      description: 'Bravery to face fears and do what is right'
    }
  ];

  const handleDragStart = (e, value) => {
    setDraggedValue(value);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropToMap = (e) => {
    e.preventDefault();
    if (!draggedValue) return;

    // Check if value is already in selected values
    const isAlreadySelected = selectedValues.some(v => v.id === draggedValue.id);
    
    // Check if we have space (max 5)
    if (!isAlreadySelected && selectedValues.length < 5) {
      setSelectedValues(prev => [...prev, draggedValue]);
    }

    setDraggedValue(null);
  };

  const handleRemoveFromMap = (valueId) => {
    setSelectedValues(prev => prev.filter(v => v.id !== valueId));
  };

  const handleComplete = () => {
    if (selectedValues.length === 5) {
      setShowGameOver(true);
    }
  };

  const handleDownload = () => {
    const content = `Family Values Map\n\n` +
      `Created: ${new Date().toLocaleDateString()}\n\n` +
      `Core Values:\n` +
      selectedValues.map((value, index) => 
        `${index + 1}. ${value.label} ${value.emoji}\n   ${value.description}\n`
      ).join('\n') +
      `\n\nParent Tip: Revisit your map once a year—values evolve as your family grows.\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `family-values-map-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const text = `Our Family Values Map:\n\n` +
      selectedValues.map((value, index) => `${index + 1}. ${value.label} ${value.emoji}`).join('\n') +
      `\n\nRevisit once a year—values evolve as families grow!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Family Values Map',
          text: text
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          // Fallback to clipboard
          navigator.clipboard.writeText(text);
          alert('Values map copied to clipboard!');
        }
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(text);
      alert('Values map copied to clipboard!');
    }
  };

  // Get available values (not yet selected)
  const availableValues = allValues.filter(
    value => !selectedValues.some(selected => selected.id === value.id)
  );

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Family Values Map"}
        subtitle="Values Map Complete!"
        showGameOver={true}
        score={selectedValues.length}
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
                🗺️
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Family Values Map</h2>
              <p className="text-lg text-gray-600">
                The 5 core values that guide your family decisions.
              </p>
            </div>

            {/* Values Map Display */}
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-xl p-8 border-2 border-purple-200 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedValues.map((value, index) => (
                  <motion.div
                    key={value.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${value.bgColor} rounded-xl p-6 border-2 ${value.borderColor} shadow-lg`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-5xl">{value.emoji}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{value.label}</h3>
                        <p className="text-sm text-gray-600">{value.description}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 font-semibold">
                      Value #{index + 1}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownload}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Map
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share Map
              </motion.button>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-green-600" />
                Living Your Values
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Decision Guide:</strong> Your family values map serves as a compass for daily decisions. When faced with choices, ask: "Which of our values does this align with?"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Family Conversations:</strong> Share this map with your children. Discuss how these values show up in daily life and celebrate moments when family members demonstrate them.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Evolution:</strong> Values are not static—they evolve as your family grows. Revisit this map annually to see if it still reflects who you are becoming.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Modeling:</strong> Children learn values more from what they see than what they hear. Your actions aligned with these values teach them more powerfully than words alone.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Revisit your map once a year—values evolve as your family grows. As your children age and your family experiences change, your core values may shift or deepen. Setting aside time annually to reflect on and update your family values map keeps it relevant and meaningful. Display this map somewhere visible in your home as a daily reminder of what guides your family decisions.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Family Values Map"}
      subtitle="Define Your Core Values"
      showGameOver={false}
      score={selectedValues.length}
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
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Family Values Map</h2>
            <p className="text-gray-600 text-lg">
              Define the 5 core values that guide your family decisions.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Drag values from the library to your map (5 values required)
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Available Values Library */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Available Values</h3>
              <div
                onDragOver={handleDragOver}
                className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-300 min-h-[400px] max-h-[500px] overflow-y-auto"
              >
                {availableValues.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>All values have been added to your map!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {availableValues.map((value) => (
                      <motion.div
                        key={value.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, value)}
                        whileHover={{ scale: 1.02 }}
                        whileDrag={{ scale: 1.1, rotate: 5 }}
                        className={`bg-gradient-to-br ${value.bgColor} rounded-lg p-4 border-2 ${value.borderColor} cursor-move hover:shadow-lg transition-all`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{value.emoji}</div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800">{value.label}</h4>
                            <p className="text-xs text-gray-600">{value.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Values Map (Drop Zone) */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Your Values Map ({selectedValues.length}/5)
              </h3>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDropToMap}
                className={`bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-xl p-6 border-2 ${
                  draggedValue && selectedValues.length < 5
                    ? 'border-purple-500 border-dashed'
                    : 'border-purple-300'
                } min-h-[400px] transition-all`}
              >
                {selectedValues.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <Map className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-semibold">Drag 5 values here to build your map</p>
                    <p className="text-sm mt-2">Values will guide your family decisions</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedValues.map((value, index) => (
                      <motion.div
                        key={value.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`bg-gradient-to-br ${value.bgColor} rounded-lg p-4 border-2 ${value.borderColor} shadow-md relative group`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{value.emoji}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-gray-800">{value.label}</h4>
                              <span className="text-xs text-gray-500 font-semibold">#{index + 1}</span>
                            </div>
                            <p className="text-xs text-gray-600">{value.description}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveFromMap(value.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    {selectedValues.length < 5 && (
                      <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg mt-4">
                        <p className="text-sm">
                          Drag {5 - selectedValues.length} more value{5 - selectedValues.length === 1 ? '' : 's'} here
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">Map Progress</p>
              <p className="text-sm font-bold text-gray-800">
                {selectedValues.length}/5 values selected
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(selectedValues.length / 5) * 100}%` }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full"
              />
            </div>
          </div>

          {/* Complete Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleComplete}
            disabled={selectedValues.length !== 5}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Save Values Map
          </motion.button>

          {selectedValues.length !== 5 && (
            <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
              <p className="text-yellow-800 text-sm text-center">
                Please select exactly 5 values to complete your family values map.
              </p>
            </div>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Revisit your map once a year—values evolve as your family grows. Display this map in your home as a reminder of what guides your family decisions.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default FamilyValuesMap;

