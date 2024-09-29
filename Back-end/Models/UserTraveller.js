const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

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



// Pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
  const user = this;

  // Only hash the password if it's new or being modified
  if (user.isModified('password') || user.isNew) {
    try {
      // Generate salt and hash the password
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
      next();
    } catch (error) {
      return next(error);
    }
  } else {
    next();
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model('UserTraveller', userSchema);

