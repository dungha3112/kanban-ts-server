import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { IDecodedToken, IReqAuth, IUser } from "../configs/interface";
import UserModel from "../models/UserModel";
import {
  generateAccessToken,
  generateForgotPasswordToken,
  generateOTP,
  generateRefreshToken,
} from "../configs/generateToken";
import { sendMailOTP, sendMailToken } from "../configs/sendMail";
import bcrypt from "bcrypt";

const CLIENT_URL = process.env.BASE_URL;

const authCtrl = {
  register: async (req: Request, res: Response) => {
    const { email, password } = <IUser>req.body;

    try {
      const passwordHash = await bcrypt.hash(password, 12);
      const userName = email.replace("@gmail.com", "");
      const otp = generateOTP();
      const otpExpires = Date.now() + 10 * 60 * 1000;

      const otpHash = await bcrypt.hash(otp, 12);
      const userExist = await UserModel.findOne({
        email: email.toLowerCase(),
      }).select("+isActive");

      if (!userExist) {
        await UserModel.create({
          email,
          userName,
          password: passwordHash,
          otp: otpHash,
          otpExpires,
        });
        sendMailOTP(email, otp);
        return res.status(200).json({
          msg: `Sent otp success, Please check ${email}`,
        });
      } else {
        if (userExist.isActive) {
          return res.status(401).json({
            msg: "The account has been activated. You can login now",
          });
        } else {
          await UserModel.findOneAndUpdate(
            { email },
            {
              userName,
              password: passwordHash,
              otp: otpHash,
              otpExpires,
            }
          );
          sendMailOTP(email, otp);
          return res.status(200).json({
            msg: `Sent otp success, Please check ${email}`,
          });
        }
      }
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },
  activeEmail: async (req: Request, res: Response) => {
    const { otp, email } = <IUser>req.body;
    try {
      const userExist = await UserModel.findOne({
        email: email.toLowerCase(),
      }).select("+isActive");

      if (!userExist)
        return res.status(404).json({
          msg: "The account not found with email.",
        });

      if (userExist.isActive) {
        return res.status(401).json({
          msg: "The account has been activated. You can login now",
        });
      }

      const user = await UserModel.findOne({
        email: email.toLowerCase(),
        otpExpires: { $gt: Date.now() },
      }).select("+isActive +otp +otpExpires");
      if (!user) {
        return res.status(401).json({
          msg: "The OTP code expires. Please try again.",
        });
      }

      const otpMatched = await bcrypt.compare(otp, user.otp);
      if (!otpMatched) {
        return res.status(401).json({ msg: "The OTP code does not match." });
      }

      const token = generateAccessToken({ id: user._id });
      const refreshToken = generateRefreshToken({ id: user._id }, res);
      const newUser = await UserModel.findByIdAndUpdate(
        user._id,
        {
          $set: { isActive: true, refreshToken, otpExpires: null, otp: "" },
        },
        { new: true }
      );

      return res.status(201).json({
        token,
        user: { ...newUser?._doc, password: "" },
      });
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = <IUser>req.body;
    try {
      const user = await UserModel.findOne({
        email: email.toLowerCase(),
      }).select("+password +isActive");

      if (user) {
        if (!user.isActive) {
          return res.status(404).json({
            msg: "User not found with email.",
          });
        }
      } else {
        return res.status(404).json({
          msg: "User not found with email.",
        });
      }
      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        return res.status(401).json({ msg: "The password does not match." });
      }

      const token = generateAccessToken({ id: user._id });
      const refreshToken = generateRefreshToken({ id: user._id }, res);
      await UserModel.findByIdAndUpdate(user._id, {
        $set: { refreshToken },
      });

      res.status(201).json({
        token,
        user: { ...user._doc, password: "" },
      });
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },

  refreshToken: async (req: Request, res: Response) => {
    try {
      const cookie = req.cookies.refreshToken;
      if (!cookie) {
        return res.status(404).json({ msg: "No fresh token in the cookies." });
      }

      const decoded = <IDecodedToken>(
        jwt.verify(cookie, `${process.env.REFRESH_TOKEN_SECRET}`)
      );

      if (!decoded) {
        return res.status(400).json({ msg: "Invalid authentication!" });
      }
      const user = await UserModel.findById(decoded.id).select("+refreshToken");
      if (cookie !== user?.refreshToken) {
        return res.status(404).json({
          msg: "There is something wrong with refresh token",
        });
      }
      const token = generateAccessToken({ id: user?._id });
      const refreshToken = generateRefreshToken({ id: user?._id }, res);
      await UserModel.findByIdAndUpdate(
        user?._id,
        { $set: { refreshToken } },
        { new: true }
      );

      res.status(200).json({
        user: { ...user?._doc, refreshToken: "" },
        token,
      });
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },
  logout: async (req: IReqAuth, res: Response) => {
    try {
      await UserModel.findByIdAndUpdate(
        { _id: req.user?._id },
        { $set: { refreshToken: "" } },
        { new: true }
      );

      res.clearCookie("refreshToken", { path: "/api/v1/auth/refresh_token" });
      res.status(200).json({ msg: "Logged out." });
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },

  forgotPassword: async (req: Request, res: Response) => {
    const { email } = <IUser>req.body;
    try {
      const user = await UserModel.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({
          msg: "The account not found with email.",
        });
      }
      const access_token = generateForgotPasswordToken({ id: user._id });
      const url = `${CLIENT_URL}/reset-password/${access_token}`;
      sendMailToken(email, url, "Forgot password?");
      res
        .status(200)
        .json({ msg: `Sended link reset password. Please check ${email}` });
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },
  resetPassword: async (req: Request, res: Response) => {
    const { token, password } = req.body;
    try {
      const decoded = <IDecodedToken>(
        jwt.verify(token, `${process.env.FORGOT_PASSWORD_TOKEN_SECRET}`)
      );
      if (!decoded) {
        return res.status(400).json({ msg: "Invalid authentication!" });
      }
      const passwordHash = await bcrypt.hash(password, 12);

      const accessToken = generateAccessToken({ id: decoded.id });
      const refreshToken = generateRefreshToken({ id: decoded.id }, res);
      const user = await UserModel.findByIdAndUpdate(
        decoded.id,
        {
          $set: { password: passwordHash, refreshToken },
        },
        { new: true }
      );

      res.status(201).json({
        token: accessToken,
        user: { ...user?._doc, password: "", refreshToken: "" },
      });
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },
};

export default authCtrl;
