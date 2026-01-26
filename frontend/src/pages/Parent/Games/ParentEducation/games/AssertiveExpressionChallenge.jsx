import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Shield, CheckCircle, AlertCircle, MessageSquare, TrendingUp } from "lucide-react";

const AssertiveExpressionChallenge = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-68";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // 5 conflict scenarios
  const scenarios = [
    {
      id: 1,
      title: "Teen Disrespect",
      situation: "Your teenager has been using a disrespectful tone with you lately. When you ask them to help with chores, they roll their eyes and say 'Whatever, just leave me alone.' You feel hurt and frustrated.",
      conflict: "Your teen says: 'You're always nagging me! I'll do it later, stop bothering me!'",
      responses: [
        
        {
          id: 'passive',
          label: 'Passive Response',
          text: "Okay, fine. I guess I'll just do it myself. You don't have to help if you don't want to. It's okay.",
          explanation: "This response is passive because it avoids the conflict, doesn't communicate your needs, and allows disrespect to continue. It teaches that boundaries don't matter and can lead to resentment.",
          outcome: "The immediate conflict stops, but the underlying disrespect continues. You may feel resentful, and your teen learns that disrespectful behavior has no consequences. The pattern continues.",
          emoji: "😐",
          color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'aggressive',
          label: 'Aggressive Response',
          text: "Don't you dare talk to me like that! I'm your parent and you will show me respect! Go to your room right now and think about how you're treating me!",
          explanation: "This response is aggressive because it's reactive, uses power/threats, doesn't acknowledge their feelings, and escalates conflict. It may create fear but doesn't build respect or communication skills.",
          outcome: "The conflict escalates. Your teen may comply out of fear, but resentment builds. Communication breaks down, and the relationship becomes more strained. The underlying issue isn't resolved.",
          emoji: "💥",
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300"
        },
        {
          id: 'assertive',
          label: 'Assertive Response',
          text: "I understand you're feeling annoyed, and I also need respect when we communicate. When you use that tone, it hurts my feelings. Can we find a way to talk about chores that works for both of us?",
          explanation: "This response is assertive because it: (1) acknowledges their feelings, (2) clearly states your need for respect, (3) expresses your own feelings honestly, (4) invites collaborative problem-solving. It's calm truth with respectful delivery.",
          outcome: "Your teen feels heard and respected, while you've maintained your boundary. They're more likely to engage in respectful communication. The relationship stays connected while addressing the issue.",
          emoji: "✅",
          color: "from-green-500 to-emerald-600",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300"
        },
      ],
      correctChoice: "assertive",
      whyItMatters: "Assertiveness with teens builds mutual respect. When you communicate assertively, you model healthy boundaries and emotional expression. They learn that you can disagree while maintaining connection."
    },
    {
      id: 2,
      title: "In-Law Criticism",
      situation: "Your in-laws are visiting and make a comment about how you're raising your children: 'You're being too lenient. Children need more discipline and structure than what you're providing.' You feel judged and defensive.",
      conflict: "Your in-law says: 'Back in our day, children knew their place and respected adults. You're spoiling them by being too soft.'",
      responses: [
        
        {
          id: 'passive',
          label: 'Passive Response',
          text: "You're probably right. Maybe we are too lenient. We'll try to be more strict. Thanks for the advice, I guess we need to do better.",
          explanation: "This response is passive because it agrees without authentic conviction, avoids conflict, and doesn't assert your values. It can lead to resentment and doesn't set healthy boundaries.",
          outcome: "The criticism stops temporarily, but you may feel resentful. The boundary isn't clear, and similar comments continue. Your parenting confidence may decrease, and you may struggle to stand by your choices.",
          emoji: "😐",
          color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'assertive',
          label: 'Assertive Response',
          text: "I appreciate your perspective and your experience. Every family is different, and we're doing our best to find what works for our children and values. I respect your approach, and I hope you can respect ours as well. We're all trying to raise good kids.",
          explanation: "This response is assertive because it: (1) acknowledges their perspective respectfully, (2) clearly states your family's different approach, (3) sets a boundary for respect, (4) maintains relationship while standing firm. It's calm truth with respectful delivery.",
          outcome: "Family harmony is maintained. Your in-laws feel heard and respected, while you've communicated your position clearly. The boundary is set without creating conflict, and relationships stay positive.",
          emoji: "✅",
          color: "from-green-500 to-emerald-600",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300"
        },
        {
          id: 'aggressive',
          label: 'Aggressive Response',
          text: "You have no right to judge our parenting! Times have changed, and you don't understand modern parenting! We're doing fine without your outdated advice!",
          explanation: "This response is aggressive because it's defensive, dismissive, and attacks their perspective. It creates conflict and damages relationships while not effectively communicating your position.",
          outcome: "Family relationships become strained. Your in-laws feel attacked, and future visits may be tense. The conversation becomes about the conflict rather than understanding, and harmony is broken.",
          emoji: "💥",
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300"
        }
      ],
      correctChoice: "assertive",
      whyItMatters: "Assertiveness with extended family requires balancing respect with boundaries. When you communicate assertively, you maintain relationships while protecting your family's values and choices."
    },
    {
      id: 3,
      title: "Partner Disagreement",
      situation: "You and your partner disagree about how to handle a parenting situation. Your partner wants to be stricter, and you want a more gentle approach. The discussion is getting heated.",
      conflict: "Your partner says: 'You're always undermining me! When I set a boundary, you come in and soften it. You need to back me up instead of being the 'nice parent' all the time!'",
      responses: [
        {
          id: 'assertive',
          label: 'Assertive Response',
          text: "I hear that you feel unsupported, and that's not what I want. I also have concerns about the approach. Can we pause and talk about this when we're both calmer? I want to find a way we can both feel good about our parenting decisions and support each other.",
          explanation: "This response is assertive because it: (1) acknowledges their feelings, (2) states your own concerns clearly, (3) asks for a pause to engage constructively, (4) invites collaborative problem-solving. It's calm truth with respectful delivery.",
          outcome: "The conflict de-escalates. Both of you feel heard and respected. You agree to continue the conversation when calmer, leading to a productive discussion about parenting alignment. The relationship strengthens.",
          emoji: "✅",
          color: "from-green-500 to-emerald-600",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300"
        },
        {
          id: 'passive',
          label: 'Passive Response',
          text: "Fine, you're right. I'll just do whatever you want. I'll back you up, even if I don't agree. I don't want to fight about this anymore.",
          explanation: "This response is passive because it avoids conflict by agreeing, suppresses your own values, and doesn't address the underlying issue. It can lead to resentment and doesn't create real partnership.",
          outcome: "The immediate conflict stops, but resentment builds. Parenting becomes one-sided, and you may feel disconnected from decisions. The underlying disagreement remains, and similar conflicts recur.",
          emoji: "😐",
          color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'aggressive',
          label: 'Aggressive Response',
          text: "You're being unreasonable! I'm not undermining you—you're just too harsh! Maybe if you weren't so rigid, I wouldn't need to step in! This is about the kids, not your ego!",
          explanation: "This response is aggressive because it attacks, blames, and escalates conflict. It doesn't acknowledge their feelings or invite collaboration. It creates defensiveness and damages the relationship.",
          outcome: "The argument escalates. Both of you feel attacked and defensive. The conversation becomes about winning rather than problem-solving. Trust and partnership erode, and the parenting issue remains unresolved.",
          emoji: "💥",
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300"
        }
      ],
      correctChoice: "assertive",
      whyItMatters: "Assertiveness in partnerships creates healthy collaboration. When you communicate assertively, you both feel heard and respected. This builds trust and creates unified parenting that reflects both partners' values."
    },
    {
      id: 4,
      title: "Boss Overwork",
      situation: "Your boss has been asking you to work late and on weekends regularly, affecting your family time. You've been accommodating, but it's becoming unsustainable. You need to set boundaries.",
      conflict: "Your boss says: 'I know it's last minute, but I need you to finish this project over the weekend. It's really important, and you're the only one who can do it. I'm counting on you.'",
      responses: [
        
        {
          id: 'passive',
          label: 'Passive Response',
          text: "Okay, I guess I can do it. I'll figure it out. Family time will just have to wait again. It's fine, I'll make it work somehow.",
          explanation: "This response is passive because it avoids conflict, doesn't communicate your boundaries, and sacrifices your values. It allows the pattern to continue and can lead to burnout and resentment.",
          outcome: "You work the weekend again. The pattern continues, and your family time suffers. You may feel resentful and burned out. Your boss doesn't learn about your boundaries, and the overwork continues.",
          emoji: "😐",
          color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'aggressive',
          label: 'Aggressive Response',
          text: "This is ridiculous! You're always asking me to work weekends! I have a life outside of work! This is your poor planning, not my problem! Find someone else!",
          explanation: "This response is aggressive because it's reactive, blames, and attacks. It doesn't acknowledge their position or invite collaboration. It may damage professional relationships and career prospects.",
          outcome: "Your boss feels attacked and may become defensive. Professional relationships suffer, and future opportunities may be affected. The boundary is set, but through conflict rather than collaboration.",
          emoji: "💥",
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300"
        },
        {
          id: 'assertive',
          label: 'Assertive Response',
          text: "I understand this is important, and I want to support the team. However, I've been working a lot of weekends lately, and I need to protect my family time. Can we discuss a solution that meets the deadline while respecting my boundaries? Perhaps we can plan better for future projects or redistribute some of the work.",
          explanation: "This response is assertive because it: (1) acknowledges their need, (2) clearly states your boundary and need, (3) expresses your values (family time), (4) invites collaborative problem-solving. It's calm truth with respectful delivery.",
          outcome: "Your boss understands your boundary while seeing your commitment. A solution is found that respects both needs. Future planning improves, and you maintain work-life balance. Professional respect increases.",
          emoji: "✅",
          color: "from-green-500 to-emerald-600",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300"
        },
      ],
      correctChoice: "assertive",
      whyItMatters: "Assertiveness at work protects your boundaries while maintaining professionalism. When you communicate assertively, you teach others how to treat you and create sustainable work-life balance."
    },
    {
      id: 5,
      title: "Child Boundary Testing",
      situation: "Your child keeps testing boundaries by pushing limits you've set. When you say 'no' to something, they keep asking, whining, or trying to negotiate until you give in. You feel frustrated and want consistency.",
      conflict: "You've said 'no' to extra screen time, but your child keeps asking: 'Please? Just 10 more minutes? Everyone else gets to! Why are you so mean? You never let me do anything fun!'",
      responses: [
        {
          id: 'assertive',
          label: 'Assertive Response',
          text: "I understand you want more screen time, and I also need to stick with our agreement. The answer is still no for today. I know it's hard when you want something, and I also believe these limits help you. Let's find something else fun we can do together instead.",
          explanation: "This response is assertive because it: (1) acknowledges their desire, (2) clearly maintains the boundary, (3) explains the reason calmly, (4) offers an alternative. It's calm truth with respectful delivery.",
          outcome: "Your child feels heard, but the boundary is clear. They learn that 'no' means 'no' and that you can say no while still caring. Consistency builds trust, and boundary-testing decreases over time.",
          emoji: "✅",
          color: "from-green-500 to-emerald-600",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300"
        },
        {
          id: 'passive',
          label: 'Passive Response',
          text: "Fine, okay. Just 10 more minutes, but that's it. I guess it's not that big of a deal. Just stop asking, please.",
          explanation: "This response is passive because it gives in to avoid conflict, doesn't maintain the boundary, and teaches that persistence pays off. It reinforces boundary-testing behavior.",
          outcome: "Your child gets what they want, reinforcing that asking repeatedly works. The boundary becomes unclear, and they learn that your 'no' doesn't mean no. Boundary-testing increases.",
          emoji: "😐",
          color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'aggressive',
          label: 'Aggressive Response',
          text: "I SAID NO! Stop asking! You're being so annoying! Go to your room right now! I'm tired of you constantly pushing me! No screen time for the rest of the week!",
          explanation: "This response is aggressive because it's reactive, uses power/threats, doesn't acknowledge their feelings, and escalates conflict. It may create fear but doesn't teach healthy boundary respect.",
          outcome: "Your child complies out of fear, but resentment builds. They may become more sneaky or rebellious. The relationship becomes about power struggles rather than mutual respect. Trust erodes.",
          emoji: "💥",
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300"
        }
      ],
      correctChoice: "assertive",
      whyItMatters: "Assertiveness with children teaches them healthy boundaries. When you communicate assertively, they learn that you can say no while still caring, and that boundaries are about safety and respect, not control."
    }
  ];

  const handleChoice = (responseId) => {
    setSelectedChoices(prev => ({
      ...prev,
      [currentScenario]: responseId
    }));
    setShowFeedback(true);
    
    if (responseId === scenarios[currentScenario].correctChoice) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentScenario < totalLevels - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  if (showGameOver) {
    const selectedResponse = selectedChoices[currentScenario];
    const currentScenarioData = scenarios[currentScenario];
    const selectedChoiceData = currentScenarioData.responses.find(r => r.id === selectedResponse);
    
    const assertiveCount = Object.values(selectedChoices).filter((choice, idx) => 
      choice === scenarios[idx].correctChoice
    ).length;

    return (
      <ParentGameShell
        title={gameData?.title || "Assertive Expression Challenge"}
        subtitle="Challenge Complete!"
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
                🛡️
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Assertive Expression Challenge Complete!</h2>
              <p className="text-lg text-gray-600 mb-6">
                You chose assertive responses in {assertiveCount} out of {totalLevels} scenarios.
              </p>
            </div>

            {/* Results Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-3xl font-bold text-blue-600">{score}/{totalLevels}</p>
                  <p className="text-sm text-gray-600">Assertive Responses</p>
                </div>
              </div>
              <p className="text-center text-gray-700">
                {assertiveCount >= 4 
                  ? "Excellent! You're building confidence in assertive communication. Keep practicing calm truth with respectful delivery."
                  : assertiveCount >= 3
                  ? "Good progress! You're learning assertive communication. Remember: assertiveness = calm truth + respectful delivery."
                  : "Keep practicing! Assertiveness is a skill that develops over time. Focus on expressing your needs calmly and respectfully."}
              </p>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-600" />
                Key Insights
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Assertiveness = Calm Truth + Respectful Delivery:</strong> You can express your needs and boundaries while respecting others' feelings.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Passive vs. Assertive:</strong> Passive responses avoid conflict but sacrifice your needs. Assertive responses address conflict while maintaining respect.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Aggressive vs. Assertive:</strong> Aggressive responses attack and escalate. Assertive responses express needs without attacking others.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Building Confidence:</strong> The more you practice assertive communication, the more natural it becomes. You build confidence by expressing yourself calmly in disagreement.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Assertiveness = calm truth + respectful delivery. When you communicate assertively, you model healthy boundaries and emotional expression for your children. They learn that you can disagree while maintaining connection, that you can say no while still caring, and that expressing your needs is healthy and necessary. Your assertive communication builds their confidence to do the same.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  const currentScenarioData = scenarios[currentScenario];
  const selectedResponse = selectedChoices[currentScenario];
  const selectedChoiceData = currentScenarioData?.responses.find(r => r.id === selectedResponse);

  return (
    <ParentGameShell
      title={gameData?.title || "Assertive Expression Challenge"}
      subtitle={`Scenario ${currentScenario + 1} of ${totalLevels}`}
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
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Scenario {currentScenario + 1} of {totalLevels}</span>
              <span>{Math.round(((currentScenario + 1) / totalLevels) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentScenario + 1) / totalLevels) * 100}%` }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Scenario Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🛡️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{currentScenarioData.title}</h2>
            <p className="text-gray-600 text-lg">
              Choose how you would respond assertively, passively, or aggressively.
            </p>
          </div>

          {/* Situation */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Situation</h3>
            <p className="text-gray-700 leading-relaxed mb-4">{currentScenarioData.situation}</p>
            <div className="bg-white rounded-lg p-4 border border-blue-300">
              <p className="text-gray-800 font-medium italic">"{currentScenarioData.conflict}"</p>
            </div>
          </div>

          {/* Response Options */}
          {!showFeedback && (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">How would you respond?</h3>
              {currentScenarioData.responses.map((response, index) => (
                <motion.button
                  key={response.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChoice(response.id)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                    response.id === 'assertive'
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 hover:border-yellow-400 hover:shadow-lg'
                      : response.id === 'passive'
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 hover:border-yellow-400 hover:shadow-lg'
                      : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 hover:border-yellow-400 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl"></span>
                    <h4 className="text-lg font-bold text-gray-800"></h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{response.text}</p>
                </motion.button>
              ))}
            </div>
          )}

          {/* Feedback */}
          {showFeedback && selectedChoiceData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-gradient-to-br ${selectedChoiceData.bgColor} rounded-xl p-6 border-2 ${selectedChoiceData.borderColor} mb-6`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{selectedChoiceData.emoji}</span>
                <h3 className="text-xl font-bold text-gray-800">Your Choice: {selectedChoiceData.label}</h3>
                {selectedResponse === currentScenarioData.correctChoice && (
                  <CheckCircle className="w-6 h-6 text-green-600 ml-auto" />
                )}
              </div>

              <div className="bg-white rounded-lg p-5 border border-gray-200 mb-4">
                <h4 className="font-bold text-gray-800 mb-2">Why This Response:</h4>
                <p className="text-gray-700 leading-relaxed mb-4">{selectedChoiceData.explanation}</p>
                
                <h4 className="font-bold text-gray-800 mb-2">Likely Outcome:</h4>
                <p className="text-gray-700 leading-relaxed">{selectedChoiceData.outcome}</p>
              </div>

              {selectedResponse === currentScenarioData.correctChoice ? (
                <div className="bg-green-100 rounded-lg p-4 border border-green-300">
                  <p className="text-green-800 font-semibold">
                    ✅ Excellent! This is an assertive response that communicates calmly and respectfully.
                  </p>
                </div>
              ) : (
                <div className="bg-blue-100 rounded-lg p-4 border border-blue-300">
                  <p className="text-blue-800 font-semibold mb-2">
                    💡 Remember: Assertiveness = calm truth + respectful delivery.
                  </p>
                  <p className="text-blue-700 text-sm">
                    The assertive response acknowledges feelings, states needs clearly, and invites collaboration—all while maintaining respect.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Why It Matters */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200 mb-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Why This Matters:</strong> {currentScenarioData.whyItMatters}
            </p>
          </div>

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mb-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Assertiveness = calm truth + respectful delivery. Building confidence to communicate calmly even in disagreement teaches your children healthy boundaries and emotional expression.
            </p>
          </div>

          {/* Next Button */}
          {showFeedback && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {currentScenario < totalLevels - 1 ? (
                <>
                  Next Scenario
                  <MessageSquare className="w-5 h-5" />
                </>
              ) : (
                <>
                  View Results
                  <CheckCircle className="w-5 h-5" />
                </>
              )}
            </motion.button>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default AssertiveExpressionChallenge;



