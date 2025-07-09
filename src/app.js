const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
require('dotenv').config();


app.use(express.json());

app.get("/users", async (req, res) => {
  const data = await User.find({});
  res.send(data);
});

app.get("/user", async (req, res) => {
  try {
    const { emailId } = req.query;
    const data = await User.findOne({ emailId: emailId });
    res.send(data);
  } catch (err) {
    res.status(500).send("Internam Server Error");
  }
});

app.post("/user", async (req, res) => {
  const user = new User(req?.body);
  try {
    await user.save();
    res.send("post req");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/user", async (req, res) => {
    try {
        const user = await User.findOne({ emailId: req?.body?.emailId });
        await User.findByIdAndDelete(user?._id)
        res.send("User Deleted Successfully");
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

app.patch("/user", async (req, res) => {
    const { userId, firstName } = req?.body;
    try {
        await User.findByIdAndUpdate(userId, { firstName });
        res.send("User Updated Successfully");
    } catch (err) {
        res.status(500).send("Internal Server Error");
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
