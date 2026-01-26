import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { AlertCircle, CheckCircle, Wind, Flame, ArrowRight } from "lucide-react";

const ChallengeChoiceSimulation = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-55";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showCalmImpact, setShowCalmImpact] = useState(false);
  const [calmLevel, setCalmLevel] = useState(60); // Starting calm level
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Challenges with 3 response options
  const challenges = [
    {
      id: 1,
      title: "Spilled Milk",
      situation: "Your child accidentally spills a full glass of milk all over the kitchen floor. It's spreading everywhere, and you just cleaned the kitchen.",
      responses: [
        
        {
          id: 'neutral',
          label: 'Neutral Response',
          text: "Sigh and say: 'Okay, let's clean this up. Be more careful next time.'",
          calmImpact: -5,
          explanation: "This response doesn't escalate, but the sigh and subtle criticism create mild stress. Your calm level slightly decreases.",
          emoji: "😐",
          color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'calm',
          label: 'Calm Response',
          text: "Take a deep breath and say: 'It's okay, accidents happen. Let's clean it up together.'",
          calmImpact: +15,
          explanation: "This response maintains your calm and teaches your child that mistakes are okay. Your calm level increases because you avoided stress escalation.",
          emoji: "😌",
           color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'reactive',
          label: 'Reactive Response',
          text: "Shout: 'Why can't you be more careful? I just cleaned this!'",
          calmImpact: -25,
          explanation: "This reactive response creates stress for both you and your child. Your calm level decreases significantly, and the situation escalates.",
          emoji: "😠",
           color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        }
      ],
      correctChoice: 'calm'
    },
    {
      id: 2,
      title: "Rude Reply",
      situation: "Your teenager responds rudely when you ask them to help with dinner: 'Why do I always have to do everything? Can't you just do it yourself?'",
      responses: [
       
        {
          id: 'neutral',
          label: 'Neutral Response',
          text: "Say: 'Fine, forget it. I'll do it myself.' and walk away.",
          calmImpact: -8,
          explanation: "This response avoids conflict but creates distance. Your calm level decreases because resentment builds when needs aren't addressed.",
          emoji: "😑",
           color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'reactive',
          label: 'Reactive Response',
          text: "Snap back: 'That's disrespectful! You will help, and that's final. No phone until you apologize!'",
          calmImpact: -30,
          explanation: "This reactive response escalates conflict. Your calm level drops significantly, and the power struggle creates stress for everyone.",
          emoji: "⚔️",
           color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
         {
          id: 'calm',
          label: 'Calm Response',
          text: "Pause, then say: 'I hear you're frustrated. Let's talk about what's really bothering you. I'd appreciate your help, but I want to understand what's going on.'",
          calmImpact: +12,
          explanation: "This response addresses the underlying issue and maintains your calm. You're modeling emotional regulation and open communication.",
          emoji: "🤝",
           color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
      ],
      correctChoice: 'calm'
    },
    {
      id: 3,
      title: "Work Call",
      situation: "You're in the middle of helping your child with homework when your phone rings. It's an important work call. Your child is frustrated and says: 'You're always on your phone!'",
      responses: [
        {
          id: 'calm',
          label: 'Calm Response',
          text: "Take the call briefly, then say: 'I need to take this call, but I'll be back in 5 minutes to finish helping you. Let's pause right here.'",
          calmImpact: +10,
          explanation: "This response balances your needs with your child's. You set boundaries and keep your commitment. Your calm level increases because you handled it thoughtfully.",
          emoji: "⚖️",
           color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'neutral',
          label: 'Neutral Response',
          text: "Say: 'I have to take this. Just wait a minute.' Take the call without addressing their concern.",
          calmImpact: -10,
          explanation: "This response dismisses your child's feeling. Your calm level decreases because ignoring their concern creates guilt and tension.",
          emoji: "📞",
          color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'reactive',
          label: 'Reactive Response',
          text: "Snap: 'Stop whining! I'm working to pay for everything! Just wait!'",
          calmImpact: -20,
          explanation: "This reactive response creates guilt and defensiveness. Your calm level decreases significantly because you're reacting from stress and frustration.",
          emoji: "😤",
           color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        }
      ],
      correctChoice: 'calm'
    },
    {
      id: 4,
      title: "Tantrum in Public",
      situation: "Your child has a full meltdown in the grocery store because you won't buy them a toy. People are staring, and you feel embarrassed and overwhelmed.",
      responses: [
        
        {
          id: 'neutral',
          label: 'Neutral Response',
          text: "Ignore the tantrum and continue shopping, hoping they'll stop on their own.",
          calmImpact: -12,
          explanation: "This response avoids addressing the situation but creates internal stress. Your calm level decreases because ignoring increases anxiety about judgment.",
          emoji: "😶",
          color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'reactive',
          label: 'Reactive Response',
          text: "Yell: 'Stop this right now! You're embarrassing me! We're leaving!' and drag them out.",
          calmImpact: -35,
          explanation: "This reactive response comes from embarrassment and shame. Your calm level drops significantly, and the situation becomes more stressful for everyone.",
          emoji: "😡",
           color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'calm',
          label: 'Calm Response',
          text: "Kneel down to their level, speak softly: 'I know you're upset. We can't get that today, but I'm here with you. Let's finish shopping and go home.'",
          calmImpact: +18,
          explanation: "This response maintains your composure and connects with your child. Your calm level increases because you handled a difficult situation with grace.",
          emoji: "🧘",
           color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
      ],
      correctChoice: 'calm'
    },
    {
      id: 5,
      title: "Sibling Fight",
      situation: "Your two children are fighting loudly over a game. They're shouting, and one is crying. You're trying to finish cooking dinner, and the noise is overwhelming.",
      responses: [
        {
          id: 'calm',
          label: 'Calm Response',
          text: "Take a breath, turn down the stove, and calmly say: 'I see you're both upset. Let's take a break. We'll solve this together in a moment.'",
          calmImpact: +14,
          explanation: "This response prioritizes connection over control. Your calm level increases because you're choosing thoughtful action over reactive escalation.",
          emoji: "💙",
           color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'neutral',
          label: 'Neutral Response',
          text: "Yell from the kitchen: 'Stop fighting! I'm busy cooking! Just figure it out!'",
          calmImpact: -15,
          explanation: "This response doesn't actually address the problem. Your calm level decreases because the conflict continues, creating ongoing stress.",
          emoji: "😟",
          color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'reactive',
          label: 'Reactive Response',
          text: "Storm in and shout: 'Both of you, go to your rooms RIGHT NOW! No dinner until you apologize!'",
          calmImpact: -28,
          explanation: "This reactive response escalates the conflict. Your calm level drops significantly, and the punishment creates more tension rather than resolution.",
          emoji: "💥",
           color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        }
      ],
      correctChoice: 'calm'
    }
  ];

  const handleResponseSelect = (response) => {
    if (selectedChoice) return; // Already selected

    setSelectedChoice(response);
    
    // Update calm level (clamp between 0 and 100)
    const newCalmLevel = Math.max(0, Math.min(100, calmLevel + response.calmImpact));
    setCalmLevel(newCalmLevel);
    
    // Award score for calm responses
    if (response.id === 'calm') {
      setScore(prev => prev + 1);
    }
    
    // Show impact after a brief delay
    setTimeout(() => {
      setShowCalmImpact(true);
    }, 500);
  };

  const handleNext = () => {
    setSelectedChoice(null);
    setShowCalmImpact(false);
    
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  // Calm Level Meter Component
  const CalmLevelMeter = ({ level }) => {
    const getCalmColor = () => {
      if (level >= 70) return 'from-green-500 to-emerald-600';
      if (level >= 50) return 'from-yellow-500 to-orange-500';
      if (level >= 30) return 'from-orange-500 to-red-500';
      return 'from-red-600 to-rose-700';
    };

    const getCalmLabel = () => {
      if (level >= 70) return { text: 'Very Calm', emoji: '😌' };
      if (level >= 50) return { text: 'Moderately Calm', emoji: '😐' };
      if (level >= 30) return { text: 'Stressed', emoji: '😰' };
      return { text: 'Very Stressed', emoji: '😫' };
    };

    const label = getCalmLabel();

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-semibold text-gray-800">Your Calm Level</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{label.emoji}</span>
            <span className="text-lg font-bold text-gray-700">{level}%</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: `${calmLevel}%` }}
            animate={{ width: `${level}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${getCalmColor()} rounded-full`}
          />
        </div>
        <div className="text-center mt-2">
          <span className="text-sm font-medium text-gray-600">{label.text}</span>
        </div>
      </div>
    );
  };

  const currentChallengeData = challenges[currentChallenge];

  if (showGameOver) {
    const finalCalmLabel = calmLevel >= 70 ? 'Very Calm' : calmLevel >= 50 ? 'Moderately Calm' : calmLevel >= 30 ? 'Stressed' : 'Very Stressed';
    
    return (
      <ParentGameShell
        title={gameData?.title || "Challenge–Choice Simulation"}
        subtitle="Practice Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={score >= 4}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Simulation Complete!</h2>
              <p className="text-lg text-gray-600 mb-6">
                You've practiced choosing healthier reactions under stress. You chose calm responses in <strong className="text-green-600">{score} out of {totalLevels}</strong> challenges.
              </p>
            </div>

            {/* Final Calm Level */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Final Calm Level</h3>
              <CalmLevelMeter level={calmLevel} />
              <p className="text-center mt-4 text-gray-700">
                {calmLevel >= 60 
                  ? "You maintained a good calm level throughout! Choosing calm responses helps you stay regulated even under stress."
                  : calmLevel >= 40
                  ? "Your calm level was moderate. Continue practicing calm responses to build your stress resilience."
                  : "Your calm level decreased. Remember: awareness grows every time you stop, think, and choose differently. Keep practicing!"}
              </p>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Awareness grows every time you stop, think, and choose differently. Each moment you pause and choose a calm response, you're building a new pattern. Even when you don't get it right, the practice of awareness itself is growth. Your children learn emotional regulation by watching you regulate your own responses.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Challenge–Choice Simulation"}
      subtitle={`Challenge ${currentChallenge + 1} of ${totalLevels}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentChallenge + 1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={currentChallenge}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Challenge {currentChallenge + 1} of {totalLevels}</span>
              <span>{Math.round(((currentChallenge + 1) / totalLevels) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentChallenge + 1) / totalLevels) * 100}%` }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Current Calm Level */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200 mb-6">
            <CalmLevelMeter level={calmLevel} />
          </div>

          {/* Challenge Situation */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 mb-6 border-2 border-red-200">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-bold text-gray-800">{currentChallengeData.title}</h3>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">{currentChallengeData.situation}</p>
          </div>

          {!showCalmImpact ? (
            /* Response Selection */
            <>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                How would you respond? Choose one:
              </h4>
              <div className="space-y-3">
                {currentChallengeData.responses.map((response) => (
                  <motion.button
                    key={response.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleResponseSelect(response)}
                    disabled={!!selectedChoice}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                      selectedChoice?.id === response.id
                        ? `${response.borderColor} bg-gradient-to-br ${response.bgColor} shadow-lg`
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${response.color} flex-shrink-0`}>
                        <span className="text-2xl">{response.emoji}</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-gray-800 mb-2"></h5>
                        <p className="text-gray-700">{response.text}</p>
                      </div>
                      {selectedChoice?.id === response.id && (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </>
          ) : (
            /* Calm Impact Display */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-gradient-to-br ${selectedChoice.bgColor} rounded-xl p-6 border-2 ${selectedChoice.borderColor} mb-6`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${selectedChoice.color} flex-shrink-0`}>
                  <span className="text-3xl">{selectedChoice.emoji}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{selectedChoice.label}</h4>
                  <p className="text-gray-700 mb-4">{selectedChoice.explanation}</p>
                  
                  {/* Calm Impact Change */}
                  <div className="bg-white/60 rounded-lg p-4 border border-gray-300">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Calm Level Change:</span>
                      <span className={`text-lg font-bold ${selectedChoice.calmImpact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedChoice.calmImpact > 0 ? '+' : ''}{selectedChoice.calmImpact}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {currentChallenge < challenges.length - 1 ? (
                  <>
                    Next Challenge <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    View Results <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Awareness grows every time you stop, think, and choose differently. Each choice is practice—you're building new neural pathways for calm responses.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default ChallengeChoiceSimulation;

