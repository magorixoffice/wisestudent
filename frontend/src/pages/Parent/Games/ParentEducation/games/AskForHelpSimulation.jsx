import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Heart, CheckCircle, MessageCircle, HelpCircle, TrendingUp, Users, ArrowRight } from "lucide-react";

const AskForHelpSimulation = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-72";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResponse, setShowResponse] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [reflection, setReflection] = useState("");
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Scenarios with different ways to ask for help
  const scenarios = [
    {
      id: 1,
      title: "Sick Day",
      situation: "You're feeling really sick today—fever, body aches, the whole thing. Your partner is at work, and you have two kids who need care. You're struggling to keep up.",
      context: "You need to ask your neighbor or friend for help watching the kids for a few hours.",
      responses: [
        
        {
          id: 'hesitant',
          label: 'Hesitant Request',
          text: "Hi, um, I'm so sorry to bother you, but I'm kind of sick today and... I know this is probably a huge inconvenience, but could you maybe watch the kids? Only if it's not too much trouble, I don't want to be a burden...",
          explanation: "This request is filled with apologies and minimizes your need. The excessive hesitation suggests you feel guilty for asking, which can make others feel awkward and may lead them to feel obligated rather than genuinely wanting to help.",
          emoji: "😕",
          color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'ashamed',
          label: 'Ashamed Request',
          text: "I know I should be able to handle this myself, and I feel terrible asking, but I'm sick and really struggling. I'm such a bad parent for not being able to manage. Could you help? I promise I'll make it up to you somehow.",
          explanation: "This request includes self-criticism and guilt. The shame and self-blame make the request feel burdensome, and the promise to 'make it up' suggests you see asking for help as a debt rather than a normal part of relationships.",
          emoji: "😔",
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300"
        },
        {
          id: 'confident',
          label: 'Confident Request',
          text: "Hi [Name], I'm feeling really sick today and could use some help. Would you be able to watch the kids for a couple hours this afternoon? I'd really appreciate it.",
          explanation: "This request is clear, direct, and honest. You're stating your need without apology or excessive explanation. This shows confidence and respect for both yourself and the person you're asking.",
          emoji: "✅",
          color: "from-green-500 to-emerald-600",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300"
        },
      ],
      correctChoice: "confident",
      simulatedResponse: {
        confident: "Of course! I'd be happy to help. I'll come over around 2 PM. Take care of yourself and rest up. We've all been there—this is what friends are for!",
        hesitant: "Oh, well, I suppose I could help. When do you need me? I might have some things to do, but I can probably work something out...",
        ashamed: "Oh, don't feel bad! Of course I'll help. You're not a bad parent at all. I'll be there, and please don't worry about making anything up—just get better."
      },
      reflectionPrompt: "How did it feel to ask for help in this way? What do you notice about how the response matched your request?"
    },
    {
      id: 2,
      title: "Overwhelmed",
      situation: "You've been juggling work, parenting, household tasks, and personal responsibilities for weeks. You're exhausted and feel like you're drowning. You need someone to help with some basic tasks.",
      context: "You want to ask a family member or close friend for practical help—maybe picking up groceries or helping with some chores.",
      responses: [
        
        {
          id: 'hesitant',
          label: 'Hesitant Request',
          text: "I know this is probably asking too much, but I've been having a hard time and I was wondering if maybe you could help me with some things? I hate to ask, but I'm just so tired...",
          explanation: "This request is vague and filled with doubt. The hesitation and lack of specificity make it harder for the person to know how to help, and the apology suggests you feel guilty for having needs.",
          emoji: "😕",
          color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'confident',
          label: 'Confident Request',
          text: "I've been feeling really overwhelmed lately and could use some support. Would you be able to help me with [specific task] this week? I'd be so grateful.",
          explanation: "This request is specific, honest about your need, and doesn't apologize for needing help. You're being clear about what you need, which helps the person know exactly how to help.",
          emoji: "✅",
          color: "from-green-500 to-emerald-600",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300"
        },
        {
          id: 'ashamed',
          label: 'Ashamed Request',
          text: "I'm really sorry to even ask, but I'm failing at everything right now. I can't keep up with my responsibilities and I feel like such a failure. Could you maybe help me? I know I should be able to do this all myself.",
          explanation: "This request includes self-criticism and implies you're a failure for needing help. The shame can make the helper feel like they're rescuing you rather than supporting you, which can strain relationships.",
          emoji: "😔",
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300"
        }
      ],
      correctChoice: "confident",
      simulatedResponse: {
        confident: "Absolutely! I'd be happy to help. Let me know what you need and when. We all need support sometimes—I'm glad you asked. You're doing great, even when it feels hard.",
        hesitant: "Oh, of course I'll try to help. What do you need? I'm not sure what I can do exactly, but let me know...",
        ashamed: "Don't be so hard on yourself! You're not failing at all. Of course I'll help. You're an amazing parent, and it's okay to need support. Let's figure out what you need together."
      },
      reflectionPrompt: "What thoughts come up when you imagine asking for help when you're overwhelmed? How does the confident approach feel different?"
    },
    {
      id: 3,
      title: "Parenting Burnout",
      situation: "You've been feeling burned out from parenting. You're constantly tired, irritable, and feel like you're just going through the motions. You know you need a break, but you feel guilty taking time for yourself.",
      context: "You want to ask your partner, family member, or trusted friend to watch the kids so you can have a few hours to yourself to recharge.",
      responses: [
        {
          id: 'confident',
          label: 'Confident Request',
          text: "I've been feeling really burned out lately and I think I need some time to recharge. Could you watch the kids for a few hours this weekend so I can have some time for myself? I'd really appreciate it.",
          explanation: "This request honors your need for self-care without apology. You're recognizing that taking care of yourself is important, which models healthy boundaries and self-respect.",
          emoji: "✅",
          color: "from-green-500 to-emerald-600",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300"
        },
        {
          id: 'hesitant',
          label: 'Hesitant Request',
          text: "I know this sounds selfish, but I'm feeling really tired and I was wondering if maybe you could watch the kids for a little bit? I feel bad asking, especially since you're probably busy too...",
          explanation: "This request minimizes your need and includes guilt. Calling self-care 'selfish' suggests you don't believe you deserve time to recharge, which can make it harder to ask and easier for others to dismiss your need.",
          emoji: "😕",
          color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'ashamed',
          label: 'Ashamed Request',
          text: "I'm a terrible parent—I'm burned out and I just want to escape. I know I should be able to handle this, but I can't. Could you please watch the kids? I'm so ashamed that I can't do this on my own.",
          explanation: "This request is filled with shame and self-criticism. The extreme self-judgment can make helpers feel they need to fix you or reassure you rather than simply supporting your need for rest, which is a normal human need.",
          emoji: "😔",
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300"
        }
      ],
      correctChoice: "confident",
      simulatedResponse: {
        confident: "Of course! You absolutely deserve time to recharge. Taking care of yourself is taking care of your family. I'll watch the kids this weekend—go do something that fills you up. You've got this!",
        hesitant: "Oh, it's not selfish at all. I can probably help. When were you thinking? I might have some things going on, but I'll see what I can do...",
        ashamed: "Oh, please don't be ashamed! You're not a terrible parent at all. Burnout is real, and you deserve a break. Of course I'll help. You're doing a great job—we all need support sometimes."
      },
      reflectionPrompt: "How does it feel to ask for time for yourself? What would change if you believed you deserve support and self-care?"
    },
    {
      id: 4,
      title: "Financial Support",
      situation: "You're facing unexpected financial stress. Bills are piling up, and you're worried about making ends meet this month. You know you need help, but asking for financial support feels really difficult.",
      context: "You need to ask a trusted family member or friend for temporary financial assistance.",
      responses: [
        
        {
          id: 'hesitant',
          label: 'Hesitant Request',
          text: "I hate to ask this, and I'm so embarrassed, but I'm in a really tight spot financially right now. I don't know what else to do. Could you maybe help me out? I promise I'll pay you back somehow...",
          explanation: "This request is vague about the amount and repayment, and the embarrassment suggests you feel shame about your situation. The lack of specifics makes it harder for the person to respond appropriately.",
          emoji: "😕",
          color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'ashamed',
          label: 'Ashamed Request',
          text: "I've really messed up with money and I'm a complete failure. I'm so ashamed to even ask, but I don't know what else to do. Could you help me? I feel like such a loser for needing this.",
          explanation: "This request is filled with self-criticism and shame. The extreme self-judgment can make the helper feel they need to rescue you rather than simply assist, which can strain the relationship and your own self-worth.",
          emoji: "😔",
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300"
        },
        {
          id: 'confident',
          label: 'Confident Request',
          text: "I'm facing some unexpected financial challenges this month and could use some temporary help. I know this is a big ask, but would you be able to loan me [specific amount]? I have a plan to pay it back by [date].",
          explanation: "This request is clear, specific, and includes a repayment plan. You're being transparent and responsible, which shows respect for both yourself and the person you're asking.",
          emoji: "✅",
          color: "from-green-500 to-emerald-600",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300"
        },
      ],
      correctChoice: "confident",
      simulatedResponse: {
        confident: "I understand. Financial stress is really hard. I can help with that amount, and your repayment plan sounds reasonable. Let's make sure you're okay, and we can work this out together. No judgment—we've all been there.",
        hesitant: "Oh, of course. I'll help. How much do you need? And don't worry about paying me back right away—just take care of yourself first...",
        ashamed: "Please don't be so hard on yourself. You're not a failure or a loser. Financial struggles happen to everyone. Of course I'll help. Let's figure this out together, and please don't feel ashamed—you're doing the best you can."
      },
      reflectionPrompt: "What makes asking for financial help feel difficult? How does being clear and confident change the interaction?"
    },
    {
      id: 5,
      title: "Emotional Support",
      situation: "You've been going through a really difficult time emotionally. Maybe it's a family crisis, relationship stress, or personal struggle. You need someone to talk to and feel supported, but you worry about burdening others.",
      context: "You want to reach out to a friend or family member to ask if they can spend some time listening and supporting you.",
      responses: [
        {
          id: 'confident',
          label: 'Confident Request',
          text: "I've been going through a tough time lately and could really use someone to talk to. Would you be available to spend some time with me this week? I'd really value your support and perspective.",
          explanation: "This request is clear about your emotional need and acknowledges that support is valuable. You're not apologizing for having feelings or needing connection, which shows healthy emotional awareness.",
          emoji: "✅",
          color: "from-green-500 to-emerald-600",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300"
        },
        {
          id: 'hesitant',
          label: 'Hesitant Request',
          text: "I know you're probably busy, and I hate to bother you, but I've been having a hard time and I was wondering if maybe we could talk? I don't want to dump my problems on you...",
          explanation: "This request minimizes your emotional need and suggests you're a burden. The hesitation can make it harder for the person to know how to respond, and it reinforces the idea that emotions are inconvenient.",
          emoji: "😕",
          color: "from-yellow-500 to-orange-500",
          bgColor: "from-yellow-50 to-orange-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 'ashamed',
          label: 'Ashamed Request',
          text: "I'm sorry to even contact you, but I'm really struggling and I don't know what to do. I know I should be able to handle this myself, but I'm falling apart. Could you maybe talk to me? I feel so weak for needing this.",
          explanation: "This request includes shame about needing emotional support. The self-criticism suggests you see needing support as weakness, which can make helpers feel they need to fix you rather than simply be with you.",
          emoji: "😔",
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300"
        }
      ],
      correctChoice: "confident",
      simulatedResponse: {
        confident: "Of course! I'm here for you. Let's get together this week. I'm glad you reached out—that takes courage. Your feelings matter, and I want to support you. We'll get through this together.",
        hesitant: "Oh, you're not bothering me at all. Of course we can talk. When were you thinking? I'll make time...",
        ashamed: "Please don't apologize or feel weak. Needing support doesn't make you weak—it makes you human. I'm here for you, and I want to listen. Let's talk, and please know that asking for help is actually a sign of strength."
      },
      reflectionPrompt: "What beliefs do you hold about asking for emotional support? How can recognizing your needs be a sign of strength?"
    }
  ];

  const handleChoice = (responseId) => {
    setSelectedChoice(responseId);
    setShowResponse(true);
    if (responseId === scenarios[currentScenario].correctChoice) {
      setScore(prev => prev + 1);
    }
  };

  const handleContinue = () => {
    if (!showReflection) {
      setShowReflection(true);
    } else {
      // Move to next scenario or finish
      setShowResponse(false);
      setShowReflection(false);
      setReflection("");
      if (currentScenario < totalLevels - 1) {
        setCurrentScenario(prev => prev + 1);
      } else {
        setShowGameOver(true);
      }
    }
  };

  if (showGameOver) {
    const confidentCount = score;
    
    return (
      <ParentGameShell
        title={gameData?.title || "Ask for Help Simulation"}
        subtitle="Simulation Complete!"
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
                💪
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Ask for Help Simulation Complete!</h2>
              <p className="text-lg text-gray-600 mb-6">
                You practiced confident requests in {confidentCount} out of {totalLevels} scenarios.
              </p>
            </div>

            {/* Results Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-3xl font-bold text-blue-600">{score}/{totalLevels}</p>
                  <p className="text-sm text-gray-600">Confident Requests</p>
                </div>
              </div>
              <p className="text-center text-gray-700">
                {confidentCount >= 4 
                  ? "Excellent! You're practicing asking for help with confidence and wisdom. Keep it up—your support network is here for you."
                  : confidentCount >= 3
                  ? "Good progress! You're learning that asking for help is a sign of wisdom, not weakness. Keep practicing confident requests."
                  : "Keep practicing! Asking for help gets easier with practice. Remember: asking for help shows wisdom, not weakness."}
              </p>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-green-600" />
                Key Insights
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Confident Requests Work Better:</strong> When you ask clearly and directly without excessive apology, people respond more positively and willingly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Shame Blocks Connection:</strong> When you include self-criticism or shame in your request, it makes the interaction feel like a rescue rather than mutual support.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>You Deserve Support:</strong> Needing help is normal and human. Your support network wants to help—they just need you to ask clearly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Practice Makes It Easier:</strong> The more you practice asking for help confidently, the more natural it becomes. You're building a skill that strengthens relationships.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Asking for help doesn't show weakness; it shows wisdom. When you model asking for help confidently, you teach your children that it's okay to need support. You're showing them that strong people know when to reach out, that relationships are built on mutual support, and that asking for help is a skill worth practicing. Your courage to ask for help makes you a stronger parent, not a weaker one.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  const currentScenarioData = scenarios[currentScenario];
  const selectedChoiceData = currentScenarioData?.responses.find(r => r.id === selectedChoice);
  const simulatedResponse = currentScenarioData?.simulatedResponse[selectedChoice || ''];

  return (
    <ParentGameShell
      title={gameData?.title || "Ask for Help Simulation"}
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
            <div className="text-6xl mb-4">💪</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{currentScenarioData.title}</h2>
          </div>

          {/* Situation */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Situation</h3>
            <p className="text-gray-700 leading-relaxed mb-4">{currentScenarioData.situation}</p>
            <div className="bg-white rounded-lg p-4 border border-blue-300">
              <p className="text-gray-800 font-medium">{currentScenarioData.context}</p>
            </div>
          </div>

          {/* Response Options */}
          {!showResponse && (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">How would you ask for help?</h3>
              {currentScenarioData.responses.map((response, index) => (
                <motion.button
                  key={response.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChoice(response.id)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                    response.id === 'confident'
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 hover:border-green-400 hover:shadow-lg'
                      : response.id === 'hesitant'
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 hover:border-green-400 hover:shadow-lg'
                      : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 hover:border-green-400 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    
                  </div>
                  <p className="text-gray-700 leading-relaxed italic">"{response.text}"</p>
                </motion.button>
              ))}
            </div>
          )}

          {/* Simulated Response */}
          {showResponse && selectedChoiceData && !showReflection && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-gradient-to-br ${selectedChoiceData.bgColor} rounded-xl p-6 border-2 ${selectedChoiceData.borderColor} mb-6`}
            >
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-6 h-6 text-gray-700" />
                <h3 className="text-xl font-bold text-gray-800">Their Response</h3>
              </div>

              <div className="bg-white rounded-lg p-5 border border-gray-200 mb-4">
                <p className="text-gray-800 leading-relaxed italic mb-4">"{simulatedResponse}"</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">Why This Response:</h4>
                <p className="text-gray-700 leading-relaxed text-sm">{selectedChoiceData.explanation}</p>
              </div>

              {selectedChoice === currentScenarioData.correctChoice ? (
                <div className="bg-green-100 rounded-lg p-4 border border-green-300 mt-4">
                  <p className="text-green-800 font-semibold">
                    ✅ Excellent! You asked for help with confidence and clarity. Notice how the response was warm and willing.
                  </p>
                </div>
              ) : (
                <div className="bg-blue-100 rounded-lg p-4 border border-blue-300 mt-4">
                  <p className="text-blue-800 font-semibold mb-2">
                    💡 Remember: Confident requests lead to better responses. When you ask clearly without excessive apology or shame, people respond more positively.
                  </p>
                  <p className="text-blue-700 text-sm">
                    Notice how a confident request shows respect for both yourself and the person you're asking.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Reflection */}
          {showReflection && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-purple-600" />
                Reflection
              </h3>
              <p className="text-gray-700 mb-4 font-medium">{currentScenarioData.reflectionPrompt}</p>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Write your thoughts here..."
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-gray-800 min-h-[100px]"
              />
            </motion.div>
          )}

          {/* Continue Button */}
          {(showResponse || showReflection) && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {currentScenario < totalLevels - 1 ? (
                <>
                  {showReflection ? 'Continue to Next Scenario' : 'Continue Reflection'}
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  View Results
                  <CheckCircle className="w-5 h-5" />
                </>
              )}
            </motion.button>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Asking for help doesn't show weakness; it shows wisdom. Practice asking for help confidently—you'll find that people are often happy to support you when you ask clearly and directly.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default AskForHelpSimulation;

