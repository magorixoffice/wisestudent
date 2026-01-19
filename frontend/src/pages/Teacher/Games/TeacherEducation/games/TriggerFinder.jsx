import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";

const TriggerFinder = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-3";
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
      title: "Observation Stress",
      description: "Your administrator walks into your classroom unannounced during a lesson. How do you typically feel in this situation?",
      options: [
        "Excited to showcase my teaching skills",
        "Nervous but motivated to do my best",
        "Anxious and worried about being judged",
        "Angry that my teaching space is being invaded"
      ],
      correct: 2, // "Anxious and worried about being judged"
      explanation: "Feeling anxious about unannounced observations is normal for many teachers. This is a common trigger that stems from the high-stakes nature of evaluations. Recognizing this trigger helps you prepare coping strategies.",
      teacherTip: "Prepare a mental checklist for unexpected observers: take a deep breath, focus on student learning, and remember that you're already doing your best. Consider asking administrators for advance notice when possible."
    },
    {
      id: 2,
      title: "Parent Challenges",
      description: "A parent emails questioning your teaching methods and challenges your assessment of their child. What's your immediate emotional response?",
      options: [
        "Defensive and questioned my expertise",
        "Grateful for their involvement in their child's education",
        "Concerned but open to discussing their concerns",
        "Frustrated and undervalued as a professional"
      ],
      correct: 0, // "Defensive and questioned my expertise"
      explanation: "Feeling defensive when your professional judgment is questioned is natural. This trigger relates to the need for validation and respect as an educator. It's important to acknowledge these feelings.",
      teacherTip: "When facing parent challenges, remember your training and experience. Prepare a calm response focusing on the student's best interest. Seek support from colleagues or administrators when needed."
    },
    {
      id: 3,
      title: "Technology Failures",
      description: "Midway through an engaging lesson, your projector fails and you can't access your planned materials. How does this affect you emotionally?",
      options: [
        "Unbothered - I can adapt my lesson easily",
        "Slightly inconvenienced but flexible",
        "Panicked and unsure how to continue",
        "Frustrated and unprepared",
      ],
      correct: 3, // "Frustrated and unprepared"
      explanation: "Technology failures can be significant triggers for teachers who invest time in preparing digital materials. This relates to control over your teaching environment and preparedness.",
      teacherTip: "Always have backup plans for tech failures. Keep printed copies of key materials and practice lessons that don't rely heavily on technology. This reduces anxiety when tech issues occur."
    },
    {
      id: 4,
      title: "Student Behavior Challenges",
      description: "A student speaks to you disrespectfully in front of the class. What's your emotional reaction?",
      options: [
        "Understanding - they might be having a tough day",
        "Concerned but maintaining professionalism",
        "Hurt and disrespected",
        "Angry and personally attacked"
      ],
      correct: 2, // "Hurt and disrespected"
      explanation: "Feeling disrespected by students is a common trigger that affects many teachers. This relates to respect and boundaries in the classroom. It's a normal emotional response.",
      teacherTip: "Address disrespectful behavior calmly and consistently. Have predetermined responses for such situations. Remember that student behavior often reflects their struggles, not your worth as a teacher."
    },
    {
      id: 5,
      title: "Workload Overwhelm",
      description: "You have multiple urgent tasks due this week: lesson plans, grading, report cards, and a new initiative from administration. How do you feel?",
      options: [
        "Motivated and energized by the challenge",
        "Overwhelmed and struggling to prioritize",
        "Busy but managing my time effectively",
        "Stressed and questioning my capacity"
      ],
      correct: 1, // "Overwhelmed and struggling to prioritize"
      explanation: "Feeling overwhelmed by multiple competing demands is a common trigger for educators. This relates to time and focus management. Recognizing this pattern is the first step to addressing it.",
      teacherTip: "Practice saying no to non-essential tasks when overwhelmed. Break large tasks into smaller steps. Seek help from colleagues or administrators when realistic expectations aren't met."
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
      title={gameData?.title || "Trigger Finder"}
      subtitle={gameData?.description || "Identify personal emotional triggers and common stress cues"}
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
                  {questions[currentQuestion].description}
                </p>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
              Select the option that best describes your emotional response:
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
          </div>
        </div>
      ) : null}
    </TeacherGameShell>
  );
};

export default TriggerFinder;

