import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Scenario: You just received your paycheck. Which purchase is a NEED?",
    options: [
      {
        id: "rent",
        label: "Pay rent for your apartment",
        reflection: "Exactly! Rent is a basic necessity for shelter and is a primary need.",
        isCorrect: true,
      },
      {
        id: "gaming",
        label: "Buy the latest gaming console",
        reflection: "While entertainment is nice, a gaming console is a want, not a need.",
        isCorrect: false,
      },
      {
        id: "luxury",
        label: "Purchase designer clothes",
        reflection: "Designer clothes are a luxury item and considered a want, not a need.",
        isCorrect: false,
      },
      {
        id: "car",
        label: "Get a new car stereo system",
        reflection: "A car stereo is an enhancement, not a necessity for transportation.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "Scenario: You're grocery shopping. Which item is a WANT?",
    options: [
      {
        id: "bread",
        label: "Bread and basic groceries for meals",
        reflection: "Bread and basic groceries are necessities for sustenance.",
        isCorrect: false,
      },
      {
        id: "chocolate",
        label: "Gourmet chocolate for dessert",
        reflection: "Gourmet chocolate is a luxury item and considered a want.",
        isCorrect: true,
      },
      {
        id: "vegetables",
        label: "Fresh vegetables for nutrition",
        reflection: "Vegetables are essential for a healthy diet and are a need.",
        isCorrect: false,
      },
      {
        id: "milk",
        label: "Milk for daily consumption",
        reflection: "Milk is a basic food item necessary for nutrition.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "Scenario: Your phone is still working but is 3 years old. Which is the wiser choice?",
    options: [
      {
        id: "upgrade",
        label: "Upgrade to the newest model",
        reflection: "Upgrading to a newer model when your current phone still works is a want.",
        isCorrect: false,
      },
      {
        id: "repair",
        label: "Repair your current phone if needed",
        reflection: "Repairing your current phone is practical and focuses on necessity.",
        isCorrect: true,
      },
      {
        id: "accessory",
        label: "Buy premium phone case and accessories",
        reflection: "Accessories are enhancements and considered wants, not needs.",
        isCorrect: false,
      },
      {
        id: "screen",
        label: "Replace screen protector with premium one",
        reflection: "Premium screen protectors are upgrades and considered wants.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "Scenario: You have extra money at the end of the month. What should you prioritize?",
    options: [
      {
        id: "vacation",
        label: "Book an expensive vacation",
        reflection: "Vacations are enjoyable but are considered wants, not needs.",
        isCorrect: false,
      },
      
      {
        id: "dining",
        label: "Dine at expensive restaurants",
        reflection: "Expensive dining is a luxury and considered a want.",
        isCorrect: false,
      },
      {
        id: "shopping",
        label: "Go shopping for new clothes",
        reflection: "Shopping for new clothes is typically a want unless you lack basics.",
        isCorrect: false,
      },
      {
        id: "emergency",
        label: "Build an emergency fund",
        reflection: "An emergency fund is crucial for financial security and is a wise need.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "Scenario: Your car needs maintenance. What's the priority?",
    options: [
      {
        id: "performance",
        label: "Install performance upgrades",
        reflection: "Performance upgrades are enhancements and considered wants.",
        isCorrect: false,
      },
      
      {
        id: "stereo",
        label: "Upgrade the sound system",
        reflection: "Sound system upgrades are luxury items and considered wants.",
        isCorrect: false,
      },
      {
        id: "insurance",
        label: "Ensure insurance coverage is up to date",
        reflection: "Insurance is a critical need for protection against accidents.",
        isCorrect: true,
      },
      {
        id: "appearance",
        label: "Get a detailed exterior cleaning",
        reflection: "Appearance improvements are aesthetic and considered wants.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const NeedsVsWants = () => {
  const location = useLocation();
  const gameId = "finance-adults-3";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const [stageIndex, setStageIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [coins, setCoins] = useState(0);
  const [history, setHistory] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [canProceed, setCanProceed] = useState(false);

  const reflectionPrompts = useMemo(
    () => [
      "How can distinguishing needs from wants protect your monthly budget?",
      "What strategies will help you prioritize spending on necessities first?",
    ],
    []
  );

  const handleSelect = (option) => {
    if (selectedOption || showResult) return;
    resetFeedback();
    const updatedHistory = [
      ...history,
      { stageId: STAGES[stageIndex].id, isCorrect: option.isCorrect },
    ];
    setHistory(updatedHistory);
    setSelectedOption(option.id);
    setSelectedReflection(option.reflection); // Set the reflection for the selected option
    setShowFeedback(true); // Show feedback after selection
    setCanProceed(false); // Disable proceeding initially
    
    // Update coins if the answer is correct
    if (option.isCorrect) {
      setCoins(prevCoins => prevCoins + 1);
    }
    
    // Wait for the reflection period before allowing to proceed
    setTimeout(() => {
      setCanProceed(true); // Enable proceeding after showing reflection
    }, 1500); // Wait 2.5 seconds before allowing to proceed
    
    // Handle the final stage separately
    if (stageIndex === totalStages - 1) {
      setTimeout(() => {
        const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
        const passed = correctCount === successThreshold;
        setFinalScore(correctCount);
        setCoins(passed ? totalCoins : 0); // Set final coins based on performance
        setShowResult(true);
      }, 2500); // Wait longer before showing final results
    }
    
    const points = option.isCorrect ? 1 : 0;
    showCorrectAnswerFeedback(points, option.isCorrect);
  };

  const handleRetry = () => {
    resetFeedback();
    setStageIndex(0);
    setSelectedOption(null);
    setCoins(0);
    setHistory([]);
    setFinalScore(0);
    setShowResult(false);
  };

  const subtitle = `Stage ${Math.min(stageIndex + 1, totalStages)} of ${totalStages}`;
  const stage = STAGES[Math.min(stageIndex, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Needs vs Wants - Daily Choices"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={totalStages}
      currentLevel={Math.min(stageIndex + 1, totalStages)}
      totalLevels={totalStages}
      gameId={gameId}
      gameType="finance"
      showGameOver={showResult}
      showConfetti={showResult && hasPassed}
      shouldSubmitGameCompletion={hasPassed}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-5 text-white">
        <div className="bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4 text-sm uppercase tracking-[0.3em] text-white/60">
            <span>Scenario</span>
            <span>Needs vs Wants</span>
          </div>
          <p className="text-lg text-white/90 mb-6">{stage.prompt}</p>
          <div className="grid grid-cols-2 gap-4">
            {stage.options.map((option) => {
              const isSelected = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  disabled={!!selectedOption}
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    isSelected
                      ? option.isCorrect
                        ? "border-emerald-400 bg-emerald-500/20"
                        : "border-red-400 bg-red-500/10 text-white"
                        : "border-white/30 bg-white/5 hover:border-white/60 hover:bg-white/10"
                  }`}
                >
                  <div className="text-sm text-white/70 mb-2">
                    Choice {option.id.toUpperCase()}
                  </div>
                  <p className="text-white font-semibold">{option.label}</p>
                  
                </button>
              );
            })}
          </div>
          <div className="mt-6 text-right text-sm text-white/70">
            Coins collected: <strong>{coins}</strong>
          </div>
        </div>
        {(showResult || showFeedback) && (
          <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
            <h4 className="text-lg font-semibold text-white">Reflection</h4>
            {selectedReflection && (
              <div className="max-h-24 overflow-y-auto pr-2">
                <p className="text-sm text-white/90">{selectedReflection}</p>
              </div>
            )}
            {showFeedback && !showResult && (
              <div className="mt-4 flex justify-center">
                {canProceed ? (
                  <button
                    onClick={() => {
                      if (stageIndex < totalStages - 1) {
                        setStageIndex((prev) => prev + 1);
                        setSelectedOption(null);
                        setSelectedReflection(null);
                        setShowFeedback(false);
                        setCanProceed(false);
                      }
                    }}
                    className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-6 font-semibold shadow-lg hover:opacity-90"
                  >
                    Continue
                  </button>
                ) : (
                  <div className="py-2 px-6 text-white font-semibold">Reading...</div>
                )}
              </div>
            )}
            {/* Automatically advance if we're in the last stage and the timeout has passed */}
            {!showResult && stageIndex === totalStages - 1 && canProceed && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => {
                    const updatedHistory = [
                      ...history,
                      { stageId: STAGES[stageIndex].id, isCorrect: STAGES[stageIndex].options.find(opt => opt.id === selectedOption)?.isCorrect },
                    ];
                    const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
                    const passed = correctCount === successThreshold;
                    setFinalScore(correctCount);
                    setCoins(passed ? totalCoins : 0);
                    setShowResult(true);
                  }}
                  className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-6 font-semibold shadow-lg hover:opacity-90"
                >
                  Finish
                </button>
              </div>
            )}
            {showResult && (
              <>
                <ul className="text-sm list-disc list-inside space-y-1">
                  {reflectionPrompts.map((prompt) => (
                    <li key={prompt}>{prompt}</li>
                  ))}
                </ul>
                <p className="text-sm text-white/70">
                  Skill unlocked: <strong>Prioritizing needs over wants</strong>
                </p>
                {!hasPassed && (
                  <p className="text-xs text-amber-300">
                    Answer every stage sharply to earn the full reward.
                  </p>
                )}
                {!hasPassed && (
                  <button
                    onClick={handleRetry}
                    className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
                  >
                    Try Again
                  </button>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </GameShell>
  );
};

export default NeedsVsWants;