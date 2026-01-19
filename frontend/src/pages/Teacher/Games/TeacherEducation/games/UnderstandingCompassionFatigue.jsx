import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Heart, HeartCrack, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const UnderstandingCompassionFatigue = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-21";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentStory, setCurrentStory] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Teacher stories about empathy vs compassion fatigue
  const stories = [
    {
      id: 1,
      title: "The Struggling Student",
      story: "Sarah, a student in your class, has been showing signs of distress. Her grades are dropping, she's withdrawn, and you've noticed she hasn't been eating lunch. You've spent hours after school talking with her, calling her parents, and researching support resources. You've also been losing sleep worrying about her, and you find yourself thinking about her situation constantly, even on weekends. You feel exhausted and emotionally drained, but you keep pushing yourself to do more.",
      correctAnswer: "compassion-fatigue", // This is compassion fatigue
      healthyEmpathy: {
        title: "Healthy Empathy",
        description: "You care about Sarah and want to help. You've connected her with the school counselor, notified her parents, and checked in with her regularly. You maintain boundaries and recognize that you can support her without taking on all of her emotional burden. You still care deeply, but you also take care of yourself.",
        explanation: "Healthy empathy means caring deeply while maintaining boundaries. You can support students without absorbing all their pain. You recognize that you're part of a support system, not the only support."
      },
      
      mixedCase: {
        title: "Mixed Case",
        description: "This scenario shows some signs of both healthy empathy and compassion fatigue. While you care deeply and are connecting resources, the loss of sleep and constant worry indicate you may be heading toward compassion fatigue.",
        explanation: "Some behaviors show healthy empathy (caring, connecting with resources) but others indicate early signs of compassion fatigue (loss of sleep, constant worry). This is a warning sign to establish better boundaries and self-care practices."
      },
      compassionFatigue: {
        title: "Compassion Fatigue",
        description: "You're experiencing compassion fatigue. The constant worry, loss of sleep, and emotional exhaustion are signs that you've taken on too much. You're trying to carry Sarah's burden alone, which is leaving you drained and unable to be fully present for other students or yourself.",
        explanation: "Compassion fatigue happens when caring deeply becomes overwhelming. Signs include constant worry, loss of sleep, emotional exhaustion, and feeling like you must do everything yourself. This is different from healthy empathy, which includes self-care and boundaries."
      },
    },
    {
      id: 2,
      title: "The Overwhelmed Colleague",
      story: "Your colleague, Maria, has been going through a difficult divorce and is struggling to manage her classes. You've been covering her duties, taking on extra students, and listening to her problems daily. You feel responsible for helping her through this, and you've been working late every day to make sure everything gets done. You're starting to feel resentful and exhausted, but you don't want to let her down.",
      correctAnswer: "compassion-fatigue", // This is compassion fatigue
      healthyEmpathy: {
        title: "Healthy Empathy",
        description: "You support Maria by helping with urgent tasks and checking in with her. You've encouraged her to seek professional support and use her leave time. You maintain your own boundaries and recognize that you can help without taking on all her responsibilities. You care, but you also protect your own wellbeing.",
        explanation: "Healthy empathy means supporting others while maintaining your own capacity. You can help without taking on someone else's entire burden. Setting boundaries allows you to care sustainably."
      },
      compassionFatigue: {
        title: "Compassion Fatigue",
        description: "You're experiencing compassion fatigue. Taking on all of Maria's responsibilities, working late every day, and feeling responsible for her wellbeing are signs that you've crossed from caring into over-caring. The resentment and exhaustion indicate you need to set boundaries.",
        explanation: "Compassion fatigue includes taking on others' responsibilities, working beyond your capacity, and feeling responsible for others' wellbeing. Healthy support includes boundaries and recognizing when professional help is needed."
      },
      mixedCase: {
        title: "Mixed Case",
        description: "This shows concerning patterns of compassion fatigue with some healthy elements. While you're helping Maria, taking on all her duties and working late daily suggests you're approaching burnout.",
        explanation: "Helping with urgent tasks is healthy, but taking on all responsibilities and working late indicates compassion fatigue developing. Early intervention with boundaries is needed."
      }
    },
    {
      id: 3,
      title: "The Parent Meeting",
      story: "A parent comes to you with concerns about their child's behavior. You listen carefully, acknowledge their feelings, and work together to create a plan. You follow up with the student, implement the plan, and check in with the parent. You feel good about the collaboration, and while you care about the outcome, you also recognize that you've done your part. You maintain your energy and continue to be present for other students.",
      correctAnswer: "healthy-empathy", // This is healthy empathy
      healthyEmpathy: {
        title: "Healthy Empathy",
        description: "This is healthy empathy! You care deeply, listen actively, and work collaboratively. You maintain your energy, recognize your role, and continue to be present for others. You care without taking on all the emotional burden.",
        explanation: "Healthy empathy includes active listening, collaboration, and maintaining your own energy. You can care deeply while recognizing boundaries and your role in a larger support system."
      },
      compassionFatigue: {
        title: "Compassion Fatigue",
        description: "This is NOT compassion fatigue. In this scenario, you're maintaining boundaries, collaborating effectively, and preserving your energy. You care without becoming overwhelmed.",
        explanation: "This scenario shows healthy empathy, not compassion fatigue. The key difference is maintaining boundaries and energy while still caring deeply."
      },
      mixedCase: {
        title: "Mixed Case",
        description: "This scenario demonstrates healthy empathy practices. You're collaborating effectively and maintaining boundaries while still caring deeply about outcomes.",
        explanation: "All indicators point to healthy empathy: collaboration, maintained energy, clear boundaries, and effective communication. This is the ideal balance."
      }
    },
    {
      id: 4,
      title: "The Crisis Situation",
      story: "A student in your class experiences a family crisis. You immediately connect them with the school counselor and notify the appropriate support staff. You check in with the student regularly, offer support, and maintain your regular teaching responsibilities. You feel concerned and want to help, but you also recognize that you're part of a team supporting this student. You continue to take care of yourself and maintain your energy for all your students.",
      correctAnswer: "healthy-empathy", // This is healthy empathy
      healthyEmpathy: {
      
      compassionFatigue: {
        title: "Compassion Fatigue",
        description: "This is NOT compassion fatigue. In this scenario, you're working as part of a team, maintaining boundaries, and preserving your energy. You care without becoming overwhelmed.",
        explanation: "This scenario shows healthy empathy. The key is working collaboratively, maintaining boundaries, and preserving your own capacity while caring deeply."
      },
      mixedCase: {
        title: "Mixed Case",
        description: "This exemplifies healthy empathy in action. Working as part of a team while maintaining personal boundaries shows excellent professional balance.",
        explanation: "Team collaboration, maintained boundaries, preserved energy, and continued presence for all students demonstrate mature healthy empathy practices."
      },
        title: "Healthy Empathy",
        description: "This is healthy empathy! You respond with care, connect the student with appropriate resources, and maintain your role as part of a support team. You care deeply while maintaining boundaries and your own wellbeing.",
        explanation: "Healthy empathy means responding with care while recognizing you're part of a support system. You can care deeply without taking on the entire emotional burden alone."
      },
    },
    {
      id: 5,
      title: "The Multiple Struggles",
      story: "You have several students facing challenges: one with learning difficulties, one with family problems, and one with behavioral issues. You've been spending hours after school with each of them, researching solutions, calling families, and trying to fix everything yourself. You're working weekends, losing sleep, and feeling like you're not doing enough. You're exhausted, irritable, and starting to feel numb to the students' needs. You feel guilty when you take time for yourself.",
      correctAnswer: "compassion-fatigue", // This is compassion fatigue
      healthyEmpathy: {
        title: "Healthy Empathy",
        description: "This is NOT healthy empathy. In this scenario, you're taking on too much, working beyond your capacity, and feeling guilty about self-care. Healthy empathy would include working with a team, setting boundaries, and recognizing that you can't fix everything alone.",
        explanation: "This scenario shows compassion fatigue. Healthy empathy would include collaboration, boundaries, and recognizing that sustainable care requires self-care and team support."
      },
      compassionFatigue: {
        title: "Compassion Fatigue",
        description: "You're experiencing severe compassion fatigue. The signs are clear: working beyond capacity, loss of sleep, exhaustion, irritability, emotional numbness, and guilt about self-care. You're trying to carry too much alone, which is unsustainable.",
        explanation: "Compassion fatigue includes working beyond capacity, emotional exhaustion, numbness, irritability, and guilt about self-care. The key is recognizing that sustainable care requires boundaries, self-care, and working as part of a team."
      },
      mixedCase: {
        title: "Mixed Case",
        description: "This is a clear case of severe compassion fatigue. Working weekends, losing sleep, feeling numb, and guilt about self-care are classic signs of burnout approaching.",
        explanation: "All indicators point to advanced compassion fatigue: working beyond capacity, emotional exhaustion, numbness, and guilt about self-care. Immediate boundary setting and support seeking needed."
      }
    }
  ];

  const handleAnswerSelect = (answer) => {
    if (selectedAnswers[currentStory]) return; // Already answered

    const isCorrect = answer === stories[currentStory].correctAnswer;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [currentStory]: answer
    }));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentStory < totalLevels - 1) {
      setCurrentStory(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const current = stories[currentStory];
  const selected = selectedAnswers[currentStory];
  const progress = ((currentStory + 1) / totalLevels) * 100;
  const isCorrect = selected === current.correctAnswer;
  const feedback = selected ? (
    selected === 'healthy-empathy' ? current.healthyEmpathy : 
    selected === 'compassion-fatigue' ? current.compassionFatigue : 
    current.mixedCase
  ) : null;

  return (
    <TeacherGameShell
      title={gameData?.title || "Understanding Compassion Fatigue"}
      subtitle={gameData?.description || "Recognize the signs of emotional exhaustion from over-caring"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentStory + 0}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {!showGameOver ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Story {currentStory + 1} of {totalLevels}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                />
              </div>
            </div>

            {/* Story */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {current.title}
              </h2>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {current.story}
                </p>
              </div>
            </div>

            {!showFeedback ? (
              /* Choice Buttons */
              <div className="space-y-4 mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect('healthy-empathy')}
                  disabled={!!selected}
                  className="w-full p-6 rounded-xl border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-800 mb-1">
                        Healthy Empathy
                      </h3>
                      <p className="text-green-700">
                        Caring deeply while maintaining boundaries and self-care
                      </p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect('mixed-case')}
                  disabled={!!selected}
                  className="w-full p-6 rounded-xl border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-800 mb-1">
                        Mixed Case
                      </h3>
                      <p className="text-blue-700">
                        Shows elements of both healthy empathy and concerning patterns
                      </p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect('compassion-fatigue')}
                  disabled={!!selected}
                  className="w-full p-6 rounded-xl border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                      <HeartCrack className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-orange-800 mb-1">
                        Compassion Fatigue
                      </h3>
                      <p className="text-orange-700">
                        Emotional exhaustion from over-caring without boundaries
                      </p>
                    </div>
                  </div>
                </motion.button>
              </div>
            ) : (
              /* Feedback */
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mb-6 rounded-xl p-6 border-2 ${
                    selected === 'healthy-empathy'
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                      : selected === 'mixed-case'
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300'
                      : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    {selected === 'healthy-empathy' ? (
                      <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                    ) : selected === 'mixed-case' ? (
                      <AlertCircle className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <h3 className={`text-2xl font-bold mb-2 ${
                        selected === 'healthy-empathy' ? 'text-green-800' : 
                        selected === 'mixed-case' ? 'text-blue-800' : 'text-orange-800'
                      }`}>
                        {feedback.title}
                      </h3>
                      <p className={`text-lg mb-4 ${
                        selected === 'healthy-empathy' ? 'text-green-700' : 
                        selected === 'mixed-case' ? 'text-blue-700' : 'text-orange-700'
                      }`}>
                        {feedback.description}
                      </p>
                      <div className={`bg-white rounded-lg p-4 border-l-4 ${
                        selected === 'healthy-empathy' ? 'border-green-500' : 
                        selected === 'mixed-case' ? 'border-blue-500' : 'border-orange-500'
                      }`}>
                        <p className={`font-semibold mb-2 ${
                          selected === 'healthy-empathy' ? 'text-green-800' : 
                          selected === 'mixed-case' ? 'text-blue-800' : 'text-orange-800'
                        }`}>
                          💡 Key Insight:
                        </p>
                        <p className={`${
                          selected === 'healthy-empathy' ? 'text-green-700' : 
                          selected === 'mixed-case' ? 'text-blue-700' : 'text-orange-700'
                        }`}>
                          {feedback.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Next Button */}
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    {currentStory < totalLevels - 1 ? 'Next Story' : 'Finish'}
                  </motion.button>
                </div>
              </AnimatePresence>
            )}
          </div>
        ) : (
          /* Game Over Screen */
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-6xl mb-6"
            >
              {score === totalLevels ? '🎉' : score >= totalLevels * 0.6 ? '✨' : '💪'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Game Complete!
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              You scored {score} out of {totalLevels} correctly
            </p>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                {score === totalLevels
                  ? "Perfect! You have a strong understanding of the difference between healthy empathy and compassion fatigue. Remember that caring deeply is a strength, but it needs to be balanced with self-care and boundaries."
                  : score >= totalLevels * 0.6
                  ? "Great job! You're developing awareness of compassion fatigue. Keep practicing recognizing the signs and remember that sustainable care includes self-care."
                  : "Good effort! Understanding compassion fatigue takes practice. Remember that healthy empathy includes boundaries and self-care. Keep learning and be kind to yourself."}
              </p>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Remind staff that caring deeply needs refilling, not guilt. Compassion fatigue is not a sign of weakness or lack of care—it's a sign that you've been giving too much without refilling your own cup. Healthy empathy means caring deeply while also caring for yourself. Set boundaries, practice self-care, and remember that you can't pour from an empty cup. When you recognize signs of compassion fatigue, it's time to refill, not feel guilty.
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

export default UnderstandingCompassionFatigue;

