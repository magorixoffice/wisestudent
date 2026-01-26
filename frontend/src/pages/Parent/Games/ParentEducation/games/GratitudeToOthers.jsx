import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Heart, CheckCircle, MessageSquare, Mic, Download, Send, Sparkles, Smile } from "lucide-react";

const GratitudeToOthers = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-74";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [step, setStep] = useState(1); // 1: Select recipient, 2: Create message, 3: Complete
  const [selectedRecipients, setSelectedRecipients] = useState([]); // Changed to array to hold multiple recipients
  const [currentRecipient, setCurrentRecipient] = useState({ selectedRecipient: null, recipientName: "" });
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [showGameOver, setShowGameOver] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Recipient categories
  const recipientCategories = [
    {
      id: 'family',
      label: 'Family Member',
      emoji: '👨‍👩‍👧‍👦',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-300',
      placeholder: 'e.g., Mom, Dad, Spouse, Sibling'
    },
    {
      id: 'friend',
      label: 'Friend',
      emoji: '👫',
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-300',
      placeholder: 'e.g., Sarah, Best Friend, College Friend'
    },
    {
      id: 'teacher',
      label: 'Teacher/Mentor',
      emoji: '👩‍🏫',
      color: 'from-purple-400 to-violet-500',
      bgColor: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-300',
      placeholder: 'e.g., Ms. Johnson, Coach, Mentor'
    },
    {
      id: 'neighbor',
      label: 'Neighbor/Community',
      emoji: '🏘️',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      placeholder: 'e.g., Neighbor, Community Member'
    },
    {
      id: 'colleague',
      label: 'Colleague/Co-worker',
      emoji: '🤝',
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-300',
      placeholder: 'e.g., Co-worker, Boss, Team Member'
    },
    {
      id: 'other',
      label: 'Other',
      emoji: '💝',
      color: 'from-cyan-400 to-teal-500',
      bgColor: 'from-cyan-50 to-teal-50',
      borderColor: 'border-cyan-300',
      placeholder: 'e.g., Anyone you appreciate'
    }
  ];

  // Stickers/Emojis
  const stickers = [
    { id: 1, emoji: '🙏', label: 'Thankful' },
    { id: 2, emoji: '💝', label: 'Love' },
    { id: 3, emoji: '🌟', label: 'Star' },
    { id: 4, emoji: '💚', label: 'Heart' },
    { id: 5, emoji: '✨', label: 'Sparkle' },
    { id: 6, emoji: '🌺', label: 'Flower' },
    { id: 7, emoji: '🌈', label: 'Rainbow' },
    { id: 8, emoji: '🦋', label: 'Butterfly' },
    { id: 9, emoji: '☀️', label: 'Sun' },
    { id: 10, emoji: '🎉', label: 'Celebrate' }
  ];

  const handleSelectRecipient = (categoryId) => {
    setCurrentRecipient(prev => ({
      ...prev,
      selectedRecipient: categoryId
    }));
  };

  const handleContinueToMessage = () => {
    if (currentRecipient.selectedRecipient && currentRecipient.recipientName.trim()) {
      // Check if we've reached 5 recipients
      if (selectedRecipients.length + 1 >= 5) {
        // Add the last recipient and finish the game
        setSelectedRecipients(prev => [...prev, {
          ...currentRecipient,
          message: message || '',
          audioBlob: audioBlob,
          audioURL: audioURL,
          selectedSticker: selectedSticker
        }]);
        
        setStep(3);
        setShowGameOver(true);
      } else {
        // Add current recipient to the selected recipients list
        setSelectedRecipients(prev => [...prev, {
          ...currentRecipient,
          message: message || '',
          audioBlob: audioBlob,
          audioURL: audioURL,
          selectedSticker: selectedSticker
        }]);
        
        // Reset current recipient and message fields
        setCurrentRecipient({ selectedRecipient: null, recipientName: "" });
        setMessage("");
        setAudioBlob(null);
        setAudioURL(null);
        setSelectedSticker(null);
        audioChunksRef.current = [];
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioBlob(null);
    setAudioURL(null);
    audioChunksRef.current = [];
  };

  const handleSendMessage = () => {
    if (message.trim() || audioBlob) {
      // Check if we've reached 5 recipients
      if (selectedRecipients.length + 1 >= 5) {
        // Add the last recipient and finish the game
        setSelectedRecipients(prev => [...prev, {
          ...currentRecipient,
          message: message || '',
          audioBlob: audioBlob,
          audioURL: audioURL,
          selectedSticker: selectedSticker
        }]);
        
        setStep(3);
        setShowGameOver(true);
      } else {
        // Add current recipient to the selected recipients list
        setSelectedRecipients(prev => [...prev, {
          ...currentRecipient,
          message: message || '',
          audioBlob: audioBlob,
          audioURL: audioURL,
          selectedSticker: selectedSticker
        }]);
        
        // Reset current recipient and message fields
        setCurrentRecipient({ selectedRecipient: null, recipientName: "" });
        setMessage("");
        setAudioBlob(null);
        setAudioURL(null);
        setSelectedSticker(null);
        audioChunksRef.current = [];
      }
    }
  };

  const handleSaveMessage = () => {
    if (message.trim() || audioBlob) {
      // Check if we've reached 5 recipients
      if (selectedRecipients.length + 1 >= 5) {
        // Add the last recipient and finish the game
        setSelectedRecipients(prev => [...prev, {
          ...currentRecipient,
          message: message || '',
          audioBlob: audioBlob,
          audioURL: audioURL,
          selectedSticker: selectedSticker
        }]);
        
        // Create a downloadable file with all messages
        const allMessages = selectedRecipients.map((recipient, index) => 
          `Gratitude Message #${index + 1}

To: ${recipient.recipientName}
Category: ${recipientCategories.find(c => c.id === recipient.selectedRecipient)?.label}

Message:
${recipient.message}

${recipient.audioBlob ? '[Voice message attached]' : ''}`
        ).join('\n\n---\n\n');
        
        const content = `${allMessages}\n\nCreated: ${new Date().toLocaleString()}`;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gratitude-messages-${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setStep(3);
        setShowGameOver(true);
      } else {
        // Add current recipient to the selected recipients list
        setSelectedRecipients(prev => [...prev, {
          ...currentRecipient,
          message: message || '',
          audioBlob: audioBlob,
          audioURL: audioURL,
          selectedSticker: selectedSticker
        }]);
        
        // Reset current recipient and message fields
        setCurrentRecipient({ selectedRecipient: null, recipientName: "" });
        setMessage("");
        setAudioBlob(null);
        setAudioURL(null);
        setSelectedSticker(null);
        audioChunksRef.current = [];
      }
    }
  };

  const selectedCategory = recipientCategories.find(c => c.id === currentRecipient.selectedRecipient);

  if (showGameOver && step === 3) {
    return (
      <ParentGameShell
        title={gameData?.title || "Gratitude to Others"}
        subtitle="All Messages Created!"
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
                🙏
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Gratitude Message Created!</h2>
              <p className="text-lg text-gray-600 mb-6">
                Your message of appreciation has been prepared.
              </p>
            </div>

            {/* All Message Previews */}
            <div className="space-y-6 mb-6">
              {selectedRecipients.map((recipient, index) => {
                const recipientCategory = recipientCategories.find(c => c.id === recipient.selectedRecipient);
                const sticker = stickers.find(s => s.id === recipient.selectedSticker);
                return (
                  <div key={index} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">{recipientCategory?.emoji}</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">To: {recipient.recipientName}</h3>
                        <p className="text-sm text-gray-600">{recipientCategory?.label}</p>
                      </div>
                    </div>
                    
                    {recipient.selectedSticker && (
                      <div className="text-center mb-4">
                        <span className="text-6xl">{sticker?.emoji}</span>
                      </div>
                    )}

                    <div className="bg-white rounded-lg p-5 border border-amber-200 mb-4">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {recipient.message || '[Voice message]'}
                      </p>
                    </div>

                    {recipient.audioURL && (
                      <div className="bg-white rounded-lg p-4 border border-amber-200 mb-4">
                        <audio controls src={recipient.audioURL} className="w-full">
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-green-600" />
                The Power of Gratitude
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Strengthens Bonds:</strong> Expressing gratitude deepens your relationships and creates lasting connections.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Creates Positivity:</strong> Gratitude messages spread joy and positivity to both the recipient and yourself.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Builds Community:</strong> When you express appreciation, you strengthen the fabric of your community.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Multiplies Kindness:</strong> Your gratitude often inspires others to express their appreciation too.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Gratitude strengthens community more than advice or help ever could. When you express genuine appreciation, you're not just saying "thank you"—you're acknowledging someone's value, creating connection, and building a culture of appreciation that your children will learn from. Your gratitude messages teach your children the power of expressing appreciation and strengthen your family's bonds with the community around you.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Gratitude to Others"}
      subtitle={step === 1 ? `Choose Recipient (${selectedRecipients.length + 1}/5)` : step === 2 ? "Create Message" : "Complete"}
      showGameOver={false}
      score={selectedRecipients.length}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={step}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Step 1: Select Recipient */}
          {step === 1 && (
            <>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🙏</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Who Would You Like to Thank?</h2>
                <p className="text-gray-600 text-lg">
                  Choose a category and enter the name of someone you appreciate.
                </p>
              </div>

              {/* Recipient Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {recipientCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectRecipient(category.id)}
                    className={`text-left p-5 rounded-xl border-2 transition-all ${
                      currentRecipient.selectedRecipient === category.id
                        ? `${category.bgColor} ${category.borderColor} border-4 shadow-lg`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{category.emoji}</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{category.label}</h3>
                      </div>
                      {currentRecipient.selectedRecipient === category.id && (
                        <CheckCircle className="w-6 h-6 text-green-600 ml-auto" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Recipient Name Input */}
              {currentRecipient.selectedRecipient && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6"
                >
                  <label className="block text-lg font-bold text-gray-800 mb-3">
                    Enter their name:
                  </label>
                  <input
                    type="text"
                    value={currentRecipient.recipientName}
                    onChange={(e) => setCurrentRecipient(prev => ({
                      ...prev,
                      recipientName: e.target.value
                    }))}
                    placeholder={recipientCategories.find(c => c.id === currentRecipient.selectedRecipient)?.placeholder}
                    className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-gray-800 text-lg"
                  />
                </motion.div>
              )}

              {/* Selected Recipients Summary */}
              {selectedRecipients.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    Selected Recipients ({selectedRecipients.length}/5)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedRecipients.map((recipient, index) => {
                      const category = recipientCategories.find(c => c.id === recipient.selectedRecipient);
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-300">
                          <span>{category?.emoji}</span>
                          <div>
                            <p className="font-medium text-gray-800">{recipient.recipientName}</p>
                            <p className="text-sm text-gray-600">{category?.label}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
                          
              {/* Continue Button */}
              {currentRecipient.selectedRecipient && currentRecipient.recipientName.trim() && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContinueToMessage}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  {selectedRecipients.length + 1 >= 5 ? 'Finish & Submit All Messages' : 'Continue to Message'}
                  <MessageSquare className="w-5 h-5" />
                </motion.button>
              )}
            </>
          )}

          {/* Step 2: Create Message */}
          {step === 2 && (
            <>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">💝</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Your Gratitude Message</h2>
                <p className="text-gray-600">
                  Write a message to <strong className="text-gray-800">{currentRecipient.recipientName}</strong>
                </p>
              </div>

              {/* Message Editor */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Your Message</h3>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message of gratitude here... What are you thankful for? How has this person made a difference in your life?"
                  className="w-full px-4 py-3 rounded-lg border-2 border-amber-300 focus:border-amber-500 focus:outline-none text-gray-800 min-h-[200px] resize-none"
                />
                <p className="text-sm text-gray-600 mt-2">
                  {message.length} characters
                </p>
              </div>

              {/* Voice Recording */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Voice Message (Optional)
                </h3>
                {!audioURL ? (
                  <div className="flex items-center gap-4">
                    {!isRecording ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startRecording}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                      >
                        <Mic className="w-5 h-5" />
                        Start Recording
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={stopRecording}
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                      >
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse mr-2"></div>
                        Stop Recording
                      </motion.button>
                    )}
                    {isRecording && (
                      <p className="text-gray-600">Recording in progress...</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <audio controls src={audioURL} className="w-full">
                      Your browser does not support the audio element.
                    </audio>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={deleteRecording}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-all"
                    >
                      Delete Recording
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Sticker Selection */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-200 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Smile className="w-5 h-5" />
                  Add a Sticker (Optional)
                </h3>
                <div className="flex flex-wrap gap-3">
                  {stickers.map((sticker) => (
                    <motion.button
                      key={sticker.id}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedSticker(selectedSticker === sticker.id ? null : sticker.id)}
                      className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl transition-all ${
                        selectedSticker === sticker.id
                          ? 'border-pink-400 bg-pink-100 scale-110'
                          : 'border-gray-200 hover:border-pink-300 bg-white'
                      }`}
                      title={sticker.label}
                    >
                      {sticker.emoji}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveMessage}
                  disabled={!message.trim() && !audioBlob}
                  className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Save Message
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendMessage}
                  disabled={!message.trim() && !audioBlob}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </motion.button>
              </div>
            </>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Gratitude strengthens community more than advice or help ever could. Take time to express genuine appreciation—your words and gestures create lasting connections and teach your children the power of gratitude.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default GratitudeToOthers;

