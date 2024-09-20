const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true,
  },
  googleId: { type: String },
  contactno:String,
  gender:String,
  about: String,
  profile_picture: String,
  isHost: {
    type: Boolean,
    default: false,
  },
  isTraveler: {
    type: Boolean,
    default: false,
  },
  location: {
    city: String,
    country: String,
  },
  languages_spoken: [String],
  preferences: {
    hosting: {
      type: Boolean,
      default: false,
    },
    guiding: {
      type: Boolean,
      default: false,
    },
    max_guests: {
      type: Number,
      default: 0,
    },
  },
  hosting_requests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HostingOffer',
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reviews',
  }],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('User', userSchema);

