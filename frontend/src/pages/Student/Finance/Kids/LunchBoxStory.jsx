import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const fallbackQuestions = [
  {
    id: 1,
    text: "You borrow a friend's lunch. What should you do next day?",
    options: [
      { id: "yes", text: "Share or return", emoji: "✅", description: "", isCorrect: true },
      { id: "no", text: "Keep it for yourself", emoji: "😐", description: "", isCorrect: false },
      { id: "forget", text: "Forget about it", emoji: "🙈", description: "", isCorrect: false },
    ],
  },
  {
    id: 2,
    text: "Your friend shares lunch. How should you respond?",
    options: [
      { id: "nothing", text: "Say nothing", emoji: "😶", description: "", isCorrect: false },
      { id: "share", text: "Share something back", emoji: "🤝", description: "", isCorrect: true },
      { id: "more", text: "Take even more lunch", emoji: "🍴", description: "", isCorrect: false },
    ],
  },
  {
    id: 3,
    text: "You have ₹10 for lunch. Friend needs ₹5. What is best?",
    options: [
      { id: "share", text: "Share ₹5 with friend", emoji: "💸", description: "", isCorrect: true },
      { id: "all", text: "Spend all on yourself", emoji: "🍔", description: "", isCorrect: false },
      { id: "hide", text: "Hide your money", emoji: "💰", description: "", isCorrect: false },
    ],
  },
  {
    id: 4,
    text: "You borrow lunch money. When should you repay?",
    options: [
      { id: "never", text: "Never repay", emoji: "😞", description: "", isCorrect: false },
      { id: "snacks", text: "Spend it on snacks", emoji: "🍟", description: "", isCorrect: false },
      { id: "next", text: "Next day as promised", emoji: "✅", description: "", isCorrect: true },
    ],
  },
  {
    id: 5,
    text: "Why is sharing lunch important?",
    options: [
      { id: "trust", text: "It builds trust and kindness", emoji: "😊", description: "", isCorrect: true },
      { id: "food", text: "You get more food", emoji: "🍽️", description: "", isCorrect: false },
      { id: "popular", text: "It makes you popular", emoji: "👥", description: "", isCorrect: false },
    ],
  },
];

const LunchBoxStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("gamecontent");

  const gameId = "finance-kids-55";
  const gameContent = t("financial-literacy.kids.lunch-box-story", { returnObjects: true });
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

  const questions = Array.isArray(gameContent?.questions) && gameContent.questions.length > 0
    ? gameContent.questions
    : fallbackQuestions;

  const handleChoice = (selectedChoice) => {
    if (currentQuestion < 0 || currentQuestion >= questions.length) return;

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
      const correctAnswers = newChoices.filter((choice) => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => setShowResult(true), isCorrect ? 1000 : 800);
    }
  };

  const currentQuestionData = questions[currentQuestion] || null;

  return (
    <GameShell
      title={gameContent?.title || "Lunch Box Story"}
      subtitle={showResult
        ? (gameContent?.subtitleComplete || "Story Complete!")
        : t("financial-literacy.kids.lunch-box-story.subtitleProgress", {
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
      nextGamePathProp="/student/finance/kids/poster-return-borrow"
      nextGameIdProp="finance-kids-56"
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">
                  {t("financial-literacy.kids.lunch-box-story.questionCounter", {
                    current: currentQuestion + 1,
                    total: questions.length,
                    defaultValue: "Question {{current}}/{{total}}",
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("financial-literacy.kids.lunch-box-story.scoreLabel", {
                    score: coins,
                    total: questions.length,
                    defaultValue: "Score: {{score}}/{{total}}",
                  })}
                </span>
              </div>

              <div className="text-4xl mb-4 text-center">{gameContent?.stageEmoji || "🍽️"}</div>
              <p className="text-white text-lg mb-6 text-center">{currentQuestionData.text}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options?.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
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

export default LunchBoxStory;
