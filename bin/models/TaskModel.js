"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const modelOption_1 = __importDefault(require("./modelOption"));
const taskSchema = new mongoose_1.default.Schema({
    section: { type: mongoose_1.default.Types.ObjectId, ref: "Section", required: true },
    title: { type: String, default: "Untitled" },
    content: { type: String, default: "" },
    position: {
        type: Number,
    },
}, modelOption_1.default);
const TaskModel = mongoose_1.default.model("Task", taskSchema);
exports.default = TaskModel;
