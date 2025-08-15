const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { Chat } = require('../models/chat');
const chatRouter = express.Router()

chatRouter.post('/get-chat-history', userAuth, async (req, res) => {
    const loggedInUser = req?.user;
    const { targetUserId } = req?.body;
    try {
        const chatHistory = await Chat.findOne({
            participants: { $all: [loggedInUser?._id, targetUserId,]}
        }).populate("messages.senderId", ["firstName"])
        if (!chatHistory) {
            res.send([]);
        }
        res.send(chatHistory?.messages);
    } catch (err) {
        console.log(err);
        res.status(400).send("ERROR", err?.message)
    }
})

module.exports = chatRouter;