import express from "express";
import { param } from "express-validator";
import validation from "../middleware/validation";
import verifyToken from "../middleware/middleAuth";
import sectionCtrl from "../controllers/sectionCtrl";

const router = express.Router();

router.post(
  "/:boardId/sections",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid board id.");
    } else {
      return Promise.resolve();
    }
  }),
  validation.validate,
  verifyToken,
  sectionCtrl.create
);

router.put(
  "/:boardId/sections/:sectionId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid board id.");
    } else {
      return Promise.resolve();
    }
  }),
  param("sectionId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid section id.");
    } else {
      return Promise.resolve();
    }
  }),
  validation.validate,
  verifyToken,
  sectionCtrl.updateSectionById
);

router.delete(
  "/:boardId/sections/:sectionId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid board id.");
    } else {
      return Promise.resolve();
    }
  }),
  param("sectionId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid section id.");
    } else {
      return Promise.resolve();
    }
  }),
  validation.validate,
  verifyToken,
  sectionCtrl.deleteSectionById
);

const sectionRouter = router;
export default sectionRouter;
