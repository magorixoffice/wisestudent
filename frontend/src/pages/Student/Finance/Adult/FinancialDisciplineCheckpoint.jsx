import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "When you receive your salary, what should you do first?",
    options: [
      {
        id: "spend",
        label: "Spend freely on wants and desires",
        reflection: "Spending freely without planning often leads to running out of money before month-end.",
        isCorrect: false,
      },
      
      {
        id: "invest",
        label: "Immediately invest all available funds",
        reflection: "While investing is important, you need to plan for expenses first before investing.",
        isCorrect: false,
      },
      {
        id: "debt",
        label: "Pay off all debts before anything else",
        reflection: "Paying debts is important, but first you need to plan for essential expenses and savings.",
        isCorrect: false,
      },
      {
        id: "plan",
        label: "Plan expenses and set aside savings",
        reflection: "Exactly! Planning first and setting aside savings prevents overspending and builds financial discipline.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "Your expenses have increased slightly this month. What is the safest first step?",
    options: [
      {
        id: "loan",
        label: "Take a loan to cover the gap",
        reflection: "Taking a loan for small expense increases creates unnecessary debt and interest payments.",
        isCorrect: false,
      },
      {
        id: "adjust",
        label: "Reduce or adjust spending to match income",
        reflection: "Exactly! Adjusting spending to match income is the safest first step to maintain financial discipline.",
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
    id: 3,
    prompt: "Which habit helps most with financial discipline?",
    options: [
      {
        id: "ignore",
        label: "Ignoring expenses",
        reflection: "Ignoring expenses makes it impossible to understand where your money goes or identify spending patterns.",
        isCorrect: false,
      },
      
      {
        id: "estimate",
        label: "Estimating expenses at the end of the month",
        reflection: "Estimating at the end of the month is imprecise and often misses small but significant expenses that add up.",
        isCorrect: false,
      },
      {
        id: "track",
        label: "Tracking daily spending",
        reflection: "Exactly! Tracking spending reveals hidden money leaks and helps develop financial discipline.",
        isCorrect: true,
      },
      {
        id: "review",
        label: "Reviewing bank statements occasionally",
        reflection: "While reviewing bank statements is helpful, daily tracking gives more detailed insight into spending patterns.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "You have a small emergency. Which option is safer?",
    options: [
        {
        id: "savings",
        label: "Use savings if available",
        reflection: "Exactly! Using savings for emergencies is safer as it avoids debt and demonstrates financial discipline.",
        isCorrect: true,
      },
      {
        id: "borrow",
        label: "Borrow immediately",
        reflection: "Borrowing immediately for small emergencies can create unnecessary debt and interest payments.",
        isCorrect: false,
      },
      
      {
        id: "credit",
        label: "Use credit card for the emergency",
        reflection: "Using credit for emergencies creates debt and potentially high interest charges if not paid immediately.",
        isCorrect: false,
      },
      {
        id: "friends",
        label: "Borrow from friends or family",
        reflection: "Even informal borrowing should be avoided when savings are available as it can strain relationships.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "Your income is fixed. Which action keeps you financially disciplined?",
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
        reflection: "Exactly! Balancing expenses within your fixed income maintains financial discipline and prevents debt cycles.",
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
];

const totalStages = STAGES.length;
const successThreshold = totalStages; // All 7 must be correct

const FinancialDisciplineCheckpoint = () => {
  const location = useLocation();
  const gameId = "finance-adults-10";
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
      "How do these financial decisions demonstrate discipline?",
      "What habits will help you maintain financial discipline going forward?",
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
      title="Financial Discipline Checkpoint"
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
            <span>Decision</span>
            <span>Financial Discipline</span>
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
                      <strong>Congratulations!</strong> You now understand basic money discipline and are ready to learn about banking and credit.
                    </>
                  ) : (
                    <>Skill unlocked: <strong>Basic financial discipline</strong></>
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

export default FinancialDisciplineCheckpoint;