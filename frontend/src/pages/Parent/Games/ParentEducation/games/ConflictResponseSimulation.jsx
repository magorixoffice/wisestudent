import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Heart, CheckCircle, AlertCircle, Users, Volume2 } from "lucide-react";

const ConflictResponseSimulation = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-64";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [harmonyLevel, setHarmonyLevel] = useState(50); // Start at neutral 50%
  const [showImpact, setShowImpact] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Interactive conflict scenarios
  const scenarios = [
    {
      id: 1,
      title: "Spouse Argument",
      situation: "You and your spouse are having a heated discussion about money. The conversation is getting tense, and voices are starting to rise. You feel defensive and frustrated.",
      conflict: "Your spouse says: 'You never listen to my concerns about our spending! Every time I try to talk about it, you shut down or get defensive!'",
      responses: [
        
        {
          id: 'defensive',
          label: 'Defensive Response',
          text: "Well, maybe if you didn't always bring it up at the worst times, I'd be more willing to listen! You're not exactly perfect with money either!",
          harmonyChange: -20,
          explanation: "This response is defensive and counter-attacking. It escalates the conflict by shifting blame and avoids taking responsibility or truly listening.",
          outcome: "The argument escalates. Both of you feel attacked and defensive. The conversation becomes a blame game, and the real issue—financial communication—remains unresolved.",
          emoji: "💚",
          color: "from-green-500 to-emerald-600"
        },
        {
          id: 'avoidant',
          label: 'Avoidant Response',
          text: "I don't want to talk about this right now. Can we just drop it? We'll figure it out later.",
          harmonyChange: -12,
          explanation: "This response avoids the conflict but doesn't resolve it. It dismisses your spouse's concerns and leaves underlying issues unaddressed, creating future tension.",
          outcome: "The immediate conflict pauses, but resentment builds. Your spouse feels dismissed and unheard. The issue resurfaces later, often with more intensity.",
          emoji: "💚",
          color: "from-green-500 to-emerald-600"
        },
        {
          id: 'constructive',
          label: 'Constructive Response',
          text: "I can hear that you're feeling frustrated, and I'm feeling defensive right now too. Can we take a breath and talk about this when we're both calmer? I want to hear your concerns properly.",
          harmonyChange: +18,
          explanation: "This response acknowledges both emotions, asks for a pause, and shows willingness to engage constructively. It lowers the temperature and opens the door for real communication.",
          outcome: "The conflict de-escalates. Your spouse feels heard and respected. You both agree to continue the conversation later when emotions are calmer, leading to a productive discussion.",
          emoji: "💚",
          color: "from-green-500 to-emerald-600"
        },
      ],
      correctChoice: "constructive",
      whyItMatters: "Lower your voice and your ego; clarity will rise naturally. When you respond constructively in conflicts, you model emotional regulation and create space for real solutions."
    },
    {
      id: 2,
      title: "Teen Attitude",
      situation: "Your teenager comes home from school in a bad mood. When you ask how their day was, they snap at you with attitude: 'Why do you always ask me that? My day was fine, okay? Stop bugging me!'",
      conflict: "Your teen is clearly upset but being dismissive and rude. You feel hurt by their tone and frustrated by their attitude.",
      responses: [
        
        {
          id: 'defensive',
          label: 'Defensive Response',
          text: "Don't talk to me like that! I'm your parent and you will show me respect! I was just trying to be nice, and you're being rude for no reason!",
          harmonyChange: -22,
          explanation: "This response is reactive and escalates the conflict. It focuses on the disrespect rather than the underlying emotion, creating a power struggle.",
          outcome: "The conflict escalates into an argument about respect. Your teen becomes more defensive and shuts down. Communication breaks down, and the real issue—what's bothering them—remains unknown.",
          emoji: "💚",
          color: "from-green-500 to-emerald-600"
        },
        {
          id: 'constructive',
          label: 'Constructive Response',
          text: "I can hear that you're having a tough time right now. I'm sorry if my question felt like bugging you. I'm here if you want to talk, and I'll give you some space if you need it.",
          harmonyChange: +15,
          explanation: "This response validates their emotion without taking the attitude personally. It offers support while respecting their need for space, which often opens communication.",
          outcome: "Your teen feels heard and respected. They may apologize for snapping or open up about what's bothering them. The relationship stays connected even during difficult moments.",
          emoji: "💚",
          color: "from-green-500 to-emerald-600"
        },
        {
          id: 'avoidant',
          label: 'Avoidant Response',
          text: "Fine, whatever. I'll just leave you alone then. You can figure everything out yourself.",
          harmonyChange: -15,
          explanation: "This response withdraws and communicates hurt through distance. It doesn't address the issue and teaches that conflict leads to emotional abandonment.",
          outcome: "Your teen feels dismissed and may feel guilty for pushing you away. Communication shuts down, and they may struggle to reach out when they actually need support.",
          emoji: "💚",
          color: "from-green-500 to-emerald-600"
        }
      ],
      correctChoice: "constructive",
      whyItMatters: "Staying calm with teenagers requires emotional maturity. When you respond constructively instead of reactively, you model how to handle difficult emotions and maintain connection."
    },
    {
      id: 3,
      title: "Sibling Conflict",
      situation: "Your two children are fighting loudly. One child is crying, and the other is shouting. You're trying to work from home, and the noise is overwhelming. You feel frustrated and need them to stop.",
      conflict: "You hear: 'Stop it! You're so annoying!' followed by crying and more shouting. The conflict is escalating, and you need to intervene.",
      responses: [
        {
          id: 'constructive',
          label: 'Constructive Response',
          text: "I can hear you're both really upset. Let's take a breath together. Can you each tell me what happened, one at a time? I want to understand what's going on.",
          harmonyChange: +16,
          explanation: "This response validates both children's emotions, de-escalates the situation, and creates space for communication. It models problem-solving instead of punishment.",
          outcome: "Both children feel heard. The conflict de-escalates, and they can express their perspectives. You help them find a solution together, teaching conflict resolution skills.",
          emoji: "💚",
          color: "from-green-500 to-emerald-600"
        },
        {
          id: 'defensive',
          label: 'Reactive Response',
          text: "STOP FIGHTING RIGHT NOW! Both of you, go to your rooms! I can't handle this noise while I'm trying to work! You're driving me crazy!",
          harmonyChange: -18,
          explanation: "This response is reactive and comes from your own frustration. It focuses on stopping the behavior rather than understanding the cause, which doesn't teach conflict resolution.",
          outcome: "The immediate conflict stops, but the underlying issue isn't resolved. The children may feel shame or blame each other more. The pattern of conflict continues because the skills aren't learned.",
          emoji: "💚",
          color: "from-green-500 to-emerald-600"
        },
        {
          id: 'avoidant',
          label: 'Avoidant Response',
          text: "I can't deal with this right now. Just stop fighting and figure it out yourselves. I have work to do.",
          harmonyChange: -14,
          explanation: "This response withdraws and avoids the conflict. It doesn't help the children learn to resolve disagreements, and they may feel unsupported.",
          outcome: "The children may stop fighting temporarily, but the conflict remains unresolved. They don't learn conflict resolution skills, and the pattern continues without guidance.",
          emoji: "💚",
          color: "from-green-500 to-emerald-600"
        }
      ],
      correctChoice: "constructive",
      whyItMatters: "Staying calm during children's conflicts is challenging, but it teaches them how to resolve disagreements. Your constructive response models emotional regulation and problem-solving."
    },
    {
      id: 4,
      title: "Criticism from In-Laws",
      situation: "Your in-laws are visiting and make a comment about your parenting: 'You're letting the kids stay up too late. When we were parents, children had earlier bedtimes and more structure.' You feel judged and defensive.",
      conflict: "The comment feels like criticism of your parenting choices. You want to stand up for yourself but also maintain family harmony.",
      responses: [
        
        {
          id: 'defensive',
          label: 'Defensive Response',
          text: "Times have changed! Things are different now than when you were parents! You don't understand our situation, and we're doing fine without your advice!",
          harmonyChange: -16,
          explanation: "This response is defensive and dismissive. It creates conflict and may damage the relationship with your in-laws while not effectively communicating your position.",
          outcome: "Tension increases. Your in-laws may feel attacked or dismissed. Family relationships become strained, and future visits may be more difficult.",
          emoji: "💚",
          color: "from-green-500 to-emerald-600"
        },
        {
          id: 'avoidant',
          label: 'Avoidant Response',
          text: "Oh, okay. Maybe you're right. We'll think about changing bedtime. Thanks for the advice.",
          harmonyChange: -8,
          explanation: "This response avoids conflict by agreeing, but it may not be authentic. It can lead to resentment if you don't actually agree, and it doesn't set healthy boundaries.",
          outcome: "The immediate conflict is avoided, but you may feel resentful. The boundary isn't clear, and similar comments may continue. You may feel your parenting choices aren't respected.",
          emoji: "💚",
          color: "from-green-500 to-emerald-600"
        },
        {
          id: 'constructive',
          label: 'Constructive Response',
          text: "I appreciate your perspective. We've found that a slightly later bedtime works well for our family right now, but I can see why earlier bedtimes were important in your experience. Every family is different, and we're doing our best to find what works for us.",
          harmonyChange: +14,
          explanation: "This response acknowledges their perspective without being defensive, validates their experience, and respectfully asserts your family's choices. It maintains relationship while setting boundaries.",
          outcome: "Family harmony is maintained. Your in-laws feel heard and respected, and you've communicated your position without creating conflict. The relationship stays positive.",
          emoji: "💚",
          color: "from-green-500 to-emerald-600"
        },
      ],
      correctChoice: "constructive",
      whyItMatters: "Setting boundaries with extended family requires balance. A constructive response maintains relationships while respectfully asserting your family's values and choices."
    },
    {
      id: 5,
      title: "Child Refusing to Apologize",
      situation: "Your child hurt another child's feelings during play. You've asked them to apologize, but they're refusing, saying 'It wasn't my fault!' and crossing their arms defiantly.",
      conflict: "You want your child to take responsibility, but they're being defensive and refusing. You feel frustrated and want to enforce the apology, but forcing it might not be effective.",
      responses: [
        {
          id: 'constructive',
          label: 'Constructive Response',
          text: "I can see this is hard for you right now. I understand you might see it differently. Let's talk about what happened and how the other child might be feeling. We can figure out how to make things right together.",
          harmonyChange: +17,
          explanation: "This response validates their perspective while opening conversation about empathy and repair. It invites problem-solving rather than forcing compliance, which often leads to genuine understanding.",
          outcome: "Your child feels heard and understood. They're more likely to understand the impact of their actions and genuinely want to make things right. The relationship and learning are both strengthened.",
          emoji: "💚",
          color: "from-green-500 to-emerald-600"
        },
        {
          id: 'defensive',
          label: 'Forceful Response',
          text: "You WILL apologize right now! I don't care whose fault it was—you need to say sorry! This is not negotiable!",
          harmonyChange: -19,
          explanation: "This response uses force and power to demand compliance. It focuses on the behavior rather than understanding, which may lead to fake apologies without real learning.",
          outcome: "Your child may apologize, but it's likely forced and insincere. They don't learn empathy or genuine repair. The underlying issue—understanding others' feelings—remains unaddressed.",
          emoji: "💚",
          color: "from-green-500 to-emerald-600"
        },
        {
          id: 'avoidant',
          label: 'Avoidant Response',
          text: "Fine, don't apologize. But you're not playing with them anymore today. Maybe you'll learn your lesson when you're left out.",
          harmonyChange: -13,
          explanation: "This response avoids the conflict by using punishment instead of teaching. It doesn't help the child understand empathy or learn to repair relationships.",
          outcome: "The immediate situation is managed, but the child doesn't learn about empathy or taking responsibility. Future conflicts may continue because the skills aren't developed.",
          emoji: "💚",
          color: "from-green-500 to-emerald-600"
        }
      ],
      correctChoice: "constructive",
      whyItMatters: "Teaching children to take responsibility requires patience and empathy. A constructive approach helps them understand others' feelings and learn genuine repair, not just forced compliance."
    }
  ];

  const handleChoice = (response) => {
    if (selectedChoice) return; // Already answered

    setSelectedChoice(response);
    
    // Update harmony level (clamp between 0 and 100)
    const newHarmonyLevel = Math.max(0, Math.min(100, harmonyLevel + response.harmonyChange));
    setHarmonyLevel(newHarmonyLevel);
    
    // Award score for constructive responses
    if (response.id === 'constructive') {
      setScore(prev => prev + 1);
    }
    
    // Show impact after a brief delay
    setTimeout(() => {
      setShowImpact(true);
    }, 500);
  };

  const handleNext = () => {
    setSelectedChoice(null);
    setShowImpact(false);
    
    if (currentScenario < totalLevels - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentScenario(0);
    setSelectedChoice(null);
    setShowImpact(false);
    setHarmonyLevel(50);
    setScore(0);
    setShowGameOver(false);
  };

  // Family Harmony Meter Component
  const HarmonyMeter = ({ level }) => {
    const getHarmonyColor = () => {
      if (level >= 70) return 'from-green-500 to-emerald-600';
      if (level >= 50) return 'from-blue-500 to-indigo-600';
      if (level >= 30) return 'from-yellow-500 to-orange-500';
      return 'from-red-500 to-rose-600';
    };

    const getHarmonyLabel = () => {
      if (level >= 70) return { text: 'Harmonious', emoji: '💚', description: 'Strong connection and understanding' };
      if (level >= 50) return { text: 'Balanced', emoji: '😌', description: 'Stable with room to grow' };
      if (level >= 30) return { text: 'Strained', emoji: '😟', description: 'Tension present, needs attention' };
      return { text: 'Discordant', emoji: '💔', description: 'Significant conflict and disconnection' };
    };

    const label = getHarmonyLabel();

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" />
            <span className="text-lg font-semibold text-gray-800">Family Harmony</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{label.emoji}</span>
            <span className="text-lg font-bold text-gray-700">{level}%</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: `${harmonyLevel}%` }}
            animate={{ width: `${level}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${getHarmonyColor()} rounded-full flex items-center justify-center`}
          >
            {level > 15 && (
              <span className="text-xs font-bold text-white px-2">{label.text}</span>
            )}
          </motion.div>
        </div>
        <div className="text-center mt-2">
          <span className="text-sm font-medium text-gray-600">{label.description}</span>
        </div>
      </div>
    );
  };

  const currentScenarioData = scenarios[currentScenario];

  if (showGameOver) {
    const harmonyLabel = harmonyLevel >= 70 ? 'Harmonious' : harmonyLevel >= 50 ? 'Balanced' : harmonyLevel >= 30 ? 'Strained' : 'Discordant';
    
    return (
      <ParentGameShell
        title={gameData?.title || "Conflict Response Simulation"}
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
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-7xl mb-4"
              >
                🤝
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Conflict Practice Complete!</h2>
              <p className="text-lg text-gray-600 mb-6">
                You've practiced staying calm and constructive during family disagreements.
              </p>
            </div>

            {/* Final Harmony Level */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Final Family Harmony Level</h3>
              <HarmonyMeter level={harmonyLevel} />
              <p className="text-center mt-4 text-gray-700">
                {harmonyLevel >= 60 
                  ? "You maintained strong family harmony! Constructive responses help keep relationships connected even during conflicts."
                  : harmonyLevel >= 40
                  ? "Your family harmony was balanced. Continue practicing constructive responses to strengthen family connections."
                  : "Your family harmony decreased. Remember: lower your voice and your ego; clarity will rise naturally. Keep practicing constructive responses!"}
              </p>
            </div>

            {/* Results Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Results Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white rounded-lg p-4">
                  <span className="text-gray-700">Constructive Responses:</span>
                  <span className="font-bold text-green-600">{score} / {totalLevels}</span>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-4">
                  <span className="text-gray-700">Final Harmony Level:</span>
                  <span className="font-bold text-purple-600">{harmonyLevel}%</span>
                </div>
              </div>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Lower your voice and your ego; clarity will rise naturally. When you practice staying calm and constructive during family disagreements, you're not just managing conflict—you're teaching your children how to handle disagreements respectfully. Your constructive responses model emotional regulation, empathy, and problem-solving. When you lower your voice, you lower the temperature of the conflict. When you lower your ego, you create space for understanding and solutions. Your calm, clear responses during conflicts teach your children that disagreements don't have to damage relationships—they can actually strengthen connection when handled with respect and empathy.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Conflict Response Simulation"}
      subtitle={`Scenario ${currentScenario + 1} of ${totalLevels}: ${currentScenarioData.title}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentScenario + 1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={currentScenario}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Scenario Context */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{currentScenarioData.title}</h3>
            <p className="text-gray-600 mb-4">{currentScenarioData.situation}</p>
          </div>

          {/* Conflict Display */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h4 className="text-lg font-bold text-gray-800">The Conflict:</h4>
            </div>
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <p className="text-gray-800 leading-relaxed italic">
                "{currentScenarioData.conflict}"
              </p>
            </div>
          </div>

          {/* Family Harmony Meter */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
            <HarmonyMeter level={harmonyLevel} />
          </div>

          {!selectedChoice ? (
            /* Response Selection */
            <div className="space-y-4 mb-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Choose Your Response:</h4>
              {currentScenarioData.responses.map((response) => (
                <motion.button
                  key={response.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChoice(response)}
                  className="w-full bg-white border-2 border-gray-300 rounded-xl p-6 text-left hover:border-purple-400 hover:bg-purple-50 transition-all shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className={`rounded-full p-2 bg-gradient-to-br ${response.color} bg-opacity-10`}>
                      <span className="text-2xl">{response.emoji}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-2"></h4>
                      <p className="text-gray-700 italic">
                        "{response.text}"
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            /* Impact Display */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 mb-6"
            >
              {/* Harmony Change Indicator */}
              <div className={`bg-gradient-to-br rounded-xl p-6 border-2 ${
                selectedChoice.harmonyChange > 0
                  ? 'from-green-50 to-emerald-50 border-green-200'
                  : selectedChoice.harmonyChange < -15
                  ? 'from-red-50 to-rose-50 border-red-200'
                  : 'from-yellow-50 to-orange-50 border-yellow-200'
              }`}>
                <div className="flex items-center justify-center gap-3 mb-4">
                  {selectedChoice.id === 'constructive' ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : selectedChoice.harmonyChange < -15 ? (
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-orange-600" />
                  )}
                  <h4 className="text-2xl font-bold text-gray-800">
                    Harmony {selectedChoice.harmonyChange > 0 ? 'Increased' : 'Decreased'} by {Math.abs(selectedChoice.harmonyChange)}%
                  </h4>
                </div>
                <div className="text-center">
                  <p className="text-gray-700 text-lg font-medium mb-2">
                    New Harmony Level: <span className="font-bold text-purple-600">{harmonyLevel}%</span>
                  </p>
                </div>
              </div>

              {/* Explanation */}
              <div className={`bg-gradient-to-br rounded-xl p-6 border-2 ${
                selectedChoice.id === 'constructive'
                  ? 'from-green-50 to-emerald-50 border-green-200'
                  : selectedChoice.id === 'defensive'
                  ? 'from-red-50 to-rose-50 border-red-200'
                  : 'from-yellow-50 to-orange-50 border-yellow-200'
              }`}>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  {selectedChoice.id === 'constructive' && (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Constructive Response ✓</span>
                    </>
                  )}
                  {selectedChoice.id === 'defensive' && (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span>Defensive/Reactive Response</span>
                    </>
                  )}
                  {selectedChoice.id === 'avoidant' && (
                    <>
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <span>Avoidant Response</span>
                    </>
                  )}
                </h4>
                <p className="text-gray-700 mb-4">
                  {selectedChoice.explanation}
                </p>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-2">Outcome:</p>
                  <p className="text-gray-700">
                    {selectedChoice.outcome}
                  </p>
                </div>
              </div>

              {/* Why It Matters */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
                <p className="text-sm text-gray-700">
                  <strong>💡 Why It Matters:</strong> {currentScenarioData.whyItMatters}
                </p>
              </div>

              {/* Next Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                {currentScenario < totalLevels - 1 ? 'Next Scenario' : 'View Results'}
              </motion.button>
            </motion.div>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Lower your voice and your ego; clarity will rise naturally. When you respond constructively during conflicts, you model emotional regulation and create space for real solutions.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default ConflictResponseSimulation;

