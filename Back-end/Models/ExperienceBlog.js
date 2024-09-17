const mongoose = require('mongoose');

const experienceBlogSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
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
  cover:{
    type: String, // URL of the cover picture
  },
  content:{
    type:String, // content will also store rest of picture urls
    required: true
  },
  likes_count: {
    type: Number,
    default: 0,
  },
  liked_by: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to users who liked the blog
  }]
},
{
  timestamps:true,
});

module.exports = mongoose.model('ExperienceBlog', experienceBlogSchema);
