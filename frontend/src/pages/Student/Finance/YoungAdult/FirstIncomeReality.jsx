import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FIRST_INCOME_STAGES = [
  {
    id: 1,
    prompt: "You just received your stipend/salary. What does this income represent?",
    options: [
      {
        id: "free",
        label: "Free money to spend however I like",
        reflection: "While it might feel like free money, it's important to remember that income comes from work and should be managed responsibly.",
        isCorrect: false,
      },
      {
        id: "responsibility",
        label: "A responsibility to manage wisely",
        reflection: "Exactly! Treating income as a responsibility helps build good financial habits for life.",
        isCorrect: true,
      },
      {
        id: "opportunity",
        label: "An opportunity to invest in my future",
        reflection: "Smart thinking! Every income is an opportunity to build wealth through investing and saving.",
        isCorrect: false,
      },
      {
        id: "luxury",
        label: "Money for luxury and status items",
        reflection: "Focusing on luxury items can lead to poor financial habits and debt accumulation.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "Do you treat this income as only for wants or for building a habit?",
    options: [
      {
        id: "habit",
        label: "Treat it as the first step to a savings habit",
        reflection: "Great approach! Building a savings habit early sets the foundation for long-term financial security.",
        isCorrect: true,
      },
      {
        id: "wants",
        label: "I earned it—buy whatever I feel like",
        reflection: "While it's understandable to want to enjoy your earnings, impulsive spending can lead to financial stress.",
        isCorrect: false,
      },
      
      {
        id: "celebrate",
        label: "Celebrate first, then think about saving",
        reflection: "While celebrating is nice, it's important to prioritize financial planning before indulgence.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore the importance of financial planning",
        reflection: "Ignoring financial planning can lead to unpreparedness for future needs and emergencies.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "Which plan makes the most sense on payday?",
    options: [
      
      {
        id: "all",
        label: "Spend all to celebrate and worry later",
        reflection: "While celebrations are important, spending everything can lead to financial difficulties.",
        isCorrect: false,
      },
      {
        id: "random",
        label: "Spend randomly without any planning",
        reflection: "Random spending without planning can lead to overspending and financial stress.",
        isCorrect: false,
      },
      {
        id: "debt",
        label: "Pay off debts first, then plan spending",
        reflection: "Paying off debts is important, but having a balanced plan for needs and savings is also crucial.",
        isCorrect: false,
      },
      {
        id: "plan",
        label: "Cover needs, automate savings, then allocate fun money",
        reflection: "Perfect! This approach ensures your needs are met while building financial security.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "A family or school deadline coincides with a minor want. What do you choose?",
    options: [
      
      {
        id: "want",
        label: "Give in now—stress makes you value the treat",
        reflection: "While treats can provide temporary relief, responsibilities should take priority.",
        isCorrect: false,
      },
      {
        id: "balance",
        label: "Try to do both simultaneously",
        reflection: "Attempting to do both can lead to poor performance in both areas and increased stress.",
        isCorrect: false,
      },
      {
        id: "deadline",
        label: "Handle responsibilities first, postpone the want",
        reflection: "Excellent! Prioritizing responsibilities over wants shows financial maturity.",
        isCorrect: true,
      },
      {
        id: "avoid",
        label: "Avoid both and do something else",
        reflection: "Avoiding responsibilities can lead to bigger problems later.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "Which reminder keeps this first income meaningful?",
    options: [
      {
        id: "privacy",
        label: "Keep a log of spending and review weekly",
        reflection: "Perfect! Tracking spending builds awareness and helps prevent surprise expenses.",
        isCorrect: true,
      },
      {
        id: "just",
        label: "Spend without thinking—you deserve it",
        reflection: "While you do deserve rewards, mindful spending prevents future financial stress.",
        isCorrect: false,
      },
      {
        id: "compare",
        label: "Compare my spending to others",
        reflection: "Comparing spending to others can lead to unnecessary purchases and financial pressure.",
        isCorrect: false,
      },
      {
        id: "impulse",
        label: "Make impulse purchases regularly",
        reflection: "Regular impulse purchases can quickly deplete your income and build poor financial habits.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = FIRST_INCOME_STAGES.length;
const successThreshold = totalStages;

const FirstIncomeReality = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-1";
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
      "How can you balance freedom and responsibility when you first earn money?",
      "Which priorities should you protect before spending on wants?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = FIRST_INCOME_STAGES[currentStage];
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
  const stage = FIRST_INCOME_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="First Income Reality"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={FIRST_INCOME_STAGES.length}
      currentLevel={Math.min(currentStage + 1, FIRST_INCOME_STAGES.length)}
      totalLevels={FIRST_INCOME_STAGES.length}
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
            <span>First Income</span>
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
                        { stageId: FIRST_INCOME_STAGES[currentStage].id, isCorrect: FIRST_INCOME_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Responsible income mindset</strong>
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
              Skill unlocked: <strong>Responsible income mindset</strong>
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

export default FirstIncomeReality;
