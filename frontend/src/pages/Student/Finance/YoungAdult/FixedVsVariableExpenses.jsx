import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FIXED_VS_VARIABLE_EXPENSES_STAGES = [
  {
    id: 1,
    prompt: "Which is a fixed expense?",
    options: [
      {
        id: "rent",
        label: "Rent/hostel fee",
        reflection: "Exactly! Rent or hostel fees are fixed expenses that remain the same each month regardless of usage.",
        isCorrect: true,
      },
      {
        id: "eating",
        label: "Eating out",
        reflection: "Eating out is a variable expense since the amount changes depending on how often and where you eat out.",
        isCorrect: false,
      },
      {
        id: "shopping",
        label: "Shopping for clothes",
        reflection: "Shopping for clothes is a variable expense since the amount varies based on your purchases.",
        isCorrect: false,
      },
      {
        id: "entertainment",
        label: "Entertainment expenses",
        reflection: "Entertainment expenses are variable since they change based on your activities and choices.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "How should fixed and variable expenses be prioritized in a budget?",
    options: [
     
      {
        id: "variable",
        label: "Variable expenses should come first",
        reflection: "Variable expenses are more flexible and should be planned after fixed expenses, which are essential.",
        isCorrect: false,
      },
      {
        id: "equal",
        label: "Both should be treated equally",
        reflection: "Fixed expenses are essential and must be paid, so they should take priority over variable expenses in budget planning.",
        isCorrect: false,
      },
      {
        id: "flexible",
        label: "Only plan for flexible expenses",
        reflection: "Fixed expenses are essential and cannot be skipped, so they must be planned for first in any budget.",
        isCorrect: false,
      },
       {
        id: "fixed",
        label: "Fixed expenses must be planned first",
        reflection: "Perfect! Fixed expenses should be planned for first since they are essential and must be paid regardless of income fluctuations.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "What happens if you don't account for fixed expenses first?",
    options: [
      
      {
        id: "savings",
        label: "You'll save more money",
        reflection: "Not accounting for fixed expenses first often leads to financial stress and penalties, not increased savings.",
        isCorrect: false,
      },
      {
        id: "freedom",
        label: "More financial freedom occurs",
        reflection: "Missing fixed expenses actually reduces financial freedom by creating debt and potential credit issues.",
        isCorrect: false,
      },
      {
        id: "penalties",
        label: "Late fees and penalties may apply",
        reflection: "Exactly! Not accounting for fixed expenses first can result in late fees, penalties, and negative impacts on credit scores.",
        isCorrect: true,
      },
      {
        id: "investment",
        label: "More money becomes available for investment",
        reflection: "Missing fixed expenses first typically leads to financial penalties and stress, leaving less money for investment.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "Which of these is typically a variable expense?",
    options: [
      
      {
        id: "insurance",
        label: "Insurance premium",
        reflection: "Insurance premiums are typically fixed expenses that remain the same each month.",
        isCorrect: false,
      },
      {
        id: "utilities",
        label: "Electricity bill (varies with usage)",
        reflection: "Exactly! Electricity bills vary based on usage, making them a variable expense that changes monthly.",
        isCorrect: true,
      },
      {
        id: "loan",
        label: "Loan EMI",
        reflection: "Loan EMIs are fixed expenses that remain the same amount each month.",
        isCorrect: false,
      },
      {
        id: "internet",
        label: "Internet subscription",
        reflection: "Internet subscriptions are usually fixed expenses with a consistent monthly charge.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "Why is it important to distinguish between fixed and variable expenses?",
    options: [
      {
        id: "planning",
        label: "It helps in better budget planning",
        reflection: "Perfect! Distinguishing between fixed and variable expenses enables better budget planning and financial management.",
        isCorrect: true,
      },
      {
        id: "ignoring",
        label: "You can ignore fixed expenses",
        reflection: "Fixed expenses must be accounted for in budgeting and cannot be ignored as they are essential payments.",
        isCorrect: false,
      },
      {
        id: "same",
        label: "They are the same thing",
        reflection: "Fixed and variable expenses are distinctly different, with fixed expenses remaining constant and variable expenses changing.",
        isCorrect: false,
      },
      {
        id: "optional",
        label: "Variable expenses are optional",
        reflection: "While more flexible, some variable expenses like groceries are necessary and need to be budgeted for.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = FIXED_VS_VARIABLE_EXPENSES_STAGES.length;
const successThreshold = totalStages;

const FixedVsVariableExpenses = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-22";
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
      "How can you ensure fixed expenses are always covered in your budget?",
      "What strategies help manage variable expenses within your financial limits?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = FIXED_VS_VARIABLE_EXPENSES_STAGES[currentStage];
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
  const stage = FIXED_VS_VARIABLE_EXPENSES_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Fixed vs Variable Expenses"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={FIXED_VS_VARIABLE_EXPENSES_STAGES.length}
      currentLevel={Math.min(currentStage + 1, FIXED_VS_VARIABLE_EXPENSES_STAGES.length)}
      totalLevels={FIXED_VS_VARIABLE_EXPENSES_STAGES.length}
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
            <span>Expenses</span>
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
                        { stageId: FIXED_VS_VARIABLE_EXPENSES_STAGES[currentStage].id, isCorrect: FIXED_VS_VARIABLE_EXPENSES_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Expense categorization</strong>
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
              Skill unlocked: <strong>Expense categorization</strong>
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

export default FixedVsVariableExpenses;