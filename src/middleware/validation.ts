import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.status(400).json({ errors: errors.array() });
    return res.status(400).json({ msg: errors.array()[0].msg });
  }
  next();
};

const isObjectId = (value: string) => mongoose.Types.ObjectId.isValid(value);

const validation = { validate, isObjectId };

export default validation;
