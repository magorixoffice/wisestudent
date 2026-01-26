import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Target, Download, Printer, Plus, X, CheckCircle, Sparkles, Heart } from "lucide-react";

const FamilyVisionBoard = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-87";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [step, setStep] = useState(1); // 1: Building, 2: Complete
  const [boardItems, setBoardItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [newCustomGoal, setNewCustomGoal] = useState("");
  const [newCustomQuote, setNewCustomQuote] = useState("");

  // Available quote cards
  const quoteCards = [
    {
      id: 'quote-1',
      type: 'quote',
      text: "Together we grow, together we dream.",
      author: "Family",
      emoji: '💫',
      color: 'from-purple-400 to-violet-500',
      bgColor: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-300'
    },
    {
      id: 'quote-2',
      type: 'quote',
      text: "Our home is built on love and laughter.",
      author: "Family",
      emoji: '🏠',
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-300'
    },
    {
      id: 'quote-3',
      type: 'quote',
      text: "We choose kindness every day.",
      author: "Family",
      emoji: '💚',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300'
    },
    {
      id: 'quote-4',
      type: 'quote',
      text: "Dream big, love bigger.",
      author: "Family",
      emoji: '🌟',
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-300'
    },
    {
      id: 'quote-5',
      type: 'quote',
      text: "In this family, we lift each other up.",
      author: "Family",
      emoji: '🤝',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-300'
    }
  ];

  // Available goal cards
  const goalCards = [
    {
      id: 'goal-1',
      type: 'goal',
      text: "Family adventures",
      description: "Travel and explore together",
      emoji: '✈️',
      color: 'from-cyan-400 to-blue-500',
      bgColor: 'from-cyan-50 to-blue-50',
      borderColor: 'border-cyan-300'
    },
    {
      id: 'goal-2',
      type: 'goal',
      text: "Healthy habits",
      description: "Exercise and eat well as a family",
      emoji: '💪',
      color: 'from-orange-400 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-300'
    },
    {
      id: 'goal-3',
      type: 'goal',
      text: "Learning together",
      description: "Read, learn, and grow",
      emoji: '📚',
      color: 'from-indigo-400 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-300'
    },
    {
      id: 'goal-4',
      type: 'goal',
      text: "Quality time",
      description: "Regular family game nights",
      emoji: '🎲',
      color: 'from-teal-400 to-green-500',
      bgColor: 'from-teal-50 to-green-50',
      borderColor: 'border-teal-300'
    },
    {
      id: 'goal-5',
      type: 'goal',
      text: "Help others",
      description: "Volunteer and give back",
      emoji: '🤗',
      color: 'from-rose-400 to-pink-500',
      bgColor: 'from-rose-50 to-pink-50',
      borderColor: 'border-rose-300'
    },
    {
      id: 'goal-6',
      type: 'goal',
      text: "Financial security",
      description: "Save and plan for the future",
      emoji: '💰',
      color: 'from-amber-400 to-yellow-500',
      bgColor: 'from-amber-50 to-yellow-50',
      borderColor: 'border-amber-300'
    }
  ];

  // Available image placeholders (using emojis/symbols)
  const imageCards = [
    {
      id: 'image-1',
      type: 'image',
      label: 'Family Photo',
      emoji: '👨‍👩‍👧‍👦',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-300'
    },
    {
      id: 'image-2',
      type: 'image',
      label: 'Vacation Dream',
      emoji: '🏖️',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300'
    },
    {
      id: 'image-3',
      type: 'image',
      label: 'Achievement',
      emoji: '🏆',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-300'
    },
    {
      id: 'image-4',
      type: 'image',
      label: 'Home Dream',
      emoji: '🏡',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300'
    }
  ];

  const allAvailableCards = [...quoteCards, ...goalCards, ...imageCards];

  const handleDragStart = (e, card) => {
    setDraggedItem(card);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDropOnBoard = (e) => {
    e.preventDefault();
    if (!draggedItem) return;

    // Create a new item on the board with position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newItem = {
      ...draggedItem,
      id: `${draggedItem.id}-${Date.now()}`,
      x: Math.max(20, Math.min(x - 75, rect.width - 150)), // Keep within bounds
      y: Math.max(20, Math.min(y - 50, rect.height - 100)),
      boardId: Date.now().toString()
    };

    setBoardItems(prev => [...prev, newItem]);
    setDraggedItem(null);
  };

  const handleRemoveFromBoard = (itemId) => {
    setBoardItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleAddCustomGoal = () => {
    if (!newCustomGoal.trim()) return;

    const customGoal = {
      id: `custom-goal-${Date.now()}`,
      type: 'goal',
      text: newCustomGoal.trim(),
      description: "Custom family goal",
      emoji: '🎯',
      color: 'from-purple-400 to-violet-500',
      bgColor: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-300'
    };

    // Add to board directly
    setBoardItems(prev => [...prev, {
      ...customGoal,
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 50,
      boardId: Date.now().toString()
    }]);

    setNewCustomGoal("");
  };

  const handleAddCustomQuote = () => {
    if (!newCustomQuote.trim()) return;

    const customQuote = {
      id: `custom-quote-${Date.now()}`,
      type: 'quote',
      text: newCustomQuote.trim(),
      author: "Family",
      emoji: '💭',
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-300'
    };

    // Add to board directly
    setBoardItems(prev => [...prev, {
      ...customQuote,
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 50,
      boardId: Date.now().toString()
    }]);

    setNewCustomQuote("");
  };

  const handleComplete = () => {
    if (boardItems.length >= 5) {
      setStep(2);
      setShowGameOver(true);
    }
  };

  const handleDownload = () => {
    const content = `Family Vision Board\n\n` +
      `Created: ${new Date().toLocaleDateString()}\n\n` +
      `Vision Items:\n\n` +
      boardItems.map((item, index) => {
        if (item.type === 'quote') {
          return `${index + 1}. QUOTE: "${item.text}" - ${item.author}\n`;
        } else if (item.type === 'goal') {
          return `${index + 1}. GOAL: ${item.text} - ${item.description}\n`;
        } else {
          return `${index + 1}. IMAGE: ${item.label}\n`;
        }
      }).join('\n') +
      `\n\nParent Tip: Let kids add their pictures — shared vision builds shared motivation.\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `family-vision-board-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  if (showGameOver && step === 2) {
    return (
      <ParentGameShell
        title={gameData?.title || "Family Vision Board"}
        subtitle="Vision Board Complete!"
        showGameOver={true}
        score={5}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={boardItems.length >= 5}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-5xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-7xl mb-4"
              >
                🎯
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Family Vision Board</h2>
              <p className="text-lg text-gray-600">
                You've created a shared vision for your family's dreams and goals with {boardItems.length} inspiring elements.
              </p>
            </div>

            {/* Vision Board Display */}
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-xl p-8 border-2 border-purple-200 mb-6 min-h-[500px] relative">
              {boardItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`absolute ${item.bgColor} rounded-lg p-4 border-2 ${item.borderColor} shadow-lg max-w-[200px]`}
                  style={{ left: `${item.x}px`, top: `${item.y}px` }}
                >
                  {item.type === 'quote' && (
                    <div>
                      <div className="text-2xl mb-2">{item.emoji}</div>
                      <p className="font-bold text-gray-800 text-sm italic mb-1">"{item.text}"</p>
                      <p className="text-xs text-gray-600">— {item.author}</p>
                    </div>
                  )}
                  {item.type === 'goal' && (
                    <div>
                      <div className="text-2xl mb-2">{item.emoji}</div>
                      <p className="font-bold text-gray-800 text-sm mb-1">{item.text}</p>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                  )}
                  {item.type === 'image' && (
                    <div className="text-center">
                      <div className="text-4xl mb-2">{item.emoji}</div>
                      <p className="font-bold text-gray-800 text-sm">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-1">[Add photo here]</p>
                    </div>
                  )}
                </motion.div>
              ))}
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
                Download Vision Board
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePrint}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                Print Vision Board
              </motion.button>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-green-600" />
                Living Your Vision
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Display Your Board:</strong> Print or display your vision board somewhere visible in your home where everyone can see it daily—the kitchen, living room, or family room.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Shared Vision, Shared Motivation:</strong> When family members can see and contribute to the vision board, it creates shared motivation and alignment toward common goals.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Let Kids Participate:</strong> Invite children to add their own pictures, drawings, or goals. When kids contribute, they feel ownership and connection to the family vision.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Regular Updates:</strong> Revisit your vision board monthly or quarterly. Celebrate achievements, add new goals, and adjust as your family grows and dreams evolve.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Let kids add their pictures — shared vision builds shared motivation. When children contribute to the family vision board with their own drawings, photos, or goals, they develop a sense of ownership and connection. A vision board created together becomes more than decoration—it becomes a shared commitment, a daily reminder of what you're working toward as a family, and a source of motivation for everyone.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Family Vision Board"}
      subtitle="Create Your Shared Vision"
      showGameOver={false}
      score={0}
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
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Family Vision Board</h2>
            <p className="text-gray-600 text-lg">
              Visualize your family's dreams and goals together.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cards Library */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Add to Board</h3>
              
              {/* Custom Goal Input */}
              <div className="mb-4 bg-purple-50 rounded-lg p-4 border border-purple-200">
                <input
                  type="text"
                  value={newCustomGoal}
                  onChange={(e) => setNewCustomGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomGoal()}
                  placeholder="Add custom goal..."
                  className="w-full px-3 py-2 rounded-lg border border-purple-300 focus:outline-none focus:border-purple-500 mb-2"
                />
                <button
                  onClick={handleAddCustomGoal}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Goal
                </button>
              </div>

              {/* Custom Quote Input */}
              <div className="mb-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <input
                  type="text"
                  value={newCustomQuote}
                  onChange={(e) => setNewCustomQuote(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomQuote()}
                  placeholder="Add custom quote..."
                  className="w-full px-3 py-2 rounded-lg border border-blue-300 focus:outline-none focus:border-blue-500 mb-2"
                />
                <button
                  onClick={handleAddCustomQuote}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Quote
                </button>
              </div>

              {/* Available Cards */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {/* Quotes */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Quotes</p>
                  <div className="space-y-2">
                    {quoteCards.map((card) => (
                      <motion.div
                        key={card.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, card)}
                        whileHover={{ scale: 1.02 }}
                        whileDrag={{ scale: 1.1, rotate: 5 }}
                        className={`bg-gradient-to-br ${card.bgColor} rounded-lg p-3 border-2 ${card.borderColor} cursor-move hover:shadow-lg`}
                      >
                        <div className="text-xl mb-1">{card.emoji}</div>
                        <p className="text-xs font-bold text-gray-800 italic">"{card.text}"</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Goals */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Goals</p>
                  <div className="space-y-2">
                    {goalCards.map((card) => (
                      <motion.div
                        key={card.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, card)}
                        whileHover={{ scale: 1.02 }}
                        whileDrag={{ scale: 1.1, rotate: 5 }}
                        className={`bg-gradient-to-br ${card.bgColor} rounded-lg p-3 border-2 ${card.borderColor} cursor-move hover:shadow-lg`}
                      >
                        <div className="text-xl mb-1">{card.emoji}</div>
                        <p className="text-xs font-bold text-gray-800">{card.text}</p>
                        <p className="text-xs text-gray-600">{card.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Images</p>
                  <div className="space-y-2">
                    {imageCards.map((card) => (
                      <motion.div
                        key={card.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, card)}
                        whileHover={{ scale: 1.02 }}
                        whileDrag={{ scale: 1.1, rotate: 5 }}
                        className={`bg-gradient-to-br ${card.bgColor} rounded-lg p-3 border-2 ${card.borderColor} cursor-move hover:shadow-lg text-center`}
                      >
                        <div className="text-2xl mb-1">{card.emoji}</div>
                        <p className="text-xs font-bold text-gray-800">{card.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Vision Board */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Your Vision Board ({boardItems.length} items)
              </h3>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDropOnBoard}
                className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-xl p-8 border-2 border-dashed border-purple-300 min-h-[600px] relative"
              >
                {boardItems.length === 0 ? (
                  <div className="text-center py-32 text-gray-400">
                    <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="font-semibold text-lg">Drag items here to build your vision board</p>
                    <p className="text-sm mt-2">Add at least 5 items to complete</p>
                  </div>
                ) : (
                  boardItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`absolute ${item.bgColor} rounded-lg p-4 border-2 ${item.borderColor} shadow-md max-w-[200px] group`}
                      style={{ left: `${item.x}px`, top: `${item.y}px` }}
                    >
                      {item.type === 'quote' && (
                        <div>
                          <div className="text-2xl mb-2">{item.emoji}</div>
                          <p className="font-bold text-gray-800 text-sm italic mb-1">"{item.text}"</p>
                          <p className="text-xs text-gray-600">— {item.author}</p>
                        </div>
                      )}
                      {item.type === 'goal' && (
                        <div>
                          <div className="text-2xl mb-2">{item.emoji}</div>
                          <p className="font-bold text-gray-800 text-sm mb-1">{item.text}</p>
                          <p className="text-xs text-gray-600">{item.description}</p>
                        </div>
                      )}
                      {item.type === 'image' && (
                        <div className="text-center">
                          <div className="text-4xl mb-2">{item.emoji}</div>
                          <p className="font-bold text-gray-800 text-sm">{item.label}</p>
                          <p className="text-xs text-gray-500 mt-1">[Add photo]</p>
                        </div>
                      )}
                      <button
                        onClick={() => handleRemoveFromBoard(item.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Complete Button */}
          <div className="mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleComplete}
              disabled={boardItems.length < 5}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Complete Vision Board
            </motion.button>

            {boardItems.length < 5 && (
              <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
                <p className="text-yellow-800 text-sm text-center">
                  Please add at least 5 items to your vision board to complete it. You've added {boardItems.length} of 5 required items.
                </p>
              </div>
            )}
          </div>

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Let kids add their pictures — shared vision builds shared motivation. Display your vision board at home where everyone can see it daily.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default FamilyVisionBoard;

