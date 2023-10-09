"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const emailSchema = new mongoose_1.Schema({ email: {
        type: String,
        unique: true,
        required: true
    } }, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)("Email", emailSchema);