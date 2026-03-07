import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const JournalOfNeeds = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-37";
  const gameContent = t("financial-literacy.kids.journal-of-needs", { returnObjects: true });
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [text, setText] = useState("");
  const [showResult, setShowResult] = useState(false);

  const stages = gameContent.stages || [
    {
      question: 'Write: "One need I always spend on is ___."',
      minLength: 10,
    },
    {
      question: 'Write: "Spending on needs makes me feel ___."',
      minLength: 10,
    },
    {
      question: 'Write: "A need I prioritized over a want was ___."',
      minLength: 10,
    },
    {
      question: 'Write: "I learned ___ about choosing needs over wants."',
      minLength: 10,
    },
    {
      question: 'Write: "Focusing on needs taught me ___ about money."',
      minLength: 10,
    },
  ];

  const handleSubmit = () => {
    if (showResult) return; // Prevent multiple submissions
    
    resetFeedback();
    const entryText = text.trim();
    
    if (entryText.length >= stages[currentStage].minLength) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
      
      const isLastQuestion = currentStage === stages.length - 1;
      
      // Show feedback for 1.5 seconds, then move to next question or show results
      setTimeout(() => {
        if (isLastQuestion) {
          // This is the last question (5th), show results
          setShowResult(true);
        } else {
          // Move to next question
          setText("");
          setCurrentStage((prev) => prev + 1);
        }
      }, 1500);
    }
  };

  const finalScore = score;

  return (
    <GameShell
      title={gameContent.title || "Journal of Needs"}
      subtitle={!showResult ? t("financial-literacy.kids.journal-of-needs.subtitleProgress", { current: currentStage + 1, total: stages.length, defaultValue: "Question {{current}} of {{total}}: Reflect on prioritizing your needs!" }) : (gameContent.subtitleComplete || "Journal Complete!")}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}
      nextGamePathProp="/student/finance/kids/gift-money-story"
      nextGameIdProp="finance-kids-38">
      <div className="text-center text-white space-y-8">
        {!showResult && stages[currentStage] && (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <p className="text-white/70 mb-4">{t("financial-literacy.kids.journal-of-needs.scoreLabel", { score, total: stages.length, defaultValue: "Score: {{score}}/{{total}}" })}</p>
            <p className="text-white/60 text-sm mb-4">
              {t("financial-literacy.kids.journal-of-needs.minLengthLabel", { minLength: stages[currentStage].minLength, defaultValue: "Write at least {{minLength}} characters" })}
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={gameContent.placeholder || "Write your journal entry here..."}
              className="w-full max-w-xl p-4 rounded-xl text-black text-lg bg-white/90"
              disabled={showResult}
            />
            <div className="mt-2 text-white/50 text-sm">
              {t("financial-literacy.kids.journal-of-needs.charCounter", { current: text.trim().length, minLength: stages[currentStage].minLength, defaultValue: "{{current}}/{{minLength}} characters" })}
            </div>
            <button
              onClick={handleSubmit}
              className={`mt-4 px-8 py-4 rounded-full text-lg font-semibold transition-transform ${
                text.trim().length >= stages[currentStage].minLength && !showResult
                  ? 'bg-green-500 hover:bg-green-600 hover:scale-105 text-white cursor-pointer'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50'
              }`}
              disabled={text.trim().length < stages[currentStage].minLength || showResult}
            >
              {currentStage === stages.length - 1 ? (gameContent.submitFinalButton || 'Submit Final Entry') : (gameContent.submitButton || 'Submit & Continue')}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfNeeds;
