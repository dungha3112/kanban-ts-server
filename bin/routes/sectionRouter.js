"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validation_1 = __importDefault(require("../middleware/validation"));
const middleAuth_1 = __importDefault(require("../middleware/middleAuth"));
const sectionCtrl_1 = __importDefault(require("../controllers/sectionCtrl"));
const router = express_1.default.Router();
router.post("/:boardId/sections", (0, express_validator_1.param)("boardId").custom((value) => {
    if (!validation_1.default.isObjectId(value)) {
        return Promise.reject("Invalid board id.");
    }
    else {
        return Promise.resolve();
    }
}), validation_1.default.validate, middleAuth_1.default, sectionCtrl_1.default.create);
router.put("/:boardId/sections/:sectionId", (0, express_validator_1.param)("boardId").custom((value) => {
    if (!validation_1.default.isObjectId(value)) {
        return Promise.reject("Invalid board id.");
    }
    else {
        return Promise.resolve();
    }
}), (0, express_validator_1.param)("sectionId").custom((value) => {
    if (!validation_1.default.isObjectId(value)) {
        return Promise.reject("Invalid section id.");
    }
    else {
        return Promise.resolve();
    }
}), validation_1.default.validate, middleAuth_1.default, sectionCtrl_1.default.updateSectionById);
router.delete("/:boardId/sections/:sectionId", (0, express_validator_1.param)("boardId").custom((value) => {
    if (!validation_1.default.isObjectId(value)) {
        return Promise.reject("Invalid board id.");
    }
    else {
        return Promise.resolve();
    }
}), (0, express_validator_1.param)("sectionId").custom((value) => {
    if (!validation_1.default.isObjectId(value)) {
        return Promise.reject("Invalid section id.");
    }
    else {
        return Promise.resolve();
    }
}), validation_1.default.validate, middleAuth_1.default, sectionCtrl_1.default.deleteSectionById);
const sectionRouter = router;
exports.default = sectionRouter;
