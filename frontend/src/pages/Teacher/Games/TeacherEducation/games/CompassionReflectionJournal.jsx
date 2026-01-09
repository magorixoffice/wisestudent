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
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [reflection, setReflection] = useState("");
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const insights = [
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
      id: 'guilt',
      label: 'Guilt',
      icon: AlertCircle,
      description: 'Feeling guilty about needing boundaries or self-care',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-300',
      textColor: 'text-orange-800',
      feedback: {
        title: "Understanding Guilt in Compassion",
        description: "You've identified feelings of guilt related to your empathy and caregiving. This is common among teachers who deeply care. Guilt often comes from believing that caring for yourself means you're not caring enough for others. This is a misconception that can lead to burnout.",
        keyPoints: [
          "Guilt about self-care is a sign that you value caring, not a sign you're doing it wrong",
          "Caring for yourself is not selfish—it's necessary for sustainable compassion",
          "Guilt often stems from unrealistic expectations about always being available",
          "Setting boundaries doesn't mean you care less—it means you care smarter"
        ],
        action: "Consider: What if caring for yourself actually makes you better at caring for others? Challenge the belief that self-care means you're not caring enough. You can't pour from an empty cup."
      }
    },
    {
      id: 'growth',
      label: 'Growth',
      icon: TrendingUp,
      description: 'Seeing this as an opportunity for learning and development',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      textColor: 'text-green-800',
      feedback: {
        title: "Growth Through Compassion Reflection",
        description: "You've identified this experience as an opportunity for growth. This is a powerful perspective! Viewing emotional draining as a learning opportunity shows resilience and self-awareness. Growth comes from understanding our patterns and making conscious choices to care more sustainably.",
        keyPoints: [
          "Every experience of emotional draining is a learning opportunity",
          "Growth comes from awareness and making different choices",
          "Recognizing patterns helps you prevent future compassion fatigue",
          "Each reflection strengthens your capacity for sustainable empathy"
        ],
        action: "Consider: What did this experience teach you about your boundaries, needs, and capacity? How can you use this awareness to care more sustainably in the future? Growth comes from reflection and intentional change."
      }
    }
  ];

  const handleWriteReflection = () => {
    if (reflection.trim().length < 50) {
      alert("Please write at least 50 characters for your reflection. Take your time to reflect deeply on your experience.");
      return;
    }
    // Reflection is valid, move to insight selection (no separate step needed)
  };

  const handleInsightSelect = (insight) => {
    setSelectedInsight(insight);
    setShowFeedback(true);
    setScore(1);
  };

  const handleComplete = () => {
    setShowGameOver(true);
  };

  const selectedInsightData = insights.find(i => i.id === selectedInsight);

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
      currentQuestion={1}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showFeedback ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-10 h-10 text-purple-600" />
                <h2 className="text-3xl font-bold text-gray-800">
                  Compassion Reflection Journal
                </h2>
              </div>
              <p className="text-gray-600 text-lg mb-6">
                Take time to reflect on a recent moment when you felt emotionally drained from helping someone. 
                This reflection helps build awareness and reduces compassion fatigue.
              </p>
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
                  Write your reflection (minimum 50 characters):
                </label>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="For example: 'Last week, I spent hours after school with a student who was going through a difficult family situation. I listened, offered support, and tried to help them process their feelings. By the time I got home, I felt completely drained. I had nothing left for my own family, and I realized I had taken on their emotional burden. I kept thinking about their situation all evening, and I lost sleep worrying about them. I felt like I needed to do more, but I also felt exhausted...'"
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none text-gray-800 min-h-[250px] resize-none text-lg leading-relaxed"
                />
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {reflection.length} characters (minimum 50)
                  </p>
                  {reflection.trim().length < 50 && (
                    <p className="text-sm text-orange-600 font-medium">
                      Please write at least 50 characters to continue
                    </p>
                  )}
                </div>
              </div>

              {/* Insight Selection (shown when reflection is written) */}
              {reflection.trim().length >= 50 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Choose the insight that resonates most with your reflection:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {insights.map((insight) => {
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
          /* Feedback Section */
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {selectedInsightData && (
                <>
                  {/* Insight Header */}
                  <div className={`bg-gradient-to-br ${selectedInsightData.bgColor} rounded-xl p-6 border-2 ${selectedInsightData.borderColor} mb-6`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${selectedInsightData.color} flex items-center justify-center`}>
                        {React.createElement(selectedInsightData.icon, { className: "w-8 h-8 text-white" })}
                      </div>
                      <div>
                        <h2 className={`text-3xl font-bold ${selectedInsightData.textColor} mb-2`}>
                          {selectedInsightData.feedback.title}
                        </h2>
                        <p className={`text-lg ${selectedInsightData.textColor} opacity-90`}>
                          Insight: {selectedInsightData.label}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Your Reflection */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Your Reflection:</h3>
                    <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {reflection}
                      </p>
                    </div>
                  </div>

                  {/* Feedback Content */}
                  <div className="mb-6">
                    <div className={`bg-gradient-to-br ${selectedInsightData.bgColor} rounded-xl p-6 border-2 ${selectedInsightData.borderColor} mb-4`}>
                      <h3 className={`text-xl font-bold ${selectedInsightData.textColor} mb-3`}>
                        Understanding Your Insight
                      </h3>
                      <p className={`text-lg ${selectedInsightData.textColor} leading-relaxed mb-4`}>
                        {selectedInsightData.feedback.description}
                      </p>
                    </div>

                    {/* Key Points */}
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-gray-800 mb-3">Key Points to Remember:</h4>
                      <div className="space-y-3">
                        {selectedInsightData.feedback.keyPoints.map((point, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3 bg-white rounded-lg p-4 border-2 border-gray-200"
                          >
                            <CheckCircle className={`w-6 h-6 ${selectedInsightData.textColor} flex-shrink-0 mt-0.5`} />
                            <p className="text-gray-700 leading-relaxed">{point}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Action Prompt */}
                    <div className={`bg-white rounded-xl p-6 border-l-4 ${selectedInsightData.borderColor} mb-6`}>
                      <h4 className={`font-bold text-lg ${selectedInsightData.textColor} mb-3`}>
                        💡 Reflection Action:
                      </h4>
                      <p className={`${selectedInsightData.textColor} leading-relaxed`}>
                        {selectedInsightData.feedback.action}
                      </p>
                    </div>
                  </div>

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
                </>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default CompassionReflectionJournal;

