import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const JournalFirstBank = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");

  const gameId = "finance-kids-47";
  const gameContent = t("financial-literacy.kids.journal-first-bank", { returnObjects: true });
  const gameData = getGameDataById(gameId);

  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [text, setText] = useState("");
  const [showResult, setShowResult] = useState(false);

  const stages = Array.isArray(gameContent?.stages) ? gameContent.stages : [];

  const handleSubmit = () => {
    if (showResult || !stages[currentStage]) return;

    resetFeedback();
    const entryText = text.trim();
    if (entryText.length < stages[currentStage].minLength) return;

    setScore((prev) => prev + 1);
    showCorrectAnswerFeedback(1, true);

    const isLastQuestion = currentStage === stages.length - 1;
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setText("");
        setCurrentStage((prev) => prev + 1);
      }
    }, 1200);
  };

  return (
    <GameShell
      title={gameContent?.title || "Journal of First Bank Visit"}
      subtitle={
        showResult
          ? gameContent?.subtitleComplete || "Journal Complete!"
          : t("financial-literacy.kids.journal-first-bank.subtitleProgress", {
              current: currentStage + 1,
              total: stages.length,
              defaultValue: "Question {{current}} of {{total}}",
            })
      }
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
      nextGamePathProp="/student/finance/kids/atm-story"
      nextGameIdProp="finance-kids-48"
    >
      <div className="text-center text-white space-y-8">
        {!showResult && stages[currentStage] ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">🏦</div>
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <p className="text-white/70 mb-4">
              {(gameContent?.scoreLabel || "Score: {{score}}/{{total}}")
                .replace("{{score}}", String(score))
                .replace("{{total}}", String(stages.length))}
            </p>
            <p className="text-white/60 text-sm mb-4">
              {`Min ${stages[currentStage].minLength} characters`}
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={gameContent?.placeholder || "Write your thoughts here..."}
              className="w-full max-w-xl p-4 rounded-xl text-black text-lg bg-white/90"
              disabled={showResult}
            />
            <div className="mt-2 text-white/50 text-sm">
              {text.trim().length}/{stages[currentStage].minLength}
            </div>
            <button
              onClick={handleSubmit}
              className={`mt-4 px-8 py-4 rounded-full text-lg font-semibold transition-transform ${
                text.trim().length >= stages[currentStage].minLength && !showResult
                  ? "bg-green-500 hover:bg-green-600 hover:scale-105 text-white cursor-pointer"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50"
              }`}
              disabled={text.trim().length < stages[currentStage].minLength || showResult}
            >
              {gameContent?.submitButton || "Submit"}
            </button>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default JournalFirstBank;
