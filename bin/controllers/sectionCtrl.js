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
const SectionModel_1 = __importDefault(require("../models/SectionModel"));
const TaskModel_1 = __importDefault(require("../models/TaskModel"));
const BoardModel_1 = __importDefault(require("../models/BoardModel"));
const sectionCtrl = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { boardId } = req.params;
        try {
            const board = yield BoardModel_1.default.findById(boardId);
            if (!board)
                return res.status(404).json({ msg: "Board not found with id." });
            const section = yield SectionModel_1.default.create({ board: boardId });
            section._doc.tasks = [];
            res.status(201).json(section);
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
    updateSectionById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { sectionId } = req.params;
        const { title } = req.body;
        try {
            const section = yield SectionModel_1.default.findByIdAndUpdate(sectionId, {
                $set: { title: title },
            });
            if (!section)
                return res.status(404).json({ msg: "Section not found with id." });
            section._doc.tasks = [];
            res.status(201).json(section);
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
    deleteSectionById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { sectionId } = req.params;
        try {
            yield TaskModel_1.default.deleteMany({ section: sectionId });
            yield SectionModel_1.default.findByIdAndDelete(sectionId);
            res.status(201).json({ msg: "Deleted." });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
};
exports.default = sectionCtrl;
