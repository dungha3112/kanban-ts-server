import express, { Response } from "express";
import { param } from "express-validator";
import verifyToken from "../middleware/middleAuth";

import validation from "../middleware/validation";
import boardCtrl from "../controllers/boardCtrl";

const router = express.Router();

router
  .route("/")
  .post(verifyToken, boardCtrl.create)
  .get(verifyToken, boardCtrl.getAll)
  .put(verifyToken, boardCtrl.updatePosition);

router
  .route("/favourites")
  .get(verifyToken, boardCtrl.getFavourites)
  .put(verifyToken, boardCtrl.updateFavouritePosition);

router.get(
  "/:boardId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid board id.");
    } else {
      return Promise.resolve();
    }
  }),
  validation.validate,
  verifyToken,
  boardCtrl.getBoardById
);
router.put(
  "/:boardId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid board id.");
    } else {
      return Promise.resolve();
    }
  }),
  validation.validate,
  verifyToken,
  boardCtrl.updateBoardById
);
router.delete(
  "/:boardId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid board id.");
    } else {
      return Promise.resolve();
    }
  }),
  validation.validate,
  verifyToken,
  boardCtrl.deleteBoardById
);

const boardRouter = router;

export default boardRouter;
