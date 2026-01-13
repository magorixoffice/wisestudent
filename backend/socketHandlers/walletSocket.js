import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

/**
 * Socket handler for wallet and redemption real-time interactions
 * Enables students to view their wallet balance and redemption history
 * Enables admins to manage redemption requests
 */
export const setupWalletSocket = (io, socket, user) => {
  // Student wallet subscription
  socket.on('student:wallet:subscribe', async ({ studentId }) => {
    try {
      // Verify student permissions
      if (user._id.toString() !== studentId) {
        socket.emit('student:wallet:error', { message: 'Unauthorized access' });
        return;
      }

      
      // Join student-specific room for wallet updates
      socket.join(`student-wallet-${studentId}`);
      
      // Send initial wallet data
      const wallet = await Wallet.findOne({ userId: studentId });
      const transactions = await Transaction.find({ userId: studentId })
        .sort({ createdAt: -1 })
        .limit(10);
      
      socket.emit('student:wallet:data', { 
        wallet: wallet || { balance: 0, lastUpdated: new Date() },
        transactions
      });
      
    } catch (err) {
      console.error('Error in student:wallet:subscribe:', err);
      socket.emit('student:wallet:error', { message: err.message });
    }
  });

  // Student redemption request
  socket.on('student:wallet:redeem', async ({ studentId, amount, upiId }) => {
    try {
      // Verify student permissions
      if (user._id.toString() !== studentId || user.role !== 'student') {
        socket.emit('student:wallet:error', { message: 'Unauthorized access' });
        return;
      }

      if (!amount || amount <= 0) {
        socket.emit('student:wallet:error', { message: 'Invalid amount' });
        return;
      }

      if (!upiId) {
        socket.emit('student:wallet:error', { message: 'UPI ID is required' });
        return;
      }

      // Find student wallet
      const wallet = await Wallet.findOne({ userId: studentId });

      if (!wallet || wallet.balance < amount) {
        socket.emit('student:wallet:error', { message: 'Insufficient wallet balance' });
        return;
      }

      // Deduct amount from wallet
      wallet.balance -= amount;
      wallet.lastUpdated = new Date();
      await wallet.save();

      // Create redemption transaction
      const transaction = await Transaction.create({
        userId: studentId,
        type: 'redeem',
        amount,
        description: `Redemption request for ₹${amount} to UPI: ${upiId}`,
        status: 'pending',
        metadata: { upiId }
      });

      // Log activity
      await ActivityLog.create({
        userId: studentId,
        activityType: 'redemption_request',
        details: {
          amount,
          upiId,
          transactionId: transaction._id
        },
        timestamp: new Date()
      });

      // Send updated wallet data to student
      const updatedTransactions = await Transaction.find({ userId: studentId })
        .sort({ createdAt: -1 })
        .limit(10);

      socket.emit('student:wallet:data', { 
        wallet,
        transactions: updatedTransactions
      });



      socket.emit('student:wallet:redeem:success', { 
        message: 'Redemption request submitted successfully',
        transaction
      });

    } catch (err) {
      console.error('Error in student:wallet:redeem:', err);
      socket.emit('student:wallet:error', { message: err.message });
    }
  });

  // Cleanup when socket disconnects
  socket.on('disconnect', () => {
    // Leave all rooms related to wallet and redemptions
    if (user.role === 'student') {
      socket.leave(`student-wallet-${user._id}`);
    }
  });
};