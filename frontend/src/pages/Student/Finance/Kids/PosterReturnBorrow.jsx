import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const fallbackStages = [
  {
    question: "Which poster best reminds friends about borrowing responsibility?",
    choices: [
      { text: "Take what you want, when you want! 🎯", correct: false },
      { text: "Finders keepers, losers weepers! 🎭", correct: false },
      { text: "Borrow today, return tomorrow - keep trust strong! 🤝", correct: true },
    ],
  },
  {
    question: "What poster best encourages on-time returns?",
    choices: [
      { text: "Return when you feel like it! 🚫", correct: false },
      { text: "A promise to return is a promise to keep! ✨", correct: true },
      { text: "Borrowed items are better than new ones! 🆕", correct: false },
    ],
  },
  {
    question: "Which poster teaches the best borrowing habit?",
    choices: [
      { text: "Ask, use, return - the right way to borrow! ✅", correct: true },
      { text: "Borrow now, worry later! 🎢", correct: false },
      { text: "What's yours is mine! 🎯", correct: false },
    ],
  },
  {
    question: "What poster helps maintain trust between friends?",
    choices: [
      { text: "I'll return it... eventually! 🐢", correct: false },
      { text: "Your trust is priceless - I'll return it! 💎", correct: true },
      { text: "What borrowing policy? 🤔", correct: false },
    ],
  },
  {
    question: "Which poster best explains why returning matters?",
    choices: [
      { text: "Every return builds trust - let's build together! 🌈", correct: true },
      { text: "Borrowing is easier than buying! 🛍️", correct: false },
      { text: "Why buy when you can borrow forever? ♾️", correct: false },
    ],
  },
];

const PosterReturnBorrow = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");

  const gameId = "finance-kids-56";
  const gameContent = t("financial-literacy.kids.poster-return-borrow", { returnObjects: true });
  const gameData = getGameDataById(gameId);

  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = Array.isArray(gameContent?.stages) && gameContent.stages.length > 0
    ? gameContent.stages
    : fallbackStages;

  const handleSelect = (isCorrect) => {
    resetFeedback();
    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentStage < stages.length - 1) {
      setTimeout(() => setCurrentStage((prev) => prev + 1), 800);
    } else {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  return (
    <GameShell
      title={gameContent?.title || "Poster: Return What You Borrow"}
      subtitle={showResult
        ? (gameContent?.subtitleComplete || "Activity Complete!")
        : t("financial-literacy.kids.poster-return-borrow.subtitleProgress", {
            current: currentStage + 1,
            total: stages.length,
            defaultValue: "Question {{current}} of {{total}}",
          })}
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/finance/kids/journal-borrowing"
      nextGameIdProp="finance-kids-57"
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score === 5}
    >
      <div className="text-center text-white space-y-8">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
          <div className="text-4xl mb-4">{gameContent?.stageEmoji || "🤝"}</div>
          <h3 className="text-2xl font-bold mb-4">{stages[currentStage]?.question}</h3>
          <p className="text-white/70 mb-4">
            {t("financial-literacy.kids.poster-return-borrow.scoreLabel", {
              score,
              total: stages.length,
              defaultValue: "Score: {{score}}/{{total}}",
            })}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stages[currentStage]?.choices?.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(choice.correct)}
                className="p-6 rounded-2xl border bg-white/10 border-white/20 hover:bg-yellow-500 transition-transform hover:scale-105"
                disabled={showResult}
              >
                <div className="text-lg font-semibold">{choice.text}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default PosterReturnBorrow;
