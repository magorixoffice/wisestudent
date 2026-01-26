import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Which is better for long-term savings?",
    options: [
      {
        id: "wallet",
        label: "Digital wallet",
        reflection: "Digital wallets are primarily designed for transactions and everyday spending, not for long-term savings.",
        isCorrect: false,
      },
      
      {
        id: "same",
        label: "Both are equally good for savings",
        reflection: "Bank accounts typically offer better interest rates, security features, and regulatory protection for savings.",
        isCorrect: false,
      },
      {
        id: "neither",
        label: "Neither is good for savings",
        reflection: "Bank accounts are designed to safely store money and often provide interest, making them suitable for savings.",
        isCorrect: false,
      },
      {
        id: "bank",
        label: "Bank account",
        reflection: "Exactly! Bank accounts offer better security, interest, and protection for long-term savings.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What is a key difference between digital wallets and bank accounts?",
    options: [
      {
        id: "purpose",
        label: "Wallets are for spending; banks are for storing money safely",
        reflection: "Exactly! Digital wallets are designed for convenience in transactions, while banks focus on secure storage and growth of money.",
        isCorrect: true,
      },
      {
        id: "technology",
        label: "Banks use older technology than wallets",
        reflection: "Both use modern technology, but their primary purposes differ significantly.",
        isCorrect: false,
      },
      {
        id: "fees",
        label: "Banks always charge higher fees than wallets",
        reflection: "Fee structures vary, but the main difference lies in the primary purpose of each service.",
        isCorrect: false,
      },
      {
        id: "access",
        label: "Banks are accessible 24/7 but wallets are not",
        reflection: "Both digital wallets and online banking are typically accessible 24/7.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "Which typically offers better interest rates for savings?",
    options: [
      {
        id: "wallets",
        label: "Digital wallets",
        reflection: "Digital wallets typically offer little to no interest on stored funds.",
        isCorrect: false,
      },
      
      {
        id: "both",
        label: "Both offer the same interest rates",
        reflection: "Bank accounts typically offer significantly higher interest rates compared to digital wallets.",
        isCorrect: false,
      },
      {
        id: "none",
        label: "Neither offers interest on savings",
        reflection: "Bank accounts typically offer interest to promote savings, while wallets generally do not.",
        isCorrect: false,
      },
      {
        id: "banks",
        label: "Bank accounts",
        reflection: "Exactly! Bank accounts, especially savings accounts, typically offer interest on deposits to encourage saving.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "Which provides better regulatory protection for your money?",
    options: [
      {
        id: "wallets",
        label: "Digital wallets",
        reflection: "While wallets have some protection, banks are subject to more comprehensive regulatory oversight.",
        isCorrect: false,
      },
      
      {
        id: "same",
        label: "Both have equal regulatory protection",
        reflection: "Banks typically have more comprehensive regulatory protection than digital wallets.",
        isCorrect: false,
      },
      {
        id: "banks",
        label: "Bank accounts",
        reflection: "Exactly! Bank accounts are heavily regulated with deposit insurance and consumer protection laws.",
        isCorrect: true,
      },
      {
        id: "little",
        label: "Neither provides regulatory protection",
        reflection: "Bank accounts have substantial regulatory protection through deposit insurance and banking laws.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "For which purpose are digital wallets primarily designed?",
    options: [
      {
        id: "saving",
        label: "Long-term savings",
        reflection: "Digital wallets are not primarily designed for savings but for convenient transactions.",
        isCorrect: false,
      },
      {
        id: "spending",
        label: "Convenient day-to-day transactions",
        reflection: "Exactly! Digital wallets are designed for quick, convenient payments and money transfers.",
        isCorrect: true,
      },
      {
        id: "investing",
        label: "Investing money",
        reflection: "While some wallets offer investment features, their primary purpose is transaction convenience.",
        isCorrect: false,
      },
      {
        id: "insurance",
        label: "Providing financial insurance",
        reflection: "Digital wallets are not primarily designed for insurance but for facilitating payments.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const DigitalWalletVsBankAccount = () => {
  const location = useLocation();
  const gameId = "finance-adults-16";
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
      "How do digital wallets and bank accounts serve different financial needs?",
      "Why is it important to use the right tool for savings versus spending?",
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
      title="Digital Wallet vs Bank Account"
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
            <span>Comparison</span>
            <span>Financial Tools</span>
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
                      <strong>Congratulations!</strong> Wallets are for spending; banks are for storing money safely.
                    </>
                  ) : (
                    <>Skill unlocked: <strong>Understanding of financial tools</strong></>
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

export default DigitalWalletVsBankAccount;