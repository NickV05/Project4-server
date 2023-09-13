"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: String,
    location: String,
    username: String,
    image: {
        type: String,
        default: 'https://res.cloudinary.com/dyto7dlgt/image/upload/v1691526692/project3/avatar_h1b0st.jpg'
    },
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)("User", userSchema);
