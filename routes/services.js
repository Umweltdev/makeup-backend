import express from "express";
import {
  createService,
  updateService,
  getServices,
  getServiceById,
} from "../controllers/service.js";
import { verifyAdmin } from "../utils/verifyToken.js";
import { Multer, uploadImages } from "../middlewares/uploadFile.js";

const router = express.Router();
router.post("/", Multer.array("images"), uploadImages, verifyAdmin, createService);
router.put("/:id", Multer.array("images"), uploadImages, verifyAdmin, updateService);
router.get("/", getServices);
router.get("/:id", getServiceById);

export default router;