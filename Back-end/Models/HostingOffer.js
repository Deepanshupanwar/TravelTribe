const mongoose = require('mongoose');

const hostingOfferSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['host', 'guide'],
    required: true,
  },
  available_dates: {
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
  },
  description: String,
  preferred_guests: {
    gender: String,
    languages: [String],
    max_guests: {
      type: Number,
      default: 1,
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('HostingOffer', hostingOfferSchema);
