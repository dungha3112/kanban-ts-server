"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authRouter_1 = __importDefault(require("./authRouter"));
const boardRouter_1 = __importDefault(require("./boardRouter"));
const sectionRouter_1 = __importDefault(require("./sectionRouter"));
const taskRouter_1 = __importDefault(require("./taskRouter"));
const userRouter_1 = __importDefault(require("./userRouter"));
const routes = {
    authRouter: authRouter_1.default,
    boardRouter: boardRouter_1.default,
    sectionRouter: sectionRouter_1.default,
    taskRouter: taskRouter_1.default,
    userRouter: userRouter_1.default,
};
exports.default = routes;
