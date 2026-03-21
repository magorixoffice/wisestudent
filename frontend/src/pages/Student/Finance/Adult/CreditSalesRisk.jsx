import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CreditSalesRisk = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");

  const gameId = "finance-adults-81";
  const baseKey = "financial-literacy.adults.credit-sales-risk";

  const gameContent = t(baseKey, { returnObjects: true });
  const localizedStages = Array.isArray(gameContent?.stages) ? gameContent.stages : [];
  const reflectionPrompts = Array.isArray(gameContent?.reflectionPrompts)
    ? gameContent.reflectionPrompts
    : [];

  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 20;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 20;
  const totalXp = gameData?.xp || location.state?.totalXp || 40;

  const {
    flashPoints,
    showAnswerConfetti,
    showCorrectAnswerFeedback,
    resetFeedback,
  } = useGameFeedback();

  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [history, setHistory] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [canProceed, setCanProceed] = useState(false);

  const totalStages = localizedStages.length;
  const successThreshold = totalStages;

  if (!totalStages) return null;

  const subtitle = t(`${baseKey}.subtitleProgress`, {
    current: Math.min(currentStage + 1, totalStages),
    total: totalStages,
    defaultValue: "Stage {{current}} of {{total}}",
  });

  const stage = localizedStages[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  const title = gameContent?.title || "Credit Sales Risk";
  const headerLeft = t(`${baseKey}.sectionHeaderLeft`, { defaultValue: "" });
  const headerRight = t(`${baseKey}.sectionHeaderRight`, { defaultValue: "" });
  const reflectionTitle = t(`${baseKey}.reflectionTitle`, { defaultValue: "Reflection" });
  const continueButton = t(`${baseKey}.continueButton`, { defaultValue: "Continue" });
  const readingLabel = t(`${baseKey}.readingLabel`, { defaultValue: "Reading..." });
  const reflectionPromptsTitle = t(`${baseKey}.reflectionPromptsTitle`, {
    defaultValue: "Reflection Prompts",
  });
  const skillUnlockedLabel = t(`${baseKey}.skillUnlockedLabel`, { defaultValue: "Skill unlocked:" });
  const skillName = t(`${baseKey}.skillName`, { defaultValue: "" });
  const fullRewardHint = t(`${baseKey}.fullRewardHint`, {
    total: totalStages,
    defaultValue: "Answer all {{total}} choices correctly to earn the full reward.",
  });
  const tryAgainButton = t(`${baseKey}.tryAgainButton`, { defaultValue: "Try Again" });

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = localizedStages[currentStage];
    const updatedHistory = [
      ...history,
      { stageId: currentStageData.id, isCorrect: option.isCorrect },
    ];

    setHistory(updatedHistory);
    setSelectedOption(option.id);
    setSelectedReflection(option.reflection);
    setShowFeedback(true);
    setCanProceed(false);

    if (option.isCorrect) {
      setCoins((prevCoins) => prevCoins + 1);
    }

    setTimeout(() => {
      setCanProceed(true);
    }, 1500);

    if (currentStage === totalStages - 1) {
      setTimeout(() => {
        const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
        const passed = correctCount === successThreshold;
        setFinalScore(correctCount);
        setCoins(passed ? totalCoins : 0);
        setShowResult(true);
      }, 5500);
    }

    if (option.isCorrect) {
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
  };

  const handleRetry = () => {
    resetFeedback();
    setCurrentStage(0);
    setHistory([]);
    setSelectedOption(null);
    setSelectedReflection(null);
    setShowFeedback(false);
    setCanProceed(false);
    setCoins(0);
    setFinalScore(0);
    setShowResult(false);
  };

  return (
    <GameShell
      title={title}
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={totalStages}
      currentLevel={Math.min(currentStage + 1, totalStages)}
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
            <span>{headerLeft}</span>
            <span>{headerRight}</span>
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
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    isSelected
                      ? option.isCorrect
                        ? "border-emerald-400 bg-emerald-500/20"
                        : "border-rose-400 bg-rose-500/10"
                      : "border-white/30 bg-white/5 hover:border-white/60 hover:bg-white/10"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2 text-sm text-white/70">
                    <span>
                      {t(`${baseKey}.choiceLabel`, {
                        id: String(option.id).toUpperCase(),
                        defaultValue: "Choice {{id}}",
                      })}
                    </span>
                  </div>
                  <p className="text-white font-semibold">{option.label}</p>
                </button>
              );
            })}
          </div>

          {(showResult || showFeedback) && (
            <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
              <h4 className="text-lg font-semibold text-white">{reflectionTitle}</h4>

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
                      {continueButton}
                    </button>
                  ) : (
                    <div className="py-2 px-6 text-white font-semibold">{readingLabel}</div>
                  )}
                </div>
              )}

              {!showResult && currentStage === totalStages - 1 && canProceed && (
                <div className="mt-4 flex justify-center" />
              )}

              {showResult && (
                <>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    {reflectionPrompts.map((prompt) => (
                      <li key={prompt}>{prompt}</li>
                    ))}
                  </ul>

                  <p className="text-sm text-white/70">
                    {skillUnlockedLabel} <strong>{skillName}</strong>
                  </p>

                  {!hasPassed && <p className="text-xs text-amber-300">{fullRewardHint}</p>}

                  {!hasPassed && (
                    <button
                      onClick={handleRetry}
                      className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
                    >
                      {tryAgainButton}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {showResult && (
          <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
            <h4 className="text-lg font-semibold text-white">{reflectionPromptsTitle}</h4>
            <ul className="text-sm list-disc list-inside space-y-1">
              {reflectionPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>

            <p className="text-sm text-white/70">
              {skillUnlockedLabel} <strong>{skillName}</strong>
            </p>

            {!hasPassed && <p className="text-xs text-amber-300">{fullRewardHint}</p>}

            {!hasPassed && (
              <button
                onClick={handleRetry}
                className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
              >
                {tryAgainButton}
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CreditSalesRisk;
