import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Clock, CheckCircle, XCircle, ArrowUp, ArrowDown, AlertCircle } from "lucide-react";

const TimePressureSimulation = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-15";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [taskOrder, setTaskOrder] = useState([]);
  const [showOutcome, setShowOutcome] = useState(false);
  const [outcomeType, setOutcomeType] = useState(null); // 'calm' or 'chaos'
  const [reflection, setReflection] = useState("[]");
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState(0);
  const [questionScores, setQuestionScores] = useState(Array(5).fill(0)); // Track score for each question

  const allScenarios = [
    // Scenario 1: Time Pressure with Personal Emergency
    [
      {
        id: 'report',
        title: 'Class Report Due',
        description: 'Quarterly class performance report needs to be submitted by end of day',
        urgency: 'high',
        importance: 'high',
        icon: '📊',
        idealOrder: 2, // Second priority
        color: 'from-blue-500 to-cyan-500'
      },
      {
        id: 'child',
        title: 'Child Sick',
        description: 'Your child is unwell and needs immediate attention - call from school',
        urgency: 'critical',
        importance: 'critical',
        icon: '🏥',
        idealOrder: 1, // First priority
        color: 'from-red-500 to-pink-500'
      },
      {
        id: 'meeting',
        title: 'Meeting Now',
        description: 'Staff meeting starting in 5 minutes - your presence is expected',
        urgency: 'high',
        importance: 'medium',
        icon: '🤝',
        idealOrder: 3, // Third priority
        color: 'from-purple-500 to-indigo-500'
      }
    ],
    // Scenario 2: Parent Meeting Conflict
    [
      {
        id: 'parent-meeting',
        title: 'Parent Meeting',
        description: 'Important parent meeting scheduled for today - concerns about student behavior',
        urgency: 'high',
        importance: 'high',
        icon: '👥',
        idealOrder: 1, // First priority
        color: 'from-blue-500 to-cyan-500'
      },
      {
        id: 'admin-task',
        title: 'Admin Deadline',
        description: 'Curriculum documentation due to administration today',
        urgency: 'high',
        importance: 'medium',
        icon: '📋',
        idealOrder: 2, // Second priority
        color: 'from-purple-500 to-indigo-500'
      },
      {
        id: 'lesson-plan',
        title: 'Lesson Planning',
        description: 'Tomorrow\'s lesson plans need finalizing',
        urgency: 'medium',
        importance: 'high',
        icon: '📝',
        idealOrder: 3, // Third priority
        color: 'from-green-500 to-emerald-500'
      }
    ],
    // Scenario 3: Student Crisis
    [
      {
        id: 'student-crisis',
        title: 'Student Crisis',
        description: 'Student having emotional breakdown during class',
        urgency: 'critical',
        importance: 'critical',
        icon: '😰',
        idealOrder: 1, // First priority
        color: 'from-red-500 to-pink-500'
      },
      {
        id: 'grade-submission',
        title: 'Grade Submission',
        description: 'Quarterly grades due to office within the hour',
        urgency: 'high',
        importance: 'high',
        icon: '📈',
        idealOrder: 2, // Second priority
        color: 'from-blue-500 to-cyan-500'
      },
      {
        id: 'supply-order',
        title: 'Supply Order',
        description: 'Urgent supplies needed for tomorrow\'s activity',
        urgency: 'medium',
        importance: 'medium',
        icon: '📦',
        idealOrder: 3, // Third priority
        color: 'from-yellow-500 to-orange-500'
      }
    ],
    // Scenario 4: Substitute Teacher Issues
    [
      {
        id: 'substitute',
        title: 'Substitute Issues',
        description: 'Substitute teacher reports major classroom disruptions',
        urgency: 'high',
        importance: 'high',
        icon: '🏫',
        idealOrder: 1, // First priority
        color: 'from-orange-500 to-red-500'
      },
      {
        id: 'conference',
        title: 'Conference Prep',
        description: 'Parent-teacher conferences tomorrow - materials need preparation',
        urgency: 'medium',
        importance: 'high',
        icon: '📅',
        idealOrder: 2, // Second priority
        color: 'from-purple-500 to-indigo-500'
      },
      {
        id: 'grading',
        title: 'Grading Papers',
        description: 'Essays need grading for tomorrow\'s class discussion',
        urgency: 'low',
        importance: 'medium',
        icon: '✏️',
        idealOrder: 3, // Third priority
        color: 'from-green-500 to-teal-500'
      }
    ],
    // Scenario 5: Tech Problems & Safety
    [
      {
        id: 'tech-problem',
        title: 'Tech Problem',
        description: 'School-wide technology failure affecting online assessments',
        urgency: 'critical',
        importance: 'high',
        icon: '💻',
        idealOrder: 1, // First priority
        color: 'from-red-500 to-pink-500'
      },
      {
        id: 'safety-issue',
        title: 'Safety Issue',
        description: 'Potential safety concern reported in hallway',
        urgency: 'critical',
        importance: 'critical',
        icon: '🚨',
        idealOrder: 2, // Second priority
        color: 'from-orange-500 to-red-500'
      },
      {
        id: 'budget',
        title: 'Budget Deadline',
        description: 'Department budget proposal due today for next year',
        urgency: 'high',
        importance: 'medium',
        icon: '💰',
        idealOrder: 3, // Third priority
        color: 'from-yellow-500 to-amber-500'
      }
    ]
  ];
  
  const tasks = allScenarios[currentQuestion] || allScenarios[0];

  // Initialize task order
  React.useEffect(() => {
    if (taskOrder.length === 0) {
      setTaskOrder([...tasks].sort(() => Math.random() - 0.5));
    }
  }, [currentQuestion]);

  const handleTaskReorder = (index, direction) => {
    if (showOutcome) return;
    
    const newOrder = [...taskOrder];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setTaskOrder(newOrder);
  };

  const calculateOutcome = () => {
    // Check if order matches ideal prioritization
    const idealOrder = tasks.sort((a, b) => a.idealOrder - b.idealOrder);
    const currentOrderIds = taskOrder.map(t => t.id);
    const idealOrderIds = idealOrder.map(t => t.id);
    
    // Calculate match score
    let matchScore = 0;
    currentOrderIds.forEach((id, index) => {
      if (id === idealOrderIds[index]) {
        matchScore += 1;
      }
    });

    // Determine outcome based on scenario-specific criteria
    // For each scenario, prioritize the highest-idealOrder item (most critical) first
    const highestPriorityFirst = taskOrder[0].idealOrder === 1;
    
    // Standard scoring - if at least 2 tasks are in correct position OR most critical task is first
    if (matchScore >= 2) {
      return 'calm'; // Good prioritization
    } else if (highestPriorityFirst) { // Highest priority task first
      return 'calm'; // Key priority handled first
    } else {
      return 'chaos'; // Poor prioritization
    }
  };

  const handleSubmitOrder = () => {
    if (taskOrder.length !== 3) return;
    
    const outcome = calculateOutcome();
    setOutcomeType(outcome);
    setShowOutcome(true);
    
    // Update question score
    const newQuestionScores = [...questionScores];
    newQuestionScores[currentQuestion] = (outcome === 'calm') ? 1 : 0;
    setQuestionScores(newQuestionScores);
    
    // Update total score
    const totalScore = newQuestionScores.reduce((sum, val) => sum + val, 0);
    setScore(totalScore);
  };

  const handleComplete = () => {
    // Store reflection for current question
    const reflections = JSON.parse(reflection || "[]");
    reflections[currentQuestion] = reflections[currentQuestion] || "";
    
    if (reflections.filter(r => r && r.trim().length >= 10).length === allScenarios.length) {
      // All questions completed
      setShowGameOver(true);
    } else {
      // Move to next question
      if (currentQuestion < allScenarios.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setTaskOrder([...allScenarios[currentQuestion + 1]].sort(() => Math.random() - 0.5));
        setShowOutcome(false);
        setReflection(JSON.stringify(reflections));
        setCompletedQuestions(completedQuestions + 1);
      }
    }
  };

  const getOutcomeMessage = () => {
    if (outcomeType === 'calm') {
      return {
        title: "Balanced Decision-Making! ✨",
        description: "You prioritized effectively. By addressing your child's needs first, you created space to handle other tasks with clarity. This approach reduces stress and prevents chaos.",
        color: "from-green-500 to-emerald-500",
        bgColor: "from-green-50 to-emerald-50",
        borderColor: "border-green-200"
      };
    } else {
      return {
        title: "Time Pressure Creates Chaos ⚠️",
        description: "When urgent tasks aren't prioritized correctly, everything feels overwhelming. Taking care of personal emergencies first (like a sick child) actually helps you handle work tasks more effectively.",
        color: "from-orange-500 to-red-500",
        bgColor: "from-orange-50 to-red-50",
        borderColor: "border-orange-200"
      };
    }
  };

  const outcomeMessage = showOutcome ? getOutcomeMessage() : null;

  return (
    <TeacherGameShell
      title={gameData?.title || "Time Pressure Simulation"}
      subtitle={gameData?.description || "Learn balanced decision-making under time stress"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentQuestion + 0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showOutcome ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            {/* Scenario Introduction */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Time Pressure Scenario
                  </h2>
                </div>
                <p className="text-gray-700 text-lg mb-4">
                  Scenario {currentQuestion + 1}: You're facing multiple urgent demands right now. How will you prioritize?
                </p>
                <div className="bg-white/60 rounded-lg p-4 border border-orange-200">
                  <p className="text-sm text-gray-700">
                    <strong>⏰ Time Constraint:</strong> All tasks need attention, but you can only handle them one at a time. 
                    Choose the order that will lead to the calmest, most effective outcome.
                  </p>
                </div>
              </div>

              {/* Tasks to Prioritize */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                  Arrange Tasks by Priority (Top = First Priority)
                </h3>
                
                <div className="space-y-4">
                  {taskOrder.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-gradient-to-r ${task.color} rounded-xl p-6 shadow-lg border-2 border-white/50`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-3xl">
                            {task.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-xl font-bold text-white">
                                {index + 1}. {task.title}
                              </h4>
                              {task.urgency === 'critical' && (
                                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                  CRITICAL
                                </span>
                              )}
                            </div>
                            <p className="text-white/90 text-sm">
                              {task.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleTaskReorder(index, 'up')}
                            disabled={index === 0}
                            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                          >
                            <ArrowUp className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleTaskReorder(index, 'down')}
                            disabled={index === taskOrder.length - 1}
                            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                          >
                            <ArrowDown className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmitOrder}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <CheckCircle className="w-6 h-6" />
                  See Outcome
                </motion.button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Outcome Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={outcomeType}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className={`bg-gradient-to-br ${outcomeMessage.bgColor} rounded-2xl p-8 border-2 ${outcomeMessage.borderColor} shadow-xl`}
              >
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className={`inline-block w-24 h-24 rounded-full bg-gradient-to-br ${outcomeMessage.color} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    {outcomeType === 'calm' ? (
                      <CheckCircle className="w-12 h-12 text-white" />
                    ) : (
                      <XCircle className="w-12 h-12 text-white" />
                    )}
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">
                    {outcomeMessage.title}
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
                    {outcomeMessage.description}
                  </p>
                </div>

                {/* Animated Outcome Visualization */}
                <div className="bg-white/60 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                    Your Prioritization:
                  </h3>
                  <div className="space-y-3">
                    {taskOrder.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm"
                      >
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${task.color} flex items-center justify-center text-white font-bold`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{task.icon}</span>
                            <span className="font-semibold text-gray-800">{task.title}</span>
                          </div>
                        </div>
                        {task.id === 'child' && index === 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold"
                          >
                            ✓ Best First
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Key Insight */}
                <div className={`bg-gradient-to-r ${outcomeMessage.color} rounded-xl p-6 text-white`}>
                  <h4 className="font-bold text-lg mb-2">💡 Key Insight:</h4>
                  {outcomeType === 'calm' ? (
                    <p className="text-white/95">
                      When facing multiple urgent tasks, prioritize personal emergencies (like a sick child) first. 
                      This reduces emotional stress and allows you to handle work tasks with a clearer mind. 
                      Effective prioritization isn't about doing everything—it's about doing the right things in the right order.
                    </p>
                  ) : (
                    <p className="text-white/95">
                      Personal emergencies should always come first, even when work feels urgent. 
                      Addressing family needs first actually improves your ability to focus on work tasks later. 
                      Remember: you can reschedule meetings and request deadline extensions, but a sick child needs immediate attention.
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Reflection Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Add Your Reflection
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Reflect on this prioritization exercise. What did you learn about decision-making under pressure? 
                How might you apply this in real situations? (Minimum 10 characters)
              </p>
              <textarea
                value={JSON.parse(reflection)[currentQuestion] || ""}
                onChange={(e) => {
                  const reflections = JSON.parse(reflection || "[]");
                  reflections[currentQuestion] = e.target.value;
                  setReflection(JSON.stringify(reflections));
                }}
                placeholder="For example: 'I learned that personal emergencies should take priority, even when work feels urgent. This helps me stay calm and make better decisions...'"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:outline-none text-gray-800 min-h-[120px] resize-none"
              />
              <div className="mt-2 flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {(JSON.parse(reflection)[currentQuestion] || "").length} characters (minimum 10)
                </p>
                {(JSON.parse(reflection)[currentQuestion] || "").trim().length < 10 && (
                  <p className="text-xs text-orange-600">
                    Please write at least 10 characters
                  </p>
                )}
              </div>

              {/* Complete Button */}
              <div className="mt-6 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleComplete}
                  disabled={(JSON.parse(reflection)[currentQuestion] || "").trim().length < 10}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestion < allScenarios.length - 1 ? 'Continue to Next Scenario' : 'Complete Simulation'}
                </motion.button>
              </div>

              {/* Teacher Tip */}
              <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-amber-900 mb-2">
                  💡 Teacher Tip:
                </p>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Use this simulation as staff training for prioritization. During professional development sessions, 
                  have teachers work through similar scenarios together. This builds shared understanding of how to 
                  handle time pressure and supports a culture where personal emergencies are respected. Discussing 
                  prioritization strategies as a team normalizes the challenge and creates collective support.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default TimePressureSimulation;

