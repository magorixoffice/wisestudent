import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { CheckCircle, Circle, Lightbulb, Target, AlertCircle, Clock, Bell, Zap, Battery, Smartphone, Mail, Calendar, ArrowLeft, ArrowRight } from "lucide-react";

const DistractionDetox = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-46";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = 5; // Updated to 5 questions
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedDistractors, setSelectedDistractors] = useState(Array(5).fill().map(() => [])); // Array to hold selections for each question
  const [scores, setScores] = useState(Array(5).fill(0)); // Track scores for each question
  const [showFocusPlan, setShowFocusPlan] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  // Define 5 different sets of distractors for each question
  const questionSets = [
    // Question 1: Identifying Personal Distractions
    {
      title: "Identify Your Top Distractions",
      instruction: "Review the common distractions below. Select your <strong>top 3 distractions</strong> that most reduce your focus quality during work hours.",
      distractors: [
        {
          id: 1,
          title: "Phone Notifications",
          description: "Constant alerts from apps, messages, and calls interrupting your work",
          category: "Notifications",
          icon: Bell,
          color: "from-red-500 to-pink-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-300"
        },
        {
          id: 2,
          title: "Email Overload",
          description: "Flooded inbox requiring constant checking and responses",
          category: "Notifications",
          icon: Mail,
          color: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-300"
        },
        {
          id: 3,
          title: "Multitasking",
          description: "Trying to do multiple tasks simultaneously, reducing quality and focus",
          category: "Multitasking",
          icon: Zap,
          color: "from-yellow-500 to-orange-500",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-300"
        },
        {
          id: 4,
          title: "Mental Fatigue",
          description: "Exhaustion from long work hours affecting concentration and decision-making",
          category: "Fatigue",
          icon: Battery,
          color: "from-purple-500 to-indigo-500",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-300"
        },
        {
          id: 5,
          title: "Social Media",
          description: "Compulsive checking of social media platforms during work hours",
          category: "Notifications",
          icon: Smartphone,
          color: "from-pink-500 to-rose-500",
          bgColor: "bg-pink-50",
          borderColor: "border-pink-300"
        }
      ]
    },
    // Question 2: Classroom Environment Distractions
    {
      title: "Classroom Environment Distractions",
      instruction: "Identify which <strong>environmental factors</strong> in your classroom most commonly distract you during teaching.",
      distractors: [
        {
          id: 6,
          title: "Background Noise",
          description: "Chatter, construction, or ambient sounds disrupting concentration",
          category: "Environment",
          icon: AlertCircle,
          color: "from-gray-500 to-slate-500",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-300"
        },
        {
          id: 7,
          title: "Physical Discomfort",
          description: "Uncomfortable workspace, hunger, or physical needs affecting focus",
          category: "Fatigue",
          icon: AlertCircle,
          color: "from-orange-500 to-amber-500",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-300"
        },
        {
          id: 8,
          title: "Visual Clutter",
          description: "Disorganized materials or visual stimuli competing for attention",
          category: "Environment",
          icon: Smartphone,
          color: "from-cyan-500 to-teal-500",
          bgColor: "bg-cyan-50",
          borderColor: "border-cyan-300"
        },
        {
          id: 9,
          title: "Technology Issues",
          description: "Problems with devices, software, or internet connections",
          category: "Technical",
          icon: Bell,
          color: "from-red-500 to-pink-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-300"
        },
        {
          id: 10,
          title: "Temperature/Climate",
          description: "Room being too hot, cold, stuffy, or uncomfortable",
          category: "Environment",
          icon: Battery,
          color: "from-purple-500 to-indigo-500",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-300"
        }
      ]
    },
    // Question 3: Administrative Task Distractions
    {
      title: "Administrative Task Distractions",
      instruction: "Which <strong>administrative duties</strong> most commonly interrupt your focused teaching preparation time?",
      distractors: [
        {
          id: 11,
          title: "Interruptions from Colleagues",
          description: "Frequent drop-ins, questions, or conversations breaking your focus",
          category: "People",
          icon: Calendar,
          color: "from-green-500 to-emerald-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-300"
        },
        {
          id: 12,
          title: "Unclear Priorities",
          description: "Not knowing what to focus on, jumping between tasks without direction",
          category: "Multitasking",
          icon: Target,
          color: "from-indigo-500 to-blue-500",
          bgColor: "bg-indigo-50",
          borderColor: "border-indigo-300"
        },
        {
          id: 13,
          title: "Meeting Requests",
          description: "Unexpected or poorly timed meeting invitations",
          category: "People",
          icon: Clock,
          color: "from-amber-500 to-orange-500",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-300"
        },
        {
          id: 14,
          title: "Paperwork Overload",
          description: "Excessive documentation and reporting requirements",
          category: "Administrative",
          icon: Mail,
          color: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-300"
        },
        {
          id: 15,
          title: "Lack of Boundaries",
          description: "Difficulty saying no, taking on too much, leading to overwhelm",
          category: "People",
          icon: Circle,
          color: "from-violet-500 to-purple-500",
          bgColor: "bg-violet-50",
          borderColor: "border-violet-300"
        }
      ]
    },
    // Question 4: Student-Related Distractions
    {
      title: "Student-Related Distractions",
      instruction: "Select the <strong>student behaviors or needs</strong> that most commonly pull your attention away from planned lessons.",
      distractors: [
        {
          id: 16,
          title: "Behavioral Issues",
          description: "Managing disruptive behaviors during instruction",
          category: "Student",
          icon: AlertCircle,
          color: "from-gray-500 to-slate-500",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-300"
        },
        {
          id: 17,
          title: "Individual Needs",
          description: "Addressing specific learning needs of individual students",
          category: "Student",
          icon: Target,
          color: "from-indigo-500 to-blue-500",
          bgColor: "bg-indigo-50",
          borderColor: "border-indigo-300"
        },
        {
          id: 18,
          title: "Parent Communications",
          description: "Handling urgent parent inquiries or concerns",
          category: "Communication",
          icon: Mail,
          color: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-300"
        },
        {
          id: 19,
          title: "Unexpected Events",
          description: "Last-minute schedule changes or emergencies",
          category: "Unpredictable",
          icon: Bell,
          color: "from-red-500 to-pink-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-300"
        },
        {
          id: 20,
          title: "Academic Gaps",
          description: "Addressing significant knowledge gaps among students",
          category: "Student",
          icon: Zap,
          color: "from-yellow-500 to-orange-500",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-300"
        }
      ]
    },
    // Question 5: Personal Stress Distractions
    {
      title: "Personal Stress Distractions",
      instruction: "Identify which <strong>personal stressors</strong> most commonly affect your professional focus and teaching effectiveness.",
      distractors: [
        {
          id: 21,
          title: "Work-Life Balance",
          description: "Struggling to separate professional and personal responsibilities",
          category: "Personal",
          icon: Target,
          color: "from-indigo-500 to-blue-500",
          bgColor: "bg-indigo-50",
          borderColor: "border-indigo-300"
        },
        {
          id: 22,
          title: "Financial Concerns",
          description: "Worrying about personal finances during work hours",
          category: "Personal",
          icon: Clock,
          color: "from-amber-500 to-orange-500",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-300"
        },
        {
          id: 23,
          title: "Family Responsibilities",
          description: "Managing family obligations that compete with work focus",
          category: "Personal",
          icon: Calendar,
          color: "from-green-500 to-emerald-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-300"
        },
        {
          id: 24,
          title: "Health Issues",
          description: "Dealing with physical or mental health concerns",
          category: "Personal",
          icon: Battery,
          color: "from-purple-500 to-indigo-500",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-300"
        },
        {
          id: 25,
          title: "Future Worries",
          description: "Anxiety about upcoming events or career prospects",
          category: "Personal",
          icon: AlertCircle,
          color: "from-gray-500 to-slate-500",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-300"
        }
      ]
    }
  ];

  const currentDistractors = questionSets[currentQuestion].distractors;
  const currentSelections = selectedDistractors[currentQuestion];
  
  const handleDistractorSelect = (distractorId) => {
    const newSelected = [...selectedDistractors];
    const currentSelection = [...newSelected[currentQuestion]];
    
    if (currentSelection.includes(distractorId)) {
      // Deselect if already selected
      newSelected[currentQuestion] = currentSelection.filter(id => id !== distractorId);
    } else if (currentSelection.length < 3) {
      // Select if less than 3 are selected
      newSelected[currentQuestion] = [...currentSelection, distractorId];
    } else {
      // Already have 3 selected, replace the first one
      newSelected[currentQuestion] = [...currentSelection.slice(1), distractorId];
    }
    
    setSelectedDistractors(newSelected);
  };
  
  const handleNextQuestion = () => {
    // Calculate score for current question based on selections
    const currentScore = currentSelections.length > 0 ? 1 : 0; // Give 1 point if any selections are made
    const newScores = [...scores];
    newScores[currentQuestion] = currentScore;
    setScores(newScores);
    
    if (currentQuestion < 4) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions completed, move to focus plan
      setShowFocusPlan(true);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const calculateTotalScore = () => {
    return scores.reduce((total, questionScore) => total + questionScore, 0);
  };
  
  const getTotalSelectedCount = () => {
    return selectedDistractors.flat().length;
  };

  // Generate personalized Focus Plan based on selected distractors
  const generateFocusPlan = () => {
    // Flatten all selected distractors from all questions
    const allSelectedIds = selectedDistractors.flat();
    
    // Get all distractors across all question sets
    const allDistractors = questionSets.flatMap(set => set.distractors);
    
    const selectedItems = allDistractors.filter(d => allSelectedIds.includes(d.id));
    const categories = [...new Set(selectedItems.map(item => item.category))];
    
    const focusPlan = [];

    // Analyze patterns and generate specific suggestions
    const hasNotifications = categories.includes("Notifications") || 
      selectedItems.some(item => item.category === "Notifications");
    const hasMultitasking = categories.includes("Multitasking") || 
      selectedItems.some(item => item.category === "Multitasking");
    const hasFatigue = categories.includes("Fatigue") || 
      selectedItems.some(item => item.category === "Fatigue");
    const hasPeople = categories.includes("People") || 
      selectedItems.some(item => item.category === "People");
    const hasEnvironment = categories.includes("Environment") || 
      selectedItems.some(item => item.category === "Environment");
    const hasStudent = categories.includes("Student") || 
      selectedItems.some(item => item.category === "Student");
    const hasPersonal = categories.includes("Personal") || 
      selectedItems.some(item => item.category === "Personal");

    // Notification-related suggestions
    if (hasNotifications) {
      focusPlan.push({
        id: 1,
        title: "Digital Detox Strategies",
        suggestions: [
          "Turn off all non-essential notifications during work hours. Use 'Do Not Disturb' mode on your phone.",
          "Schedule specific times to check email (e.g., 9 AM, 12 PM, 4 PM) instead of checking constantly.",
          "Use website blockers or app limiters to prevent social media access during focused work time.",
          "Keep your phone in another room or in a drawer during deep work sessions.",
          "Set an auto-reply message: 'I check emails at [time]. For urgent matters, please call.'"
        ],
        priority: "high",
        icon: Bell,
        color: "from-red-500 to-pink-500"
      });
    }

    // Multitasking suggestions
    if (hasMultitasking) {
      focusPlan.push({
        id: 2,
        title: "Single-Task Focus Techniques",
        suggestions: [
          "Use time-blocking: Assign specific time slots for each task. Stick to one task per block.",
          "Start your day by identifying your top 3 priorities. Focus on these first.",
          "Use the 'Pomodoro Technique': 25 minutes of focused work, 5-minute break, repeat.",
          "Create a 'Stop Doing' list: Write down tasks you'll consciously avoid today.",
          "Batch similar tasks together (e.g., all grading at once, all planning at once) to maintain focus."
        ],
        priority: "high",
        icon: Target,
        color: "from-indigo-500 to-blue-500"
      });
    }

    // Fatigue-related suggestions
    if (hasFatigue) {
      focusPlan.push({
        id: 3,
        title: "Energy & Recovery Management",
        suggestions: [
          "Schedule your most important work during your peak energy hours (usually morning for most people).",
          "Take regular breaks: 5 minutes every hour, longer break after 90 minutes of focused work.",
          "Practice the 'Pomodoro Technique' with proper rest breaks to prevent mental exhaustion.",
          "Ensure adequate sleep: Aim for 7-9 hours. Your focus quality depends on rest.",
          "Take a 10-minute walk outside during breaks to refresh your mind and body."
        ],
        priority: "high",
        icon: Battery,
        color: "from-purple-500 to-indigo-500"
      });
    }

    // People-related suggestions
    if (hasPeople) {
      focusPlan.push({
        id: 4,
        title: "Boundary & Communication Strategies",
        suggestions: [
          "Set clear office hours: Communicate when you're available for drop-in conversations.",
          "Use visual signals: Close door, wear headphones, or put a 'Do Not Disturb' sign during deep work.",
          "Create 'Focus Hours': Block 2-3 hours daily where you're unavailable for non-urgent matters.",
          "Learn to say: 'I'm in the middle of something important. Can we schedule time at [specific time]?'",
          "Use email templates for common requests to reduce response time and mental load."
        ],
        priority: "medium",
        icon: Calendar,
        color: "from-green-500 to-emerald-500"
      });
    }

    // Environment-related suggestions
    if (hasEnvironment) {
      focusPlan.push({
        id: 5,
        title: "Workspace Optimization",
        suggestions: [
          "Create a dedicated, distraction-free workspace. Remove visual clutter.",
          "Use noise-cancelling headphones with calming music or white noise during focused work.",
          "Close unnecessary browser tabs and apps. Keep only what you need for current task.",
          "Organize your workspace at the end of each day so you start fresh tomorrow.",
          "Set up your physical workspace: comfortable chair, good lighting, water bottle ready."
        ],
        priority: "medium",
        icon: AlertCircle,
        color: "from-gray-500 to-slate-500"
      });
    }
    
    // Student-related suggestions
    if (hasStudent) {
      focusPlan.push({
        id: 6,
        title: "Student Management Strategies",
        suggestions: [
          "Prepare structured responses for common student questions to reduce interruptions.",
          "Establish clear procedures for when students need help, so they know how to get attention appropriately.",
          "Use visual cues or hand signals to redirect attention without verbal interruption.",
          "Designate specific times for one-on-one student interactions to maintain lesson flow.",
          "Develop a toolkit of quick interventions for off-task behaviors that don't disrupt the whole class."
        ],
        priority: "high",
        icon: Target,
        color: "from-indigo-500 to-blue-500"
      });
    }
    
    // Personal stress management
    if (hasPersonal) {
      focusPlan.push({
        id: 7,
        title: "Personal Well-being Strategies",
        suggestions: [
          "Establish clear boundaries between work and personal life with designated start/end times.",
          "Create a brief morning routine to mentally prepare for the school day.",
          "Schedule brief personal check-ins during lunch or prep periods to address personal concerns.",
          "Develop a support network of trusted colleagues for sharing challenges and solutions.",
          "Practice brief stress-reduction techniques (breathing, stretching) between classes."
        ],
        priority: "medium",
        icon: Battery,
        color: "from-purple-500 to-indigo-500"
      });
    }

    // Universal strategies
    focusPlan.push({
      id: 8,
      title: "Deep Work Foundation",
      suggestions: [
        "Schedule 2-3 'Deep Work Hours' daily: Block these in your calendar as non-negotiable appointments.",
        "Prepare for deep work: Clear workspace, close unnecessary tabs, silence notifications, have water ready.",
        "Start with a 2-minute meditation or breathing exercise to transition into focused mode.",
        "Use the '2-Minute Rule': If a distraction thought comes up, write it down to address later, not now.",
        "End each deep work session by reviewing what you accomplished. Celebrate small wins."
      ],
      priority: "essential",
      icon: Clock,
      color: "from-amber-500 to-orange-500"
    });

    return focusPlan;
  };

  const handleComplete = () => {
    setShowGameOver(true);
  };

  const focusPlan = showFocusPlan ? generateFocusPlan() : [];

  return (
    <TeacherGameShell
      title={gameData?.title || "Distraction Detox"}
      subtitle={gameData?.description || "Identify and limit daily distractions that reduce focus quality"}
      showGameOver={showGameOver}
      score={calculateTotalScore()}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentQuestion + 0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showFocusPlan && !showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Question Header */}
            <div className="mb-6">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-8 h-8 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    {questionSets[currentQuestion].title}
                  </h2>
                </div>
                <p className="text-gray-700 mb-2" dangerouslySetInnerHTML={{__html: questionSets[currentQuestion].instruction}}></p>
                <p className="text-sm text-gray-600 italic">
                  Be honest about what actually pulls your attention away from focused work.
                </p>
              </div>

              {/* Progress and Selection Counter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-gray-700 font-semibold mb-1">
                    Question {currentQuestion + 1} of {totalLevels}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / totalLevels) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-semibold">
                      Selected: {currentSelections.length} / 3
                    </span>
                    {currentSelections.length === 3 && (
                      <span className="text-sm text-green-700 font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Ready for next question!
                      </span>
                    )}
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentSelections.length / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Distraction Checklist for Current Question */}
            <div className="space-y-4 mb-8">
              {currentDistractors.map((distractor, index) => {
                const IconComponent = distractor.icon;
                const isSelected = currentSelections.includes(distractor.id);
                const isDisabled = currentSelections.length >= 3 && !isSelected;

                return (
                  <motion.button
                    key={distractor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={!isDisabled ? { scale: 1.02 } : {}}
                    whileTap={!isDisabled ? { scale: 0.98 } : {}}
                    onClick={() => handleDistractorSelect(distractor.id)}
                    disabled={isDisabled}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? `${distractor.bgColor} ${distractor.borderColor} border-2 shadow-lg`
                        : isDisabled
                        ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                        : 'bg-white border-gray-300 hover:border-indigo-400 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r ${distractor.color} flex items-center justify-center text-white text-xl`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-gray-800 text-lg">
                            {distractor.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              distractor.category === "Notifications" ? 'bg-red-100 text-red-700' :
                              distractor.category === "Multitasking" ? 'bg-yellow-100 text-yellow-700' :
                              distractor.category === "Fatigue" ? 'bg-purple-100 text-purple-700' :
                              distractor.category === "People" ? 'bg-green-100 text-green-700' :
                              distractor.category === "Environment" ? 'bg-gray-100 text-gray-700' :
                              distractor.category === "Student" ? 'bg-indigo-100 text-indigo-700' :
                              distractor.category === "Personal" ? 'bg-amber-100 text-amber-700' :
                              distractor.category === "Administrative" ? 'bg-cyan-100 text-cyan-700' :
                              distractor.category === "Communication" ? 'bg-pink-100 text-pink-700' :
                              distractor.category === "Technical" ? 'bg-purple-100 text-purple-700' :
                              distractor.category === "Unpredictable" ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {distractor.category}
                            </span>
                            {isSelected ? (
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            ) : (
                              <Circle className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {distractor.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  currentQuestion === 0 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </button>
              
              <button
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                {currentQuestion < 4 ? 'Next Question' : 'Finish & Generate Plan'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {showFocusPlan && !showGameOver && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Your Personalized Focus Plan
              </h2>
              <p className="text-gray-600">
                Based on your selected distractions, here are actionable strategies to improve your focus quality.
              </p>
            </div>

            {/* Selected Distractors Summary */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Your Top Distractions:
              </h3>
              <div className="flex flex-wrap gap-3">
                {selectedDistractors.map((selections, questionIndex) => {
                  return selections.map((id) => {
                    // Find the distractor across all question sets
                    let item = null;
                    for (let i = 0; i < questionSets.length; i++) {
                      const found = questionSets[i].distractors.find(d => d.id === id);
                      if (found) {
                        item = found;
                        break;
                      }
                    }
                    
                    if (!item) return null;
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={`${questionIndex}-${id}`}
                        className={`${item.bgColor} ${item.borderColor} border-2 rounded-lg px-4 py-2 flex items-center gap-2`}
                      >
                        <IconComponent className="w-5 h-5 text-gray-700" />
                        <span className="font-medium text-gray-800">{item.title}</span>
                      </div>
                    );
                  });
                }).flat()}
              </div>
            </div>

            {/* Focus Plan Suggestions */}
            <div className="space-y-6 mb-8">
              {focusPlan.map((plan, index) => {
                const PlanIcon = plan.icon;
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${plan.color} bg-opacity-10 rounded-xl p-6 border-2 border-opacity-30`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center text-white`}>
                        <PlanIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {plan.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          plan.priority === "essential" ? 'bg-amber-200 text-amber-800' :
                          plan.priority === "high" ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {plan.priority === "essential" ? "Essential" : plan.priority === "high" ? "High Priority" : "Medium Priority"}
                        </span>
                      </div>
                    </div>
                    <ul className="space-y-2 ml-4">
                      {plan.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="text-gray-700 flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>

            {/* Action Items */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Next Steps:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Choose 2-3 strategies from above that feel most actionable for you.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Start implementing them this week. Small changes compound over time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Revisit this plan weekly and adjust as needed. Focus quality improves with practice.</span>
                </li>
              </ul>
            </div>

            {/* Complete Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Complete
              </motion.button>
            </div>
          </motion.div>
        )}

        {showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-6xl mb-6"
            >
              ✨
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Focus Plan Created!
            </h2>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                You've identified your top distractions and received a personalized Focus Plan with actionable strategies. 
                Remember: improving focus is a practice. Start with the strategies that feel most manageable, and build from there.
              </p>
              <div className="bg-white/60 rounded-lg p-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Questions Completed</p>
                    <p className="text-2xl font-bold text-indigo-600">{totalLevels}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Your Score</p>
                    <p className="text-2xl font-bold text-purple-600">{calculateTotalScore()} / {totalLevels}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Focus Strategies</p>
                    <p className="text-2xl font-bold text-green-600">{focusPlan.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Schedule deep work hours without messages or calls. Identify your 2-3 most productive hours each day (usually morning for most teachers), and block these as 'Deep Work Hours' in your calendar. During these hours: turn off all notifications, put your phone in another room, close your email, and post a 'Do Not Disturb' sign on your door if you have an office. Communicate these hours to colleagues and administrators: 'I'm unavailable from [time] to [time] for deep work. For urgent matters, please call.' Protect these hours as non-negotiable appointments with yourself. This isn't selfish—it's essential for producing quality work. You'll find that 2-3 hours of uninterrupted focus produces more than an entire day of fragmented attention. Use your Focus Plan strategies during these deep work hours to maximize your productivity and reduce mental fatigue. Remember: quality teaching preparation requires quality focus time. Schedule it, protect it, and watch your work quality and job satisfaction improve.
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

export default DistractionDetox;

