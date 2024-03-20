import mongoose from "mongoose";
import schemaOptions from "./modelOption";
import { IUser } from "../configs/interface";

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    userName: { type: String, default: "", maxLength: 20 },
    password: { type: String, required: true, select: false },

    isActive: { type: Boolean, default: false, select: false },

    otp: { type: String, default: "", select: false },
    otpExpires: { type: Date, default: null, select: false },

    refreshToken: { type: String, default: "", select: false },
  },
  schemaOptions
);

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
