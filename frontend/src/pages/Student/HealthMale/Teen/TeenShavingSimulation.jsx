import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TeenShavingSimulation = () => {
    const navigate = useNavigate();

    // Get game data from game category folder (source of truth)
    const gameId = "health-male-teen-38";

    // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
    const coinsPerLevel = 1;
    const totalCoins = 5;
    const totalXp = 10;

    const [coins, setCoins] = useState(0);
    const [currentScenario, setCurrentScenario] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

    const steps = [
        {
            id: 1,
            title: "Preparation",
            instruction: "Get ready to shave.",
            options: [
                 {
                    id: "a",
                    text: "Wash face with warm water",
                    emoji: "🚿",
                    isCorrect: true
                },
                {
                    id: "b",
                    text: "Start dry shaving",
                    emoji: "🌵",
                    isCorrect: false
                },
                {
                    id: "c",
                    text: "Put on cologne",
                    emoji: "🧴",
                    isCorrect: false
                },
                {
                    id: "d",
                    text: "Apply pre-shave oil",
                    emoji: "💧",
                    isCorrect: false
                }
            ]
        },
        {
            id: 2,
            title: "Lather Up",
            instruction: "Apply product.",
            options: [
               
                {
                    id: "b",
                    text: "Use nothing",
                    emoji: "🚫",
                    isCorrect: false
                },
                 {
                    id: "a",
                    text: "Apply shaving cream/gel",
                    emoji: "🧼",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Use toothpaste",
                    emoji: "🦷",
                    isCorrect: false
                },
                {
                    id: "d",
                    text: "Use quality shaving soap",
                    emoji: "🧼",
                    isCorrect: false
                }
            ]
        },
        {
            id: 3,
            title: "The Shave",
            instruction: "Start shaving.",
            options: [
               
                {
                    id: "b",
                    text: "Press very hard",
                    emoji: "💪",
                    isCorrect: false
                },
                {
                    id: "c",
                    text: "Shave against grain fast",
                    emoji: "⬆️",
                    isCorrect: false
                },
                {
                    id: "d",
                    text: "Use light, steady pressure",
                    emoji: "👐",
                    isCorrect: false
                },
                 {
                    id: "a",
                    text: "Gentle strokes with grain",
                    emoji: "⬇️",
                    isCorrect: true
                },
            ]
        },
        {
            id: 4,
            title: "Rinse",
            instruction: "Clean up.",
            options: [
               
                {
                    id: "b",
                    text: "Wipe with dirty towel",
                    emoji: "🧣",
                    isCorrect: false
                },
                {
                    id: "c",
                    text: "Leave cream on",
                    emoji: "👻",
                    isCorrect: false
                },
                 {
                    id: "a",
                    text: "Rinse with cool water",
                    emoji: "💧",
                    isCorrect: true
                },
                {
                    id: "d",
                    text: "Pat dry with clean towel",
                    emoji: "🧻",
                    isCorrect: false
                },
            ]
        },
        {
            id: 5,
            title: "Aftercare",
            instruction: "Finish up.",
            options: [
                
                {
                    id: "b",
                    text: "Scratch face",
                    emoji: "💅",
                    isCorrect: false
                },
                {
                    id: "a",
                    text: "Apply moisturizer/balm",
                    emoji: "🧴",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Go out in sun immediately",
                    emoji: "☀️",
                    isCorrect: false
                },
                {
                    id: "d",
                    text: "Use aftershave balm",
                    emoji: "🌿",
                    isCorrect: false
                }
            ]
        }
    ];

    const handleChoice = (optionId) => {
        const selectedOption = steps[currentScenario].options.find(opt => opt.id === optionId);
        const isCorrect = selectedOption.isCorrect;

        if (isCorrect) {
            setCoins(prev => prev + 1);
            showCorrectAnswerFeedback(1, true);
        }

        setTimeout(() => {
            if (currentScenario < steps.length - 1) {
                setCurrentScenario(prev => prev + 1);
            } else {
                setGameFinished(true);
            }
        }, 1500);
    };

    const handleNext = () => {
        navigate("/student/health-male/teens/reflex-shaving-teen");
    };

    return (
        <GameShell
            title="Shaving Simulation"
            subtitle={`Scenario ${currentScenario + 1} of ${steps.length}`}
            onNext={handleNext}
            nextEnabled={gameFinished}
            showGameOver={gameFinished}
            score={coins}
            gameId={gameId}
            gameType="health-male"
            flashPoints={flashPoints}
            showAnswerConfetti={showAnswerConfetti}
            maxScore={steps.length}
            coinsPerLevel={coinsPerLevel}
            totalCoins={totalCoins}
            totalXp={totalXp}
        >
            <div className="space-y-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-white/80">Scenario {currentScenario + 1}/{steps.length}</span>
                        <span className="text-yellow-400 font-bold">Coins: {coins}</span>
                    </div>

                    <h2 className="text-xl font-semibold text-white mb-4">
                        {steps[currentScenario].title}
                    </h2>
                    
                    <p className="text-white/90 mb-6">
                        {steps[currentScenario].instruction}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {steps[currentScenario].options.map(option => (
                            <button
                                key={option.id}
                                onClick={() => handleChoice(option.id)}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
                            >
                                <div className="flex items-center">
                                    <div className="text-2xl mr-4">{option.emoji}</div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </GameShell>
    );
};

export default TeenShavingSimulation;
