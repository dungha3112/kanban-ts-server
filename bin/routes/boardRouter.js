"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const middleAuth_1 = __importDefault(require("../middleware/middleAuth"));
const validation_1 = __importDefault(require("../middleware/validation"));
const boardCtrl_1 = __importDefault(require("../controllers/boardCtrl"));
const router = express_1.default.Router();
router
    .route("/")
    .post(middleAuth_1.default, boardCtrl_1.default.create)
    .get(middleAuth_1.default, boardCtrl_1.default.getAll)
    .put(middleAuth_1.default, boardCtrl_1.default.updatePosition);
router
    .route("/favourites")
    .get(middleAuth_1.default, boardCtrl_1.default.getFavourites)
    .put(middleAuth_1.default, boardCtrl_1.default.updateFavouritePosition);
router.get("/:boardId", (0, express_validator_1.param)("boardId").custom((value) => {
    if (!validation_1.default.isObjectId(value)) {
        return Promise.reject("Invalid board id.");
    }
    else {
        return Promise.resolve();
    }
}), validation_1.default.validate, middleAuth_1.default, boardCtrl_1.default.getBoardById);
router.put("/:boardId", (0, express_validator_1.param)("boardId").custom((value) => {
    if (!validation_1.default.isObjectId(value)) {
        return Promise.reject("Invalid board id.");
    }
    else {
        return Promise.resolve();
    }
}), validation_1.default.validate, middleAuth_1.default, boardCtrl_1.default.updateBoardById);
router.delete("/:boardId", (0, express_validator_1.param)("boardId").custom((value) => {
    if (!validation_1.default.isObjectId(value)) {
        return Promise.reject("Invalid board id.");
    }
    else {
        return Promise.resolve();
    }
}), validation_1.default.validate, middleAuth_1.default, boardCtrl_1.default.deleteBoardById);
const boardRouter = router;
exports.default = boardRouter;
