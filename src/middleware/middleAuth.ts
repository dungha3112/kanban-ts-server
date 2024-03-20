import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";
import { IDecodedToken, IReqAuth, IUser } from "../configs/interface";

const tokenDecode = (req: Request) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ")[1];
    try {
      const tokenDecoded = <IDecodedToken>(
        jwt.verify(bearer, `${process.env.ACCESS_TOKEN_SECRET}`)
      );
      return tokenDecoded;
    } catch {
      return false;
    }
  } else {
    return false;
  }
};

const verifyToken = async (
  req: IReqAuth,
  res: Response,
  next: NextFunction
) => {
  const decoded = tokenDecode(req);
  if (decoded) {
    const user = <IUser>await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    req.user = user;
    next();
  } else {
    res.status(401).json({ msg: "Unauthorized" });
  }
};

export default verifyToken;
