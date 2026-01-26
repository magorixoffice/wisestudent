import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Scenario: You have a small emergency. Question: Which option is safer?",
    options: [
      {
        id: "borrow",
        label: "Borrow immediately",
        reflection: "Borrowing immediately for small emergencies can create unnecessary debt and interest payments.",
        isCorrect: false,
      },
      
      {
        id: "credit",
        label: "Use credit card for the emergency",
        reflection: "Using credit for emergencies creates debt and potentially high interest charges if not paid immediately.",
        isCorrect: false,
      },
      {
        id: "friends",
        label: "Borrow from friends or family",
        reflection: "Even informal borrowing should be avoided when savings are available as it can strain relationships.",
        isCorrect: false,
      },
      {
        id: "savings",
        label: "Use savings if available",
        reflection: "Exactly! Using savings for emergencies is safer as it avoids debt and interest payments.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "Why does having savings reduce dependence on credit?",
    options: [
     
      {
        id: "interest",
        label: "It eliminates interest payments completely",
        reflection: "While savings reduce interest payments, the primary benefit is providing financial independence for emergencies.",
        isCorrect: false,
      },
      {
        id: "credit",
        label: "It improves your credit score",
        reflection: "Having savings doesn't directly improve your credit score, though responsible financial habits can have positive effects.",
        isCorrect: false,
      },
       {
        id: "independence",
        label: "It provides financial independence for emergencies",
        reflection: "That's right! Savings provide a buffer that allows you to handle emergencies without relying on credit.",
        isCorrect: true,
      },
      {
        id: "debt",
        label: "It removes all forms of debt",
        reflection: "Savings help reduce dependence on credit but don't automatically remove all existing debt.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "Scenario: You face a financial challenge that matches your savings amount. What should you prioritize?",
    options: [
      {
        id: "borrow",
        label: "Take a loan to preserve savings",
        reflection: "Taking a loan when you have adequate savings creates unnecessary debt and interest payments.",
        isCorrect: false,
      },
      {
        id: "use",
        label: "Use the savings to handle the challenge",
        reflection: "Perfect! Using savings for matched challenges avoids debt and maintains financial stability.",
        isCorrect: true,
      },
      {
        id: "half",
        label: "Use half savings and take a loan for the rest",
        reflection: "Using savings fully is better than splitting between savings and loans when the amount matches.",
        isCorrect: false,
      },
      {
        id: "delay",
        label: "Delay handling the challenge hoping for more income",
        reflection: "Delaying important financial challenges can often make them worse, when savings are available it's better to address them.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "How does building an emergency fund affect your borrowing habits?",
    options: [
      {
        id: "confidence",
        label: "It provides confidence to handle emergencies without borrowing",
        reflection: "Exactly! An emergency fund creates a safety net that reduces the need to borrow for unexpected expenses.",
        isCorrect: true,
      },
      {
        id: "rate",
        label: "It gets you better interest rates on loans",
        reflection: "While good financial habits may improve credit over time, the primary benefit is avoiding borrowing altogether.",
        isCorrect: false,
      },
      {
        id: "amount",
        label: "It allows you to borrow larger amounts",
        reflection: "The goal is to reduce borrowing, not increase borrowing capacity when savings are available.",
        isCorrect: false,
      },
      {
        id: "frequency",
        label: "It makes borrowing more convenient",
        reflection: "The purpose of savings is to reduce reliance on borrowing, not to make borrowing more convenient.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What is the long-term impact of choosing savings over borrowing for small emergencies?",
    options: [
      
      {
        id: "cost",
        label: "It reduces the overall cost of handling emergencies",
        reflection: "While this is true, the broader impact is greater financial security and peace of mind.",
        isCorrect: false,
      },
      {
        id: "habits",
        label: "It creates better spending habits",
        reflection: "Better habits develop, but the primary long-term impact is greater financial security and peace of mind.",
        isCorrect: false,
      },
      {
        id: "knowledge",
        label: "It increases financial literacy",
        reflection: "Financial literacy may improve, but the main long-term impact is greater financial security and peace of mind.",
        isCorrect: false,
      },
      {
        id: "security",
        label: "It builds greater financial security and peace of mind",
        reflection: "Absolutely! Consistently using savings for emergencies builds financial security and reduces stress about debt.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const SavingsVsBorrowing = () => {
  const location = useLocation();
  const gameId = "finance-adults-8";
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
      "How does using savings instead of borrowing reduce dependence on credit?",
      "What strategies will help you maintain adequate emergency savings?",
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
      title="Savings vs Borrowing"
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
            <span>Savings vs Borrowing</span>
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
                  Skill unlocked: <strong>Savings over borrowing preference</strong>
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

export default SavingsVsBorrowing;