const express = require("express");
const app = express();
const connectDB = require("./config/database");
require('dotenv').config();
const cookieParser = require("cookie-parser");
const cors = require('cors');

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/request', requestRouter);
app.use('/user', userRouter);


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
