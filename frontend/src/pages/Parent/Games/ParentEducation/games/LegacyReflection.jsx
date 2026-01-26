import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { TreePine, BookOpen, Heart, Sparkles, CheckCircle, Users, Star } from "lucide-react";

const LegacyReflection = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-82";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [reflections, setReflections] = useState({
    whatITeach: "",
    whatIModel: "",
    whatIllBeRememberedFor: "",
    howIGrow: "",
    howIFoster: ""
  });
  const [showGameOver, setShowGameOver] = useState(false);

  const handleReflectionChange = (branch, value) => {
    setReflections(prev => ({
      ...prev,
      [branch]: value
    }));
  };

  const handleComplete = () => {
    if (allBranchesComplete) {
      setShowGameOver(true);
    }
  };

  const allBranchesComplete = 
    reflections.whatITeach.trim().length >= 20 &&
    reflections.whatIModel.trim().length >= 20 &&
    reflections.whatIllBeRememberedFor.trim().length >= 20 &&
    reflections.howIGrow.trim().length >= 20 &&
    reflections.howIFoster.trim().length >= 20;

  const branches = [
    {
      id: 'whatITeach',
      label: 'What I Teach',
      prompt: 'What values, lessons, or knowledge do you consciously teach your children?',
      emoji: '📚',
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-300',
      icon: BookOpen,
      description: 'The lessons and values you intentionally share'
    },
    {
      id: 'whatIModel',
      label: 'What I Model',
      prompt: 'What behaviors, attitudes, and ways of being do you demonstrate through your actions?',
      emoji: '✨',
      color: 'from-purple-400 to-violet-500',
      bgColor: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-300',
      icon: Sparkles,
      description: 'The behaviors you demonstrate through your actions'
    },
    {
      id: 'whatIllBeRememberedFor',
      label: "What I'll Be Remembered For",
      prompt: 'What do you hope your children will remember most about you? What legacy do you want to leave?',
      emoji: '💫',
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-300',
      icon: Heart,
      description: 'The lasting memories and impact you hope to create'
    },
    {
      id: 'howIGrow',
      label: 'How I Grow',
      prompt: 'How do you continue to grow and develop as a parent? What areas are you working on?',
      emoji: '🌱',
      color: 'from-green-400 to-teal-500',
      bgColor: 'from-green-50 to-teal-50',
      borderColor: 'border-green-300',
      icon: Star,
      description: 'Your ongoing growth and development as a parent'
    },
    {
      id: 'howIFoster',
      label: 'How I Foster',
      prompt: 'How do you foster your child\'s growth, independence, and development?',
      emoji: '👪',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-300',
      icon: Users,
      description: 'How you nurture and support your child\'s development'
    }
  ];

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Legacy Reflection"}
        subtitle="Legacy Complete!"
        showGameOver={true}
        score={Object.values(reflections).filter(r => r.trim().length >= 20).length}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={true}
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
                🌳
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Legacy Tree</h2>
              <p className="text-lg text-gray-600">
                You've identified the values and memories you wish to leave behind.
              </p>
            </div>

            {/* Family Tree Visual */}
            <div className="mb-8">
              <div className="flex flex-col items-center">
                {/* Tree Trunk */}
                <div className="w-24 h-32 bg-gradient-to-b from-amber-700 to-amber-900 rounded-lg mb-4 shadow-lg"></div>
                
                {/* Five Branches - arranged in two rows */}
                <div className="flex flex-wrap justify-center gap-4 w-full max-w-4xl mb-4">
                  {branches.slice(0, 3).map((branch, index) => (
                    <motion.div
                      key={branch.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="flex-1 min-w-[150px] max-w-[200px]"
                    >
                      {/* Branch Line */}
                      <div className="flex items-start">
                        <div className={`w-12 h-1 bg-gradient-to-r ${branch.color} mt-4`}></div>
                        <div className={`w-1 h-12 bg-gradient-to-b ${branch.color}`}></div>
                      </div>
                      
                      {/* Branch Leaf/Card */}
                      <div className={`bg-gradient-to-br ${branch.bgColor} rounded-xl p-4 border-2 ${branch.borderColor} shadow-lg mt-2`}>
                        <div className="text-3xl mb-2 text-center">{branch.emoji}</div>
                        <h3 className="text-sm font-bold text-gray-800 text-center">{branch.label}</h3>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex flex-wrap justify-center gap-4 w-full max-w-4xl mb-8">
                  {branches.slice(3).map((branch, index) => {
                    const actualIndex = index + 3;
                    return (
                      <motion.div
                        key={branch.id}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: actualIndex * 0.2 }}
                        className="flex-1 min-w-[150px] max-w-[200px]"
                      >
                        {/* Branch Line */}
                        <div className="flex items-start">
                          <div className={`w-12 h-1 bg-gradient-to-r ${branch.color} mt-4`}></div>
                          <div className={`w-1 h-12 bg-gradient-to-b ${branch.color}`}></div>
                        </div>
                        
                        {/* Branch Leaf/Card */}
                        <div className={`bg-gradient-to-br ${branch.bgColor} rounded-xl p-4 border-2 ${branch.borderColor} shadow-lg mt-2`}>
                          <div className="text-3xl mb-2 text-center">{branch.emoji}</div>
                          <h3 className="text-sm font-bold text-gray-800 text-center">{branch.label}</h3>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Reflections Display */}
            <div className="space-y-6 mb-8">
              {branches.map((branch, index) => (
                <motion.div
                  key={branch.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-br ${branch.bgColor} rounded-xl p-6 border-2 ${branch.borderColor}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <branch.icon className={`w-6 h-6 ${branch.color.split(' ')[1]}`} />
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{branch.label}</h3>
                      <p className="text-sm text-gray-600">{branch.description}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-5 border border-gray-200">
                    <p className="text-gray-800 leading-relaxed italic text-lg">
                      "{reflections[branch.id]}"
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TreePine className="w-6 h-6 text-green-600" />
                Building Your Legacy
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>What You Teach:</strong> The conscious lessons and values you share create the foundation of your legacy. These are the principles you want your children to carry forward.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>What You Model:</strong> Your actions speak louder than words. The behaviors you demonstrate daily become the blueprint your children follow, often unconsciously.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>What You'll Be Remembered For:</strong> Legacy is built through the small moments—the tone you use, the time you give, the tenderness you show. These daily choices create lasting memories.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>How You Grow:</strong> Your continuous growth as a parent creates a model for lifelong learning. When children see you working on yourself, they learn the importance of personal development.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>How You Foster:</strong> The way you support and encourage your child's development shapes their confidence, independence, and sense of self-worth.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Daily Building:</strong> Legacy isn't built in grand gestures—it's built daily through tone, time, and tenderness. Every interaction shapes the memories your children will carry.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Legacy is built daily through tone, time, and tenderness. The values you teach, the behaviors you model, and the memories you create are woven into the fabric of your children's lives through countless small moments. Your legacy isn't determined by perfect parenting—it's shaped by your consistent presence, your authentic self, and the love you show. Keep this reflection close and let it guide you in those challenging moments when you need to remember what truly matters.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Legacy Reflection"}
      subtitle="Build Your Legacy Tree"
      showGameOver={false}
      score={0}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={1}
    >
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🌳</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Legacy Reflection</h2>
            <p className="text-gray-600 text-lg">
              Identify what values and memories you wish to leave behind.
            </p>
          </div>

          {/* Family Tree Visual */}
          <div className="mb-8">
            <div className="flex flex-col items-center">
              {/* Tree Trunk */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-32 bg-gradient-to-b from-amber-700 to-amber-900 rounded-lg mb-4 shadow-lg"
              ></motion.div>
              
              {/* Five Branches - arranged in two rows */}
              <div className="flex flex-wrap justify-center gap-4 w-full max-w-4xl mb-4">
                {branches.slice(0, 3).map((branch, index) => {
                  const isComplete = reflections[branch.id]?.trim().length >= 20;
                  return (
                    <motion.div
                      key={branch.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="flex-1 min-w-[150px] max-w-[200px]"
                    >
                      {/* Branch Line */}
                      <div className="flex items-start">
                        <div className={`w-12 h-1 bg-gradient-to-r ${branch.color} mt-4 ${isComplete ? 'opacity-100' : 'opacity-30'}`}></div>
                        <div className={`w-1 h-12 bg-gradient-to-b ${branch.color} ${isComplete ? 'opacity-100' : 'opacity-30'}`}></div>
                      </div>
                      
                      {/* Branch Leaf/Card */}
                      <div className={`bg-gradient-to-br ${branch.bgColor} rounded-xl p-4 border-2 ${branch.borderColor} shadow-lg mt-2 ${isComplete ? 'ring-2 ring-green-400' : ''}`}>
                        <div className="text-3xl mb-2 text-center">{branch.emoji}</div>
                        <h3 className="text-sm font-bold text-gray-800 text-center">{branch.label}</h3>
                        {isComplete && (
                          <div className="flex justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex flex-wrap justify-center gap-4 w-full max-w-4xl mb-8">
                {branches.slice(3).map((branch, index) => {
                  const actualIndex = index + 3;
                  const isComplete = reflections[branch.id]?.trim().length >= 20;
                  return (
                    <motion.div
                      key={branch.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: actualIndex * 0.2 }}
                      className="flex-1 min-w-[150px] max-w-[200px]"
                    >
                      {/* Branch Line */}
                      <div className="flex items-start">
                        <div className={`w-12 h-1 bg-gradient-to-r ${branch.color} mt-4 ${isComplete ? 'opacity-100' : 'opacity-30'}`}></div>
                        <div className={`w-1 h-12 bg-gradient-to-b ${branch.color} ${isComplete ? 'opacity-100' : 'opacity-30'}`}></div>
                      </div>
                      
                      {/* Branch Leaf/Card */}
                      <div className={`bg-gradient-to-br ${branch.bgColor} rounded-xl p-4 border-2 ${branch.borderColor} shadow-lg mt-2 ${isComplete ? 'ring-2 ring-green-400' : ''}`}>
                        <div className="text-3xl mb-2 text-center">{branch.emoji}</div>
                        <h3 className="text-sm font-bold text-gray-800 text-center">{branch.label}</h3>
                        {isComplete && (
                          <div className="flex justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reflection Inputs */}
          <div className="space-y-6 mb-6">
            {branches.map((branch, index) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${branch.bgColor} rounded-xl p-6 border-2 ${branch.borderColor}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <branch.icon className={`w-6 h-6 ${branch.color.split(' ')[1]}`} />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{branch.label}</h3>
                    <p className="text-sm text-gray-600">{branch.description}</p>
                  </div>
                  {reflections[branch.id]?.trim().length >= 20 && (
                    <CheckCircle className="w-6 h-6 text-green-600 ml-auto" />
                  )}
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                  <p className="text-sm font-semibold text-gray-700 mb-2">{branch.prompt}</p>
                </div>

                <textarea
                  value={reflections[branch.id]}
                  onChange={(e) => handleReflectionChange(branch.id, e.target.value)}
                  placeholder={`Write your reflection about ${branch.label.toLowerCase()}...`}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-800 min-h-[120px] resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-600">
                    {(reflections[branch.id]?.length || 0)} characters (minimum 20)
                  </p>
                  {reflections[branch.id]?.trim().length >= 20 && (
                    <span className="text-sm text-green-600 font-semibold">✓ Complete</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">Legacy Tree Progress</p>
              <p className="text-sm font-bold text-gray-800">
                {Object.values(reflections).filter(r => r.trim().length >= 20).length}/5 branches complete
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(Object.values(reflections).filter(r => r.trim().length >= 20).length / 5) * 100}%` }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Complete Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleComplete}
            disabled={!allBranchesComplete}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <TreePine className="w-5 h-5" />
            View Complete Legacy Tree
          </motion.button>

          {!allBranchesComplete && (
            <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
              <p className="text-yellow-800 text-sm text-center">
                Please complete all five branches (minimum 20 characters each) to view your complete legacy tree.
              </p>
            </div>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Legacy is built daily through tone, time, and tenderness. The values you teach, the behaviors you model, and the memories you create shape your children's lives through countless small moments.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default LegacyReflection;

