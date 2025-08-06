import multer from "multer";
import { cloudinaryUploadImg } from "../utils/cloudinary.js";

const storage = multer.diskStorage({});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

export const Multer = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 5000000 },
});

export const uploadImages = async (req, res, next) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "hotel-romax");
    const urls = [];
    if (req.files && Array.isArray(req.files)) {
      // Multiple files
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newpath = await uploader(path);
        urls.push(newpath);
        req.images = urls;
      }
    } else if (req.file) {
      const { path } = req.file;
      const newpath = await uploader(path);
      req.image = newpath;
    }
    next();
  } catch (error) {
    next(error);

  }
};

//     const images = urls.map((file) => {
//       return file;
//     });
//     req.images = images;
