import { Response } from "express";
import { IReqAuth } from "../configs/interface";
import SectionModel from "../models/SectionModel";
import TaskModel from "../models/TaskModel";
import BoardModel from "../models/BoardModel";

const sectionCtrl = {
  create: async (req: IReqAuth, res: Response) => {
    const { boardId } = req.params;
    try {
      const board = await BoardModel.findById(boardId);
      if (!board)
        return res.status(404).json({ msg: "Board not found with id." });

      const section = await SectionModel.create({ board: boardId });

      section._doc.tasks = [];
      res.status(201).json(section);
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },
  updateSectionById: async (req: IReqAuth, res: Response) => {
    const { sectionId } = req.params;
    const { title } = req.body;
    try {
      const section = await SectionModel.findByIdAndUpdate(sectionId, {
        $set: { title: title },
      });
      if (!section)
        return res.status(404).json({ msg: "Section not found with id." });

      section._doc.tasks = [];
      res.status(201).json(section);
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },
  deleteSectionById: async (req: IReqAuth, res: Response) => {
    const { sectionId } = req.params;
    try {
      await TaskModel.deleteMany({ section: sectionId });
      await SectionModel.findByIdAndDelete(sectionId);

      res.status(201).json({ msg: "Deleted." });
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },
};

export default sectionCtrl;
