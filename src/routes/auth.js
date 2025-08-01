const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const { validateSignUpData } = require('../utils/validation');
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

authRouter.post("/signup", async (req, res) => { // create new user
  try {
    validateSignUpData(req);
    const { password } = req.body;

    const encryptPassword = await bcrypt.hash(password, 10);
    const data = {
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      emailId: req?.body?.emailId,
      password: encryptPassword,
      age: req?.body?.age,
      gender: req?.body?.gender,
      profilePhoto: req?.body?.profilePhoto,
      about: req?.body?.about,
      skills: req?.body?.skills
    }
    const user = new User(data);
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("Internal Server Error "+ err);
  }
})

authRouter.post("/login", async (req, res) => { // login

  const { emailId, password } = req?.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) throw new Error("Invalid Credentials");
    const isPasswordCorrect = await user.validatePassword(password);
    if(!isPasswordCorrect) throw new Error("Invalid Credentials");

    const token = await user.getJWT();

    res.cookie("token", token);
    res.send(user);
  } catch (err) {
    res.status(400).send("Error:" + err?.message);
  }
})

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {expires: new Date(Date.now())});
  res.send("Logout successfully.");
})

authRouter.patch("/password", userAuth, async (req, res) => {
  try {
    const oldPassword = req.body?.oldPassword;
    const newPassword = req.body?.newPassword
    if (!oldPassword || !newPassword) {
      throw new Error("Password is mandatory");
    }
    const user = req.user;
    const isPasswordCorrect = await user.validatePassword(oldPassword)
    if (!isPasswordCorrect) {
      throw new Error("Wrong Password");
    }
    const encryptPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user?._id, { password: encryptPassword }, { runValidators: true });
    res.cookie("token", null, { expires: new Date(Date.now())});
    res.send("Password Updated")
  } catch (err) {
    res.status(400).send("ERROR: "+ err.message)
  }
})

module.exports = authRouter;