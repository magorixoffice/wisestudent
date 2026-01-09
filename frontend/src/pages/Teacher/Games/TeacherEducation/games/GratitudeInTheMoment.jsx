import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Heart, Sparkles, CheckCircle, TrendingUp } from "lucide-react";

const GratitudeInTheMoment = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-49";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [gratitudes, setGratitudes] = useState(["", "", ""]);
  const [calmScore, setCalmScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const handleGratitudeChange = (index, value) => {
    const newGratitudes = [...gratitudes];
    newGratitudes[index] = value;
    setGratitudes(newGratitudes);

    // Calculate calm score based on completed gratitudes
    const completedCount = newGratitudes.filter(g => g.trim().length > 0).length;
    // Calm score rises: 0 -> 33 -> 66 -> 100 (for 0, 1, 2, 3 gratitudes)
    const newCalmScore = Math.round((completedCount / 3) * 100);
    setCalmScore(newCalmScore);
  };

  const handleComplete = () => {
    const completedCount = gratitudes.filter(g => g.trim().length > 0).length;
    
    if (completedCount === 0) {
      alert("Please write at least one thing you're grateful for.");
      return;
    }

    if (completedCount < 3) {
      if (!confirm(`You've written ${completedCount} gratitude${completedCount !== 1 ? 's' : ''}. Would you like to add more, or complete with what you have?`)) {
        return;
      }
    }

    setScore(1);
    setShowGameOver(true);
  };

  const completedCount = gratitudes.filter(g => g.trim().length > 0).length;
  const allCompleted = completedCount === 3;

  return (
    <TeacherGameShell
      title={gameData?.title || "Gratitude in the Moment"}
      subtitle={gameData?.description || "Shift attention from pressure to appreciation to restore focus"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={1}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">💚</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                What Went Right Today?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Shift your attention from pressure to appreciation. Write 3 small things you're grateful for and watch your calm score rise.
              </p>
            </div>

            {/* Calm Score Indicator */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${
                    calmScore >= 66 ? 'from-green-400 to-emerald-500' :
                    calmScore >= 33 ? 'from-blue-400 to-cyan-500' :
                    'from-gray-300 to-gray-400'
                  } flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
                    {calmScore}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Calm Score</h3>
                    <p className="text-sm text-gray-600">Shifts as you write</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Gratitudes Written</p>
                  <p className="text-3xl font-bold text-indigo-600">{completedCount} / 3</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${calmScore}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-4 rounded-full ${
                    calmScore >= 66 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                    calmScore >= 33 ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                    'bg-gradient-to-r from-gray-300 to-gray-400'
                  } shadow-md`}
                />
              </div>
              
              {/* Calm Score Message */}
              <p className="text-sm text-center text-gray-600 mt-2">
                {calmScore === 0 && "Start writing to see your calm score rise..."}
                {calmScore > 0 && calmScore < 33 && "Great start! Keep writing..."}
                {calmScore >= 33 && calmScore < 66 && "You're shifting your focus! Continue..."}
                {calmScore >= 66 && calmScore < 100 && "Wonderful! Almost there..."}
                {calmScore === 100 && "Perfect! You've shifted from pressure to appreciation."}
              </p>
            </div>

            {/* Gratitude Input Boxes */}
            <div className="space-y-6 mb-8">
              {[0, 1, 2].map((index) => {
                const isCompleted = gratitudes[index].trim().length > 0;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative rounded-xl border-2 transition-all ${
                      isCompleted
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-md'
                        : 'bg-white border-gray-300 hover:border-indigo-400'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                          isCompleted
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Gratitude {index + 1}
                          </label>
                          <p className="text-xs text-gray-500">
                            What went right today? (e.g., "A student smiled", "Coffee was good", "Had time to breathe")
                          </p>
                        </div>
                        {isCompleted && (
                          <Sparkles className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <textarea
                        value={gratitudes[index]}
                        onChange={(e) => handleGratitudeChange(index, e.target.value)}
                        placeholder={`Write something small you're grateful for...`}
                        className={`w-full h-24 p-4 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none ${
                          isCompleted
                            ? 'bg-white border-green-300 focus:border-green-400'
                            : 'bg-gray-50 border-gray-300 focus:border-indigo-400'
                        }`}
                      />
                      {isCompleted && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1"
                        >
                          <Heart className="w-3 h-3" />
                          <span>Appreciation shifts your focus to what's positive</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Examples */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 font-semibold mb-2">
                💡 Remember: Small gratitudes are powerful
              </p>
              <p className="text-xs text-blue-700">
                You don't need to write big things. Simple, everyday moments of appreciation count: "A student thanked me", "The sun was out", "I remembered to drink water", "Colleague shared a smile", "Got through that difficult conversation calmly".
              </p>
            </div>

            {/* Complete Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                disabled={completedCount === 0}
                className={`px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto ${
                  allCompleted
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : completedCount > 0
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle className="w-6 h-6" />
                {allCompleted ? 'Complete' : completedCount > 0 ? 'Complete' : 'Write at least one gratitude'}
              </motion.button>
            </div>
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
              {calmScore === 100 ? '✨' : calmScore >= 66 ? '💚' : '🌟'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Gratitude Complete!
            </h2>
            
            {/* Final Calm Score */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {calmScore === 100 
                  ? "Perfect! You've written 3 gratitudes and shifted your attention from pressure to appreciation. Your calm score reached 100%."
                  : calmScore >= 66
                  ? `Well done! You've written ${completedCount} gratitude${completedCount !== 1 ? 's' : ''} and significantly shifted your focus. Your calm score is ${calmScore}%.`
                  : `Great start! You've written ${completedCount} gratitude${completedCount !== 1 ? 's' : ''} and begun the shift from pressure to appreciation. Your calm score is ${calmScore}%.`}
              </p>
              
              <div className="bg-white/60 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${
                    calmScore >= 66 ? 'from-green-400 to-emerald-500' :
                    calmScore >= 33 ? 'from-blue-400 to-cyan-500' :
                    'from-gray-300 to-gray-400'
                  } flex items-center justify-center text-3xl font-bold text-white shadow-lg`}>
                    {calmScore}
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-600">Final Calm Score</p>
                    <p className="text-2xl font-bold text-indigo-600">%</p>
                  </div>
                </div>
              </div>

              {/* Your Gratitudes */}
              <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3 text-left">Your Gratitudes:</h3>
                <div className="space-y-2 text-left">
                  {gratitudes.map((gratitude, index) => {
                    if (!gratitude.trim()) return null;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                      >
                        <Heart className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700 flex-1">{gratitude}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Gratitude Insights */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200 mb-6 text-left">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                Notice the Shift:
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• <strong>From pressure to appreciation:</strong> You've intentionally shifted your attention from what's stressful to what's positive.</li>
                <li>• <strong>Calm score reflects focus:</strong> As you wrote each gratitude, your calm score rose, showing how appreciation restores focus.</li>
                <li>• <strong>Small moments matter:</strong> Gratitude doesn't require big events—small, everyday moments of appreciation are powerful.</li>
                <li>• <strong>This is a skill:</strong> The more you practice shifting attention to gratitude, the easier it becomes to restore focus during pressure.</li>
              </ul>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Begin meetings with one gratitude per person. Start staff meetings, department meetings, or even brief check-ins by having each person share one small thing they're grateful for. This simple practice (just 30-60 seconds) shifts the energy of the entire meeting from stress and pressure to appreciation and connection. You'll notice meetings become more collaborative, solutions-focused, and positive when they begin with gratitude. Try it at the start of parent-teacher conferences, team planning sessions, or grade-level meetings. This isn't just a nice thing to do—it's a practical tool that improves meeting outcomes by resetting everyone's focus from pressure to appreciation. Students also benefit when you model gratitude. Consider starting class with a gratitude moment: "Before we begin, let's share one small thing we're grateful for today." This creates a positive classroom culture and helps students (and you) shift from morning stress to present-moment appreciation. Remember: gratitude is a focus-shifting tool. Use it intentionally to restore clarity and calm when pressure builds.
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

export default GratitudeInTheMoment;

