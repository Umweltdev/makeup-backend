import express from "express";
import {
  createCarousel,
  updateCarousel,
  getCarousels,
  getCarouselById,
} from "../controllers/carousel.js";
import { verifyAdmin } from "../utils/verifyToken.js";
import { Multer, uploadImages } from "../middlewares/uploadFile.js";

const router = express.Router();
router.post("/", Multer.array("images"), uploadImages, verifyAdmin, createCarousel);
router.put("/:id", Multer.array("images"), uploadImages, verifyAdmin, updateCarousel);
router.get("/", getCarousels);
router.get("/:id", getCarouselById);

export default router;