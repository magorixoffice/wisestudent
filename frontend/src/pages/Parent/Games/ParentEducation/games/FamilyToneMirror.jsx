import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Mic, Square, Volume2, CheckCircle, AlertCircle, Heart } from "lucide-react";
import { toast } from "react-hot-toast";

const FamilyToneMirror = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-63";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [toneAnalysis, setToneAnalysis] = useState(null);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  // Scenarios with sentences to practice
  const scenarios = [
    {
      id: 1,
      title: "Setting a Boundary",
      situation: "Practice saying this with a gentle but firm tone:",
      sentence: "I understand you want to keep playing, but it's time to start your homework now.",
      idealTone: "gentle",
      whyItMatters: "A gentle but firm tone maintains connection while setting clear boundaries. It shows respect for your child while honoring your needs."
    },
    {
      id: 2,
      title: "Acknowledging Feelings",
      situation: "Practice saying this with warmth and understanding:",
      sentence: "I can see you're really upset about that. Want to tell me more about how you're feeling?",
      idealTone: "gentle",
      whyItMatters: "A warm, gentle tone creates safety for emotional expression. Children feel heard and understood when your voice matches your empathy."
    },
    {
      id: 3,
      title: "Expressing Disappointment",
      situation: "Practice saying this with calmness, not harshness:",
      sentence: "I'm disappointed that the room wasn't cleaned as we agreed. Let's talk about what happened.",
      idealTone: "neutral",
      whyItMatters: "A neutral, calm tone communicates your feelings without shaming. It opens dialogue instead of creating defensiveness."
    },
    {
      id: 4,
      title: "Offering Support",
      situation: "Practice saying this with genuine care and encouragement:",
      sentence: "That sounds really challenging. I'm here to help you figure it out. What do you think might work?",
      idealTone: "gentle",
      whyItMatters: "A caring, gentle tone invites collaboration and problem-solving. It shows your child they're not alone in facing challenges."
    },
    {
      id: 5,
      title: "Staying Calm Under Stress",
      situation: "Practice saying this calmly even when you feel frustrated:",
      sentence: "I can see we're both feeling stressed right now. Let's take a few deep breaths together.",
      idealTone: "gentle",
      whyItMatters: "Modeling calmness under stress teaches emotional regulation. Your calm tone becomes your child's anchor in difficult moments."
    }
  ];

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      stopRecording();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Set up audio analysis
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        analyzeTone(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setToneAnalysis(null);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, 30000);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const analyzeTone = async (blob) => {
    try {
      // Create audio element to analyze
      const audio = new Audio();
      const url = URL.createObjectURL(blob);
      audio.src = url;

      await new Promise((resolve, reject) => {
        audio.onloadedmetadata = resolve;
        audio.onerror = reject;
      });

      // Set up Web Audio API for analysis
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Analyze audio characteristics
      const channelData = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;
      const duration = audioBuffer.duration;
      
      // Calculate average volume (RMS)
      let sumSquares = 0;
      for (let i = 0; i < channelData.length; i++) {
        sumSquares += channelData[i] * channelData[i];
      }
      const rms = Math.sqrt(sumSquares / channelData.length);
      const averageVolume = Math.min(rms * 100, 100); // Scale to 0-100

      // Calculate dynamic range (difference between loudest and quietest)
      let max = 0;
      let min = 0;
      for (let i = 0; i < channelData.length; i++) {
        if (channelData[i] > max) max = channelData[i];
        if (channelData[i] < min) min = channelData[i];
      }
      const dynamicRange = (max - min) * 100;

      // Estimate pitch (fundamental frequency) - simplified version
      const autocorrelation = [];
      const minPeriod = Math.floor(sampleRate / 400); // ~400Hz max
      const maxPeriod = Math.floor(sampleRate / 80); // ~80Hz min
      
      let maxCorrelation = 0;
      let estimatedPeriod = 0;
      
      for (let lag = minPeriod; lag < maxPeriod && lag < channelData.length / 2; lag++) {
        let correlation = 0;
        for (let i = 0; i < channelData.length - lag; i++) {
          correlation += channelData[i] * channelData[i + lag];
        }
        if (correlation > maxCorrelation) {
          maxCorrelation = correlation;
          estimatedPeriod = lag;
        }
      }
      
      const estimatedPitch = estimatedPeriod > 0 ? sampleRate / estimatedPeriod : 0;
      const normalizedPitch = Math.min((estimatedPitch - 80) / (400 - 80) * 100, 100); // Normalize 80-400Hz to 0-100

      // Determine tone based on characteristics
      // Gentle: Lower volume, lower pitch, more dynamic range (softer)
      // Harsh: Higher volume, higher pitch, less dynamic range (sharp)
      // Neutral: Moderate everything
      
      let detectedTone = "neutral";
      let toneScore = 50;
      let confidence = "medium";

      // Volume analysis (gentle = lower, harsh = higher)
      const volumeScore = averageVolume;
      
      // Pitch analysis (gentle = lower, harsh = higher)
      const pitchScore = normalizedPitch;
      
      // Dynamic range (gentle = more variation, harsh = less variation)
      const variationScore = dynamicRange;

      // Combined analysis
      const harshnessScore = (volumeScore * 0.4) + (pitchScore * 0.4) + ((100 - variationScore) * 0.2);
      
      if (harshnessScore >= 65) {
        detectedTone = "harsh";
        toneScore = harshnessScore;
        confidence = harshnessScore >= 75 ? "high" : "medium";
      } else if (harshnessScore <= 40) {
        detectedTone = "gentle";
        toneScore = 100 - harshnessScore;
        confidence = harshnessScore <= 30 ? "high" : "medium";
      } else {
        detectedTone = "neutral";
        toneScore = 50 + (50 - Math.abs(50 - harshnessScore));
        confidence = Math.abs(harshnessScore - 50) <= 10 ? "high" : "medium";
      }

      // Check if it matches the ideal tone for this scenario
      const current = scenarios[currentScenario];
      const matchesIdeal = (current.idealTone === "gentle" && (detectedTone === "gentle" || detectedTone === "neutral")) ||
                          (current.idealTone === "neutral" && (detectedTone === "neutral" || detectedTone === "gentle"));

      // Lower the threshold for scoring to make it easier
      if (matchesIdeal && toneScore >= 45) {
        setScore(prev => prev + 1);
      }

      setToneAnalysis({
        tone: detectedTone,
        score: Math.round(toneScore),
        confidence,
        volume: Math.round(averageVolume),
        pitch: Math.round(estimatedPitch),
        dynamicRange: Math.round(dynamicRange),
        matchesIdeal,
        idealTone: current.idealTone
      });

      URL.revokeObjectURL(url);
      audioContext.close();

    } catch (error) {
      console.error('Error analyzing tone:', error);
      toast.error('Error analyzing your recording. Please try again.');
      
      // Fallback: Simple analysis based on recording duration
      setToneAnalysis({
        tone: "neutral",
        score: 50,
        confidence: "low",
        volume: 50,
        pitch: 200,
        dynamicRange: 50,
        matchesIdeal: false,
        idealTone: scenarios[currentScenario].idealTone,
        error: "Analysis incomplete"
      });
    }
  };

  const handleRetry = () => {
    setToneAnalysis(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };

  const handleNext = () => {
    handleRetry();
    if (currentScenario < totalLevels - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentScenario(0);
    handleRetry();
    setScore(0);
    setShowGameOver(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showGameOver) {
    const allCorrect = score === totalLevels;

    return (
      <ParentGameShell
        title={gameData?.title || "Family Tone Mirror"}
        subtitle="Practice Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={allCorrect}
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
                🎤
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Tone Practice Complete!</h2>
              <p className="text-lg text-gray-600 mb-6">
                You've practiced observing and improving your communication tone.
              </p>
            </div>

            {/* Results Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Results Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white rounded-lg p-4">
                  <span className="text-gray-700">Gentle/Neutral Tone Responses:</span>
                  <span className="font-bold text-green-600">{score} / {totalLevels}</span>
                </div>
              </div>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Speak softer; the human heart opens to calm voices first. When you observe and improve your tone, you're becoming more aware of how your voice affects your children. A gentle, calm tone creates safety and connection. It communicates respect, care, and emotional regulation. Your children learn to speak gently by hearing you speak gently. When you speak softer and with more awareness, you're not just communicating words—you're communicating presence, love, and respect. Practice makes progress; every moment you choose a calm tone is a moment you're teaching your children the power of gentle communication.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  const currentScenarioData = scenarios[currentScenario];

  return (
    <ParentGameShell
      title={gameData?.title || "Family Tone Mirror"}
      subtitle={`Practice ${currentScenario + 1} of ${totalLevels}: ${currentScenarioData.title}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentScenario + 1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={currentScenario}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Scenario Context */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{currentScenarioData.title}</h3>
            <p className="text-gray-600 mb-4">{currentScenarioData.situation}</p>
          </div>

          {/* Sentence to Practice */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
            <div className="bg-white rounded-lg p-6 border border-blue-200">
              <p className="text-xl text-gray-800 leading-relaxed text-center italic font-medium">
                "{currentScenarioData.sentence}"
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-4 text-center">
              Ideal tone: <span className="font-semibold capitalize">{currentScenarioData.idealTone}</span>
            </p>
          </div>

          {!toneAnalysis ? (
            /* Recording Section */
            <div className="space-y-6">
              {/* Recording Controls */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 border-2 border-purple-200">
                <div className="flex flex-col items-center justify-center">
                  {!isRecording ? (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg mb-6 cursor-pointer"
                        onClick={startRecording}
                      >
                        <Mic className="w-12 h-12 text-white" />
                      </motion.div>
                      <p className="text-gray-700 font-medium text-center">
                        Click the microphone to start recording
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Speak the sentence naturally. Recording will auto-stop after 30 seconds.
                      </p>
                    </>
                  ) : (
                    <>
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-24 h-24 bg-gradient-to-br from-red-600 to-pink-700 rounded-full flex items-center justify-center shadow-lg mb-6"
                      >
                        <Mic className="w-12 h-12 text-white" />
                      </motion.div>
                      <div className="text-3xl font-mono font-bold text-red-600 mb-4">
                        {formatTime(recordingTime)}
                      </div>
                      <p className="text-gray-700 font-medium text-center mb-4">
                        Recording in progress...
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={stopRecording}
                        className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md flex items-center gap-2"
                      >
                        <Square className="w-5 h-5" />
                        Stop Recording
                      </motion.button>
                    </>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800 font-medium">
                  <strong>📋 Instructions:</strong> Click the microphone, then speak the sentence above in your natural voice. Try to match the ideal tone—gentle for warmth and understanding, neutral for calm communication.
                </p>
              </div>
            </div>
          ) : (
            /* Tone Analysis Results */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Audio Playback */}
              {audioUrl && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                  <div className="flex items-center justify-center gap-4">
                    <audio controls src={audioUrl} className="flex-1 max-w-md" />
                  </div>
                </div>
              )}

              {/* Tone Analysis Display */}
              <div className={`bg-gradient-to-br rounded-xl p-6 border-2 ${
                toneAnalysis.tone === 'gentle'
                  ? 'from-green-50 to-emerald-50 border-green-200'
                  : toneAnalysis.tone === 'harsh'
                  ? 'from-red-50 to-rose-50 border-red-200'
                  : 'from-blue-50 to-indigo-50 border-blue-200'
              }`}>
                <div className="flex items-center justify-center gap-3 mb-4">
                  {toneAnalysis.matchesIdeal ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-orange-600" />
                  )}
                  <h4 className="text-2xl font-bold text-gray-800 capitalize">
                    Detected Tone: {toneAnalysis.tone}
                  </h4>
                </div>

                {/* Tone Score */}
                <div className="text-center mb-6">
                  <div className={`text-5xl font-bold mb-2 ${
                    toneAnalysis.score >= 70 ? 'text-green-600' 
                    : toneAnalysis.score >= 50 ? 'text-blue-600'
                    : 'text-red-600'
                  }`}>
                    {toneAnalysis.score}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${toneAnalysis.score}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-4 rounded-full ${
                        toneAnalysis.score >= 70 ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                        : toneAnalysis.score >= 50 ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                        : 'bg-gradient-to-r from-red-500 to-rose-600'
                      }`}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Confidence: {toneAnalysis.confidence}
                    {toneAnalysis.matchesIdeal && (
                      <span className="text-green-600 font-semibold ml-2">✓ Matches Ideal Tone</span>
                    )}
                  </p>
                </div>

                {/* Detailed Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600 mb-1">Volume</p>
                    <p className="text-lg font-bold text-gray-800">{toneAnalysis.volume}%</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600 mb-1">Pitch</p>
                    <p className="text-lg font-bold text-gray-800">{toneAnalysis.pitch} Hz</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600 mb-1">Variation</p>
                    <p className="text-lg font-bold text-gray-800">{toneAnalysis.dynamicRange}%</p>
                  </div>
                </div>

                {/* Feedback */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700">
                    {toneAnalysis.tone === 'gentle' && "Great! Your tone is gentle and warm. This creates safety and connection."}
                    {toneAnalysis.tone === 'neutral' && "Good! Your tone is neutral and calm. This is effective for clear communication."}
                    {toneAnalysis.tone === 'harsh' && "Your tone detected as more sharp or loud. Try speaking softer, slower, and with more warmth. Practice taking a breath before speaking."}
                  </p>
                  {toneAnalysis.matchesIdeal && (
                    <p className="text-green-600 font-semibold mt-2">
                      ✓ Your tone matches the ideal for this scenario!
                    </p>
                  )}
                </div>
              </div>

              {/* Why It Matters */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
                <p className="text-sm text-gray-700">
                  <strong>💡 Why It Matters:</strong> {currentScenarioData.whyItMatters}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRetry}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-gray-300 transition-all"
                >
                  Try Again
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {currentScenario < totalLevels - 1 ? 'Next Practice' : 'View Results'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Speak softer; the human heart opens to calm voices first. When you observe and improve your tone, you're teaching your children the power of gentle communication.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default FamilyToneMirror;

