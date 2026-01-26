import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const INCOME_DISCIPLINE_STAGES = [
  {
    id: 1,
    prompt: "What matters more early on?",
    options: [
      {
        id: "growth",
        label: "Income growth alone",
        reflection: "While increasing income is important, focusing only on growth without discipline often leads to lifestyle inflation and financial stress.",
        isCorrect: false,
      },
      {
        id: "discipline",
        label: "Discipline + income growth",
        reflection: "Exactly! Combining discipline with income growth creates a foundation for long-term financial success and security.",
        isCorrect: true,
      },
      {
        id: "spending",
        label: "Spending everything you earn",
        reflection: "Spending everything prevents building financial security and eliminates the benefits of income growth for your future self.",
        isCorrect: false,
      },
      {
        id: "saving",
        label: "Saving everything without growth",
        reflection: "While saving is important, focusing only on saving without pursuing income growth limits your financial potential unnecessarily.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "Why is discipline important when income increases?",
    options: [
      {
        id: "protection",
        label: "It protects your money at all levels",
        reflection: "Perfect! Discipline ensures that as your income grows, you're building security and making thoughtful decisions rather than just spending more.",
        isCorrect: true,
      },
      {
        id: "restriction",
        label: "It restricts your freedom to enjoy money",
        reflection: "Actually, discipline creates more freedom by preventing financial stress and building options for your future choices.",
        isCorrect: false,
      },
      {
        id: "complexity",
        label: "It makes money management more complex",
        reflection: "Discipline actually simplifies money management by creating consistent, reliable habits that work at any income level.",
        isCorrect: false,
      },
      {
        id: "inequality",
        label: "It's only important for lower incomes",
        reflection: "Discipline is essential at all income levels - high earners without discipline often face the same financial challenges as low earners without discipline.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "What happens when you focus only on earning more?",
    options: [
      
      {
        id: "security",
        label: "Financial security automatically improves",
        reflection: "Security doesn't happen automatically - it requires disciplined saving and spending decisions regardless of income level.",
        isCorrect: false,
      },
      {
        id: "satisfaction",
        label: "You feel more satisfied with your money",
        reflection: "Without discipline, higher income often brings more stress about spending choices rather than satisfaction with financial progress.",
        isCorrect: false,
      },
      {
        id: "inflation",
        label: "Lifestyle inflation matches income growth",
        reflection: "Exactly! Without discipline, people tend to increase spending proportionally to income, eliminating the benefits of growth.",
        isCorrect: true,
      },
      {
        id: "skills",
        label: "Money management skills develop naturally",
        reflection: "Money management skills must be deliberately developed - they don't automatically emerge with higher income.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "How should you handle a significant income increase?",
    options: [
      {
        id: "ratio",
        label: "Maintain the same savings and spending ratios",
        reflection: "Excellent! Keeping consistent ratios ensures that discipline scales with your income, building security proportional to your earnings.",
        isCorrect: true,
      },
      {
        id: "increase",
        label: "Increase spending to match your new status",
        reflection: "Adjusting spending to 'match status' often leads to lifestyle inflation that eliminates the benefits of your increased income.",
        isCorrect: false,
      },
      {
        id: "save",
        label: "Save everything until you adjust to the new income",
        reflection: "While caution is wise, overly restrictive saving can lead to resentment and make it harder to maintain long-term financial discipline.",
        isCorrect: false,
      },
      {
        id: "delay",
        label: "Delay any changes for several months",
        reflection: "Delaying decisions can lead to missed opportunities to build beneficial financial habits during the transition to higher income.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "Which approach builds long-term wealth?",
    options: [
      
      {
        id: "growth",
        label: "Focus only on increasing income",
        reflection: "Income growth without discipline often leads to spending increases that eliminate the benefits of higher earnings.",
        isCorrect: false,
      },
      {
        id: "caution",
        label: "Extreme caution with any spending",
        reflection: "While discipline is important, extreme caution can prevent enjoying the benefits of your success and building confidence in financial decisions.",
        isCorrect: false,
      },
      {
        id: "enough",
        label: "Decide that current income is enough",
        reflection: "Stopping growth efforts limits your potential and may not provide sufficient resources for long-term financial goals.",
        isCorrect: false,
      },
      {
        id: "balance",
        label: "Balanced discipline with growth pursuit",
        reflection: "Perfect! This combination ensures you're building good habits while also expanding your earning potential for maximum long-term wealth.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
];

const totalStages = INCOME_DISCIPLINE_STAGES.length;
const successThreshold = totalStages;

const IncomeGrowthVsDiscipline = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-9";
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
      "How can you maintain discipline while pursuing income growth?",
      "What balance between spending and saving feels sustainable for your situation?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = INCOME_DISCIPLINE_STAGES[currentStage];
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
  const stage = INCOME_DISCIPLINE_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Income Growth vs Discipline"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={INCOME_DISCIPLINE_STAGES.length}
      currentLevel={Math.min(currentStage + 1, INCOME_DISCIPLINE_STAGES.length)}
      totalLevels={INCOME_DISCIPLINE_STAGES.length}
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
            <span>Income & Discipline</span>
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
                        { stageId: INCOME_DISCIPLINE_STAGES[currentStage].id, isCorrect: INCOME_DISCIPLINE_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Income discipline balance</strong>
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
              Skill unlocked: <strong>Income discipline balance</strong>
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

export default IncomeGrowthVsDiscipline;