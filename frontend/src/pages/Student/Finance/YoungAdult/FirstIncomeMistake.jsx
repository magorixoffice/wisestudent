import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FIRST_INCOME_MISTAKE_STAGES = [
  {
    id: 1,
    prompt: "You overspent this month. What's the best response?",
    options: [
      {
        id: "ignore",
        label: "Ignore it",
        reflection: "Ignoring financial mistakes prevents learning and often leads to repeating the same errors, creating a cycle of financial stress and poor habits.",
        isCorrect: false,
      },
      
      {
        id: "panic",
        label: "Panic and make drastic cuts",
        reflection: "While concern is natural, panic-driven decisions often lead to unsustainable changes that are difficult to maintain long-term.",
        isCorrect: false,
      },
      {
        id: "review",
        label: "Review and adjust next month",
        reflection: "Exactly! Acknowledging mistakes and making adjustments creates opportunities for growth and prevents future financial setbacks.",
        isCorrect: true,
      },
      {
        id: "repeat",
        label: "Assume it will happen again anyway",
        reflection: "This defeatist attitude eliminates motivation to improve and prevents the development of better financial management skills.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What should you analyze after overspending?",
    options: [
      {
        id: "patterns",
        label: "Identify spending patterns and triggers",
        reflection: "Perfect! Understanding what led to overspending helps you recognize warning signs and develop strategies to avoid similar situations.",
        isCorrect: true,
      },
      {
        id: "blame",
        label: "Blame external circumstances entirely",
        reflection: "While circumstances matter, taking responsibility for your financial decisions empowers you to make better choices in the future.",
        isCorrect: false,
      },
      {
        id: "forget",
        label: "Forget about it and move on",
        reflection: "Moving on without analysis means missing valuable learning opportunities that could prevent future financial difficulties.",
        isCorrect: false,
      },
      {
        id: "extreme",
        label: "Eliminate all discretionary spending",
        reflection: "Extreme measures are usually unsustainable and can lead to resentment, making it harder to maintain long-term financial discipline.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "How can you prevent repeating the same mistake?",
    options: [
     
      {
        id: "willpower",
        label: "Rely on willpower alone",
        reflection: "Willpower is limited and unreliable - systems and habits are much more effective for sustained financial success.",
        isCorrect: false,
      },
       {
        id: "systems",
        label: "Create systems and safeguards",
        reflection: "Excellent! Building automatic savings, budget alerts, and spending limits creates structure that supports better financial decisions consistently.",
        isCorrect: true,
      },
      {
        id: "avoid",
        label: "Avoid the situations that caused overspending",
        reflection: "While avoiding triggers can help, learning to manage them constructively builds resilience and better decision-making skills.",
        isCorrect: false,
      },
      {
        id: "strict",
        label: "Implement extremely strict restrictions",
        reflection: "Overly restrictive approaches often backfire and don't teach the financial skills needed for making balanced decisions.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What's the most constructive way to handle the overspending?",
    options: [
      
      {
        id: "borrow",
        label: "Borrow money to cover the deficit",
        reflection: "Borrowing creates additional financial stress and interest costs, making the original problem worse rather than solving it constructively.",
        isCorrect: false,
      },
      {
        id: "delay",
        label: "Delay dealing with it until next month",
        reflection: "Delaying financial problems allows them to grow larger and more stressful, making resolution more difficult and urgent later.",
        isCorrect: false,
      },
      {
        id: "adjust",
        label: "Adjust next month's budget to compensate",
        reflection: "Perfect! Proactive adjustment shows financial responsibility and helps rebuild any shortfalls while maintaining your financial progress.",
        isCorrect: true,
      },
      {
        id: "minimize",
        label: "Minimize the significance of overspending",
        reflection: "Downplaying financial mistakes prevents learning and growth, often leading to repeated patterns of poor financial management.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "Which mindset helps turn mistakes into growth opportunities?",
    options: [
      
      {
        id: "failure",
        label: "See it as personal failure",
        reflection: "Viewing financial mistakes as personal failures creates shame and discouragement rather than motivation to improve your financial skills.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore the emotional impact completely",
        reflection: "Acknowledging emotions around financial mistakes is important - ignoring them can lead to repeated patterns and unresolved financial anxiety.",
        isCorrect: false,
      },
      {
        id: "perfect",
        label: "Believe you should never make mistakes",
        reflection: "Expecting perfection creates unrealistic pressure and prevents the experimentation and learning necessary for developing strong financial skills.",
        isCorrect: false,
      },
      {
        id: "learning",
        label: "View mistakes as learning experiences",
        reflection: "Perfect! This growth mindset transforms financial setbacks into valuable lessons that build better habits and decision-making skills.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
];

const totalStages = FIRST_INCOME_MISTAKE_STAGES.length;
const successThreshold = totalStages;

const FirstIncomeMistake = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-8";
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
      "How can financial mistakes become stepping stones to better money management?",
      "What systems can you put in place to learn from errors without repeating them?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = FIRST_INCOME_MISTAKE_STAGES[currentStage];
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
  const stage = FIRST_INCOME_MISTAKE_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="First Income Mistake"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={FIRST_INCOME_MISTAKE_STAGES.length}
      currentLevel={Math.min(currentStage + 1, FIRST_INCOME_MISTAKE_STAGES.length)}
      totalLevels={FIRST_INCOME_MISTAKE_STAGES.length}
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
            <span>Learning from Mistakes</span>
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
                        { stageId: FIRST_INCOME_MISTAKE_STAGES[currentStage].id, isCorrect: FIRST_INCOME_MISTAKE_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Financial mistake recovery</strong>
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
              Skill unlocked: <strong>Financial mistake recovery</strong>
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

export default FirstIncomeMistake;