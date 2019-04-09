const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    
    email: {
        type: String,
        required: true
    },

    user: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    resetToken: String,

    resetTokenExpiration: Date
});

module.exports = mongoose.model('User', User);