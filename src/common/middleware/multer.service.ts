import { Request, Response, NextFunction } from "express";
import multer from "multer";
import fs from "fs";
import { NODE_ENV } from "../config";
import { ObjectId } from "mongodb";
import { ACCEPTED_IMAGE_TYPES } from "../dtos";

const imageFilter = (_request: Request, file: Express.Multer.File, cb: any) => {
  // ---
  const isImage = ACCEPTED_IMAGE_TYPES.includes(file.mimetype);

  if (isImage) {
    cb(null, true);
  } else {
    cb(new Error("Not a valid image format!!"), false);
  }
};

export const multipleImagesMulterMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // ---
  const upload = multer({
    storage: multer.diskStorage({
      destination: function (_request, _file, cb) {
        // ---
        const path = `uploads_${NODE_ENV}`.toLowerCase();
        const doesPathExist = fs.existsSync(path);

        if (!doesPathExist) {
          fs.mkdirSync(path, { recursive: true });
        }

        cb(null, path);
      },
      filename: function (_req, file, cb) {
        // ---
        const extention = file.originalname.split(".");

        const prefix = new ObjectId().toString();

        const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${
          extention[extention.length - 1]
        }`;

        const newFileName = `${prefix}-${suffix}`;

        cb(null, newFileName);
      },
    }),

    limits: {
      // no larger than 50mb.
      fileSize: 50 * 1024 * 1024,
    },
    fileFilter: imageFilter,
  }).array("images", 3);

  upload(request, response, (err) => {
    if (err) {
      next({
        name: "VALIDATION_ERROR",
        message: `${err.message} ${err.field}`,
        cause: err.name,
      });
    }

    const multerFilesLength = request.files?.length as number;
    if (multerFilesLength < 1) {
      next({
        name: "VALIDATION_ERROR",
        message: "Images field cannot be empty",
        cause: "Multer upload",
      });
    }
    return next();
  });
};
