const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String,
            minLength: 3,
            maxLength: 30,
            required: true,

        },
        age: {
            type: Number,
            min: 18,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "organizer", "admin"],
            default: "user",
        },
    },
    // schemaOptions
    {
        strict: false,
        timestamps: true,
    }
);


module.exports = mongoose.model('userModel', userSchema);