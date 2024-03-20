import express from "express";
import { body, param } from "express-validator";
import validation from "../middleware/validation";
import verifyToken from "../middleware/middleAuth";
import taskCtrl from "../controllers/taskCtrl";

const router = express.Router();

router.post(
  "/:boardId/tasks",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid board id.");
    } else {
      return Promise.resolve();
    }
  }),

  body("sectionId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid section id.");
    } else {
      return Promise.resolve();
    }
  }),

  validation.validate,
  verifyToken,
  taskCtrl.create
);

router.put(
  "/:boardId/tasks/update-position",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid board id.");
    } else {
      return Promise.resolve();
    }
  }),

  validation.validate,
  verifyToken,
  taskCtrl.updatePosition
);

router.put(
  "/:boardId/tasks/:taskId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid board id.");
    } else {
      return Promise.resolve();
    }
  }),
  param("taskId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid task id.");
    } else {
      return Promise.resolve();
    }
  }),
  validation.validate,
  verifyToken,
  taskCtrl.updateTaskById
);

router.delete(
  "/:boardId/tasks/:taskId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid board id.");
    } else {
      return Promise.resolve();
    }
  }),
  param("taskId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid task id.");
    } else {
      return Promise.resolve();
    }
  }),
  validation.validate,
  verifyToken,
  taskCtrl.deleteTaskById
);

const taskRouter = router;
export default taskRouter;
