const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { validateConnectionStatus } = require("../utils/validation");
const User = require("../models/user");

requestRouter.post('/send/:status/:userId', userAuth, async (req, res) => {
    try {
        const fromUserId  = req?.user?._id;
        const toUserId = req?.params?.userId;
        const status = req?.params?.status;

        validateConnectionStatus(status);

        const toUserIdExist = await User.findOne({ _id: toUserId });
        if (!toUserIdExist) {
            res.status(404).json({ message: "User not found"});
        }

        const connectionRequestExist = await ConnectionRequest.findOne({ $or: [ {fromUserId, toUserId}, {fromUserId: toUserId, toUserId: fromUserId} ] });

        if (connectionRequestExist) { // if connection already exist
            throw new Error("Connection Request Already Exist.");
        }
    
        const connectionRequest = new ConnectionRequest({ fromUserId, toUserId, status });
        const data = await connectionRequest.save();
        res.json({ message: `${req.user.firstName + " " + status + " " + toUserIdExist.firstName}`, data })
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = requestRouter;