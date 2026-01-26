import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Volume2, VolumeX, Clock, Heart, Sparkles, Wind, CheckCircle, Play, Pause } from "lucide-react";

const SilenceChallenge = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-98";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [step, setStep] = useState(1); // 1: Intro, 2: Guided Start, 3: Silence, 4: Reflection, 5: Complete
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [silenceDuration, setSilenceDuration] = useState(300); // 5 minutes default (300 seconds)
  const [reflection, setReflection] = useState("");
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  const timerRef = useRef(null);

  // Audio guide phases
  const phases = {
    intro: {
      text: "Welcome to the Silence Challenge. Find a comfortable place to sit. Put away your phone or turn it on silent. This is your time to be present with silence.",
      duration: 10
    },
    breathing: {
      text: "Let's begin with three deep breaths. Breathe in slowly... hold... and breathe out. Again, breathe in... hold... and breathe out. One more time, breathe in... hold... and breathe out. Good.",
      duration: 25
    },
    silenceStart: {
      text: "Now, enter the silence. For the next few minutes, simply sit quietly. Notice any urges to check your phone or do something else. Let those urges pass. Just be here, in silence. Begin now.",
      duration: 20
    },
    silenceEnd: {
      text: "The silence period is ending. Gently bring your awareness back to the present moment. Notice how you feel after spending time in silence.",
      duration: 12
    }
  };

  // Text-to-speech for guided audio
  const speakPrompt = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8; // Slower, calmer pace
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setStep(2);
    setIsPlaying(true);
    setTimeRemaining(phases.intro.duration);
    speakPrompt(phases.intro.text);
  };

  const handlePause = () => {
    setIsPaused(true);
    if (window.speechSynthesis) {
      window.speechSynthesis.pause();
    }
  };

  const handleResume = () => {
    setIsPaused(false);
    if (window.speechSynthesis) {
      window.speechSynthesis.resume();
    }
  };

  // Timer effect
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    if (timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else {
      // Phase completed, move to next
      handlePhaseComplete();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, isPaused, timeRemaining]);

  const handlePhaseComplete = () => {
    if (step === 2) {
      // Intro complete, move to breathing
      setStep(2.5); // Breathing phase
      setTimeRemaining(phases.breathing.duration);
      speakPrompt(phases.breathing.text);
    } else if (step === 2.5) {
      // Breathing complete, move to silence
      setStep(3);
      const duration = silenceDuration; // 5 minutes = 300 seconds
      setTimeRemaining(duration);
      speakPrompt(phases.silenceStart.text);
    } else if (step === 3) {
      // Silence complete, move to reflection
      setStep(4);
      setIsPlaying(false);
      speakPrompt(phases.silenceEnd.text);
      setScore(5); // +5 Points for full session
    }
  };

  const handleComplete = () => {
    if (reflection.trim().length >= 20) {
      setShowGameOver(true);
    }
  };

  const handleDurationChange = (minutes) => {
    setSilenceDuration(minutes * 60);
  };

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Silence Challenge"}
        subtitle="Challenge Complete!"
        showGameOver={true}
        score={5}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={score === 5}
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
                🤫
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Silence Challenge Complete!</h2>
              <p className="text-lg text-gray-600 mb-4">
                You spent {formatTime(silenceDuration)} in mindful silence.
              </p>
              <div className="inline-block bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl px-8 py-4 border-2 border-indigo-300">
                <p className="text-4xl font-bold text-gray-800 mb-2">+{score} Points</p>
                <p className="text-lg font-semibold text-gray-700">Full Session Completed</p>
              </div>
            </div>

            {/* Reflection Display */}
            {reflection && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-blue-600" />
                  Your Reflection
                </h3>
                <div className="bg-white rounded-lg p-5 border border-blue-200">
                  <p className="text-gray-800 leading-relaxed italic text-lg">
                    "{reflection}"
                  </p>
                </div>
              </div>
            )}

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-green-600" />
                The Power of Silence
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Resisting Urges:</strong> Enjoying moments of silence without checking your phone strengthens your ability to resist distractions and be present. Each time you notice the urge and let it pass, you build mental resilience.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Emotional Intelligence:</strong> Silence creates space for self-awareness. In quiet moments, you can observe your thoughts, emotions, and reactions without reacting. This awareness grows emotional intelligence.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Rest for the Mind:</strong> Just as your body needs rest, your mind benefits from silence. Time away from constant stimulation allows your nervous system to reset and recharge.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Teaching Children:</strong> When you embrace silence, you model this valuable skill for your children. They learn that silence isn't something to fear or fill—it's a space for presence, creativity, and inner peace.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Building Tolerance:</strong> Regular silence practice increases your tolerance for stillness and quiet. This helps you stay calm in moments of waiting, uncertainty, or pause in daily life.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Teach children to embrace silence — it grows emotional intelligence. When you regularly practice silence and make it a normal part of your life, your children learn that silence is not empty or scary—it's a space for presence, self-awareness, and inner calm. Model silence by creating quiet moments in your day. Sit together in silence for a few minutes. Let them see you comfortable with stillness, not rushing to fill every moment with sound or activity. As they learn to sit with silence, they develop greater emotional intelligence—the ability to observe their feelings, thoughts, and reactions without immediately reacting. This skill serves them throughout life.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  // Step 4: Reflection
  if (step === 4) {
    return (
      <ParentGameShell
        title={gameData?.title || "Silence Challenge"}
        subtitle="Reflect on Your Experience"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🤫</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">How Did Silence Feel?</h2>
              <p className="text-gray-600">
                Take a moment to reflect on your experience with silence.
              </p>
            </div>

            {/* Reflection Input */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Your Reflection</h3>
              <p className="text-sm text-gray-600 mb-4">
                How did spending time in silence make you feel? What did you notice? What urges did you resist? What did you learn about yourself?
              </p>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Write your reflection about the silence experience... How did it feel? What did you notice? What did you learn?"
                className="w-full px-4 py-3 rounded-lg border-2 border-indigo-300 focus:border-indigo-500 focus:outline-none text-gray-800 min-h-[200px] resize-none"
              />
              <div className="flex justify-between items-center mt-3">
                <p className="text-sm text-gray-600">
                  {(reflection?.length || 0)} characters (minimum 20)
                </p>
                {reflection && reflection.trim().length >= 20 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">Ready to complete</span>
                  </div>
                )}
              </div>
            </div>

            {/* Complete Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleComplete}
              disabled={!reflection.trim() || reflection.trim().length < 20}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Complete Challenge
              <CheckCircle className="w-5 h-5" />
            </motion.button>

            {(!reflection.trim() || reflection.trim().length < 20) && (
              <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
                <p className="text-yellow-800 text-sm text-center">
                  Please write at least 20 characters to complete your reflection.
                </p>
              </div>
            )}

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
              <p className="text-sm text-gray-700">
                <strong>💡 Parent Tip:</strong> Teach children to embrace silence — it grows emotional intelligence.
              </p>
            </div>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  // Step 3: Silence period
  if (step === 3) {
    const progress = ((silenceDuration - timeRemaining) / silenceDuration) * 100;

    return (
      <ParentGameShell
        title={gameData?.title || "Silence Challenge"}
        subtitle="In Silence"
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
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-7xl mb-6"
              >
                🤫
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Sit in Silence</h2>
              <p className="text-gray-600 text-lg mb-6">
                Simply be present. Notice urges to check your phone or do something else. Let them pass.
              </p>

              {/* Timer Display */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-200 mb-6">
                <Clock className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <div className="text-6xl font-bold text-indigo-800 mb-4">
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-gray-600">Remaining</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-4 rounded-full"
                />
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                {!isPaused ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePause}
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center gap-2"
                  >
                    <Pause className="w-5 h-5" />
                    Pause
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleResume}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Resume
                  </motion.button>
                )}
              </div>

              {/* Guidance */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mt-6">
                <p className="text-sm text-gray-700 text-center">
                  <strong>Remember:</strong> If you feel the urge to check your phone or do something else, simply notice it and let it pass. Return to the silence.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  // Step 2 & 2.5: Guided start (intro + breathing)
  if (step === 2 || step === 2.5) {
    const currentPhase = step === 2 ? phases.intro : phases.breathing;
    const phaseTitle = step === 2 ? "Getting Ready" : "Breathing";

    return (
      <ParentGameShell
        title={gameData?.title || "Silence Challenge"}
        subtitle={phaseTitle}
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
              {step === 2.5 && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-6"
                >
                  <Wind className="w-16 h-16 text-blue-600 mx-auto" />
                </motion.div>
              )}
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{phaseTitle}</h2>
              <p className="text-gray-600 text-lg mb-6">
                {currentPhase.text}
              </p>

              {/* Timer */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
                <div className="text-4xl font-bold text-blue-800 mb-2">
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-gray-600">Continue listening...</p>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                {!isPaused ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePause}
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center gap-2"
                  >
                    <Pause className="w-5 h-5" />
                    Pause
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleResume}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Resume
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  // Step 1: Introduction
  return (
    <ParentGameShell
      title={gameData?.title || "Silence Challenge"}
      subtitle="Enjoy Moments of Silence"
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
            <div className="text-7xl mb-4">🤫</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Silence Challenge</h2>
            <p className="text-gray-600 text-lg">
              Enjoy moments of silence without the urge to check your phone.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">How to Play</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 mt-1">1.</span>
                <span>An audio guide will help you prepare and begin the silence period.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 mt-1">2.</span>
                <span>You'll start with a few deep breaths to center yourself.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 mt-1">3.</span>
                <span>Then, sit quietly for 5-7 minutes without checking your phone or doing anything else.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 mt-1">4.</span>
                <span>Notice any urges to do something—let them pass and return to silence.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 mt-1">5.</span>
                <span>After the silence period, reflect on your experience.</span>
              </li>
            </ul>
          </div>

          {/* Duration Selection */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Choose Silence Duration</h3>
            <div className="grid grid-cols-3 gap-4">
              {[5, 6, 7].map((minutes) => {
                const isSelected = silenceDuration === minutes * 60;
                return (
                  <motion.button
                    key={minutes}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDurationChange(minutes)}
                    className={`py-4 px-6 rounded-xl border-2 font-bold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-800 border-gray-300 hover:border-indigo-400'
                    }`}
                  >
                    {minutes} min
                  </motion.button>
                );
              })}
            </div>
            <p className="text-sm text-gray-600 mt-4 text-center">
              Selected: {silenceDuration / 60} minutes of silence
            </p>
          </div>

          {/* Scoring Info */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-200 mb-6">
            <p className="text-sm text-gray-700 text-center">
              <strong>Scoring:</strong> Complete the full session (including reflection) to earn <strong className="text-green-700">+5 Points</strong>.
            </p>
          </div>

          {/* Start Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Volume2 className="w-5 h-5" />
            Begin Silence Challenge
          </motion.button>

          {/* Preparation Tips */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mt-6">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Before starting:</strong>
            </p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>• Put your phone away or turn it on silent</li>
              <li>• Find a comfortable, quiet place to sit</li>
              <li>• Let others know you need a few minutes of quiet time</li>
              <li>• Make sure you won't be interrupted</li>
            </ul>
          </div>

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Teach children to embrace silence — it grows emotional intelligence. When you regularly practice silence and feel comfortable with stillness, you model this valuable skill for your children.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default SilenceChallenge;

