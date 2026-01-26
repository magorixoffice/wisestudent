import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You run a small shop. Which is better for inventory?",
    options: [
      {
        id: "personal",
        label: "Personal loan",
        reflection: "Personal loans are not ideal for business purposes and may not provide adequate funding or terms for inventory needs.",
        isCorrect: false,
      },
      {
        id: "business",
        label: "Business loan",
        reflection: "Exactly! Business loans are specifically designed for commercial purposes like inventory and typically offer better terms.",
        isCorrect: true,
      },
      {
        id: "either",
        label: "Either loan type works equally well",
        reflection: "Different loan types serve different purposes - business loans are specifically tailored for commercial needs.",
        isCorrect: false,
      },
      {
        id: "avoid",
        label: "Avoid loans entirely for inventory",
        reflection: "While minimizing debt is wise, business loans can be appropriate for inventory when properly planned and managed.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What distinguishes business loans from personal loans?",
    options: [
      
      {
        id: "amount",
        label: "Business loans are always larger amounts",
        reflection: "Loan amounts depend on needs and creditworthiness, not just the loan type classification.",
        isCorrect: false,
      },
      
      {
        id: "interest",
        label: "Personal loans have lower interest rates",
        reflection: "Interest rates vary by lender, credit profile, and purpose - business loans can sometimes offer competitive rates.",
        isCorrect: false,
      },
      {
        id: "purpose",
        label: "Business loans require business purpose documentation",
        reflection: "Exactly! Business loans require proof of business use and often involve business credit assessment.",
        isCorrect: true,
      },
      {
        id: "approval",
        label: "Personal loans are harder to get approved",
        reflection: "Approval difficulty depends on credit history and documentation, not necessarily the loan type.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "Why match loan type to business purpose?",
    options: [
      {
        id: "terms",
        label: "Better loan terms and interest rates",
        reflection: "Exactly! Matching loan type to purpose often results in more favorable terms and rates designed for that use case.",
        isCorrect: true,
      },
      {
        id: "confusion",
        label: "To confuse the lender about usage",
        reflection: "Transparency about loan purpose builds trust and typically leads to better loan terms and approval chances.",
        isCorrect: false,
      },
      {
        id: "complexity",
        label: "To make the application process more complex",
        reflection: "Proper loan type matching simplifies the process by aligning with lender expectations and requirements.",
        isCorrect: false,
      },
      {
        id: "secrecy",
        label: "To keep business finances secret",
        reflection: "Transparent business financing helps establish credibility and may improve future borrowing opportunities.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What risk does using personal loans for business reduce?",
    options: [
     
      {
        id: "profit",
        label: "Profit potential risks",
        reflection: "Proper financing doesn't directly impact profit potential - good business decisions and market conditions do.",
        isCorrect: false,
      },
      {
        id: "growth",
        label: "Business growth opportunities",
        reflection: "Appropriate financing can actually enable growth opportunities rather than limiting them.",
        isCorrect: false,
      },
      {
        id: "market",
        label: "Market competition risks",
        reflection: "Loan type selection affects financing costs and terms, not direct market competition dynamics.",
        isCorrect: false,
      },
       {
        id: "legal",
        label: "Legal compliance risks",
        reflection: "Using appropriate business financing helps ensure compliance with business regulations and lender requirements.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "How should you evaluate loan type selection?",
    options: [
      
      {
        id: "lowest",
        label: "Choose whichever has the lowest monthly payment",
        reflection: "Focusing only on monthly payments can hide total costs and may not align with your business objectives.",
        isCorrect: false,
      },
      {
        id: "quick",
        label: "Select the loan that approves fastest",
        reflection: "Quick approval shouldn't override proper loan type matching and thorough terms evaluation.",
        isCorrect: false,
      },
      {
        id: "match",
        label: "Match loan type to intended business use",
        reflection: "Exactly! Aligning loan type with business purpose ensures appropriate terms and reduces potential complications.",
        isCorrect: true,
      },
      {
        id: "popular",
        label: "Pick whatever other businesses are using",
        reflection: "Each business has unique needs - loan selection should be based on your specific circumstances and requirements.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const PersonalVsBusinessLoan = () => {
  const location = useLocation();
  const gameId = "finance-adults-24";
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
      "How can proper loan type selection impact your business financing costs?",
      "What factors should guide your decision between personal and business financing?",
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
      title="Personal vs Business Loan"
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
            <span>Loan Selection</span>
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
                      <strong>Congratulations!</strong> Matching loan type to purpose reduces risk.
                    </>
                  ) : (
                    <>Skill unlocked: <strong>Business financing selection</strong></>
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

export default PersonalVsBusinessLoan;