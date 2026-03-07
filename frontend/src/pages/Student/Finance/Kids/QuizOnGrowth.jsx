import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const fallbackQuestions = [
  { id: 1, text: "What helps money grow?", options: [
    { id: "spend", text: "Spending all of it", emoji: "💸", description: "", isCorrect: false },
    { id: "waste", text: "Wasting it", emoji: "🗑️", description: "", isCorrect: false },
    { id: "savings", text: "Savings + interest", emoji: "📈", description: "", isCorrect: true },
  ]},
  { id: 2, text: "How does a bank help money grow?", options: [
    { id: "toys", text: "By giving toys", emoji: "🧸", description: "", isCorrect: false },
    { id: "interest", text: "By paying interest", emoji: "💰", description: "", isCorrect: true },
    { id: "hide", text: "By hiding money", emoji: "🫥", description: "", isCorrect: false },
  ]},
  { id: 3, text: "What is a safe way to grow money?", options: [
    { id: "candy", text: "Buying candy", emoji: "🍬", description: "", isCorrect: false },
    { id: "home", text: "Keeping cash at home", emoji: "🏠", description: "", isCorrect: false },
    { id: "bank", text: "Bank savings account", emoji: "🏦", description: "", isCorrect: true },
  ]},
  { id: 4, text: "What does investing do?", options: [
    { id: "grows", text: "Grows your money", emoji: "📊", description: "", isCorrect: true },
    { id: "spends", text: "Spends your money", emoji: "💸", description: "", isCorrect: false },
    { id: "loses", text: "Always loses your money", emoji: "📉", description: "", isCorrect: false },
  ]},
  { id: 5, text: "Why save money in a bank?", options: [
    { id: "toys", text: "To buy toys now", emoji: "🧸", description: "", isCorrect: false },
    { id: "interest", text: "It grows with interest", emoji: "💹", description: "", isCorrect: true },
    { id: "fun", text: "Only for fun", emoji: "😊", description: "", isCorrect: false },
  ]},
];

const QuizOnGrowth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("gamecontent");

  const gameId = "finance-kids-62";
  const gameContent = t("financial-literacy.kids.quiz-on-growth", { returnObjects: true });
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
      title={gameContent?.title || "Quiz on Growth"}
      subtitle={showResult
        ? (gameContent?.subtitleComplete || "Quiz Complete!")
        : t("financial-literacy.kids.quiz-on-growth.subtitleProgress", {
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
      nextGamePathProp="/student/finance/kids/reflex-investment-basics"
      nextGameIdProp="finance-kids-63"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">
                  {t("financial-literacy.kids.quiz-on-growth.questionCounter", {
                    current: currentQuestion + 1,
                    total: questions.length,
                    defaultValue: "Question {{current}}/{{total}}",
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("financial-literacy.kids.quiz-on-growth.scoreLabel", {
                    score: coins,
                    total: questions.length,
                    defaultValue: "Score: {{score}}/{{total}}",
                  })}
                </span>
              </div>

              <div className="text-4xl mb-4 text-center">{gameContent?.stageEmoji || "📈"}</div>
              <p className="text-white text-lg mb-6 text-center">{currentQuestionData.text}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options?.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
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

export default QuizOnGrowth;
