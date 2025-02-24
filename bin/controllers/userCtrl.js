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
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const userCtrl = {
    updateInfo: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { userName } = req.body;
        try {
            if (userName.length > 20) {
                return res
                    .status(401)
                    .json({ msg: "UserName up to 20 characters long." });
            }
            const user = yield UserModel_1.default.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, { $set: { userName } }, { new: true });
            res.status(200).json({
                msg: "Updated",
                user,
            });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
    updatePassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const { password } = req.body;
        try {
            const passwordHash = yield bcrypt_1.default.hash(password, 12);
            const user = yield UserModel_1.default.findByIdAndUpdate((_b = req.user) === null || _b === void 0 ? void 0 : _b._id, { $set: { password: passwordHash } }, { new: true });
            res.status(200).json({
                msg: "Updated",
            });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
};
exports.default = userCtrl;
