"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const modelOption_1 = __importDefault(require("./modelOption"));
const sectionSchema = new mongoose_1.default.Schema({
    board: { type: mongoose_1.default.Types.ObjectId, ref: "Board", required: true },
    title: { type: String, default: "Untitled" },
}, modelOption_1.default);
const SectionModel = mongoose_1.default.model("Section", sectionSchema);
exports.default = SectionModel;
