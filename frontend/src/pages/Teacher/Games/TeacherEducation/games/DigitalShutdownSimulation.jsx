import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Mail, MessageSquare, Bell, X, Clock, UserPlus, TrendingDown, TrendingUp, CheckCircle, AlertCircle, Smartphone } from "lucide-react";

const DigitalShutdownSimulation = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-39";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 8;
  
  const [digitalItems, setDigitalItems] = useState([]);
  const [decisions, setDecisions] = useState({});
  const [initialStress, setInitialStress] = useState(8);
  const [currentStress, setCurrentStress] = useState(8);
  const [showResults, setShowResults] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Initialize digital items (emails, messages, notifications)
  useEffect(() => {
    const items = [
      {
        id: 1,
        type: 'email',
        from: 'Principal Smith',
        subject: 'URGENT: Meeting tomorrow at 7 AM',
        time: '8:45 PM',
        urgency: 'high',
        canDelegate: false,
        canPostpone: true,
        stressImpact: 2, // Responding increases stress
        icon: Mail,
        color: 'from-blue-500 to-cyan-500'
      },
      {
        id: 2,
        type: 'message',
        from: 'Parent - Mrs. Johnson',
        subject: 'Quick question about homework',
        time: '8:50 PM',
        urgency: 'low',
        canDelegate: true,
        canPostpone: true,
        stressImpact: 1,
        icon: MessageSquare,
        color: 'from-green-500 to-emerald-500'
      },
      {
        id: 3,
        type: 'notification',
        from: 'School App',
        subject: 'New assignment submitted by 5 students',
        time: '9:00 PM',
        urgency: 'low',
        canDelegate: false,
        canPostpone: true,
        stressImpact: 1,
        icon: Bell,
        color: 'from-orange-500 to-amber-500'
      },
      {
        id: 4,
        type: 'email',
        from: 'Colleague - Ms. Davis',
        subject: 'Can you cover my class tomorrow?',
        time: '9:05 PM',
        urgency: 'medium',
        canDelegate: false,
        canPostpone: true,
        stressImpact: 2,
        icon: Mail,
        color: 'from-blue-500 to-cyan-500'
      },
      {
        id: 5,
        type: 'message',
        from: 'Student - Alex',
        subject: 'Confused about the project',
        time: '9:10 PM',
        urgency: 'low',
        canDelegate: true,
        canPostpone: true,
        stressImpact: 1,
        icon: MessageSquare,
        color: 'from-green-500 to-emerald-500'
      },
      {
        id: 6,
        type: 'notification',
        from: 'Email Client',
        subject: '3 new emails in your inbox',
        time: '9:15 PM',
        urgency: 'low',
        canDelegate: false,
        canPostpone: true,
        stressImpact: 1,
        icon: Bell,
        color: 'from-orange-500 to-amber-500'
      },
      {
        id: 7,
        type: 'email',
        from: 'Administration',
        subject: 'FYI: Policy update for next semester',
        time: '9:20 PM',
        urgency: 'low',
        canDelegate: false,
        canPostpone: true,
        stressImpact: 1,
        icon: Mail,
        color: 'from-blue-500 to-cyan-500'
      },
      {
        id: 8,
        type: 'message',
        from: 'Parent - Mr. Williams',
        subject: 'Thanks for everything!',
        time: '9:25 PM',
        urgency: 'low',
        canDelegate: false,
        canPostpone: true,
        stressImpact: 0, // Positive message - can wait
        icon: MessageSquare,
        color: 'from-green-500 to-emerald-500'
      }
    ];
    
    setDigitalItems(items);
    setInitialStress(8);
    setCurrentStress(8);
  }, []);

  const handleDecision = (itemId, decision) => {
    if (decisions[itemId]) return; // Already decided

    const item = digitalItems.find(i => i.id === itemId);
    if (!item) return;

    let stressChange = 0;
    
    switch (decision) {
      case 'ignore':
        // Ignoring reduces stress (not engaging with work)
        stressChange = -item.stressImpact;
        break;
      case 'postpone':
        // Postponing reduces stress slightly (acknowledging but not acting now)
        stressChange = -item.stressImpact * 0.5;
        break;
      case 'delegate':
        // Delegating reduces stress (sharing responsibility)
        stressChange = item.canDelegate ? -item.stressImpact * 0.8 : 0;
        break;
      case 'respond':
        // Responding increases stress (engaging with work after hours)
        stressChange = item.stressImpact;
        break;
      default:
        break;
    }

    setDecisions(prev => ({
      ...prev,
      [itemId]: decision
    }));

    // Update stress level
    setCurrentStress(prev => {
      const newStress = Math.max(0, Math.min(10, prev + stressChange));
      return Math.round(newStress * 10) / 10; // Round to 1 decimal
    });
  };

  const handleComplete = () => {
    const allDecided = digitalItems.every(item => decisions[item.id]);
    if (!allDecided) {
      alert('Please make a decision for all items before continuing.');
      return;
    }
    setShowResults(true);
    
    // Calculate score based on stress reduction
    const stressReduction = initialStress - currentStress;
    if (stressReduction >= 4) {
      setScore(1);
    } else if (stressReduction >= 2) {
      setScore(1);
    } else {
      setScore(1); // Still give points for participation
    }
  };

  const getDecisionButtonStyle = (itemId, decision) => {
    const isSelected = decisions[itemId] === decision;
    return isSelected
      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-2 border-purple-600 shadow-lg scale-105'
      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-purple-400 hover:bg-purple-50';
  };

  const getDecisionIcon = (decision) => {
    switch (decision) {
      case 'ignore':
        return <X className="w-4 h-4" />;
      case 'postpone':
        return <Clock className="w-4 h-4" />;
      case 'delegate':
        return <UserPlus className="w-4 h-4" />;
      case 'respond':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getDecisionLabel = (decision) => {
    switch (decision) {
      case 'ignore':
        return 'Ignore';
      case 'postpone':
        return 'Postpone';
      case 'delegate':
        return 'Delegate';
      case 'respond':
        return 'Respond';
      default:
        return '';
    }
  };

  const stressReduction = initialStress - currentStress;
  const stressPercentage = ((stressReduction / initialStress) * 100).toFixed(0);

  const ignoredCount = Object.values(decisions).filter(d => d === 'ignore').length;
  const postponedCount = Object.values(decisions).filter(d => d === 'postpone').length;
  const delegatedCount = Object.values(decisions).filter(d => d === 'delegate').length;
  const respondedCount = Object.values(decisions).filter(d => d === 'respond').length;

  return (
    <TeacherGameShell
      title={gameData?.title || "Digital Shutdown Simulation"}
      subtitle={gameData?.description || "Practice structured disconnection from work devices"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={Object.keys(decisions).length + 1}
    >
      <div className="w-full max-w-6xl mx-auto px-4">
        {!showResults && !showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Simulation Dashboard Header */}
            <div className="mb-6">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-8 h-8 text-indigo-600" />
                    <h2 className="text-2xl font-bold text-gray-800">
                      Digital Dashboard - Evening Hours
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Stress Level</p>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <motion.div
                          initial={{ width: `${(initialStress / 10) * 100}%` }}
                          animate={{ width: `${(currentStress / 10) * 100}%` }}
                          className={`h-full rounded-full ${
                            currentStress >= 7 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                            currentStress >= 4 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                            'bg-gradient-to-r from-green-500 to-emerald-500'
                          }`}
                        />
                      </div>
                      <span className={`text-2xl font-bold ${
                        currentStress >= 7 ? 'text-red-600' :
                        currentStress >= 4 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {currentStress.toFixed(1)}/10
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">
                  It's evening and you're trying to disconnect from work. Decide how to handle each notification, email, and message.
                </p>
              </div>

              {/* Stress Drop Indicator */}
              {stressReduction > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-300 mb-4"
                >
                  <div className="flex items-center gap-3">
                    <TrendingDown className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">
                        Stress Dropped by {stressReduction.toFixed(1)} points!
                      </p>
                      <p className="text-sm text-green-700">
                        Disconnecting from work is reducing your stress level.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Digital Items Dashboard */}
            <div className="space-y-4 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Items Pending Decision ({digitalItems.length - Object.keys(decisions).length} remaining):
              </h3>
              
              {digitalItems.map((item, index) => {
                const IconComponent = item.icon;
                const decision = decisions[item.id];
                const isDecided = !!decision;
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`rounded-xl p-5 border-2 ${
                      isDecided 
                        ? 'bg-gray-50 border-gray-300 opacity-75' 
                        : `bg-gradient-to-br ${item.color} bg-opacity-10 border-${item.color.split('-')[1]}-300`
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`bg-gradient-to-r ${item.color} rounded-full p-3 text-white flex-shrink-0`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-gray-800">{item.from}</h4>
                          <span className="text-xs text-gray-500">{item.time}</span>
                          {item.urgency === 'high' && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-semibold">
                              High Priority
                            </span>
                          )}
                          {isDecided && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                              {getDecisionIcon(decision)}
                              {getDecisionLabel(decision)}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-4">{item.subject}</p>

                        {/* Decision Buttons */}
                        {!isDecided && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDecision(item.id, 'ignore')}
                              className="px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              Ignore
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDecision(item.id, 'postpone')}
                              disabled={!item.canPostpone}
                              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                                !item.canPostpone ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              <Clock className="w-4 h-4" />
                              Postpone
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDecision(item.id, 'delegate')}
                              disabled={!item.canDelegate}
                              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                                !item.canDelegate ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              <UserPlus className="w-4 h-4" />
                              Delegate
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDecision(item.id, 'respond')}
                              className="px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 bg-red-100 text-red-700 border-2 border-red-300 hover:bg-red-200"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Respond Now
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Complete Button */}
            {Object.keys(decisions).length === digitalItems.length && (
              <div className="text-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleComplete}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  View Results
                </motion.button>
              </div>
            )}
          </div>
        )}

        {showResults && !showGameOver && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Digital Shutdown Results
              </h2>
            </div>

            {/* Stress Reduction Visualization */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-200 mb-6">
              <div className="text-center mb-6">
                <TrendingDown className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Stress Reduction: {stressReduction.toFixed(1)} points ({stressPercentage}%)
                </h3>
                <p className="text-gray-600">
                  By disconnecting from work, your stress level decreased from {initialStress}/10 to {currentStress}/10
                </p>
              </div>

              {/* Stress Bar Comparison */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Initial Stress Level</p>
                  <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" style={{ width: `${(initialStress / 10) * 100}%` }} />
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
                      {initialStress}/10
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Final Stress Level</p>
                  <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentStress / 10) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`absolute inset-0 rounded-full ${
                        currentStress >= 7 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                        currentStress >= 4 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        'bg-gradient-to-r from-green-500 to-emerald-500'
                      }`}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
                      {currentStress}/10
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decision Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200 text-center">
                <X className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-800">{ignoredCount}</p>
                <p className="text-sm text-blue-700">Ignored</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200 text-center">
                <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-800">{postponedCount}</p>
                <p className="text-sm text-yellow-700">Postponed</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200 text-center">
                <UserPlus className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-800">{delegatedCount}</p>
                <p className="text-sm text-purple-700">Delegated</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200 text-center">
                <CheckCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-800">{respondedCount}</p>
                <p className="text-sm text-red-700">Responded</p>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Key Insights:</h4>
              <div className="space-y-3 text-gray-700">
                {stressReduction >= 4 && (
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Excellent! You significantly reduced stress by disconnecting from work. This shows the value of setting boundaries around digital communication.</span>
                  </p>
                )}
                {ignoredCount >= 3 && (
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>You ignored {ignoredCount} items. Most work communications can wait until business hours.</span>
                  </p>
                )}
                {postponedCount >= 2 && (
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span>You postponed {postponedCount} items. Scheduling time for these prevents them from interrupting your personal time.</span>
                  </p>
                )}
                {delegatedCount >= 1 && (
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>You delegated {delegatedCount} item(s). Sharing responsibilities reduces your workload and stress.</span>
                  </p>
                )}
                {respondedCount > 0 && (
                  <p className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>You responded to {respondedCount} item(s) after hours. Consider if these could have waited until the next workday.</span>
                  </p>
                )}
                <p className="flex items-start gap-2">
                  <TrendingDown className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Structured disconnection from work devices allows you to rest, recharge, and return to work more effectively the next day.</span>
                </p>
              </div>
            </div>

            {/* Complete Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGameOver(true)}
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
              {stressReduction >= 4 ? '🌟' : stressReduction >= 2 ? '✨' : '📱'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Simulation Complete!
            </h2>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                You've practiced structured disconnection from work devices. By deciding to ignore, postpone, or delegate digital communications, you reduced your stress level and protected your personal time.
              </p>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <Smartphone className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Try "Tech-Free Evenings" twice a week. Designate specific evenings (e.g., Tuesdays and Thursdays) as completely work-device-free. Turn off work email notifications, put your work phone in another room, and avoid checking school apps. Use this time for personal activities, family connection, hobbies, or rest. Start with one evening per week and gradually increase. You can set an auto-reply message like "Thank you for your message. I check emails during business hours and will respond within 24 hours on weekdays." This sets clear expectations and protects your personal time. Many teachers find that tech-free evenings actually make them more productive the next day because they return to work refreshed and focused. Share your tech-free evening commitment with colleagues to create mutual accountability and normalize boundaries around digital disconnection.
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

export default DigitalShutdownSimulation;

