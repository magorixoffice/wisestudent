import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SALARY_POCKET_MONEY_STAGES = [
  {
    id: 1,
    prompt: "How should first income be treated?",
    options: [
      {
        id: "pocket",
        label: "Like pocket money",
        reflection: "Treating earned income like pocket money without responsibility leads to poor financial habits and quick depletion of funds.",
        isCorrect: false,
      },
   
      {
        id: "unlimited",
        label: "Like unlimited free money",
        reflection: "Viewing income as unlimited free money ignores the effort required to earn it and leads to unsustainable spending.",
        isCorrect: false,
      },
      {
        id: "occasional",
        label: "Like occasional windfall to enjoy",
        reflection: "Treating regular income as an occasional windfall prevents building consistent financial discipline.",
        isCorrect: false,
      },
         {
        id: "earned",
        label: "Like earned money with limits",
        reflection: "Exactly! Recognizing that income is earned through effort helps establish responsible spending boundaries.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What's the difference between salary and pocket money?",
    options: [
      {
        id: "same",
        label: "There's no real difference",
        reflection: "There's actually a significant difference - salary requires work and responsibility, while pocket money is typically given without effort.",
        isCorrect: false,
      },
      {
        id: "earned",
        label: "Salary is earned through work, pocket money is given",
        reflection: "Correct! This fundamental difference means salary should be managed with greater care and planning.",
        isCorrect: true,
      },
      {
        id: "amount",
        label: "Salary is just larger amounts of pocket money",
        reflection: "The distinction isn't about amount but about the responsibility and effort involved in earning income.",
        isCorrect: false,
      },
      {
        id: "source",
        label: "They come from different sources only",
        reflection: "While source is a factor, the key difference is the earned nature of salary versus the given nature of pocket money.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "How should you approach spending your first paycheck?",
    options: [
      {
        id: "freedom",
        label: "Spend freely since I worked for it",
        reflection: "While you did work for it, approaching spending with complete freedom ignores the need for financial planning and responsibility.",
        isCorrect: false,
      },
      
      {
        id: "splurge",
        label: "Splurge on rewards for working hard",
        reflection: "While rewarding yourself is reasonable, splurging without planning can undermine your financial stability.",
        isCorrect: false,
      },
      {
        id: "budget",
        label: "Create a budget before any spending",
        reflection: "Excellent approach! Budgeting ensures your hard-earned income serves your long-term financial goals.",
        isCorrect: true,
      },
      {
        id: "ignore",
        label: "Ignore planning and spend intuitively",
        reflection: "Intuitive spending without planning often leads to regret and financial stress down the road.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What mindset prevents treating salary like pocket money?",
    options: [
        {
        id: "investment",
        label: "Viewing salary as investment in future self",
        reflection: "Perfect! This mindset transforms how you approach every spending decision with long-term thinking.",
        isCorrect: true,
      },
      {
        id: "entitlement",
        label: "Feeling entitled to spend as I please",
        reflection: "Entitlement mindset leads to treating earned income carelessly, similar to how pocket money might be spent.",
        isCorrect: false,
      },
      
      {
        id: "temporary",
        label: "Thinking salary won't last anyway",
        reflection: "This defeatist attitude actually encourages careless spending rather than responsible management.",
        isCorrect: false,
      },
      {
        id: "comparison",
        label: "Comparing spending to peers constantly",
        reflection: "Constant comparison often leads to competitive spending that treats income like disposable pocket money.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "Which habit protects salary from becoming pocket money mentality?",
    options: [
     
      {
        id: "impulse",
        label: "Making spontaneous purchase decisions",
        reflection: "Impulse decisions are exactly what turns earned income into casual pocket money spending.",
        isCorrect: false,
      },
      {
        id: "delay",
        label: "Delaying all purchases indefinitely",
        reflection: "While delayed gratification has merit, indefinite delay isn't practical and doesn't address the underlying mindset.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignoring bank balances and spending freely",
        reflection: "Ignoring financial reality is the fastest way to treat earned income like limitless pocket money.",
        isCorrect: false,
      },
       {
        id: "tracking",
        label: "Tracking every expense and reviewing regularly",
        reflection: "Perfect! Expense tracking creates awareness and accountability that prevents casual spending habits.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
];

const totalStages = SALARY_POCKET_MONEY_STAGES.length;
const successThreshold = totalStages;

const SalaryIsNotPocketMoney = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-2";
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
      "How can you maintain the distinction between earned income and casual spending?",
      "What systems can you put in place to prevent salary from becoming pocket money?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = SALARY_POCKET_MONEY_STAGES[currentStage];
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
    }, 1500); // Wait 2.5 seconds before allowing to proceed
    
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
  const stage = SALARY_POCKET_MONEY_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Salary Is Not Pocket Money"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={SALARY_POCKET_MONEY_STAGES.length}
      currentLevel={Math.min(currentStage + 1, SALARY_POCKET_MONEY_STAGES.length)}
      totalLevels={SALARY_POCKET_MONEY_STAGES.length}
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
            <span>Salary vs Pocket Money</span>
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
                        { stageId: SALARY_POCKET_MONEY_STAGES[currentStage].id, isCorrect: SALARY_POCKET_MONEY_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Earned income mindset</strong>
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
              Skill unlocked: <strong>Earned income mindset</strong>
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

export default SalaryIsNotPocketMoney;