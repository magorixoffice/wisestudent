import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Shield, Flame, Cloud, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

const BounceBackQuiz = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-51";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [responsePattern, setResponsePattern] = useState({
    resilient: 0,
    reactive: 0,
    withdrawn: 0
  });

  // 5 scenarios related to parenting setbacks
  const scenarios = [
    {
      id: 1,
      title: "The Argument",
      description: "You had a heated argument with your teenager about curfew. They stormed out, slammed the door, and you're left feeling like you've failed. You're both upset and communication broke down completely.",
      reactions: [
        
        {
          id: 'reactive',
          label: 'Reactive Response',
          text: "I'm going to text them immediately: 'You can't just walk out like that! Come back here right now! This disrespect is unacceptable.'",
          icon: Flame,
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300",
          description: "Reacting immediately from emotion often escalates conflict and prevents meaningful connection."
        },
        {
          id: 'withdrawn',
          label: 'Withdrawn Response',
          text: "I'll just let it go. There's no point talking to them when they're like this. I'll wait for them to come to me.",
          icon: Cloud,
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300",
          description: "Withdrawing can leave conflicts unresolved and signals to your child that repair isn't possible."
        },
        {
          id: 'resilient',
          label: 'Resilient Response',
          text: "I'm going to take a few minutes to calm down. Then I'll reach out and say: 'I know we're both upset. When you're ready, I'd like to talk about how we can both feel heard and find a solution together.'",
          icon: Shield,
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300",
          description: "Acknowledge the setback, regulate your emotions, and commit to repair. This shows resilience—bouncing back with intention."
        },
      ]
    },
    {
      id: 2,
      title: "Broken Trust",
      description: "You discovered your child lied to you about where they were after school. They were at a friend's house instead of the library as they said. You feel hurt and betrayed, and now you're questioning their honesty.",
      reactions: [
       
        {
          id: 'reactive',
          label: 'Reactive Response',
          text: "I'm going to ground them immediately: 'You lied to me! That's it—you're grounded for a month. No phone, no friends, nothing. I can't trust you anymore.'",
          icon: Flame,
         color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300",
          description: "Punishing without understanding can damage the relationship and doesn't address the underlying reason for the lie."
        },
         {
          id: 'resilient',
          label: 'Resilient Response',
          text: "I'm going to sit with them and say: 'I noticed you weren't at the library. I feel hurt because honesty is important in our relationship. I want to understand why you felt you needed to lie. Let's talk about trust and what we both need.'",
          icon: Shield,
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300",
          description: "Address the breach directly with empathy, seeking understanding rather than blame. This rebuilds trust through communication."
        },
        {
          id: 'withdrawn',
          label: 'Withdrawn Response',
          text: "I'll just stop trusting them. I won't ask where they're going anymore since they'll just lie anyway. I'll keep my distance.",
          icon: Cloud,
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300",
          description: "Withdrawing trust without addressing the issue can create distance and doesn't teach your child how to repair."
        }
      ]
    },
    {
      id: 3,
      title: "Missed Target",
      description: "You set a goal to have more patience with your child this week, but by Wednesday you'd already lost your temper twice. You feel disappointed in yourself and like you're failing as a parent.",
      reactions: [
       
        {
          id: 'reactive',
          label: 'Reactive Response',
          text: "I'm going to blame my child: 'This is impossible because they push all my buttons! If they'd just listen, I wouldn't get so frustrated. They make it so hard to be patient.'",
          icon: Flame,
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300",
          description: "Blaming others prevents self-reflection and growth. It keeps you stuck in reactive patterns."
        },
         {
          id: 'resilient',
          label: 'Resilient Response',
          text: "I'm going to acknowledge this: 'I set a goal and didn't meet it yet. That's okay—change is hard. Let me reflect on what happened and what I can learn. Tomorrow is a new day, and I'll try again with more self-compassion.'",
          icon: Shield,
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300",
          description: "Self-compassion and learning from setbacks builds resilience. Progress isn't linear—what matters is getting back up."
        },
        {
          id: 'withdrawn',
          label: 'Withdrawn Response',
          text: "I'll just give up on this goal. I'm clearly not cut out for this. I'll stop trying to change because it's not working anyway.",
          icon: Cloud,
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300",
          description: "Giving up after setbacks reinforces a fixed mindset. Resilience means continuing to try despite obstacles."
        }
      ]
    },
    {
      id: 4,
      title: "Public Meltdown",
      description: "Your child had a full meltdown in the grocery store—screaming, crying, lying on the floor. People were staring, and you felt embarrassed and overwhelmed. You left the store feeling defeated.",
      reactions: [
        {
          id: 'resilient',
          label: 'Resilient Response',
          text: "I'm going to process this: 'That was really hard, and I felt embarrassed. But my child was overwhelmed, and I did my best in that moment. Next time, I can prepare better and maybe leave earlier when they're getting tired. This doesn't define my parenting.'",
          icon: Shield,
         color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300",
          description: "Processing the event with self-compassion and learning from it builds resilience. You're allowed to have hard moments."
        },
        {
          id: 'reactive',
          label: 'Reactive Response',
          text: "I'm going to be angry at my child: 'You embarrassed me in front of everyone! That was so embarrassing. You need to learn to control yourself in public. I'm never taking you to the store again.'",
          icon: Flame,
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300",
          description: "Reacting from embarrassment can shame your child and doesn't address their underlying emotional needs."
        },
        {
          id: 'withdrawn',
          label: 'Withdrawn Response',
          text: "I'll just avoid taking them places for a while. It's easier to stay home than deal with this again. I'll isolate until they're older.",
          icon: Cloud,
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300",
          description: "Avoiding situations doesn't teach your child emotional regulation. It can reinforce isolation and fear."
        }
      ]
    },
    {
      id: 5,
      title: "School Struggle",
      description: "Your child's teacher called to say they're falling behind in class and not paying attention. You've been trying to help, but nothing seems to work. You feel like you're failing to support them academically.",
      reactions: [
        
        {
          id: 'reactive',
          label: 'Reactive Response',
          text: "I'm going to be strict: 'That's it—no more screens, no more free time. You're going to do extra homework every night until your grades improve. This is unacceptable.'",
          icon: Flame,
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300",
          description: "Reacting with punishment doesn't address the root cause and can create anxiety and resistance around learning."
        },
        {
          id: 'withdrawn',
          label: 'Withdrawn Response',
          text: "I'll just accept this is how they are. Some kids aren't good at school. There's nothing I can do about it, so I'll stop trying.",
          icon: Cloud,
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300",
          description: "Giving up sends the message that your child isn't capable of success. Resilience means finding new approaches when one doesn't work."
        },
        {
          id: 'resilient',
          label: 'Resilient Response',
          text: "I'm going to approach this collaboratively: 'This is tough, but let me reach out to the teacher and my child. I want to understand what's really going on—is it attention, learning style, or something else? Together, we can find solutions.'",
          icon: Shield,
          color: "from-red-500 to-rose-600",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-300",
          description: "Seeking understanding and collaboration builds resilience. You're not alone—schools and teachers are partners in supporting your child."
        },
      ]
    }
  ];

  const handleReactionSelect = (reactionId) => {
    if (selectedChoices[currentScenario]) return; // Already selected

    const newChoices = { ...selectedChoices, [currentScenario]: reactionId };
    setSelectedChoices(newChoices);

    // Update response pattern
    setResponsePattern(prev => ({
      ...prev,
      [reactionId]: prev[reactionId] + 1
    }));

    // If resilient response, increase score
    if (reactionId === 'resilient') {
      setScore(prev => prev + 1);
    }

    // Show feedback for this choice
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      // All scenarios completed
      setShowGameOver(true);
    }
  };

  const getOverallPattern = () => {
    const { resilient, reactive, withdrawn } = responsePattern;
    const max = Math.max(resilient, reactive, withdrawn);

    if (max === resilient && resilient >= 3) {  // Changed from >= 5 to >= 3 (majority of 5 questions)
      return {
        type: 'resilient',
        title: 'Resilient Pattern',
        description: 'You consistently choose to bounce back with compassion and intention. You acknowledge setbacks, learn from them, and commit to repair. This pattern shows strong emotional resilience.',
        icon: Shield,
        color: 'from-green-500 to-emerald-600',
        bgColor: 'from-green-50 to-emerald-50',
        message: 'You demonstrate that resilience isn\'t never falling—it\'s choosing to rise again with compassion.'
      };
    } else if (max === reactive) {
      return {
        type: 'reactive',
        title: 'Reactive Pattern',
        description: 'You tend to react immediately from emotion. While this comes from care, reactive responses can escalate conflicts and prevent meaningful connection. Learning to pause and regulate before responding can help.',
        icon: Flame,
        color: 'from-orange-500 to-amber-600',
        bgColor: 'from-orange-50 to-amber-50',
        message: 'Consider pausing before responding. Even a few seconds can help you choose resilience over reactivity.'
      };
    } else {
      return {
        type: 'withdrawn',
        title: 'Withdrawn Pattern',
        description: 'You tend to withdraw or avoid when facing setbacks. While sometimes we need space, consistent withdrawal can leave conflicts unresolved and create distance. Small steps toward connection can build resilience.',
        icon: Cloud,
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'from-blue-50 to-indigo-50',
        message: 'Even small steps toward connection after setbacks can build resilience. You don\'t have to fix everything at once.'
      };
    }
  };

  const currentScenarioData = scenarios[currentScenario];
  const selectedReaction = currentScenarioData?.reactions.find(r => r.id === selectedChoices[currentScenario]);

  if (showGameOver) {
    const pattern = getOverallPattern();
    const PatternIcon = pattern.icon;

    return (
      <ParentGameShell
        title={gameData?.title || "The Bounce-Back Quiz"}
        subtitle="Results Summary"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={score >= 3}  // Changed from >= 5 to >= 3 (majority of 5 questions)
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
              >
                <PatternIcon className={`w-20 h-20 mx-auto mb-4 text-white bg-gradient-to-br ${pattern.color} rounded-full p-4`} />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{pattern.title}</h2>
              <div className={`inline-block bg-gradient-to-br ${pattern.bgColor} border-2 ${pattern.borderColor || 'border-gray-300'} rounded-xl p-4 mb-6`}>
                <p className="text-lg text-gray-700 font-medium">{pattern.message}</p>
              </div>
            </div>

            <div className={`bg-gradient-to-br ${pattern.bgColor} rounded-xl p-6 border-2 ${pattern.borderColor || 'border-gray-300'} mb-6`}>
              <p className="text-gray-700 mb-4">{pattern.description}</p>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{responsePattern.resilient}</p>
                  <p className="text-sm text-gray-600">Resilient</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Flame className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{responsePattern.reactive}</p>
                  <p className="text-sm text-gray-600">Reactive</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Cloud className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{responsePattern.withdrawn}</p>
                  <p className="text-sm text-gray-600">Withdrawn</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Resilience isn't never falling—it's choosing to rise again with compassion. Every setback is an opportunity to practice resilience. When you model bouncing back with self-compassion and intention, you teach your child that setbacks are part of growth, not proof of failure.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "The Bounce-Back Quiz"}
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
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Scenario {currentScenario + 1} of {totalLevels}</span>
              <span>{Math.round(((currentScenario + 1) / totalLevels) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentScenario + 1) / totalLevels) * 100}%` }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
              />
            </div>
          </div>

          {!showFeedback ? (
            /* Scenario card */
            <>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 mb-6 border-2 border-purple-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{currentScenarioData.title}</h3>
                <p className="text-gray-700 text-lg leading-relaxed">{currentScenarioData.description}</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">How would you respond to this setback?</h4>
                {currentScenarioData.reactions.map((reaction) => {
                  const IconComponent = reaction.icon;
                  return (
                    <motion.button
                      key={reaction.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleReactionSelect(reaction.id)}
                      disabled={!!selectedChoices[currentScenario]}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                        selectedChoices[currentScenario] === reaction.id
                          ? `${reaction.borderColor} bg-gradient-to-br ${reaction.bgColor} shadow-lg`
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${reaction.color} flex-shrink-0`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-gray-800 mb-2">{reaction.label}</h5>
                          <p className="text-gray-700">{reaction.text}</p>
                        </div>
                        {selectedChoices[currentScenario] === reaction.id && (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Feedback screen */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-gradient-to-br ${selectedReaction.bgColor} rounded-xl p-6 border-2 ${selectedReaction.borderColor} mb-6`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${selectedReaction.color} flex-shrink-0`}>
                  {React.createElement(selectedReaction.icon, { className: "w-6 h-6 text-white" })}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{selectedReaction.label}</h4>
                  <p className="text-gray-700 mb-4">{selectedReaction.description}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {currentScenario < scenarios.length - 1 ? (
                  <>
                    Next Scenario <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    View Results <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default BounceBackQuiz;

