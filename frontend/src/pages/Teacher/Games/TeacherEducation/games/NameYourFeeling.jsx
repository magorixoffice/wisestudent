import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";

const NameYourFeeling = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-1";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  const allScenarios = [
    {
      id: 1,
      title: "Noisy Classroom Scenario",
      description: "Your classroom is unusually loud and chaotic. Students are talking over each other, some are out of their seats, and despite your attempts to get their attention, the noise level keeps rising. You've tried redirecting multiple times, but the class seems restless and unfocused.",
      options: [
        "Calm and Patient",
        "Frustrated and Overwhelmed",
        "Energetic and Excited",
        "Indifferent and Unaffected"
      ],
      correct: 1, // Frustrated and Overwhelmed
      insight: "That's frustration mixed with fatigue. Recognizing this helps you pause before reacting.",
      reflection: "Recognizing you feel 'Frustrated and Overwhelmed' helps you pause before reacting. Naming this emotion allows you to respond thoughtfully rather than escalating the situation. When you label your feeling, you can choose a calm response strategy that maintains classroom management while addressing the students' needs.",
      teacherTip: "Pause and label your feelings before reacting to stressful moments. When you name your frustration, you create space to choose your response. You might say to yourself: 'I'm feeling frustrated. Let me take a breath and use a calm redirect strategy.'"
    },
    {
      id: 2,
      title: "Meeting Feedback Scenario",
      description: "During a staff meeting, your principal gives feedback on your recent lesson observation. The feedback feels critical and focuses on areas where you need improvement. Other teachers are listening, and you feel your face getting warm. The feedback seems to overshadow the positive aspects of your teaching.",
      options: [
        "Confident and Receptive",
        "Defensive and Embarrassed",
        "Grateful and Motivated",
        "Angry and Resentful"
      ],
      correct: 1, // Defensive and Embarrassed
      insight: "That's defensiveness mixed with embarrassment. Acknowledging this helps you process the feedback more constructively.",
      reflection: "Acknowledging you feel 'Defensive and Embarrassed' helps you process the feedback more constructively. You can say to yourself: 'I'm feeling defensive right now. Let me take a moment to breathe and consider what I can learn from this feedback.' This allows you to respond professionally rather than reactively.",
      teacherTip: "Naming your defensive feelings helps you receive feedback with openness. When you label your embarrassment, you can choose to see feedback as growth opportunities rather than personal attacks. This models resilience for your students."
    },
    {
      id: 3,
      title: "Student Praise Scenario",
      description: "A student who has been struggling with math comes to you after class, beaming with pride. They show you their test score - they passed for the first time this semester. Their eyes are shining, and they're thanking you for your help. The moment feels deeply meaningful.",
      options: [
        "Proud and Joyful",
        "Surprised and Skeptical",
        "Relieved and Anxious",
        "Indifferent and Unmoved"
      ],
      correct: 0, // Proud and Joyful
      insight: "That's pride mixed with joy. Recognizing this helps you savor the teaching moment.",
      reflection: "Recognizing you feel 'Proud and Joyful' helps you savor this meaningful teaching moment. You can say: 'I'm feeling so proud of this student's progress and joyful about this breakthrough.' This reinforces positive classroom culture and teaches students to appreciate their achievements.",
      teacherTip: "Naming positive emotions like 'pride' and 'joy' helps you celebrate student successes authentically. When you express these emotions, students learn to recognize and express their own achievements, strengthening classroom community."
    },
    {
      id: 4,
      title: "Staffroom Tension Scenario",
      description: "You're in the staffroom during lunch break. A colleague is venting about a difficult parent meeting, and the conversation turns into complaining about students and administration. The energy feels negative and draining. You want to contribute but feel uncomfortable with the tone of the conversation.",
      options: [
        "Comfortable and Engaged",
        "Uncomfortable and Drained",
        "Energetic and Motivated",
        "Angry and Critical"
      ],
      correct: 1, // Uncomfortable and Drained
      insight: "That's discomfort mixed with emotional fatigue. Naming this helps you set healthy boundaries.",
      reflection: "Identifying you feel 'Uncomfortable and Drained' helps you set healthy boundaries. You can say to yourself: 'I'm feeling drained by this negative conversation. I need to protect my energy.' This allows you to choose how to engage or disengage in a way that preserves your wellbeing.",
      teacherTip: "Naming your discomfort helps you protect your emotional energy. When you recognize you're feeling drained, you can choose to step away or redirect conversations toward more constructive topics. This models self-care and boundary-setting for your students."
    },
    {
      id: 5,
      title: "Last Period Chaos Scenario",
      description: "It's Friday afternoon, last period of the week. Your students are restless, talking, and clearly ready for the weekend. You're trying to teach an important concept, but students keep interrupting with off-topic questions. You've been teaching all day, and your energy is running low.",
      options: [
        "Energetic and Enthusiastic",
        "Tired and Frustrated",
        "Excited and Playful",
        "Calm and Centered"
      ],
      correct: 1, // Tired and Frustrated
      insight: "That's fatigue mixed with frustration. Acknowledging this helps you adjust your approach.",
      reflection: "Acknowledging you feel 'Tired and Frustrated' helps you adjust your teaching approach. You can say to yourself: 'I'm feeling tired and frustrated. Let me adapt my lesson to match the class energy rather than fighting it.' This allows you to be flexible and responsive to the classroom dynamic.",
      teacherTip: "Naming your fatigue helps you adapt rather than push through. When you recognize you're tired, you can adjust your teaching strategy to match the moment. This shows students that flexibility and self-awareness are valuable skills."
    }
  ];

  // Use first 5 scenarios for this game (as per game structure requirement)
  const scenarios = allScenarios.slice(0, 5);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const newSelectedAnswers = { ...selectedAnswers, [questionIndex]: optionIndex };
    setSelectedAnswers(newSelectedAnswers);

    // Check if answer is correct
    if (optionIndex === scenarios[questionIndex].correct) {
      setScore(prev => prev + 1);
    }

    // Move to next question after a short delay
    setTimeout(() => {
      if (questionIndex < scenarios.length - 1) {
        setCurrentQuestion(questionIndex + 1);
      } else {
        // All questions answered
        setShowGameOver(true);
      }
    }, 2500); // 2.5 second delay to show reflection
  };

  const getOptionStyle = (questionIndex, optionIndex) => {
    const selected = selectedAnswers[questionIndex] === optionIndex;
    const isCorrect = optionIndex === scenarios[questionIndex].correct;
    const isSelected = selected;
    const showFeedback = isSelected;

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
      title={gameData?.title || "Name Your Feeling"}
      subtitle={gameData?.description || "Identify personal emotions in typical classroom or staffroom situations"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentQuestion}
    >
      {currentQuestion < scenarios.length ? (
        <div className="w-full max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Scenario {currentQuestion + 1} of {scenarios.length}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  Score: {score}/{scenarios.length}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-purple-700 mb-3">
                {scenarios[currentQuestion].title}
              </h3>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg mb-4">
                <p className="text-gray-700 leading-relaxed">
                  {scenarios[currentQuestion].description}
                </p>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
              What emotion are you feeling in this situation?
            </h2>

            <div className="space-y-4 mb-6">
              {scenarios[currentQuestion].options.map((option, optionIndex) => {
                const isSelected = selectedAnswers[currentQuestion] === optionIndex;
                const isCorrect = optionIndex === scenarios[currentQuestion].correct;
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

            {/* Insight and Reflection Message */}
            {selectedAnswers[currentQuestion] !== undefined && (
              <div className={`mt-6 p-4 rounded-xl border-2 ${
                selectedAnswers[currentQuestion] === scenarios[currentQuestion].correct
                  ? 'bg-green-50 border-green-200'
                  : 'bg-orange-50 border-orange-200'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`text-2xl flex-shrink-0 ${
                    selectedAnswers[currentQuestion] === scenarios[currentQuestion].correct
                      ? 'text-green-600'
                      : 'text-orange-600'
                  }`}>
                    {selectedAnswers[currentQuestion] === scenarios[currentQuestion].correct ? '💡' : '📝'}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold mb-2 ${
                      selectedAnswers[currentQuestion] === scenarios[currentQuestion].correct
                        ? 'text-green-800'
                        : 'text-orange-800'
                    }`}>
                      {selectedAnswers[currentQuestion] === scenarios[currentQuestion].correct
                        ? 'Insight'
                        : 'Learning Moment'}
                    </h4>
                    {selectedAnswers[currentQuestion] === scenarios[currentQuestion].correct && (
                      <div className="bg-indigo-100 rounded-lg p-3 mb-3 border border-indigo-200">
                        <p className="text-sm font-semibold text-indigo-900 mb-1">System Insight:</p>
                        <p className="text-sm text-indigo-800 italic">
                          "{scenarios[currentQuestion].insight}"
                        </p>
                      </div>
                    )}
                    <p className={`text-sm leading-relaxed mb-2 ${
                      selectedAnswers[currentQuestion] === scenarios[currentQuestion].correct
                        ? 'text-green-700'
                        : 'text-orange-700'
                    }`}>
                      {scenarios[currentQuestion].reflection}
                    </p>
                    <div className="bg-white/60 rounded-lg p-3 mt-3 border border-purple-200">
                      <p className="text-xs font-semibold text-purple-800 mb-1">Teacher Tip:</p>
                      <p className="text-xs text-purple-700">
                        {scenarios[currentQuestion].teacherTip}
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

export default NameYourFeeling;

