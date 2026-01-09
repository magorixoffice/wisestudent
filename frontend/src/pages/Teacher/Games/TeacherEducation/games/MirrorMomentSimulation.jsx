import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Volume2, VolumeX, MessageCircle, Heart, Coffee, BookOpen, Music, TreePine, Sparkles } from "lucide-react";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";

const MirrorMomentSimulation = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-8";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [currentSession, setCurrentSession] = useState(0);
  const [userMessage, setUserMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSelfCare, setShowSelfCare] = useState(false);
  const [selectedSelfCare, setSelectedSelfCare] = useState(null);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [speechSynth, setSpeechSynth] = useState(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      setSpeechSynth(window.speechSynthesis);
    }

    // Initialize conversation with welcome message
    if (conversation.length === 0) {
      setConversation([{
        sender: 'mirror',
        message: "Hello. I'm here to listen. After a tough day, it's okay to feel what you're feeling. What's on your mind?",
        timestamp: new Date()
      }]);
    }
  }, []);

  // Self-care options
  const selfCareOptions = [
    {
      id: 1,
      title: "Take a Mindful Break",
      icon: TreePine,
      description: "Step outside for 5 minutes. Breathe fresh air and notice your surroundings.",
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-400"
    },
    {
      id: 2,
      title: "Write in a Journal",
      icon: BookOpen,
      description: "Spend 10 minutes writing freely about your day. No structure, just release.",
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-400"
    },
    {
      id: 3,
      title: "Listen to Calming Music",
      icon: Music,
      description: "Put on your favorite calming playlist. Let the music help you decompress.",
      color: "from-purple-400 to-pink-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-400"
    },
    {
      id: 4,
      title: "Have a Warm Drink",
      icon: Coffee,
      description: "Make yourself a cup of tea or coffee. Sip slowly and savor the moment.",
      color: "from-orange-400 to-amber-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-400"
    },
    {
      id: 5,
      title: "Practice Self-Compassion",
      icon: Heart,
      description: "Repeat kind words to yourself: 'I did my best today. I'm learning and growing.'",
      color: "from-red-400 to-rose-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-400"
    },
    {
      id: 6,
      title: "Do Something Creative",
      icon: Sparkles,
      description: "Draw, color, or create something. Express yourself without judgment.",
      color: "from-indigo-400 to-violet-500",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-400"
    }
  ];

  // Generate empathetic AI response based on user input
  const generateEmpathyResponse = (userText) => {
    const lowerText = userText.toLowerCase();
    
    // Pattern matching for different emotion types
    if (lowerText.includes('guilty') || lowerText.includes('shame') || lowerText.includes('bad teacher') || lowerText.includes('failed')) {
      return {
        message: "I hear the weight of guilt and self-judgment. Teaching is incredibly demanding, and you're human. Every teacher has difficult days and moments they wish they handled differently. What matters is your willingness to reflect and grow. You're not a bad teacher—you're a teacher who cares deeply, and that's why this hurts.",
        emoji: "💙",
        tone: "forgiving"
      };
    }
    if (lowerText.includes('overwhelmed') || lowerText.includes('stressed') || lowerText.includes('too much') || lowerText.includes('exhausted') || lowerText.includes('burnout')) {
      return {
        message: "You're carrying so much right now. The workload, the expectations, the emotional demands—it's a lot. It makes complete sense that you feel overwhelmed. Taking this moment to express it is powerful. You're doing important work, and it's okay to acknowledge when it feels like too much.",
        emoji: "🌊",
        tone: "calming"
      };
    }
    if (lowerText.includes('frustrated') || lowerText.includes('angry') || lowerText.includes('mad') || lowerText.includes('annoyed')) {
      return {
        message: "Your frustration is valid. Teaching can be frustrating when things don't go as planned, when students don't respond, or when systems feel unfair. Anger often signals that something important to you feels threatened or ignored. Your feelings matter, and recognizing them is the first step.",
        emoji: "💪",
        tone: "supportive"
      };
    }
    if (lowerText.includes('sad') || lowerText.includes('down') || lowerText.includes('hurt') || lowerText.includes('disappointed')) {
      return {
        message: "I see your sadness, and I'm here with you. Teaching involves deep emotional investment, and when things don't go well, it can hurt. It takes courage to acknowledge difficult feelings. Remember that sadness is a natural response to disappointment or loss. You don't have to rush through it.",
        emoji: "🤗",
        tone: "compassionate"
      };
    }
    if (lowerText.includes('anxious') || lowerText.includes('worried') || lowerText.includes('nervous') || lowerText.includes('afraid')) {
      return {
        message: "Your anxiety is real, and I understand how heavy that feels. Teaching involves constant decision-making and uncertainty, which can trigger anxiety. You've taken a brave step by expressing it. Remember, this feeling will pass, and you have tools to support yourself through it.",
        emoji: "🦋",
        tone: "reassuring"
      };
    }
    if (lowerText.includes('lonely') || lowerText.includes('alone') || lowerText.includes('isolated') || lowerText.includes('unsupported')) {
      return {
        message: "Teaching can feel isolating, especially when you're dealing with challenges alone. Your need for connection and support is real and valid. Reaching out, even through words like this, is a step toward connection. You're not as alone as you might feel—many teachers experience this.",
        emoji: "🌟",
        tone: "connecting"
      };
    }
    if (lowerText.includes('tired') || lowerText.includes('drained') || lowerText.includes('empty') || lowerText.includes('worn out')) {
      return {
        message: "You've given so much today, and it's natural to feel drained. Teaching requires immense emotional and mental energy. Your exhaustion is a sign that you've been fully present for your students. It's okay to rest and recharge—you deserve it.",
        emoji: "🌙",
        tone: "nurturing"
      };
    }
    if (lowerText.includes('confused') || lowerText.includes('uncertain') || lowerText.includes('unsure') || lowerText.includes('lost')) {
      return {
        message: "It's okay to not have all the answers. Teaching is complex, and uncertainty is part of the journey. Acknowledging it shows wisdom rather than weakness. Trust that you're learning as you go, and that's exactly how it's meant to be.",
        emoji: "🧭",
        tone: "encouraging"
      };
    }
    if (lowerText.includes('grateful') || lowerText.includes('thankful') || lowerText.includes('blessed') || lowerText.includes('happy') || lowerText.includes('proud')) {
      return {
        message: "How beautiful that you're noticing moments of gratitude and joy. Celebrating these feelings strengthens them and helps you hold onto them during harder times. Thank you for sharing this light—it reminds us all of the good that exists even in challenging seasons.",
        emoji: "✨",
        tone: "celebrating"
      };
    }
    
    // Default empathetic response
    return {
      message: "Thank you for sharing what you're feeling. Expressing emotions, especially difficult ones, takes courage and self-awareness. Your feelings are valid, and giving them voice is a powerful act of self-care. You're not alone in this journey. I'm here to listen.",
      emoji: "💜",
      tone: "empathetic"
    };
  };

  const playAudio = (text) => {
    if (!speechSynth) return;

    speechSynth.cancel();
    setIsListening(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setIsListening(false);
    };

    utterance.onerror = () => {
      setIsListening(false);
    };

    speechSynth.speak(utterance);
  };

  const stopAudio = () => {
    if (speechSynth) {
      speechSynth.cancel();
      setIsListening(false);
    }
  };

  const handleSendMessage = () => {
    if (!userMessage.trim()) {
      alert("Please type or speak your feelings before sending.");
      return;
    }

    // Add user message to conversation
    const newUserMessage = {
      sender: 'user',
      message: userMessage.trim(),
      timestamp: new Date()
    };

    setConversation(prev => [...prev, newUserMessage]);
    setUserMessage("");
    setIsProcessing(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse = generateEmpathyResponse(newUserMessage.message);
      
      const newAiMessage = {
        sender: 'mirror',
        message: aiResponse.message,
        emoji: aiResponse.emoji,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, newAiMessage]);
      setIsProcessing(false);
      setScore(prev => prev + 1);

      // After a few exchanges, show self-care options
      if (conversation.length >= 2 && !showSelfCare) {
        setTimeout(() => {
          setShowSelfCare(true);
        }, 2000);
      }
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  const handleSelectSelfCare = (selfCare) => {
    setSelectedSelfCare(selfCare);
    setScore(prev => prev + 1);
    
    // Add self-care selection to conversation
    const selfCareMessage = {
      sender: 'mirror',
      message: `That's a wonderful choice. ${selfCare.description} Remember, taking care of yourself isn't selfish—it's essential for your wellbeing and your ability to be present for your students. You deserve this moment of care.`,
      emoji: "💚",
      timestamp: new Date()
    };

    setTimeout(() => {
      setConversation(prev => [...prev, selfCareMessage]);
      
      // Complete game after self-care selection
      setTimeout(() => {
        setShowGameOver(true);
      }, 3000);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <TeacherGameShell
      title={gameData?.title || "Mirror Moment Simulation"}
      subtitle={gameData?.description || "Experience self-dialogue to reduce guilt or shame after a tough day"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={0}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {/* Mirror Header */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🪞</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Mirror Moment Simulation
            </h2>
            <p className="text-gray-600">
              Speak or type your feelings. Your inner voice is here to listen with empathy.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mx-auto rounded-full mt-4"></div>
          </div>

          {/* Conversation Area */}
          <div className="mb-6">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-gray-200 h-[400px] overflow-y-auto flex flex-col gap-4">
              {conversation.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                      : 'bg-white border-2 border-purple-200 text-gray-800'
                  }`}>
                    {msg.sender === 'mirror' && msg.emoji && (
                      <div className="text-2xl mb-2">{msg.emoji}</div>
                    )}
                    <p className="leading-relaxed">{msg.message}</p>
                    {msg.sender === 'mirror' && (
                      <button
                        onClick={() => {
                          if (isListening) {
                            stopAudio();
                          } else {
                            playAudio(msg.message);
                          }
                        }}
                        className="mt-2 text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1"
                      >
                        {isListening ? (
                          <>
                            <VolumeX className="w-3 h-3" />
                            Stop Audio
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            Hear This
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border-2 border-purple-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Input Area */}
          {!showSelfCare && (
            <div className="mb-6">
              <div className="flex gap-3">
                <textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type what you're feeling... (Or speak it aloud as you type)"
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none text-gray-800 min-h-[100px] resize-none"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!userMessage.trim() || isProcessing}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    userMessage.trim() && !isProcessing
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                </motion.button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                💭 Speaking aloud as you type helps release tension and process emotions
              </p>
            </div>
          )}

          {/* Self-Care Selection */}
          {showSelfCare && !selectedSelfCare && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-green-600" />
                  Choose a Self-Care Step
                </h3>
                <p className="text-gray-700 mb-4">
                  After expressing your feelings, choose one self-care action to help you feel better:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selfCareOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectSelfCare(option)}
                      className={`${option.bgColor} border-2 ${option.borderColor} rounded-xl p-4 text-left hover:shadow-lg transition-all`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${option.color} text-white`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 mb-1">{option.title}</h4>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Self-Care Confirmation */}
          {selectedSelfCare && (() => {
            const IconComponent = selectedSelfCare.icon;
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6"
              >
                <div className={`${selectedSelfCare.bgColor} border-2 ${selectedSelfCare.borderColor} rounded-xl p-6`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${selectedSelfCare.color} text-white`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedSelfCare.title}</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-2">{selectedSelfCare.description}</p>
                  <p className="text-sm text-gray-600 italic">
                    Take this moment for yourself. You've earned it. 🌟
                  </p>
                </div>
              </motion.div>
            );
          })()}

          {/* Teacher Tip */}
          <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-amber-900 mb-2">
              💡 Teacher Tip:
            </p>
            <p className="text-sm text-amber-800 leading-relaxed">
              Use alone time after school for mirror talk reflection. After the students leave and the classroom is quiet, take 5-10 minutes to sit with yourself. Speak your feelings aloud, even if it's just to the empty room. This practice helps process the day's emotions, release guilt or shame, and prepare you to leave work at work. You can do this in your car, in an empty classroom, or at home—anywhere you can be alone with your thoughts.
            </p>
          </div>
        </div>
      </div>
    </TeacherGameShell>
  );
};

export default MirrorMomentSimulation;

