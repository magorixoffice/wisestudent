import Presentation from '../models/Presentation.js';

export const setupPresentationSocket = (io, socket, user) => {
  // Join presentation room
  socket.on('presentation:join', async ({ presentationId }) => {
    try {
      const presentation = await Presentation.findById(presentationId);
      
      if (!presentation) {
        socket.emit('presentation:error', { message: 'Presentation not found' });
        return;
      }

      // Check access
      const hasAccess = 
        presentation.createdBy.toString() === user._id.toString() ||
        presentation.isPublic && presentation.isPublished ||
        presentation.sharedWith.some(s => s.userId.toString() === user._id.toString());

      if (!hasAccess) {
        socket.emit('presentation:error', { message: 'Access denied' });
        return;
      }

      // Join the presentation room
      socket.join(`presentation:${presentationId}`);
      
      // Notify others in the room
      socket.to(`presentation:${presentationId}`).emit('presentation:user-joined', {
        userId: user._id.toString(),
        userName: user.name,
        presentationId
      });

      // Send current state to the new user
      socket.emit('presentation:state', {
        presentationId,
        currentSlide: presentation.currentSlide,
        isPresenting: presentation.isPresenting,
        sessionId: presentation.presentationSessionId
      });

    } catch (error) {
      console.error('Error joining presentation:', error);
      socket.emit('presentation:error', { message: 'Error joining presentation' });
    }
  });

  // Leave presentation room
  socket.on('presentation:leave', ({ presentationId }) => {
    socket.leave(`presentation:${presentationId}`);
    socket.to(`presentation:${presentationId}`).emit('presentation:user-left', {
      userId: user._id.toString(),
      userName: user.name,
      presentationId
    });
  });

  // Change slide (only presenter can do this)
  socket.on('presentation:change-slide', async ({ presentationId, slideNumber }) => {
    try {
      const presentation = await Presentation.findById(presentationId);
      
      if (!presentation) {
        socket.emit('presentation:error', { message: 'Presentation not found' });
        return;
      }

      // Check if user is the owner
      const isOwner = presentation.createdBy.toString() === user._id.toString();
      
      if (!isOwner) {
        socket.emit('presentation:error', { message: 'Only the owner can change slides' });
        return;
      }

      // Validate slide number
      if (slideNumber < 0 || slideNumber >= presentation.slides.length) {
        socket.emit('presentation:error', { message: 'Invalid slide number' });
        return;
      }

      // Update presentation
      presentation.currentSlide = slideNumber;
      await presentation.save();

      // Broadcast to all viewers in the room
      io.to(`presentation:${presentationId}`).emit('presentation:slide-changed', {
        presentationId,
        currentSlide: slideNumber,
        changedBy: user._id.toString()
      });

    } catch (error) {
      console.error('Error changing slide:', error);
      socket.emit('presentation:error', { message: 'Error changing slide' });
    }
  });

  // Start presentation
  socket.on('presentation:start', async ({ presentationId }) => {
    try {
      const presentation = await Presentation.findById(presentationId);
      
      if (!presentation) {
        socket.emit('presentation:error', { message: 'Presentation not found' });
        return;
      }

      // Check if user is the owner
      const isOwner = presentation.createdBy.toString() === user._id.toString();
      
      if (!isOwner) {
        socket.emit('presentation:error', { message: 'Only the owner can start presentation' });
        return;
      }

      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      presentation.isPresenting = true;
      presentation.presentationSessionId = sessionId;
      presentation.currentSlide = 0;
      await presentation.save();

      // Broadcast to all viewers
      io.to(`presentation:${presentationId}`).emit('presentation:started', {
        presentationId,
        sessionId,
        currentSlide: 0
      });

    } catch (error) {
      console.error('Error starting presentation:', error);
      socket.emit('presentation:error', { message: 'Error starting presentation' });
    }
  });

  // Stop presentation
  socket.on('presentation:stop', async ({ presentationId }) => {
    try {
      const presentation = await Presentation.findById(presentationId);
      
      if (!presentation) {
        socket.emit('presentation:error', { message: 'Presentation not found' });
        return;
      }

      // Check if user is the owner
      const isOwner = presentation.createdBy.toString() === user._id.toString();
      
      if (!isOwner) {
        socket.emit('presentation:error', { message: 'Only the owner can stop presentation' });
        return;
      }

      presentation.isPresenting = false;
      presentation.presentationSessionId = null;
      await presentation.save();

      // Broadcast to all viewers
      io.to(`presentation:${presentationId}`).emit('presentation:stopped', {
        presentationId
      });

    } catch (error) {
      console.error('Error stopping presentation:', error);
      socket.emit('presentation:error', { message: 'Error stopping presentation' });
    }
  });

  // Real-time slide editing (for collaborative editing)
  socket.on('presentation:slide-update', async ({ presentationId, slideNumber, updates }) => {
    try {
      const presentation = await Presentation.findById(presentationId);
      
      if (!presentation) {
        socket.emit('presentation:error', { message: 'Presentation not found' });
        return;
      }

      // Check ownership or edit permission
      const isOwner = presentation.createdBy.toString() === user._id.toString();
      const hasEditPermission = presentation.sharedWith.some(
        s => s.userId.toString() === user._id.toString() && s.permission === 'edit'
      );

      if (!isOwner && !hasEditPermission) {
        socket.emit('presentation:error', { message: 'Access denied' });
        return;
      }

      // Update slide
      await presentation.updateSlide(slideNumber, updates);

      // Broadcast to all viewers (except sender)
      socket.to(`presentation:${presentationId}`).emit('presentation:slide-updated', {
        presentationId,
        slideNumber,
        updates,
        updatedBy: user._id.toString()
      });

      // Confirm to sender
      socket.emit('presentation:slide-update-confirmed', {
        presentationId,
        slideNumber
      });
    } catch (error) {
      console.error('Error updating slide:', error);
      socket.emit('presentation:error', { message: 'Error updating slide' });
    }
  });
};

