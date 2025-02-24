"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // return res.status(400).json({ errors: errors.array() });
        return res.status(400).json({ msg: errors.array()[0].msg });
    }
    next();
};
const isObjectId = (value) => mongoose_1.default.Types.ObjectId.isValid(value);
const validation = { validate, isObjectId };
exports.default = validation;
