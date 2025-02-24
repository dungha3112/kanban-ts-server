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
const tokenDecode = (req) => {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
        const bearer = bearerHeader.split(" ")[1];
        try {
            const tokenDecoded = (jsonwebtoken_1.default.verify(bearer, `${process.env.ACCESS_TOKEN_SECRET}`));
            return tokenDecoded;
        }
        catch (_a) {
            return false;
        }
    }
    else {
        return false;
    }
};
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = tokenDecode(req);
    if (decoded) {
        const user = yield UserModel_1.default.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        req.user = user;
        next();
    }
    else {
        res.status(401).json({ msg: "Unauthorized" });
    }
});
exports.default = verifyToken;
