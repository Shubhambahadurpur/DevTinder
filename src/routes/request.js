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

requestRouter.post('/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req?.user;
        const status = req?.params?.status;
        const requestId = req?.params?.requestId;

        const ALLOWED_USERS = ["accepted", "rejected"];
        if (!ALLOWED_USERS?.includes(status)) {
            throw new Error("Status not allowed");
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser?._id,
            status: "interested",
        })

        if (!connectionRequest) {
            throw new Error("Connection Request Not Found");
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({ message: "Connection Request Updated", data })
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = requestRouter;