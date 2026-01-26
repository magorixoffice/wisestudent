import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "When is borrowing reasonable?",
    options: [
      {
        id: "impulse",
        label: "For impulse spending",
        reflection: "Borrowing for impulse purchases often leads to debt problems and financial stress without clear benefits.",
        isCorrect: false,
      },
      
      {
        id: "luxury",
        label: "For luxury items you can't afford",
        reflection: "Using credit for unaffordable luxuries typically creates financial strain rather than genuine value.",
        isCorrect: false,
      },
      {
        id: "anytime",
        label: "Anytime you want something",
        reflection: "Borrowing without purpose or repayment planning often leads to accumulating debt problems.",
        isCorrect: false,
      },
      {
        id: "planned",
        label: "For planned needs with repayment capacity",
        reflection: "Exactly! Borrowing is reasonable when it's for planned needs and you have the capacity to repay comfortably.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What makes a borrowing decision financially sound?",
    options: [
      {
        id: "desire",
        label: "Strong desire to own something immediately",
        reflection: "Desire alone doesn't make borrowing sound - financial capacity and planning are essential.",
        isCorrect: false,
      },
     
      {
        id: "pressure",
        label: "Social pressure to keep up appearances",
        reflection: "Borrowing due to social pressure often leads to financial difficulties and regret.",
        isCorrect: false,
      },
       {
        id: "capacity",
        label: "Ability to repay without financial stress",
        reflection: "Exactly! Sound borrowing requires confirming you can repay comfortably within your budget.",
        isCorrect: true,
      },
      {
        id: "minimum",
        label: "Making only minimum monthly payments",
        reflection: "Minimum payments often extend debt terms and increase total costs significantly.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "Which situation shows responsible credit use?",
    options: [
      {
        id: "emergency",
        label: "Using credit cards for unexpected medical bills",
        reflection: "Emergency situations like medical bills are appropriate uses of credit when you have a repayment plan.",
        isCorrect: true,
      },
      {
        id: "vacation",
        label: "Charging an expensive vacation you can't afford",
        reflection: "Vacations should be saved for rather than financed through credit that creates long-term debt.",
        isCorrect: false,
      },
      {
        id: "shopping",
        label: "Buying clothes on credit during sales",
        reflection: "Sales don't make unaffordable purchases responsible - credit should fund planned needs, not wants.",
        isCorrect: false,
      },
      {
        id: "gadgets",
        label: "Financing the latest gadgets on installment plans",
        reflection: "Gadgets depreciate quickly, making installment financing financially inefficient for most people.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "How should you evaluate if credit will support stability?",
    options: [
      {
        id: "ignore",
        label: "Ignore the total cost and focus on monthly payments",
        reflection: "Focusing only on monthly payments hides the true cost and can lead to unsustainable debt accumulation.",
        isCorrect: false,
      },
      
      {
        id: "hope",
        label: "Hope your income will increase to cover payments",
        reflection: "Relying on uncertain future income increases financial risk and can lead to payment difficulties.",
        isCorrect: false,
      },
      {
        id: "calculate",
        label: "Calculate total cost including interest and your ability to repay",
        reflection: "Exactly! Responsible credit use requires calculating total costs and ensuring repayment fits your financial plan.",
        isCorrect: true,
      },
      {
        id: "compare",
        label: "Compare offers but not your actual repayment ability",
        reflection: "Comparing offers is helpful, but confirming your repayment ability is essential for financial stability.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What should credit support rather than create?",
    options: [
      {
        id: "habits",
        label: "Bad spending habits",
        reflection: "Credit should not enable poor financial habits - it should support responsible financial behavior.",
        isCorrect: false,
      },
      
      {
        id: "lifestyle",
        label: "An unaffordable lifestyle",
        reflection: "Using credit to maintain an unaffordable lifestyle creates financial stress and long-term problems.",
        isCorrect: false,
      },
      {
        id: "impulse",
        label: "Impulse buying decisions",
        reflection: "Credit should facilitate planned financial decisions, not enable spontaneous impulse purchases.",
        isCorrect: false,
      },
      {
        id: "stability",
        label: "Financial stability and planned goals",
        reflection: "Exactly! Credit should support stability by enabling planned purchases and financial goals.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const WhenCreditIsUseful = () => {
  const location = useLocation();
  const gameId = "finance-adults-22";
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
      "How can you distinguish between needs and wants when considering credit?",
      "What criteria should you use to evaluate borrowing decisions?",
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
      title="When Credit Is Useful"
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
            <span>Credit Evaluation</span>
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
                      <strong>Congratulations!</strong> Credit should support stability, not habits.
                    </>
                  ) : (
                    <>Skill unlocked: <strong>Responsible borrowing evaluation</strong></>
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

export default WhenCreditIsUseful;