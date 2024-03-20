import { Request } from "express";
import { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  userName: string;
  password: string;

  isActive: boolean;

  otp: string;
  otpExpires: Date;

  refreshToken: string;
  _doc: any;
}

export interface INewUser extends Document {
  email: string;
  password: string;
}

export interface IDecodedToken {
  id: string;
  iat: number;
  exp: number;
  newUser?: INewUser;
}

export interface IBoard extends Document {
  user: IUser;
  icon: string;
  title: string;
  description: string;
  position: number;
  favourite: boolean;
  favouritePosition: number;
  _doc: any;
}

export interface ISection extends Document {
  board: IBoard;
  title: string;
  _doc: any;
}

export interface ITask extends Document {
  section: ISection;
  title: string;
  content: string;
  position: number;
  _doc: any;
}

export interface IReqAuth extends Request {
  user?: IUser;
}
