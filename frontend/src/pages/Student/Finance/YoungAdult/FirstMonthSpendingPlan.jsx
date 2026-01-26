import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FIRST_MONTH_SPENDING_STAGES = [
  {
    id: 1,
    prompt: "What should you do before spending your first income?",
    options: [
      {
        id: "spend",
        label: "Spend first, plan later",
        reflection: "While spontaneous spending might feel liberating, it often leads to regret and financial stress when bills arrive.",
        isCorrect: false,
      },
      {
        id: "plan",
        label: "List expenses and savings first",
        reflection: "Exactly! Planning before spending ensures your income covers necessities while building financial security.",
        isCorrect: true,
      },
      {
        id: "save",
        label: "Save everything and spend nothing",
        reflection: "While saving is important, completely avoiding spending can lead to feeling deprived and missing reasonable opportunities.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore planning and wing it",
        reflection: "Flying blind with your finances often results in missed payments, late fees, and unnecessary financial anxiety.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "Which approach to budgeting works best for beginners?",
    options: [
      {
        id: "detailed",
        label: "Create a detailed budget with specific categories",
        reflection: "Perfect! Detailed budgets help you understand exactly where your money goes and prevent overspending.",
        isCorrect: true,
      },
      {
        id: "rough",
        label: "Make a rough estimate in your head",
        reflection: "Mental estimates often lead to miscalculations and can cause you to overlook important expenses.",
        isCorrect: false,
      },
      {
        id: "apps",
        label: "Rely solely on budgeting apps",
        reflection: "While apps are helpful tools, understanding your own budget first builds better financial intuition.",
        isCorrect: false,
      },
      {
        id: "nothing",
        label: "Budgeting is too complicated for me",
        reflection: "Basic budgeting is simpler than it seems and prevents the complexity that comes from financial disorganization.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "What's the most important category to prioritize?",
    options: [
      
      {
        id: "wants",
        label: "Things that would be nice to have",
        reflection: "Wants are important for quality of life, but they should come after ensuring your essential needs are met.",
        isCorrect: false,
      },
      {
        id: "fun",
        label: "Entertainment and social activities",
        reflection: "While fun is valuable, prioritizing entertainment over essentials can lead to difficult financial situations.",
        isCorrect: false,
      },
      {
        id: "luxury",
        label: "Luxury items and premium services",
        reflection: "Luxury purchases should only come after establishing a solid financial foundation with needs consistently covered.",
        isCorrect: false,
      },
      {
        id: "needs",
        label: "Essential needs like rent, food, and utilities",
        reflection: "Exactly! Needs come first to ensure your basic living requirements are covered before discretionary spending.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "How much should you aim to save from your first income?",
    options: [
      
      {
        id: "nothing",
        label: "Save nothing until I have extra",
        reflection: "Waiting to save often means never starting, as 'extra' money rarely materializes without intentional allocation.",
        isCorrect: false,
      },
      {
        id: "half",
        label: "Save half of everything I earn",
        reflection: "While aggressive saving has benefits, saving half may be unrealistic and lead to feeling overly restricted.",
        isCorrect: false,
      },
      {
        id: "percentage",
        label: "At least 10-20% of your income",
        reflection: "Excellent! This percentage builds an emergency fund while still allowing you to enjoy your earnings responsibly.",
        isCorrect: true,
      },
      {
        id: "later",
        label: "Start saving after I get a raise",
        reflection: "Delaying savings formation often means missing the opportunity to build good financial habits early.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What habit prevents first-month financial mistakes?",
    options: [
     
      {
        id: "forget",
        label: "Forget about money until something goes wrong",
        reflection: "Ignoring your finances until problems arise often means dealing with preventable stress and penalties.",
        isCorrect: false,
      },
       {
        id: "track",
        label: "Track spending daily and adjust as needed",
        reflection: "Perfect! Daily tracking creates awareness and allows you to course-correct before small issues become big problems.",
        isCorrect: true,
      },
      {
        id: "strict",
        label: "Follow the budget perfectly without exceptions",
        reflection: "While discipline is important, rigid adherence without flexibility can lead to resentment and eventual abandonment.",
        isCorrect: false,
      },
      {
        id: "monthly",
        label: "Review finances once a month",
        reflection: "Monthly reviews are helpful, but waiting a full month can mean missing opportunities to prevent problems early.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = FIRST_MONTH_SPENDING_STAGES.length;
const successThreshold = totalStages;

const FirstMonthSpendingPlan = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-4";
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
      "How can planning prevent financial regrets in your first month?",
      "What balance between saving and spending feels sustainable for you?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = FIRST_MONTH_SPENDING_STAGES[currentStage];
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
  const stage = FIRST_MONTH_SPENDING_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="First Month Spending Plan"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={FIRST_MONTH_SPENDING_STAGES.length}
      currentLevel={Math.min(currentStage + 1, FIRST_MONTH_SPENDING_STAGES.length)}
      totalLevels={FIRST_MONTH_SPENDING_STAGES.length}
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
            <span>First Month Planning</span>
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
                        { stageId: FIRST_MONTH_SPENDING_STAGES[currentStage].id, isCorrect: FIRST_MONTH_SPENDING_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Strategic financial planning</strong>
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
              Skill unlocked: <strong>Strategic financial planning</strong>
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

export default FirstMonthSpendingPlan;