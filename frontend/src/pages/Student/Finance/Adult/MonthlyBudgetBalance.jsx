import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Scenario: Your income is fixed. Which action keeps you safe?",
    options: [
      {
        id: "increase",
        label: "Increase spending to match feelings",
        reflection: "Increasing spending beyond fixed income creates a gap that often leads to debt or financial stress.",
        isCorrect: false,
      },
      {
        id: "balance",
        label: "Balance expenses within income",
        reflection: "Exactly! Balancing expenses within your fixed income keeps you financially safe and prevents debt cycles.",
        isCorrect: true,
      },
      {
        id: "borrow",
        label: "Borrow to maintain desired lifestyle",
        reflection: "Borrowing to maintain lifestyle beyond your income creates debt cycles that become increasingly difficult to escape.",
        isCorrect: false,
      },
      {
        id: "save",
        label: "Save all excess income immediately",
        reflection: "While saving is important, it's more about balancing expenses within income rather than saving all excess immediately.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What happens when expenses consistently exceed fixed income?",
    options: [
    
      {
        id: "growth",
        label: "It stimulates economic growth",
        reflection: "On a personal level, spending beyond income creates debt rather than contributing to economic growth.",
        isCorrect: false,
      },
      {
        id: "freedom",
        label: "It provides financial freedom",
        reflection: "Actually, spending beyond income creates financial constraints and reduces freedom due to debt obligations.",
        isCorrect: false,
      },
        {
        id: "debt",
        label: "It creates a debt cycle that becomes harder to break",
        reflection: "That's right! When expenses exceed income consistently, debt accumulates and becomes increasingly difficult to manage.",
        isCorrect: true,
      },
      {
        id: "investment",
        label: "It increases investment opportunities",
        reflection: "Spending beyond income usually leads to debt rather than creating investment opportunities.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "Scenario: You want to make a large purchase but your budget is tight. What is the safest approach?",
    options: [
      {
        id: "credit",
        label: "Use credit to make the purchase now",
        reflection: "Using credit when budget is tight can lead to debt cycles if the payment schedule doesn't align with your income.",
        isCorrect: false,
      },
      {
        id: "adjust",
        label: "Adjust other expenses to accommodate the purchase",
        reflection: "Good thinking! Adjusting other expenses to accommodate within your fixed income prevents debt cycles.",
        isCorrect: true,
      },
      {
        id: "postpone",
        label: "Postpone the purchase until next month",
        reflection: "While postponing is sometimes necessary, adjusting expenses within the current budget is often more effective.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore the budget and make the purchase anyway",
        reflection: "Ignoring the budget when income is fixed leads to gaps that often result in debt or financial stress.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "How does balancing expenses within income contribute to financial stability?",
    options: [
      {
        id: "predictable",
        label: "It creates predictable cash flow and prevents debt",
        reflection: "Exactly! Balancing expenses within income creates predictable cash flow and prevents the debt cycles that destabilize finances.",
        isCorrect: true,
      },
      {
        id: "simple",
        label: "It simplifies budget calculations",
        reflection: "While it does simplify calculations, the main benefit is preventing debt and creating stable cash flow.",
        isCorrect: false,
      },
      {
        id: "visible",
        label: "It makes spending more visible",
        reflection: "Visibility is a benefit, but the main contribution to stability is preventing debt and maintaining predictable cash flow.",
        isCorrect: false,
      },
      {
        id: "track",
        label: "It makes tracking easier",
        reflection: "Tracking is easier when balanced, but the primary benefit is preventing debt and maintaining stable cash flow.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What is the long-term effect of consistently balancing expenses within fixed income?",
    options: [
     
      {
        id: "savings",
        label: "It automatically increases savings",
        reflection: "While it may allow for savings, the primary long-term effect is building financial security and peace of mind.",
        isCorrect: false,
      },
      {
        id: "skills",
        label: "It develops better money management skills",
        reflection: "Skills do develop, but the main long-term effect is financial security and peace of mind from avoiding debt cycles.",
        isCorrect: false,
      },
      {
        id: "credit",
        label: "It improves your credit score",
        reflection: "Avoiding debt can help credit scores, but the primary effect is building financial security and peace of mind.",
        isCorrect: false,
      },
       {
        id: "security",
        label: "It builds financial security and peace of mind",
        reflection: "Absolutely! Consistently balancing expenses within income builds financial security and eliminates stress from debt cycles.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const MonthlyBudgetBalance = () => {
  const location = useLocation();
  const gameId = "finance-adults-9";
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
      "How does balancing expenses within income prevent debt cycles?",
      "What strategies will help you maintain a balanced budget with fixed income?",
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
      title="Monthly Budget Balance"
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
            <span>Budget Balance</span>
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
                  Skill unlocked: <strong>Balanced budgeting and debt prevention</strong>
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

export default MonthlyBudgetBalance;