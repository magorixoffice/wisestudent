import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { Award, Heart, Brain, Shield, Star, Smile } from "lucide-react";

const EmotionSmartTeenBadge = () => {
  const navigate = useNavigate();
  
  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-male-teen-60";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Emotional Intelligence",
      text: "What is emotional intelligence?",
      icon: <Brain className="w-12 h-12 text-purple-400" />,
      options: [
        {
          text: "Being smart at math",
          emoji: "➗",
          isCorrect: false
        },
        {
          text: "Ignoring emotions",
          emoji: "🙈",
          isCorrect: false
        },
        {
          text: "Understanding & managing emotions",
          emoji: "🧠",
          isCorrect: true
        },
        {
          text: "Never expressing feelings",
          emoji: "🤐",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Emotional intelligence involves recognizing, understanding, and managing our own emotions and those of others.",
        wrong: "Emotional intelligence is about understanding and managing emotions effectively, not about academic subjects or suppressing feelings."
      }
    },
    {
      id: 2,
      title: "Empathy Importance",
      text: "Why is empathy important?",
      icon: <Heart className="w-12 h-12 text-red-400" />,
      options: [
        {
          text: "Connects us to others",
          emoji: "🤝",
          isCorrect: true
        },
        {
          text: "Makes you weak",
          emoji: "🦺",
          isCorrect: false
        },
        {
          text: "Wastes time",
          emoji: "⏰",
          isCorrect: false
        },
        {
          text: "Creates conflict",
          emoji: "⚔️",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "That's right! Empathy helps us form meaningful connections and understand different perspectives.",
        wrong: "Empathy is a strength that enables us to relate to others and build stronger relationships."
      }
    },
    {
      id: 3,
      title: "Handling Rejection",
      text: "How to handle rejection?",
      icon: <Shield className="w-12 h-12 text-blue-400" />,
      options: [
        {
          text: "Seek revenge",
          emoji: "⚔️",
          isCorrect: false
        },
        {
          text: "Accept and move on",
          emoji: "✅",
          isCorrect: true
        },
        {
          text: "Give up forever",
          emoji: "🏳️",
          isCorrect: false
        },
        
        {
          text: "Blame everyone else",
          emoji: "😠",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Acceptance allows us to learn from experiences and continue growing.",
        wrong: "Healthy responses to rejection involve acceptance, learning, and moving forward constructively."
      }
    },
    {
      id: 4,
      title: "Healthy Boundaries",
      text: "What is a healthy boundary?",
      icon: <Star className="w-12 h-12 text-yellow-400" />,
      options: [
        {
          text: "Always saying yes",
          emoji: "👍",
          isCorrect: false
        },
        {
          text: "Never talking to anyone",
          emoji: "🔇",
          isCorrect: false
        },
        {
          text: "Saying no when needed",
          emoji: "✋",
          isCorrect: true
        },
        {
          text: "Controlling others",
          emoji: "👑",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Setting boundaries means knowing your limits and communicating them respectfully.",
        wrong: "Healthy boundaries involve self-respect, clear communication, and mutual respect in relationships."
      }
    },
    {
      id: 5,
      title: "Self-Care Practices",
      text: "Self-care includes...",
      icon: <Smile className="w-12 h-12 text-green-400" />, 
      options: [
       
        {
          text: "Only physical exercise",
          emoji: "🏃",
          isCorrect: false
        },
        
       
        {
          text: "Neglecting your needs",
          emoji: "🙈",
          isCorrect: false
        },
        {
          text: "Working constantly",
          emoji: "💼",
          isCorrect: false
        },
         {
          text: "Physical and mental wellness",
          emoji: "🧘",
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Absolutely! Self-care involves activities that restore and rejuvenate your mind and body.",
        wrong: "True self-care encompasses physical, emotional, and mental well-being through balanced practices."
      }
    }
  ];

  const handleChoice = (optionIndex) => {
    if (answered) return;

    setAnswered(true);
    setSelectedOptionIndex(optionIndex);
    resetFeedback();

    const selectedOption = questions[currentQuestion].options[optionIndex];
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    const isLastQuestion = currentQuestion === questions.length - 1;

    setTimeout(() => {
      if (isLastQuestion) {
        setGameFinished(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
        setSelectedOptionIndex(null);
      }
    }, 2000);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setGameFinished(false);
    setSelectedOptionIndex(null);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/health-male/teens");
  };

  const currentQ = questions[currentQuestion];

  return (
    <GameShell
      title="Emotion Smart Teen Badge"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-male"
      totalLevels={5}
      currentLevel={60}
      showConfetti={gameFinished && score >= 4}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!gameFinished ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{maxScore}</span>
              </div>

              <div className="flex justify-center mb-4">
                {currentQ.icon}
              </div>

              <h2 className="text-2xl font-bold text-white mb-2 text-center">
                {currentQ.title}
              </h2>
              
              <p className="text-xl text-white mb-8 text-center">
                {currentQ.text}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOptionIndex === idx;
                  const showFeedback = answered;

                  let buttonClass = "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3";

                  if (showFeedback) {
                    if (isSelected) {
                      buttonClass = option.isCorrect
                        ? "bg-green-500 ring-4 ring-green-300 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3"
                        : "bg-red-500 ring-4 ring-red-300 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3";
                    } else {
                      buttonClass = "bg-white/10 opacity-50 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleChoice(idx)}
                      disabled={showFeedback}
                      className={buttonClass}
                    >
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="font-bold text-lg">{option.text}</span>
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className={`mt-4 p-4 rounded-xl ${
                  currentQ.options[selectedOptionIndex]?.isCorrect
                    ? "bg-green-500/20 border border-green-500/30"
                    : "bg-red-500/20 border border-red-500/30"
                }`}>
                  <p className="text-white font-semibold">
                    {currentQ.options[selectedOptionIndex]?.isCorrect
                      ? currentQ.feedback.correct
                      : currentQ.feedback.wrong}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 4 ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Emotion Smart Teen Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about emotional intelligence with {score} correct answers out of {questions.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Emotion Smart Teen</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Emotional Awareness</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to recognize and manage emotions effectively in yourself and others.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Healthy Relationships</h4>
                    <p className="text-white/90 text-sm">
                      You know how to establish boundaries and build meaningful connections with empathy.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Emotional Intelligence!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {questions.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review emotional intelligence concepts to strengthen your knowledge and earn your badge.
                </p>
                <button
                  onClick={handleRetry}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EmotionSmartTeenBadge;
