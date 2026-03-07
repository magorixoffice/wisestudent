import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ATMStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("gamecontent");

  const gameId = "finance-kids-48";
  const gameContent = t("financial-literacy.kids.atm-story", { returnObjects: true });
  const gameData = getGameDataById(gameId);

  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;

  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = Array.isArray(gameContent?.questions) ? gameContent.questions : [];

  const handleChoice = (selectedChoice) => {
    const currentQ = questions[currentQuestion];
    if (!currentQ?.options) return;

    const selectedOption = currentQ.options.find((opt) => opt.id === selectedChoice);
    const isCorrect = !!selectedOption?.isCorrect;
    const nextScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
      setScore(nextScore);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), isCorrect ? 1000 : 800);
      return;
    }

    setFinalScore(nextScore);
    setTimeout(() => setShowResult(true), isCorrect ? 1000 : 800);
  };

  const handleNext = () => navigate("/games/financial-literacy/kids");
  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title={gameContent?.title || "ATM Story"}
      subtitle={
        showResult
          ? gameContent?.subtitleComplete || "Story Complete!"
          : t("financial-literacy.kids.atm-story.subtitleProgress", {
              current: currentQuestion + 1,
              total: questions.length,
              defaultValue: "Question {{current}} of {{total}}",
            })
      }
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}
      nextGamePathProp="/student/finance/kids/reflex-bank-symbols"
      nextGameIdProp="finance-kids-49"
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">
                  {t("financial-literacy.kids.atm-story.subtitleProgress", {
                    current: currentQuestion + 1,
                    total: questions.length,
                    defaultValue: "Question {{current}} of {{total}}",
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("financial-literacy.kids.atm-story.scoreLabel", {
                    score,
                    total: questions.length,
                    defaultValue: "Score: {{score}}/{{total}}",
                  })}
                </span>
              </div>

              <p className="text-white text-lg mb-6 text-center">{currentQuestionData.text}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    {option.description ? (
                      <p className="text-white/90 text-sm">{option.description}</p>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default ATMStory;
