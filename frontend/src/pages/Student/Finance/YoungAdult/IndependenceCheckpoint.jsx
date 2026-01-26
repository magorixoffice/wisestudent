import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const INDEPENDENCE_CHECKPOINT_STAGES = [
  {
    id: 1,
    prompt: "You just received your first income. What's your first step?",
    options: [
      {
        id: "spend",
        label: "Spend it on something you've wanted",
        reflection: "While treating yourself is understandable, it's important to first establish a foundation for managing your money responsibly.",
        isCorrect: false,
      },
      {
        id: "plan",
        label: "Plan how to allocate this income",
        reflection: "Excellent! Taking time to plan ensures you make thoughtful decisions about your money rather than impulse purchases.",
        isCorrect: true,
      },
      {
        id: "save",
        label: "Put it all in savings immediately",
        reflection: "While saving is important, it's also important to balance your needs and wants appropriately rather than being overly restrictive.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore it and continue as before",
        reflection: "Ignoring your first income means missing the opportunity to establish healthy financial habits that will serve you throughout your life.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "How should you prioritize your expenses?",
    options: [
        {
        id: "needs",
        label: "Cover your needs first, then wants",
        reflection: "Perfect! Addressing needs first ensures your essential requirements are met before allocating money to wants.",
        isCorrect: true,
      },
      {
        id: "wants",
        label: "Start with your wants and desires",
        reflection: "Prioritizing wants first can lead to insufficient funds for essential needs, creating financial stress.",
        isCorrect: false,
      },
      
      {
        id: "random",
        label: "Pay expenses in random order",
        reflection: "Random ordering doesn't prioritize essential needs, which can lead to serious consequences if critical bills aren't paid.",
        isCorrect: false,
      },
      {
        id: "social",
        label: "Match what your friends spend",
        reflection: "Following others' spending patterns ignores your own financial situation and needs, often leading to poor financial decisions.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "What's the best approach to saving?",
    options: [
      {
        id: "later",
        label: "Save whatever is left at month-end",
        reflection: "Leaving savings for last often means little to nothing gets saved, as other expenses consume the available funds.",
        isCorrect: false,
      },
      
      {
        id: "manual",
        label: "Manually transfer amounts occasionally",
        reflection: "Manual transfers depend on remembering and having willpower, which often leads to inconsistent saving habits.",
        isCorrect: false,
      },
      {
        id: "minimum",
        label: "Save only the minimum possible",
        reflection: "Saving minimal amounts limits your financial security and ability to reach your long-term goals effectively.",
        isCorrect: false,
      },
      {
        id: "automate",
        label: "Automate savings from the start",
        reflection: "Excellent! Automating savings ensures it's treated as a priority rather than an afterthought.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "How should you handle unexpected expenses?",
    options: [
      {
        id: "credit",
        label: "Use credit cards to cover them",
        reflection: "Using credit for emergencies can create debt cycles and additional financial stress, especially if you can't pay balances quickly.",
        isCorrect: false,
      },
      
      {
        id: "borrow",
        label: "Borrow from friends or family",
        reflection: "Borrowing from loved ones can strain relationships and doesn't address the underlying need for financial preparedness.",
        isCorrect: false,
      },
      {
        id: "emergency",
        label: "Build an emergency fund for this purpose",
        reflection: "Perfect! Having an emergency fund provides financial security and prevents disruption to your regular budget.",
        isCorrect: true,
      },
      {
        id: "skip",
        label: "Skip paying for them if unaffordable",
        reflection: "Skipping necessary expenses can lead to larger problems down the road and doesn't provide a sustainable solution.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What's your strategy for managing wants vs needs?",
    options: [
      {
        id: "all",
        label: "Deny yourself all wants",
        reflection: "Completely denying wants is unsustainable and can lead to financial rebellion and poor decisions later.",
        isCorrect: false,
      },
      {
        id: "balance",
        label: "Balance needs and reasonable wants",
        reflection: "Perfect! Balancing needs with reasonable wants creates a sustainable financial plan that you can maintain long-term.",
        isCorrect: true,
      },
      {
        id: "wants",
        label: "Focus primarily on wants",
        reflection: "Prioritizing wants over needs can lead to financial instability and inability to meet essential obligations.",
        isCorrect: false,
      },
      {
        id: "impulse",
        label: "Buy whatever appeals to you",
        reflection: "Impulse buying often leads to regret and financial stress when funds run short for essential needs.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = INDEPENDENCE_CHECKPOINT_STAGES.length;
const successThreshold = totalStages;

const IndependenceCheckpoint = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-10";
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
      "How can you maintain financial independence while building meaningful relationships?",
      "What systems can you create to ensure consistent financial responsibility?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = INDEPENDENCE_CHECKPOINT_STAGES[currentStage];
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
  const stage = INDEPENDENCE_CHECKPOINT_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Independence Checkpoint"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={INDEPENDENCE_CHECKPOINT_STAGES.length}
      currentLevel={Math.min(currentStage + 1, INDEPENDENCE_CHECKPOINT_STAGES.length)}
      totalLevels={INDEPENDENCE_CHECKPOINT_STAGES.length}
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
            <span>Checkpoint</span>
            <span>Independence</span>
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
                        { stageId: INDEPENDENCE_CHECKPOINT_STAGES[currentStage].id, isCorrect: INDEPENDENCE_CHECKPOINT_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Independent money management</strong>
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
              Skill unlocked: <strong>Independent money management</strong>
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

export default IndependenceCheckpoint;