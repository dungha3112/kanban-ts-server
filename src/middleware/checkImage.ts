import multer from "multer";
import path from "path";
import sharp from "sharp";
import fs from "fs";
import { NextFunction, Request, Response } from "express";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload/");
  },
  filename: (req, file, cb) => {
    const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    return cb(
      null,
      `${file.fieldname}_${uniquesuffix}${path.extname(file.originalname)}`
    );
  },
});

const multerFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ msg: "Unsupported file format" }, false);
  }
};

const uploadImages = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

const imgResize = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.files) return next();
  await Promise.all(
    (req.files as any).map(async (file: any) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg" || "png" || "jpeg" || "webp")
        .jpeg({ quality: 90 })
        .toFile(`./upload/${file.filename}`);
      fs.unlinkSync(`./upload/${file.filename}`);
    })
  );
  next();
};

export { uploadImages, imgResize };
