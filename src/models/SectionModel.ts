import mongoose from "mongoose";
import schemaOptions from "./modelOption";
import { ISection } from "../configs/interface";

const sectionSchema = new mongoose.Schema<ISection>(
  {
    board: { type: mongoose.Types.ObjectId, ref: "Board", required: true },
    title: { type: String, default: "Untitled" },
  },
  schemaOptions
);

const SectionModel = mongoose.model<ISection>("Section", sectionSchema);
export default SectionModel;
