const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    airtableUserId: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
