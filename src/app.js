const express = require("express");
const app = express();
const connectDB = require("./config/database");
require('dotenv').config();
const cookieParser = require("cookie-parser");

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');

app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);


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
