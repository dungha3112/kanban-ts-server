import mongoose from "mongoose";
import schemaOptions from "./modelOption";
import { IBoard } from "../configs/interface";

const boardSchema = new mongoose.Schema<IBoard>(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    icon: { type: String, default: "📰" },
    title: { type: String, default: "Untitled" },
    description: {
      type: String,
      default: ` Add description here
      ✔ You can add multiline description
      ✔ Let's start ... `,
    },
    position: { type: Number },
    favourite: { type: Boolean, default: false },
    favouritePosition: { type: Number, default: 0 },
  },
  schemaOptions
);

const BoardModel = mongoose.model<IBoard>("Board", boardSchema);
export default BoardModel;
