const mongoose = require('mongoose');
const crypto = require('crypto');

const restaurantSchema = mongoose.Schema(
  {
    uniqueId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    businessHours: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    certificate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminComments: {
      type: String,
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique ID before saving
restaurantSchema.pre('save', function (next) {
  if (!this.uniqueId) {
    // Generate a random ID of 8 characters
    this.uniqueId = crypto.randomBytes(4).toString('hex');
  }
  next();
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;