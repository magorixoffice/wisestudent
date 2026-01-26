import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You receive income regularly. Where is it safest to keep?",
    options: [
      {
        id: "home",
        label: "At home in a safe place",
        reflection: "Keeping money at home is risky as it can be stolen, lost, or damaged without any protection.",
        isCorrect: false,
      },
      
      {
        id: "wallet",
        label: "In your wallet or purse",
        reflection: "Carrying large amounts of cash is risky and impractical for regular income deposits.",
        isCorrect: false,
      },
      {
        id: "friend",
        label: "With a trusted friend or family member",
        reflection: "Relying on others to hold your money creates potential relationship issues and lacks proper protection.",
        isCorrect: false,
      },
      {
        id: "bank",
        label: "In a bank account",
        reflection: "Exactly! Bank accounts provide security, insurance, and protection for your money.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What is a key advantage of having a bank account?",
    options: [
      {
        id: "interest",
        label: "Earn interest on your deposits",
        reflection: "Yes, banks typically pay interest on deposits, helping your money grow over time.",
        isCorrect: true,
      },
      {
        id: "access",
        label: "Easy access to ATMs only",
        reflection: "While ATMs provide convenient access, bank accounts offer many more advantages beyond just ATM access.",
        isCorrect: false,
      },
      {
        id: "gifts",
        label: "Receive free gifts from banks",
        reflection: "While banks sometimes offer promotions, the primary benefit is secure money management, not gifts.",
        isCorrect: false,
      },
      {
        id: "prestige",
        label: "Show prestige to others",
        reflection: "The primary benefit of a bank account is practical financial security, not social status.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "How do bank accounts help with budgeting?",
    options: [
      {
        id: "spend",
        label: "They encourage spending more",
        reflection: "Bank accounts are designed to help manage money, not necessarily encourage spending.",
        isCorrect: false,
      },
      
      {
        id: "save",
        label: "They automatically save money for you",
        reflection: "While banks offer savings tools, they don't automatically save money without your instruction.",
        isCorrect: false,
      },
      {
        id: "track",
        label: "They provide records of deposits and withdrawals",
        reflection: "Exactly! Bank statements help you track your spending and monitor your financial habits.",
        isCorrect: true,
      },
      {
        id: "hide",
        label: "They hide your money from taxes",
        reflection: "Bank accounts create transparency with financial records, not tax evasion.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What happens if your physical cash is stolen?",
    options: [
      {
        id: "recover",
        label: "You can easily recover the money",
        reflection: "Unfortunately, stolen cash is typically unrecoverable since there's no record of who had it.",
        isCorrect: false,
      },
      {
        id: "bank",
        label: "You lose it permanently with no recourse",
        reflection: "Exactly! Cash has no recovery mechanism if lost or stolen, unlike money in insured bank accounts.",
        isCorrect: true,
      },
      {
        id: "insure",
        label: "Your homeowner's insurance covers it",
        reflection: "Most homeowner's insurance has very limited coverage for cash, and theft must often be proven.",
        isCorrect: false,
      },
      
      {
        id: "police",
        label: "Police will always find the thief",
        reflection: "Police efforts may not always result in recovering stolen cash.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "Which service is available only through formal banking?",
    options: [
      {
        id: "savings",
        label: "Simple savings",
        reflection: "Basic saving can be done without a bank, though banks offer better protection and interest.",
        isCorrect: false,
      },
      {
        id: "loans",
        label: "Access to loans and credit facilities",
        reflection: "Exactly! Formal banking relationships enable access to loans, credit cards, and other financial services.",
        isCorrect: true,
      },
      {
        id: "exchange",
        label: "Currency exchange",
        reflection: "Currency exchange can be done through various channels, not exclusively through banks.",
        isCorrect: false,
      },
      {
        id: "transfer",
        label: "Sending money to others",
        reflection: "Money transfers can be done through various services, not exclusively through banks.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const WhyABankAccountMatters = () => {
  const location = useLocation();
  const gameId = "finance-adults-11";
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
      "How do bank accounts protect money from theft or loss?",
      "What formal financial services become accessible through banking?",
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
      title="Why a Bank Account Matters"
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
            <span>Banking Security</span>
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
                      <strong>Congratulations!</strong> Bank accounts protect money and enable access to formal services.
                    </>
                  ) : (
                    <>Skill unlocked: <strong>Understanding of banking security</strong></>
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

export default WhyABankAccountMatters;