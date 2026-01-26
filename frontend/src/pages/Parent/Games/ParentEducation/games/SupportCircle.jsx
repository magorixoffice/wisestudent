import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Users, Plus, X, CheckCircle, Heart, UserPlus, TrendingUp } from "lucide-react";

const SupportCircle = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-71";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [step, setStep] = useState(1); // 1: Building, 2: Results
  const [newPersonName, setNewPersonName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("family");
  const [supportPeople, setSupportPeople] = useState([]);
  const [showGameOver, setShowGameOver] = useState(false);

  // Support categories
  const categories = [
    {
      id: 'family',
      label: 'Family',
      emoji: '👨‍👩‍👧‍👦',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-300',
      description: 'Relatives and family members'
    },
    {
      id: 'friends',
      label: 'Friends',
      emoji: '👫',
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-300',
      description: 'Close friends and companions'
    },
    {
      id: 'teachers',
      label: 'Teachers',
      emoji: '👩‍🏫',
      color: 'from-purple-400 to-violet-500',
      bgColor: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-300',
      description: 'Educators and mentors'
    },
    {
      id: 'neighbors',
      label: 'Neighbors',
      emoji: '🏘️',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      description: 'Community and neighbors'
    }
  ];

  const handleAddPerson = () => {
    if (!newPersonName.trim()) return;

    const newPerson = {
      id: Date.now().toString(),
      name: newPersonName.trim(),
      category: selectedCategory,
      addedAt: new Date()
    };

    setSupportPeople(prev => [...prev, newPerson]);
    setNewPersonName("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddPerson();
    }
  };

  const handleRemovePerson = (personId) => {
    setSupportPeople(prev => prev.filter(p => p.id !== personId));
  };

  const calculateSupportScore = () => {
    const totalPeople = supportPeople.length;
    const uniqueCategories = new Set(supportPeople.map(p => p.category)).size;
    
    // Base score from number of people (max 25 points for 5 people)
    let score = Math.min(25, totalPeople * 5);
    
    // Bonus for diversity (having people from different categories)
    const diversityBonus = uniqueCategories * 5; // Up to 20 points for 4 categories
    
    // Total score out of 45, normalized to 100
    const totalPoints = score + diversityBonus;
    return Math.min(100, Math.round((totalPoints / 45) * 100));
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return { label: 'Excellent Support Network', color: 'text-green-600', bg: 'from-green-500 to-emerald-600' };
    if (score >= 60) return { label: 'Strong Support Network', color: 'text-blue-600', bg: 'from-blue-500 to-indigo-600' };
    if (score >= 40) return { label: 'Good Support Network', color: 'text-yellow-600', bg: 'from-yellow-500 to-orange-600' };
    return { label: 'Building Your Support Network', color: 'text-orange-600', bg: 'from-orange-500 to-red-600' };
  };

  const handleComplete = () => {
    if (supportPeople.length >= 5) {
      setStep(2);
      setShowGameOver(true);
    }
  };

  const supportScore = calculateSupportScore();
  const scoreInfo = getScoreLabel(supportScore);
  const peopleByCategory = categories.map(cat => ({
    ...cat,
    people: supportPeople.filter(p => p.category === cat.id)
  }));

  if (showGameOver && step === 2) {
    return (
      <ParentGameShell
        title={gameData?.title || "The Support Circle"}
        subtitle="Support Network Complete!"
        showGameOver={true}
        score={supportScore}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={supportScore >= 60}
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
                💚
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Support Circle Complete!</h2>
            </div>

            {/* Support Score */}
            <div className={`bg-gradient-to-br ${scoreInfo.bg} rounded-xl p-8 mb-8 text-center text-white shadow-lg`}>
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <p className="text-lg font-semibold mb-2 opacity-90">Support Score</p>
              <p className="text-6xl font-bold mb-2">{supportScore}</p>
              <p className="text-xl font-semibold">{scoreInfo.label}</p>
            </div>

            {/* Support Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {peopleByCategory.map((category) => (
                <div
                  key={category.id}
                  className={`bg-gradient-to-br ${category.bgColor} rounded-xl p-6 border-2 ${category.borderColor}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{category.emoji}</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{category.label}</h3>
                      <p className="text-sm text-gray-600">{category.people.length} {category.people.length === 1 ? 'person' : 'people'}</p>
                    </div>
                  </div>
                  {category.people.length > 0 ? (
                    <div className="space-y-2">
                      {category.people.map((person) => (
                        <div
                          key={person.id}
                          className="bg-white rounded-lg px-4 py-2 flex items-center justify-between border border-gray-200"
                        >
                          <span className="text-gray-800 font-medium">{person.name}</span>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No people added yet</p>
                  )}
                </div>
              ))}
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-blue-600" />
                Support Insights
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Total Support People:</strong> {supportPeople.length} {supportPeople.length === 1 ? 'person' : 'people'} identified</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Diversity:</strong> Support from {new Set(supportPeople.map(p => p.category)).size} different areas of your life</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Your Network:</strong> {supportScore >= 60 ? "You have a strong support network! Remember to reach out when you need help." : "Keep building your support network. Strong support systems make parenting easier."}</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Real strength grows from knowing who you can lean on. Your support circle is your safety net—these are the people who will be there when you need emotional support, practical help, or just someone who understands. Don't hesitate to reach out to them, and remember to nurture these relationships. Strong support systems make resilient families.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "The Support Circle"}
      subtitle="Identify Your Support Network"
      showGameOver={false}
      score={0}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={step}
    >
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💚</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Build Your Support Circle</h2>
            <p className="text-gray-600 text-lg">
              Add people who emotionally support you and your family. Include family, friends, teachers, and neighbors.
            </p>
          </div>

          {/* Add Person Form */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add Support Person</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter name (e.g., Sarah, Mom, Ms. Johnson)"
                className="flex-1 px-4 py-3 rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-gray-800"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-gray-800 bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddPerson}
                disabled={!newPersonName.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add
              </motion.button>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              💡 Tip: Think of people who listen, help, or make you feel supported
            </p>
          </div>

          {/* Support Circle Visualization */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Your Support Circle</h3>
            
            {/* Circular Diagram */}
            <div className="relative w-full max-w-2xl mx-auto mb-6">
              <svg viewBox="0 0 400 400" className="w-full h-auto">
                {/* Outer circle */}
                <circle
                  cx="200"
                  cy="200"
                  r="180"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                />
                {/* Middle circle */}
                <circle
                  cx="200"
                  cy="200"
                  r="120"
                  fill="none"
                  stroke="#d1d5db"
                  strokeWidth="2"
                  strokeDasharray="3,3"
                />
                {/* Inner circle */}
                <circle
                  cx="200"
                  cy="200"
                  r="60"
                  fill="#fef3c7"
                  stroke="#f59e0b"
                  strokeWidth="3"
                />
                {/* Center dot */}
                <circle
                  cx="200"
                  cy="200"
                  r="10"
                  fill="#f59e0b"
                />
                {/* Text labels */}
                <text x="200" y="50" textAnchor="middle" className="text-sm font-bold fill-gray-700">
                  Your Support Network
                </text>
                <text x="200" y="350" textAnchor="middle" className="text-xs fill-gray-600">
                  {supportPeople.length} {supportPeople.length === 1 ? 'person' : 'people'} added
                </text>
              </svg>
            </div>

            {/* Category Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => {
                const categoryPeople = supportPeople.filter(p => p.category === category.id);
                return (
                  <div
                    key={category.id}
                    className={`bg-gradient-to-br ${category.bgColor} rounded-xl p-5 border-2 ${category.borderColor}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{category.emoji}</span>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">{category.label}</h4>
                        <p className="text-xs text-gray-600">{category.description}</p>
                      </div>
                      <span className="ml-auto bg-white/60 px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                        {categoryPeople.length}
                      </span>
                    </div>
                    {categoryPeople.length > 0 ? (
                      <div className="space-y-2">
                        {categoryPeople.map((person) => (
                          <motion.div
                            key={person.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-lg px-4 py-2 flex items-center justify-between border border-gray-200 shadow-sm"
                          >
                            <span className="text-gray-800 font-medium">{person.name}</span>
                            <button
                              onClick={() => handleRemovePerson(person.id)}
                              className="p-1 hover:bg-red-100 rounded-full transition-colors"
                            >
                              <X className="w-4 h-4 text-red-500" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic text-center py-4">
                        No {category.label.toLowerCase()} added yet
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Support Score Preview */}
          {supportPeople.length > 0 && (
            <div className={`bg-gradient-to-br ${scoreInfo.bg} rounded-xl p-6 mb-6 text-white text-center shadow-lg`}>
              <div className="flex items-center justify-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6" />
                <h3 className="text-xl font-bold">Current Support Score</h3>
              </div>
              <p className="text-4xl font-bold mb-2">{supportScore}</p>
              <p className="text-sm opacity-90">{scoreInfo.label}</p>
            </div>
          )}

          {/* Complete Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleComplete}
              disabled={supportPeople.length < 5}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              {supportPeople.length < 5 
                ? `Add ${5 - supportPeople.length} more ${5 - supportPeople.length === 1 ? 'person' : 'people'} to complete`
                : 'Complete Support Circle'}
            </motion.button>
          </div>

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Real strength grows from knowing who you can lean on. Take time to identify the people in your life who support you emotionally. These relationships are invaluable for your wellbeing and your family's resilience.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default SupportCircle;

