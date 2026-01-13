import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

export const setupChatSocket = (io, socket, user) => {
  // Join chat room
  socket.on('join-chat', async (chatId) => {
    try {
      const chat = await Chat.findById(chatId);
      if (chat) {
        socket.join(chatId);
        socket.emit('joined-chat', { chatId });
        
        // Notify other users in the room that this user joined (went online)
        socket.to(chatId).emit('user-online', { chatId, userId: user._id });
        
        // Request other users in the room to announce their presence
        socket.to(chatId).emit('request-online-status', { chatId, requestingUserId: user._id });
        
      }
    } catch (error) {
      console.error('Error joining chat:', error);
      socket.emit('error', { message: 'Failed to join chat' });
    }
  });

  // Leave chat room
  socket.on('leave-chat', (chatId) => {
    // Emit user offline status before leaving
    socket.to(chatId).emit('user-offline', { chatId, userId: user._id });
    socket.leave(chatId);
    socket.emit('left-chat', { chatId });
  });

  // Typing indicator
  socket.on('typing-start', (data) => {
    const { chatId, userId } = data;
    socket.to(chatId).emit('user-typing', {
      chatId,
      userId,
      isTyping: true
    });
  });

  socket.on('typing-stop', (data) => {
    const { chatId, userId } = data;
    socket.to(chatId).emit('user-typing', {
      chatId,
      userId,
      isTyping: false
    });
  });

  // Mark messages as seen
  socket.on('mark-as-seen', async (data) => {
    try {
      const { chatId } = data;

      // Mark all messages in chat as seen for current user
      await Message.updateMany(
        { 
          chatId, 
          senderId: { $ne: user._id },
          'readBy.userId': { $ne: user._id }
        },
        { 
          $addToSet: { 
            readBy: { 
              userId: user._id, 
              readAt: new Date() 
            } 
          },
          $set: { status: 'seen' }
        }
      );

      // Update unread count
      await Chat.findByIdAndUpdate(chatId, {
        $set: {
          [`unreadCount.${user.role === 'school_teacher' ? 'teacher' : 'parent'}`]: 0
        }
      });

      // Emit seen status to other users in chat
      socket.to(chatId).emit('messages-seen', {
        chatId,
        seenBy: user._id,
        seenAt: new Date()
      });

    } catch (error) {
      console.error('Error marking messages as seen:', error);
      socket.emit('error', { message: 'Failed to mark messages as seen' });
    }
  });

  // User online status
  socket.on('user-online', (data) => {
    const { chatId, userId } = data;
    socket.to(chatId).emit('user-online', { chatId, userId });
  });

  // User offline status
  socket.on('user-offline', (data) => {
    const { chatId, userId } = data;
    socket.to(chatId).emit('user-offline', { chatId, userId });
  });

  // Handle request for online status
  socket.on('announce-presence', (data) => {
    const { chatId, requestingUserId } = data;
    // Emit to the chat room, but only the requesting user should handle it
    io.to(chatId).emit('user-online', { chatId, userId: user._id, requestingUserId });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    // Note: When socket disconnects, it automatically leaves all rooms
    // We broadcast offline status, but without chatId since we can't access rooms after disconnect
    socket.broadcast.emit('user-offline', { userId: user._id });
  });
};