import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You have three bank accounts you rarely use. What's better?",
    options: [
      {
        id: "active",
        label: "Keep all active",
        reflection: "Maintaining multiple unused accounts can lead to confusion, fees, and difficulty tracking your finances.",
        isCorrect: false,
      },
      {
        id: "consolidate",
        label: "Use one or two actively and close unused ones",
        reflection: "Exactly! Simplifying to fewer active accounts improves control and reduces errors in tracking your finances.",
        isCorrect: true,
      },
      {
        id: "open",
        label: "Open even more accounts for different purposes",
        reflection: "Opening more accounts would increase complexity rather than solving the problem of managing multiple accounts.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore them and let them accumulate fees",
        reflection: "Ignoring accounts can lead to unwanted fees and potentially negative balances, which is not ideal.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What is a potential problem with having too many bank accounts?",
    options: [
      {
        id: "more",
        label: "More opportunities to save money",
        reflection: "While having more accounts might seem like more saving opportunities, it often leads to confusion and poor oversight.",
        isCorrect: false,
      },
      
      {
        id: "better",
        label: "Better interest rates",
        reflection: "Having more accounts doesn't necessarily mean better interest rates; it just adds complexity.",
        isCorrect: false,
      },
      {
        id: "secure",
        label: "Increased security",
        reflection: "More accounts don't increase security; they can actually make it harder to monitor for fraudulent activity.",
        isCorrect: false,
      },
      {
        id: "confusion",
        label: "Difficulty tracking balances across accounts",
        reflection: "Exactly! Having multiple accounts can make it challenging to monitor your total financial position.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "How does consolidating bank accounts help with budgeting?",
    options: [
      {
        id: "difficult",
        label: "Makes budgeting more difficult",
        reflection: "Actually, fewer accounts make budgeting easier by simplifying tracking of income and expenses.",
        isCorrect: false,
      },
     
      {
        id: "separate",
        label: "Allows for complete separation of funds",
        reflection: "While accounts can be used for separate purposes, too many accounts complicate rather than simplify tracking.",
        isCorrect: false,
      },
       {
        id: "simple",
        label: "Makes it simpler to track income and expenses",
        reflection: "Exactly! Fewer accounts mean you have fewer places to track money movements, simplifying budgeting.",
        isCorrect: true,
      },
      {
        id: "automatic",
        label: "Automatically manages your money",
        reflection: "Consolidating accounts simplifies tracking but doesn't automatically manage your money.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What is a benefit of having fewer bank accounts?",
    options: [
      {
        id: "complex",
        label: "Creates more complex financial tracking",
        reflection: "Fewer accounts actually simplify financial tracking rather than making it more complex.",
        isCorrect: false,
      },
      {
        id: "errors",
        label: "Reduces the chance of errors in financial management",
        reflection: "Exactly! Fewer accounts mean less chance of making errors like depositing to the wrong account.",
        isCorrect: true,
      },
      {
        id: "minimum",
        label: "Requires higher minimum balances",
        reflection: "Having fewer accounts doesn't require higher minimum balances across all accounts.",
        isCorrect: false,
      },
      {
        id: "fees",
        label: "Increases overall banking fees",
        reflection: "Fewer accounts often mean fewer fees, especially if you're paying maintenance fees per account.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "When should you consider closing an unused bank account?",
    options: [
         {
        id: "inactive",
        label: "When it has been inactive for a long time",
        reflection: "Exactly! Closing inactive accounts reduces complexity and eliminates potential fees for unused services.",
        isCorrect: true,
      },
      {
        id: "never",
        label: "Never close any account",
        reflection: "Keeping unused accounts indefinitely can lead to fees and complications in financial management.",
        isCorrect: false,
      },
     
      {
        id: "balance",
        label: "Only when it has zero balance",
        reflection: "While zero balance is important, you can transfer funds and close accounts that have been inactive for long periods.",
        isCorrect: false,
      },
      {
        id: "new",
        label: "Only when opening a new account",
        reflection: "Closing accounts should be based on their usefulness rather than tied to opening new ones.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const MultipleAccountsConfusion = () => {
  const location = useLocation();
  const gameId = "finance-adults-15";
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
      "How does simplifying your banking accounts improve financial control?",
      "What are the risks of maintaining multiple unused accounts?",
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
      title="Multiple Accounts Confusion"
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
            <span>Banking Control</span>
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
                      <strong>Congratulations!</strong> Simpler banking improves control and reduces errors.
                    </>
                  ) : (
                    <>Skill unlocked: <strong>Banking simplification awareness</strong></>
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

export default MultipleAccountsConfusion;