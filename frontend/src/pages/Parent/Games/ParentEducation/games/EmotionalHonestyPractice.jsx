import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Heart, CheckCircle, Download, MessageSquare, Sparkles, ArrowRight } from "lucide-react";

const EmotionalHonestyPractice = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-66";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [step, setStep] = useState(1); // 1: Building, 2: Review
  const [statements, setStatements] = useState([
    { id: 1, feeling: "", when: "", because: "" },
    { id: 2, feeling: "", when: "", because: "" },
    { id: 3, feeling: "", when: "", because: "" },
    { id: 4, feeling: "", when: "", because: "" },
    { id: 5, feeling: "", when: "", because: "" }
  ]);
  const [savedStatements, setSavedStatements] = useState(null);
  const [score, setScore] = useState(0);
  const [completedStatements, setCompletedStatements] = useState(new Set());
  const [showGameOver, setShowGameOver] = useState(false);

  // Common feeling words for guidance
  const feelingExamples = [
    "frustrated", "overwhelmed", "proud", "worried", "grateful",
    "disappointed", "excited", "tired", "calm", "anxious",
    "happy", "sad", "angry", "peaceful", "confused",
    "hopeful", "hurt", "relieved", "nervous", "content"
  ];

  const updateStatement = (statementId, field, value) => {
    setStatements(prev =>
      prev.map(stmt =>
        stmt.id === statementId
          ? { ...stmt, [field]: value }
          : stmt
      )
    );
    
    // Check if this statement is now complete and update score
    setTimeout(() => {
      const updatedStatements = statements.map(stmt =>
        stmt.id === statementId
          ? { ...stmt, [field]: value }
          : stmt
      );
      const statement = updatedStatements.find(s => s.id === statementId);
      const wasComplete = completedStatements.has(statementId);
      const isComplete = isStatementComplete(statement);
      
      if (isComplete && !wasComplete) {
        // Statement newly completed
        setCompletedStatements(prev => new Set([...prev, statementId]));
        setScore(prev => prev + 1);
      } else if (!isComplete && wasComplete) {
        // Statement no longer complete
        setCompletedStatements(prev => {
          const newSet = new Set(prev);
          newSet.delete(statementId);
          return newSet;
        });
        setScore(prev => Math.max(0, prev - 1));
      }
    }, 0);
  };

  const isStatementComplete = (statement) => {
    return statement.feeling.trim().length >= 3 &&
           statement.when.trim().length >= 5 &&
           statement.because.trim().length >= 5;
  };

  const allStatementsComplete = statements.every(isStatementComplete);

  const handleSave = () => {
    if (!allStatementsComplete) return;
    
    // Format statements for display
    const formatted = statements.map(stmt => ({
      id: stmt.id,
      fullStatement: `I feel ${stmt.feeling} when ${stmt.when} because ${stmt.because}.`,
      feeling: stmt.feeling,
      when: stmt.when,
      because: stmt.because
    }));

    setSavedStatements(formatted);
    setStep(2);
  };

  const handleComplete = () => {
    setShowGameOver(true);
  };

  const getStatementFeedback = (statement) => {
    const feeling = statement.feeling.toLowerCase();
    const text = `${statement.feeling} ${statement.when} ${statement.because}`.toLowerCase();
    
    let feedback = [];
    
    // Check for blaming language
    if (text.includes('you always') || text.includes('you never') || text.includes('you should')) {
      feedback.push("Try to focus on your feelings rather than what others did wrong.");
    }
    
    // Check for emotional honesty
    if (feeling && !text.includes('blame') && !text.includes('fault')) {
      feedback.push("Good job expressing your feelings directly!");
    }
    
    // Check for clarity
    if (statement.because.length > 20) {
      feedback.push("Your explanation is clear and specific.");
    }
    
    // Positive reinforcement
    if (feedback.length === 0) {
      feedback.push("Your statement is honest and clear—well done!");
    }
    
    return feedback;
  };

  if (showGameOver && step === 2) {
    return (
      <ParentGameShell
        title={gameData?.title || "Emotional Honesty Practice"}
        subtitle="Practice Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={1}
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
                💬
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Emotional Statements Are Saved!</h2>
              <p className="text-lg text-gray-600 mb-6">
                You've practiced expressing feelings clearly without blame or criticism. Your children will learn from your kind and clear emotional language.
              </p>
            </div>

            {/* Saved Statements Display */}
            {savedStatements && (
              <div className="space-y-6 mb-8">
                {savedStatements.map((stmt, index) => (
                  <motion.div
                    key={stmt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {stmt.id}
                      </div>
                      <div className="flex-1">
                        <p className="text-lg text-gray-800 font-medium leading-relaxed mb-2">
                          {stmt.fullStatement}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                            Feeling: {stmt.feeling}
                          </span>
                        </div>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-800">Practice Insights</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>You've learned to express feelings using "I feel" statements, which helps avoid blame.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>By identifying the "when" and "because," you're creating clear communication patterns.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Your emotional honesty teaches children to express their feelings safely and clearly.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Children copy your emotional language—make it kind and clear. When you express feelings honestly using "I feel" statements, you're teaching your children to do the same. This emotional vocabulary helps them communicate their needs and feelings without blame or aggression. Practice these statements regularly, and watch how your children begin to mirror this respectful, honest communication style. Your kind and clear emotional language becomes their foundation for healthy emotional expression.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Emotional Honesty Practice"}
      subtitle={step === 1 ? "Build Your Statements" : "Review Your Statements"}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {step === 1 && (
            /* Building Phase */
            <>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">💬</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Emotional Honesty Practice</h2>
                <p className="text-gray-600 text-lg mb-2">
                  Express your feelings clearly without blame or criticism. Complete 5 statements using the format:
                </p>
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4 inline-block mt-3">
                  <p className="text-lg font-semibold text-gray-800">
                    "I feel <span className="text-blue-600">___</span> when <span className="text-indigo-600">___</span> because <span className="text-purple-600">___</span>"
                  </p>
                </div>
              </div>

              {/* Statement Builder */}
              <div className="space-y-8 mb-6">
                {statements.map((statement, index) => {
                  const isComplete = isStatementComplete(statement);
                  const feedback = getStatementFeedback(statement);
                  
                  return (
                    <motion.div
                      key={statement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-gradient-to-br ${
                        isComplete
                          ? 'from-green-50 to-emerald-50 border-green-300'
                          : 'from-blue-50 to-indigo-50 border-blue-300'
                      } rounded-xl p-6 border-2`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`${
                          isComplete
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                        } text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg`}>
                          {statement.id}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Statement {statement.id}</h3>
                        {isComplete && (
                          <CheckCircle className="w-6 h-6 text-green-600 ml-auto" />
                        )}
                      </div>

                      {/* Phrase Template */}
                      <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                        <p className="text-gray-700 text-lg font-medium mb-4">
                          I feel{" "}
                          <span className="relative inline-block">
                            <input
                              type="text"
                              value={statement.feeling}
                              onChange={(e) => updateStatement(statement.id, 'feeling', e.target.value)}
                              placeholder="emotion (e.g., frustrated, proud, worried)"
                              className="inline-block w-48 px-3 py-1 border-b-2 border-blue-400 focus:border-blue-600 focus:outline-none text-blue-600 font-semibold"
                            />
                            {statement.feeling && (
                              <span className="absolute -bottom-6 left-0 text-xs text-gray-500">
                                {statement.feeling.length < 3 && "At least 3 characters"}
                              </span>
                            )}
                          </span>
                          {" "}when{" "}
                          <span className="relative inline-block">
                            <input
                              type="text"
                              value={statement.when}
                              onChange={(e) => updateStatement(statement.id, 'when', e.target.value)}
                              placeholder="situation (e.g., I'm interrupted during work)"
                              className="inline-block w-64 px-3 py-1 border-b-2 border-indigo-400 focus:border-indigo-600 focus:outline-none text-indigo-600 font-semibold"
                            />
                            {statement.when && (
                              <span className="absolute -bottom-6 left-0 text-xs text-gray-500">
                                {statement.when.length < 5 && "At least 5 characters"}
                              </span>
                            )}
                          </span>
                          {" "}because{" "}
                          <span className="relative inline-block">
                            <input
                              type="text"
                              value={statement.because}
                              onChange={(e) => updateStatement(statement.id, 'because', e.target.value)}
                              placeholder="reason (e.g., it disrupts my focus)"
                              className="inline-block w-64 px-3 py-1 border-b-2 border-purple-400 focus:border-purple-600 focus:outline-none text-purple-600 font-semibold"
                            />
                            {statement.because && (
                              <span className="absolute -bottom-6 left-0 text-xs text-gray-500">
                                {statement.because.length < 5 && "At least 5 characters"}
                              </span>
                            )}
                          </span>
                          .
                        </p>
                      </div>

                      {/* Feeling Examples */}
                      {!statement.feeling && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Feeling word examples:</p>
                          <div className="flex flex-wrap gap-2">
                            {feelingExamples.slice(0, 8).map((feeling, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => updateStatement(statement.id, 'feeling', feeling)}
                                className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 text-sm rounded-full transition-colors"
                              >
                                {feeling}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Preview */}
                      {isComplete && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-lg p-4 border-2 border-green-300 mt-4"
                        >
                          <p className="text-gray-700 text-base mb-2 font-semibold">Your complete statement:</p>
                          <p className="text-gray-800 italic leading-relaxed">
                            "I feel {statement.feeling} when {statement.when} because {statement.because}."
                          </p>
                        </motion.div>
                      )}

                      {/* Feedback */}
                      {feedback.length > 0 && (
                        <div className="mt-4 bg-white rounded-lg p-3 border border-blue-200">
                          <p className="text-xs text-gray-600">
                            {feedback[0]}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Guidance */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>💭 Guidance:</strong> Focus on your feelings, not what others did wrong. Instead of "I feel angry when you leave dishes out" (which blames), try "I feel frustrated when dishes are left out because it adds to my workload." Use "I feel" statements to own your emotions and communicate clearly.
                </p>
              </div>

              {/* Parent Tip */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>💡 Parent Tip:</strong> Children copy your emotional language—make it kind and clear. When you express feelings honestly using "I feel" statements, you're teaching your children to communicate their needs respectfully.
                </p>
              </div>

              {/* Save Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={!allStatementsComplete}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Save Statements for Review
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </>
          )}

          {step === 2 && savedStatements && (
            /* Review Phase */
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Review Your Statements</h2>
                <p className="text-gray-600">
                  Here are your 5 emotional honesty statements. Review them and use this format in your daily communication.
                </p>
              </div>

              {/* Statements Display */}
              <div className="space-y-6 mb-6">
                {savedStatements.map((stmt, index) => (
                  <motion.div
                    key={stmt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {stmt.id}
                      </div>
                      <div className="flex-1">
                        <p className="text-lg text-gray-800 font-medium leading-relaxed mb-3">
                          {stmt.fullStatement}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                          <div className="bg-blue-100 rounded-lg p-2">
                            <p className="text-xs text-blue-800 font-semibold mb-1">Feeling</p>
                            <p className="text-sm text-blue-900">{stmt.feeling}</p>
                          </div>
                          <div className="bg-indigo-100 rounded-lg p-2">
                            <p className="text-xs text-indigo-800 font-semibold mb-1">When</p>
                            <p className="text-sm text-indigo-900">{stmt.when}</p>
                          </div>
                          <div className="bg-purple-100 rounded-lg p-2">
                            <p className="text-xs text-purple-800 font-semibold mb-1">Because</p>
                            <p className="text-sm text-purple-900">{stmt.because}</p>
                          </div>
                        </div>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Download Option */}
              <div className="flex gap-4 mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const statementsText = `MY EMOTIONAL HONESTY STATEMENTS\n\n${savedStatements.map((s, i) => `${i + 1}. ${s.fullStatement}`).join('\n\n')}\n\nCreated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}\n\nPractice these statements regularly to improve your emotional communication.`;
                    const blob = new Blob([statementsText], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'my-emotional-statements.txt';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Save Statements
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleComplete}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Complete Practice
                </motion.button>
              </div>

              {/* Parent Tip */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
                <p className="text-sm text-gray-700">
                  <strong>💡 Parent Tip:</strong> Children copy your emotional language—make it kind and clear. Use these statements as examples for expressing feelings in your daily interactions.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default EmotionalHonestyPractice;

