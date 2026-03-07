import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const fallbackStages = [
  { question: 'Which poster best encourages kids to save money?', choices: [
    { text: 'Spend now, regret later! 💨', correct: false },
    { text: 'Money grows on trees! 🌳', correct: false },
    { text: 'Small savings today, big dreams tomorrow! 🌱', correct: true },
  ]},
  { question: 'What poster best explains compounding to kids?', choices: [
    { text: 'Let your money work while you play! ⚙️', correct: true },
    { text: 'Spend it all in one place! 🎯', correct: false },
    { text: 'Money disappears fast! 💨', correct: false },
  ]},
  { question: 'Which poster teaches the best money-growing habit?', choices: [
    { text: 'Buy now, think later! 🛒', correct: false },
    { text: 'Save first, spend later - watch money grow! 📈', correct: true },
    { text: 'Money is meant to be spent! 💸', correct: false },
  ]},
  { question: 'What poster shows the power of patience with money?', choices: [
    { text: 'Great things grow with time - including money! ⏳', correct: true },
    { text: 'Get rich quick with one trick! 🎩', correct: false },
    { text: 'Spend it before it is gone! 🏃', correct: false },
  ]},
  { question: 'Which poster best explains why we should save?', choices: [
    { text: 'Money is for spending, not saving! 🛍️', correct: false },
    { text: 'You can always get more money! 💰', correct: false },
    { text: 'A rupee saved is a rupee that can grow! 🌟', correct: true },
  ]},
];

const PosterGrowYourMoney = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");

  const gameId = "finance-kids-66";
  const gameContent = t("financial-literacy.kids.poster-grow-your-money", { returnObjects: true });
  const gameData = getGameDataById(gameId);

  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = Array.isArray(gameContent?.stages) && gameContent.stages.length > 0 ? gameContent.stages : fallbackStages;

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
      title={gameContent?.title || "Poster: Grow Your Money"}
      subtitle={showResult
        ? (gameContent?.subtitleComplete || "Activity Complete!")
        : t("financial-literacy.kids.poster-grow-your-money.subtitleProgress", {
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
      nextGamePathProp="/student/finance/kids/journal-of-growth"
      nextGameIdProp="finance-kids-67"
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score === 5}
    >
      <div className="text-center text-white space-y-8">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
          <div className="text-4xl mb-4">{gameContent?.stageEmoji || "🖌️"}</div>
          <h3 className="text-2xl font-bold mb-4">{stages[currentStage]?.question}</h3>
          <p className="text-white/70 mb-4">
            {t("financial-literacy.kids.poster-grow-your-money.scoreLabel", {
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
                className="p-6 rounded-2xl border bg-white/10 border-white/20 hover:bg-emerald-600 transition-transform hover:scale-105"
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

export default PosterGrowYourMoney;
