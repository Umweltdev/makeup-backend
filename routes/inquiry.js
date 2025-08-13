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

const router = express.Router();

router.post("/", createInquiry);
router.get("/", getInquiries);
router.get("/:id", getInquiryById);
router.post("/:id/messages", addMessageToInquiry);
router.put("/:id/status", updateInquiryStatus);
router.post("/:id/communications", addCommunicationLog);
router.delete("/:id", deleteInquiry);

export default router;