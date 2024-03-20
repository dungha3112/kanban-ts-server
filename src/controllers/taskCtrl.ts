import { Response } from "express";
import { IReqAuth, ITask } from "../configs/interface";
import TaskModel from "../models/TaskModel";
import SectionModel from "../models/SectionModel";

const taskCtrl = {
  create: async (req: IReqAuth, res: Response) => {
    const { sectionId } = req.body;
    try {
      const section = await SectionModel.findById(sectionId);
      if (!section)
        return res.status(404).json({
          msg: "Section not found with sectionId.",
        });
      const tasksCount = await TaskModel.find({ section: sectionId }).count();
      const task = await TaskModel.create({
        section: sectionId,
        position: tasksCount > 0 ? tasksCount : 0,
      });
      task._doc.section = section;

      res.status(201).json(task);
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },
  updateTaskById: async (req: IReqAuth, res: Response) => {
    const { taskId } = req.params;
    try {
      const task = await TaskModel.findByIdAndUpdate(taskId, {
        $set: req.body,
      });
      // if (!task)
      //   return res.status(404).json({ msg: "Task not found with task id." });

      res.status(200).json(task);
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },
  deleteTaskById: async (req: IReqAuth, res: Response) => {
    const { taskId } = req.params;
    try {
      const currentTask = await TaskModel.findById(taskId);
      if (!currentTask)
        return res.status(404).json({ msg: "Task not found with task id." });
      await TaskModel.findByIdAndDelete(taskId);

      const tasks = await TaskModel.find({ section: currentTask.section }).sort(
        "position"
      );

      for (const key in tasks) {
        await TaskModel.findByIdAndUpdate(tasks[key]._id, {
          $set: { position: key },
        });
      }

      res.status(200).json({ msg: "Deleted." });
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },
  updatePosition: async (req: IReqAuth, res: Response) => {
    const {
      resourceList,
      destinationList,
      resourceSectionId,
      destinationSectionId,
    } = req.body;
    const resourceListReverse = resourceList.reverse();
    const destinationListReverse = destinationList.reverse();
    try {
      if (resourceSectionId !== destinationSectionId) {
        for (const key in resourceListReverse) {
          await TaskModel.findByIdAndUpdate(resourceListReverse[key]._id, {
            $set: {
              section: resourceSectionId,
              position: key,
            },
          });
        }
      }

      for (const key in destinationListReverse) {
        await TaskModel.findByIdAndUpdate(destinationListReverse[key]._id, {
          $set: {
            section: destinationSectionId,
            position: key,
          },
        });
      }

      res.status(200).json({ msg: "Updated." });
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  },
};

export default taskCtrl;
