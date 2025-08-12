import express from "express";
import {
  createInvoice,
  getInvoices,
  getInvoice,
  deleteInvoice,
  updateInvoice
} from "../controllers/invoice.js";
import { verifyAdmin, verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createInvoice);
router.get("/",  getInvoices);
router.get("/:id", getInvoice);
router.put("/:id", verifyAdmin, updateInvoice);
router.delete("/:id", verifyAdmin, deleteInvoice);



export default router;
