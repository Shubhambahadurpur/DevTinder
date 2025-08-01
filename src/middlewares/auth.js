const jwt = require("jsonwebtoken");
const User = require("../models/user");
const secretKey = process.env.AUTH_SECRET_KEY;


const userAuth = async (req, res, next) => {
  try {
    const { token } = req?.cookies;
    if (!token) {
      return res.status(401).send("Invalid Token");
    }
    const decodedTokenData = await jwt.verify(token, secretKey);

    const user = await User.findById(decodedTokenData?._id);
    if (!user) {
      throw new Error("User Not found");
    }
    req.user = user; 
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err?.message);
  }
};

module.exports = { userAuth };