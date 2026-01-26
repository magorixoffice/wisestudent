import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Scenario: You receive your monthly income today. What should you do first?",
    options: [
      {
        id: "spend",
        label: "Spend freely on wants and desires",
        reflection: "Spending freely without planning can lead to running out of money before month-end.",
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
        reflection: "Exactly! Planning first and setting aside savings prevents overspending and reduces the need for borrowing later.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "Why is planning your salary allocation important?",
    options: [
      
      {
        id: "save",
        label: "It guarantees higher savings",
        reflection: "While planning helps with savings, the primary benefit is preventing the need for borrowing by managing expenses.",
        isCorrect: false,
      },
      {
        id: "track",
        label: "It makes tracking expenses easier",
        reflection: "Tracking is a benefit, but the main advantage is avoiding the need to borrow by planning ahead.",
        isCorrect: false,
      },
      {
        id: "reduce",
        label: "It helps reduce the need for borrowing later",
        reflection: "That's right! Planning prevents overspending and ensures you have funds for all needs throughout the month.",
        isCorrect: true,
      },
      {
        id: "compare",
        label: "It allows comparison with others",
        reflection: "Comparing with others isn't the main purpose of salary planning; focus should be on personal financial stability.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "Scenario: You planned your salary allocation but got an unexpected expense. What should you do?",
    options: [
      {
        id: "borrow",
        label: "Borrow money immediately to cover it",
        reflection: "Borrowing should be a last resort; first review your planned budget to see if funds can be reallocated.",
        isCorrect: false,
      },
      {
        id: "reassess",
        label: "Reassess your planned budget to accommodate the expense",
        reflection: "Excellent! Reassessing your budget helps find solutions without immediately resorting to borrowing.",
        isCorrect: true,
      },
      {
        id: "skip",
        label: "Skip other planned expenses to cover it",
        reflection: "Skipping essential planned expenses might cause bigger problems; reassessment is a better approach.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore the expense and stick to original plan",
        reflection: "Ignoring unexpected expenses can lead to serious consequences; flexibility in planning is important.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What is the best approach to handle your salary allocation?",
    options: [
      {
        id: "pay",
        label: "Pay yourself first (savings), then allocate for expenses",
        reflection: "Perfect! Paying yourself first ensures savings are secured before other expenses are considered.",
        isCorrect: true,
      },
      {
        id: "needs",
        label: "Cover all needs first, then wants, then savings",
        reflection: "While covering needs first is important, paying yourself first (savings) is a more effective strategy to ensure consistent saving.",
        isCorrect: false,
      },
      {
        id: "flexible",
        label: "Allocate flexible amounts without fixed percentages",
        reflection: "Flexible allocation without structure can lead to inconsistent saving and potential overspending.",
        isCorrect: false,
      },
      {
        id: "minimum",
        label: "Set aside minimum savings after all expenses",
        reflection: "Setting aside savings last often means there's nothing left to save; pay yourself first is more effective.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "How does proper salary day planning affect your borrowing habits?",
    options: [
      
      {
        id: "delay",
        label: "Just delays borrowing to a later time",
        reflection: "Proper planning doesn't just delay borrowing; it prevents the need for it by ensuring adequate funds for expenses.",
        isCorrect: false,
      },
      {
        id: "shift",
        label: "Shifts borrowing to different expenses",
        reflection: "Effective planning eliminates the need for borrowing by ensuring proper allocation of funds.",
        isCorrect: false,
      },
      {
        id: "prevent",
        label: "Prevents the need for borrowing by managing cash flow",
        reflection: "Exactly! Proper planning ensures you have funds allocated appropriately, reducing the need to borrow.",
        isCorrect: true,
      },
      {
        id: "reduce",
        label: "Reduces borrowing interest rates",
        reflection: "Planning doesn't change interest rates; it prevents the need for borrowing altogether by managing funds effectively.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const SalaryDayDecision = () => {
  const location = useLocation();
  const gameId = "finance-adults-5";
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
      "How does planning your salary allocation reduce the need for borrowing later?",
      "What strategies will help you implement the 'pay yourself first' approach?",
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
      title="Salary Day Decision"
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
            <span>Salary Planning</span>
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
                  Skill unlocked: <strong>Salary planning and borrowing prevention</strong>
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

export default SalaryDayDecision;