export const setupSchoolAdminDashboardSocket = (io, socket, user) => {
  // Only setup for school_admin role
  if (user.role !== 'school_admin') return;


  // Join school admin dashboard room
  const tenantId = user.tenantId || user.organizationId;
  if (tenantId) {
    socket.join(`school-admin-dashboard:${tenantId}`);
  }

  // Debounce timer to prevent too many rapid requests
  let lastRequestTime = 0;
  const REQUEST_DEBOUNCE_MS = 500; // Minimum 500ms between requests

  // Handle real-time dashboard data requests
  socket.on('school-admin:dashboard:request-update', async (data) => {
    try {
      const now = Date.now();
      // Debounce rapid requests
      if (now - lastRequestTime < REQUEST_DEBOUNCE_MS) {
        return; // Ignore rapid duplicate requests
      }
      lastRequestTime = now;
      
      // Emit update to refresh dashboard
      if (tenantId) {
        io.to(`school-admin-dashboard:${tenantId}`).emit('school-admin:dashboard:update', {
          type: 'refresh',
          timestamp: new Date(),
          message: 'Dashboard data updated'
        });
      }
    } catch (error) {
      console.error('Error handling dashboard update request:', error);
      socket.emit('error', { message: 'Failed to fetch dashboard data' });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
  });
};

