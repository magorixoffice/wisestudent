import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Credit means:",
    options: [
      {
        id: "free",
        label: "Free money",
        reflection: "Credit is not free money - it must be repaid with interest, making it costly if not managed properly.",
        isCorrect: false,
      },
      {
        id: "borrowed",
        label: "Borrowed money that must be repaid",
        reflection: "Exactly! Credit is borrowed money that must be repaid, usually with interest charges.",
        isCorrect: true,
      },
      {
        id: "gift",
        label: "A gift from the lender",
        reflection: "Credit is a loan that must be repaid, not a gift. Lenders expect repayment with interest.",
        isCorrect: false,
      },
      {
        id: "investment",
        label: "An investment in your future",
        reflection: "While credit can enable investments, it's fundamentally borrowed money that requires repayment.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "When is credit helpful?",
    options: [
      {
        id: "anytime",
        label: "Anytime you want to buy something",
        reflection: "Using credit for unnecessary purchases can lead to debt problems and financial stress.",
        isCorrect: false,
      },
      
      {
        id: "emergency",
        label: "Only during emergencies",
        reflection: "While emergencies may require credit, it's most helpful when you plan for repayment in advance.",
        isCorrect: false,
      },
      {
        id: "luxury",
        label: "For luxury items you can't afford",
        reflection: "Using credit for unaffordable luxury items often leads to financial difficulties and debt.",
        isCorrect: false,
      },
      {
        id: "planned",
        label: "When repayment is planned",
        reflection: "Exactly! Credit is helpful when you have a clear plan for repayment and can afford the payments.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "What determines your creditworthiness?",
    options: [
      {
        id: "income",
        label: "Your income level only",
        reflection: "While income matters, creditworthiness depends on multiple factors including payment history and debt levels.",
        isCorrect: false,
      },
     
      {
        id: "assets",
        label: "Your physical assets only",
        reflection: "Assets are one factor, but creditworthiness is primarily determined by how you manage debt and make payments.",
        isCorrect: false,
      },
       {
        id: "history",
        label: "Your payment history and debt management",
        reflection: "Exactly! Payment history, debt-to-income ratio, and responsible debt management determine creditworthiness.",
        isCorrect: true,
      },
      {
        id: "age",
        label: "Your age and life stage",
        reflection: "Age alone doesn't determine creditworthiness - responsible financial behavior is what matters most.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What is interest on credit?",
    options: [
      {
        id: "free",
        label: "Free service charge",
        reflection: "Interest is not free - it's the cost of borrowing money that you must pay to the lender.",
        isCorrect: false,
      },
      {
        id: "cost",
        label: "The cost of borrowing money",
        reflection: "Exactly! Interest is the fee you pay for the privilege of borrowing money over time.",
        isCorrect: true,
      },
      {
        id: "bonus",
        label: "Bonus money from the lender",
        reflection: "Interest is an expense for borrowers, not a bonus. It's the price of using borrowed funds.",
        isCorrect: false,
      },
      {
        id: "discount",
        label: "Discount for early repayment",
        reflection: "Interest is the ongoing cost of borrowing, separate from any early repayment discounts or fees.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "How does credit affect your financial future?",
    options: [
        {
        id: "opportunity",
        label: "It can create opportunities when used wisely",
        reflection: "Exactly! Responsible credit use builds credit history and can enable important financial milestones.",
        isCorrect: true,
      },
      {
        id: "negative",
        label: "It always creates financial problems",
        reflection: "When used responsibly, credit can build financial opportunities and improve your financial standing.",
        isCorrect: false,
      },
      
      {
        id: "neutral",
        label: "It has no impact on your future",
        reflection: "Credit usage significantly impacts your financial future through credit scores and borrowing capacity.",
        isCorrect: false,
      },
      {
        id: "automatic",
        label: "It automatically makes you wealthy",
        reflection: "Credit is a tool that requires responsible management - it doesn't automatically create wealth.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const WhatIsCredit = () => {
  const location = useLocation();
  const gameId = "finance-adults-21";
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
      "How can credit be used as a financial tool rather than a burden?",
      "What steps can you take to build good credit habits?",
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
      title="What Is Credit?"
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
            <span>Credit Basics</span>
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
                      <strong>Congratulations!</strong> Credit helps only when repayment is planned.
                    </>
                  ) : (
                    <>Skill unlocked: <strong>Credit fundamentals</strong></>
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

export default WhatIsCredit;