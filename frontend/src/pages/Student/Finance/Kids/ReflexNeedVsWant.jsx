import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexNeedVsWant = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-33";
  const gameContent = t("financial-literacy.kids.reflex-need-vs-want", { returnObjects: true });
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(0);

  const questions = gameContent.questions || [
    {
      id: 1,
      question: "Which one is a need?",
      correctAnswer: "Shoes for School",
      options: [
        { text: "Shoes for School", isCorrect: true, emoji: "👟" },
        { text: "10th Toy Car", isCorrect: false, emoji: "🚗" },
        { text: "Video Game", isCorrect: false, emoji: "🎮" },
        { text: "Fancy Sunglasses", isCorrect: false, emoji: "🕶️" }
      ]
    },
    {
      id: 2,
      question: "What is a need for staying healthy?",
      correctAnswer: "Healthy Food",
      options: [
        { text: "Extra Candy", isCorrect: false, emoji: "🍬" },
        { text: "Healthy Food", isCorrect: true, emoji: "🥗" },
        { text: "Ice Cream", isCorrect: false, emoji: "🍦" },
        { text: "Soda", isCorrect: false, emoji: "🥤" }
      ]
    },
    {
      id: 3,
      question: "Which item is essential for learning?",
      correctAnswer: "School Books",
      options: [
        { text: "Video Game", isCorrect: false, emoji: "🎮" },
        { text: "Action Figure", isCorrect: false, emoji: "🤖" },
        { text: "Puzzle Game", isCorrect: false, emoji: "🧩" },
        { text: "School Books", isCorrect: true, emoji: "📚" }
      ]
    },
    {
      id: 4,
      question: "What do you need in cold weather?",
      correctAnswer: "Winter Jacket",
      options: [
        { text: "Fancy Sunglasses", isCorrect: false, emoji: "🕶️" },
        { text: "Swimming Pool", isCorrect: false, emoji: "🏊" },
        { text: "Winter Jacket", isCorrect: true, emoji: "🧥" },
        { text: "Beach Ball", isCorrect: false, emoji: "🏐" }
      ]
    },
    {
      id: 5,
      question: "What is needed to get to school?",
      correctAnswer: "Bus Fare",
      options: [
        { text: "Bus Fare", isCorrect: true, emoji: "🚌" },
        { text: "New Headphones", isCorrect: false, emoji: "🎧" },
        { text: "Music Player", isCorrect: false, emoji: "🎵" },
        { text: "Smart Watch", isCorrect: false, emoji: "⌚" }
      ]
    }
  ];

  // Update ref when currentRound changes
  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  // Reset timer when round changes
  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
    }
  }, [currentRound, gameState]);

  // Handle time up - move to next question or show results
  const handleTimeUp = useCallback(() => {
    setAnswered(true);
    resetFeedback();
    
    const isLastQuestion = currentRoundRef.current >= TOTAL_ROUNDS;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
        setAnswered(false);
      }
    }, 1000);
  }, [resetFeedback]);

  // Timer effect - countdown from 10 seconds for each question
  useEffect(() => {
    if (gameState !== "playing") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Check if game should be finished
    if (currentRoundRef.current > TOTAL_ROUNDS) {
      setGameState("finished");
      return;
    }

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          // Time's up for this round
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
  }, [gameState, handleTimeUp]);

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

    // Clear the timer immediately when user answers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setAnswered(true);
    resetFeedback();

    const isCorrect = option.isCorrect;
    const isLastQuestion = currentRound === questions.length;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    // Move to next round or show results after a short delay
    setTimeout(() => {
      if (isLastQuestion) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const finalScore = score;

  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title={gameContent.title || "Reflex Need vs Want"}
      subtitle={gameState === "playing" ? t("financial-literacy.kids.reflex-need-vs-want.subtitlePlaying", { current: currentRound, total: TOTAL_ROUNDS, defaultValue: "Round {{current}}/{{total}}: Test your knowledge about needs vs wants!" }) : (gameContent.subtitleReady || "Test your knowledge about needs vs wants!")}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      showConfetti={gameState === "finished" && finalScore === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="finance"
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/kids/puzzle-needs-wants"
      nextGameIdProp="finance-kids-34">
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">{gameContent.readyEmoji || "📋"}</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {gameContent.readyTitle || "Ready to Test Your Needs vs Wants Knowledge?"}
            </h3>
            <p className="text-white/90 text-lg mb-6">
              {gameContent.readyDescription || "Answer questions about the difference between needs and wants."}
            </p>
            <p className="text-white/80 mb-6">
              {t("financial-literacy.kids.reflex-need-vs-want.readyInfo", {
                total: TOTAL_ROUNDS,
                seconds: ROUND_TIME,
                defaultValue: "You have {{total}} questions with {{seconds}} seconds each!",
              })}
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
              {gameContent.startButton || "Start Game"}
            </button>
          </div>
        )}

        {gameState === "playing" && currentQuestion && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white">
                <span className="font-bold">{gameContent.roundLabel || "Round:"}</span> {currentRound}/{TOTAL_ROUNDS}
              </div>
              <div className={`font-bold ${timeLeft <= 2 ? 'text-red-500' : timeLeft <= 3 ? 'text-yellow-500' : 'text-green-400'}`}>
                <span className="text-white">{gameContent.timeLabel || "Time:"}</span> {timeLeft}s
              </div>
              <div className="text-white">
                <span className="font-bold">{gameContent.scoreLabel || "Score:"}</span> {score}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                {currentQuestion.question}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className="w-full min-h-[80px] bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-6 py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <span className="text-3xl mr-2">{option.emoji}</span> {option.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {gameState === "finished" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">{gameContent.resultGreatEmoji || "🎉"}</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {gameContent.resultGreatTitle || "Great Job!"}
                </h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.kids.reflex-need-vs-want.resultGreatDescription", {
                    score: finalScore,
                    total: TOTAL_ROUNDS,
                    defaultValue: "You got {{score}} out of {{total}} questions correct!",
                  })}
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{finalScore} Coins</span>
                </div>
                <p className="text-white/80">
                  {gameContent.resultGreatLesson || "Lesson: Needs are essential for survival and learning, while wants are things we'd like to have but don't need!"}
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">{gameContent.resultKeepEmoji || "😔"}</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {gameContent.resultKeepTitle || "Keep Learning!"}
                </h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.kids.reflex-need-vs-want.resultKeepDescription", {
                    score: finalScore,
                    total: TOTAL_ROUNDS,
                    defaultValue: "You got {{score}} out of {{total}} questions correct.",
                  })}
                </p>
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  {gameContent.tryAgainButton || "Try Again"}
                </button>
                <p className="text-white/80 text-sm">
                  {gameContent.resultKeepTip || "Tip: Needs are things you must have to survive and learn, like food, clothes, and school supplies."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexNeedVsWant;
