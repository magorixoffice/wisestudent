import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Eye, CheckCircle, Circle, Target, Sparkles, GraduationCap } from "lucide-react";

const MindfulObservationGame = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-44";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [foundDifferences, setFoundDifferences] = useState([]);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [showReflection, setShowReflection] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Define 8 differences in the classroom (positions are relative percentages)
  const differences = [
    { id: 1, x: 20, y: 15, description: "Whiteboard text changed", found: false },
    { id: 2, x: 75, y: 20, description: "Poster on bulletin board", found: false },
    { id: 3, x: 45, y: 35, description: "Student artwork added", found: false },
    { id: 4, x: 15, y: 55, description: "Desk arrangement shifted", found: false },
    { id: 5, x: 80, y: 60, description: "Window blinds position", found: false },
    { id: 6, x: 50, y: 70, description: "Book on teacher's desk", found: false },
    { id: 7, x: 30, y: 80, description: "Calendar date changed", found: false },
    { id: 8, x: 85, y: 85, description: "Plant position moved", found: false }
  ];

  const allFound = foundDifferences.length >= 8;

  // Handle clicking on a difference area
  const handleDifferenceClick = (differenceId) => {
    // Check if already found
    const alreadyFound = foundDifferences.some(d => d.id === differenceId);
    if (alreadyFound) return;

    // Mark as found
    const newFound = {
      id: differenceId,
      timestamp: Date.now()
    };
    setFoundDifferences(prev => [...prev, newFound]);
    setScore(prev => prev + 1);

    // If all 8 found, show reflection after a delay
    if (foundDifferences.length === 7) {
      setTimeout(() => {
        setShowReflection(true);
      }, 1000);
    }
  };

  // Handle reflection selection
  const handleReflectionSelect = (reflectionId) => {
    setSelectedReflection(reflectionId);
    setTimeout(() => {
      setShowGameOver(true);
    }, 2000);
  };

  const attentionReflections = [
    {
      id: 'strong',
      text: "I maintained calm, focused attention throughout. My mind stayed present and observant, noticing details mindfully.",
      insight: "Excellent! You demonstrated strong mindful awareness. This focused observation strengthens your ability to notice subtle details in your classroom and with your students."
    },
    {
      id: 'moderate',
      text: "I found most differences but noticed my attention wavering at times. Some moments were more focused than others.",
      insight: "Good practice! You noticed when your attention shifted. This awareness is valuable—recognizing when focus wavers and returning to observation is exactly the skill being strengthened."
    },
    {
      id: 'distracted',
      text: "I found the differences but felt distracted and rushed. I wasn't fully present during the observation.",
      insight: "You still found the differences, which shows your observation skills work even when you're not fully present. With practice, you can develop greater ease in maintaining mindful attention."
    }
  ];

  const selectedReflectionData = attentionReflections.find(r => r.id === selectedReflection);

  return (
    <TeacherGameShell
      title={gameData?.title || "Mindful Observation Game"}
      subtitle={gameData?.description || "Strengthen awareness by noticing small details in environment"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={1}
    >
      <div className="w-full max-w-6xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Instructions */}
            <div className="mb-6">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="w-8 h-8 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Classroom Observation Challenge
                  </h2>
                </div>
                <p className="text-gray-700 mb-2">
                  Compare two classroom scenes. Find 8 subtle differences by observing mindfully and calmly.
                </p>
                <p className="text-sm text-gray-600 italic">
                  Take your time. Notice details. Practice "slow looking" to strengthen your awareness.
                </p>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Differences Found: {foundDifferences.length} / 8</span>
                  <span className="font-semibold">
                    {foundDifferences.length >= 8 ? 'Complete!' : 'Keep Observing'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(foundDifferences.length / 8) * 100}%` }}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
                  />
                </div>
              </div>
            </div>

            {!allFound && !showReflection && (
              <>
                {/* Instruction Banner */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-amber-800 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    <span><strong>Instructions:</strong> Compare the two classroom scenes side-by-side. Click on areas where you notice differences. Observe mindfully and take your time. Notice the small details.</span>
                  </p>
                </div>

                {/* Two side-by-side classroom scenes */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Classroom Scene A */}
                  <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                    <h4 className="text-center font-semibold text-gray-700 mb-4 flex items-center justify-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      Classroom A
                    </h4>
                    <div className="relative bg-white rounded-lg h-96 border-2 border-gray-300 overflow-hidden">
                      {/* Visual representation of a classroom using CSS */}
                      <div className="relative w-full h-full bg-gradient-to-b from-sky-100 to-white">
                        {/* Whiteboard (top center) */}
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3/4 h-16 bg-green-100 border-2 border-green-400 rounded">
                          <div className="absolute top-2 left-4 w-20 h-2 bg-gray-600 rounded"></div>
                          <div className="absolute top-4 left-4 w-16 h-2 bg-gray-400 rounded"></div>
                        </div>
                        
                        {/* Bulletin Board (top right) */}
                        <div className="absolute top-6 right-6 w-20 h-24 bg-yellow-50 border-2 border-yellow-300 rounded">
                          <div className="absolute top-2 left-2 w-12 h-8 bg-blue-100 border border-blue-300 rounded"></div>
                        </div>
                        
                        {/* Student Artwork (center right) */}
                        <div className="absolute top-32 right-8 w-16 h-20 bg-white border border-gray-400 rounded shadow"></div>
                        
                        {/* Desk (center left) */}
                        <div className="absolute top-40 left-8 w-12 h-8 bg-brown-300 border border-brown-500 rounded"></div>
                        
                        {/* Window (right side) */}
                        <div className="absolute top-20 right-4 w-16 h-24 bg-blue-200 border-2 border-blue-400 rounded">
                          <div className="absolute top-2 left-2 w-12 h-2 bg-blue-300 rounded"></div>
                          <div className="absolute top-4 left-2 w-12 h-2 bg-blue-300 rounded"></div>
                        </div>
                        <div className="absolute top-24 right-8 w-2 h-20 bg-gray-500"></div>
                        
                        {/* Teacher's Desk (bottom left) */}
                        <div className="absolute bottom-16 left-6 w-20 h-12 bg-brown-400 border border-brown-600 rounded"></div>
                        
                        {/* Calendar (bottom left corner) */}
                        <div className="absolute bottom-12 left-10 w-10 h-12 bg-white border border-gray-400 rounded shadow">
                          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-red-300 rounded"></div>
                          <div className="absolute top-3 left-2 w-6 h-4 bg-gray-100 rounded text-xs">15</div>
                        </div>
                        
                        {/* Plant (bottom right) */}
                        <div className="absolute bottom-8 right-12 w-6 h-8 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Classroom Scene B (with differences) */}
                  <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                    <h4 className="text-center font-semibold text-gray-700 mb-4 flex items-center justify-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      Classroom B
                    </h4>
                    <div className="relative bg-white rounded-lg h-96 border-2 border-gray-300 overflow-hidden">
                      {/* Visual representation with subtle differences */}
                      <div className="relative w-full h-full bg-gradient-to-b from-sky-100 to-white">
                        {/* Whiteboard - DIFFERENCE 1: Different text (longer line) */}
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3/4 h-16 bg-green-100 border-2 border-green-400 rounded">
                          <div className="absolute top-2 left-4 w-28 h-2 bg-gray-600 rounded"></div>
                          <div className="absolute top-4 left-4 w-20 h-2 bg-gray-400 rounded"></div>
                        </div>
                        
                        {/* Bulletin Board - DIFFERENCE 2: Poster added (extra element) */}
                        <div className="absolute top-6 right-6 w-20 h-24 bg-yellow-50 border-2 border-yellow-300 rounded">
                          <div className="absolute top-2 left-2 w-12 h-8 bg-blue-100 border border-blue-300 rounded"></div>
                          <div className="absolute top-12 left-2 w-10 h-6 bg-red-100 border border-red-300 rounded"></div>
                        </div>
                        
                        {/* Student Artwork - DIFFERENCE 3: Additional artwork (taller) */}
                        <div className="absolute top-32 right-8 w-16 h-24 bg-white border border-gray-400 rounded shadow"></div>
                        
                        {/* Desk - DIFFERENCE 4: Different arrangement (moved right) */}
                        <div className="absolute top-40 left-12 w-12 h-8 bg-brown-300 border border-brown-500 rounded"></div>
                        
                        {/* Window - DIFFERENCE 5: Blinds position changed (higher) */}
                        <div className="absolute top-16 right-4 w-16 h-24 bg-blue-200 border-2 border-blue-400 rounded">
                          <div className="absolute top-1 left-2 w-12 h-2 bg-blue-300 rounded"></div>
                          <div className="absolute top-3 left-2 w-12 h-2 bg-blue-300 rounded"></div>
                        </div>
                        <div className="absolute top-20 right-8 w-2 h-20 bg-gray-500"></div>
                        
                        {/* Teacher's Desk - DIFFERENCE 6: Book added */}
                        <div className="absolute bottom-16 left-6 w-20 h-12 bg-brown-400 border border-brown-600 rounded">
                          <div className="absolute top-2 left-2 w-6 h-8 bg-blue-200 border border-blue-400 rounded"></div>
                        </div>
                        
                        {/* Calendar - DIFFERENCE 7: Date changed (different number) */}
                        <div className="absolute bottom-12 left-10 w-10 h-12 bg-white border border-gray-400 rounded shadow">
                          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-red-300 rounded"></div>
                          <div className="absolute top-3 left-2 w-6 h-4 bg-gray-100 rounded text-xs">22</div>
                        </div>
                        
                        {/* Plant - DIFFERENCE 8: Position moved (different location) */}
                        <div className="absolute bottom-12 right-8 w-6 h-8 bg-green-400 rounded-full"></div>
                      </div>

                      {/* Clickable difference areas */}
                      {differences.map((diff) => {
                        const isFound = foundDifferences.some(d => d.id === diff.id);
                        return (
                          <motion.button
                            key={diff.id}
                            whileHover={!isFound ? { scale: 1.2 } : {}}
                            whileTap={!isFound ? { scale: 0.9 } : {}}
                            onClick={() => !isFound && handleDifferenceClick(diff.id)}
                            disabled={isFound}
                            className={`absolute rounded-full border-2 transition-all flex items-center justify-center ${
                              isFound
                                ? 'bg-green-500 border-green-600 opacity-70 cursor-not-allowed'
                                : 'bg-red-500 border-red-600 opacity-0 hover:opacity-40 cursor-pointer'
                            }`}
                            style={{
                              left: `${diff.x}%`,
                              top: `${diff.y}%`,
                              width: '32px',
                              height: '32px',
                              transform: 'translate(-50%, -50%)'
                            }}
                            title={isFound ? `Found: ${diff.description}` : `Click if you see a difference here`}
                          >
                            {isFound ? (
                              <CheckCircle className="w-6 h-6 text-white" />
                            ) : (
                              <Circle className="w-4 h-4 text-white opacity-0" />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Found differences list */}
                {foundDifferences.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 mb-6"
                  >
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Differences Found ({foundDifferences.length} / 8):
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {foundDifferences.map((found) => {
                        const diff = differences.find(d => d.id === found.id);
                        return (
                          <span key={found.id} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1 font-medium">
                            <CheckCircle className="w-4 h-4" />
                            {diff?.description}
                          </span>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Hint for remaining differences */}
                {foundDifferences.length > 0 && foundDifferences.length < 8 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <p className="text-sm text-blue-800">
                      💡 {8 - foundDifferences.length} difference{8 - foundDifferences.length !== 1 ? 's' : ''} remaining. Take your time and observe mindfully.
                    </p>
                  </div>
                )}
              </>
            )}

            {allFound && !showReflection && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-300 text-center mb-6"
              >
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">All 8 Differences Found!</h3>
                <p className="text-gray-700 mb-2">
                  Excellent mindful observation! You noticed subtle details by staying present and attentive.
                </p>
                <p className="text-sm text-gray-600">
                  Now let's reflect on your attention and awareness during this exercise.
                </p>
              </motion.div>
            )}

            {showReflection && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-indigo-600" />
                    Reflection on Your Attention
                  </h3>
                  <p className="text-gray-700 mb-6">
                    How would you describe your attention and awareness while finding the differences? Consider your focus, presence, and how mindfully you observed.
                  </p>
                  <div className="space-y-3">
                    {attentionReflections.map((reflection, index) => (
                      <motion.button
                        key={reflection.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleReflectionSelect(reflection.id)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          selectedReflection === reflection.id
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-indigo-600 shadow-lg'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-400 hover:shadow-md'
                        }`}
                      >
                        <p className="font-medium">{reflection.text}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {selectedReflection && selectedReflectionData && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4"
                  >
                    <p className="text-sm text-blue-800 font-medium mb-2">
                      💡 Insight:
                    </p>
                    <p className="text-sm text-blue-900">
                      {selectedReflectionData.insight}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
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
              👁️
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Observation Complete!
            </h2>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                You found all {foundDifferences.length} differences through mindful observation!
              </p>
              <p className="text-gray-600">
                By practicing careful, present-moment observation, you've strengthened your ability to notice subtle details in your environment. This awareness skill enhances your teaching practice.
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Your Observation Summary:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-white rounded-lg p-4 border border-gray-300">
                  <p className="text-sm text-gray-600 mb-1">Differences Found</p>
                  <p className="text-2xl font-bold text-indigo-600">{foundDifferences.length} / 8</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-300">
                  <p className="text-sm text-gray-600 mb-1">Attention Level</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {selectedReflection === 'strong' ? 'Strong & Present' :
                     selectedReflection === 'moderate' ? 'Moderate' :
                     selectedReflection === 'distracted' ? 'Learning to Focus' : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Found Differences List */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6 text-left">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                All Differences You Found:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {differences.map((diff) => {
                  const isFound = foundDifferences.some(d => d.id === diff.id);
                  return (
                    <div
                      key={diff.id}
                      className={`p-3 rounded-lg border-2 flex items-center gap-2 ${
                        isFound
                          ? 'bg-green-50 border-green-300'
                          : 'bg-gray-50 border-gray-300 opacity-50'
                      }`}
                    >
                      {isFound ? (
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                      <span className={`text-xs font-medium ${
                        isFound ? 'text-green-800' : 'text-gray-500'
                      }`}>
                        {diff.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <Eye className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Use "slow looking" as classroom mindfulness practice too. "Slow looking" is the practice of taking extended time to observe something carefully, noticing details, patterns, and subtle changes. You can incorporate this into your classroom as a mindfulness exercise. Try "Slow Looking Monday" where students spend 5 minutes observing a natural object, artwork, or photograph and share what they notice. Or use it as a transition activity—before starting a lesson, have students spend 30 seconds mindfully observing something in the classroom. This practice builds students' attention skills, reduces stress, and creates a calmer classroom atmosphere. You can also use slow looking yourself during planning periods—spending a few minutes observing your classroom environment mindfully can help you notice what's working, what needs adjustment, and how students are experiencing the space. The skill of mindful observation strengthens your ability to notice student needs, classroom dynamics, and subtle cues that inform effective teaching.
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

export default MindfulObservationGame;

