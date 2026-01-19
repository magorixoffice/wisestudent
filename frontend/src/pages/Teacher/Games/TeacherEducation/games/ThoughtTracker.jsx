import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Edit3, Lightbulb } from "lucide-react";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";

const ThoughtTracker = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-4";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const allQuestions = [
    {
      id: 1,
      title: "Lesson Preparation Stress",
      scenario: "You're about to start a new unit you haven't taught before.",
      thought: "I'm going to mess up this lesson and my students will think I'm a terrible teacher.",
      options: [
        "This thought creates anxiety and self-doubt, making it harder to teach confidently.",
        "This thought motivates me to prepare more thoroughly and do my best.",
        "This thought reminds me that teaching is a learning process for everyone, including myself."
      ],
      correct: 2, // Option 2: More balanced perspective
      explanation: "While some anxiety about new material is normal, recognizing that teaching is a learning process for everyone helps you approach the lesson with a growth mindset.",
      teacherTip: "Remember that it's okay not to know everything. Students appreciate seeing you model learning and problem-solving in real-time. Consider sharing your thought process with them when appropriate."
    },
    {
      id: 2,
      title: "Grading Overwhelm",
      scenario: "You're behind on grading and have a meeting with your principal tomorrow.",
      thought: "The principal is going to be disappointed in me because I didn't finish all the grading on time.",
      options: [
        "This thought reminds you that quality takes time, and honest communication is valued.",
        "This thought increases stress and makes you feel like you're failing, even though you're doing your best.",
        "This thought motivates you to communicate proactively with your principal about your progress.",
      ],
      correct: 0, // Option 2: Proactive communication
      explanation: "Proactive communication with your principal demonstrates professionalism and helps manage expectations. It's better to communicate honestly about your progress than to hide delays.",
      teacherTip: "Schedule regular check-ins with your principal about workload. Being transparent about your progress and challenges helps build trust and can lead to realistic timelines and support."
    },
    {
      id: 3,
      title: "Parent Conference Anxiety",
      scenario: "You have a parent meeting scheduled about a student's behavior.",
      thought: "I can't handle another difficult parent meeting. I'm not good at these conversations.",
      options: [
        "This thought makes you feel powerless and anxious, setting you up for a defensive rather than collaborative conversation.",
        "This thought reminds you that parents and teachers share the same goal: student success.",
        "This thought motivates you to prepare specific examples and solutions for the meeting.",
      ],
      correct: 1, // Option 2: Collaborative approach
      explanation: "Recognizing that parents and teachers share the same goal of student success reframes the meeting as a collaborative effort rather than an adversarial one.",
      teacherTip: "Prepare for parent meetings by documenting specific examples, bringing solutions to discuss, and focusing on student growth. Consider starting meetings with positive observations about the student."
    },
    {
      id: 4,
      title: "Technology Troubles",
      scenario: "Your projector fails mid-lesson during an important presentation.",
      thought: "This always happens to me. I'm terrible at using technology in the classroom.",
      options: [
        "This thought reminds you that tech failures are common and unrelated to your teaching ability.",
        "This thought increases frustration and makes you dread future technology use.",
        "This thought motivates you to learn basic troubleshooting and have backup plans.",
      ],
      correct: 0, // Option 2: Learning opportunity
      explanation: "Tech failures are common in classrooms. Recognizing they're unrelated to your teaching ability helps you stay calm and adapt to the situation.",
      teacherTip: "Always have a backup plan for lessons that depend on technology. Keep printed materials available and consider developing offline alternatives. Learn basic troubleshooting techniques for common issues."
    },
    {
      id: 5,
      title: "Student Behavior Challenge",
      scenario: "A student speaks to you disrespectfully in front of the class.",
      thought: "This student is intentionally trying to embarrass me in front of the class. They're targeting me personally.",
      options: [
        "This thought escalates your emotional response and makes the situation more confrontational.",
        "This thought motivates you to address the behavior privately and investigate underlying causes.",
        "This thought reminds you that student behavior often reflects their struggles, not your worth as a teacher."
      ],
      correct: 2, // Option 2: Investigating causes
      explanation: "Understanding that student behavior often stems from their own struggles helps you respond with empathy rather than taking it personally.",
      teacherTip: "Use the 'displacement technique' - consider what might be causing the student's behavior. Address the behavior firmly but with curiosity about underlying causes. Follow up privately when possible."
    }
  ];

  // Use first 5 questions for this game (as per game structure requirement)
  const questions = allQuestions.slice(0, 5);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const newSelectedAnswers = { ...selectedAnswers, [questionIndex]: optionIndex };
    setSelectedAnswers(newSelectedAnswers);

    // Check if answer is correct
    if (optionIndex === questions[questionIndex].correct) {
      setScore(prev => prev + 1);
    }

    // Move to next question after a delay to allow reading of explanations
    setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        setCurrentQuestion(questionIndex + 1);
      } else {
        // All questions answered
        setShowGameOver(true);
      }
    }, 8000); // 8 second delay to allow reading of explanations and teacher tips
  };

  const getOptionStyle = (questionIndex, optionIndex) => {
    const selected = selectedAnswers[questionIndex] === optionIndex;
    const isCorrect = optionIndex === questions[questionIndex].correct;
    const showFeedback = selected;

    let backgroundColor = "bg-white";
    let borderColor = "border-gray-300";
    let textColor = "text-gray-700";

    if (showFeedback) {
      if (isCorrect) {
        backgroundColor = "bg-green-50";
        borderColor = "border-green-500";
        textColor = "text-green-700";
      } else {
        backgroundColor = "bg-red-50";
        borderColor = "border-red-500";
        textColor = "text-red-700";
      }
    } else if (selected) {
      backgroundColor = "bg-blue-50";
      borderColor = "border-blue-500";
      textColor = "text-blue-700";
    }

    return `${backgroundColor} ${borderColor} ${textColor}`;
  };

  return (
    <TeacherGameShell
      title={gameData?.title || "Thought Tracker"}
      subtitle={gameData?.description || "Notice automatic thought patterns and how they affect mood"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentQuestion}
    >
      {currentQuestion < questions.length ? (
        <div className="w-full max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  Score: {score}/{questions.length}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-purple-700 mb-3">
                {questions[currentQuestion].title}
              </h3>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg mb-4">
                <p className="text-gray-700 leading-relaxed">
                  {questions[currentQuestion].scenario}
                </p>
                <div className="mt-2 bg-white rounded-lg p-3 border-l-4 border-orange-500">
                  <p className="text-gray-800 font-medium">
                    <strong>Automatic Thought:</strong> "{questions[currentQuestion].thought}"
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
              Select the option that best describes the impact of this thought:
            </h2>

            <div className="space-y-4 mb-6">
              {questions[currentQuestion].options.map((option, optionIndex) => {
                const isSelected = selectedAnswers[currentQuestion] === optionIndex;
                const isCorrect = optionIndex === questions[currentQuestion].correct;
                const showFeedback = isSelected;

                return (
                  <button
                    key={optionIndex}
                    onClick={() => !selectedAnswers[currentQuestion] && handleAnswerSelect(currentQuestion, optionIndex)}
                    disabled={!!selectedAnswers[currentQuestion]}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      getOptionStyle(currentQuestion, optionIndex)
                    } ${
                      selectedAnswers[currentQuestion] ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {showFeedback && (
                        <span className="text-xl">
                          {isCorrect ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation and Teacher Tip */}
            {selectedAnswers[currentQuestion] !== undefined && (
              <div className={`mt-6 p-4 rounded-xl border-2 ${
                selectedAnswers[currentQuestion] === questions[currentQuestion].correct
                  ? 'bg-green-50 border-green-200'
                  : 'bg-orange-50 border-orange-200'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`text-2xl flex-shrink-0 ${
                    selectedAnswers[currentQuestion] === questions[currentQuestion].correct
                      ? 'text-green-600'
                      : 'text-orange-600'
                  }`}>
                    {selectedAnswers[currentQuestion] === questions[currentQuestion].correct ? '💡' : '📝'}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold mb-2 ${
                      selectedAnswers[currentQuestion] === questions[currentQuestion].correct
                        ? 'text-green-800'
                        : 'text-orange-800'
                    }`}>
                      {selectedAnswers[currentQuestion] === questions[currentQuestion].correct
                        ? 'Insight'
                        : 'Learning Moment'}
                    </h4>
                    <p className={`text-sm leading-relaxed mb-2 ${
                      selectedAnswers[currentQuestion] === questions[currentQuestion].correct
                        ? 'text-green-700'
                        : 'text-orange-700'
                    }`}>
                      {questions[currentQuestion].explanation}
                    </p>
                    <div className="bg-white/60 rounded-lg p-3 mt-3 border border-purple-200">
                      <p className="text-xs font-semibold text-purple-800 mb-1">Teacher Tip:</p>
                      <p className="text-xs text-purple-700">
                        {questions[currentQuestion].teacherTip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Teacher Tip */}
            <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-900 mb-2">
                💡 Teacher Tip:
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                Use this game as a morning ritual to set the tone for your day. Taking 5-10 minutes each morning to track and reframe unhelpful thoughts helps you start the day with a more balanced mindset. When you catch automatic negative thoughts early, you can rewrite them before they affect your mood and teaching. This practice builds mental resilience and helps you respond to challenges with greater clarity and calm.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </TeacherGameShell>
  );
};

export default ThoughtTracker;

