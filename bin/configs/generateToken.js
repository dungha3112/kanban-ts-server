"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = exports.generateForgotPasswordToken = exports.generateOTP = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const generateOTP = () => {
    return otp_generator_1.default.generate(8, {
        specialChars: false,
    });
};
exports.generateOTP = generateOTP;
const generateForgotPasswordToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, `${process.env.FORGOT_PASSWORD_TOKEN_SECRET}`, {
        expiresIn: "10m",
    });
};
exports.generateForgotPasswordToken = generateForgotPasswordToken;
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, `${process.env.ACCESS_TOKEN_SECRET}`, {
        expiresIn: "24h",
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload, res) => {
    const refresh_token = jsonwebtoken_1.default.sign(payload, `${process.env.REFRESH_TOKEN_SECRET}`, { expiresIn: "24h" });
    res.cookie("refreshToken", refresh_token, {
        httpOnly: true,
        path: "/api/v1/auth/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: "none",
    });
    return refresh_token;
};
exports.generateRefreshToken = generateRefreshToken;
