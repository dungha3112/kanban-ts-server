"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const modelOption_1 = __importDefault(require("./modelOption"));
const userSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    userName: { type: String, default: "", maxLength: 20 },
    password: { type: String, required: true, select: false },
    isActive: { type: Boolean, default: false, select: false },
    otp: { type: String, default: "", select: false },
    otpExpires: { type: Date, default: null, select: false },
    refreshToken: { type: String, default: "", select: false },
}, modelOption_1.default);
const UserModel = mongoose_1.default.model("User", userSchema);
exports.default = UserModel;
