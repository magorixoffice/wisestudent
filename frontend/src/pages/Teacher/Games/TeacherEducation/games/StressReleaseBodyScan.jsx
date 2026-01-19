import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Play, Pause, RotateCcw, CheckCircle } from "lucide-react";

const StressReleaseBodyScan = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-19";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [scanState, setScanState] = useState('ready'); // ready, scanning, complete, selection
  const [currentBodyPart, setCurrentBodyPart] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lighterAreas, setLighterAreas] = useState([]);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Body parts in scan order (key stress points)
  const bodyParts = [
    { id: 'head', name: 'Head', x: 50, y: 15, width: 20, height: 15, instruction: 'Bring your attention to your head. Notice any tension in your forehead, temples, or jaw. Take a deep breath and release any tightness you find.' },
    { id: 'shoulders', name: 'Shoulders', x: 35, y: 38, width: 30, height: 12, instruction: 'Notice your shoulders. Are they raised or tense? Let them drop away from your ears. Feel the weight releasing.' },
    { id: 'chest', name: 'Chest', x: 42, y: 50, width: 16, height: 20, instruction: 'Bring attention to your chest. Feel your breath moving in and out. Notice any tightness and allow it to soften with each exhale.' },
    { id: 'stomach', name: 'Stomach', x: 44, y: 70, width: 12, height: 15, instruction: 'Move to your stomach area. Notice any holding or tightness. Let your belly be soft and relaxed as you breathe naturally.' },
    { id: 'lower-back', name: 'Lower Back', x: 44, y: 60, width: 12, height: 20, instruction: 'Bring awareness to your lower back. This area often holds stress. Breathe into it and imagine the tension melting away.' }
  ];

  // Auto-advance through body scan
  useEffect(() => {
    if (scanState !== 'scanning' || isPaused || currentBodyPart >= bodyParts.length) {
      return;
    }

    const timer = setTimeout(() => {
      if (currentBodyPart < bodyParts.length - 1) {
        setCurrentBodyPart(prev => prev + 1);
      } else {
        // Scan complete
        setScanState('complete');
      }
    }, 6000); // 6 seconds per body part (shorter for 5 parts)

    return () => clearTimeout(timer);
  }, [scanState, currentBodyPart, isPaused]);

  const startScan = () => {
    setScanState('scanning');
    setCurrentBodyPart(0);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const resetScan = () => {
    setScanState('ready');
    setCurrentBodyPart(0);
    setIsPaused(false);
    setLighterAreas([]);
  };

  const handleCompleteScan = () => {
    setScanState('selection');
  };

  const handleBodyPartTap = (partId) => {
    if (lighterAreas.includes(partId)) {
      setLighterAreas(lighterAreas.filter(id => id !== partId));
    } else {
      setLighterAreas([...lighterAreas, partId]);
    }
  };

  const handleFinish = () => {
    // Award healcoins based on participation in the body scan
    // Even completing the scan and reflecting is valuable
    setScore(5); // Full score for completing the exercise
    setShowGameOver(true);
  };

  const currentPart = bodyParts[currentBodyPart];
  const isActivePart = (partId) => scanState === 'scanning' && currentPart?.id === partId;
  const isLighterArea = (partId) => lighterAreas.includes(partId);

  return (
    <TeacherGameShell
      title={gameData?.title || "Stress Release Body Scan"}
      subtitle={gameData?.description || "Relax through guided visualization and muscle awareness"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {scanState === 'ready' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">🧘</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Stress Release Body Scan
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              This guided body scan will help you release tension and relax. We'll move from your head to your toes, 
              bringing awareness to each part of your body.
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6 max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-800 mb-3">What to expect:</h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li>• Guided instructions for each body part</li>
                <li>• 6 seconds per area to focus and relax</li>
                <li>• After the scan, tap areas that feel lighter</li>
                <li>• Total time: ~30 seconds</li>
              </ul>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startScan}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
            >
              <Play className="w-6 h-6" />
              Begin Body Scan
            </motion.button>
          </div>
        )}

        {scanState === 'scanning' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Body Part {currentBodyPart + 1} of {bodyParts.length}</span>
                <span>{Math.round(((currentBodyPart + 1) / bodyParts.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentBodyPart + 1) / bodyParts.length) * 100}%` }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                />
              </div>
            </div>

            {/* Current Instruction */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {currentPart.name}
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {currentPart.instruction}
                </p>
              </div>
            </div>

            {/* Body Outline */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
              <div className="relative mx-auto" style={{ maxWidth: '400px', height: '500px' }}>
                <svg
                  viewBox="0 0 100 120"
                  className="w-full h-auto"
                >
                  {/* Body Outline - Simplified for 5 key areas */}
                  <g>
                    {/* Head */}
                    <motion.ellipse
                      cx="50"
                      cy="20"
                      rx="10"
                      ry="12"
                      fill={isActivePart('head') ? "#10b981" : "#e5e7eb"}
                      stroke={isActivePart('head') ? "#059669" : "#9ca3af"}
                      strokeWidth={isActivePart('head') ? "1" : "0.5"}
                      animate={isActivePart('head') ? {
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Shoulders/Chest/Torso Area */}
                    <motion.path
                      d="M 42 38 L 35 50 L 38 85 L 42 100 L 58 100 L 62 85 L 65 50 L 58 38 Z"
                      fill={
                        isActivePart('shoulders') || isActivePart('chest') ? "#10b981" : "#e5e7eb"
                      }
                      stroke={
                        isActivePart('shoulders') || isActivePart('chest') ? "#059669" : "#9ca3af"
                      }
                      strokeWidth={
                        isActivePart('shoulders') || isActivePart('chest') ? "1" : "0.5"
                      }
                      animate={
                        isActivePart('shoulders') || isActivePart('chest') ? {
                          scale: [1, 1.05, 1],
                          opacity: [0.7, 1, 0.7]
                        } : {}
                      }
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Stomach */}
                    <motion.rect
                      x="44"
                      y="70"
                      width="12"
                      height="15"
                      fill={isActivePart('stomach') ? "#10b981" : "#e5e7eb"}
                      stroke={isActivePart('stomach') ? "#059669" : "#9ca3af"}
                      strokeWidth={isActivePart('stomach') ? "1" : "0.5"}
                      animate={isActivePart('stomach') ? {
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Lower Back */}
                    <motion.rect
                      x="44"
                      y="60"
                      width="12"
                      height="20"
                      fill={isActivePart('lower-back') ? "#10b981" : "#e5e7eb"}
                      stroke={isActivePart('lower-back') ? "#059669" : "#9ca3af"}
                      strokeWidth={isActivePart('lower-back') ? "1" : "0.5"}
                      animate={isActivePart('lower-back') ? {
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </g>
                </svg>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePause}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                {isPaused ? (
                  <>
                    <Play className="w-5 h-5" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetScan}
                className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </motion.button>
            </div>
          </div>
        )}

        {scanState === 'complete' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">✨</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Body Scan Complete
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              You've completed the guided body scan. Now, tap on the areas of your body that feel lighter or more relaxed.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCompleteScan}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Select Lighter Areas
            </motion.button>
          </div>
        )}

        {scanState === 'selection' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Tap Areas That Feel Lighter
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              After the body scan, which parts of your body feel lighter, more relaxed, or less tense? 
              Tap on those areas below.
            </p>

            {/* Body Outline for Selection */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <div className="relative mx-auto" style={{ maxWidth: '400px', height: '500px' }}>
                <svg
                  viewBox="0 0 100 120"
                  className="w-full h-auto"
                >
                  {/* Body Outline Base - Simplified for 5 key areas */}
                  <g>
                    {/* Head */}
                    <ellipse cx="50" cy="20" rx="10" ry="12" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
                    
                    {/* Torso/Shoulders/Chest */}
                    <path
                      d="M 42 38 L 35 50 L 38 85 L 42 100 L 58 100 L 62 85 L 65 50 L 58 38 Z"
                      fill="#e5e7eb"
                      stroke="#9ca3af"
                      strokeWidth="0.5"
                    />
                    
                    {/* Stomach */}
                    <rect x="44" y="70" width="12" height="15" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
                    
                    {/* Lower Back */}
                    <rect x="44" y="60" width="12" height="20" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
                  </g>

                  {/* Clickable Body Parts - Only 5 key areas */}
                  {bodyParts.map((part) => {
                    const isLighter = isLighterArea(part.id);
                    return (
                      <motion.g
                        key={part.id}
                        onClick={() => handleBodyPartTap(part.id)}
                        className="cursor-pointer"
                      >
                        {part.id === 'head' && (
                          <motion.ellipse
                            cx="50"
                            cy="20"
                            rx="10"
                            ry="12"
                            fill={isLighter ? "#10b981" : "transparent"}
                            stroke={isLighter ? "#059669" : "transparent"}
                            strokeWidth="2"
                            whileHover={{ scale: 1.1, opacity: 0.5 }}
                            animate={isLighter ? {
                              scale: [1, 1.1, 1],
                              opacity: [0.6, 0.8, 0.6]
                            } : {}}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        )}
                        {(part.id === 'shoulders' || part.id === 'chest') && (
                          <motion.path
                            d="M 42 38 L 35 50 L 38 85 L 42 100 L 58 100 L 62 85 L 65 50 L 58 38 Z"
                            fill={isLighter ? "#10b981" : "transparent"}
                            stroke={isLighter ? "#059669" : "transparent"}
                            strokeWidth="2"
                            whileHover={{ scale: 1.05, opacity: 0.5 }}
                            animate={isLighter ? {
                              scale: [1, 1.05, 1],
                              opacity: [0.6, 0.8, 0.6]
                            } : {}}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        )}
                        {part.id === 'stomach' && (
                          <motion.rect
                            x="44"
                            y="70"
                            width="12"
                            height="15"
                            fill={isLighter ? "#10b981" : "transparent"}
                            stroke={isLighter ? "#059669" : "transparent"}
                            strokeWidth="2"
                            whileHover={{ scale: 1.1, opacity: 0.5 }}
                            animate={isLighter ? {
                              scale: [1, 1.1, 1],
                              opacity: [0.6, 0.8, 0.6]
                            } : {}}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        )}
                        {part.id === 'lower-back' && (
                          <motion.rect
                            x="44"
                            y="60"
                            width="12"
                            height="20"
                            fill={isLighter ? "#10b981" : "transparent"}
                            stroke={isLighter ? "#059669" : "transparent"}
                            strokeWidth="2"
                            whileHover={{ scale: 1.1, opacity: 0.5 }}
                            animate={isLighter ? {
                              scale: [1, 1.1, 1],
                              opacity: [0.6, 0.8, 0.6]
                            } : {}}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        )}
                      </motion.g>
                    );
                  })}
                </svg>
              </div>
              
              {/* Body Part Labels for Clicking */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                {bodyParts.map((part) => (
                  <motion.button
                    key={part.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBodyPartTap(part.id)}
                    className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${
                      isLighterArea(part.id)
                        ? 'bg-green-500 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {part.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Selected Areas Summary */}
            {lighterAreas.length > 0 && (
              <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200 mb-6">
                <p className="text-sm font-semibold text-green-800 mb-2">
                  🎯 Mindful Awareness Practice Complete!
                </p>
                <p className="text-sm text-green-700 mb-2">
                  You've completed the body scan meditation. Whether you noticed tension or relaxation, 
                  simply paying attention to your body is a valuable stress-reduction practice.
                </p>
                {lighterAreas.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-green-800 mb-2">
                      Areas you noticed changes in: {lighterAreas.length}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {lighterAreas.map(areaId => {
                        const part = bodyParts.find(p => p.id === areaId);
                        return (
                          <span key={areaId} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {part?.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Finish Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFinish}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Complete Body Scan
              </motion.button>
            </div>

            {/* Teacher Tip */}
            <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-900 mb-2">
                💡 Teacher Tip:
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                Do this body scan before bed to reduce accumulated tension. The body scan helps release physical stress 
                that builds up during the day, making it easier to fall asleep and improving sleep quality. Practice this 
                regularly to build the habit of body awareness and stress release. You can also do a shorter version during 
                your lunch break or between classes.
              </p>
            </div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default StressReleaseBodyScan;

