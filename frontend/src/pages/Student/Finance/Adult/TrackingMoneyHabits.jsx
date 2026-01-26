import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Scenario: Which habit helps most?",
    options: [
      {
        id: "ignore",
        label: "Ignoring expenses",
        reflection: "Ignoring expenses makes it impossible to understand where your money goes or identify spending patterns.",
        isCorrect: false,
      },
      {
        id: "track",
        label: "Tracking daily spending",
        reflection: "Exactly! Tracking spending reveals hidden money leaks and helps you understand your financial patterns.",
        isCorrect: true,
      },
      {
        id: "estimate",
        label: "Estimating expenses at the end of the month",
        reflection: "Estimating at the end of the month is imprecise and often misses small but significant expenses that add up.",
        isCorrect: false,
      },
      {
        id: "review",
        label: "Reviewing bank statements occasionally",
        reflection: "While reviewing bank statements is helpful, daily tracking gives more detailed insight into spending patterns.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What is the primary benefit of tracking your daily expenses?",
    options: [
      {
        id: "leaks",
        label: "It reveals hidden money leaks",
        reflection: "That's right! Tracking expenses helps identify unnecessary spending that can add up significantly over time.",
        isCorrect: true,
      },
      {
        id: "control",
        label: "It gives you complete financial control",
        reflection: "While tracking helps with control, the primary benefit is revealing hidden money leaks you weren't aware of.",
        isCorrect: false,
      },
      {
        id: "awareness",
        label: "It increases general financial awareness",
        reflection: "Increased awareness is a benefit, but the primary benefit is specifically revealing hidden money leaks.",
        isCorrect: false,
      },
      {
        id: "record",
        label: "It maintains a record of all transactions",
        reflection: "Keeping records is helpful, but the main benefit is identifying and stopping hidden money leaks.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "Scenario: You track your expenses for a week and notice small daily purchases adding up. What should you do?",
    options: [
      {
        id: "ignore",
        label: "Ignore them since they're small amounts",
        reflection: "Small daily purchases can accumulate to significant amounts over time and should not be ignored.",
        isCorrect: false,
      },
      {
        id: "analyze",
        label: "Analyze if they align with your financial goals",
        reflection: "Perfect! Analyzing whether small purchases align with your goals helps you make intentional spending decisions.",
        isCorrect: true,
      },
      {
        id: "stop",
        label: "Stop all small purchases immediately",
        reflection: "Completely stopping all small purchases might be too extreme; analyzing and making intentional choices is better.",
        isCorrect: false,
      },
      {
        id: "budget",
        label: "Increase your budget to accommodate them",
        reflection: "Simply increasing your budget without evaluating the necessity of these purchases doesn't address the underlying habit.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "How does tracking spending help with budgeting?",
    options: [
      
      {
        id: "reduce",
        label: "It automatically reduces your expenses",
        reflection: "Tracking itself doesn't reduce expenses; it reveals where to make reductions based on your actual spending.",
        isCorrect: false,
      },
      {
        id: "plan",
        label: "It eliminates the need for budget planning",
        reflection: "Tracking doesn't eliminate budget planning; it provides the data needed for effective budget planning.",
        isCorrect: false,
      },
      {
        id: "save",
        label: "It forces you to save more money",
        reflection: "Tracking doesn't force saving; it reveals spending patterns that help you decide how much to save.",
        isCorrect: false,
      },
      {
        id: "baseline",
        label: "It provides a realistic baseline for your actual spending",
        reflection: "Exactly! Tracking gives you real data about your spending patterns to create an effective budget.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What is the best way to start tracking your money habits?",
    options: [
      
      {
        id: "paper",
        label: "Write expenses on paper",
        reflection: "While paper tracking works, digital tools offer better analysis and are more convenient for daily tracking.",
        isCorrect: false,
      },
      {
        id: "memory",
        label: "Keep track in your memory",
        reflection: "Relying on memory for daily tracking is unreliable and often misses important spending details.",
        isCorrect: false,
      },
      {
        id: "apps",
        label: "Use a digital app or tool to track expenses",
        reflection: "Great! Digital tools make tracking convenient and provide insights into spending categories and trends.",
        isCorrect: true,
      },
      {
        id: "bank",
        label: "Just monitor your bank balance",
        reflection: "Monitoring just your bank balance doesn't reveal spending patterns and categories like detailed tracking does.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const TrackingMoneyHabits = () => {
  const location = useLocation();
  const gameId = "finance-adults-7";
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
      "How does tracking spending reveal hidden money leaks?",
      "What strategies will help you maintain consistent expense tracking?",
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
      title="Tracking Money Habits"
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
            <span>Money Tracking</span>
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
                  Skill unlocked: <strong>Expense tracking and leak identification</strong>
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

export default TrackingMoneyHabits;