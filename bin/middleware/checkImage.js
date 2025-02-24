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
exports.imgResize = exports.uploadImages = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./upload/");
    },
    filename: (req, file, cb) => {
        const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        return cb(null, `${file.fieldname}_${uniquesuffix}${path_1.default.extname(file.originalname)}`);
    },
});
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    }
    else {
        cb({ msg: "Unsupported file format" }, false);
    }
};
const uploadImages = (0, multer_1.default)({
    storage: storage,
    fileFilter: multerFilter,
    limits: { fileSize: 1000000 },
});
exports.uploadImages = uploadImages;
const imgResize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files)
        return next();
    yield Promise.all(req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, sharp_1.default)(file.path)
            .resize(300, 300)
            .toFormat("jpeg" || "png" || "jpeg" || "webp")
            .jpeg({ quality: 90 })
            .toFile(`./upload/${file.filename}`);
        fs_1.default.unlinkSync(`./upload/${file.filename}`);
    })));
    next();
});
exports.imgResize = imgResize;
