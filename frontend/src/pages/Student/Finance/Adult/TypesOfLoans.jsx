import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Which loan usually has lower interest?",
    options: [
      {
        id: "informal",
        label: "Informal money lender",
        reflection: "Informal lenders typically charge much higher interest rates due to lack of regulation and higher risk perception.",
        isCorrect: false,
      },
      
      {
        id: "same",
        label: "Both have the same interest rates",
        reflection: "Formal and informal lenders operate under different frameworks, resulting in significantly different interest rates.",
        isCorrect: false,
      },
      {
        id: "unclear",
        label: "It varies randomly for both",
        reflection: "While individual rates vary, formal lenders follow regulated frameworks that generally provide more predictable pricing.",
        isCorrect: false,
      },
      {
        id: "formal",
        label: "Formal bank loan",
        reflection: "Exactly! Formal bank loans follow regulated pricing and typically offer lower, more transparent interest rates.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What protects borrowers in formal lending?",
    options: [
      {
        id: "word",
        label: "Lender's verbal promise only",
        reflection: "Verbal promises lack legal protection and enforcement mechanisms available in formal lending agreements.",
        isCorrect: false,
      },
      
      {
        id: "trust",
        label: "Personal trust between parties",
        reflection: "While trust is valuable, formal lending provides documented agreements and regulatory frameworks for protection.",
        isCorrect: false,
      },
      {
        id: "regulation",
        label: "Regulatory oversight and legal contracts",
        reflection: "Exactly! Formal lending provides regulatory protection, standardized contracts, and legal recourse for borrowers.",
        isCorrect: true,
      },
      {
        id: "nothing",
        label: "Nothing protects borrowers",
        reflection: "Formal lending includes multiple protections like regulation, contracts, and consumer rights frameworks.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "How do informal lenders typically operate?",
    options: [
      {
        id: "transparent",
        label: "With transparent terms and fixed rates",
        reflection: "Informal lenders often lack transparency and may change terms without notice or proper documentation.",
        isCorrect: false,
      },
      {
        id: "flexible",
        label: "Through flexible, undocumented arrangements",
        reflection: "Exactly! Informal lending often relies on personal relationships and undocumented agreements that can be risky.",
        isCorrect: true,
      },
      {
        id: "regulated",
        label: "Under strict government regulation",
        reflection: "Informal lending operates outside formal regulatory frameworks, lacking the protections of regulated institutions.",
        isCorrect: false,
      },
      {
        id: "standard",
        label: "With standardized loan agreements",
        reflection: "Informal lending typically lacks standardized documentation and formal agreement structures.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What is a key advantage of formal loans?",
    options: [
        {
        id: "predictability",
        label: "Predictable terms and regulated rates",
        reflection: "Exactly! Formal loans provide transparent, predictable terms with regulated interest rates and clear repayment schedules.",
        isCorrect: true,
      },
      {
        id: "speed",
        label: "Faster approval process",
        reflection: "Formal loans often require more documentation and review, making them slower than informal alternatives.",
        isCorrect: false,
      },
      
      {
        id: "accessibility",
        label: "Accessible to everyone regardless of credit",
        reflection: "Formal lenders typically require credit checks and documentation, making them less accessible to some borrowers.",
        isCorrect: false,
      },
      {
        id: "simplicity",
        label: "Simple verbal agreements only",
        reflection: "Formal loans require detailed documentation and standardized agreements, not simple verbal arrangements.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "Why do formal loans follow regulated pricing?",
    options: [
      {
        id: "profit",
        label: "To maximize lender profits",
        reflection: "Regulation actually limits excessive profit-taking and ensures fair pricing for consumers.",
        isCorrect: false,
      },
     
      {
        id: "competition",
        label: "Because of intense market competition",
        reflection: "While competition plays a role, regulation specifically aims to protect consumers from unfair lending practices.",
        isCorrect: false,
      },
      {
        id: "tradition",
        label: "Due to traditional banking practices",
        reflection: "Regulated pricing stems from consumer protection laws, not merely traditional banking customs.",
        isCorrect: false,
      },
       {
        id: "protection",
        label: "To protect consumers from exploitation",
        reflection: "Exactly! Regulated pricing prevents predatory lending practices and ensures fair treatment of borrowers.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const TypesOfLoans = () => {
  const location = useLocation();
  const gameId = "finance-adults-23";
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
      "How can you identify formal vs informal lending opportunities?",
      "What factors should you consider when evaluating loan options?",
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
      title="Types of Loans"
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
            <span>Loan Comparison</span>
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
                      <strong>Congratulations!</strong> Formal loans follow regulated pricing.
                    </>
                  ) : (
                    <>Skill unlocked: <strong>Loan type comparison</strong></>
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

export default TypesOfLoans;