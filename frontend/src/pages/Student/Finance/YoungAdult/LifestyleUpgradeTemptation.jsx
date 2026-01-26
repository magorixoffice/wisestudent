import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LIFESTYLE_UPGRADE_STAGES = [
  {
    id: 1,
    prompt: "After receiving your first income, what temptation do you feel?",
    options: [
      {
        id: "immediate",
        label: "Upgrade lifestyle immediately",
        reflection: "While it's natural to want rewards, immediate upgrades can strain your finances and create unsustainable expectations.",
        isCorrect: false,
      },
      
      {
        id: "nothing",
        label: "Don't change anything about my lifestyle",
        reflection: "While financial discipline is important, completely avoiding lifestyle improvements can lead to feeling deprived.",
        isCorrect: false,
      },
      {
        id: "everything",
        label: "Buy everything I've been wanting",
        reflection: "Impulse purchases based on accumulated wants often lead to buyer's remorse and financial stress.",
        isCorrect: false,
      },
      {
        id: "careful",
        label: "Increase spending slowly and carefully",
        reflection: "Exactly! Gradual improvements ensure financial stability while still allowing you to enjoy your earnings.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "How should you approach lifestyle improvements with new income?",
    options: [
      {
        id: "percentage",
        label: "Allocate a small percentage for gradual upgrades",
        reflection: "Perfect approach! Setting aside a reasonable percentage creates sustainable improvement without financial risk.",
        isCorrect: true,
      },
      {
        id: "available",
        label: "Spend whatever is left after bills",
        reflection: "This reactive approach often leads to either overspending or missed opportunities for planned improvements.",
        isCorrect: false,
      },
      {
        id: "wait",
        label: "Wait until I have double my expenses saved",
        reflection: "While having substantial savings is wise, waiting too long can mean missing reasonable quality-of-life improvements.",
        isCorrect: false,
      },
      {
        id: "spontaneous",
        label: "Make spontaneous upgrade decisions when I feel like it",
        reflection: "Spontaneous decisions often lead to impulsive spending that doesn't align with your financial goals.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "What's the danger of sudden lifestyle upgrades?",
    options: [
      
      {
        id: "boring",
        label: "Makes life feel boring and restricted",
        reflection: "Gradual improvements actually enhance satisfaction more than dramatic changes that can feel overwhelming.",
        isCorrect: false,
      },
      {
        id: "cheap",
        label: "Shows you're being too cheap with yourself",
        reflection: "Thoughtful financial planning isn't about being cheap—it's about building sustainable prosperity.",
        isCorrect: false,
      },
      {
        id: "expectations",
        label: "Creates unrealistic lifestyle expectations",
        reflection: "Exactly! Sudden upgrades can reset your baseline expectations upward, making previous comfort levels feel inadequate.",
        isCorrect: true,
      },
      {
        id: "simple",
        label: "Life should stay simple and basic forever",
        reflection: "While simplicity has value, reasonable improvements contribute to personal growth and life satisfaction.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "Which strategy prevents lifestyle inflation?",
    options: [
      
      {
        id: "match",
        label: "Match peer spending to fit in socially",
        reflection: "Trying to keep up with others often leads to financial stress and debt rather than genuine satisfaction.",
        isCorrect: false,
      },
      {
        id: "baseline",
        label: "Maintain core lifestyle while upgrading selectively",
        reflection: "Excellent! This approach preserves financial stability while allowing meaningful improvements in priority areas.",
        isCorrect: true,
      },
      {
        id: "delay",
        label: "Delay all non-essential purchases indefinitely",
        reflection: "Extreme delay can lead to resentment and eventual binge spending rather than sustainable financial habits.",
        isCorrect: false,
      },
      {
        id: "upgrade",
        label: "Upgrade everything that brings me joy",
        reflection: "Without criteria for what truly adds value, this approach often leads to clutter and financial strain.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What habit supports healthy lifestyle progression?",
    options: [
      {
        id: "intentional",
        label: "Plan upgrades intentionally with clear criteria",
        reflection: "Perfect! Intentional planning ensures improvements align with your values and financial capacity.",
        isCorrect: true,
      },
      {
        id: "impulse",
        label: "Buy things that catch my eye in the moment",
        reflection: "Impulse purchases rarely provide lasting satisfaction and often conflict with long-term financial goals.",
        isCorrect: false,
      },
      {
        id: "restrict",
        label: "Restrict myself from all non-essentials permanently",
        reflection: "Permanent restriction often backfires and doesn't build the financial wisdom needed for sustainable choices.",
        isCorrect: false,
      },
      {
        id: "follow",
        label: "Follow what influencers recommend buying",
        reflection: "External recommendations rarely align with your personal situation and financial capacity.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = LIFESTYLE_UPGRADE_STAGES.length;
const successThreshold = totalStages;

const LifestyleUpgradeTemptation = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-3";
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
      "How can you enjoy lifestyle improvements while maintaining financial stability?",
      "What criteria should guide your spending decisions with increased income?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = LIFESTYLE_UPGRADE_STAGES[currentStage];
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
  const stage = LIFESTYLE_UPGRADE_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Lifestyle Upgrade Temptation"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={LIFESTYLE_UPGRADE_STAGES.length}
      currentLevel={Math.min(currentStage + 1, LIFESTYLE_UPGRADE_STAGES.length)}
      totalLevels={LIFESTYLE_UPGRADE_STAGES.length}
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
            <span>Lifestyle Upgrades</span>
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
                        { stageId: LIFESTYLE_UPGRADE_STAGES[currentStage].id, isCorrect: LIFESTYLE_UPGRADE_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Balanced lifestyle progression</strong>
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
              Skill unlocked: <strong>Balanced lifestyle progression</strong>
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

export default LifestyleUpgradeTemptation;