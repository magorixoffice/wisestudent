import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You install a banking app. What should you check first?",
    options: [
        {
        id: "permissions",
        label: "App permissions and official source",
        reflection: "Exactly! Verifying the app is from an official source and checking its permissions helps protect your data.",
        isCorrect: true,
      },
      {
        id: "nothing",
        label: "Nothing",
        reflection: "Installing a banking app without verification could expose your financial data to security risks.",
        isCorrect: false,
      },
      
      {
        id: "rating",
        label: "Just the app store rating",
        reflection: "While ratings are helpful, they don't guarantee security. Checking official sources is more important.",
        isCorrect: false,
      },
      {
        id: "size",
        label: "Download size of the app",
        reflection: "App size doesn't indicate security. Verifying the official source and permissions is more important.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What is the safest way to download a banking app?",
    options: [
      {
        id: "thirdparty",
        label: "From third-party app stores or websites",
        reflection: "Third-party sources may host malicious versions of banking apps that steal your data.",
        isCorrect: false,
      },
      
      {
        id: "link",
        label: "From links in emails or messages",
        reflection: "Links in emails or messages may lead to fake apps designed to steal your banking credentials.",
        isCorrect: false,
      },
      {
        id: "search",
        label: "From general search engines",
        reflection: "Search engines may direct you to fake apps. Always use official app stores or bank websites.",
        isCorrect: false,
      },
      {
        id: "official",
        label: "From the official app store or bank's website",
        reflection: "Exactly! Official sources provide authentic apps with security measures in place.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "When using a banking app, which practice is safest?",
    options: [
      {
        id: "public",
        label: "Using it on public Wi-Fi networks",
        reflection: "Public Wi-Fi is insecure and could allow hackers to intercept your banking data.",
        isCorrect: false,
      },
      
      {
        id: "anywhere",
        label: "Using it anywhere with any internet connection",
        reflection: "Not all connections are secure. Using banking apps on private, secured networks is safer.",
        isCorrect: false,
      },
      {
        id: "private",
        label: "Using it on your private, secured network",
        reflection: "Exactly! Private, secured networks provide better protection for your banking transactions.",
        isCorrect: true,
      },
      {
        id: "shared",
        label: "On shared or borrowed devices",
        reflection: "Shared devices may have malware or store your login information insecurely.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What should you do to protect your banking app account?",
    options: [
      {
        id: "simple",
        label: "Use a simple password that's easy to remember",
        reflection: "Simple passwords are easier to crack. Strong, unique passwords provide better security.",
        isCorrect: false,
      },
      {
        id: "strong",
        label: "Use strong passwords and two-factor authentication",
        reflection: "Exactly! Strong passwords and 2FA significantly enhance the security of your banking account.",
        isCorrect: true,
      },
      {
        id: "reuse",
        label: "Reuse the same password across multiple apps",
        reflection: "Password reuse increases risk. If one account is compromised, others become vulnerable.",
        isCorrect: false,
      },
      {
        id: "write",
        label: "Write down your password in a notebook",
        reflection: "Writing passwords down creates physical security risks. Digital password managers are safer.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "How often should you log out of your banking app?",
    options: [
        {
        id: "regularly",
        label: "Regularly, especially when using shared devices",
        reflection: "Exactly! Regular logout helps protect your account from unauthorized access.",
        isCorrect: true,
      },
      {
        id: "never",
        label: "Never log out, just put the app in background",
        reflection: "Leaving banking apps logged in increases the risk if your device is accessed by others.",
        isCorrect: false,
      },
      
      {
        id: "sometimes",
        label: "Only when you remember to",
        reflection: "Making logout routine rather than occasional provides more consistent security.",
        isCorrect: false,
      },
      {
        id: "rarely",
        label: "Rarely, since the app has automatic security",
        reflection: "While apps have security features, manual logout adds an extra layer of protection.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const SafeUseOfBankingApps = () => {
  const location = useLocation();
  const gameId = "finance-adults-17";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const [stageIndex, setStageIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [coins, setCoins] = useState(0);
  const [history, setHistory] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [canProceed, setCanProceed] = useState(false);

  const reflectionPrompts = useMemo(
    () => [
      "How can you verify that a banking app is legitimate?",
      "What additional security measures should you implement?",
    ],
    []
  );

  const handleSelect = (option) => {
    if (selectedOption || showResult) return;
    resetFeedback();
    const updatedHistory = [
      ...history,
      { stageId: STAGES[stageIndex].id, isCorrect: option.isCorrect },
    ];
    setHistory(updatedHistory);
    setSelectedOption(option.id);
    setSelectedReflection(option.reflection); // Set the reflection for the selected option
    setShowFeedback(true); // Show feedback after selection
    setCanProceed(false); // Disable proceeding initially
    
    // Update coins if the answer is correct
    if (option.isCorrect) {
      setCoins(prevCoins => prevCoins + 1);
    }
    
    // Wait for the reflection period before allowing to proceed
    setTimeout(() => {
      setCanProceed(true); // Enable proceeding after showing reflection
    }, 1500); // Wait 1.5 seconds before allowing to proceed
    
    // Handle the final stage separately
    if (stageIndex === totalStages - 1) {
      setTimeout(() => {
        const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
        const passed = correctCount === successThreshold;
        setFinalScore(correctCount);
        setCoins(passed ? totalCoins : 0); // Set final coins based on performance
        setShowResult(true);
      }, 2500); // Wait longer before showing final results
    }
    
    const points = option.isCorrect ? 1 : 0;
    showCorrectAnswerFeedback(points, option.isCorrect);
  };

  const handleRetry = () => {
    resetFeedback();
    setStageIndex(0);
    setSelectedOption(null);
    setCoins(0);
    setHistory([]);
    setFinalScore(0);
    setShowResult(false);
  };

  const subtitle = `Stage ${Math.min(stageIndex + 1, totalStages)} of ${totalStages}`;
  const stage = STAGES[Math.min(stageIndex, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Safe Use of Banking Apps"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={totalStages}
      currentLevel={Math.min(stageIndex + 1, totalStages)}
      totalLevels={totalStages}
      gameId={gameId}
      gameType="finance"
      showGameOver={showResult}
      showConfetti={showResult && hasPassed}
      shouldSubmitGameCompletion={hasPassed}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-5 text-white">
        <div className="bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4 text-sm uppercase tracking-[0.3em] text-white/60">
            <span>Scenario</span>
            <span>App Security</span>
          </div>
          <p className="text-lg text-white/90 mb-6">{stage.prompt}</p>
          <div className="grid grid-cols-2 gap-4">
            {stage.options.map((option) => {
              const isSelected = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  disabled={!!selectedOption}
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    isSelected
                      ? option.isCorrect
                        ? "border-emerald-400 bg-emerald-500/20"
                        : "border-red-400 bg-red-500/10 text-white"
                        : "border-white/30 bg-white/5 hover:border-white/60 hover:bg-white/10"
                  }`}
                >
                  <div className="text-sm text-white/70 mb-2">
                    Choice {option.id.toUpperCase()}
                  </div>
                  <p className="text-white font-semibold">{option.label}</p>
                  
                </button>
              );
            })}
          </div>
          <div className="mt-6 text-right text-sm text-white/70">
            Coins collected: <strong>{coins}</strong>
          </div>
        </div>
        {(showResult || showFeedback) && (
          <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
            <h4 className="text-lg font-semibold text-white">Reflection</h4>
            {selectedReflection && (
              <div className="max-h-24 overflow-y-auto pr-2">
                <p className="text-sm text-white/90">{selectedReflection}</p>
              </div>
            )}
            {showFeedback && !showResult && (
              <div className="mt-4 flex justify-center">
                {canProceed ? (
                  <button
                    onClick={() => {
                      if (stageIndex < totalStages - 1) {
                        setStageIndex((prev) => prev + 1);
                        setSelectedOption(null);
                        setSelectedReflection(null);
                        setShowFeedback(false);
                        setCanProceed(false);
                      }
                    }}
                    className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-6 font-semibold shadow-lg hover:opacity-90"
                  >
                    Continue
                  </button>
                ) : (
                  <div className="py-2 px-6 text-white font-semibold">Reading...</div>
                )}
              </div>
            )}
            {/* Automatically advance if we're in the last stage and the timeout has passed */}
            {!showResult && stageIndex === totalStages - 1 && canProceed && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => {
                    const updatedHistory = [
                      ...history,
                      { stageId: STAGES[stageIndex].id, isCorrect: STAGES[stageIndex].options.find(opt => opt.id === selectedOption)?.isCorrect },
                    ];
                    const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
                    const passed = correctCount === successThreshold;
                    setFinalScore(correctCount);
                    setCoins(passed ? totalCoins : 0);
                    setShowResult(true);
                  }}
                  className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-6 font-semibold shadow-lg hover:opacity-90"
                >
                  Finish
                </button>
              </div>
            )}
            {showResult && (
              <>
                <ul className="text-sm list-disc list-inside space-y-1">
                  {reflectionPrompts.map((prompt) => (
                    <li key={prompt}>{prompt}</li>
                  ))}
                </ul>
                <p className="text-sm text-white/70">
                  {hasPassed ? (
                    <>
                      <strong>Congratulations!</strong> Official apps reduce risk of data theft.
                    </>
                  ) : (
                    <>Skill unlocked: <strong>Banking app security awareness</strong></>
                  )}
                </p>
                {!hasPassed && (
                  <p className="text-xs text-amber-300">
                    Answer every stage sharply to earn the full reward.
                  </p>
                )}
                {!hasPassed && (
                  <button
                    onClick={handleRetry}
                    className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
                  >
                    Try Again
                  </button>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </GameShell>
  );
};

export default SafeUseOfBankingApps;