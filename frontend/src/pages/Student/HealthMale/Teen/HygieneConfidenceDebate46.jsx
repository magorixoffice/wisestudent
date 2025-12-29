import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HygieneConfidenceDebate46 = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-46";

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Does smelling good make you confident?",
      options: [
        {
          id: "a",
          text: "Yes, it boosts self-esteem",
          emoji: "💪"
        },
        {
          id: "b",
          text: "No, it doesn't matter much",
          emoji: "🤷"
        },
        {
          id: "c",
          text: "Yes, helps in social situations",
          emoji: "🤝"
        }
      ],
      correctAnswer: "a",
      explanation: "Good hygiene boosts self-esteem. You feel better when you smell fresh, and it impacts social interactions positively."
    },
    {
      id: 2,
      text: "Can bad breath ruin a conversation?",
      options: [
        {
          id: "b",
          text: "No, people ignore it",
          emoji: "🤥"
        },
        {
          id: "a",
          text: "Yes, it's distracting",
          emoji: "🤢"
        },
        {
          id: "c",
          text: "Only if you shout",
          emoji: "🗣️"
        }
      ],
      correctAnswer: "a",
      explanation: "It pushes people away. It's hard to ignore, and even whispering spreads it."
    },
    {
      id: 3,
      text: "Do clean clothes matter?",
      options: [
        {
          id: "c",
          text: "No, messy is cool",
          emoji: "🗑️"
        },
        {
          id: "b",
          text: "Only expensive ones",
          emoji: "💲"
        },
        {
          id: "a",
          text: "Yes, shows self-respect",
          emoji: "👔"
        }
      ],
      correctAnswer: "a",
      explanation: "You feel better in clean clothes. Clean is respectful, and cleanliness > brand."
    },
    {
      id: 4,
      text: "Can you be confident with acne?",
      options: [
        {
          id: "b",
          text: "No, hide face",
          emoji: "🙈"
        },
        {
          id: "a",
          text: "Yes, personality shines",
          emoji: "✨"
        },
        {
          id: "c",
          text: "Only in dark rooms",
          emoji: "🌑"
        }
      ],
      correctAnswer: "a",
      explanation: "You are more than your skin. Don't hide, and be confident everywhere."
    },
    {
      id: 5,
      text: "Is self-care selfish?",
      options: [
        {
          id: "c",
          text: "Yes, help others only",
          emoji: "🤲"
        },
        {
          id: "b",
          text: "It's a waste of time",
          emoji: "⌛"
        },
        {
          id: "a",
          text: "No, it's healthy",
          emoji: "❤️"
        }
      ],
      correctAnswer: "a",
      explanation: "Taking care of you is good. You must help yourself first, and it's essential."
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || showFeedback) return;
    
    resetFeedback(); // Reset any existing feedback
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setCoins(prev => prev + 1); // 1 coin per correct answer
      showCorrectAnswerFeedback(1, true);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/journal-of-care");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Hygiene Confidence Debate"
subtitle={!gameFinished ? `Debate ${currentQuestion + 1} of ${questions.length}` : "Debate Complete!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Score: {coins}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🧼</div>
            <h3 className="text-2xl font-bold text-white mb-2">Hygiene & Confidence Debate</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getCurrentQuestion().options.map(option => {
              const isSelected = selectedOption === option.id;
              const isCorrect = option.id === getCurrentQuestion().correctAnswer;
              const showCorrect = showFeedback && isCorrect;
              const showIncorrect = showFeedback && isSelected && !isCorrect;
              
              // Add emojis for each option like in the reference game
              const optionEmojis = {
                a: "✅",
                b: "❌",
                c: "⚠️"
              };
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={showFeedback}
                  className={`bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left ${
                    showFeedback ? (isCorrect ? 'ring-4 ring-green-500' : isSelected ? 'ring-4 ring-red-500' : '') : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">{optionEmojis[option.id] || '❓'}</div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className={`mt-6 p-4 rounded-xl ${
              selectedOption === getCurrentQuestion().correctAnswer
                ? 'bg-green-500/20 border border-green-500/30'
                : 'bg-red-500/20 border border-red-500/30'
            }`}>
              <p className={`font-semibold ${
                selectedOption === getCurrentQuestion().correctAnswer
                  ? 'text-green-300'
                  : 'text-red-300'
              }`}>
                {selectedOption === getCurrentQuestion().correctAnswer
                  ? 'Correct! 🎉'
                  : 'Not quite right!'}
              </p>
              <p className="text-white/90 mt-2">
                {getCurrentQuestion().explanation}
              </p>
            </div>
          )}
        </div>
        
        {gameFinished && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Debate Complete!</h3>
            <p className="text-xl text-white/90 mb-6">
              You scored {coins} out of {questions.length}!
            </p>
            <p className="text-white/80 mb-8">
              Good hygiene habits boost confidence and social connections.
            </p>
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              Next Challenge
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HygieneConfidenceDebate46;
