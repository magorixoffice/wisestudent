import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "What improves loan eligibility?",
    options: [
      {
        id: "many",
        label: "Borrowing from many sources",
        reflection: "Borrowing from multiple sources often indicates financial stress and can hurt your credit eligibility.",
        isCorrect: false,
      },
      {
        id: "regular",
        label: "Regular income and repayment history",
        reflection: "Exactly! Steady income and good repayment history demonstrate financial reliability to lenders.",
        isCorrect: true,
      },
      {
        id: "assets",
        label: "Owning expensive assets only",
        reflection: "While assets help, lenders focus more on income stability and repayment behavior for eligibility.",
        isCorrect: false,
      },
      {
        id: "connections",
        label: "Having influential connections",
        reflection: "Formal lending relies on documented financial behavior rather than personal connections.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "Why does repayment history matter for eligibility?",
    options: [
      {
        id: "trust",
        label: "It builds lender trust in your reliability",
        reflection: "Exactly! Consistent repayment history shows lenders you're likely to repay new loans responsibly.",
        isCorrect: true,
      },
      {
        id: "speed",
        label: "It makes loan processing faster",
        reflection: "While good history may help with processing, the primary benefit is demonstrating repayment capability.",
        isCorrect: false,
      },
      {
        id: "amount",
        label: "It increases the loan amount automatically",
        reflection: "Repayment history helps with eligibility and terms, but loan amounts depend on multiple factors.",
        isCorrect: false,
      },
      {
        id: "fees",
        label: "It reduces all loan processing fees",
        reflection: "Good repayment history may help with terms, but fee structures vary by lender and loan type.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "How does regular income affect loan eligibility?",
    options: [
      {
        id: "stability",
        label: "It demonstrates ability to make consistent payments",
        reflection: "Exactly! Regular income shows lenders you have ongoing means to meet repayment obligations.",
        isCorrect: true,
      },
      {
        id: "luxury",
        label: "It allows borrowing for luxury purchases",
        reflection: "Income stability is about repayment capacity, not spending categories or purchase types.",
        isCorrect: false,
      },
      {
        id: "freedom",
        label: "It eliminates need for collateral",
        reflection: "Regular income helps eligibility but doesn't necessarily eliminate collateral requirements for all loans.",
        isCorrect: false,
      },
      {
        id: "approval",
        label: "It guarantees automatic loan approval",
        reflection: "Regular income improves chances but lenders consider multiple factors including credit history and debt levels.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What hurts credit eligibility the most?",
    options: [
      
      {
        id: "inquiry",
        label: "Checking your own credit report",
        reflection: "Self-checks are soft inquiries that don't affect your credit score or eligibility.",
        isCorrect: false,
      },
      {
        id: "cards",
        label: "Having multiple credit cards",
        reflection: "Number of cards matters less than how responsibly you use and repay credit.",
        isCorrect: false,
      },
      {
        id: "balance",
        label: "Maintaining low account balances",
        reflection: "Low balances actually help credit utilization ratios and support eligibility rather than hurt it.",
        isCorrect: false,
      },
      {
        id: "late",
        label: "Late or missed payments",
        reflection: "Exactly! Payment history is typically the most important factor in credit eligibility decisions.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "How does financial discipline improve credit access?",
    options: [
      
      {
        id: "spending",
        label: "It allows spending on anything desired",
        reflection: "Financial discipline is about responsible management, not unrestricted spending freedom.",
        isCorrect: false,
      },
      {
        id: "debt",
        label: "It eliminates all existing debts immediately",
        reflection: "Discipline helps manage debt responsibly but doesn't magically eliminate existing obligations.",
        isCorrect: false,
      },
      {
        id: "behavior",
        label: "It creates positive borrowing behavior patterns",
        reflection: "Exactly! Discipline in managing finances builds the track record that lenders look for in eligibility decisions.",
        isCorrect: true,
      },
      {
        id: "lenders",
        label: "It forces lenders to compete for your business",
        reflection: "Discipline improves your profile but doesn't guarantee competitive bidding from lenders.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const CreditEligibilityBasics = () => {
  const location = useLocation();
  const gameId = "finance-adults-25";
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
      "How can you build a strong repayment history over time?",
      "What daily financial habits support long-term credit eligibility?",
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
      title="Credit Eligibility Basics"
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
            <span>Credit Eligibility</span>
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
                  {hasPassed ? (
                    <>
                      <strong>Congratulations!</strong> Discipline improves access to formal credit.
                    </>
                  ) : (
                    <>Skill unlocked: <strong>Credit eligibility fundamentals</strong></>
                  )}
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

export default CreditEligibilityBasics;