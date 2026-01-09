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
  
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [showPatterns, setShowPatterns] = useState(false);
  const [reflection, setReflection] = useState("");
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const allTriggerScenarios = [
    {
      id: 1,
      title: "Unexpected Observation",
      description: "Administrator walks into your classroom unannounced during a lesson",
      category: "Control & Autonomy",
      intensity: "High"
    },
    {
      id: 2,
      title: "Lateness",
      description: "Student arrives 15 minutes late to class, disrupting the flow",
      category: "Respect & Boundaries",
      intensity: "Medium"
    },
    {
      id: 3,
      title: "Parent Complaint",
      description: "Parent emails questioning your teaching methods or student's grade",
      category: "Validation & Support",
      intensity: "High"
    },
    {
      id: 4,
      title: "Technology Failure",
      description: "Projector or computer stops working in the middle of a presentation",
      category: "Control & Autonomy",
      intensity: "Medium"
    },
    {
      id: 5,
      title: "Interruptions During Planning",
      description: "Multiple interruptions while trying to prepare lessons or grade papers",
      category: "Time & Focus",
      intensity: "Medium"
    },
    {
      id: 6,
      title: "Student Disrespect",
      description: "Student speaks to you in a dismissive or rude tone in front of class",
      category: "Respect & Boundaries",
      intensity: "High"
    },
    {
      id: 7,
      title: "Last-Minute Meeting",
      description: "Staff meeting called with only 30 minutes notice, disrupting your schedule",
      category: "Time & Focus",
      intensity: "Medium"
    },
    {
      id: 8,
      title: "Negative Feedback",
      description: "Receiving critical feedback on your teaching without acknowledgment of positives",
      category: "Validation & Support",
      intensity: "High"
    },
    {
      id: 9,
      title: "Unrealistic Expectations",
      description: "Being asked to implement new initiatives without adequate time or resources",
      category: "Control & Autonomy",
      intensity: "High"
    },
    {
      id: 10,
      title: "Student Conflict",
      description: "Two students having a heated argument in your classroom",
      category: "Control & Autonomy",
      intensity: "High"
    },
    {
      id: 11,
      title: "Lack of Recognition",
      description: "Your efforts and achievements go unnoticed by administration",
      category: "Validation & Support",
      intensity: "Medium"
    },
    {
      id: 12,
      title: "Workload Overwhelm",
      description: "Receiving multiple urgent requests with impossible deadlines",
      category: "Time & Focus",
      intensity: "High"
    },
    {
      id: 13,
      title: "Colleague Criticism",
      description: "A colleague makes a dismissive comment about your teaching approach",
      category: "Validation & Support",
      intensity: "Medium"
    },
    {
      id: 14,
      title: "Classroom Chaos",
      description: "Students are loud, off-task, and not responding to your directions",
      category: "Control & Autonomy",
      intensity: "High"
    },
    {
      id: 15,
      title: "Incomplete Work",
      description: "Students consistently not completing assignments or homework",
      category: "Respect & Boundaries",
      intensity: "Medium"
    }
  ];

  const handleTriggerSelect = (triggerId) => {
    if (selectedTriggers.includes(triggerId)) {
      // Deselect if already selected
      setSelectedTriggers(selectedTriggers.filter(id => id !== triggerId));
    } else if (selectedTriggers.length < 3) {
      // Select if less than 3 selected
      setSelectedTriggers([...selectedTriggers, triggerId]);
    }
  };

  const handleShowPatterns = () => {
    if (selectedTriggers.length === 3) {
      setShowPatterns(true);
      setScore(1); // Mark as completed
    }
  };

  const handleComplete = () => {
    if (reflection.trim().length >= 10) {
      setShowGameOver(true);
    }
  };

  const getSelectedTriggers = () => {
    return allTriggerScenarios.filter(scenario => selectedTriggers.includes(scenario.id));
  };

  const analyzePatterns = () => {
    const selected = getSelectedTriggers();
    const categories = selected.map(t => t.category);
    const categoryCounts = {};
    
    categories.forEach(cat => {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const dominantCategory = Object.keys(categoryCounts).reduce((a, b) => 
      categoryCounts[a] > categoryCounts[b] ? a : b
    );

    const patterns = {
      "Control & Autonomy": "Your triggers suggest you value having control over your teaching environment and autonomy in decision-making. When this is threatened, you may feel stressed or defensive.",
      "Respect & Boundaries": "Your triggers indicate you're sensitive to respect and clear boundaries. When these are crossed, you may feel disrespected or undervalued.",
      "Validation & Support": "Your triggers show you need recognition and support for your work. When this is lacking, you may feel unappreciated or isolated.",
      "Time & Focus": "Your triggers reveal you need adequate time and focus to do your work well. When this is disrupted, you may feel overwhelmed or frustrated."
    };

    return {
      dominantCategory,
      pattern: patterns[dominantCategory] || "Your triggers show a mix of concerns across different areas of teaching.",
      allCategories: Object.keys(categoryCounts)
    };
  };

  const patterns = showPatterns ? analyzePatterns() : null;

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
      currentQuestion={showPatterns ? 1 : 0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showPatterns ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Identify Your Top 3 Triggers
              </h2>
              <p className="text-gray-600 mb-2">
                Review the scenarios below and select the <strong>3 most triggering</strong> situations for you.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <p className="text-sm text-blue-800">
                  <strong>Selected:</strong> {selectedTriggers.length} of 3 triggers
                </p>
              </div>
            </div>

            {/* Trigger Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {allTriggerScenarios.map((scenario) => {
                const isSelected = selectedTriggers.includes(scenario.id);
                const canSelect = selectedTriggers.length < 3 || isSelected;

                return (
                  <motion.button
                    key={scenario.id}
                    whileHover={canSelect ? { scale: 1.02 } : {}}
                    whileTap={canSelect ? { scale: 0.98 } : {}}
                    onClick={() => handleTriggerSelect(scenario.id)}
                    disabled={!canSelect}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'bg-red-50 border-red-500 shadow-md'
                        : canSelect
                        ? 'bg-white border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                        : 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-bold text-sm ${
                        isSelected ? 'text-red-800' : 'text-gray-800'
                      }`}>
                        {scenario.title}
                      </h3>
                      {isSelected && (
                        <span className="text-red-600 font-bold text-lg">✓</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                      {scenario.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-gray-200 rounded text-gray-700">
                        {scenario.category}
                      </span>
                      <span className="text-xs px-2 py-1 bg-orange-100 rounded text-orange-700">
                        {scenario.intensity}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Continue Button */}
            {selectedTriggers.length === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShowPatterns}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  View Patterns →
                </motion.button>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Patterns Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Your Trigger Patterns
              </h2>

              {/* Selected Triggers Summary */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Your Top 3 Triggers:
                </h3>
                <div className="space-y-2">
                  {getSelectedTriggers().map((trigger, index) => (
                    <div
                      key={trigger.id}
                      className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-red-800">
                            {index + 1}. {trigger.title}
                          </span>
                          <p className="text-sm text-gray-600 mt-1">
                            {trigger.description}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-red-200 rounded text-red-800">
                          {trigger.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pattern Analysis */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
                <h3 className="text-lg font-bold text-purple-900 mb-3">
                  Pattern Analysis
                </h3>
                <div className="mb-4">
                  <span className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold mb-3">
                    Dominant Category: {patterns.dominantCategory}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {patterns.pattern}
                </p>
                <div className="bg-white/60 rounded-lg p-4 border border-purple-200">
                  <p className="text-sm font-semibold text-purple-800 mb-2">
                    What This Means:
                  </p>
                  <p className="text-sm text-gray-700">
                    Understanding your trigger patterns helps you anticipate stress responses and develop strategies to manage them. When you recognize these patterns, you can prepare responses and set boundaries proactively.
                  </p>
                </div>
              </div>

              {/* Reflection Section */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  Add Your Reflection
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Take a moment to reflect on your triggers. What insights do you have about these patterns? (Minimum 10 characters)
                </p>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="For example: 'I notice that most of my triggers relate to feeling unsupported. I might benefit from building stronger connections with colleagues...'"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:outline-none text-gray-800 min-h-[120px] resize-none"
                />
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    {reflection.length} characters (minimum 10)
                  </p>
                  {reflection.trim().length < 10 && (
                    <p className="text-xs text-orange-600">
                      Please write at least 10 characters
                    </p>
                  )}
                </div>
              </div>

              {/* Complete Button */}
              <div className="mt-6 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleComplete}
                  disabled={reflection.trim().length < 10}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Trigger Finder
                </motion.button>
              </div>

              {/* Teacher Tip */}
              <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-amber-900 mb-2">
                  💡 Teacher Tip:
                </p>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Discuss your top triggers with a peer buddy to normalize them. Sharing triggers with a trusted colleague helps you realize you're not alone in these experiences. It also creates opportunities for mutual support and understanding. When you normalize triggers, you reduce shame and create space for collaborative problem-solving.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default TriggerFinder;

