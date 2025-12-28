const mongoose = require('mongoose');

// require('dotenv').config();

function connectDB() {
    mongoose.connect(process.env.DB_CONNECT).then(() => {
        console.log('Connected to MongoDB');
    }).catch(err => console.log(err));
}

module.exports = connectDB;