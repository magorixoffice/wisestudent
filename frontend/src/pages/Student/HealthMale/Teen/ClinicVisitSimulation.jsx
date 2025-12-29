import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ClinicVisitSimulation = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const scenarios = [
    {
      id: 1,
      text: "You book a doctor visit online. When you arrive, you see many people waiting. What do you do?",
      options: [
        {
          id: "a",
          text: "Get angry and demand immediate service",
          emoji: "😠",
          isCorrect: false
        },
        {
          id: "b",
          text: "Wait calmly and read",
          emoji: "📖",
          isCorrect: false
        },
        {
          id: "c",
          text: "Panic and leave",
          emoji: "😰",
          isCorrect: false
        },
        {
          id: "d",
          text: "Arrive early next time to avoid crowds",
          emoji: "⏰",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "The nurse calls your name. How do you respond when they ask about your symptoms?",
      options: [
         {
          id: "d",
          text: "Describe symptoms clearly and accurately",
          emoji: "📝",
          isCorrect: true
        },
        {
          id: "a",
          text: "Be detailed and honest",
          emoji: "💬",
          isCorrect: false
        },
        {
          id: "b",
          text: "Give vague answers",
          emoji: "🤷",
          isCorrect: false
        },
        {
          id: "c",
          text: "Exaggerate symptoms",
          emoji: "📢",
          isCorrect: false
        },
       
      ]
    },
    {
      id: 3,
      text: "Doctor explains treatment options. What's the best way to respond?",
      options: [
        {
          id: "a",
          text: "Agree to everything immediately",
          emoji: "✅",
          isCorrect: false
        },
        {
          id: "b",
          text: "Refuse all suggestions",
          emoji: "❌",
          isCorrect: false
        },
        {
          id: "d",
          text: "Request written information about treatments",
          emoji: "📄",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ask questions about options",
          emoji: "❓",
          isCorrect: false
        },
        
      ]
    },
    {
      id: 4,
      text: "The visit is over and you have new prescriptions. What should you do next?",
      options: [
        {
          id: "a",
          text: "Fill prescriptions immediately",
          emoji: "💊",
          isCorrect: false
        },
        {
          id: "b",
          text: "Wait a few days",
          emoji: "⏰",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore the prescriptions",
          emoji: "🗑️",
          isCorrect: false
        },
        {
          id: "d",
          text: "Review instructions and ask pharmacist questions",
          emoji: "🔍",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "How should you prepare for your next follow-up appointment?",
      options: [
        {
          id: "a",
          text: "Cancel if feeling better",
          emoji: "✅",
          isCorrect: false
        },
        {
          id: "d",
          text: "Track symptoms and medication effects",
          emoji: "📊",
          isCorrect: true
        },
        {
          id: "b",
          text: "Note any questions or concerns",
          emoji: "📝",
          isCorrect: false
        },
        {
          id: "c",
          text: "Schedule and show up",
          emoji: "📅",
          isCorrect: false
        },
        
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = scenarios[currentScenario].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins(prev => prev + 1); // Increment coins when correct
    }

    setChoices([...choices, { scenario: currentScenario, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/reflex-teen-safety");
  };



  return (
    <GameShell
      title="Simulation: Clinic Visit"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-teen-78"
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <p className="text-white/90 mb-6">
            {scenarios[currentScenario].text}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scenarios[currentScenario].options.map(option => (
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

export default ClinicVisitSimulation;
