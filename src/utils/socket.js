
const { Server } = require("socket.io");
const { createHmac } = require('node:crypto');
const { Chat } = require("../models/chat");

const secret = process.env.AUTH_SECRET_KEY;
const getSecretId = (userId, targetUserId) => {
  return createHmac('sha256', secret)
               .update([userId, targetUserId].sort().join("_"))
               .digest('hex');
}

const initilizeSocket = (httpServer) => {

    const io = new Server(httpServer, { cors: {
      origin: 'http://localhost:5173'
    } });
    
    io.on("connection", (socket) => {
      socket.on("joinChat", ({userId, targetUserId}) => {
        const roomId = getSecretId(userId, targetUserId);
        socket.join(roomId)
      });
      
      socket.on("sendMessage", async ({firstName, userId, targetUserId, text}) => {
        const roomId = getSecretId(userId, targetUserId);
        try {
          let chat = await Chat.findOne({
            participants: { $all: [ userId, targetUserId ]}
          });

          if (!chat) {
            chat = new Chat ({
              participants: [userId, targetUserId],
              messages: []
            })
          }
          chat.messages.push({senderId: userId, text: text})
          await chat.save()
          io.to(roomId).emit("messageRecived", { firstName, text, senderId: userId});
        } catch (err) {
          console.log(err)
        }
      });

      socket.on("disconnect", () => {});
    });
}

module.exports = initilizeSocket;