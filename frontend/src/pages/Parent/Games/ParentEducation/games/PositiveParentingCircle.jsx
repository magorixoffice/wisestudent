import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Users, MessageCircle, Heart, CheckCircle, Sparkles, Download, BookOpen, Globe } from "lucide-react";

const PositiveParentingCircle = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-78";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [step, setStep] = useState(1); // 1: Choose mode, 2: Discussion, 3: Log takeaway
  const [circleMode, setCircleMode] = useState(null); // 'join' or 'form'
  const [circleName, setCircleName] = useState("");
  const [selectedPrompts, setSelectedPrompts] = useState([]); // Changed from selectedPrompt to selectedPrompts array
  const [takeaway, setTakeaway] = useState("");
  const [circleSessions, setCircleSessions] = useState([]);
  const [showGameOver, setShowGameOver] = useState(false);

  // Discussion prompts for parent peer groups
  const discussionPrompts = [
    {
      id: 1,
      question: "What's a parenting challenge you're currently facing?",
      category: "Challenges",
      emoji: "🌊",
      color: "from-blue-400 to-indigo-500",
      bgColor: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-300",
      guidance: "Share openly and listen without judgment. Remember: challenges are opportunities for growth."
    },
    {
      id: 2,
      question: "What's something you're proud of as a parent this week?",
      category: "Celebrations",
      emoji: "🌟",
      color: "from-yellow-400 to-amber-500",
      bgColor: "from-yellow-50 to-amber-50",
      borderColor: "border-yellow-300",
      guidance: "Celebrate wins together. Acknowledging successes builds confidence and connection."
    },
    {
      id: 3,
      question: "What self-care practice helps you show up as a better parent?",
      category: "Self-Care",
      emoji: "💆",
      color: "from-pink-400 to-rose-500",
      bgColor: "from-pink-50 to-rose-50",
      borderColor: "border-pink-300",
      guidance: "Share what works for you. Self-care isn't selfish—it's essential for parenting well."
    },
    {
      id: 4,
      question: "How do you handle moments when you feel overwhelmed?",
      category: "Coping",
      emoji: "🌪️",
      color: "from-purple-400 to-violet-500",
      bgColor: "from-purple-50 to-violet-50",
      borderColor: "border-purple-300",
      guidance: "Discuss strategies that work. Sharing coping strategies helps everyone learn."
    },
    {
      id: 5,
      question: "What's a boundary you've set that has improved your family life?",
      category: "Boundaries",
      emoji: "🛡️",
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      borderColor: "border-green-300",
      guidance: "Boundaries create safety. Sharing experiences helps others learn to set healthy limits."
    },
    {
      id: 6,
      question: "How do you maintain connection with your child(ren) during busy times?",
      category: "Connection",
      emoji: "💚",
      color: "from-emerald-400 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50",
      borderColor: "border-emerald-300",
      guidance: "Connection matters more than perfection. Share small moments that create big impact."
    },
    {
      id: 7,
      question: "What's a mistake you made and what did you learn from it?",
      category: "Growth",
      emoji: "🌱",
      color: "from-cyan-400 to-blue-500",
      bgColor: "from-cyan-50 to-blue-50",
      borderColor: "border-cyan-300",
      guidance: "Mistakes are teachers. Sharing them removes shame and creates learning opportunities."
    },
    {
      id: 8,
      question: "How do you repair after a conflict with your child?",
      category: "Repair",
      emoji: "🔄",
      color: "from-orange-400 to-red-500",
      bgColor: "from-orange-50 to-red-50",
      borderColor: "border-orange-300",
      guidance: "Repair strengthens relationships. Discussing repair strategies builds emotional skills."
    }
  ];

  const handleJoinCircle = () => {
    setCircleMode('join');
    setStep(2);
  };

  const handleFormCircle = () => {
    setCircleMode('form');
    setStep(2);
  };

  const handleSelectPrompt = (promptId) => {
    // Limit to 5 prompts
    if (selectedPrompts.length >= 5) {
      alert('You can only select up to 5 prompts');
      return;
    }
    
    // Add the prompt to the selected array if not already selected
    if (!selectedPrompts.includes(promptId)) {
      setSelectedPrompts([...selectedPrompts, promptId]);
    }
    
    // Move to step 3 only if we've reached the limit of 5 prompts
    if (selectedPrompts.length + 1 >= 5) {
      setStep(3);
    }
  };

  const handleLogTakeaway = () => {
    if (!takeaway.trim() || selectedPrompts.length === 0) return;

    // Create a session for each selected prompt
    const newSessions = selectedPrompts.map(promptId => {
      const prompt = discussionPrompts.find(p => p.id === promptId);
      return {
        id: Date.now().toString() + "-" + promptId,
        date: new Date().toLocaleDateString(),
        prompt: prompt?.question || '',
        category: prompt?.category || '',
        takeaway: takeaway.trim(),
        mode: circleMode
      };
    });

    setCircleSessions(prev => [...prev, ...newSessions]);
    setTakeaway("");
    setSelectedPrompts([]); // Reset the selected prompts
    setStep(2);
  };

  const handleComplete = () => {
    if (circleSessions.length > 0 || selectedPrompts.length > 0) {
      setShowGameOver(true);
    }
  };

  const handleDownloadSessions = () => {
    const content = `Positive Parenting Circle Sessions\n\n` +
      circleSessions.map((session, index) => 
        `Session ${index + 1} - ${session.date}\n` +
        `Mode: ${session.mode === 'join' ? 'Joined Existing Group' : 'Formed New Group'}\n` +
        `Discussion Prompt: ${session.prompt}\n` +
        `Category: ${session.category}\n\n` +
        `Key Takeaway:\n${session.takeaway}\n\n` +
        `---\n\n`
      ).join('');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parenting-circle-sessions-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Positive Parenting Circle"}
        subtitle="Circle Sessions Complete!"
        showGameOver={true}
        score={circleSessions.length}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={circleSessions.length >= 1}
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
                💫
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Parenting Circle Journey</h2>
              <p className="text-lg text-gray-600 mb-6">
                You've logged {circleSessions.length} circle session{circleSessions.length === 1 ? '' : 's'}!
              </p>
            </div>

            {/* Sessions Summary */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                Your Circle Sessions
              </h3>
              <div className="space-y-4">
                {circleSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">
                          Session {index + 1} • {session.date}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                          {session.mode === 'join' ? 'Joined Existing Group' : 'Formed New Group'}
                        </p>
                        <p className="font-bold text-gray-800 mb-2">{session.prompt}</p>
                        <p className="text-xs text-gray-600 mb-3">Category: {session.category}</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Key Takeaway:</p>
                      <p className="text-gray-800 leading-relaxed italic">"{session.takeaway}"</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-green-600" />
                Benefits of Parenting Circles
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Shared Learning:</strong> Parenting circles create space for sharing experiences, strategies, and insights that benefit everyone.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Reduced Isolation:</strong> Connecting with other parents helps you realize you're not alone in your challenges and successes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Growth Over Guilt:</strong> Circles of sharing replace guilt with growth, creating a supportive environment for learning.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Emotional Support:</strong> Parent peer groups provide emotional validation and understanding that strengthens resilience.</span>
                </li>
              </ul>
            </div>

            {/* Download Button */}
            {circleSessions.length > 0 && (
              <div className="mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownloadSessions}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Sessions
                </motion.button>
              </div>
            )}

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Circles of sharing replace guilt with growth—build one locally or online. Whether you join an existing parent group or start your own, these circles create invaluable spaces for support, learning, and connection. Your children benefit when you have a strong support network of other parents who understand your journey. Consider starting a local parenting circle, joining an online community, or participating in parent support groups—you'll find that shared experiences create shared strength.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  // Step 1: Choose Mode
  if (step === 1) {
    return (
      <ParentGameShell
        title={gameData?.title || "Positive Parenting Circle"}
        subtitle="Join or Form a Parenting Circle"
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={1}
      >
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">💫</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Positive Parenting Circle</h2>
              <p className="text-gray-600 text-lg">
                Join or form a parent peer group for emotional sharing and support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Join Existing Circle */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleJoinCircle}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-200 hover:border-blue-400 transition-all text-left"
              >
                <Users className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Join Existing Circle</h3>
                <p className="text-gray-600 mb-4">
                  Connect with an existing parent peer group in your area or online.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li>• Find local parent groups</li>
                  <li>• Join online communities</li>
                  <li>• Participate in existing discussions</li>
                </ul>
              </motion.button>

              {/* Form New Circle */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFormCircle}
                className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-8 border-2 border-purple-200 hover:border-purple-400 transition-all text-left"
              >
                <Globe className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Form New Circle</h3>
                <p className="text-gray-600 mb-4">
                  Start your own parenting circle with friends, neighbors, or community members.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li>• Invite parent friends</li>
                  <li>• Set up regular meetings</li>
                  <li>• Create a safe space for sharing</li>
                </ul>
              </motion.button>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <h3 className="font-bold text-gray-800 mb-3">Why Parenting Circles Matter</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Create spaces for honest, judgment-free sharing</li>
                <li>• Learn from other parents' experiences and strategies</li>
                <li>• Reduce isolation and build community connection</li>
                <li>• Replace guilt with growth through shared learning</li>
                <li>• Build emotional support and resilience</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  // Step 2: Select Discussion Prompt
  if (step === 2) {
    return (
      <ParentGameShell
        title={gameData?.title || "Positive Parenting Circle"}
        subtitle="Choose a Discussion Prompt"
        showGameOver={false}
        score={circleSessions.length}
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
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Discussion Prompts</h2>
              <p className="text-gray-600">
                Select a prompt to discuss with your parenting circle. After your discussion, log your key takeaway.
              </p>
            </div>

            {/* Circle Info */}
            {circleMode === 'form' && (
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border-2 border-purple-200 mb-6">
                <p className="text-sm text-gray-700 text-center">
                  <strong>Forming a Circle:</strong> Invite 3-6 parent friends to meet regularly (weekly or bi-weekly). 
                  Create a safe space with ground rules: confidentiality, no judgment, equal sharing time, and respect for different parenting styles.
                </p>
              </div>
            )}

            {/* Prompt Cards */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Discussion Prompts</h3>
                <span className="text-sm font-semibold text-blue-600">{selectedPrompts.length}/5 selected</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {discussionPrompts.map((prompt) => {
                  const isSelected = selectedPrompts.includes(prompt.id);
                  const isDisabled = selectedPrompts.length >= 5 && !isSelected;
                  
                  return (
                    <motion.button
                      key={prompt.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => !isDisabled && handleSelectPrompt(prompt.id)}
                      disabled={isDisabled}
                      className={`bg-gradient-to-br ${prompt.bgColor} rounded-xl p-6 border-2 ${isSelected ? 'border-green-500 ring-2 ring-green-300' : `${prompt.borderColor} ${!isDisabled ? 'hover:border-4' : 'opacity-50 cursor-not-allowed'}`} transition-all text-left shadow-lg`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-3xl">{prompt.emoji}{isSelected && ' ✓'}</span>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-600 mb-2">{prompt.category}</p>
                          <h3 className={`text-lg font-bold ${isSelected ? 'text-green-700' : 'text-gray-800'}`}>{prompt.question}</h3>
                          <p className="text-xs text-gray-600 italic">{prompt.guidance}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Sessions Log */}
            {circleSessions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Your Circle Sessions ({circleSessions.length})</h3>
                <div className="space-y-3">
                  {circleSessions.slice(-3).reverse().map((session) => (
                    <div
                      key={session.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <p className="text-sm font-semibold text-gray-700">{session.date}</p>
                      <p className="text-sm text-gray-600 mb-1">{session.prompt}</p>
                      <p className="text-xs text-gray-500 italic">"{session.takeaway.substring(0, 60)}..."</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complete Button */}
            {(circleSessions.length > 0 || selectedPrompts.length > 0) && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                View All Sessions
              </motion.button>
            )}

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
              <p className="text-sm text-gray-700">
                <strong>💡 Parent Tip:</strong> Circles of sharing replace guilt with growth—build one locally or online. Regular parenting circles create ongoing support and learning opportunities.
              </p>
            </div>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  // Step 3: Log Takeaway
  const selectedPromptDatas = selectedPrompts.map(promptId => 
    discussionPrompts.find(p => p.id === promptId)
  ).filter(Boolean); // Filter out any undefined values

  return (
    <ParentGameShell
      title={gameData?.title || "Positive Parenting Circle"}
      subtitle={`Log Your Key Takeaway (${selectedPrompts.length}/5 prompts selected)`}
      showGameOver={false}
      score={circleSessions.length}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={3}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Selected Prompts */}
          {selectedPromptDatas.length > 0 && (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Selected Prompts ({selectedPrompts.length}/5)</h3>
              {selectedPromptDatas.map((promptData, index) => (
                <div key={promptData.id} className={`bg-gradient-to-br ${promptData.bgColor} rounded-xl p-6 border-2 ${promptData.borderColor}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl">{promptData.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">{promptData.category}</p>
                      <h3 className="text-xl font-bold text-gray-800">{promptData.question}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 italic">{promptData.guidance}</p>
                </div>
              ))}
            </div>
          )}

          {/* Takeaway Input */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Log Your Key Takeaway</h3>
            <p className="text-sm text-gray-600 mb-4">
              After discussing this prompt with your parenting circle, what's one key insight, strategy, or learning you want to remember?
            </p>
            <textarea
              value={takeaway}
              onChange={(e) => setTakeaway(e.target.value)}
              placeholder="Write your key takeaway here... What did you learn? What insight did you gain? What will you try differently?"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-800 min-h-[200px] resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              {takeaway.length} characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setTakeaway("");
                setSelectedPrompts([]);
                setStep(2);
              }}
              className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
            >
              Back to Prompts
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogTakeaway}
              disabled={!takeaway.trim() || takeaway.trim().length < 20}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Save Takeaway
            </motion.button>
          </div>

          {!takeaway.trim() || takeaway.trim().length < 20 ? (
            <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
              <p className="text-yellow-800 text-sm text-center">
                Please write at least 20 characters for your takeaway.
              </p>
            </div>
          ) : null}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Logging takeaways helps you remember and apply insights from your parenting circle discussions. These notes become valuable resources for your parenting journey.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default PositiveParentingCircle;

