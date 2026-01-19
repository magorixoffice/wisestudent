import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";

const IdentifyYourStressors = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-11";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = 5; // Updated to 5 questions
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedStressors, setSelectedStressors] = useState(Array(totalLevels).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [reflection, setReflection] = useState("");
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Define 5 questions with 4 stressors each
  const stressorQuestions = [
    {
      id: 1,
      title: "Question 1",
      prompt: "Which of the following causes you the most stress during a typical week?",
      stressors: [
        {
          id: "q1-s1",
          title: "Grading Load",
          description: "Piles of assignments and tests waiting to be graded, with deadlines approaching",
          category: "Workload",
          icon: "📚"
        },
        {
          id: "q1-s2",
          title: "Admin Calls",
          description: "Frequent calls from administration requesting immediate attention or reports",
          category: "People",
          icon: "📞"
        },
        {
          id: "q1-s3",
          title: "Student Behavior",
          description: "Challenging student behaviors disrupting class flow and requiring constant management",
          category: "People",
          icon: "👥"
        },
        {
          id: "q1-s4",
          title: "Time Shortage",
          description: "Not enough time to complete all tasks, prepare lessons, and meet expectations",
          category: "Workload",
          icon: "⏰"
        }
      ]
    },
    {
      id: 2,
      title: "Question 2",
      prompt: "Which situation creates the greatest challenge for you in your work environment?",
      stressors: [
        {
          id: "q2-s1",
          title: "Parent Meetings",
          description: "Scheduled or unscheduled meetings with parents, often during prep time",
          category: "People",
          icon: "🤝"
        },
        {
          id: "q2-s2",
          title: "Classroom Environment",
          description: "Noisy, cramped, or poorly equipped classroom space affecting teaching",
          category: "Environment",
          icon: "🏫"
        },
        {
          id: "q2-s3",
          title: "Lesson Planning",
          description: "Creating engaging lesson plans while meeting curriculum standards and deadlines",
          category: "Workload",
          icon: "📝"
        },
        {
          id: "q2-s4",
          title: "Staff Dynamics",
          description: "Tension or conflicts with colleagues affecting collaboration and support",
          category: "People",
          icon: "💼"
        }
      ]
    },
    {
      id: 3,
      title: "Question 3",
      prompt: "Which stressor impacts your daily teaching routine the most?",
      stressors: [
        {
          id: "q3-s1",
          title: "Resource Limitations",
          description: "Lack of materials, technology, or supplies needed for effective teaching",
          category: "Environment",
          icon: "📦"
        },
        {
          id: "q3-s2",
          title: "Work-Life Balance",
          description: "Difficulty separating work from personal time, bringing work home regularly",
          category: "Workload",
          icon: "⚖️"
        },
        {
          id: "q3-s3",
          title: "Meeting Deadlines",
          description: "Constant pressure to meet various educational and administrative deadlines",
          category: "Workload",
          icon: "📅"
        },
        {
          id: "q3-s4",
          title: "Technology Issues",
          description: "Dealing with malfunctioning equipment and software problems during class",
          category: "Environment",
          icon: "💻"
        }
      ]
    },
    {
      id: 4,
      title: "Question 4",
      prompt: "Which factor most significantly affects your work satisfaction?",
      stressors: [
        {
          id: "q4-s1",
          title: "Student Performance",
          description: "Concerns about students' academic progress and standardized test scores",
          category: "Workload",
          icon: "📊"
        },
        {
          id: "q4-s2",
          title: "Professional Development",
          description: "Keeping up with mandatory training and evolving educational standards",
          category: "Workload",
          icon: "🎓"
        },
        {
          id: "q4-s3",
          title: "Behavior Management",
          description: "Addressing disciplinary issues and maintaining classroom order",
          category: "People",
          icon: "📏"
        },
        {
          id: "q4-s4",
          title: "Colleague Relations",
          description: "Navigating difficult relationships with fellow teachers or staff",
          category: "People",
          icon: "👥"
        }
      ]
    },
    {
      id: 5,
      title: "Question 5",
      prompt: "Which challenge most affects your overall well-being at work?",
      stressors: [
        {
          id: "q5-s1",
          title: "Evaluation Pressure",
          description: "Anxiety about formal evaluations and performance reviews",
          category: "People",
          icon: "📋"
        },
        {
          id: "q5-s2",
          title: "Budget Constraints",
          description: "Limited funding affecting program implementation and resource availability",
          category: "Environment",
          icon: "💰"
        },
        {
          id: "q5-s3",
          title: "Safety Concerns",
          description: "Worrying about student and personal safety in the school environment",
          category: "Environment",
          icon: "🚨"
        },
        {
          id: "q5-s4",
          title: "Communication Overload",
          description: "Managing excessive emails, messages, and communication channels",
          category: "Workload",
          icon: "💬"
        }
      ]
    }
  ];

  const handleStressorSelect = (questionIndex, stressorId) => {
    const newSelections = [...selectedStressors];
    newSelections[questionIndex] = stressorId;
    setSelectedStressors(newSelections);
  };

  const isQuestionComplete = (questionIndex) => {
    return selectedStressors[questionIndex] !== null;
  };

  const goToNextQuestion = () => {
    if (currentQuestion < totalLevels - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    // Return the number of correctly answered questions (each question is worth 1 point)
    const answeredQuestions = selectedStressors.filter(selection => selection !== null).length;
    return answeredQuestions; // Actual number of questions answered
  };

  const handleSubmitAll = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);
  };

  const handleComplete = () => {
    if (reflection.trim().length >= 10) {
      setShowGameOver(true);
    }
  };

  const getSelectedStressorForQuestion = (questionIndex) => {
    const selectedId = selectedStressors[questionIndex];
    if (selectedId) {
      const question = stressorQuestions[questionIndex];
      return question.stressors.find(stressor => stressor.id === selectedId);
    }
    return null;
  };

  const getSelectedStressorsSummary = () => {
    return selectedStressors.map((selection, index) => {
      if (selection) {
        const question = stressorQuestions[index];
        const stressor = question.stressors.find(s => s.id === selection);
        return { question: question.title, stressor };
      }
      return null;
    }).filter(item => item !== null);
  };

  return (
    <TeacherGameShell
      title={gameData?.title || "Identify Your Stressors"}
      subtitle={gameData?.description || "Recognize the sources of stress in a school week"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={showResults ? totalLevels : currentQuestion + 0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showResults ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {stressorQuestions[currentQuestion].title}: {stressorQuestions[currentQuestion].prompt}
              </h2>
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600">
                  Question <strong>{currentQuestion + 1}</strong> of <strong>{totalLevels}</strong>
                </p>
                <div className="flex space-x-2">
                  <button 
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestion === 0}
                    className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Prev
                  </button>
                  <button 
                    onClick={goToNextQuestion}
                    disabled={!isQuestionComplete(currentQuestion) || currentQuestion === totalLevels - 1}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Status:</strong> {selectedStressors.filter(s => s !== null).length} of {totalLevels} answered
                </p>
              </div>
            </div>

            {/* Stressor Cards Grid - 4 options per question */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {stressorQuestions[currentQuestion].stressors.map((stressor) => {
                const isSelected = selectedStressors[currentQuestion] === stressor.id;

                return (
                  <motion.button
                    key={stressor.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStressorSelect(currentQuestion, stressor.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'bg-orange-50 border-orange-500 shadow-md'
                        : 'bg-white border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{stressor.icon}</span>
                        <h3 className={`font-bold text-sm ${
                          isSelected ? 'text-orange-800' : 'text-gray-800'
                        }`}>
                          {stressor.title}
                        </h3>
                      </div>
                      {isSelected && (
                        <span className="text-orange-600 font-bold text-lg">✓</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                      {stressor.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded text-white font-semibold bg-gradient-to-r ${
                        stressor.category === 'Workload' ? 'from-blue-500 to-cyan-500' :
                        stressor.category === 'People' ? 'from-purple-500 to-pink-500' :
                        'from-green-500 to-emerald-500'
                      }`}>
                        {stressor.category}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Navigation and Submit buttons */}
            <div className="flex justify-between items-center">
              <button 
                onClick={goToPreviousQuestion}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-gray-200 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous Question
              </button>
              
              {currentQuestion === totalLevels - 1 && isQuestionComplete(currentQuestion) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmitAll}
                  className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Submit All Answers →
                </motion.button>
              )}
              
              <div></div> {/* Spacer to maintain alignment */}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Results Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Your Stressor Analysis
              </h2>

              {/* Selected Stressors Summary */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Your Selected Stressors:
                </h3>
                <div className="space-y-3">
                  {getSelectedStressorsSummary().map(({ question, stressor }, index) => (
                    <div
                      key={`${question}-${stressor.id}`}
                      className={`bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-4 rounded-r-lg`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{stressor.icon}</span>
                          <div>
                            <span className="font-bold text-gray-800">
                              {question}: {stressor.title}
                            </span>
                            <p className="text-sm text-gray-600 mt-1">
                              {stressor.description}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded text-white font-semibold bg-gradient-to-r from-purple-500 to-pink-500">
                          {stressor.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reflection Section */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  Add Your Reflection
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Take a moment to reflect on your selected stressors. What patterns do you notice? How might you address these challenges? (Minimum 10 characters)
                </p>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="For example: 'I notice that most of my stressors are workload-related. I might benefit from better time management strategies or discussing workload distribution with my administration...'"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-orange-500 focus:outline-none text-gray-800 min-h-[120px] resize-none"
                />
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    {reflection.length} characters (minimum 10)
                  </p>
                  {reflection.trim().length < 10 && (
                    <p className="text-xs text-orange-600">
                      Please write at least 10 characters
                    </p>
                  )}
                </div>
              </div>

              {/* Complete Button */}
              <div className="mt-6 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleComplete}
                  disabled={reflection.trim().length < 10}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Stressor Identification
                </motion.button>
              </div>

              {/* Teacher Tip */}
              <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-amber-900 mb-2">
                  💡 Teacher Tip:
                </p>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Discuss common stress sources during Friday staff meetings to normalize them. Sharing stressors with colleagues helps you realize you're not alone in these experiences. It also creates opportunities for mutual support, collaborative problem-solving, and collective advocacy for needed changes. When stressors are normalized, they become manageable challenges rather than isolating struggles.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default IdentifyYourStressors;

