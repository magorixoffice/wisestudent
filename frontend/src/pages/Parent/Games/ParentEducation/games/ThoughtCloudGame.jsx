import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Cloud, CheckCircle, XCircle, Sparkles, Eye } from "lucide-react";

const ThoughtCloudGame = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-46";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentSession, setCurrentSession] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userSelections, setUserSelections] = useState({}); // Track user selections for each option
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);



  // Fixed questions with 5 options each to identify as useful or ignore
  const sessions = [
    {
      id: 1,
      title: "Identifying Helpful Thoughts",
      description: "Look at these 5 thoughts and identify which ones are helpful/useful for your mental wellbeing.",
      context: "In this exercise, you'll practice distinguishing between helpful and unhelpful thoughts. This skill helps you focus on thoughts that serve you.",
      options: [
        { id: 1, text: "I can handle what comes my way", isUseful: true },
        { id: 3, text: "Each day is a fresh start", isUseful: true },
        { id: 2, text: "I'm overwhelmed and can't cope", isUseful: false },
        { id: 4, text: "Everyone else has it figured out", isUseful: false },
        { id: 5, text: "I'm learning and growing daily", isUseful: true }
      ],
      parentTip: "Teaching yourself to identify helpful thoughts helps you model emotional regulation for your child. They'll learn to notice which thoughts serve them and which don't."
    },
    {
      id: 2,
      title: "Parenting Perspective",
      description: "Evaluate these 5 parenting-related thoughts and identify which ones are constructive.",
      context: "As a parent, recognizing helpful versus unhelpful thoughts impacts not just you, but also models emotional intelligence for your child.",
      options: [
        { id: 1, text: "My child is capable and growing", isUseful: true },
        { id: 2, text: "I'm not good enough as a parent", isUseful: false },
        { id: 3, text: "Every parent has their own journey", isUseful: true },
        { id: 5, text: "I can only control this moment", isUseful: true },
        { id: 4, text: "Other parents seem to have it together", isUseful: false },
      ],
      parentTip: "When you model thoughtful evaluation of your thoughts, you teach your child to do the same. They learn that thoughts aren't facts—they can be examined and evaluated."
    },
    {
      id: 3,
      title: "Work-Life Balance",
      description: "Assess these 5 thoughts about work-life balance and determine which support your wellbeing.",
      context: "Balancing responsibilities requires recognizing thoughts that empower versus those that disempower you.",
      options: [
        { id: 1, text: "I need to finish this project", isUseful: true },
        { id: 2, text: "I'm spread too thin", isUseful: false },
        { id: 4, text: "Work is taking over my life", isUseful: false },
        { id: 3, text: "I can prioritize and manage", isUseful: true },
        { id: 5, text: "I'm learning to set boundaries", isUseful: true }
      ],
      parentTip: "Children learn about balance by watching how you manage your own thoughts and priorities. Your ability to distinguish helpful from unhelpful thoughts sets an example."
    },
    {
      id: 4,
      title: "Managing Stress",
      description: "Review these 5 stress-related thoughts and identify which ones promote resilience.",
      context: "Stress management begins with recognizing thoughts that increase stress versus those that help you cope.",
      options: [
        { id: 1, text: "I can handle challenges as they come", isUseful: true },
        { id: 2, text: "Everything feels out of control", isUseful: false },
        { id: 3, text: "I can control my response", isUseful: true },
        { id: 4, text: "I can't cope with this stress", isUseful: false },
        { id: 5, text: "I've handled difficult things before", isUseful: true }
      ],
      parentTip: "Your approach to managing stressful thoughts directly impacts how your child learns to manage their own emotions. Demonstrating thought evaluation builds their resilience."
    },
    {
      id: 5,
      title: "Gratitude and Growth",
      description: "Consider these 5 thoughts and identify which ones foster gratitude and personal growth.",
      context: "Cultivating awareness of thoughts that promote gratitude and growth enhances overall wellbeing for you and your family.",
      options: [
        { id: 1, text: "I'm grateful for my family", isUseful: true },
        { id: 2, text: "I wish things were different", isUseful: false },
        { id: 4, text: "I compare myself to others", isUseful: false },
        { id: 3, text: "I'm growing every day", isUseful: true },
        { id: 5, text: "My journey is unique", isUseful: true }
      ],
      parentTip: "Practicing gratitude and growth-oriented thinking creates a positive environment for your child. They learn to focus on what's going well and their own unique path."
    }
  ];

  const currentSessionData = sessions[currentSession];

  

  // Start the session
  const startSession = () => {
    setIsPlaying(true);
  };

  

  

  // Handle option selection
  const handleOptionSelection = (optionId, userChoice) => {
    setUserSelections(prev => ({
      ...prev,
      [optionId]: userChoice // 'useful' or 'ignore'
    }));
  };

  // Calculate if current session is completed correctly
  const isSessionCompleted = () => {
    const currentOptions = sessions[currentSession].options;
    for (const option of currentOptions) {
      const userSelection = userSelections[`${currentSession}-${option.id}`];
      if (!userSelection) return false; // Not all options selected yet
      
      // Check if user's selection matches the correct answer
      const isCorrect = (userSelection === 'useful') === option.isUseful;
      if (!isCorrect) return false; // At least one wrong answer
    }
    return true; // All selections are correct
  };

  // Check if all options in session are selected
  const isSessionAttempted = () => {
    const currentOptions = sessions[currentSession].options;
    return currentOptions.every(option => userSelections[`${currentSession}-${option.id}`]);
  };

  // Effect to check if session is complete and auto-proceed if needed
  useEffect(() => {
    if (isPlaying && isSessionAttempted()) {
      // Auto-proceed after a brief delay to let user see results
      const timer = setTimeout(() => {
        // Award score if session completed correctly
        if (isSessionCompleted() && score < totalLevels) {
          setScore(prev => prev + 1);
        }
        
        if (currentSession < sessions.length - 1) {
          setCurrentSession(prev => prev + 1);
          setIsPlaying(false);
        } else {
          setShowGameOver(true);
        }
      }, 2000); // Wait 2 seconds before auto-proceeding
      
      return () => clearTimeout(timer);
    }
  }, [userSelections, isPlaying, currentSession]);

  // Handle next session
  const handleNext = () => {
    if (currentSession < sessions.length - 1) {
      setCurrentSession(prev => prev + 1);
      setIsPlaying(false);
    } else {
      setShowGameOver(true);
    }
  };

  const progress = ((currentSession + 1) / totalLevels) * 100;
  const sessionComplete = isSessionCompleted();
  const sessionAttempted = isSessionAttempted();

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Thought Cloud Game"}
        subtitle="Practice Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={score >= totalLevels}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">☁️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Thought Cloud Practice Mastered!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've learned to observe thoughts without getting lost in them. Remember: notice thoughts like clouds—watch, don't chase.
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> Notice thoughts like clouds—watch, don't chase. When you observe thoughts without getting lost in them, you teach your child the same skill. They'll learn to notice their thoughts without being controlled by them. The practice of observing thoughts like clouds teaches emotional regulation—a gift you give your child through your own practice.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Thought Cloud Game"}
      subtitle={`Session ${currentSession + 1} of ${totalLevels}: ${currentSessionData.title}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentSession + 1}
    >
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <motion.div
          key={currentSession}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Session {currentSession + 1} of {totalLevels}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Session context */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-indigo-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{currentSessionData.title}</h3>
            <p className="text-gray-700 mb-2">{currentSessionData.description}</p>
            <p className="text-sm text-gray-600 italic mb-3">{currentSessionData.context}</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                <strong>💡 Parent Tip:</strong> {currentSessionData.parentTip}
              </p>
            </div>
          </div>

          {!isPlaying && (
            /* Start screen */
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Thought Classification Practice</h3>
                <p className="text-gray-700 mb-6">
                  In this exercise, you'll review 5 thoughts in each session and classify each as either "Useful" or "Ignore". Focus on thoughts that serve your wellbeing.
                </p>
                <div className="flex items-center justify-center gap-6 mb-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    <span>Review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5" />
                    <span>Classify</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Decide</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startSession}
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 mx-auto"
                >
                  <Cloud className="w-6 h-6" />
                  Begin Session {currentSession + 1}
                </motion.button>
              </div>
            </div>
          )}

          {isPlaying && (
            /* Options display area */
            <div className="mb-8">
              <div className="space-y-4">
                {currentSessionData.options.map((option) => {
                  const optionKey = `${currentSession}-${option.id}`;
                  const userSelection = userSelections[optionKey];
                  const isCorrect = userSelection ? (userSelection === 'useful') === option.isUseful : null;
                  
                  return (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg border-2 bg-white shadow-sm"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium">{option.text}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => !userSelection && handleOptionSelection(optionKey, 'useful')}
                            disabled={!!userSelection}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              userSelection === 'useful'
                                ? 'bg-green-500 text-white'
                                : userSelection 
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                            }`}
                          >
                            Useful
                          </button>
                          <button
                            onClick={() => !userSelection && handleOptionSelection(optionKey, 'ignore')}
                            disabled={!!userSelection}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              userSelection === 'ignore'
                                ? 'bg-red-500 text-white'
                                : userSelection 
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                            }`}
                          >
                            Ignore
                          </button>
                        </div>
                      </div>
                      {userSelection && (
                        <div className="mt-2 text-sm">
                          {isCorrect ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" /> Correct
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center gap-1">
                              <XCircle className="w-4 h-4" /> Incorrect
                            </span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Session status display */}
          {isPlaying && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Status: {Object.keys(userSelections).filter(key => key.startsWith(`${currentSession}-`)).length}/5 selected
                </span>
                {sessionComplete && (
                  <span className="text-green-600 font-semibold">✓ All Correct!</span>
                )}
              </div>
            </div>
          )}

          {sessionAttempted && !isPlaying && (
            /* Session complete */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-xl p-8 border-2 text-center ${
                sessionComplete 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
                  : 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300'
              }`}
            >
              <div className="text-6xl mb-4">{sessionComplete ? '✨' : '💭'}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {sessionComplete ? 'Session Complete!' : 'Session Finished'}
              </h3>
              <p className="text-gray-700 mb-6">
                {sessionComplete
                  ? 'Great job! You correctly identified all useful thoughts.'
                  : 'Try again! Review the correct answers to improve your thought classification skills.'}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                {currentSession < sessions.length - 1 ? 'Next Session' : 'Complete Practice'}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default ThoughtCloudGame;

