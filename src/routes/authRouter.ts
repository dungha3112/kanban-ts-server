import express from "express";
import { body } from "express-validator";
import authCtrl from "../controllers/authCtrl";
import verifyToken from "../middleware/middleAuth";

import validation from "../middleware/validation";

const router = express.Router();

router.post(
  "/register",
  body("email")
    .not()
    .isEmpty()
    .withMessage("Please enter email")

    .isEmail()
    .withMessage("Invalid email."),

  body("password")
    .not()
    .isEmpty()
    .withMessage("Please enter password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),

  validation.validate,
  authCtrl.register
);

router.post(
  "/login",
  body("email")
    .not()
    .isEmpty()
    .withMessage("Please enter email")
    .isEmail()
    .withMessage("Invalid email."),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Please enter password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),

  validation.validate,
  authCtrl.login
);

router.post(
  "/active-email",
  body("email")
    .not()
    .isEmpty()
    .withMessage("Please enter email")
    .isEmail()
    .withMessage("Invalid email."),
  body("otp")
    .not()
    .isEmpty()
    .withMessage("Please enter otp")
    .isLength({ min: 8 })
    .withMessage("Otp must be at least 8 characters."),

  validation.validate,
  authCtrl.activeEmail
);

router.get("/refresh_token", authCtrl.refreshToken);
router.post("/logout", verifyToken, authCtrl.logout);

router.post(
  "/forgot-password",
  body("email")
    .not()
    .isEmpty()
    .withMessage("Please enter email")
    .isEmail()
    .withMessage("Invalid email."),

  validation.validate,
  authCtrl.forgotPassword
);

router.post(
  "/reset-password",
  body("token").not().isEmpty().withMessage("Please enter token"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Please enter password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),

  validation.validate,
  authCtrl.resetPassword
);

const authRouter = router;
export default authRouter;
