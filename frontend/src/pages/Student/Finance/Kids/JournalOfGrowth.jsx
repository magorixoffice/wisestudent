import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const fallbackStages = [
  { question: 'Write: "If I invest ₹100, I want it to grow into ___."', minLength: 10 },
  { question: 'Write: "Investing money makes me feel ___."', minLength: 10 },
  { question: 'Write: "One thing I learned about investing is ___."', minLength: 10 },
  { question: 'Write: "I would invest ₹100 to help ___."', minLength: 10 },
  { question: 'Write: "Growing money taught me ___ about patience."', minLength: 10 },
];

const JournalOfGrowth = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");

  const gameId = "finance-kids-67";
  const gameContent = t("financial-literacy.kids.journal-of-growth", { returnObjects: true });
  const gameData = getGameDataById(gameId);

  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [entry, setEntry] = useState("");
  const [showResult, setShowResult] = useState(false);

  const stages = Array.isArray(gameContent?.stages) && gameContent.stages.length > 0 ? gameContent.stages : fallbackStages;
  const minLength = stages[currentStage]?.minLength || 10;

  const handleSubmit = () => {
    if (showResult) return;
    const entryText = entry.trim();
    if (entryText.length < minLength) return;

    resetFeedback();
    setScore((prev) => prev + 1);
    showCorrectAnswerFeedback(1, true);

    const isLast = currentStage === stages.length - 1;
    setTimeout(() => {
      if (isLast) {
        setShowResult(true);
      } else {
        setEntry("");
        setCurrentStage((prev) => prev + 1);
      }
    }, 1000);
  };

  return (
    <GameShell
      title={gameContent?.title || "Journal of Growth"}
      subtitle={!showResult
        ? t("financial-literacy.kids.journal-of-growth.subtitleProgress", {
            current: currentStage + 1,
            total: stages.length,
            defaultValue: "Question {{current}} of {{total}}",
          })
        : (gameContent?.subtitleComplete || "Journal Complete!")}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId={gameId}
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score === 5}
      nextGamePathProp="/student/finance/kids/toy-vs-saving-story"
      nextGameIdProp="finance-kids-68"
    >
      <div className="text-center text-white space-y-8">
        {!showResult && stages[currentStage] ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">{gameContent?.stageEmoji || "📝"}</div>
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <p className="text-white/70 mb-4">
              {t("financial-literacy.kids.journal-of-growth.scoreLabel", {
                score,
                total: stages.length,
                defaultValue: "Score: {{score}}/{{total}}",
              })}
            </p>
            <p className="text-white/60 text-sm mb-4">
              {t("financial-literacy.kids.journal-of-growth.minLengthLabel", {
                count: minLength,
                defaultValue: "Write at least {{count}} characters",
              })}
            </p>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder={gameContent?.placeholder || "Write your journal entry here..."}
              className="w-full max-w-xl p-4 rounded-xl text-black text-lg bg-white/90"
              disabled={showResult}
            />
            <div className="mt-2 text-white/50 text-sm">
              {t("financial-literacy.kids.journal-of-growth.characterCount", {
                count: entry.trim().length,
                required: minLength,
                defaultValue: "{{count}}/{{required}} characters",
              })}
            </div>
            <button
              onClick={handleSubmit}
              className={`mt-4 px-8 py-4 rounded-full text-lg font-semibold transition-transform ${
                entry.trim().length >= minLength && !showResult
                  ? "bg-green-500 hover:bg-green-600 hover:scale-105 text-white cursor-pointer"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50"
              }`}
              disabled={entry.trim().length < minLength || showResult}
            >
              {currentStage === stages.length - 1
                ? (gameContent?.submitFinalButton || "Submit Final Entry")
                : (gameContent?.submitContinueButton || "Submit & Continue")}
            </button>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default JournalOfGrowth;
