import { Response } from "express";
import { IBoard, IReqAuth } from "../configs/interface";
import BoardModel from "../models/BoardModel";
import SectionModel from "../models/SectionModel";
import TaskModel from "../models/TaskModel";

const boardCtrl = {
  create: async (req: IReqAuth, res: Response) => {
    try {
      const boardsCount = await BoardModel.find().count();
      const board = <IBoard>await BoardModel.create({
        user: req.user?._id,
        position: boardsCount > 0 ? boardsCount : 0,
      });
      res.status(201).json(board);
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },

  getAll: async (req: IReqAuth, res: Response) => {
    try {
      const boards = await BoardModel.find({ user: req.user?._id }).sort(
        "-position"
      );

      res.status(201).json(boards);
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },
  updatePosition: async (req: IReqAuth, res: Response) => {
    const { boards } = req.body;
    try {
      for (const key in boards.reverse()) {
        const board = boards[key];
        await BoardModel.findByIdAndUpdate(board._id, {
          $set: { position: key },
        });
      }
      res.status(200).json({ msg: "Update" });
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },

  getBoardById: async (req: IReqAuth, res: Response) => {
    const { boardId } = req.params;
    try {
      const board = await BoardModel.findOne({
        user: req.user?._id,
        _id: boardId,
      });
      if (!board)
        return res.status(404).json({ msg: "Board not found with boardId." });

      const sections = await SectionModel.find({ board: boardId });
      for (const section of sections) {
        const tasks = await TaskModel.find({ section: section._id })
          .populate("section")
          .sort("-position");
        section._doc.tasks = tasks;
      }
      board._doc.sections = sections;

      res.status(200).json(board);
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },

  updateBoardById: async (req: IReqAuth, res: Response) => {
    const { boardId } = req.params;
    const { title, description, favourite } = <IBoard>req.body;
    try {
      if (title === "") req.body.title = "Untitled";
      if (description === "") req.body.description = "Add description here.";

      const currentBoard = await BoardModel.findById(boardId);
      if (!currentBoard)
        return res.status(404).json({ msg: "Board not found with boardId." });

      if (favourite !== undefined && currentBoard.favourite !== favourite) {
        const favourites = await BoardModel.find({
          user: req.user?._id,
          favourite: true,
          _id: { $ne: boardId },
        }).sort("favouritePosition");

        if (favourite) {
          req.body.favouritePosition =
            favourites.length > 0 ? favourites.length : 0;
        } else {
          for (const key in favourites) {
            const element = favourites[key];
            await BoardModel.findByIdAndUpdate(element._id, {
              $set: { favouritePosition: key },
            });
          }
        }
      }
      const board = await BoardModel.findByIdAndUpdate(boardId, {
        $set: req.body,
      });
      res.status(200).json(board);
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },

  getFavourites: async (req: IReqAuth, res: Response) => {
    try {
      const favourites = await BoardModel.find({
        user: req.user?._id,
        favourite: true,
      }).sort("-favouritePosition");

      res.status(200).json(favourites);
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },
  updateFavouritePosition: async (req: IReqAuth, res: Response) => {
    const { boards } = req.body;
    try {
      for (const key in boards.reverse()) {
        const board = boards[key];
        await BoardModel.findByIdAndUpdate(board._id, {
          $set: { favouritePosition: key },
        });
      }
      res.status(200).json({ msg: "Update" });
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },
  deleteBoardById: async (req: IReqAuth, res: Response) => {
    const { boardId } = req.params;
    try {
      const sections = await SectionModel.find({ board: boardId });
      for (const section of sections) {
        await TaskModel.deleteMany({ section: section._id });
      }
      await SectionModel.deleteMany({ board: boardId });

      const currentBoard = await BoardModel.findById(boardId);
      if (!currentBoard)
        return res.status(404).json({ msg: "Board not found with boardId." });

      if (currentBoard.favourite) {
        const favourites = await BoardModel.find({
          user: currentBoard.user._id,
          favourite: true,
          _id: { $ne: boardId },
        }).sort("favouritePosition");

        for (const key in favourites) {
          const element = favourites[key];
          await BoardModel.findByIdAndUpdate(element._id, {
            $set: { favouritePosition: key },
          });
        }
      }
      await BoardModel.findByIdAndDelete(boardId);

      const boards = await BoardModel.find().sort("position");
      for (const key in boards) {
        const board = boards[key];
        await BoardModel.findByIdAndUpdate(board._id, {
          $set: { position: key },
        });
      }

      res.status(200).json({ msg: "Deleted." });
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },
};

export default boardCtrl;
