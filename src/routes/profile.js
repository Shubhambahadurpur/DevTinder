const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateUpdateProfileData } = require('../utils/validation')

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err?.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    validateUpdateProfileData(req);
    Object.keys(req?.body)?.forEach(key => loggedInUser[key] = req?.body[key]);
    const updatedData = await loggedInUser.save();
    res.json({ message: "Profile Update", data: updatedData });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
