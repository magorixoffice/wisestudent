import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const fallbackQuestions = [
  {
    id: 1,
    text: "A friend lends you a toy. What should you do?",
    options: [
      { id: "safe", text: "Keep it safe", emoji: "🛡️", description: "", isCorrect: true },
      { id: "break", text: "Break it", emoji: "💔", description: "", isCorrect: false },
      { id: "ignore", text: "Ignore it", emoji: "😴", description: "", isCorrect: false },
    ],
  },
  {
    id: 2,
    text: "You borrowed a toy. What now?",
    options: [
      { id: "keep", text: "Keep it", emoji: "🙈", description: "", isCorrect: false },
      { id: "lose", text: "Lose it", emoji: "😞", description: "", isCorrect: false },
      { id: "return", text: "Return the toy", emoji: "🔁", description: "", isCorrect: true },
    ],
  },
  {
    id: 3,
    text: "You have your friend's toy. What is best?",
    options: [
      { id: "care", text: "Take care of it", emoji: "💝", description: "", isCorrect: true },
      { id: "lose", text: "Lose it", emoji: "😞", description: "", isCorrect: false },
      { id: "break", text: "Break it", emoji: "💔", description: "", isCorrect: false },
    ],
  },
  {
    id: 4,
    text: "The owner asks for the toy back. What do you do?",
    options: [
      { id: "hide", text: "Hide it", emoji: "🫥", description: "", isCorrect: false },
      { id: "give", text: "Give it back", emoji: "🤝", description: "", isCorrect: true },
      { id: "delay", text: "Delay returning", emoji: "⏰", description: "", isCorrect: false },
    ],
  },
  {
    id: 5,
    text: "When you borrow a toy, what is your duty?",
    options: [
      { id: "careless", text: "Be careless", emoji: "😓", description: "", isCorrect: false },
      { id: "forget", text: "Forget about it", emoji: "🤷", description: "", isCorrect: false },
      { id: "responsible", text: "Be responsible", emoji: "🔒", description: "", isCorrect: true },
    ],
  },
];

const ToyStory = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");

  const gameId = "finance-kids-58";
  const gameContent = t("financial-literacy.kids.toy-story", { returnObjects: true });
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
      title={gameContent?.title || "Toy Story"}
      subtitle={showResult
        ? (gameContent?.subtitleComplete || "Story Complete!")
        : t("financial-literacy.kids.toy-story.subtitleProgress", {
            current: currentQuestion + 1,
            total: questions.length,
            defaultValue: "Question {{current}} of {{total}}",
          })}
      currentLevel={currentQuestion + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      score={coins}
      gameId={gameId}
      nextGamePathProp="/student/finance/kids/reflex-borrow-right"
      nextGameIdProp="finance-kids-59"
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
                  {t("financial-literacy.kids.toy-story.questionCounter", {
                    current: currentQuestion + 1,
                    total: questions.length,
                    defaultValue: "Question {{current}}/{{total}}",
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("financial-literacy.kids.toy-story.scoreLabel", {
                    score: coins,
                    total: questions.length,
                    defaultValue: "Score: {{score}}/{{total}}",
                  })}
                </span>
              </div>

              <div className="text-4xl mb-4 text-center">{gameContent?.stageEmoji || "🧸"}</div>
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

export default ToyStory;
