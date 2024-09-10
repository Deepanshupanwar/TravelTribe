const mongoose = require('mongoose');

const experienceBlogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  destination: {
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  visit_time: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  pictures: [{
    type: String, // URLs of the pictures
  }],
  likes_count: {
    type: Number,
    default: 0,
  },
  liked_by: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to users who liked the blog
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

module.exports = mongoose.model('ExperienceBlog', experienceBlogSchema);
