import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const fallbackQuestions = [
  {
    id: 1,
    text: "What does borrowing mean?",
    options: [
      { id: "without", text: "Taking without asking", emoji: "🙈", description: "", isCorrect: false },
      { id: "return", text: "Using and returning", emoji: "🔁", description: "", isCorrect: true },
      { id: "steal", text: "Stealing", emoji: "😈", description: "", isCorrect: false },
    ],
  },
  {
    id: 2,
    text: "After borrowing a book, what should you do?",
    options: [
      { id: "return", text: "Return it", emoji: "↩️", description: "", isCorrect: true },
      { id: "keep", text: "Keep it forever", emoji: "📚", description: "", isCorrect: false },
      { id: "sell", text: "Sell it", emoji: "💰", description: "", isCorrect: false },
    ],
  },
  {
    id: 3,
    text: "Why is borrowing money from a bank okay?",
    options: [
      { id: "repay", text: "You repay with interest", emoji: "💳", description: "", isCorrect: true },
      { id: "free", text: "It is free money", emoji: "🎁", description: "", isCorrect: false },
      { id: "no", text: "You never repay", emoji: "🙃", description: "", isCorrect: false },
    ],
  },
  {
    id: 4,
    text: "What happens if you do not return borrowed items?",
    options: [
      { id: "more", text: "You get more items", emoji: "🎁", description: "", isCorrect: false },
      { id: "rewards", text: "You get rewards", emoji: "🏆", description: "", isCorrect: false },
      { id: "trust", text: "People lose trust in you", emoji: "😞", description: "", isCorrect: true },
    ],
  },
  {
    id: 5,
    text: "Why is honest borrowing important?",
    options: [
      { id: "toys", text: "You get more toys", emoji: "🧸", description: "", isCorrect: false },
      { id: "trust", text: "It builds trust with others", emoji: "🤝", description: "", isCorrect: true },
      { id: "fun", text: "It makes borrowing fun", emoji: "😊", description: "", isCorrect: false },
    ],
  },
];

const QuizBorrowing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("gamecontent");

  const gameId = "finance-kids-52";
  const gameContent = t("financial-literacy.kids.quiz-borrowing", { returnObjects: true });
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
      title={gameContent?.title || "Quiz on Borrowing"}
      subtitle={showResult
        ? (gameContent?.subtitleComplete || "Quiz Complete!")
        : t("financial-literacy.kids.quiz-borrowing.subtitleProgress", {
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
      nextGamePathProp="/student/finance/kids/reflex-borrow-steal"
      nextGameIdProp="finance-kids-53"
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
                  {t("financial-literacy.kids.quiz-borrowing.questionCounter", {
                    current: currentQuestion + 1,
                    total: questions.length,
                    defaultValue: "Question {{current}}/{{total}}",
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("financial-literacy.kids.quiz-borrowing.scoreLabel", {
                    score: coins,
                    total: questions.length,
                    defaultValue: "Score: {{score}}/{{total}}",
                  })}
                </span>
              </div>

              <div className="text-4xl mb-4 text-center">{gameContent?.stageEmoji || "🤝"}</div>
              <p className="text-white text-lg mb-6 text-center">{currentQuestionData.text}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options?.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
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

export default QuizBorrowing;
