import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";

const EmotionWheelQuiz = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-2";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);

  const allQuestions = [
    {
      id: 1,
      title: "Student Disruption",
      description: "A student repeatedly interrupts your lesson with off-topic comments. You've asked them to stop twice, but they continue. The class is watching how you'll respond.",
      emotionPair: {
        primary: "Anger",
        secondary: "Irritation",
        tertiary: "Frustration",
        primaryDescription: "A strong, intense feeling of displeasure or hostility",
        secondaryDescription: "A mild feeling of annoyance or impatience",
        tertiaryDescription: "Feeling upset due to inability to change or achieve something"
      },
      situation: "In this moment, which emotion feels stronger?",
      correct: 1, // Irritation (secondary) - more appropriate for this situation
      explanation: "In this situation, 'Irritation' is the more accurate emotion. While you might feel frustrated, irritation captures the mild annoyance better than full anger. Recognizing irritation helps you respond with calm redirection rather than an escalated reaction.",
      teacherTip: "Using emotion wheels helps you identify the intensity of your feelings. When you can name 'irritation' instead of 'anger', you create space for a measured response. This skill is valuable for staff wellbeing check-ins too—helping colleagues identify whether they're feeling stressed or overwhelmed."
    },
    {
      id: 2,
      title: "Parent Meeting Tension",
      description: "A parent questions your teaching methods in front of other staff members. Their tone is challenging, and you feel your body tensing. You've prepared well, but the confrontation feels personal.",
      emotionPair: {
        primary: "Anger",
        secondary: "Frustration",
        tertiary: "Disappointment",
        primaryDescription: "A strong, intense feeling of displeasure or hostility",
        secondaryDescription: "A feeling of being upset or annoyed due to inability to change something",
        tertiaryDescription: "Sadness or displeasure caused by failure to fulfill expectations"
      },
      situation: "In this moment, which emotion feels stronger?",
      correct: 0, // Anger (primary) - more intense in this situation
      explanation: "In this situation, 'Anger' is the stronger emotion. The public challenge and personal nature of the criticism can trigger a more intense emotional response. Recognizing this helps you pause and choose a professional response rather than reacting defensively.",
      teacherTip: "Emotion wheels help distinguish between frustration (which can be managed) and anger (which needs more regulation). When you identify anger, you can use strategies like taking a breath, acknowledging the feeling, and choosing a measured response."
    },
    {
      id: 3,
      title: "Workload Overwhelm",
      description: "You have three classes to grade, lesson plans due tomorrow, a parent email to respond to, and a staff meeting in 30 minutes. Your to-do list feels impossible, and you're not sure where to start.",
      emotionPair: {
        primary: "Anxiety",
        secondary: "Worry",
        tertiary: "Stress",
        primaryDescription: "Intense, persistent worry or fear about future events",
        secondaryDescription: "Mild concern or unease about something",
        tertiaryDescription: "State of mental or emotional strain resulting from adverse or demanding circumstances"
      },
      situation: "In this moment, which emotion feels stronger?",
      correct: 0, // Anxiety (primary) - more intense
      explanation: "In this situation, 'Anxiety' is the stronger emotion. The overwhelming workload and time pressure create intense worry about not being able to complete everything. Recognizing anxiety helps you prioritize tasks and ask for support rather than trying to do everything at once.",
      teacherTip: "Distinguishing between worry and anxiety helps you respond appropriately. Worry can be managed with planning, while anxiety may need deeper regulation strategies like breathing exercises or breaking tasks into smaller steps."
    },
    {
      id: 4,
      title: "Student Success Moment",
      description: "A student who has been struggling with reading suddenly reads a complete paragraph independently. Their face lights up with pride, and the whole class celebrates. You feel a warm sensation in your chest.",
      emotionPair: {
        primary: "Contentment",
        secondary: "Happiness",
        tertiary: "Joy",
        primaryDescription: "A state of peaceful happiness and satisfaction",
        secondaryDescription: "A pleasant feeling of contentment and satisfaction",
        tertiaryDescription: " Intense feeling of great pleasure and delight"
      },
      situation: "In this moment, which emotion feels stronger?",
      correct: 2, // Joy (primary) - more intense positive emotion
      explanation: "In this moment, 'Joy' is the stronger emotion. The breakthrough moment and the student's visible pride create an intense feeling of delight. Recognizing joy helps you savor these meaningful teaching moments and reinforces positive classroom culture.",
      teacherTip: "Naming positive emotions like joy helps you celebrate student successes authentically. When you can identify and express joy, you model emotional awareness for students and create more positive classroom experiences."
    },
    {
      id: 5,
      title: "Staffroom Conflict",
      description: "A colleague makes a comment that feels dismissive of your work. You notice other teachers heard it, and you feel your face getting warm. The comment wasn't directly hostile, but it stung.",
      emotionPair: {
        primary: "Anger",
        secondary: "Hurt",
        tertiary: "Embarrassment",
        primaryDescription: "A strong, intense feeling of displeasure or hostility",
        secondaryDescription: "A feeling of emotional pain or distress",
        tertiaryDescription: "Consciousness of shame or foolishness"
      },
      situation: "In this moment, which emotion feels stronger?",
      correct: 1, // Hurt (secondary) - more accurate for this situation
      explanation: "In this situation, 'Hurt' is the more accurate emotion. While you might feel defensive, hurt captures the emotional pain from the dismissive comment better than anger. Recognizing hurt helps you address the situation with vulnerability rather than defensiveness.",
      teacherTip: "Emotion wheels help you identify the root feeling beneath surface reactions. When you can name 'hurt' instead of jumping to 'anger', you can communicate your feelings more effectively and resolve conflicts with greater understanding."
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

    // Move to next question after a short delay
    setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        setCurrentQuestion(questionIndex + 1);
        // Spin wheel for next question
        setWheelRotation(prev => prev + 360 + Math.random() * 360);
      } else {
        // All questions answered
        setShowGameOver(true);
      }
    }, 8000); // 8 second delay to show explanation
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

  // Emotion wheel colors
  const wheelColors = [
    '#FF6B6B', // Red - Anger
    '#4ECDC4', // Teal - Calm
    '#FFE66D', // Yellow - Joy
    '#95E1D3', // Mint - Peace
    '#F38181', // Pink - Love
    '#AA96DA', // Purple - Sadness
    '#FCBAD3', // Rose - Fear
    '#FFFFD2', // Light Yellow - Surprise
  ];

  return (
    <TeacherGameShell
      title={gameData?.title || "Emotion Wheel Quiz"}
      subtitle={gameData?.description || "Learn to differentiate between primary, secondary, and tertiary emotions"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentQuestion}
    >
      {currentQuestion < questions.length ? (
        <div className="w-full max-w-4xl mx-auto px-4">
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

            {/* Emotion Wheel Visual */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
              <motion.div
                className="relative w-64 h-64"
                animate={{ rotate: wheelRotation }}
                transition={{ type: "spring", stiffness: 50, damping: 15 }}
              >
                <svg width="256" height="256" viewBox="0 0 256 256" className="absolute inset-0">
                  <circle cx="128" cy="128" r="120" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                  {/* Wheel segments */}
                  {wheelColors.map((color, index) => {
                    const angle = (360 / wheelColors.length) * index;
                    const startAngle = (angle - 90) * (Math.PI / 180);
                    const endAngle = ((angle + 360 / wheelColors.length) - 90) * (Math.PI / 180);
                    const x1 = 128 + 120 * Math.cos(startAngle);
                    const y1 = 128 + 120 * Math.sin(startAngle);
                    const x2 = 128 + 120 * Math.cos(endAngle);
                    const y2 = 128 + 120 * Math.sin(endAngle);
                    const largeArc = 360 / wheelColors.length > 180 ? 1 : 0;
                    
                    return (
                      <path
                        key={index}
                        d={`M 128 128 L ${x1} ${y1} A 120 120 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={color}
                        opacity="0.7"
                      />
                    );
                  })}
                  {/* Center circle */}
                  <circle cx="128" cy="128" r="40" fill="white" stroke="#4F46E5" strokeWidth="3" />
                  <text x="128" y="135" textAnchor="middle" className="text-sm font-bold fill-purple-600">
                    Emotions
                  </text>
                </svg>
              </motion.div>

              {/* Current Emotion Trio Display */}
              <div className="flex-1">
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                  <h3 className="text-lg font-bold text-purple-900 mb-4 text-center">
                    Emotion Trio
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-4 border-2 border-red-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-red-700">Primary: {questions[currentQuestion].emotionPair.primary}</span>
                        <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Strongest</span>
                      </div>
                      <p className="text-xs text-gray-600">{questions[currentQuestion].emotionPair.primaryDescription}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-blue-700">Secondary: {questions[currentQuestion].emotionPair.secondary}</span>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Moderate</span>
                      </div>
                      <p className="text-xs text-gray-600">{questions[currentQuestion].emotionPair.secondaryDescription}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-green-700">Tertiary: {questions[currentQuestion].emotionPair.tertiary}</span>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Milder</span>
                      </div>
                      <p className="text-xs text-gray-600">{questions[currentQuestion].emotionPair.tertiaryDescription}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scenario */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-purple-700 mb-3">
                {questions[currentQuestion].title}
              </h3>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg mb-4">
                <p className="text-gray-700 leading-relaxed mb-3">
                  {questions[currentQuestion].description}
                </p>
                <p className="font-semibold text-purple-800">
                  {questions[currentQuestion].situation}
                </p>
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-4 mb-6">
              {[
                questions[currentQuestion].emotionPair.primary,
                questions[currentQuestion].emotionPair.secondary,
                questions[currentQuestion].emotionPair.tertiary
              ].map((emotion, optionIndex) => {
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
                      <div>
                        <span className="font-bold text-lg">{emotion}</span>
                        <span className="ml-2 text-xs text-gray-500">
                          ({optionIndex === 0 ? 'Primary' : optionIndex === 1 ? 'Secondary' : 'Tertiary'} Emotion)
                        </span>
                      </div>
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

            {/* Explanation */}
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
                        ? 'Correct!'
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

export default EmotionWheelQuiz;

