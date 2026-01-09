import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { FileText, Users, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

const WorkloadJournal = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-17";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [timeSpentReflection, setTimeSpentReflection] = useState("");
  const [delegationReflection, setDelegationReflection] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    if (timeSpentReflection.trim().length < 10 || delegationReflection.trim().length < 10) {
      alert("Please fill in both reflection boxes with at least 10 characters each.");
      return;
    }
    setShowSummary(true);
    setScore(1);
  };

  const handleComplete = () => {
    setShowGameOver(true);
  };

  // Analyze stress zones from reflections
  const analyzeStressZones = () => {
    const timeText = timeSpentReflection.toLowerCase();
    const delegationText = delegationReflection.toLowerCase();
    
    const stressZones = [];
    const keywords = {
      'Grading': ['grading', 'grade', 'marking', 'assessments', 'papers', 'assignments'],
      'Planning': ['planning', 'lesson', 'prep', 'preparation', 'curriculum'],
      'Administrative': ['admin', 'paperwork', 'reports', 'documentation', 'forms', 'meetings'],
      'Student Support': ['student', 'behavior', 'discipline', 'support', 'intervention'],
      'Communication': ['parent', 'email', 'phone', 'communication', 'conference'],
      'Classroom Management': ['classroom', 'management', 'organization', 'setup']
    };

    // Find stress zones based on keywords
    Object.keys(keywords).forEach(zone => {
      const matches = keywords[zone].filter(keyword => 
        timeText.includes(keyword) || delegationText.includes(keyword)
      );
      if (matches.length > 0) {
        stressZones.push({
          name: zone,
          matches: matches.length,
          intensity: matches.length > 2 ? 'high' : 'medium'
        });
      }
    });

    // If no specific zones found, provide general feedback
    if (stressZones.length === 0) {
      stressZones.push({
        name: 'General Workload',
        matches: 1,
        intensity: 'medium'
      });
    }

    return stressZones;
  };

  // Generate delegation suggestions
  const getDelegationSuggestions = (stressZones) => {
    const suggestions = [];
    
    stressZones.forEach(zone => {
      switch(zone.name) {
        case 'Grading':
          suggestions.push({
            task: 'Grading routine assignments',
            who: 'Teaching assistants, peer teachers, or students (self-assessment)',
            benefit: 'Frees up time for lesson planning and student interaction'
          });
          break;
        case 'Planning':
          suggestions.push({
            task: 'Lesson plan templates and resources',
            who: 'Grade-level teams, curriculum coordinators, or online resource sharing',
            benefit: 'Reduces individual planning time through collaboration'
          });
          break;
        case 'Administrative':
          suggestions.push({
            task: 'Data entry and form completion',
            who: 'Administrative staff, teaching assistants, or parent volunteers',
            benefit: 'Allows focus on teaching and student engagement'
          });
          break;
        case 'Student Support':
          suggestions.push({
            task: 'Routine check-ins and follow-ups',
            who: 'Counselors, support staff, or peer mentors',
            benefit: 'Ensures students get support while you focus on instruction'
          });
          break;
        case 'Communication':
          suggestions.push({
            task: 'Routine parent updates and scheduling',
            who: 'School office staff or automated systems',
            benefit: 'Maintains communication while reducing your direct time'
          });
          break;
        default:
          suggestions.push({
            task: 'Identify specific routine tasks',
            who: 'Colleagues, support staff, or students',
            benefit: 'Every small delegation adds up to significant time savings'
          });
      }
    });

    return suggestions;
  };

  const stressZones = showSummary ? analyzeStressZones() : [];
  const delegationSuggestions = showSummary ? getDelegationSuggestions(stressZones) : [];

  return (
    <TeacherGameShell
      title={gameData?.title || "Workload Journal"}
      subtitle={gameData?.description || "Reflect on tasks that cause strain and identify tasks to delegate or simplify"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={1}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showSummary ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Reflect on Your Workload
              </h2>
              <p className="text-gray-600 mb-6">
                Take a moment to reflect on your workload. Identifying where your time goes and what could be delegated 
                helps reduce fatigue and create more balance.
              </p>
            </div>

            {/* First Reflection Box */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-800">
                    Reflection 1: Time Spent
                  </h3>
                </div>
                <p className="text-gray-700 mb-4 font-semibold">
                  "Today I spent most time on…"
                </p>
                <textarea
                  value={timeSpentReflection}
                  onChange={(e) => setTimeSpentReflection(e.target.value)}
                  placeholder="For example: 'Today I spent most time on grading papers, responding to parent emails, and preparing lesson plans for next week. The grading took up about 3 hours...'"
                  className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-gray-800 min-h-[150px] resize-none"
                />
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    {timeSpentReflection.length} characters (minimum 10)
                  </p>
                  {timeSpentReflection.trim().length < 10 && (
                    <p className="text-xs text-orange-600">
                      Please write at least 10 characters
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Second Reflection Box */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-800">
                    Reflection 2: Delegation Opportunities
                  </h3>
                </div>
                <p className="text-gray-700 mb-4 font-semibold">
                  "Could someone assist with…"
                </p>
                <textarea
                  value={delegationReflection}
                  onChange={(e) => setDelegationReflection(e.target.value)}
                  placeholder="For example: 'Could someone assist with routine data entry, organizing classroom materials, or preparing handouts? These tasks don't require my specific expertise...'"
                  className="w-full px-4 py-3 rounded-lg border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-gray-800 min-h-[150px] resize-none"
                />
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    {delegationReflection.length} characters (minimum 10)
                  </p>
                  {delegationReflection.trim().length < 10 && (
                    <p className="text-xs text-orange-600">
                      Please write at least 10 characters
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={timeSpentReflection.trim().length < 10 || delegationReflection.trim().length < 10}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                View Stress Zone Summary
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Your Stress Zone Summary
                </h2>
              </div>

              {/* Stress Zones */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Identified Stress Zones:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stressZones.map((zone, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-gradient-to-br ${
                        zone.intensity === 'high' 
                          ? 'from-red-50 to-orange-50 border-red-200' 
                          : 'from-orange-50 to-yellow-50 border-orange-200'
                      } rounded-xl p-4 border-2`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-800">{zone.name}</h4>
                        {zone.intensity === 'high' && (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {zone.intensity === 'high' 
                          ? 'High intensity area - consider immediate delegation'
                          : 'Medium intensity - good candidate for delegation'}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Delegation Suggestions */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Micro-Delegation Suggestions:
                </h3>
                <div className="space-y-4">
                  {delegationSuggestions.slice(0, 3).map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-2">
                            {suggestion.task}
                          </h4>
                          <p className="text-sm text-gray-700 mb-2">
                            <strong>Who could help:</strong> {suggestion.who}
                          </p>
                          <p className="text-sm text-gray-600 italic">
                            <strong>Benefit:</strong> {suggestion.benefit}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Key Insights */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
                <h4 className="font-bold text-gray-800 mb-3">💡 Key Insights:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Micro-delegation means identifying small, routine tasks that others can handle, not just big projects.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Even 15-30 minutes saved per day through delegation adds up to hours over a week.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Delegating doesn't mean you're not capable—it means you're prioritizing your energy for what matters most.</span>
                  </li>
                </ul>
              </div>

              {/* Complete Button */}
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleComplete}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Complete Workload Journal
                </motion.button>
              </div>

              {/* Teacher Tip */}
              <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-amber-900 mb-2">
                  💡 Teacher Tip:
                </p>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Encourage micro-delegation to reduce fatigue. Start small—identify just one routine task this week that 
                  someone else could handle. This might be organizing materials, entering data, or preparing routine handouts. 
                  Micro-delegation builds over time and creates sustainable workload management. Share your delegation strategies 
                  with colleagues to create a culture of mutual support.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default WorkloadJournal;

