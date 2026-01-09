import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Edit3, Sparkles, CheckCircle } from "lucide-react";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";

const InnerVoiceCheck = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-6";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [rewrittenPhrases, setRewrittenPhrases] = useState({});
  const [selectedAffirmations, setSelectedAffirmations] = useState({});
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speechSynth, setSpeechSynth] = useState(null);

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      setSpeechSynth(window.speechSynthesis);
    }
  }, []);

  const negativeSelfTalkPhrases = [
    {
      id: 1,
      phrase: "I failed today",
      context: "After a lesson that didn't go as planned",
      suggestions: [
        "I learned something valuable today",
        "I'm growing and improving with each day",
        "Today was a learning experience, not a failure"
      ],
      affirmation: "You're learning and growing every day. Each experience teaches you something valuable. You're becoming a better teacher with every lesson."
    },
    {
      id: 2,
      phrase: "I can't manage this workload",
      context: "Feeling overwhelmed with grading, planning, and meetings",
      suggestions: [
        "I can prioritize and take one task at a time",
        "I'm managing what I can and asking for help when needed",
        "I'm doing my best with the resources I have"
      ],
      affirmation: "You're capable and resourceful. You can break tasks into manageable steps and ask for support when needed. You're stronger than you think."
    },
    {
      id: 3,
      phrase: "I'm not a good teacher",
      context: "After receiving critical feedback or a difficult day",
      suggestions: [
        "I'm a dedicated teacher who cares about my students",
        "I'm continuously learning and improving",
        "I have strengths and I'm working on areas for growth"
      ],
      affirmation: "You are a good teacher. Your dedication and care for your students matter. Every teacher has challenging days—they don't define your worth or ability."
    },
    {
      id: 4,
      phrase: "I should have handled that better",
      context: "After a difficult interaction with a student or parent",
      suggestions: [
        "I did my best in that moment with the resources I had",
        "I can learn from this and respond differently next time",
        "I'm human and doing my best"
      ],
      affirmation: "You did your best in that moment. You're human, and every interaction is a chance to learn and grow. Your willingness to reflect shows your commitment to improvement."
    },
    {
      id: 5,
      phrase: "I'm letting my students down",
      context: "When you feel you're not meeting expectations",
      suggestions: [
        "I'm doing my best to support my students",
        "I care deeply about my students' success",
        "I'm one person doing important work"
      ],
      affirmation: "You care deeply about your students, and that matters. You're doing important work, and your students benefit from your dedication. You're making a difference."
    },
    {
      id: 6,
      phrase: "I can't do this anymore",
      context: "During a particularly stressful period",
      suggestions: [
        "I can take this one day at a time",
        "I have resilience and strength",
        "I can find support and take care of myself"
      ],
      affirmation: "You have strength and resilience. You can take things one step at a time. It's okay to rest, ask for help, and prioritize your wellbeing."
    },
    {
      id: 7,
      phrase: "Everyone else is doing better than me",
      context: "Comparing yourself to other teachers",
      suggestions: [
        "I'm on my own teaching journey",
        "I have my own strengths and growth areas",
        "Comparison doesn't serve me—I focus on my progress"
      ],
      affirmation: "You're on your own unique teaching journey. Your path and progress are valid. Focus on your growth, not comparisons with others."
    },
    {
      id: 8,
      phrase: "I don't have time for self-care",
      context: "When feeling overwhelmed and neglecting personal needs",
      suggestions: [
        "Self-care is essential for my ability to teach well",
        "I can find small moments for myself",
        "Taking care of myself helps me take better care of my students"
      ],
      affirmation: "Self-care isn't selfish—it's essential. When you take care of yourself, you're better able to support your students. Small moments of care add up."
    },
    {
      id: 9,
      phrase: "I should know how to handle this",
      context: "When facing a new challenge or situation",
      suggestions: [
        "It's okay not to know everything—I can learn",
        "I can ask for help and learn from others",
        "Every teacher faces new challenges"
      ],
      affirmation: "It's okay not to know everything. Asking for help and learning is a sign of strength, not weakness. Every teacher faces new challenges and learns along the way."
    },
    {
      id: 10,
      phrase: "I'm not making a difference",
      context: "When feeling discouraged about your impact",
      suggestions: [
        "I'm making a difference, even if I can't always see it",
        "Small moments of connection matter",
        "My presence and care impact my students"
      ],
      affirmation: "You are making a difference. Your presence, care, and dedication impact your students in ways you may not always see. Your work matters."
    }
  ];

  // Use first 5 phrases for this game (as per game structure requirement)
  const phrases = negativeSelfTalkPhrases.slice(0, 5);

  const playAffirmation = (text) => {
    if (!speechSynth) return;

    // Stop any ongoing speech
    speechSynth.cancel();

    setIsPlayingAudio(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    speechSynth.speak(utterance);
  };

  const stopAudio = () => {
    if (speechSynth) {
      speechSynth.cancel();
      setIsPlayingAudio(false);
    }
  };

  const handleRewrite = (phraseId, rewritten) => {
    setRewrittenPhrases({
      ...rewrittenPhrases,
      [phraseId]: rewritten
    });
  };

  const handleSelectAffirmation = (phraseId, affirmationIndex) => {
    setSelectedAffirmations({
      ...selectedAffirmations,
      [phraseId]: affirmationIndex
    });
    
    // Play audio affirmation
    const phrase = phrases.find(p => p.id === phraseId);
    if (phrase) {
      playAffirmation(phrase.affirmation);
    }
  };

  const handleNext = () => {
    const currentPhraseId = phrases[currentPhrase].id;
    const hasRewrite = rewrittenPhrases[currentPhraseId]?.trim().length >= 10;
    const hasAffirmation = selectedAffirmations[currentPhraseId] !== undefined;

    if (hasRewrite && hasAffirmation) {
      stopAudio();
      if (currentPhrase < phrases.length - 1) {
        setCurrentPhrase(currentPhrase + 1);
        setScore(prev => prev + 1);
      } else {
        setScore(prev => prev + 1);
        setShowGameOver(true);
      }
    }
  };

  const currentPhraseData = phrases[currentPhrase];
  const currentRewrite = rewrittenPhrases[currentPhraseData.id] || "";
  const currentAffirmation = selectedAffirmations[currentPhraseData.id];

  return (
    <TeacherGameShell
      title={gameData?.title || "Inner Voice Check"}
      subtitle={gameData?.description || "Recognize negative self-talk and replace it with constructive phrasing"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentPhrase}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">
                Phrase {currentPhrase + 1} of {phrases.length}
              </span>
              <span className="text-sm font-medium text-gray-500">
                Progress: {score}/{phrases.length}
              </span>
            </div>
          </div>

          {/* Negative Self-Talk Display */}
          <div className="mb-6">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200 mb-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💭</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Negative Self-Talk
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 italic">
                    Context: {currentPhraseData.context}
                  </p>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                    <p className="text-gray-800 font-medium text-lg leading-relaxed">
                      "{currentPhraseData.phrase}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 1: Rewrite the Phrase */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-purple-600" />
              Step 1: Rewrite this in constructive language
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Transform this negative self-talk into a more constructive, supportive statement.
            </p>
            
            <textarea
              value={currentRewrite}
              onChange={(e) => handleRewrite(currentPhraseData.id, e.target.value)}
              placeholder="For example: 'I'm learning and growing every day' or 'I can prioritize and take one task at a time'"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:outline-none text-gray-800 min-h-[100px] resize-none"
            />
            
            <div className="mt-2 flex justify-between items-center">
              <p className="text-xs text-gray-500">
                {currentRewrite.length} characters (minimum 10)
              </p>
              {currentRewrite.trim().length < 10 && (
                <p className="text-xs text-orange-600">
                  Please write at least 10 characters
                </p>
              )}
            </div>

            {/* Suggestions */}
            {currentRewrite.trim().length === 0 && (
              <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <p className="text-sm font-semibold text-blue-800 mb-2">
                  💡 Suggestions:
                </p>
                <ul className="space-y-1">
                  {currentPhraseData.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Step 2: Choose Affirmation */}
          {currentRewrite.trim().length >= 10 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-600" />
                Step 2: Choose an affirmation to hear
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Tap on the affirmation below to hear it spoken aloud. This helps reinforce positive self-talk.
              </p>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <p className="text-gray-800 leading-relaxed mb-4">
                      {currentPhraseData.affirmation}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (isPlayingAudio) {
                          stopAudio();
                        } else {
                          handleSelectAffirmation(currentPhraseData.id, 0);
                        }
                      }}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                        currentAffirmation === 0
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'bg-white text-green-700 border-2 border-green-300 hover:border-green-500'
                      }`}
                    >
                      {isPlayingAudio && currentAffirmation === 0 ? (
                        <>
                          <VolumeX className="w-5 h-5" />
                          Stop Audio
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-5 h-5" />
                          Play Affirmation
                        </>
                      )}
                    </motion.button>
                  </div>
                  {currentAffirmation === 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-green-600"
                    >
                      <CheckCircle className="w-8 h-8" />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Next Button */}
          {currentRewrite.trim().length >= 10 && currentAffirmation !== undefined && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {currentPhrase < phrases.length - 1 ? 'Next Phrase →' : 'Complete Inner Voice Check'}
              </motion.button>
            </motion.div>
          )}

          {/* Teacher Tip */}
          <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-amber-900 mb-2">
              💡 Teacher Tip:
            </p>
            <p className="text-sm text-amber-800 leading-relaxed">
              Display affirmation cards in the staffroom. Create small cards with positive affirmations and place them in visible spots—on the staffroom bulletin board, near the coffee maker, or on your desk. When you see these affirmations throughout the day, they remind you of your worth and help counter negative self-talk. You can also share affirmations with colleagues to create a supportive environment where everyone benefits from positive reinforcement.
            </p>
          </div>
        </div>
      </div>
    </TeacherGameShell>
  );
};

export default InnerVoiceCheck;

