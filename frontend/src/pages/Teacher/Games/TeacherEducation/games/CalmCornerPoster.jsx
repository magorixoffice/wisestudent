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
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [posterItems, setPosterItems] = useState([]);
  const [completedPosters, setCompletedPosters] = useState({});
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const posterRef = useRef(null);

  const posterThemes = [
    {
      id: 1,
      title: "Calm Corner Poster",
      description: "Create a personal Calm Corner visual for desk or phone wallpaper",
      backgrounds: [
        { id: 'soft-blue', name: 'Soft Blue', gradient: 'from-blue-50 via-cyan-50 to-teal-50' },
        { id: 'lavender', name: 'Lavender', gradient: 'from-purple-50 via-pink-50 to-rose-50' },
        { id: 'sage-green', name: 'Sage Green', gradient: 'from-green-50 via-emerald-50 to-teal-50' },
        { id: 'warm-beige', name: 'Warm Beige', gradient: 'from-amber-50 via-orange-50 to-yellow-50' },
        { id: 'misty-gray', name: 'Misty Gray', gradient: 'from-gray-50 via-slate-50 to-zinc-50' }
      ],
      stickers: [
        { id: 'plant-1', type: 'plant', emoji: '🌿', label: 'Potted Plant', size: 'text-6xl' },
        { id: 'plant-2', type: 'plant', emoji: '🌱', label: 'Small Plant', size: 'text-5xl' },
        { id: 'candle', type: 'candle', emoji: '🕯️', label: 'Candle', size: 'text-5xl' },
        { id: 'quote-1', type: 'quote', emoji: '💭', label: 'Quote: "Breathe"', text: 'Breathe', size: 'text-4xl' },
        { id: 'quote-2', type: 'quote', emoji: '✨', label: 'Quote: "You\'ve got this"', text: "You've got this", size: 'text-3xl' },
        { id: 'quote-3', type: 'quote', emoji: '🌟', label: 'Quote: "One moment at a time"', text: 'One moment at a time', size: 'text-2xl' },
        { id: 'heart', type: 'decoration', emoji: '💚', label: 'Heart', size: 'text-5xl' },
        { id: 'star', type: 'decoration', emoji: '⭐', label: 'Star', size: 'text-5xl' },
        { id: 'leaf', type: 'decoration', emoji: '🍃', label: 'Leaf', size: 'text-5xl' },
        { id: 'sun', type: 'decoration', emoji: '☀️', label: 'Sun', size: 'text-5xl' }
      ]
    },
    {
      id: 2,
      title: "Focus Flow Poster",
      description: "Design a visual reminder for sustained concentration and mindful attention",
      backgrounds: [
        { id: 'deep-blue', name: 'Deep Focus Blue', gradient: 'from-blue-100 via-indigo-100 to-violet-100' },
        { id: 'forest-green', name: 'Forest Green', gradient: 'from-green-100 via-emerald-100 to-teal-100' },
        { id: 'amber-gold', name: 'Amber Gold', gradient: 'from-amber-100 via-yellow-100 to-orange-100' },
        { id: 'cool-gray', name: 'Cool Gray', gradient: 'from-gray-100 via-slate-100 to-zinc-100' },
        { id: 'purple-haze', name: 'Purple Haze', gradient: 'from-purple-100 via-fuchsia-100 to-pink-100' }
      ],
      stickers: [
        { id: 'brain', type: 'icon', emoji: '🧠', label: 'Focused Brain', size: 'text-5xl' },
        { id: 'target', type: 'icon', emoji: '🎯', label: 'Target Focus', size: 'text-5xl' },
        { id: 'clock', type: 'icon', emoji: '⏰', label: 'Time Management', size: 'text-5xl' },
        { id: 'quote-focus', type: 'quote', emoji: '✨', label: 'Quote: "Deep Work"', text: 'Deep Work', size: 'text-3xl' },
        { id: 'quote-concentrate', type: 'quote', emoji: '💭', label: 'Quote: "One Thing"', text: 'One Thing', size: 'text-2xl' },
        { id: 'zen-circle', type: 'decoration', emoji: '⭕', label: 'Zen Circle', size: 'text-5xl' },
        { id: 'lightning', type: 'decoration', emoji: '⚡', label: 'Lightning Bolt', size: 'text-4xl' },
        { id: 'mountain', type: 'decoration', emoji: '⛰️', label: 'Mountain Peak', size: 'text-5xl' },
        { id: 'book', type: 'icon', emoji: '📚', label: 'Study Book', size: 'text-4xl' },
        { id: 'meditation', type: 'icon', emoji: '🧘', label: 'Meditation', size: 'text-4xl' }
      ]
    },
    {
      id: 3,
      title: "Growth Mindset Poster",
      description: "Create an inspiring visual that celebrates learning from challenges",
      backgrounds: [
        { id: 'sunrise-orange', name: 'Sunrise Orange', gradient: 'from-orange-100 via-amber-100 to-yellow-100' },
        { id: 'spring-green', name: 'Spring Green', gradient: 'from-green-100 via-lime-100 to-emerald-100' },
        { id: 'sky-blue', name: 'Sky Blue', gradient: 'from-sky-100 via-blue-100 to-cyan-100' },
        { id: 'coral-pink', name: 'Coral Pink', gradient: 'from-rose-100 via-pink-100 to-fuchsia-100' },
        { id: 'lavender-purple', name: 'Lavender Purple', gradient: 'from-purple-100 via-violet-100 to-indigo-100' }
      ],
      stickers: [
        { id: 'sprout', type: 'plant', emoji: '🌱', label: 'Growing Sprout', size: 'text-5xl' },
        { id: 'up-arrow', type: 'icon', emoji: '📈', label: 'Growth Arrow', size: 'text-5xl' },
        { id: 'lightbulb', type: 'icon', emoji: '💡', label: 'Bright Idea', size: 'text-5xl' },
        { id: 'quote-grow', type: 'quote', emoji: '✨', label: 'Quote: "Grow"', text: 'Grow', size: 'text-4xl' },
        { id: 'quote-learn', type: 'quote', emoji: '📚', label: 'Quote: "Learn"', text: 'Learn', size: 'text-3xl' },
        { id: 'quote-improve', type: 'quote', emoji: '🚀', label: 'Quote: "Improve"', text: 'Improve', size: 'text-3xl' },
        { id: 'star-progress', type: 'decoration', emoji: '⭐', label: 'Progress Star', size: 'text-4xl' },
        { id: 'flower-bloom', type: 'decoration', emoji: '🌸', label: 'Blooming Flower', size: 'text-5xl' },
        { id: 'muscle', type: 'icon', emoji: '💪', label: 'Strength Muscle', size: 'text-4xl' },
        { id: 'trophy', type: 'icon', emoji: '🏆', label: 'Achievement Trophy', size: 'text-4xl' }
      ]
    },
    {
      id: 4,
      title: "Kindness Canvas",
      description: "Design a heart-centered poster promoting empathy and positive relationships",
      backgrounds: [
        { id: 'warm-pink', name: 'Warm Pink', gradient: 'from-pink-100 via-rose-100 to-red-100' },
        { id: 'soft-yellow', name: 'Soft Yellow', gradient: 'from-yellow-100 via-amber-100 to-orange-100' },
        { id: 'gentle-purple', name: 'Gentle Purple', gradient: 'from-purple-100 via-fuchsia-100 to-pink-100' },
        { id: 'peaceful-blue', name: 'Peaceful Blue', gradient: 'from-blue-100 via-cyan-100 to-teal-100' },
        { id: 'serene-green', name: 'Serene Green', gradient: 'from-green-100 via-emerald-100 to-lime-100' }
      ],
      stickers: [
        { id: 'heart-red', type: 'decoration', emoji: '❤️', label: 'Red Heart', size: 'text-5xl' },
        { id: 'hands', type: 'icon', emoji: '🤝', label: 'Helping Hands', size: 'text-5xl' },
        { id: 'smiley', type: 'face', emoji: '😊', label: 'Happy Face', size: 'text-5xl' },
        { id: 'quote-kind', type: 'quote', emoji: '✨', label: 'Quote: "Be Kind"', text: 'Be Kind', size: 'text-3xl' },
        { id: 'quote-love', type: 'quote', emoji: '💖', label: 'Quote: "Love"', text: 'Love', size: 'text-4xl' },
        { id: 'quote-care', type: 'quote', emoji: '🤗', label: 'Quote: "Care"', text: 'Care', size: 'text-3xl' },
        { id: 'dove', type: 'animal', emoji: '🕊️', label: 'Peace Dove', size: 'text-4xl' },
        { id: 'rainbow', type: 'decoration', emoji: '🌈', label: 'Rainbow', size: 'text-5xl' },
        { id: 'hug', type: 'icon', emoji: '🫂', label: 'Group Hug', size: 'text-4xl' },
        { id: 'gift', type: 'icon', emoji: '💝', label: 'Gift Heart', size: 'text-4xl' }
      ]
    },
    {
      id: 5,
      title: "Balance Bridge Poster",
      description: "Create a visual bridge connecting work life and personal wellbeing",
      backgrounds: [
        { id: 'balanced-blue', name: 'Balanced Blue', gradient: 'from-blue-100 via-indigo-100 to-purple-100' },
        { id: 'harmony-green', name: 'Harmony Green', gradient: 'from-green-100 via-teal-100 to-cyan-100' },
        { id: 'centered-orange', name: 'Centered Orange', gradient: 'from-orange-100 via-amber-100 to-yellow-100' },
        { id: 'peaceful-lavender', name: 'Peaceful Lavender', gradient: 'from-purple-100 via-pink-100 to-rose-100' },
        { id: 'stable-gray', name: 'Stable Gray', gradient: 'from-gray-100 via-slate-100 to-zinc-100' }
      ],
      stickers: [
        { id: 'scale', type: 'icon', emoji: '⚖️', label: 'Balance Scale', size: 'text-5xl' },
        { id: 'bridge', type: 'icon', emoji: '🌉', label: 'Connecting Bridge', size: 'text-5xl' },
        { id: 'yin-yang', type: 'symbol', emoji: '☯️', label: 'Yin Yang', size: 'text-5xl' },
        { id: 'quote-balance', type: 'quote', emoji: '✨', label: 'Quote: "Balance"', text: 'Balance', size: 'text-3xl' },
        { id: 'quote-harmony', type: 'quote', emoji: '🕊️', label: 'Quote: "Harmony"', text: 'Harmony', size: 'text-3xl' },
        { id: 'quote-center', type: 'quote', emoji: '⭕', label: 'Quote: "Center"', text: 'Center', size: 'text-3xl' },
        { id: 'work-icon', type: 'icon', emoji: '💼', label: 'Work Briefcase', size: 'text-4xl' },
        { id: 'home-icon', type: 'icon', emoji: '🏠', label: 'Home House', size: 'text-4xl' },
        { id: 'tree-of-life', type: 'plant', emoji: '🌳', label: 'Tree of Life', size: 'text-5xl' },
        { id: 'lotus', type: 'plant', emoji: '🪷', label: 'Lotus Flower', size: 'text-4xl' }
      ]
    }
  ];



  const getCurrentTheme = () => {
    return posterThemes.find(theme => theme.id === currentQuestion) || posterThemes[0];
  };

  const handleBackgroundSelect = (bg) => {
    setSelectedBackground(bg);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalLevels) {
      // Save current poster
      setCompletedPosters(prev => ({
        ...prev,
        [currentQuestion]: {
          background: selectedBackground,
          items: [...posterItems]
        }
      }));
      
      // Reset for next question
      setSelectedBackground(null);
      setPosterItems([]);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Last question - complete game
      setScore(totalLevels);
      setShowGameOver(true);
      
      setTimeout(() => {
        alert("Congratulations! You've created all 5 wellness posters!\n\nTo save your posters:\n1. Take screenshots of each poster\n2. Use them as wallpapers or print them\n3. Share with colleagues for inspiration");
      }, 500);
    }
  };

  const handleStickerClick = (sticker) => {
    if (posterItems.length >= 3) {
      alert("You can add up to 3 visuals. Remove one to add another.");
      return;
    }

    const newItem = {
      ...sticker,
      id: `${sticker.id}-${Date.now()}`,
      x: Math.random() * 60 + 20,
      y: Math.random() * 60 + 20,
      rotation: (Math.random() - 0.5) * 15
    };

    setPosterItems([...posterItems, newItem]);
  };

  const handleRemoveItem = (itemId) => {
    setPosterItems(posterItems.filter(item => item.id !== itemId));
  };

  const handleSavePoster = () => {
    if (!selectedBackground || posterItems.length < 3) {
      alert(`Please select a background and add at least 3 visuals for ${getCurrentTheme().title}.`);
      return;
    }

    // Save current poster and move to next
    handleNextQuestion();
  };

  const handleDownload = () => {
    if (!posterRef.current) return;

    const currentTheme = getCurrentTheme();
    const instructions = `To save your ${currentTheme.title}:\n\n` +
      `1. Take a screenshot:\n` +
      `   • Windows: Press Win + Shift + S, then select the poster area\n` +
      `   • Mac: Press Cmd + Shift + 4, then select the poster area\n` +
      `   • Or use your device's screenshot tool\n\n` +
      `2. Save the screenshot to your device\n\n` +
      `3. Use it as:\n` +
      `   • Phone wallpaper\n` +
      `   • Desktop background\n` +
      `   • Print it for your desk\n\n` +
      `Progress: ${currentQuestion}/${totalLevels} posters completed`;
    
    alert(instructions);
  };

  const currentTheme = getCurrentTheme();
  const currentBg = currentTheme.backgrounds.find(bg => bg.id === selectedBackground) || currentTheme.backgrounds[0];

  return (
    <TeacherGameShell
      title={currentTheme.title}
      subtitle={currentTheme.description}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentQuestion}
    >
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {/* Instructions */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Create Your {currentTheme.title}
            </h2>
            <p className="text-gray-600 mb-2">
              Question {currentQuestion} of {totalLevels}: {currentTheme.description}
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-sm text-blue-800">
                <strong>Progress:</strong> {selectedBackground ? '✓ Background selected' : 'Select background'} • 
                {posterItems.length}/3 visuals added • 
                {Object.keys(completedPosters).length}/{totalLevels - 1} posters completed
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Background Selection */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">1. Select Background</h3>
              <div className="space-y-3">
                {currentTheme.backgrounds.map((bg) => (
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
                {currentTheme.stickers.map((sticker) => (
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
              {currentQuestion < totalLevels ? 'Next Poster' : 'Complete All'}
            </motion.button>
          </div>

          {/* Teacher Tip */}
          <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-amber-900 mb-2">
              💡 Teacher Tip - {currentTheme.title}:
            </p>
            <p className="text-sm text-amber-800 leading-relaxed">
              {currentQuestion === 1 && 'Display posters in the staffroom "Wellness Wall". Create a dedicated space where teachers can share their wellness posters. This creates visual reminders of self-care and provides inspiration for others.'}
              {currentQuestion === 2 && 'Use the Focus Flow poster as a daily reminder during lesson planning. Place it near your desk calendar to maintain concentrated attention on priority tasks.'}
              {currentQuestion === 3 && 'Share Growth Mindset posters with students to reinforce learning resilience. Create classroom displays that celebrate effort and improvement over perfection.'}
              {currentQuestion === 4 && 'Place Kindness Canvas posters in common areas to promote positive relationships. Encourage staff and students to practice empathy and supportive interactions daily.'}
              {currentQuestion === 5 && 'Use Balance Bridge posters to remind yourself of work-life harmony. Create visual boundaries between professional responsibilities and personal wellbeing time.'}
            </p>
          </div>
        </div>
      </div>
    </TeacherGameShell>
  );
};

export default CalmCornerPoster;

