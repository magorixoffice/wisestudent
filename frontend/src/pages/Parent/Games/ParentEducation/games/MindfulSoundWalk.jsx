import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { CheckCircle, AlertCircle, Clock, Volume2, Ear, Sparkles, Bird, Wind, Footprints, Play, Pause } from "lucide-react";

const MindfulSoundWalk = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-45";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Questions related to mindful sound walks
  const questions = [
    {
      id: 1,
      title: "Morning Garden Walk",
      description: "You're on a peaceful morning garden walk. You notice various sounds around you. Which approach best demonstrates mindful listening?",
      options: [
      
        {
          id: 'incorrect1',
          text: "Try to ignore all sounds except for your favorite one to avoid being distracted.",
          explanation: "Ignoring sounds defeats the purpose of mindful listening. Mindfulness is about openness to all experiences, not filtering them."
        },
        {
          id: 'incorrect2',
          text: "Count all the sounds you hear and write them down in a notebook.",
          explanation: "While noting sounds can be helpful, mindfulness is more about experiencing the sounds rather than analyzing them intellectually."
        },
          {
          id: 'correct',
          text: "Focus on three distinct sounds consciously - like bird songs, breeze through leaves, and your footsteps - acknowledging each without judgment.",
          explanation: "Mindful listening involves consciously identifying distinct sounds without judgment, helping ground your awareness in the present moment."
        },
      ]
    },
    {
      id: 2,
      title: "Forest Path Focus",
      description: "During a mindful walk in the forest, you realize you're thinking about work stress. What's the most mindful response?",
      options: [
        
        {
          id: 'incorrect1',
          text: "Push the thoughts away forcefully and try to empty your mind completely.",
          explanation: "Forcefully pushing thoughts away creates more mental tension. Mindfulness is about acceptance, not suppression."
        },
        {
          id: 'correct',
          text: "Notice the thought without judgment, then gently redirect your attention back to the sounds around you.",
          explanation: "Mindfulness involves observing thoughts without judgment and gently returning attention to the present moment experience."
        },
        {
          id: 'incorrect2',
          text: "Analyze the work stress in detail to resolve it while continuing the walk.",
          explanation: "Analyzing stress takes you further away from the mindful experience of the present moment."
        }
      ]
    },
    {
      id: 3,
      title: "Benefits of Sound Walking",
      description: "What is a key benefit of practicing mindful sound walks regularly?",
      options: [
        {
          id: 'correct',
          text: "It trains your brain to be present and reduces cortisol, making you more patient and connected with your child.",
          explanation: "Regular mindful sound walks train present-moment awareness and reduce stress hormones, leading to greater patience and connection."
        },
        {
          id: 'incorrect1',
          text: "It helps you become better at identifying animal species by their sounds.",
          explanation: "While you might notice more sounds, the primary benefit is stress reduction and present-moment awareness, not identification skills."
        },
        {
          id: 'incorrect2',
          text: "It gives you more topics to talk about with neighbors.",
          explanation: "This is not the intended benefit of mindful sound walks. The focus is on internal awareness and stress reduction."
        }
      ]
    },
    {
      id: 4,
      title: "Timing for Maximum Benefit",
      description: "When would be most beneficial to take a mindful sound walk?",
      options: [
        
        {
          id: 'incorrect1',
          text: "Right after your child goes to bed so you can analyze your day.",
          explanation: "While reflective time is valuable, the greatest benefit is arriving home in a calm, present state."
        },
        {
          id: 'incorrect2',
          text: "Only on weekends when you have plenty of time.",
          explanation: "Mindful sound walks can be beneficial anytime, even in short durations. Regular practice is more important than timing."
        },
        {
          id: 'correct',
          text: "Before coming home to your child, as it helps you arrive with lower stress and higher presence.",
          explanation: "Taking a mindful sound walk before interacting with your child helps you arrive in a calmer, more present state."
        },
      ]
    },
    {
      id: 5,
      title: "Building the Habit",
      description: "How can you best integrate mindful sound walks into your routine?",
      options: [
        {
          id: 'correct',
          text: "Make it a daily practice, even if just for five minutes, before coming home to your child.",
          explanation: "Consistency is key to forming the habit. Even brief daily practice before home interactions can significantly impact your presence and stress levels."
        },
        {
          id: 'incorrect1',
          text: "Save it for special occasions when you feel particularly stressed.",
          explanation: "Waiting for special occasions means missing regular opportunities for stress reduction and presence."
        },
        {
          id: 'incorrect2',
          text: "Do it only when your child is not around so they don't interrupt.",
          explanation: "Mindful sound walks are meant to enhance your presence with your child, not replace time with them."
        }
      ]
    }
  ];

  const handleAnswerSelect = (optionId) => {
    if (selectedChoices[currentQuestion]) return; // Already selected

    const newChoices = { ...selectedChoices, [currentQuestion]: optionId };
    setSelectedChoices(newChoices);

    // Increase score if correct answer
    if (optionId === 'correct') {
      setScore(prev => prev + 1);
    }

    // Show feedback for this choice
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // All questions completed
      setShowGameOver(true);
    }
  };

  const currentQuestionData = questions[currentQuestion];
  const selectedOption = currentQuestionData?.options.find(opt => opt.id === selectedChoices[currentQuestion]);

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Mindful Sound Walk"}
        subtitle="Practice Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={score >= 4} // 4 out of 5 correct answers
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">👂</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Mindful Sound Walk Mastered!</h2>
            <p className="text-lg text-gray-700 mb-6">
              You scored {score} out of {totalLevels} on mindful sound walking concepts. You've learned to tune into sounds around you to ground your awareness.
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> Walking with awareness lowers cortisol more than phone scrolling ever could. When you tune into sounds, you're grounding yourself in the present moment, not escaping into screens. After a mindful sound walk, you arrive home more present. Your lowered stress means more patience, more connection, more calm for your child. Make sound walks a daily practice.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Mindful Sound Walk"}
      subtitle={`Question ${currentQuestion + 1} of ${totalLevels}: ${currentQuestionData.title}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentQuestion + 1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {totalLevels}</span>
              <span>{Math.round(((currentQuestion + 1) / totalLevels) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / totalLevels) * 100}%` }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!showFeedback ? (
              /* Question screen */
              <motion.div
                key="question"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Ear className="w-6 h-6 text-blue-600" />
                    {currentQuestionData.title}
                  </h3>
                  <p className="text-gray-700 text-lg">{currentQuestionData.description}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Choose the most mindful approach:</h4>
                  {currentQuestionData.options.map((option, index) => {
                    const isSelected = selectedChoices[currentQuestion] === option.id;
                    const isCorrect = option.id === 'correct';
                    
                    return (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswerSelect(option.id)}
                        disabled={!!selectedChoices[currentQuestion]}
                        className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                          isSelected
                            ? (isCorrect 
                                ? 'border-green-500 bg-green-50 shadow-lg' 
                                : 'border-red-500 bg-red-50 shadow-lg')
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg ${isSelected ? (isCorrect ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-200'} flex-shrink-0`}>
                            <span className="text-white font-bold">{String.fromCharCode(65 + index)}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-700">{option.text}</p>
                          </div>
                          {isSelected && (
                            <div className={`${isCorrect ? 'text-green-600' : 'text-red-600'} flex-shrink-0`}>
                              {isCorrect ? (
                                <CheckCircle className="w-6 h-6" />
                              ) : (
                                <AlertCircle className="w-6 h-6" />
                              )}
                            </div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              /* Feedback screen */
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`bg-gradient-to-br ${selectedOption?.id === 'correct' ? 'from-green-50 to-emerald-50' : 'from-red-50 to-rose-50'} rounded-xl p-6 border-2 ${selectedOption?.id === 'correct' ? 'border-green-200' : 'border-red-200'} mb-6`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg ${selectedOption?.id === 'correct' ? 'bg-green-500' : 'bg-red-500'} flex-shrink-0`}>
                    {selectedOption?.id === 'correct' ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      {selectedOption?.id === 'correct' ? 'Correct!' : 'Feedback'}
                    </h4>
                    <p className="text-gray-700 mb-4">{selectedOption?.explanation}</p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'}
                  <Sparkles className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default MindfulSoundWalk;

