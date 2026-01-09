import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";

const IdentifyYourStressors = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-11";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [selectedStressors, setSelectedStressors] = useState([]);
  const [showClusters, setShowClusters] = useState(false);
  const [reflection, setReflection] = useState("");
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const allStressScenarios = [
    {
      id: 1,
      title: "Grading Load",
      description: "Piles of assignments and tests waiting to be graded, with deadlines approaching",
      category: "Workload",
      icon: "📚"
    },
    {
      id: 2,
      title: "Admin Calls",
      description: "Frequent calls from administration requesting immediate attention or reports",
      category: "People",
      icon: "📞"
    },
    {
      id: 3,
      title: "Student Behavior",
      description: "Challenging student behaviors disrupting class flow and requiring constant management",
      category: "People",
      icon: "👥"
    },
    {
      id: 4,
      title: "Time Shortage",
      description: "Not enough time to complete all tasks, prepare lessons, and meet expectations",
      category: "Workload",
      icon: "⏰"
    },
    {
      id: 5,
      title: "Parent Meetings",
      description: "Scheduled or unscheduled meetings with parents, often during prep time",
      category: "People",
      icon: "🤝"
    },
    {
      id: 6,
      title: "Classroom Environment",
      description: "Noisy, cramped, or poorly equipped classroom space affecting teaching",
      category: "Environment",
      icon: "🏫"
    },
    {
      id: 7,
      title: "Lesson Planning",
      description: "Creating engaging lesson plans while meeting curriculum standards and deadlines",
      category: "Workload",
      icon: "📝"
    },
    {
      id: 8,
      title: "Staff Dynamics",
      description: "Tension or conflicts with colleagues affecting collaboration and support",
      category: "People",
      icon: "💼"
    },
    {
      id: 9,
      title: "Resource Limitations",
      description: "Lack of materials, technology, or supplies needed for effective teaching",
      category: "Environment",
      icon: "📦"
    },
    {
      id: 10,
      title: "Work-Life Balance",
      description: "Difficulty separating work from personal time, bringing work home regularly",
      category: "Workload",
      icon: "⚖️"
    }
  ];

  const handleStressorSelect = (stressorId) => {
    if (selectedStressors.includes(stressorId)) {
      // Deselect if already selected
      setSelectedStressors(selectedStressors.filter(id => id !== stressorId));
    } else if (selectedStressors.length < 3) {
      // Select if less than 3 selected
      setSelectedStressors([...selectedStressors, stressorId]);
    }
  };

  const handleShowClusters = () => {
    if (selectedStressors.length === 3) {
      setShowClusters(true);
      setScore(1); // Mark as completed
    }
  };

  const handleComplete = () => {
    if (reflection.trim().length >= 10) {
      setShowGameOver(true);
    }
  };

  const getSelectedStressors = () => {
    return allStressScenarios.filter(scenario => selectedStressors.includes(scenario.id));
  };

  const clusterStressors = () => {
    const selected = getSelectedStressors();
    const clusters = {
      Workload: [],
      People: [],
      Environment: []
    };
    
    selected.forEach(stressor => {
      clusters[stressor.category].push(stressor);
    });

    // Find dominant cluster
    const clusterCounts = {
      Workload: clusters.Workload.length,
      People: clusters.People.length,
      Environment: clusters.Environment.length
    };

    const dominantCluster = Object.keys(clusterCounts).reduce((a, b) => 
      clusterCounts[a] > clusterCounts[b] ? a : b
    );

    const insights = {
      Workload: "Your stressors are primarily related to workload and time management. This suggests you may benefit from better prioritization strategies, delegation opportunities, or time-blocking techniques. Consider discussing workload distribution with your administration.",
      People: "Your stressors are mainly connected to interpersonal relationships and interactions. This indicates you might benefit from improved communication strategies, boundary-setting, or conflict resolution skills. Building stronger relationships with students, parents, and colleagues could help.",
      Environment: "Your stressors are largely environmental factors beyond your immediate control. This suggests focusing on what you can influence within your environment and advocating for needed resources or changes. Sometimes small adjustments to your physical space can make a big difference."
    };

    return {
      clusters,
      dominantCluster,
      insight: insights[dominantCluster] || "Your stressors span multiple categories, showing a balanced view of challenges in your teaching environment.",
      clusterCounts
    };
  };

  const clusterData = showClusters ? clusterStressors() : null;

  const getClusterColor = (cluster) => {
    const colors = {
      Workload: "from-blue-500 to-cyan-500",
      People: "from-purple-500 to-pink-500",
      Environment: "from-green-500 to-emerald-500"
    };
    return colors[cluster] || "from-gray-500 to-gray-600";
  };

  const getClusterBgColor = (cluster) => {
    const colors = {
      Workload: "bg-blue-50 border-blue-200",
      People: "bg-purple-50 border-purple-200",
      Environment: "bg-green-50 border-green-200"
    };
    return colors[cluster] || "bg-gray-50 border-gray-200";
  };

  return (
    <TeacherGameShell
      title={gameData?.title || "Identify Your Stressors"}
      subtitle={gameData?.description || "Recognize the top three sources of stress in a school week"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={showClusters ? 1 : 0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showClusters ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Identify Your Top 3 Stressors
              </h2>
              <p className="text-gray-600 mb-2">
                Review the scenarios below and select the <strong>3 most stressful</strong> situations you face in a typical school week.
              </p>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                <p className="text-sm text-orange-800">
                  <strong>Selected:</strong> {selectedStressors.length} of 3 stressors
                </p>
              </div>
            </div>

            {/* Stressor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {allStressScenarios.map((scenario) => {
                const isSelected = selectedStressors.includes(scenario.id);
                const canSelect = selectedStressors.length < 3 || isSelected;

                return (
                  <motion.button
                    key={scenario.id}
                    whileHover={canSelect ? { scale: 1.02 } : {}}
                    whileTap={canSelect ? { scale: 0.98 } : {}}
                    onClick={() => handleStressorSelect(scenario.id)}
                    disabled={!canSelect}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'bg-orange-50 border-orange-500 shadow-md'
                        : canSelect
                        ? 'bg-white border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                        : 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{scenario.icon}</span>
                        <h3 className={`font-bold text-sm ${
                          isSelected ? 'text-orange-800' : 'text-gray-800'
                        }`}>
                          {scenario.title}
                        </h3>
                      </div>
                      {isSelected && (
                        <span className="text-orange-600 font-bold text-lg">✓</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                      {scenario.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded text-white font-semibold bg-gradient-to-r ${
                        scenario.category === 'Workload' ? 'from-blue-500 to-cyan-500' :
                        scenario.category === 'People' ? 'from-purple-500 to-pink-500' :
                        'from-green-500 to-emerald-500'
                      }`}>
                        {scenario.category}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Continue Button */}
            {selectedStressors.length === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShowClusters}
                  className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  View Clusters →
                </motion.button>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Clusters Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Your Stressor Clusters
              </h2>

              {/* Selected Stressors Summary */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Your Top 3 Stressors:
                </h3>
                <div className="space-y-2">
                  {getSelectedStressors().map((stressor, index) => (
                    <div
                      key={stressor.id}
                      className={`${getClusterBgColor(stressor.category)} border-l-4 p-3 rounded-r-lg`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{stressor.icon}</span>
                          <div>
                            <span className="font-bold text-gray-800">
                              {index + 1}. {stressor.title}
                            </span>
                            <p className="text-sm text-gray-600 mt-1">
                              {stressor.description}
                            </p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded text-white font-semibold bg-gradient-to-r ${getClusterColor(stressor.category)}`}>
                          {stressor.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cluster Analysis */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200 mb-6">
                <h3 className="text-lg font-bold text-orange-900 mb-4">
                  Cluster Analysis
                </h3>
                
                {/* Cluster Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {Object.keys(clusterData.clusters).map((cluster) => {
                    const count = clusterData.clusterCounts[cluster];
                    const isDominant = cluster === clusterData.dominantCluster;
                    
                    return (
                      <div
                        key={cluster}
                        className={`${getClusterBgColor(cluster)} rounded-lg p-4 border-2 ${
                          isDominant ? 'ring-2 ring-offset-2 ring-orange-400' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-800">{cluster}</h4>
                          {isDominant && (
                            <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full font-semibold">
                              Dominant
                            </span>
                          )}
                        </div>
                        <p className="text-2xl font-bold text-gray-700">{count}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {count === 1 ? 'stressor' : 'stressors'}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Insight */}
                <div className="bg-white/60 rounded-lg p-4 border border-orange-200">
                  <p className="text-sm font-semibold text-orange-800 mb-2">
                    💡 Insight:
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {clusterData.insight}
                  </p>
                </div>
              </div>

              {/* Reflection Section */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  Add Your Reflection
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Take a moment to reflect on your stressors. What patterns do you notice? How might you address these challenges? (Minimum 10 characters)
                </p>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="For example: 'I notice that most of my stressors are workload-related. I might benefit from better time management strategies or discussing workload distribution with my administration...'"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-orange-500 focus:outline-none text-gray-800 min-h-[120px] resize-none"
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
                  Complete Stressor Identification
                </motion.button>
              </div>

              {/* Teacher Tip */}
              <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-amber-900 mb-2">
                  💡 Teacher Tip:
                </p>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Discuss common stress sources during Friday staff meetings to normalize them. Sharing stressors with colleagues helps you realize you're not alone in these experiences. It also creates opportunities for mutual support, collaborative problem-solving, and collective advocacy for needed changes. When stressors are normalized, they become manageable challenges rather than isolating struggles.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default IdentifyYourStressors;

