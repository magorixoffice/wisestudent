import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const fallbackQuestions = [
  { id: 1, text: "Your favorite toy breaks after one week. What does this teach you?", options: [
    { id: "buy", text: "Buy more toys quickly", emoji: "🛍️", description: "", isCorrect: false },
    { id: "ignore", text: "Money choices do not matter", emoji: "🙈", description: "", isCorrect: false },
    { id: "value", text: "Think before spending money", emoji: "🧠", description: "", isCorrect: true },
  ]},
  { id: 2, text: "You save coins every week and see growth. What do you learn?", options: [
    { id: "patience", text: "Saving needs patience", emoji: "⏳", description: "", isCorrect: true },
    { id: "boring", text: "Saving is boring", emoji: "😐", description: "", isCorrect: false },
    { id: "waste", text: "Coins are useless", emoji: "🪙", description: "", isCorrect: false },
  ]},
  { id: 3, text: "You want an expensive item later. What is best?", options: [
    { id: "rush", text: "Buy anything now", emoji: "🏃", description: "", isCorrect: false },
    { id: "plan", text: "Plan and save slowly", emoji: "📊", description: "", isCorrect: true },
    { id: "borrow", text: "Always borrow", emoji: "🤝", description: "", isCorrect: false },
  ]},
  { id: 4, text: "You compare prices before buying. What skill is this?", options: [
    { id: "slow", text: "Being too slow", emoji: "🐢", description: "", isCorrect: false },
    { id: "lazy", text: "Avoiding shopping", emoji: "😴", description: "", isCorrect: false },
    { id: "smart", text: "Smart money thinking", emoji: "💡", description: "", isCorrect: true },
  ]},
  { id: 5, text: "Choosing saving over toys builds what?", options: [
    { id: "habit", text: "Good saving habits", emoji: "🏦", description: "", isCorrect: true },
    { id: "sad", text: "No fun at all", emoji: "😢", description: "", isCorrect: false },
    { id: "fear", text: "Fear of spending", emoji: "😨", description: "", isCorrect: false },
  ]},
];

const ToyVsSavingStory = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");

  const gameId = "finance-kids-68";
  const gameContent = t("financial-literacy.kids.toy-vs-saving-story", { returnObjects: true });
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
      title={gameContent?.title || "Toy vs Saving Story"}
      subtitle={showResult
        ? (gameContent?.subtitleComplete || "Story Complete!")
        : t("financial-literacy.kids.toy-vs-saving-story.subtitleProgress", {
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
      nextGamePathProp="/student/finance/kids/reflex-growth-check"
      nextGameIdProp="finance-kids-69"
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
                  {t("financial-literacy.kids.toy-vs-saving-story.questionCounter", {
                    current: currentQuestion + 1,
                    total: questions.length,
                    defaultValue: "Question {{current}}/{{total}}",
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("financial-literacy.kids.toy-vs-saving-story.scoreLabel", {
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

export default ToyVsSavingStory;
