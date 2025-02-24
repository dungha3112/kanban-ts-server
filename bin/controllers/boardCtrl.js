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
const BoardModel_1 = __importDefault(require("../models/BoardModel"));
const SectionModel_1 = __importDefault(require("../models/SectionModel"));
const TaskModel_1 = __importDefault(require("../models/TaskModel"));
const boardCtrl = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const boardsCount = yield BoardModel_1.default.find().count();
            const board = yield BoardModel_1.default.create({
                user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
                position: boardsCount > 0 ? boardsCount : 0,
            });
            res.status(201).json(board);
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
    getAll: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            const boards = yield BoardModel_1.default.find({ user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id }).sort("-position");
            res.status(201).json(boards);
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
    updatePosition: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { boards } = req.body;
        try {
            for (const key in boards.reverse()) {
                const board = boards[key];
                yield BoardModel_1.default.findByIdAndUpdate(board._id, {
                    $set: { position: key },
                });
            }
            res.status(200).json({ msg: "Update" });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
    getBoardById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const { boardId } = req.params;
        try {
            const board = yield BoardModel_1.default.findOne({
                user: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id,
                _id: boardId,
            });
            if (!board)
                return res.status(404).json({ msg: "Board not found with boardId." });
            const sections = yield SectionModel_1.default.find({ board: boardId });
            for (const section of sections) {
                const tasks = yield TaskModel_1.default.find({ section: section._id })
                    .populate("section")
                    .sort("-position");
                section._doc.tasks = tasks;
            }
            board._doc.sections = sections;
            res.status(200).json(board);
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
    updateBoardById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        const { boardId } = req.params;
        const { title, description, favourite } = req.body;
        try {
            if (title === "")
                req.body.title = "Untitled";
            if (description === "")
                req.body.description = "Add description here.";
            const currentBoard = yield BoardModel_1.default.findById(boardId);
            if (!currentBoard)
                return res.status(404).json({ msg: "Board not found with boardId." });
            if (favourite !== undefined && currentBoard.favourite !== favourite) {
                const favourites = yield BoardModel_1.default.find({
                    user: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id,
                    favourite: true,
                    _id: { $ne: boardId },
                }).sort("favouritePosition");
                if (favourite) {
                    req.body.favouritePosition =
                        favourites.length > 0 ? favourites.length : 0;
                }
                else {
                    for (const key in favourites) {
                        const element = favourites[key];
                        yield BoardModel_1.default.findByIdAndUpdate(element._id, {
                            $set: { favouritePosition: key },
                        });
                    }
                }
            }
            const board = yield BoardModel_1.default.findByIdAndUpdate(boardId, {
                $set: req.body,
            });
            res.status(200).json(board);
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
    getFavourites: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _e;
        try {
            const favourites = yield BoardModel_1.default.find({
                user: (_e = req.user) === null || _e === void 0 ? void 0 : _e._id,
                favourite: true,
            }).sort("-favouritePosition");
            res.status(200).json(favourites);
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
    updateFavouritePosition: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { boards } = req.body;
        try {
            for (const key in boards.reverse()) {
                const board = boards[key];
                yield BoardModel_1.default.findByIdAndUpdate(board._id, {
                    $set: { favouritePosition: key },
                });
            }
            res.status(200).json({ msg: "Update" });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
    deleteBoardById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { boardId } = req.params;
        try {
            const sections = yield SectionModel_1.default.find({ board: boardId });
            for (const section of sections) {
                yield TaskModel_1.default.deleteMany({ section: section._id });
            }
            yield SectionModel_1.default.deleteMany({ board: boardId });
            const currentBoard = yield BoardModel_1.default.findById(boardId);
            if (!currentBoard)
                return res.status(404).json({ msg: "Board not found with boardId." });
            if (currentBoard.favourite) {
                const favourites = yield BoardModel_1.default.find({
                    user: currentBoard.user._id,
                    favourite: true,
                    _id: { $ne: boardId },
                }).sort("favouritePosition");
                for (const key in favourites) {
                    const element = favourites[key];
                    yield BoardModel_1.default.findByIdAndUpdate(element._id, {
                        $set: { favouritePosition: key },
                    });
                }
            }
            yield BoardModel_1.default.findByIdAndDelete(boardId);
            const boards = yield BoardModel_1.default.find().sort("position");
            for (const key in boards) {
                const board = boards[key];
                yield BoardModel_1.default.findByIdAndUpdate(board._id, {
                    $set: { position: key },
                });
            }
            res.status(200).json({ msg: "Deleted." });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }),
};
exports.default = boardCtrl;
