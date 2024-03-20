import express from "express";
import userCtrl from "../controllers/userCtrl";
import verifyToken from "../middleware/middleAuth";
import { body } from "express-validator";
import validation from "../middleware/validation";

const router = express.Router();

router.put(
  "/update-info",
  body("userName")
    .not()
    .isEmpty()
    .withMessage("Please enter user name")
    .isLength({ max: 20 })
    .withMessage("UserName up to 20 characters long."),
  validation.validate,
  verifyToken,
  userCtrl.updateInfo
);
router.put(
  "/update-password",
  body("password")
    .not()
    .isEmpty()
    .withMessage("Please enter password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),

  validation.validate,
  verifyToken,
  userCtrl.updatePassword
);

const userRouter = router;
export default userRouter;
