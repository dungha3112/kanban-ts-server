"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const modelOption_1 = __importDefault(require("./modelOption"));
const boardSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Types.ObjectId, ref: "User", required: true },
    icon: { type: String, default: "📰" },
    title: { type: String, default: "Untitled" },
    description: {
        type: String,
        default: ` Add description here
      ✔ You can add multiline description
      ✔ Let's start ... `,
    },
    position: { type: Number },
    favourite: { type: Boolean, default: false },
    favouritePosition: { type: Number, default: 0 },
}, modelOption_1.default);
const BoardModel = mongoose_1.default.model("Board", boardSchema);
exports.default = BoardModel;
