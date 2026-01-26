import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You fear banks will 'take your money.' What's the truth?",
    options: [
      {
        id: "misuse",
        label: "Banks freely misuse deposits",
        reflection: "Banks are heavily regulated and misusing deposits would violate numerous laws and regulations.",
        isCorrect: false,
      },
      
      {
        id: "hidden",
        label: "Banks hide how they use your money",
        reflection: "Banks provide statements and are required to be transparent about how they handle deposits.",
        isCorrect: false,
      },
      {
        id: "unsafe",
        label: "Banking is inherently unsafe",
        reflection: "Banks are among the most regulated industries with multiple safeguards to protect deposits.",
        isCorrect: false,
      },
      {
        id: "regulated",
        label: "Banks are regulated and monitored",
        reflection: "Exactly! Banks operate under strict regulations and oversight to protect customer deposits.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What protects your money in banks?",
    options: [
      {
        id: "size",
        label: "The bank's physical size",
        reflection: "Physical size doesn't protect your money; regulatory frameworks and deposit insurance do.",
        isCorrect: false,
      },
      {
        id: "insurance",
        label: "Deposit insurance and regulatory oversight",
        reflection: "Exactly! Deposit insurance and regulatory oversight provide key protections for your money.",
        isCorrect: true,
      },
      {
        id: "promise",
        label: "The bank manager's verbal promise",
        reflection: "Verbal promises aren't sufficient protection; regulatory frameworks and insurance provide real security.",
        isCorrect: false,
      },
      {
        id: "location",
        label: "The bank's location in a safe area",
        reflection: "Location doesn't protect your money; regulatory protections and insurance do that.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "How often are banks audited and monitored?",
    options: [
      {
        id: "never",
        label: "Never, banks self-regulate",
        reflection: "Banks undergo regular audits by both internal and external agencies, as well as regulators.",
        isCorrect: false,
      },
      
      {
        id: "yearly",
        label: "Only once per year",
        reflection: "Banks are monitored much more frequently than annually through various oversight mechanisms.",
        isCorrect: false,
      },
      {
        id: "regularly",
        label: "Regularly by regulatory authorities",
        reflection: "Exactly! Banks are subject to regular audits and supervision by regulatory authorities.",
        isCorrect: true,
      },
      {
        id: "customers",
        label: "Only by customer complaints",
        reflection: "Banks have formal regulatory oversight that goes beyond customer complaints.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What happens if a regulated bank faces financial trouble?",
    options: [
        {
        id: "protected",
        label: "Customer deposits are protected up to certain limits",
        reflection: "Exactly! Deposit insurance schemes protect customer deposits up to specified limits during bank failures.",
        isCorrect: true,
      },
      {
        id: "immediate",
        label: "Customers immediately lose all their money",
        reflection: "Regulatory frameworks exist to protect customers, often including deposit insurance and bank resolution processes.",
        isCorrect: false,
      },
      
      {
        id: "nothing",
        label: "Nothing happens to customer deposits",
        reflection: "While deposit insurance provides protection, there are formal processes that occur during bank troubles.",
        isCorrect: false,
      },
      {
        id: "loss",
        label: "Customers always lose some money",
        reflection: "Deposit insurance typically covers customer deposits up to certain limits during bank failures.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "Why are regulated institutions safer than informal storage?",
    options: [
      {
        id: "cost",
        label: "They cost less to use",
        reflection: "The safety of regulated institutions comes from oversight and insurance, not lower costs.",
        isCorrect: false,
      },
      {
        id: "oversight",
        label: "They have regulatory oversight and customer protections",
        reflection: "Exactly! Regulatory oversight, licensing requirements, and customer protections make regulated institutions safer.",
        isCorrect: true,
      },
      {
        id: "convenience",
        label: "They're more convenient to access",
        reflection: "While regulated institutions may be convenient, their safety comes from regulatory protections.",
        isCorrect: false,
      },
      {
        id: "returns",
        label: "They always offer higher returns",
        reflection: "Safety of regulated institutions comes from oversight and protections, not necessarily higher returns.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const TrustingTheSystem = () => {
  const location = useLocation();
  const gameId = "finance-adults-19";
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
      "How do regulations protect your money in banks?",
      "What should you look for when choosing a financial institution?",
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
      title="Trusting the System"
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
            <span>Banking Trust</span>
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
                      <strong>Congratulations!</strong> Regulated institutions are safer than informal storage.
                    </>
                  ) : (
                    <>Skill unlocked: <strong>Understanding of banking regulation</strong></>
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

export default TrustingTheSystem;