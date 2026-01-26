import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Scenario: Match the expense type correctly: House rent → Fixed expense. What about eating out?",
    options: [
      {
        id: "fixed",
        label: "Eating out → Fixed expense",
        reflection: "Eating out varies based on choices and frequency, making it a variable expense.",
        isCorrect: false,
      },
      
      {
        id: "both",
        label: "Both fixed and variable depending on location",
        reflection: "Eating out is consistently variable because the amount spent changes based on choices and frequency.",
        isCorrect: false,
      },
      {
        id: "variable",
        label: "Eating out → Variable expense",
        reflection: "Exactly! Eating out costs vary based on choices and frequency, making it a variable expense.",
        isCorrect: true,
      },
      {
        id: "sometimes",
        label: "Sometimes fixed, sometimes variable",
        reflection: "Eating out is consistently variable since the amount spent changes based on choices and frequency.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "Which expense is fixed and helps you plan safely?",
    options: [
      
      {
        id: "entertainment",
        label: "Money spent on entertainment",
        reflection: "Entertainment expenses vary based on choices and activities, making them variable expenses.",
        isCorrect: false,
      },
      {
        id: "rent",
        label: "Monthly rent for housing",
        reflection: "Exactly! Rent is a fixed expense that helps you plan safely because it stays consistent each month.",
        isCorrect: true,
      },
      {
        id: "groceries",
        label: "Weekly grocery shopping",
        reflection: "Grocery expenses can vary based on sales, needs, and choices, making them typically variable.",
        isCorrect: false,
      },
      {
        id: "gas",
        label: "Gas for your vehicle",
        reflection: "Gas expenses vary based on driving habits, distance, and fuel prices, making it a variable expense.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "Scenario: Why is knowing fixed expenses important for financial planning?",
    options: [
      {
        id: "predictable",
        label: "They're predictable and help calculate remaining budget",
        reflection: "That's right! Fixed expenses are predictable, allowing you to calculate how much money remains for variable expenses and savings.",
        isCorrect: true,
      },
      {
        id: "high",
        label: "They're usually the highest expenses",
        reflection: "While fixed expenses can be high, their importance in planning comes from predictability, not necessarily size.",
        isCorrect: false,
      },
      {
        id: "automatic",
        label: "They're automatically deducted",
        reflection: "Though some fixed expenses are automatic, their importance in planning comes from their predictability and consistency.",
        isCorrect: false,
      },
      {
        id: "essential",
        label: "They're always essential needs",
        reflection: "Fixed expenses aren't always essential needs; their importance in planning comes from their predictability and consistency.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "Which of these is a variable expense that can be adjusted easily?",
    options: [
      {
        id: "loan",
        label: "Monthly loan payment",
        reflection: "Loan payments are typically fixed amounts, making them fixed expenses.",
        isCorrect: false,
      },
      {
        id: "insurance",
        label: "Insurance premiums",
        reflection: "Insurance premiums are typically fixed amounts paid regularly, making them fixed expenses.",
        isCorrect: false,
      },
      {
        id: "utilities",
        label: "Electricity and water bills",
        reflection: "Utilities vary based on usage, making them variable expenses that can fluctuate monthly.",
        isCorrect: false,
      },
      {
        id: "dining",
        label: "Money spent dining out",
        reflection: "Yes! Dining out expenses vary based on choices and frequency, making them a variable expense that can be adjusted easily.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "How does understanding fixed vs variable expenses help in budgeting?",
    options: [
      {
        id: "priority",
        label: "Helps prioritize essential fixed expenses first",
        reflection: "Exactly! Understanding expense types helps prioritize fixed expenses first since they're required and predictable.",
        isCorrect: true,
      },
      {
        id: "reduce",
        label: "Makes it easier to reduce all expenses",
        reflection: "Understanding expense types helps prioritize but doesn't necessarily make all expenses easier to reduce.",
        isCorrect: false,
      },
      {
        id: "avoid",
        label: "Allows avoiding variable expenses completely",
        reflection: "Variable expenses are often necessary and shouldn't be avoided completely; understanding them helps manage them better.",
        isCorrect: false,
      },
      {
        id: "increase",
        label: "Helps increase both fixed and variable expenses",
        reflection: "The goal is to manage expenses, not increase them; understanding expense types helps with control and planning.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const FixedVsVariableExpenses = () => {
  const location = useLocation();
  const gameId = "finance-adults-4";
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
      "How does knowing fixed expenses help you plan safely?",
      "What strategies will help you manage variable expenses effectively?",
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
    }, 1500); // Wait 1.5 seconds before allowing to proceed
    
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
      title="Fixed vs Variable Expenses"
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
            <span>Fixed vs Variable</span>
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
                  Skill unlocked: <strong>Understanding fixed vs variable expenses</strong>
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

export default FixedVsVariableExpenses;