import mongoose from 'mongoose';

const goodieOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    userEmail: {
      type: String,
      default: null
    },
    contactNumber: {
      type: String,
      default: null
    },
    goodieTitle: {
      type: String,
      required: true
    },
    coins: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    address: {
      contactNumber: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
      instructions: String
    },
    status: {
      type: String,
      enum: ['requested', 'delivered'],
      default: 'requested'
    },
    healCoinsBefore: {
      type: Number,
      default: 0
    },
    healCoinsAfter: {
      type: Number,
      default: 0
    },
    deliveredAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const GoodieOrder = mongoose.model('GoodieOrder', goodieOrderSchema);
export default GoodieOrder;
