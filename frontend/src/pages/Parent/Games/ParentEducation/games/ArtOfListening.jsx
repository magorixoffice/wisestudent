import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Headphones, Volume2, VolumeX, Heart, CheckCircle } from "lucide-react";

const ArtOfListening = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-61";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [empathyScore, setEmpathyScore] = useState(0);
  const [totalEmpathyScore, setTotalEmpathyScore] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Scenarios with listening examples - now with 3 options each
  const scenarios = [
    {
      id: 1,
      title: "After School Story",
      situation: "Your child comes home excited and starts telling you about their day. They're talking fast, gesturing, and sharing a long story about what happened at school.",
      childSays: "Mom! Dad! Guess what happened today? First, we had art class and I made this really cool painting, and then at recess Sarah and I were playing tag, and she fell and scraped her knee, so I helped her go to the nurse, and then in science we learned about plants, and I got to water them, and my teacher said I did a great job, and then...",
      distractedListening: {
        response: "Uh-huh, that's nice. Can you tell me later? I'm trying to finish this email. Actually, have you finished your homework yet?",
        type: "distracted",
        explanation: "This response shows distracted listening—multi-tasking, interrupting, and not fully present. The parent is thinking about other things (email, homework) instead of listening to understand.",
        empathyScore: 2,
        outcome: "Your child feels dismissed and unimportant. They learn that sharing their experiences isn't valuable. They may stop sharing stories with you."
      },
      mindfulListening: {
        response: "Wow, sounds like you had a really eventful day! You helped Sarah when she got hurt, and you did well in science. That must have felt good. Tell me more about your painting—what did you make?",
        type: "mindful",
        explanation: "This response shows mindful listening—being present, acknowledging what was heard, reflecting back key points, and showing genuine interest. The parent is listening to understand, not just waiting for their turn to speak.",
        empathyScore: 10,
        outcome: "Your child feels heard and valued. They sense your genuine interest and continue sharing. This builds connection and trust."
      },
      balancedResponse: {
        response: "That sounds like a lot happened today! Why don't you tell me about your painting first, and then we can go over everything else after dinner when I can give you my full attention?",
        type: "balanced",
        explanation: "This response acknowledges the child's excitement and validates their experience, but sets a realistic expectation about timing due to other commitments. It balances attention with practical constraints.",
        empathyScore: 8,
        outcome: "Your child feels acknowledged but may feel slightly disappointed that they can't share everything right now."
      }
    },
    {
      id: 2,
      title: "Bedtime Worries",
      situation: "It's bedtime and your child seems worried. They're sharing concerns about something that's bothering them.",
      childSays: "I'm scared about tomorrow. What if I mess up my presentation? Everyone will laugh at me. I practiced, but I keep forgetting what to say. What if I forget everything and just stand there?",
      distractedListening: {
        response: "You'll be fine. Just go to sleep. Worrying about it won't help. I'm sure you'll do great. Now get some rest—you need your sleep.",
        type: "distracted",
        explanation: "This response shows distracted listening—rushing to reassure without truly hearing the worry, trying to move past the emotion quickly, and not being fully present with the child's concern.",
        empathyScore: 3,
        outcome: "Your child feels like their worries aren't valid or important. They may feel dismissed and keep their concerns to themselves. The worry may intensify."
      },
      mindfulListening: {
        response: "I can hear how worried you are about your presentation. The fear of forgetting or being laughed at feels really scary right now. That must feel overwhelming. Want to talk about what's making you feel this way? I'm here to listen.",
        type: "mindful",
        explanation: "This response shows mindful listening—acknowledging the worry, naming the specific fears, and being fully present with the child's emotional experience. The parent is listening to understand, not just to fix.",
        empathyScore: 8,
        outcome: "Your child feels heard and understood. Having their worry validated often reduces its intensity. They feel safe to share more and process their concerns."
      },
      balancedResponse: {
        response: "It's normal to feel nervous about presentations. How about we practice a little more now, and then you can tell me what would help you feel more prepared? We can also talk about what you'll do if you do forget something.",
        type: "balanced",
        explanation: "This response acknowledges the worry but also offers practical support and problem-solving. It validates feelings while providing tools to address the concern.",
        empathyScore: 10,
        outcome: "Your child feels heard and supported with practical solutions. They gain confidence through preparation and contingency planning."
      }
    },
    {
      id: 3,
      title: "Friend Conflict",
      situation: "Your child comes to you after a conflict with a friend. They're upset and need to talk.",
      childSays: "I'm so mad at Jake! He said I couldn't play soccer with them because I'm not good enough. He said I always mess up the game. I practiced all week, but he still won't let me play. It's not fair!",
      mindfulListening: {
        response: "You're feeling really hurt and angry because Jake said you weren't good enough and excluded you. That must have felt really painful, especially since you've been practicing. That rejection hurts. Tell me more about how that felt.",
        type: "mindful",
        explanation: "This response shows mindful listening—fully hearing the emotional experience (hurt, anger), reflecting back what was heard, and creating space for the child to express more. The parent is listening to understand the feelings first.",
        empathyScore: 10,
        outcome: "Your child feels deeply understood and validated. Their hurt is acknowledged, which helps them process it. They feel safe to share more and may be more open to solutions later."
      },
      distractedListening: {
        response: "Well, maybe you should practice more then. Or find other friends to play with. Don't let it bother you—kids can be mean sometimes. Just move on.",
        type: "distracted",
        explanation: "This response shows distracted listening—immediately offering solutions without first acknowledging the hurt, not fully hearing the emotional pain, and rushing to fix instead of understand.",
        empathyScore: 3,
        outcome: "Your child feels like their hurt isn't important. They may feel judged or not understood. The emotional pain remains unprocessed."
      },
      
      balancedResponse: {
        response: "That really hurt, didn't it? I understand why you're angry. At the same time, maybe Jake has some concerns about team dynamics. Would you like to talk about other ways to connect with friends or improve your skills?",
        type: "balanced",
        explanation: "This response acknowledges the hurt feelings while also introducing perspective-taking and problem-solving. It validates emotions while encouraging growth and alternative approaches.",
        empathyScore: 8,
        outcome: "Your child feels heard but may feel like their emotional needs are being overshadowed by problem-solving suggestions."
      }
    },
    {
      id: 4,
      title: "Excitement Sharing",
      situation: "Your child is bursting with excitement about something they discovered or accomplished.",
      childSays: "Dad! Look what I made! I spent the whole afternoon working on this, and I figured out how to make it work! It was so hard at first, but I kept trying, and then I finally got it! Do you see how it moves? Isn't it cool?",
      distractedListening: {
        response: "Yeah, that's cool. Good job. Hey, can you help me with something? I need to clean up the garage. Also, did you finish your chores yet?",
        type: "distracted",
        explanation: "This response shows distracted listening—giving minimal acknowledgment, immediately redirecting to other tasks, and not being fully present with the child's excitement and accomplishment.",
        empathyScore: 2,
        outcome: "Your child's excitement is dampened. They feel like their accomplishment isn't important. They may stop sharing their successes with you."
      },
      mindfulListening: {
        response: "Wow! You spent the whole afternoon on this and you figured it out yourself! That persistence paid off. I can see how proud you are. Show me how it works—I'd love to see what you created!",
        type: "mindful",
        explanation: "This response shows mindful listening—being fully present with the child's excitement, acknowledging their effort and persistence, and showing genuine interest in what they've accomplished. The parent is listening to celebrate, not just acknowledge.",
        empathyScore: 8,
        outcome: "Your child feels celebrated and valued. Their excitement is matched, which amplifies their joy and sense of accomplishment. They feel seen and important."
      },
      balancedResponse: {
        response: "That's amazing! You put so much effort into this. I can see how excited you are. Let me finish what I'm doing here, and then I'll come over and you can show me everything it does, okay?",
        type: "balanced",
        explanation: "This response acknowledges the child's excitement and accomplishment while setting a realistic timeframe for full attention. It validates the achievement while managing practical responsibilities.",
        empathyScore: 10,
        outcome: "Your child feels acknowledged and knows their achievement will be celebrated soon. They learn patience while still feeling valued."
      }
    },
    {
      id: 5,
      title: "Frustration at Homework",
      situation: "Your child is struggling with homework and expressing frustration. They need to be heard.",
      childSays: "I don't understand this math problem at all! I've been trying for an hour and nothing makes sense! The teacher explained it, but I still don't get it. I'm so frustrated! I feel stupid!",
      distractedListening: {
        response: "Well, let's just get through it. Here, let me show you how to do it. Just follow these steps. You're not stupid—just focus and try harder.",
        type: "distracted",
        explanation: "This response shows distracted listening—rushing to solve the problem without first acknowledging the frustration and emotional experience. The parent is focused on fixing, not understanding.",
        empathyScore: 4,
        outcome: "Your child's frustration isn't validated. They may feel rushed or not understood. The emotional block to learning remains unaddressed."
      },
      mindfulListening: {
        response: "I can hear how frustrated you are. You've been working on this for an hour and nothing is clicking. That feeling of being stuck and confused must be really discouraging. The frustration is real, and it makes sense. Want to take a short break and then we can look at it together when you're ready?",
        type: "mindful",
        explanation: "This response shows mindful listening—acknowledging the frustration, validating the struggle, and being present with the emotional experience before offering help. The parent is listening to understand the feelings first, then offering support.",
        empathyScore: 10,  // Mindful listening is the best response
        outcome: "Your child feels understood and validated. Their frustration is acknowledged, which often reduces it. They feel supported and may be more open to learning once their emotions are heard."
      },
      balancedResponse: {
        response: "This is really frustrating for you, and I can see you've been working hard on it. Let's take a 5-minute break, and then I'll help you work through it step by step. Sometimes a fresh look helps a lot.",
        type: "balanced",
        explanation: "This response acknowledges the child's frustration and effort, validates their feelings, and provides practical support with a structured approach. It balances emotional validation with problem-solving.",
        empathyScore: 8,
        outcome: "Your child feels heard and supported with a practical plan, though emotional validation is secondary to problem-solving."
      }
    }
  ];

  const currentScenarioData = scenarios[currentScenario];
  const [speechSynth, setSpeechSynth] = useState(null);

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      setSpeechSynth(window.speechSynthesis);
    }
  }, []);

  const playAudio = (text, type) => {
    if (!speechSynth) return;

    // Stop any ongoing speech
    speechSynth.cancel();

    setIsPlayingAudio(true);
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Use different voices/rates for different types
    if (type === 'child') {
      utterance.rate = 0.95; // Slightly slower for child voice
      utterance.pitch = 1.1; // Slightly higher pitch
    } else {
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
    }

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    speechSynth.speak(utterance);
  };

  const stopAudio = () => {
    if (speechSynth) {
      speechSynth.cancel();
      setIsPlayingAudio(false);
    }
  };

  const handleChoice = (choice) => {
    if (selectedChoice) return; // Already answered

    const selected = currentScenarioData[choice];
    setSelectedChoice(choice);
    setEmpathyScore(selected.empathyScore);
    setTotalEmpathyScore(prev => prev + selected.empathyScore);

    // Update scoring logic to check if the choice has the highest empathy score among options
    const maxEmpathyScore = Math.max(
      currentScenarioData.distractedListening.empathyScore,
      currentScenarioData.mindfulListening.empathyScore,
      currentScenarioData.balancedResponse.empathyScore
    );
    
    if (selected.empathyScore === maxEmpathyScore) {
      setScore(prev => prev + 1);
    }

    setShowOutcome(true);
  };

  const handleNext = () => {
    setSelectedChoice(null);
    setShowOutcome(false);
    setEmpathyScore(0);
    stopAudio();
    
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
    setEmpathyScore(0);
    setTotalEmpathyScore(0);
    setScore(0);
    setShowGameOver(false);
    stopAudio();
  };

  if (showGameOver) {
    const finalEmpathyScore = totalEmpathyScore;
    const maxPossibleScore = totalLevels * 10;
    const empathyPercentage = Math.round((finalEmpathyScore / maxPossibleScore) * 100);
    const allCorrect = score === totalLevels;

    return (
      <ParentGameShell
        title={gameData?.title || "The Art of Listening"}
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
                🎧
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Listening Practice Complete!</h2>
              <p className="text-lg text-gray-600 mb-6">
                You've practiced the art of thoughtful, empathetic listening.
              </p>
            </div>

            {/* Empathy Score */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Your Empathy Score</h3>
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-blue-600 mb-2">{empathyPercentage}%</div>
                <div className="text-gray-600 mb-4">
                  {finalEmpathyScore} / {maxPossibleScore} points
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${empathyPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-4 rounded-full ${
                      empathyPercentage >= 80
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                        : empathyPercentage >= 60
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                        : 'bg-gradient-to-r from-amber-500 to-orange-600'
                    }`}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {empathyPercentage >= 80
                    ? "Excellent! You're practicing empathetic and thoughtful listening."
                    : empathyPercentage >= 60
                    ? "Good job! You're learning to listen with presence and empathy."
                    : "Keep practicing! Thoughtful listening is a skill that grows with awareness."}
                </p>
              </div>
            </div>

            {/* Results Summary */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Results Summary</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <span className="text-gray-700">Thoughtful Listening Responses:</span>
                  <span className="font-bold text-green-600">{score} / {totalLevels}</span>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <span className="text-gray-700">Total Empathy Points:</span>
                  <span className="font-bold text-blue-600">{finalEmpathyScore}</span>
                </div>
              </div>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Listening to understand is more powerful than listening to reply. When you practice thoughtful listening—being fully present, acknowledging what you hear, and reflecting back emotions—you create deep connection with your children. They feel heard, valued, and understood. This doesn't mean you never offer advice or solutions—it means you listen first to understand their experience, then respond from a place of empathy. Your thoughtful listening teaches your children how to listen to others and themselves.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "The Art of Listening"}
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

          {/* Child's Speech */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Headphones className="w-6 h-6 text-blue-600" />
              <h4 className="text-lg font-bold text-gray-800">Your Child Says:</h4>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200 mb-4">
              <p className="text-gray-800 leading-relaxed italic">
                "{currentScenarioData.childSays}"
              </p>
            </div>
            <div className="flex items-center justify-center gap-4">
              {isPlayingAudio ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopAudio}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
                >
                  <VolumeX className="w-5 h-5" />
                  Stop Audio
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => playAudio(currentScenarioData.childSays, 'child')}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
                >
                  <Volume2 className="w-5 h-5" />
                  Listen to Audio
                </motion.button>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800 font-medium">
              <strong>📋 Instructions:</strong> Choose the response that shows the most thoughtful listening—mindful, active listening that understands vs. distracted listening that multi-tasks or rushes to reply vs. a balanced approach that considers practical constraints.
            </p>
          </div>

          {!showOutcome ? (
            /* Choice Selection - 3 Options */
            <div className="space-y-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoice('distractedListening')}
                className="w-full bg-white border-2 border-gray-300 rounded-xl p-6 text-left hover:border-red-400 hover:bg-red-50 transition-all shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 rounded-full p-2">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 mb-2">Response A:</h4>
                    <p className="text-gray-700 italic">
                      "{currentScenarioData.distractedListening.response}"
                    </p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoice('mindfulListening')}
                className="w-full bg-white border-2 border-gray-300 rounded-xl p-6 text-left hover:border-green-400 hover:bg-green-50 transition-all shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 rounded-full p-2">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 mb-2">Response B: </h4>
                    <p className="text-gray-700 italic">
                      "{currentScenarioData.mindfulListening.response}"
                    </p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoice('balancedResponse')}
                className="w-full bg-white border-2 border-gray-300 rounded-xl p-6 text-left hover:border-blue-400 hover:bg-blue-50 transition-all shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 rounded-full p-2">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 mb-2">Response C: </h4>
                    <p className="text-gray-700 italic">
                      "{currentScenarioData.balancedResponse.response}"
                    </p>
                  </div>
                </div>
              </motion.button>
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
                  {/* Empathy Score Display */}
                  <div className={`bg-gradient-to-br rounded-xl p-6 border-2 ${
                    selectedChoice === 'mindfulListening'
                      ? 'from-green-50 to-emerald-50 border-green-200'
                      : selectedChoice === 'balancedResponse'
                      ? 'from-blue-50 to-indigo-50 border-blue-200'
                      : 'from-red-50 to-rose-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Heart className={`w-8 h-8 ${
                        selectedChoice === 'mindfulListening' ? 'text-green-600' : 
                        selectedChoice === 'balancedResponse' ? 'text-blue-600' : 'text-red-600'
                      }`} />
                      <div className="text-center">
                        <div className={`text-3xl font-bold mb-1 ${
                          selectedChoice === 'mindfulListening' ? 'text-green-600' : 
                          selectedChoice === 'balancedResponse' ? 'text-blue-600' : 'text-red-600'
                        }`}>
                          {empathyScore} / 10
                        </div>
                        <div className="text-gray-600">Empathy Score</div>
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <CheckCircle className={`w-5 h-5 ${
                        selectedChoice === 'mindfulListening' ? 'text-green-600' : 
                        selectedChoice === 'balancedResponse' ? 'text-blue-600' : 'text-red-600'
                      }`} />
                      {selectedChoice === 'mindfulListening' ? 'Mindful Listening ✓' : 
                       selectedChoice === 'balancedResponse' ? 'Balanced Response ✓' : 'Distracted Listening'}
                    </h4>
                    <p className="text-gray-700 mb-4">
                      {currentScenarioData[selectedChoice].explanation}
                    </p>
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <p className="text-sm text-gray-600 font-semibold mb-2">Outcome:</p>
                      <p className="text-gray-700">
                        {currentScenarioData[selectedChoice].outcome}
                      </p>
                    </div>
                  </div>
                </>
              )}

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
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Listening to understand is more powerful than listening to reply. When you practice thoughtful listening, you create deep connection with your children.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default ArtOfListening;

