import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Why are digital transactions useful?",
    options: [
      {
        id: "hide",
        label: "They hide spending",
        reflection: "Digital transactions actually create a visible record of spending, not hiding it.",
        isCorrect: false,
      },
      {
        id: "record",
        label: "They leave a record",
        reflection: "Exactly! Digital transactions create a permanent record that helps with budgeting and financial tracking.",
        isCorrect: true,
      },
      {
        id: "fast",
        label: "They are faster than cash",
        reflection: "While digital transactions can be fast, the main benefit highlighted here is the record-keeping capability.",
        isCorrect: false,
      },
      {
        id: "free",
        label: "They are always free",
        reflection: "Digital transactions may have fees associated with them, but the main benefit is record-keeping.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "How do digital transaction records help with budgeting?",
    options: [
      {
        id: "complicate",
        label: "They complicate the budgeting process",
        reflection: "Actually, digital records simplify budgeting by providing clear, organized data about spending.",
        isCorrect: false,
      },
     
      {
        id: "reduce",
        label: "They reduce the need to budget",
        reflection: "Digital records help with budgeting, they don't eliminate the need for it.",
        isCorrect: false,
      },
      {
        id: "manual",
        label: "They require manual recording",
        reflection: "Digital transactions automatically create records, eliminating the need for manual recording.",
        isCorrect: false,
      },
       {
        id: "track",
        label: "They make it easier to track spending patterns",
        reflection: "Exactly! Digital records provide detailed information about spending habits, which helps in budgeting.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "What is an advantage of having digital transaction records for credit eligibility?",
    options: [
      {
        id: "secret",
        label: "They keep your finances secret",
        reflection: "Digital records actually provide transparency that lenders need to evaluate creditworthiness.",
        isCorrect: false,
      },
      
      {
        id: "optional",
        label: "They are optional for credit evaluation",
        reflection: "Financial records are often required for credit evaluation, not optional.",
        isCorrect: false,
      },
      {
        id: "proof",
        label: "They provide proof of financial stability",
        reflection: "Exactly! Digital records can demonstrate consistent financial behavior, which helps with credit eligibility.",
        isCorrect: true,
      },
      {
        id: "negative",
        label: "They always have a negative impact",
        reflection: "Well-managed digital records typically have a positive impact on credit evaluation.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "How do digital records help identify unnecessary expenses?",
    options: [
        {
        id: "analyze",
        label: "They allow analysis of spending patterns over time",
        reflection: "Exactly! Digital records make it possible to analyze spending patterns and identify areas for improvement.",
        isCorrect: true,
      },
      {
        id: "guess",
        label: "They require guessing where money is spent",
        reflection: "Digital records provide actual data about spending, eliminating the need for guessing.",
        isCorrect: false,
      },
      
      {
        id: "hide",
        label: "They hide recurring charges",
        reflection: "Digital records actually reveal recurring charges that might otherwise go unnoticed.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "They let you ignore spending habits",
        reflection: "Digital records help you understand spending habits, not ignore them.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What happens when you rely only on cash transactions?",
    options: [
      {
        id: "records",
        label: "You have detailed digital records",
        reflection: "Cash transactions don't automatically create digital records unless manually tracked.",
        isCorrect: false,
      },
      {
        id: "tracking",
        label: "It becomes harder to track spending accurately",
        reflection: "Exactly! Without digital records, tracking spending becomes more difficult and prone to errors.",
        isCorrect: true,
      },
      {
        id: "simple",
        label: "It makes budgeting much simpler",
        reflection: "Without records, budgeting becomes more difficult, not simpler.",
        isCorrect: false,
      },
      {
        id: "visible",
        label: "All transactions remain visible",
        reflection: "Cash transactions are not automatically recorded in digital systems, making them less visible.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const CashVsDigitalRecords = () => {
  const location = useLocation();
  const gameId = "finance-adults-18";
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
      "How do digital records contribute to better financial planning?",
      "What other benefits do digital transactions offer beyond record-keeping?",
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
      title="Cash vs Digital Records"
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
            <span>Digital Records</span>
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
                      <strong>Congratulations!</strong> Records help with budgeting and future credit eligibility.
                    </>
                  ) : (
                    <>Skill unlocked: <strong>Understanding of digital transaction benefits</strong></>
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

export default CashVsDigitalRecords;