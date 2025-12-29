import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BoysShouldNotCryDebate = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const questions = [
    {
      id: 1,
      text: "Is crying weakness or natural?",
      options: [
        {
          id: "b",
          text: "Weakness",
          emoji: "💪"
        },
        {
          id: "a",
          text: "Natural",
          emoji: "😢"
        },
        {
          id: "c",
          text: "Only for girls",
          emoji: "👧"
        }
      ],
      correctAnswer: "a",
      explanation: "Crying is a natural emotional response for everyone, regardless of gender. Expressing emotions is healthy and shows emotional intelligence."
    },
    {
      id: 2,
      text: "What happens when boys suppress emotions?",
      options: [
        {
          id: "a",
          text: "Makes them stronger",
          emoji: "💪"
        },
        {
          id: "c",
          text: "Nothing happens",
          emoji: "😐"
        },
        {
          id: "b",
          text: "Builds mental health issues",
          emoji: "😞"
        }
      ],
      correctAnswer: "b",
      explanation: "Suppressing emotions can lead to mental health issues. Acknowledging and processing emotions is healthier."
    },
    {
      id: 3,
      text: "How should teens handle difficult emotions?",
      options: [
        {
          id: "c",
          text: "Talk about feelings openly",
          emoji: "💬"
        },
        {
          id: "a",
          text: "Hide them completely",
          emoji: "🤐"
        },
        {
          id: "b",
          text: "Only cry in private",
          emoji: "🏠"
        }
      ],
      correctAnswer: "c",
      explanation: "Talking about feelings with trusted individuals helps process emotions healthily. Open communication leads to better mental health and stronger relationships."
    },
    {
      id: 4,
      text: "A friend is crying. What is the manly thing to do?",
      options: [
        {
          id: "b",
          text: "Laugh at him",
          emoji: "😆"
        },
        {
          id: "a",
          text: "Comfort him",
          emoji: "🤗"
        },
        {
          id: "c",
          text: "Tell him to stop",
          emoji: "🛑"
        }
      ],
      correctAnswer: "a",
      explanation: "Being supportive and empathetic toward friends who are struggling shows true strength and character. Comforting friends in need builds stronger relationships."
    },
    {
      id: 5,
      text: "You feel like crying but are in public. Is it okay?",
      options: [
        {
          id: "a",
          text: "No, never show weakness",
          emoji: "🚫"
        },
        {
          id: "b",
          text: "Run away",
          emoji: "🏃"
        },
        {
          id: "c",
          text: "Yes, it's a natural reaction",
          emoji: "😢"
        }
      ],
      correctAnswer: "c",
      explanation: "It's completely natural and okay to express emotions anywhere. Vulnerability is not weakness - it's a normal part of being human."
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || showFeedback) return;
    
    resetFeedback(); // Reset any existing feedback
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1); // 1 point per correct answer
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
    navigate("/student/health-male/teens/journal-of-stress");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Boys Should Not Cry?"
      subtitle={!gameFinished ? `Debate ${currentQuestion + 1} of ${questions.length}` : "Debate Complete!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-56"
      gameType="health-male"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Score: {score}</span>
          </div>
          
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold text-white mb-2">Emotional Expression Debate</h3>
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
                    <div className="text-2xl mr-4">{option.emoji}</div>
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
              You scored {score} out of {questions.length}!
            </p>
            <p className="text-white/80 mb-8">
              Real strength is being honest about your feelings.
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

export default BoysShouldNotCryDebate;
