import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Pause, Zap, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const PausePracticeSimulation = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-18";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [showOutcome, setShowOutcome] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Teacher-specific scenarios
  const scenarios = [
    {
      id: 1,
      title: "Angry Parent",
      situation: "A parent storms into your classroom after school, upset about their child's grade. They're raising their voice and questioning your teaching methods in front of other teachers.",
      
      redirectOutcome: {
        title: "You Redirected",
        description: "You acknowledged their concerns and suggested: 'I understand your concern. Let's schedule a formal conference where we can discuss your child's progress in detail with the principal present.'",
        result: "The parent appreciated the structured approach and agreed to the scheduled meeting. The immediate tension was reduced and you had time to prepare. You felt strategic but also delayed resolution.",
        emoji: "🔄",
        color: "from-yellow-500 to-amber-600",
        bgColor: "from-yellow-50 to-amber-50",
        borderColor: "border-yellow-400"
      },
      reactOutcome: {
        title: "You Reacted Immediately",
        description: "You immediately defended yourself: 'I've been teaching for years! Your child needs to work harder. This is not my fault!'",
        result: "The situation escalated. The parent became more angry, other teachers got involved, and the principal had to intervene. You felt defensive and exhausted, and the relationship was damaged.",
        emoji: "💥",
        color: "from-red-500 to-rose-600",
        bgColor: "from-red-50 to-rose-50",
        borderColor: "border-red-400"
      },
      pauseOutcome: {
        title: "You Paused → Breathed → Responded",
        description: "You took a deep breath, maintained eye contact, and said calmly: 'I can see you're concerned about your child's progress. Let's sit down and discuss this together. I'd like to understand your perspective.'",
        result: "The parent calmed down. You had a productive conversation, found common ground, and created a plan together. The relationship improved, and you felt professional and in control.",
        emoji: "🤝",
        color: "from-green-400 to-emerald-500",
        bgColor: "from-green-50 to-emerald-50",
        borderColor: "border-green-300"
      },
      correctChoice: "pause",
      explanation: "Pausing allows you to respond professionally instead of defensively. Taking a breath gives you time to choose words that de-escalate and build understanding."
    },
    {
      id: 2,
      title: "Disruptive Class",
      situation: "Your class is completely out of control. Students are talking loudly, throwing paper, and ignoring your instructions. You've asked them to settle down three times, and they're getting worse.",
      pauseOutcome: {
        title: "You Paused → Breathed → Responded",
        description: "You stopped, took three deep breaths, and waited silently for 10 seconds. Then you said calmly: 'I need everyone's attention. Let's reset. Take a moment to breathe with me.'",
        result: "The silence caught their attention. Students settled down. You regained control without yelling, and the rest of the lesson went smoothly. You felt calm and effective.",
        emoji: "🧘",
        color: "from-green-400 to-emerald-500",
        bgColor: "from-green-50 to-emerald-50",
        borderColor: "border-green-300"
      },
      reactOutcome: {
        title: "You Reacted Immediately",
        description: "You shouted: 'That's ENOUGH! Everyone is getting detention! You're all being disrespectful!'",
        result: "The class got louder and more defiant. Students became defensive, and you spent the rest of the period in a power struggle. You felt frustrated and ineffective.",
        emoji: "😤",
        color: "from-red-500 to-rose-600",
        bgColor: "from-red-50 to-rose-50",
        borderColor: "border-red-400"
      },
      redirectOutcome: {
        title: "You Redirected",
        description: "You changed the activity entirely: 'Let's all stand up and do 10 jumping jacks to release some energy, then we'll tackle this challenge with fresh minds.'",
        result: "Students got their energy out physically and were more ready to focus. The disruptive behavior decreased and engagement increased. You felt creative but it took time away from academic content.",
        emoji: "🏃",
        color: "from-yellow-500 to-amber-600",
        bgColor: "from-yellow-50 to-amber-50",
        borderColor: "border-yellow-400"
      },
      correctChoice: "pause",
      explanation: "Pausing creates space for students to self-regulate. Your calm presence is more powerful than your voice. Silence can be more effective than shouting."
    },
    {
      id: 3,
      title: "Last-Minute Observation",
      situation: "Your principal walks into your classroom unannounced for an observation. You're in the middle of a lesson that's not going well, and students are off-task. You feel unprepared and anxious.",
      
      reactOutcome: {
        title: "You Reacted Immediately",
        description: "You panicked, started talking faster, and frantically tried to 'fix' everything at once. You interrupted students mid-sentence and changed the lesson abruptly.",
        result: "The situation became more chaotic. Students were confused, the lesson fell apart, and the principal saw you struggling. You felt embarrassed and unprofessional.",
        emoji: "😰",
        color: "from-red-500 to-rose-600",
        bgColor: "from-red-50 to-rose-50",
        borderColor: "border-red-400"
      },
      redirectOutcome: {
        title: "You Redirected",
        description: "You acknowledged the principal and immediately pivoted to a different activity you had prepared: 'Perfect timing! We're transitioning to our review activity that I think you'll enjoy observing.'",
        result: "You turned an unprepared moment into a showcase opportunity. The principal observed a well-prepared activity. You felt resourceful but also had to abandon your original lesson plan.",
        emoji: "🎯",
        color: "from-yellow-500 to-amber-600",
        bgColor: "from-yellow-50 to-amber-50",
        borderColor: "border-yellow-400"
      },
      pauseOutcome: {
        title: "You Paused → Breathed → Responded",
        description: "You took a moment, acknowledged the principal with a nod, and calmly redirected the class: 'I see we have a visitor. Let's show our best learning. Everyone, let's refocus on our task.'",
        result: "You handled the situation gracefully. The principal saw you adapt under pressure. Students responded well, and you demonstrated professional composure. You felt confident.",
        emoji: "✨",
        color: "from-green-400 to-emerald-500",
        bgColor: "from-green-50 to-emerald-50",
        borderColor: "border-green-300"
      },
      correctChoice: "pause",
      explanation: "Pausing helps you stay present and adapt calmly. When you pause, you can assess the situation and respond thoughtfully rather than reactively."
    }
    ,
    {
      id: 4,
      title: "Overwhelming Deadline",
      situation: "You have three major deadlines tomorrow, your personal life feels chaotic, and a colleague just asked you to cover their duty. You feel overwhelmed and your stress levels are rising rapidly.",
      
      reactOutcome: {
        title: "You Reacted Immediately",
        description: "You immediately agreed to help: 'Sure, I'll take care of it! I can handle everything, no problem!' while internally panicking.",
        result: "You overcommitted, felt completely overwhelmed, and couldn't deliver quality work on any fronts. You experienced burnout and resentment. You felt exhausted and stressed.",
        emoji: "😵",
        color: "from-red-500 to-rose-600",
        bgColor: "from-red-50 to-rose-50",
        borderColor: "border-red-400"
      },
      pauseOutcome: {
        title: "You Paused → Breathed → Responded",
        description: "You acknowledged your feelings, took a few deep breaths, and said: 'I understand this is important, but I'm currently at capacity. Can we discuss alternatives or find another solution?'",
        result: "You maintained your boundaries, avoided burnout, and preserved your wellbeing. Your colleague respected your limits and found another way. You felt empowered and in control.",
        emoji: "⚖️",
        color: "from-green-400 to-emerald-500",
        bgColor: "from-green-50 to-emerald-50",
        borderColor: "border-green-300"
      },
      redirectOutcome: {
        title: "You Redirected",
        description: "You suggested involving a third party: 'This sounds important. Let me connect you with Sarah who might have more availability today.'",
        result: "You successfully redirected the request to someone else who could help. You avoided overcommitment but also didn't fully address the root issue of your workload. You felt relieved temporarily.",
        emoji: "📤",
        color: "from-yellow-500 to-amber-600",
        bgColor: "from-yellow-50 to-amber-50",
        borderColor: "border-yellow-400"
      },
      correctChoice: "pause",
      explanation: "Pausing allows you to set healthy boundaries and communicate your limitations respectfully. It prevents overcommitment and protects your wellbeing."
    },
    {
      id: 5,
      title: "Difficult Conversation",
      situation: "You need to have a difficult conversation with a team member about their performance. You're feeling anxious about potential conflict and aren't sure how to approach it constructively.",
      pauseOutcome: {
        title: "You Paused → Breathed → Responded",
        description: "You took time to prepare, breathed deeply before the meeting, and approached with: 'I'd like to share some observations and work together on solutions for improvement.'",
        result: "The conversation remained professional and constructive. The team member appreciated your approach and was receptive to feedback. You felt confident and professional.",
        emoji: "🤝",
        color: "from-green-400 to-emerald-500",
        bgColor: "from-green-50 to-emerald-50",
        borderColor: "border-green-300"
      },
      reactOutcome: {
        title: "You Reacted Immediately",
        description: "You rushed into the conversation without preparation: 'We need to talk about your poor performance. This has to stop immediately!'",
        result: "The conversation became confrontational. The team member became defensive and the relationship was damaged. You felt frustrated and ineffective.",
        emoji: "🗣️",
        color: "from-red-500 to-rose-600",
        bgColor: "from-red-50 to-rose-50",
        borderColor: "border-red-400"
      },
      redirectOutcome: {
        title: "You Redirected",
        description: "You decided to involve HR or a mediator: 'This is important, and I think we could benefit from a neutral third party to guide this conversation constructively.'",
        result: "The conversation had oversight which ensured professionalism. However, the team member may have felt uncomfortable with the third party involvement. You felt safer but less autonomous.",
        emoji: "👥",
        color: "from-yellow-500 to-amber-600",
        bgColor: "from-yellow-50 to-amber-50",
        borderColor: "border-yellow-400"
      },
      correctChoice: "pause",
      explanation: "Pausing allows you to approach difficult conversations thoughtfully and constructively. Preparation and mindfulness lead to better outcomes."
    }
  ];

  const handleChoice = (choice) => {
    if (selectedChoices[currentScenario]) return; // Already answered

    const isCorrect = choice === scenarios[currentScenario].correctChoice;
    const selected = {
      scenario: currentScenario,
      choice: choice,
      isCorrect: isCorrect
    };

    setSelectedChoices(prev => ({
      ...prev,
      [currentScenario]: selected
    }));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowOutcome(true);
  };

  const handleViewComparison = () => {
    setShowComparison(true);
  };

  const handleNext = () => {
    setShowOutcome(false);
    setShowComparison(false);
    if (currentScenario < totalLevels - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const current = scenarios[currentScenario];
  const selected = selectedChoices[currentScenario];
  const progress = ((currentScenario + 1) / totalLevels) * 100;
  const outcome = selected ? 
    (selected.choice === 'pause' ? current.pauseOutcome : 
     selected.choice === 'react' ? current.reactOutcome : 
     current.redirectOutcome) : null;

  return (
    <TeacherGameShell
      title={gameData?.title || "Pause Practice Simulation"}
      subtitle={gameData?.description || "Train the habit of pausing before reacting to stress triggers"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentScenario + 0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        <motion.div
          key={currentScenario}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Scenario {currentScenario + 1} of {totalLevels}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
              />
            </div>
          </div>

          {!showOutcome ? (
            <>
              {/* Scenario description */}
              <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-orange-200">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {current.title}
                  </h2>
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <p className="text-xl text-gray-700 leading-relaxed">
                      {current.situation}
                    </p>
                  </div>
                </div>

                {/* Question */}
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-800 mb-2">
                    What do you do?
                  </p>
                  <p className="text-sm text-gray-600">
                    Choose your response in this moment
                  </p>
                </div>
              </div>

              {/* Choice buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Pause option */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChoice('pause')}
                  disabled={!!selected}
                  className={`
                    relative p-8 rounded-2xl border-2 transition-all text-left
                    ${selected
                      ? selected.choice === 'pause'
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg'
                        : 'bg-gray-50 border-gray-300 opacity-50'
                      : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300 hover:shadow-xl cursor-pointer'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">⏸️</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Pause
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Take 5 seconds to breathe and think before responding
                      </p>
                    </div>
                  </div>
                  {selected && selected.choice === 'pause' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4"
                    >
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </motion.div>
                  )}
                </motion.button>

                {/* React option */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChoice('react')}
                  disabled={!!selected}
                  className={`
                    relative p-8 rounded-2xl border-2 transition-all text-left
                    ${selected
                      ? selected.choice === 'react'
                        ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-400 shadow-lg'
                        : 'bg-gray-50 border-gray-300 opacity-50'
                      : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300 hover:shadow-xl cursor-pointer'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">⚡</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        React
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Respond immediately with your first instinct
                      </p>
                    </div>
                  </div>
                  {selected && selected.choice === 'react' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4"
                    >
                      <XCircle className="w-8 h-8 text-red-600" />
                    </motion.div>
                  )}
                </motion.button>

                {/* Redirect option */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChoice('redirect')}
                  disabled={!!selected}
                  className={`
                    relative p-8 rounded-2xl border-2 transition-all text-left
                    ${selected
                      ? selected.choice === 'redirect'
                        ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-400 shadow-lg'
                        : 'bg-gray-50 border-gray-300 opacity-50'
                      : 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300 hover:shadow-xl cursor-pointer'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">🔄</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Redirect
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Change direction or involve others to handle the situation
                      </p>
                    </div>
                  </div>
                  {selected && selected.choice === 'redirect' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4"
                    >
                      <AlertCircle className="w-8 h-8 text-yellow-600" />
                    </motion.div>
                  )}
                </motion.button>
              </div>
            </>
          ) : !showComparison ? (
            <>
              {/* Outcome Display */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.choice}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`bg-gradient-to-br ${outcome.bgColor} rounded-2xl p-8 border-2 ${outcome.borderColor} shadow-xl mb-6`}
                >
                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className={`inline-block text-6xl mb-4`}
                    >
                      {outcome.emoji}
                    </motion.div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                      {outcome.title}
                    </h2>
                    <div className="bg-white/80 rounded-xl p-6 mb-4">
                      <p className="text-lg text-gray-700 leading-relaxed">
                        {outcome.description}
                      </p>
                    </div>
                    <div className={`bg-gradient-to-r ${outcome.color} rounded-xl p-6 text-white`}>
                      <p className="text-lg font-semibold leading-relaxed">
                        {outcome.result}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* View Comparison Button */}
              <div className="flex justify-center mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewComparison}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5" />
                  Compare Both Outcomes
                </motion.button>
              </div>
            </>
          ) : (
            <>
              {/* Comparison View */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Outcome Comparison
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Pause Outcome */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`bg-gradient-to-br ${current.pauseOutcome.bgColor} rounded-2xl p-6 border-2 ${current.pauseOutcome.borderColor} shadow-lg`}
                  >
                    <div className="text-center mb-4">
                      <div className="text-5xl mb-3">{current.pauseOutcome.emoji}</div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {current.pauseOutcome.title}
                      </h4>
                    </div>
                    <div className="bg-white/80 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700 mb-3">
                        {current.pauseOutcome.description}
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {current.pauseOutcome.result}
                      </p>
                    </div>
                  </motion.div>
                
                  {/* React Outcome */}
                  <motion.div
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`bg-gradient-to-br ${current.reactOutcome.bgColor} rounded-2xl p-6 border-2 ${current.reactOutcome.borderColor} shadow-lg`}
                  >
                    <div className="text-center mb-4">
                      <div className="text-5xl mb-3">{current.reactOutcome.emoji}</div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {current.reactOutcome.title}
                      </h4>
                    </div>
                    <div className="bg-white/80 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700 mb-3">
                        {current.reactOutcome.description}
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {current.reactOutcome.result}
                      </p>
                    </div>
                  </motion.div>
                
                  {/* Redirect Outcome */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`bg-gradient-to-br ${current.redirectOutcome.bgColor} rounded-2xl p-6 border-2 ${current.redirectOutcome.borderColor} shadow-lg`}
                  >
                    <div className="text-center mb-4">
                      <div className="text-5xl mb-3">{current.redirectOutcome.emoji}</div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {current.redirectOutcome.title}
                      </h4>
                    </div>
                    <div className="bg-white/80 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700 mb-3">
                        {current.redirectOutcome.description}
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {current.redirectOutcome.result}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Explanation */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
                <h4 className="font-bold text-gray-800 mb-3">💡 Why Pausing Matters:</h4>
                <p className="text-gray-700 leading-relaxed">
                  {current.explanation}
                </p>
              </div>

              {/* Next Button */}
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {currentScenario < totalLevels - 1 ? "Next Scenario →" : "Complete Simulation"}
                </motion.button>
              </div>
            </>
          )}

          {/* Teacher Tip */}
          {showOutcome && (
            <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-900 mb-2">
                💡 Teacher Tip:
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                Reinforce the "Pause → Breathe → Respond" mantra. Practice this sequence daily: 
                When you feel triggered, pause (stop), breathe (take 3 deep breaths), then respond (choose your words thoughtfully). 
                Write this mantra on a sticky note at your desk. The more you practice, the more automatic it becomes. 
                Share this technique with colleagues—building a pause habit together creates a calmer school culture.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </TeacherGameShell>
  );
};

export default PausePracticeSimulation;

