const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("./middlewares/auth");

requestRouter.get('/sendConnectionRequest', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send("Request is send by " + user.firstName);
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
})

module.exports = requestRouter;