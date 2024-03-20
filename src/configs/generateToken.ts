import { Response } from "express";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";

export const generateOTP = () => {
  return otpGenerator.generate(8, {
    specialChars: false,
  });
};

export const generateForgotPasswordToken = (payload: object) => {
  return jwt.sign(payload, `${process.env.FORGOT_PASSWORD_TOKEN_SECRET}`, {
    expiresIn: "10m",
  });
};

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, `${process.env.ACCESS_TOKEN_SECRET}`, {
    expiresIn: "24h",
  });
};

export const generateRefreshToken = (payload: object, res: Response) => {
  const refresh_token = jwt.sign(
    payload,
    `${process.env.REFRESH_TOKEN_SECRET}`,
    { expiresIn: "24h" }
  );
  res.cookie("refreshToken", refresh_token, {
    httpOnly: true,
    path: "/api/v1/auth/refresh_token",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: true,
    sameSite: "none",
  });

  return refresh_token;
};
