import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PEER_COMPARISON_STAGES = [
  {
    id: 1,
    prompt: "Friends spend more than you. What should guide your spending?",
    options: [
      {
        id: "lifestyle",
        label: "Their lifestyle",
        reflection: "Following others' spending patterns often leads to financial stress and debt, as their circumstances and income may be completely different from yours.",
        isCorrect: false,
      },
      
      {
        id: "pressure",
        label: "Social pressure to keep up",
        reflection: "Giving in to social pressure compromises your financial security and often leads to lifestyle inflation that's unsustainable long-term.",
        isCorrect: false,
      },
      {
        id: "goals",
        label: "Your income and goals",
        reflection: "Exactly! Your financial decisions should be based on your personal situation, income level, and long-term objectives rather than social comparisons.",
        isCorrect: true,
      },
      {
        id: "appearances",
        label: "Appearing successful to others",
        reflection: "Focusing on appearances over actual financial health creates a facade that ultimately harms your real financial well-being and future options.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What's the danger of comparing your spending to friends?",
    options: [
      {
        id: "overspending",
        label: "Causes overspending beyond your means",
        reflection: "Exactly! Social comparison often leads to purchasing things you can't afford, creating debt and financial anxiety.",
        isCorrect: true,
      },
      {
        id: "motivation",
        label: "Motivates you to earn more money",
        reflection: "While comparison might provide short-term motivation, it's an unreliable driver that often leads to unhealthy financial behaviors rather than sustainable growth.",
        isCorrect: false,
      },
      {
        id: "connections",
        label: "Helps build better social connections",
        reflection: "True friendships aren't based on matching spending levels - authentic relationships thrive despite financial differences when built on genuine connection.",
        isCorrect: false,
      },
      {
        id: "normal",
        label: "Shows you what's normal to spend",
        reflection: "What's 'normal' varies greatly by individual circumstances, income sources, and life stages - there's no universal spending benchmark that applies to everyone.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "How should you handle friends who spend more than you?",
    options: [
      
      {
        id: "match",
        label: "Try to match their spending level",
        reflection: "Attempting to match others' spending often means sacrificing your financial goals and security for temporary social acceptance.",
        isCorrect: false,
      },
      {
        id: "avoid",
        label: "Avoid friends who spend more",
        reflection: "Complete avoidance isn't necessary - learning to navigate financial differences while maintaining relationships is a valuable life skill.",
        isCorrect: false,
      },
      {
        id: "secret",
        label: "Hide your financial situation",
        reflection: "Secrecy creates stress and prevents authentic relationships - honest communication about financial priorities builds stronger, more supportive friendships.",
        isCorrect: false,
      },
      {
        id: "boundaries",
        label: "Set clear financial boundaries",
        reflection: "Perfect! Establishing boundaries protects your financial health while maintaining genuine friendships based on mutual respect rather than spending competition.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What mindset prevents peer spending pressure?",
    options: [
      
      {
        id: "competition",
        label: "View it as a friendly competition",
        reflection: "Financial competition with friends creates unnecessary stress and often leads to poor decisions that nobody wins from in the long run.",
        isCorrect: false,
      },
      {
        id: "secrets",
        label: "Keep your finances secret from everyone",
        reflection: "While privacy is important, complete secrecy can isolate you from potential support and learning opportunities with trusted friends.",
        isCorrect: false,
      },
      {
        id: "values",
        label: "Focus on your personal values and priorities",
        reflection: "Excellent! When you're clear about what truly matters to you, external spending pressures lose their influence over your financial decisions.",
        isCorrect: true,
      },
      {
        id: "conformity",
        label: "Conform to group spending norms",
        reflection: "Conforming to group norms often means compromising your financial security and personal goals for temporary social acceptance.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "Which approach builds genuine friendships?",
    options: [
      
      {
        id: "impress",
        label: "Impress friends with expensive purchases",
        reflection: "Trying to impress others through spending creates superficial relationships based on consumption rather than authentic connection and shared values.",
        isCorrect: false,
      },
      {
        id: "authentic",
        label: "Be authentic about your financial situation",
        reflection: "Perfect! Genuine friendships thrive on honesty and mutual respect, not financial competition or pretense about spending abilities.",
        isCorrect: true,
      },
      {
        id: "borrow",
        label: "Borrow money to match their lifestyle",
        reflection: "Borrowing to keep up appearances creates debt stress and damages both your financial health and the authenticity of your relationships.",
        isCorrect: false,
      },
      {
        id: "distance",
        label: "Distance yourself from financially different friends",
        reflection: "Learning to navigate financial differences while maintaining relationships demonstrates maturity and builds stronger, more diverse friendships.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = PEER_COMPARISON_STAGES.length;
const successThreshold = totalStages;

const PeerComparisonTrap = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-7";
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
      "How can you maintain friendships while staying true to your financial values?",
      "What personal goals are worth prioritizing over social spending pressure?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = PEER_COMPARISON_STAGES[currentStage];
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
  const stage = PEER_COMPARISON_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Peer Comparison Trap"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={PEER_COMPARISON_STAGES.length}
      currentLevel={Math.min(currentStage + 1, PEER_COMPARISON_STAGES.length)}
      totalLevels={PEER_COMPARISON_STAGES.length}
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
            <span>Peer Pressure</span>
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
                        { stageId: PEER_COMPARISON_STAGES[currentStage].id, isCorrect: PEER_COMPARISON_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Social financial independence</strong>
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
              Skill unlocked: <strong>Social financial independence</strong>
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

export default PeerComparisonTrap;