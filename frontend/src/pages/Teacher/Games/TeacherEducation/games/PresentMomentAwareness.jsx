import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Clock, CheckCircle, AlertCircle, Sparkles, Target } from "lucide-react";

const PresentMomentAwareness = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-41";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showDrift, setShowDrift] = useState(false);
  const [showReturnButton, setShowReturnButton] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [reflection, setReflection] = useState("");
  const [selectedScenarios, setSelectedScenarios] = useState([]);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const scenarios = [
    {
      id: 1,
      title: "Morning Class - Student Question",
      presentMoment: "You're teaching a math lesson. A student raises their hand and asks: 'I don't understand this problem. Can you explain it again?'",
      thoughtInterruption: "Your mind drifts: 'Oh no, I explained this yesterday. Did I not explain it well enough? What will the principal think if students aren't understanding? And I still need to finish grading those papers from last week. I'm so behind...'",
      returnPrompt: "Return to Now",
      reflectionPrompt: "What helped you return to the present moment? Notice what it felt like to shift from worrying thoughts to being present with the student's question.",
      teacherTip: "Use 'Return to Now' silently before answering difficult questions. Take a breath, feel your feet on the floor, and then respond from the present moment."
    },
    {
      id: 2,
      title: "Staff Meeting - Discussion",
      presentMoment: "You're in a staff meeting. The principal is discussing the new curriculum changes for next semester. Colleagues are sharing their thoughts and concerns.",
      thoughtInterruption: "Your mind drifts: 'This is going to be so much work. I'm already overwhelmed. How will I manage this? And I still haven't responded to those parent emails. What if I can't keep up? What if I'm not good enough for this?'",
      returnPrompt: "Return to Now",
      reflectionPrompt: "How did returning to the present help you engage with the meeting? What changed when you shifted from worrying about the future to being present in the discussion?",
      teacherTip: "During meetings, when you notice your mind wandering to worries, silently say 'Return to Now' and bring your attention back to what's being said."
    },
    {
      id: 3,
      title: "Class Discussion - Student Shares",
      presentMoment: "A student is sharing a personal story during a class discussion about resilience. They're speaking slowly and thoughtfully, and the class is listening attentively.",
      thoughtInterruption: "Your mind drifts: 'I should check the time. We're running behind schedule. I need to make sure we cover all the material. What about the test next week? Will we have enough time? I'm worried about the pacing...'",
      returnPrompt: "Return to Now",
      reflectionPrompt: "What did you notice about being fully present with the student's story versus being preoccupied with the schedule? How did presence change the moment?",
      teacherTip: "When you notice your mind jumping ahead to future tasks, gently return to what's happening right now. The present moment matters most."
    },
    {
      id: 4,
      title: "Parent Conference - Conversation",
      presentMoment: "You're meeting with a parent to discuss their child's progress. The parent is sharing their concerns and asking questions about how to support their child at home.",
      thoughtInterruption: "Your mind drifts: 'I remember I had a difficult conversation with this parent last year. What if they bring that up? What if they're still upset? And I have another meeting right after this. I hope I have time...'",
      returnPrompt: "Return to Now",
      reflectionPrompt: "How did returning to the present moment help you listen to the parent's current concerns without getting caught in memories of the past?",
      teacherTip: "When past worries or future concerns arise, use 'Return to Now' to come back to the actual conversation happening in this moment."
    },
    {
      id: 5,
      title: "Student Presentation - Watching",
      presentMoment: "A student is giving a presentation on their research project. They've worked hard on it, and you can see they're nervous. They're explaining their findings to the class.",
      thoughtInterruption: "Your mind drifts: 'I should be taking notes for their grade. But I'm also thinking about the lesson plan for tomorrow. And I'm worried about that other student who's been struggling. I should check in with them. Wait, am I even listening to this presentation?'",
      returnPrompt: "Return to Now",
      reflectionPrompt: "What happened when you noticed your mind had drifted and returned your attention to the student's presentation? How did presence affect your ability to be fully engaged?",
      teacherTip: "Notice when your attention splits between tasks. Returning to now helps you fully engage with what's actually happening."
    }
  ];

  useEffect(() => {
    // Show the present moment first
    setShowDrift(false);
    setShowReturnButton(false);
    setShowReflection(false);
    setReflection("");
    
    // After 3 seconds, show the thought interruption
    const driftTimer = setTimeout(() => {
      setShowDrift(true);
      setShowReturnButton(true);
    }, 3000);

    return () => clearTimeout(driftTimer);
  }, [currentScenario]);

  const handleReturnToNow = () => {
    setShowReturnButton(false);
    setShowReflection(true);
    setScore(prev => prev + 1);
  };

  const handleReflectionChange = (e) => {
    setReflection(e.target.value);
  };

  const handleContinue = () => {
    if (!reflection.trim()) {
      alert("Please write a reflection before continuing.");
      return;
    }

    if (reflection.trim().length < 10) {
      alert("Please write at least 10 characters for your reflection.");
      return;
    }

    const scenarioData = {
      ...scenarios[currentScenario],
      reflection: reflection.trim(),
      returnedAt: new Date().toISOString()
    };

    setSelectedScenarios([...selectedScenarios, scenarioData]);

    // Reset and move to next scenario
    setReflection("");
    setShowReflection(false);
    setShowDrift(false);
    setShowReturnButton(false);

    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const current = scenarios[currentScenario];
  const progress = ((currentScenario + 1) / scenarios.length) * 100;

  return (
    <TeacherGameShell
      title={gameData?.title || "Present Moment Awareness"}
      subtitle={gameData?.description || "Train attention to stay in the present during class or meetings"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentScenario + 0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Scenario {currentScenario + 1} of {scenarios.length}</span>
                <span className="font-semibold">Score: {score}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                />
              </div>
            </div>

            {/* Scenario Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Target className="w-6 h-6 text-indigo-600" />
                {current.title}
              </h2>
            </div>

            {/* Present Moment */}
            <AnimatePresence mode="wait">
              {!showDrift && (
                <motion.div
                  key="present"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        Present Moment:
                      </h3>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {current.presentMoment}
                      </p>
                    </div>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-3 border border-blue-300">
                    <p className="text-sm text-blue-800 italic">
                      💡 Notice what's happening right now. Stay present with this moment.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Thought Interruption */}
              {showDrift && !showReflection && (
                <motion.div
                  key="drift"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4 mb-6"
                >
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-orange-900 mb-2">
                          Mind Drifting:
                        </h3>
                        <p className="text-gray-700 text-lg leading-relaxed italic">
                          {current.thoughtInterruption}
                        </p>
                      </div>
                    </div>
                    <div className="bg-orange-100 rounded-lg p-3 border border-orange-300">
                      <p className="text-sm text-orange-800">
                        ⚠️ Notice: Your attention has drifted from the present moment to worries about the past or future.
                      </p>
                    </div>
                  </div>

                  {/* Return to Now Button */}
                  {showReturnButton && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleReturnToNow}
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                      >
                        <Sparkles className="w-6 h-6" />
                        {current.returnPrompt}
                      </motion.button>
                      <p className="text-sm text-gray-500 mt-3">
                        Tap the button when you notice your mind has drifted
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Reflection */}
              {showReflection && (
                <motion.div
                  key="reflection"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-900 mb-2">
                        You Returned to Now! ✨
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {current.reflectionPrompt}
                      </p>
                      <textarea
                        value={reflection}
                        onChange={handleReflectionChange}
                        placeholder="Write your reflection here... (at least 10 characters)"
                        className="w-full h-32 p-4 border-2 border-green-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none resize-none text-gray-700"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        {reflection.length} characters (minimum 10 required)
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Continue Button */}
            {showReflection && (
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleContinue}
                  disabled={!reflection.trim() || reflection.trim().length < 10}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentScenario < scenarios.length - 1 ? 'Continue to Next Scenario →' : 'Complete & View Results'}
                </motion.button>
              </div>
            )}
          </div>
        )}

        {showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-6xl mb-6"
            >
              {score === scenarios.length ? '🌟' : score >= scenarios.length * 0.8 ? '✨' : '🧘'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Practice Complete!
            </h2>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                You practiced returning to the present moment {score} times across {scenarios.length} scenarios.
              </p>
              <p className="text-gray-600">
                Training your attention to stay present helps you respond effectively during class and meetings, rather than reacting from worry or distraction.
              </p>
            </div>

            {/* Summary of Scenarios */}
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 mb-6 text-left">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Your Practice Summary:
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedScenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className="bg-white rounded-lg p-4 border-2 border-indigo-200"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {scenario.title}
                        </h4>
                        <p className="text-sm text-gray-600 italic mb-2">
                          "{scenario.reflection}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <Target className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Use "Return to Now" silently before answering difficult questions. When a student asks a challenging question or when you're called on during a meeting, take a moment to silently say "Return to Now" to yourself. Feel your feet on the floor, take one deep breath, and bring your attention fully to the question being asked. This practice helps you respond thoughtfully from the present moment rather than reacting from anxiety or distraction. You can practice this anytime—before responding to an email, entering a challenging conversation, or making an important decision. The more you practice returning to now, the easier it becomes to stay present during class or meetings, which improves your ability to connect with students and colleagues authentically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default PresentMomentAwareness;

