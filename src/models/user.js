const { mongoose } = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastname: { type: String },
    emailId: { type: String },
    password: { type: String },
    age: { type: Number },
    gender: { type: String },
})

module.exports = mongoose.model("User", userSchema);