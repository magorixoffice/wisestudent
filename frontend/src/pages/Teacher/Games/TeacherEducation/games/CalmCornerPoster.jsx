import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Download, X, Plus, CheckCircle } from "lucide-react";

const CalmCornerPoster = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-16";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [posterItems, setPosterItems] = useState([]);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const posterRef = useRef(null);

  const backgrounds = [
    {
      id: 'soft-blue',
      name: 'Soft Blue',
      gradient: 'from-blue-50 via-cyan-50 to-teal-50',
      color: 'bg-blue-100'
    },
    {
      id: 'lavender',
      name: 'Lavender',
      gradient: 'from-purple-50 via-pink-50 to-rose-50',
      color: 'bg-purple-100'
    },
    {
      id: 'sage-green',
      name: 'Sage Green',
      gradient: 'from-green-50 via-emerald-50 to-teal-50',
      color: 'bg-green-100'
    },
    {
      id: 'warm-beige',
      name: 'Warm Beige',
      gradient: 'from-amber-50 via-orange-50 to-yellow-50',
      color: 'bg-amber-100'
    },
    {
      id: 'misty-gray',
      name: 'Misty Gray',
      gradient: 'from-gray-50 via-slate-50 to-zinc-50',
      color: 'bg-gray-100'
    }
  ];

  const stickers = [
    {
      id: 'plant-1',
      type: 'plant',
      emoji: '🌿',
      label: 'Potted Plant',
      size: 'text-6xl'
    },
    {
      id: 'plant-2',
      type: 'plant',
      emoji: '🌱',
      label: 'Small Plant',
      size: 'text-5xl'
    },
    {
      id: 'candle',
      type: 'candle',
      emoji: '🕯️',
      label: 'Candle',
      size: 'text-5xl'
    },
    {
      id: 'quote-1',
      type: 'quote',
      emoji: '💭',
      label: 'Quote: "Breathe"',
      text: 'Breathe',
      size: 'text-4xl'
    },
    {
      id: 'quote-2',
      type: 'quote',
      emoji: '✨',
      label: 'Quote: "You\'ve got this"',
      text: "You've got this",
      size: 'text-3xl'
    },
    {
      id: 'quote-3',
      type: 'quote',
      emoji: '🌟',
      label: 'Quote: "One moment at a time"',
      text: 'One moment at a time',
      size: 'text-2xl'
    },
    {
      id: 'heart',
      type: 'decoration',
      emoji: '💚',
      label: 'Heart',
      size: 'text-5xl'
    },
    {
      id: 'star',
      type: 'decoration',
      emoji: '⭐',
      label: 'Star',
      size: 'text-5xl'
    },
    {
      id: 'leaf',
      type: 'decoration',
      emoji: '🍃',
      label: 'Leaf',
      size: 'text-5xl'
    },
    {
      id: 'sun',
      type: 'decoration',
      emoji: '☀️',
      label: 'Sun',
      size: 'text-5xl'
    }
  ];

  const handleBackgroundSelect = (bg) => {
    setSelectedBackground(bg);
  };

  const handleStickerClick = (sticker) => {
    if (posterItems.length >= 3) {
      alert("You can add up to 3 soothing visuals. Remove one to add another.");
      return;
    }

    const newItem = {
      ...sticker,
      id: `${sticker.id}-${Date.now()}`,
      x: Math.random() * 60 + 20, // Random position in percentage
      y: Math.random() * 60 + 20,
      rotation: (Math.random() - 0.5) * 15 // Slight rotation
    };

    setPosterItems([...posterItems, newItem]);
  };

  const handleRemoveItem = (itemId) => {
    setPosterItems(posterItems.filter(item => item.id !== itemId));
  };

  const handleSavePoster = () => {
    if (!selectedBackground || posterItems.length < 3) {
      alert("Please select a background and add at least 3 soothing visuals.");
      return;
    }

    // Mark as completed
    setScore(1);
    setShowGameOver(true);

    // Instructions for saving
    setTimeout(() => {
      alert("To save your poster:\n\n1. Take a screenshot of your poster\n2. Or right-click on the poster and select 'Save image as'\n3. Use it as your phone wallpaper or print it for your desk!");
    }, 500);
  };

  const handleDownload = () => {
    if (!posterRef.current) return;

    // Provide instructions for saving
    const instructions = `To save your Calm Corner Poster:\n\n` +
      `1. Take a screenshot:\n` +
      `   • Windows: Press Win + Shift + S, then select the poster area\n` +
      `   • Mac: Press Cmd + Shift + 4, then select the poster area\n` +
      `   • Or use your device's screenshot tool\n\n` +
      `2. Save the screenshot to your device\n\n` +
      `3. Use it as:\n` +
      `   • Phone wallpaper\n` +
      `   • Desktop background\n` +
      `   • Print it for your desk\n\n` +
      `Your poster is ready to use!`;
    
    alert(instructions);
  };

  const currentBg = backgrounds.find(bg => bg.id === selectedBackground) || backgrounds[0];

  return (
    <TeacherGameShell
      title={gameData?.title || "Calm Corner Poster"}
      subtitle={gameData?.description || "Create a personal Calm Corner visual for desk or phone wallpaper"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={1}
    >
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {/* Instructions */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Create Your Calm Corner Poster
            </h2>
            <p className="text-gray-600 mb-2">
              Select a background and add 3 soothing visuals to create your personal calm space poster.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-sm text-blue-800">
                <strong>Progress:</strong> {selectedBackground ? '✓ Background selected' : 'Select background'} • 
                {posterItems.length}/3 visuals added
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Background Selection */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">1. Select Background</h3>
              <div className="space-y-3">
                {backgrounds.map((bg) => (
                  <motion.button
                    key={bg.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBackgroundSelect(bg.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      selectedBackground === bg.id
                        ? 'border-blue-500 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`h-16 rounded-lg bg-gradient-to-br ${bg.gradient} mb-2`}></div>
                    <p className="text-sm font-medium text-gray-700">{bg.name}</p>
                    {selectedBackground === bg.id && (
                      <CheckCircle className="w-5 h-5 text-blue-500 mx-auto mt-1" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Center: Poster Canvas */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">2. Your Poster</h3>
              <div
                ref={posterRef}
                className={`relative w-full aspect-[3/4] rounded-xl border-2 border-gray-300 overflow-hidden bg-gradient-to-br ${currentBg.gradient} shadow-xl`}
                style={{ minHeight: '400px' }}
              >
                {posterItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute cursor-move"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {item.type === 'quote' ? (
                      <div className="relative group">
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border-2 border-white/50">
                          <p className={`font-semibold text-gray-800 ${item.size}`}>
                            {item.text}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative group">
                        <div className={`${item.size} filter drop-shadow-lg`}>
                          {item.emoji}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
                {posterItems.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <p className="text-center">
                      <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <span className="text-sm">Add visuals from the right panel</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Sticker Selection */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">3. Add Soothing Visuals</h3>
              <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
                {stickers.map((sticker) => (
                  <motion.button
                    key={sticker.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStickerClick(sticker)}
                    disabled={posterItems.length >= 3}
                    className={`p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 bg-white transition-all ${
                      posterItems.length >= 3 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <div className={`${sticker.size} mb-2`}>{sticker.emoji}</div>
                    <p className="text-xs text-gray-600 text-center">{sticker.label}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              disabled={!selectedBackground || posterItems.length < 3}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Poster
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSavePoster}
              disabled={!selectedBackground || posterItems.length < 3}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Complete
            </motion.button>
          </div>

          {/* Teacher Tip */}
          <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-amber-900 mb-2">
              💡 Teacher Tip:
            </p>
            <p className="text-sm text-amber-800 leading-relaxed">
              Display posters in the staffroom "Calm Wall". Create a dedicated space where teachers can share their calm corner posters. 
              This creates a visual reminder of self-care and provides inspiration for others. Rotate posters monthly to keep the space fresh 
              and encourage ongoing participation in wellness practices.
            </p>
          </div>
        </div>
      </div>
    </TeacherGameShell>
  );
};

export default CalmCornerPoster;

