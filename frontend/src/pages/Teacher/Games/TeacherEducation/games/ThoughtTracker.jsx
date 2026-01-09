import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Edit3, Lightbulb } from "lucide-react";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";

const ThoughtTracker = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-4";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 3;
  
  const [currentThought, setCurrentThought] = useState(0);
  const [thoughtRatings, setThoughtRatings] = useState({});
  const [rewrittenThoughts, setRewrittenThoughts] = useState({});
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const dailyThoughts = [
    {
      id: 1,
      thought: "I'm going to mess up this lesson and my students will think I'm a terrible teacher.",
      context: "Before starting a new unit you haven't taught before",
      moodImpact: "This thought creates anxiety and self-doubt, making it harder to teach confidently.",
      balancedExample: "I'm trying something new, and that's okay. I can adapt as I go and ask for support if needed. My students appreciate when I'm learning too."
    },
    {
      id: 2,
      thought: "The principal is going to be disappointed in me because I didn't finish all the grading on time.",
      context: "You're behind on grading and have a meeting with your principal tomorrow",
      moodImpact: "This thought increases stress and makes you feel like you're failing, even though you're doing your best.",
      balancedExample: "I'm doing my best with the time I have. I can communicate my progress honestly and work on a realistic timeline. One delay doesn't define my teaching."
    },
    {
      id: 3,
      thought: "I can't handle another difficult parent meeting. I'm not good at these conversations.",
      context: "You have a parent meeting scheduled about a student's behavior",
      moodImpact: "This thought makes you feel powerless and anxious, setting you up for a defensive rather than collaborative conversation.",
      balancedExample: "I can prepare for this meeting and approach it as a collaborative problem-solving session. I have experience and can ask for support if needed."
    }
  ];

  const handleRating = (thoughtId, isHelpful) => {
    setThoughtRatings({
      ...thoughtRatings,
      [thoughtId]: isHelpful
    });
  };

  const handleRewrite = (thoughtId, rewritten) => {
    setRewrittenThoughts({
      ...rewrittenThoughts,
      [thoughtId]: rewritten
    });
  };

  const handleNext = () => {
    const currentThoughtId = dailyThoughts[currentThought].id;
    const hasRating = thoughtRatings[currentThoughtId] !== undefined;
    const hasRewrite = rewrittenThoughts[currentThoughtId]?.trim().length >= 10;

    if (hasRating && hasRewrite) {
      if (currentThought < dailyThoughts.length - 1) {
        setCurrentThought(currentThought + 1);
        setScore(prev => prev + 1);
      } else {
        // All thoughts completed
        setScore(prev => prev + 1);
        setShowGameOver(true);
      }
    }
  };

  const currentThoughtData = dailyThoughts[currentThought];
  const currentRating = thoughtRatings[currentThoughtData.id];
  const currentRewrite = rewrittenThoughts[currentThoughtData.id] || "";

  return (
    <TeacherGameShell
      title={gameData?.title || "Thought Tracker"}
      subtitle={gameData?.description || "Notice automatic thought patterns and how they affect mood"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentThought}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">
                Thought {currentThought + 1} of {dailyThoughts.length}
              </span>
              <span className="text-sm font-medium text-gray-500">
                Progress: {score}/{dailyThoughts.length}
              </span>
            </div>
          </div>

          {/* Current Thought Display */}
          <div className="mb-6">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200 mb-4">
              <div className="flex items-start gap-3 mb-3">
                <Lightbulb className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Daily Thought Example
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 italic">
                    Context: {currentThoughtData.context}
                  </p>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                    <p className="text-gray-800 font-medium leading-relaxed">
                      "{currentThoughtData.thought}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mood Impact */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
              <p className="text-sm text-blue-800">
                <strong>Mood Impact:</strong> {currentThoughtData.moodImpact}
              </p>
            </div>
          </div>

          {/* Step 1: Rate the Thought */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Step 1: Is this thought helpful or unhelpful?
            </h3>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRating(currentThoughtData.id, true)}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  currentRating === true
                    ? 'bg-green-50 border-green-500 shadow-md'
                    : 'bg-white border-gray-300 hover:border-green-400'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className={`w-6 h-6 ${
                    currentRating === true ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <span className={`font-semibold ${
                    currentRating === true ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    Helpful
                  </span>
                </div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRating(currentThoughtData.id, false)}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  currentRating === false
                    ? 'bg-red-50 border-red-500 shadow-md'
                    : 'bg-white border-gray-300 hover:border-red-400'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <XCircle className={`w-6 h-6 ${
                    currentRating === false ? 'text-red-600' : 'text-gray-400'
                  }`} />
                  <span className={`font-semibold ${
                    currentRating === false ? 'text-red-700' : 'text-gray-700'
                  }`}>
                    Unhelpful
                  </span>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Step 2: Rewrite the Thought */}
          {currentRating !== undefined && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-purple-600" />
                Step 2: Rewrite this thought in balanced language
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Transform the thought into a more balanced, realistic perspective. Consider: What's actually true? What's a more helpful way to think about this?
              </p>
              
              <textarea
                value={currentRewrite}
                onChange={(e) => handleRewrite(currentThoughtData.id, e.target.value)}
                placeholder="For example: 'I'm trying something new, and that's okay. I can adapt as I go and ask for support if needed.'"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:outline-none text-gray-800 min-h-[120px] resize-none"
              />
              
              <div className="mt-2 flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {currentRewrite.length} characters (minimum 10)
                </p>
                {currentRewrite.trim().length < 10 && (
                  <p className="text-xs text-orange-600">
                    Please write at least 10 characters
                  </p>
                )}
              </div>

              {/* Balanced Example (shown after they write something) */}
              {currentRewrite.trim().length >= 10 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg"
                >
                  <p className="text-sm font-semibold text-green-800 mb-2">
                    💡 Example of Balanced Thinking:
                  </p>
                  <p className="text-sm text-green-700 italic leading-relaxed">
                    "{currentThoughtData.balancedExample}"
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Next/Complete Button */}
          {currentRating !== undefined && currentRewrite.trim().length >= 10 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {currentThought < dailyThoughts.length - 1 ? 'Next Thought →' : 'Complete Thought Tracker'}
              </motion.button>
            </motion.div>
          )}

          {/* Teacher Tip */}
          <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-amber-900 mb-2">
              💡 Teacher Tip:
            </p>
            <p className="text-sm text-amber-800 leading-relaxed">
              Use this game as a morning ritual to set the tone for your day. Taking 5-10 minutes each morning to track and reframe unhelpful thoughts helps you start the day with a more balanced mindset. When you catch automatic negative thoughts early, you can rewrite them before they affect your mood and teaching. This practice builds mental resilience and helps you respond to challenges with greater clarity and calm.
            </p>
          </div>
        </div>
      </div>
    </TeacherGameShell>
  );
};

export default ThoughtTracker;

