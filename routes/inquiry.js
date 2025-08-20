import express from "express";
import {
  createInquiry,
  getInquiries,
  getInquiryById,
  addMessageToInquiry,
  updateInquiryStatus,
  addCommunicationLog,
  deleteInquiry,
} from "../controllers/inquiry.js";
import { verifyAdmin, verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createInquiry);
router.get("/", verifyToken, getInquiries);
router.get("/:id", verifyToken, getInquiryById);
router.post("/:id/messages", verifyToken, addMessageToInquiry);
router.put("/:id/status", verifyAdmin, updateInquiryStatus);
router.post("/:id/communications", verifyToken, addCommunicationLog);
router.delete("/:id", verifyAdmin, deleteInquiry);

export default router;