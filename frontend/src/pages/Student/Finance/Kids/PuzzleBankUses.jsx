import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getFinanceKidsGames } from "../../../../pages/Games/GameCategories/Finance/kidGamesData";

const PuzzleBankUses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("gamecontent");

  const gameContent = t("financial-literacy.kids.puzzle-bank-uses", { returnObjects: true });

  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null,
      };
    }

    try {
      const games = getFinanceKidsGames({});
      const currentGame = games.find((g) => g.id === "finance-kids-44");
      if (currentGame?.index !== undefined) {
        const nextGame = games.find((g) => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null,
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }

    return { nextGamePath: null, nextGameId: null };
  }, [location.state]);

  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedUse, setSelectedUse] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const items = Array.isArray(gameContent?.items) ? gameContent.items : [];
  const uses = Array.isArray(gameContent?.categories) ? gameContent.categories : [];

  const rearrangedUses = uses.length === 5 ? [uses[2], uses[4], uses[1], uses[0], uses[3]] : uses;

  const correctMatches = [
    { itemId: 1, useId: 6 },
    { itemId: 2, useId: 7 },
    { itemId: 3, useId: 8 },
    { itemId: 4, useId: 9 },
    { itemId: 5, useId: 10 },
  ];

  const handleMatch = () => {
    if (!selectedItem || !selectedUse || gameFinished) return;

    resetFeedback();
    const isCorrect = correctMatches.some(
      (match) => match.itemId === selectedItem.id && match.useId === selectedUse.id
    );
    const newMatches = [...matches, { itemId: selectedItem.id, useId: selectedUse.id, isCorrect }];
    setMatches(newMatches);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    if (newMatches.length === items.length) {
      setTimeout(() => setGameFinished(true), 1000);
    }

    setSelectedItem(null);
    setSelectedUse(null);
  };

  const isItemMatched = (itemId) => matches.some((match) => match.itemId === itemId);
  const isUseMatched = (useId) => matches.some((match) => match.useId === useId);
  const getMatchResult = (itemId) => matches.find((m) => m.itemId === itemId)?.isCorrect ?? null;

  return (
    <GameShell
      title={gameContent?.title || "Puzzle: Bank Uses"}
      subtitle={
        gameFinished
          ? gameContent?.subtitleComplete || "Puzzle Complete!"
          : t("financial-literacy.kids.puzzle-bank-uses.subtitleProgress", {
              matched: matches.length,
              total: items.length,
              defaultValue: "Match Items ({{matched}}/{{total}} matched)",
            })
      }
      showGameOver={gameFinished}
      score={score}
      gameId="finance-kids-44"
      gameType="finance"
      totalLevels={items.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === items.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/financial-literacy/kids"
      maxScore={items.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                {gameContent?.itemsTitle || "Items"}
              </h3>
              <div className="space-y-4">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => !gameFinished && setSelectedItem(item)}
                    disabled={isItemMatched(item.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isItemMatched(item.id)
                        ? getMatchResult(item.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedItem?.id === item.id
                          ? "bg-blue-500/50 border-2 border-blue-400"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{item.emoji}</div>
                      <h4 className="font-bold text-white">{item.name}</h4>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                <p className="text-white/80 mb-4">
                  {selectedItem
                    ? `${gameContent?.selectItem || "Selected"}: ${selectedItem.name}`
                    : gameContent?.selectItem || "Select an Item"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedItem || !selectedUse}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedItem && selectedUse
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {gameContent?.matchButton || "Match"}
                </button>
                <div className="mt-4 text-white/80">
                  <p>
                    {gameContent?.scoreLabel || "Score:"} {score}/{items.length}
                  </p>
                  <p>
                    {gameContent?.matchedLabel || "Matched:"} {matches.length}/{items.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                {gameContent?.categoriesTitle || "Categories"}
              </h3>
              <div className="space-y-4">
                {rearrangedUses.map((use) => (
                  <button
                    key={use.id}
                    onClick={() => !gameFinished && setSelectedUse(use)}
                    disabled={isUseMatched(use.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isUseMatched(use.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedUse?.id === use.id
                          ? "bg-purple-500/50 border-2 border-purple-400"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{use.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{use.name}</h4>
                        {use.description ? <p className="text-white/80 text-sm">{use.description}</p> : null}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              {score >= 3 ? "Great Job!" : "Keep Practicing!"}
            </h3>
            <p className="text-white/90 text-lg">
              {score >= 3
                ? `You correctly matched ${score} out of ${items.length}.`
                : `You matched ${score} out of ${items.length} correctly.`}
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleBankUses;
