"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userCtrl_1 = __importDefault(require("../controllers/userCtrl"));
const middleAuth_1 = __importDefault(require("../middleware/middleAuth"));
const express_validator_1 = require("express-validator");
const validation_1 = __importDefault(require("../middleware/validation"));
const router = express_1.default.Router();
router.put("/update-info", (0, express_validator_1.body)("userName")
    .not()
    .isEmpty()
    .withMessage("Please enter user name")
    .isLength({ max: 20 })
    .withMessage("UserName up to 20 characters long."), validation_1.default.validate, middleAuth_1.default, userCtrl_1.default.updateInfo);
router.put("/update-password", (0, express_validator_1.body)("password")
    .not()
    .isEmpty()
    .withMessage("Please enter password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."), validation_1.default.validate, middleAuth_1.default, userCtrl_1.default.updatePassword);
const userRouter = router;
exports.default = userRouter;
