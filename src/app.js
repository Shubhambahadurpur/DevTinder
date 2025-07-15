const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
require('dotenv').config();
const { validateSignUpData } = require('./utils/validation')
const bcrypt = require('bcrypt');


app.use(express.json());

app.get("/users", async (req, res) => { // get all user data
  const data = await User.find({});
  res.send(data);
});

app.get("/user", async (req, res) => { // get by email id
  try {
    const { emailId } = req.query;
    const data = await User.findOne({ emailId: emailId });
    res.send(data);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/user", async (req, res) => { // create new user
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
});

app.delete("/user", async (req, res) => { // delete user api
    try {
        const user = await User.findOne({ emailId: req?.body?.emailId });
        await User.findByIdAndDelete(user?._id)
        res.send("User Deleted Successfully");
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

app.patch("/user/:userId", async (req, res) => { // update user api
    const userId = req.params?.userId;
    const body = req?.body;
    try {
        const ALLOWED_FEILDS =  ['about', 'gender', 'profilePhoto', 'skills'];
        const IS_ALLOWED = Object.keys(body)?.every(key => ALLOWED_FEILDS.includes(key));
        if (!IS_ALLOWED) throw new Error("Update not allowed");
        await User.findByIdAndUpdate(userId, req.body, { runValidators: true });
        res.send("User Updated Successfully");
    } catch (err) {
        res.status(500).send("Internal Server Error " + err);
    }
})

app.post("/login", async (req, res) => {

  const { emailId, password } = req?.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) throw new Error("Invalid Credentials");
    const isPasswordCorrect = await bcrypt.compare(password, user?.password);
    if(!isPasswordCorrect) throw new Error("Invalid Credentials");
    res.send("user found")
  } catch (err) {
    res.status(400).send("Error:" + err?.message);
  }
})


connectDB()
  .then(() => {
    console.log("DB Connection Successful");
    app.listen(3000, () => {
      console.log("Server is listning on port 3000");
    });
  })
  .catch((err) => {
    console.log("DB Connection Failed");
  });
