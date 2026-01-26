import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Shield, Heart, CheckCircle, Download, Share2, Sparkles } from "lucide-react";

const PersonalBoundaryBuilder = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-65";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions ||5;
  
  const [step, setStep] = useState(1); // 1: Building, 2: Card Display
  const [boundaryEntries, setBoundaryEntries] = useState({
    drained: "",
    needSpace: "",
    overwhelmed: "",
    disrespected: "",
    exhausted: ""
  });
  const [generatedCard, setGeneratedCard] = useState(null);
  const [score, setScore] = useState(0);
  const [completedPrompts, setCompletedPrompts] = useState({
    drained: false,
    needSpace: false,
    overwhelmed: false,
    disrespected: false,
    exhausted: false
  });
  const [showGameOver, setShowGameOver] = useState(false);

  // Boundary prompts
  const boundaryPrompts = [
    {
      id: 'drained',
      label: 'I feel drained when...',
      description: 'Identify situations or interactions that emotionally drain your energy.',
      placeholder: 'e.g., "I feel drained when I have to manage everyone\'s schedules and emotions without support"',
      icon: '💧',
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-300'
    },
    {
      id: 'needSpace',
      label: 'I need space when...',
      description: 'Recognize moments when you need physical or emotional distance.',
      placeholder: 'e.g., "I need space when I\'ve just come home from work and need to transition from work mode to home mode"',
      icon: '🌌',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-300'
    },
    {
      id: 'overwhelmed',
      label: 'I feel overwhelmed when...',
      description: 'Acknowledge triggers that push you beyond your capacity.',
      placeholder: 'e.g., "I feel overwhelmed when too many people are asking for my attention at once"',
      icon: '🌊',
      color: 'from-cyan-400 to-teal-500',
      bgColor: 'from-cyan-50 to-teal-50',
      borderColor: 'border-cyan-300'
    },
    {
      id: 'disrespected',
      label: 'I feel disrespected when...',
      description: 'Define behaviors that cross your personal limits.',
      placeholder: 'e.g., "I feel disrespected when my time and commitments are not valued or acknowledged"',
      icon: '🛡️',
      color: 'from-red-400 to-rose-500',
      bgColor: 'from-red-50 to-rose-50',
      borderColor: 'border-red-300'
    },
    {
      id: 'exhausted',
      label: 'I feel exhausted when...',
      description: 'Identify patterns that lead to physical or emotional exhaustion.',
      placeholder: 'e.g., "I feel exhausted when I try to be everything to everyone without taking care of my own needs"',
      icon: '⚡',
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-300'
    }
  ];

  const updatePromptCompletion = () => {
    const newCompletedPrompts = {};
    let completedCount = 0;
    
    boundaryPrompts.forEach(prompt => {
      const isCompleted = boundaryEntries[prompt.id].trim().length >= 10;
      newCompletedPrompts[prompt.id] = isCompleted;
      if (isCompleted) completedCount++;
    });
    
    setCompletedPrompts(newCompletedPrompts);
    setScore(completedCount);
  };

  const handleEntryChange = (entryId, value) => {
    setBoundaryEntries(prev => ({
      ...prev,
      [entryId]: value
    }));
    
    // Update prompt completion immediately
    updatePromptCompletion();
  };

  const allEntriesFilled = Object.values(boundaryEntries).every(entry => entry.trim().length >= 10);

  const generateBoundaryCard = () => {
    // Recalculate completion before generating card
    updatePromptCompletion();
    if (!allEntriesFilled) return;

    // Analyze entries to generate personalized insights
    const allText = Object.values(boundaryEntries).join(' ').toLowerCase();
    let insights = [];
    let themes = [];

    // Detect common themes
    if (allText.includes('time') || allText.includes('schedule') || allText.includes('busy')) {
      themes.push('Time Management');
      insights.push('You value your time and need others to respect your schedule and commitments.');
    }
    if (allText.includes('support') || allText.includes('help') || allText.includes('alone')) {
      themes.push('Support Needs');
      insights.push('You recognize when you need support and are learning to ask for it.');
    }
    if (allText.includes('work') || allText.includes('job') || allText.includes('office')) {
      themes.push('Work-Life Balance');
      insights.push('You\'re aware of the need to separate work and personal life for your wellbeing.');
    }
    if (allText.includes('emotion') || allText.includes('feel') || allText.includes('upset')) {
      themes.push('Emotional Boundaries');
      insights.push('You understand that protecting your emotional energy is essential for your wellbeing.');
    }
    if (allText.includes('family') || allText.includes('children') || allText.includes('child')) {
      themes.push('Family Boundaries');
      insights.push('You\'re learning to balance care for your family with care for yourself.');
    }

    // Default insights if none detected
    if (insights.length === 0) {
      insights.push('You\'re developing awareness of your limits and learning to protect your energy.');
      insights.push('Setting boundaries helps you show up fully for yourself and your family.');
    }

    const cardData = {
      entries: boundaryEntries,
      themes: themes.length > 0 ? themes : ['Personal Boundaries'],
      insights: insights,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };

    setGeneratedCard(cardData);
    // Score is already calculated based on completed prompts
    setStep(2);
  };

  const handleComplete = () => {
    setShowGameOver(true);
    // Score is already calculated based on completed prompts, no need to increment
  };

  if (showGameOver && step === 2) {
    return (
      <ParentGameShell
        title={gameData?.title || "Personal Boundary Builder"}
        subtitle="Boundary Card Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={score}
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
                🛡️
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Boundary Card is Complete!</h2>
              <p className="text-lg text-gray-600 mb-6">
                You've defined emotional limits that preserve your peace. Your boundaries are bridges with guardrails.
              </p>
            </div>

            {/* Boundary Card Display */}
            {generatedCard && (
              <div className="bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100 rounded-2xl p-8 border-4 border-purple-300 shadow-2xl mb-6">
                <div className="bg-white rounded-xl p-6 mb-6">
                  <div className="text-center mb-6">
                    <Shield className="w-16 h-16 text-purple-600 mx-auto mb-3" />
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">My Boundary Card</h3>
                    <p className="text-sm text-gray-600">Created: {generatedCard.date}</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    {boundaryPrompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        className={`bg-gradient-to-br ${prompt.bgColor} rounded-lg p-4 border-2 ${prompt.borderColor}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0">{prompt.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 mb-1">{prompt.label}</h4>
                            <p className="text-gray-700 text-sm">{generatedCard.entries[prompt.id]}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Themes */}
                  {generatedCard.themes.length > 0 && (
                    <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200 mb-4">
                      <h4 className="font-bold text-gray-800 mb-2">Key Themes:</h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedCard.themes.map((theme, index) => (
                          <span
                            key={index}
                            className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Insights */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-green-600" />
                      Insights:
                    </h4>
                    <ul className="space-y-2">
                      {generatedCard.insights.map((insight, index) => (
                        <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Boundaries aren't walls; they're bridges with guardrails. When you define your emotional limits, you're not shutting people out—you're creating clear pathways for healthy relationships. Your boundaries protect your energy so you can show up fully for yourself and your family. They teach your children that self-care isn't selfish, that saying no is sometimes the most loving thing you can do, and that respecting your own limits is essential for respecting others'. Your boundaries are bridges because they keep relationships connected while protecting everyone's wellbeing. The guardrails ensure safety, respect, and sustainability in your relationships.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  // Function to render current step content
  const renderCurrentStep = () => {
    if (step === 1) {
      return (
        <>
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🛡️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Personal Boundary Builder</h2>
            <p className="text-gray-600 text-lg">
              Define emotional limits that preserve your peace. Fill in each prompt to create your personalized boundary card.
            </p>
          </div>

          {/* Boundary Template Prompts */}
          <div className="space-y-6 mb-6">
            {boundaryPrompts.map((prompt, index) => {
              const entry = boundaryEntries[prompt.id];
              const isValid = entry.trim().length >= 10;
              
              return (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-br ${prompt.bgColor} rounded-xl p-6 border-2 ${prompt.borderColor}`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl flex-shrink-0">{prompt.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{prompt.label}</h3>
                      <p className="text-sm text-gray-600 mb-3">{prompt.description}</p>
                    </div>
                    {isValid && (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                  <textarea
                    value={entry}
                    onChange={(e) => handleEntryChange(prompt.id, e.target.value)}
                    placeholder={prompt.placeholder}
                    className={`w-full h-24 p-4 border-2 rounded-lg focus:outline-none focus:ring-2 resize-none text-gray-700 ${
                      isValid
                        ? `${prompt.borderColor} border-opacity-60 focus:ring-opacity-40`
                        : 'border-gray-300 focus:border-purple-500 focus:ring-purple-200'
                    }`}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-600">
                      {entry.length} characters {isValid && <span className="text-green-600 font-semibold">✓</span>}
                    </p>
                    {entry.length > 0 && entry.length < 10 && (
                      <p className="text-xs text-red-600">Please write at least 10 characters</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Guidance */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200 mb-6">
            <p className="text-sm text-gray-700">
              <strong>💭 Guidance:</strong> Be honest and specific. Your boundaries are personal to you—there's no right or wrong answer. Think about what truly drains your energy, when you need space, what makes you feel overwhelmed, disrespected, or exhausted. These boundaries will help you communicate your limits clearly and protect your peace.
            </p>
          </div>

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mb-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Boundaries aren't walls; they're bridges with guardrails. When you define your emotional limits, you're creating pathways for healthy relationships while protecting your energy.
            </p>
          </div>

          {/* Generate Card Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateBoundaryCard}
            disabled={!allEntriesFilled}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Shield className="w-5 h-5" />
            Generate My Boundary Card
          </motion.button>
        </>
      );
    } else if (step === 2 && generatedCard) {
      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Boundary Card</h2>
            <p className="text-gray-600">
              Your personalized boundary card is ready. Use it as a reference to communicate your limits clearly.
            </p>
          </div>

          {/* Boundary Card */}
          <div className="bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100 rounded-2xl p-8 border-4 border-purple-300 shadow-2xl">
            <div className="bg-white rounded-xl p-6">
              <div className="text-center mb-6">
                <Shield className="w-16 h-16 text-purple-600 mx-auto mb-3" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2">My Boundary Card</h3>
                <p className="text-sm text-gray-600">Created: {generatedCard.date}</p>
              </div>

              <div className="space-y-4 mb-6">
                {boundaryPrompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    className={`bg-gradient-to-br ${prompt.bgColor} rounded-lg p-4 border-2 ${prompt.borderColor}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">{prompt.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 mb-1 text-sm">{prompt.label}</h4>
                        <p className="text-gray-700">{generatedCard.entries[prompt.id]}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Themes */}
              {generatedCard.themes.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200 mb-4">
                  <h4 className="font-bold text-gray-800 mb-2">Key Themes:</h4>
                  <div className="flex flex-wrap gap-2">
                    {generatedCard.themes.map((theme, index) => (
                      <span
                        key={index}
                        className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Insights */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  Insights:
                </h4>
                <ul className="space-y-2">
                  {generatedCard.insights.map((insight, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                // Download as text (simplified - could be enhanced with image generation)
                const cardText = 
                  'MY BOUNDARY CARD\n' +
                  'Created: ' + generatedCard.date + '\n\n' +
                  boundaryPrompts.map(p => p.label + '\n' + generatedCard.entries[p.id] + '\n').join('\n') + '\n\n' +
                  'Key Themes: ' + generatedCard.themes.join(', ') + '\n\n' +
                  'Insights:\n' +
                  generatedCard.insights.map(i => '• ' + i).join('\n');
                
                const blob = new Blob([cardText], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'my-boundary-card.txt';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Save Card
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleComplete}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Complete
            </motion.button>
          </div>

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Boundaries aren't walls; they're bridges with guardrails. Use your boundary card as a reference to communicate your limits clearly and protect your peace.
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ParentGameShell
      title={gameData?.title || "Personal Boundary Builder"}
      subtitle={step === 1 ? "Define Your Boundaries" : "Your Boundary Card"}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={score}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {renderCurrentStep()}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default PersonalBoundaryBuilder;