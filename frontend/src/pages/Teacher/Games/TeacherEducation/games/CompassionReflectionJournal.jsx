import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { BookOpen, Scale, AlertCircle, TrendingUp, Heart, CheckCircle } from "lucide-react";

const CompassionReflectionJournal = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-26";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [reflections, setReflections] = useState(Array(5).fill(""));
  const [selectedInsights, setSelectedInsights] = useState(Array(5).fill(null));
  const [showFeedback, setShowFeedback] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Define different sets of insights for each question
  const questionInsights = [
    // Question 1 - Balance
    [
      {
        id: 'balance',
        label: 'Balance',
        icon: Scale,
        description: 'Recognizing the need for balance between caring and self-care',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'from-blue-50 to-cyan-50',
        borderColor: 'border-blue-300',
        textColor: 'text-blue-800',
        feedback: {
          title: "Finding Balance in Compassion",
          description: "You've recognized the importance of balance. Feeling emotionally drained is a signal that you've given too much without refilling. Balance means caring deeply while also caring for yourself. This awareness is the first step toward sustainable empathy.",
          keyPoints: [
            "Balance is not about caring less—it's about caring sustainably",
            "Recognizing when you're drained is a form of self-awareness",
            "Setting boundaries allows you to care for others without depleting yourself",
            "Sustainable compassion requires regular self-care and refilling"
          ],
          action: "Consider: What small steps can you take to create more balance? Schedule regular refill activities and set boundaries that allow you to care without depleting yourself."
        }
      },
      {
        id: 'awareness',
        label: 'Awareness',
        icon: AlertCircle,
        description: 'Noticing when you are feeling emotionally drained',
        color: 'from-purple-500 to-indigo-500',
        bgColor: 'from-purple-50 to-indigo-50',
        borderColor: 'border-purple-300',
        textColor: 'text-purple-800',
        feedback: {
          title: "Building Awareness of Your Needs",
          description: "You've identified the importance of awareness. Recognizing when you're emotionally drained is crucial for sustainable compassion. Awareness is the first step toward change and helps you take action before reaching complete exhaustion.",
          keyPoints: [
            "Awareness allows you to recognize early warning signs",
            "Early recognition prevents complete depletion",
            "Awareness gives you power to take corrective action",
            "Self-awareness is essential for sustainable empathy"
          ],
          action: "Consider: What are your early warning signs of emotional drain? How can you catch these signals sooner in the future? Develop a personal check-in system to monitor your emotional energy regularly."
        }
      },
      {
        id: 'boundaries',
        label: 'Boundaries',
        icon: TrendingUp,
        description: 'Setting healthy limits in your caring relationships',
        color: 'from-green-500 to-emerald-500',
        bgColor: 'from-green-50 to-emerald-50',
        borderColor: 'border-green-300',
        textColor: 'text-green-800',
        feedback: {
          title: "Establishing Healthy Boundaries",
          description: "You've recognized the importance of boundaries. Healthy boundaries aren't barriers to caring—they're structures that allow you to care sustainably. They protect your capacity to help others over the long term.",
          keyPoints: [
            "Boundaries preserve your capacity to care for others",
            "Healthy limits prevent compassion fatigue",
            "Boundaries aren't selfish—they're necessary",
            "Clear boundaries improve the quality of your care"
          ],
          action: "Consider: Where can you set healthier boundaries in your caring relationships? How can you communicate these boundaries respectfully? Practice saying no when needed to preserve your emotional energy."
        }
      }
    ],
    // Question 2 - Self-Care
    [
      {
        id: 'restoration',
        label: 'Restoration',
        icon: Scale,
        description: 'Understanding the need for restoration after emotional investment',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'from-blue-50 to-cyan-50',
        borderColor: 'border-blue-300',
        textColor: 'text-blue-800',
        feedback: {
          title: "The Importance of Restoration",
          description: "You've acknowledged the need for restoration. Just as physical energy requires rest, emotional energy requires restoration. Taking time to replenish yourself isn't optional—it's essential for sustainable compassion.",
          keyPoints: [
            "Restoration maintains your capacity to care",
            "Regular restoration prevents long-term depletion",
            "Self-care enables you to care for others",
            "Restoration is an investment in your effectiveness"
          ],
          action: "Consider: What restoration practices work best for you? How can you schedule regular restoration time? Make restoration a non-negotiable part of your routine."
        }
      },
      {
        id: 'recharge',
        label: 'Recharge',
        icon: AlertCircle,
        description: 'Identifying activities that truly recharge your emotional energy',
        color: 'from-purple-500 to-indigo-500',
        bgColor: 'from-purple-50 to-indigo-50',
        borderColor: 'border-purple-300',
        textColor: 'text-purple-800',
        feedback: {
          title: "Discovering True Recharge Activities",
          description: "You've recognized the importance of identifying genuine recharge activities. Not all activities that seem relaxing actually restore your emotional energy. Understanding what truly recharges you is key to effective self-care.",
          keyPoints: [
            "True recharge activities restore rather than drain you",
            "Different activities work for different people",
            "Quality matters more than quantity in recharge time",
            "Know the difference between distraction and restoration"
          ],
          action: "Consider: Which activities genuinely recharge you versus just distracting you? How can you prioritize these activities? Experiment with different recharge methods to find what works best."
        }
      },
      {
        id: 'priorities',
        label: 'Priorities',
        icon: TrendingUp,
        description: 'Balancing your needs with the needs of others',
        color: 'from-green-500 to-emerald-500',
        bgColor: 'from-green-50 to-emerald-50',
        borderColor: 'border-green-300',
        textColor: 'text-green-800',
        feedback: {
          title: "Balancing Personal Priorities",
          description: "You've understood the importance of balancing your needs with others'. This isn't about selfishness—it's about sustainability. When you're depleted, everyone suffers. Prioritizing your needs ensures you can continue to care effectively.",
          keyPoints: [
            "Your wellbeing affects your ability to care for others",
            "Balanced priorities lead to sustainable compassion",
            "Neglecting your needs ultimately harms others too",
            "Healthy self-interest benefits everyone"
          ],
          action: "Consider: How can you integrate your needs into your daily priorities? What would happen if you consistently put your wellbeing first? Create a personal priority framework that includes self-care."
        }
      }
    ],
    // Question 3 - Recognition
    [
      {
        id: 'acknowledge',
        label: 'Acknowledge',
        icon: Scale,
        description: 'Accepting your emotional responses without judgment',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'from-blue-50 to-cyan-50',
        borderColor: 'border-blue-300',
        textColor: 'text-blue-800',
        feedback: {
          title: "Accepting Your Emotional Responses",
          description: "You've learned to acknowledge your emotions without judgment. This acceptance is crucial for processing feelings healthily. Self-judgment often compounds the original emotional difficulty, making recovery harder.",
          keyPoints: [
            "Acceptance doesn't mean agreement with the emotion",
            "Judgment often intensifies difficult feelings",
            "Acknowledging emotions helps process them",
            "Self-compassion speeds emotional recovery"
          ],
          action: "Consider: How can you practice self-compassion when experiencing difficult emotions? What would change if you stopped judging your responses? Develop a self-compassionate inner voice."
        }
      },
      {
        id: 'validate',
        label: 'Validate',
        icon: AlertCircle,
        description: 'Validating your feelings as legitimate responses',
        color: 'from-purple-500 to-indigo-500',
        bgColor: 'from-purple-50 to-indigo-50',
        borderColor: 'border-purple-300',
        textColor: 'text-purple-800',
        feedback: {
          title: "Validating Your Emotional Experience",
          description: "You've recognized the importance of validating your feelings. Your emotions are legitimate responses to your experiences. Validation helps you process feelings constructively rather than suppressing them.",
          keyPoints: [
            "All emotions serve important functions",
            "Validation reduces emotional intensity",
            "Self-validation builds emotional resilience",
            "Recognizing your feelings as valid"
          ],
          action: "Consider: How would you validate a friend's similar feelings? Apply that same validation to yourself. Practice recognizing your emotions as normal and acceptable."
        }
      },
      {
        id: 'normalize',
        label: 'Normalize',
        icon: TrendingUp,
        description: 'Understanding that these feelings are common among carers',
        color: 'from-green-500 to-emerald-500',
        bgColor: 'from-green-50 to-emerald-50',
        borderColor: 'border-green-300',
        textColor: 'text-green-800',
        feedback: {
          title: "Normalizing Your Experiences",
          description: "You've understood that your experiences are common among carers. This normalization reduces isolation and shame. Knowing others share similar feelings validates your experience and opens possibilities for mutual support.",
          keyPoints: [
            "Shared experiences reduce feelings of isolation",
            "Normalization decreases shame and guilt",
            "Common experiences offer opportunities for support",
            "You're not alone in these feelings"
          ],
          action: "Consider: How can you connect with other carers who understand? What would change if you shared your experiences more openly? Seek communities of support among fellow carers."
        }
      }
    ],
    // Question 4 - Growth
    [
      {
        id: 'learn',
        label: 'Learn',
        icon: Scale,
        description: 'Viewing experiences as opportunities for learning',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'from-blue-50 to-cyan-50',
        borderColor: 'border-blue-300',
        textColor: 'text-blue-800',
        feedback: {
          title: "Learning from Your Experiences",
          description: "You've identified experiences as learning opportunities. This growth mindset transforms difficulties into wisdom. Learning from challenges builds resilience and prevents repeating the same patterns.",
          keyPoints: [
            "Difficult experiences offer valuable lessons",
            "Growth comes from reflection and adjustment",
            "Challenges develop emotional strength",
            "Experience builds wisdom for future situations"
          ],
          action: "Consider: What specific lessons have you learned from this experience? How will these lessons guide your future choices? Create a personal learning practice from difficult experiences."
        }
      },
      {
        id: 'adapt',
        label: 'Adapt',
        icon: AlertCircle,
        description: 'Adjusting your approach based on new insights',
        color: 'from-purple-500 to-indigo-500',
        bgColor: 'from-purple-50 to-indigo-50',
        borderColor: 'border-purple-300',
        textColor: 'text-purple-800',
        feedback: {
          title: "Adapting Your Approach",
          description: "You've recognized the need to adapt based on new insights. Flexibility is key to sustainable caring. Adapting your approach prevents repeating patterns that lead to depletion.",
          keyPoints: [
            "Flexibility prevents repetitive stress patterns",
            "Adaptation shows wisdom and growth",
            "Adjusting preserves your capacity",
            "Change requires ongoing assessment"
          ],
          action: "Consider: What specific adjustments will you make going forward? How can you regularly assess and adjust your approach? Build flexibility into your caring practices."
        }
      },
      {
        id: 'develop',
        label: 'Develop',
        icon: TrendingUp,
        description: 'Developing new skills for sustainable compassion',
        color: 'from-green-500 to-emerald-500',
        bgColor: 'from-green-50 to-emerald-50',
        borderColor: 'border-green-300',
        textColor: 'text-green-800',
        feedback: {
          title: "Developing Sustainable Skills",
          description: "You've understood the importance of developing new skills for sustainable compassion. Skill development enhances your capacity and reduces the likelihood of depletion. Continuous growth keeps your caring practices effective and sustainable.",
          keyPoints: [
            "Skills improve your effectiveness",
            "Development increases your capacity",
            "Ongoing learning prevents stagnation",
            "New skills offer better solutions"
          ],
          action: "Consider: What specific skills would enhance your sustainable compassion? How can you develop these skills? Create a personal development plan for compassionate care."
        }
      }
    ],
    // Question 5 - Integration
    [
      {
        id: 'integrate',
        label: 'Integrate',
        icon: Scale,
        description: 'Bringing insights into your daily practice',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'from-blue-50 to-cyan-50',
        borderColor: 'border-blue-300',
        textColor: 'text-blue-800',
        feedback: {
          title: "Integrating Insights into Practice",
          description: "You've recognized the importance of integrating insights into daily practice. Implementation transforms understanding into lasting change. Regular practice embeds new approaches and makes them automatic.",
          keyPoints: [
            "Integration makes insights practical",
            "Regular practice creates lasting change",
            "Implementation bridges understanding and action",
            "Consistent application creates new habits"
          ],
          action: "Consider: How will you integrate these insights into your daily routine? What specific practices will you implement? Create accountability measures for consistent application."
        }
      },
      {
        id: 'sustain',
        label: 'Sustain',
        icon: AlertCircle,
        description: 'Creating systems for long-term sustainable compassion',
        color: 'from-purple-500 to-indigo-500',
        bgColor: 'from-purple-50 to-indigo-50',
        borderColor: 'border-purple-300',
        textColor: 'text-purple-800',
        feedback: {
          title: "Sustaining Compassionate Practice",
          description: "You've understood the need for systems that support long-term sustainable compassion. Sustained systems ensure consistency and prevent relapse to old patterns. Building sustainability into your approach protects your capacity over time.",
          keyPoints: [
            "Systems provide consistent support",
            "Sustainability prevents relapse to old patterns",
            "Long-term thinking ensures continued capacity",
            "Built-in safeguards protect your wellbeing"
          ],
          action: "Consider: What systems will support your sustained compassion? How can you build safeguards into your routine? Create environmental supports for your compassionate practice."
        }
      },
      {
        id: 'evolve',
        label: 'Evolve',
        icon: TrendingUp,
        description: 'Continuously evolving your approach to caring',
        color: 'from-green-500 to-emerald-500',
        bgColor: 'from-green-50 to-emerald-50',
        borderColor: 'border-green-300',
        textColor: 'text-green-800',
        feedback: {
          title: "Evolving Your Caring Approach",
          description: "You've recognized the importance of continuous evolution in your caring approach. Evolution keeps your practices fresh and effective. Regular evolution prevents stagnation and adapts to changing circumstances.",
          keyPoints: [
            "Continuous evolution maintains effectiveness",
            "Adaptation to change prevents obsolescence",
            "Growth keeps practices vibrant",
            "Evolution responds to new challenges"
          ],
          action: "Consider: How will you continue evolving your caring approach? What mechanisms will ensure ongoing growth? Build evolution into your regular self-assessment process."
        }
      }
    ]
  ];

  const handleWriteReflection = () => {
    const currentReflection = reflections[currentQuestionIndex];
    if (currentReflection.trim().length < 50) {
      alert(`Please write at least 50 characters for your reflection on question ${currentQuestionIndex + 1}. Take your time to reflect deeply on your experience.`);
      return;
    }
    // Reflection is valid, can move to next question or insight selection
  };

  const handleInsightSelect = (insight) => {
    // Update the selected insight for the current question
    const newSelectedInsights = [...selectedInsights];
    newSelectedInsights[currentQuestionIndex] = insight;
    setSelectedInsights(newSelectedInsights);
    
    // If all questions are completed, show feedback and set full score
    const allCompleted = newSelectedInsights.every(insi => insi !== null);
    if (allCompleted) {
      setShowFeedback(true);
      setScore(5); // Full score for all 5 questions
    }
  };

  const handleComplete = () => {
    setShowGameOver(true);
  };

  return (
    <TeacherGameShell
      title={gameData?.title || "Compassion Reflection Journal"}
      subtitle={gameData?.description || "Reflect on a recent moment of deep empathy and its impact"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={showFeedback ? totalLevels : currentQuestionIndex + 0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showFeedback ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-10 h-10 text-purple-600" />
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Compassion Reflection Journal Question {currentQuestionIndex + 1}/5
                  </h2>
                  <p className="text-gray-600 text-lg mt-1">
                    Question {currentQuestionIndex + 1} of 5 - Complete all for full score
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-lg mb-6">
                Take time to reflect on a recent moment when you felt emotionally drained from helping someone. 
                This reflection helps build awareness and reduces compassion fatigue.
              </p>
            </div>

            {/* Progress indicator */}
            <div className="mb-6">
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>Progress</span>
                <span>{selectedInsights.filter(insi => insi !== null).length}/5 completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(selectedInsights.filter(insi => insi !== null).length / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Reflection Prompt */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
                <div className="flex items-start gap-4">
                  <Heart className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      Reflection Prompt
                    </h3>
                    <p className="text-xl text-gray-700 font-semibold mb-4 italic">
                      "When did you last feel emotionally drained helping someone?"
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      Think about a specific situation where you were helping someone—a student, colleague, parent, 
                      or someone in your personal life—and you felt emotionally drained afterward. What happened? 
                      How did you feel? What did you notice about your energy and capacity?
                    </p>
                  </div>
                </div>
              </div>

              {/* Reflection Text Area */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Write your reflection for question {currentQuestionIndex + 1} (minimum 50 characters):
                </label>
                <textarea
                  value={reflections[currentQuestionIndex]}
                  onChange={(e) => {
                    const newReflections = [...reflections];
                    newReflections[currentQuestionIndex] = e.target.value;
                    setReflections(newReflections);
                  }}
                  placeholder="For example: 'Last week, I spent hours after school with a student who was going through a difficult family situation. I listened, offered support, and tried to help them process their feelings. By the time I got home, I felt completely drained. I had nothing left for my own family, and I realized I had taken on their emotional burden. I kept thinking about their situation all evening, and I lost sleep worrying about them. I felt like I needed to do more, but I also felt exhausted...'"
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none text-gray-800 min-h-[250px] resize-none text-lg leading-relaxed"
                />
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {reflections[currentQuestionIndex].length} characters (minimum 50)
                  </p>
                  {reflections[currentQuestionIndex].trim().length < 50 && (
                    <p className="text-sm text-orange-600 font-medium">
                      Please write at least 50 characters to continue
                    </p>
                  )}
                </div>
              </div>

              {/* Insight Selection (shown when reflection is written) */}
              {reflections[currentQuestionIndex].trim().length >= 50 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Choose the insight that resonates most with your reflection:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {questionInsights[currentQuestionIndex].map((insight) => {
                      const Icon = insight.icon;
                      return (
                        <motion.button
                          key={insight.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleInsightSelect(insight.id)}
                          className={`p-6 rounded-xl border-2 ${insight.borderColor} bg-gradient-to-br ${insight.bgColor} hover:shadow-lg transition-all text-left`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${insight.color} flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h4 className={`text-xl font-bold ${insight.textColor}`}>
                              {insight.label}
                            </h4>
                          </div>
                          <p className={`text-sm ${insight.textColor} opacity-80`}>
                            {insight.description}
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => currentQuestionIndex > 0 && setCurrentQuestionIndex(currentQuestionIndex - 1)}
                  disabled={currentQuestionIndex === 0}
                  className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </motion.button>
                
                {currentQuestionIndex < 4 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (reflections[currentQuestionIndex].trim().length >= 50 && selectedInsights[currentQuestionIndex] !== null) {
                        setCurrentQuestionIndex(currentQuestionIndex + 1);
                      } else {
                        alert('Please complete both the reflection and insight selection for this question before continuing.');
                      }
                    }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Next
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (reflections[currentQuestionIndex].trim().length >= 50 && selectedInsights[currentQuestionIndex] !== null) {
                        // Check if all questions are completed
                        const allCompleted = selectedInsights.every(insi => insi !== null);
                        if (allCompleted) {
                          setShowFeedback(true);
                          setScore(5); // Full score for all 5 questions
                        } else {
                          alert('Please complete all questions before finishing.');
                        }
                      } else {
                        alert('Please complete both the reflection and insight selection for this question before finishing.');
                      }
                    }}
                    disabled={selectedInsights.some(insi => insi === null)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Complete All Questions
                  </motion.button>
                )}
              </div>
            </div>

            {/* Guidance */}
            <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>💡 Guidance:</strong> Take your time with this reflection. There are no right or wrong answers. 
                The purpose is to build awareness of your patterns and emotions around compassion and caregiving. 
                Be honest with yourself about your experience.
              </p>
            </div>
          </div>
        ) : (
          /* Feedback Section - Summary of all 5 questions */
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Reflection Summary</h2>
              <p className="text-gray-600 text-lg mb-8 text-center">Congratulations! You've completed all 5 reflection questions and earned 5 Healcoins.</p>
              
              {/* Display all reflections and insights */}
              {questionInsights.map((insightsSet, qIndex) => {
                const selectedInsightId = selectedInsights[qIndex];
                const insightData = insightsSet.find(i => i.id === selectedInsightId);
                const reflectionText = reflections[qIndex];
                
                return insightData ? (
                  <div key={qIndex} className="mb-10">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Question {qIndex + 1} Summary</h3>
                    
                    {/* Insight Header */}
                    <div className={`bg-gradient-to-br ${insightData.bgColor} rounded-xl p-6 border-2 ${insightData.borderColor} mb-6`}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${insightData.color} flex items-center justify-center`}>
                          {React.createElement(insightData.icon, { className: "w-8 h-8 text-white" })}
                        </div>
                        <div>
                          <h2 className={`text-2xl font-bold ${insightData.textColor} mb-2`}>
                            {insightData.feedback.title}
                          </h2>
                          <p className={`text-lg ${insightData.textColor} opacity-90`}>
                            Insight: {insightData.label}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Your Reflection */}
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-gray-800 mb-3">Your Reflection:</h4>
                      <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {reflectionText}
                        </p>
                      </div>
                    </div>

                    {/* Key Points */}
                    <div className="mb-6">
                      <div className={`bg-gradient-to-br ${insightData.bgColor} rounded-xl p-6 border-2 ${insightData.borderColor} mb-4`}>
                        <h4 className={`text-lg font-bold ${insightData.textColor} mb-3`}>
                          Understanding Your Insight
                        </h4>
                        <p className={`text-base ${insightData.textColor} leading-relaxed mb-4`}>
                          {insightData.feedback.description}
                        </p>
                      </div>

                      <h5 className="text-md font-bold text-gray-800 mb-3">Key Points to Remember:</h5>
                      <div className="space-y-3">
                        {insightData.feedback.keyPoints.map((point, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3 bg-white rounded-lg p-4 border-2 border-gray-200"
                          >
                            <CheckCircle className={`w-6 h-6 ${insightData.textColor} flex-shrink-0 mt-0.5`} />
                            <p className="text-gray-700 leading-relaxed">{point}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Action Prompt */}
                    <div className={`bg-white rounded-xl p-6 border-l-4 ${insightData.borderColor} mb-6`}>
                      <h5 className={`font-bold text-md ${insightData.textColor} mb-3`}>
                        💡 Reflection Action:
                      </h5>
                      <p className={`${insightData.textColor} leading-relaxed`}>
                        {insightData.feedback.action}
                      </p>
                    </div>
                  </div>
                ) : null;
              }).filter(Boolean)}

              {/* Teacher Tip */}
              <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900 mb-2">
                      💡 Teacher Tip:
                    </p>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      Remind staff that awareness reduces fatigue's hold. Simply becoming aware of when and how you feel emotionally drained is powerful. Awareness is the first step toward change. When you notice the patterns—when you're most likely to feel drained, what situations trigger it, how it affects you—you gain power over it. Awareness allows you to make conscious choices about boundaries, self-care, and how you engage with others. Share this awareness with colleagues and create a culture where recognizing compassion fatigue is normalized and addressed. Awareness doesn't eliminate challenges, but it reduces their hold over you.
                    </p>
                  </div>
                </div>
              </div>

              {/* Complete Button */}
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleComplete}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Complete Reflection
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default CompassionReflectionJournal;

