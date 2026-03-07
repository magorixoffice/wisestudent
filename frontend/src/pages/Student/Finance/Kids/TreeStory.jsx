import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const fallbackQuestions = [
  { id: 1, text: "You plant a small tree today. What helps it grow strong over time?", options: [
    { id: "care", text: "Water and care regularly", emoji: "💧", description: "", isCorrect: true },
    { id: "rush", text: "Pull it to grow faster", emoji: "⚡", description: "", isCorrect: false },
    { id: "ignore", text: "Leave it and forget", emoji: "😴", description: "", isCorrect: false },
  ]},
  { id: 2, text: "Money is like a tree. What makes it grow slowly and safely?", options: [
    { id: "spend", text: "Spending everything quickly", emoji: "💸", description: "", isCorrect: false },
    { id: "hide", text: "Hiding it and never using it", emoji: "🙈", description: "", isCorrect: false },
    { id: "plan", text: "Using and saving wisely over time", emoji: "📊", description: "", isCorrect: true },
  ]},
  { id: 3, text: "You get extra pocket money. What is the smart tree-style choice?", options: [
    { id: "waste", text: "Spend it without thinking", emoji: "🔥", description: "", isCorrect: false },
    { id: "grow", text: "Save part so it grows later", emoji: "🌱", description: "", isCorrect: true },
    { id: "lose", text: "Keep it carelessly", emoji: "📉", description: "", isCorrect: false },
  ]},
  { id: 4, text: "A fruit tree gives fruits every year. What does this teach about money?", options: [
    { id: "fast", text: "Money should be used only once", emoji: "⚡", description: "", isCorrect: false },
    { id: "luck", text: "Only luck matters", emoji: "🍀", description: "", isCorrect: false },
    { id: "return", text: "Good choices give repeated rewards", emoji: "🍎", description: "", isCorrect: true },
  ]},
  { id: 5, text: "If you cut a tree too early, what happens?", options: [
    { id: "loss", text: "You lose future benefits", emoji: "📉", description: "", isCorrect: true },
    { id: "gain", text: "You always gain more", emoji: "💰", description: "", isCorrect: false },
    { id: "nothing", text: "Nothing changes", emoji: "😐", description: "", isCorrect: false },
  ]},
];

const TreeStory = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-kids-61";
  const gameContent = t("financial-literacy.kids.tree-story", { returnObjects: true });
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
      title={gameContent?.title || "Tree Story"}
      subtitle={showResult
        ? (gameContent?.subtitleComplete || "Story Complete!")
        : t("financial-literacy.kids.tree-story.subtitleProgress", {
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
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}
      nextGamePathProp="/student/finance/kids/quiz-on-growth"
      nextGameIdProp="finance-kids-62"
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">
                  {t("financial-literacy.kids.tree-story.questionCounter", {
                    current: currentQuestion + 1,
                    total: questions.length,
                    defaultValue: "Question {{current}}/{{total}}",
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("financial-literacy.kids.tree-story.scoreLabel", {
                    score: coins,
                    total: questions.length,
                    defaultValue: "Score: {{score}}/{{total}}",
                  })}
                </span>
              </div>

              <div className="text-4xl mb-4 text-center">{gameContent?.stageEmoji || "🌳"}</div>
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

export default TreeStory;
