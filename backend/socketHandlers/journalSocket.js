import Journal from '../models/Journal.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

/**
 * Socket handler for journal real-time interactions
 * Enables students to create, update, and delete journal entries
 */
export const setupJournalSocket = (io, socket, user) => {
  // Student subscribe to journal entries
  socket.on('student:journal:subscribe', async ({ studentId }) => {
    try {
      // Verify student permissions
      if (user._id.toString() !== studentId || user.role !== 'student') {
        socket.emit('student:journal:error', { message: 'Unauthorized access' });
        return;
      }

      
      // Join student-specific room for journal updates
      socket.join(`student-journal-${studentId}`);
      
      // Get student's journal entries
      const journals = await Journal.find({ userId: studentId })
        .sort({ createdAt: -1 });
      
      socket.emit('student:journal:data', journals);
      
    } catch (err) {
      console.error('Error in student:journal:subscribe:', err);
      socket.emit('student:journal:error', { message: err.message });
    }
  });

  // Student create journal entry
  socket.on('student:journal:create', async ({ studentId, title, content, mood, tags = [] }) => {
    try {
      // Verify student permissions
      if (user._id.toString() !== studentId || user.role !== 'student') {
        socket.emit('student:journal:error', { message: 'Unauthorized access' });
        return;
      }

      // Validate input
      if (!title || !content) {
        socket.emit('student:journal:error', { message: 'Title and content are required' });
        return;
      }

      // Create journal entry
      const journal = await Journal.create({
        userId: studentId,
        title,
        content,
        mood,
        tags,
        createdAt: new Date()
      });

      // Log activity
      await ActivityLog.create({
        userId: studentId,
        activityType: 'journal_created',
        details: {
          journalId: journal._id,
          title: journal.title
        },
        timestamp: new Date()
      });

      // Get updated journal entries
      const journals = await Journal.find({ userId: studentId })
        .sort({ createdAt: -1 });
      
      socket.emit('student:journal:data', journals);
      socket.emit('student:journal:create:success', { 
        message: 'Journal entry created successfully',
        journal
      });

    } catch (err) {
      console.error('Error in student:journal:create:', err);
      socket.emit('student:journal:error', { message: err.message });
    }
  });

  // Student update journal entry
  socket.on('student:journal:update', async ({ studentId, journalId, title, content, mood, tags = [] }) => {
    try {
      // Verify student permissions
      if (user._id.toString() !== studentId || user.role !== 'student') {
        socket.emit('student:journal:error', { message: 'Unauthorized access' });
        return;
      }

      // Find journal entry
      const journal = await Journal.findOne({ _id: journalId, userId: studentId });
      
      if (!journal) {
        socket.emit('student:journal:error', { message: 'Journal entry not found' });
        return;
      }

      // Update journal entry
      journal.title = title || journal.title;
      journal.content = content || journal.content;
      journal.mood = mood || journal.mood;
      journal.tags = tags || journal.tags;
      journal.updatedAt = new Date();
      await journal.save();

      // Log activity
      await ActivityLog.create({
        userId: studentId,
        activityType: 'journal_updated',
        details: {
          journalId: journal._id,
          title: journal.title
        },
        timestamp: new Date()
      });

      // Get updated journal entries
      const journals = await Journal.find({ userId: studentId })
        .sort({ createdAt: -1 });
      
      socket.emit('student:journal:data', journals);
      socket.emit('student:journal:update:success', { 
        message: 'Journal entry updated successfully',
        journal
      });

    } catch (err) {
      console.error('Error in student:journal:update:', err);
      socket.emit('student:journal:error', { message: err.message });
    }
  });

  // Student delete journal entry
  socket.on('student:journal:delete', async ({ studentId, journalId }) => {
    try {
      // Verify student permissions
      if (user._id.toString() !== studentId || user.role !== 'student') {
        socket.emit('student:journal:error', { message: 'Unauthorized access' });
        return;
      }

      // Find journal entry
      const journal = await Journal.findOne({ _id: journalId, userId: studentId });
      
      if (!journal) {
        socket.emit('student:journal:error', { message: 'Journal entry not found' });
        return;
      }

      // Store journal info for logging
      const journalInfo = {
        id: journal._id,
        title: journal.title
      };

      // Delete journal entry
      await Journal.findByIdAndDelete(journalId);

      // Log activity
      await ActivityLog.create({
        userId: studentId,
        activityType: 'journal_deleted',
        details: {
          journalId: journalInfo.id,
          title: journalInfo.title
        },
        timestamp: new Date()
      });

      // Get updated journal entries
      const journals = await Journal.find({ userId: studentId })
        .sort({ createdAt: -1 });
      
      socket.emit('student:journal:data', journals);
      socket.emit('student:journal:delete:success', { 
        message: 'Journal entry deleted successfully',
        journalId
      });

    } catch (err) {
      console.error('Error in student:journal:delete:', err);
      socket.emit('student:journal:error', { message: err.message });
    }
  });

  // Cleanup when socket disconnects
  socket.on('disconnect', () => {
    // Leave all rooms related to journal
    if (user.role === 'student') {
      socket.leave(`student-journal-${user._id}`);
    }
  });
};