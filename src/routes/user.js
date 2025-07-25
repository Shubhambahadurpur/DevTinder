const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const userRouter = express.Router();
const USER_DATA = ["firstName", "lastName", "age", "skills", "gender", "profilePhoto"];

userRouter.get('/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser?._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "age", "skills", "gender", "profilePhoto"]);
        res.json({ message : "Data fetched successfully.", data: connectionRequests})
    } catch (err) {
        res.status(400).send("ERROR: " + err.messsage);
    }
})

userRouter.get('/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser?._id, status: "accepted" },
                { toUserId: loggedInUser?._id, status: "accepted" }
            ]
        }).populate("fromUserId", USER_DATA).populate("toUserId", USER_DATA);
        const data = connections?.map(row => {
            if (row.fromUserId?._id.toString() === loggedInUser?._id.toString()) {
                return row.toUserId;
            } else {
                return row.fromUserId;
            }
        });

        res.json({ message: "Data Fetched Successfully", data})
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req?.user;
        const pageNo = parseInt(req.query?.pageNo) || 1;
        let pageSize = parseInt(req.query?.pageSize) || 10;
        pageSize = pageSize > 50 ? 50 : pageSize;


        const SKIP = (pageNo - 1) * pageSize;
        const connectionRequests = await ConnectionRequest.find({}).select(["fromUserId", "toUserId"]);
        const hideUsers = new Set();

        connectionRequests.forEach(request => {
            hideUsers.add(request?.fromUserId);
            hideUsers.add(request?.toUserId);
        });

        const data = await User.find({
            $and: [
            { _id: { $nin: Array.from(hideUsers)}},
            { _id: { $ne: loggedInUser?._id }}
            ]
        }).select(USER_DATA).skip(SKIP).limit(pageSize);
        res.json({ message: "Data", data });
    } catch (err) {
        res.status(400).send("ERROR: " + err?.message);
    }
})

module.exports = userRouter;