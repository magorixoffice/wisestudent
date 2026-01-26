import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Play, Pause, Volume2, UtensilsCrossed, Sparkles, Heart, Smile, CheckCircle } from "lucide-react";

const MindfulMealMoment = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-48";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentSession, setCurrentSession] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [stepCompleted, setStepCompleted] = useState(false);
  const [reflections, setReflections] = useState({});
  const [showReflection, setShowReflection] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  const timerRef = useRef(null);

  // Meal session scenarios
  const sessions = [
    {
      id: 1,
      title: "Breakfast Mindfulness",
      description: "Practice mindful eating during breakfast. Follow the audio guide to experience eating as a calming, sensory ritual.",
      context: "Morning meal—start your day with presence. Let each bite be an opportunity for awareness and gratitude.",
      steps: [
        {
          id: 'prepare',
          label: "PREPARE",
          instruction: "Before eating, take a moment to prepare",
          voicePrompt: "Before you begin eating, take three deep breaths. Notice the food in front of you. What colors do you see? What shapes? Prepare yourself to eat mindfully.",
          duration: 10,
          icon: Heart,
          color: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-300",
          emoji: "🧘"
        },
        {
          id: 'smell',
          label: "SMELL",
          instruction: "Smell your food with full awareness",
          voicePrompt: "Bring the food close to your nose. Take a deep breath in. Notice the aromas. What do you smell? Let the scent fill your awareness. Smelling prepares your body for digestion and deepens your appreciation.",
          duration: 10,
          icon: Sparkles,
          color: "from-purple-500 to-pink-500",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-300",
          emoji: "👃"
        },
        {
          id: 'first-bite',
          label: "FIRST BITE",
          instruction: "Take your first bite with full presence",
          voicePrompt: "Take your first bite. Notice the temperature, the texture, the initial taste. Don't rush. Simply notice. This first bite sets the tone for the entire meal.",
          duration: 10,
          icon: UtensilsCrossed,
          color: "from-green-500 to-emerald-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-300",
          emoji: "🍽️"
        },
        {
          id: 'chew',
          label: "CHEW SLOWLY",
          instruction: "Chew slowly and mindfully",
          voicePrompt: "Chew slowly. Count to twenty if it helps. Notice how the texture changes as you chew. Notice how the flavors develop and change. Chewing slowly aids digestion and helps you truly taste your food.",
          duration: 10,
          icon: Heart,
          color: "from-orange-500 to-amber-500",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-300",
          emoji: "🦷"
        },
        {
          id: 'appreciate',
          label: "APPRECIATE",
          instruction: "Appreciate the food and the moment",
          voicePrompt: "As you continue eating, appreciate each bite. Appreciate the nourishment, the flavors, the moment. Eating mindfully is a gift to your body and mind. Continue eating with this awareness until you're satisfied.",
          duration: 10,
          icon: Heart,
          color: "from-pink-500 to-rose-500",
          bgColor: "bg-pink-50",
          borderColor: "border-pink-300",
          emoji: "💚"
        }
      ],
      parentTip: "Mindful meals improve digestion and reduce irritability. When you eat with awareness, you digest better, feel more satisfied, and arrive at the next moment with less stress. Try practicing this with your child—mindful eating together creates connection and calm."
    },
    {
      id: 2,
      title: "Lunch Mindfulness",
      description: "Practice mindful eating during lunch. Follow the audio guide step by step.",
      context: "Midday meal—use this time to reset and restore. Let lunch be a moment of presence in your busy day.",
      steps: [
        {
          id: 'prepare',
          label: "PREPARE",
          instruction: "Prepare for mindful eating",
          voicePrompt: "Take a moment before you begin. Three deep breaths. Look at your food. Notice what's in front of you. Set the intention to eat mindfully, with full awareness.",
          duration: 10,
          icon: Heart,
          color: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-300",
          emoji: "🧘"
        },
        {
          id: 'smell',
          label: "SMELL",
          instruction: "Take time to smell your food",
          voicePrompt: "Bring the food to your nose. Breathe in the aromas. Notice the different scents. Smelling activates your digestive system and deepens your connection to the food.",
          duration: 10,
          icon: Sparkles,
          color: "from-purple-500 to-pink-500",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-300",
          emoji: "👃"
        },
        {
          id: 'first-bite',
          label: "FIRST BITE",
          instruction: "Savor the first bite",
          voicePrompt: "Take your first bite. Notice everything—temperature, texture, initial taste. Don't rush to the next bite. Simply be present with this one.",
          duration: 10,
          icon: UtensilsCrossed,
          color: "from-green-500 to-emerald-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-300",
          emoji: "🍽️"
        },
        {
          id: 'chew',
          label: "CHEW SLOWLY",
          instruction: "Chew mindfully and slowly",
          voicePrompt: "Chew slowly. Count your chews. Notice how the food changes in your mouth. Notice the release of flavors. Chewing slowly helps digestion and helps you feel more satisfied with less food.",
          duration: 10,
          icon: Heart,
          color: "from-orange-500 to-amber-500",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-300",
          emoji: "🦷"
        },
        {
          id: 'appreciate',
          label: "APPRECIATE",
          instruction: "Continue eating with appreciation",
          voicePrompt: "Continue eating with this same mindful awareness. Appreciate each bite. Appreciate the nourishment, the moment, the ritual of eating. Mindful eating transforms meals into meditative moments.",
          duration: 10,
          icon: Heart,
          color: "from-pink-500 to-rose-500",
          bgColor: "bg-pink-50",
          borderColor: "border-pink-300",
          emoji: "💚"
        }
      ],
      parentTip: "When you eat mindfully, you digest better and feel more satisfied. This reduces post-meal irritability and helps you approach parenting moments with more calm and patience."
    },
    {
      id: 3,
      title: "Dinner Mindfulness",
      description: "Practice mindful eating during dinner. Experience eating as a calming ritual.",
      context: "Evening meal—end your day with presence. Let dinner be a time of connection and calm.",
      steps: [
        {
          id: 'prepare',
          label: "PREPARE",
          instruction: "Prepare your mind and body for mindful eating",
          voicePrompt: "Before eating, pause. Take three deep breaths. Look at your plate. Notice the colors, the arrangement, the care that went into preparing this meal. Set your intention for mindful eating.",
          duration: 10,
          icon: Heart,
          color: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-300",
          emoji: "🧘"
        },
        {
          id: 'smell',
          label: "SMELL",
          instruction: "Engage your sense of smell fully",
          voicePrompt: "Bring your food close. Take a deep breath in through your nose. What do you smell? Notice the layers of aromas. Smelling is the first step in mindful eating—it prepares your body and awakens your appreciation.",
          duration: 10,
          icon: Sparkles,
          color: "from-purple-500 to-pink-500",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-300",
          emoji: "👃"
        },
        {
          id: 'first-bite',
          label: "FIRST BITE",
          instruction: "Be fully present with your first bite",
          voicePrompt: "Take your first bite. Place it in your mouth. Don't chew yet—just notice. Notice the temperature, the texture, the first impression of taste. This first bite is a sacred moment—be fully present with it.",
          duration: 10,
          icon: UtensilsCrossed,
          color: "from-green-500 to-emerald-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-300",
          emoji: "🍽️"
        },
        {
          id: 'chew',
          label: "CHEW SLOWLY",
          instruction: "Chew with complete awareness",
          voicePrompt: "Now begin to chew. Chew slowly. Count to twenty or thirty. Notice how the texture transforms. Notice how flavors emerge and change. Chewing slowly is an act of mindfulness—it's how you truly experience your food.",
          duration: 10,
          icon: Heart,
          color: "from-orange-500 to-amber-500",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-300",
          emoji: "🦷"
        },
        {
          id: 'appreciate',
          label: "APPRECIATE",
          instruction: "Continue with appreciation and presence",
          voicePrompt: "Continue eating with this same mindful presence. Appreciate each bite. Appreciate the nourishment your body receives. Appreciate this moment of calm in your day. Mindful eating is a practice—continue it throughout your meal.",
          duration: 10,
          icon: Heart,
          color: "from-pink-500 to-rose-500",
          bgColor: "bg-pink-50",
          borderColor: "border-pink-300",
          emoji: "💚"
        }
      ],
      parentTip: "Mindful meals improve digestion because your body can properly process food when you're calm and present. This reduces physical discomfort and emotional irritability, making you more patient and present with your child."
    },
    {
      id: 4,
      title: "Snack Mindfulness",
      description: "Practice mindful eating even with a small snack. Every eating moment can be mindful.",
      context: "A small snack—practice mindfulness with whatever you eat, no matter how small the portion.",
      steps: [
        {
          id: 'prepare',
          label: "PREPARE",
          instruction: "Prepare to eat mindfully",
          voicePrompt: "Even with a snack, take a moment to prepare. Breathe. Look at what you're about to eat. Set the intention to eat with awareness, not just consume.",
          duration: 10,
          icon: Heart,
          color: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-300",
          emoji: "🧘"
        },
        {
          id: 'smell',
          label: "SMELL",
          instruction: "Notice the aroma",
          voicePrompt: "Take a moment to smell your snack. Notice the aroma. Even a small snack has a scent—notice it. This act of noticing transforms eating from automatic to intentional.",
          duration: 10,
          icon: Sparkles,
          color: "from-purple-500 to-pink-500",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-300",
          emoji: "👃"
        },
        {
          id: 'first-bite',
          label: "FIRST BITE",
          instruction: "Savor the first bite",
          voicePrompt: "Take your first bite. Notice everything. The texture, the taste, the temperature. Even a small snack deserves your full attention.",
          duration: 10,
          icon: UtensilsCrossed,
          color: "from-green-500 to-emerald-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-300",
          emoji: "🍽️"
        },
        {
          id: 'chew',
          label: "CHEW SLOWLY",
          instruction: "Chew with awareness",
          voicePrompt: "Chew slowly. Notice each chew. Notice how the food changes. Even quick snacks benefit from mindful chewing. Your body and mind appreciate the attention.",
          duration: 10,
          icon: Heart,
          color: "from-orange-500 to-amber-500",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-300",
          emoji: "🦷"
        },
        {
          id: 'appreciate',
          label: "APPRECIATE",
          instruction: "Appreciate the moment",
          voicePrompt: "Continue eating with appreciation. Every eating moment, no matter how small, can be a moment of mindfulness. Appreciate the food, the moment, the practice of awareness.",
          duration: 10,
          icon: Heart,
          color: "from-pink-500 to-rose-500",
          bgColor: "bg-pink-50",
          borderColor: "border-pink-300",
          emoji: "💚"
        }
      ],
      parentTip: "Mindful eating can happen at any meal or snack. When you practice awareness during eating, you reduce irritability because your body digests better and your mind feels more satisfied. Share this practice with your child—mindful eating together creates calm."
    },
    {
      id: 5,
      title: "Family Meal Mindfulness",
      description: "Practice mindful eating during a family meal. Share the practice with your child.",
      context: "A family meal—practice mindful eating together. Model presence and appreciation for your child.",
      steps: [
        {
          id: 'prepare',
          label: "PREPARE",
          instruction: "Prepare together for mindful eating",
          voicePrompt: "Before eating, invite everyone to take three deep breaths together. Look at the food. Notice what's on the table. Set the intention to eat mindfully as a family.",
          duration: 10,
          icon: Heart,
          color: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-300",
          emoji: "🧘"
        },
        {
          id: 'smell',
          label: "SMELL",
          instruction: "Smell the food together",
          voicePrompt: "Invite everyone to smell their food. Take a deep breath in together. Notice the aromas. Share what you notice. Smelling together creates connection and awareness.",
          duration: 10,
          icon: Sparkles,
          color: "from-purple-500 to-pink-500",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-300",
          emoji: "👃"
        },
        {
          id: 'first-bite',
          label: "FIRST BITE",
          instruction: "Take the first bite together",
          voicePrompt: "Take your first bite together. Notice everything. Share what you notice—the taste, the texture. Eating mindfully together transforms meals into moments of connection and calm.",
          duration: 10,
          icon: UtensilsCrossed,
          color: "from-green-500 to-emerald-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-300",
          emoji: "🍽️"
        },
        {
          id: 'chew',
          label: "CHEW SLOWLY",
          instruction: "Chew slowly and mindfully together",
          voicePrompt: "Chew slowly. Count your chews if it helps. Notice how the food changes. When you eat mindfully together, you model presence for your child. They learn that eating can be calm and intentional.",
          duration: 10,
          icon: Heart,
          color: "from-orange-500 to-amber-500",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-300",
          emoji: "🦷"
        },
        {
          id: 'appreciate',
          label: "APPRECIATE",
          instruction: "Continue with appreciation",
          voicePrompt: "Continue eating with this mindful awareness. Appreciate the food, the company, the moment. When families eat mindfully together, meals become rituals of connection. This improves digestion, reduces irritability, and deepens bonds.",
          duration: 10,
          icon: Heart,
          color: "from-pink-500 to-rose-500",
          bgColor: "bg-pink-50",
          borderColor: "border-pink-300",
          emoji: "💚"
        }
      ],
      parentTip: "Mindful meals improve digestion and reduce irritability for the whole family. When you practice mindful eating together, you create a ritual of calm. Your child learns to eat with awareness, which improves their digestion and emotional regulation too. Mindful meals become family moments of presence and connection."
    }
  ];

  const currentSessionData = sessions[currentSession];
  const currentStepData = currentSessionData?.steps[currentStep];

  // Text-to-speech for voice prompts
  const speakPrompt = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start a step
  const startStep = () => {
    if (currentStepData) {
      setIsPlaying(true);
      setTimeRemaining(currentStepData.duration);
      setStepCompleted(false);
      speakPrompt(currentStepData.voicePrompt);
    }
  };

  // Handle step timer
  useEffect(() => {
    if (!isPlaying || timeRemaining <= 0) {
      if (isPlaying && timeRemaining === 0) {
        setStepCompleted(true);
        setIsPlaying(false);
      }
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, timeRemaining]);

  // Handle next step
  const handleNextStep = () => {
    if (currentStep < currentSessionData.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setTimeRemaining(0);
      setStepCompleted(false);
      setIsPlaying(false);
    } else {
      // All steps complete, show reflection
      setShowReflection(true);
    }
  };

  // Handle reflection submission
  const handleReflectionSubmit = (reflectionData) => {
    const sessionKey = `session${currentSession}`;
    setReflections(prev => ({
      ...prev,
      [sessionKey]: reflectionData
    }));
    
    setScore(prev => prev + 1);
    
    setTimeout(() => {
      if (currentSession < sessions.length - 1) {
        setCurrentSession(prev => prev + 1);
        setCurrentStep(0);
        setShowReflection(false);
        setIsPlaying(false);
        setTimeRemaining(0);
        setStepCompleted(false);
      } else {
        setShowGameOver(true);
      }
    }, 1500);
  };

  const progress = ((currentSession + 1) / totalLevels) * 100;
  const StepIcon = currentStepData?.icon || Heart;

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Mindful Meal Moment"}
        subtitle="Practice Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={score >= totalLevels * 0.8}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Mindful Meal Practice Mastered!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've learned to experience eating as a calming, sensory ritual. Remember: mindful meals improve digestion and reduce irritability.
            </p>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> Mindful meals improve digestion and reduce irritability. When you eat with awareness, you digest better, feel more satisfied, and arrive at the next moment with less stress. Practice this with your child—mindful eating together creates connection and calm. Meals become rituals of presence, not just consumption.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Mindful Meal Moment"}
      subtitle={`Session ${currentSession + 1} of ${totalLevels}: ${currentSessionData.title}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentSession + 1}
    >
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <motion.div
          key={`${currentSession}-${currentStep}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Session {currentSession + 1} of {totalLevels}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-orange-600 to-amber-600 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Session context */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 mb-6 border-2 border-orange-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{currentSessionData.title}</h3>
            <p className="text-gray-700 mb-2">{currentSessionData.description}</p>
            <p className="text-sm text-gray-600 italic mb-3">{currentSessionData.context}</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                <strong>💡 Parent Tip:</strong> {currentSessionData.parentTip}
              </p>
            </div>
          </div>

          {!showReflection && (
            <>
              {/* Step progress */}
              <div className="mb-6 text-center">
                <p className="text-sm text-gray-600">
                  Step {currentStep + 1} of {currentSessionData.steps.length}
                </p>
                <div className="flex justify-center gap-2 mt-2">
                  {currentSessionData.steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-8 rounded-full ${
                        index < currentStep
                          ? 'bg-green-500'
                          : index === currentStep
                          ? 'bg-orange-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {!isPlaying && !stepCompleted && (
                /* Step start screen */
                <div className="text-center space-y-6">
                  <div className={`bg-gradient-to-br ${currentStepData.bgColor} rounded-xl p-8 border-2 ${currentStepData.borderColor}`}>
                    <div className="text-6xl mb-4">{currentStepData.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentStepData.label}</h3>
                    <p className="text-lg text-gray-700 mb-6">{currentStepData.instruction}</p>
                    <div className="bg-white/60 rounded-lg p-4 mb-6">
                      <p className="text-sm text-gray-700 italic">
                        The audio guide will guide you through this step. Follow along as you eat.
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startStep}
                      className={`bg-gradient-to-r ${currentStepData.color} text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 mx-auto`}
                    >
                      <Play className="w-6 h-6" />
                      Start Audio Guide
                    </motion.button>
                  </div>
                </div>
              )}

              {isPlaying && (
                /* Step in progress */
                <div className="text-center space-y-6">
                  <div className={`bg-gradient-to-br ${currentStepData.bgColor} rounded-xl p-8 border-2 ${currentStepData.borderColor}`}>
                    <div className="text-6xl mb-4">{currentStepData.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentStepData.label}</h3>
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-gray-800 mb-2">
                        {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                      </div>
                      <p className="text-sm text-gray-600">time remaining</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-4 mb-6">
                      <p className="text-sm text-gray-700">
                        <Volume2 className="w-4 h-4 inline mr-2" />
                        Follow the audio guide as you eat
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsPlaying(false);
                        window.speechSynthesis.cancel();
                      }}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      <Pause className="w-5 h-5 inline mr-2" />
                      Pause
                    </motion.button>
                  </div>
                </div>
              )}

              {stepCompleted && !isPlaying && (
                /* Step completed */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-300">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Step Complete!</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNextStep}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                    >
                      {currentStep < currentSessionData.steps.length - 1 ? 'Next Step' : 'Complete Meal & Reflect'}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {showReflection && (
            /* Reflection form */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                  Reflect on Your Mindful Meal
                </h3>
                <MealReflectionForm
                  onSubmit={handleReflectionSubmit}
                  sessionTitle={currentSessionData.title}
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

// Reflection form component
const MealReflectionForm = ({ onSubmit, sessionTitle }) => {
  const [tasteReflection, setTasteReflection] = useState("");
  const [emotionReflection, setEmotionReflection] = useState("");
  const [calmRating, setCalmRating] = useState(null);

  const handleSubmit = () => {
    if (tasteReflection.trim().length >= 10 && emotionReflection.trim().length >= 10 && calmRating) {
      onSubmit({
        taste: tasteReflection,
        emotion: emotionReflection,
        calmRating: calmRating
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          What did you notice about the taste and flavors? (Minimum 10 characters)
        </label>
        <textarea
          value={tasteReflection}
          onChange={(e) => setTasteReflection(e.target.value)}
          placeholder="Describe what you noticed about the tastes, textures, and flavors during your mindful meal..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
          rows={4}
        />
        <p className="text-xs text-gray-500 mt-1">{tasteReflection.length} characters</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          How did mindful eating affect your emotions? (Minimum 10 characters)
        </label>
        <textarea
          value={emotionReflection}
          onChange={(e) => setEmotionReflection(e.target.value)}
          placeholder="How did you feel during and after the mindful meal? What emotions did you notice?"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
          rows={4}
        />
        <p className="text-xs text-gray-500 mt-1">{emotionReflection.length} characters</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 mb-4">
          How calm do you feel now? (Rate 1-5)
        </label>
        <div className="grid grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((rating) => (
            <motion.button
              key={rating}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCalmRating(rating)}
              className={`aspect-square rounded-lg border-2 font-bold text-lg transition-all ${
                calmRating === rating
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-500 text-white shadow-lg scale-110'
                  : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-300 text-gray-700 hover:shadow-md cursor-pointer'
              }`}
            >
              {rating}
            </motion.button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Not calm</span>
          <span>Very calm</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={tasteReflection.trim().length < 10 || emotionReflection.trim().length < 10 || !calmRating}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Reflection
      </motion.button>
    </div>
  );
};

export default MindfulMealMoment;

