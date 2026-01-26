import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Heart, CheckCircle, Download, Sparkles, Moon } from "lucide-react";

const MyParentingMantra = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-85";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [step, setStep] = useState(1); // 1: Building, 2: Review, 3: Saved
  const [mantraParts, setMantraParts] = useState({
    chooseTo: "",
    evenWhen: "",
    because: "",
    intention: "",
    reminder: ""
  });
  const [savedMantra, setSavedMantra] = useState(null);
  const [showGameOver, setShowGameOver] = useState(false);

  // Example suggestions for each part
  const examples = {
    chooseTo: [
      "respond with patience",
      "choose connection over control",
      "show love and understanding",
      "take a deep breath",
      "stay present",
      "model calm behavior",
      "prioritize relationship"
    ],
    evenWhen: [
      "I'm tired",
      "they're challenging",
      "I feel overwhelmed",
      "things don't go as planned",
      "I'm frustrated",
      "it's difficult",
      "I want to react impulsively"
    ],
    because: [
      "love guides better than anger",
      "connection matters more than being right",
      "patience teaches patience",
      "my calm creates their calm",
      "I'm building their emotional foundation",
      "they're learning from how I respond",
      "love is my greatest parenting tool"
    ],
    intention: [
      "be mindful of my reactions",
      "focus on long-term goals",
      "practice self-compassion",
      "remember my values",
      "embrace growth mindset",
      "create positive patterns",
      "maintain perspective"
    ],
    reminder: [
      "my child is learning",
      "this phase will pass",
      "connection builds trust",
      "I am growing too",
      "we are in this together",
      "progress takes time",
      "love is my priority"
    ]
  };

  const handlePartChange = (field, value) => {
    setMantraParts(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExampleClick = (field, example) => {
    setMantraParts(prev => ({
      ...prev,
      [field]: example
    }));
  };

  const isMantraComplete = () => {
    return mantraParts.chooseTo.trim().length >= 3 &&
           mantraParts.evenWhen.trim().length >= 3 &&
           mantraParts.because.trim().length >= 3 &&
           mantraParts.intention.trim().length >= 3 &&
           mantraParts.reminder.trim().length >= 3;
  };

  const buildMantra = () => {
    return `I choose to ${mantraParts.chooseTo.trim()}, with the intention to ${mantraParts.intention.trim()} even when ${mantraParts.evenWhen.trim()} because ${mantraParts.because.trim()}. My reminder: ${mantraParts.reminder.trim()}.`;
  };

  const handleSave = () => {
    if (!isMantraComplete()) return;
    
    const fullMantra = buildMantra();
    setSavedMantra({
      fullMantra,
      parts: { ...mantraParts },
      createdAt: new Date().toLocaleDateString()
    });
    setStep(2);
  };

  const handleSetAsDailyAffirmation = () => {
    // Save to localStorage for daily use
    if (savedMantra) {
      localStorage.setItem('parentingMantra', JSON.stringify(savedMantra));
      setStep(3);
      setShowGameOver(true);
    }
  };

  const handleDownload = () => {
    if (!savedMantra) return;

    const content = `My Parenting Mantra\n\n` +
      `Created: ${savedMantra.createdAt}\n\n` +
      `"${savedMantra.fullMantra}"\n\n` +
      `Breakdown:\n` +
      `• I choose to: ${savedMantra.parts.chooseTo}\n` +
      `• With intention to: ${savedMantra.parts.intention}\n` +
      `• Even when: ${savedMantra.parts.evenWhen}\n` +
      `• Because: ${savedMantra.parts.because}\n` +
      `• My reminder: ${savedMantra.parts.reminder}\n\n` +
      `Parent Tip: Speak your mantra before sleep—it resets your parental energy.\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parenting-mantra-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (showGameOver && step === 3) {
    return (
      <ParentGameShell
        title={gameData?.title || "My Parenting Mantra"}
        subtitle="Mantra Saved!"
        showGameOver={true}
        score={5}
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
                ✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Daily Affirmation is Set!</h2>
              <p className="text-lg text-gray-600 mb-6">
                Your parenting mantra has been saved and set as your daily affirmation.
              </p>
            </div>

            {/* Mantra Display */}
            {savedMantra && (
              <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-xl p-8 border-2 border-purple-200 mb-6">
                <div className="text-center">
                  <Moon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-gray-800 italic mb-4 leading-relaxed">
                    "{savedMantra.fullMantra}"
                  </p>
                  <p className="text-sm text-gray-600">Created: {savedMantra.createdAt}</p>
                </div>
              </div>
            )}

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-green-600" />
                Using Your Mantra Daily
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Before Sleep:</strong> Speak your mantra before sleep—it resets your parental energy. Reciting it helps calm your mind and sets a positive intention for the next day.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>In Challenging Moments:</strong> When you feel triggered or overwhelmed, pause and repeat your mantra. It brings you back to your purpose and values.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Morning Reminder:</strong> Start your day by reading or speaking your mantra. It sets the tone for intentional, purposeful parenting.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Regular Updates:</strong> As you grow and change, revisit your mantra. Adjust it to reflect your evolving parenting journey.</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownload}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Mantra
              </motion.button>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Speak your mantra before sleep—it resets your parental energy. When you end your day by speaking your personal parenting affirmation, you're doing more than just reciting words—you're programming your mind for tomorrow. This practice helps you release the day's challenges and refocus on your deeper purpose. Keep your mantra visible—write it on a sticky note, save it as your phone's lock screen, or place it on your nightstand. Your mantra is your anchor, your reminder of why you parent and how you choose to show up, even on the hardest days.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  // Step 2: Review
  if (step === 2 && savedMantra) {
    return (
      <ParentGameShell
        title={gameData?.title || "My Parenting Mantra"}
        subtitle="Review Your Mantra"
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={1}
      >
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">💫</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Parenting Mantra</h2>
              <p className="text-gray-600">Review and save your personal affirmation.</p>
            </div>

            {/* Mantra Preview */}
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-xl p-8 border-2 border-purple-200 mb-6">
              <p className="text-2xl font-bold text-gray-800 italic text-center leading-relaxed">
                "{savedMantra.fullMantra}"
              </p>
            </div>

            {/* Breakdown */}
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm font-semibold text-gray-700 mb-1">I choose to:</p>
                <p className="text-gray-800">{savedMantra.parts.chooseTo}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm font-semibold text-gray-700 mb-1">With intention to:</p>
                <p className="text-gray-800">{savedMantra.parts.intention}</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <p className="text-sm font-semibold text-gray-700 mb-1">Even when:</p>
                <p className="text-gray-800">{savedMantra.parts.evenWhen}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="text-sm font-semibold text-gray-700 mb-1">Because:</p>
                <p className="text-gray-800">{savedMantra.parts.because}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-sm font-semibold text-gray-700 mb-1">My reminder:</p>
                <p className="text-gray-800">{savedMantra.parts.reminder}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                Edit Mantra
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSetAsDailyAffirmation}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Moon className="w-5 h-5" />
                Set as Daily Affirmation
              </motion.button>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
              <p className="text-sm text-gray-700">
                <strong>💡 Parent Tip:</strong> Speak your mantra before sleep—it resets your parental energy.
              </p>
            </div>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  // Step 1: Building
  return (
    <ParentGameShell
      title={gameData?.title || "My Parenting Mantra"}
      subtitle="Build Your Daily Affirmation"
      showGameOver={false}
      score={0}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💫</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">My Parenting Mantra</h2>
            <p className="text-gray-600 text-lg mb-2">
              Create a simple daily affirmation for your parenting purpose.
            </p>
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-4 inline-block mt-3">
              <p className="text-lg font-semibold text-gray-800">
                "I choose to <span className="text-blue-600">___</span>, with the intention to <span className="text-green-600">___</span> even when <span className="text-indigo-600">___</span> because <span className="text-purple-600">___</span>. My reminder: <span className="text-yellow-600">___</span>"
              </p>
            </div>
          </div>

          {/* Mantra Builder */}
          <div className="space-y-6 mb-6">
            {/* Part 1: I choose to */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                I choose to...
              </h3>
              <textarea
                value={mantraParts.chooseTo}
                onChange={(e) => handlePartChange('chooseTo', e.target.value)}
                placeholder="What positive action do you choose? (e.g., respond with patience, choose connection over control)"
                className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-gray-800 min-h-[80px] resize-none mb-3"
              />
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-600 font-semibold">Examples:</span>
                {examples.chooseTo.slice(0, 3).map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleClick('chooseTo', example)}
                    className="text-xs bg-white px-3 py-1 rounded-full border border-blue-300 hover:bg-blue-100 transition-colors text-gray-700"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Part 2: with intention to */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border-2 border-green-200">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                With intention to...
              </h3>
              <textarea
                value={mantraParts.intention}
                onChange={(e) => handlePartChange('intention', e.target.value)}
                placeholder="What is your underlying intention? (e.g., be mindful of my reactions, focus on long-term goals)"
                className="w-full px-4 py-3 rounded-lg border-2 border-green-300 focus:border-green-500 focus:outline-none text-gray-800 min-h-[80px] resize-none mb-3"
              />
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-600 font-semibold">Examples:</span>
                {examples.intention.slice(0, 3).map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleClick('intention', example)}
                    className="text-xs bg-white px-3 py-1 rounded-full border border-green-300 hover:bg-green-100 transition-colors text-gray-700"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Part 3: even when */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Even when...
              </h3>
              <textarea
                value={mantraParts.evenWhen}
                onChange={(e) => handlePartChange('evenWhen', e.target.value)}
                placeholder="What challenging situation do you face? (e.g., I'm tired, they're challenging, I feel overwhelmed)"
                className="w-full px-4 py-3 rounded-lg border-2 border-indigo-300 focus:border-indigo-500 focus:outline-none text-gray-800 min-h-[80px] resize-none mb-3"
              />
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-600 font-semibold">Examples:</span>
                {examples.evenWhen.slice(0, 3).map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleClick('evenWhen', example)}
                    className="text-xs bg-white px-3 py-1 rounded-full border border-indigo-300 hover:bg-indigo-100 transition-colors text-gray-700"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Part 4: because */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Because...
              </h3>
              <textarea
                value={mantraParts.because}
                onChange={(e) => handlePartChange('because', e.target.value)}
                placeholder="What's your deeper reason? (e.g., love guides better than anger, connection matters more than being right)"
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-gray-800 min-h-[80px] resize-none mb-3"
              />
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-600 font-semibold">Examples:</span>
                {examples.because.slice(0, 3).map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleClick('because', example)}
                    className="text-xs bg-white px-3 py-1 rounded-full border border-purple-300 hover:bg-purple-100 transition-colors text-gray-700"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Part 5: my reminder */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                My reminder...
              </h3>
              <textarea
                value={mantraParts.reminder}
                onChange={(e) => handlePartChange('reminder', e.target.value)}
                placeholder="What reminds you of your purpose? (e.g., my child is learning, this phase will pass)"
                className="w-full px-4 py-3 rounded-lg border-2 border-yellow-300 focus:border-yellow-500 focus:outline-none text-gray-800 min-h-[80px] resize-none mb-3"
              />
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-600 font-semibold">Examples:</span>
                {examples.reminder.slice(0, 3).map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleClick('reminder', example)}
                    className="text-xs bg-white px-3 py-1 rounded-full border border-yellow-300 hover:bg-yellow-100 transition-colors text-gray-700"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          {isMantraComplete() && (
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Your Mantra Preview:</p>
              <p className="text-lg font-bold text-gray-800 italic">
                "{buildMantra()}"
              </p>
            </div>
          )}

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={!isMantraComplete()}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Save Mantra
          </motion.button>

          {!isMantraComplete() && (
            <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
              <p className="text-yellow-800 text-sm text-center">
                Please complete all five parts to create your mantra (minimum 3 characters each).
              </p>
            </div>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Speak your mantra before sleep—it resets your parental energy. A simple daily affirmation helps you reconnect with your parenting purpose.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default MyParentingMantra;

