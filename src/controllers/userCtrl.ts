import bcrypt from "bcrypt";
import { Response } from "express";
import { IReqAuth, IUser } from "../configs/interface";
import UserModel from "../models/UserModel";

const userCtrl = {
  updateInfo: async (req: IReqAuth, res: Response) => {
    const { userName } = <IUser>req.body;
    try {
      if (userName.length > 20) {
        return res
          .status(401)
          .json({ msg: "UserName up to 20 characters long." });
      }
      const user = await UserModel.findByIdAndUpdate(
        req.user?._id,
        { $set: { userName } },
        { new: true }
      );

      res.status(200).json({
        msg: "Updated",
        user,
      });
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },
  updatePassword: async (req: IReqAuth, res: Response) => {
    const { password } = <IUser>req.body;
    try {
      const passwordHash = await bcrypt.hash(password, 12);
      const user = await UserModel.findByIdAndUpdate(
        req.user?._id,
        { $set: { password: passwordHash } },
        { new: true }
      );

      res.status(200).json({
        msg: "Updated",
      });
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },
};

export default userCtrl;
