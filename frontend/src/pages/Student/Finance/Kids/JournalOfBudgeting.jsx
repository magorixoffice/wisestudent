import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { PenSquare } from "lucide-react";
import { getGameDataById } from "../../../../utils/getGameData";

const JournalOfBudgeting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("gamecontent");

  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-27";
  const gameData = getGameDataById(gameId);

  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [entry, setEntry] = useState("");
  const [showResult, setShowResult] = useState(false);

  const gameContent = t("financial-literacy.kids.journal-of-budgeting", { returnObjects: true });
  const stages = Array.isArray(gameContent?.stages) ? gameContent.stages : [];

  const handleSubmit = () => {
    if (showResult) return; // Prevent multiple submissions

    resetFeedback();
    const entryText = entry.trim();

    if (entryText.length >= stages[currentStage].minLength) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);

      const isLastQuestion = currentStage === stages.length - 1;

      // Show feedback for 1.5 seconds, then move to next question or show results
      setTimeout(() => {
        if (isLastQuestion) {
          // This is the last question (5th), show results
          setShowResult(true);
        } else {
          // Move to next question
          setEntry("");
          setCurrentStage((prev) => prev + 1);
        }
      }, 1500);
    }
  };

  const finalScore = score;

  return (
    <GameShell
      title={gameContent?.title || "Journal of Budgeting"}
      subtitle={
        !showResult
          ? t("financial-literacy.kids.journal-of-budgeting.subtitleProgress", {
              current: currentStage + 1,
              total: stages.length,
            })
          : gameContent?.subtitleComplete || "Journal Complete!"
      }
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId="finance-kids-27"
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}
      nextGamePathProp="/student/finance/kids/School-Fair-Story"
      nextGameIdProp="finance-kids-28"
    >
      <div className="text-center text-white space-y-8">
        {!showResult && stages[currentStage] && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <PenSquare className="mx-auto w-10 h-10 text-emerald-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <p className="text-white/70 mb-4">
              {t("financial-literacy.kids.journal-of-budgeting.scoreLabel", {
                score,
                total: stages.length,
              })}
            </p>
            <p className="text-white/60 text-sm mb-4">
              {t("financial-literacy.kids.journal-of-budgeting.minLengthLabel", {
                min: stages[currentStage].minLength,
              })}
            </p>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder={gameContent?.placeholder || "Write your journal entry here..."}
              className="w-full md:w-2/3 h-40 p-4 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
              disabled={showResult}
            />
            <div className="mt-2 text-white/50 text-sm">
              {t("financial-literacy.kids.journal-of-budgeting.charCounter", {
                current: entry.trim().length,
                min: stages[currentStage].minLength,
              })}
            </div>
            <button
              onClick={handleSubmit}
              className={`mt-4 px-8 py-4 rounded-full text-lg font-semibold transition-transform ${
                entry.trim().length >= stages[currentStage].minLength && !showResult
                  ? "bg-emerald-500 hover:bg-emerald-600 hover:scale-105 text-white cursor-pointer"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50"
              }`}
              disabled={entry.trim().length < stages[currentStage].minLength || showResult}
            >
              {currentStage === stages.length - 1
                ? gameContent?.submitFinalButton || "Submit Final Entry"
                : gameContent?.submitContinueButton || "Submit & Continue"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfBudgeting;
