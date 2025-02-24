"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const authCtrl_1 = __importDefault(require("../controllers/authCtrl"));
const middleAuth_1 = __importDefault(require("../middleware/middleAuth"));
const validation_1 = __importDefault(require("../middleware/validation"));
const router = express_1.default.Router();
router.post("/register", (0, express_validator_1.body)("email")
    .not()
    .isEmpty()
    .withMessage("Please enter email")
    .isEmail()
    .withMessage("Invalid email."), (0, express_validator_1.body)("password")
    .not()
    .isEmpty()
    .withMessage("Please enter password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."), validation_1.default.validate, authCtrl_1.default.register);
router.post("/login", (0, express_validator_1.body)("email")
    .not()
    .isEmpty()
    .withMessage("Please enter email")
    .isEmail()
    .withMessage("Invalid email."), (0, express_validator_1.body)("password")
    .not()
    .isEmpty()
    .withMessage("Please enter password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."), validation_1.default.validate, authCtrl_1.default.login);
router.post("/active-email", (0, express_validator_1.body)("email")
    .not()
    .isEmpty()
    .withMessage("Please enter email")
    .isEmail()
    .withMessage("Invalid email."), (0, express_validator_1.body)("otp")
    .not()
    .isEmpty()
    .withMessage("Please enter otp")
    .isLength({ min: 8 })
    .withMessage("Otp must be at least 8 characters."), validation_1.default.validate, authCtrl_1.default.activeEmail);
router.get("/refresh_token", authCtrl_1.default.refreshToken);
router.post("/logout", middleAuth_1.default, authCtrl_1.default.logout);
router.post("/forgot-password", (0, express_validator_1.body)("email")
    .not()
    .isEmpty()
    .withMessage("Please enter email")
    .isEmail()
    .withMessage("Invalid email."), validation_1.default.validate, authCtrl_1.default.forgotPassword);
router.post("/reset-password", (0, express_validator_1.body)("token").not().isEmpty().withMessage("Please enter token"), (0, express_validator_1.body)("password")
    .not()
    .isEmpty()
    .withMessage("Please enter password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."), validation_1.default.validate, authCtrl_1.default.resetPassword);
const authRouter = router;
exports.default = authRouter;
