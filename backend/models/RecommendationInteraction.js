import mongoose from 'mongoose';

/**
 * Recommendation Interaction Tracking Model
 * Tracks user interactions with recommendations for learning and improvement
 */
const recommendationInteractionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    
    // Recommendation details
    recommendationId: {
      type: String, // Identifier for the recommendation (e.g., hash of title+path)
      required: true,
      index: true
    },
    recommendationType: {
      type: String,
      enum: ['pillar', 'continue', 'engagement', 'wellness', 'streak', 'explore', 'default'],
      required: true
    },
    recommendationTitle: {
      type: String,
      required: true
    },
    recommendationPath: {
      type: String,
      required: true
    },
    recommendationReason: {
      type: String // The "reason" shown to user
    },
    recommendationPriority: {
      type: String,
      enum: ['high', 'medium', 'low']
    },
    recommendationScore: {
      type: Number // The calculated score for this recommendation
    },
    
    // Interaction details
    action: {
      type: String,
      enum: ['clicked', 'dismissed', 'completed', 'abandoned'],
      default: 'clicked',
      required: true
    },
    
    // Position in recommendations list (1st, 2nd, 3rd, etc.)
    position: {
      type: Number,
      min: 1,
      max: 10
    },
    
    // Session context
    sessionId: {
      type: String
    },
    
    // Outcome tracking (optional, can be updated later)
    outcome: {
      type: String,
      enum: ['engaged', 'completed', 'quick_exit', 'not_engaged']
    },
    
    // Time spent on recommended content (in seconds, if available)
    engagementDuration: {
      type: Number
    },
    
    // Additional metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    
    // Timestamp when recommendation was generated
    recommendationGeneratedAt: {
      type: Date
    },
    
    // Timestamp when user interacted
    interactedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt
  }
);

// Compound indexes for efficient queries
recommendationInteractionSchema.index({ userId: 1, interactedAt: -1 });
recommendationInteractionSchema.index({ recommendationId: 1, action: 1, interactedAt: -1 });
recommendationInteractionSchema.index({ recommendationType: 1, action: 1, interactedAt: -1 });
recommendationInteractionSchema.index({ userId: 1, recommendationId: 1 }); // For duplicate detection

// Static method to log an interaction
recommendationInteractionSchema.statics.logInteraction = async function(interactionData) {
  try {
    const interaction = await this.create(interactionData);
    return interaction;
  } catch (error) {
    console.error('Error logging recommendation interaction:', error);
    // Don't throw - tracking should not break app flow
    return null;
  }
};

// Static method to get interaction statistics for a user
recommendationInteractionSchema.statics.getUserStats = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return await this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        interactedAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 },
        avgPosition: { $avg: '$position' }
      }
    }
  ]);
};

// Static method to get recommendation performance stats
recommendationInteractionSchema.statics.getRecommendationPerformance = async function(recommendationId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return await this.aggregate([
    {
      $match: {
        recommendationId,
        interactedAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 },
        avgPosition: { $avg: '$position' },
        avgScore: { $avg: '$recommendationScore' }
      }
    }
  ]);
};

// Static method to get user's ignored/dismissed recommendations (to avoid showing again)
recommendationInteractionSchema.statics.getIgnoredRecommendations = async function(userId, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const ignored = await this.find({
    userId: new mongoose.Types.ObjectId(userId),
    action: 'dismissed',
    interactedAt: { $gte: startDate }
  }).select('recommendationId').lean();
  
  return new Set(ignored.map(i => i.recommendationId));
};

const RecommendationInteraction = mongoose.models.RecommendationInteraction || 
  mongoose.model('RecommendationInteraction', recommendationInteractionSchema);

export default RecommendationInteraction;

