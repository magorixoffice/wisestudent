import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { X, AlertCircle, Zap, Heart } from "lucide-react";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";

const MoodMap = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-5";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [selectedEmotion, setSelectedEmotion] = useState(null); // 'tension', 'fatigue', 'calm'
  const [bodyMarkers, setBodyMarkers] = useState([]); // Array of {emotion, x, y, id}
  const [showPatterns, setShowPatterns] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const emotions = [
    {
      id: 'tension',
      label: 'Tension',
      icon: AlertCircle,
      color: 'bg-red-500',
      borderColor: 'border-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      description: 'Tightness, pressure, or discomfort'
    },
    {
      id: 'fatigue',
      label: 'Fatigue',
      icon: Zap,
      color: 'bg-orange-500',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-50',
      description: 'Tiredness, heaviness, or low energy'
    },
    {
      id: 'calm',
      label: 'Calm',
      icon: Heart,
      color: 'bg-green-500',
      borderColor: 'border-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      description: 'Relaxation, ease, or peace'
    }
  ];

  // Body parts with clickable areas (relative positions on body outline)
  const bodyParts = [
    { id: 'head', name: 'Head', x: 50, y: 15, width: 20, height: 15 },
    { id: 'neck', name: 'Neck', x: 48, y: 30, width: 4, height: 8 },
    { id: 'shoulders', name: 'Shoulders', x: 35, y: 38, width: 30, height: 12 },
    { id: 'chest', name: 'Chest', x: 42, y: 50, width: 16, height: 20 },
    { id: 'stomach', name: 'Stomach', x: 44, y: 70, width: 12, height: 15 },
    { id: 'upper-back', name: 'Upper Back', x: 42, y: 38, width: 16, height: 20 },
    { id: 'lower-back', name: 'Lower Back', x: 44, y: 60, width: 12, height: 20 },
    { id: 'left-arm', name: 'Left Arm', x: 25, y: 40, width: 8, height: 35 },
    { id: 'right-arm', name: 'Right Arm', x: 67, y: 40, width: 8, height: 35 },
    { id: 'left-hand', name: 'Left Hand', x: 20, y: 75, width: 10, height: 8 },
    { id: 'right-hand', name: 'Right Hand', x: 70, y: 75, width: 10, height: 8 },
    { id: 'left-leg', name: 'Left Leg', x: 42, y: 85, width: 6, height: 15 },
    { id: 'right-leg', name: 'Right Leg', x: 52, y: 85, width: 6, height: 15 },
    { id: 'left-foot', name: 'Left Foot', x: 40, y: 100, width: 8, height: 5 },
    { id: 'right-foot', name: 'Right Foot', x: 52, y: 100, width: 8, height: 5 }
  ];

  const handleEmotionSelect = (emotionId) => {
    setSelectedEmotion(emotionId);
  };

  const handleRemoveMarker = (markerId) => {
    setBodyMarkers(bodyMarkers.filter(m => m.id !== markerId));
  };

  const handleShowPatterns = () => {
    if (bodyMarkers.length > 0) {
      setShowPatterns(true);
      setScore(1);
    }
  };

  const analyzePatterns = () => {
    if (bodyMarkers.length === 0) return null;

    const emotionCounts = {
      tension: bodyMarkers.filter(m => m.emotion === 'tension').length,
      fatigue: bodyMarkers.filter(m => m.emotion === 'fatigue').length,
      calm: bodyMarkers.filter(m => m.emotion === 'calm').length
    };

    const total = bodyMarkers.length;
    const tensionPercent = (emotionCounts.tension / total) * 100;
    const fatiguePercent = (emotionCounts.fatigue / total) * 100;
    const calmPercent = (emotionCounts.calm / total) * 100;

    // Analyze body areas
    const upperBody = bodyMarkers.filter(m => 
      ['head', 'neck', 'shoulders', 'chest', 'upper-back'].includes(m.bodyPart.toLowerCase().replace(' ', '-'))
    ).length;
    const lowerBody = bodyMarkers.filter(m => 
      ['stomach', 'lower-back', 'left-leg', 'right-leg', 'left-foot', 'right-foot'].includes(m.bodyPart.toLowerCase().replace(' ', '-'))
    ).length;

    let pattern = "";
    let patternType = "";

    if (tensionPercent >= 50) {
      pattern = "Your body map shows a stress pattern with high tension. Tension in the upper body (head, neck, shoulders) often indicates mental stress and worry. Tension in the lower back or stomach can signal emotional stress or anxiety.";
      patternType = "stress";
    } else if (fatiguePercent >= 50) {
      pattern = "Your body map shows an energy depletion pattern with high fatigue. Fatigue throughout the body suggests physical and emotional exhaustion. This pattern often appears when you're overextended or need rest.";
      patternType = "fatigue";
    } else if (calmPercent >= 50) {
      pattern = "Your body map shows a calm pattern with areas of relaxation. This indicates you're in a balanced state. Notice where you feel calm—these are areas of strength and ease you can return to during stressful moments.";
      patternType = "calm";
    } else if (upperBody > lowerBody) {
      pattern = "Your body map shows stress concentrated in the upper body. Tension in the head, neck, and shoulders often relates to mental stress, worry, or feeling overwhelmed. This pattern suggests you might benefit from relaxation techniques focused on the upper body.";
      patternType = "stress";
    } else if (lowerBody > upperBody) {
      pattern = "Your body map shows sensations concentrated in the lower body. Fatigue or tension in the lower back, legs, or stomach can indicate physical exhaustion or emotional holding. This pattern suggests you might need rest or movement.";
      patternType = "fatigue";
    } else {
      pattern = "Your body map shows a mixed pattern with various sensations. This is normal and reflects the complexity of how emotions show up in the body. Notice which areas feel most intense—these are signals worth paying attention to.";
      patternType = "mixed";
    }

    return {
      emotionCounts,
      percentages: {
        tension: tensionPercent,
        fatigue: fatiguePercent,
        calm: calmPercent
      },
      pattern,
      patternType,
      upperBody,
      lowerBody
    };
  };

  const patterns = showPatterns ? analyzePatterns() : null;

  const getEmotionIcon = (emotionId) => {
    const emotion = emotions.find(e => e.id === emotionId);
    return emotion ? emotion.icon : AlertCircle;
  };

  const getEmotionColor = (emotionId) => {
    const emotion = emotions.find(e => e.id === emotionId);
    return emotion ? emotion.color : 'bg-gray-500';
  };

  return (
    <TeacherGameShell
      title={gameData?.title || "Mood Map"}
      subtitle={gameData?.description || "Connect body sensations to emotions"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={showPatterns ? 1 : 0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showPatterns ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Map Your Body Sensations
              </h2>
              <p className="text-gray-600 mb-2">
                Select an emotion below, then click on the body outline where you feel that sensation. You can place multiple markers to map your current body state.
              </p>
            </div>

            {/* Emotion Selector */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Select an Emotion to Place:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {emotions.map((emotion) => {
                  const Icon = emotion.icon;
                  const isSelected = selectedEmotion === emotion.id;
                  
                  return (
                    <motion.button
                      key={emotion.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleEmotionSelect(emotion.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? `${emotion.bgColor} ${emotion.borderColor} shadow-md`
                          : 'bg-white border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg ${emotion.color} flex items-center justify-center text-white`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="text-left flex-1">
                          <h4 className={`font-bold ${isSelected ? emotion.textColor : 'text-gray-800'}`}>
                            {emotion.label}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {emotion.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="text-2xl">✓</div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Body Outline with Interactive Areas */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Click on the body where you feel sensations:
              </h3>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                <div className="relative mx-auto" style={{ maxWidth: '400px' }}>
                  <svg
                    viewBox="0 0 100 120"
                    className="w-full h-auto cursor-pointer"
                    onClick={(e) => {
                      if (selectedEmotion) {
                        const svg = e.currentTarget;
                        const rect = svg.getBoundingClientRect();
                        const viewBox = svg.viewBox.baseVal;
                        
                        // Calculate click position relative to viewBox
                        const clickX = ((e.clientX - rect.left) / rect.width) * viewBox.width;
                        const clickY = ((e.clientY - rect.top) / rect.height) * viewBox.height;
                        
                        // Find closest body part
                        let closestPart = bodyParts[0];
                        let minDistance = Infinity;
                        
                        bodyParts.forEach(part => {
                          const distance = Math.sqrt(
                            Math.pow(clickX - part.x, 2) + Math.pow(clickY - part.y, 2)
                          );
                          if (distance < minDistance) {
                            minDistance = distance;
                            closestPart = part;
                          }
                        });

                        // Add marker at click position
                        const newMarker = {
                          id: Date.now() + Math.random(),
                          emotion: selectedEmotion,
                          x: clickX,
                          y: clickY,
                          bodyPart: closestPart.name
                        };

                        setBodyMarkers([...bodyMarkers, newMarker]);
                      }
                    }}
                  >
                    {/* Body Outline */}
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
                      <ellipse cx="45" cy="95" rx="3" ry="12" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
                      
                      {/* Right Leg */}
                      <ellipse cx="55" cy="95" rx="3" ry="12" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
                      
                      {/* Left Foot */}
                      <ellipse cx="42" cy="108" rx="4" ry="2" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
                      
                      {/* Right Foot */}
                      <ellipse cx="58" cy="108" rx="4" ry="2" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
                    </g>

                    {/* Markers */}
                    {bodyMarkers.map((marker) => {
                      const Icon = getEmotionIcon(marker.emotion);
                      const colorClass = getEmotionColor(marker.emotion).replace('bg-', 'text-');
                      
                      return (
                        <g key={marker.id}>
                          <circle
                            cx={marker.x}
                            cy={marker.y}
                            r="4"
                            fill="white"
                            stroke={colorClass === 'text-red-500' ? '#ef4444' : colorClass === 'text-orange-500' ? '#f97316' : '#22c55e'}
                            strokeWidth="1.5"
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveMarker(marker.id);
                            }}
                          />
                          <circle
                            cx={marker.x}
                            cy={marker.y}
                            r="2.5"
                            fill={colorClass === 'text-red-500' ? '#ef4444' : colorClass === 'text-orange-500' ? '#f97316' : '#22c55e'}
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveMarker(marker.id);
                            }}
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Marker Legend */}
              {bodyMarkers.length > 0 && (
                <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Markers Placed: {bodyMarkers.length}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {bodyMarkers.map((marker) => {
                      const emotion = emotions.find(e => e.id === marker.emotion);
                      const Icon = emotion?.icon || AlertCircle;
                      
                      return (
                        <div
                          key={marker.id}
                          className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full text-xs"
                        >
                          <Icon className={`w-3 h-3 ${emotion?.textColor || 'text-gray-600'}`} />
                          <span className="text-gray-700">{emotion?.label} on {marker.bodyPart}</span>
                          <button
                            onClick={() => handleRemoveMarker(marker.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Show Patterns Button */}
            {bodyMarkers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShowPatterns}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Analyze Patterns →
                </motion.button>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Your Body Pattern Analysis
            </h2>

            {/* Emotion Summary */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Emotion Distribution:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {emotions.map((emotion) => {
                  const count = patterns.emotionCounts[emotion.id] || 0;
                  const percent = patterns.percentages[emotion.id] || 0;
                  const Icon = emotion.icon;
                  
                  return (
                    <div key={emotion.id} className={`${emotion.bgColor} rounded-xl p-4 border-2 ${emotion.borderColor}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`w-6 h-6 ${emotion.textColor}`} />
                        <span className={`font-bold ${emotion.textColor}`}>
                          {emotion.label}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-gray-800 mb-1">
                        {count} marker{count !== 1 ? 's' : ''}
                      </div>
                      <div className="text-sm text-gray-600">
                        {percent.toFixed(0)}% of total
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pattern Analysis */}
            <div className={`mb-6 rounded-xl p-6 border-2 ${
              patterns.patternType === 'stress' 
                ? 'bg-red-50 border-red-200'
                : patterns.patternType === 'fatigue'
                ? 'bg-orange-50 border-orange-200'
                : patterns.patternType === 'calm'
                ? 'bg-green-50 border-green-200'
                : 'bg-purple-50 border-purple-200'
            }`}>
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Pattern Analysis
              </h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {patterns.pattern}
                </p>
              </div>
            </div>

            {/* Body Area Analysis */}
            <div className="mb-6 bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Body Area Distribution:
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Upper Body</p>
                  <p className="text-2xl font-bold text-blue-700">{patterns.upperBody} markers</p>
                  <p className="text-xs text-gray-500">Head, neck, shoulders, chest, upper back</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Lower Body</p>
                  <p className="text-2xl font-bold text-blue-700">{patterns.lowerBody} markers</p>
                  <p className="text-xs text-gray-500">Stomach, lower back, legs, feet</p>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="mb-6 bg-indigo-50 rounded-xl p-6 border-2 border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-900 mb-3">
                What This Means:
              </h3>
              <ul className="space-y-2 text-indigo-800">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span><strong>Body awareness</strong> helps you recognize stress and energy patterns before they become overwhelming. When you notice tension in your shoulders, you can take a moment to breathe and release it.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span><strong>Physical sensations</strong> are signals from your body about your emotional state. Tension often indicates stress, fatigue suggests exhaustion, and calm shows areas of ease.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span><strong>Pattern recognition</strong> helps you anticipate when you need self-care. If you notice tension building in your neck during the day, you can take proactive steps to manage it.</span>
                </li>
              </ul>
            </div>

            {/* Complete Button */}
            <div className="flex justify-center mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGameOver(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Complete Mood Map
              </motion.button>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-900 mb-2">
                💡 Teacher Tip:
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                Use body-awareness pauses between classes. Take 30 seconds to scan your body: Where do you feel tension? Where do you feel calm? This quick check-in helps you recognize stress patterns early and take action before they build up. You can do a body scan while walking between classes, during a bathroom break, or while taking a sip of water. This practice builds body awareness and helps you respond to stress signals proactively.
              </p>
            </div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default MoodMap;

