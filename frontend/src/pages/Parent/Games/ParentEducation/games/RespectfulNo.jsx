import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Shield, CheckCircle, XCircle, AlertCircle, Heart } from "lucide-react";

const RespectfulNo = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-62";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 6;
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [totalCalmScore, setTotalCalmScore] = useState(0);
  const [totalGuiltScore, setTotalGuiltScore] = useState(0);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Scenarios about setting boundaries - choosing respectful "no" responses
  const scenarios = [
    {
      id: 1,
      title: "Extra Favor Request",
      situation: "A friend calls asking if you can help them move furniture this weekend. You're already exhausted from the week, and you had planned this weekend as family time. You feel pressure to say yes, but you're already overcommitted.",
      request: "Can you help me move some furniture this Saturday? I know you're busy, but I really need the help. It shouldn't take too long—maybe just a few hours?",
      responses: [
       
        {
          id: 'guilty-yes',
          label: 'Guilty "Yes"',
          text: "Oh... well, I guess I can try to make it work. I mean, I did have plans, but I can probably reschedule them. Yeah, sure, I'll help.",
          calmScore: 25,
          guiltScore: 85,
          explanation: "This response says yes out of guilt and people-pleasing. It ignores your own needs and boundaries, which leads to resentment and exhaustion.",
          outcome: "You end up resenting your friend and feeling exhausted. Your family feels disappointed, and you feel guilty about letting them down. Your boundaries become unclear."
        },
        {
          id: 'harsh-no',
          label: 'Harsh "No"',
          text: "No way. I'm too busy. You should have asked someone else. I have my own things to do. Figure it out yourself.",
          calmScore: 40,
          guiltScore: 60,
          explanation: "This response is firm but harsh and dismissive. While it sets a boundary, it damages the relationship and creates guilt about being unkind.",
          outcome: "You feel guilty about being harsh. Your friend feels hurt and rejected. The relationship suffers, and you may feel conflicted about your response."
        },
         {
          id: 'respectful-no',
          label: 'Respectful "No"',
          text: "I appreciate you thinking of me, and I'd love to help, but I've already committed to family time this weekend. I need to honor that commitment. I hope you find someone who can help!",
          calmScore: 90,
          guiltScore: 10,
          explanation: "This response sets a clear boundary while being kind and respectful. It acknowledges the request, explains your limitation, and maintains the relationship without guilt.",
          outcome: "You maintain your boundaries and family time. You feel calm and confident. Your friend understands your limit, and your relationship stays strong."
        },
      ],
      correctChoice: "respectful-no",
      whyItMatters: "A respectful 'No' protects your boundaries while maintaining relationships. When you say no with love and clarity, you respect both yourself and others."
    },
    {
      id: 2,
      title: "Screen Time Demand",
      situation: "Your child has already used their screen time for the day. They're begging for more, saying all their friends get more time, and promising to do extra chores if you say yes. You know they need to stick to the limit.",
      request: "Pleeease, can I just have 30 more minutes? All my friends get way more screen time than me! I'll do extra chores tomorrow, I promise! Just this once?",
      responses: [
        
        {
          id: 'guilty-yes',
          label: 'Guilty "Yes"',
          text: "Oh, fine. I guess 30 more minutes won't hurt. Just this once. But you better do those chores tomorrow!",
          calmScore: 30,
          guiltScore: 80,
          explanation: "This response gives in out of guilt or pressure, which weakens the boundary and teaches children that rules don't really matter.",
          outcome: "You feel guilty for breaking your own rule. Your child learns that boundaries are negotiable. Tomorrow they'll ask again, and the pattern continues."
        },
        {
          id: 'respectful-no',
          label: 'Respectful "No"',
          text: "I hear that you really want more screen time, and I understand it feels unfair when friends have different rules. Our rule is still one hour per day, and you've already used yours. Tomorrow is a new day, and you can have your screen time then.",
          calmScore: 85,
          guiltScore: 15,
          explanation: "This response acknowledges their feelings while firmly holding the boundary. It's kind and clear, without negotiation or guilt.",
          outcome: "You maintain the boundary calmly. Your child learns that rules are consistent and fair. They may be disappointed, but they understand and respect the limit."
        },
        {
          id: 'harsh-no',
          label: 'Harsh "No"',
          text: "No! Stop asking! I'm tired of hearing about it! The answer is no, and that's final! Go find something else to do and stop bothering me!",
          calmScore: 45,
          guiltScore: 70,
          explanation: "This response is firm but harsh and reactive. It sets the boundary but damages the relationship and creates guilt about your tone.",
          outcome: "You feel guilty about being harsh. Your child feels dismissed and may become resentful. The relationship feels strained, and they may push boundaries more out of defiance."
        }
      ],
      correctChoice: "respectful-no",
      whyItMatters: "When you say 'No' with respect and clarity, children learn that boundaries are about care, not control. Your calm 'No' teaches self-respect."
    },
    {
      id: 3,
      title: "Work Overcommitment",
      situation: "Your boss asks you to take on an extra project this week, even though you're already working late hours and feeling overwhelmed. You know saying yes means less time with your family, but you worry about saying no.",
      request: "I know you're busy, but we really need someone to take on this project. It would be great if you could handle it. It's important for the team, and I think you're the best person for it. Can you make it work?",
      responses: [
        {
          id: 'respectful-no',
          label: 'Respectful "No"',
          text: "I appreciate you thinking of me for this project, and I understand it's important. However, I'm already at capacity with my current commitments, and I need to maintain work-life balance for my family. I want to do quality work, and taking on more right now wouldn't be fair to the project or my existing responsibilities. Perhaps we could discuss this for next month?",
          calmScore: 90,
          guiltScore: 10,
          explanation: "This response is professional, clear, and respectful. It sets boundaries while offering an alternative, showing that 'no' doesn't mean never.",
          outcome: "You maintain your work-life balance. You feel confident and respected. Your boss understands your limits, and you maintain a professional relationship while protecting your priorities."
        },
        {
          id: 'guilty-yes',
          label: 'Guilty "Yes"',
          text: "Uh, yeah, I guess I can try to make it work. I mean, I am pretty busy, but I'll figure something out. I'll just have to work longer hours.",
          calmScore: 20,
          guiltScore: 90,
          explanation: "This response says yes out of fear, guilt, or people-pleasing. It ignores your own limits and leads to burnout and resentment.",
          outcome: "You feel exhausted and resentful. Your family feels neglected, and you feel guilty about letting them down. You may do lower quality work, and the pattern continues."
        },
        {
          id: 'harsh-no',
          label: 'Harsh "No"',
          text: "No! I'm already working too much! Why are you always asking me to do more? Can't you ask someone else? I have a family too, you know!",
          calmScore: 50,
          guiltScore: 75,
          explanation: "This response is reactive and defensive. While it sets a boundary, it creates conflict and guilt about the way you communicated.",
          outcome: "You feel guilty about your tone and worried about your job. Your boss may feel attacked. The relationship becomes strained, even though your boundary was valid."
        }
      ],
      correctChoice: "respectful-no",
      whyItMatters: "Professional boundaries protect both your career and your family. A respectful 'No' shows self-respect and earns respect from others."
    },
    {
      id: 4,
      title: "Last-Minute Social Invitation",
      situation: "A friend invites you to a party tonight, but you've been looking forward to a quiet evening at home. You're tired, and you know you need rest, but you feel bad saying no to a friend.",
      request: "Hey! We're having a last-minute get-together tonight. I know it's short notice, but it would be so fun if you could come! Everyone will be there. Can you make it?",
      responses: [
        
        {
          id: 'guilty-yes',
          label: 'Guilty "Yes"',
          text: "Oh, well... I guess I could come. I was planning to stay home, but I don't want to miss out. Yeah, I'll try to make it. I'll just be tired tomorrow.",
          calmScore: 25,
          guiltScore: 85,
          explanation: "This response says yes out of FOMO or guilt, ignoring your own needs. It leads to exhaustion and resentment.",
          outcome: "You end up exhausted and resentful. You don't enjoy the party because you're tired. Tomorrow you're even more tired, and you feel guilty for not taking care of yourself."
        },
        {
          id: 'harsh-no',
          label: 'Harsh "No"',
          text: "No, I can't. You always invite me at the last minute. Can't you give people more notice? I have plans already. Just invite someone else.",
          calmScore: 40,
          guiltScore: 70,
          explanation: "This response is defensive and critical. While it sets a boundary, it creates conflict and guilt about how you responded.",
          outcome: "You feel guilty about your tone. Your friend feels hurt and may stop inviting you. The friendship suffers, even though your boundary was reasonable."
        },
        {
          id: 'respectful-no',
          label: 'Respectful "No"',
          text: "Thank you so much for inviting me! That sounds like fun. I'm actually planning a quiet evening at home tonight—I really need some rest. I'd love to catch up soon though! Have a great time!",
          calmScore: 85,
          guiltScore: 15,
          explanation: "This response is warm and appreciative while clearly setting your boundary. It maintains the relationship without feeling guilty.",
          outcome: "You honor your need for rest and feel calm about your choice. Your friend understands, and you maintain a healthy friendship based on mutual respect for boundaries."
        },
      ],
      correctChoice: "respectful-no",
      whyItMatters: "Saying no to social events when you need rest is self-care. A respectful 'No' protects your energy while maintaining friendships."
    },
    {
      id: 5,
      title: "Extra Chore Request",
      situation: "Your child asks if you can help them with a school project tonight, but you've already helped them twice this week and you have your own work to do. You want to be supportive, but you also need to maintain boundaries.",
      request: "Can you help me with my science project tonight? I know you helped me before, but this part is really hard and I don't understand it. Please? I really need your help!",
      responses: [
        {
          id: 'respectful-no',
          label: 'Respectful "No"',
          text: "I understand this part is challenging, and I want you to succeed. I've already helped you twice this week, and I need to focus on my own work tonight. How about we sit together for 15 minutes so you can ask specific questions, and then you continue on your own? You're capable of figuring this out.",
          calmScore: 80,
          guiltScore: 20,
          explanation: "This response sets a boundary while still being supportive. It offers limited help and encourages independence, which builds confidence.",
          outcome: "You maintain your boundary while still being helpful. Your child feels supported but learns independence. You feel calm and confident in your parenting."
        },
        {
          id: 'guilty-yes',
          label: 'Guilty "Yes"',
          text: "Oh, fine. I'll help you. I guess I can stay up late. I want you to do well, so I'll just work on my stuff later.",
          calmScore: 30,
          guiltScore: 85,
          explanation: "This response says yes out of guilt, which enables dependence and doesn't teach problem-solving. It leads to resentment.",
          outcome: "You feel exhausted and resentful. Your child doesn't learn to problem-solve independently. You may feel guilty about your own work being delayed, and the pattern continues."
        },
        {
          id: 'harsh-no',
          label: 'Harsh "No"',
          text: "No! I'm done helping you! I've helped you twice already, and you need to figure it out yourself! I have my own work to do! Stop asking me!",
          calmScore: 45,
          guiltScore: 75,
          explanation: "This response is harsh and dismissive. While it sets a boundary, it creates guilt and may make your child feel unsupported.",
          outcome: "You feel guilty about being harsh. Your child feels unsupported and may struggle or give up. The relationship feels strained, and they may become reluctant to ask for help even when truly needed."
        }
      ],
      correctChoice: "respectful-no",
      whyItMatters: "Supporting independence is loving. A respectful 'No' that encourages self-reliance teaches children they're capable while maintaining your boundaries."
    },
    {
      id: 6,
      title: "Family Obligation",
      situation: "A family member asks you to host a large family dinner this weekend, even though you've been hosting frequently and you're feeling overwhelmed. You feel obligated to say yes, but you need a break.",
      request: "Can you host the family dinner this Sunday? We all love coming to your house, and you're so good at it. We'd really appreciate it if you could do it again this weekend.",
      responses: [
        {
          id: 'respectful-no',
          label: 'Respectful "No"',
          text: "I appreciate you thinking of our home for the dinner. I've hosted the last few times, and I need to take a break this weekend to recharge. Would someone else be willing to host this time? I'd be happy to bring a dish though!",
          calmScore: 85,
          guiltScore: 15,
          explanation: "This response sets a clear boundary while offering an alternative contribution. It's respectful and maintains family relationships without guilt.",
          outcome: "You protect your time and energy. You feel calm and respected. Family relationships stay strong, and others may step up to help more in the future."
        },
        {
          id: 'guilty-yes',
          label: 'Guilty "Yes"',
          text: "Oh, I guess I can do it. I am feeling a bit tired, but I don't want to disappoint anyone. Yeah, sure, I'll host it.",
          calmScore: 25,
          guiltScore: 90,
          explanation: "This response says yes out of obligation and people-pleasing, ignoring your own needs. It leads to exhaustion and resentment.",
          outcome: "You feel exhausted and resentful toward your family. You may feel unappreciated, and the pattern of always being asked continues because you never say no."
        },
        {
          id: 'harsh-no',
          label: 'Harsh "No"',
          text: "No! I'm done hosting! I always have to do everything around here! Why can't someone else do it for once? I'm not doing it!",
          calmScore: 40,
          guiltScore: 80,
          explanation: "This response is reactive and comes from built-up resentment. While it sets a boundary, it creates family conflict and guilt.",
          outcome: "You feel guilty about causing conflict. Family relationships become strained. While your boundary was needed, the way you expressed it creates hurt feelings."
        }
      ],
      correctChoice: "respectful-no",
      whyItMatters: "Family boundaries are important too. A respectful 'No' protects your energy and teaches others to respect your limits, making relationships healthier for everyone."
    }
  ];

  const currentScenarioData = scenarios[currentScenario];
  const currentCalmScore = selectedChoice ? currentScenarioData.responses.find(r => r.id === selectedChoice).calmScore : 0;
  const currentGuiltScore = selectedChoice ? currentScenarioData.responses.find(r => r.id === selectedChoice).guiltScore : 0;

  const handleChoice = (choiceId) => {
    if (selectedChoice) return; // Already answered

    const chosenResponse = currentScenarioData.responses.find(r => r.id === choiceId);
    setSelectedChoice(choiceId);
    setTotalCalmScore(prev => prev + chosenResponse.calmScore);
    setTotalGuiltScore(prev => prev + chosenResponse.guiltScore);

    if (choiceId === 'respectful-no') {
      setScore(prev => prev + 1);
    }

    setShowOutcome(true);
  };

  const handleNext = () => {
    setSelectedChoice(null);
    setShowOutcome(false);
    
    if (currentScenario < totalLevels - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentScenario(0);
    setSelectedChoice(null);
    setShowOutcome(false);
    setTotalCalmScore(0);
    setTotalGuiltScore(0);
    setScore(0);
    setShowGameOver(false);
  };

  // Calm vs Guilt Meter Component
  const CalmGuiltMeter = ({ calmScore, guiltScore }) => {
    return (
      <div className="space-y-4">
        {/* Calm Meter */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-700">Calm & Confident</span>
            </div>
            <span className="text-2xl font-bold text-green-600">{calmScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${calmScore}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${
                calmScore >= 80 ? 'from-green-400 to-emerald-500' 
                : calmScore >= 50 ? 'from-blue-400 to-indigo-500'
                : 'from-amber-400 to-orange-500'
              } rounded-full`}
            />
          </div>
        </div>

        {/* Guilt Meter */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-gray-700">Guilt & Resentment</span>
            </div>
            <span className="text-2xl font-bold text-red-600">{guiltScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${guiltScore}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${
                guiltScore >= 70 ? 'from-red-500 to-rose-600'
                : guiltScore >= 40 ? 'from-orange-500 to-red-500'
                : 'from-yellow-400 to-orange-500'
              } rounded-full`}
            />
          </div>
        </div>
      </div>
    );
  };

  if (showGameOver) {
    const averageCalm = Math.round(totalCalmScore / totalLevels);
    const averageGuilt = Math.round(totalGuiltScore / totalLevels);
    const allCorrect = score === totalLevels;

    return (
      <ParentGameShell
        title={gameData?.title || "The Respectful 'No'"}
        subtitle="Practice Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={allCorrect}
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
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Boundary Practice Complete!</h2>
              <p className="text-lg text-gray-600 mb-6">
                You've practiced setting boundaries with respect and clarity.
              </p>
            </div>

            {/* Final Meters */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Your Overall Balance</h3>
              <CalmGuiltMeter calmScore={averageCalm} guiltScore={averageGuilt} />
            </div>

            {/* Results Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Results Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white rounded-lg p-4">
                  <span className="text-gray-700">Respectful "No" Responses:</span>
                  <span className="font-bold text-green-600">{score} / {totalLevels}</span>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-4">
                  <span className="text-gray-700">Average Calm Score:</span>
                  <span className="font-bold text-green-600">{averageCalm}%</span>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-4">
                  <span className="text-gray-700">Average Guilt Score:</span>
                  <span className="font-bold text-red-600">{averageGuilt}%</span>
                </div>
              </div>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> When you say "No" with love, your "Yes" gains more power. Setting boundaries respectfully teaches your children that limits are about care, not control. When you model saying no with kindness and clarity, you show them how to set their own boundaries while maintaining relationships. Your respectful "No" protects your energy, models self-respect, and makes your "Yes" more meaningful. Children learn that boundaries are healthy and necessary, and they learn to respect both their own limits and others'.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "The Respectful 'No'"}
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

          {/* Request */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-6 h-6 text-blue-600" />
              <h4 className="text-lg font-bold text-gray-800">The Request:</h4>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-gray-800 leading-relaxed italic">
                "{currentScenarioData.request}"
              </p>
            </div>
          </div>

          {!showOutcome ? (
            /* Response Selection */
            <div className="space-y-4 mb-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Choose Your Response:</h4>
              {currentScenarioData.responses.map((response) => (
                <motion.button
                  key={response.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChoice(response.id)}
                  className="w-full bg-white border-2 border-gray-300 rounded-xl p-6 text-left hover:border-purple-400 hover:bg-purple-50 transition-all shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className={`rounded-full p-2 ${
                      response.id === 'respectful-no' ? 'bg-orange-100' 
                      : response.id === 'guilty-yes' ? 'bg-orange-100'
                      : 'bg-orange-100'
                    }`}>
                      {response.id === 'respectful-no' ? (
                        <AlertCircle className="w-6 h-6 text-orange-600" />
                      ) : response.id === 'guilty-yes' ? (
                        <AlertCircle className="w-6 h-6 text-orange-600" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-orange-600" />
                      )}
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
            /* Outcome Display */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 mb-6"
            >
              {selectedChoice && (
                <>
                  {/* Calm vs Guilt Meter */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">Calm vs Guilt Meter</h4>
                    <CalmGuiltMeter calmScore={currentCalmScore} guiltScore={currentGuiltScore} />
                  </div>

                  {/* Explanation */}
                  <div className={`bg-gradient-to-br rounded-xl p-6 border-2 ${
                    selectedChoice === 'respectful-no'
                      ? 'from-green-50 to-emerald-50 border-green-200'
                      : selectedChoice === 'guilty-yes'
                      ? 'from-red-50 to-rose-50 border-red-200'
                      : 'from-orange-50 to-amber-50 border-orange-200'
                  }`}>
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      {selectedChoice === 'respectful-no' ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span>Respectful "No" ✓</span>
                        </>
                      ) : selectedChoice === 'guilty-yes' ? (
                        <>
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span>Guilty "Yes"</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-orange-600" />
                          <span>Harsh "No"</span>
                        </>
                      )}
                    </h4>
                    <p className="text-gray-700 mb-4">
                      {currentScenarioData.responses.find(r => r.id === selectedChoice).explanation}
                    </p>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-sm text-gray-600 font-semibold mb-2">Outcome:</p>
                      <p className="text-gray-700">
                        {currentScenarioData.responses.find(r => r.id === selectedChoice).outcome}
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
                </>
              )}
            </motion.div>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> When you say "No" with love, your "Yes" gains more power. Setting boundaries respectfully teaches your children that limits are about care, not control.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default RespectfulNo;

