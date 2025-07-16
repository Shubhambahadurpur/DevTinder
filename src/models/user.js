const { mongoose } = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, "Too short name"],
    maxLength: [50, "Too long name"]
  },
  lastName: { 
    type: String 
  },
  emailId: { 
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email")
      }
    }
  },
  password: { 
    type: String,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Weak Password");
      }
    }
  },
  age: { 
    type: Number,
    min: [18, "Age should be above 18"],
    required: true
  },
  gender: { 
    type: String,
    validate(value) {
        if(!["male", "female"].includes(value)) {
            throw new Error("Gender is not valid")
        }
    }
  },
  profilePhoto: {
    type: String,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2XpA_J7m2G2hSns2UcaNwHO1vTC96DqbiGw&s",
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid profile photo url");
      }
    }
  },
  about: {
    type: String,
    default: `Hey I am a developer and I love dev Tinder`,
    maxLength: 100
  },
  skills: {
    type: [String]
  }
}, { timestamps : true });

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user?._id }, process.env.AUTH_SECRET_KEY, { expiresIn: '1hr'})
  return token;
}

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordCorrect = await bcrypt.compare(password, passwordHash);
  return isPasswordCorrect;
}

module.exports = mongoose.model("User", userSchema);