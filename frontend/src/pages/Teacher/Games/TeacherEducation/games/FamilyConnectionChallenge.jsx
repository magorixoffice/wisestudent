import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Heart, Users, Phone, UtensilsCrossed, Gamepad2, BookOpen, Music, Camera, Gift, Coffee, CheckCircle, Star, ArrowRight, Sparkles } from "lucide-react";

const FamilyConnectionChallenge = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-38";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [reflection, setReflection] = useState("");
  const [showReflection, setShowReflection] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const connectionPrompts = [
    {
      id: 1,
      title: "Call a Loved One",
      description: "Make a phone or video call to a family member or close friend",
      icon: Phone,
      emoji: "📞",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-300"
    },
    {
      id: 2,
      title: "Cook Together",
      description: "Prepare a meal or snack with family members",
      icon: UtensilsCrossed,
      emoji: "🍳",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-300"
    },
    {
      id: 3,
      title: "Play a Game",
      description: "Play a board game, card game, or outdoor activity together",
      icon: Gamepad2,
      emoji: "🎮",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-300"
    },
    {
      id: 4,
      title: "Read Together",
      description: "Read a book, story, or article together and discuss it",
      icon: BookOpen,
      emoji: "📚",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-300"
    },
    {
      id: 5,
      title: "Listen to Music",
      description: "Share favorite songs, create a playlist, or attend a concert together",
      icon: Music,
      emoji: "🎵",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-300"
    },
    {
      id: 6,
      title: "Take Photos Together",
      description: "Capture moments together, look through old photos, or create a memory album",
      icon: Camera,
      emoji: "📸",
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-300"
    },
    {
      id: 7,
      title: "Surprise Someone",
      description: "Plan a small surprise, gift, or act of kindness for a family member",
      icon: Gift,
      emoji: "🎁",
      color: "from-yellow-500 to-amber-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-300"
    },
    {
      id: 8,
      title: "Share a Meal",
      description: "Have breakfast, lunch, or dinner together without distractions",
      icon: Coffee,
      emoji: "☕",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-300"
    },
    {
      id: 9,
      title: "Take a Walk",
      description: "Go for a walk, hike, or explore a new place together",
      icon: Users,
      emoji: "🚶",
      color: "from-teal-500 to-cyan-500",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-300"
    },
    {
      id: 10,
      title: "Share Gratitude",
      description: "Tell each other what you're grateful for or appreciate about one another",
      icon: Heart,
      emoji: "💝",
      color: "from-rose-500 to-pink-500",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-300"
    }
  ];

  const handlePromptSelect = (prompt) => {
    setSelectedPrompt(prompt);
    setReflection("");
    setShowReflection(false);
  };

  const handleMarkComplete = () => {
    if (!selectedPrompt) return;
    setShowReflection(true);
  };

  const handleSaveReflection = () => {
    if (!reflection.trim()) {
      alert("Please write a reflection before continuing.");
      return;
    }

    if (reflection.trim().length < 10) {
      alert("Please write at least 10 characters for your reflection.");
      return;
    }

    const completedChallenge = {
      ...selectedPrompt,
      reflection: reflection.trim(),
      completedAt: new Date().toLocaleString(),
      id: Date.now()
    };

    setCompletedChallenges([...completedChallenges, completedChallenge]);
    setScore(prev => prev + 1);
    
    // Reset
    setSelectedPrompt(null);
    setReflection("");
    setShowReflection(false);
  };

  const handleContinue = () => {
    setSelectedPrompt(null);
    setShowReflection(false);
    setReflection("");
  };

  const handleComplete = () => {
    setShowGameOver(true);
  };

  const availablePrompts = connectionPrompts.filter(
    prompt => !completedChallenges.find(challenge => challenge.id === prompt.id)
  );

  return (
    <TeacherGameShell
      title={gameData?.title || "Family Connection Challenge"}
      subtitle={gameData?.description || "Reinforce personal bonds to counter isolation from overwork"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={completedChallenges.length + 1}
    >
      <div className="w-full max-w-6xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
                <Heart className="w-8 h-8 text-pink-600" />
                Family Connection Challenge
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                Counter isolation from overwork by reinforcing personal bonds
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="bg-pink-100 text-pink-800 px-4 py-2 rounded-full font-semibold">
                  Completed: {completedChallenges.length}
                </div>
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-semibold">
                  Available: {availablePrompts.length}
                </div>
              </div>
            </div>

            {!selectedPrompt && (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Choose a Connection Prompt:
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Select one prompt to complete. After marking it complete, you'll add a reflection about the experience.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  <AnimatePresence>
                    {availablePrompts.map((prompt, index) => {
                      const IconComponent = prompt.icon;
                      return (
                        <motion.div
                          key={prompt.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <button
                            onClick={() => handlePromptSelect(prompt)}
                            className={`w-full ${prompt.bgColor} ${prompt.borderColor} border-2 rounded-xl p-6 text-left transition-all hover:shadow-lg`}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${prompt.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                                {prompt.emoji}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-800 mb-2 text-lg">
                                  {prompt.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {prompt.description}
                                </p>
                              </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
                              <ArrowRight className="w-4 h-4" />
                              <span>Choose this challenge</span>
                            </div>
                          </button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {completedChallenges.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Completed Challenges ({completedChallenges.length}):
                    </h3>
                    <div className="space-y-3">
                      {completedChallenges.map((challenge) => {
                        const IconComponent = challenge.icon;
                        return (
                          <div
                            key={challenge.id}
                            className={`${challenge.bgColor} ${challenge.borderColor} border-2 rounded-lg p-4`}
                          >
                            <div className="flex items-start gap-3">
                              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xl">{challenge.emoji}</span>
                                  <h4 className="font-semibold text-gray-800">
                                    {challenge.title}
                                  </h4>
                                </div>
                                <p className="text-sm text-gray-600 italic mb-2">
                                  "{challenge.reflection}"
                                </p>
                                <p className="text-xs text-gray-500">
                                  Completed: {challenge.completedAt}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {completedChallenges.length >= 1 && (
                  <div className="text-center mt-8">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleComplete}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      Complete Challenge
                    </motion.button>
                    <p className="text-sm text-gray-500 mt-2">
                      You can complete more challenges or finish now
                    </p>
                  </div>
                )}

                {availablePrompts.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-800 mb-2">
                      All challenges completed!
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleComplete}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      View Summary
                    </motion.button>
                  </div>
                )}
              </>
            )}

            {selectedPrompt && !showReflection && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border-2 border-gray-200 p-8"
              >
                <div className="text-center mb-6">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${selectedPrompt.color} flex items-center justify-center text-4xl mx-auto mb-4`}>
                    {selectedPrompt.emoji}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedPrompt.title}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {selectedPrompt.description}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-200 mb-6">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-pink-900 mb-2">
                        Challenge Instructions:
                      </p>
                      <p className="text-sm text-pink-800 leading-relaxed">
                        Take time to complete this connection activity with your family or loved ones. This could be done today or planned for the near future. Focus on being present and enjoying the moment together.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleContinue}
                    className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Choose Different Challenge
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMarkComplete}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Mark as Completed ✓
                  </motion.button>
                </div>
              </motion.div>
            )}

            {selectedPrompt && showReflection && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border-2 border-gray-200 p-8"
              >
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${selectedPrompt.color} flex items-center justify-center text-3xl mx-auto mb-4`}>
                    {selectedPrompt.emoji}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {selectedPrompt.title} - Reflection
                  </h3>
                  <p className="text-gray-600">
                    Share a one-line reflection about your experience
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Reflection (at least 10 characters):
                  </label>
                  <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="e.g., 'We laughed so much during our game night - it reminded me why I love spending time with my family.'"
                    className="w-full h-32 p-4 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none resize-none text-gray-700"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {reflection.length} characters (minimum 10 required)
                  </p>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowReflection(false);
                      setReflection("");
                    }}
                    className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveReflection}
                    disabled={!reflection.trim() || reflection.trim().length < 10}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Reflection & Continue
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-6xl mb-6"
            >
              {completedChallenges.length >= 3 ? '🌟' : completedChallenges.length >= 1 ? '✨' : '💝'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Challenge Complete!
            </h2>
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-200 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                You completed <span className="font-bold text-pink-600">{completedChallenges.length}</span> family connection challenge{completedChallenges.length !== 1 ? 's' : ''}!
              </p>
              <p className="text-gray-600">
                These moments of connection help counter isolation from overwork and reinforce your personal bonds.
              </p>
            </div>

            {/* Completed Challenges Summary */}
            {completedChallenges.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 mb-6 text-left">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  Your Connection Challenges:
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {completedChallenges.map((challenge) => {
                    const IconComponent = challenge.icon;
                    return (
                      <div
                        key={challenge.id}
                        className={`${challenge.bgColor} ${challenge.borderColor} border-2 rounded-lg p-4`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${challenge.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                            {challenge.emoji}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-bold text-gray-800 text-lg">
                                {challenge.title}
                              </h4>
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <p className="text-gray-700 italic mb-2">
                              "{challenge.reflection}"
                            </p>
                            <p className="text-xs text-gray-500">
                              Completed: {challenge.completedAt}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <Users className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Suggest mini family challenges across the staff. Create a staff-wide "Family Connection Challenge" where teachers commit to completing one family connection activity per week. Share challenges during staff meetings or in a dedicated wellness channel. Consider creating a shared board or digital space where teachers can post photos (with permission), reflections, or ideas for connection activities. This builds community among staff while reinforcing the importance of personal bonds. Celebrate teachers who complete challenges—perhaps with small acknowledgments or a monthly "Connection Champion" recognition. When staff model healthy work-life boundaries and family connection, it creates a positive ripple effect that benefits the entire school culture. Encourage teachers to adapt challenges to their family structure—whether that's immediate family, chosen family, close friends, or community connections.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default FamilyConnectionChallenge;

