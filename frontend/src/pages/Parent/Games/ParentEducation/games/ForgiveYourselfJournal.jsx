import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Heart, Sparkles, BookOpen, CheckCircle, ArrowRight } from "lucide-react";

const ForgiveYourselfJournal = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-54";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5; // Changed from 1 to 5 journal questions
  
  const [currentQuestion, setCurrentQuestion] = useState(0); // Index of current question (0-4)
  const [journalEntries, setJournalEntries] = useState(Array(5).fill(null).map(() => ({
    note: "",
    generatedAffirmation: null,
    completed: false
  })));
  const [step, setStep] = useState(1); // 1: Writing, 2: Affirmation
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  const generateAffirmation = (note) => {
    const lowerNote = note.toLowerCase();
    let affirmation = "";
    let emoji = "💙";
    let tone = "compassionate";

    // Analyze the forgiveness note and generate personalized affirmation
    if (lowerNote.includes('lost my temper') || lowerNote.includes('yelled') || lowerNote.includes('shouted') || 
        lowerNote.includes('angry') || lowerNote.includes('snapped')) {
      affirmation = "You're human, and anger is a natural emotion. You recognized your response and that's growth. You're learning to respond differently, not failing because you reacted. Each moment is a chance to practice patience and repair.";
      emoji = "🌱";
      tone = "growth";
    } else if (lowerNote.includes('guilty') || lowerNote.includes('bad parent') || lowerNote.includes('failure') || 
               lowerNote.includes('failing') || lowerNote.includes('not enough')) {
      affirmation = "You're growing, not failing. Guilt shows you care deeply. Your mistakes don't define you—your willingness to learn and grow does. You are enough, and you're doing your best with what you have.";
      emoji = "✨";
      tone = "affirming";
    } else if (lowerNote.includes('mistake') || lowerNote.includes('wrong') || lowerNote.includes('should have') || 
               lowerNote.includes('shouldn\'t have') || lowerNote.includes('regret')) {
      affirmation = "Mistakes are part of learning, not proof of failure. You're growing through every experience. What matters is that you're reflecting, learning, and choosing to do differently next time. You're becoming wiser with each choice.";
      emoji = "📚";
      tone = "learning";
    } else if (lowerNote.includes('overwhelmed') || lowerNote.includes('exhausted') || lowerNote.includes('tired') || 
               lowerNote.includes('can\'t handle') || lowerNote.includes('too much')) {
      affirmation = "You're doing a lot, and it's okay to feel overwhelmed. Taking time to acknowledge this is self-care. You're learning your limits and that's wisdom. Rest and self-compassion aren't selfish—they're necessary.";
      emoji = "🕊️";
      tone = "calming";
    } else if (lowerNote.includes('judgment') || lowerNote.includes('criticized') || lowerNote.includes('blame') || 
               lowerNote.includes('blamed') || lowerNote.includes('harsh')) {
      affirmation = "Self-judgment often comes from caring deeply. You're learning to be kinder to yourself. Growth happens when you shift from judgment to understanding. You deserve the same compassion you'd give a friend.";
      emoji = "💚";
      tone = "gentle";
    } else if (lowerNote.includes('patient') || lowerNote.includes('impatient') || lowerNote.includes('rushed') || 
               lowerNote.includes('hurry')) {
      affirmation = "Patience is a practice, not perfection. You're learning and improving with each day. Every moment you choose patience over reactivity is growth. You're becoming more patient with yourself and your children, one moment at a time.";
      emoji = "⏳";
      tone = "encouraging";
    } else if (lowerNote.includes('child') || lowerNote.includes('kids') || lowerNote.includes('children')) {
      affirmation = "Parenting is hard, and you're doing your best. Your children see your love and effort more than your mistakes. What matters is that you're trying, learning, and showing up. You're modeling resilience by forgiving yourself.";
      emoji = "👨‍👩‍👧‍👦";
      tone = "supportive";
    } else if (lowerNote.includes('time') || lowerNote.includes('present') || lowerNote.includes('attention') || 
               lowerNote.includes('distracted')) {
      affirmation = "You're learning to be present, and that's growth. Every moment of awareness is progress. Being present is a practice, not a destination. You're showing up for your children and yourself, and that matters.";
      emoji = "🌺";
      tone = "mindful";
    } else {
      // Default affirmation
      affirmation = "You're growing, not failing. Self-forgiveness is a practice of compassion toward yourself. Every moment you choose to forgive yourself, you're teaching yourself—and your children—that mistakes are part of growth. You're learning, healing, and becoming wiser with each day.";
      emoji = "💜";
      tone = "compassionate";
    }

    // Add closing affirmation
    affirmation += " You're learning, and that's exactly what you're supposed to be doing.";

    return {
      text: affirmation,
      emoji: emoji,
      tone: tone
    };
  };

  const handleGenerateAffirmation = () => {
    const currentEntry = journalEntries[currentQuestion];
    if (currentEntry.note.trim().length >= 15) {
      const affirmation = generateAffirmation(currentEntry.note);
      const updatedEntries = [...journalEntries];
      updatedEntries[currentQuestion].generatedAffirmation = affirmation;
      updatedEntries[currentQuestion].completed = true;
      setJournalEntries(updatedEntries);
      setStep(2);
      setScore(prev => prev + 1); // Award score for completing the journal entry
    }
  };

  const handleComplete = () => {
    if (currentQuestion < 4) {
      // Move to next question
      setCurrentQuestion(prev => prev + 1);
      setStep(1);
      // Reset the textarea for the next question
      const updatedEntries = [...journalEntries];
      updatedEntries[currentQuestion + 1].note = "";
      setJournalEntries(updatedEntries);
    } else {
      // All questions completed
      setShowGameOver(true);
    }
  };

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Forgive Yourself Journal"}
        subtitle="Journal Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={currentQuestion + 1}
        allAnswersCorrect={score >= 5}
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
                💜
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Self-Forgiveness Journey Complete</h2>
              <p className="text-lg text-gray-600 mb-6">
                You've completed all {journalEntries.length} forgiveness exercises. Well done!
              </p>
            </div>

            {/* Summary of entries */}
            <div className="space-y-6">
              {journalEntries.map((entry, index) => (
                <div key={index} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                    Entry {index + 1}: "{entry.note.substring(0, 50)}{entry.note.length > 50 ? '...' : ''}"
                  </h3>
                  <div className="bg-white rounded-lg p-4 border border-purple-200 mb-4">
                    <p className="text-gray-800 italic leading-relaxed">
                      "I forgive myself for {entry.note}"
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-green-600" />
                      Your Affirmation
                    </h4>
                    <p className="text-gray-800 leading-relaxed">
                      {entry.generatedAffirmation?.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Parent Tip */}
            <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Children learn forgiveness by watching you forgive yourself. When you model self-compassion after making mistakes, you're teaching your children that mistakes are normal, growth is possible, and self-forgiveness is a practice of self-love. Every time you forgive yourself, you're showing them how to do the same.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Forgive Yourself Journal"}
      subtitle={`${step === 1 ? "Write Your Forgiveness Note" : "Your Affirmation"} (${currentQuestion + 1}/${journalEntries.length})`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentQuestion + 1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {step === 1 && (
            /* Writing Step */
            <>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">💙</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Forgive Yourself</h2>
                <p className="text-gray-600 text-lg">
                  Take a moment to practice self-forgiveness. Write about what you'd like to forgive yourself for today.
                </p>
              </div>

              {/* Writing Prompt */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
                <label className="block text-lg font-bold text-gray-800 mb-4">
                  I forgive myself for…
                </label>
                <textarea
                  value={journalEntries[currentQuestion].note}
                  onChange={(e) => {
                    const updatedEntries = [...journalEntries];
                    updatedEntries[currentQuestion].note = e.target.value;
                    setJournalEntries(updatedEntries);
                  }}
                  placeholder="Write freely about what you'd like to forgive yourself for. This is a safe space for self-compassion. (e.g., 'I forgive myself for losing my temper today, for not being patient, for feeling overwhelmed...')"
                  className="w-full h-48 p-4 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none text-gray-700 text-base leading-relaxed"
                />
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-gray-600">
                    {journalEntries[currentQuestion].note.length} characters
                    {journalEntries[currentQuestion].note.trim().length >= 15 && (
                      <span className="text-green-600 font-semibold ml-2">✓ Ready to continue</span>
                    )}
                  </p>
                  {journalEntries[currentQuestion].note.trim().length > 0 && journalEntries[currentQuestion].note.trim().length < 15 && (
                    <p className="text-xs text-purple-600">
                      Please write at least 15 characters
                    </p>
                  )}
                </div>
              </div>

              {/* Guidance */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>💭 Guidance:</strong> This is your private space for self-compassion. Write about moments of guilt, anger, or judgment toward yourself. You might forgive yourself for reactions, missed moments, self-criticism, or feeling overwhelmed. There's no right or wrong—just honesty and kindness toward yourself.
                </p>
              </div>

              {/* Parent Tip */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>💡 Parent Tip:</strong> Children learn forgiveness by watching you forgive yourself. When you practice self-forgiveness, you're teaching them that mistakes are human and growth is possible.
                </p>
              </div>

              {/* Generate Affirmation Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerateAffirmation}
                disabled={journalEntries[currentQuestion].note.trim().length < 15}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Generate My Affirmation
                <Sparkles className="w-5 h-5" />
              </motion.button>
            </>
          )}

          {step === 2 && journalEntries[currentQuestion].generatedAffirmation && (
            /* Affirmation Step */
            <>
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="text-7xl mb-4"
                >
                  {journalEntries[currentQuestion].generatedAffirmation.emoji}
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Affirmation</h2>
                <p className="text-gray-600 text-lg">
                  Here's a personalized affirmation based on your forgiveness note.
                </p>
              </div>

              {/* Your Forgiveness Note (summary) */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border-2 border-purple-200 mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">Your Note:</p>
                <p className="text-gray-800 italic">
                  "I forgive myself for {journalEntries[currentQuestion].note.length > 100 ? journalEntries[currentQuestion].note.substring(0, 100) + '...' : journalEntries[currentQuestion].note}"
                </p>
              </div>

              {/* Generated Affirmation */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-800">Your Affirmation</h3>
                </div>
                <div className="bg-white rounded-lg p-5 border border-green-200">
                  <p className="text-gray-800 leading-relaxed text-lg font-medium">
                    {journalEntries[currentQuestion].generatedAffirmation?.text}
                  </p>
                </div>
              </div>

              {/* Parent Tip */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>💡 Parent Tip:</strong> Children learn forgiveness by watching you forgive yourself. When you model self-compassion after making mistakes, you're teaching your children that mistakes are normal, growth is possible, and self-forgiveness is a practice of self-love.
                </p>
              </div>

              {/* Complete Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Complete Journal
                <CheckCircle className="w-5 h-5" />
              </motion.button>
            </>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default ForgiveYourselfJournal;

