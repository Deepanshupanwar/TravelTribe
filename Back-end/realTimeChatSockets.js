const { Server } = require('socket.io');
const Message = require('./Models/Messages');

// User mapping
const users = {};

const initSockets = (server) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Register user when they connect
    socket.on('register', (username) => {
      users[socket.id] = username;
      console.log(`${socket.id} - ${username} has joined the chat.`);
    });

    // Listen for private messages from the client
    socket.on('private message', async ({ recipientUsername, message_text }) => {
      try {
        const message = new Message({
          sender_id: socket.id,
          receiver_id: recipientUsername,  // This should be updated when using MongoDB IDs
          message_text,
        });

        /*  message.save is left but that is after I figure out how to auntheticate userses and fetch their 
        mongodbinique id and then save into database, not hard but for now cahtting fuinctionalit shows
        await message.save();
        */

        // Find the recipient's socket ID
        const receiverSocketId = Object.keys(users).find(
          (key) => users[key] === recipientUsername
        );

        if (receiverSocketId) {
          // Emit the message to the recipient
          io.to(receiverSocketId).emit('private message', {
            message: message.message_text,
            sender: users[socket.id],
          });

          // Emit the message back to the sender for confirmation
          io.to(socket.id).emit('private message', {
            message: message.message_text,
            sender: 'you',
          });
        } else {
          console.log('Recipient not found or disconnected.');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      const disconnectedUser = users[socket.id];
      if (disconnectedUser) {
        console.log(`${disconnectedUser} XXdisconnected with XXXXX socket ID: ${socket.id}`);
        delete users[socket.id]; // Remove the user from the list
      }
    });
  });
};

module.exports = initSockets;
