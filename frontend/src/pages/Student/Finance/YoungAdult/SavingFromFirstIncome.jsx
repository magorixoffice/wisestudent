import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SAVING_FIRST_INCOME_STAGES = [
  {
    id: 1,
    prompt: "Is saving from first income important?",
    options: [
      {
        id: "wait",
        label: "No, savings can wait",
        reflection: "While it might seem logical to wait, delaying savings often means never starting due to lifestyle inflation and competing priorities.",
        isCorrect: false,
      },
      {
        id: "early",
        label: "Yes, habits start early",
        reflection: "Exactly! Starting to save from your first income builds lifelong financial discipline and compound growth advantages.",
        isCorrect: true,
      },
      {
        id: "later",
        label: "Save only after major expenses",
        reflection: "Waiting for the 'perfect' time to save often means missing the power of starting early when compound interest works best.",
        isCorrect: false,
      },
      {
        id: "never",
        label: "Saving isn't necessary for me",
        reflection: "Everyone benefits from saving, regardless of income level. It's about building security and opportunities for future choices.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What's the biggest benefit of saving from first income?",
    options: [
      {
        id: "compound",
        label: "Compound interest over time",
        reflection: "Perfect! The earlier you start saving, the more powerful compound interest becomes in building long-term wealth.",
        isCorrect: true,
      },
      {
        id: "flexibility",
        label: "Immediate spending flexibility",
        reflection: "While having money available feels good, the real flexibility comes from financial security built through consistent saving.",
        isCorrect: false,
      },
      {
        id: "status",
        label: "Showing financial success to others",
        reflection: "True financial success is measured by security and freedom, not by appearances or social comparisons.",
        isCorrect: false,
      },
      {
        id: "pressure",
        label: "Reducing financial pressure immediately",
        reflection: "Saving actually reduces long-term pressure by building the security needed to handle unexpected expenses and opportunities.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "How much should you save from your first income?",
    options: [
      {
        id: "percentage",
        label: "Start with 10-15% and increase gradually",
        reflection: "Excellent approach! Starting small makes it sustainable while building the habit, with room to increase as income grows.",
        isCorrect: true,
      },
      {
        id: "everything",
        label: "Save as much as possible always",
        reflection: "While saving is important, being too restrictive can lead to burnout and abandoning the habit entirely.",
        isCorrect: false,
      },
      {
        id: "nothing",
        label: "Save nothing until I earn more",
        reflection: "Higher income doesn't automatically lead to saving - the habit needs to be established regardless of amount earned.",
        isCorrect: false,
      },
      {
        id: "fixed",
        label: "Save a fixed amount regardless of income",
        reflection: "Fixed amounts can become burdensome during low-income periods and miss opportunities to save more when income is higher.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What mindset prevents saving from first income?",
    options: [
      {
        id: "entitled",
        label: "Feeling entitled to spend all earnings",
        reflection: "Entitlement thinking undermines financial growth and prevents building the security that gives real freedom and choices.",
        isCorrect: false,
      },
      
      {
        id: "expensive",
        label: "Thinking saving is only for wealthy people",
        reflection: "Saving is actually more important for those with modest incomes, as it builds the foundation for financial stability and growth.",
        isCorrect: false,
      },
      {
        id: "future",
        label: "Believing you'll save more in the future",
        reflection: "Exactly! Procrastination is the biggest enemy of saving - the habit needs to start now, not someday in the future.",
        isCorrect: true,
      },
      {
        id: "difficult",
        label: "Assuming saving is too difficult to start",
        reflection: "Starting small makes saving achievable for everyone - the difficulty is often in our perception, not the actual practice.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "Which habit ensures successful early saving?",
    options: [
      
      {
        id: "manual",
        label: "Manually transfer money when remembering",
        reflection: "Manual transfers rely on willpower and memory, which often fail exactly when you need to build consistent saving habits.",
        isCorrect: false,
      },
      {
        id: "occasional",
        label: "Save only when there's extra money",
        reflection: "Waiting for 'extra' money means saving becomes inconsistent and dependent on circumstances rather than being a priority.",
        isCorrect: false,
      },
      {
        id: "guilt",
        label: "Save based on guilt about spending",
        reflection: "Guilt-based saving is emotionally unhealthy and unsustainable - successful saving comes from positive motivation and clear goals.",
        isCorrect: false,
      },
      {
        id: "automatic",
        label: "Automate savings from the first paycheck",
        reflection: "Perfect! Automation removes the emotional struggle and makes saving effortless while building consistent habits.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
];

const totalStages = SAVING_FIRST_INCOME_STAGES.length;
const successThreshold = totalStages;

const SavingFromFirstIncome = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-6";
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
      "How can early saving create opportunities you can't imagine today?",
      "What small saving habit could you start immediately with your next income?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = SAVING_FIRST_INCOME_STAGES[currentStage];
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
  const stage = SAVING_FIRST_INCOME_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Saving from First Income"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={SAVING_FIRST_INCOME_STAGES.length}
      currentLevel={Math.min(currentStage + 1, SAVING_FIRST_INCOME_STAGES.length)}
      totalLevels={SAVING_FIRST_INCOME_STAGES.length}
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
            <span>Early Saving</span>
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
                        { stageId: SAVING_FIRST_INCOME_STAGES[currentStage].id, isCorrect: SAVING_FIRST_INCOME_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Early saving discipline</strong>
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
              Skill unlocked: <strong>Early saving discipline</strong>
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

export default SavingFromFirstIncome;