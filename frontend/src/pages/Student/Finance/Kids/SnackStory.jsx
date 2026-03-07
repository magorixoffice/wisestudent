import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SnackStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("gamecontent");

  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-35";
  const gameContent = t("financial-literacy.kids.snack-story", { returnObjects: true });
  const gameData = getGameDataById(gameId);

  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = gameContent.questions || [
    {
      id: 1,
      text: "You need lunch but want chips. What do you pick?",
      options: [
        {
          id: "chips",
          text: "Just Chips",
          emoji: "🍟",
          
          isCorrect: false
        },
        {
          id: "lunch",
          text: "Balanced Lunch",
          emoji: "🍱",
          
          isCorrect: true
        },
        {
          id: "sweets",
          text: "Dessert Only",
          emoji: "🍰",
          
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You're hungry. What's the smart choice?",
      options: [
        {
          id: "healthy",
          text: "Nutritious Snack",
          emoji: "🥗",
          
          isCorrect: true
        },
        {
          id: "candy",
          text: "Candy Bar",
          emoji: "🍫",
          isCorrect: false
        },
        {
          id: "chips",
          text: "Potato Chips",
          emoji: "🥔",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You're thirsty. What do you choose?",
      options: [
        {
          id: "soda",
          text: "Soda",
          emoji: "🥤",
          isCorrect: false
        },
        {
          id: "water",
          text: "Water",
          emoji: "💧",
          isCorrect: true
        },
        {
          id: "juice",
          text: "Flavoured Juice",
          emoji: "🧃",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You want a snack. What's the healthiest choice?",
      options: [
        {
          id: "cookies",
          text: "Packaged Cookies",
          emoji: "🍪",
          isCorrect: false
        },
        {
          id: "candy",
          text: "Gummy Bears",
          emoji: "🐻",
          isCorrect: false
        },
        {
          id: "fruit",
          text: "Fresh Fruit",
          emoji: "🍎",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "You have money for food. What's the best decision?",
      options: [
        {
          id: "balanced",
          text: "Complete Meal",
          emoji: "🍽️",
          isCorrect: true
        },
        {
          id: "icecream",
          text: "Ice Cream Only",
          emoji: "🍦",
          isCorrect: false
        },
        {
          id: "sweets",
          text: "Candy and Soda",
          emoji: "🍭",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    if (currentQuestion < 0 || currentQuestion >= questions.length) {
      return;
    }

    const currentQ = questions[currentQuestion];
    if (!currentQ || !currentQ.options) {
      return;
    }

    const newChoices = [...choices, {
      questionId: currentQ.id,
      choice: selectedChoice,
      isCorrect: currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];

    setChoices(newChoices);

    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const handleNext = () => {
    navigate("/games/financial-literacy/kids");
  };

  const getCurrentQuestion = () => {
    if (currentQuestion >= 0 && currentQuestion < questions.length) {
      return questions[currentQuestion];
    }
    return null;
  };

  const currentQuestionData = getCurrentQuestion();

  return (
    <GameShell
      title={gameContent.title || "Snack Story"}
      subtitle={showResult ? (gameContent.subtitleComplete || "Story Complete!") : t("financial-literacy.kids.snack-story.subtitleProgress", { current: currentQuestion + 1, total: questions.length, defaultValue: "Question {{current}} of {{total}}" })}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="finance-kids-35"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}
      nextGamePathProp="/student/finance/kids/poster-needs-first"
      nextGameIdProp="finance-kids-36">
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">{t("financial-literacy.kids.snack-story.questionCounter", { current: currentQuestion + 1, total: questions.length, defaultValue: "Question {{current}}/{{total}}" })}</span>
                <span className="text-yellow-400 font-bold">{t("financial-literacy.kids.snack-story.scoreLabel", { score: coins, total: questions.length, defaultValue: "Score: {{score}}/{{total}}" })}</span>
              </div>

              <p className="text-white text-lg mb-6 text-center">
                {currentQuestionData.text}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options && currentQuestionData.options.map(option => (
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

export default SnackStory;
