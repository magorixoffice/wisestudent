import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Sparkles, Heart, CheckCircle, XCircle, ArrowRight, Brain } from "lucide-react";

const GrowthMindsetGame = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-52";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentThought, setCurrentThought] = useState(0);
  const [selectedReframe, setSelectedReframe] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // 5 negative thoughts with reframe options
  const thoughts = [
    {
      id: 1,
      negativeThought: "I failed",
      context: "After making a mistake with your child, you feel like you've completely failed as a parent.",
      reframes: [
        
        {
          text: "I'm a terrible parent",
          isCorrect: false,
          explanation: "This reinforces negative self-judgment. One mistake doesn't define your entire parenting journey."
        },
        {
          text: "I should have known better",
          isCorrect: false,
          explanation: "This adds shame. You're learning as you go—no one knows everything from the start."
        },
        {
          text: "This proves I can't do this",
          isCorrect: false,
          explanation: "This is a fixed mindset. Growth mindset recognizes that you can improve with practice and learning."
        },
        {
          text: "I made a mistake, and I can learn from it",
          isCorrect: true,
          explanation: "This reframe shifts from self-blame to learning. Mistakes are opportunities for growth, not proof of failure."
        },
      ]
    },
    {
      id: 2,
      negativeThought: "I'm not patient",
      context: "You lost your patience again and snapped at your child. You feel like you'll never be the patient parent you want to be.",
      reframes: [
        
        {
          text: "I'll never be patient enough",
          isCorrect: false,
          explanation: "This is a fixed mindset that prevents growth. Believing you can't change keeps you stuck."
        },
        {
          text: "Patience is a skill I'm practicing and improving",
          isCorrect: true,
          explanation: "This reframe acknowledges growth. Patience isn't a fixed trait—it's something you can develop with practice and self-compassion."
        },
        {
          text: "I need to try harder to be patient",
          isCorrect: false,
          explanation: "While effort matters, this can add pressure. A growth mindset focuses on learning and self-compassion, not just trying harder."
        },
        {
          text: "Some people are just naturally patient",
          isCorrect: false,
          explanation: "This compares you to others and suggests patience is fixed. Everyone can develop patience with practice."
        }
      ]
    },
    {
      id: 3,
      negativeThought: "I'm ruining my child",
      context: "After a difficult interaction, you worry that your mistakes are causing lasting harm to your child.",
      reframes: [
        
        {
          text: "I need to be perfect from now on",
          isCorrect: false,
          explanation: "This sets an impossible standard. Perfection isn't the goal—growth, repair, and connection are."
        },
        {
          text: "The damage is already done",
          isCorrect: false,
          explanation: "This is a fixed mindset that doesn't account for repair and growth. Relationships can heal and strengthen."
        },
        {
          text: "I'm human, and I can repair and grow. Our relationship is stronger than any single moment.",
          isCorrect: true,
          explanation: "This reframe emphasizes repair and growth. Children are resilient, and your consistent love and effort matter more than perfection."
        },
        {
          text: "I should just give up",
          isCorrect: false,
          explanation: "Giving up prevents growth. Every parent makes mistakes—what matters is continuing to try and learn."
        }
      ]
    },
    {
      id: 4,
      negativeThought: "I don't know what I'm doing",
      context: "Facing a new parenting challenge, you feel completely lost and like you don't have the knowledge or skills needed.",
      reframes: [
        {
          text: "I'm learning as I go, and that's okay. I can seek support and resources.",
          isCorrect: true,
          explanation: "This reframe normalizes learning. No parent knows everything—seeking help and learning is a strength, not a weakness."
        },
        {
          text: "I should have learned this already",
          isCorrect: false,
          explanation: "This adds shame. Parenting is a continuous learning journey—there's no finish line."
        },
        {
          text: "Other parents know more than me",
          isCorrect: false,
          explanation: "Comparison steals your confidence. Everyone is learning—you just see others' highlights, not their struggles."
        },
        {
          text: "I'm not cut out for this",
          isCorrect: false,
          explanation: "This is a fixed mindset. You ARE capable—you're just learning, like every parent."
        },
        
      ]
    },
    {
      id: 5,
      negativeThought: "I always mess up",
      context: "After another mistake, you feel like you're constantly failing and can't do anything right.",
      reframes: [
        
        {
          text: "I need to stop making mistakes",
          isCorrect: false,
          explanation: "This sets an impossible goal. Mistakes are part of learning—the goal is to learn from them, not avoid them completely."
        },
        {
          text: "I'm just a failure",
          isCorrect: false,
          explanation: "This is a fixed mindset that labels you. You're not a failure—you're a human learning and growing."
        },
        {
          text: "Nothing I do works",
          isCorrect: false,
          explanation: "This is all-or-nothing thinking. Some things work, some don't—that's normal. Focus on what you're learning."
        },
        {
          text: "I make mistakes sometimes, and I'm learning from each one",
          isCorrect: true,
          explanation: "This reframe shifts from 'always' (all-or-nothing thinking) to 'sometimes' and emphasizes learning. You're not defined by mistakes."
        },
      ]
    }
  ];

  const currentThoughtData = thoughts[currentThought];
  const shuffledReframes = [...currentThoughtData.reframes].sort(() => Math.random() - 0.5);

  const handleReframeSelect = (reframe) => {
    if (selectedReframe) return; // Already selected

    setSelectedReframe(reframe);

    if (reframe.isCorrect) {
      setScore(prev => prev + 1);
      setShowAnimation(true);
      
      // Hide animation after 2 seconds and move to next
      setTimeout(() => {
        setShowAnimation(false);
        setSelectedReframe(null);
        
        if (currentThought < thoughts.length - 1) {
          setCurrentThought(prev => prev + 1);
        } else {
          setShowGameOver(true);
        }
      }, 2500);
    } else {
      // Show feedback for incorrect answer, then allow retry
      setTimeout(() => {
        setSelectedReframe(null);
      }, 2000);
    }
  };

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Growth Mindset Game"}
        subtitle="Practice Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={score >= 4}  // Changed from >= 8 to >= 4 (majority of 5 questions)
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-6xl mb-4"
            >
              🌱
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Growth Mindset Mastered!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've learned to shift from self-blame to learning after mistakes. You matched <strong className="text-green-600">{score} out of {totalLevels}</strong> thoughts with growth-minded reframes!
            </p>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> Speak to yourself the way you'd comfort your child after a mistake. When your child makes a mistake, you'd say: "It's okay, we all make mistakes. What can we learn from this?" Give yourself the same compassion. Growth mindset isn't about never making mistakes—it's about learning from them with self-compassion.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Key Takeaways</h3>
              <ul className="text-left text-gray-700 space-y-2 max-w-2xl mx-auto">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Mistakes are opportunities for growth, not proof of failure</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Self-compassion helps you learn faster than self-criticism</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Growth is a process—progress matters more than perfection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>When you speak kindly to yourself, you model self-compassion for your child</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Growth Mindset Game"}
      subtitle={`Thought ${currentThought + 1} of ${totalLevels}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentThought + 1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={currentThought}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Thought {currentThought + 1} of {totalLevels}</span>
              <span>{Math.round(((currentThought + 1) / totalLevels) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentThought + 1) / totalLevels) * 100}%` }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Negative thought bubble */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 mb-6 border-2 border-red-200 relative">
            <div className="absolute top-4 right-4">
              <Brain className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Negative Thought:</h3>
            <p className="text-2xl font-bold text-red-700 mb-3">"{currentThoughtData.negativeThought}"</p>
            <p className="text-gray-600 italic">{currentThoughtData.context}</p>
          </div>

          {/* Calming animation overlay */}
          <AnimatePresence>
            {showAnimation && selectedReframe?.isCorrect && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
              >
                {/* Expanding circles */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.2,
                      ease: "easeOut"
                    }}
                    className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-500"
                  />
                ))}
                
                {/* Sparkles */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      scale: 0,
                      x: 0,
                      y: 0,
                      opacity: 1
                    }}
                    animate={{ 
                      scale: [0, 1, 0],
                      x: Math.cos(i * 0.314) * 200,
                      y: Math.sin(i * 0.314) * 200,
                      opacity: [1, 1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.05,
                      ease: "easeOut"
                    }}
                    className="absolute"
                  >
                    <Sparkles className="w-6 h-6 text-green-500" />
                  </motion.div>
                ))}

                {/* Success message */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-green-400 text-center"
                >
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-gray-800 mb-2">Growth Mindset!</p>
                  <p className="text-gray-600">You shifted from self-blame to learning</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reframe options */}
          <div className="space-y-3 mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-green-600" />
              Match this thought to a growth-minded reframe:
            </h4>
            {shuffledReframes.map((reframe, index) => {
              const isSelected = selectedReframe?.text === reframe.text;
              const isCorrect = reframe.isCorrect;
              const showFeedback = selectedReframe !== null;

              return (
                <motion.button
                  key={index}
                  whileHover={!selectedReframe ? { scale: 1.02 } : {}}
                  whileTap={!selectedReframe ? { scale: 0.98 } : {}}
                  onClick={() => handleReframeSelect(reframe)}
                  disabled={!!selectedReframe}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                    isSelected && isCorrect
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg'
                      : isSelected && !isCorrect
                      ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-400 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      isSelected && isCorrect
                        ? 'bg-green-500'
                        : isSelected && !isCorrect
                        ? 'bg-red-500'
                        : 'bg-gray-200'
                    }`}>
                      {isSelected && isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : isSelected && !isCorrect ? (
                        <XCircle className="w-5 h-5 text-white" />
                      ) : (
                        <span className="text-gray-600 font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">{reframe.text}</p>
                      {showFeedback && isSelected && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`text-sm mt-2 ${
                            isCorrect ? 'text-green-700' : 'text-red-700'
                          }`}
                        >
                          {reframe.explanation}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Parent tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Speak to yourself the way you'd comfort your child after a mistake. When your child makes a mistake, you'd say: "It's okay, we all make mistakes. What can we learn from this?" Give yourself the same compassion and curiosity.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default GrowthMindsetGame;

