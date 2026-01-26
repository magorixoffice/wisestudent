import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Heart, BookOpen, TrendingUp, Users, Sparkles, CheckCircle } from "lucide-react";

const ConnectionReflectionJournal = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-79";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentDay, setCurrentDay] = useState(1);
  const [journalEntries, setJournalEntries] = useState({});
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // 5 days for weekly reflection
  const weekDays = [
    { id: 1, label: "Day 1", dayName: "Monday" },
    { id: 2, label: "Day 2", dayName: "Tuesday" },
    { id: 3, label: "Day 3", dayName: "Wednesday" },
    { id: 4, label: "Day 4", dayName: "Thursday" },
    { id: 5, label: "Day 5", dayName: "Friday" }
  ];

  const handleEntryChange = (dayId, value) => {
    setJournalEntries(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        reflection: value,
        date: new Date().toLocaleDateString()
      }
    }));
  };

  const calculateConnectionScore = () => {
    const entries = Object.values(journalEntries).filter(e => e?.reflection?.trim());
    const totalEntries = entries.length;
    
    if (totalEntries === 0) return 0;

    // Base score from frequency (max 30 points)
    let score = Math.min(30, totalEntries * 5);

    // Quality score based on reflection length (max 40 points)
    const avgLength = entries.reduce((sum, e) => sum + (e.reflection?.length || 0), 0) / totalEntries;
    const qualityScore = Math.min(40, (avgLength / 10) * 2);
    score += qualityScore;

    // Diversity bonus - if entries mention different people/relationships (max 30 points)
    const allText = entries.map(e => e.reflection?.toLowerCase() || '').join(' ');
    const relationshipKeywords = ['friend', 'partner', 'spouse', 'family', 'neighbor', 'colleague', 'parent', 'child', 'sibling', 'coach', 'teacher', 'mentor'];
    const uniqueRelationships = relationshipKeywords.filter(keyword => allText.includes(keyword)).length;
    const diversityBonus = Math.min(30, uniqueRelationships * 5);
    score += diversityBonus;

    return Math.min(100, Math.round(score));
  };

  const analyzeEnergizingRelationships = () => {
    const entries = Object.values(journalEntries).filter(e => e?.reflection?.trim());
    const allText = entries.map(e => e.reflection?.toLowerCase() || '').join(' ');
    
    const relationshipCategories = {
      'Family': ['family', 'parent', 'child', 'sibling', 'spouse', 'partner', 'grandparent', 'cousin'],
      'Friends': ['friend', 'best friend', 'pal', 'buddy'],
      'Community': ['neighbor', 'colleague', 'co-worker', 'community'],
      'Professional': ['mentor', 'coach', 'teacher', 'therapist', 'counselor'],
      'Romantic': ['partner', 'spouse', 'significant other', 'husband', 'wife']
    };

    const categoryCounts = {};
    Object.keys(relationshipCategories).forEach(category => {
      categoryCounts[category] = relationshipCategories[category].reduce((count, keyword) => {
        const regex = new RegExp(keyword, 'gi');
        const matches = allText.match(regex);
        return count + (matches ? matches.length : 0);
      }, 0);
    });

    // Find most mentioned categories
    const sortedCategories = Object.entries(categoryCounts)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return sortedCategories;
  };

  const isDayComplete = (dayId) => {
    const entry = journalEntries[dayId];
    return entry?.reflection && entry.reflection.trim().length >= 20;
  };

  const handleNext = () => {
    if (isDayComplete(currentDay)) {
      setScore(prev => prev + 1);
      
      if (currentDay < totalLevels) {
        setCurrentDay(prev => prev + 1);
      } else {
        setShowGameOver(true);
      }
    }
  };

  const connectionScore = calculateConnectionScore();
  const energizingRelationships = analyzeEnergizingRelationships();
  const completedEntries = weekDays.filter(day => isDayComplete(day.id)).length;

  if (showGameOver) {
    const scoreInfo = connectionScore >= 70 
      ? { label: 'Strong Connections', color: 'text-green-600', bg: 'from-green-500 to-emerald-600' }
      : connectionScore >= 50
      ? { label: 'Good Connections', color: 'text-blue-600', bg: 'from-blue-500 to-indigo-600' }
      : { label: 'Building Connections', color: 'text-yellow-600', bg: 'from-yellow-500 to-orange-600' };

    return (
      <ParentGameShell
        title={gameData?.title || "Connection Reflection Journal"}
        subtitle="5-Day Reflection Complete!"
        showGameOver={true}
        score={Math.round((completedEntries / totalLevels) * 100)}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={completedEntries === totalLevels}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-7xl mb-4"
              >
                💚
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Connection Reflection Complete!</h2>
              <p className="text-lg text-gray-600 mb-6">
                You reflected on {completedEntries} moment{completedEntries === 1 ? '' : 's'} of support over these 5 days.
              </p>
            </div>

            {/* Connection Score */}
            <div className={`bg-gradient-to-br ${scoreInfo.bg} rounded-xl p-8 mb-8 text-center text-white shadow-lg`}>
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <p className="text-lg font-semibold mb-2 opacity-90">Connection Score</p>
              <p className="text-6xl font-bold mb-2">{connectionScore}</p>
              <p className="text-xl font-semibold">{scoreInfo.label}</p>
            </div>

            {/* Weekly Entries Summary */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                Your 5-Day Reflections
              </h3>
              <div className="space-y-4">
                {weekDays.map((day) => {
                  const entry = journalEntries[day.id];
                  if (!entry?.reflection) return null;
                  
                  return (
                    <motion.div
                      key={day.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                          {day.id}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{day.dayName}</h4>
                          <p className="text-xs text-gray-600">{entry.date}</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <p className="text-sm font-semibold text-gray-700 mb-2">A moment I felt supported was…</p>
                        <p className="text-gray-800 leading-relaxed italic">"{entry.reflection}"</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Energizing Relationships Analysis */}
            {energizingRelationships.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-600" />
                  Relationships That Energize You
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  Based on your reflections, these relationships appear most frequently:
                </p>
                <div className="flex flex-wrap gap-3">
                  {energizingRelationships.map(([category, count], index) => (
                    <div
                      key={category}
                      className="bg-white rounded-lg px-4 py-2 border-2 border-purple-300 flex items-center gap-2"
                    >
                      <span className="text-xl">
                        {index === 0 ? '💚' : index === 1 ? '💙' : '💜'}
                      </span>
                      <div>
                        <p className="font-bold text-gray-800">{category}</p>
                        <p className="text-xs text-gray-600">{count} mention{count === 1 ? '' : 's'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-green-600" />
                Connection Insights
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Social Ties Impact Mood:</strong> Regular reflection reveals how connections with others improve your emotional wellbeing over these 5 days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Energizing Relationships:</strong> Notice which relationships appear most in your reflections—these are the connections that truly energize you.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Pattern Recognition:</strong> 5-day reflection helps you see patterns in when and how you feel supported, guiding you to nurture those relationships.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Mindful Connection:</strong> Being aware of supportive moments helps you appreciate and strengthen the relationships that matter most.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Regular reflection reveals which relationships truly energize you. When you take time to notice moments when you felt supported, you begin to see patterns—which relationships lift you up, which interactions leave you feeling connected, and how social ties improve your mood over these 5 days. Use these insights to intentionally nurture the relationships that energize you and build a support system that sustains your wellbeing.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  const currentDayData = weekDays.find(day => day.id === currentDay) || weekDays[0];
  const currentEntry = journalEntries[currentDay];

  return (
    <ParentGameShell
      title={gameData?.title || "Connection Reflection Journal"}
      subtitle={`${currentDayData.label} - 5-Day Reflection`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentDay}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={currentDay}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{currentDayData.label} of 5 Days</span>
              <span>{Math.round((currentDay / totalLevels) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentDay / totalLevels) * 100}%` }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💚</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{currentDayData.dayName}</h2>
            <p className="text-gray-600 text-lg">
              Reflect on how social ties improved your mood over these 5 days.
            </p>
          </div>

          {/* Journal Entry */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-blue-600" />
              Reflection Prompt
            </h3>
            <div className="bg-white rounded-lg p-5 border border-blue-200 mb-4">
              <p className="text-lg font-semibold text-gray-800 mb-2">
                A moment I felt supported was…
              </p>
              <p className="text-sm text-gray-600">
                Think about a time today (or this week) when someone supported you—maybe a friend listened, 
                a family member helped, a neighbor showed kindness, or a colleague offered encouragement.
              </p>
            </div>
            
            <textarea
              value={currentEntry?.reflection || ""}
              onChange={(e) => handleEntryChange(currentDay, e.target.value)}
              placeholder="Write about a moment when you felt supported... Who was involved? What did they do? How did it make you feel? How did it improve your mood?"
              className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-gray-800 min-h-[200px] resize-none"
            />
            <div className="flex justify-between items-center mt-3">
              <p className="text-sm text-gray-600">
                {(currentEntry?.reflection?.length || 0)} characters
              </p>
              {currentEntry?.reflection && currentEntry.reflection.length >= 20 && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-semibold">Entry saved</span>
                </div>
              )}
            </div>
          </div>

          {/* Connection Score Preview */}
          {completedEntries > 0 && (
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
              <div className="flex items-center justify-center gap-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Connection Score</p>
                  <p className="text-3xl font-bold text-purple-600">{connectionScore}</p>
                  <p className="text-xs text-gray-600">{completedEntries} reflection{completedEntries === 1 ? '' : 's'} logged</p>
                </div>
              </div>
            </div>
          )}

          {/* Examples */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mb-6">
            <p className="text-sm font-semibold text-gray-800 mb-2">💡 Examples:</p>
            <ul className="text-xs text-gray-700 space-y-1 ml-4">
              <li>• "A friend called to check in when I was feeling stressed..."</li>
              <li>• "My partner took over bedtime when I was exhausted..."</li>
              <li>• "A neighbor offered to watch the kids for an hour..."</li>
              <li>• "A colleague gave encouraging feedback on my work..."</li>
            </ul>
          </div>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={!isDayComplete(currentDay)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {currentDay < totalLevels ? (
              <>
                Continue to {weekDays.find(day => day.id === currentDay + 1)?.dayName || 'Next Day'}
                <CheckCircle className="w-5 h-5" />
              </>
            ) : (
              <>
                View Weekly Summary
                <TrendingUp className="w-5 h-5" />
              </>
            )}
          </motion.button>

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Regular reflection reveals which relationships truly energize you. Take time to notice moments when you felt supported—these connections are the ones that improve your mood and sustain your wellbeing.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default ConnectionReflectionJournal;

