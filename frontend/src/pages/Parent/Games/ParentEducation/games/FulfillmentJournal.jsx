import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Heart, Sparkles, CheckCircle, Star } from "lucide-react";

const FulfillmentJournal = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-86";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [step, setStep] = useState(1); // 1: Writing, 2: Animation, 3: Complete
  const [fulfillmentLines, setFulfillmentLines] = useState(['', '', '', '', '']);
  const [showAnimation, setShowAnimation] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);

  const handleLineChange = (index, value) => {
    const newLines = [...fulfillmentLines];
    newLines[index] = value;
    setFulfillmentLines(newLines);
  };

  const allLinesFilled = fulfillmentLines.every(line => line.trim().length >= 5);

  const handleComplete = () => {
    if (allLinesFilled) {
      setScore(5); // Set score to 5 for completing all 5 prompts
      setStep(2);
      setShowAnimation(true);
      startAnimation();
    }
  };

  const startAnimation = () => {
    // Animate through stages: hearts rising, sparkles, glow
    let stage = 0;
    const animationInterval = setInterval(() => {
      setAnimationStage(stage);
      stage++;
      
      if (stage > 4) {
        clearInterval(animationInterval);
        setTimeout(() => {
          setShowAnimation(false);
          setStep(3);
          setShowGameOver(true);
        }, 1500);
      }
    }, 800); // 0.8 seconds per stage
  };

  // Animation stages
  const animationStages = [
    { emoji: '💚', label: 'Heart Filling', color: 'from-pink-400 to-rose-500' },
    { emoji: '✨', label: 'Joy Sparkling', color: 'from-yellow-400 to-amber-500' },
    { emoji: '🌟', label: 'Pride Shining', color: 'from-purple-400 to-violet-500' },
    { emoji: '💫', label: 'Fulfillment Complete', color: 'from-blue-400 to-indigo-500' },
    { emoji: '🎉', label: 'Celebrating You', color: 'from-green-400 to-emerald-500' }
  ];

  if (showGameOver && step === 3) {
    return (
      <ParentGameShell
        title={gameData?.title || "Fulfillment Journal"}
        subtitle="Reflection Complete!"
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
                💚
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Heart is Full!</h2>
              <p className="text-lg text-gray-600">
                You've captured moments of joy and pride from your parenting week.
              </p>
            </div>

            {/* Reflection Display */}
            <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 rounded-xl p-8 border-2 border-pink-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-pink-600" />
                One moment that filled my heart this week was...
              </h3>
              <div className="bg-white rounded-lg p-6 border border-pink-200 space-y-4">
                {fulfillmentLines.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-pink-500 font-bold text-lg mt-1">{index + 1}.</span>
                    <p className="text-gray-800 leading-relaxed flex-1 text-lg italic">
                      "{line}"
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-green-600" />
                The Power of Noticing Fulfillment
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Fulfillment Grows When Noticed:</strong> Taking time to reflect on moments of joy and pride amplifies their impact. When you notice what's working, you create space for more fulfillment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Gratitude Transforms:</strong> Gratitude turns effort into meaning. The small moments of connection, growth, and love that you notice become the foundation of your parenting story.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Weekly Practice:</strong> Make this a weekly ritual. Reflecting on moments of fulfillment helps you see the progress and joy in your parenting journey, even on difficult days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Shared Joy:</strong> Consider sharing these moments with your children or partner. Celebrating moments of fulfillment together strengthens family bonds.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Fulfillment grows when noticed; gratitude turns effort into meaning. When you take time each week to reflect on moments that filled your heart—whether it's a breakthrough conversation, a moment of connection, or seeing your child grow—you're doing more than journaling. You're training your mind to notice the good, to appreciate your efforts, and to find meaning in the daily work of parenting. This practice transforms the routine into the sacred, and effort into fulfillment.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  // Animation step
  if (step === 2 && showAnimation) {
    const currentStage = animationStages[animationStage] || animationStages[0];
    
    return (
      <ParentGameShell
        title={gameData?.title || "Fulfillment Journal"}
        subtitle="Celebrating Your Fulfillment"
        showGameOver={false}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={1}
      >
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
          <motion.div
            key={animationStage}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className={`bg-gradient-to-br ${currentStage.color} rounded-2xl p-16 border-4 border-white shadow-2xl text-center min-h-[400px] flex flex-col items-center justify-center`}
          >
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-9xl mb-6"
            >
              {currentStage.emoji}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-4"
            >
              {currentStage.label}
            </motion.h2>
            
            {/* Floating hearts/sparkles */}
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 0, x: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: -100,
                  x: Math.random() * 200 - 100
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity
                }}
                className="absolute text-4xl"
                style={{
                  left: `${20 + i * 15}%`,
                  top: '60%'
                }}
              >
                {i % 2 === 0 ? '💚' : '✨'}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  // Writing step
  return (
    <ParentGameShell
      title={gameData?.title || "Fulfillment Journal"}
      subtitle="Reflect on Your Week"
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
            <div className="text-6xl mb-4">💚</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Fulfillment Journal</h2>
            <p className="text-gray-600 text-lg">
              Reflect on moments of joy and pride in your parenting week.
            </p>
          </div>

          {/* Prompt */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-200 mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-7 h-7 text-pink-600" />
              Reflection Prompt
            </h3>
            <div className="bg-white rounded-lg p-5 border border-pink-200 mb-4">
              <p className="text-xl font-semibold text-gray-800 mb-3">
                "One moment that filled my heart this week was…"
              </p>
              <p className="text-sm text-gray-600">
                Think about moments of joy, pride, connection, or growth from this past week. What made your heart feel full? What made you smile? What made you proud?
              </p>
            </div>
          </div>

          {/* Five Lines Input */}
          <div className="space-y-4 mb-6">
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-5 border-2 border-rose-200"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl text-pink-600 font-bold">{index + 1}.</span>
                  <div className="flex-1">
                    {fulfillmentLines[index]?.trim().length >= 5 && (
                      <CheckCircle className="w-5 h-5 text-green-600 float-right" />
                    )}
                  </div>
                </div>
                <textarea
                  value={fulfillmentLines[index]}
                  onChange={(e) => handleLineChange(index, e.target.value)}
                  placeholder={`Write about a moment that filled your heart...`}
                  className="w-full px-4 py-3 rounded-lg border-2 border-rose-300 focus:border-pink-500 focus:outline-none text-gray-800 min-h-[100px] resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-600">
                    {(fulfillmentLines[index]?.length || 0)} characters
                  </p>
                  {fulfillmentLines[index]?.trim().length >= 5 && (
                    <span className="text-sm text-green-600 font-semibold">✓ Complete</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Examples */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mb-6">
            <p className="text-sm font-semibold text-gray-800 mb-2">💡 Examples of heart-filling moments:</p>
            <ul className="text-xs text-gray-700 space-y-1 ml-4">
              <li>• A breakthrough conversation with your child</li>
              <li>• Seeing them help someone or show kindness</li>
              <li>• A moment of connection during bedtime stories</li>
              <li>• Watching them overcome a challenge</li>
              <li>• Feeling proud of how you handled a difficult situation</li>
              <li>• A spontaneous hug or "I love you"</li>
              <li>• A proud achievement moment</li>
              <li>• A moment of peace and contentment</li>
            </ul>
          </div>

          {/* Complete Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleComplete}
            disabled={!allLinesFilled}
            className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Star className="w-5 h-5" />
            Celebrate My Fulfillment
          </motion.button>

          {!allLinesFilled && (
            <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
              <p className="text-yellow-800 text-sm text-center">
                Please write at least 5 characters in each of the 3 lines to continue.
              </p>
            </div>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Fulfillment grows when noticed; gratitude turns effort into meaning. Taking time to reflect on moments of joy helps you see the progress and beauty in your parenting journey.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default FulfillmentJournal;

