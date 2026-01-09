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
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [scanState, setScanState] = useState('ready'); // ready, scanning, complete, selection
  const [currentBodyPart, setCurrentBodyPart] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lighterAreas, setLighterAreas] = useState([]);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Body parts in scan order (head to toes)
  const bodyParts = [
    { id: 'head', name: 'Head', x: 50, y: 15, width: 20, height: 15, instruction: 'Bring your attention to your head. Notice any tension in your forehead, temples, or jaw. Take a deep breath and release any tightness you find.' },
    { id: 'neck', name: 'Neck', x: 48, y: 30, width: 4, height: 8, instruction: 'Move your awareness to your neck. Feel the muscles along the sides and back. Breathe into this area and let it soften.' },
    { id: 'shoulders', name: 'Shoulders', x: 35, y: 38, width: 30, height: 12, instruction: 'Notice your shoulders. Are they raised or tense? Let them drop away from your ears. Feel the weight releasing.' },
    { id: 'chest', name: 'Chest', x: 42, y: 50, width: 16, height: 20, instruction: 'Bring attention to your chest. Feel your breath moving in and out. Notice any tightness and allow it to soften with each exhale.' },
    { id: 'upper-back', name: 'Upper Back', x: 42, y: 38, width: 16, height: 20, instruction: 'Scan your upper back. Notice any tension between your shoulder blades. Breathe into this area and imagine the muscles relaxing.' },
    { id: 'stomach', name: 'Stomach', x: 44, y: 70, width: 12, height: 15, instruction: 'Move to your stomach area. Notice any holding or tightness. Let your belly be soft and relaxed as you breathe naturally.' },
    { id: 'lower-back', name: 'Lower Back', x: 44, y: 60, width: 12, height: 20, instruction: 'Bring awareness to your lower back. This area often holds stress. Breathe into it and imagine the tension melting away.' },
    { id: 'left-arm', name: 'Left Arm', x: 25, y: 40, width: 8, height: 35, instruction: 'Focus on your left arm. Notice from shoulder to elbow to wrist. Feel any tension and release it with your breath.' },
    { id: 'right-arm', name: 'Right Arm', x: 67, y: 40, width: 8, height: 35, instruction: 'Now your right arm. Scan from shoulder to elbow to wrist. Let go of any tightness you discover.' },
    { id: 'left-hand', name: 'Left Hand', x: 20, y: 75, width: 10, height: 8, instruction: 'Notice your left hand and fingers. Are they clenched? Let them relax and open gently.' },
    { id: 'right-hand', name: 'Right Hand', x: 70, y: 75, width: 10, height: 8, instruction: 'Bring attention to your right hand and fingers. Release any gripping or tension.' },
    { id: 'left-leg', name: 'Left Leg', x: 42, y: 85, width: 6, height: 15, instruction: 'Move your awareness to your left leg. Feel from hip to knee to ankle. Let the muscles soften and relax.' },
    { id: 'right-leg', name: 'Right Leg', x: 52, y: 85, width: 6, height: 15, instruction: 'Now your right leg. Scan from hip to knee to ankle. Release any tension you find.' },
    { id: 'left-foot', name: 'Left Foot', x: 40, y: 100, width: 8, height: 5, instruction: 'Notice your left foot. Feel the sole, the toes. Let them rest comfortably and release any holding.' },
    { id: 'right-foot', name: 'Right Foot', x: 52, y: 100, width: 8, height: 5, instruction: 'Finally, your right foot. Feel the sole, the toes. Let everything soften and relax completely.' }
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
    }, 8000); // 8 seconds per body part

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
    if (lighterAreas.length > 0) {
      setScore(1);
      setShowGameOver(true);
    }
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
      currentQuestion={1}
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
                <li>• 8 seconds per area to focus and relax</li>
                <li>• After the scan, tap areas that feel lighter</li>
                <li>• Total time: ~2 minutes</li>
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
                  {/* Body Outline */}
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
                    
                    {/* Neck */}
                    <motion.rect
                      x="48"
                      y="32"
                      width="4"
                      height="6"
                      fill={isActivePart('neck') ? "#10b981" : "#e5e7eb"}
                      stroke={isActivePart('neck') ? "#059669" : "#9ca3af"}
                      strokeWidth={isActivePart('neck') ? "1" : "0.5"}
                      animate={isActivePart('neck') ? {
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Torso */}
                    <motion.path
                      d="M 42 38 L 35 50 L 38 85 L 42 100 L 58 100 L 62 85 L 65 50 L 58 38 Z"
                      fill={
                        isActivePart('shoulders') || isActivePart('chest') || isActivePart('upper-back') || 
                        isActivePart('stomach') || isActivePart('lower-back') ? "#10b981" : "#e5e7eb"
                      }
                      stroke={
                        isActivePart('shoulders') || isActivePart('chest') || isActivePart('upper-back') || 
                        isActivePart('stomach') || isActivePart('lower-back') ? "#059669" : "#9ca3af"
                      }
                      strokeWidth={
                        isActivePart('shoulders') || isActivePart('chest') || isActivePart('upper-back') || 
                        isActivePart('stomach') || isActivePart('lower-back') ? "1" : "0.5"
                      }
                      animate={
                        isActivePart('shoulders') || isActivePart('chest') || isActivePart('upper-back') || 
                        isActivePart('stomach') || isActivePart('lower-back') ? {
                          scale: [1, 1.05, 1],
                          opacity: [0.7, 1, 0.7]
                        } : {}
                      }
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Left Arm */}
                    <motion.ellipse
                      cx="30"
                      cy="55"
                      rx="4"
                      ry="20"
                      fill={isActivePart('left-arm') ? "#10b981" : "#e5e7eb"}
                      stroke={isActivePart('left-arm') ? "#059669" : "#9ca3af"}
                      strokeWidth={isActivePart('left-arm') ? "1" : "0.5"}
                      animate={isActivePart('left-arm') ? {
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Right Arm */}
                    <motion.ellipse
                      cx="70"
                      cy="55"
                      rx="4"
                      ry="20"
                      fill={isActivePart('right-arm') ? "#10b981" : "#e5e7eb"}
                      stroke={isActivePart('right-arm') ? "#059669" : "#9ca3af"}
                      strokeWidth={isActivePart('right-arm') ? "1" : "0.5"}
                      animate={isActivePart('right-arm') ? {
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Left Hand */}
                    <motion.ellipse
                      cx="25"
                      cy="80"
                      rx="5"
                      ry="4"
                      fill={isActivePart('left-hand') ? "#10b981" : "#e5e7eb"}
                      stroke={isActivePart('left-hand') ? "#059669" : "#9ca3af"}
                      strokeWidth={isActivePart('left-hand') ? "1" : "0.5"}
                      animate={isActivePart('left-hand') ? {
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Right Hand */}
                    <motion.ellipse
                      cx="75"
                      cy="80"
                      rx="5"
                      ry="4"
                      fill={isActivePart('right-hand') ? "#10b981" : "#e5e7eb"}
                      stroke={isActivePart('right-hand') ? "#059669" : "#9ca3af"}
                      strokeWidth={isActivePart('right-hand') ? "1" : "0.5"}
                      animate={isActivePart('right-hand') ? {
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Left Leg */}
                    <motion.ellipse
                      cx="45"
                      cy="95"
                      rx="3"
                      ry="15"
                      fill={isActivePart('left-leg') ? "#10b981" : "#e5e7eb"}
                      stroke={isActivePart('left-leg') ? "#059669" : "#9ca3af"}
                      strokeWidth={isActivePart('left-leg') ? "1" : "0.5"}
                      animate={isActivePart('left-leg') ? {
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Right Leg */}
                    <motion.ellipse
                      cx="55"
                      cy="95"
                      rx="3"
                      ry="15"
                      fill={isActivePart('right-leg') ? "#10b981" : "#e5e7eb"}
                      stroke={isActivePart('right-leg') ? "#059669" : "#9ca3af"}
                      strokeWidth={isActivePart('right-leg') ? "1" : "0.5"}
                      animate={isActivePart('right-leg') ? {
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Left Foot */}
                    <motion.ellipse
                      cx="42"
                      cy="110"
                      rx="4"
                      ry="3"
                      fill={isActivePart('left-foot') ? "#10b981" : "#e5e7eb"}
                      stroke={isActivePart('left-foot') ? "#059669" : "#9ca3af"}
                      strokeWidth={isActivePart('left-foot') ? "1" : "0.5"}
                      animate={isActivePart('left-foot') ? {
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Right Foot */}
                    <motion.ellipse
                      cx="58"
                      cy="110"
                      rx="4"
                      ry="3"
                      fill={isActivePart('right-foot') ? "#10b981" : "#e5e7eb"}
                      stroke={isActivePart('right-foot') ? "#059669" : "#9ca3af"}
                      strokeWidth={isActivePart('right-foot') ? "1" : "0.5"}
                      animate={isActivePart('right-foot') ? {
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
                  {/* Body Outline Base */}
                  <g>
                    {/* Head */}
                    <ellipse cx="50" cy="20" rx="10" ry="12" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
                    {/* Neck */}
                    <rect x="48" y="32" width="4" height="6" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
                    {/* Torso */}
                    <path
                      d="M 42 38 L 35 50 L 38 85 L 42 100 L 58 100 L 62 85 L 65 50 L 58 38 Z"
                      fill="#e5e7eb"
                      stroke="#9ca3af"
                      strokeWidth="0.5"
                    />
                    {/* Left Arm */}
                    <ellipse cx="30" cy="55" rx="4" ry="20" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
                    {/* Right Arm */}
                    <ellipse cx="70" cy="55" rx="4" ry="20" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
                    {/* Left Hand */}
                    <ellipse cx="25" cy="80" rx="5" ry="4" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
                    {/* Right Hand */}
                    <ellipse cx="75" cy="80" rx="5" ry="4" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
                    {/* Left Leg */}
                    <ellipse cx="45" cy="95" rx="3" ry="15" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
                    {/* Right Leg */}
                    <ellipse cx="55" cy="95" rx="3" ry="15" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
                    {/* Left Foot */}
                    <ellipse cx="42" cy="110" rx="4" ry="3" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
                    {/* Right Foot */}
                    <ellipse cx="58" cy="110" rx="4" ry="3" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
                  </g>

                  {/* Clickable Body Parts */}
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
                            cx={part.x}
                            cy={part.y + 5}
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
                        {part.id === 'neck' && (
                          <motion.rect
                            x={part.x - 2}
                            y={part.y + 2}
                            width="4"
                            height="6"
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
                        {(part.id === 'shoulders' || part.id === 'chest' || part.id === 'upper-back' || 
                          part.id === 'stomach' || part.id === 'lower-back') && (
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
                        {part.id === 'left-arm' && (
                          <motion.ellipse
                            cx="30"
                            cy="55"
                            rx="4"
                            ry="20"
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
                        {part.id === 'right-arm' && (
                          <motion.ellipse
                            cx="70"
                            cy="55"
                            rx="4"
                            ry="20"
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
                        {part.id === 'left-hand' && (
                          <motion.ellipse
                            cx="25"
                            cy="80"
                            rx="5"
                            ry="4"
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
                        {part.id === 'right-hand' && (
                          <motion.ellipse
                            cx="75"
                            cy="80"
                            rx="5"
                            ry="4"
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
                        {part.id === 'left-leg' && (
                          <motion.ellipse
                            cx="45"
                            cy="95"
                            rx="3"
                            ry="15"
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
                        {part.id === 'right-leg' && (
                          <motion.ellipse
                            cx="55"
                            cy="95"
                            rx="3"
                            ry="15"
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
                        {part.id === 'left-foot' && (
                          <motion.ellipse
                            cx="42"
                            cy="110"
                            rx="4"
                            ry="3"
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
                        {part.id === 'right-foot' && (
                          <motion.ellipse
                            cx="58"
                            cy="110"
                            rx="4"
                            ry="3"
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
                  Areas feeling lighter: {lighterAreas.length}
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

            {/* Finish Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFinish}
                disabled={lighterAreas.length === 0}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

