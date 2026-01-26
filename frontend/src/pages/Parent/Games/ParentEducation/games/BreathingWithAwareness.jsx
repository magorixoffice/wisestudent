import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { CheckCircle, XCircle } from "lucide-react";

const BreathingWithAwareness = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-44";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  // Quiz-related states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [answers, setAnswers] = useState(Array(totalLevels).fill(null));

  // Questions for the quiz
  const questions = [
    {
      id: 1,
      question: "Which breathing technique is most effective for helping children manage anxiety before tests?",
      options: [
        "Rapid breathing for 30 seconds",
        
        "Holding breath for as long as possible",
        "Shallow breathing for 1 minute",
        "Slow, deep breathing with 4-second inhale, 2-second hold, 6-second exhale",
      ],
      correctAnswer: 3, // Index of correct answer
      correctTip: "Perfect! The 4-2-6 breathing pattern helps activate the parasympathetic nervous system, reducing anxiety and promoting calm focus.",
      incorrectTip: "The 4-2-6 breathing pattern (inhale for 4, hold for 2, exhale for 6) is most effective. It activates the parasympathetic nervous system, reducing anxiety and promoting calm focus. Teach this to your child before tests or stressful situations."
    },
    {
      id: 2,
      question: "How can parents model mindful breathing for their children?",
      options: [
        "By explaining the technique only",
        "By practicing the breathing themselves when stressed",
        "By reading about breathing techniques",
        "By using breathing apps alone"
      ],
      correctAnswer: 1,
      correctTip: "Great! Children learn by observing. When they see you use breathing techniques during stress, they're more likely to adopt these practices themselves.",
      incorrectTip: "The most effective way is by practicing breathing techniques yourself during stressful moments. Children learn by observing, so when they see you use these techniques, they're more likely to adopt them too."
    },
    {
      id: 3,
      question: "When is the best time to practice mindful breathing with children?",
      options: [
        "During calm moments as well as stressful ones",
        "Only during stressful moments",
        "Only before bedtime",
        "Only during tantrums"
      ],
      correctAnswer: 0,
      correctTip: "Excellent! Practicing during calm moments helps establish the habit, making it easier to access during stressful times. Consistency builds resilience.",
      incorrectTip: "The best approach is to practice during calm moments as well as stressful ones. This helps establish the habit, making it easier to access during stressful times. Consistency builds resilience in both you and your child."
    },
    {
      id: 4,
      question: "What is the primary benefit of breathing with awareness for parents?",
      options: [
        "Increased productivity at work",
        "Improved physical fitness",
        "Better emotional regulation and reduced stress",
        "Enhanced cooking skills"
      ],
      correctAnswer: 2,
      correctTip: "Exactly! Breathing with awareness helps regulate emotions and reduce stress, allowing you to respond to parenting challenges with greater calm and clarity.",
      incorrectTip: "Breathing with awareness primarily helps with emotional regulation and reducing stress. This allows you to respond to parenting challenges with greater calm and clarity, rather than reacting from a place of stress."
    },
    {
      id: 5,
      question: "How can mindful breathing help during difficult conversations with children?",
      options: [
        "By making the conversation shorter",
        "By helping parents stay calm and present",
        "By changing the subject",
        "By allowing parents to speak louder"
      ],
      correctAnswer: 1,
      correctTip: "That's right! Mindful breathing helps parents stay calm and present, enabling more effective communication and modeling emotional regulation for their children.",
      incorrectTip: "Mindful breathing helps parents stay calm and present during difficult conversations. This enables more effective communication and models emotional regulation for your children, showing them how to handle challenging discussions with composure."
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];



  const progress = ((currentQuestionIndex + 1) / totalLevels) * 100;

  // Handle answer selection
  const handleAnswerSelect = (optionIndex) => {
    if (selectedOption !== null) return; // Prevent changing answer after selection
    
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    setSelectedOption(optionIndex);
    
    // Update score if correct
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // Update answers array
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      selected: optionIndex,
      correct: currentQuestion.correctAnswer,
      isCorrect: isCorrect
    };
    setAnswers(newAnswers);
    
    // Show result briefly before moving to next question
    setShowResult(true);
    
    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setShowResult(false);
      } else {
        setShowGameOver(true);
      }
    }, 3000); // Wait 3 seconds to show result
  };


  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Breathing with Awareness"}
        subtitle="Quiz Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentQuestion={totalLevels - 1}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">🧠</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Breathing with Awareness Quiz Completed!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You got <span className="font-bold text-indigo-600">{score}</span> out of <span className="font-bold text-indigo-600">{totalLevels}</span> questions correct.
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> Remember to practice the 4-2-6 breathing pattern (inhale for 4, hold for 2, exhale for 6) regularly. Model this for your children during calm moments and stressful ones alike. This helps both you and your child develop emotional regulation skills.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Breathing with Awareness"}
      subtitle={`Question ${currentQuestionIndex + 1} of ${totalLevels}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentQuestionIndex}
    >
      <div className="w-full max-w-3xl mx-auto px-4 py-6">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestionIndex + 1} of {totalLevels}</span>
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

          {/* Question card */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-indigo-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{currentQuestion.question}</h3>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-6">
            {currentQuestion.options.map((option, index) => {
              let optionStyle = "bg-white border-2 border-gray-200 hover:border-indigo-300";
              
              // Style for selected option
              if (selectedOption === index) {
                if (index === currentQuestion.correctAnswer) {
                  optionStyle = "bg-green-50 border-2 border-green-500";
                } else {
                  optionStyle = "bg-red-50 border-2 border-red-500";
                }
              }
              
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: selectedOption === null ? 1.02 : 1 }}
                  whileTap={{ scale: selectedOption === null ? 0.98 : 1 }}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedOption !== null}
                  className={`${optionStyle} w-full text-left p-4 rounded-xl transition-all duration-200 flex items-start`}
                >
                  <span className="font-bold mr-3 text-gray-700">{String.fromCharCode(65 + index)}.</span>
                  <span className="text-gray-800">{option}</span>
                  {selectedOption === index && (
                    <span className="ml-auto text-2xl">
                      {index === currentQuestion.correctAnswer ? (
                        <CheckCircle className="text-green-600" />
                      ) : (
                        <XCircle className="text-red-600" />
                      )}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Result display */}
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border-2 ${selectedOption === currentQuestion.correctAnswer ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
            >
              <p className={`font-medium ${selectedOption === currentQuestion.correctAnswer ? 'text-green-800' : 'text-red-800'}`}>
                <strong>{selectedOption === currentQuestion.correctAnswer ? 'Correct!' : 'Not quite!'}</strong>
                {' '}
                {selectedOption === currentQuestion.correctAnswer 
                  ? currentQuestion.correctTip 
                  : currentQuestion.incorrectTip}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default BreathingWithAwareness;

