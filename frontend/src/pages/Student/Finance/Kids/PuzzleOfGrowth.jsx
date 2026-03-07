import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getFinanceKidsGames } from "../../../../pages/Games/GameCategories/Finance/kidGamesData";

const fallbackItems = [
  { id: 1, name: "Seed", emoji: "🌱" },
  { id: 2, name: "Savings", emoji: "💰" },
  { id: 3, name: "Plant", emoji: "🌿" },
  { id: 4, name: "Sapling", emoji: "🌳" },
  { id: 5, name: "Bulb", emoji: "🌻" },
];

const fallbackCategories = [
  { id: 6, name: "Tree", emoji: "🌲", description: "Seed can become a tree" },
  { id: 7, name: "Growth", emoji: "📈", description: "Savings can grow in value" },
  { id: 8, name: "Flower", emoji: "🌸", description: "Plant can bloom into flower" },
  { id: 9, name: "Forest", emoji: "🌲", description: "Many saplings can make a forest" },
  { id: 10, name: "Wealth", emoji: "🏦", description: "Money habits can build wealth" },
];

const PuzzleOfGrowth = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameContent = t("financial-literacy.kids.puzzle-of-growth", { returnObjects: true });

  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return { nextGamePath: location.state.nextGamePath, nextGameId: location.state.nextGameId || null };
    }
    try {
      const games = getFinanceKidsGames({});
      const currentGame = games.find((g) => g.id === "finance-kids-64");
      if (currentGame?.index !== undefined) {
        const nextGame = games.find((g) => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return { nextGamePath: nextGame ? nextGame.path : null, nextGameId: nextGame ? nextGame.id : null };
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
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const items = Array.isArray(gameContent?.items) && gameContent.items.length > 0 ? gameContent.items : fallbackItems;
  const outcomes = Array.isArray(gameContent?.categories) && gameContent.categories.length > 0 ? gameContent.categories : fallbackCategories;

  const rearrangedOutcomes = outcomes.length === 5 ? [outcomes[2], outcomes[4], outcomes[1], outcomes[0], outcomes[3]] : outcomes;

  const correctMatches = [
    { itemId: 1, outcomeId: 6 },
    { itemId: 2, outcomeId: 7 },
    { itemId: 3, outcomeId: 8 },
    { itemId: 4, outcomeId: 9 },
    { itemId: 5, outcomeId: 10 },
  ];

  const handleMatch = () => {
    if (!selectedItem || !selectedOutcome || gameFinished) return;

    resetFeedback();
    const isCorrect = correctMatches.some(
      (match) => match.itemId === selectedItem.id && match.outcomeId === selectedOutcome.id
    );

    const newMatches = [...matches, { itemId: selectedItem.id, outcomeId: selectedOutcome.id, isCorrect }];
    setMatches(newMatches);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (newMatches.length === items.length) {
      setTimeout(() => setGameFinished(true), 1000);
    }

    setSelectedItem(null);
    setSelectedOutcome(null);
  };

  const isItemMatched = (itemId) => matches.some((m) => m.itemId === itemId);
  const isOutcomeMatched = (outcomeId) => matches.some((m) => m.outcomeId === outcomeId);
  const getMatchResult = (itemId) => matches.find((m) => m.itemId === itemId)?.isCorrect ?? null;

  return (
    <GameShell
      title={gameContent?.title || "Puzzle of Growth"}
      subtitle={gameFinished
        ? (gameContent?.subtitleComplete || "Puzzle Complete!")
        : t("financial-literacy.kids.puzzle-of-growth.subtitleProgress", {
            matched: matches.length,
            total: items.length,
            defaultValue: "Match Items with Outcomes ({{matched}}/{{total}} matched)",
          })}
      showGameOver={gameFinished}
      score={score}
      gameId="finance-kids-64"
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
              <h3 className="text-xl font-bold text-white mb-4 text-center">{gameContent?.itemsTitle || "Items"}</h3>
              <div className="space-y-4">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
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
                    ? t("financial-literacy.kids.puzzle-of-growth.selectedLabel", {
                        name: selectedItem.name,
                        defaultValue: "Selected: {{name}}",
                      })
                    : (gameContent?.selectItem || "Select an Item")}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedItem || !selectedOutcome}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedItem && selectedOutcome
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {gameContent?.matchButton || "Match"}
                </button>
                <div className="mt-4 text-white/80">
                  <p>{gameContent?.scoreLabel || "Score:"} {score}/{items.length}</p>
                  <p>{gameContent?.matchedLabel || "Matched:"} {matches.length}/{items.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">{gameContent?.categoriesTitle || "Outcomes"}</h3>
              <div className="space-y-4">
                {rearrangedOutcomes.map((outcome) => (
                  <button
                    key={outcome.id}
                    onClick={() => setSelectedOutcome(outcome)}
                    disabled={isOutcomeMatched(outcome.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isOutcomeMatched(outcome.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedOutcome?.id === outcome.id
                          ? "bg-purple-500/50 border-2 border-purple-400"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{outcome.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{outcome.name}</h4>
                        <p className="text-white/80 text-sm">{outcome.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">{gameContent?.resultGreatEmoji || "🎉"}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{gameContent?.resultGreatTitle || "Great Job!"}</h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.kids.puzzle-of-growth.resultGreatDescription", {
                    score,
                    total: items.length,
                    defaultValue: "You correctly matched {{score}} out of {{total}} items.",
                  })}
                </p>
                <p className="text-white/80">{gameContent?.resultLesson || "Lesson"}</p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">{gameContent?.resultKeepEmoji || "💪"}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{gameContent?.resultKeepTitle || "Keep Practicing!"}</h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.kids.puzzle-of-growth.resultKeepDescription", {
                    score,
                    total: items.length,
                    defaultValue: "You matched {{score}} out of {{total}} items.",
                  })}
                </p>
                <p className="text-white/80 text-sm">{gameContent?.resultTip || "Tip"}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOfGrowth;
