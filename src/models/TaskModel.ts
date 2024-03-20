import mongoose from "mongoose";
import schemaOptions from "./modelOption";
import { ITask } from "../configs/interface";

const taskSchema = new mongoose.Schema<ITask>(
  {
    section: { type: mongoose.Types.ObjectId, ref: "Section", required: true },
    title: { type: String, default: "Untitled" },
    content: { type: String, default: "" },
    position: {
      type: Number,
    },
  },
  schemaOptions
);

const TaskModel = mongoose.model<ITask>("Task", taskSchema);
export default TaskModel;
