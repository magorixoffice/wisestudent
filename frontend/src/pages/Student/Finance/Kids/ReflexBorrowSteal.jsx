import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const fallbackQuestions = [
  {
    id: 1,
    question: "What should you do with borrowed items?",
    correctAnswer: "Return borrowed items",
    options: [
      { text: "Return borrowed items", isCorrect: true, emoji: "↩️" },
      { text: "Keep them forever", isCorrect: false, emoji: "🚫" },
      { text: "Hide them", isCorrect: false, emoji: "🙈" },
      { text: "Forget about them", isCorrect: false, emoji: "😴" },
    ],
  },
  {
    id: 2,
    question: "What is the right thing to do with a loan?",
    correctAnswer: "Repay the loan",
    options: [
      { text: "Avoid payment", isCorrect: false, emoji: "🚫" },
      { text: "Repay the loan", isCorrect: true, emoji: "💰" },
      { text: "Ignore it", isCorrect: false, emoji: "🙈" },
      { text: "Forget it", isCorrect: false, emoji: "😴" },
    ],
  },
  {
    id: 3,
    question: "When you borrow something, what should you do?",
    correctAnswer: "Give it back",
    options: [
      { text: "Hide it", isCorrect: false, emoji: "🙈" },
      { text: "Keep it", isCorrect: false, emoji: "🚫" },
      { text: "Give it back", isCorrect: true, emoji: "↩️" },
      { text: "Lose it", isCorrect: false, emoji: "❌" },
    ],
  },
  {
    id: 4,
    question: "What is the honest way to handle borrowing?",
    correctAnswer: "Be honest",
    options: [
      { text: "Cheat", isCorrect: false, emoji: "🚫" },
      { text: "Be honest", isCorrect: true, emoji: "✅" },
      { text: "Lie", isCorrect: false, emoji: "🤥" },
      { text: "Pretend", isCorrect: false, emoji: "🎭" },
    ],
  },
  {
    id: 5,
    question: "When should you return borrowed items?",
    correctAnswer: "Return on time",
    options: [
      { text: "Delay", isCorrect: false, emoji: "⏰" },
      { text: "Never", isCorrect: false, emoji: "🚫" },
      { text: "Maybe later", isCorrect: false, emoji: "🤷" },
      { text: "Return on time", isCorrect: true, emoji: "⏱️" },
    ],
  },
];

const ReflexBorrowSteal = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");

  const gameId = "finance-kids-53";
  const gameContent = t("financial-literacy.kids.reflex-borrow-steal", { returnObjects: true });
  const gameData = getGameDataById(gameId);

  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [gameState, setGameState] = useState("ready");
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(0);

  const questions = Array.isArray(gameContent?.questions) && gameContent.questions.length > 0
    ? gameContent.questions
    : fallbackQuestions;

  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
    }
  }, [currentRound, gameState]);

  const handleTimeUp = useCallback(() => {
    setAnswered(true);
    resetFeedback();
    const isLastQuestion = currentRoundRef.current >= TOTAL_ROUNDS;
    setTimeout(() => {
      if (isLastQuestion) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
      }
    }, 1000);
  }, [resetFeedback]);

  useEffect(() => {
    if (gameState !== "playing") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (currentRoundRef.current > TOTAL_ROUNDS) {
      setGameState("finished");
      return;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          handleTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState, currentRound, handleTimeUp]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(ROUND_TIME);
    setScore(0);
    setCurrentRound(1);
    resetFeedback();
  };

  const handleAnswer = (option) => {
    if (gameState !== "playing" || answered || currentRound > TOTAL_ROUNDS) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setAnswered(true);
    resetFeedback();

    if (option.isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentRound >= TOTAL_ROUNDS) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
      }
    }, 500);
  };

  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title={gameContent?.title || "Reflex Borrow/Steal"}
      subtitle={gameState === "playing"
        ? t("financial-literacy.kids.reflex-borrow-steal.subtitlePlaying", {
            current: currentRound,
            total: TOTAL_ROUNDS,
            defaultValue: "Round {{current}}/{{total}}",
          })
        : (gameContent?.subtitleReady || "Test your borrowing reflexes!")}
      currentLevel={currentRound}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      score={score}
      gameId={gameId}
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      totalLevels={5}
      maxScore={5}
      showConfetti={gameState === "finished" && score === 5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/kids/puzzle-borrow-match"
      nextGameIdProp="finance-kids-54"
    >
      <div className="space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">{gameContent?.readyEmoji || "🤝"}</div>
            <h3 className="text-2xl font-bold text-white mb-4">{gameContent?.readyTitle || "Get Ready!"}</h3>
            <p className="text-white/90 text-lg mb-6">{gameContent?.readyDescription || "Answer questions about borrowing correctly."}</p>
            <p className="text-white/80 mb-6">
              {t("financial-literacy.kids.reflex-borrow-steal.readyInfo", {
                total: TOTAL_ROUNDS,
                seconds: ROUND_TIME,
                defaultValue: "You have {{total}} questions with {{seconds}} seconds each!",
              })}
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
              {gameContent?.startButton || "Start Game"}
            </button>
          </div>
        )}

        {gameState === "playing" && currentQuestion && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white">
                <span className="font-bold">{gameContent?.roundLabel || "Round:"}</span> {currentRound}/{TOTAL_ROUNDS}
              </div>
              <div className={`font-bold ${timeLeft <= 2 ? "text-red-500" : timeLeft <= 3 ? "text-yellow-500" : "text-green-400"}`}>
                <span className="text-white">{gameContent?.timeLabel || "Time:"}</span> {timeLeft}s
              </div>
              <div className="text-white">
                <span className="font-bold">{gameContent?.scoreLabel || "Score:"}</span> {score}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">{currentQuestion.question}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed min-h-[80px] flex items-center justify-center"
                  >
                    <div className="text-4xl mr-3">{option.emoji}</div>
                    <h3 className="font-bold text-xl">{option.text}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexBorrowSteal;
