const express = require('express');
const router = express.Router();
const Message = require('../Models/Messages');
const { requireAuth } = require("../Middlewares/authMiddleware");

// Send a message from one user to another
router.post('/send', requireAuth, async (req, res) => {
  try {
    const { receiver_id, message_text } = req.body;
    const sender_id = req.user.id; // assuming user is authenticated and attached to req.user

    // Save the message
    const message = new Message({
      sender_id,
      receiver_id,
      message_text
    });
    console.log(" messgage sent ", message);

    await message.save();

    res.status(201).json({ message: "Message sent", data: message });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
});

// Fetch messages between two users (conversation history)
router.get('/conversation/:userId', requireAuth, async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const userId = req.user.id; // Current authenticated user

    // Find all messages between the two users (both sent and received)
    const messages = await Message.find({
      $or: [
        { sender_id: userId, receiver_id: otherUserId },
        { sender_id: otherUserId, receiver_id: userId }
      ]
    }).sort('created_at'); // Sort by time

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
});

module.exports = router;
