import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const fallbackQuestions = [
  { id: 1, text: "Piggy bank earns no interest. Bank account does. Which is better?", options: [
    { id: "bank", text: "Bank account", emoji: "🏦", description: "", isCorrect: true },
    { id: "piggy", text: "Piggy bank", emoji: "🐷", description: "", isCorrect: false },
    { id: "mattress", text: "Under mattress", emoji: "🛏️", description: "", isCorrect: false },
  ]},
  { id: 2, text: "You have ₹50. Where should you save to help it grow?", options: [
    { id: "jar", text: "Jar at home", emoji: "🏺", description: "", isCorrect: false },
    { id: "bank", text: "Bank savings account", emoji: "💰", description: "", isCorrect: true },
    { id: "spend", text: "Spend now", emoji: "🛍️", description: "", isCorrect: false },
  ]},
  { id: 3, text: "Bank offers interest, piggy bank does not. Choose wisely.", options: [
    { id: "bank", text: "Bank for interest", emoji: "📈", description: "", isCorrect: true },
    { id: "piggy", text: "Piggy bank for fun", emoji: "🐷", description: "", isCorrect: false },
    { id: "give", text: "Give away", emoji: "🎁", description: "", isCorrect: false },
  ]},
  { id: 4, text: "You save ₹100 in bank and get ₹105. Why?", options: [
    { id: "magic", text: "Magic", emoji: "🪄", description: "", isCorrect: false },
    { id: "added", text: "Added more money", emoji: "💸", description: "", isCorrect: false },
    { id: "interest", text: "Bank paid interest", emoji: "📊", description: "", isCorrect: true },
  ]},
  { id: 5, text: "Why is bank better than piggy bank?", options: [
    { id: "safe", text: "Safe and helps money grow", emoji: "🔒", description: "", isCorrect: true },
    { id: "cool", text: "Looks cool", emoji: "🐷", description: "", isCorrect: false },
    { id: "carry", text: "Easy to carry", emoji: "🎒", description: "", isCorrect: false },
  ]},
];

const PiggyBank = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("gamecontent");

  const gameId = "finance-kids-65";
  const gameContent = t("financial-literacy.kids.piggy-bank", { returnObjects: true });
  const gameData = getGameDataById(gameId);

  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = Array.isArray(gameContent?.questions) && gameContent.questions.length > 0 ? gameContent.questions : fallbackQuestions;

  const handleChoice = (selectedChoice) => {
    const currentQ = questions[currentQuestion];
    if (!currentQ?.options) return;
    const isCorrect = currentQ.options.find((opt) => opt.id === selectedChoice)?.isCorrect;
    const newChoices = [...choices, { questionId: currentQ.id, choice: selectedChoice, isCorrect }];
    setChoices(newChoices);

    if (isCorrect) {
      setCoins((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), isCorrect ? 1000 : 800);
    } else {
      setFinalScore(newChoices.filter((c) => c.isCorrect).length);
      setTimeout(() => setShowResult(true), isCorrect ? 1000 : 800);
    }
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title={gameContent?.title || "Piggy Bank Story"}
      subtitle={showResult
        ? (gameContent?.subtitleComplete || "Story Complete!")
        : t("financial-literacy.kids.piggy-bank.subtitleProgress", {
            current: currentQuestion + 1,
            total: questions.length,
            defaultValue: "Question {{current}} of {{total}}",
          })}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={() => navigate("/games/financial-literacy/kids")}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId={gameId}
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}
      nextGamePathProp="/student/finance/kids/poster-grow-your-money"
      nextGameIdProp="finance-kids-66"
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">
                  {t("financial-literacy.kids.piggy-bank.questionCounter", {
                    current: currentQuestion + 1,
                    total: questions.length,
                    defaultValue: "Question {{current}}/{{total}}",
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("financial-literacy.kids.piggy-bank.scoreLabel", {
                    score: coins,
                    total: questions.length,
                    defaultValue: "Score: {{score}}/{{total}}",
                  })}
                </span>
              </div>

              <div className="text-4xl mb-4 text-center">{gameContent?.stageEmoji || "🐷"}</div>
              <p className="text-white text-lg mb-6 text-center">{currentQuestionData.text}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options?.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
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

export default PiggyBank;
