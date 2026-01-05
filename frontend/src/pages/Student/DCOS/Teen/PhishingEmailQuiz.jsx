import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const PhishingEmailQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-42");
  const gameId = gameData?.id || "dcos-teen-42";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for PhishingEmailQuiz, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Extract nextGamePath and nextGameId from location state
  const { nextGamePath, nextGameId } = useMemo(() => {
    return {
      nextGamePath: location.state?.nextGamePath || null,
      nextGameId: location.state?.nextGameId || null
    };
  }, [location.state]);
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
  {
    id: 1,
    text: "You receive an email from your school asking you to download an attached timetable file. The sender address looks unusual. What is the safest action?",
    options: [
      {
        id: "a",
        text: "Download the file to check if it is real",
        emoji: "📄",
        isCorrect: false
      },
      
      {
        id: "c",
        text: "Reply to the email asking for confirmation",
        emoji: "✉️",
        isCorrect: false
      },
      {
        id: "b",
        text: "Confirm with the school through their official website or office",
        emoji: "🔒",
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    text: "An email from a gaming platform says your account will be suspended unless you act within 30 minutes. What does this message most likely indicate?",
    options: [
      {
        id: "a",
        text: "A real emergency that needs instant action",
        emoji: "⏱️",
        isCorrect: false
      },
      {
        id: "b",
        text: "A tactic to pressure users into making quick mistakes",
        emoji: "🧠",
        isCorrect: true
      },
      {
        id: "c",
        text: "A normal system reminder sent to all users",
        emoji: "📢",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "You notice an email link that looks official but redirects to a shortened URL. Why can this be risky?",
    options: [
      {
        id: "a",
        text: "Short links can hide the real destination website",
        emoji: "🔗",
        isCorrect: true
      },
      {
        id: "b",
        text: "Short links always load slower",
        emoji: "🐢",
        isCorrect: false
      },
      {
        id: "c",
        text: "Short links are used only for advertisements",
        emoji: "📣",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "An email uses your full name and recent activity details to look convincing. What phishing method is most likely being used?",
    options: [
      {
        id: "a",
        text: "Random mass emailing",
        emoji: "📬",
        isCorrect: false
      },
      
      {
        id: "c",
        text: "System-generated notification",
        emoji: "⚙️",
        isCorrect: false
      },
      {
        id: "b",
        text: "Targeted phishing using personal information",
        emoji: "🎯",
        isCorrect: true
      },
    ]
  },
  {
    id: 5,
    text: "An email claims to be from a trusted service but has spelling mistakes and poor grammar. What should this signal to you?",
    options: [
      {
        id: "b",
        text: "The email may not be from a professional or official source",
        emoji: "🔍",
        isCorrect: true
      },
      {
        id: "a",
        text: "The service is updating its communication style",
        emoji: "📝",
        isCorrect: false
      },
      
      {
        id: "c",
        text: "The message is informal but still trustworthy",
        emoji: "💬",
        isCorrect: false
      }
    ]
  }
];


  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };







  return (
    <GameShell
      title="Phishing Email Quiz"
      score={score}
      maxScore={questions.length}
      subtitle={showResult ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && score === questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-base md:text-lg lg:text-xl mb-6 md:mb-8 text-center">
                {questions[currentQuestion].text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all transform hover:scale-105 flex flex-col items-center justify-center text-center h-full"
                    disabled={answered}
                  >
                    <span className="text-2xl md:text-3xl mb-2">{option.emoji}</span>
                    <h3 className="font-bold text-base md:text-lg mb-1">{option.text}</h3>
                    <p className="text-white/90 text-xs md:text-sm">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center flex-1 flex flex-col justify-center">
            <div>
              <div className="text-4xl md:text-5xl mb-4">🎉</div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Quiz Completed!</h3>
              <p className="text-white/90 text-base md:text-lg mb-2">
                You scored <span className="font-bold text-yellow-400">{score}</span> out of <span className="font-bold">{questions.length}</span>
              </p>
              <div className="mt-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-full inline-block font-bold">
                  <span>+{score * 10} Points</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PhishingEmailQuiz;
