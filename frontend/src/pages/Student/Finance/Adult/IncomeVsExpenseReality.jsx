import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt:
      "You earn ₹18,000 but expenses are ₹20,000. What is the immediate truth?",
    options: [
      {
        id: "saving",
        label: "You are saving money",
        reflection: "Reality check: When expenses exceed income, there's no surplus to save.",
        isCorrect: false,
      },
      
      {
        id: "balanced",
        label: "Your income and expenses are balanced",
        reflection: "Reality check: When expenses exceed income, there's no balance.",
        isCorrect: false,
      },
      {
        id: "overspending",
        label: "You are spending more than you earn",
        reflection: "That's right! When expenses are ₹2,000 more than income, you're in a deficit situation.",
        isCorrect: true,
      },
      {
        id: "profitable",
        label: "You are making a profit",
        reflection: "Profit applies to businesses, not personal finance. Here you're losing money monthly.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt:
      "How should you respond when take-home < expenses on a month?",
    options: [
      {
        id: "pause",
        label: "Pause discretionary purchases immediately",
        reflection: "Excellent! Reducing discretionary spending is the first step when facing a shortfall.",
        isCorrect: true,
      },
      {
        id: "splurge",
        label: "Enjoy now, handle shortfall later",
        reflection: "This approach leads to accumulating debt and financial stress.",
        isCorrect: false,
      },
      {
        id: "borrow",
        label: "Borrow money to cover expenses",
        reflection: "Borrowing creates more debt and interest payments, worsening the financial situation.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore the problem",
        reflection: "Ignoring financial problems makes them worse over time.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "What budgeting step keeps you in control?",
    options: [
      
      {
        id: "ignore",
        label: "Ignore statements until payday",
        reflection: "Ignoring expenses prevents you from identifying where money is going.",
        isCorrect: false,
      },
      {
        id: "estimate",
        label: "Estimate expenses roughly",
        reflection: "While estimates help, precise tracking gives better control over finances.",
        isCorrect: false,
      },
      {
        id: "guess",
        label: "Guess how much you spend",
        reflection: "Guessing leads to poor financial decisions and surprises.",
        isCorrect: false,
      },
      {
        id: "track",
        label: "Track every expense and compare to income",
        reflection: "Absolutely! Tracking expenses is the foundation of financial control.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "If subscriptions eat into your income, you would:",
    options: [
      
      {
        id: "keep",
        label: "Keep them because they feel important now",
        reflection: "Keeping unnecessary subscriptions continues to strain your budget.",
        isCorrect: false,
      },
      {
        id: "trim",
        label: "Trim or pause subscriptions that aren’t essential",
        reflection: "Great choice! Subscriptions often drain money without much thought.",
        isCorrect: true,
      },
      {
        id: "upgrade",
        label: "Upgrade to premium versions",
        reflection: "Upgrading increases expenses when you need to reduce them.",
        isCorrect: false,
      },
      {
        id: "double",
        label: "Subscribe to more services",
        reflection: "Adding more subscriptions increases expenses further.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "When income is less than expense, best next action is:",
    options: [
      {
        id: "rethink",
        label: "Rethink goals and plan a smaller spending target",
        reflection: "Excellent! Adjusting spending targets to match income is financially responsible.",
        isCorrect: true,
      },
      {
        id: "borrow",
        label: "Borrow to cover the exact gap",
        reflection: "Borrowing without changing spending habits just delays the problem.",
        isCorrect: false,
      },
      {
        id: "increase",
        label: "Increase income immediately",
        reflection: "While increasing income helps, it takes time and effort to implement.",
        isCorrect: false,
      },
      {
        id: "panic",
        label: "Panic and make hasty decisions",
        reflection: "Panicking leads to poor financial decisions. Stay calm and think logically.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const IncomeVsExpenseReality = () => {
  const location = useLocation();
  const gameId = "finance-adults-1";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const [stageIndex, setStageIndex] = useState(0);
  const [coins, setCoins] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [history, setHistory] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [canProceed, setCanProceed] = useState(false);

  const reflectionPrompts = useMemo(
    () => [
      "Which expense can you postpone while still meeting obligations?",
      "How can you guard next month’s income from a deficit?",
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
    setHistory([]);
    setSelectedOption(null);
    setCoins(0);
    setFinalScore(0);
    setShowResult(false);
  };

  const subtitle = `Stage ${Math.min(stageIndex + 1, totalStages)} of ${totalStages}`;
  const stage = STAGES[Math.min(stageIndex, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Income vs Expense Reality"
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
          <div className="flex text-sm uppercase tracking-[0.3em] text-white/60 justify-between mb-4">
            <span>Scenario</span>
            <span>Budget Reality</span>
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
                        ? "border-green-400 bg-emerald-500/20"
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
                  Skill unlocked: <strong>Expense awareness</strong>
                </p>
                {!hasPassed && (
                  <p className="text-xs text-amber-300">
                    Answer every stage smartly to earn the full reward.
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

export default IncomeVsExpenseReality;
