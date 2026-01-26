import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const INCOME_COMMITMENTS_STAGES = [
  {
    id: 1,
    prompt: "Which expense should be prioritized when budgeting?",
    options: [
      {
        id: "subscriptions",
        label: "Subscriptions and entertainment",
        reflection: "While entertainment adds quality to life, these are discretionary expenses that should come after essential needs are covered.",
        isCorrect: false,
      },
      
      {
        id: "shopping",
        label: "Shopping and personal purchases",
        reflection: "Non-essential shopping should be considered only after ensuring your basic living expenses are fully covered.",
        isCorrect: false,
      },
      {
        id: "dining",
        label: "Dining out and social activities",
        reflection: "Social activities are valuable, but they're luxuries that should be budgeted for after securing your financial foundation.",
        isCorrect: false,
      },
      {
        id: "essentials",
        label: "Rent, travel, food, essentials",
        reflection: "Exactly! Fixed commitments like housing, transportation, and food are fundamental needs that must be covered first.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What happens when you prioritize lifestyle over fixed commitments?",
    options: [
      
      {
        id: "freedom",
        label: "Gives you more freedom to enjoy life",
        reflection: "Temporary enjoyment from lifestyle spending becomes meaningless when you can't afford basic necessities.",
        isCorrect: false,
      },
      {
        id: "flexible",
        label: "Makes your budget more flexible",
        reflection: "Prioritizing discretionary spending actually makes your financial situation less stable and predictable.",
        isCorrect: false,
      },
      {
        id: "stress",
        label: "Creates financial stress and potential defaults",
        reflection: "Exactly! Neglecting fixed commitments can lead to eviction, damaged credit, and accumulating late fees.",
        isCorrect: true,
      },
      {
        id: "reward",
        label: "Rewards you for working hard",
        reflection: "While rewarding yourself is important, it should never compromise your ability to meet essential obligations.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "How should you handle fixed commitments with irregular income?",
    options: [
      {
        id: "priority",
        label: "Set aside money for fixed costs first",
        reflection: "Perfect! Treating fixed commitments as non-negotiable ensures they're always covered regardless of income fluctuations.",
        isCorrect: true,
      },
      {
        id: "average",
        label: "Average your income and budget normally",
        reflection: "Averaging can work, but it's risky during lean months when your actual income falls below the average.",
        isCorrect: false,
      },
      {
        id: "later",
        label: "Pay fixed costs when convenient",
        reflection: "Flexible payment timing for fixed commitments often leads to missed payments and serious financial consequences.",
        isCorrect: false,
      },
      {
        id: "skip",
        label: "Skip fixed payments during low-income periods",
        reflection: "Skipping essential payments creates a cascade of problems including penalties, credit damage, and legal issues.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What's the smartest approach to managing subscriptions?",
    options: [
      
      {
        id: "keep",
        label: "Keep all subscriptions for convenience",
        reflection: "Convenience comes at a cost, and unnecessary subscriptions can drain money that should go toward essential commitments.",
        isCorrect: false,
      },
      {
        id: "bundle",
        label: "Bundle multiple subscriptions to save money",
        reflection: "Bundling might save some money, but it doesn't address whether you actually need all those services.",
        isCorrect: false,
      },
      {
        id: "evaluate",
        label: "Evaluate necessity and cancel non-essentials",
        reflection: "Excellent! Regular evaluation helps distinguish between valuable subscriptions and financial drains.",
        isCorrect: true,
      },
      {
        id: "automatic",
        label: "Set all subscriptions to auto-renew",
        reflection: "Automatic renewals often lead to paying for services you no longer use or need, wasting money on fixed commitments.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "Which strategy protects your financial stability?",
    options: [
      
      {
        id: "maximum",
        label: "Maximize lifestyle spending while hoping income continues",
        reflection: "Hope-based budgeting is financially dangerous and often leads to crisis when circumstances change unexpectedly.",
        isCorrect: false,
      },
      {
        id: "foundation",
        label: "Build a foundation covering all fixed commitments",
        reflection: "Perfect! Ensuring your essential expenses are always covered creates the stability needed for discretionary spending.",
        isCorrect: true,
      },
      {
        id: "minimum",
        label: "Pay minimum amounts on all commitments",
        reflection: "Minimum payments often lead to growing debt and don't provide the financial security of fully meeting your obligations.",
        isCorrect: false,
      },
      {
        id: "delay",
        label: "Delay commitment payments when cash is tight",
        reflection: "Delaying essential payments creates a snowball effect of penalties and stress that undermines long-term financial health.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = INCOME_COMMITMENTS_STAGES.length;
const successThreshold = totalStages;

const IncomeVsFixedCommitments = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-5";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [history, setHistory] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [canProceed, setCanProceed] = useState(false);

  const reflectionPrompts = useMemo(
    () => [
      "How can you ensure fixed commitments are always covered?",
      "What's the relationship between financial stability and lifestyle choices?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = INCOME_COMMITMENTS_STAGES[currentStage];
    const updatedHistory = [
      ...history,
      { stageId: currentStageData.id, isCorrect: option.isCorrect },
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
    if (currentStage === totalStages - 1) {
      setTimeout(() => {
        const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
        const passed = correctCount === successThreshold;
        setFinalScore(correctCount);
        setCoins(passed ? totalCoins : 0); // Set final coins based on performance
        setShowResult(true);
      }, 2500); // Wait longer before showing final results
    }
    
    if (option.isCorrect) {
      showCorrectAnswerFeedback(currentStageData.reward, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
  };

  const handleRetry = () => {
    resetFeedback();
    setCurrentStage(0);
    setHistory([]);
    setSelectedOption(null);
    setCoins(0);
    setFinalScore(0);
    setShowResult(false);
  };

  const subtitle = `Stage ${Math.min(currentStage + 1, totalStages)} of ${totalStages}`;
  const stage = INCOME_COMMITMENTS_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Income vs Fixed Commitments"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={INCOME_COMMITMENTS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, INCOME_COMMITMENTS_STAGES.length)}
      totalLevels={INCOME_COMMITMENTS_STAGES.length}
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
            <span>Fixed Commitments</span>
          </div>
          <p className="text-lg text-white/90 mb-6">{stage.prompt}</p>
          <div className="grid grid-cols-2 gap-4">
            {stage.options.map((option) => {
              const isSelected = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option)}
                  disabled={!!selectedOption}
                  className={`rounded-2xl border-2 p-5 text-left transition ${isSelected
                      ? option.isCorrect
                        ? "border-emerald-400 bg-emerald-500/20"
                        : "border-rose-400 bg-rose-500/10"
                      : "border-white/30 bg-white/5 hover:border-white/60 hover:bg-white/10"
                    }`}
                >
                  <div className="flex justify-between items-center mb-2 text-sm text-white/70">
                    <span>Choice {option.id.toUpperCase()}</span>
                  </div>
                  <p className="text-white font-semibold">{option.label}</p>
                </button>
              );
            })}
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
                        if (currentStage < totalStages - 1) {
                          setCurrentStage((prev) => prev + 1);
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
              {!showResult && currentStage === totalStages - 1 && canProceed && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => {
                      const updatedHistory = [
                        ...history,
                        { stageId: INCOME_COMMITMENTS_STAGES[currentStage].id, isCorrect: INCOME_COMMITMENTS_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Priority-based budgeting</strong>
                  </p>
                  {!hasPassed && (
                    <p className="text-xs text-amber-300">
                      Answer all {totalStages} choices correctly to earn the full reward.
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
          <div className="mt-6 text-right text-sm text-white/70">
            Coins collected: <strong>{coins}</strong>
          </div>
        </div>
        {showResult && (
          <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
            <h4 className="text-lg font-semibold text-white">Reflection Prompts</h4>
            <ul className="text-sm list-disc list-inside space-y-1">
              {reflectionPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
            <p className="text-sm text-white/70">
              Skill unlocked: <strong>Priority-based budgeting</strong>
            </p>
            {!hasPassed && (
              <p className="text-xs text-amber-300">
                Answer all {totalStages} choices correctly to earn the full reward.
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
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default IncomeVsFixedCommitments;