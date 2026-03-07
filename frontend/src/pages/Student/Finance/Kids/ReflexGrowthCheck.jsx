import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const fallbackQuestions = [
  { id: 1, question: "What happens when money earns interest?", options: [
    { text: "Money lost", isCorrect: false, emoji: "💸" },
    { text: "Interest earned", isCorrect: true, emoji: "💰" },
    { text: "No change", isCorrect: false, emoji: "😐" },
    { text: "Money stolen", isCorrect: false, emoji: "😈" },
  ]},
  { id: 2, question: "What happens when you save over time?", options: [
    { text: "Savings grew", isCorrect: true, emoji: "📈" },
    { text: "Money spent", isCorrect: false, emoji: "💸" },
    { text: "Money disappears", isCorrect: false, emoji: "👻" },
    { text: "Nothing happens", isCorrect: false, emoji: "😴" },
  ]},
  { id: 3, question: "What happens when investment succeeds?", options: [
    { text: "Loss incurred", isCorrect: false, emoji: "📉" },
    { text: "Money frozen", isCorrect: false, emoji: "🧊" },
    { text: "Investment gone", isCorrect: false, emoji: "💔" },
    { text: "Profit made", isCorrect: true, emoji: "💵" },
  ]},
  { id: 4, question: "What happens when investment value increases?", options: [
    { text: "Investment up", isCorrect: true, emoji: "🚀" },
    { text: "Money down", isCorrect: false, emoji: "📉" },
    { text: "Investment stuck", isCorrect: false, emoji: "🔒" },
    { text: "Value zero", isCorrect: false, emoji: "0️⃣" },
  ]},
  { id: 5, question: "What happens with wise long-term investing?", options: [
    { text: "Funds shrink", isCorrect: false, emoji: "💸" },
    { text: "Wealth stays same", isCorrect: false, emoji: "➡️" },
    { text: "Wealth grows", isCorrect: true, emoji: "🌳" },
    { text: "Wealth disappears", isCorrect: false, emoji: "👻" },
  ]},
];

const ReflexGrowthCheck = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");

  const gameId = "finance-kids-69";
  const gameContent = t("financial-literacy.kids.reflex-growth-check", { returnObjects: true });
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

  const questions = Array.isArray(gameContent?.questions) && gameContent.questions.length > 0 ? gameContent.questions : fallbackQuestions;

  useEffect(() => { currentRoundRef.current = currentRound; }, [currentRound]);

  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
    }
  }, [currentRound, gameState]);

  const handleTimeUp = useCallback(() => {
    setAnswered(true);
    resetFeedback();
    const isLast = currentRoundRef.current >= TOTAL_ROUNDS;

    setTimeout(() => {
      if (isLast) setGameState("finished");
      else setCurrentRound((prev) => prev + 1);
    }, 1000);
  }, [resetFeedback]);

  useEffect(() => {
    if (gameState !== "playing") {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          handleTimeUp();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [gameState, currentRound, handleTimeUp]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(ROUND_TIME);
    setScore(0);
    setCurrentRound(1);
    setAnswered(false);
    resetFeedback();
  };

  const handleAnswer = (option) => {
    if (answered || gameState !== "playing") return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;

    setAnswered(true);
    resetFeedback();

    if (option.isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentRound >= TOTAL_ROUNDS) setGameState("finished");
      else {
        setCurrentRound((prev) => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  return (
    <GameShell
      title={gameContent?.title || "Reflex Growth Check"}
      subtitle={gameState === "playing"
        ? t("financial-literacy.kids.reflex-growth-check.subtitlePlaying", {
            current: currentRound,
            total: TOTAL_ROUNDS,
            defaultValue: "Question {{current}} of {{total}}",
          })
        : (gameContent?.subtitleReady || "Test your growth reflexes!")}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      showConfetti={gameState === "finished" && score === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId={gameId}
      gameType="finance"
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/kids/badge-money-gardener"
      nextGameIdProp="finance-kids-70"
    >
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">{gameContent?.readyEmoji || "📈"}</div>
            <h3 className="text-2xl font-bold text-white mb-4">{gameContent?.readyTitle || "Ready?"}</h3>
            <p className="text-white/90 text-lg mb-6">{gameContent?.readyDescription || "Choose correctly."}</p>
            <p className="text-white/80 mb-6">
              {t("financial-literacy.kids.reflex-growth-check.readyInfo", {
                total: TOTAL_ROUNDS,
                seconds: ROUND_TIME,
                defaultValue: "You have {{total}} questions with {{seconds}} seconds each!",
              })}
            </p>
            <button onClick={startGame} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105">
              {gameContent?.startButton || "Start Game"}
            </button>
          </div>
        )}

        {gameState === "playing" && questions[currentRound - 1] && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white"><span className="font-bold">{gameContent?.roundLabel || "Question:"}</span> {currentRound}/{TOTAL_ROUNDS}</div>
              <div className={`font-bold ${timeLeft <= 2 ? "text-red-500" : timeLeft <= 3 ? "text-yellow-500" : "text-green-400"}`}>
                <span className="text-white">{gameContent?.timeLabel || "Time:"}</span> {timeLeft}s
              </div>
              <div className="text-white"><span className="font-bold">{gameContent?.scoreLabel || "Score:"}</span> {score}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">{questions[currentRound - 1].question}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentRound - 1].options.map((option, index) => (
                  <button key={index} onClick={() => handleAnswer(option)} disabled={answered} className="w-full min-h-[80px] bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-6 py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                    <span className="text-3xl mr-2">{option.emoji}</span> {option.text}
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

export default ReflexGrowthCheck;
