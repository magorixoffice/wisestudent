import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Sprout, TreePine, CheckCircle, Sparkles, Heart } from "lucide-react";

const GratitudeForGrowth = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-59";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [step, setStep] = useState(1); // 1: Writing, 2: Animation, 3: Complete
  const [gratitudeEntries, setGratitudeEntries] = useState({
    lesson1: "",
    lesson2: "",
    lesson3: "",
    lesson4: "",
    lesson5: ""
  });
  const [treeStage, setTreeStage] = useState(0); // 0: seed, 1: sprout, 2: sapling, 3: tree
  const [showAnimation, setShowAnimation] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  const allEntriesFilled = Object.values(gratitudeEntries).every(entry => entry.trim().length >= 10);

  const handleEntryChange = (lessonId, value) => {
    setGratitudeEntries(prev => ({
      ...prev,
      [lessonId]: value
    }));
  };

  const handleStartAnimation = () => {
    if (allEntriesFilled) {
      setScore(5); // Award score for completing all 5 entries
      setStep(2);
      setShowAnimation(true);
      animateTreeGrowth();
    }
  };

  const animateTreeGrowth = () => {
    // Animate tree through 4 stages
    let stage = 0;
    const growthInterval = setInterval(() => {
      setTreeStage(stage);
      stage++;
      
      if (stage > 3) {
        clearInterval(growthInterval);
        setTimeout(() => {
          setShowAnimation(false);
          setStep(3);
          setShowGameOver(true);
          // Score already awarded when starting animation
        }, 2000);
      }
    }, 1500); // 1.5 seconds per stage
  };

  // Tree stages
  const treeStages = [
    {
      stage: 0,
      label: 'Seed',
      emoji: '🌰',
      description: 'Your hardship experience - the seed of growth',
      color: 'from-amber-400 to-orange-500',
      size: 'text-4xl'
    },
    {
      stage: 1,
      label: 'Sprout',
      emoji: '🌱',
      description: 'First lessons learned - beginning to grow',
      color: 'from-green-400 to-emerald-500',
      size: 'text-5xl'
    },
    {
      stage: 2,
      label: 'Sapling',
      emoji: '🌿',
      description: 'Building strength - growing taller',
      color: 'from-green-500 to-teal-600',
      size: 'text-6xl'
    },
    {
      stage: 3,
      label: 'Tree',
      emoji: '🌳',
      description: 'Fully grown - wisdom and strength from hardship',
      color: 'from-green-600 to-emerald-700',
      size: 'text-7xl'
    }
  ];

  if (showGameOver && step === 3) {
    return (
      <ParentGameShell
        title={gameData?.title || "Gratitude for Growth"}
        subtitle="Growth Complete!"
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
                🌳
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Tree of Growth is Complete!</h2>
              <p className="text-lg text-gray-600 mb-6">
                You've transformed hardship into wisdom. Your strength has grown from your experiences.
              </p>
            </div>

            {/* Complete Tree Display */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-200 mb-6 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-8xl mb-4"
              >
                🌳
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Lessons from Hardship</h3>
              <div className="space-y-4 w-full max-w-2xl">
                {Object.entries(gratitudeEntries).map(([key, entry], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg p-4 border-2 border-green-200"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">{index + 1}.</span>
                      <p className="text-gray-700 flex-1">{entry}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Gratitude turns pain into wisdom; share your story when ready. When you appreciate how tough experiences have built your strength, you're not denying the pain—you're acknowledging the growth that came from it. This gratitude transforms hardship into teaching moments. When you're ready, sharing your story of growth with your children shows them that challenges can be overcome, that strength comes from navigating difficult times, and that they too can grow from their struggles. Your story becomes their map. Gratitude for growth doesn't mean the hardship was easy—it means you've found meaning and strength in it.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Gratitude for Growth"}
      subtitle={step === 1 ? "Reflect on Your Growth" : step === 2 ? "Growing..." : "Complete"}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {step === 1 && (
            /* Writing Phase */
            <>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🌰</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Gratitude for Growth</h2>
                <p className="text-gray-600 text-lg">
                  Reflect on how tough experiences have built your strength. Write 3 lessons you learned from hardship.
                </p>
              </div>

              {/* Reflection Prompt */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                  What did hardship teach me?
                </h3>
                <p className="text-gray-600 text-center">
                  Think about a challenging experience and the wisdom you gained from it. Each lesson you write will help your tree of growth flourish.
                </p>
              </div>

              {/* Writing Form */}
              <div className="space-y-6 mb-6">
                {[1, 2, 3, 4, 5].map((num) => {
                  const lessonId = `lesson${num}`;
                  const entry = gratitudeEntries[lessonId];
                  const isValid = entry.trim().length >= 10;
                  const previousLessonsFilled = num === 1 || Object.values(gratitudeEntries).slice(0, num - 1).every(e => e.trim().length >= 10);
                  
                  return (
                    <motion.div
                      key={lessonId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (num - 1) * 0.1 }}
                      className={`bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 ${
                        isValid ? 'border-green-400' : previousLessonsFilled ? 'border-amber-300' : 'border-gray-200 opacity-50'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          isValid ? 'bg-gradient-to-br from-green-500 to-emerald-600' : previousLessonsFilled ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gray-300'
                        }`}>
                          {isValid ? <CheckCircle className="w-6 h-6" /> : num}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800 mb-1">
                            Lesson {num}: What did hardship teach me?
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {num === 1 && "Write about a specific lesson you learned from a challenging experience."}
                            {num === 2 && "Write about another insight or strength you gained."}
                            {num === 3 && "Write about one more way you've grown from hardship."}
                            {num === 4 && "Write about how you've helped others with your experience."}
                            {num === 5 && "Write about your overall transformation from hardship."}
                          </p>
                        </div>
                      </div>
                      <textarea
                        value={entry}
                        onChange={(e) => handleEntryChange(lessonId, e.target.value)}
                        placeholder={num === 1 
                          ? "Example: 'I learned that asking for help is a sign of strength, not weakness...'"
                          : num === 2
                          ? "Example: 'I discovered my own resilience and ability to adapt...'"
                          : num === 3
                          ? "Example: 'I learned to find gratitude even in difficult moments...'"
                          : num === 4
                          ? "Example: 'I now mentor others who face similar challenges...'"
                          : "Example: 'Through hardship, I've become more compassionate and stronger...'"}
                        disabled={!previousLessonsFilled}
                        className={`w-full h-24 p-4 border-2 rounded-lg focus:outline-none focus:ring-2 resize-none text-gray-700 ${
                          isValid
                            ? 'border-green-400 border-opacity-60 focus:ring-green-200'
                            : previousLessonsFilled
                            ? 'border-amber-300 focus:ring-amber-200'
                            : 'border-gray-300 bg-gray-100 cursor-not-allowed'
                        }`}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-600">
                          {entry.length} characters {isValid && <span className="text-green-600 font-semibold">✓</span>}
                        </p>
                        {!previousLessonsFilled && num > 1 && (
                          <p className="text-xs text-red-600">Complete previous lesson first</p>
                        )}
                        {previousLessonsFilled && entry.length > 0 && entry.length < 10 && (
                          <p className="text-xs text-red-600">Please write at least 10 characters</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Parent Tip */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>💡 Parent Tip:</strong> Gratitude turns pain into wisdom; share your story when ready. When you appreciate how tough experiences have built your strength, you're transforming hardship into growth.
                </p>
              </div>

              {/* Grow Tree Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartAnimation}
                disabled={!allEntriesFilled}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sprout className="w-5 h-5" />
                Watch Your Tree of Growth Flourish
              </motion.button>
            </>
          )}

          {step === 2 && showAnimation && (
            /* Tree Growth Animation */
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Tree of Growth</h2>
                
                {/* Animated Tree */}
                <div className="relative mb-8 flex flex-col items-center" style={{ minHeight: '400px' }}>
                  <AnimatePresence mode="wait">
                    {treeStages
                      .filter((stage, index) => index === treeStage)
                      .map((stage) => (
                        <motion.div
                          key={stage.stage}
                          initial={{ scale: 0, opacity: 0, y: 50 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="flex flex-col items-center"
                        >
                          {/* Tree Emoji */}
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className={`text-8xl mb-4 ${stage.size}`}
                          >
                            {stage.emoji}
                          </motion.div>
                          
                          {/* Stage Label */}
                          <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${stage.color} bg-clip-text text-transparent`}>
                            {stage.label}
                          </h3>
                          <p className="text-gray-600 mb-4">{stage.description}</p>
                          
                          {/* Lesson Display */}
                          {stage.stage > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="bg-white rounded-lg p-4 border-2 border-green-200 max-w-md mt-4"
                            >
                              <p className="text-sm text-gray-700 italic">
                                "{gratitudeEntries[`lesson${stage.stage}`]}"
                              </p>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                  </AnimatePresence>

                  {/* Growth Progress Indicator */}
                  <div className="flex gap-2 mt-8">
                    {treeStages.map((stage, index) => (
                      <div
                        key={stage.stage}
                        className={`h-2 rounded-full transition-all ${
                          index < treeStage
                            ? 'bg-green-500 w-8'
                            : index === treeStage
                            ? 'bg-green-600 w-8 animate-pulse'
                            : 'bg-gray-300 w-2'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {treeStage < 3 ? (
                  <p className="text-lg text-gray-700 font-medium">
                    Growing from {treeStages[treeStage].label}...
                  </p>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="text-6xl mb-4">🎉</div>
                    <p className="text-xl text-gray-800 font-bold">
                      Your tree of growth is complete! Your strength has flourished from hardship.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default GratitudeForGrowth;

