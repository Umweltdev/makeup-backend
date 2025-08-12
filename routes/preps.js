import express from "express";
import {
  createPrep,
  updatePrep,
  deletePrep,
  getPrep,
  getPreps,
} from "../controllers/prep.js";
import { verifyAdmin } from "../utils/verifyToken.js";


const router = express.Router();


router.post("/", verifyAdmin, createPrep)
router.put("/:id", verifyAdmin,  updatePrep);
router.delete("/:id", verifyAdmin, deletePrep);
router.get("/:id", verifyAdmin, getPrep);
router.get("/", verifyAdmin, getPreps);

export default router;