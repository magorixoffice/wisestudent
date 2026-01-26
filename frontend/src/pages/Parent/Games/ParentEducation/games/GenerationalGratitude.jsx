import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Heart, Sparkles, BookOpen, CheckCircle, ArrowRight, Star } from "lucide-react";

const GenerationalGratitude = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-88";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [step, setStep] = useState(1); // 1: Reflection prompts, 2: Choose to Carry Forward, 3: Complete
  const [reflections, setReflections] = useState(Array(5).fill(""));
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [lessonsIdentified, setLessonsIdentified] = useState([]);
  const [selectedLessons, setSelectedLessons] = useState(Array(5).fill(null));
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  const extractLessons = (text) => {
    // Extract key lessons/phrases from the reflection
    const sentences = text.split(/[.!?]\s+/).filter(s => s.trim().length > 10);
    return sentences.slice(0, 3); // Take up to 3 sentences as potential lessons per reflection
  };

  // 5 different reflection prompts
  const reflectionPrompts = [
    {
      id: 1,
      title: "What did my parents teach me about love, even through mistakes?",
      guidance: "Reflect on your parents, elders, or mentors. What did they teach you about love, parenting, relationships, or life—both through their strengths and through their mistakes? What wisdom can you find in their imperfect humanity? How did their challenges teach you valuable lessons?"
    },
    {
      id: 2,
      title: "What generational patterns do I want to continue or transform?",
      guidance: "Think about behaviors, values, or traditions passed down through generations. Which ones nourish your family? Which ones create unnecessary stress or conflict? What would you like to preserve and what would you like to change?"
    },
    {
      id: 3,
      title: "How did my parents' sacrifices shape my understanding of love?",
      guidance: "Consider the sacrifices your parents made—their time, energy, dreams deferred, or personal struggles endured. How did witnessing or experiencing these sacrifices influence your concept of love, commitment, and family responsibility?"
    },
    {
      id: 4,
      title: "What did I learn about resilience from my family's challenges?",
      guidance: "Reflect on difficult periods your family faced—financial hardship, illness, loss, or other struggles. What did these experiences teach you about perseverance, hope, and finding strength in community? How do these lessons inform your parenting today?"
    },
    {
      id: 5,
      title: "How can I honor my family's legacy while creating new patterns?",
      guidance: "Consider how you can respectfully acknowledge and appreciate what previous generations gave you while consciously choosing different approaches for your own family. What traditions will you celebrate? What cycles will you intentionally break?"
    }
  ];

  const handleReflectionComplete = (promptIndex) => {
    if (reflections[promptIndex].trim().length >= 50) {
      // Move to next prompt or proceed to step 2
      if (promptIndex < 4) {
        setCurrentPromptIndex(promptIndex + 1);
      } else {
        // All reflections completed, combine all lessons
        const allLessons = [];
        reflections.forEach(reflection => {
          if (reflection.trim().length >= 50) {
            allLessons.push(...extractLessons(reflection));
          }
        });
        setLessonsIdentified([...new Set(allLessons)]); // Remove duplicates
        setStep(2);
      }
    }
  };

  const handlePreviousPrompt = () => {
    if (currentPromptIndex > 0) {
      setCurrentPromptIndex(currentPromptIndex - 1);
    }
  };

  const handleComplete = () => {
    const completedSelections = selectedLessons.filter(lesson => lesson !== null).length;
    if (completedSelections === 5) {
      setScore(completedSelections);
      setShowGameOver(true);
    }
  };

  const handleLessonSelect = (promptIndex, lesson) => {
    const newSelectedLessons = [...selectedLessons];
    newSelectedLessons[promptIndex] = lesson;
    setSelectedLessons(newSelectedLessons);
  };

  const getCurrentReflection = () => reflections[currentPromptIndex] || "";
  
  const setCurrentReflection = (value) => {
    const newReflections = [...reflections];
    newReflections[currentPromptIndex] = value;
    setReflections(newReflections);
  };

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Generational Gratitude"}
        subtitle="Reflection Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={true}
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
                🌳
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Generational Wisdom Acknowledged</h2>
              <p className="text-lg text-gray-600">
                You've transformed lessons from the past into wisdom for the future.
              </p>
            </div>

            {/* All Reflections Display */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                Your Reflections
              </h3>
              <div className="space-y-4">
                {reflections.map((reflection, index) => (
                  reflection.trim().length >= 50 && (
                    <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-blue-600">Prompt {index + 1}:</span>
                        <span className="text-sm text-gray-600">{reflectionPrompts[index]?.title}</span>
                      </div>
                      <p className="text-gray-800 leading-relaxed italic text-base">
                        "{reflection}"
                      </p>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Selected Lessons to Carry Forward */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-600" />
                What I'll Carry Forward
              </h3>
              <div className="space-y-3">
                {selectedLessons.map((lesson, index) => (
                  lesson && (
                    <div key={index} className="bg-white rounded-lg p-4 border border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-amber-600">From Prompt {index + 1}:</span>
                      </div>
                      <p className="text-gray-800 leading-relaxed text-base font-semibold">
                        "{lesson}"
                      </p>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-green-600" />
                Transforming Wounds into Wisdom
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Gratitude Heals:</strong> When you acknowledge what your parents taught you about love—even through their mistakes—you transform old wounds into timeless wisdom. This gratitude doesn't erase the past, but it gives it meaning.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Lessons in Imperfection:</strong> Your parents were human, and their mistakes were part of their journey. By recognizing what you learned from both their successes and struggles, you honor their humanity while choosing what to carry forward.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Breaking Cycles:</strong> Acknowledging generational patterns—both positive and challenging—helps you consciously choose what to pass on to your children and what to transform.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Wisdom Across Generations:</strong> The lessons you carry forward become part of your parenting legacy. You're not just parenting your children—you're honoring the generations before you while creating new patterns for the future.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Gratitude transforms old wounds into timeless wisdom. When you take time to reflect on what your parents, elders, and mentors taught you about love—including the lessons learned through their mistakes—you're doing powerful healing work. This reflection isn't about ignoring pain or making excuses. It's about finding the wisdom in your story, acknowledging what was good, learning from what was hard, and consciously choosing what you'll carry forward to your own children. This practice breaks cycles of pain and creates cycles of growth.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  // Step 2: Choose what to carry forward
  if (step === 2) {
    return (
      <ParentGameShell
        title={gameData?.title || "Generational Gratitude"}
        subtitle="Choose What to Carry Forward"
        showGameOver={false}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={2}
      >
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🌟</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose What to Carry Forward</h2>
              <p className="text-gray-600">
                From your reflection, select one lesson or value you want to carry forward to your own parenting.
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200 mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-gray-800">Progress: {currentPromptIndex + 1}/5</h3>
                <div className="flex gap-1">
                  {Array(5).fill(0).map((_, index) => (
                    <div 
                      key={index}
                      className={`w-3 h-3 rounded-full ${index <= currentPromptIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 font-medium">
                Current Prompt: {reflectionPrompts[currentPromptIndex]?.title}
              </p>
            </div>

            {/* Lessons Selection for Each Prompt */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Choose one lesson to carry forward from each reflection:</h3>
              
              {reflections.map((reflection, promptIndex) => {
                if (reflection.trim().length < 50) return null;
                
                const lessons = extractLessons(reflection);
                const selectedLesson = selectedLessons[promptIndex];
                
                return (
                  <div key={promptIndex} className="mb-6 p-5 bg-white rounded-xl border-2 border-gray-200">
                    <div className="mb-3">
                      <span className="font-bold text-blue-600">Prompt {promptIndex + 1}:</span>
                      <p className="text-sm text-gray-600 mt-1">{reflectionPrompts[promptIndex]?.title}</p>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      {lessons.length > 0 ? (
                        lessons.map((lesson, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleLessonSelect(promptIndex, lesson)}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                              selectedLesson === lesson
                                ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-400 border-2 shadow-md'
                                : 'bg-gray-50 border-gray-300 hover:border-amber-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-gray-800 text-sm">{lesson}</p>
                              {selectedLesson === lesson && (
                                <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 ml-2" />
                              )}
                            </div>
                          </motion.button>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm italic">No clear lessons identified. Write a more detailed reflection.</p>
                      )}
                    </div>
                    
                    {/* Custom Option */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        const custom = prompt(`Enter a lesson from Prompt ${promptIndex + 1}:`);
                        if (custom && custom.trim()) {
                          handleLessonSelect(promptIndex, custom.trim());
                        }
                      }}
                      className="w-full p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 text-gray-700 text-sm font-medium transition-all"
                    >
                      + Add my own lesson for this prompt
                    </motion.button>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                Back to Reflections
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleComplete}
                disabled={selectedLessons.filter(l => l !== null).length !== 5}
                className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Complete All Reflections
                <CheckCircle className="w-5 h-5" />
              </motion.button>
            </div>

            {selectedLessons.filter(l => l !== null).length !== 5 && (
              <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
                <p className="text-yellow-800 text-sm text-center">
                  Please select one lesson for each of the 5 prompts ({selectedLessons.filter(l => l !== null).length}/5 completed).
                </p>
              </div>
            )}

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
              <p className="text-sm text-gray-700">
                <strong>💡 Parent Tip:</strong> Gratitude transforms old wounds into timeless wisdom. Choosing what to carry forward helps you honor the past while creating your own parenting path.
              </p>
            </div>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  // Step 1: Reflection Writing
  return (
    <ParentGameShell
      title={gameData?.title || "Generational Gratitude"}
      subtitle="Acknowledge Generational Wisdom"
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentPromptIndex + 1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🌳</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Generational Gratitude</h2>
            <p className="text-gray-600 text-lg">
              Acknowledge lessons learned from parents, elders, and mentors.
            </p>
            <div className="mt-4 bg-blue-100 rounded-lg p-3 inline-block">
              <p className="text-blue-800 font-medium">Reflection {currentPromptIndex + 1} of 5</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Prompt {currentPromptIndex + 1} of 5</span>
              <span>{Math.round(((currentPromptIndex) / 5) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((currentPromptIndex + 1) / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Current Reflection Prompt */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-7 h-7 text-blue-600" />
              Reflection Prompt {currentPromptIndex + 1}
            </h3>
            <div className="bg-white rounded-lg p-5 border border-blue-200 mb-4">
              <p className="text-xl font-semibold text-gray-800 mb-3">
                "{reflectionPrompts[currentPromptIndex]?.title}"
              </p>
              <p className="text-sm text-gray-600">
                {reflectionPrompts[currentPromptIndex]?.guidance}
              </p>
            </div>
            
            <textarea
              value={getCurrentReflection()}
              onChange={(e) => setCurrentReflection(e.target.value)}
              placeholder="Write your reflection here... Consider both positive lessons and challenging ones. Acknowledge their humanity and imperfections. Identify what you learned about love through their mistakes. Recognize patterns you want to continue or transform. Find gratitude for the wisdom gained, even from difficult experiences."
              className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-gray-800 min-h-[300px] resize-none"
            />
            <div className="flex justify-between items-center mt-3">
              <p className="text-sm text-gray-600">
                {(getCurrentReflection()?.length || 0)} characters (minimum 50)
              </p>
              {getCurrentReflection() && getCurrentReflection().length >= 50 && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-semibold">Ready for next prompt</span>
                </div>
              )}
            </div>
          </div>

          {/* Guidance */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mb-6">
            <p className="text-sm font-semibold text-gray-800 mb-2">💡 Reflection Guidelines:</p>
            <ul className="text-xs text-gray-700 space-y-1 ml-4">
              <li>• Consider both positive lessons and challenging ones</li>
              <li>• Acknowledge their humanity and imperfections</li>
              <li>• Identify what you learned about love through their mistakes</li>
              <li>• Recognize patterns you want to continue or transform</li>
              <li>• Find gratitude for the wisdom gained, even from difficult experiences</li>
            </ul>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {currentPromptIndex > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePreviousPrompt}
                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                Previous Prompt
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleReflectionComplete(currentPromptIndex)}
              disabled={!getCurrentReflection().trim() || getCurrentReflection().trim().length < 50}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {currentPromptIndex < 4 ? 'Next Prompt' : 'Finish Reflections'}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>

          {(!getCurrentReflection().trim() || getCurrentReflection().trim().length < 50) && (
            <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
              <p className="text-yellow-800 text-sm text-center">
                Please write at least 50 characters to continue to the next prompt.
              </p>
            </div>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Gratitude transforms old wounds into timeless wisdom. Taking time to acknowledge what your parents taught you—even through their mistakes—helps you find meaning in your past and consciously choose what to carry forward.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default GenerationalGratitude;

