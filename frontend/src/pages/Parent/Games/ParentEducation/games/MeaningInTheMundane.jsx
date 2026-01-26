import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Heart, Sparkles, Coffee, BookOpen, GraduationCap, CheckCircle, Play } from "lucide-react";

const MeaningInTheMundane = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-83";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentClip, setCurrentClip] = useState(0);
  const [clipTags, setClipTags] = useState({});
  const [showAnimation, setShowAnimation] = useState(true);
  const [showGameOver, setShowGameOver] = useState(false);

  // Mundane parenting moments (clips)
  const mundaneClips = [
    {
      id: 'packing-lunch',
      title: 'Packing Lunch',
      emoji: '🍱',
      animatedEmoji: '🥪',
      description: 'Carefully preparing a nutritious lunch, checking dietary preferences, adding a loving note',
      scene: 'kitchen',
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-300',
      icon: Coffee,
      meaning: 'This daily ritual shows consistent care and thoughtfulness. Even when rushed, you\'re ensuring your child is nourished and loved.'
    },
    {
      id: 'bedtime-stories',
      title: 'Bedtime Stories',
      emoji: '📚',
      animatedEmoji: '🌙',
      description: 'Sitting together, reading aloud, sharing stories and creating quiet moments of connection',
      scene: 'bedroom',
      color: 'from-indigo-400 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-300',
      icon: BookOpen,
      meaning: 'This routine provides emotional stability and creates treasured memories. Your presence and voice offer comfort and security.'
    },
    {
      id: 'guiding-homework',
      title: 'Guiding Homework',
      emoji: '✏️',
      animatedEmoji: '💡',
      description: 'Patiently helping with schoolwork, explaining concepts, encouraging effort and learning',
      scene: 'study',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300',
      icon: GraduationCap,
      meaning: 'This supportive act fosters growth and learning. Your guidance teaches not just subject matter, but perseverance and problem-solving.'
    },
    {
      id: 'morning-routine',
      title: 'Morning Routine',
      emoji: '🌅',
      animatedEmoji: '⏰',
      description: 'Waking up early, preparing breakfast, getting everyone ready for the day with calm patience',
      scene: 'morning',
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-300',
      icon: Coffee,
      meaning: 'This foundational routine sets the tone for the entire day. Your calm presence during rushed mornings creates stability and shows reliability.'
    },
    {
      id: 'listening-actively',
      title: 'Active Listening',
      emoji: '👂',
      animatedEmoji: '💭',
      description: 'Putting down devices, making eye contact, truly hearing your child\'s thoughts and feelings without judgment',
      scene: 'conversation',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      icon: Heart,
      meaning: 'This simple act validates your child\'s emotions and builds trust. Being fully present shows they matter and creates space for authentic connection.'
    }
  ];

  // Available meaning tags
  const meaningTags = [
    {
      id: 'care',
      label: 'Care',
      emoji: '💚',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-300',
      description: 'Showing love and attention through everyday actions'
    },
    {
      id: 'stability',
      label: 'Stability',
      emoji: '🏠',
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-300',
      description: 'Creating consistent routines and predictable presence'
    },
    {
      id: 'growth',
      label: 'Growth',
      emoji: '🌱',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      description: 'Nurturing learning, development, and resilience'
    }
  ];

  useEffect(() => {
    // Auto-advance animation after showing for a few seconds
    if (showAnimation && currentClip < mundaneClips.length) {
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAnimation, currentClip]);

  const handleTagToggle = (clipId, tagId) => {
    setClipTags(prev => {
      const currentTags = prev[clipId] || [];
      if (currentTags.includes(tagId)) {
        // Deselect
        return {
          ...prev,
          [clipId]: currentTags.filter(id => id !== tagId)
        };
      } else {
        // Select (can select multiple)
        return {
          ...prev,
          [clipId]: [...currentTags, tagId]
        };
      }
    });
  };

  const handleNext = () => {
    const currentClipId = mundaneClips[currentClip].id;
    const tags = clipTags[currentClipId] || [];
    
    if (tags.length > 0) {
      if (currentClip < mundaneClips.length - 1) {
        setCurrentClip(prev => prev + 1);
        setShowAnimation(true);
      } else {
        setShowGameOver(true);
      }
    }
  };

  const currentClipData = mundaneClips[currentClip];
  const currentTags = clipTags[currentClipData.id] || [];
  const allClipsCompleted = mundaneClips.every(clip => 
    (clipTags[clip.id] || []).length > 0
  );

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Meaning in the Mundane"}
        subtitle="Reflection Complete!"
        showGameOver={true}
        score={mundaneClips.length}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={allClipsCompleted}
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
                ✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Meaning Found in the Mundane</h2>
              <p className="text-lg text-gray-600">
                You've discovered the deeper purpose in everyday parenting actions.
              </p>
            </div>

            {/* Summary of All Clips */}
            <div className="space-y-6 mb-8">
              {mundaneClips.map((clip, index) => {
                const selectedTags = (clipTags[clip.id] || [])
                  .map(id => meaningTags.find(tag => tag.id === id))
                  .filter(Boolean);
                
                return (
                  <motion.div
                    key={clip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${clip.bgColor} rounded-xl p-6 border-2 ${clip.borderColor}`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-5xl">{clip.emoji}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{clip.title}</h3>
                        <p className="text-sm text-gray-700 mb-3">{clip.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedTags.map((tag) => (
                            <span
                              key={tag.id}
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${tag.color} text-white text-sm font-semibold`}
                            >
                              <span>{tag.emoji}</span>
                              <span>{tag.label}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
                      <p className="text-sm text-gray-700 italic">"{clip.meaning}"</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-green-600" />
                The Sacred in the Repetitive
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Care Through Routine:</strong> Packing lunch, bedtime stories, homework help—these repetitive acts become sacred when done with love. They show your child they are consistently cared for and valued.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Stability in Small Moments:</strong> The predictability of these daily actions creates emotional security. Children thrive on knowing what to expect, even in the smallest routines.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Growth in Guidance:</strong> Every moment of patience, every explanation, every encouragement contributes to your child's development. These small acts accumulate into lifelong learning.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Purpose in Presence:</strong> When you approach these mundane tasks with awareness and intention, they transform from chores into opportunities for connection and love.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Every repetitive act is sacred when done with love. The mundane moments of parenting—packing lunches, reading bedtime stories, helping with homework—may feel routine, but they carry profound meaning. When you approach these tasks with presence and love, you're not just completing chores; you're building connection, stability, and growth. Remember: the small, repeated gestures matter most. Your consistent care, even in the most ordinary moments, shapes your child's sense of security and belonging.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Meaning in the Mundane"}
      subtitle={`${currentClipData.title} - Clip ${currentClip + 1} of ${mundaneClips.length}`}
      showGameOver={false}
      score={currentClip}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentClip + 1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={currentClip}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Clip {currentClip + 1} of {mundaneClips.length}</span>
              <span>{Math.round(((currentClip + 1) / mundaneClips.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentClip + 1) / mundaneClips.length) * 100}%` }}
                className="bg-gradient-to-r from-amber-600 to-orange-600 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Clip Animation/Visual */}
          <AnimatePresence mode="wait">
            {showAnimation ? (
              <motion.div
                key="animation"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                className={`bg-gradient-to-br ${currentClipData.bgColor} rounded-xl p-12 mb-6 border-2 ${currentClipData.borderColor} text-center`}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="text-8xl mb-4"
                >
                  {currentClipData.animatedEmoji}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{currentClipData.title}</h2>
                  <p className="text-lg text-gray-700">{currentClipData.description}</p>
                </motion.div>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Play className="w-4 h-4" />
                  <span>Watch the moment...</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`bg-gradient-to-br ${currentClipData.bgColor} rounded-xl p-8 mb-6 border-2 ${currentClipData.borderColor}`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-6xl">{currentClipData.emoji}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{currentClipData.title}</h2>
                    <p className="text-gray-700">{currentClipData.description}</p>
                  </div>
                </div>
                
                {/* Meaning Explanation */}
                <div className="bg-white/80 rounded-lg p-4 border border-gray-200 mb-6">
                  <p className="text-sm text-gray-700 italic">"{currentClipData.meaning}"</p>
                </div>

                {/* Tag Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    What meaning do you find in this moment? (Select one or more)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {meaningTags.map((tag) => {
                      const isSelected = currentTags.includes(tag.id);
                      return (
                        <motion.button
                          key={tag.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleTagToggle(currentClipData.id, tag.id)}
                          className={`p-6 rounded-xl border-2 transition-all text-center ${
                            isSelected
                              ? `${tag.bgColor} ${tag.borderColor} border-4 shadow-lg`
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-4xl mb-3">{tag.emoji}</div>
                          <h4 className="text-lg font-bold text-gray-800 mb-2">{tag.label}</h4>
                          <p className="text-xs text-gray-600 mb-3">{tag.description}</p>
                          {isSelected && (
                            <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Tags Preview */}
                {currentTags.length > 0 && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Your selected meanings:</p>
                    <div className="flex flex-wrap gap-2">
                      {currentTags.map((tagId) => {
                        const tag = meaningTags.find(t => t.id === tagId);
                        if (!tag) return null;
                        return (
                          <span
                            key={tagId}
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${tag.color} text-white text-sm font-semibold`}
                          >
                            <span>{tag.emoji}</span>
                            <span>{tag.label}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Next Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  disabled={currentTags.length === 0}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {currentClip < mundaneClips.length - 1 ? (
                    <>
                      Continue to Next Moment
                      <CheckCircle className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      View Complete Reflection
                      <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {currentTags.length === 0 && (
                  <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
                    <p className="text-yellow-800 text-sm text-center">
                      Please select at least one meaning tag to continue.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Every repetitive act is sacred when done with love. The mundane moments of parenting carry profound meaning when approached with presence and intention.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default MeaningInTheMundane;

