import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Heart, Sparkles, BookOpen, CheckCircle, Target, ArrowRight } from "lucide-react";

const WhyIParent = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-81";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [step, setStep] = useState(1); // 1: Writing, 2: Value Selection, 3: Complete
  const [reflection, setReflection] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [showGameOver, setShowGameOver] = useState(false);

  // Available value tags
  const valueTags = [
    {
      id: 'love',
      label: 'Love',
      emoji: '💚',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-300',
      description: 'Unconditional care and affection'
    },
    {
      id: 'growth',
      label: 'Growth',
      emoji: '🌱',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      description: 'Continuous learning and development'
    },
    {
      id: 'responsibility',
      label: 'Responsibility',
      emoji: '🛡️',
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-300',
      description: 'Accountability and reliability'
    },
    {
      id: 'joy',
      label: 'Joy',
      emoji: '🌟',
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-300',
      description: 'Happiness and positive energy'
    },
    {
      id: 'empathy',
      label: 'Empathy',
      emoji: '💙',
      color: 'from-cyan-400 to-blue-500',
      bgColor: 'from-cyan-50 to-blue-50',
      borderColor: 'border-cyan-300',
      description: 'Understanding and compassion for others'
    },
    {
      id: 'integrity',
      label: 'Integrity',
      emoji: '⚖️',
      color: 'from-purple-400 to-violet-500',
      bgColor: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-300',
      description: 'Honesty and moral principles'
    },
    {
      id: 'resilience',
      label: 'Resilience',
      emoji: '💪',
      color: 'from-orange-400 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-300',
      description: 'Strength to overcome challenges'
    },
    {
      id: 'creativity',
      label: 'Creativity',
      emoji: '🎨',
      color: 'from-indigo-400 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-300',
      description: 'Innovation and self-expression'
    },
    {
      id: 'kindness',
      label: 'Kindness',
      emoji: '🤗',
      color: 'from-teal-400 to-green-500',
      bgColor: 'from-teal-50 to-green-50',
      borderColor: 'border-teal-300',
      description: 'Gentleness and care for others'
    },
    {
      id: 'curiosity',
      label: 'Curiosity',
      emoji: '🔍',
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-300',
      description: 'Eagerness to explore and learn'
    }
  ];

  const handleValueToggle = (valueId) => {
    setSelectedValues(prev => {
      if (prev.includes(valueId)) {
        // Deselect
        return prev.filter(id => id !== valueId);
      } else {
        // Select (max 5)
        if (prev.length < 5) {
          return [...prev, valueId];
        }
        return prev;
      }
    });
  };

  const handleNext = () => {
    if (step === 1 && reflection.trim().length >= 50) {
      setStep(2);
    } else if (step === 2 && selectedValues.length === 5) {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setShowGameOver(true);
  };

  const getSelectedValuesData = () => {
    return selectedValues
      .map(id => valueTags.find(tag => tag.id === id))
      .filter(Boolean);
  };

  if (showGameOver) {
    const selectedValuesData = getSelectedValuesData();

    return (
      <ParentGameShell
        title={gameData?.title || "Why I Parent"}
        subtitle="Reflection Complete!"
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
                💫
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Parenting Purpose</h2>
              <p className="text-lg text-gray-600">
                You've reconnected with the deeper reason for your parenting journey.
              </p>
            </div>

            {/* Reflection */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                Your Reflection
              </h3>
              <div className="bg-white rounded-lg p-5 border border-blue-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">What kind of human being do I want to raise?</p>
                <p className="text-gray-800 leading-relaxed italic text-lg">"{reflection}"</p>
              </div>
            </div>

            {/* Selected Values */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-600" />
                Your Core Values
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedValuesData.map((value) => (
                  <motion.div
                    key={value.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-gradient-to-br ${value.bgColor} rounded-xl p-6 border-2 ${value.borderColor} text-center`}
                  >
                    <div className="text-4xl mb-3">{value.emoji}</div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{value.label}</h4>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-600" />
                Purpose Brings Patience
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span><strong>Clarity of Purpose:</strong> When you know why you parent—what values you want to instill, what kind of human you want to raise—you have a clear guide for your decisions and reactions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span><strong>Patience Through Purpose:</strong> Reminding yourself of your "why" before reacting helps you respond with intention rather than impulsivity. Purpose brings patience.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span><strong>Values as Anchors:</strong> Your core values (like love, growth, responsibility, joy) serve as anchors in challenging moments, helping you stay aligned with your deeper purpose.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span><strong>Daily Reminders:</strong> Keep this reflection visible. When you're frustrated or overwhelmed, come back to it. Your "why" will remind you of what truly matters.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Purpose brings patience — remind yourself "why" before reacting. When you know the kind of human being you want to raise and the values you want to instill, every challenging moment becomes an opportunity to live those values. Before you react in frustration, pause and remember your "why." Your purpose will guide you toward patience, understanding, and intentional parenting.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  // Step 1: Reflection Writing
  if (step === 1) {
    return (
      <ParentGameShell
        title={gameData?.title || "Why I Parent"}
        subtitle="Reflect on Your Purpose"
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
              <div className="text-6xl mb-4">💫</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Why I Parent</h2>
              <p className="text-gray-600 text-lg">
                Reconnect with the deeper reason you chose this parenting journey.
              </p>
            </div>

            {/* Reflection Prompt */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-7 h-7 text-blue-600" />
                Reflection Prompt
              </h3>
              <div className="bg-white rounded-lg p-5 border border-blue-200 mb-4">
                <p className="text-xl font-semibold text-gray-800 mb-3">
                  "What kind of human being do I want to raise?"
                </p>
                <p className="text-sm text-gray-600">
                  Take a moment to think deeply about this question. What qualities, values, and characteristics do you hope to see in your child(ren)? What matters most to you as a parent? What legacy do you want to leave through your parenting?
                </p>
              </div>
              
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Write your reflection here... Think about the qualities you want to nurture, the values you want to instill, and the kind of person you hope your child becomes. What drives your parenting journey?"
                className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-gray-800 min-h-[250px] resize-none"
              />
              <div className="flex justify-between items-center mt-3">
                <p className="text-sm text-gray-600">
                  {(reflection?.length || 0)} characters (minimum 50)
                </p>
                {reflection && reflection.length >= 50 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">Ready to continue</span>
                  </div>
                )}
              </div>
            </div>

            {/* Examples */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mb-6">
              <p className="text-sm font-semibold text-gray-800 mb-2">💡 Consider these aspects:</p>
              <ul className="text-xs text-gray-700 space-y-1 ml-4">
                <li>• What character traits matter most to you?</li>
                <li>• How do you want your child to treat others?</li>
                <li>• What kind of relationship do you want with them?</li>
                <li>• What values do you want them to carry into adulthood?</li>
                <li>• How do you want them to contribute to the world?</li>
              </ul>
            </div>

            {/* Next Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              disabled={!reflection.trim() || reflection.trim().length < 50}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continue to Value Selection
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            {(!reflection.trim() || reflection.trim().length < 50) && (
              <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
                <p className="text-yellow-800 text-sm text-center">
                  Please write at least 50 characters to continue.
                </p>
              </div>
            )}

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
              <p className="text-sm text-gray-700">
                <strong>💡 Parent Tip:</strong> Purpose brings patience — remind yourself "why" before reacting. Taking time to reflect on your deeper purpose helps guide your parenting decisions.
              </p>
            </div>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  // Step 2: Value Selection
  return (
    <ParentGameShell
      title={gameData?.title || "Why I Parent"}
      subtitle="Choose Your Core Values"
      showGameOver={false}
      score={0}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={2}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose 5 Core Values</h2>
            <p className="text-gray-600">
              Select the 5 values that most align with the kind of human being you want to raise.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Selected: {selectedValues.length}/5
            </p>
          </div>

          {/* Value Tags Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {valueTags.map((value) => {
              const isSelected = selectedValues.includes(value.id);
              return (
                <motion.button
                  key={value.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleValueToggle(value.id)}
                  disabled={!isSelected && selectedValues.length >= 5}
                  className={`p-5 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? `${value.bgColor} ${value.borderColor} border-4 shadow-lg`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  } ${!isSelected && selectedValues.length >= 5 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{value.emoji}</span>
                    {isSelected && (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-1">{value.label}</h4>
                  <p className="text-xs text-gray-600">{value.description}</p>
                </motion.button>
              );
            })}
          </div>

          {/* Selected Values Preview */}
          {selectedValues.length > 0 && (
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border-2 border-purple-200 mb-6">
              <p className="text-sm font-semibold text-gray-800 mb-2">Your selected values:</p>
              <div className="flex flex-wrap gap-2">
                {getSelectedValuesData().map((value) => (
                  <span
                    key={value.id}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${value.color} text-white font-semibold text-sm`}
                  >
                    <span>{value.emoji}</span>
                    <span>{value.label}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
            >
              Back to Reflection
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              disabled={selectedValues.length !== 5}
              className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              View Complete Reflection
              <CheckCircle className="w-5 h-5" />
            </motion.button>
          </div>

          {selectedValues.length !== 5 && (
            <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
              <p className="text-yellow-800 text-sm text-center">
                Please select exactly 5 values to continue.
              </p>
            </div>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> These values will serve as anchors in challenging moments. When you remember what you're raising—not just managing behavior, but nurturing a human being with these core values—you'll find greater patience and purpose.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default WhyIParent;

