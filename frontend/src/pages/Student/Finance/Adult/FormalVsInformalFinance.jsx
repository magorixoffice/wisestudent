import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Who is safer to borrow from?",
    options: [
      {
        id: "informal",
        label: "Unregistered local lender",
        reflection: "Informal lenders often operate outside regulations, which can expose you to hidden risks and unfair practices.",
        isCorrect: false,
      },
      {
        id: "formal",
        label: "Registered bank/NBFC",
        reflection: "Exactly! Registered institutions follow regulations and offer consumer protections for borrowers.",
        isCorrect: true,
      },
      {
        id: "friend",
        label: "A trusted friend or family member",
        reflection: "While borrowing from friends/family might seem safe, it lacks formal protections and can strain relationships.",
        isCorrect: false,
      },
      {
        id: "cash",
        label: "Someone who offers cash immediately",
        reflection: "Safety comes from regulation and consumer protection, not just immediate availability of funds.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What is a key difference between formal and informal finance?",
    options: [
      {
        id: "cost",
        label: "Formal finance is always cheaper",
        reflection: "Interest rates vary in both systems; the key difference is regulation and consumer protection.",
        isCorrect: false,
      },
     
      {
        id: "location",
        label: "Formal institutions are located in cities",
        reflection: "Both formal and informal lenders can operate in various locations; the key difference is regulation.",
        isCorrect: false,
      },
       {
        id: "regulation",
        label: "Formal finance follows government regulations",
        reflection: "Exactly! Formal financial institutions are regulated by authorities to ensure fair practices.",
        isCorrect: true,
      },
      {
        id: "hours",
        label: "Formal institutions have longer business hours",
        reflection: "Business hours vary; the key difference between formal and informal finance is regulation and oversight.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "Which type of lender is required to provide transparent terms and conditions?",
    options: [
      {
        id: "informal",
        label: "Informal lenders",
        reflection: "Informal lenders are not bound by regulations that require transparent terms and conditions.",
        isCorrect: false,
      },
      
      {
        id: "both",
        label: "Both formal and informal lenders",
        reflection: "Only formal lenders are required by law to provide transparent terms; informal lenders are not regulated.",
        isCorrect: false,
      },
      {
        id: "depends",
        label: "It depends on the lender's willingness",
        reflection: "Formal institutions are legally required to provide transparency, while informal lenders are not.",
        isCorrect: false,
      },
      {
        id: "formal",
        label: "Formal financial institutions",
        reflection: "Exactly! Formal institutions are legally required to provide clear, transparent terms and conditions.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What consumer protection is available with formal finance?",
    options: [
      {
        id: "none",
        label: "No protection is available",
        reflection: "Formal finance offers multiple layers of consumer protection through regulations and oversight bodies.",
        isCorrect: false,
      },
      {
        id: "ombudsman",
        label: "Access to banking ombudsman for dispute resolution",
        reflection: "Exactly! Formal financial institutions offer access to ombudsmen and other regulatory bodies for dispute resolution.",
        isCorrect: true,
      },
      {
        id: "personal",
        label: "Personal protection by the loan officer",
        reflection: "Protection comes from regulatory frameworks, not personal guarantees of individual officers.",
        isCorrect: false,
      },
      {
        id: "contract",
        label: "Simple written contract",
        reflection: "While contracts exist in both systems, formal finance offers regulatory protection beyond just contracts.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "Why might informal lending carry hidden risks?",
    options: [
         {
        id: "terms",
        label: "Terms can change without notice and no legal recourse",
        reflection: "Exactly! Informal lending often lacks written agreements and regulatory oversight, leading to changing terms.",
        isCorrect: true,
      },
      {
        id: "location",
        label: "Because it happens in remote locations",
        reflection: "Risk isn't about location; informal lending can happen anywhere and risks come from lack of regulation.",
        isCorrect: false,
      },
     
      {
        id: "amount",
        label: "Because it offers larger amounts",
        reflection: "Risk in informal lending comes from lack of regulation, not from the amount offered.",
        isCorrect: false,
      },
      {
        id: "speed",
        label: "Because it's processed too quickly",
        reflection: "Speed alone isn't the risk factor; the lack of regulation and protection in informal lending is the risk.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const FormalVsInformalFinance = () => {
  const location = useLocation();
  const gameId = "finance-adults-13";
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
      "How do regulations protect consumers in formal finance?",
      "What risks should you consider with informal lending?",
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
      title="Formal vs Informal Finance"
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
            <span>Finance Comparison</span>
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
                      <strong>Congratulations!</strong> Formal finance follows rules; informal lending often carries hidden risks.
                    </>
                  ) : (
                    <>Skill unlocked: <strong>Understanding of formal vs informal finance</strong></>
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

export default FormalVsInformalFinance;