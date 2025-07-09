const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://DevTinder:B9NPzZE1hsOwTw1K@cluster0.jf40pow.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
}

module.exports = connectDB;