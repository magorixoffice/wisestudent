import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You use UPI regularly. What is a safe habit?",
    options: [
      {
        id: "share",
        label: "Sharing OTPs",
        reflection: "Sharing OTPs gives others access to your money and enables fraud. OTPs should always be kept private.",
        isCorrect: false,
      },
      
      {
        id: "store",
        label: "Storing OTPs in phone notes",
        reflection: "Storing OTPs digitally makes them accessible to hackers. OTPs are temporary and should be used immediately.",
        isCorrect: false,
      },
      {
        id: "forward",
        label: "Forwarding OTPs to family members",
        reflection: "Even sharing OTPs with family members is unsafe as it gives them access to your money.",
        isCorrect: false,
      },
      {
        id: "private",
        label: "Keeping OTPs private",
        reflection: "Exactly! OTPs are meant to be private and protect your money. Never share them with anyone.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What should you do if someone calls claiming to be from your bank asking for your OTP?",
    options: [
      {
        id: "provide",
        label: "Provide the OTP as requested",
        reflection: "Banks will never ask for your OTP. Providing it to strangers enables fraud and financial loss.",
        isCorrect: false,
      },
      {
        id: "refuse",
        label: "Refuse and hang up immediately",
        reflection: "Exactly! Legitimate banks never ask for your OTP. Always refuse and hang up if someone requests it.",
        isCorrect: true,
      },
      {
        id: "verify",
        label: "Ask for their employee ID to verify",
        reflection: "Scammers can fabricate credentials. Banks never ask for OTPs, so don't engage in verification.",
        isCorrect: false,
      },
      {
        id: "listen",
        label: "Listen to their explanation first",
        reflection: "Scammers may provide convincing stories. Banks never ask for OTPs, so don't engage.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "When is it appropriate to share your UPI PIN?",
    options: [
      {
        id: "customer",
        label: "When a customer care representative requests it",
        reflection: "Legitimate customer care will never ask for your UPI PIN. It should always remain private.",
        isCorrect: false,
      },
      
      {
        id: "trusted",
        label: "With trusted friends or family",
        reflection: "UPI PIN should never be shared with anyone, even trusted contacts, to maintain security.",
        isCorrect: false,
      },
      {
        id: "never",
        label: "Never share it with anyone",
        reflection: "Exactly! Your UPI PIN should remain confidential at all times to protect your money.",
        isCorrect: true,
      },
      {
        id: "setup",
        label: "During initial app setup only",
        reflection: "UPI PINs are stored securely on your device and should never be shared with anyone.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What is the safest way to use digital payment apps?",
    options: [
      {
        id: "public",
        label: "Use them on public Wi-Fi networks",
        reflection: "Public Wi-Fi is insecure and can expose your transactions to hackers. Use secure connections.",
        isCorrect: false,
      },
      {
        id: "secure",
        label: "Use them on secure, private networks",
        reflection: "Exactly! Using digital payment apps on secure, private networks minimizes the risk of interception.",
        isCorrect: true,
      },
      {
        id: "shared",
        label: "On shared devices with multiple users",
        reflection: "Shared devices increase risk of unauthorized access to your payment information.",
        isCorrect: false,
      },
      {
        id: "browser",
        label: "Through browsers instead of apps",
        reflection: "Official apps are typically more secure than browser-based transactions.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What should you do if you suspect fraudulent activity on your account?",
    options: [
        {
        id: "report",
        label: "Contact your bank immediately to report it",
        reflection: "Exactly! Reporting suspected fraud immediately helps minimize losses and secure your account.",
        isCorrect: true,
      },
      {
        id: "ignore",
        label: "Ignore it, hoping it resolves itself",
        reflection: "Ignoring suspected fraud allows further unauthorized transactions and losses to occur.",
        isCorrect: false,
      },
      
      {
        id: "wait",
        label: "Wait for the next statement to confirm",
        reflection: "Waiting allows more fraudulent transactions to occur. Immediate reporting is essential.",
        isCorrect: false,
      },
      {
        id: "check",
        label: "Check other accounts before taking action",
        reflection: "Delaying action allows more fraud to occur. Report immediately when suspicious activity is detected.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const DigitalPaymentsSafety = () => {
  const location = useLocation();
  const gameId = "finance-adults-14";
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
      "Why is it important to keep OTPs and PINs private?",
      "What steps should you take to protect your digital payments?",
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
      title="Digital Payments Safety"
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
            <span>Digital Payments</span>
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
                      <strong>Congratulations!</strong> OTPs protect your money. Sharing them enables fraud.
                    </>
                  ) : (
                    <>Skill unlocked: <strong>Digital payment safety awareness</strong></>
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

export default DigitalPaymentsSafety;