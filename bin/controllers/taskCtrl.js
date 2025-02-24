"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TaskModel_1 = __importDefault(require("../models/TaskModel"));
const SectionModel_1 = __importDefault(require("../models/SectionModel"));
const taskCtrl = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { sectionId } = req.body;
        try {
            const section = yield SectionModel_1.default.findById(sectionId);
            if (!section)
                return res.status(404).json({
                    msg: "Section not found with sectionId.",
                });
            const tasksCount = yield TaskModel_1.default.find({ section: sectionId }).count();
            const task = yield TaskModel_1.default.create({
                section: sectionId,
                position: tasksCount > 0 ? tasksCount : 0,
            });
            task._doc.section = section;
            res.status(201).json(task);
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
    updateTaskById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { taskId } = req.params;
        try {
            const task = yield TaskModel_1.default.findByIdAndUpdate(taskId, {
                $set: req.body,
            });
            // if (!task)
            //   return res.status(404).json({ msg: "Task not found with task id." });
            res.status(200).json(task);
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
    deleteTaskById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { taskId } = req.params;
        try {
            const currentTask = yield TaskModel_1.default.findById(taskId);
            if (!currentTask)
                return res.status(404).json({ msg: "Task not found with task id." });
            yield TaskModel_1.default.findByIdAndDelete(taskId);
            const tasks = yield TaskModel_1.default.find({ section: currentTask.section }).sort("position");
            for (const key in tasks) {
                yield TaskModel_1.default.findByIdAndUpdate(tasks[key]._id, {
                    $set: { position: key },
                });
            }
            res.status(200).json({ msg: "Deleted." });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
    updatePosition: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { resourceList, destinationList, resourceSectionId, destinationSectionId, } = req.body;
        const resourceListReverse = resourceList.reverse();
        const destinationListReverse = destinationList.reverse();
        try {
            if (resourceSectionId !== destinationSectionId) {
                for (const key in resourceListReverse) {
                    yield TaskModel_1.default.findByIdAndUpdate(resourceListReverse[key]._id, {
                        $set: {
                            section: resourceSectionId,
                            position: key,
                        },
                    });
                }
            }
            for (const key in destinationListReverse) {
                yield TaskModel_1.default.findByIdAndUpdate(destinationListReverse[key]._id, {
                    $set: {
                        section: destinationSectionId,
                        position: key,
                    },
                });
            }
            res.status(200).json({ msg: "Updated." });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
};
exports.default = taskCtrl;
