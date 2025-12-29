import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DailyRoutineSimulation48 = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-48";

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const steps = [
    {
      id: 1,
      time: "7:00 AM",
      activity: "Wake up. First thing?",
      options: [
        {
          id: "a",
          text: "Check phone",
          emoji: "📱",
          isCorrect: false
        },
        {
          id: "b",
          text: "Brush teeth/Wash face",
          emoji: "🪥",
          isCorrect: false
        },
        {
          id: "c",
          text: "Eat candy",
          emoji: "🍬",
          isCorrect: false
        },
        {
          id: "d",
          text: "Drink water and stretch",
          emoji: "💧",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      time: "7:15 AM",
      activity: "Getting dressed.",
      options: [
        {
          id: "a",
          text: "Wear yesterday's socks",
          emoji: "🧦",
          isCorrect: false
        },
        {
          id: "b",
          text: "Put on deodorant & clean clothes",
          emoji: "👕",
          isCorrect: true
        },
        {
          id: "c",
          text: "Skip underwear",
          emoji: "👖",
          isCorrect: false
        },
        {
          id: "d",
          text: "Choose weather-appropriate outfit",
          emoji: "🧥",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      time: "12:00 PM",
      activity: "Lunch time. Hands are dirty.",
      options: [
        {
          id: "a",
          text: "Eat immediately",
          emoji: "🍔",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Lick fingers",
          emoji: "👅",
          isCorrect: false
        },
        {
          id: "b",
          text: "Wash hands first",
          emoji: "🧼",
          isCorrect: true
        },
        {
          id: "d",
          text: "Sanitize with hand gel",
          emoji: "🧴",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      time: "4:00 PM",
      activity: "Back from sports.",
      options: [
        {
          id: "a",
          text: "Shower",
          emoji: "🚿",
          isCorrect: true
        },
        {
          id: "b",
          text: "Sit on couch",
          emoji: "🛋️",
          isCorrect: false
        },
        {
          id: "c",
          text: "Spray perfume",
          emoji: "🌸",
          isCorrect: false
        },
        {
          id: "d",
          text: "Change into dry clothes",
          emoji: "👚",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      time: "9:00 PM",
      activity: "Bedtime.",
      options: [
        {
          id: "a",
          text: "Sleep in jeans",
          emoji: "👖",
          isCorrect: false
        },
        {
          id: "b",
          text: "Brush teeth & wear PJs",
          emoji: "🛌",
          isCorrect: true
        },
        {
          id: "c",
          text: "Eat sugar",
          emoji: "🍭",
          isCorrect: false
        },
        {
          id: "d",
          text: "Set alarm and organize tomorrow",
          emoji: "⏰",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = steps[currentStep].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/reflex-hygiene-alert-49");
  };

  return (
    <GameShell
      title="Daily Routine Simulation"
      subtitle={`Scenario ${currentStep + 1} of ${steps.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={steps.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Scenario {currentStep + 1}/{steps.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <h2 className="text-xl font-semibold text-white mb-4">
            {steps[currentStep].time}
          </h2>
          
          <p className="text-white/90 mb-6">
            {steps[currentStep].activity}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps[currentStep].options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default DailyRoutineSimulation48;
