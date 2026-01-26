import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Scenario: Your expenses increase slightly this month. Question: What is the safest first step?",
    options: [
      {
        id: "loan",
        label: "Take a loan to cover the gap",
        reflection: "Taking a loan for small expense increases can create unnecessary debt and interest payments.",
        isCorrect: false,
      },
      {
        id: "adjust",
        label: "Reduce or adjust spending to match income",
        reflection: "Exactly! Adjusting spending to match income is the safest first step to avoid creating debt.",
        isCorrect: true,
      },
      {
        id: "borrow",
        label: "Borrow from friends or family",
        reflection: "Even informal borrowing should not be the first response to small expense increases.",
        isCorrect: false,
      },
      {
        id: "credit",
        label: "Use credit card for the additional expenses",
        reflection: "Using credit cards for ongoing expenses can lead to accumulating high-interest debt.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "Why should borrowing not be the first response to small financial gaps?",
    options: [
      {
        id: "debt",
        label: "It creates unnecessary debt and interest obligations",
        reflection: "That's right! Small gaps can often be addressed by adjusting spending rather than taking on debt.",
        isCorrect: true,
      },
      {
        id: "expensive",
        label: "Loans are always expensive",
        reflection: "While loans have costs, the main issue is that small gaps should be managed without debt, not that loans are always expensive.",
        isCorrect: false,
      },
      {
        id: "available",
        label: "Loans are not always available",
        reflection: "While loan availability can be an issue, the main problem is the unnecessary creation of debt for small gaps.",
        isCorrect: false,
      },
      {
        id: "complex",
        label: "Loan application process is too complex",
        reflection: "The complexity of application isn't the main issue; the primary concern is avoiding unnecessary debt for small gaps.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "Scenario: You notice your monthly expenses are consistently exceeding your income. What should you do first?",
    options: [
      {
        id: "reduce",
        label: "Identify and reduce non-essential expenses",
        reflection: "Excellent! Addressing the expense side first is safer than increasing debt obligations.",
        isCorrect: true,
      },
      {
        id: "loan",
        label: "Take a loan to balance the budget",
        reflection: "Taking a loan to balance a recurring deficit just adds to the financial burden instead of fixing the root cause.",
        isCorrect: false,
      },
      {
        id: "work",
        label: "Find additional sources of income immediately",
        reflection: "While increasing income can help, reducing expenses is often more controllable and immediate than finding additional income.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore it and hope it resolves itself",
        reflection: "Ignoring persistent gaps can lead to growing financial problems and increased debt.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What is the most sustainable approach to managing occasional expense increases?",
    options: [
     
      {
        id: "credit",
        label: "Always rely on credit cards for emergencies",
        reflection: "Reliance on credit cards for emergencies can lead to high-interest debt and financial stress.",
        isCorrect: false,
      },
      {
        id: "loan",
        label: "Take a personal loan for each emergency",
        reflection: "Frequent loans for small emergencies create unnecessary debt and interest payments.",
        isCorrect: false,
      },
      {
        id: "borrow",
        label: "Borrow from someone each time",
        reflection: "Regular borrowing from others can strain relationships and doesn't address the need for financial stability.",
        isCorrect: false,
      },
       {
        id: "budget",
        label: "Maintain an emergency fund for fluctuations",
        reflection: "Perfect! Having an emergency fund provides a buffer for occasional expense increases without needing to borrow.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "How should you prioritize when facing a temporary income decrease?",
    options: [
     
      {
        id: "borrow",
        label: "Borrow to maintain current lifestyle",
        reflection: "Borrowing to maintain lifestyle during income reduction creates financial risk and unnecessary debt.",
        isCorrect: false,
      },
       {
        id: "expenses",
        label: "First adjust expenses to match reduced income",
        reflection: "Exactly! Adjusting expenses to match income should be the first response to avoid creating financial gaps.",
        isCorrect: true,
      },
      {
        id: "invest",
        label: "Sell investments to cover expenses",
        reflection: "While selling investments is an option, adjusting expenses is typically the safer first step before liquidating investments.",
        isCorrect: false,
      },
      {
        id: "work",
        label: "Immediately find a higher-paying job",
        reflection: "While seeking better income is good long-term, first adjust expenses to match current income to avoid immediate financial pressure.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const SpendingAdjustmentTest = () => {
  const location = useLocation();
  const gameId = "finance-adults-6";
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
      "Why should borrowing never be the first response to small financial gaps?",
      "How can adjusting spending help maintain financial stability?",
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
      title="Spending Adjustment Test"
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
            <span>Spending Adjustment</span>
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
                  Skill unlocked: <strong>Spending adjustment and borrowing avoidance</strong>
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

export default SpendingAdjustmentTest;