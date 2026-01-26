import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Users, Plus, X, CheckCircle, UserPlus, Heart, Shield, Sparkles } from "lucide-react";

const SupportNetworkBuilder = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-58";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [step, setStep] = useState(1); // 1: Building, 2: Complete
  const [newPersonName, setNewPersonName] = useState("");
  const [availablePeople, setAvailablePeople] = useState([]);
  const [innerCircle, setInnerCircle] = useState([]);
  const [outerCircle, setOuterCircle] = useState([]);
  const [backupCircle, setBackupCircle] = useState([]);
  const [draggedPerson, setDraggedPerson] = useState(null);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Circle definitions
  const circles = [
    {
      id: 'inner',
      label: 'Inner Circle',
      description: 'Your closest, most trusted support. People you can call anytime, who truly understand you.',
      color: 'from-red-400 to-pink-500',
      bgColor: 'from-red-50 to-pink-50',
      borderColor: 'border-red-300',
      icon: Heart,
      emoji: '💝'
    },
    {
      id: 'outer',
      label: 'Outer Circle',
      description: 'Reliable friends, family, or colleagues. People you can reach out to when needed.',
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-300',
      icon: Users,
      emoji: '🤝'
    },
    {
      id: 'backup',
      label: 'Backup Circle',
      description: 'Professional support or community resources. Therapists, support groups, or helpful services.',
      color: 'from-purple-400 to-violet-500',
      bgColor: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-300',
      icon: Shield,
      emoji: '🛡️'
    }
  ];

  const handleAddPerson = () => {
    if (!newPersonName.trim()) return;

    const newPerson = {
      id: Date.now().toString(),
      name: newPersonName.trim(),
      circle: null // Not yet placed in any circle
    };

    setAvailablePeople(prev => [...prev, newPerson]);
    setNewPersonName("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddPerson();
    }
  };

  const handleDragStart = (e, person) => {
    setDraggedPerson(person);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, circleId) => {
    e.preventDefault();
    if (!draggedPerson) return;

    // Remove person from their current location
    setAvailablePeople(prev => prev.filter(p => p.id !== draggedPerson.id));
    setInnerCircle(prev => prev.filter(p => p.id !== draggedPerson.id));
    setOuterCircle(prev => prev.filter(p => p.id !== draggedPerson.id));
    setBackupCircle(prev => prev.filter(p => p.id !== draggedPerson.id));

    // Add to new circle
    const updatedPerson = { ...draggedPerson, circle: circleId };
    
    if (circleId === 'inner') {
      setInnerCircle(prev => [...prev, updatedPerson]);
    } else if (circleId === 'outer') {
      setOuterCircle(prev => [...prev, updatedPerson]);
    } else if (circleId === 'backup') {
      setBackupCircle(prev => [...prev, updatedPerson]);
    }

    setDraggedPerson(null);
  };

  const handleRemovePerson = (personId, circleId) => {
    // Find the person
    let personToRemove = null;
    
    if (circleId === 'inner') {
      personToRemove = innerCircle.find(p => p.id === personId);
      setInnerCircle(prev => prev.filter(p => p.id !== personId));
    } else if (circleId === 'outer') {
      personToRemove = outerCircle.find(p => p.id === personId);
      setOuterCircle(prev => prev.filter(p => p.id !== personId));
    } else if (circleId === 'backup') {
      personToRemove = backupCircle.find(p => p.id === personId);
      setBackupCircle(prev => prev.filter(p => p.id !== personId));
    }

    // Return to available people
    if (personToRemove) {
      setAvailablePeople(prev => [...prev, { ...personToRemove, circle: null }]);
    }
  };

  const handleComplete = () => {
    const totalPeople = innerCircle.length + outerCircle.length + backupCircle.length;
    if (totalPeople >= 5) {
      setScore(Math.min(5, totalPeople)); // Score based on number of people (max 5)
      setStep(2);
      setShowGameOver(true);
    }
  };

  const allPeople = [...innerCircle, ...outerCircle, ...backupCircle];
  const totalPeople = allPeople.length;

  if (showGameOver && step === 2) {
    return (
      <ParentGameShell
        title={gameData?.title || "Support Network Builder"}
        subtitle="Network Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={1}
        allAnswersCorrect={score >= 5}
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
                🤝
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Support Network is Complete!</h2>
              <p className="text-lg text-gray-600 mb-6">
                You've identified {totalPeople} people in your support network. Remember: asking for support is an act of strength, not weakness.
              </p>
            </div>

            {/* Network Summary */}
            <div className="space-y-6 mb-6">
              {circles.map((circle) => {
                const people = circle.id === 'inner' ? innerCircle : circle.id === 'outer' ? outerCircle : backupCircle;
                const CircleIcon = circle.icon;

                if (people.length === 0) return null;

                return (
                  <div key={circle.id} className={`bg-gradient-to-br ${circle.bgColor} rounded-xl p-6 border-2 ${circle.borderColor}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <CircleIcon className={`w-6 h-6 text-white bg-gradient-to-br ${circle.color} rounded-lg p-1.5`} />
                      <h3 className="text-xl font-bold text-gray-800">{circle.label}</h3>
                      <span className="text-2xl">{circle.emoji}</span>
                      <span className="ml-auto bg-white rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                        {people.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {people.map((person) => (
                        <div key={person.id} className="bg-white rounded-lg p-3 flex items-center justify-between">
                          <span className="text-gray-800 font-medium">{person.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Asking for support is an act of strength, not weakness. Your support network is your safety net—people who help you bounce back emotionally. When you reach out for help, you're modeling for your children that it's okay to need others, that connection matters, and that we all need support sometimes. Your willingness to ask for help teaches your children that they can too. Remember: building and maintaining these connections is ongoing. Reach out to someone in your network today, even just to check in.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Support Network Builder"}
      subtitle="Build Your Support Network"
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={1}
    >
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Build Your Support Network</h2>
            <p className="text-gray-600 text-lg">
              Identify the people who help you bounce back emotionally. Drag them into the circle that best fits your relationship.
            </p>
          </div>

          {/* Add Person Input */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Add Someone to Your Network
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter name or relationship (e.g., 'Sarah', 'My sister', 'Therapist Dr. Smith', 'Mom Support Group')"
                className="flex-1 px-4 py-3 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddPerson}
                disabled={!newPersonName.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add
              </motion.button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Add at least 5 people to continue. You can add family, friends, professionals, or support groups.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Available People */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-gray-600" />
                Available People
              </h3>
              {availablePeople.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <p className="text-gray-400">Add people above, then drag them into a circle.</p>
                </div>
              ) : (
                <div className="space-y-2 min-h-[150px]">
                  <AnimatePresence>
                    {availablePeople.map((person) => (
                      <motion.div
                        key={person.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, person)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        whileDrag={{ scale: 1.1, rotate: 5, opacity: 0.8 }}
                        className="bg-white border-2 border-gray-300 rounded-lg p-3 cursor-move hover:shadow-md transition-all flex items-center justify-between group"
                      >
                        <span className="text-gray-800 font-medium">{person.name}</span>
                        <button
                          onClick={() => setAvailablePeople(prev => prev.filter(p => p.id !== person.id))}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Network Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Network Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Total People:</span>
                  <span className="text-2xl font-bold text-blue-600">{totalPeople}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-red-600">{innerCircle.length}</div>
                    <div className="text-xs text-gray-600">Inner</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">{outerCircle.length}</div>
                    <div className="text-xs text-gray-600">Outer</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">{backupCircle.length}</div>
                    <div className="text-xs text-gray-600">Backup</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Map - Three Circles */}
          <div className="relative mb-6 flex items-center justify-center" style={{ minHeight: '600px' }}>
            {/* Backup Circle (Outermost) */}
            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'backup')}
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] sm:w-[520px] sm:h-[520px] rounded-full bg-gradient-to-br ${circles[2].bgColor} border-4 ${circles[2].borderColor} p-8 sm:p-10 flex flex-col items-center justify-center transition-all ${
                draggedPerson ? 'scale-105 shadow-xl border-purple-500' : ''
              }`}
              style={{ zIndex: 1 }}
            >
              <Shield className={`w-10 h-10 sm:w-12 sm:h-12 text-white bg-gradient-to-br ${circles[2].color} rounded-full p-2 mb-2`} />
              <h3 className="font-bold text-gray-800 mb-1 text-center text-sm sm:text-base">{circles[2].label}</h3>
              <p className="text-xs text-gray-600 text-center mb-3 px-4 sm:px-8">{circles[2].description}</p>
              <div className="space-y-1.5 sm:space-y-2 w-full max-h-40 sm:max-h-48 overflow-y-auto px-4 sm:px-8">
                {backupCircle.map((person) => (
                  <div
                    key={person.id}
                    className="bg-white rounded-lg p-1.5 sm:p-2 text-xs font-medium text-gray-800 flex items-center justify-between group"
                  >
                    <span className="truncate flex-1">{person.name}</span>
                    <button
                      onClick={() => handleRemovePerson(person.id, 'backup')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2"
                    >
                      <X className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="text-3xl sm:text-4xl mt-2">{circles[2].emoji}</div>
            </div>

            {/* Outer Circle (Middle) */}
            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'outer')}
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br ${circles[1].bgColor} border-4 ${circles[1].borderColor} p-6 sm:p-8 flex flex-col items-center justify-center transition-all ${
                draggedPerson ? 'scale-105 shadow-xl border-blue-500' : ''
              }`}
              style={{ zIndex: 2 }}
            >
              <Users className={`w-8 h-8 sm:w-10 sm:h-10 text-white bg-gradient-to-br ${circles[1].color} rounded-full p-2 mb-2`} />
              <h3 className="font-bold text-gray-800 mb-1 text-center text-sm sm:text-base">{circles[1].label}</h3>
              <p className="text-xs text-gray-600 text-center mb-3 px-2 sm:px-4">{circles[1].description}</p>
              <div className="space-y-1.5 sm:space-y-2 w-full max-h-32 sm:max-h-40 overflow-y-auto px-2 sm:px-4">
                {outerCircle.map((person) => (
                  <div
                    key={person.id}
                    className="bg-white rounded-lg p-1.5 sm:p-2 text-xs font-medium text-gray-800 flex items-center justify-between group"
                  >
                    <span className="truncate flex-1">{person.name}</span>
                    <button
                      onClick={() => handleRemovePerson(person.id, 'outer')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2"
                    >
                      <X className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="text-2xl sm:text-3xl mt-2">{circles[1].emoji}</div>
            </div>

            {/* Inner Circle (Innermost) */}
            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'inner')}
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br ${circles[0].bgColor} border-4 ${circles[0].borderColor} p-4 sm:p-6 flex flex-col items-center justify-center transition-all ${
                draggedPerson ? 'scale-105 shadow-xl border-red-500' : ''
              }`}
              style={{ zIndex: 3 }}
            >
              <Heart className={`w-6 h-6 sm:w-8 sm:h-8 text-white bg-gradient-to-br ${circles[0].color} rounded-full p-1.5 sm:p-2 mb-2`} />
              <h3 className="font-bold text-gray-800 mb-1 text-center text-xs sm:text-sm">{circles[0].label}</h3>
              <p className="text-xs text-gray-600 text-center mb-2 sm:mb-3 px-2 hidden sm:block">{circles[0].description}</p>
              <div className="space-y-1 sm:space-y-2 w-full max-h-24 sm:max-h-32 overflow-y-auto">
                {innerCircle.map((person) => (
                  <div
                    key={person.id}
                    className="bg-white rounded-lg p-1.5 sm:p-2 text-xs font-medium text-gray-800 flex items-center justify-between group"
                  >
                    <span className="truncate flex-1 text-xs">{person.name}</span>
                    <button
                      onClick={() => handleRemovePerson(person.id, 'inner')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1"
                    >
                      <X className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="text-xl sm:text-2xl mt-1 sm:mt-2">{circles[0].emoji}</div>
            </div>
          </div>

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mb-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Asking for support is an act of strength, not weakness. When you identify and build your support network, you're creating a safety net that helps you bounce back emotionally. This strength teaches your children that it's okay to need others and that connection matters.
            </p>
          </div>

          {/* Complete Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleComplete}
            disabled={totalPeople < 5}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Complete Network ({totalPeople >= 5 ? 'Ready' : `Need ${5 - totalPeople} more`})
          </motion.button>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default SupportNetworkBuilder;

