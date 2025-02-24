"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const generateToken_1 = require("../configs/generateToken");
const sendMail_1 = require("../configs/sendMail");
const bcrypt_1 = __importDefault(require("bcrypt"));
const CLIENT_URL = process.env.BASE_URL;
const authCtrl = {
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const passwordHash = yield bcrypt_1.default.hash(password, 12);
            const userName = email.replace("@gmail.com", "");
            const otp = (0, generateToken_1.generateOTP)();
            const otpExpires = Date.now() + 10 * 60 * 1000;
            const otpHash = yield bcrypt_1.default.hash(otp, 12);
            const userExist = yield UserModel_1.default.findOne({
                email: email.toLowerCase(),
            }).select("+isActive");
            if (!userExist) {
                yield UserModel_1.default.create({
                    email,
                    userName,
                    password: passwordHash,
                    otp: otpHash,
                    otpExpires,
                });
                (0, sendMail_1.sendMailOTP)(email, otp);
                return res.status(200).json({
                    msg: `Sent otp success, Please check ${email}`,
                });
            }
            else {
                if (userExist.isActive) {
                    return res.status(401).json({
                        msg: "The account has been activated. You can login now",
                    });
                }
                else {
                    yield UserModel_1.default.findOneAndUpdate({ email }, {
                        userName,
                        password: passwordHash,
                        otp: otpHash,
                        otpExpires,
                    });
                    (0, sendMail_1.sendMailOTP)(email, otp);
                    return res.status(200).json({
                        msg: `Sent otp success, Please check ${email}`,
                    });
                }
            }
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
    activeEmail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { otp, email } = req.body;
        try {
            const userExist = yield UserModel_1.default.findOne({
                email: email.toLowerCase(),
            }).select("+isActive");
            if (!userExist)
                return res.status(404).json({
                    msg: "The account not found with email.",
                });
            if (userExist.isActive) {
                return res.status(401).json({
                    msg: "The account has been activated. You can login now",
                });
            }
            const user = yield UserModel_1.default.findOne({
                email: email.toLowerCase(),
                otpExpires: { $gt: Date.now() },
            }).select("+isActive +otp +otpExpires");
            if (!user) {
                return res.status(401).json({
                    msg: "The OTP code expires. Please try again.",
                });
            }
            const otpMatched = yield bcrypt_1.default.compare(otp, user.otp);
            if (!otpMatched) {
                return res.status(401).json({ msg: "The OTP code does not match." });
            }
            const token = (0, generateToken_1.generateAccessToken)({ id: user._id });
            const refreshToken = (0, generateToken_1.generateRefreshToken)({ id: user._id }, res);
            const newUser = yield UserModel_1.default.findByIdAndUpdate(user._id, {
                $set: { isActive: true, refreshToken, otpExpires: null, otp: "" },
            }, { new: true });
            return res.status(201).json({
                token,
                user: Object.assign(Object.assign({}, newUser === null || newUser === void 0 ? void 0 : newUser._doc), { password: "" }),
            });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const user = yield UserModel_1.default.findOne({
                email: email.toLowerCase(),
            }).select("+password +isActive");
            if (user) {
                if (!user.isActive) {
                    return res.status(404).json({
                        msg: "User not found with email.",
                    });
                }
            }
            else {
                return res.status(404).json({
                    msg: "User not found with email.",
                });
            }
            const isMatched = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatched) {
                return res.status(401).json({ msg: "The password does not match." });
            }
            const token = (0, generateToken_1.generateAccessToken)({ id: user._id });
            const refreshToken = (0, generateToken_1.generateRefreshToken)({ id: user._id }, res);
            yield UserModel_1.default.findByIdAndUpdate(user._id, {
                $set: { refreshToken },
            });
            res.status(201).json({
                token,
                user: Object.assign(Object.assign({}, user._doc), { password: "" }),
            });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
    refreshToken: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const cookie = req.cookies.refreshToken;
            if (!cookie) {
                return res.status(404).json({ msg: "No fresh token in the cookies." });
            }
            const decoded = (jsonwebtoken_1.default.verify(cookie, `${process.env.REFRESH_TOKEN_SECRET}`));
            if (!decoded) {
                return res.status(400).json({ msg: "Invalid authentication!" });
            }
            const user = yield UserModel_1.default.findById(decoded.id).select("+refreshToken");
            if (cookie !== (user === null || user === void 0 ? void 0 : user.refreshToken)) {
                return res.status(404).json({
                    msg: "There is something wrong with refresh token",
                });
            }
            const token = (0, generateToken_1.generateAccessToken)({ id: user === null || user === void 0 ? void 0 : user._id });
            const refreshToken = (0, generateToken_1.generateRefreshToken)({ id: user === null || user === void 0 ? void 0 : user._id }, res);
            yield UserModel_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, { $set: { refreshToken } }, { new: true });
            res.status(200).json({
                user: Object.assign(Object.assign({}, user === null || user === void 0 ? void 0 : user._doc), { refreshToken: "" }),
                token,
            });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
    logout: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            yield UserModel_1.default.findByIdAndUpdate({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }, { $set: { refreshToken: "" } }, { new: true });
            res.clearCookie("refreshToken", { path: "/api/v1/auth/refresh_token" });
            res.status(200).json({ msg: "Logged out." });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
    forgotPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = req.body;
        try {
            const user = yield UserModel_1.default.findOne({ email: email.toLowerCase() });
            if (!user) {
                return res.status(404).json({
                    msg: "The account not found with email.",
                });
            }
            const access_token = (0, generateToken_1.generateForgotPasswordToken)({ id: user._id });
            const url = `${CLIENT_URL}/reset-password/${access_token}`;
            (0, sendMail_1.sendMailToken)(email, url, "Forgot password?");
            res
                .status(200)
                .json({ msg: `Sended link reset password. Please check ${email}` });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
    resetPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { token, password } = req.body;
        try {
            const decoded = (jsonwebtoken_1.default.verify(token, `${process.env.FORGOT_PASSWORD_TOKEN_SECRET}`));
            if (!decoded) {
                return res.status(400).json({ msg: "Invalid authentication!" });
            }
            const passwordHash = yield bcrypt_1.default.hash(password, 12);
            const accessToken = (0, generateToken_1.generateAccessToken)({ id: decoded.id });
            const refreshToken = (0, generateToken_1.generateRefreshToken)({ id: decoded.id }, res);
            const user = yield UserModel_1.default.findByIdAndUpdate(decoded.id, {
                $set: { password: passwordHash, refreshToken },
            }, { new: true });
            res.status(201).json({
                token: accessToken,
                user: Object.assign(Object.assign({}, user === null || user === void 0 ? void 0 : user._doc), { password: "", refreshToken: "" }),
            });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
};
exports.default = authCtrl;
