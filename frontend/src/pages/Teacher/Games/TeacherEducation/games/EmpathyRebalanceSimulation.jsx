import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Battery, BatteryLow, Zap, PlayCircle, Pause, Users, CheckCircle, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";

const EmpathyRebalanceSimulation = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-27";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 3;
  
  const [currentDay, setCurrentDay] = useState(0);
  const [currentIncident, setCurrentIncident] = useState(0);
  const [emotionalEnergy, setEmotionalEnergy] = useState(100); // Start at 100%
  const [selectedActions, setSelectedActions] = useState({}); // { "day-incident": action }
  const [daySummary, setDaySummary] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [dayResults, setDayResults] = useState([]);

  // 3 simulated days with incidents
  const days = [
    {
      id: 1,
      day: "Day 1: Monday Morning",
      incidents: [
        {
          id: '1-1',
          title: "Student Emotional Crisis",
          description: "A student approaches you before class, crying and sharing that they had a fight with their best friend over the weekend. They're upset, and class is about to start. Other students are arriving.",
          type: 'student',
          correctAction: 'refer', // Best to refer to counselor while still listening
          actions: {
            stepIn: {
              label: "Step In",
              description: "Spend 20 minutes talking through the situation before class starts",
              energyChange: -25,
              outcome: "You spend the full morning break helping them, but class starts late and you feel drained. Your emotional energy drops significantly.",
              feedback: "While caring is important, taking on this alone drains your energy. The student needs professional support, and you need to preserve your capacity."
            },
            pause: {
              label: "Pause & Listen",
              description: "Listen briefly, acknowledge their feelings, then continue with class",
              energyChange: -10,
              outcome: "You listen for a few minutes, validate their feelings, and promise to check in after class. You maintain your energy while still being supportive.",
              feedback: "Good balance! You showed empathy by listening and acknowledging, while maintaining boundaries. This preserves your energy."
            },
            refer: {
              label: "Listen, Support, Refer",
              description: "Listen briefly, validate feelings, and connect them with the counselor",
              energyChange: -5,
              outcome: "You listen attentively, validate their feelings, and connect them with the school counselor. The student gets appropriate support, and you preserve your energy for teaching.",
              feedback: "Perfect! You listened and supported while recognizing when to refer. This is the healthy empathy model: listen–support–refer. You maintained boundaries while still being helpful."
            }
          }
        },
        {
          id: '1-2',
          title: "Colleague Overwhelmed",
          description: "During lunch break, a colleague comes to you visibly stressed. They're venting about their workload and personal problems, unloading a lot of emotional weight. They seem to expect you to carry it with them.",
          type: 'colleague',
          correctAction: 'pause', // Best to pause and set boundaries
          actions: {
            stepIn: {
              label: "Step In",
              description: "Take on their problems and offer to help with everything",
              energyChange: -30,
              outcome: "You absorb all their stress and take on their problems. You leave lunch feeling drained and overwhelmed. Your emotional energy drops significantly.",
              feedback: "Stepping in completely takes on too much emotional weight. This drains your energy and prevents you from being sustainably helpful."
            },
            pause: {
              label: "Pause & Set Boundaries",
              description: "Listen briefly, acknowledge their feelings, then gently redirect",
              energyChange: -8,
              outcome: "You listen with empathy, acknowledge their feelings, and gently redirect: 'I understand this is hard. Have you considered talking to a counselor or support service?' You maintain your boundaries while being supportive.",
              feedback: "Excellent! You paused and set boundaries while still showing care. This preserves your energy while being helpful. This is the healthy empathy model."
            },
            refer: {
              label: "Refer Immediately",
              description: "Quickly redirect them to professional support without listening",
              energyChange: -5,
              outcome: "You immediately suggest they talk to someone else. They feel dismissed and unsupported. While you preserved energy, you didn't show empathy.",
              feedback: "While referring can be appropriate, completely skipping the listen step makes people feel dismissed. The healthy model is listen–support–refer, not just refer."
            }
          }
        }
      ]
    },
    {
      id: 2,
      day: "Day 2: Wednesday Afternoon",
      incidents: [
        {
          id: '2-1',
          title: "Multiple Students in Distress",
          description: "During your planning period, three different students approach you with problems: one is struggling academically and crying, one has family issues and needs to talk, and one is being bullied. You have limited time before your next class.",
          type: 'student',
          correctAction: 'refer', // Best to refer multiple students to appropriate support
          actions: {
            stepIn: {
              label: "Step In",
              description: "Try to help all three students yourself in the limited time",
              energyChange: -35,
              outcome: "You try to address all three situations yourself in 30 minutes. You feel completely drained, and none of the students get adequate support. Your emotional energy drops dramatically.",
              feedback: "Trying to handle multiple emotional situations alone drains your energy. It's better to listen briefly to each, then refer them to appropriate support services."
            },
            pause: {
              label: "Pause & Prioritize",
              description: "Listen briefly to each, acknowledge their concerns, and prioritize urgent needs",
              energyChange: -15,
              outcome: "You listen briefly to each student, validate their feelings, and identify the most urgent situation (bullying). You address that while referring the others to appropriate support. You maintain better energy balance.",
              feedback: "Good approach! You paused, listened, and prioritized. However, referring all three to appropriate support would be even better for maintaining your energy while ensuring they get help."
            },
            refer: {
              label: "Listen, Support, Refer",
              description: "Listen briefly to each, validate their feelings, and connect them with appropriate support",
              energyChange: -10,
              outcome: "You listen to each student briefly, validate their feelings, and connect them with appropriate support (counselor, principal, support services). Each student gets proper help, and you preserve your energy. This is sustainable empathy.",
              feedback: "Perfect! You followed the healthy empathy model: listen–support–refer. You showed care to each student while recognizing your role and limits. This maintains your energy while ensuring students get appropriate support."
            }
          }
        },
        {
          id: '2-2',
          title: "Parent Emotional Call",
          description: "A parent calls you after school, very upset and venting about their child's struggles. They're raising their voice, and you can hear the emotional weight in their voice. They seem to expect you to fix everything.",
          type: 'parent',
          correctAction: 'pause', // Best to pause, listen, then redirect
          actions: {
            stepIn: {
              label: "Step In",
              description: "Take on full responsibility and promise to fix everything",
              energyChange: -28,
              outcome: "You take on full responsibility for solving their child's problems and promise to fix everything. You hang up feeling overwhelmed and responsible for outcomes you can't control. Your energy drops significantly.",
              feedback: "Taking on full responsibility drains your energy and sets unrealistic expectations. You can't control or fix everything, and this approach leads to burnout."
            },
            pause: {
              label: "Pause & Redirect",
              description: "Listen, acknowledge their concerns, then redirect toward collaborative solutions",
              energyChange: -10,
              outcome: "You listen attentively, acknowledge their concerns, and then redirect: 'I understand you're concerned. Let's work together to support your child. Let's schedule a meeting to create a plan together.' You maintain boundaries while being supportive.",
              feedback: "Excellent! You paused, listened, and redirected. This shows empathy while maintaining boundaries. You're part of a support system, not the only support. This preserves your energy."
            },
            refer: {
              label: "Refer Immediately",
              description: "Quickly transfer them to the principal without listening",
              energyChange: -5,
              outcome: "You immediately transfer them to the principal. The parent feels dismissed and becomes more upset. While you preserved energy, you didn't show appropriate empathy.",
              feedback: "While boundaries are important, completely skipping the listen step can escalate situations. The healthy model is listen–support–refer, showing empathy before referring."
            }
          }
        }
      ]
    },
    {
      id: 3,
      day: "Day 3: Friday End of Week",
      incidents: [
        {
          id: '3-1',
          title: "Student Breaking Down",
          description: "A student breaks down in tears in your classroom during a test. They're overwhelmed by academic pressure and personal stress. Other students are watching, and you need to manage the situation while the test continues.",
          type: 'student',
          correctAction: 'pause', // Best to pause, listen briefly, then refer
          actions: {
            stepIn: {
              label: "Step In",
              description: "Stop everything and spend the rest of class helping them through their breakdown",
              energyChange: -30,
              outcome: "You stop the entire class and spend the rest of the period helping this student. While caring, you've disrupted the class and taken on their entire emotional burden. You feel drained.",
              feedback: "While caring deeply is important, stopping everything and taking on their full emotional burden drains your energy and disrupts other students. Better to pause, listen briefly, then refer."
            },
            pause: {
              label: "Pause & Support",
              description: "Pause the class briefly, listen to the student, validate their feelings, then refer them to counselor",
              energyChange: -12,
              outcome: "You pause the class briefly, step outside with the student, listen and validate their feelings, then connect them with the counselor. You return to class feeling balanced. The student gets support, and you maintain your capacity.",
              feedback: "Perfect! You paused, listened, supported, and referred. This is the healthy empathy model. You showed care while maintaining boundaries and ensuring the student gets appropriate support."
            },
            refer: {
              label: "Refer Immediately",
              description: "Quickly send them to the counselor without addressing the situation",
              energyChange: -8,
              outcome: "You quickly send them to the counselor without listening or validating. The student feels dismissed, and other students see you as uncaring. While you preserved energy, you didn't show empathy.",
              feedback: "While referring is important, completely skipping the listen step makes students feel dismissed. The healthy model is listen–support–refer, showing empathy before referring."
            }
          }
        },
        {
          id: '3-2',
          title: "Colleague Crisis",
          description: "A colleague comes to you at the end of the day, sharing that they're considering quitting teaching. They're overwhelmed, burned out, and looking to you for support. They're unloading a lot of emotional weight.",
          type: 'colleague',
          correctAction: 'pause', // Best to pause, listen, support, then refer
          actions: {
            stepIn: {
              label: "Step In",
              description: "Take on their crisis and try to solve everything for them",
              energyChange: -35,
              outcome: "You take on their entire crisis, trying to solve everything. You leave work feeling their weight and responsibility. Your emotional energy drops dramatically, and you're now carrying their burden too.",
              feedback: "Taking on someone else's entire crisis drains your energy and isn't sustainable. You can't solve their burnout or make their decisions. Better to listen, support, and refer to professional resources."
            },
            pause: {
              label: "Pause & Support",
              description: "Listen with empathy, validate their feelings, and offer support while maintaining boundaries",
              energyChange: -12,
              outcome: "You listen with empathy, validate their feelings, and offer support: 'I understand this is really hard. Have you considered talking to a counselor or using employee assistance? I'm here to listen, and professional support might help too.' You maintain your boundaries while being supportive.",
              feedback: "Excellent! You paused, listened, and supported while maintaining boundaries. This is the healthy empathy model. You showed care without taking on their entire crisis. This preserves your energy while being helpful."
            },
            refer: {
              label: "Refer Immediately",
              description: "Quickly suggest they talk to someone else without listening",
              energyChange: -5,
              outcome: "You immediately suggest they talk to someone else. They feel dismissed and unsupported. While you preserved energy, you didn't show empathy when they needed it most.",
              feedback: "While referring is important, completely skipping the listen step when someone is in crisis can feel dismissive. The healthy model is listen–support–refer, showing empathy first."
            }
          }
        },
        {
          id: '3-3',
          title: "Student Success Moment",
          description: "A student who has been struggling comes to you excited about finally understanding a difficult concept. They're beaming with pride and want to share their success with you. This is a positive emotional moment.",
          type: 'student',
          correctAction: 'stepIn', // This is a positive moment, step in to celebrate!
          actions: {
            stepIn: {
              label: "Step In & Celebrate",
              description: "Celebrate their success enthusiastically and share in their joy",
              energyChange: +15,
              outcome: "You celebrate their success enthusiastically! You share in their joy, and this positive interaction actually boosts your emotional energy. These moments are what fuel sustainable empathy. Your energy increases!",
              feedback: "Perfect! Positive emotional moments like celebrating student success actually refill your empathy reserves. These are the moments that fuel sustainable compassion. Stepping in here is not draining—it's energizing!"
            },
            pause: {
              label: "Pause Briefly",
              description: "Acknowledge their success briefly and move on",
              energyChange: +5,
              outcome: "You acknowledge their success briefly. While appropriate, you missed an opportunity to fully celebrate with them, which could have boosted both your energies.",
              feedback: "While it's good to acknowledge, fully celebrating student successes actually refills your empathy reserves. These positive moments are opportunities to fuel sustainable compassion."
            },
            refer: {
              label: "Refer to Someone Else",
              description: "Tell them to share their success with someone else",
              energyChange: -5,
              outcome: "You redirect them to share with someone else. They feel disappointed, and you missed an opportunity to share in a positive moment that could have energized you.",
              feedback: "This was a positive moment that could have refilled your energy! Celebrating student successes is not draining—it's energizing. These moments fuel sustainable empathy."
            }
          }
        }
      ]
    }
  ];

  const currentDayData = days[currentDay];
  const currentIncidentData = currentDayData?.incidents[currentIncident];
  const allDaysComplete = currentDay >= days.length;
  const currentDayComplete = currentIncident >= currentDayData?.incidents.length;

  const handleActionSelect = (action) => {
    const key = `${currentDayData.id}-${currentIncidentData.id}`;
    if (selectedActions[key]) return; // Already answered

    const actionData = currentIncidentData.actions[action];
    const newEnergy = Math.max(0, Math.min(100, emotionalEnergy + actionData.energyChange));
    
    setSelectedActions(prev => ({
      ...prev,
      [key]: action
    }));

    setEmotionalEnergy(newEnergy);

    // Move to next incident or day
    setTimeout(() => {
      if (currentIncident < currentDayData.incidents.length - 1) {
        setCurrentIncident(prev => prev + 1);
      } else {
        // Day complete
        setDaySummary(true);
      }
    }, 2000);
  };

  const handleContinueToNextDay = () => {
    // Save day results
    const dayResult = {
      day: currentDayData.day,
      finalEnergy: emotionalEnergy,
      incidents: currentDayData.incidents.length,
      actions: currentDayData.incidents.map(incident => {
        const key = `${currentDayData.id}-${incident.id}`;
        return {
          incident: incident.title,
          action: selectedActions[key] || 'none'
        };
      })
    };
    setDayResults([...dayResults, dayResult]);

    setDaySummary(false);
    if (currentDay < days.length - 1) {
      setCurrentDay(prev => prev + 1);
      setCurrentIncident(0);
      // Reset energy slightly between days (but carry over most)
      setEmotionalEnergy(prev => Math.min(100, prev + 10)); // Small recovery between days
    } else {
      // All days complete
      setShowGameOver(true);
      // Calculate score based on final energy
      if (emotionalEnergy >= 60) {
        setScore(3);
      } else if (emotionalEnergy >= 40) {
        setScore(2);
      } else {
        setScore(1);
      }
    }
  };

  const getEnergyColor = () => {
    if (emotionalEnergy >= 70) return 'from-green-500 to-emerald-500';
    if (emotionalEnergy >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-600';
  };

  const getEnergyLabel = () => {
    if (emotionalEnergy >= 70) return 'Good Energy';
    if (emotionalEnergy >= 40) return 'Moderate Energy';
    return 'Low Energy';
  };

  const selectedAction = currentIncidentData ? selectedActions[`${currentDayData.id}-${currentIncidentData.id}`] : null;
  const selectedActionData = selectedAction ? currentIncidentData.actions[selectedAction] : null;

  return (
    <TeacherGameShell
      title={gameData?.title || "Empathy Rebalance Simulation"}
      subtitle={gameData?.description || "Manage compassion in real-time classroom stress situations"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentDay + 1}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!allDaysComplete && !daySummary && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Day Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {currentDayData.day}
              </h2>
              <p className="text-gray-600">
                Incident {currentIncident + 1} of {currentDayData.incidents.length}
              </p>
            </div>

            {/* Emotional Energy Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Battery className={`w-6 h-6 ${
                    emotionalEnergy >= 70 ? 'text-green-600' : 
                    emotionalEnergy >= 40 ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                  <span className="font-bold text-gray-800">Emotional Energy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${
                    emotionalEnergy >= 70 ? 'text-green-600' : 
                    emotionalEnergy >= 40 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {Math.round(emotionalEnergy)}%
                  </span>
                  <span className="text-sm text-gray-600">({getEnergyLabel()})</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                <motion.div
                  initial={{ width: `${emotionalEnergy}%` }}
                  animate={{ width: `${emotionalEnergy}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full bg-gradient-to-r ${getEnergyColor()}`}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Your choices affect your emotional energy. Balance empathy with self-care.
              </p>
            </div>

            {/* Current Incident */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
              <div className="flex items-center gap-3 mb-4">
                {currentIncidentData.type === 'student' ? (
                  <Users className="w-8 h-8 text-purple-600" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                )}
                <h3 className="text-2xl font-bold text-gray-800">
                  {currentIncidentData.title}
                </h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                {currentIncidentData.description}
              </p>
            </div>

            {!selectedAction ? (
              /* Action Choices */
              <div className="space-y-4 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  What do you do?
                </h3>
                {Object.entries(currentIncidentData.actions).map(([actionKey, actionData]) => {
                  const Icon = actionKey === 'stepIn' ? PlayCircle : actionKey === 'pause' ? Pause : Users;
                  const isPositive = actionData.energyChange > 0;
                  return (
                    <motion.button
                      key={actionKey}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleActionSelect(actionKey)}
                      className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                        actionKey === 'stepIn'
                          ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100'
                          : actionKey === 'pause'
                          ? 'border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100'
                          : 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          actionKey === 'stepIn'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                            : actionKey === 'pause'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                            : 'bg-gradient-to-r from-green-500 to-emerald-500'
                        }`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-xl font-bold text-gray-800">
                              {actionData.label}
                            </h4>
                            <span className={`text-sm font-semibold px-2 py-1 rounded ${
                              isPositive
                                ? 'bg-green-200 text-green-800'
                                : actionData.energyChange > -15
                                ? 'bg-yellow-200 text-yellow-800'
                                : 'bg-red-200 text-red-800'
                            }`}>
                              {isPositive ? '+' : ''}{actionData.energyChange} Energy
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">
                            {actionData.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              /* Action Outcome */
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 rounded-xl p-6 border-2 ${
                    selectedActionData.energyChange > 0
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                      : selectedActionData.energyChange > -15
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300'
                      : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    {selectedActionData.energyChange > 0 ? (
                      <TrendingUp className="w-8 h-8 text-green-600 flex-shrink-0" />
                    ) : (
                      <TrendingDown className="w-8 h-8 text-red-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h4 className={`text-2xl font-bold mb-3 ${
                        selectedActionData.energyChange > 0
                          ? 'text-green-800'
                          : selectedActionData.energyChange > -15
                          ? 'text-yellow-800'
                          : 'text-red-800'
                      }`}>
                        {selectedActionData.label}
                      </h4>
                      <p className={`text-lg mb-4 ${
                        selectedActionData.energyChange > 0
                          ? 'text-green-700'
                          : selectedActionData.energyChange > -15
                          ? 'text-yellow-700'
                          : 'text-red-700'
                      }`}>
                        {selectedActionData.outcome}
                      </p>
                      <div className={`bg-white rounded-lg p-4 border-l-4 ${
                        selectedActionData.energyChange > 0
                          ? 'border-green-500'
                          : selectedActionData.energyChange > -15
                          ? 'border-yellow-500'
                          : 'border-red-500'
                      }`}>
                        <p className={`font-semibold mb-2 ${
                          selectedActionData.energyChange > 0
                            ? 'text-green-800'
                            : selectedActionData.energyChange > -15
                            ? 'text-yellow-800'
                            : 'text-red-800'
                        }`}>
                          💡 Key Insight:
                        </p>
                        <p className={`${
                          selectedActionData.energyChange > 0
                            ? 'text-green-700'
                            : selectedActionData.energyChange > -15
                            ? 'text-yellow-700'
                            : 'text-red-700'
                        }`}>
                          {selectedActionData.feedback}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        )}

        {daySummary && !allDaysComplete && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {currentDayData.day} Complete!
            </h2>
            <div className="mb-6">
              <p className="text-xl text-gray-600 mb-4">
                Final Emotional Energy: {Math.round(emotionalEnergy)}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-6 mx-auto max-w-md">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${emotionalEnergy}%` }}
                  className={`h-full bg-gradient-to-r ${getEnergyColor()}`}
                />
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              {emotionalEnergy >= 70 
                ? "Great job maintaining your emotional energy! You're practicing sustainable empathy."
                : emotionalEnergy >= 40
                ? "You're maintaining moderate energy. Consider the listen–support–refer model to better preserve your capacity."
                : "Your energy is low. Remember to use the listen–support–refer model to maintain boundaries while still being helpful."}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinueToNextDay}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Continue to Next Day
            </motion.button>
          </div>
        )}

        {showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-6xl mb-6"
            >
              {emotionalEnergy >= 60 ? '🎉' : emotionalEnergy >= 40 ? '✨' : '💪'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Simulation Complete!
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Final Emotional Energy: {Math.round(emotionalEnergy)}%
            </p>

            {/* Final Energy Display */}
            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-8 mx-auto max-w-md mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${emotionalEnergy}%` }}
                  className={`h-full bg-gradient-to-r ${getEnergyColor()}`}
                />
              </div>
              <p className="text-gray-700 text-lg">
                {emotionalEnergy >= 60
                  ? "Excellent! You've successfully managed your compassion while maintaining your emotional energy. You're practicing sustainable empathy!"
                  : emotionalEnergy >= 40
                  ? "Good effort! You maintained moderate energy throughout the simulation. Keep practicing the listen–support–refer model to preserve your capacity."
                  : "You completed the simulation! Your energy is low, which shows the importance of the listen–support–refer model. Remember: you can be caring while maintaining boundaries."}
              </p>
            </div>

            {/* Day Results Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6 text-left">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Simulation Summary:</h3>
              <div className="space-y-3">
                {dayResults.map((result, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-800">{result.day}</h4>
                      <span className={`font-bold ${
                        result.finalEnergy >= 60 ? 'text-green-600' : 
                        result.finalEnergy >= 40 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {Math.round(result.finalEnergy)}% Energy
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Handled {result.incidents} incident{result.incidents !== 1 ? 's' : ''}
                    </p>
                  </div>
                ))}
              </div>
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
                    Reinforce "listen–support–refer" as healthy empathy model. This three-step approach helps you manage compassion sustainably:
                    <br /><br />
                    <strong>1. Listen:</strong> Give your full attention and validate feelings. This shows empathy without taking on the full burden.
                    <br /><br />
                    <strong>2. Support:</strong> Offer appropriate help within your role and capacity. This maintains boundaries while being helpful.
                    <br /><br />
                    <strong>3. Refer:</strong> Connect them with appropriate resources (counselor, support services, professional help). This ensures they get comprehensive support while preserving your energy.
                    <br /><br />
                    The listen–support–refer model allows you to care deeply while maintaining your capacity. Practice this model regularly, and share it with colleagues to create a culture of sustainable empathy.
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

export default EmpathyRebalanceSimulation;

